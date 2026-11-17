# 02 · Navegación, cabecera, pie y elementos globales

**Estado:** hecho (fase 1, 16-11-2026) · **Prioridad:** 1 (base de todo lo demás) · **Depende de:** 01 (mapa de URLs)

## 1. Diagnóstico de lo que hay

| Elemento | Hoy | Problema |
| --- | --- | --- |
| Menú Soluciones | Lista plana de 9 módulos a dos columnas, sin iconos ni agrupación | No transmite *ecosistema*: parece un catálogo. Con 15+ productos sería ilegible. Nada invita a probar. |
| Menú Sectores | Lista plana de 9 sectores | Solo segmenta por tipo de local. La investigación detectó que **nadie segmenta por momento** (abrir, cambiar de TPV, dejar comisiones): hueco libre. |
| "Por qué alaCarta" en primer nivel | Página de argumentos sin prueba social | Ocupa un hueco de primer nivel que el usuario casi nunca pulsa; en una marca nueva sin clientes es la página más débil. |
| Hardware | No existe | El sector compra "llave en mano". Square, Last, Revo y Lightspeed lo tienen en primer nivel. |
| Acciones de cabecera | "Contacto" + "Solicitar demo" | Un solo camino de conversión y de alto compromiso (videollamada). No hay vía de autoservicio (probar ya) ni de bajo compromiso (que te llamen). |
| Móvil | Menú con `<details>`, botones al final | Sin barra fija de conversión: en móvil el CTA desaparece al hacer scroll. |
| Pie | 4 columnas que repiten el menú | Correcto pero no refleja familias, ni hardware, ni demos, ni herramientas. |

## 2. Estructura nueva del menú principal

Orden: **Soluciones ▾ · Sectores ▾ · Hardware · Precios · Recursos ▾**. A la derecha:
`Pruébalo` (enlace fantasma con icono de "play" → `/demo`) y `Solicitar demo` (botón primario).

"Contacto" sale de la cabecera (va al pie y a Recursos). "Por qué alaCarta" pasa a Recursos ▾ y al
pie: su contenido útil se reparte en la home.

### 2.1 Soluciones ▾ (megamenú a todo el ancho del contenedor)

Cuatro columnas por **familia** + una tarjeta destacada. Cada enlace con **icono de línea 20 px** en
un cuadrado gris de 36 px (mismo estilo que `.solution-card__icon`), nombre y una línea de
descripción.

| Servicio en sala y cocina | Clientes y canales | Gestión del negocio | Equipamiento y servicios |
| --- | --- | --- | --- |
| TPV | Reservas | Backoffice e informes | Hardware |
| Comandero | Pedidos online | ERP: compras, stock y facturación | Placas QR para mesas |
| Pantalla de cocina | App propia (reservas y delivery) | Equipo y RRHH | Web y presencia en Google |
| Carta digital QR | Llamadas con IA | | Puesta en marcha |
| | Clientes y fidelización | | |

Tarjeta destacada (columna derecha, fondo `--gray-50`, radio lg):

- Título "Pruébalo ahora, sin registrarte". Texto: "Toma una comanda en el móvil y mira cómo llega
  a cocina y a caja." Enlace "Abrir demo interactiva →" a `/demo`.
- Debajo, mini QR (SVG generado en build, 72 px) con texto "o escanea y abre la carta de ejemplo"
  → `/demo/carta`.

Pie del megamenú (filete arriba): "Ver el ecosistema completo →" (`/soluciones`) a la izquierda y
"Comparar planes →" (`/precios`) a la derecha.

### 2.2 Sectores ▾

Dos columnas + destacado:

| Tu tipo de local (con icono) | Tu momento (con icono) |
| --- | --- |
| Restaurantes · Bares · Cafeterías · Pizzerías · Hamburgueserías · Cervecerías · Pubs y coctelerías · Take away y delivery · Grupos y cadenas | Voy a abrir un local · Quiero cambiar de TPV · Quiero dejar de pagar comisiones |

Destacado: "¿Tienes varios locales?" → `/sectores/grupos-y-cadenas`.

### 2.3 Hardware (enlace directo)

`/hardware`. Ver `08-hardware-y-placas-qr.md`.

### 2.4 Recursos ▾

| Aprende | Herramientas | Empresa |
| --- | --- | --- |
| Guías · VeriFactu · Preguntas frecuentes · Centro de ayuda | Calculadora de comisiones · Monta tu alaCarta (configurador) · Demo interactiva | Por qué alaCarta · Locales fundadores · Contacto |

## 3. Iconos

El conjunto actual (`src/components/ui/Icon.astro`) tiene 23 iconos. Hay que añadir, con el mismo
estilo (24×24, trazo 1,75, `stroke-linecap/linejoin: round`, sin relleno):

- Soluciones nuevas: `erp` (caja con líneas / almacén), `team` (persona con reloj), `ai-call`
  (teléfono con onda), `app` (móvil con bolsa), `globe` (web), `printer` (hardware), `qr-plate`
  (placa con QR), `rocket` → mejor `flag` o `wrench` para puesta en marcha (nada infantil), `play`
  (demo), `calculator`, `receipt` (precio/ticket), `star`/`award` (fundadores).
- Sectores: `utensils` (restaurante), `glass` (bar), `coffee`, `pizza`, `burger`, `beer`,
  `cocktail`, `scooter` o `bag` (take away), `building` (grupos).
- Momentos: `door` (abrir), `switch`/`arrows` (cambiar), `percent-off` (comisiones).

Fuente recomendada: trazados de **Lucide** (licencia ISC, compatible) copiados al mapa `paths` con
una línea de atribución en el comentario del componente, o dibujados a mano con la misma rejilla.
No añadir una dependencia de iconos en tiempo de ejecución.

Una sola fuente de verdad: añadir `icon: IconName` a cada `Solution`, `Sector` y `Moment` en
`src/data/*` y quitar el mapa local de `SolutionGrid.astro`.

## 4. Datos de navegación

- `src/data/navigation.ts` pasa a un modelo de **megamenú**: `NavGroup` con `columns: { title,
  links: NavLink[] }[]`, `featured?: { title, text, href, label, qr? }` y `footerLinks?`.
- `NavLink` gana `icon?: IconName` y `badge?: 'nuevo' | 'pronto'` (para ser honestos con lo que
  está en plan de producto sin esconderlo: chip pequeño gris "En camino").
- Las columnas de Soluciones se generan desde `solutions` agrupando por `family` (campo nuevo).

## 5. Comportamiento

- Escritorio: apertura con clic y con hover tras 120 ms de intención (hoy solo clic); cierre con
  Escape, clic fuera y al salir 250 ms. Foco atrapado no (es navegación, no diálogo), pero orden de
  tabulación correcto y `aria-expanded`.
- El panel ocupa el ancho del contenedor, anclado bajo la cabecera, con `--shadow-md`.
- Móvil: acordeones por grupo; dentro, los títulos de columna como subtítulos pequeños y los enlaces
  con icono. Arriba del todo del menú móvil, las dos acciones (Pruébalo / Solicitar demo).
- **Barra fija móvil de conversión** (nuevo, `<720 px`): aparece tras pasar el hero, con
  "Solicitar demo" (primario) y un icono de teléfono "Te llamamos" que abre `/solicitar-demo?modo=llamada`.
  No aparece en `/solicitar-demo`, `/gracias` ni `/demo/carta`.

## 6. Pie

Cinco columnas: Servicio · Clientes y canales · Gestión · Equipamiento · Empresa/Recursos, más una
fila superior con un mini bloque de conversión: "¿Hablamos?" + correo + (teléfono cuando exista) +
botón "Solicitar demo". Mantener legal abajo. Añadir "Estado del producto / Novedades" cuando
exista (ver 13).

## 7. Qué eliminar o cambiar

- Quitar "Contacto" y "Por qué alaCarta" del primer nivel.
- Quitar el mapa `solutionIcons` duplicado de `SolutionGrid.astro`.
- Quitar "Ver todas las soluciones" como único pie del desplegable; sustituir por los dos enlaces.

## 8. Criterios de aceptación

- [x] Megamenú de Soluciones con 4 familias, iconos y tarjeta destacada con QR funcional.
- [x] Megamenú de Sectores con tipos de local y momentos, iconos.
- [x] Recursos con tres columnas. Hardware y Precios como enlaces directos.
- [x] Cabecera: "Pruébalo" + "Solicitar demo". Menú móvil con iconos y acciones arriba.
- [x] Barra fija móvil con reglas de exclusión.
- [x] Iconos nuevos en `Icon.astro`, todos con el mismo trazo; `icon` en los datos.
- [x] Teclado: Tab recorre el panel, Escape cierra y devuelve el foco al botón.
- [x] Capturas 1440 y 390 con el menú abierto revisadas.
- [x] `npm test` en verde.

## Notas de implementación (fase 1, 16-11-2026)

- **Datos**: `src/data/navigation.ts` con `NavGroup { id, columns, featured, footerLinks, wide }`,
  `NavLink { icon, badge }` y `headerActions`. Las columnas de Soluciones salen de
  `familiesWithItems()` (`solutions.ts`); Sectores, de `sectors.ts` + `moments.ts`; el pie, de
  las familias + una columna "Empresa y recursos". Badge `pronto` → chip gris "En camino".
- **Iconos**: los trazados viven en `src/components/ui/icons.ts` (datos) y `Icon.astro` los pinta;
  el tipo `IconName` se reexporta desde `Icon.astro`. Se separó en un `.ts` para poder importar
  el tipo desde `src/data/*.ts` y las islas Vue sin depender de un `.astro`. Lucide (ISC) leído
  como datos desde `npm pack lucide-static` en el scratchpad; atribución en `Icon.astro` y aviso
  de licencia completo en `icons.ts`. Dibujados a mano: `team` (persona + reloj), `app` (móvil +
  bolsa), `qr-plate` (placa con QR). Puesta en marcha usa `wrench`; bares, `wine`; take away,
  `bike`; "Te llamamos", `ai-call` (teléfono con ondas).
- **Web y presencia en Google** está en la familia **Clientes y canales** (01 §3, 06 y el brief),
  no en la columna de Equipamiento como sugería la tabla de §2.1: el menú se genera por `family`.
- **Megamenú de Soluciones**: ancho del contenedor ancho (`--container-wide`) para que las
  descripciones quepan en 2-3 líneas; los paneles de Sectores y Recursos se anclan al botón con un
  ancho calculado por columnas. Se usa solo `transform` (el minificador fusionaba `translate` y
  `transform` y se perdía el centrado).
- **"Monta tu alaCarta"** (Recursos › Herramientas) apunta a `/precios#modulos` con chip "En
  camino" hasta que exista el configurador (fase 5).
- **Hover**: apertura con 120 ms de intención y cierre a 250 ms; clic alterna; Escape cierra y
  devuelve el foco; al salir con Tab (focusout) se cierra. Verificado con Playwright.
- **Barra fija móvil** (`MobileCtaBar.astro`, < 720 px): aparece cuando el primer bloque del
  `<main>` sale de pantalla; excluida en `/solicitar-demo`, `/gracias` y `/demo/carta` (lista en
  `BaseLayout`). "Te llamamos" → `/solicitar-demo?modo=llamada&origen=barra-movil-…` (el formulario
  lo interpreta desde la fase 6: formulario corto de llamada).
- **Cabecera mínima** (`/solicitar-demo`): solo logo + "Pruébalo".
- **Arreglo de paso**: las reglas con clases puestas en componentes hijos (`.icon-close`,
  `.site-nav__chevron`, flechas de tarjetas) no aplicaban por el ámbito de estilos de Astro (el
  menú hamburguesa enseñaba los dos iconos). Ahora usan `:global()`.
- **Pie**: bloque "¿Hablamos?" con correo + "Te llamamos" + "Solicitar demo"; teléfono pendiente
  (no existe). Novedades enlazado.
- Capturas: `docs/auditoria/capturas/fase-1/menu-*.png`, `barra-movil-390.png`.
