# Auditoría y replanteamiento de la web · 16-11-2026

**Loop completado el 17-11-2026: ver [LOG-LOOP.md](LOG-LOOP.md).**

alaCarta pasa de vender **un TPV con módulos** a vender **un ecosistema que hace funcionar el
restaurante**: servicio, canales propios, gestión (ERP y RRHH), equipamiento y puesta en marcha,
todo conectado. Esta carpeta audita la web actual vista a vista y define qué hacer en cada una.

Fuentes: código actual, `docs/investigacion/*` (incluido el nuevo
`ecosistema-y-embudo.md`), análisis de GestiTec (ERP: Negocio; RRHH: Personal) y de Ofasty (IA,
app, web, hardware) hecho en modo lectura.

## Documentos

| # | Documento | Qué cubre | Prioridad |
| --- | --- | --- | --- |
| 01 | [Estrategia y arquitectura](01-estrategia-y-arquitectura.md) | Posicionamiento, familias, honestidad de estado, mapa de URLs, modelo comercial, embudo, decisiones | 0 |
| 02 | [Navegación y layout](02-navegacion-y-layout.md) | Megamenús con iconos, cabecera, barra móvil, pie | 1 |
| 03 | [Home](03-home.md) | Reescritura completa | 1 |
| 04 | [Hub de soluciones y plantilla](04-soluciones-hub-y-plantilla.md) | `/soluciones`, modelo de datos, plantilla de producto | 1 |
| 05 | [Servicio en sala y cocina](05-servicio-sala-y-cocina.md) | TPV, comandero, cocina, carta QR | 2 |
| 06 | [Clientes y canales](06-clientes-y-canales.md) | Reservas, pedidos online, app propia, llamadas IA, clientes, web y Google | 2 |
| 07 | [Gestión](07-gestion-backoffice-erp-rrhh.md) | Backoffice e informes, ERP, Equipo y RRHH | 2 |
| 08 | [Equipamiento y servicios](08-hardware-placas-qr-puesta-en-marcha.md) | Hardware, placas QR, puesta en marcha | 2 |
| 09 | [Precios y configurador](09-precios-y-configurador.md) | Planes, complementos, "Monta tu alaCarta" | 2 |
| 10 | [Demos interactivas](10-demos-interactivas.md) | Simulador, carta QR escaneable, llamada IA, configurador, calculadora, mapa | 2 |
| 11 | [Embudo y conversión](11-embudo-y-conversion.md) | Cuatro puertas, formulario en 3 pasos, gracias, atribución | 1 |
| 12 | [Sectores y momentos](12-sectores-y-momentos.md) | 9 sectores + 3 momentos nuevos | 3 |
| 13 | [Recursos, empresa y legal](13-recursos-empresa-y-legal.md) | Guías, herramientas, por qué, fundadores, novedades, legal | 3 |

## Resumen de la auditoría en 10 líneas

1. La web actual es sobria, honesta y técnicamente sólida: **se conserva la base** (marca, tokens,
   Astro, datos como fuente única, tono).
2. Vende un TPV, no un ecosistema: faltan 7 productos y la conexión entre ellos.
3. Todo es estático: la promesa "todo conectado" **no se demuestra** en ningún sitio → demos vivas.
4. Una sola puerta de conversión de alto compromiso → **cuatro puertas** (probar, calcular, te
   llamamos, demo).
5. Menús planos sin iconos → **megamenús por familia** con iconos y tarjeta de demo con QR.
6. "Informes" deja de ser producto: se fusiona en **Backoffice e informes**; ERP y RRHH son
   productos aparte.
7. Precio sin ancla de ecosistema → plan **Total** + complementos + **configurador como una carta**.
8. Sin respuesta al miedo al cambio → páginas de **puesta en marcha**, **hardware** y **momentos**
   (abrir, cambiar de TPV, dejar comisiones).
9. Sin prueba social (correcto no inventarla) → sustitutos honestos: demos, transparencia de estado
   (`/novedades`), locales fundadores, cara del equipo.
10. Con 16 productos, la honestidad tiene que ser **estructural**: estado por producto e
    integraciones "en camino" marcadas en datos.

## Decisiones de Jordi (ver 01 §9)

**Tomadas el 16-11-2026:**

- Informes se **fusiona en Backoffice e informes**; ERP y Equipo/RRHH son productos aparte.
- Se publica el **plan Total** (159 €) y los **complementos** con cifras orientativas (09).
- Estado: chip **"En camino" solo en lo nuevo** que depende de terceros o ramas sin desplegar (app
  propia, llamadas IA, ERP) y en integraciones no hechas; el resto como hoy.
- **Locales fundadores: sí**, con precio bloqueado, puesta en marcha presencial incluida, línea
  directa con producto, 20 plazas reales, sin cuentas atrás.

Pendientes (no bloquean; se implementan sin inventar el dato): proveedor de voz IA, teléfono
comercial, proveedor y precios de hardware y placas, marca blanca de GestiTec, herramienta de agenda.

Se implementa con las **propuestas por defecto** de cada documento, todas centralizadas en datos
(`src/data/*`) para cambiarlas en un sitio. Las cifras nuevas van marcadas como orientativas. Lo
que necesita un dato que no existe (teléfono, proveedor de IA, precios de hardware) se muestra sin
inventarlo ("en tu propuesta", "en camino").

## Protocolo del loop de implementación

Orden (cada paso deja la web compilando y `npm test` en verde):

1. **Fundación**: modelo de datos (familias, `icon`, `status`, conexiones), iconos nuevos, helper de
   CTA, megamenú y pie (02).
2. **Productos**: plantilla y hub (04) → 05 → 06 → 07 → 08.
3. **Demos**: datos de La Plaza, QR en build, D3 carta, D1 simulador, D2, D7, D4, D8 (10).
4. **Precios**: planes, complementos, configurador D5, calculadora D6 (09).
5. **Embudo**: formulario en 3 pasos, `/gracias`, contacto, CtaBand (11).
6. **Home** (03), que ya puede usar todas las piezas.
7. **Sectores y momentos** (12).
8. **Recursos y empresa** (13).
9. **QA final**: capturas 1440/390 de todas las plantillas, enlaces, accesibilidad básica,
   actualización de `README.md`, `docs/TODO.md`, `docs/NEGOCIO.md`, `docs/PRECIOS.md` y
   `docs/ROADMAP.md`.

En cada documento, al terminar: cambiar **Estado** a `hecho` y marcar los criterios de aceptación.
Sin push, sin despliegue, sin commits salvo que Jordi los pida.
