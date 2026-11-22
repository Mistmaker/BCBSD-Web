/*
 * Parte de servicio (auxilio o incendio): formato del área operativa (CBSD-PA / CBSD-PI).
 * El número lo asigna el API al guardar: {SIGLAS}-{PA|PI}-{ESTACIÓN}-{AAAA}-{NNNN}.
 * Vehículos, personal y recursos se eligen de catálogos para la estadística por vehículo, estación, bombero y herramienta.
 */
export const ROL_MANDO = 'PERSONA AL MANDO DE LA EMERGENCIA';
export const ROLES_PERSONAL = [ROL_MANDO, 'PERSONAL DE APH', 'PERSONAL OPERATIVO'];
export const TIPOS_PARTE = ['AUXILIO', 'INCENDIO'];
export const TIPOS_DIA = ['LABORABLE', 'FESTIVO', 'FERIADO', 'FIN DE SEMANA', 'ESTADO DE EMERGENCIA'];
export const TIPOS_IDENTIFICACION = ['Cédula', 'Pasaporte', 'Licencia', 'Sin documento'];
export const TRASLADOS_VICTIMA = ['C. Particular', 'H. Privado', 'H. Público', 'IESS', 'Sin traslado'];
export const TIPOS_EDAD = ['años', 'meses', 'días'];
export const SEXOS = ['F', 'M'];
export const PROPIEDADES = ['Propio', 'Arrendado', 'Desconocido'];

export class ParteModel {
  parte_id?: number;
  parte_numero = '';
  parte_estado = 'REGISTRADO';
  parte_anulado_motivo: string | null = null;
  parte_tipo = 'AUXILIO';
  parte_fecha: string;
  parte_tipo_dia = 'LABORABLE';
  parte_codigo_salida = '';
  fk_estacion_id: number | null = null;
  estacion_nombre?: string;
  parte_forma_aviso = '';
  fk_personal_despacho_id: number | null = null;
  parte_fecha_aviso = '';
  parte_hora_aviso = '';
  parte_hora_transferencia_ecu: number | null = null;
  parte_minuto_transferencia_ecu: number | null = null;
  parte_informacion_alertante = '';
  parte_apoyo_requerido = '';
  parte_apoyo = '';
  parte_apoyo_otros = '';
  parte_grupo_asiste = '';
  parte_provincia: number | null = null;
  parte_canton: number | null = null;
  parte_parroquia: number | null = null;
  parte_tipo_sector = '';
  parte_calle_principal = '';
  parte_calle_secundaria = '';
  parte_numero_domicilio = '';
  parte_sector = '';
  parte_referencia = '';
  parte_telefono = '';
  parte_datos_adicionales = '';
  // Personas / instituciones asistidas
  parte_personas_institucion = '';
  parte_institucion_tipo = '';
  parte_institucion_propiedad = '';
  parte_observacion_institucion = '';
  parte_observacion_victimas = '';
  parte_observacion_fallecidos = '';
  // Daños y datos del incendio
  parte_danios_materiales = '';
  parte_tipo_afectado = '';
  parte_afectado_propietario = '';
  parte_afectado_arrendatario = '';
  parte_afectado_otros = '';
  parte_area_destruida_m2: number | null = null;
  parte_total_superficie_quemada = '';
  parte_total_superficie_quemada_m2: number | null = null;
  parte_especies_predominantes = '';
  parte_lugar_posible_inicio = '';
  parte_causante_identificado: boolean | null = null;
  parte_nombre_causante = '';
  parte_otros_datos_causante = '';
  parte_naturaleza_especifique = '';
  tipos_incendio: number[] = [];
  naturalezas: number[] = [];
  // Operaciones, croquis y cierre
  parte_descripcion_operaciones = '';
  parte_latitud: string | number | null = null;
  parte_longitud: string | number | null = null;
  parte_croquis_url = '';
  parte_novedades = '';
  parte_visita_inspectores: boolean | null = null;
  parte_visita_inspectores_motivo = '';
  parte_anexo_requerido: boolean | null = null;
  parte_elaborado_por = '';
  parte_revisado_por = '';
  parte_aprobado_por = '';
  parte_entregado_a = '';
  parte_entregado_identificacion = '';
  parte_fecha_entrega = '';

  personal: PartePersonalDetalle[] = [];
  vehiculos: ParteVehiculoDetalle[] = [];
  tipos_auxilio: ParteTipoAuxilioDetalle[] = [];
  causas: ParteCausaDetalle[] = [];
  equipos_herramientas: ParteRecursoDetalle[] = [];
  materiales_descartables: ParteRecursoDetalle[] = [];
  insumos: ParteRecursoDetalle[] = [];
  personas_asistidas: PartePersonaAsistidaDetalle[] = [];
  victimas: ParteVictimaDetalle[] = [];
  fallecidos: ParteFallecidoDetalle[] = [];

  constructor(hoy = new Date()) {
    this.parte_fecha = fechaISO(hoy);
  }
}

export class PartePersonalDetalle {
  fk_personal_id: number | null = null;
  nombre?: string;
  parte_personal_rol = 'PERSONAL OPERATIVO';
  parte_personal_rango = '';
  parte_personal_grupo = '';
}

export class ParteVehiculoDetalle {
  fk_vehiculo_id: number | null = null;
  fk_estacion_id: number | null = null;
  parte_vehiculo_placa = '';
  parte_vehiculo_siglas = '';
  parte_vehiculo_km_salida: number | null = null;
  parte_vehiculo_km_retorno: number | null = null;
  parte_vehiculo_hora_despacho = '';
  parte_vehiculo_hora_salida = '';
  parte_vehiculo_hora_arribo = '';
  parte_vehiculo_hora_fin_operaciones = '';
  parte_vehiculo_apoyo = 'Apoyo interno';
}

export class ParteTipoAuxilioDetalle {
  fk_tipo_auxilio_id: number | null = null;
  parte_auxilio_clave = '';
  parte_auxilio_clasificacion = '';
  parte_auxilio_subclasificacion = '';
  parte_auxilio_uso_tipo = '';
  parte_auxilio_especifique = '';
}

export class ParteCausaDetalle {
  fk_causa_id: number | null = null;
  parte_causa_clave = '';
  parte_causa_clasificacion = '';
  parte_causa_descripcion = '';
  parte_causa_especifique = '';
}

export class ParteRecursoDetalle {
  fk_recurso_id: number | null = null;
  fk_estacion_id: number | null = null;
  parte_recurso_descripcion = '';
  parte_recurso_cantidad: number | null = 1;
  parte_recurso_observaciones = '';
}

export class PartePersonaAsistidaDetalle {
  parte_persona_institucion = '';
  parte_persona_tipo_institucion = '';
  parte_persona_nombre = '';
  parte_persona_identificacion = '';
  parte_persona_telefono = '';
  parte_persona_propiedad = '';
}

export class ParteVictimaDetalle {
  parte_victima_numero_hoja = '';
  parte_victima_tipo_identificacion = '';
  parte_victima_identificacion = '';
  parte_victima_nombres = '';
  parte_victima_edad: number | null = null;
  parte_victima_tipo_edad = 'años';
  parte_victima_sexo = '';
  parte_victima_signos_sintomas = '';
  parte_victima_traslado = '';
}

export class ParteFallecidoDetalle {
  parte_fallecido_numero = '';
  parte_fallecido_tipo_identificacion = '';
  parte_fallecido_identificacion = '';
  parte_fallecido_nombres = '';
  parte_fallecido_edad: number | null = null;
  parte_fallecido_tipo_edad = 'años';
  parte_fallecido_sexo = '';
  parte_fallecido_observaciones = '';
  parte_fallecido_traslado = '';
}

/** Fila del listado (getPartes.php) */
export interface ParteResumen {
  parte_id: number;
  parte_numero: string;
  parte_tipo: string;
  parte_estado: string;
  parte_fecha: string;
  parte_hora_aviso: string | null;
  fk_estacion_id: number;
  estacion_nombre: string | null;
  parte_direccion: string | null;
  tipos_auxilio: string | null;
  vehiculos: string | null;
  al_mando: string | null;
  parte_total_heridos: number;
  parte_total_muertos: number;
}

export interface TipoAuxilioCatalogo { tipo_auxilio_id: number; clasificacion: string; subclasificacion: string; uso_tipo: string; }
export interface CausaCatalogo { causa_id: number; clasificacion: string; descripcion: string; }
export interface RecursoCatalogo { recurso_id: number; recurso_tipo: 'EQUIPO' | 'MATERIAL' | 'INSUMO'; recurso_descripcion: string; }
export interface VehiculoCatalogo { vehiculo_id: number; vehiculo_placa: string; vehiculo_sigla: string | null; vehiculo_tipo: string | null; fk_estacion_id: number | null; }
export interface PersonalCatalogo {
  personal_id: number; nombre: string; persona_apellidos: string; persona_nombres: string; persona_doc_identidad: string;
  puesto_nombre: string | null; fk_estacion_id: number | null;
}
export interface CatalogosParte {
  estaciones: { estacion_id: number; estacion_nombre: string }[];
  vehiculos: VehiculoCatalogo[];
  personal: PersonalCatalogo[];
  tipos_auxilio: TipoAuxilioCatalogo[];
  causas: CausaCatalogo[];
  recursos: RecursoCatalogo[];
  formas_aviso: string[];
  apoyos: string[];
  tipos_incendio: { id: number; descripcion: string }[];
  naturalezas: { id: number; descripcion: string }[];
  rangos: string[];
  pelotones: string[];
  claves: string[];
  ubicacion: { provincia: number; canton: number; parroquia: number } | null;
}

/** Bloques de recursos del formato: clave del parte y tipo en el catálogo */
export const BLOQUES_RECURSOS: { clave: 'equipos_herramientas' | 'materiales_descartables' | 'insumos'; titulo: string; tipo: RecursoCatalogo['recurso_tipo'] }[] = [
  { clave: 'equipos_herramientas', titulo: 'Equipos y herramientas', tipo: 'EQUIPO' },
  { clave: 'materiales_descartables', titulo: 'Material descartable MATPEL', tipo: 'MATERIAL' },
  { clave: 'insumos', titulo: 'Insumos', tipo: 'INSUMO' },
];

export function fechaISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const unicos = (xs: string[]) => [...new Set(xs)];

/** Clasificaciones del tipo de auxilio, en el orden del catálogo */
export function clasificacionesAuxilio(cat: TipoAuxilioCatalogo[]): string[] {
  return unicos(cat.map(t => t.clasificacion));
}

export function subclasificacionesAuxilio(cat: TipoAuxilioCatalogo[], clasificacion: string): string[] {
  return unicos(cat.filter(t => t.clasificacion === clasificacion && t.subclasificacion !== '').map(t => t.subclasificacion));
}

export function usosAuxilio(cat: TipoAuxilioCatalogo[], clasificacion: string, subclasificacion: string): string[] {
  return unicos(cat.filter(t => t.clasificacion === clasificacion && t.subclasificacion === subclasificacion && t.uso_tipo !== '').map(t => t.uso_tipo));
}

/** Id del catálogo para la combinación elegida (null si no existe) */
export function idTipoAuxilio(cat: TipoAuxilioCatalogo[], d: ParteTipoAuxilioDetalle): number | null {
  return cat.find(t => t.clasificacion === d.parte_auxilio_clasificacion && t.subclasificacion === (d.parte_auxilio_subclasificacion || '')
    && t.uso_tipo === (d.parte_auxilio_uso_tipo || ''))?.tipo_auxilio_id ?? null;
}

export function clasificacionesCausa(cat: CausaCatalogo[]): string[] {
  return unicos(cat.map(c => c.clasificacion));
}

export function causasDe(cat: CausaCatalogo[], clasificacion: string): string[] {
  return cat.filter(c => c.clasificacion === clasificacion).map(c => c.descripcion);
}

/** '2026-03-05T22:14' o '2026-03-05 22:14:00' -> milisegundos (null si está vacío o es inválido) */
function ms(fh: string | null | undefined): number | null {
  if (!fh) return null;
  const t = Date.parse(fh.replace(' ', 'T').slice(0, 16));
  return Number.isNaN(t) ? null : t;
}

/** Minutos desde el aviso hasta el primer arribo (tiempo de respuesta); null si faltan datos o no es coherente */
export function minutosRespuesta(p: Pick<ParteModel, 'parte_fecha' | 'parte_fecha_aviso' | 'parte_hora_aviso' | 'vehiculos'>): number | null {
  if (!p.parte_hora_aviso) return null;
  const aviso = ms(`${p.parte_fecha_aviso || p.parte_fecha}T${p.parte_hora_aviso.slice(0, 5)}`);
  const arribos = p.vehiculos.map(v => ms(v.parte_vehiculo_hora_arribo)).filter((x): x is number => x !== null);
  if (aviso === null || !arribos.length) return null;
  const min = Math.round((Math.min(...arribos) - aviso) / 60000);
  return min >= 0 && min <= 24 * 60 ? min : null;
}

/** Km recorridos por el vehículo en la emergencia (null si falta un dato o el ingreso es menor) */
export function kmRecorridos(v: ParteVehiculoDetalle): number | null {
  const s = v.parte_vehiculo_km_salida, r = v.parte_vehiculo_km_retorno;
  if (s === null || r === null || s === undefined || r === undefined || (s as any) === '' || (r as any) === '') return null;
  return Number(r) >= Number(s) ? Number(r) - Number(s) : null;
}

/** Revisión antes de enviar (el API valida lo mismo). Devuelve los mensajes a corregir. */
export function validarParte(p: ParteModel, hoy = fechaISO(new Date())): string[] {
  const errores: string[] = [];
  if (!TIPOS_PARTE.includes(p.parte_tipo)) errores.push('Seleccione el tipo de parte.');
  if (!p.parte_fecha) errores.push('Indique la fecha del parte.');
  else if (p.parte_fecha > hoy) errores.push('La fecha del parte no puede ser futura.');
  if (!p.fk_estacion_id) errores.push('Seleccione la estación.');
  if (!p.parte_hora_aviso) errores.push('Indique la hora del aviso.');
  if (!p.parte_descripcion_operaciones?.trim()) errores.push('Describa las operaciones realizadas.');
  const personal = p.personal.filter(x => x.fk_personal_id);
  if (!personal.length) errores.push('Registre al personal que atendió la emergencia.');
  if (personal.filter(x => x.parte_personal_rol === ROL_MANDO).length !== 1) errores.push('Indique una (y solo una) persona al mando de la emergencia.');
  if (new Set(personal.map(x => x.fk_personal_id)).size !== personal.length) errores.push('Hay personal repetido.');
  const vehiculos = p.vehiculos.filter(v => v.fk_vehiculo_id || v.parte_vehiculo_placa?.trim());
  if (!vehiculos.length) errores.push('Registre al menos un vehículo.');
  vehiculos.forEach((v, i) => {
    const s = v.parte_vehiculo_km_salida, r = v.parte_vehiculo_km_retorno;
    if (s !== null && r !== null && (s as any) !== '' && (r as any) !== '' && Number(r) < Number(s)) {
      errores.push(`Vehículo ${i + 1}: el km de ingreso no puede ser menor que el de salida.`);
    }
    const horas = [v.parte_vehiculo_hora_despacho, v.parte_vehiculo_hora_salida, v.parte_vehiculo_hora_arribo, v.parte_vehiculo_hora_fin_operaciones]
      .map(ms).filter((x): x is number => x !== null);
    if (horas.some((h, k) => k > 0 && h < horas[k - 1])) {
      errores.push(`Vehículo ${i + 1}: las horas deben ir en orden (despacho, salida, arribo, fin de operaciones).`);
    }
  });
  return errores;
}

/** Hora de inicio por defecto de los vehículos: fecha del aviso (o del parte) con la hora del aviso */
export function fechaHoraAviso(p: Pick<ParteModel, 'parte_fecha' | 'parte_fecha_aviso' | 'parte_hora_aviso'>): string {
  const fecha = p.parte_fecha_aviso || p.parte_fecha;
  return fecha && p.parte_hora_aviso ? `${fecha}T${p.parte_hora_aviso.slice(0, 5)}` : '';
}
