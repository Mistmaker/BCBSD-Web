export class Direccion {
    direccion_id!: number;
    direccion_sigla!: string;
    direccion_nombre_direccion!: string;
}

export class TipoDocumento {
    tipodocumento_id!: number;
    tipodocumento_tipo!: string;
}

export class Documento {
    documento_id!: number;
    documento_direccion_origen_id!: number; // FK to Direccion
    documento_direccion_destino_id!: number; // FK to Direccion
    documento_tipo_documento_id!: number; // FK to TipoDocumento
    documento_numero_documento!: string;
    documento_numero_folio!: number;
    documento_fecha_documento!: Date;
    documento_remitente!: string;
    documento_destinatario!: string;
    documento_asunto!: string;
    documento_archivo_escaneado!: Uint8Array; // BYTEA type
    documento_ubicacion_fisica!: string;
    documento_anio!: number;
}

export class ActaEntrega {
    acta_entrega_id!: number;
    acta_entrega_documento_id!: number; // FK to Documento
    acta_entrega_fecha_entrega!: Date;
    acta_entrega_receptor!: string;
    acta_entrega_descripcion!: string;
}

export class RegistroRetorno {
    retorno_id!: number;
    retorno_acta_entrega_id!: number; // FK to ActaEntrega
    retorno_fecha_retorno!: Date;
    retorno_receptor!: string;
    retorno_descripcion!: string;
}