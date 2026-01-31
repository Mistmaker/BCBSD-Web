import { IntervencionesService } from './../services/intervenciones.service';
import { CausasModel, EstacionesModel, IntervencionesModel, NaturalezasModel, TipoEmergenciaModel, TipoIncidenciaModel } from './../models/estadisticas.model';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';

import {
  BorderDirective,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardGroupComponent,
  CardHeaderComponent,
  CardImgDirective,
  CardLinkDirective,
  CardSubtitleDirective,
  CardTextDirective,
  CardTitleDirective,
  ColComponent,
  GutterDirective,
  ListGroupDirective,
  ListGroupItemDirective,
  RowComponent,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,AlertComponent, AlertLinkDirective 
} from '@coreui/angular';

import Swal from 'sweetalert2';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { VehiculosModel } from '../../administrativo/models/vehiculos.model';
import { PersonalModel } from '../../tthh/models/personal.model';
import { PersonalService } from '../../tthh/services/personal.service';
import { AuthService } from '../../auth/auth.service';
import { OrdenesMovilizacionService } from '../../administrativo/services/ordenes-movilizacion.service';

import * as L from 'leaflet';



@Component({
  selector: 'app-intervenciones-mantenimiento',
  imports: [NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, ReactiveFormsModule, FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent,
    TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, AlertComponent, AlertLinkDirective 
  ],
  templateUrl: './intervenciones-mantenimiento.component.html',
  styleUrl: './intervenciones-mantenimiento.component.scss'
})
export class IntervencionesMantenimientoComponent implements OnInit {

  intervencion: IntervencionesModel = new IntervencionesModel();
  emergencias: TipoEmergenciaModel[] = [];
  vehiculos: VehiculosModel[] = [];
  personal: PersonalModel[] = [];
  causas: CausasModel[] = [];
  naturalezas: NaturalezasModel[] = [];
  tiposIncidencias: TipoIncidenciaModel[] = [];
  estaciones: EstacionesModel[] = [];
  provincias: any[] = [];
  cantones: any[] = [];
  parroquias: any[] = [];

  provincia_id!: number;
  canton_id!: number;

  // conductores: PersonalModel[] = [];
  errorMessage: string = '';
  customStylesValidated = false;
  browserDefaultsValidated = false;
  tooltipValidated = false;

  Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 7000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  constructor(private _intervencionesService: IntervencionesService, private _ordenesMovilizacionService: OrdenesMovilizacionService, private _personalService: PersonalService, private _authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // this.cargarDatos();
    const routeStr = this.route.snapshot.paramMap.get('id');
    if (routeStr !== 'nuevo' && routeStr !== null) {
      this._intervencionesService.getById(+routeStr).subscribe({
        next: (data) => {
          this.intervencion = data;
        },
        error: (e) => {
          console.error(e);
          Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
        },
        complete: () => console.info('complete')
      })
    }

    //Obteniendo vehiculos
    this._ordenesMovilizacionService.getVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });

    // Obteniendo personal (solicitantes)
    this._personalService.getAll().subscribe({
      next: (data) => {
        this.personal = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    })

    //Obteniendo estaciones
    this._intervencionesService.getEstaciones().subscribe({
      next: (data) => {
        this.estaciones = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });

    //Obteniendo causas
    this._intervencionesService.getCausas().subscribe({
      next: (data) => {
        this.causas = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });

    //Obteniendo naturalezas
    this._intervencionesService.getNaturalezas().subscribe({
      next: (data) => {
        this.naturalezas = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });

    //Obteniendo tipos incidencias
    this._intervencionesService.getTiposIncidencias().subscribe({
      next: (data) => {
        this.tiposIncidencias = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });

    //Obteniendo provincias
    this._intervencionesService.getProvincias().subscribe({
      next: (data) => {
        this.provincias = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });

    this.initMap();
  }

  buscarCantones(idProvincia: number) {
    //Obteniendo cantones
    this._intervencionesService.getCantones(idProvincia).subscribe({
      next: (data) => {
        this.cantones = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });
  }

  buscarParroquias(idCanton: number) {
    //Obteniendo cantones
    this._intervencionesService.getParroquias(idCanton).subscribe({
      next: (data) => {
        this.parroquias = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });
  }

  obtenerDependientes(id_tipo: number) {
    //Obteniendo tipos incidencias
    this._intervencionesService.getEmergenciasByTipo(id_tipo).subscribe({
      next: (data) => {
        this.emergencias = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });
    this._intervencionesService.getCausasByTipo(id_tipo).subscribe({
      next: (data) => {
        this.causas = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });
    this._intervencionesService.getNaturalezasByTipo(id_tipo).subscribe({
      next: (data) => {
        this.naturalezas = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });
  }

  onSubmit(form: NgForm) {
    this.customStylesValidated = true;
    if (form.invalid) { Swal.fire('Atencion', 'Algunos campos están incorrectos o vacios, por favor revise e intente nuevamente', 'warning'); return; }
    console.log('Submit... 1', form);
    // this.intervencion.fk_usuario_id = this._authService.getUsuario()['usuario']['usuario_id'];
    console.log(this.intervencion);
    this._intervencionesService.save(this.intervencion).subscribe({
      next: (data) => {
        console.log(data)
        Swal.fire('Listo', data.msg, 'success')
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
        this.Toast.fire({
          icon: 'error',
          title: e.error.error + '<br>' + e.error.msg
        });
      },
      complete: () => console.info('complete')
    })
  }

  onReset1() {
    this.customStylesValidated = false;
    this.intervencion = new IntervencionesModel();
    console.log('Reset... 1');
  }

  private initMap(): void {
    this.map = L.map('map').setView([-0.269, -79.182], 15); // Example coordinates and zoom
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map!);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      // Guarda coordenadas
      this.intervencion.intervencion_latitud = lat.toString();
      this.intervencion.intervencion_longitud = lng.toString();

      // Si ya hay marcador, lo movemos
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        // Si no hay, creamos uno nuevo
        this.marker = L.marker([lat, lng], {
          draggable: true, // para que el usuario pueda ajustarlo si quiere
          icon: L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).addTo(this.map!);

        // Muestra coordenadas en el popup
        this.marker.bindPopup(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`).openPopup();

        // Actualiza coordenadas si se mueve el marcador
        this.marker.on('dragend', (event) => {
          const position = (event.target as L.Marker).getLatLng();
          this.intervencion.intervencion_latitud = position.lat.toString();
          this.intervencion.intervencion_longitud = position.lng.toString();
          this.marker?.setPopupContent(`Lat: ${position.lat.toFixed(6)}, Lng: ${position.lng.toFixed(6)}`).openPopup();
        });
      }

      console.log(`📍 Coordenadas seleccionadas: X=${this.intervencion.intervencion_latitud}, Y=${this.intervencion.intervencion_longitud}`);
    });
  }

}
