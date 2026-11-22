/** Petición de materiales (servicios generales): documento digitado para imprimir y firmar. */

export type AutorizadoPara = 'ADQUISICION' | 'BODEGA' | null;

export interface ItemPeticion { detalle_cantidad: number | null; detalle_unidad: string; detalle_descripcion: string; }

export interface PeticionMaterialesModel {
  peticion_id: number;
  peticion_codigo: string;
  peticion_anio: number;
  peticion_serie: number;
  peticion_fecha: string;
  peticion_lugar: string | null;
  peticion_destino: string;
  peticion_autorizado_para: AutorizadoPara;
  solicitante_id: number;
  solicitante_cargo: string | null;
  solicitante_nombre: string | null;
  solicitante_puesto: string | null;
  autoriza_id: number | null;
  autoriza_cargo: string | null;
  autoriza_nombre: string | null;
  autoriza_puesto: string | null;
  peticion_observaciones: string | null;
  peticion_estado: 'EMITIDA' | 'ANULADA';
  peticion_registro: string;
  usuario: string | null;
  items: number;
  detalle?: ItemPeticion[];
}

export interface PeticionGuardar {
  peticion_id?: number;
  peticion_fecha: string;
  peticion_lugar: string;
  peticion_destino: string;
  peticion_autorizado_para: AutorizadoPara;
  solicitante_id: number | null;
  solicitante_cargo: string;
  autoriza_id: number | null;
  autoriza_cargo: string;
  peticion_observaciones: string;
  detalle: ItemPeticion[];
}

export interface ConfigPeticion {
  unidades: string[];
  autoriza: { ppersonal_id: number; nombre_completo: string; puesto_nombre: string } | null;
  ciudad: string;
}

export function itemVacio(): ItemPeticion {
  return { detalle_cantidad: null, detalle_unidad: '', detalle_descripcion: '' };
}

export function itemEnBlanco(i: ItemPeticion): boolean {
  return (i.detalle_cantidad === null || i.detalle_cantidad === undefined || (i.detalle_cantidad as unknown) === '')
    && !i.detalle_unidad?.trim() && !i.detalle_descripcion?.trim();
}

/** Errores de la petición (mismas reglas que el API). Las filas en blanco se ignoran. */
export function erroresPeticion(p: PeticionGuardar): string[] {
  const e: string[] = [];
  if (!p.peticion_destino?.trim()) { e.push('Indique en qué se utilizarán los materiales'); }
  if (!p.solicitante_id) { e.push('Seleccione al solicitante'); }
  if (!p.peticion_fecha) { e.push('Ingrese la fecha'); }
  const llenos = p.detalle.map((d, i) => ({ d, n: i + 1 })).filter(x => !itemEnBlanco(x.d));
  if (!llenos.length) { e.push('Agregue al menos un material'); }
  for (const { d, n } of llenos) {
    if (!(Number(d.detalle_cantidad) > 0)) { e.push(`Ítem ${n}: la cantidad debe ser mayor a 0`); }
    if (!d.detalle_unidad?.trim() || !d.detalle_descripcion?.trim()) { e.push(`Ítem ${n}: ingrese la unidad y la descripción`); }
  }
  return e;
}

/** Datos a enviar: sin filas en blanco y con la unidad en mayúsculas. */
export function peticionParaGuardar(p: PeticionGuardar): PeticionGuardar {
  return {
    ...p,
    detalle: p.detalle.filter(d => !itemEnBlanco(d))
      .map(d => ({ detalle_cantidad: Number(d.detalle_cantidad), detalle_unidad: d.detalle_unidad.trim().toUpperCase(), detalle_descripcion: d.detalle_descripcion.trim() })),
  };
}

export function textoAutorizadoPara(v: AutorizadoPara): string {
  return v === 'ADQUISICION' ? 'Adquisición' : v === 'BODEGA' ? 'Bodega' : 'Sin definir';
}
