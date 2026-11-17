# 04 · Hub de soluciones (`/soluciones`) y plantilla de producto (`/soluciones/[slug]`)

**Estado:** hecho (fase 2; mapa interactivo D7 hecho en la fase 4) · **Prioridad:** 1 · **Depende de:** 01, 02, 10 (D7)

## 1. Diagnóstico

**Hub actual:** "Nueve módulos. Un sistema." + rejilla "plan base" + rejilla "módulos" + lista de 9
bloques alternos (maqueta + texto). Es correcto pero largo y plano: 9 secciones iguales, sin mapa,
sin familias y con la división "plan base / módulos" que mezcla precio con producto.

**Plantilla de producto actual:** hero con maqueta → "Qué hace" (6 columnas) → "Cómo encaja con el
resto" (3 columnas de texto) → relacionados + sectores → FAQ → cierre. Problemas:

1. **Todas las páginas son idénticas** en ritmo y peso visual. Un TPV y unas reservas no se venden
   igual.
2. **"Conectado" es texto**: la única promesa diferencial se cuenta con tres párrafos.
3. **El precio es una línea gris** bajo los botones. El visitante de producto quiere saber cuánto
   cuesta *esto* y qué más necesita.
4. **No hay prueba ni demostración** dentro de la página (ni siquiera un "así se ve en el móvil").
5. **No hay venta cruzada de equipamiento** (TPV sin decir qué terminal, KDS sin pantalla, carta QR
   sin placas).
6. **Sin "antes / después"**: el hostelero no ve qué deja de hacer o de pagar.
7. CTA único repetido ("Solicitar demo"), aunque bien parametrizado con `?modulo=`.

## 2. Modelo de datos (`src/data/solutions.ts`)

Añadir a `Solution`:

```ts
family: 'servicio' | 'canales' | 'gestion' | 'equipamiento';
icon: IconName;
status: 'disponible' | 'piloto' | 'en-camino';
statusNote?: string;            // "Previsto para 2.º trimestre de 2027"
replaces?: string[];            // lo que deja de hacer/pagar: "libreta de comandas", "app de reservas con coste por comensal"
connections: { to: SolutionSlug; text: string; status?: 'en-camino' }[]; // sustituye a connected
demo?: 'simulador' | 'carta' | 'cambio-canales' | 'llamada' | 'placa' | null;
hardware?: HardwareSlug[];      // equipamiento recomendado (08)
pricing: { kind: 'plan' | 'complemento'; planFrom: PlanId; addonId?: string };
heroVariant?: 'device' | 'split' | 'demo';
proofPoints?: { value: string; label: string; source?: string }[]; // cifras de MERCADO con fuente, nunca de clientes
```

Y crear `families` con nombre, icono, claim y orden. El menú, el hub, el footer, la home, el
configurador y precios leen de aquí.

## 3. Hub `/soluciones` — estructura nueva

1. **Hero compacto**: "Un ecosistema. Todo tu restaurante." + entradilla + CTAs (Solicitar demo ·
   Pruébalo).
2. **Mapa del ecosistema** (D7) a todo el ancho. Leyenda: "Toca un producto para ver con qué se
   conecta".
3. **Cuatro familias**, cada una como sección con: claim de familia, texto de 2 líneas, tarjetas de
   sus productos (icono, nombre, tagline, chip de estado si aplica) y **una** maqueta o demo
   representativa (Servicio → simulador reducido; Canales → móvil con app; Gestión → informes;
   Equipamiento → kit + placa).
4. **"Cómo viaja un dato"**: tres historias cortas en horizontal que cruzan familias:
   - *Una reserva*: llamada con IA → libro de reservas → mesa en el TPV → ficha de cliente → campaña.
   - *Un plato*: escandallo en backoffice → carta QR/TPV/app → comanda → cocina → stock descontado →
     pedido a proveedor en el ERP.
   - *Una hora de trabajo*: turno publicado en RRHH → fichaje → ventas de esa hora → coste de personal
     sobre ventas.
   Cada paso con su icono y marcado "en camino" donde la integración no exista.
5. **Elige por dónde empezar**: tres caminos con precio (Esencial · Completo · Total) y enlace al
   configurador.
6. **Cierre**.

Se elimina: la lista de 9 bloques alternos maqueta/texto (la información vive en cada página) y la
división "plan base / módulos".

## 4. Plantilla `/soluciones/[slug]` — estructura nueva

1. **Hero** (variante según `heroVariant`): antetítulo con icono + familia, H1 orientado a
   resultado, entradilla, CTAs (`Solicitar demo` con `?modulo=` · secundario contextual: "Pruébalo"
   si hay demo, "Ver precio" si no), y bajo los botones una **mini-tarjeta de precio** (no una línea
   gris): "Incluido en Completo · o 19 €/mes sobre Esencial" + chip de estado si no está disponible.
2. **"Lo que dejas de hacer"** (nuevo, si `replaces`): 3-4 líneas tachadas en gris → frase de
   resultado. Corto, tipo ticket.
3. **Qué hace** (se mantiene, 6 puntos), con iconos pequeños por punto opcionales.
4. **Demo o maqueta en grande** (si `demo`): la isla correspondiente con título "Pruébalo".
5. **Conectado con el resto** (rediseño): diagrama radial pequeño — el producto en el centro y sus
   `connections` alrededor, con icono, nombre enlazado y una frase. Las integraciones aún no hechas
   con chip "en camino". Este bloque es el corazón del mensaje de ecosistema.
6. **Equipamiento recomendado** (si `hardware`): 2-3 tarjetas de dispositivo con "o usa el tuyo"
   y enlace a `/hardware`.
7. **Para quién** (sectores donde más aporta) + **momentos** relacionados.
8. **Precio** (banda corta): plan donde se incluye, precio suelto, enlace "Móntalo en el
   configurador" con el producto preseleccionado (`/precios?add=<slug>#configurador`).
9. **FAQ** del producto (mínimo 4 preguntas; hoy hay 3).
10. **Cierre** con título contextual ("Ver el TPV con tu carta") y tercera opción "Te llamamos".

Las páginas pueden **activar u omitir** bloques por datos; no hacer 16 plantillas.

## 5. Criterios de aceptación

- [x] `solutions.ts` con el nuevo modelo y 16 productos (los de 05, 06, 07 y 08 que vivan bajo
      `/soluciones`; hardware y puesta en marcha tienen página propia pero entrada en familias).
      (Fase 1: 13 productos + 3 entradas de equipamiento; sin `pricing` ni `proofPoints`, ver notas.)
- [x] Hub nuevo con mapa, familias, historias de datos. (Mapa interactivo D7 desde la fase 4; sin JS, el estático.)
- [x] Plantilla con bloques condicionales; ninguna página rota si falta un campo opcional.
- [x] Chips de estado coherentes en menú, tarjetas, hero y precios.
- [x] JSON-LD `SoftwareApplication` solo para productos de software; `Service` para web y puesta
      en marcha; `Product` para hardware.
- [x] `npm test` en verde y capturas revisadas de hub y de 3 productos de familias distintas.

## Notas de implementación (fase 1 · modelo de datos, 16-11-2026)

Hecho solo el §2 (modelo de datos) y una agrupación provisional por familias; §3 (hub completo) y
§4 (plantilla con bloques condicionales) quedan para la fase 2.

- `src/data/solutions.ts`: tipos `FamilyId`, `SolutionSlug` (13), `EquipmentSlug` (`hardware`,
  `placas-qr`, `puesta-en-marcha`), `EcosystemSlug`, `SolutionStatus`, `DemoKey`, `Connection
  { to, title, text, status? }`. `Solution` gana `family`, `icon`, `status`, `statusNote?`,
  `replaces?`, `connections` (sustituye a `connected`), `demo?`, `hardware?`, `heroVariant?` y
  `schemaType?` (`service` para la web → JSON-LD `Service`). Se elimina `availability`.
- `families` (servicio, canales, gestion, equipamiento) con `name`, `shortName`, `claim`, `text`,
  `icon`, `order`; `equipment` con las 3 entradas de equipamiento; vista común `ecosystem`
  (`EcosystemItem` con `path` e `isSolution`) y ayudas `getItem`, `itemsByFamily`,
  `familiesWithItems`, `statusLabels`. Menú, pie, hub, precios, novedades y rejillas leen de aquí.
- Slugs: `pedidos` → `pedidos-online`; `gestion` + `informes` → `backoffice` (desaparecen).
  Actualizados `pricing.ts`, `sectors.ts`, guía de VeriFactu y textos; redirecciones 301 en
  `nginx.conf` (la web no estaba publicada, pero no cuesta nada). Claves de maqueta renombradas
  para no confundirse con slugs: `pedidos` → `tienda-online`, `informes` → `panel-ventas`.
- **Estado** (decisión de Jordi): `en-camino` solo en `app-propia`, `llamadas-ia` y `erp`, con
  `statusNote` "sin fecha cerrada"; el resto `disponible`. Integraciones no construidas con
  `status: 'en-camino'` (TPV↔ERP, TPV↔RRHH, backoffice↔ERP/RRHH, comandero↔RRHH, cocina↔ERP,
  clientes↔llamadas IA, placas→app, carta QR→reseñas en Google).
- **Desviaciones**: no se añade `pricing: { kind, planFrom, addonId }` a `Solution` (el precio
  sigue en `pricing.ts`; entra en la fase 5 con el plan Total y los complementos). No se añaden
  `proofPoints` (necesitan fuentes; fase 2). `heroVariant: 'demo'` está puesto en carta QR pero la
  plantilla aún no lo usa.
- Maquetas provisionales para lo nuevo: app propia → `tienda-online`, llamadas IA → `reservas`,
  web → `carta`, ERP → `panel-ventas`, RRHH → `reservas`. Se sustituyen en la fase 2.
- Plantilla `/soluciones/[slug]` (fase 1): antetítulo con icono + familia, chip y nota de estado
  en el hero, secundario "Pruébalo" si hay `demo` o "Ver precio", conexiones con icono, enlace y
  filete discontinuo + chip si están en camino, línea de precio "en tu propuesta" para lo que no
  tiene tarifa, CTA con `ctaHref()`.
- `/soluciones` agrupado por familias (4 secciones + accesos por familia); se quitó la lista de
  bloques alternos y la división "plan base / módulos".
- Capturas: `docs/auditoria/capturas/fase-1/soluciones-*.png`, `rrhh-*.png`, `erp-*.png`.

## Notas de implementación (fase 2 · hub y plantilla, 17-11-2026)

**Hub `/soluciones`** (`src/pages/soluciones/index.astro`): hero compacto → mapa del ecosistema →
cuatro familias (claim, texto, tarjetas en 2 columnas y una maqueta: TPV, app propia, panel de
ventas y placa QR que funciona) → «Cómo viaja un dato» (banda gris, tres historias con línea
discontinua y chip donde la integración no existe; datos en `dataStories` de `solutions.ts`) →
«Por dónde empezar» (tres caminos, `startingPaths()` en `pricing.ts`) → cierre.

- **Mapa**: `src/components/blocks/EcosystemMap.astro`, aislado y sin props. SVG en escritorio
  (núcleo «Un solo sistema», 16 piezas en elipse por familias, radios continuos o discontinuos
  según `status`, cada pieza enlaza a su página); en ≤ 720 px, lista por familias. La fase 4 lo
  sustituye por la isla D7 leyendo los mismos datos.
- Se quita la barra de accesos por familia de la fase 1: el mapa y las secciones la sustituyen.

**Plantilla `/soluciones/[slug]`** (bloques condicionales por datos, documentados en la cabecera
del archivo): hero con maqueta (o placa QR escaneable si `heroVariant: 'demo'`; en móvil, botón
«Abrir la carta de ejemplo») y **mini-tarjeta de precio** (`PriceMini`) con el chip de estado →
«Lo que dejas de hacer» (`ReplacesTicket`, `replaces` + `outcome` nuevo) → Qué hace (`features`, o
`featureGroups` en backoffice; `Feature.status` pinta chip) → Pruébalo (solo si la demo ya existe)
→ **diagrama radial** (`ConnectionsDiagram`: producto en el centro, conexiones alrededor, líneas
discontinuas y chip «En camino»; lista vertical en ≤ 860 px) → datos del sector (`proofPoints`) →
equipamiento (`HardwareCards`) → para quién (`forWho`, sectores, momentos, guías por `related`
de la colección) → **banda de precio** (`PriceBand`, `#precio`) → FAQ → cierre con
`closingTitle` y tres salidas (`CtaBand` admite ahora `links`).

- **Precio centralizado**: `solutionPricing(slug)` en `src/data/pricing.ts` es la única lectura
  de precio por producto (mini-tarjeta, banda, JSON-LD). Lo que no tiene tarifa sale «En tu
  propuesta» con la forma de cobro de `addonUnits`. La fase 5 solo cambia datos (plan Total,
  complementos) y el tercer camino de `startingPaths()`.
- **CTA**: `ctaHref` admite `add` (`/precios?add=<slug>#modulos`, para el configurador de la
  fase 5) y `demoCta(demo, origen)` decide si hay «Pruébalo»: hoy solo `simulador` (→ `/demo`) y
  `carta`/`placa` (→ `/demo/carta`); `llamada` y `cambio-canales` devuelven `null` hasta la
  fase 4 y la página ofrece «Ver precio»/«Monta tu alaCarta».
- **JSON-LD**: `SoftwareApplication` con `offers` solo si hay precio público (49 € para lo
  incluido en Esencial, 99 € para lo incluido en Completo) y `operatingSystem` «Web» en gestión;
  `Service` para la web. Sin `aggregateRating` ni reseñas. `Service` de puesta en marcha y
  `Product` de hardware quedan para la fase 3 (08), fuera de `/soluciones`.
- **SEO**: los 13 productos con `<title>` completo (con « | alaCarta») ≤ 60 y descripción ≤ 155.
  Se acortaron los `seoTitle` de TPV, reservas y pedidos online, que pasaban de 60 con el sufijo.
- `proofPoints` solo en reservas (TheFork, CoverManager) y RRHH (Randstad Research/Linkers y RDL
  8/2019 con fecha de revisión). Pedidos online no lleva cifra: la fuente del 14-30 % es un
  competidor sin contrastar (ver calculadora).
- Placa QR extraída a `src/components/ui/QrPlate.astro` (la usan placas, carta QR y el hub).
- **Desviaciones**: el bloque «Relacionado» (`related`) sale de la plantilla: el diagrama radial ya
  enlaza todo lo conectado. El chip de estado del hero va dentro de la mini-tarjeta (no se repite
  en el antetítulo). El bloque 4 «Demo en grande» es una tarjeta «Pruébalo» con enlace hasta que
  existan las islas (fase 4). «Monta tu alaCarta» apunta a `/precios?add=…#modulos` hasta que
  exista el configurador (fase 5).
- Capturas: `docs/auditoria/capturas/fase-2/` (hub, 13 productos y placas a 1440/390; recortes
  `detalle-*` del mapa, historias, diagramas radiales, maquetas nuevas, ticket y precio).
