# Despliegue del front BCBSD en Apache

## Compilación

Requiere Node.js 20.11+ o 22 (ver `engines` en `package.json`).

```bash
npm ci
npm run build
```

Publicar en Apache el contenido de `dist/coreui-free-angular-admin-template/browser/`.

- La app usa rutas con `#` (`withHashLocation`) y `<base href="./">`, así que **no necesita reglas de reescritura**
  y puede vivir en cualquier subcarpeta.
- La URL del API de producción está en `src/environments/environment.ts` (`API_URL`, sin barra final).
  `ng serve` usa `environment.development.ts`.

## Sesión (JWT)

- El API devuelve un token al iniciar sesión; dura 8 horas por defecto (configurable en el API con `JWT_EXP_SECONDS`).
- `src/app/auth/auth.interceptor.ts` agrega `Authorization: Bearer <token>` a toda petición al API y,
  si el API responde `401`, cierra la sesión y vuelve al login.
- `AuthService.isAuthenticated()` exige un token no vencido (ya no basta con tener `usuario` en `localStorage`).
- Los reportes PDF se abren con `PdfService` (descarga con `HttpClient` + pestaña nueva), porque un `<a href>` no puede enviar el token.

## Pruebas

```bash
npm run test:auth   # pruebas de sesión, interceptor, guard y PDF (Chrome headless)
npm run test:ci     # toda la suite
```

En servidores sin Chrome, definir `CHROME_BIN` con la ruta de Chromium.
