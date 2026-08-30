import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { Voluntarios } from '../../models/voluntarios.molde';
import { VoluntariosService } from '../../services/ubv/voluntarios.service';

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
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-voluntarios-mantenimiento',
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
    // DragDropModule
  ],
  templateUrl: './voluntarios-mantenimiento.component.html',
  styleUrls: ['./voluntarios-mantenimiento.component.scss']
})
export class VoluntariosMantenimientoComponent implements OnInit {

  voluntario: Voluntarios = new Voluntarios();
  errorMessage: string = '';
  customStylesValidated = false;

  constructor(
    private _voluntariosService: VoluntariosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const routeStr = this.route.snapshot.paramMap.get('id');
    if (routeStr !== 'nuevo' && routeStr !== null) {
      this._voluntariosService.getById(+routeStr).subscribe({
        next: (data) => {
          this.voluntario = data;
        },
        error: (e) => {
          console.error(e);
          Swal.fire('Error', 'Error al obtener el registro. ' + e.message, 'error');
        },
        complete: () => console.info('complete')
      });
    }
  }

  onSubmit(form: NgForm) {
    this.customStylesValidated = true;
    if (form.invalid) {
      Swal.fire('Atención', 'Algunos campos están incorrectos o vacíos, por favor revise e intente nuevamente.', 'warning');
      return;
    }

    if (this.voluntario.voluntario_id) {
      // Actualizar voluntario
      this._voluntariosService.update(this.voluntario).subscribe({
        next: (data) => {
          Swal.fire('Listo', 'El voluntario ha sido actualizado correctamente.', 'success');
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (e) => {
          console.error(e);
          this.errorMessage = e.message;
          Swal.fire('Error', 'Hubo un problema al actualizar el voluntario.', 'error');
        }
      });
    } else {
      // Crear nuevo voluntario
      this._voluntariosService.save(this.voluntario).subscribe({
        next: (data) => {
          Swal.fire('Listo', 'El voluntario ha sido registrado correctamente.', 'success');
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (e) => {
          console.error(e);
          this.errorMessage = e.message;
          Swal.fire('Error', 'Hubo un problema al registrar el voluntario.', 'error');
        }
      });
    }
  }

  onReset() {
    this.customStylesValidated = false;
    this.voluntario = new Voluntarios();
  }
}
