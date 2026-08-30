
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';

import {
  AlertComponent,
  AlertHeadingDirective,
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
  TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective
} from '@coreui/angular';

import Swal from 'sweetalert2';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

import { ParteService } from '../services/parte.service';
import { ParteModel } from '../models/partes.model';
import { EstacionesModel } from '../../subjefatura/models/estadisticas.model';
import { PersonalModel } from '../../tthh/models/personal.model';
import { IntervencionesService } from '../../subjefatura/services/intervenciones.service';
import { PersonalService } from '../../tthh/services/personal.service';

@Component({
  selector: 'app-parte-mantenimiento',
  imports: [AlertComponent, AlertHeadingDirective,ReactiveFormsModule, FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent,
    TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,
    NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent
  ],
  templateUrl: './parte-mantenimiento.component.html',
  styleUrl: './parte-mantenimiento.component.scss'
})
export class ParteMantenimientoComponent {

  parte: ParteModel = new ParteModel();
  errorMessage: string = '';
  customStylesValidated = false;
  estaciones: EstacionesModel[] = [];
  personal: PersonalModel[] = [];

  constructor(private _parteService: ParteService, private _personalService: PersonalService, private _intervencionesService: IntervencionesService, private route: ActivatedRoute, private router: Router) { }



  ngOnInit(): void {
    // Logic to load existing data if editing can be added here
    const routeStr = this.route.snapshot.paramMap.get('id');
    if (routeStr !== 'nuevo' && routeStr !== null) {
      this._parteService.getById(+routeStr).subscribe({
        next: (data) => {
          this.parte = data;
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
      complete: () => console.info('complete 1')
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
      complete: () => console.info('complete 2')
    });
  }

  onSubmit(form: NgForm) {
    this.customStylesValidated = true;
    if (form.invalid) {
      Swal.fire('Atencion', 'Algunos campos están incorrectos o vacios, por favor revise e intente nuevamente', 'warning');
      return;
    }
    this._parteService.save(this.parte).subscribe({
      next: (data) => {
        Swal.fire('Listo', data.msg, 'success');
        // Logic to navigate or reset can be added here
      },
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
        Swal.fire('Error', 'Error al guardar el registro. ' + e.message, 'error');
      }
    });
  }

  onReset() {
    this.customStylesValidated = false;
    this.parte = new ParteModel();
  }

}
