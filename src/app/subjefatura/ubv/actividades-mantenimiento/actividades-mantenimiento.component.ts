import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { VoluntariosActividades } from '../../models/voluntarios.molde';
import { ActividadesService } from '../../services/ubv/actividades.service';
import { VoluntariosService } from '../../services/ubv/voluntarios.service';

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
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-actividades-mantenimiento',
  imports: [NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, ReactiveFormsModule, FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent,
    TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, AlertComponent, AlertLinkDirective, TableDirective, ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective, ButtonCloseDirective
  ],
  templateUrl: './actividades-mantenimiento.component.html',
  styleUrls: ['./actividades-mantenimiento.component.scss']
})
export class ActividadesMantenimientoComponent implements OnInit {

  actividad: VoluntariosActividades = new VoluntariosActividades();
  voluntarios: any[] = [];
  errorMessage: string = '';
  customStylesValidated = false;
  voluntarioSelectEnabled = true;

  constructor(
    private _actividadesService: ActividadesService,
    private _voluntariosService: VoluntariosService,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const routeStr = this.route.snapshot.paramMap.get('id');
    if (routeStr !== 'nuevo' && routeStr !== null) {
      // Cargar actividad existente
      this._actividadesService.getById(+routeStr).subscribe({
        next: (data) => {
          this.actividad = data;
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
        this.voluntarios = data.map(voluntario => ({
          id: voluntario.voluntario_id,
          nombre: `${voluntario.voluntario_nombres} ${voluntario.voluntario_apellidos}`
        }));
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener la lista de voluntarios. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });
    const loginVoluntario = this._authService.getUsuario();
    if (loginVoluntario.usuario.voluntario_id && !this.actividad.fk_voluntario_id) {
      // console.log('Voluntario logueado:', loginVoluntario.usuario);
      this.actividad.fk_voluntario_id = loginVoluntario.usuario.voluntario_id;
      this.voluntarioSelectEnabled = false;
    }
  }

  onSubmit(form: NgForm) {
    this.customStylesValidated = true;
    if (form.invalid) {
      Swal.fire('Atención', 'Algunos campos están incorrectos o vacíos, por favor revise e intente nuevamente.', 'warning');
      return;
    }

    if (this.actividad.actividad_id) {
      // Actualizar actividad
      this._actividadesService.update(this.actividad).subscribe({
        next: () => {
          Swal.fire('Listo', 'La actividad ha sido actualizada correctamente.', 'success');
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (e) => {
          console.error(e);
          this.errorMessage = e.message;
          Swal.fire('Error', 'Hubo un problema al actualizar la actividad.', 'error');
        }
      });
    } else {
      // Crear nueva actividad
      this._actividadesService.save(this.actividad).subscribe({
        next: () => {
          Swal.fire('Listo', 'La actividad ha sido registrada correctamente.', 'success');
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (e) => {
          console.error(e);
          this.errorMessage = e.message;
          Swal.fire('Error', 'Hubo un problema al registrar la actividad.', 'error');
        }
      });
    }
  }

  onReset() {
    this.customStylesValidated = false;
    this.actividad = new VoluntariosActividades();
  }
}
