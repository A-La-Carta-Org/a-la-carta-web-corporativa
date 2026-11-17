# 14 · Identidad visual: acento, serif, movimiento y motivos propios

**Estado:** aprobado por Jordi el 16-11-2026 · fusionado con el ecosistema el 17-11-2026
(tokens, serif, `.reveal`, `HeroStage`, confianza bajo el hero, banda oscura con halo y modo
noche en la home nueva) · pendiente su aplicación fina en el resto de vistas (§4) ·
**Prioridad:** transversal (se aplica en cada paso del loop, no es un paso aparte)

Se probó en la home un rediseño visual y Jordi lo aprobó. La base (tokens, Manrope, Inter,
negro, grises, maquetas HTML) **no cambia**. Lo que cambia es que la marca deja de ser
estrictamente monocroma y gana intención: un acento cálido, una serif para acentuar, movimiento
que cuenta el producto y un motivo gráfico propio (la comanda impresa).

**Regla para el loop:** cada vez que se cree o reescriba una vista (03 a 13), se construye ya
con este sistema. No hay que volver atrás al final: hay que hacerlo bien a la primera.

## 1. Qué hay ya en el código (no reescribir, reutilizar)

| Pieza | Dónde | Qué es |
| --- | --- | --- |
| Acento pimentón | `src/styles/tokens.css` → `--accent`, `--accent-hover`, `--accent-soft`, `--accent-on-dark` | `#c8471a` (4,8:1 sobre blanco). Sobre negro, `--accent-on-dark` `#f2794d` (7:1). Más anaranjado que `--color-danger` para no confundirse |
| Serif de acento | `--font-accent` (Instrument Serif cursiva, autoalojada; `fonts.css`, `npm run sync:fonts`) | Se activa con `<em>` dentro de `h1`/`h2`/`h3` (`components.css`) |
| Título con acento | `SectionHeader` acepta `<Fragment slot="title">… <em>…</em></Fragment>` | Para no partir strings en datos |
| Aparición al hacer scroll | `.reveal` en `components.css` | CSS nativo `animation-timeline: view()`, con `@supports` y `prefers-reduced-motion`. Sin JS |
| Hero animado | `src/components/home/HeroStage.astro` | TPV + comandero + **comanda impresa** en bucle de 10 s: pulsar "Enviar a cocina" → se imprime el ticket → cocina marca platos → "Listo para servir". Inclinado → plano al hacer scroll. Todo CSS |
| Bento de módulos | `src/components/home/SolutionBento.astro` | Núcleo en grande con maqueta que asoma recortada; resto compacto. Hover: icono en `--accent-soft` y flecha en acento |
| Banda oscura con calidez | `index.astro` → `.home-why-wrap` | Halo radial de pimentón al 16 % + grano SVG al 8 % |
| Maqueta en modo noche | `index.astro` → `.home-why__night` | Invierte la escala de grises redefiniendo `--white`, `--gray-*`, `--black` y estados **solo dentro del contenedor**. Sirve para cualquier maqueta |
| Detalles de home | `index.astro`, bloque `<style is:global>` con prefijo `.home` | Punto del antetítulo en acento (y "late" en el hero con `.eyebrow.is-live`), números de pasos en acento, línea de progreso que se llena al hacer scroll, hover de sectores |

## 2. Reglas de uso

1. **Un solo acento y con cuentagotas** (≈ 5 % de la superficie): punto del antetítulo, una
   palabra o línea clave del H1, iconos de confianza, estados activos, hover de tarjetas, la
   comanda impresa, líneas de progreso. **Nunca** en botones principales (siguen en negro), ni
   como fondo de sección, ni en párrafos.
2. **Serif solo en palabras de acento de titulares** (2-4 palabras, una por titular, como
   mucho). Nunca en párrafos, botones ni menús. En el H1 de la home va en color acento; en el
   resto de titulares, en el color del texto.
3. **El motivo propio es el ticket/comanda**: papel térmico (`#fffdf8`), monoespaciada, filetes
   discontinuos, borde dentado (`mask: conic-gradient(...)`, ver `HeroStage`). Úsalo para
   resúmenes, precios y confirmaciones. Las **líneas de puntos de carta** (`TPV ······ 49 €`)
   son el mismo lenguaje para listas de precio.
4. **Movimiento que cuenta el producto, no adorno.** Cada animación debe enseñar un flujo real
   (comanda que viaja, estado que cambia, dato que se propaga). Preferir CSS (keyframes,
   scroll-driven, `@starting-style`) a JS; islas solo cuando haya interacción de verdad.
   Siempre: `@supports` para scroll-driven, `prefers-reduced-motion` → estado final quieto, y
   que sin animación la composición se vea completa.
5. **Colores de estado vivos en maquetas** (verde listo, ámbar en curso, rojo retraso): dan color
   sin tocar la marca y enseñan funcionalidad.
6. **Contraste:** en secciones `.is-soft` el gris de texto ya sube a `--gray-600` (7:1). No usar
   `--gray-500` para texto sobre `--gray-50`.
7. **Lo que sigue prohibido:** testimonios, cifras o logotipos inventados; degradados de
   plantilla SaaS; blobs; iconos de colores; más de un acento.

## 3. Trampa técnica que ya ha causado tres fallos

Los estilos con ámbito de Astro (`<style>` sin `is:global`) **no llegan al HTML de un componente
hijo**, aunque se le pase `class`. Pasó con las flechas de `SectorGrid` y `SolutionGrid` (ya
corregido con `:global(...)`) y con el ancho del móvil del hero (empataba en especificidad con
`DeviceFrame`; corregido con `:global(.device.x)`).

**Sigue roto:** en móvil, la cabecera enseña a la vez el icono de menú y la X
(`SiteHeader.astro`, reglas `.site-header__burger .icon-close` / `.icon-open`, que apuntan al
SVG que pinta `Icon`). Arreglo: `.site-header__burger :global(.icon-close)` etc. Hacerlo en el
paso de navegación (02) o en el primero que toque la cabecera.

**Regla:** cuando un componente estilice algo que pinta otro componente (`Icon`, `Mockup`,
`DeviceFrame`, `SectionHeader`), usar `:global()` bajo un selector con ámbito.

## 4. Aplicación por documento

- **03 Home.** La reescritura **parte de la home actual, no de cero**: conserva `HeroStage`,
  el H1 con línea en serif y acento, la confianza justo debajo del hero, la banda oscura con
  halo, grano y maqueta en modo noche, y los detalles `.home`. Encaje con la estructura de 03:
  - Hero: si se usa el mapa del ecosistema (D7), que conserve la comanda impresa o un
    equivalente en el mismo lenguaje (ticket, placa QR, tarjeta "Llamada con IA: reserva
    confirmada" con el mismo papel y sombra). Si no, ampliar `HeroStage` con esos elementos.
  - "El ecosistema por familias" **evoluciona `SolutionBento`**: una celda grande por familia
    con su maqueta que asoma, productos con icono dentro. No volver a tarjetas iguales.
  - Simulador D1: la línea de progreso en acento pasa a ser su barra de pasos.
  - "Lo que sustituye": piezas sueltas en gris tachadas y alaCarta como **ticket** con total.
  - "Precio claro": las tres cifras grandes en Manrope y la palabra clave en serif.
- **04 Hub y plantilla de producto.** Hero de producto con `SectionHeader` + `<em>`; maqueta con
  `.reveal`; la lista de productos del hub en bento por familias (misma pieza que la home).
- **05-08 Productos.** Cada producto con su animación corta de flujo (p. ej. reserva que entra
  y se sienta en el plano; pedido online que llega a cocina como ticket). Modo noche para
  cocina y barra de noche usando la técnica de `.home-why__night`.
- **09 Precios.** El configurador "Monta tu alaCarta" **es una carta**: líneas de puntos
  (`Módulo ······ 19 €`) y el total como ticket dentado. Plan recomendado marcado con acento
  (borde o chip), no con fondo de color.
- **10 Demos.** Las demos usan el lenguaje del ticket para confirmaciones y el acento solo para
  el elemento activo. Respetar `prefers-reduced-motion`.
- **11 Embudo.** Formulario en 3 pasos con barra de progreso en acento; `/gracias` con la
  confirmación en forma de comanda ("Demo pedida · Mesa 1 · …") sin inventar datos.
- **12 Sectores.** Sin fotos reales todavía (no usar stock). Rejilla con iconos de sector y
  hover en acento; si hay tiempo, selector que cambia la maqueta del sector (pizzería: mitades;
  bar: barra y terraza).
- **13 Recursos y empresa.** Titulares con serif de acento; guías con `.reveal`.
- **QA final (paso 9).** Comprobar en 1440 y 390: acento solo donde dicen las reglas, ninguna
  maqueta tapada por otra, animaciones quietas con reducir movimiento, contraste AA, y que
  `docs/DISENO.md` sigue describiendo lo que hay.

## 5. Pendiente que necesita material real (no inventar)

Fotografía propia de locales (tratamiento cálido con grano), animación del símbolo (los cuatro
cuadrados se rellenan según módulos), prueba social real.

## 6. Criterios de aceptación

- [x] Tokens de acento y serif, utilidad `.reveal`, `SectionHeader` con slot de título.
- [x] Home con hero animado, confianza arriba, bento, banda oscura con modo noche.
- [x] Flechas de sectores y soluciones, ancho del móvil del hero, contraste en `.is-soft`.
- [x] Icono de menú y X a la vez en la cabecera móvil (ver §3): resuelto en la cabecera nueva.
- [ ] Sistema aplicado en 03-13 según §4 (hecho en la home y en piezas globales; el bento de 9
      módulos se sustituyó por el ecosistema por familias; falta el resto de vistas).
- [ ] `docs/DISENO.md` al día al terminar el loop.
