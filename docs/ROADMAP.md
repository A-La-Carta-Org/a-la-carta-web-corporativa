# Roadmap

## Fase 0 · Web corporativa y planteamiento (hecha, noviembre de 2026)

- Marca, identidad visual y sistema de diseño.
- Web completa: 36 páginas, SEO técnico, maquetas del producto, formularios, legales en borrador.
- Documentación de negocio, precios, arquitectura y despliegue.
- Git local preparado. Sin despliegue externo.

## Fase 1 · Publicación de la web (siguiente)

Objetivo: alacarta.com en producción, captando solicitudes de demo.

- Repositorio remoto y CI.
- Coolify: aplicación desde Dockerfile, dominio, SSL.
- Endpoint de formularios y buzón de correo corporativo.
- Textos legales revisados con la sociedad titular.
- Analítica respetuosa (sin cookies) o ninguna.
- Search Console, sitemap enviado, comprobación de indexación.
- Página de estado del producto o nota de "en construcción" honesta si la demo se hace con
  prototipo.

## Fase 2 · MVP del producto (primer trimestre de desarrollo)

Lo mínimo para que un local trabaje un servicio completo y para que la web no prometa nada que no
exista:

1. **Identidad y cuenta**: organización, empresa, local, usuarios, roles, PIN de dispositivo.
2. **Backoffice**: carta (categorías, productos, modificadores, alérgenos, precios por canal),
   mesas y zonas, impresoras, usuarios.
3. **TPV**: plano de sala, modo barra, comanda, envío a impresoras, cobro (efectivo, tarjeta manual,
   mixto, dividir), descuentos con motivo, cierre de caja, tickets conformes a VeriFactu (modalidad
   no VeriFactu primero; remisión después).
4. **Carta QR** de consulta (sin pedido) con alérgenos.
5. **Informes básicos**: ventas por día, hora, producto, forma de pago; cierre diario por correo.
6. **Modo sin conexión** del TPV con cola de sincronización.
7. Suscripción y prueba (Stripe Billing).

Criterio de salida: tres locales piloto trabajando un mes con el MVP.

## Fase 3 · Servicio en mesa y cocina

- Comandero móvil (PWA) con tiempos y envío por zonas.
- Pantalla de cocina con tiempos, partidas, listo/recogido y agotados.
- Pedido desde la mesa en la carta QR.
- Reservas: libro, widget web, confirmaciones, turnos, aforo, lista de espera.
- Clientes: ficha automática desde reservas y pagos; consentimientos.

## Fase 4 · Canales propios y gestión avanzada

- Pedidos online: tienda, franjas, zonas, pago online, capacidad por franja.
- Pago en mesa desde la carta QR.
- Inventario y escandallos, mermas, pedidos a proveedor.
- Facturación completa, series, exportación para asesoría, acceso de solo lectura para gestoría.
- Fidelización: puntos, campañas, segmentos.
- Remisión VeriFactu a la AEAT; TicketBAI.

## Fase 5 · Grupos e integraciones

- Carta maestra con variantes por local; publicación selectiva.
- Multiempresa con series y datos fiscales por sociedad.
- Informes comparativos entre locales.
- API pública y webhooks.
- Integraciones: pasarelas y datáfonos, agregadores de reparto, reservas externas, contabilidad.
- Modo oscuro del TPV para barra de noche.

## Evolución futura (ideas, sin compromiso)

- Herramienta gratuita de carta QR como imán de captación.
- Páginas de cumplimiento (`/cumplimiento/verifactu`, `/ticketbai`, `/factura-electronica`).
- Comparativas con competidores y calculadora de ahorro de comisiones.
- Hardware certificado con margen, nunca obligatorio.
- Planificación de turnos y control horario (si el mercado lo pide; hoy fuera de alcance).
- Asistente con IA sobre los datos del local (solo cuando haya datos reales y valor demostrable).
- Internacionalización (catalán, inglés) cuando el mercado lo justifique.
