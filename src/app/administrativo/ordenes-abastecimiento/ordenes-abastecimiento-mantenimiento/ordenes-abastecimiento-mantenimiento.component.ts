import { AuthService } from './../../../auth/auth.service';
import { OrdenesMovilizacionModel } from './../../models/ordenes-movilizacion.model';
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
  TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective
} from '@coreui/angular';

import Swal from 'sweetalert2';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { OrdenesMovilizacionService } from '../../services/ordenes-movilizacion.service';
import { PersonalService } from '../../../tthh/services/personal.service';
import { VehiculosModel } from '../../models/vehiculos.model';
import { PersonalModel } from 'src/app/tthh/models/personal.model';
@Component({
  selector: 'app-ordenes-abastecimiento-mantenimiento',
  imports: [NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, ReactiveFormsModule, FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent,
    TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective
  ],
  templateUrl: './ordenes-abastecimiento-mantenimiento.component.html',
  styleUrl: './ordenes-abastecimiento-mantenimiento.component.scss'
})
export class OrdenesAbastecimientoMantenimientoComponent {
  orden: OrdenesMovilizacionModel = new OrdenesMovilizacionModel();
  vehiculos: VehiculosModel[] = [];
  personal: PersonalModel[] = [];
  conductores: PersonalModel[] = [];
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

  constructor(private _ordenesMovilizacionService: OrdenesMovilizacionService, private _personalService: PersonalService, private _authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // this.cargarDatos();
    const routeStr = this.route.snapshot.paramMap.get('id');
    if (routeStr !== 'nuevo' && routeStr !== null) {
      this._ordenesMovilizacionService.getById(+routeStr).subscribe({
        next: (data) => {
          this.orden = data;
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
    //Obteniendo conductres
    this._ordenesMovilizacionService.getConductores().subscribe({
      next: (data) => {
        this.conductores = data;
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
  }

  obtenerKilometraje(vehiculo: any) {
    console.log('Selected value changed:', vehiculo);
    this._ordenesMovilizacionService.getVehiculoUltKm(vehiculo.vehiculo_id).subscribe({
      next: (data) => {
        console.log(data)
        this.orden.orden_kilometraje_salida = data.orden_kilometraje_entrada;
        if (!data) this.orden.orden_kilometraje_salida = 0;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    })
  }

  imprimir(id: number){
    return this._ordenesMovilizacionService.imprimirOrden(id);
  }

  // cargarDatos() {
  //   this.errorMessage = '';
  //   this._vehiculosService.getAll().subscribe({
  //     next: (data) => console.log(data),
  //     error: (e) => {
  //       console.error(e);
  //       this.errorMessage = e.message;
  //     },
  //     complete: () => console.info('complete')
  //   })
  // }

  onSubmit(form: NgForm) {
    this.customStylesValidated = true;
    if (form.invalid) { Swal.fire('Atencion', 'Algunos campos están incorrectos o vacios, por favor revise e intente nuevamente', 'warning'); return; }
    console.log('Submit... 1');
    this.orden.fk_usuario_id = this._authService.getUsuario()['usuario']['usuario_id'];
    console.log(this.orden);
    this._ordenesMovilizacionService.save(this.orden).subscribe({
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
    this.orden = new OrdenesMovilizacionModel();
    console.log('Reset... 1');
  }
}
