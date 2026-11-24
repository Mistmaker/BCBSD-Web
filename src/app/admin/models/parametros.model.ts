/** Parámetros del sistema (admin.tb_params): tipos, validación (la misma del API) y editores. */

export type TipoParametro = 'NUMERO' | 'TEXTO' | 'TEXTO_LARGO' | 'LISTA' | 'SI_NO' | 'JSON' | 'HTML' | 'COLOR';

export interface ParametroModel {
  param_id: number; param_key: string; param_name: string; param_value: string; param_type: TipoParametro; param_modulo: string;
  param_actualizado: string | null; actualizado_por: string | null;
}

export interface RespuestaParametros {
  parametros: ParametroModel[]; tipos: Record<TipoParametro, string>; modulo_protegido: string;
  puede_editar: boolean; puede_editar_protegidos: boolean;
}

export interface HistorialParametro {
  historial_id: number; historial_valor_anterior: string | null; historial_valor_nuevo: string | null; historial_fecha: string; usuario_login: string | null;
}

/** Fila del editor de JSON en tabla (objeto o arreglo de valores simples) */
export interface FilaJson { clave: string; valor: string; tipo: 'string' | 'number' | 'boolean' | 'null'; }
export interface JsonTabla { forma: 'objeto' | 'arreglo'; filas: FilaJson[]; }

export const ICONO_TIPO: Record<TipoParametro, string> = {
  NUMERO: 'fa-hashtag', TEXTO: 'fa-font', TEXTO_LARGO: 'fa-align-left', LISTA: 'fa-list-ul', SI_NO: 'fa-toggle-on',
  JSON: 'fa-code', HTML: 'fa-file-code', COLOR: 'fa-palette',
};

/** 'A|B| C' -> ['A', 'B', 'C'] */
export function listaDesdeTexto(valor: string | null | undefined): string[] {
  return (valor ?? '').split('|').map(x => x.trim()).filter(x => x !== '');
}

/** Error de validación del valor (el API valida igual); null si es válido. LISTA recibe el arreglo de elementos. */
export function validarParametro(tipo: TipoParametro, valor: string | string[]): string | null {
  if (tipo === 'LISTA') {
    const items = (Array.isArray(valor) ? valor : listaDesdeTexto(valor)).map(x => x.trim()).filter(Boolean);
    if (items.some(x => x.includes('|'))) { return 'Un elemento no puede contener el carácter |'; }
    const vistos = new Set<string>();
    for (const x of items) {
      if (vistos.has(x.toUpperCase())) { return `Elemento repetido en la lista: "${x}"`; }
      vistos.add(x.toUpperCase());
    }
    return null;
  }
  const texto = Array.isArray(valor) ? valor.join('|') : valor ?? '';
  switch (tipo) {
    case 'NUMERO': {
      const t = texto.trim().replace(',', '.');
      return t === '' || (!isNaN(Number(t)) && isFinite(Number(t))) ? null : 'Ingrese un número (o déjelo vacío)';
    }
    case 'TEXTO': return /[\r\n]/.test(texto) ? 'El texto simple debe ir en una sola línea' : null;
    case 'SI_NO': return ['SI', 'NO'].includes(texto.trim().toUpperCase()) ? null : 'El valor debe ser SI o NO';
    case 'COLOR': return /^#[0-9a-fA-F]{6}$/.test(texto.trim()) ? null : 'Color inválido: use el formato #RRGGBB';
    case 'JSON':
      if (!texto.trim()) { return 'JSON inválido: está vacío'; }
      try { JSON.parse(texto); return null; } catch (e) { return 'JSON inválido: ' + (e as Error).message; }
    default: return null;
  }
}

/** JSON con sangría para editar; el texto tal cual si no es válido */
export function formatearJson(texto: string): string {
  try { return JSON.stringify(JSON.parse(texto), null, 2); } catch { return texto; }
}

/** Objeto o arreglo de valores simples -> filas editables; null si tiene otra forma (se edita como texto) */
export function jsonATabla(texto: string): JsonTabla | null {
  let dato: unknown;
  try { dato = JSON.parse(texto); } catch { return null; }
  if (dato === null || typeof dato !== 'object') { return null; }
  const simple = (v: unknown) => v === null || ['string', 'number', 'boolean'].includes(typeof v);
  const fila = (clave: string, v: unknown): FilaJson => ({ clave, valor: v === null ? '' : String(v), tipo: v === null ? 'null' : typeof v as FilaJson['tipo'] });
  if (Array.isArray(dato)) {
    return dato.every(simple) ? { forma: 'arreglo', filas: dato.map((v, i) => fila(String(i), v)) } : null;
  }
  const entradas = Object.entries(dato as Record<string, unknown>);
  return entradas.every(([, v]) => simple(v)) ? { forma: 'objeto', filas: entradas.map(([k, v]) => fila(k, v)) } : null;
}

/** Filas -> texto JSON, conservando el tipo de cada valor (un número que deja de serlo pasa a texto) */
export function tablaAJson(t: JsonTabla): string {
  const valor = (f: FilaJson): unknown => {
    if (f.tipo === 'number' && f.valor.trim() !== '' && !isNaN(Number(f.valor))) { return Number(f.valor); }
    if (f.tipo === 'boolean' && ['true', 'false'].includes(f.valor.trim())) { return f.valor.trim() === 'true'; }
    if (f.tipo === 'null' && f.valor === '') { return null; }
    return f.valor;
  };
  const dato = t.forma === 'arreglo' ? t.filas.map(valor) : Object.fromEntries(t.filas.filter(f => f.clave.trim()).map(f => [f.clave.trim(), valor(f)]));
  return JSON.stringify(dato, null, 2);
}

/** Error de las filas del objeto JSON (claves vacías o repetidas); null si está bien */
export function validarTabla(t: JsonTabla): string | null {
  if (t.forma === 'arreglo') { return null; }
  const claves = t.filas.map(f => f.clave.trim());
  if (claves.some(c => !c)) { return 'Hay una fila sin clave'; }
  const repetida = claves.find((c, i) => claves.indexOf(c) !== i);
  return repetida ? `Clave repetida: "${repetida}"` : null;
}

/** Texto sin tildes y en minúsculas para buscar */
function normalizar(t: string): string {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** Búsqueda por llave, nombre o valor (sin distinguir tildes ni mayúsculas) y filtro por módulo */
export function filtrarParametros(lista: ParametroModel[], texto: string, modulo: string): ParametroModel[] {
  const palabras = normalizar(texto.trim()).split(/\s+/).filter(Boolean);
  return lista.filter(p => (!modulo || p.param_modulo === modulo)
    && palabras.every(w => normalizar(`${p.param_key} ${p.param_name} ${p.param_value} ${p.param_modulo}`).includes(w)));
}

/** Vista corta del valor en el listado */
export function resumenValor(p: Pick<ParametroModel, 'param_type' | 'param_value'>, max = 120): string {
  let t = p.param_value ?? '';
  if (p.param_type === 'JSON') {
    try { t = JSON.stringify(JSON.parse(t)); } catch { /* se muestra tal cual */ }
  }
  t = t.replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}
