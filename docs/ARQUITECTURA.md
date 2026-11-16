# Arquitectura

## Parte 1 · La web corporativa (lo que existe hoy)

### Por qué Astro

La preferencia inicial era Vue 3 + TypeScript + Vite. Se ha elegido **Astro 7 con Vue 3 como
framework de islas** por estas razones:

1. **Salida estática real**: cada URL es un archivo HTML completo, sin hidratación global. Un bot,
   un preview de WhatsApp o un lector sin JavaScript ven la página entera. Ofasty tuvo que añadir
   `vite-ssg` y pelear con el CSS crítico para conseguir esto a medias.
2. **Cero JavaScript por defecto**: la web pesa lo que pesa su HTML y su CSS. Solo el selector de
   precios y los formularios cargan Vue, y solo en esas páginas (`client:visible`, `client:load`).
3. **Vue sigue ahí**: los componentes interactivos son Vue 3 + TypeScript (`src/components/islands`).
   Si mañana se necesita más interacción, se añade otra isla sin cambiar nada.
4. **Content collections** con esquema validado (Zod) para las guías en Markdown.
5. **Sitemap, canónicas y rutas dinámicas** resueltos por el framework; menos scripts propios.
6. **Un solo lenguaje de plantillas** para el 95 % de la web, muy cercano a HTML.

Coste: dos sintaxis (Astro y Vue SFC). Se mitiga con una regla: Astro para todo lo estático, Vue
solo para lo que reacciona a eventos.

### Estructura

```
src/
├── data/               Fuente única de contenido (TS tipado)
│   ├── site.ts         Dominio, nombre, contacto, promesas operativas
│   ├── navigation.ts   Menú principal, pie y legales (derivados de solutions y sectors)
│   ├── solutions.ts    9 módulos: copy, features, FAQ, relaciones, disponibilidad
│   ├── sectors.ts      9 sectores: problemas, respuestas, módulos recomendados, FAQ
│   ├── pricing.ts      Planes, módulos sueltos, dispositivos, servicios y cálculos
│   ├── faqs.ts         Preguntas generales agrupadas
│   └── home.ts         Textos propios de la home
├── content/guias/      Guías Markdown (content collection, esquema en content.config.ts)
├── styles/             Tokens → base → layout → components → mockups (main.css los importa)
├── layouts/            BaseLayout (head, SEO, JSON-LD, header, footer), LegalLayout
├── components/
│   ├── layout/         SiteHeader (menús, móvil), SiteFooter
│   ├── ui/             Logo, Icon, SectionHeader, Breadcrumbs, JsonLd
│   ├── blocks/         Secciones reutilizables
│   ├── mockups/        Maquetas del producto + DeviceFrame + Mockup (despachador)
│   └── islands/        Vue: PricingPlans, LeadForm
├── lib/seo.ts          pageTitle, canonical, generadores JSON-LD
└── pages/              Rutas (estáticas y [slug] con getStaticPaths)
```

Reglas:

- Una página no escribe copy de producto: lo lee de `data/`. Un cambio de precio o de texto se hace
  una vez.
- Las rutas de soluciones y sectores se generan desde los arrays; añadir un módulo es añadir un
  objeto en `solutions.ts` (aparece en menú, home, índice, pie, precios y sitemap).
- Todo valor visual sale de `tokens.css`.

### Rutas y SEO técnico

- `trailingSlash: 'never'` y `build.format: 'file'` → `/precios.html` servido en `/precios`.
- `<link rel="canonical">`, Open Graph, Twitter Card y `robots` por página desde `BaseLayout`.
- JSON-LD: `Organization` y `WebSite` global; `BreadcrumbList` en interiores; `SoftwareApplication`
  en soluciones; `FAQPage` donde hay preguntas; `Article` en guías; `ContactPage` en contacto.
- `sitemap-index.xml` generado por `@astrojs/sitemap`, excluyendo 404 y legales.
- `robots.txt` apunta al sitemap y bloquea `/legal/`.
- Fuentes autoalojadas y precargadas; sin peticiones a terceros; sin cookies.

### Formularios

`LeadForm.vue` envía un JSON por POST a `PUBLIC_FORM_ENDPOINT`. Sin endpoint, muestra una
alternativa por correo. Validación propia, honeypot, consentimiento explícito. El endpoint real se
decide en `docs/TODO.md` (opciones: función serverless propia, servicio de formularios, o la futura
API de alaCarta).

### Calidad

`npm test` = `astro check` (tipos) + ESLint + build + `check-links` (enlaces internos en `dist/`).
`.github/workflows/ci.yml` ejecuta lo mismo en cada push.

### Despliegue

`Dockerfile` multi-etapa (Node 22 build → nginx alpine). `nginx.conf` sirve `*.html` sin extensión,
cachea `_astro/` un año, nunca cachea HTML, redirige barra final y devuelve `404.html`. Ver
`docs/DESPLIEGUE.md`.

---

## Parte 2 · El ecosistema futuro (planteamiento conceptual)

Nada de esto está desarrollado. Es el mapa para que la web, la marca y las decisiones de negocio
sean coherentes con lo que vendrá.

### Dominios

| Dominio                    | Qué es                                            | Tecnología prevista               |
| -------------------------- | ------------------------------------------------- | --------------------------------- |
| `alacarta.com`             | Web corporativa (este repo)                       | Astro estático                    |
| `app.alacarta.com`         | Backoffice: carta, locales, equipo, informes, clientes, facturación | SPA Vue 3 + TS (o Nuxt si SSR aporta) |
| `tpv.alacarta.com`         | TPV táctil (PWA, modo sin conexión)                | PWA Vue 3, IndexedDB, Service Worker |
| `comandero.alacarta.com`   | Comandero móvil (PWA instalable)                   | Misma base que TPV, vista móvil   |
| `cocina.alacarta.com`      | Pantalla de cocina (KDS)                           | PWA, WebSocket                    |
| `carta.alacarta.com/<slug>`| Carta QR pública por local; opción de dominio propio del cliente | Astro/SSR o Vue, muy ligero |
| `pedidos.alacarta.com/<slug>` | Tienda de pedidos online por local             | Igual que carta, con pago         |
| `reservas.alacarta.com/<slug>` | Widget y página de reservas                   | Igual                             |
| `api.alacarta.com`         | API REST + WebSocket (tiempo real) + webhooks       | Ver abajo                         |
| `ayuda.alacarta.com`       | Centro de ayuda (opcional; hoy `/recursos/ayuda`)   | Astro                             |

Alternativa: una sola app `app.alacarta.com` con rutas `/tpv`, `/comandero`, `/cocina` que comparten
código y sesión. Decisión a tomar al diseñar la app (ver `ROADMAP.md`).

### Backend y datos

- **API**: un monolito modular bien separado por dominios (identidad, catálogo, ventas, cocina,
  reservas, pedidos, clientes, informes, facturación, suscripción). Lenguaje por decidir (TypeScript
  con NestJS/Fastify, o PHP con Laravel; ambos encajan con el equipo y el VPS actual). Se
  recomienda TypeScript para compartir tipos con los frontends.
- **Base de datos**: PostgreSQL. Multi-tenant por **columna `organization_id` en cada tabla** con
  Row Level Security, no por base de datos separada (más barato de operar, más fácil de consolidar
  informes de grupo). Un `organization` tiene N `companies` (sociedades) y N `locations` (locales).
- **Tiempo real**: WebSocket (o SSE) para comandas → cocina, agotados → todos los dispositivos,
  reservas → TPV.
- **Sin conexión**: TPV y comandero funcionan con cola local (IndexedDB) y sincronizan con
  resolución de conflictos por `location` y `device`.
- **Ficheros**: almacenamiento S3-compatible para fotos de carta y documentos.
- **Caché y colas**: Redis para sesiones, pub/sub y trabajos (correos, informes, remisión fiscal).

### Identidad, roles y permisos

- Autenticación por correo + contraseña con 2FA opcional; PIN corto en dispositivos de local (TPV,
  comandero) para cambiar de usuario en segundos.
- Jerarquía: **organización → empresa → local → dispositivo**. Un usuario pertenece a la
  organización y tiene **roles por local** (propietario, gerente, encargado, camarero, cocina,
  asesoría solo lectura).
- Permisos finos para acciones sensibles (anular, descuento, abrir cajón, ver informes, editar
  carta, cerrar caja), todo registrado en el **registro de actividad**.
- Tokens de dispositivo revocables; sesión de dispositivo separada de la de usuario.

### Aislamiento de datos

- RLS en PostgreSQL por `organization_id`; el API nunca consulta sin contexto de organización.
- Claves de cifrado por organización para datos sensibles de clientes.
- Exportación completa por organización (obligación RGPD y promesa de la web).
- Copias diarias con retención de 30 días y prueba de restauración mensual.

### Suscripciones y facturación de alaCarta al cliente

- Modelo: suscripción por local + módulos + dispositivos (ver `PRECIOS.md`).
- Proveedor de cobro recurrente: Stripe Billing (SEPA y tarjeta), con facturación a nombre de la
  sociedad titular. Periodo de prueba sin tarjeta gestionado en la app.
- Estados: prueba → activa → impagada (gracia) → suspendida → cancelada. Los dispositivos se
  bloquean, los datos nunca se borran durante la suspensión.

### Facturación fiscal del cliente (lo que emite el TPV)

- Registros de facturación encadenados y firmados conforme al Reglamento VeriFactu, código QR en
  tickets, modalidad VeriFactu (remisión a la AEAT) como opción por defecto, soporte TicketBAI
  previsto para País Vasco.
- Series por empresa y local; factura completa a partir de ticket; anulación y rectificación con
  motivo y usuario.

### Integraciones (por orden de valor)

1. Pasarelas de pago (Stripe, Adyen o similar; datáfonos integrados).
2. Impresoras térmicas (ESC/POS por red; servicio local de impresión en el TPV).
3. Contabilidad y asesoría (exportación estándar primero; conexiones directas después).
4. Agregadores de reparto (Glovo, Uber Eats, Just Eat) hacia la misma cola de cocina.
5. Reservas externas (Google Reserve, TheFork, CoverManager) hacia el mismo libro.
6. API pública y webhooks para grupos.

### Observabilidad y operación

- Registros estructurados, trazas y métricas (OpenTelemetry) desde el inicio.
- Monitorización de disponibilidad externa y alertas.
- Entornos: local, staging, producción. Despliegue con Coolify en el VPS actual y ruta de salida a
  un proveedor gestionado cuando el volumen lo exija.

### Lo que esta arquitectura permite vender hoy en la web

- "Una carta, un dato, un cambio": porque todos los frontends leen el mismo API y la misma base.
- "Multiempresa y multilocal desde el primer día": porque el modelo de datos nace así.
- "Sin comisiones": porque el cobro al cliente final lo hace su pasarela, no nosotros.
- "Funciona sin internet": porque TPV y comandero se diseñan offline-first.
