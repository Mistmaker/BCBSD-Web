import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective, RowComponent } from '@coreui/angular';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { forkJoin, of } from 'rxjs';
import Swal from 'sweetalert2';

import { PersonalModel } from '../../../tthh/models/personal.model';
import { PersonalService } from '../../../tthh/services/personal.service';
import {
  AnexoMantenimientoModel, colorEstadoMantenimiento, ConfiguracionMantenimiento, EstadoOrdenMantenimiento, EstadoVehiculoModel,
  FacturaMantenimientoModel, listaParametro, numeroInforme, OrdenMantenimientoModel, RUBROS_POR_DEFECTO, TIPOS_MANTENIMIENTO, totalesPorRubro, TrabajoMantenimientoModel
} from '../../models/mantenimiento.model';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { PdfService } from '../../../core/pdf.service';

/** 'YYYY-MM-DD HH:mm:ss' (API) -> 'YYYY-MM-DDTHH:mm' (input datetime-local) */
export function aFechaHoraLocal(valor: string | null | undefined): string {
  if (!valor) { return ''; }
  return valor.replace(' ', 'T').substring(0, 16);
}

export function ahoraLocal(fecha = new Date()): string {
  const d = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
  return d.toISOString().substring(0, 16);
}

export type PestanaOrden = 'registro' | 'detalle' | 'pago';

@Component({
  selector: 'app-orden-mantenimiento-form',
  imports: [CommonModule, FormsModule, RouterLink, NgSelectComponent, NgLabelTemplateDirective, NgOptionTemplateDirective, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, BadgeComponent, FormDirective, FormLabelDirective, FormControlDirective, FormSelectDirective],
  templateUrl: './orden-mantenimiento-form.component.html'
})
export class OrdenMantenimientoFormComponent implements OnInit {
  orden = new OrdenMantenimientoModel();
  vehiculos: EstadoVehiculoModel[] = [];
  personal: PersonalModel[] = [];
  estadoVehiculo: EstadoVehiculoModel | null = null;
  configuracion: ConfiguracionMantenimiento | null = null;
  pestana: PestanaOrden = 'registro';
  verUnidad = false;
  validado = false;
  guardando = false;
  cargando = true;
  readonly color = colorEstadoMantenimiento;
  readonly tipos = TIPOS_MANTENIMIENTO;
  readonly numero = numeroInforme;

  /** Rubros presupuestarios (parámetro MANT_RUBROS) más los que ya tenga la orden */
  get rubros(): string[] {
    const base = listaParametro(this.configuracion, 'MANT_RUBROS', RUBROS_POR_DEFECTO);
    return [...base, ...this.orden.facturas.map(f => f.factura_tipo).filter(t => t && !base.includes(t))];
  }
  /** Cargos posibles del responsable (parámetro MANT_CARGOS_RESPONSABLE) más el actual de la orden */
  get cargos(): string[] {
    const base = listaParametro(this.configuracion, 'MANT_CARGOS_RESPONSABLE', ['PROFESIONAL TÉCNICO EN SERVICIOS GENERALES']);
    const actual = this.orden.tecnico_puesto;
    return actual && !base.includes(actual) ? [...base, actual] : base;
  }
  get totalesRubro() { return totalesPorRubro(this.orden.facturas, this.rubros); }

  constructor(private mantenimiento: MantenimientoService, private personalService: PersonalService, private pdf: PdfService,
              private route: ActivatedRoute, private router: Router) { }

  get esNueva(): boolean { return !this.orden.orden_id; }
  get soloLectura(): boolean { return this.orden.orden_estado === 'ANULADA'; }
  get totalFacturas(): number {
    return this.orden.facturas.reduce((t, f) => t + (Number(f.factura_valor) || 0), 0);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const ordenId = id && id !== 'nuevo' ? Number(id) : null;

    forkJoin({
      vehiculos: this.mantenimiento.getEstadoVehiculos(),
      personal: this.personalService.getAll(),
      configuracion: this.mantenimiento.getConfiguracion(),
      orden: ordenId ? this.mantenimiento.getOrden(ordenId) : of(null),
    }).subscribe({
      next: ({ vehiculos, personal, configuracion, orden }) => {
        this.vehiculos = vehiculos;
        this.personal = personal;
        this.configuracion = configuracion;
        if (orden) {
          this.orden = Object.assign(new OrdenMantenimientoModel(), orden, {
            orden_fecha_mantenimiento: aFechaHoraLocal(orden.orden_fecha_mantenimiento),
            orden_km_mantenimiento: orden.orden_km_mantenimiento !== null ? Number(orden.orden_km_mantenimiento) : null,
          });
          this.cargarEstadoVehiculo(this.orden.fk_vehiculo_id);
        } else {
          this.orden.orden_fecha_mantenimiento = ahoraLocal();
          this.orden.director_administrativo = configuracion.director_administrativo?.ppersonal_id ?? null;
          this.orden.tecnico_puesto = this.cargos[0] ?? null;
          const query = this.route.snapshot.queryParamMap;
          const tipo = query.get('tipo');
          if (tipo === 'PREVENTIVO' || tipo === 'CORRECTIVO') { this.orden.orden_tipomantenimiento = tipo; }
          const vehiculo = Number(query.get('vehiculo'));
          if (vehiculo) {
            this.orden.fk_vehiculo_id = vehiculo;
            this.alCambiarVehiculo();
          }
        }
        this.cargando = false;
      },
      error: (e) => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudo cargar la información. ' + (e.error?.msg ?? e.message), 'error');
      }
    });
  }

  alCambiarVehiculo(): void {
    this.cargarEstadoVehiculo(this.orden.fk_vehiculo_id, true);
  }

  private cargarEstadoVehiculo(vehiculoId: number | null, precargarKm = false): void {
    this.estadoVehiculo = null;
    if (!vehiculoId) { return; }
    this.mantenimiento.getEstadoVehiculo(vehiculoId).subscribe({
      next: (estado) => {
        this.estadoVehiculo = estado;
        if (precargarKm && this.esNueva) {
          this.orden.orden_km_mantenimiento = Number(estado.vehiculo_kilometraje) || null;
        }
      },
      error: (e) => console.error(e)
    });
  }

  agregarTrabajo(lista: TrabajoMantenimientoModel[]): void { lista.push(new TrabajoMantenimientoModel()); }
  agregarFactura(): void {
    const f = new FacturaMantenimientoModel();
    // sugiere el primer rubro que aún no se usa
    f.factura_tipo = this.rubros.find(r => !this.orden.facturas.some(x => x.factura_tipo === r)) ?? this.rubros[0];
    this.orden.facturas.push(f);
  }

  /** Botón +1: sugiere el siguiente número de informe individual */
  siguienteInforme(): void {
    this.mantenimiento.getSiguienteSerieOrden().subscribe({
      next: (r) => {
        this.orden.orden_serie = r.orden_serie;
        this.orden.orden_fecha_entrega ??= new Date().toISOString().substring(0, 10);
      },
      error: (e) => Swal.fire('Error', e.error?.msg ?? e.message, 'error')
    });
  }

  imprimir(doc: 'orden' | 'informe' | 'acta'): void {
    if (this.orden.orden_id) { this.pdf.abrir(this.mantenimiento.urlReporteOrden(this.orden.orden_id, doc)); }
  }

  agregarAnexo(): void { this.orden.anexos.push(new AnexoMantenimientoModel()); }
  quitar<T>(lista: T[], indice: number): void { lista.splice(indice, 1); }

  /** El km de la orden no puede ser menor al último mantenimiento registrado del vehículo. */
  get advertenciaKm(): string | null {
    const km = Number(this.orden.orden_km_mantenimiento);
    const ultimo = this.esNueva ? this.estadoVehiculo?.ultimo_km_mantenimiento : null;
    if (ultimo !== null && ultimo !== undefined && km < Number(ultimo)) {
      return `El kilometraje es menor al del último mantenimiento (${Number(ultimo).toLocaleString()} km).`;
    }
    return null;
  }

  guardar(form: NgForm, nuevoEstado?: EstadoOrdenMantenimiento): void {
    this.validado = true;
    if (form.invalid) {
      // los campos obligatorios están en el formulario de registro
      this.pestana = this.camposFaltantes().length ? 'registro' : this.pestana;
      Swal.fire('Atención', 'Revise los campos requeridos antes de guardar.', 'warning');
      return;
    }
    if (this.guardando) { return; }
    const orden = nuevoEstado ? { ...this.orden, orden_estado: nuevoEstado } as OrdenMantenimientoModel : this.orden;
    this.guardando = true;
    this.mantenimiento.guardarOrden(orden).subscribe({
      next: (r) => {
        this.guardando = false;
        const texto = r.orden_codigo ? `${r.msg}: ${r.orden_codigo}` : r.msg;
        Swal.fire('Listo', texto, 'success').then(() => this.router.navigate(['/admin/ordenes-mantenimiento']));
      },
      error: (e) => {
        this.guardando = false;
        Swal.fire('Error', e.error?.msg ?? e.message, 'error');
      }
    });
  }

  cambiarEstado(form: NgForm, estado: EstadoOrdenMantenimiento): void {
    const textos: Record<string, string> = {
      FINALIZADA: '¿Marcar la orden como finalizada? Registre antes los datos de recepción del vehículo.',
      ANULADA: '¿Anular la orden? Una orden anulada no se puede modificar.',
      MANTENIMIENTO: '¿Reabrir la orden?'
    };
    Swal.fire({ title: 'Confirmar', text: textos[estado], icon: 'question', showCancelButton: true, confirmButtonText: 'Sí', cancelButtonText: 'No' })
      .then(r => { if (r.isConfirmed) { this.guardar(form, estado); } });
  }

  /** Campos obligatorios del formulario de registro que faltan. */
  camposFaltantes(): string[] {
    const o = this.orden;
    const faltan: [unknown, string][] = [
      [o.fk_vehiculo_id, 'unidad'], [o.orden_fecha_mantenimiento, 'fecha'], [o.orden_km_mantenimiento !== null && o.orden_km_mantenimiento !== undefined ? 1 : null, 'kilometraje'],
      [o.director_administrativo, 'director administrativo'], [o.personal_solicita, 'persona que solicita'], [o.tecnico_servicios, 'responsable del registro'],
    ];
    return faltan.filter(([v]) => !v).map(([, n]) => n);
  }

  buscarVehiculo = (termino: string, v: EstadoVehiculoModel) => {
    const t = termino.toLowerCase();
    return `${v.vehiculo_sigla} ${v.vehiculo_placa} ${v.vehiculo_marca} ${v.vehiculo_modelo}`.toLowerCase().includes(t);
  };
}
