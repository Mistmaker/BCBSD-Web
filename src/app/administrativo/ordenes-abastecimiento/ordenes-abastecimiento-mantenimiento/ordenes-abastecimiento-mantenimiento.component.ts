import { AuthService } from './../../../auth/auth.service';
import { OrdenesAbastecimientoModel } from './../../models/ordenes-abastecimiento.model';
import { Component } from '@angular/core';

import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';

import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective } from '@coreui/angular';

import Swal from 'sweetalert2';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { PersonalService } from '../../../tthh/services/personal.service';
import { VehiculosModel } from '../../models/vehiculos.model';

import { OrdenesAbastecimientoService } from '../../services/ordenes-abastecimiento.service';
import { PersonalModel } from '../../../tthh/models/personal.model';
@Component({
  selector: 'app-ordenes-abastecimiento-mantenimiento',
  imports: [NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, ReactiveFormsModule, FormsModule, CommonModule, RowComponent,
    ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, RouterLink, TextColorDirective, FormDirective,
    FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective],
  templateUrl: './ordenes-abastecimiento-mantenimiento.component.html',
  styleUrl: './ordenes-abastecimiento-mantenimiento.component.scss'
})
export class OrdenesAbastecimientoMantenimientoComponent {
  orden: OrdenesAbastecimientoModel = new OrdenesAbastecimientoModel();
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

  constructor(private _ordenesAbastecimientoService: OrdenesAbastecimientoService, private _personalService: PersonalService, private _authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // this.cargarDatos();
    const routeStr = this.route.snapshot.paramMap.get('id');
    if (routeStr !== 'nuevo' && routeStr !== null) {
      this._ordenesAbastecimientoService.getById(+routeStr).subscribe({
        next: (data) => {
          console.log(data);
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
    this._ordenesAbastecimientoService.getVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });
    //Obteniendo conductores
    this._ordenesAbastecimientoService.getConductores().subscribe({
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

  // obtenerKilometraje(vehiculo: any) {
  //   console.log('Selected value changed:', vehiculo);
  //   this._ordenesAbastecimientoService.getVehiculoUltKm(vehiculo.vehiculo_id).subscribe({
  //     next: (data) => {
  //       console.log(data)
  //     },
  //     error: (e) => {
  //       console.error(e);
  //       Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
  //     },
  //     complete: () => console.info('complete')
  //   })
  // }


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
    // this.calcularTotal();
    this._ordenesAbastecimientoService.save(this.orden).subscribe({
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
    this.orden = new OrdenesAbastecimientoModel();
    console.log('Reset... 1');
  }

  trackByKey = (index: number, obj: object): string => {
		return index.toString();
	};

  // agregarDetalle() {
  //   this.orden.detalles ??= [];

  // const detalle = new OrdenesAbastecimientoDetalleModel(this.orden.orden_id)
  // if(this.orden.fk_unidad_id){
  //   detalle.fk_unidad_id = this.orden.fk_unidad_id
  // }
  //   this.orden.detalles.push(detalle);
  // }

  // calcularTotal() {
  //   this.orden.orden_total = this.orden.detalles.reduce((total, detalle) => total + detalle.orden_detalle_precio_total, 0);
  // }
}
