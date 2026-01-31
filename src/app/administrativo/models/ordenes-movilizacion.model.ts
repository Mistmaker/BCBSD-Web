export class OrdenesMovilizacionModel {
    orden_id!: string;
    orden_registro!: string;
    orden_estado!: string;
    fk_usuario_id!: number;
    fk_unidad_id!: number;
    operador_id!: number;
    director_administrativo!: number;
    tecnico_servicios!: string;
    orden_codigo!: string;
    orden_serie: number;
    orden_destino!: string;
    orden_motivo_salida!: string;
    personal_solicita!: string;
    orden_hora_salida_tipo!: string;
    orden_hora_salida!: string;
    orden_kilometraje_salida!: number;
    orden_hora_entrada_tipo!: string;
    orden_hora_entrada!: string;
    orden_kilometraje_entrada!: number;
    orden_observaciones!: string;

    vehiculo_sigla!: string;
    vehiculo_chasis!: string;
    vehiculo_motor!: string;

    dir_administrativo!: string;
    solicita!: string;
    operador!: string;
    usuario!: string;
    horas_orden!: number;

    constructor() {
        this.orden_serie = 0;
        this.orden_hora_salida_tipo = "SISTEMA";
        this.orden_hora_entrada_tipo = "SISTEMA";
    }
}