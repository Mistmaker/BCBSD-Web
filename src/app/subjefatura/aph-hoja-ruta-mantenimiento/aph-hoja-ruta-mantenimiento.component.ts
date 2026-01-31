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
import { AphHojaRuta, AphHojaRuta_medicamentos, AphHojaRuta_pacientes, AphHojaRuta_tipoEmergencia, AphHojaRuta_vehiculos } from '../models/aph-hojaruta.model';
import { VehiculosModel } from '../../administrativo/models/vehiculos.model';
import { PersonalModel } from '../../tthh/models/personal.model';
import { HojaRutaService } from '../services/aph/hoja-ruta.service';
import { PersonalService } from '../../tthh/services/personal.service';
import { AuthService } from '../../auth/auth.service';
import { OrdenesMovilizacionService } from '../../administrativo/services/ordenes-movilizacion.service';
import { EstacionesModel } from '../models/estadisticas.model';
import { IntervencionesService } from '../services/intervenciones.service';

@Component({
  selector: 'app-aph-hoja-ruta-mantenimiento',
  imports: [NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, ReactiveFormsModule, FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent,
    TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, AlertComponent, AlertLinkDirective, TableDirective, ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective, ButtonCloseDirective
  ],
  templateUrl: './aph-hoja-ruta-mantenimiento.component.html',
  styleUrl: './aph-hoja-ruta-mantenimiento.component.scss'
})
export class AphHojaRutaMantenimientoComponent {

  hojaRuta: AphHojaRuta = new AphHojaRuta();
  tiposEmegenciaAPH: AphHojaRuta_tipoEmergencia[] = [];
  vehiculos: VehiculosModel[] = [];
  personal: PersonalModel[] = [];
  estaciones: EstacionesModel[] = [];
  provincias: any[] = [];
  cantones: any[] = [];
  parroquias: any[] = [];
  cie10: any[] = [];

  provincia_id!: number;
  canton_id!: number;
  tmp_cie10_id!: number;
  tmp_cedula!: string;
  tmp_apellidos!: string;
  tmp_nombres!: string;
  tmp_condicion_inicial!: string;
  tmp_condicion_final!: string;

  // TEMPORAL VEHICULOS
  tmp_vehiculo_id!: number;
  tmp_operador_id!: string;
  tmp_operador_nombre!: string;
  tmp_kilometraje_salida!: string;
  tmp_hora_salida!: string;
  tmp_kilometraje_retorno!: string;
  tmp_hora_arribo!: string;
  tmp_hora_retorno!: string;

  // TEMPORAL MEDICAMENTOS
  tmp_medicamento_id!: number;
  tmp_medicamento_nombre!: string;
  tmp_presentacion!: string;
  tmp_cantidad!: string;
  tmp_paciente_cedula!: string;

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

  constructor(private _hojaRutaService: HojaRutaService, private _intervencionesService: IntervencionesService, private _ordenesMovilizacionService: OrdenesMovilizacionService, private _personalService: PersonalService, private _authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // this.cargarDatos();
    const routeStr = this.route.snapshot.paramMap.get('id');
    if (routeStr !== 'nuevo' && routeStr !== null) {
      this._hojaRutaService.getById(+routeStr).subscribe({
        next: (data) => {
          this.hojaRuta = data;
          // this.buscarCantones(this.hojaRuta.fk_provincia_id);
          this.provincia_id = this.hojaRuta.state_id;
          this.buscarCantones(this.hojaRuta.state_id);
          this.canton_id = this.hojaRuta.town_id;
          this.buscarParroquias(this.canton_id);

          if (!this.hojaRuta.pacientes) {
            this.hojaRuta.pacientes = [];
          }

          if (!this.hojaRuta.vehiculos) {
            this.hojaRuta.vehiculos = [];
          }

          if (!this.hojaRuta.medicamentos) {
            this.hojaRuta.medicamentos = [];
          }

        },
        error: (e) => {
          console.error(e);
          Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
        },
        complete: () => console.info('complete')
      })
    }

    //Obteniendo tipos de emergencia APH
    this._hojaRutaService.getTiposEmergencia().subscribe({
      next: (data) => {
        this.tiposEmegenciaAPH = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });

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

    //Obteniendo CIE10
    this._hojaRutaService.getCie10().subscribe({
      next: (data) => {
        this.cie10 = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });

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

  buscarCie10(busqueda: any) {
    console.log(busqueda.term);
    //Obteniendo CIE10
    this._hojaRutaService.getCie10Busqueda(busqueda.term).subscribe({
      next: (data) => {
        this.cie10 = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });
  }

  agregarPaciente() {
    let nuevoPaciente = new AphHojaRuta_pacientes();
    nuevoPaciente.fk_cie10 = this.tmp_cie10_id;
    let cod = this.cie10.find(c => c.cie_id === this.tmp_cie10_id)?.cie_codigo || '';
    let dec = this.cie10.find(c => c.cie_id === this.tmp_cie10_id)?.cie_descripcion || '';
    nuevoPaciente.cie10_descripcion = cod + ' - ' + dec;
    nuevoPaciente.aph_hojaruta_paciente_cedula = this.tmp_cedula;
    nuevoPaciente.aph_hojaruta_paciente_apellidos = this.tmp_apellidos;
    nuevoPaciente.aph_hojaruta_paciente_nombres = this.tmp_nombres;
    nuevoPaciente.aph_hojaruta_paciente_condicion_inicial = this.tmp_condicion_inicial;
    nuevoPaciente.aph_hojaruta_paciente_condicion_final = this.tmp_condicion_final;
    this.hojaRuta.pacientes.push(nuevoPaciente);
    this.tmp_cie10_id = 0;
    this.tmp_cedula = '';
    this.tmp_nombres = '';
    this.tmp_condicion_inicial = '';
    this.tmp_condicion_final = '';
    //cerrar modal modalPacientes
    (document.getElementById('btnCerrarModalPacientes') as HTMLElement).click();
  }

  agregarVehiculo() {
    let sigla = this.vehiculos.find(v => v.vehiculo_id === this.tmp_vehiculo_id)?.vehiculo_sigla || '';
    let operador_nombres = this.personal.find(p => p.ppersonal_id === +this.tmp_operador_id)?.persona_nombres + ' ' + this.personal.find(p => p.ppersonal_id === +this.tmp_operador_id)?.persona_apellidos + ' - ' + this.personal.find(p => p.ppersonal_id === +this.tmp_operador_id)?.puesto_nombre || '';

    let nuevoVehiculo = new AphHojaRuta_vehiculos();
    nuevoVehiculo.fk_vehiculo = this.tmp_vehiculo_id;
    nuevoVehiculo.fk_operador = this.tmp_operador_id;
    nuevoVehiculo.aph_hojaruta_vehiculo_kilometraje_salida = this.tmp_kilometraje_salida;
    nuevoVehiculo.aph_hojaruta_vehiculo_hora_salida = this.tmp_hora_salida;
    nuevoVehiculo.aph_hojaruta_vehiculo_kilometraje_retorno = this.tmp_kilometraje_retorno;
    nuevoVehiculo.aph_hojaruta_vehiculo_hora_arribo = this.tmp_hora_arribo;
    nuevoVehiculo.aph_hojaruta_vehiculo_hora_retorno = this.tmp_hora_retorno;
    nuevoVehiculo.fk_vehiculo_sigla = sigla;
    nuevoVehiculo.fk_operador_nombres = operador_nombres;

    this.hojaRuta.vehiculos.push(nuevoVehiculo);
    this.tmp_vehiculo_id = 0;
    this.tmp_operador_id = '';
    this.tmp_kilometraje_salida = '';
    this.tmp_hora_salida = '';
    this.tmp_kilometraje_retorno = '';
    this.tmp_hora_arribo = '';
    this.tmp_hora_retorno = '';
    //cerrar modal modalVehiculos
    (document.getElementById('btnCerrarModalVehiculos') as HTMLElement).click();
  }

  agregarMedicamento() {
    let medicamento = new AphHojaRuta_medicamentos();
    medicamento.fk_paciente_cedula = this.tmp_paciente_cedula;
    medicamento.fk_medicamento = this.tmp_medicamento_id;
    medicamento.fk_paciente_nombres = this.tmp_medicamento_nombre;
    medicamento.aph_hojaruta_medicamento_presentacion = this.tmp_presentacion;
    medicamento.aph_hojaruta_medicamento_cantidad = this.tmp_cantidad;
    this.hojaRuta.medicamentos.push(medicamento);
    this.tmp_paciente_cedula = '';
    this.tmp_medicamento_id = 0;
    this.tmp_medicamento_nombre = '';
    this.tmp_presentacion = '';
    this.tmp_cantidad = '';
    //cerrar modal modalMedicamentos
    (document.getElementById('btnCerrarModalMedicamentos') as HTMLElement).click();
  }

  quitarPaciente(index: number) {
    this.hojaRuta.pacientes.splice(index, 1);
  }

  onSubmit(form: NgForm) {
    this.customStylesValidated = true;
    if (form.invalid) { Swal.fire('Atencion', 'Algunos campos están incorrectos o vacios, por favor revise e intente nuevamente', 'warning'); return; }
    console.log('Submit... 1', form);
    // this.intervencion.fk_usuario_id = this._authService.getUsuario()['usuario']['usuario_id'];
    console.log(this.hojaRuta);
    this._hojaRutaService.save(this.hojaRuta).subscribe({
      next: (data) => {
        console.log(data)
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
    this.hojaRuta = new AphHojaRuta();
    console.log('Reset... 1');
  }
}
