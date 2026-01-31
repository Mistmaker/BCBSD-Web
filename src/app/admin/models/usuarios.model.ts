export class UsuariosModel {
    usuario_id!: number;
    fk_persona_id!: number;
    fk_perfil_id!: number;
    usuario_login!: string;
    usuario_pass!: string;
    usuario_estado!: string;
    usuario_acceso_correcto!: string;
    usuario_acceso_fallido!: string;
    usuario_cambio_perfil!: string;
    fk_usuario_id!: number;
    usuario_cambiar_pass!: string;
    usuario_idioma!: string;
    usuario_webmail_user!: string;
    usuario_webmail_pass!: string;
    usuario_registro!: string;
    usuario_fingreso!: string;
}