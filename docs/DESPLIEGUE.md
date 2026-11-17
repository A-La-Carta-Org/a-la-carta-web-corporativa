# Despliegue

Pasos futuros para publicar `alacarta.com`. **Nada de esto se ha ejecutado**: no hay repositorio
remoto, ni aplicación en Coolify, ni DNS tocado. Todo está preparado para hacerlo en orden.

## 1. Repositorio en GitHub

1. Crear la organización `alacarta` (o usar la cuenta existente) y el repositorio privado
   `alacarta-web-corporativa`.
2. En local:
   ```bash
   git remote add origin git@github.com:<org>/alacarta-web-corporativa.git
   git push -u origin main
   ```
3. Proteger `main`: PR obligatoria, CI en verde, sin force-push.
4. Ramas: `main` (producción), `develop` (integración, opcional al principio), ramas cortas
   `feat/*`, `fix/*`, `docs/*`.
5. Activar Dependabot para npm (actualizaciones mensuales agrupadas).

## 2. Integración continua

`.github/workflows/ci.yml` ya existe: en cada push y PR ejecuta tipos, lint, formato, build y
comprobación de enlaces, y sube `dist/` como artefacto. No despliega.

Opcional más adelante: previsualización por PR (Coolify soporta "preview deployments" desde PR).

## 3. Coolify

1. En Coolify, **nuevo recurso → Aplicación → desde repositorio Git** (GitHub App conectada).
2. Build pack: **Dockerfile** (el del repositorio). Puerto expuesto: `80`.
3. Variables de entorno marcadas como **Build Variable** (se hornean en el bundle):
   - `PUBLIC_FORM_ENDPOINT`
   - `PUBLIC_ANALYTICS_PROVIDER` y `PUBLIC_ANALYTICS_ID` (vacías si no hay analítica)
4. Dominio: `alacarta.com` y `www.alacarta.com` (redirigir `www` al apex en Coolify o en nginx).
5. Despliegue automático desde `main` (webhook de GitHub).
6. Healthcheck: el Dockerfile ya lo define (`wget` a `/`).
7. Recursos: la web estática necesita muy poco (128 MB de RAM sobran).

Primer despliegue: **staging** en `staging.alacarta.com` con `robots` bloqueado (añadir cabecera
`X-Robots-Tag: noindex` en Coolify o una variante de `nginx.conf`) antes del dominio real.

## 4. Dominio, DNS y SSL

1. Comprobar disponibilidad y registrar `alacarta.com` (y, si es viable, `alacarta.es`, `.app`).
   Si el `.com` no estuviera disponible, decidir alternativa antes de publicar nada (ver TODO).
2. DNS (en el registrador o en Cloudflare):
   - `A alacarta.com → IP del VPS`
   - `CNAME www → alacarta.com`
   - Subdominios futuros: `app`, `api`, `tpv`, `carta`, `pedidos`, `reservas`, `staging`.
   - Correo: `MX`, `SPF`, `DKIM`, `DMARC` del proveedor de correo elegido.
3. SSL: Coolify emite y renueva certificados Let's Encrypt automáticamente al asignar el dominio.
   Forzar HTTPS en el proxy.
4. Cabeceras de seguridad: ya en `nginx.conf` (nosniff, frame options, referrer, permissions).
   Añadir `Strict-Transport-Security` en el proxy cuando HTTPS esté estable.

## 5. Variables de entorno

| Variable                    | Dónde     | Qué hace                                               |
| --------------------------- | --------- | ------------------------------------------------------ |
| `PUBLIC_FORM_ENDPOINT`      | build     | URL que recibe los formularios (POST JSON)             |
| `PUBLIC_ANALYTICS_PROVIDER` | build     | Proveedor de analítica (vacío = ninguno)               |
| `PUBLIC_ANALYTICS_ID`       | build     | Identificador de analítica                             |
| `ASTRO_TELEMETRY_DISABLED`  | build     | Ya fijado a 1 en el Dockerfile                         |

`.env.example` documenta cada una. `.env` nunca se sube.

## 6. Formularios

El formulario envía JSON a `PUBLIC_FORM_ENDPOINT`. Opciones, de más simple a más propia:

1. Servicio de formularios con endpoint JSON y notificación por correo.
2. Función serverless o pequeño servicio en el VPS (Coolify) que valida, guarda y reenvía al
   correo y al CRM.
3. La futura API de alaCarta (`api.alacarta.com/leads`).

Sea cual sea, debe: aceptar CORS desde `alacarta.com`, responder `2xx` en JSON, limitar
frecuencia, y guardar el consentimiento con fecha y origen.

Contrato que ya usa la web (fase 6, `docs/auditoria/11`):

- **Con JavaScript**: `POST` con `Content-Type: application/json`. Demo y llamada
  (`src/components/islands/LeadForm.vue`): `tipo` (`demo|llamada|propuesta|fundador`), datos del
  local, `productos`, contacto, `preferencia`, `franja`, contexto de la URL (`origen`, `motivo`,
  `plan`, `config`, `config_tipo`, `equipo`, `resumen`) y atribución (`entrada`, `referrer`,
  `llegada`, `utm_*`, `demo_completada`). Contacto (`ContactForm.vue`): `tipo: "contacto"`,
  `motivo`, `nombre`, `email`, `empresa`, `mensaje`. Con `2xx`, la web redirige a
  `/gracias?tipo=…`; con error, ofrece el correo.
- **Sin JavaScript**: el mismo formulario hace un `POST` normal (`application/x-www-form-urlencoded`)
  al endpoint, con un campo `redireccion` (`/gracias?tipo=demo` o `/gracias?tipo=contacto`). El
  endpoint debería aceptar los dos formatos y, en el envío sin JS, redirigir a esa ruta.
- **Sin endpoint** (hoy): la web abre el correo con la solicitud ya escrita y lleva a
  `/gracias?…&via=correo`. Sin JS, el formulario se envía a `mailto:` (texto plano).

## 7. Build y release

- Versionado semántico en `package.json` y etiquetas `vX.Y.Z` en Git para cada publicación.
- `npm test` antes de etiquetar.
- Coolify despliega al hacer push a `main`; una etiqueta documenta qué se publicó.
- Rollback: redeploy de la imagen anterior desde Coolify.

## 8. Checklist de publicación

Antes del primer despliegue público:

- [ ] Dominio registrado y DNS apuntando al VPS.
- [ ] Textos legales con la sociedad titular, NIF y dirección; revisados por asesor.
- [ ] Correo `hola@` y `soporte@` operativos (y SPF/DKIM/DMARC).
- [ ] `PUBLIC_FORM_ENDPOINT` funcionando y probado con un envío real.
- [ ] Cifras de `src/data/pricing.ts` confirmadas o nota "orientativo" mantenida.
- [ ] `npm test` en verde en CI.
- [ ] Staging revisado en móvil y escritorio.
- [ ] Open Graph comprobado en un validador de previsualizaciones.
- [ ] Search Console verificada y sitemap enviado.
- [ ] Monitorización de disponibilidad activada.
- [ ] Copia de seguridad del repositorio (GitHub ya lo es; etiqueta `v1.0.0`).

Después del despliegue:

- [ ] Comprobar `curl -I https://alacarta.com/precios` (200, canonical correcto, sin barra final).
- [ ] Comprobar `/404` para una URL inexistente.
- [ ] Comprobar que `/legal/*` lleva `noindex`.
- [ ] Lighthouse en móvil: rendimiento, accesibilidad y SEO por encima de 95.
