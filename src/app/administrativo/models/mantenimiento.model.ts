// Módulo de mantenimiento vehicular (API: servicios/administrativo/mantenimiento)

export type TipoMantenimiento = 'CORRECTIVO' | 'PREVENTIVO' | 'PREVENTIVO Y CORRECTIVO';
export const TIPOS_MANTENIMIENTO: TipoMantenimiento[] = ['CORRECTIVO', 'PREVENTIVO', 'PREVENTIVO Y CORRECTIVO'];
/** MANTENIMIENTO (en taller) -> RECIBIDO (valores y facturas) -> ENTREGADO (acta generada); ANULADA */
export type EstadoOrdenMantenimiento = 'MANTENIMIENTO' | 'RECIBIDO' | 'ENTREGADO' | 'ANULADA';
export type EstadoVehiculoMantenimiento = 'VENCIDO' | 'PROXIMO' | 'AL DIA' | 'SIN PLAN';

export class RecursoMantenimientoModel {
  recurso_id?: number;
  recurso_estado = 'ACTIVO';
  recurso_tipo: string | null = null;
  recurso_codigo: string | null = null;
  recurso_descripcion = '';
}

export class ReglaMantenimientoModel {
  mantenimiento_id?: number;
  mantenimiento_km_inicio = 0;
  mantenimiento_km_intervalo: number | null = null;
  /** En lectura llegan los recursos completos; al guardar se envían solo los ids. */
  recursos: (number | RecursoMantenimientoModel)[] = [];
}

export class PlanMantenimientoModel {
  plan_id?: number;
  plan_estado = 'ACTIVO';
  plan_modelo = '';
  plan_observaciones: string | null = null;
  reglas: ReglaMantenimientoModel[] = [];
  /** ids de los vehículos que usan el plan (al guardar); en lectura llegan objetos */
  vehiculos: (number | { vehiculo_id: number; vehiculo_sigla: string; vehiculo_placa: string })[] = [];
}

/** Fila del listado de planes. */
export interface PlanResumenModel {
  plan_id: number;
  plan_modelo: string;
  plan_estado: string;
  plan_observaciones: string | null;
  reglas: number;
  vehiculos: number;
}

export class TrabajoMantenimientoModel {
  trabajo_id?: number;
  trabajo_descripcion = '';
}

export const RUBROS_POR_DEFECTO = ['MANO DE OBRA', 'REPUESTOS', 'ACEITES Y LUBRICANTES'];

export class FacturaMantenimientoModel {
  factura_id?: number;
  /** Rubro presupuestario */
  factura_tipo = RUBROS_POR_DEFECTO[0];
  factura_numero: string | null = null;
  factura_valor: number | string | null = null;
  factura_descripcion: string | null = null;
}

export class AnexoMantenimientoModel {
  anexo_id?: number;
  anexo_descripcion = '';
}

export class OrdenMantenimientoModel {
  orden_id?: number;
  /** Código generado: SIGLAS + año + ODM + serie (CBSD26ODM00010) */
  orden_codigo?: string;
  /** Número de informe individual: se imprime como "No. 005" en la orden, el informe y el acta */
  orden_serie: number | null = null;
  /** Taller de órdenes del sistema anterior (las nuevas lo toman del contrato) */
  orden_taller: string | null = null;
  /** Contrato de mantenimiento bajo el que se hace la orden */
  fk_contrato_id: number | null = null;
  /** Número del informe de pago (ej. CBSD-DA-2026-0207-I) */
  orden_informe_numero: string | null = null;
  orden_informe_serie: number | null = null;
  /** SISTEMA: fecha/hora actual al registrar; USUARIO: la ingresa el usuario */
  orden_fecha_mantenimiento_tipo: 'SISTEMA' | 'USUARIO' = 'SISTEMA';
  orden_estado: EstadoOrdenMantenimiento = 'MANTENIMIENTO';
  orden_registro?: string;
  fk_vehiculo_id: number | null = null;
  personal_solicita: number | null = null;
  director_administrativo: number | null = null;
  tecnico_servicios: number | null = null;
  tecnico_puesto: string | null = null;
  orden_tipomantenimiento: TipoMantenimiento = 'CORRECTIVO';
  orden_fecha_mantenimiento = '';
  orden_km_mantenimiento: number | null = null;
  ultimo_km_mantenimiento?: number | null;
  ultimo_fecha_mantenimiento?: string | null;
  orden_proximomantenimiento?: number | null;
  /** Fecha de entrega del informe de pago */
  orden_fecha_entrega: string | null = null;
  orden_observaciones: string | null = null;
  /** Fecha del acta entrega-recepción de satisfacción vehicular */
  orden_fecha_recepcion: string | null = null;
  orden_quien_recepcion: string | null = null;
  orden_cargo_recepcion: string | null = null;

  /** Trabajos a realizar: novedades reportadas por el custodio y transcritas por el analista */
  trabajos: TrabajoMantenimientoModel[] = [];
  /** Trabajos sugeridos por el contratista al revisar el vehículo en el taller */
  sugeridos: TrabajoMantenimientoModel[] = [];
  /** Desglose del pago por rubro presupuestario (factura_tipo = rubro) */
  facturas: FacturaMantenimientoModel[] = [];
  anexos: AnexoMantenimientoModel[] = [];

  // Campos de la vista (solo lectura)
  vehiculo_sigla?: string;
  vehiculo_placa?: string;
  vehiculo_marca?: string;
  vehiculo_modelo?: string;
  s_nombre?: string;
  da_nombre?: string;
  psg_nombre?: string;
  total_facturas?: number;
  /** { rubro: total } (la vista lo envía como JSON en texto) */
  totales_rubro?: Record<string, number> | string;
  contrato_codigo?: string | null;
  contrato_tipo?: string | null;
  /** Taller del contrato (o de la orden antigua) */
  taller?: string | null;
  /** Bitácora (informe de grupo) en la que está incluida la orden */
  informe_id?: number | null;
  informe_numero?: string | null;
  informe_fecha?: string | null;
  usuario?: string;
}

export class InformeMantenimientoModel {
  informe_id?: number;
  informe_numero: string | null = null;
  informe_estado: 'GENERADO' | 'ANULADO' = 'GENERADO';
  informe_fecha = new Date().toISOString().substring(0, 10);
  informe_taller: string | null = null;
  informe_detalle: string | null = null;
  tecnico_servicios: number | null = null;
  tecnico_cargo: string | null = null;
  director_administrativo: number | null = null;
  /** Contrato de las órdenes agrupadas (el taller se toma de él) */
  fk_contrato_id: number | null = null;
  /** ids de las órdenes incluidas (al guardar) */
  ordenes: number[] = [];
  ordenes_detalle?: OrdenMantenimientoModel[];
  psg_nombre?: string;
  da_nombre?: string;
  usuario?: string;
}

export interface ProximoMantenimiento {
  mantenimiento_id: number;
  km_intervalo: number;
  km_proximo: number;
  km_restante: number;
  estado: Exclude<EstadoVehiculoMantenimiento, 'SIN PLAN'>;
}

export interface EstadoVehiculoModel {
  vehiculo_id: number;
  vehiculo_sigla: string;
  vehiculo_placa: string;
  vehiculo_marca: string;
  vehiculo_modelo: string;
  vehiculo_tipo: string;
  vehiculo_chasis?: string | null;
  vehiculo_motor?: string | null;
  vehiculo_anio?: number | null;
  vehiculo_color1?: string | null;
  vehiculo_combustible?: string | null;
  fk_plan_id: number | null;
  plan_modelo: string | null;
  vehiculo_kilometraje: number;
  ultimo_km_mantenimiento: number | null;
  ultimo_fecha_mantenimiento: string | null;
  ultimo_km_preventivo: number | null;
  ordenes_abiertas: number;
  tolerancia_km: number;
  proximo: ProximoMantenimiento | null;
  estado_mantenimiento: EstadoVehiculoMantenimiento;
}

/** Color de CoreUI para cada estado (badges). */
export function colorEstadoMantenimiento(estado: string | null | undefined): string {
  switch (estado) {
    case 'VENCIDO': case 'ANULADA': case 'ANULADO': return 'danger';
    case 'PROXIMO': case 'MANTENIMIENTO': return 'warning';
    case 'RECIBIDO': return 'info';
    case 'AL DIA': case 'ENTREGADO': case 'GENERADO': case 'VIGENTE': return 'success';
    default: return 'secondary';
  }
}

/** Prepara una orden para enviarla al API: quita campos de la vista y filas vacías. */
export function ordenParaGuardar(orden: OrdenMantenimientoModel): Partial<OrdenMantenimientoModel> {
  const limpio = (t: string | null | undefined) => (t ?? '').trim();
  const {
    vehiculo_sigla, vehiculo_placa, vehiculo_marca, vehiculo_modelo, s_nombre, da_nombre, psg_nombre,
    total_facturas, totales_rubro, informe_id, informe_numero, informe_fecha, usuario, contrato_codigo, contrato_tipo, taller, ...datos
  } = orden;
  return {
    ...datos,
    trabajos: orden.trabajos.filter(t => limpio(t.trabajo_descripcion)).map(t => ({ trabajo_descripcion: limpio(t.trabajo_descripcion) })),
    sugeridos: orden.sugeridos.filter(t => limpio(t.trabajo_descripcion)).map(t => ({ trabajo_descripcion: limpio(t.trabajo_descripcion) })),
    anexos: orden.anexos.filter(a => limpio(a.anexo_descripcion)).map(a => ({ anexo_descripcion: limpio(a.anexo_descripcion) })),
    facturas: orden.facturas
      .filter(f => limpio(f.factura_numero) || limpio(f.factura_descripcion) || (f.factura_valor !== null && f.factura_valor !== ''))
      .map(({ factura_id, ...f }) => f),
  };
}

/** Prepara un plan para enviarlo al API: reglas con ids de recursos y vehículos como ids. */
export function planParaGuardar(plan: PlanMantenimientoModel): any {
  return {
    plan_id: plan.plan_id,
    plan_modelo: plan.plan_modelo,
    plan_observaciones: plan.plan_observaciones,
    plan_estado: plan.plan_estado,
    reglas: plan.reglas.map(r => ({
      mantenimiento_km_inicio: Number(r.mantenimiento_km_inicio) || 0,
      mantenimiento_km_intervalo: Number(r.mantenimiento_km_intervalo),
      recursos: r.recursos.map(x => typeof x === 'number' ? x : Number(x.recurso_id)),
    })),
    vehiculos: plan.vehiculos.map(v => typeof v === 'number' ? v : Number(v.vehiculo_id)),
  };
}

/** Configuración del módulo (admin.tb_sistema + admin.tb_params del módulo MANTENIMIENTO). */
export interface ConfiguracionMantenimiento {
  sistema_nombre: string;
  sistema_siglas: string;
  parametros: { param_key: string; param_value: string; param_name: string }[];
  director_administrativo: { ppersonal_id: number; nombre_completo: string } | null;
}

/** Lee un parámetro tipo lista ("A|B|C") de la configuración. */
export function listaParametro(config: ConfiguracionMantenimiento | null, clave: string, porDefecto: string[]): string[] {
  const valor = config?.parametros?.find(p => p.param_key === clave)?.param_value;
  const lista = (valor ?? '').split('|').map(v => v.trim()).filter(v => v);
  return lista.length ? lista : porDefecto;
}

/** Totales por rubro de una lista de valores del desglose, en el orden de los rubros configurados. */
/** Número de informe con 3 dígitos: 5 -> "005" */
export function numeroInforme(serie: number | string | null | undefined): string {
  return serie === null || serie === undefined || serie === '' || Number(serie) === 0 ? '—' : String(Number(serie)).padStart(3, '0');
}

export function totalesPorRubro(facturas: FacturaMantenimientoModel[], rubros: string[]): { rubro: string; total: number }[] {
  const totales = new Map<string, number>();
  for (const f of facturas) {
    const valor = Number(f.factura_valor);
    if (!f.factura_tipo || !Number.isFinite(valor) || f.factura_valor === null || f.factura_valor === '') { continue; }
    totales.set(f.factura_tipo, (totales.get(f.factura_tipo) ?? 0) + valor);
  }
  const orden = [...rubros, ...[...totales.keys()].filter(r => !rubros.includes(r))];
  return orden.filter(r => totales.has(r)).map(r => ({ rubro: r, total: Math.round(totales.get(r)! * 100) / 100 }));
}

/** Suma los totales por rubro (campo totales_rubro de la vista) de varias órdenes. */
export function totalesRubroOrdenes(ordenes: OrdenMantenimientoModel[], rubros: string[]): { rubro: string; total: number }[] {
  const facturas: FacturaMantenimientoModel[] = [];
  for (const o of ordenes) {
    const t = typeof o.totales_rubro === 'string' ? JSON.parse(o.totales_rubro || '{}') : (o.totales_rubro ?? {});
    for (const [rubro, total] of Object.entries(t)) {
      facturas.push(Object.assign(new FacturaMantenimientoModel(), { factura_tipo: rubro, factura_valor: Number(total) }));
    }
  }
  return totalesPorRubro(facturas, rubros);
}

// ------------------------------------------------------------------ contratos

export const TIPOS_CONTRATO_POR_DEFECTO = ['GENERAL', 'VIGENCIA TECNOLÓGICA'];

/** Partida presupuestaria del contrato por rubro, con su saldo (asignado - consumido). */
export class PartidaContratoModel {
  partida_id?: number;
  partida_rubro = '';
  partida_codigo: string | null = null;
  partida_monto: number | string | null = null;
  // lectura (vista de saldos)
  asignado?: number | string;
  consumido?: number | string;
  saldo?: number | string;
}

export class ContratoMantenimientoModel {
  contrato_id?: number;
  contrato_estado: 'VIGENTE' | 'FINALIZADO' | 'ANULADO' = 'VIGENTE';
  contrato_codigo = '';
  /** Nombre corto para el número de bitácora, ej. MANTENIMIENTO MOTOCICLETAS */
  contrato_nombre_corto: string | null = null;
  contrato_tipo = 'GENERAL';
  contrato_objeto: string | null = null;
  contrato_fecha_inicio: string | null = null;
  contrato_fecha_fin: string | null = null;
  contrato_taller = '';
  contrato_ruc: string | null = null;
  contrato_representante_legal: string | null = null;
  administrador_contrato: number | null = null;
  contrato_monto: number | string | null = null;
  partidas: PartidaContratoModel[] = [];
  /** ids (al guardar) u objetos (lectura) de los vehículos cubiertos; vacío = todos */
  vehiculos: (number | { vehiculo_id: number; vehiculo_sigla: string; vehiculo_placa: string })[] = [];
  // lectura
  administrador_nombre?: string;
  asignado?: number | string;
  consumido?: number | string;
  saldo?: number | string;
  ordenes?: number;
}

export function contratoParaGuardar(c: ContratoMantenimientoModel): any {
  const { administrador_nombre, asignado, consumido, saldo, ordenes, ...datos } = c;
  return {
    ...datos,
    partidas: c.partidas.filter(p => p.partida_rubro).map(p => ({
      partida_rubro: p.partida_rubro, partida_codigo: p.partida_codigo || null, partida_monto: Number(p.partida_monto) || 0,
    })),
    vehiculos: c.vehiculos.map(v => typeof v === 'number' ? v : Number(v.vehiculo_id)),
  };
}

/** { rubro: total } de las facturas guardadas de una orden. */
export function mantTotalesGuardados(facturas: FacturaMantenimientoModel[]): Record<string, number> {
  return Object.fromEntries(totalesPorRubro(facturas, []).map(t => [t.rubro, t.total]));
}

export interface SaldoRubro { rubro: string; disponible: number; estaOrden: number; restante: number; }

/**
 * Saldo por rubro para una orden: disponible = saldo del contrato + lo que esta orden ya tenía guardado
 * (el saldo del contrato ya lo descuenta); restante = disponible - valores actuales de la orden.
 */
export function saldoParaOrden(partidas: PartidaContratoModel[], guardado: Record<string, number>, facturas: FacturaMantenimientoModel[]): SaldoRubro[] {
  const actual = new Map(totalesPorRubro(facturas, partidas.map(p => p.partida_rubro)).map(t => [t.rubro, t.total]));
  return partidas.map(p => {
    const disponible = Math.round(((Number(p.saldo) || 0) + (guardado[p.partida_rubro] ?? 0)) * 100) / 100;
    const estaOrden = actual.get(p.partida_rubro) ?? 0;
    return { rubro: p.partida_rubro, disponible, estaOrden, restante: Math.round((disponible - estaOrden) * 100) / 100 };
  });
}
