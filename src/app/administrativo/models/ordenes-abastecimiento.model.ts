export class OrdenesAbastecimientoModel {
    orden_id!: string;
    orden_registro!: Date;
    orden_estado!: string;
    fk_usuario_id!: number;
    fk_unidad_id!: number;
    operador_id!: number;
    director_administrativo!: number;
    tecnico_servicios!: string | null;
    orden_codigo!: string;
    orden_codigo_serie!: string;
    orden_serie: number;
    personal_solicita!: string;
    orden_codigo_institucion!: string;
    orden_nro_vales!: string;
    orden_caneca!: string | null;
    orden_fecha!: Date | null;
    orden_estacion_servicio!: string;
    orden_total!: number;
    orden_observaciones!: string | null;

    constructor() {
        this.orden_serie = 0;
    }
}