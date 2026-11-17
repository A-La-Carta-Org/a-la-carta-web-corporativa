# 12 · Sectores (`/sectores`, 9 páginas) y momentos (`/momentos/*`, 3 páginas nuevas)

**Estado:** hecho (fase 8, 17-11-2026) · **Prioridad:** 3 · **Depende de:** 04, 09 (configurador con `?sector=`)

## 1. Diagnóstico de sectores

Lo bueno: 9 sectores con copy propio, pares "problema → con alaCarta" muy claros, FAQ por sector,
CTA con `?sector=`.

Lo que falla:

1. **El hero enseña la maqueta del primer módulo** (TPV en 6 de 9 sectores): no se distingue un bar
   de una pizzería a simple vista.
2. **No hay "cómo sería mi configuración"**: módulos recomendados como tarjetas, sin precio ni
   equipo, y sin enlace al configurador precargado.
3. **Faltan los productos nuevos**: una pizzería necesita app propia y llamadas con IA (el teléfono
   es su canal nº 1); un restaurante, RRHH; un grupo, ERP.
4. Título de "Módulos recomendados" con una regla frágil de singularización por expresión regular
   (`replace(/s$/, '')`) que produce frases raras ("Lo que suele llevar un pubs y coctelería").
5. El índice `/sectores` es una rejilla + 3 columnas: poco útil.

## 2. Plantilla de sector nueva

1. **Hero** con visual propio por sector (`heroMockup` explícito en datos): bar → TPV modo barra;
   pizzería → pedidos + cocina; cafetería → TPV mostrador + carta QR; pub → TPV modo oscuro (ya en
   TODO); grupos → informes comparativos; take away → app propia. Icono del sector en el
   antetítulo.
2. **Problemas → soluciones** (se mantiene; revisar que cubra canales y equipo).
3. **"Un día en tu local"** (nuevo): línea horaria (apertura · comida · tarde · cena · cierre) con
   qué parte del ecosistema actúa en cada momento. Ej. pizzería: 12:00 la IA coge pedidos por
   teléfono → 13:30 la cocina ordena mostrador, app y Glovo en una cola → 23:30 cierre y stock de
   masa para mañana. Muy concreto, muy creíble.
4. **Configuración recomendada** (nuevo): plan recomendado + complementos + kit de hardware con el
   precio orientativo resultante y botón "Ajustarla en el configurador" (`/precios?sector=<slug>#configurador`).
5. **Demo relevante**: pizzería → carta con mitades; bar → simulador en modo barra; grupos →
   cambio de carta maestra en varios locales (variante D2).
6. **FAQ** (≥ 4).
7. **Otros sectores** + cierre.

Datos nuevos en `Sector`: `icon`, `heroMockup`, `dayTimeline`, `recommended: { plan, addons,
kit }`, `demo?`, `singular` (para titulares sin regex: "un bar", "una pizzería", "un grupo").

### Prioridades de copy por sector (añadir productos nuevos)

| Sector | Añadir |
| --- | --- |
| Restaurantes | Llamadas IA para reservas, RRHH (turnos partidos), ERP para compras |
| Bares | Placas QR en terraza, RRHH (fichaje), modo barra |
| Cafeterías | App propia (pedidos para llevar y puntos), placas QR |
| Pizzerías | Llamadas IA (pedidos por teléfono), app propia, pedidos online |
| Hamburgueserías | App propia, quiosco (*en camino* si se decide), pedidos online |
| Cervecerías | Stock de barriles (escandallos), placas QR |
| Pubs y coctelerías | TPV modo oscuro, RRHH (turnos de noche), control de invitaciones |
| Take away y delivery | App propia, llamadas IA, agregadores (*en camino*) |
| Grupos y cadenas | ERP multiempresa, RRHH multicentro, carta maestra, comparativas |

## 3. Índice `/sectores`

Rejilla con iconos + bloque "¿En qué momento estás?" con los tres momentos + bloque actual "Mismo
sistema, distinta configuración". Añadir "¿No ves tu tipo de local?" (hoteles con restaurante,
food trucks, obradores con venta) que lleva al formulario.

## 4. Momentos (NUEVOS) · `/momentos/*`

La investigación detectó que **nadie en España segmenta por momento** y que Toast, Square y SpotOn
convierten bien con "Abrir un local" / "Cambiar de TPV". Tres páginas con plantilla propia
(problema → plan paso a paso → configuración → FAQ → CTA):

### `/momentos/abrir-un-local`

- Para quien abre: necesita todo, decide rápido, tiene miedo al coste inicial.
- Checklist de apertura (licencias, alta en Hacienda, carta, equipo, hardware, web, Google) con lo
  que alaCarta resuelve marcado. **Lead magnet**: checklist en PDF.
- Configuración tipo + "todo listo en una semana" (puesta en marcha).
- SEO: "cómo abrir un restaurante", "abrir un bar requisitos" (informacional de alto volumen,
  hipótesis): enlazar una guía extensa en `/recursos/guias/abrir-un-restaurante`.

### `/momentos/cambiar-de-tpv`

- Miedos: perder datos, parar el local, formar al equipo, permanencia del actual.
- Plan de migración (qué importamos, cómo), cambio sin cerrar (en paralelo una semana),
  formación, VeriFactu como motivo legítimo de revisión (con la fecha correcta y el aplazamiento).
- Comparativa "lo que tienes vs ecosistema" en formato checklist.

### `/momentos/dejar-las-comisiones`

- Para quien paga agregadores y plataformas de reservas.
- Calculadora (D6) en el centro de la página; estrategia de canal propio: app, web, pedidos
  online, llamadas IA, placas QR con "pide directo la próxima vez", Google.
- Honestidad: "los agregadores te traen clientes nuevos; tu canal propio hace que vuelvan sin
  comisión. Lo sensato es usar los dos".

## 5. Criterios de aceptación

- [x] `sectors.ts` con datos nuevos y sin regex de singular.
- [x] Plantilla con "un día en tu local" y configuración recomendada enlazada al configurador.
- [x] `src/data/moments.ts` + 3 páginas de momento + menú (02).
- [x] `npm test` verde; capturas de 3 sectores y 3 momentos.

## Notas de implementación · datos (fase 1, 16-11-2026)

Solo datos y copy base en `src/data/solutions.ts`; las páginas se completan en la fase 2, así que
los criterios de este documento siguen sin marcar.

- `Sector` gana `icon` y `singular`; la regex de singular desaparece de `sectores/[slug].astro`.
- `modules` de cada sector actualizado a los slugs nuevos y con un producto nuevo donde la tabla
  de §2 lo pide (restaurantes + RRHH, pizzerías y take away + llamadas IA y app propia, grupos +
  ERP y RRHH, pubs + RRHH).
- `src/data/moments.ts` con los 3 momentos (slug, navLabel, name, tagline, icon, título, SEO,
  preocupaciones, plan, piezas y FAQ) y páginas provisionales `/momentos/[slug]`.

## Notas de implementación · fase 8 (17-11-2026)

**Sectores.** `Sector` gana `hero` (maqueta principal + móvil opcional + tarjeta flotante con chip
si el producto no está disponible), `day` (5 momentos con su pieza), `recommended` (texto, kits y
«cuando lo pida el local») y `demo`. Plantilla `/sectores/[slug]`: hero propio → problemas →
«Un día en tu local» (`DayTimeline`, horizontal en escritorio y vertical en móvil, chip «En
camino» en la pieza) → configuración recomendada (`RecommendedSetup`) → demo (`DemoBlock`) → FAQ
(4-5 por sector, `FAQPage`) → otros sectores → `CtaBand` con `origen=sector-<slug>` y `sector`.
Copy ampliado según la tabla de §2 (RRHH, llamadas IA, app propia, ERP, placas QR, modo barra y
oscuro, invitaciones, barriles), con los estados respetados.

- **Configuración recomendada sin duplicar datos**: el plan y los complementos salen de
  `sectorPresets` de `src/lib/quote.ts` (los mismos que precarga el configurador con `?sector=`)
  y el precio, de `quote()`. Se añadió `placas: true` a bares, cafeterías y cervecerías (la tabla
  de §2 pide placas QR). Las líneas de producto «en camino» llevan su chip en el ticket. El botón
  va a `/precios?sector=<slug>&origen=sector-<slug>-config#monta` (ancla `#monta` de la fase 5,
  no `#configurador`).
- **Visual del hero**: `MockTpv` y `MockKds` ahora son de datos con `mode` (`src/components/
  mockups/modes.ts`): TPV `sala` (igual que antes), `barra`, `mostrador`, `grifos` y `noche`
  (modo oscuro, redefiniendo los tokens de gris solo dentro del marco: `.device.is-night` en
  `mockups.css`); cocina `restaurante` (igual que antes), `pizzeria`, `hamburgueseria` y
  `takeaway`. Grupos usa la carta maestra (`backoffice`) con una tarjeta de comparativa entre
  locales. `SectorHeroVisual.astro` compone el conjunto sin JS.
- **Demo por sector** (una isla, `client:visible`): restaurantes, bares, cervecerías y pubs →
  simulador; cafeterías y hamburgueserías → carta QR; pizzerías → llamada (con chip y nota de
  estado); take away → calculadora de comisiones; grupos → «un cambio, todos los canales».
- Títulos SEO de los 9 sectores ≤ 60 con sufijo (antes había de 61-70) y descripciones ≤ 155.
- El hero pasa de «Monta tu alaCarta» a «Ver mi configuración» (ancla a la sección, que lleva al
  configurador): el precio ya está en la propia página.

**Índice `/sectores`.** Tarjetas con icono y el precio de la configuración tipo de cada sector
(grupos: «precio por volumen»), «¿En qué momento estás?», destacado de grupos (con ERP «en
camino»), «Mismo sistema, distinta configuración» y «¿No ves tu tipo de local?» (hoteles con
restaurante, food trucks, obradores, heladerías, playa, catering) que lleva a la demo con
`origen=sectores-otro-local`. Sin islas.

**Momentos.** `moments.ts` ampliado (`planTitle/planText`, `checklist`, `compare`, `channels`,
`setup`, `demo`, `motivo`) y plantilla completa en `/momentos/[slug]` (comentario provisional
quitado). CTA con `origen=momento-<slug>` (el formulario deduce el momento del origen) y
`motivo=comisiones` en el de comisiones.

- *Abrir un local*: checklist de apertura de 12 puntos con lo que resolvemos marcado (licencias,
  Hacienda, sanidad, datáfono y proveedores, no), «Todo listo en una semana» con los plazos de
  `onboarding.ts`, configuración tipo (Esencial + web + kit Completo + placas, por `quote()`) y
  simulador.
- *Cambiar de TPV*: plan en paralelo, qué se trae y qué no (`migrationImports/NotImported`),
  VeriFactu con las fechas de la guía (1-1-2027 empresas, 1-7-2027 autónomos, aplazamiento a 2028
  anunciado y no publicado en el BOE a 16-11-2026), comparativa «lo habitual hoy / con alaCarta»
  sin marcas y comprobador de equipo (`EquipmentChecker` gana la prop `origen`).
- *Dejar las comisiones*: calculadora completa en el centro, seis canales propios (dos «en
  camino») y la frase honesta sobre usar los dos.

**Desviaciones.** Bares usa el simulador normal (no hay «modo barra» en D1); pizzerías usa la
llamada y no la «carta con mitades» (D3 no tiene mitades); grupos usa D2 tal cual (no hay variante
multilocal). Quiosco de hamburguesería no anunciado (FAQ honesta: «hoy no»). FAQ de grupos
corregida: la facturación por sociedad va con el ERP (en camino), no «la plataforma es
multiempresa». Checklist de apertura sin PDF descargable (necesita captura de correo, igual que en
la fase 3) y sin enlace a la guía «abrir un restaurante» (no existe aún; doc 13).

**Pendientes / para Jordi.** Validar los presets por sector (son precio público orientativo en
cada página); lead magnet en PDF y guía «abrir un restaurante» (fase 9); cifras de ejemplo de las
maquetas (ventas por local, barril) son inventadas como interfaz.

**Capturas**: `docs/auditoria/capturas/fase-8/` (60 PNG). **npm test**: verde.
