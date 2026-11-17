# 06 · Familia "Clientes y canales": reservas, pedidos online, app propia, llamadas con IA, clientes, web y Google

**Estado:** hecho (fase 2; demo de llamada D4 en la fase 4; precios de complementos en la fase 5) · **Prioridad:** 2 · **Depende de:** 04, 10 (D4), 11

Esta familia es **el mejor argumento económico del ecosistema**: todo lo que hoy el hostelero paga
por comisión (agregadores, plataformas de reservas, tiendas online) o pierde por no atender (el
teléfono en pleno servicio). Su hilo común: **"tus clientes, tus canales, tu marca, sin pagar por
cada uno"**. Debe enlazar a la calculadora de comisiones y al momento "dejar las comisiones".

## Reservas · `/soluciones/reservas` (existe; ajustar)

- Añadir en "Conexiones": llamadas con IA (la reserva telefónica entra *por confirmar* en el libro),
  app propia, web (botón de reservar), carta QR (la mesa reservada abre la carta), clientes.
- **Lo que dejas de hacer**: pagar por comensal, apuntar en libreta, no-shows sin garantía, llamar
  para confirmar.
- Dato de mercado con fuente (ya en investigación): no-show medio 3,3 % (TheFork 2025) y 0,66 % con
  tarjeta de garantía (CoverManager). Presentarlo como dato del sector, con fuente.
- Reserva con Google: decir "en camino" salvo que esté.

## Pedidos online · `/soluciones/pedidos-online` (antes `/soluciones/pedidos`)

- Renombrar slug. Hero con el móvil de la tienda.
- **Lo que dejas de hacer**: pagar 14-30 % por pedido a un agregador por clientes que ya eran tuyos.
- Mini calculadora (D6 reducida) dentro de la página.
- **Agregadores**: "integración con Glovo, Uber Eats y Just Eat en el plan de producto" (Ofasty
  tenía Glovo; aquí todo es nuevo: *en camino*).
- Diferenciar claramente de **App propia**: pedidos online = tienda web enlazable (desde Instagram,
  Google, tu web); app propia = la misma tienda + reservas + fidelización como app instalable con tu
  marca.

## App propia · `/soluciones/app-propia` (NUEVA)

- **H1**: "Tu app de reservas y pedidos, con tu nombre y sin comisiones."
- **Intención SEO**: "app propia restaurante", "app pedidos restaurante sin comisiones" (hipótesis
  de volumen bajo pero intención muy comercial).
- **Qué hace**: reservas (día, hora, personas), pedidos para recoger y a domicilio con reparto
  propio, pago online, carta sincronizada, puntos y promociones (con Clientes), notificaciones,
  repetir el último pedido, sin registro obligatorio.
- **Honestidad técnica**: será una **PWA instalable** (icono en la pantalla de inicio) con tu logo y
  colores. Publicación en App Store / Google Play: "en camino" o "bajo pedido" (decisión: cuesta
  cuentas de desarrollador por cliente y revisiones; no prometerlo sin decidir).
- Frase honesta heredada de Ofasty y buena: *"La app no te trae clientes nuevos: hace que los que ya
  tienes vuelvan y pidan directo."* Credibilidad alta.
- **Maqueta nueva**: `MockApp` (móvil con pantalla de inicio de La Plaza: "Reservar" / "Pedir" /
  "Mis puntos").
- **Conexiones**: pedidos online, reservas, clientes, cocina, TPV, web, placas QR (el QR de la mesa
  invita a instalar la app tras pagar).
- **Precio**: complemento (09).

## Llamadas con IA · `/soluciones/llamadas-ia` (NUEVA)

- **H1**: "Un asistente que coge el teléfono cuando tú no puedes."
- **Problema** (fuerte, real): en pleno servicio nadie coge el teléfono; cada llamada perdida es una
  reserva o un pedido que se va a otro sitio.
- **Qué hace** (solo lo que se puede sostener; base: contrato de Ofasty, a revalidar con el
  proveedor que se elija):
  - Toma **reservas** que quedan **por confirmar** en el libro; anula reservas desde el mismo número.
  - Toma **pedidos para recoger** (no a domicilio en la primera versión), que el local **acepta en
    el TPV** antes de que vayan a cocina; si nadie acepta, caducan.
  - Responde horario, dirección y carta **leyendo la carta del sistema** (no inventa platos ni
    precios).
  - **Pasa a una persona** si hay alergia grave, queja o grupo grande.
  - Se presenta como asistente al empezar la llamada; guarda solo los datos mínimos.
- **Lema de confianza**: "La IA propone, tú decides." Muy buen antídoto contra el miedo a la IA.
- **Demo** (D4): llamada de ejemplo con transcripción + reserva que aparece en el libro. Fase 2:
  número de prueba.
- **Legal**: añadir a privacidad la grabación/transcripción de llamadas y el aviso al llamante;
  encargo de tratamiento con el proveedor de voz. Ver 13.
- **Precio**: cuota + minutos (09). Explicar que **no es comisión** y que una llamada se paga una
  vez aunque haga reserva y pedido.
- **No decir** idiomas, "24/7 sin fallos", ni porcentajes de llamadas resueltas hasta tenerlos.
- **Decisión bloqueante**: proveedor del agente de voz (01 §9.4).

## Clientes y fidelización · `/soluciones/clientes` (existe; ajustar)

- Reubicar en esta familia. Conexiones nuevas: app propia (puntos), llamadas IA (reconoce al
  cliente que llama: *en camino*), web (formulario), carta QR (alta tras pagar).
- RGPD: consentimientos explícitos; ya está en el copy, mantener.

## Web y presencia en Google · `/soluciones/web-para-restaurantes` (NUEVA)

- **H1**: "Una web que reserva, vende y aparece en Google. Hecha y mantenida por nosotros."
- **Intención SEO**: "página web para restaurantes", "diseño web restaurante" (comercial; competencia
  de agencias). Es también **puerta de entrada** para locales que aún no cambian de TPV.
- **Incluye** (base Ofasty, revisar): diseño a medida sobre plantilla sobria, textos, carta
  **sincronizada con el backoffice**, botones de reservar y pedir (si se contratan), cómo llegar,
  alojamiento, certificado, copias, textos legales, cambios de temporada; dominio a nombre del
  cliente.
- **Presencia local** (lo nuevo y diferencial): alta y optimización del **Perfil de Empresa de
  Google** (categorías, horarios, fotos, carta, enlace de reserva), coherencia de datos en
  directorios, plan de reseñas (tras pagar en carta QR, invitación a reseñar: *en camino*), informe
  mensual sencillo. **No prometer posiciones.**
- **Proceso**: 1-2 semanas, "la ves montada antes de pagar" (si se mantiene esa garantía de Ofasty,
  es un argumento excelente).
- **Ejemplo visual**: maqueta de web de La Plaza en ventana de navegador (nueva `MockWeb`).
- **Precio**: alta + cuota (09).

## Criterios de aceptación de la familia

- [x] 3 páginas nuevas (app propia, llamadas IA, web) con la plantilla 04 y maquetas nuevas
      `MockApp`, `MockWeb`, `MockLlamada` (transcripción + libro).
- [x] Pedidos online renombrado; reservas y clientes con conexiones nuevas.
- [x] Cada página enlaza calculadora y momento "dejar las comisiones".
- [x] Ninguna afirmación de la lista prohibida de 01 §4.
- [x] `npm test` verde, capturas revisadas.

## Notas de implementación · datos (fase 1, 16-11-2026)

Solo datos y copy base en `src/data/solutions.ts`; las páginas se completan en la fase 2, así que
los criterios de este documento siguen sin marcar.

- `pedidos` renombrado a `pedidos-online` (301 en `nginx.conf`); agregadores marcados "en camino".
- Nuevos con copy completo (6 features, conexiones, ≥ 4 FAQ): `app-propia` (en camino, PWA,
  tiendas "en estudio", frase "no te trae clientes nuevos"), `llamadas-ia` (en camino; reservas
  por confirmar, solo pedidos para recoger, "la IA propone, tú decides", sin idiomas ni
  porcentajes, coste por minutos), `web-para-restaurantes` (disponible; sin prometer posiciones ni
  plazo cerrado ni "la ves montada antes de pagar", que sigue sin decidir; JSON-LD `Service`).
- Reservas y clientes con las conexiones nuevas; "Reserva con Google" como en camino.
- El rango de comisión de agregadores usado en momentos y calculadora es 14-30 % (fuente en
  `docs/investigacion/mercado-y-seo.md`), no 14-35 %.

## Notas de implementación (fase 2 · páginas, 17-11-2026)

- Maquetas nuevas: `MockApp` (móvil: inicio de La Plaza con Reservar / Pedir / Mis puntos, puntos y
  repetir pedido), `MockWeb` (ventana: web de La Plaza en `www.tulocal.es` con botones, carta al
  día, horario y ficha de Google revisada; la foto es un hueco gris, sin imágenes falsas) y
  `MockLlamada` (transcripción + «Reserva creada · Por confirmar» + otras llamadas del día:
  pedido pendiente de aceptar en el TPV, pregunta resuelta, grupo pasado al local).
- Calculadora y «dejar las comisiones»: la plantilla los añade a toda la familia (bloque «Si
  estás en uno de estos momentos» y enlace en el cierre).
- Reservas con datos del sector (no-show 3,3 %, TheFork 2025; 0,66 % con garantía, CoverManager).
- App propia: conexión con el TPV añadida. Pedidos online: «Agregadores en la misma cola» con chip
  «En camino» (antes iba en el título). Web: «informe mensual sencillo» dentro de datos
  coherentes; sin plazo cerrado ni «la ves montada antes de pagar» (sin decidir).
- Pendiente: mini calculadora dentro de pedidos online (D6 reducida, fases 4-5), demo de llamada
  D4 (fase 4; hoy no hay «Pruébalo» en llamadas IA) y cifras de app propia, llamadas IA y web
  (fase 5; hoy «En tu propuesta» con la forma de cobro). Privacidad de llamadas: fase 13.
