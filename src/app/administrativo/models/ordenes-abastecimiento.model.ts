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
    detalles!: OrdenesAbastecimientoDetalleModel[];

    //DETALLES
    total!: number;
    kilometraje!: string;
    imprimir!: boolean;
    constructor() {
        this.orden_serie = 0;
        this.detalles = [];
    }
}

export class OrdenesAbastecimientoDetalleModel {
    orden_detalle_id!: number;
    orden_id!: string;
    orden_detalle_linea!: number;
    fk_unidad_id!: number;
    orden_detalle_nro_canecas!: number;
    orden_detalle_kilometraje!: number;
    orden_detalle_tipo_combustible!: number;
    orden_detalle_cantidad_galones!: number;
    orden_detalle_precio_total!: number;
    constructor(orden_id: string) {
        this.orden_id = orden_id;

     }
}