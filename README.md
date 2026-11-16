# alaCarta — Web corporativa

Web corporativa de **alaCarta**, plataforma integral de gestión para hostelería (TPV, comandero,
pantalla de cocina, carta QR, reservas, pedidos online, backoffice, informes y clientes).

Este repositorio contiene **solo la web pública** (`alacarta.com`) y la documentación de
planteamiento del producto. La aplicación (`app.alacarta.com`) y la API (`api.alacarta.com`)
son proyectos futuros: su diseño conceptual está en [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md).

## Estado

- Web completa y funcional en local, 36 páginas estáticas, compilando sin errores.
- Marca, copy, SEO técnico, maquetas del producto y documentación hechos.
- **Pendiente de publicación**: repositorio remoto, Coolify, dominio, DNS, formularios, legal.
  La lista completa y accionable está en [`docs/TODO.md`](docs/TODO.md).

## Stack

| Capa        | Elección                                        | Por qué                                                                 |
| ----------- | ----------------------------------------------- | ----------------------------------------------------------------------- |
| Framework   | **Astro 7** (salida estática)                   | HTML generado en build, cero JS por defecto, SEO y rendimiento máximos  |
| Interacción | **Vue 3 + TypeScript** (islas)                  | Solo donde hace falta: selector de precios y formularios                |
| Estilos     | **CSS nativo** con custom properties            | Sin preprocesador ni utilidades; tokens en `src/styles/tokens.css`      |
| Contenido   | Datos en TS (`src/data/`) y Markdown (`guias`)  | Fuente única de copy y precios; guías como content collection           |
| Fuentes     | Manrope + Inter, autoalojadas                   | Sin peticiones a terceros; subconjuntos latin/latin-ext                 |
| Calidad     | `astro check`, ESLint, Prettier, check de links | `npm test` lo ejecuta todo                                              |
| Despliegue  | Dockerfile (Node build → nginx)                 | Preparado para Coolify; ver `docs/DESPLIEGUE.md`                        |

Decisión de stack razonada en [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md#por-qué-astro).

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
npm run build      # genera dist/ (36 páginas + sitemap)
npm run preview    # sirve dist/ en local
npm test           # tipos + lint + build + enlaces internos
```

Otros scripts:

| Script                | Qué hace                                                        |
| --------------------- | --------------------------------------------------------------- |
| `npm run check`       | Comprobación de tipos de Astro, TS y Vue                        |
| `npm run lint`        | ESLint (Astro, Vue, TS)                                         |
| `npm run format`      | Prettier sobre todo el código                                   |
| `npm run check:links` | Verifica que todos los enlaces internos de `dist/` existen      |
| `npm run build:brand` | Regenera favicon, iconos, Open Graph y logotipos PNG desde SVG  |
| `npm run sync:fonts`  | Copia las fuentes desde `node_modules` a `public/fonts`         |

Variables de entorno: copia `.env.example` a `.env`. Sin `PUBLIC_FORM_ENDPOINT`, los formularios
muestran una alternativa por correo en vez de enviar.

## Estructura

```
src/
├── data/            Fuente única de contenido: sitio, navegación, soluciones, sectores, precios, FAQ
├── content/guias/   Guías en Markdown (content collection)
├── styles/          tokens.css, base.css, layout.css, components.css, mockups.css, fonts.css
├── layouts/         BaseLayout (head, SEO, JSON-LD, header, footer) y LegalLayout
├── components/
│   ├── layout/      SiteHeader, SiteFooter
│   ├── ui/          Logo, Icon, SectionHeader, Breadcrumbs, JsonLd
│   ├── blocks/      PageHero, CtaBand, FaqList, SolutionGrid, SectorGrid, Steps, FeatureColumns
│   ├── mockups/     Maquetas del producto en HTML/CSS (TPV, comandero, KDS, carta, reservas…)
│   └── islands/     Componentes Vue interactivos (PricingPlans, LeadForm)
├── lib/seo.ts       Títulos, canónicas y generadores de JSON-LD
└── pages/           Rutas: /, soluciones, sectores, precios, por-que-alacarta, recursos, demo, contacto, legal, 404
public/              favicon, iconos, og-image, fuentes, robots.txt, manifest, brand/
scripts/             check-links, build-brand, sync-fonts
docs/                Documentación del proyecto (ver índice abajo)
```

## Páginas

- `/` Inicio
- `/soluciones` + 9 páginas: TPV, comandero, cocina (KDS), carta QR, reservas, pedidos, gestión, informes, clientes
- `/sectores` + 9 páginas: restaurantes, bares, cafeterías, pizzerías, hamburgueserías, cervecerías, pubs y coctelerías, take away y delivery, grupos y cadenas
- `/precios`, `/por-que-alacarta`
- `/recursos`, `/recursos/preguntas-frecuentes`, `/recursos/guias` (+3 guías), `/recursos/ayuda`
- `/solicitar-demo`, `/contacto`
- `/legal/aviso-legal`, `/legal/privacidad`, `/legal/cookies` (borradores, `noindex`)
- `/404`

## Documentación

| Documento                                      | Contenido                                                      |
| ---------------------------------------------- | -------------------------------------------------------------- |
| [`docs/ANALISIS_OFASTY.md`](docs/ANALISIS_OFASTY.md) | Análisis del proyecto de referencia y qué no replicar     |
| [`docs/INVESTIGACION.md`](docs/INVESTIGACION.md)     | Competencia, mercado, problemas del sector, SEO (síntesis) |
| [`docs/investigacion/`](docs/investigacion/)         | Informes completos con fuentes y fechas                   |
| [`docs/NEGOCIO.md`](docs/NEGOCIO.md)                 | Propuesta de valor, posicionamiento, sectores, monetización |
| [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md)       | Arquitectura de la web y del ecosistema futuro             |
| [`docs/DISENO.md`](docs/DISENO.md)                   | Identidad visual, tokens, tipografía, principios UI/UX     |
| [`docs/PRECIOS.md`](docs/PRECIOS.md)                 | Estrategia de precios, planes y justificación              |
| [`docs/ROADMAP.md`](docs/ROADMAP.md)                 | MVP, fases y evolución                                     |
| [`docs/TODO.md`](docs/TODO.md)                       | Hecho, pendiente, bloqueado y decisiones                   |
| [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md)           | GitHub, CI/CD, Coolify, dominio, SSL, variables, checklist |

## Convenciones

- Idioma: código y comentarios en castellano; nombres de clases CSS y claves en inglés.
- Todo valor visual sale de `src/styles/tokens.css`. Nada de colores o tamaños sueltos.
- Todo precio sale de `src/data/pricing.ts`. Todo texto de producto, de `src/data/solutions.ts`
  y `src/data/sectors.ts`.
- Nada de testimonios, cifras de clientes ni logotipos inventados. Si no existe, no se enseña.
