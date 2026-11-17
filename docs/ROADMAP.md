# Roadmap

Revisado el 17-11-2026, al cerrar el loop del ecosistema. Qué hay, qué está en camino y qué hace
falta para cada cosa. Pendientes accionables en `docs/TODO.md`.

## Fase 0 · Web corporativa (hecha)

- 16-11-2026: marca, sistema de diseño, primera web (36 páginas), documentación.
- 17-11-2026 (rama `ecosistema`): replanteamiento como ecosistema. 55 páginas, 4 familias y 16
  productos con estado, 8 demos interactivas, configurador y calculadora, embudo de cuatro puertas,
  sectores y momentos, guías con fuentes, `/novedades`, locales fundadores, legales en borrador.
  Sin despliegue externo ni commits.

## Lo que la web marca «En camino» y qué hace falta para cada cosa

La web no pone fechas: cada pieza sale de «en camino» cuando exista. Al cambiar el `status` en
`src/data/solutions.ts` o `src/data/integrations.ts`, cambian el chip, `/novedades`, los diagramas,
el configurador y el pie a la vez.

### Productos

| Pieza | Qué falta | Quién decide / bloquea |
| --- | --- | --- |
| **App propia** (reservas, pedidos y puntos con tu marca) | Construirla como app web instalable (PWA) sobre la carta, pedidos y clientes del sistema; decidir si se publica en tiendas | Producto; la publicación en tiendas está en estudio y la web no la promete |
| **Llamadas con IA** | Elegir proveedor de voz (socio o propio), número de demostración, idiomas confirmados, audio de la demo, política de grabación y privacidad del llamante | Jordi: proveedor, teléfono, contrato de encargado |
| **ERP** (compras, proveedores, stock, facturas, tesorería, contabilidad) | Desplegar la rama del ERP; variante de build con marca alaCarta (tokens, logos, PWA, i18n, correos, dominio); integración con el TPV | Jordi: plazo de la marca blanca y de la gestión central multi-marca |
| **Equipo y RRHH** | Marcado «Disponible», pero necesita la variante con marca alaCarta antes de venderlo como tal | Jordi: plazo de la marca blanca |

### Integraciones internas (diagramas de conexiones)

| Integración | Qué hace falta |
| --- | --- |
| TPV → ERP (resumen diario, facturas a empresas) | ERP desplegado + API entre ambos |
| Cocina → ERP (descuento de receta en el almacén) | Escandallos del backoffice expuestos al ERP |
| TPV / comandero → Equipo y RRHH (fichar al empezar el turno) | Identidad común de personas y PIN compartido |
| Backoffice ↔ ERP (margen real con compras) y ↔ RRHH (coste de personal frente a ventas por hora) | Modelo de datos común o API de informes; es el gran argumento del ecosistema |
| Llamadas con IA → TPV, reservas, clientes | Proveedor de voz + herramientas de la API de alaCarta |
| Carta QR → reseña en Google; app propia → placas QR | Producto (carta, app) |

### Integraciones externas (`src/data/integrations.ts`)

| Integración | Qué hace falta |
| --- | --- |
| Datáfonos conectados al TPV | Lista de modelos compatibles y acuerdo con pasarela o banco |
| Glovo, Uber Eats y Just Eat en la cola de cocina | Acuerdos o integrador de agregadores |
| Contabilidad con acceso para la gestoría | El ERP desplegado |
| Reserva con Google | Alta como socio de reservas de Google |

### Equipamiento y servicios

| Pieza | Qué falta |
| --- | --- |
| Hardware (kits y dispositivos) | Proveedor, fórmula (compra o renting), precios, garantía y plazos; hasta entonces «en tu propuesta» y sin marcas |
| Placas QR | Proveedor de impresión y NFC, precio por placa, plazo de entrega |
| Puesta en marcha | Validar los plazos de la línea temporal y la zona de visitas presenciales |

## Fase 1 · Publicación de la web (siguiente)

Objetivo: alacarta.com en producción, captando solicitudes por las cuatro puertas.

- Repositorio remoto y CI; Coolify desde el Dockerfile; dominio, DNS y SSL.
- Endpoint de formularios (contrato en `docs/DESPLIEGUE.md` §6), buzón de ventas y correo
  corporativo; teléfono comercial para «te llamamos».
- Textos legales con los datos de la sociedad, revisados por un asesor; decidir si la atribución en
  `sessionStorage` requiere consentimiento.
- Analítica sin cookies (o ninguna) escuchando `alacarta:conversion`.
- Search Console, sitemap enviado, comprobación de indexación; volver a revisar VeriFactu y
  registro de jornada en el BOE antes de publicar.
- Confirmar cifras de precios y presets por sector.

## Fase 2 · MVP del producto

Lo mínimo para que un local trabaje un servicio completo y los fundadores empiecen:

1. **Identidad y cuenta**: organización, empresa, local, usuarios, roles, PIN de dispositivo.
2. **Backoffice**: carta (categorías, productos, modificadores, alérgenos, precios por canal),
   mesas y zonas, impresoras, usuarios.
3. **TPV**: plano de sala, modo barra, comanda, impresión, cobro (efectivo, tarjeta, mixto,
   dividir), descuentos con motivo, cierre de caja, tickets con los requisitos de VeriFactu.
4. **Carta QR** de consulta con alérgenos e idiomas.
5. **Informes básicos** y cierre diario por correo.
6. **Modo sin conexión** del TPV con cola de sincronización.
7. Suscripción y prueba (pasarela de pagos por decidir).

Criterio de salida: locales fundadores trabajando un mes con el MVP.

## Fase 3 · Servicio en mesa, cocina y canales

- Comandero móvil, pantalla de cocina con tiempos y partidas.
- Pedido y pago desde la mesa en la carta QR.
- Reservas: libro, widget, confirmaciones, turnos, aforo, lista de espera.
- Pedidos online: tienda, franjas, zonas, pago online.
- Clientes y fidelización; web para restaurantes como servicio.

## Fase 4 · Gestión del ecosistema

- Equipo y RRHH con marca alaCarta e identidad común con el TPV (fichaje desde el TPV).
- ERP con marca alaCarta, desplegado e integrado con TPV y backoffice.
- Informes cruzados: coste de personal frente a ventas por hora, margen real con compras.
- Remisión VeriFactu; factura electrónica.

## Fase 5 · App propia, IA, grupos e integraciones

- App propia (PWA) con reservas, pedidos y puntos.
- Llamadas con IA con el proveedor elegido.
- Carta maestra con variantes por local; multiempresa con el ERP.
- Integraciones externas (datáfonos, agregadores, Reserva con Google); API y webhooks.
- Modo oscuro del TPV para barra de noche.

## Ideas sin compromiso

- Imanes de captación con correo (checklist de apertura, plantilla de carta) cuando haya endpoint.
- Páginas de cumplimiento (`/cumplimiento/verifactu`, factura electrónica).
- Asistente con IA sobre los datos del local, solo con datos reales y valor demostrable.
- Internacionalización (catalán, inglés) cuando el mercado lo justifique.
