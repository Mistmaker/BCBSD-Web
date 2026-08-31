export class Voluntarios {
    voluntario_id!: number;
    voluntario_estado!: string;
    voluntario_tipo_doc!: string;
    voluntario_doc_identidad!: string;
    voluntario_nombres!: string;
    voluntario_apellidos!: string;
    voluntario_sexo!: string;
    voluntario_imagen!: string;
    voluntario_direccion!: string;
    voluntario_telefono!: string;
    voluntario_correo!: string;
    voluntario_fingreso!: string;
    fk_usuario_id!: number;
    voluntario_fnacimiento!: string;
    voluntario_nacionalidad!: string;
    voluntario_celular!: string;
    voluntario_estadocivil!: string;
    voluntario_tiposangre!: string;
    fk_parroquia_id!: number;
    voluntario_principal!: string;
    voluntario_secundaria!: string;
    voluntario_no_casa!: string;
    voluntario_referencia!: string;
    voluntario_barrio_ciudadela!: string;
    voluntario_barrio_sector!: string;
    voluntario_titulo!: string;
    voluntario_anexo_cedula!: string;
    voluntario_cemergencia_nombre!: string;
    voluntario_cemergencia_parentesco!: string;
    voluntario_cemergencia_direccion!: string;
    voluntario_cemergencia_telefono!: string;
    voluntario_discapacidad_tiene!: string;
    voluntario_discapacidad_tipo!: string;
    voluntario_discapacidad_porcentaje!: string;
    voluntario_discapacidad_conadis!: string;
    voluntario_discapacidad_conadis_numero!: string;
    voluntario_enfermedad_cronica!: string;
    voluntario_enfermedad_cronica_describa!: string;
    voluntario_promocion!: string;

    constructor() {
        this.voluntario_estado = 'ACTIVO';
    }
}

export class VoluntariosActividades {
    actividad_id!: number;
    actividad_registro!: string;
    actividad_estado!: string;
    fk_voluntario_id!: number;
    actividad_actividad!: string;
    actividad_descripcion!: string;
    actividad_fecha_inicio!: string;
    actividad_fecha_finalizacion!: string;
    actividad_evidencia!: string;
    fk_ppersonal_id!: number;

    voluntario_nombre_completo!: string;

    constructor() {
        this.actividad_estado = 'INICIADA';
    }
}

export class AsignacionUbvModel {
    asignacion_id!: number;
    asignacion_registro!: string;
    asignacion_estado!: string;
    fk_voluntario_id!: number;
    fk_estacion_id!: number;
    fk_unidad_id!: number;
    asignacion_fecha_inicio!: string;
    asignacion_fecha_fin!: string;

    voluntario_nombre_completo!: string;
}

export class VoluntariosEventos {
    evento_id!: number;
    evento_registro!: string;
    evento_estado!: string;
    evento_fecha_inicio!: string;
    evento_hora_inicio!: string;
    evento_fecha_finalizacion!: string;
    evento_hora_finalizacion!: string;
    evento_lugar!: string;
    evento_motivo!: string;
    evento_descripcion!: string;
}

export class VoluntariosEventosParticipantes {
    evento_participante_id!: number;
    fk_evento_id!: number;
    fk_voluntario_id!: number;

    evento_motivo!: string;
    voluntario_nombre_completo!: string;
}