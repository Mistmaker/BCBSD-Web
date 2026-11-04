import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  AlertComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective,
  RowComponent
} from '@coreui/angular';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import {
  ParteCausaDetalle,
  ParteFallecidoDetalle,
  ParteModel,
  PartePersonaAsistidaDetalle,
  PartePersonalDetalle,
  ParteRecursoDetalle,
  ParteTipoAuxilioDetalle,
  ParteVehiculoDetalle,
  ParteVictimaDetalle
} from '../models/partes.model';
import { ParteService } from '../services/parte.service';
import { EstacionesModel } from '../../subjefatura/models/estadisticas.model';
import { PersonalModel } from '../../tthh/models/personal.model';
import { IntervencionesService } from '../../subjefatura/services/intervenciones.service';
import { PersonalService } from '../../tthh/services/personal.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-parte-mantenimiento',
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
    FormSelectDirective,
    AlertComponent,
    NgSelectComponent,
    NgLabelTemplateDirective,
    NgOptionTemplateDirective
  ],
  templateUrl: './parte-mantenimiento.component.html',
  styleUrl: './parte-mantenimiento.component.scss'
})
export class ParteMantenimientoComponent implements OnInit, AfterViewInit, OnDestroy {
  parte = new ParteModel();
  errorMessage = '';
  customStylesValidated = false;
  isLoading = false;
  isSaving = false;
  estaciones: EstacionesModel[] = [];
  personal: PersonalModel[] = [];
  recursoBloques: { titulo: string; lista: ParteRecursoDetalle[]; prefijo: string }[] = [];
  private map?: L.Map;
  private marker?: L.Marker;

  readonly tiposDia = ['LABORABLE', 'FIN DE SEMANA', 'FESTIVO', 'ESTADO DE EMERGENCIA'];
  readonly formasAviso = ['CABINA DE RADIO', 'ECU-911', 'TELEFONO', 'PERSONAL', 'OTRO'];
  readonly tiposParte = ['AUXILIO', 'INCENDIO', 'RESCATE', 'MATERIALES PELIGROSOS', 'OTRO'];
  readonly rolesPersonal = ['PERSONA AL MANDO DE LA EMERGENCIA', 'PERSONAL DE APH', 'PERSONAL OPERATIVO'];
  readonly tiposApoyo = ['APOYO INTERNO', 'APOYO EXTERNO'];
  readonly tiposIdentificacion = ['CÉDULA', 'PASAPORTE', 'OTRO'];
  readonly tiposTraslado = ['H. PÚBLICO', 'H. PRIVADO', 'SIN TRASLADO'];
  readonly sexos = ['F', 'M', 'OTRO'];

  constructor(
    private parteService: ParteService,
    private personalService: PersonalService,
    private intervencionesService: IntervencionesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.configurarBloquesRecursos();
    this.cargarCatalogos();

    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId && routeId !== 'nuevo') {
      const id = Number(routeId);
      if (!Number.isInteger(id) || id <= 0) {
        this.errorMessage = 'El identificador del parte no es válido.';
        return;
      }

      this.isLoading = true;
      this.parteService.getById(id).subscribe({
        next: (data) => {
          this.parte = Object.assign(new ParteModel(), data);
          this.normalizarDetalles();
          this.updateMarkerFromCoordinates();
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = `No se pudo cargar el parte. ${error.message}`;
          this.isLoading = false;
        }
      });
    }
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

  private cargarCatalogos(): void {
    this.personalService.getAll().subscribe({
      next: (data) => this.personal = data,
      error: (error) => {
        console.error(error);
        this.errorMessage = `No se pudo cargar el personal. ${error.message}`;
      }
    });

    this.intervencionesService.getEstaciones().subscribe({
      next: (data) => this.estaciones = data,
      error: (error) => {
        console.error(error);
        this.errorMessage = `No se pudieron cargar las estaciones. ${error.message}`;
      }
    });
  }

  private normalizarDetalles(): void {
    this.parte.personal = this.parte.personal ?? [];
    this.parte.vehiculos = this.parte.vehiculos ?? [];
    this.parte.tipos_auxilio = this.parte.tipos_auxilio ?? [];
    this.parte.causas = this.parte.causas ?? [];
    this.parte.equipos_herramientas = this.parte.equipos_herramientas ?? [];
    this.parte.materiales_descartables = this.parte.materiales_descartables ?? [];
    this.parte.insumos = this.parte.insumos ?? [];
    this.parte.personas_asistidas = this.parte.personas_asistidas ?? [];
    this.parte.victimas = this.parte.victimas ?? [];
    this.parte.fallecidos = this.parte.fallecidos ?? [];
    this.configurarBloquesRecursos();
  }

  private configurarBloquesRecursos(): void {
    this.recursoBloques = [
      { titulo: 'Equipos y herramientas', lista: this.parte.equipos_herramientas, prefijo: 'equipo' },
      { titulo: 'Material descartable MATPEL', lista: this.parte.materiales_descartables, prefijo: 'material' },
      { titulo: 'Insumos', lista: this.parte.insumos, prefijo: 'insumo' }
    ];
  }

  private initMap(): void {
    const initialPosition = this.getCoordinates();
    const center: L.LatLngExpression = initialPosition ?? [-0.269, -79.182];

    this.map = L.map('parte-map').setView(center, initialPosition ? 16 : 15);
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
    const latitude = (this.parte.parte_latitud ?? '').trim();
    const longitude = (this.parte.parte_longitud ?? '').trim();
    if (!latitude || !longitude) {
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
    this.parte.parte_latitud = lat.toString();
    this.parte.parte_longitud = lng.toString();
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
          this.parte.parte_latitud = position.lat.toString();
          this.parte.parte_longitud = position.lng.toString();
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
      ?.bindPopup(`Latitud: ${lat.toFixed(6)}<br>Longitud: ${lng.toFixed(6)}`)
      .openPopup();
  }

  agregarPersonal(): void {
    this.parte.personal.push(new PartePersonalDetalle());
  }

  agregarVehiculo(): void {
    this.parte.vehiculos.push(new ParteVehiculoDetalle());
  }

  agregarTipoAuxilio(): void {
    this.parte.tipos_auxilio.push(new ParteTipoAuxilioDetalle());
  }

  agregarCausa(): void {
    this.parte.causas.push(new ParteCausaDetalle());
  }

  agregarRecurso(detalles: ParteRecursoDetalle[]): void {
    detalles.push(new ParteRecursoDetalle());
  }

  agregarPersonaAsistida(): void {
    this.parte.personas_asistidas.push(new PartePersonaAsistidaDetalle());
  }

  agregarVictima(): void {
    this.parte.victimas.push(new ParteVictimaDetalle());
  }

  agregarFallecido(): void {
    this.parte.fallecidos.push(new ParteFallecidoDetalle());
  }

  quitarDetalle<T>(detalles: T[], index: number): void {
    detalles.splice(index, 1);
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
    const request = this.parte.parte_id
      ? this.parteService.update(this.parte)
      : this.parteService.save(this.parte);

    request.subscribe({
      next: (response) => {
        this.isSaving = false;
        Swal.fire('Listo', response.msg ?? 'El parte se guardó correctamente.', 'success')
          .then(() => this.router.navigate(['../'], { relativeTo: this.route }));
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = `No se pudo guardar el parte. ${error.message}`;
        this.isSaving = false;
        Swal.fire('Error', this.errorMessage, 'error');
      }
    });
  }
}
