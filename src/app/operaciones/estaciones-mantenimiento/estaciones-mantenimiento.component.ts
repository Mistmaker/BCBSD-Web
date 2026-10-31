import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, FormDirective, FormFeedbackComponent, FormLabelDirective, InputGroupComponent, InputGroupTextDirective, RowComponent } from '@coreui/angular';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { EstacionesModel } from '../models/estaciones.model';
import { EstacionesService } from '../services/estaciones.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-estaciones-mantenimiento',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    FormFeedbackComponent,
    InputGroupComponent,
    InputGroupTextDirective
  ],
  templateUrl: './estaciones-mantenimiento.component.html',
  styleUrl: './estaciones-mantenimiento.component.scss'
})
export class EstacionesMantenimientoComponent implements OnInit, AfterViewInit, OnDestroy {
  estacion = new EstacionesModel();
  customStylesValidated = false;
  errorMessage = '';
  isEditing = false;
  isLoading = false;
  isSaving = false;
  private map?: L.Map;
  private marker?: L.Marker;

  constructor(
    private estacionesService: EstacionesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === null || id === 'nuevo') {
      return;
    }

    const estacionId = Number(id);
    if (!Number.isInteger(estacionId) || estacionId <= 0) {
      this.errorMessage = 'El identificador de la estación no es válido.';
      return;
    }

    this.isEditing = true;
    this.isLoading = true;
    this.estacionesService.getById(estacionId).subscribe({
      next: (data) => {
        this.estacion = data;
        this.isLoading = false;
        this.updateMarkerFromCoordinates();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'No se pudo cargar la estación.';
        this.isLoading = false;
        Swal.fire('Error', `${this.errorMessage} ${error.message}`, 'error');
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  onCoordinatesChanged(): void {
    this.updateMarkerFromCoordinates();
  }

  onSubmit(form: NgForm): void {
    this.customStylesValidated = true;
    this.errorMessage = '';

    if (form.invalid || this.isLoading || this.isSaving) {
      if (form.invalid) {
        Swal.fire('Atención', 'Revise los campos requeridos antes de guardar.', 'warning');
      }
      return;
    }

    this.isSaving = true;
    const request = this.isEditing
      ? this.estacionesService.update(this.estacion)
      : this.estacionesService.save(this.estacion);

    request.subscribe({
      next: (data) => {
        Swal.fire('Listo', data.msg, 'success').then(() => {
          this.router.navigate(['../'], { relativeTo: this.route });
        });
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = error.message;
        this.isSaving = false;
        Swal.fire('Error', `No se pudo guardar la estación. ${error.message}`, 'error');
      }
    });
  }

  private initMap(): void {
    const initialPosition = this.getCoordinates();
    const center: L.LatLngExpression = initialPosition ?? [-0.269, -79.182];

    this.map = L.map('station-map').setView(center, initialPosition ? 16 : 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.setCoordinates(event.latlng.lat, event.latlng.lng);
    });

    if (initialPosition) {
      this.setMarker(initialPosition.lat, initialPosition.lng);
    }
  }

  private updateMarkerFromCoordinates(): void {
    const coordinates = this.getCoordinates();
    if (!this.map) {
      return;
    }

    if (!coordinates) {
      this.marker?.remove();
      this.marker = undefined;
      return;
    }

    this.map.setView([coordinates.lat, coordinates.lng], 16);
    this.setMarker(coordinates.lat, coordinates.lng);
  }

  private getCoordinates(): { lat: number; lng: number } | null {
    const latitude = this.estacion.estacion_ubicacion_x.trim();
    const longitude = this.estacion.estacion_ubicacion_y.trim();
    if (
      !latitude ||
      !longitude
    ) {
      return null;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return null;
    }

    return { lat, lng };
  }

  private setCoordinates(lat: number, lng: number): void {
    this.estacion.estacion_ubicacion_x = lat.toString();
    this.estacion.estacion_ubicacion_y = lng.toString();
    this.setMarker(lat, lng);
  }

  private setMarker(lat: number, lng: number): void {
    if (!this.map) {
      return;
    }

    if (!this.marker) {
      this.marker = L.marker([lat, lng], {
        draggable: true,
        icon: L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(this.map);

      this.marker.on('dragend', () => {
        const position = this.marker?.getLatLng();
        if (position) {
          this.estacion.estacion_ubicacion_x = position.lat.toString();
          this.estacion.estacion_ubicacion_y = position.lng.toString();
          this.updateMarkerPopup(position.lat, position.lng);
        }
      });
    } else {
      this.marker.setLatLng([lat, lng]);
    }

    this.updateMarkerPopup(lat, lng);
  }

  private updateMarkerPopup(lat: number, lng: number): void {
    this.marker
      ?.bindPopup(`Latitud (X): ${lat.toFixed(6)}<br>Longitud (Y): ${lng.toFixed(6)}`)
      .openPopup();
  }
}
