/** Operadores: funcionarios (operativos o administrativos) con licencia de conducir registrada. */

export type VigenciaLicencia = 'VIGENTE' | 'POR VENCER' | 'VENCIDA';

export interface OperadorModel {
  conductor_id: number;
  conductor_estado: 'ACTIVO' | 'INACTIVO' | string;
  fk_licencia_id: number | null;
  conductor_licencia_emision: string;
  conductor_licencia_validez: string;
  licencia_tipo: string | null;
  licencia_categoria: string | null;
  licencia_descripcion: string | null;
  persona_id: number;
  persona_doc_identidad: string;
  persona_nombres: string;
  persona_apellidos: string;
  personal_id: number;
  ppersonal_id: number | null;
  ppersonal_estado: string | null;
  puesto_nombre: string | null;
  puesto_modalidad: string | null;
  licencia_vigencia: VigenciaLicencia;
  en_funciones: boolean;
  habilitado: boolean;
  nombre_completo: string;
  /** Ruta relativa del PDF de la licencia (documentos/licencias/...) */
  conductor_pdf: string | null;
  /** El PDF de la licencia existe en el servidor */
  tiene_sustento: boolean;
}

export interface LicenciaModel { licencia_id: number; licencia_tipo: string; licencia_categoria: string; licencia_descripcion: string | null; }
export interface PuestoModel { puesto_id: number; puesto_nombre: string; puesto_modalidad: string | null; }
export interface CatalogosOperador { licencias: LicenciaModel[]; puestos: PuestoModel[]; dias_aviso: number; exigir_pdf: boolean; pdf_max_mb: number; }

export interface PersonaOperador {
  cedula_valida: boolean;
  persona: {
    persona_id: number; persona_doc_identidad: string; persona_nombres: string; persona_apellidos: string;
    personal_id: number | null; ppersonal_id: number | null; puesto_nombre: string | null; puesto_modalidad: string | null;
  } | null;
  operador: OperadorModel | null;
}

/** Datos que se envían al guardar (alta rápida o edición de la licencia). */
export interface OperadorGuardar {
  conductor_id?: number;
  persona_doc_identidad?: string;
  persona_nombres?: string;
  persona_apellidos?: string;
  fk_puesto_id?: number | null;
  fk_licencia_id: number | null;
  conductor_licencia_emision: string;
  conductor_licencia_validez: string;
  conductor_estado: string;
}

/** Cédula ecuatoriana: 10 dígitos, provincia 01-24 o 30, tercer dígito < 6 y dígito verificador (módulo 10). Igual que el API. */
export function cedulaValida(cedula: string | null | undefined): boolean {
  if (!cedula || !/^\d{10}$/.test(cedula)) { return false; }
  const provincia = Number(cedula.slice(0, 2));
  if (!((provincia >= 1 && provincia <= 24) || provincia === 30) || Number(cedula[2]) > 5) { return false; }
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let d = Number(cedula[i]) * (i % 2 === 0 ? 2 : 1);
    if (d > 9) { d -= 9; }
    suma += d;
  }
  return (10 - suma % 10) % 10 === Number(cedula[9]);
}

/** Color de CoreUI para la vigencia (siempre acompañado del texto). */
export function colorVigencia(v: VigenciaLicencia): 'success' | 'warning' | 'danger' {
  return v === 'VIGENTE' ? 'success' : v === 'POR VENCER' ? 'warning' : 'danger';
}

/** 'PROFESIONAL C' — tipo y categoría de la licencia */
export function textoLicencia(l: { licencia_tipo?: string | null; licencia_categoria?: string | null }): string {
  return [l.licencia_tipo, l.licencia_categoria].filter(Boolean).join(' ') || 'Sin licencia';
}

/** Días hasta el vencimiento (negativo si ya venció). */
export function diasParaVencer(validez: string, hoy = new Date()): number {
  const [a, m, d] = validez.split('-').map(Number);
  const inicio = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  return Math.round((Date.UTC(a, m - 1, d) - inicio) / 86400000);
}

export type FiltroOperadores = 'TODOS' | VigenciaLicencia | 'INACTIVOS' | 'SIN SUSTENTO';

export function filtrarOperadores(lista: OperadorModel[], filtro: FiltroOperadores): OperadorModel[] {
  if (filtro === 'TODOS') { return lista; }
  if (filtro === 'SIN SUSTENTO') { return lista.filter(o => !o.tiene_sustento); }
  if (filtro === 'INACTIVOS') { return lista.filter(o => o.conductor_estado !== 'ACTIVO' || !o.en_funciones); }
  return lista.filter(o => o.conductor_estado === 'ACTIVO' && o.en_funciones && o.licencia_vigencia === filtro);
}

/** Nombre con el que el servidor guarda el PDF: LIC-{CATEGORÍA}-{CÉDULA}.pdf */
export function nombreArchivoLicencia(categoria: string | null | undefined, cedula: string | null | undefined): string {
  const limpio = (v: string | null | undefined) => (v ?? '').toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  return ['LIC', limpio(categoria), limpio(cedula)].filter(Boolean).join('-') + '.pdf';
}

/** Valida el PDF antes de subirlo (el servidor vuelve a validarlo). Devuelve el error o null. */
export function errorArchivoPdf(archivo: File | null, maxMb: number): string | null {
  if (!archivo) { return null; }
  const esPdf = archivo.type === 'application/pdf' || archivo.name.toLowerCase().endsWith('.pdf');
  if (!esPdf) { return 'El archivo debe ser un PDF'; }
  if (archivo.size > maxMb * 1024 * 1024) { return `El archivo supera ${maxMb} MB`; }
  if (archivo.size < 100) { return 'El archivo está vacío o dañado'; }
  return null;
}
