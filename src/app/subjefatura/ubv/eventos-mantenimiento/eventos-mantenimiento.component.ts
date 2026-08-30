import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { VoluntariosEventos } from '../../models/voluntarios.molde';

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
import { EventosService } from '../../services/ubv/eventos.service';

@Component({
  selector: 'app-eventos-mantenimiento',
  imports: [NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, ReactiveFormsModule, FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent,
    TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, AlertComponent, AlertLinkDirective, TableDirective, ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective, ButtonCloseDirective
  ],
  templateUrl: './eventos-mantenimiento.component.html',
  styleUrl: './eventos-mantenimiento.component.scss'
})
export class EventosMantenimientoComponent {

  evento: VoluntariosEventos = new VoluntariosEventos();
  errorMessage: string = '';
  customStylesValidated = false;
  voluntarioSelectEnabled = true;

  constructor(
    private _eventosService: EventosService,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const routeStr = this.route.snapshot.paramMap.get('id');
    if (routeStr !== 'nuevo' && routeStr !== null) {
      // Cargar actividad existente
      this._eventosService.getById(+routeStr).subscribe({
        next: (data) => {
          this.evento = data;
        },
        error: (e) => {
          console.error(e);
          Swal.fire('Error', 'Error al obtener el registro. ' + e.message, 'error');
        },
        complete: () => console.info('complete')
      });
    }

    // // Cargar lista de voluntarios
    // this._voluntariosService.getAll().subscribe({
    //   next: (data) => {
    //     this.voluntarios = data.map(voluntario => ({
    //       id: voluntario.voluntario_id,
    //       nombre: `${voluntario.voluntario_nombres} ${voluntario.voluntario_apellidos}`
    //     }));
    //   },
    //   error: (e) => {
    //     console.error(e);
    //     Swal.fire('Error', 'Error al obtener la lista de voluntarios. ' + e.message, 'error');
    //   },
    //   complete: () => console.info('complete')
    // });
    // const loginVoluntario = this._authService.getUsuario();
    // if (loginVoluntario.usuario.voluntario_id && !this.actividad.fk_voluntario_id) {
    //   // console.log('Voluntario logueado:', loginVoluntario.usuario);
    //   this.actividad.fk_voluntario_id = loginVoluntario.usuario.voluntario_id;
    //   this.voluntarioSelectEnabled = false;
    // }
  }

  onSubmit(form: NgForm) {
    this.customStylesValidated = true;
    if (form.invalid) {
      Swal.fire('Atención', 'Algunos campos están incorrectos o vacíos, por favor revise e intente nuevamente.', 'warning');
      return;
    }

    if (this.evento.evento_id) {
      // Actualizar actividad
      this._eventosService.update(this.evento).subscribe({
        next: () => {
          Swal.fire('Listo', 'El evento ha sido actualizada correctamente.', 'success');
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (e) => {
          console.error(e);
          this.errorMessage = e.message;
          Swal.fire('Error', 'Hubo un problema al actualizar el evento.', 'error');
        }
      });
    } else {
      // Crear nueva actividad
      this._eventosService.save(this.evento).subscribe({
        next: () => {
          Swal.fire('Listo', 'El evento ha sido registrado correctamente.', 'success');
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (e) => {
          console.error(e);
          this.errorMessage = e.message;
          Swal.fire('Error', 'Hubo un problema al registrar el evento.', 'error');
        }
      });
    }
  }

  onReset() {
    this.customStylesValidated = false;
    this.evento = new VoluntariosEventos();
  }

}
