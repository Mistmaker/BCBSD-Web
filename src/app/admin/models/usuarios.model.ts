/** Usuarios, perfiles y privilegios del sistema. */

export type EstadoRegistro = 'ACTIVO' | 'INACTIVO';

/** Usuario con los datos de su persona y perfil (el API nunca devuelve la clave). */
export interface UsuarioModel {
  usuario_id: number;
  usuario_login: string;
  usuario_estado: EstadoRegistro;
  usuario_cambiar_pass: boolean;
  usuario_registro: string | null;
  usuario_ultimo_acceso: string | null;
  fk_perfil_id: number;
  perfil_nombre: string | null;
  perfil_estado: EstadoRegistro;
  persona_id: number;
  persona_tipo_doc: string | null;
  persona_doc_identidad: string | null;
  persona_nombres: string | null;
  persona_apellidos: string | null;
  persona_correo: string | null;
  persona_celular: string | null;
  ppersonal_id: number | null;
  puesto_nombre: string | null;
  puesto_modalidad: string | null;
  es_funcionario: boolean;
  privilegios_adicionales: number;
}
/** @deprecated nombre anterior */
export type UsuariosModel = UsuarioModel;

export interface UsuarioGuardar {
  usuario_id?: number;
  persona_tipo_doc?: 'CEDULA' | 'PASAPORTE';
  persona_doc_identidad?: string;
  persona_nombres: string;
  persona_apellidos: string;
  persona_correo: string;
  persona_celular: string;
  usuario_login: string;
  clave?: string;
  fk_perfil_id: number | null;
  usuario_estado: EstadoRegistro;
}

export interface PersonaUsuario {
  persona: {
    persona_id: number; persona_tipo_doc: string; persona_doc_identidad: string; persona_nombres: string; persona_apellidos: string;
    persona_correo: string | null; persona_celular: string | null; ppersonal_id: number | null; puesto_nombre: string | null; puesto_modalidad: string | null;
  } | null;
  usuario: UsuarioModel | null;
}

export interface PerfilModel {
  perfil_id: number;
  perfil_nombre: string;
  perfil_descripcion: string | null;
  perfil_estado: EstadoRegistro;
  usuarios: number;
  usuarios_activos: number;
  privilegios: number;
  pantallas: number;
}

export interface PerfilDetalle extends PerfilModel { roles: number[]; privilegios_arbol: ModuloPrivilegios[]; }

export interface PerfilGuardar { perfil_id?: number; perfil_nombre: string; perfil_descripcion: string; perfil_estado: EstadoRegistro; roles: number[]; }

/** Privilegio: ACCESO = pantalla del menú (tiene ruta); ACCION = permiso dentro de una pantalla. */
export interface RolPrivilegio {
  rol_id: number;
  rol_nombre: string;
  rol_descripcion: string | null;
  rol_path: string | null;
  rol_codigo: string | null;
  tipo: 'ACCESO' | 'ACCION';
  /** Marcado: del perfil (pantalla de perfiles) o adicional del usuario (pantalla de usuarios) */
  asignado: boolean;
  /** Viene del perfil del usuario (no se edita en el usuario) */
  del_perfil: boolean;
}
export interface SubmoduloPrivilegios { submodulo_id: number; submodulo_nombre: string; roles: RolPrivilegio[]; }
export interface ModuloPrivilegios { modulo_id: number; modulo_nombre: string; submodulos: SubmoduloPrivilegios[]; }

export function todosLosRoles(arbol: ModuloPrivilegios[]): RolPrivilegio[] {
  return arbol.flatMap(m => m.submodulos.flatMap(s => s.roles));
}

/** rol_id marcados (sin los que vienen del perfil) */
export function rolesMarcados(arbol: ModuloPrivilegios[]): number[] {
  return todosLosRoles(arbol).filter(r => r.asignado && !r.del_perfil).map(r => r.rol_id);
}

/** Privilegios efectivos: del perfil o marcados */
export function contarEfectivos(roles: RolPrivilegio[]): { pantallas: number; acciones: number } {
  const efectivos = roles.filter(r => r.asignado || r.del_perfil);
  return { pantallas: efectivos.filter(r => r.tipo === 'ACCESO').length, acciones: efectivos.filter(r => r.tipo === 'ACCION').length };
}

/** Marca o desmarca todos los editables de un submódulo */
export function marcarTodos(roles: RolPrivilegio[], valor: boolean): void {
  roles.filter(r => !r.del_perfil).forEach(r => r.asignado = valor);
}

/** Árbol filtrado por texto (módulo, submódulo, nombre, descripción o código); conserva las referencias a los roles. */
export function filtrarArbol(arbol: ModuloPrivilegios[], texto: string): ModuloPrivilegios[] {
  const t = normalizar(texto);
  if (!t) { return arbol; }
  return arbol.map(m => ({
    ...m,
    submodulos: m.submodulos.map(s => ({
      ...s,
      roles: normalizar(m.modulo_nombre + ' ' + s.submodulo_nombre).includes(t) ? s.roles
        : s.roles.filter(r => normalizar(`${r.rol_nombre} ${r.rol_descripcion ?? ''} ${r.rol_codigo ?? ''} ${r.rol_path ?? ''}`).includes(t)),
    })).filter(s => s.roles.length),
  })).filter(m => m.submodulos.length);
}

function normalizar(s: string): string {
  return (s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

/** Mismas reglas que el API: mínimo 8 caracteres, letras y números, distinta del usuario. */
export function errorClave(clave: string | null | undefined, login = ''): string | null {
  const c = clave ?? '';
  if (c.length < 8) { return 'La clave debe tener al menos 8 caracteres'; }
  if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(c) || !/\d/.test(c)) { return 'La clave debe combinar letras y números'; }
  if (login && c.toLowerCase() === login.toLowerCase()) { return 'La clave no puede ser igual al usuario'; }
  return null;
}

/** Mismo formato que el API: 3 a 40 caracteres, minúsculas, números, punto, guion o guion bajo. */
export function loginValido(login: string | null | undefined): boolean {
  return /^[a-z0-9._-]{3,40}$/.test((login ?? '').trim().toLowerCase());
}

/** Sugerencia de usuario: inicial del primer nombre + primer apellido ('María José', 'Pérez Gómez' -> 'mperez') */
export function loginSugerido(nombres: string | null | undefined, apellidos: string | null | undefined): string {
  const limpio = (s: string) => normalizar(s).replace(/[^a-z0-9]/g, '');
  const inicial = limpio((nombres ?? '').split(/\s+/)[0] ?? '').charAt(0);
  const apellido = limpio((apellidos ?? '').split(/\s+/)[0] ?? '');
  return (inicial + apellido).slice(0, 40);
}

/** Clave temporal aleatoria que cumple las reglas (sin caracteres confusos). */
export function claveTemporal(longitud = 10, aleatorio: (n: number) => number = n => crypto.getRandomValues(new Uint32Array(1))[0] % n): string {
  const letras = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
  const numeros = '23456789';
  const todos = letras + numeros;
  const c = [letras[aleatorio(letras.length)], numeros[aleatorio(numeros.length)]];
  while (c.length < longitud) { c.push(todos[aleatorio(todos.length)]); }
  for (let i = c.length - 1; i > 0; i--) { const j = aleatorio(i + 1); [c[i], c[j]] = [c[j], c[i]]; }
  return c.join('');
}

export function nombrePersona(u: { persona_apellidos?: string | null; persona_nombres?: string | null }): string {
  return [u.persona_apellidos, u.persona_nombres].filter(Boolean).join(' ') || '(sin datos de persona)';
}
