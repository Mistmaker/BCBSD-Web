export class PersonalModel {
    personal_id!: number;
    personal_registro!: string;
    personal_estado!: string;
    fk_usuario_id!: number;
    fk_persona_id!: number;
    fk_estacion_id!: number;
    personal_contrasenia!: string;
    personal_cambiar_pass!: boolean;
    personal_notificar_acceso_exitoso!: boolean;
    personal_notificar_acceso_fallido!: boolean;
    personal_notificar_cambios_perfil!: boolean;
    personal_notificar_permisos!: boolean;
    personal_notificar_eventos!: boolean;
    personal_correo_institucional!: string;
    biometrico_id!: number;
    fk_jornada_id!: number;
    conductor_estado!: string;
    ppersonal_id!: number;
    conductor_id!: string;
    licencia_categoria!: string;
    persona_doc_identidad!: string;
    persona_apellidos!: string;
    persona_nombres!: string;
    puesto_nombre!: string;
    conductor_licencia_validez!: string;
    nombre_completo!: string;
}