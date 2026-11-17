# 10 · Demos interactivas y piezas de producto vivas

**Estado:** hecho (D5/D6 en la fase 5) · **Prioridad:** 2 · **Depende de:** 02 (iconos), datos de demo comunes

La web vende un **ecosistema conectado**. Una maqueta estática lo *dice*; una demo en la que el
visitante toca el móvil y ve aparecer la comanda en cocina lo *demuestra*. Es lo que ningún
competidor español hace en su web (todos piden demo con comercial o enseñan vídeo) y es la pieza
que más diferencia a alaCarta mientras no haya prueba social.

Reglas comunes:

- Islas **Vue 3** (`client:visible`), sin backend, sin cookies, estado en memoria (y
  `BroadcastChannel` cuando la demo usa dos pestañas o dos dispositivos del mismo navegador).
- Reutilizan el **lenguaje visual de las maquetas** (`src/styles/mockups.css`): mismas clases,
  mismos marcos (`DeviceFrame`), cifras en monoespaciada.
- Un único **restaurante de ejemplo** para todas las demos: "La Plaza" (ya usado en `MockCarta`),
  con carta común en `src/data/demo.ts` (categorías, productos, precios, alérgenos, modificadores,
  mesas). Cambiar un dato ahí cambia todas las demos: coherente con "una carta, un dato".
- Accesibles: botones reales, `aria-live="polite"` para los avisos ("Comanda enviada a cocina"),
  `prefers-reduced-motion` respetado.
- Cada demo termina con **un paso de conversión suave**, nunca un muro: "¿Quieres verlo con tu
  carta? Solicitar demo" con `?origen=demo-<nombre>` para atribución.
- Sin JavaScript se ve la maqueta estática equivalente (progresivo).
- Peso objetivo por isla: < 25 KB gzip.

## D1 · Simulador del servicio (pieza estrella)

**Dónde:** home (sección 3, justo después del hero) y `/demo` a pantalla completa.

**Qué es:** tres dispositivos en paralelo, sincronizados:

1. **Comandero** (móvil): mesa 7, el visitante añade platos (con un modificador obligatorio en uno,
   p. ej. punto de la carne) y pulsa "Enviar a cocina".
2. **Pantalla de cocina**: aparece la comanda con temporizador (acelerado ×20), el visitante pulsa
   "Listo" y la tarjeta pasa a "Para recoger"; en el comandero vibra un aviso "Mesa 7 lista".
3. **TPV**: la mesa 7 cambia de estado (ocupada → pendiente de cobro); "Cobrar" abre división por
   comensales y forma de pago; al cobrar, un **contador de informes** suma la venta (ventas de hoy,
   ticket medio, platos más vendidos).

Una **guía de pasos** encima (1 Toma la comanda · 2 Cocina la prepara · 3 Cobra · 4 Mira los
números) marca el progreso y permite saltar. Botón "Reiniciar".

Variante móvil (<720 px): un dispositivo cada vez con pestañas Comandero / Cocina / Caja / Números
y un indicador de "novedad" en la pestaña que acaba de recibir algo.

**Extra original:** en `/demo`, un botón "Ábrelo en tu móvil" muestra un QR que abre el comandero en
el móvil del visitante mientras la cocina sigue en el ordenador. Sincronización entre dispositivos
distintos necesita un canal (WebSocket mínimo); **fase 2**, solo cuando exista API. En fase 1, el
QR abre el comandero en el móvil y sincroniza entre pestañas del mismo navegador.

## D2 · "Un cambio, todos los canales"

**Dónde:** home (sección "Todo conectado") y `/soluciones/backoffice`.

Un panel de backoffice reducido (tres productos) donde el visitante puede **cambiar un precio** o
**marcar agotado**. A la derecha, cuatro miniaturas — TPV, carta QR, tienda online, app propia — se
actualizan a la vez con un destello sutil (fondo gris 120 ms). Texto bajo la pieza: "Esto es lo que
significa *un solo sistema*: no hay que sincronizar nada".

## D3 · Carta QR de ejemplo (`/demo/carta`)

**Dónde:** página propia, pensada para móvil, enlazada con un **QR grande** en
`/soluciones/carta-qr`, en `/hardware/placas-qr`, en el megamenú y en la home.

- Carta completa de La Plaza: categorías con scroll horizontal fijo, fotos opcionales (sin fotos:
  tipografía, coherente con la marca), alérgenos con iconos y filtro "sin gluten / sin lactosa…",
  selector de idioma (ES/EN/FR con textos reales de la demo), menú del día por horario.
- Pedido desde la mesa: añadir, modificadores, nota, "Pedir a cocina" → pantalla de confirmación con
  el número de mesa y un enlace "Mira cómo lo recibe la cocina →" que abre `/demo` con la comanda ya
  cargada (parámetro en URL).
- Pago en mesa simulado ("Pagar mi parte") con aviso "Simulación: no se cobra nada".
- Banda inferior discreta: "Esta es una carta de ejemplo de alaCarta. ¿Quieres la tuya?" → enlace.
- `noindex` (no es contenido para buscadores) pero enlazable y compartible.

En escritorio, `/soluciones/carta-qr` muestra el QR a la izquierda ("Escanéalo con tu móvil: así lo
verá tu cliente") y un iframe/móvil con la misma carta a la derecha para quien no quiera sacar el
teléfono.

## D4 · Llamada con IA de ejemplo

**Dónde:** `/soluciones/llamadas-ia`.

Fase 1 (sin teléfono real): reproductor de una **llamada de ejemplo** con transcripción que se va
escribiendo sincronizada con el audio (audio generado con TTS de calidad y marcado como
"simulación"). Al terminar la llamada, a la derecha aparece la reserva en el **libro de reservas**
(maqueta `MockReservas`) y el SMS/WhatsApp de confirmación. Tres escenarios en pestañas: reservar
mesa, pedir para recoger, preguntar horario y alérgenos.

Fase 2 (cuando exista número): bloque "Llámala tú: +34 …" con horario de prueba y aviso de que es un
restaurante ficticio. Es la demo más potente del mercado para este producto (la usan los
especialistas en IA telefónica) y cuesta solo minutos de llamada.

Sin audio todavía: la transcripción animada sola ya funciona.

## D5 · Configurador "Monta tu alaCarta"

**Dónde:** `/precios` (sección principal tras los planes) y enlazado desde cada solución y sector
con preselección (`/precios?config=pizzeria`).

Juega con el nombre de la marca: el configurador **es una carta**. Secciones como en un menú:
"Para servir" (TPV, comandero, cocina, carta QR), "Para vender más" (reservas, pedidos, app, IA,
clientes, web), "Para gestionar" (ERP, RRHH), "Para equipar" (hardware, placas QR), "Para empezar"
(puesta en marcha). El visitante marca lo que quiere, elige nº de locales y dispositivos.

A la derecha (abajo en móvil), un **ticket de TPV** en monoespaciada que se va escribiendo: líneas,
subtotal mensual, pago único (hardware, placas, web), ahorro anual si paga anual, y la línea
"Comisiones por pedido/reserva: 0,00 €". Si la suma de módulos supera el plan Completo, el ticket lo
dice: "Te sale mejor el plan Completo: −X €/mes".

Botones: "Recibir esta propuesta por correo" (lead con la configuración serializada) y "Revisarla en
una demo". La configuración viaja en la URL (compartible) y se pasa al formulario.

## D6 · Calculadora de comisiones

**Dónde:** `/herramientas/calculadora-comisiones` (página propia, SEO "calculadora comisiones glovo /
just eat / thefork" como hipótesis) y versión reducida en `/precios` y en el momento "dejar de pagar
comisiones".

Entradas: pedidos a domicilio al mes y ticket medio, % de comisión del agregador (por defecto 25 %,
rango 14-35 % según la investigación), comensales con reserva por plataforma y coste por comensal,
pagos con QR y % de comisión. Salida: **lo que pagas al año en comisiones** y "lo que pagarías con
alaCarta" (cuota fija equivalente) en formato ticket. Nota honesta: "No todos tus pedidos se pasarán
a tu canal propio; con que se pase un 30 %, ahorras X". Lead opcional: "Envíame el cálculo".

## D7 · Mapa del ecosistema

**Dónde:** `/soluciones` (cabecera) y versión compacta en home.

SVG interactivo: un núcleo ("Un solo sistema: carta, mesas, clientes, ventas, equipo") y alrededor
las cuatro familias con sus productos (iconos). Al pasar/tocar un producto se iluminan las líneas
hacia los productos con los que intercambia datos y aparece una frase ("Las reservas se sientan en
el plano del TPV y crean la ficha del cliente"). Datos de conexiones en `solutions.ts`
(`connected` ya existe: convertirlo en referencias a slugs + texto).

## D8 · Placa QR personalizable (vista previa)

**Dónde:** `/hardware/placas-qr`.

Vista previa de la placa: material (metacrilato negro, blanco, madera), formato (sobremesa, adhesiva,
colgante), número de mesa, nombre del local, con/sin NFC. El QR de la vista previa **funciona** y
lleva a la carta de ejemplo. Botón "Las quiero con mi alta" → formulario con la selección.

## Orden de implementación

1. `src/data/demo.ts` (carta y mesas de La Plaza) + estilos comunes.
2. D3 carta QR (la más vendible y la más sencilla) + generación de QR en build (`qrcode`, SVG).
3. D1 simulador del servicio.
4. D5 configurador (necesita 09-precios cerrado).
5. D2, D6, D7, D4, D8.

## Criterios de aceptación (por demo)

- [x] Funciona con ratón, táctil y teclado; sin JS muestra maqueta estática. (D1, D2, D3, D4, D5, D6, D7, D8)
- [x] Mismos datos de La Plaza en todas (`src/data/demo.ts`).
- [x] Termina en un CTA con `origen` para atribución.
- [x] Captura a 1440 y 390 revisada; `npm test` en verde; peso de isla controlado (todas < 9 KB gzip;
      D5, con la lógica de `quote.ts` dentro, 9,3 KB).
- [x] D5: carta + ticket, URL compartible (`/precios?config=…#monta`), lee `?add=`, `?plan=`,
      `?sector=`, `?locales=`; recomienda el plan más barato; pasa la configuración al formulario.
- [x] D6: calculadora completa en `/herramientas/calculadora-comisiones` y reducida en `/precios`,
      con rango y fuente.

D5 (configurador) y D6 (calculadora) se hicieron en la fase 5: ver notas en 09.

## Notas de implementación (fase 4, 17-11-2026)

**Datos**: `src/data/demo.ts` es la fuente única de las demos: La Plaza (ficticio), los 14
alérgenos (ES/EN/FR), 6 filtros de dieta, 6 categorías (menú del día con horario L-V 13-16 h),
17 platos con textos en tres idiomas, modificadores (punto de la carne obligatorio, salsa de las
bravas opcional, primero/segundo/postre del menú), partida de cocina, plano de 10 mesas, comanda
de fondo en cocina, «números de hoy» del restaurante ficticio, las tres llamadas de D4 y ayudas
(`eur`, `clock`, `encodeOrder/decodeOrder`, `modsText`, `store` con `sessionStorage` en try/catch,
`prefersReducedMotion`). No importa nada pesado: las islas no arrastran `solutions.ts` ni iconos.

**Islas** (todas Vue, `client:visible` salvo la carta de `/demo/carta`, que va con `client:idle`
porque es el contenido principal; sin cookies; avisos por `aria-live`; foco visible):

| Demo | Archivo | Dónde | gzip |
| --- | --- | --- | --- |
| D1 simulador | `islands/ServiceSimulator.vue` | `/demo#simulador` (reutilizable: prop `origen`, `readUrl`) | 7,8 KB |
| D2 cambio en todos los canales | `islands/ChannelsDemo.vue` | `/demo#canales` y `/soluciones/backoffice#pruebalo` | 2,6 KB |
| D3 carta QR | `islands/DemoCarta.vue` (`mode: page/embed`) | `/demo/carta` y móvil dibujado en `/soluciones/carta-qr#pruebalo` | 8,5 KB |
| D4 llamada de ejemplo | `islands/CallDemo.vue` | `/soluciones/llamadas-ia#pruebalo` (enlazada desde `/demo`) | 4,0 KB |
| D7 mapa | `islands/EcosystemMapIsland.vue` + `blocks/EcosystemMap.astro` | `/soluciones` | 3,7 KB |

Chunk compartido `demo.js` (datos): 4,8 KB gzip. Runtime de Vue aparte (ya lo cargaban las otras islas).

- **D1**: comandero (categorías, agotados, el entrecot pide el punto antes de añadir, −/+ en la
  comanda), cocina (temporizador ×20 que pasa a rojo a los 15 min simulados, marcar líneas,
  «Listo», columna «Para recoger», las bebidas van a barra), caja (plano de sala, mesa 7 libre →
  ocupada → pendiente de cobro, dividir entre 1-4 y cobrar parte a parte, tarjeta/efectivo,
  ticket cerrado) y números de hoy (ventas, tickets, ticket medio, más vendidos, con destello y
  «+38,80 €»). Guía de pasos que marca el progreso y permite saltar (completa lo anterior con
  `sampleOrder`). «Reiniciar». ≤ 900 px: pestañas con flechas y punto de novedad. Aviso «Mesa 7
  lista» con sacudida (desactivada con `prefers-reduced-motion`) y `navigator.vibrate` si existe.
  Lee `?comanda=` (pedido desde la carta QR, llega como «Mesa 7 · QR» con notas) y `?pantalla=`
  (TPV → caja, comandero, cocina). CTA final `origen=demo-simulador`.
- **D2**: tres platos, ±50 céntimos y «Agotado» (`role="switch"`); TPV, carta QR, tienda online y
  app propia (chip «En camino») se actualizan con destello gris de 120 ms. «Deshacer». CTA
  `origen=demo-cambio-canales` (en backoffice, `sol-backoffice-demo`).
- **D3**: categorías fijas con scroll horizontal y categoría activa (IntersectionObserver),
  ES/EN/FR, filtros de alérgenos y dieta (oculta y cuenta lo oculto), menú del día solo en su
  horario (si no, aviso y «Verlo igualmente»), añadir con modificadores obligatorios (marca en rojo
  si faltan) y nota, hoja de pedido con −/+, «Pedir a cocina» → confirmación con «Mira cómo lo
  recibe la cocina» (`/demo?comanda=…&origen=demo-carta#simulador`), «Pagar mi parte» (dividir
  entre 1-4, «Simulación: no se cobra nada») → pagado + CTA. «Llamar al camarero» y «Pedir la
  cuenta» simulados. Hojas con `role="dialog"`, Escape, foco atrapado y devuelto. Banda «¿Quieres
  la tuya?». El pedido y el idioma se guardan en `sessionStorage` (solo en modo página).
- **Carta QR**: el hero variante `demo` (placa dibujada con QR real) ya venía de la fase 2. Nuevo
  bloque «Pruébalo»: QR grande («Escanéalo con tu móvil: así lo verá tu cliente») + móvil con la
  misma carta jugable. En ≤ 720 px se cambia por el botón «Abrir la carta de ejemplo».
- **D4**: tres pestañas (reservar mesa, pedir para recoger, horario y alérgenos). Transcripción que
  se escribe sola (frase entera con `prefers-reduced-motion`), reproducir/pausa/«Ver entera»/«Otra
  vez», cronómetro, chip «Simulación · sin audio». Al colgar: reserva **por confirmar** en el libro
  → «Confirmar» → SMS de confirmación; pedido **para recoger** en el TPV → «Aceptar» (si nadie
  acepta, caduca); alergia grave → «Pasada al local». En la llamada de recoger el cliente pide
  domicilio y el asistente dice que por teléfono solo hay recogida. Sin idiomas ni proveedor.
  «La IA propone, tú decides.»
- **D7**: la geometría y las conexiones se calculan en build (`EcosystemMap.astro`) y se pasan a la
  isla. Sin JS es el mapa estático de la fase 2 (enlaces; lista en móvil). Con JS: pasar el ratón,
  enfocar o tocar una pieza ilumina sus conexiones (curvas; discontinuas si la integración o una de
  las piezas está en camino), apaga el resto, el núcleo dice «X · se conecta con N piezas» y una
  ficha bajo el mapa lista cada conexión con su texto y chip. Teclado: Tab o flechas, Intro/espacio,
  Escape. En móvil, la ficha se abre bajo la familia de la pieza. Conexiones en los dos sentidos
  (si A describe su conexión con B, B también la muestra). Se añadieron `connections` a hardware y
  puesta en marcha (`EquipmentEntry.connections`).
- **D8**: revisada; cumple lo que pide este documento (acabado, formato, nombre, mesa, NFC, QR que
  abre la carta, «Las quiero con mi alta» con la selección). Sin cambios.
- **`demoCta()`** (`src/lib/cta.ts`): activas todas. Simulador → `/demo?…#simulador` (con
  `pantalla`), carta y placa → `/demo/carta`, llamada → `/soluciones/llamadas-ia#pruebalo`,
  cambio-canales → `/soluciones/backoffice#pruebalo`. `ctaHref` admite `pantalla` y `comanda`.
  La plantilla de producto pinta la demo dentro de la página (carta, llamada, cambio en canales) o
  la tarjeta «Abrir el simulador» (TPV, comandero, cocina).
- **`/demo`**: índice real: simulador, «un cambio, todos los canales», carta QR con QR, y tarjetas a
  la llamada (chip «En camino»), mapa, placa QR, comprobador de equipo y calculadora.
- Quitado el comentario «Provisional fase 1» de `/demo` y `/demo/carta`.

**Desviaciones**

- Alérgenos con **insignias de monograma** (G, L, H, Cr…) en vez de 14 iconos dibujados: legibles a
  16 px, sin color y sin añadir 14 trazados; la leyenda los explica.
- D1 sin el QR «Ábrelo en tu móvil»: la sincronización entre dispositivos necesita API (fase 2
  del documento) y un QR que abre un comandero sin sincronizar prometería lo que no hace. Tampoco
  `BroadcastChannel` entre pestañas: sin ese QR no aporta. Pendiente cuando exista API.
- En D1, «Cobrar» se activa cuando cocina marca «Listo» (la mesa pasa a pendiente de cobro), para
  que el recorrido guiado se entienda; un TPV real deja cobrar en cualquier momento.
- D4 sin audio (el documento lo permite); la llamada a un número de prueba queda para cuando haya
  proveedor de voz y número (decisión pendiente de Jordi).
- D2 vive en `/demo` y en backoffice; la home la recibirá en la fase 7. D7 «versión compacta en
  home», también en la fase 7.
- Las cifras de «Números de hoy» son de La Plaza (ficticio) y se dice en la propia demo.

**Pendientes**

- Home (fase 7): montar `ServiceSimulator` (con `origen="home-simulador"` y `readUrl={false}`), D2 y
  el mapa compacto.
- Número de prueba de la IA (fase 2 de D4) y audio TTS, cuando haya proveedor.
- Sincronizar el simulador entre dispositivos (QR «Ábrelo en tu móvil») cuando exista API.

**Capturas**: `docs/auditoria/capturas/fase-4/` — páginas completas (`demo`, `demo-carta`,
`soluciones`, `carta-qr`, `llamadas-ia`, `backoffice`, `tpv` a 1440 y 390), D1 en 5 estados
(`d1-1…5`), D2 antes/después (`d2-*`), D3 en 8 estados (`d3-1…8`, incluido el pedido llegando
a cocina), D4 a mitad y al final (`d4-*`), D7 con reservas y ERP seleccionados (`d7-*`), bloque
«Pruébalo» de carta QR y su hero, y fallbacks sin JS (`sinjs-*`). Teclado probado en D1 (Tab hasta
«Añadir», foco al selector de punto) y D7 (flechas entre piezas, Intro).
