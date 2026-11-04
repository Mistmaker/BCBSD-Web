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

    parte_fecha_aviso = '';
    parte_hora_transferencia_ecu = '';
    parte_minuto_transferencia_ecu = '';
    parte_informacion_alertante = '';
    parte_calle_principal = '';
    parte_calle_secundaria = '';
    parte_numero_domicilio = '';
    parte_institucion_tipo = '';
    parte_institucion_propiedad = '';
    parte_observacion_institucion = '';
    parte_observacion_victimas = '';
    parte_observacion_fallecidos = '';
    parte_novedades = '';
    parte_croquis_url = '';
    parte_elaborado_por = '';
    parte_revisado_por = '';
    parte_aprobado_por = '';

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

    constructor() {
        this.parte_estado = 'REGISTRADO';
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        this.parte_fecha = `${today.getFullYear()}-${month}-${day}`;
    }
}

export class PartePersonalDetalle {
    fk_personal_id: number | null = null;
    parte_personal_rol = '';
    parte_personal_rango = '';
    parte_personal_grupo = '';
}

export class ParteVehiculoDetalle {
    fk_estacion_id: number | null = null;
    parte_vehiculo_placa = '';
    parte_vehiculo_siglas = '';
    parte_vehiculo_km_salida: number | null = null;
    parte_vehiculo_km_retorno: number | null = null;
    parte_vehiculo_hora_despacho = '';
    parte_vehiculo_hora_salida = '';
    parte_vehiculo_hora_arribo = '';
    parte_vehiculo_hora_fin_operaciones = '';
    parte_vehiculo_apoyo = '';
}

export class ParteTipoAuxilioDetalle {
    parte_auxilio_clave = '';
    parte_auxilio_clasificacion = '';
    parte_auxilio_subclasificacion = '';
    parte_auxilio_uso_tipo = '';
    parte_auxilio_especifique = '';
}

export class ParteCausaDetalle {
    parte_causa_clave = '';
    parte_causa_clasificacion = '';
    parte_causa_descripcion = '';
    parte_causa_especifique = '';
}

export class ParteRecursoDetalle {
    fk_estacion_id: number | null = null;
    parte_recurso_descripcion = '';
    parte_recurso_cantidad: number | null = null;
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
