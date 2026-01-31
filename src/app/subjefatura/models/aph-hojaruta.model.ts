export class AphHojaRuta {
    aph_hojaruta_id!: number;
    fk_responsable_atencion!: number;
    fk_tipo_emergencia!: number;
    fk_estacion_id!: number;
    fk_parroquia_id!: number;
    aph_hojaruta_registro!: string;
    aph_hojaruta_codigo!: string;
    aph_hojaruta_codigo002!: string;
    aph_hojaruta_fecha!: string;
    aph_hojaruta_direccion!: string;
    aph_hojaruta_hora_salida_estacion!: string;
    aph_hojaruta_hora_retorno_estacion!: string;

    vehiculos: AphHojaRuta_vehiculos[] = [];
    pacientes: AphHojaRuta_pacientes[] = [];
    medicamentos: AphHojaRuta_medicamentos[] = [];

    state_id!: number;
    town_id!: number;

    constructor() {
        this.vehiculos = [];
        this.pacientes = [];
        this.medicamentos = [];
    }
}

export class AphHojaRuta_tipoEmergencia {
    aph_hojaruta_tipoemergencia_id!: number;
    aph_hojaruta_tipoemergencia_descripcion!: string;
}

export class AphHojaRuta_vehiculos {
    aph_hojaruta_vehiculo_id!: number;
    fk_aph_hojaruta_id!: number;
    fk_vehiculo!: number;
    fk_operador!: string;
    aph_hojaruta_vehiculo_kilometraje_salida!: string;
    aph_hojaruta_vehiculo_kilometraje_retorno!: string;
    aph_hojaruta_vehiculo_hora_salida!: string;
    aph_hojaruta_vehiculo_hora_arribo!: string;
    aph_hojaruta_vehiculo_hora_retorno!: string;

    fk_operador_nombres!: string;
    fk_vehiculo_sigla!: string;
}

export class AphHojaRuta_pacientes {
    aph_hojaruta_paciente_id!: number;
    fk_aph_hojaruta_id!: number;
    fk_cie10!: number;
    aph_hojaruta_paciente_cedula!: string;
    aph_hojaruta_paciente_nombres!: string;
    aph_hojaruta_paciente_apellidos!: string;
    aph_hojaruta_paciente_edad!: string;
    aph_hojaruta_paciente_sexo!: string;
    aph_hojaruta_paciente_condicion_inicial!: string;
    aph_hojaruta_paciente_condicion_final!: string;
    aph_hojaruta_paciente_diagnostico_preliminar!: string;
    aph_hojaruta_paciente_destino!: string;

    cie10_descripcion!: string;
}

export class AphHojaRuta_medicamentos {
    aph_hojaruta_medicamento_id!: number;
    fk_aph_hojaruta_id!: number;
    fk_aph_hojaruta_paciente_id!: number;
    fk_medicamento!: number;
    aph_hojaruta_medicamento_presentacion!: string;
    aph_hojaruta_medicamento_cantidad!: string;


    fk_paciente_cedula!: string;
    fk_paciente_nombres!: string;
    fk_medicamento_nombre!: string;

    // aph_hojaruta_medicamento_dosis!: string;
    // aph_hojaruta_medicamento_via_administracion!: string;
    // aph_hojaruta_medicamento_frecuencia!: string;
}