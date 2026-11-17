# Diseño: identidad visual y sistema de estilos

## 1. Identidad

**Nombre**: alaCarta. Escrito siempre con la C mayúscula y el resto en minúscula, también al
principio de frase. Lectura: "a la carta", es decir, eliges los módulos que necesitas.

**Símbolo**: una rejilla de 2×2 módulos con esquinas suaves, uno relleno y tres en contorno.
Significa "elige tus módulos" y funciona a 16 px. Está en `src/components/ui/Logo.astro` y en
`public/brand/alacarta-mark.svg`. Versión horizontal (símbolo + palabra) en
`public/brand/alacarta-logo.svg` y PNG generados con `npm run build:brand`.

**Palabra**: "alaCarta" en Manrope semibold, tracking −3,5 %.

**Dominio previsto**: alacarta.com. Subdominios en `docs/ARQUITECTURA.md`.

## 2. Principios

1. **Base monocroma con un solo acento**: blanco, negro y una escala de grises neutros
   ligeramente cálidos, más el **pimentón** (`--accent`) usado con cuentagotas (≈ 5 %): punto del
   antetítulo, una palabra clave, iconos de confianza, estados activos, hover, la comanda
   impresa. Nunca en botones principales ni como fondo de sección. Los estados (correcto,
   aviso, error) siguen dentro del producto y los formularios. Decisión del 16-11-2026, detalle
   en `docs/auditoria/14-identidad-visual.md`.
2. **Mucho aire**: secciones con `--section-y` (64 a 112 px), contenedor de 1216 px, texto de lectura
   limitado a 36-44 rem.
3. **Jerarquía por tipografía, no por color**: Manrope para titulares (peso 600, tracking
   negativo), Inter para texto e interfaz, **Instrument Serif en cursiva** solo para 2-4
   palabras de acento dentro de un titular (`<em>`). Monoespaciada del sistema para cifras en
   maquetas y en la comanda impresa.
4. **Filetes antes que tarjetas**: tres o cuatro cosas en paralelo van con `.column` (línea arriba).
   Las tarjetas (`.card`) se reservan para objetos: un plan, una solución enlazable, un formulario.
5. **Sombras casi inexistentes**: solo menús desplegables y las maquetas del producto.
6. **Pocas bandas oscuras** (como mucho dos: "por qué" y el cierre) y como mucho una banda gris.
   La banda oscura puede llevar un halo de pimentón muy tenue y grano fino.
7. **Iconos de línea, pequeños, monocromos**, solo donde ayudan a reconocer (soluciones, confianza).
   El acento solo les llega en confianza (sobre `--accent-soft`) y en hover.
8. **Movimiento que cuenta el producto**: entrada suave (`.fade-up`), aparición al hacer scroll
   (`.reveal`, CSS nativo), y animaciones que enseñan un flujo real (la comanda que se imprime en
   el hero). Preferir CSS a JS. Siempre `@supports` para scroll-driven y, con
   `prefers-reduced-motion`, estado final quieto y completo.
9. **Nada de plantilla SaaS**: sin degradados, sin blobs, sin mascotas, sin ilustraciones genéricas.
   La imagen del producto son las maquetas HTML, que se ven nítidas y pesan nada.
10. **Motivo propio: la comanda impresa.** Papel térmico, monoespaciada, filetes discontinuos,
   borde dentado y líneas de puntos de carta para precios. Ver `HeroStage.astro`.

## 3. Tokens (`src/styles/tokens.css`)

### Color

| Token                 | Valor     | Uso                                  |
| --------------------- | --------- | ------------------------------------ |
| `--white`             | `#ffffff` | Fondo                                |
| `--gray-50`           | `#f8f8f7` | Banda suave, superficies secundarias |
| `--gray-100`          | `#f1f1ef` | Fondos de control, hover de menú     |
| `--gray-200`          | `#e3e3df` | Bordes y filetes                     |
| `--gray-300`          | `#cfcfca` | Bordes de input                      |
| `--gray-400`          | `#a4a49e` | Texto sutil, flechas                 |
| `--gray-500`          | `#696963` | Texto secundario                     |
| `--gray-900`          | `#151514` | Texto principal                      |
| `--black`             | `#0b0b0a` | Tinta fuerte, botón primario, banda  |
| `--color-ok`          | `#1f7a4d` | Estado correcto (solo producto/forms)|
| `--color-warn`        | `#946009` | Aviso                                |
| `--color-danger`      | `#b42318` | Error                                |
| `--accent`            | `#c8471a` | Pimentón: acento de marca (4,8:1 sobre blanco) |
| `--accent-hover`      | `#a93a13` | Acento en hover                      |
| `--accent-soft`       | `#fbece4` | Fondo de icono en hover, chips suaves|
| `--accent-on-dark`    | `#f2794d` | Acento sobre negro (7:1)             |

En secciones `.is-soft` el texto secundario sube a `--gray-600` (gris 500 sobre gris 50 no llega
a AA).

Alias semánticos (`--color-text`, `--color-border`, `--color-bg-soft`…) se usan en los componentes;
la escala solo se toca en tokens.

### Tipografía

- Familias: `--font-display` (Manrope), `--font-body` (Inter) y `--font-accent` (Instrument
  Serif, solo cursiva 400, se activa con `em` en titulares), autoalojadas con subconjuntos
  latin y latin-ext (`public/fonts`, `src/styles/fonts.css`).
- Escala fluida con `clamp`: `--text-xs` (12) a `--text-5xl` (42 → 68 px).
- Pesos: 400 texto, 500 interfaz y etiquetas, 600 titulares. Nunca 700 salvo en logotipos de
  maqueta.
- Interlineado 1,08 en H1, 1,2 en titulares, 1,65 en texto.

### Espacio, radios, sombras

- Escala de 4 px: `--space-1` (4) a `--space-32` (128).
- Radios: `--radius-sm` 6, `--radius-md` 10 (botones e inputs), `--radius-lg` 14 (tarjetas de
  enlace, ventana de navegador), `--radius-xl` 20 (tarjetas de plan), `--radius-pill` solo para
  chips y puntos.
- Sombras: `--shadow-sm` (controles), `--shadow-md` (menús), `--shadow-device` (maquetas).

### Breakpoints

Desktop-first con `max-width`: 1024 px (tablet) y 720 / 640 px (móvil). Las maquetas usan
container queries para reorganizarse según el ancho disponible, no el de la ventana.

## 4. Componentes

| Primitiva (`components.css`) | Uso                                                      |
| ---------------------------- | -------------------------------------------------------- |
| `.btn` + `.is-primary/.is-secondary/.is-ghost/.is-inverse` | Botones; `.is-lg`, `.is-sm` |
| `.link-arrow`                | Enlace secundario con flecha                             |
| `.eyebrow`                   | Antetítulo en mayúsculas con punto                       |
| `.chip`                      | Etiqueta; `.is-dark` para "Recomendado"                  |
| `.card`, `.card.is-link`     | Tarjeta de objeto                                        |
| `.column`                    | Columna con filete arriba                                |
| `.check-list`                | Lista con marca de verificación                          |
| `.section-header`            | Antetítulo + titular + entradilla                        |
| `.field`, `.input`, `.select`, `.textarea`, `.notice` | Formularios                     |

Home (`src/components/home`): `HeroStage` (TPV + comandero + comanda impresa animada),
`SolutionBento` (núcleo grande con maqueta, resto compacto). `SectionHeader` admite el título en
el slot `title` para poder usar `<em>`. Utilidad `.reveal` para aparición al hacer scroll.

**Estilos entre componentes:** un `<style>` con ámbito no alcanza el HTML que pinta un componente
hijo (`Icon`, `Mockup`, `DeviceFrame`…) aunque se le pase `class`. Usar
`.padre :global(.clase)` y, si compite con los estilos del hijo, subir especificidad
(`:global(.device.clase)`).

Bloques (`src/components/blocks`): `PageHero` (split, compact, center), `CtaBand`, `FaqList`,
`FaqSection`, `SolutionGrid`, `SectorGrid`, `Steps`, `FeatureColumns`.

## 5. Las maquetas del producto

Son HTML y CSS (`src/components/mockups`), no imágenes. Definen el **lenguaje visual del futuro
producto**:

- Fondo blanco, barra superior horizontal con pestañas (nada de sidebar).
- Negro para la selección y la acción principal; gris claro para superficies; filetes finos.
- Cifras en monoespaciada tabular.
- Estados con color solo en chips pequeños: conectado, confirmada, pendiente, agotado, retraso.
- Radios de 6-10 px, botones de altura cómoda para dedo.
- Modo noche: cualquier maqueta se oscurece envolviéndola en un contenedor que redefine
  `--white`, `--gray-*`, `--black` y los estados (ver `.home-why__night` en `index.astro`).

Maquetas: `MockTpv` (sala y cobro), `MockComandero` (móvil), `MockKds` (pase), `MockCarta`
(móvil, carta QR con pedido), `MockReservas`, `MockPedidos` (móvil, tienda), `MockBackoffice`
(carta maestra), `MockInformes`, `MockClientes`. `DeviceFrame` las envuelve en ventana o móvil.

Cuando exista producto real, las capturas sustituirán a las maquetas **manteniendo el mismo
marco y tamaño**, para que la web no cambie de aspecto.

## 6. Accesibilidad

<<<<<<< HEAD
- Contraste mínimo AA en todo el texto: gris 500 sobre blanco 5,5:1, sobre `--gray-50` 5,2:1 y sobre
  `--gray-100` 4,9:1; aviso sobre su fondo suave 4,7:1. `--gray-400` (2,5:1) solo para iconos,
  flechas y separadores decorativos, nunca para texto (ajustado en la QA del 17-11-2026).
=======
- Contraste mínimo AA en todo el texto (gris 500 sobre blanco: 4,7:1; sobre gris 50 no llega,
  por eso `.is-soft` usa gris 600). Acento sobre blanco 4,8:1; sobre negro, `--accent-on-dark`.
>>>>>>> exp/identidad-home
- Foco visible de 2 px en negro con separación de 3 px.
- Menús operables con teclado (botón con `aria-expanded`, cierre con Escape), acordeones nativos
  (`<details>`), formularios con etiquetas, errores asociados y `aria-invalid`.
- Enlace "Saltar al contenido", `lang="es"`, jerarquía de encabezados por página.
- `prefers-reduced-motion` respetado.

## 7. Lo que no se hace

- Colores de marca de terceros, logotipos ajenos, iconos de colores.
- Más de un acento. El único color de marca, además del negro, es el pimentón.
- Acento en botones principales, en párrafos o como fondo de sección.
- Tarjetas con sombra, bordes gruesos, degradados de plantilla SaaS, blobs. (El halo tenue y el
  grano de la banda oscura son la única excepción.)
- Serif en párrafos, botones o menús.
- Testimonios, cifras de clientes o logotipos que no existan.
- Textos en mayúsculas salvo antetítulos y cabeceras de tabla.
