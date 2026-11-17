# alaCarta — Web corporativa

Web corporativa de **alaCarta**, el ecosistema de gestión para hostelería: servicio en sala y
cocina (TPV, comandero, pantalla de cocina, carta QR), clientes y canales propios (reservas,
pedidos online, app propia, llamadas con IA, clientes, web y Google), gestión del negocio
(backoffice e informes, ERP, equipo y RRHH) y equipamiento y servicios (hardware, placas QR,
puesta en marcha). Todo conectado, con una cuota por local y sin comisiones.

Este repositorio contiene **solo la web pública** (`alacarta.com`) y la documentación de
planteamiento. La aplicación (`app.alacarta.com`) y la API (`api.alacarta.com`) son proyectos
aparte: su diseño conceptual está en [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md#parte-2--el-ecosistema-futuro-planteamiento-conceptual).

## Estado

- Rama `ecosistema`: web replanteada como ecosistema (auditoría y loop de implementación en
  [`docs/auditoria/`](docs/auditoria/00-INDICE.md)). **55 páginas estáticas**, 12 islas Vue,
  `npm test` en verde.
- Marca, copy, SEO técnico, demos interactivas, configurador de precios, embudo de cuatro puertas
  y documentación hechos.
- **Pendiente de publicación**: repositorio remoto, Coolify, dominio, DNS, endpoint de formularios,
  textos legales con los datos de la sociedad y decisiones de negocio abiertas. Lista completa en
  [`docs/TODO.md`](docs/TODO.md).

## Stack

| Capa        | Elección                                        | Por qué                                                                  |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| Framework   | **Astro 7** (salida estática)                   | HTML generado en build, cero JS por defecto, SEO y rendimiento           |
| Interacción | **Vue 3 + TypeScript** (islas)                  | Solo donde hace falta: demos, configurador, calculadora y formularios    |
| Estilos     | **CSS nativo** con custom properties            | Sin preprocesador ni utilidades; tokens en `src/styles/tokens.css`       |
| Contenido   | Datos en TS (`src/data/`) y Markdown (`guias`)  | Fuente única de copy, estados y precios; guías como content collection   |
| QR          | `qrcode` en build                               | Los QR son SVG generados al compilar, sin JS en el navegador             |
| Fuentes     | Manrope + Inter, autoalojadas                   | Sin peticiones a terceros; subconjuntos latin/latin-ext                  |
| Calidad     | `astro check`, ESLint, Prettier, comprobadores  | `npm test` lo ejecuta todo                                               |
| Despliegue  | Dockerfile (Node build → nginx)                 | Preparado para Coolify; ver `docs/DESPLIEGUE.md`                         |

## Requisitos

- Node **22.23.4 o superior** (hay un `.nvmrc`; con nvm: `nvm use`).
- npm 10.

## Ejecutar

```bash
nvm use            # o asegúrate de tener Node ≥ 22.23.4
npm install
npm run dev        # http://localhost:4321
```

```bash
npm run build      # genera dist/ (55 páginas + sitemap)
npm run preview    # sirve dist/ en local
npm test           # tipos + lint + configurador + formulario + build + enlaces y anclas
```

Scripts de `npm`:

| Script                 | Qué hace                                                                     |
| ---------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                                                       |
| `npm run build`        | Compila la web estática en `dist/`                                           |
| `npm run preview`      | Sirve `dist/` en local                                                       |
| `npm test`             | `check` + `lint` + `check:quote` + `check:lead` + `build` + `check:links`    |
| `npm run check`        | Comprobación de tipos de Astro, TS y Vue                                     |
| `npm run lint`         | ESLint (Astro, Vue, TS); `lint:fix` corrige lo automático                    |
| `npm run format`       | Prettier sobre el código (`docs/` y este README quedan fuera)                |
| `npm run format:check` | Comprueba el formato sin tocar nada                                          |
| `npm run check:links`  | Enlaces internos de `dist/` y anclas (`/precios#monta`…) contra los `id`     |
| `npm run check:quote`  | 17 casos del configurador de precios (`src/lib/quote.ts`)                    |
| `npm run check:lead`   | 10 casos de lectura de parámetros del formulario (`src/lib/lead.ts`)         |
| `npm run build:brand`  | Regenera favicon, iconos, Open Graph y logotipos PNG desde SVG               |
| `npm run sync:fonts`   | Copia las fuentes desde `node_modules` a `public/fonts`                      |

Variables de entorno: copia `.env.example` a `.env`. Sin `PUBLIC_FORM_ENDPOINT`, los formularios
ofrecen enviar la solicitud por correo (mailto ya redactado) en vez de enviarla por la red. El
contrato del endpoint está en `docs/DESPLIEGUE.md` §6.

## Estructura

```
src/
├── data/            Fuente única: site, navigation, solutions (13 productos + 3 de equipamiento,
│                    4 familias, estados y conexiones), sectors, moments, pricing, faqs, home,
│                    hardware, onboarding, integrations, demo (La Plaza, el restaurante ficticio)
├── lib/             seo (títulos, canónicas, JSON-LD), cta (enlaces de conversión), quote
│                    (configurador), lead (formulario), attribution (origen de la visita)
├── content/guias/   6 guías en Markdown (content collection con fecha de revisión y fuentes)
├── styles/          tokens.css, base.css, layout.css, components.css, mockups.css, fonts.css
├── layouts/         BaseLayout (head, SEO, JSON-LD, cabecera, pie, barra móvil) y LegalLayout
├── components/
│   ├── layout/      SiteHeader (megamenús y menú móvil), SiteFooter, MobileCtaBar
│   ├── ui/          Logo, Icon (+ icons.ts), SectionHeader, Breadcrumbs, JsonLd, StatusChip,
│   │                QrCode y QrPlate (QR en build), Pending (marcador de los legales)
│   ├── blocks/      Secciones: PageHero, CtaBand, FaqList/FaqSection, SolutionGrid, SectorGrid,
│   │                EcosystemMap, ConnectionsDiagram, ReplacesTicket, PriceMini, PriceBand,
│   │                ProofPoints, HardwareCards, RecommendedSetup, DayTimeline, DemoBlock,
│   │                SectorHeroVisual, IntegrationsList, Steps, FeatureColumns
│   ├── home/        HeroStage (hero animado: TPV, comandero y comanda impresa)
│   ├── mockups/     Maquetas HTML/CSS del producto (TPV, comandero, KDS, carta, reservas,
│   │                pedidos, app, llamada, backoffice, informes, clientes, web, ERP, RRHH…)
│   └── islands/     Componentes Vue interactivos (ver tabla de islas)
└── pages/           Rutas (ver lista de páginas)
public/              favicon, iconos, og-image, fuentes, robots.txt, manifest, brand/
scripts/             check-links, check-quote, check-lead, build-brand, sync-fonts
docs/                Documentación (ver índice abajo)
```

## Páginas (55)

- `/` Inicio.
- `/soluciones` (hub con mapa del ecosistema) + **13 productos**: `tpv`, `comandero`, `cocina`,
  `carta-qr`, `reservas`, `pedidos-online`, `app-propia`, `llamadas-ia`, `clientes`,
  `web-para-restaurantes`, `backoffice`, `erp`, `rrhh`.
- `/hardware`, `/hardware/placas-qr`, `/puesta-en-marcha` (equipamiento y servicios).
- `/sectores` + **9 sectores**: restaurantes, bares, cafeterías, pizzerías, hamburgueserías,
  cervecerías, pubs y coctelerías, take away y delivery, grupos y cadenas.
- `/momentos/abrir-un-local`, `/momentos/cambiar-de-tpv`, `/momentos/dejar-las-comisiones`.
- `/precios` (planes, configurador «Monta tu alaCarta», comparativa, módulos, complementos).
- `/demo` (índice de demos) y `/demo/carta` (carta QR de ejemplo, `noindex`).
- `/herramientas/calculadora-comisiones`.
- `/recursos`, `/recursos/guias` (+ **6 guías**), `/recursos/preguntas-frecuentes`,
  `/recursos/ayuda`.
- `/por-que-alacarta`, `/locales-fundadores`, `/novedades`.
- `/solicitar-demo`, `/gracias` (`noindex`), `/contacto`.
- `/legal/aviso-legal`, `/legal/privacidad`, `/legal/cookies` (borradores, `noindex`).
- `/404` (`noindex`).

Fuera del sitemap: 404, legales, `/gracias` y `/demo/carta`. Las URL antiguas (`/soluciones/pedidos`,
`/soluciones/gestion`, `/soluciones/informes`) redirigen con 301 en `nginx.conf`.

## Islas (Vue)

Todas se pintan en el servidor (el HTML ya trae el contenido) y se hidratan solo cuando hacen
falta. Peso medido el 17-11-2026, en KB gzip, sin contar el runtime de Vue compartido (≈ 30 KB
gzip, se descarga una vez).

| Isla                       | Qué es                                                    | Dónde                                       | Carga     | KB gzip |
| -------------------------- | --------------------------------------------------------- | ------------------------------------------- | --------- | ------: |
| `ServiceSimulator` (D1)    | Comanda → cocina → caja → números en La Plaza             | home, `/demo`, 4 sectores, abrir un local   | `visible` | 7,7     |
| `ChannelsDemo` (D2)        | Cambias un precio o agotas un plato y cambia en todo      | home, `/demo`, backoffice, grupos           | `visible` | 2,5     |
| `DemoCarta` (D3)           | Carta QR de ejemplo: idiomas, alérgenos, pedido, pago     | `/demo/carta`, carta QR, 2 sectores         | `idle`/`visible` | 8,3 |
| `CallDemo` (D4)            | Tres llamadas de ejemplo con IA, sin audio                | `/soluciones/llamadas-ia`, pizzerías        | `visible` | 3,9     |
| `Configurator` (D5)        | «Monta tu alaCarta»: carta + ticket, plan más barato      | `/precios#monta`                            | `visible` | 6,2     |
| `CommissionCalculator` (D6)| Comisiones al año frente a canal propio                   | calculadora, `/precios`, comisiones, take away | `visible` | 3,3     |
| `EcosystemMapIsland` (D7)  | Mapa del ecosistema con teclado                           | `/soluciones`                               | `visible` | 3,6     |
| `PlatePreview` (D8)        | Vista previa de la placa QR con QR real                   | `/hardware/placas-qr`                       | `visible` | 2,2     |
| `EquipmentChecker`         | Comprobador de equipo en cuatro preguntas                 | `/hardware`, momento cambiar de TPV         | `visible` | 2,1     |
| `PricingPlans`             | Planes con conmutador mensual/anual                       | `/precios`                                  | `visible` | 1,3     |
| `LeadForm`                 | Formulario de demo en 3 pasos y modo «te llamamos»        | `/solicitar-demo`                           | `load`    | 7,1     |
| `ContactForm`              | Contacto (soporte, gestorías, partners, prensa)           | `/contacto`                                 | `load`    | 3,6     |

Datos compartidos por las islas: `demo.ts` (4,7 KB), `quote.ts` (3,6 KB), `pricing.ts` (2,0 KB),
`hardware.ts` (2,2 KB). Las páginas sin islas solo cargan ≈ 1,7 KB gzip de JS (atribución y
cabecera). Tabla completa por chunk y por plantilla en `docs/ARQUITECTURA.md`.

## Documentación

| Documento                                            | Contenido                                                       |
| ---------------------------------------------------- | --------------------------------------------------------------- |
| [`docs/auditoria/`](docs/auditoria/00-INDICE.md)     | Auditoría del replanteamiento como ecosistema y log del loop    |
| [`docs/NEGOCIO.md`](docs/NEGOCIO.md)                 | Ecosistema, familias, modelo comercial, embudo, fundadores      |
| [`docs/PRECIOS.md`](docs/PRECIOS.md)                 | Planes, Total, complementos, configurador y justificación       |
| [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md)       | Arquitectura de la web (datos, islas, demos) y del ecosistema   |
| [`docs/DISENO.md`](docs/DISENO.md)                   | Identidad visual, tokens, tipografía, accesibilidad             |
| [`docs/ROADMAP.md`](docs/ROADMAP.md)                 | Qué está en camino y qué hace falta para cada cosa              |
| [`docs/TODO.md`](docs/TODO.md)                       | Pendientes consolidados y decisiones para Jordi                 |
| [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md)           | GitHub, CI/CD, Coolify, dominio, SSL, variables, endpoint       |
| [`docs/INVESTIGACION.md`](docs/INVESTIGACION.md)     | Competencia, mercado, problemas del sector, SEO (síntesis)      |
| [`docs/investigacion/`](docs/investigacion/)         | Informes completos con fuentes y fechas                         |
| [`docs/ANALISIS_OFASTY.md`](docs/ANALISIS_OFASTY.md) | Análisis del proyecto de referencia y qué no replicar           |

## Convenciones

- Idioma: copy en español de España con tuteo; código y comentarios en castellano; clases CSS y
  claves en inglés.
- Todo valor visual sale de `src/styles/tokens.css`. Nada de colores o tamaños sueltos.
- Todo precio sale de `src/data/pricing.ts`; todo texto de producto, de `src/data/solutions.ts`,
  `sectors.ts`, `moments.ts`, `hardware.ts` y `onboarding.ts`. Todo CTA de conversión, de
  `ctaHref()` en `src/lib/cta.ts`.
- Honestidad estructural: cada producto e integración tiene `status`; lo que no existe lleva el
  chip «En camino». Nada de testimonios, cifras de clientes ni logotipos inventados.
- En plantillas Astro, un salto de línea entre texto y una etiqueta en línea puede comerse el
  espacio: usa `{' '}` al final de la línea de texto.
