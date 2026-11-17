# 08 · Equipamiento y servicios: hardware, placas QR y puesta en marcha

**Estado:** hecho (fase 3, 17-11-2026) · **Prioridad:** 2 · **Depende de:** 01, 02, 10 (D8)

El hostelero no compra "software", compra **que el lunes el local funcione**. La familia
"Equipamiento y servicios" convierte a alaCarta en llave en mano sin perder la promesa "funciona
con lo que tienes". Mensaje de la familia: **"Te lo dejamos funcionando."**

## Hardware · `/hardware` (NUEVA, enlace de primer nivel)

- **H1**: "El equipo para tu local, configurado y listo. O usa el que ya tienes."
- **Intención SEO**: "kit tpv hostelería", "tpv táctil bar", "impresora tickets restaurante".
- **Estructura**:
  1. Hero con composición de kit (maqueta: terminal + impresora + cajón + móvil + pantalla de cocina
     + placa QR), dibujada en el estilo de las maquetas (líneas, grises), no fotos de stock.
  2. **Dos caminos** en tarjetas: "Usa tu equipo" (requisitos mínimos: navegador moderno, impresora
     ESC/POS de red o USB; enlace a comprobador) · "Te lo enviamos configurado" (kits).
  3. **Kits** (base Ofasty, reordenados por tipo de local): *Barra* (terminal, impresora, cajón) ·
     *Sala* (Barra + 2 comanderos) · *Cocina* (pantalla de cocina + soporte) · *Completo* (Sala +
     Cocina + placas QR). Cada kit: contenido, para quién, "Precio en tu propuesta" o "desde X €" si
     Jordi publica precios.
  4. **Dispositivos sueltos** por categoría: terminales, impresoras, cajones, móviles/tablets,
     pantallas de cocina, datáfonos (lista de compatibles *en preparación*), placas QR.
  5. **Comprobador de equipo** (isla pequeña, idea de Ofasty mejorada): 4 preguntas (¿qué tienes?
     tablet/PC/terminal, ¿impresora?, ¿marca/modelo?, ¿cuántas cajas?) → resultado "Te sirve / Te
     falta X" → botón que **rellena el formulario** con el resultado.
  6. Instalación: remota incluida; presencial con precio (09). Garantía y sustitución (decidir).
  7. FAQ: ¿compra o renting? ¿garantía? ¿qué pasa si se rompe en pleno servicio? ¿puedo usar mi
     datáfono del banco?
- **No hacer**: hardware propietario obligatorio; promociones "TPV gratis".
- **Decisión bloqueante**: proveedor, precios publicados o no, compra/renting.

## Placas QR para mesas · `/hardware/placas-qr` (NUEVA)

- **H1**: "Placas QR para tus mesas, que no se despegan ni caducan."
- **Por qué existe la página**: es un producto físico tangible, barato y muy visual; es la forma
  más fácil de **empezar con alaCarta** (carta QR en el plan Esencial + placas) y una búsqueda con
  intención de compra ("placas qr mesas restaurante", "expositor qr nfc").
- **Contenido**:
  - **Vista previa configurable** (D8): material (metacrilato negro / blanco / madera), formato
    (sobremesa, adhesiva, para terraza), número de mesa, nombre del local, NFC sí/no. El QR de la
    vista previa **funciona** y abre la carta de ejemplo.
  - "El QR no cambia nunca": la placa apunta a la mesa, no a un PDF; cambias la carta y la placa
    sigue valiendo. Cada QR identifica la mesa (pedido y pago en mesa sin preguntar el número).
  - NFC: acercar el móvil sin abrir la cámara.
  - Opción imprimible gratis desde el backoffice para quien no quiera placas.
  - Precio: por unidad o pack (decisión), o incluido un primer pack en el alta del plan Completo o
    para locales fundadores (decisión de negocio).
- CTA: "Las quiero con mi alta" → formulario con `?origen=placas&config=...`.

## Puesta en marcha · `/puesta-en-marcha` (NUEVA)

- **H1**: "Del primer contacto al primer servicio, acompañado."
- **Intención**: resolver el **miedo al cambio** (decisión 2 de los momentos de compra: "cambio de
  TPV"). Ninguna web competidora lo explica bien; Last.app cobra 500 € por instalación.
- **Contenido**:
  1. **Línea temporal** con plazos honestos (validar con Jordi): Día 0 demo y propuesta · Días 1-3
     importamos la carta (desde PDF, Excel o tu TPV actual), mesas y usuarios · Días 3-7 llega el
     hardware configurado y las placas · Día 7 formación del equipo (remota incluida, presencial
     opcional) · Primer servicio con soporte en directo.
  2. **Migración**: qué se importa (carta, clientes con consentimiento, histórico si es posible) y
     qué no.
  3. **Estrategia local** (lo nuevo): revisión del Perfil de Google, enlace de reservas y pedidos en
     Google e Instagram, placas QR en mesa, web; checklist de canal propio. Enlaza a
     `/soluciones/web-para-restaurantes`.
  4. **Qué necesitamos de ti**: carta, datos fiscales, lista de equipo, plano de sala (foto).
  5. **Qué cuesta**: remota 0 €; presencial desde X; migración a medida.
  6. FAQ: ¿cerramos el local? ¿y si algo falla el primer día? ¿cuánto tiempo del equipo?
- **Lead magnet**: "Checklist de puesta en marcha" (descargable a cambio de correo, opcional).

## Criterios de aceptación

- [x] 3 páginas nuevas, con JSON-LD `Product`/`Service` según corresponda (las tres como
      `Service` + `FAQPage` + migas; ver notas).
- [x] Datos en `src/data/hardware.ts` (kits, dispositivos, placas) y `src/data/onboarding.ts`.
- [x] D8 vista previa de placa con QR funcional; comprobador de equipo que rellena el formulario
      (lleva el resultado en la URL; el formulario lo lee y lo resume desde la fase 6).
- [x] Hardware en el menú (02) y en el configurador (09). Menú, pie y hub: hecho. Configurador:
      hecho en la fase 5 (hardware y placas como «en tu propuesta»; `?add=hardware` y
      `?add=placas-qr` los preseleccionan desde el cierre de `/hardware` y `/hardware/placas-qr`).
- [x] Ningún precio inventado: "en tu propuesta" hasta que Jordi publique cifras.
- [x] `npm test` verde, capturas revisadas (`docs/auditoria/capturas/fase-3/`).

## Notas de implementación · datos (fase 1, 16-11-2026)

Solo datos y copy base en `src/data/solutions.ts`; las páginas se completan en la fase 2, así que
los criterios de este documento siguen sin marcar.

- Entradas de la familia equipamiento en `solutions.ts` (`equipment`) con rutas propias.
- `src/data/hardware.ts` (dispositivos, 4 kits, requisitos para usar tu equipo,
  `HARDWARE_PRICE_LABEL = 'Precio en tu propuesta'`) y `src/data/onboarding.ts` (línea temporal
  orientativa y qué necesitamos) creados en versión mínima.
- Páginas provisionales `/hardware`, `/hardware/placas-qr` (placa dibujada con QR real a la carta
  de ejemplo) y `/puesta-en-marcha` (JSON-LD `Service`), con el comentario
  `<!-- Provisional fase 1 … -->`. Sin JSON-LD `Product` todavía (sin precio, Google lo marcaría).

## Notas de implementación · fase 3 (17-11-2026)

**Hecho**

- `/hardware`: hero dividido con composición de kit dibujada (`src/components/mockups/KitComposition.astro`,
  SVG en grises: terminal sobre cajón, impresora con ticket, comandero, pantalla de cocina, placa
  QR); dos caminos (requisitos + enlace al comprobador · tres pasos de cómo llega configurado);
  4 kits con iconos y "Precio en tu propuesta"; 8 dispositivos con "Con el tuyo: …" (cuándo sirve
  el propio); comprobador de equipo; instalación y garantía; FAQ (6); cierre.
- **Comprobador** (`src/components/islands/EquipmentChecker.vue`, `client:visible` con
  `rootMargin` de 300 px): 4 preguntas (con qué cobras · impresora · marca y modelo, opcional ·
  puntos de cobro), radios nativos dentro de `fieldset`, Intro avanza, foco al título de cada paso,
  "Atrás" y "Volver a empezar". Resultado por pieza: *Te sirve* / *Lo revisamos* / *Te falta*
  (reglas prudentes en `evaluateEquipment()` de `hardware.ts`: lo que depende del modelo nunca sale
  "te sirve"). El botón lleva a
  `/solicitar-demo?modulo=hardware&equipo=equipo:tablet;impresora:usb;modelo:…;cajas:2;resultado:revisar&origen=comprobador-hardware`.
  Sin JS se ve la lista de preguntas y un enlace a la demo con `origen=comprobador-hardware`.
- `/hardware/placas-qr`: **D8 hecha en esta fase** (`src/components/islands/PlatePreview.vue`):
  nombre del local, número de mesa, acabado (metacrilato negro, blanco, madera), formato
  (sobremesa, adhesiva, terraza) y NFC. El QR se genera en build (`QrCode.astro`) y entra por el
  slot de la isla: abre `/demo/carta` de verdad. En móvil aparece "Abrir la carta de ejemplo".
  "Las quiero con mi alta" → `/solicitar-demo?modulo=placas-qr&config=placa:madera;formato:terraza;nfc:si;mesa:12;local:…&origen=placas-configurador`.
  Sin JS se ve la placa de ejemplo con los controles desactivados y el botón con la configuración
  por defecto. Además: por qué placas, cómo se piden (3 pasos), precio "en tu propuesta" con la
  opción imprimible gratis, FAQ (5).
- `/puesta-en-marcha`: línea temporal con iconos (horizontal en escritorio, vertical en móvil),
  migración en dos caminos (desde otro TPV / desde papel o caja registradora) con "Lo que
  traspasamos" y "Lo que no, y por qué", estrategia local (Perfil de Google, enlaces en Instagram,
  placas QR, web), qué necesitamos, qué cuesta (de `services` en `pricing.ts`) con la nota de
  locales fundadores (presencial incluida), FAQ (5).
- Datos: `hardware.ts` (`ownOk`, iconos de kits, `hardwareDelivery`, preguntas y lógica del
  comprobador, opciones de placa, `plateSummary`, FAQ) y `onboarding.ts` (iconos de pasos,
  `migrationPaths`, `migrationImports`, `migrationNotImported`, `localStrategy`, FAQ).
- `ctaHref` admite `equipo` (`src/lib/cta.ts`). `serviceJsonLd` admite `serviceType`.
- Iconos nuevos (Lucide, ISC): `nfc`, `truck`, `shield-check`, `refresh-cw`, `clipboard-list`,
  `file-spreadsheet`.
- Títulos con sufijo: 57, 55 y 60 caracteres. Descripciones: 155, 141 y 142.
- Menú (enlace "Hardware" de primer nivel y columna Equipamiento del megamenú), pie y hub enlazan a
  las tres páginas (comprobado en `dist/`).

**Desviaciones y decisiones por defecto**

- JSON-LD: `Service` (con `serviceType`) en las tres páginas, más `FAQPage` y migas, y **no**
  `Product`: sin precio publicado ni valoraciones Google marca un `Product` como incompleto. Cuando
  haya precios de kits y placas, se puede añadir `Product` con `Offer`.
- El parámetro del comprobador es `equipo` (nuevo) y el de la placa `config` (como dice este
  documento). **El formulario todavía no lee `equipo`, `config` ni `modulo=hardware/placas-qr`**
  (`LeadForm` solo acepta slugs de `solutions`): lo hará la fase 6. Los datos viajan en la URL.
- Hero de placas en variante compacta (sin placa) para no repetir la placa dos veces seguidas: la
  vista previa D8 va justo debajo.
- Acabado madera: tokens `--wood-300` y `--wood-700` en `tokens.css`, limitados a la vista previa
  (es el color de un material, no de marca). Formato "para terraza" (este documento) en lugar de
  "colgante" (doc 10).
- Garantía y sustitución: "en tu propuesta, por escrito" (pendiente de proveedor). Compra o
  renting: "lo estamos cerrando". Sin marcas ni modelos.
- Instalación presencial: se reutiliza `ONSITE_TRAINING_FROM` (290 €) de `pricing.ts`, con la
  nota de que va incluida para locales fundadores.
- El comprobador menciona el precio de terminal adicional (`devices` de `pricing.ts`, +12 €/mes)
  cuando hay más de un punto de cobro.
- Lead magnet "Checklist de puesta en marcha": no hecho (opcional; necesita la captura de correo de
  la fase 6).

**Pendiente**

- Configurador (09, fase 5): añadir kits y placas como línea de pago único.
- ~~Fase 6: leer `equipo`, `config` y `modulo=hardware|placas-qr|puesta-en-marcha` en el formulario.~~
  Hecho en la fase 6 (`src/lib/lead.ts`, ver doc 11).
- Jordi: plazos de la línea temporal, proveedor, compra o renting, garantía, precio de placas.
