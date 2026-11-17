# Arquitectura

Revisada el 17-11-2026 (QA final del loop del ecosistema). La parte 1 describe la web tal como
está en la rama `ecosistema`; la parte 2, el producto futuro.

## Parte 1 · La web corporativa (lo que existe hoy)

### Por qué Astro

Se eligió **Astro 7 con Vue 3 como framework de islas**:

1. **Salida estática real**: cada URL es un archivo HTML completo, sin hidratación global. Un bot,
   un preview de WhatsApp o un lector sin JavaScript ven la página entera, demos incluidas (las
   islas se pintan en el servidor y tienen alternativa sin JS).
2. **Cero JavaScript por defecto**: una página sin demos carga ≈ 1,7 KB gzip de JS. Solo las
   demos, el configurador, la calculadora y los formularios cargan Vue, y solo en sus páginas.
3. **Vue sigue ahí**: los componentes interactivos son Vue 3 + TypeScript (`src/components/islands`).
4. **Content collections** con esquema validado (Zod) para las guías en Markdown.
5. **Sitemap, canónicas y rutas dinámicas** resueltos por el framework.

Regla: Astro para todo lo estático; Vue solo para lo que reacciona a eventos.

### Datos como fuente única

Ninguna página escribe copy de producto ni precios: los lee de `src/data/` y de `src/lib/`. Un
cambio se hace una vez y aparece en menú, hub, fichas, sectores, precios, configurador, novedades,
pie, JSON-LD y sitemap.

| Archivo                | Qué contiene                                                                     |
| ---------------------- | -------------------------------------------------------------------------------- |
| `data/solutions.ts`    | 4 familias, 13 productos de software y 3 de equipamiento y servicios. Por producto: `family`, `icon`, `status` (`disponible` · `piloto` · `en-camino`), `connections` (con su propio estado), `replaces`, `demo`, `hardware`, `heroVariant`, features, prueba con fuente y FAQ |
| `data/pricing.ts`      | Planes (Esencial 49, Completo 99, Total 159, Grupos a medida), descuento anual, complementos, módulos sueltos, dispositivos, servicios, fundadores, comparativa por piezas y `solutionPricing(slug)`, que da el precio de cada ficha |
| `data/sectors.ts`      | 9 sectores: problemas → respuestas, «un día en tu local», configuración recomendada (preset de `quote.ts`), demo, FAQ |
| `data/moments.ts`      | 3 momentos de compra (abrir, cambiar de TPV, dejar las comisiones)              |
| `data/hardware.ts`     | Dispositivos, kits, requisitos de «usa el tuyo», comprobador de equipo, placas   |
| `data/onboarding.ts`   | Línea temporal de la puesta en marcha, migración y estrategia local              |
| `data/integrations.ts` | Integraciones con servicios de fuera (pagos, agregadores, gestoría, Google), cada una con estado |
| `data/demo.ts`         | La Plaza, el restaurante ficticio de todas las demos: carta, alérgenos, mesas, llamadas |
| `data/faqs.ts`         | FAQ global por familias (muchas preguntas se reutilizan de `solutions.ts`)      |
| `data/navigation.ts`   | Megamenús, pie y legales, derivados de los datos anteriores                     |
| `data/site.ts`, `home.ts` | Datos del sitio y textos propios de la home                                  |

Lógica pura (sin DOM ni Vue, comprobada en `npm test`):

| Módulo            | Qué hace                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `lib/quote.ts`    | El configurador: de una configuración a un ticket (líneas, total mensual y anual, ahorro, pagos únicos, «en tu propuesta»). Elige el camino más barato (Esencial con sueltos, Completo o Total). Serializa la configuración en `config=` y la describe en texto. Presets por sector. `npm run check:quote` (17 casos) |
| `lib/lead.ts`     | El formulario: opciones de cada paso, `parseLeadParams()` (lee `modulo`, `sector`, `plan`, `motivo`, `modo`, `origen`, `equipo` y `config` en sus tres formatos: configurador, placa QR y calculadora) y `buildMailto()`. `npm run check:lead` (10 casos) |
| `lib/cta.ts`      | `ctaHref()`: todos los enlaces de conversión pasan por aquí y llevan contexto (`origen`, `modulo`, `sector`, `config`…). Cuatro puertas: probar, calcular, te llamamos, demo. `demoCta()` activa la demo de cada producto |
| `lib/attribution.ts` | Atribución propia en `sessionStorage` (página de entrada, referrer, `utm_*`, simulador completado). Sin cookies ni terceros; todo con try/catch |
| `lib/seo.ts`      | `pageTitle`, canónicas y generadores de JSON-LD                                           |

### Estructura de `src/`

```
src/
├── data/            Fuente única (tabla de arriba)
├── lib/             Lógica pura y helpers (tabla de arriba)
├── content/guias/   6 guías Markdown con publishedAt, reviewedAt, fuentes, momentos y CTA
├── styles/          tokens → base → layout → components → mockups (main.css los importa)
├── layouts/         BaseLayout (head, SEO, JSON-LD, cabecera, pie, barra móvil), LegalLayout
├── components/
│   ├── layout/      SiteHeader (megamenús con iconos y tarjeta «Pruébalo» con QR, menú móvil),
│   │                SiteFooter (familias, empresa, integraciones), MobileCtaBar
│   ├── ui/          Logo, Icon + icons.ts (Lucide, ISC), StatusChip, QrCode, QrPlate, Pending…
│   ├── blocks/      Secciones reutilizables (hero, CTA, FAQ, mapa, conexiones, precio…)
│   ├── mockups/     Maquetas HTML/CSS del producto y DeviceFrame
│   └── islands/     Vue (tabla de islas)
└── pages/           Rutas estáticas y dinámicas ([slug] con getStaticPaths)
```

Las rutas de soluciones, sectores, momentos y guías se generan desde los arrays: añadir un producto
es añadir un objeto en `solutions.ts`.

### Islas y demos

| Isla                         | Demo | Página principal                     | Hidratación | KB gzip |
| ---------------------------- | ---- | ------------------------------------ | ----------- | ------: |
| `ServiceSimulator.vue`       | D1   | `/demo#simulador`, home, sectores    | `visible`   | 7,7 |
| `ChannelsDemo.vue`           | D2   | `/demo`, home, backoffice, grupos    | `visible`   | 2,5 |
| `DemoCarta.vue`              | D3   | `/demo/carta`, carta QR              | `idle` / `visible` | 8,3 |
| `CallDemo.vue`               | D4   | `/soluciones/llamadas-ia`, pizzerías | `visible`   | 3,9 |
| `Configurator.vue`           | D5   | `/precios#monta`                     | `visible`   | 6,2 |
| `CommissionCalculator.vue`   | D6   | `/herramientas/calculadora-comisiones` (completa) y reducida en precios, comisiones y take away | `visible` | 3,3 |
| `EcosystemMapIsland.vue`     | D7   | `/soluciones` (SVG estático `EcosystemMap.astro` como alternativa) | `visible` | 3,6 |
| `PlatePreview.vue`           | D8   | `/hardware/placas-qr`                | `visible`   | 2,2 |
| `EquipmentChecker.vue`       | —    | `/hardware#comprobador`, cambiar de TPV | `visible` | 2,1 |
| `PricingPlans.vue`           | —    | `/precios#planes`                    | `visible`   | 1,3 |
| `LeadForm.vue`               | —    | `/solicitar-demo`                    | `load`      | 7,1 |
| `ContactForm.vue`            | —    | `/contacto`                          | `load`      | 3,6 |

Principios comunes: se pintan en el servidor con un estado inicial útil; tienen alternativa sin
JS; se manejan con teclado; anuncian los cambios en una región `aria-live`; respetan
`prefers-reduced-motion`; leen sus datos de `data/` y `lib/` (nunca cifras escritas a mano); no
guardan nada fuera de `sessionStorage`. Runtime de Vue compartido: ≈ 30 KB gzip, una vez.

JS por plantilla (KB gzip, 17-11-2026): sin islas 1,7 · producto con demo 41-46 · home y `/demo`
47,9 · `/precios` 49,4 (tres islas) · `/solicitar-demo` 50,7 y `/contacto` 47,2 (se cargan al
entrar). Con `client:visible`, las demos solo se descargan al acercarse a ellas.

### QR generados en build

`QrCode.astro` genera con `qrcode` un SVG monocromo en tiempo de compilación (sin JS en el
navegador) con URL absoluta (`https://alacarta.com/demo/carta?...`), pensado para escanearlo con
otro dispositivo: megamenú «Pruébalo», `/demo`, carta QR, hero de la home y placas. `QrPlate.astro`
lo monta en una placa de mesa; en móvil el pie cambia a un enlace. `PlatePreview.vue` reutiliza el
SVG generado en build y solo cambia el marco.

### Embudo: CTA, formulario, atribución y endpoint

1. **Cuatro puertas** desde cualquier página: probar (`/demo`, `/demo/carta`), calcular
   (`/precios#monta`, calculadora), que te llamen (`/solicitar-demo?modo=llamada`) y pedir demo.
   `CtaBand` cierra cada plantilla con las tres salidas y un `origen` obligatorio.
2. **Contexto**: todo enlace sale de `ctaHref()` con `origen` y, según el caso, `modulo`, `sector`,
   `plan`, `motivo`, `equipo` o `config`. `LeadForm` lo lee con `parseLeadParams()` y lo resume en
   «Lo que nos traes».
3. **Formulario** en 3 pasos (tu local · qué te interesa · cómo hablamos) o modo llamada (nombre,
   teléfono, franja). Validación accesible, honeypot y consentimiento.
4. **Atribución**: `BaseLayout` llama a `captureAttribution()` en cada página; el formulario adjunta
   entrada, referrer, UTM y si el visitante completó el simulador.
5. **Envío**: JSON por POST a `PUBLIC_FORM_ENDPOINT` → `/gracias?tipo=demo|llamada|propuesta|fundador|contacto`.
   Sin endpoint (hoy), botón «Enviar por correo» con el `mailto:` redactado → `/gracias?…&via=correo`.
   Contrato del endpoint en `docs/DESPLIEGUE.md` §6.
6. **Conversión**: `/gracias` dispara `window` → `alacarta:conversion` (`detail.tipo`) al cargar, para
   que la analítica que se elija lo escuche. Hoy no hay analítica.

### Rutas y SEO técnico

- `trailingSlash: 'never'` y `build.format: 'file'` → `/precios.html` servido en `/precios`.
- Canónica, Open Graph, Twitter Card y `robots` por página desde `BaseLayout`. Títulos ≤ 60 y
  descripciones de 70 a 155 caracteres; un `h1` por página (las variantes de `/solicitar-demo` y
  `/gracias` son `span` dentro de un único `h1`).
- `noindex`: `/404`, `/gracias`, `/demo/carta` y los legales mientras sean borradores. Todos ellos
  fuera del sitemap (`astro.config.mjs`). `robots.txt` bloquea `/legal/`.
- JSON-LD: `Organization` y `WebSite` en todas; `BreadcrumbList` en interiores; `SoftwareApplication`
  con `Offer` orientativa (de `solutionPricing()`) en los productos con precio; `Service` en web,
  hardware, placas y puesta en marcha; `FAQPage` solo donde hay FAQ visible; `Article` en guías;
  `ContactPage` en contacto. Nunca `aggregateRating` ni `review`.
- 301 en `nginx.conf` para los slugs antiguos (`pedidos`, `gestion`, `informes`).
- Fuentes autoalojadas; sin peticiones a terceros; sin cookies.

### Calidad

`npm test` = `astro check` + ESLint + `check:quote` + `check:lead` + build + `check:links` (enlaces
internos y anclas contra los `id` reales de `dist/`). `.github/workflows/ci.yml` ejecuta lo mismo.
Prettier formatea `src/` y `scripts/` (`docs/` está en `.prettierignore`).

### Despliegue

`Dockerfile` multi-etapa (Node 22 build → nginx alpine). `nginx.conf` sirve `*.html` sin extensión,
cachea `_astro/` un año, nunca cachea HTML, redirige barra final, aplica los 301 y devuelve
`404.html`. Ver `docs/DESPLIEGUE.md`.

---

## Parte 2 · El ecosistema futuro (planteamiento conceptual)

Nada de esto está desarrollado. Es el mapa para que la web, la marca y las decisiones de negocio
sean coherentes con lo que vendrá.

**Origen técnico de cada familia** (`docs/auditoria/01` §3; solo en documentación, nunca en la web):
servicio, canales y backoffice se construyen como alaCarta; el **ERP** parte de GestiTec Negocio
(construido en rama, sin desplegar, sin integración con el TPV) y **Equipo y RRHH** de GestiTec
Personal (en producción), ambos con una variante de build con marca alaCarta que está por hacer;
las **llamadas con IA** necesitan un proveedor de voz por decidir; hardware y placas, un proveedor.
Lo que falta para cada pieza está en `docs/ROADMAP.md`.

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
