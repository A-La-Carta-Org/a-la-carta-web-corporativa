# 05 · Familia "Servicio en sala y cocina": TPV, comandero, cocina, carta QR

**Estado:** hecho (fase 2; demos D1 y D3 jugables desde la fase 4) · **Prioridad:** 2 · **Depende de:** 04 (plantilla), 10 (D1, D3), 08 (hardware)

Copy actual de las cuatro páginas: bueno, concreto, en lenguaje de local. **Se conserva** y se
amplía. Lo que cambia es la estructura (plantilla 04), la conexión con el ecosistema nuevo y las
demos.

## TPV · `/soluciones/tpv`

- **Intención SEO**: "tpv hostelería", "tpv restaurante", "tpv bar" (comercial alta). Es la página
  con más tráfico potencial: merece la versión más rica de la plantilla.
- **Hero**: maqueta TPV actual + botón "Pruébalo" que abre el simulador (D1) en la pestaña Caja.
- **Lo que dejas de hacer**: cuadrar la caja a mano · copiar precios en tres sitios · pagar
  licencia por cada caja de terraza · quedarte sin cobrar si se cae internet.
- **Añadir a "Qué hace"**: modo barra (venta sin mesa), propinas, fichaje del camarero desde el TPV
  (*en camino*: depende de la integración con RRHH vía contrato de fichaje de GestiTec).
- **Conexiones**: comandero, cocina, carta QR (pedido de mesa entra como comanda), reservas (mesa
  reservada en el plano), backoffice (precios), ERP (*en camino*: resumen diario de ventas y
  facturas a empresas), RRHH (*en camino*: fichaje), llamadas IA (los pedidos telefónicos se
  aceptan en el TPV).
- **Equipamiento**: terminal táctil todo en uno, impresora térmica, cajón; "o tu tablet/PC".
- **VeriFactu**: la frase "preparados para VeriFactu" sigue siendo correcta como objetivo de diseño;
  **no** decir "certificado". Enlazar a la guía.
- **FAQ nuevas**: "¿Funciona en Android, iPad y Windows?", "¿Qué datáfonos son compatibles?"
  (respuesta honesta: lista en preparación), "¿Puedo fichar desde el TPV?".

## Comandero · `/soluciones/comandero`

- **Hero**: móvil con el comandero del simulador, interactivo.
- **Lo que dejas de hacer**: libreta, viajes a barra, letra ilegible, "¿esto quién lo pidió?".
- **Conexiones**: cocina, TPV, carta (agotados), informes (tiempos por camarero), RRHH (*en camino*:
  ventas por camarero y turno).
- **Equipamiento**: móviles Android de gama media recomendados, fundas, cargador múltiple; "o los
  móviles que ya tenéis".
- Mantener la FAQ de terraza/wifi (muy buena objeción real).

## Pantalla de cocina · `/soluciones/cocina`

- **Hero**: pantalla de cocina del simulador; pulsar "Listo" tiene efecto.
- **Lo que dejas de hacer**: tickets de papel perdidos, gritos de pase, platos olvidados, comandas de
  delivery por otro canal.
- **Conexiones**: comandero/TPV, pedidos online y app propia (misma cola), llamadas IA (pedidos
  aceptados), backoffice (tiempos), ERP/stock (*en camino*: descuento de stock por receta).
- **Equipamiento**: pantalla táctil de cocina con soporte de pared, protector anti-grasa; impresora
  de cocina opcional como respaldo.
- Hoy el KDS es módulo de 19 € sobre Esencial: frente a Last.app (35 €/mes) es un argumento de
  precio; decirlo sin nombrar competidor: "La mitad de lo que suele costar una pantalla de cocina".
  (Solo si Jordi lo aprueba; es una afirmación comparativa que hay que poder sostener.)

## Carta digital QR · `/soluciones/carta-qr`

- **La página más original de la web**: el visitante **escanea un QR real** y abre la carta de
  ejemplo en su móvil (D3).
- **Hero nuevo (variante `demo`)**: a la izquierda H1 + texto + CTAs; a la derecha una **placa QR
  física** dibujada (metacrilato negro, "La Plaza · Mesa 7") cuyo QR funciona, con el texto
  "Escanéala con tu móvil". En móvil, el QR se sustituye por un botón "Abrir la carta de ejemplo".
- **Lo que dejas de hacer**: reimprimir cartas, PDF que nadie actualiza, alérgenos a mano, cartas
  plastificadas pegajosas.
- **Qué hace**: actual + idiomas, filtros de alérgenos, menú del día por horario, llamada al
  camarero, pedir la cuenta, pago en mesa, valoraciones (*en camino*), redirigir a Google para
  reseña tras pagar (*en camino*; muy pedido y conecta con "Web y presencia en Google").
- **Placas QR** (sección propia, cruce con `/hardware/placas-qr`): tres acabados, NFC, número de
  mesa, "el QR no cambia aunque cambies la carta".
- **Conexiones**: backoffice, cocina, TPV (la mesa se cierra), clientes, web (la misma carta en tu
  web), app propia.
- **Plan**: incluida en todos los planes. Es el **gancho de entrada** (plan Esencial). Valorar
  "carta QR gratis" como imán de captación (herramienta gratuita, ya en el roadmap): decisión de
  negocio, no de esta página.

## Comunes a la familia

- Las cuatro páginas comparten la misma mesa y carta de La Plaza (`src/data/demo.ts`).
- Cada una enlaza al simulador completo (`/demo`) con su pestaña preseleccionada.
- Criterios: plantilla 04 aplicada, demos funcionando, hardware cruzado, FAQ ≥ 4, `npm test` verde,
  capturas 1440/390 de las cuatro.

## Notas de implementación · datos (fase 1, 16-11-2026)

Solo datos y copy base en `src/data/solutions.ts`; las páginas se completan en la fase 2, así que
los criterios de este documento siguen sin marcar.

- TPV: `replaces`, conexiones de §TPV (ERP y RRHH en camino), equipamiento recomendado
  (`terminal`, `impresora`, `cajon`, `datafono`), FAQ nuevas (Android/iPad/Windows, datáfonos
  compatibles "en preparación", fichaje desde el TPV "en camino") → 6 FAQ.
- Comandero, cocina y carta QR: `replaces`, conexiones nuevas, `hardware`, `demo` y 4 FAQ cada uno.
  Carta QR con `heroVariant: 'demo'` y `demo: 'carta'`. El navLabel de cocina pasa a "Pantalla de
  cocina" y el de la carta a "Carta digital QR" (menú de 02).
- No se añadió la frase comparativa de precio del KDS (pendiente de que Jordi la apruebe).

## Notas de implementación (fase 2 · páginas, 17-11-2026)

Criterios de la familia:

- [x] Plantilla 04 aplicada a TPV, comandero, cocina y carta QR.
- [x] Demos funcionando: el «Pruébalo» de TPV, comandero y cocina abre el simulador (D1) en
      `/demo?pantalla=caja|comandero|cocina#simulador`; la carta QR se prueba en su propia página
      (QR + móvil con la carta) y en `/demo/carta` (fase 4).
- [x] Hardware cruzado (bloque «Equipamiento recomendado» desde `hardware`).
- [x] FAQ ≥ 4 en las cuatro.
- [x] `npm test` verde; capturas 1440/390 de las cuatro en `capturas/fase-2/`.

- TPV: «modo barra» dentro de «Plano de sala y modo barra»; propinas ya estaban en el cierre de
  caja; fichaje desde el TPV como conexión y FAQ «en camino». Guías de VeriFactu y de elegir TPV
  enlazadas en «Para leer con calma» (por `related` de la colección).
- Comandero: nueva conexión con la carta QR (agotados).
- Carta QR: hero variante `demo` con la placa dibujada y QR real a `/demo/carta` (en móvil, botón).
  «Qué hace» reordenado: idiomas y filtros, menú por horario, pedir/llamar/pedir la cuenta, pago
  en mesa y «Valoraciones y reseña en Google» con chip «En camino». Las placas se cruzan con el
  bloque de equipamiento y enlazan a `/hardware/placas-qr`.
- Sin la frase comparativa del precio del KDS (sigue pendiente de aprobación).
