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
  AnexoMantenimientoModel, colorEstadoMantenimiento, ConfiguracionMantenimiento, ContratoMantenimientoModel, EstadoOrdenMantenimiento, EstadoVehiculoModel,
  mantTotalesGuardados, saldoParaOrden, SaldoRubro,
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
  /** Contratos vigentes que cubren al vehículo (más el contrato actual de la orden) */
  contratos: ContratoMantenimientoModel[] = [];
  /** Valores por rubro guardados de esta orden (ya descontados del saldo del contrato) */
  private totalesGuardados: Record<string, number> = {};
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
  /** Anulada o con acta generada (ENTREGADO): solo se puede reabrir o imprimir */
  get soloLectura(): boolean { return this.orden.orden_estado === 'ANULADA' || this.orden.orden_estado === 'ENTREGADO'; }
  get contrato(): ContratoMantenimientoModel | undefined { return this.contratos.find(c => c.contrato_id === this.orden.fk_contrato_id); }
  /** Disponible, valor de esta orden y saldo restante por rubro del contrato */
  get saldos(): SaldoRubro[] { return this.contrato ? saldoParaOrden(this.contrato.partidas, this.totalesGuardados, this.orden.facturas) : []; }
  get excedeContrato(): boolean { return this.saldos.some(s => s.restante < 0) || this.rubrosSinPartida.length > 0; }
  get rubrosSinPartida(): string[] {
    if (!this.contrato) { return []; }
    const conPartida = this.contrato.partidas.map(p => p.partida_rubro);
    return totalesPorRubro(this.orden.facturas, this.rubros).filter(t => t.total > 0 && !conPartida.includes(t.rubro)).map(t => t.rubro);
  }
  /** Próximo mantenimiento preventivo: el calculado al guardar o, en una orden nueva, el del plan del vehículo */
  get kmProximo(): number | null {
    const guardado = this.orden.orden_proximomantenimiento;
    if (guardado !== null && guardado !== undefined) { return Number(guardado); }
    return this.estadoVehiculo?.proximo?.km_proximo ?? null;
  }
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
            orden_fecha_mantenimiento_tipo: 'USUARIO',
          });
          this.totalesGuardados = mantTotalesGuardados(this.orden.facturas);
          this.cargarEstadoVehiculo(this.orden.fk_vehiculo_id);
        } else {
          this.orden.orden_fecha_mantenimiento = ahoraLocal();
          this.orden.director_administrativo = configuracion.director_administrativo?.ppersonal_id ?? null;
          this.orden.tecnico_puesto = this.cargos[0] ?? null;
          const query = this.route.snapshot.queryParamMap;
          const tipo = query.get('tipo');
          if ((TIPOS_MANTENIMIENTO as string[]).includes(tipo ?? '')) { this.orden.orden_tipomantenimiento = tipo as any; }
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

  /** Contratos vigentes que cubren al vehículo; en una orden nueva se preselecciona el primero (los específicos van primero). */
  private cargarContratos(vehiculoId: number | null): void {
    if (!vehiculoId) { this.contratos = []; return; }
    this.mantenimiento.getContratos({ vigentes: true, vehiculo_id: vehiculoId }).subscribe({
      next: (contratos) => {
        const actual = this.orden.fk_contrato_id;
        this.contratos = contratos;
        if (actual && !contratos.some(c => c.contrato_id === actual)) {
          // contrato ya no vigente: se muestra igual para conservar la referencia
          this.mantenimiento.getContrato(actual).subscribe(c => this.contratos = [c, ...this.contratos]);
        }
        if (this.esNueva && !actual && contratos.length) {
          this.orden.fk_contrato_id = contratos[0].contrato_id!;
        }
      },
      error: (e) => console.error(e)
    });
  }

  /** Hora de salida: SISTEMA usa la fecha y hora actuales. */
  alCambiarTipoFecha(): void {
    if (this.orden.orden_fecha_mantenimiento_tipo === 'SISTEMA') { this.orden.orden_fecha_mantenimiento = ahoraLocal(); }
  }

  /** Botón +1 del número de orden */
  siguienteNumeroOrden(): void {
    this.mantenimiento.getSiguienteSerieOrden().subscribe({
      next: (r) => this.orden.orden_serie = r.orden_serie,
      error: (e) => Swal.fire('Error', e.error?.msg ?? e.message, 'error')
    });
  }

  private cargarEstadoVehiculo(vehiculoId: number | null, precargarKm = false): void {
    this.estadoVehiculo = null;
    this.cargarContratos(vehiculoId);
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

  /** Botón +1 del informe de pago: siguiente número según el formato configurado */
  siguienteInforme(): void {
    this.mantenimiento.getSiguienteInformeOrden().subscribe({
      next: (r) => {
        this.orden.orden_informe_numero = r.orden_informe_numero;
        this.orden.orden_informe_serie = r.orden_informe_serie;
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
    if (nuevoEstado === 'ANULADA' || (this.soloLectura && nuevoEstado)) {
      // anular o reabrir no requiere revalidar el formulario
    } else if (form.invalid || !this.orden.fk_contrato_id) {
      // los campos obligatorios están en el formulario de registro
      this.pestana = this.camposFaltantes().length ? 'registro' : this.pestana;
      Swal.fire('Atención', 'Revise los campos requeridos antes de guardar.', 'warning');
      return;
    } else if (this.excedeContrato) {
      this.pestana = 'pago';
      Swal.fire('Atención', 'Los valores registrados superan el saldo del contrato en algún rubro.', 'warning');
      return;
    }
    if (this.guardando) { return; }
    const orden = nuevoEstado ? { ...this.orden, orden_estado: nuevoEstado } as OrdenMantenimientoModel : this.orden;
    this.guardando = true;
    this.mantenimiento.guardarOrden(orden).subscribe({
      next: (r) => {
        this.guardando = false;
        const texto = r.orden_codigo ? `${r.msg}: ${r.orden_codigo}` : r.msg;
        if (nuevoEstado === 'ENTREGADO') {
          // el acta se abre con el clic del usuario para que el navegador no bloquee la pestaña
          Swal.fire({ title: 'Acta generada', text: 'La orden pasó a ENTREGADO.', icon: 'success', showCancelButton: true,
            confirmButtonText: 'Imprimir acta', cancelButtonText: 'Cerrar' })
            .then(res => {
              if (res.isConfirmed) { this.pdf.abrir(this.mantenimiento.urlReporteOrden(r.id, 'acta')); }
              this.router.navigate(['/admin/ordenes-mantenimiento']);
            });
          return;
        }
        Swal.fire('Listo', texto, 'success').then(() => this.router.navigate(['/admin/ordenes-mantenimiento']));
      },
      error: (e) => {
        this.guardando = false;
        Swal.fire('Error', e.error?.msg ?? e.message, 'error');
      }
    });
  }

  /** Flujo: MANTENIMIENTO -> RECIBIDO -> ENTREGADO (genera el acta); ANULADA. */
  cambiarEstado(form: NgForm, estado: EstadoOrdenMantenimiento): void {
    if (estado === 'ENTREGADO' && !this.orden.orden_fecha_recepcion) {
      this.pestana = 'pago';
      Swal.fire('Atención', 'Registre la fecha de entrega del acta antes de generarla.', 'warning');
      return;
    }
    const textos: Record<EstadoOrdenMantenimiento, string> = {
      RECIBIDO: '¿El taller entregó el vehículo con la documentación? La orden pasa a RECIBIDO para registrar valores y facturas.',
      ENTREGADO: 'Se generará el acta entrega-recepción y la orden pasará a ENTREGADO. Ya no se podrá editar salvo que se reabra.',
      MANTENIMIENTO: '¿Devolver la orden a MANTENIMIENTO (vehículo en el taller)?',
      ANULADA: '¿Anular la orden? Una orden anulada no se puede modificar y libera el saldo del contrato.',
    };
    const reabrir = this.orden.orden_estado === 'ENTREGADO' && estado === 'RECIBIDO';
    Swal.fire({ title: 'Confirmar', text: reabrir ? '¿Reabrir la orden para corregir valores?' : textos[estado], icon: 'question',
      showCancelButton: true, confirmButtonText: 'Sí', cancelButtonText: 'No' })
      .then(r => {
        if (!r.isConfirmed) { return; }
        this.guardar(form, estado);
      });
  }

  /** Campos obligatorios del formulario de registro que faltan. */
  camposFaltantes(): string[] {
    const o = this.orden;
    const faltan: [unknown, string][] = [
      [o.fk_vehiculo_id, 'unidad'], [o.orden_fecha_mantenimiento, 'fecha'], [o.orden_km_mantenimiento !== null && o.orden_km_mantenimiento !== undefined ? 1 : null, 'kilometraje'],
      [o.director_administrativo, 'director administrativo'], [o.personal_solicita, 'persona que solicita'], [o.tecnico_servicios, 'responsable del registro'],
      [o.fk_contrato_id, 'contrato'],
    ];
    return faltan.filter(([v]) => !v).map(([, n]) => n);
  }

  buscarVehiculo = (termino: string, v: EstadoVehiculoModel) => {
    const t = termino.toLowerCase();
    return `${v.vehiculo_sigla} ${v.vehiculo_placa} ${v.vehiculo_marca} ${v.vehiculo_modelo}`.toLowerCase().includes(t);
  };
}
