import { EstacionesModel } from './../../models/estadisticas.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AsignacionUbvModel, Voluntarios } from '../../models/voluntarios.molde';
import { AsignacionService } from '../../services/ubv/asignacion.service';
import { VoluntariosService } from '../../services/ubv/voluntarios.service';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

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
  TableDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, AlertComponent, AlertLinkDirective,
  ButtonCloseDirective,
} from '@coreui/angular';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

import Swal from 'sweetalert2';
import { DistributivoService } from '../../../operaciones/services/distributivo.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-asignacion-mantenimiento',
  imports: [NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, ReactiveFormsModule, FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent,
    TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, AlertComponent, AlertLinkDirective, TableDirective, ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective, ButtonCloseDirective
  ],
  templateUrl: './asignacion-mantenimiento.component.html',
  styleUrls: ['./asignacion-mantenimiento.component.scss']
})
export class AsignacionMantenimientoComponent implements OnInit {

  asignacion: AsignacionUbvModel = new AsignacionUbvModel();
  voluntarios: Voluntarios[] = [];
  estaciones: EstacionesModel[] = [];
  errorMessage: string = '';
  customStylesValidated = false;
  voluntarioSelectEnabled = true;

  constructor(
    private _asignacionService: AsignacionService,
    private _voluntariosService: VoluntariosService,
    private _distributivoService: DistributivoService,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const routeStr = this.route.snapshot.paramMap.get('id');
    if (routeStr !== 'nuevo' && routeStr !== null) {
      // Cargar asignación existente
      this._asignacionService.getById(+routeStr).subscribe({
        next: (data) => {
          this.asignacion = data;
        },
        error: (e) => {
          console.error(e);
          Swal.fire('Error', 'Error al obtener el registro. ' + e.message, 'error');
        },
        complete: () => console.info('complete')
      });
    }

    // Cargar lista de voluntarios
    this._voluntariosService.getAll().subscribe({
      next: (data) => {
        this.voluntarios = data
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener la lista de voluntarios. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });

    // Cargar lista de estaciones
    this._distributivoService.getEstaciones().subscribe({
      next: (data) => {
        this.estaciones = data
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener la lista de estaciones. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });

    const loginVoluntario = this._authService.getUsuario();
    if (loginVoluntario.usuario.voluntario_id && !this.asignacion.fk_voluntario_id) {
      // console.log('Voluntario logueado:', loginVoluntario.usuario);
      this.asignacion.fk_voluntario_id = loginVoluntario.usuario.voluntario_id;
      this.voluntarioSelectEnabled = false;
    }

  }

  onSubmit(form: NgForm) {
    this.customStylesValidated = true;
    if (form.invalid) {
      Swal.fire('Atención', 'Algunos campos están incorrectos o vacíos, por favor revise e intente nuevamente.', 'warning');
      return;
    }

    if (this.asignacion.asignacion_id) {
      // Actualizar asignación
      this._asignacionService.update(this.asignacion).subscribe({
        next: () => {
          Swal.fire('Listo', 'La asignación ha sido actualizada correctamente.', 'success');
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (e) => {
          console.error(e);
          this.errorMessage = e.message;
          Swal.fire('Error', e.error.error + '<br>' + e.error.msg, 'error');
        }
      });
    } else {
      // Crear nueva asignación
      this._asignacionService.save(this.asignacion).subscribe({
        next: () => {
          Swal.fire('Listo', 'La asignación ha sido registrada correctamente.', 'success');
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (e) => {
          console.error(e);
          this.errorMessage = e.message;
          Swal.fire('Error', e.error.error + '<br>' + e.error.msg, 'error');
        }
      });
    }
  }

  onReset() {
    this.customStylesValidated = false;
    this.asignacion = new AsignacionUbvModel();
  }
}
