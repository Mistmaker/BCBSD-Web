export class ParteModel {
    parte_id!: number;
    parte_registro!: string;
    parte_estado!: string;
    parte_numero!: string;
    parte_tipo!: string;
    fk_estacion_id!: string;
    fk_usuario_id!: string;
    fk_personal_id!: string;
    fk_parroquia_id!: string;
    parte_fecha!: string;
    parte_forma_aviso!: string;
    parte_codigo_salida!: string;
    parte_tipo_dia!: string;
    parte_grupo_asiste!: string;
    parte_hora_aviso!: string;
    parte_hora_salida!: string;
    parte_hora_arribo!: string;
    parte_hora_finalizacion!: string;
    parte_hora_retorno!: string;
    parte_apoyo_requerido!: string;
    parte_apoyo!: string;
    parte_apoyo_otros!: string;
    parte_provincia!: string;
    parte_canton!: string;
    parte_parroquia!: string;
    parte_direccion!: string;
    parte_telefono!: string;
    parte_sector!: string;
    parte_tipo_sector!: string;
    parte_referencia!: string;
    parte_tipo_afectado!: string;
    parte_afectado_propietario!: string;
    parte_afectado_arrendatario!: string;
    parte_afectado_otros!: string;
    parte_area_destruida_m2!: string;
    parte_especies_predominantes!: string;
    parte_total_superficie_quemada!: string;
    parte_lugar_posible_inicio!: string;
    parte_personas_institucion!: string;
    parte_nombre_representante!: string;
    parte_propietario_afectado!: string;
    parte_datos_adicionales!: string;
    parte_danios_materiales!: string;
    parte_descripcion_operaciones!: string;
    parte_longitud!: string;
    parte_latitud!: string;

    constructor() {
        this.parte_estado = 'REGISTRADO';
    }
}