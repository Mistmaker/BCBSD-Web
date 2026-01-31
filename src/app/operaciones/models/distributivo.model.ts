export class DistributivoModel {
    distributivo_id!: number;
    distributivo_registro!: string;
    distributivo_estado!: string;
    fk_usuario_id!: number;
    distributivo_codigo!: string;
    distributivo_periodo_inicio!: string;
    distributivo_periodo_cierre!: string;
    distributivo_jornadas!: number;
    distributivo_ingreso_guardia!: string;
    distributivo_salida_guardia!: string;

    grupos: GruposModel[] = [];
}

export class GruposModel {
    estacion_id!: number;
    estacion_nombre!: string;
    estacion_estado!: string;
    pelotones: PelotonesModel[] = []
}

export class PelotonesModel {
    peloton_id!: number;
    peloton_nombre!: string;
    fk_estacion_id!: number;
    fk_distributivo_id!: number;
    dist_pelo_id!: number;

    peloton_registro!: string;
    peloton_estado!: string;
    fk_usuario_id!: number;
}

export class DistPeloModel {
    dist_pelo_id!: number;
    fk_peloton_id!: number;
    fk_distributivo_id!: number;

    peloton_nombre!: string;
}

export class TropasModel {
    tropa_id!: number;
    tropa_registro!: string;
    tropa_estado!: string;
    fk_usuario_id!: number;
    fk_dist_pelo_id!: number;
    fk_personal_id!: number;
    tropa_cargo!: string;
    tropa_cargo_otro!: string;
    tropa_detalle!: string;
}