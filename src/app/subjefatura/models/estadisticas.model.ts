export class EstacionesModel {
    estacion_id!: number;
    estacion_nombre!: string;
    estacion_ubicacion_x!: string;
    estacion_ubicacion_y!: string;
    estacion_estado!: string;
}

export class TipoIncidenciaModel {
    incidencia_id!: number;
    incidencia_estado!: string;
    incidencia_registro!: string;
    incidencia_descripcion!: string;
}

export class TipoEmergenciaModel {
    emergencia_id!: number;
    emergencia_estado!: string;
    emergencia_registro!: string;
    emergencia_descripcion!: string;
}

export class CausasModel {
    causa_id!: number;
    causa_estado!: string;
    causa_registro!: string;
    causa_codigo!: string;
    causa_descripcion!: string;
}

export class NaturalezasModel {
    naturaleza_id!: number;
    naturaleza_estado!: string;
    naturaleza_registro!: string;
    naturaleza_descripcion!: string;
}

export class IntervencionesModel {
    intervencion_id!: number;
    fk_incidencia_id!: number;
    fk_emergencia_id!: number;
    fk_estacion_id!: number;
    fk_causa_id!: number;
    fk_naturaleza_id!: number;
    fk_unidad_id!: number;
    fk_personal_id!: number;
    fk_parroquia_id!: number;
    intervencion_estado!: string;
    intervencion_registro!: string;
    intervencion_fecha!: string;
    intervencion_direccion!: string;
    incidencia_beneficiarios!: number;
    incidencia_fallecidos!: number;
    intervencion_longitud!: string;
    intervencion_latitud!: string;

    incidencia_descripcion!: string;
    estacion_nombre!: string;
    emergencia_descripcion!: string;
    parish_name!: string;
}