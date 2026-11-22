import {
  claveTemporal, contarEfectivos, errorClave, filtrarArbol, loginSugerido, loginValido, marcarTodos, ModuloPrivilegios, nombrePersona, rolesMarcados,
  RolPrivilegio, todosLosRoles
} from './usuarios.model';

const rol = (id: number, extra: Partial<RolPrivilegio> = {}): RolPrivilegio =>
  ({ rol_id: id, rol_nombre: `Rol ${id}`, rol_descripcion: null, rol_path: null, rol_codigo: `COD_${id}`, tipo: 'ACCION', asignado: false, del_perfil: false, ...extra });

const arbol = (): ModuloPrivilegios[] => [
  { modulo_id: 1, modulo_nombre: 'Dir. Administrativa', submodulos: [
    { submodulo_id: 10, submodulo_nombre: 'Operadores', roles: [rol(1, { rol_nombre: 'Operadores', tipo: 'ACCESO', rol_path: '/admin/operadores', del_perfil: true }), rol(2, { asignado: true })] },
    { submodulo_id: 11, submodulo_nombre: 'Unidades', roles: [rol(3, { rol_nombre: 'Vehículos', tipo: 'ACCESO', rol_path: '/admin/vehiculos' })] },
  ] },
  { modulo_id: 2, modulo_nombre: 'Operaciones', submodulos: [{ submodulo_id: 20, submodulo_nombre: 'Partes', roles: [rol(4, { rol_nombre: 'Partes de servicio' })] }] },
];

describe('usuarios.model', () => {
  it('roles marcados excluye los del perfil', () => {
    const a = arbol();
    expect(rolesMarcados(a)).toEqual([2]);
    a[0].submodulos[0].roles[0].asignado = true; // aunque esté marcado, viene del perfil
    expect(rolesMarcados(a)).toEqual([2]);
  });

  it('cuenta pantallas y acciones efectivas (perfil + marcadas)', () => {
    expect(contarEfectivos(todosLosRoles(arbol()))).toEqual({ pantallas: 1, acciones: 1 });
  });

  it('marcar todos no toca los del perfil', () => {
    const roles = arbol()[0].submodulos[0].roles;
    marcarTodos(roles, false);
    expect(roles.map(r => r.asignado)).toEqual([false, false]);
    expect(roles[0].del_perfil).toBeTrue();
    marcarTodos(roles, true);
    expect(roles[0].asignado).toBeFalse();
    expect(roles[1].asignado).toBeTrue();
  });

  it('filtra el árbol por texto sin tildes y conserva las referencias', () => {
    const a = arbol();
    const f = filtrarArbol(a, 'vehiculos');
    expect(f.length).toBe(1);
    expect(f[0].submodulos.map(s => s.submodulo_nombre)).toEqual(['Unidades']);
    expect(f[0].submodulos[0].roles[0]).toBe(a[0].submodulos[1].roles[0]);
    expect(filtrarArbol(a, 'operaciones')[0].submodulos[0].roles.length).toBe(1); // por módulo: todo el submódulo
    expect(filtrarArbol(a, 'cod_2')[0].submodulos[0].roles.map(r => r.rol_id)).toEqual([2]);
    expect(filtrarArbol(a, '  ')).toBe(a);
  });

  it('reglas de clave iguales al API', () => {
    expect(errorClave('Bomberos2026')).toBeNull();
    expect(errorClave('Ab1')).toContain('8 caracteres');
    expect(errorClave('soloLetrasAqui')).toContain('letras y números');
    expect(errorClave('mperez2026', 'MPerez2026')).toContain('igual al usuario');
  });

  it('login: formato y sugerencia', () => {
    expect(loginValido('m.perez-1')).toBeTrue();
    expect(loginValido('josé')).toBeFalse();
    expect(loginValido('ab')).toBeFalse();
    expect(loginSugerido('María José', 'Pérez Gómez')).toBe('mperez');
    expect(loginSugerido('Ñandú', "D'Alessandro Ruiz")).toBe('ndalessandro');
    expect(loginSugerido('', '')).toBe('');
  });

  it('clave temporal cumple las reglas', () => {
    for (let i = 0; i < 20; i++) { expect(errorClave(claveTemporal())).toBeNull(); }
    expect(claveTemporal(12).length).toBe(12);
  });

  it('nombre de la persona', () => {
    expect(nombrePersona({ persona_apellidos: 'PÉREZ', persona_nombres: 'ANA' })).toBe('PÉREZ ANA');
    expect(nombrePersona({})).toContain('sin datos');
  });
});
