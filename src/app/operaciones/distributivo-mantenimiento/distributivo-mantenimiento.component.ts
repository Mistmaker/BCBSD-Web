import { IntervencionesService } from './../../subjefatura/services/intervenciones.service';
import { PersonalService } from './../../tthh/services/personal.service';
import { EstacionesModel } from './../../subjefatura/models/estadisticas.model';
import { PersonalModel } from './../../tthh/models/personal.model';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import {
  AlertComponent,
  AlertHeadingDirective,
  BorderDirective,
  ButtonDirective,
  ButtonCloseDirective,
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
  TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,
  TableDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
} from '@coreui/angular';
import Swal from 'sweetalert2';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { DistributivoService } from '../services/distributivo.service';

import { DistributivoModel } from './../models/distributivo.model';
;

@Component({
  selector: 'app-distributivo-mantenimiento',
  imports: [NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, ReactiveFormsModule, FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent,
    TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, AlertComponent,
    AlertHeadingDirective,
    TableDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    ButtonCloseDirective,
  ],
  templateUrl: './distributivo-mantenimiento.component.html',
  styleUrl: './distributivo-mantenimiento.component.scss'
})
export class DistributivoMantenimientoComponent {

  distributivo: DistributivoModel = new DistributivoModel();
  personal: PersonalModel[] = [];
  estaciones: EstacionesModel[] = [];
  cargoEstaciones: any[] = [
    "ENCARGADO DE ESTACION",
    "RESPONSABLE DE GUARDIA",
    "SUBALTERNO DE GUARDIA",
    "RESPONSABLE DE EQUIPOS DE RESCATE",
    "OPERADOR",
    "APOYO A EMERGENCIAS",
    "ATENCION PREHOSPITALARIA",
    "ASISTENTE PREHOSPITALARIA",
    "APOYO DE SUBJEFATURA DE BOMBEROS",
    "APOYO CAPACITACION EN PREVENCION Y PRIMEROS AUXILIOS",
    "ECU-911 CONSOLA DE DESPACHO Y APOYO A EMERGENCIAS",
  ];

  cargosApoyos: any[] = [];
  tmpGrupoSeleccionado = 0; //variable temporal para seleccion de personal
  tmpCargoSeleccionado = ''; //variable temporal para seleccion de personal
  tmpPersonalSelccionado=0; //variable temporal para seleccion de personal

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

  constructor(private _distributivoService: DistributivoService, private _personalService: PersonalService, private _intervencionesService: IntervencionesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // this.cargarDatos();
    const routeStr = this.route.snapshot.paramMap.get('id');
    if (routeStr !== 'nuevo' && routeStr !== null) {
      this._distributivoService.getById(+routeStr).subscribe({
        next: (data) => {
          this.distributivo = data;
          this._distributivoService.getPelotones(+routeStr).subscribe({
            next: (data) => {
              this.distributivo.grupos = data;
            },
            error: (e) => {
              console.error(e);
              Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
            },
            complete: () => console.info('complete')
          })
        },
        error: (e) => {
          console.error(e);
          Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
        },
        complete: () => console.info('complete')
      })
    }

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

  }

  seleccionarGrupo(idGrupo: number){
    this.tmpGrupoSeleccionado = idGrupo;
  }

  agregarPersonal(personal: PersonalModel){

  }

  onSubmit(form: NgForm) {
    this.customStylesValidated = true;
    if (form.invalid) { Swal.fire('Atencion', 'Algunos campos están incorrectos o vacios, por favor revise e intente nuevamente', 'warning'); return; }
    console.log('Submit... 1', form);
    // this.intervencion.fk_usuario_id = this._authService.getUsuario()['usuario']['usuario_id'];
    console.log(this.distributivo);
    this._distributivoService.save(this.distributivo).subscribe({
      next: (data) => {
        console.log(data)
        this.distributivo.distributivo_id = data.id;
        Swal.fire('Listo', data.msg, 'success')
        // this.router.navigate(['../'], { relativeTo: this.route });
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
    this.distributivo = new DistributivoModel();
    console.log('Reset... 1');
  }

}
