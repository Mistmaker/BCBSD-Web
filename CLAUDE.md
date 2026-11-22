# BCBSD Web (Angular 19 + CoreUI)

Front del sistema del Cuerpo de Bomberos de Santo Domingo. El API es el repositorio BCBSD-Api (PHP + PostgreSQL).
Debe poder usarlo otro cuerpo de bomberos: datos de la institución y reglas configurables vienen del API
(`admin.tb_sistema`, `admin.tb_params`). Textos en español.

## Nuevas pantallas y privilegios (OBLIGATORIO)

Cada vez que se crea un componente con ruta nueva, o una acción que deba restringirse, en la misma tarea:

1. Ruta en el routing del módulo con `data: { permiso: 'CODIGO', title: '...' }` y `canActivate: [AuthGuard, permisoGuard]`.
2. Botones de acción visibles solo con `auth.tienePermiso('CODIGO_ACCION')`.
3. En BCBSD-Api: migración con el INSERT en `admin.tb_roles` del acceso (`rol_path` = la ruta, `rol_codigo`) y de
   cada permiso de acción (`rol_path` NULL), dentro de su submódulo, re-ejecutable; agregarla a
   `migrations/generar-script-3.py`, regenerar `script-3.sql` y `requirePermiso()` en los endpoints.
   Ver "Nuevas pantallas y privilegios" en el CLAUDE.md del API.
4. Entregar al usuario el SQL de los privilegios para que pueda asignarlos de inmediato en
   Administración > Usuarios > Privilegios (el menú se arma con lo asignado).

## Convenciones

- Componentes standalone con `loadComponent`. Modelos en `models/`, servicios en `services/` (con `environment.API_URL`).
- Lógica pura (cálculos, validaciones, formatos) en funciones exportadas del modelo, con su `.spec.ts`.
- PDF del API: abrir con `PdfService.abrir(url)` (envía el JWT); nunca un `<a href>` directo.
- Campos obligatorios: atributo `required` en el control (el CSS global agrega el "(*)" a la etiqueta).
- Gráficos: `@coreui/angular-chartjs`, paleta validada de `models/bitacora.model.ts` (claro/oscuro) y vista de tabla.

## Pruebas

- `CHROME_BIN=/opt/pw-browsers/chromium npx ng test --watch=false --browsers=ChromeHeadlessCI --include=...`
  (scripts `test:mantenimiento`, `test:bitacora`, `test:operadores`). La suite completa tiene fallas antiguas en specs
  generados por plantilla; comparar el total antes y después del cambio.
- Compilar con `npx ng build --configuration development`.
