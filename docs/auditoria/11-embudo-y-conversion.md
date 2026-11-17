# 11 · Embudo de venta: CTAs, formularios, demo, "te llamamos", gracias y contacto

**Estado:** hecho (fase 6, 17-11-2026) · **Prioridad:** 1 (afecta a todas las páginas) · **Depende de:** 02, endpoint de formularios (TODO)

## 1. Diagnóstico

- **Una única puerta**: "Solicitar demo" (videollamada de 30 min) en cabecera, hero y cierre de
  todas las páginas. Es la conversión de mayor compromiso. Quien aún no está listo se va sin dejar
  nada.
- Bien hecho y se conserva: parámetros `?modulo=` y `?sector=` que precargan el formulario,
  cabecera mínima en `/solicitar-demo`, consentimiento, honeypot, alternativa por correo sin
  endpoint.
- Mal: el formulario es **una sola pantalla larga** (nombre, correo, teléfono, local, tipo, nº
  locales, plan, 9 checkboxes de módulos, motivo, mensaje). Con 16 productos sería peor.
- No hay **página de gracias** (ni evento de conversión medible, ni siguiente paso).
- No hay **atribución**: no se sabe desde qué página o demo vino el lead.
- No hay **teléfono** ni opción de llamada.
- `/contacto` y `/solicitar-demo` se solapan.

## 2. Las cuatro puertas (escalera de compromiso)

| Puerta | Compromiso | Dónde | Destino |
| --- | --- | --- | --- |
| **Pruébalo** | Ninguno, sin datos | Cabecera, heros, megamenú | `/demo`, `/demo/carta`, demos en página |
| **Calcula** | Bajo; correo opcional | Precios, canales, momentos | Configurador, calculadora → "envíamelo" (correo) |
| **Te llamamos** | Bajo: nombre + teléfono + franja | Barra fija móvil, cierre, solicitar demo | Formulario corto (`modo=llamada`) |
| **Solicitar demo** | Alto: videollamada | Todo | Formulario en 3 pasos |

## 3. `/solicitar-demo` rediseñado

Formulario **en 3 pasos** (patrón Owner/Qamarero: cualificar primero, que además es menos
intimidante):

1. **Tu local**: tipo (tarjetas con icono, no `<select>`), nº de locales (1 · 2-3 · 4-10 · más),
   momento (abrir · cambiar de TPV · añadir algo a lo que tengo · solo mirar).
2. **Qué te interesa**: familias con productos como chips (preseleccionados desde `?modulo=` o
   `?config=`), "¿qué usas hoy?" (texto corto opcional), equipo (¿necesitas hardware?).
3. **Cómo hablamos**: nombre, correo, teléfono (obligatorio solo si elige llamada), preferencia
   (videollamada · llamada · visita presencial si está en zona), franja horaria, consentimiento.

Columna lateral: qué pasa después (3 pasos), "Respuesta en 24 h laborables", correo y teléfono
visibles, y **"¿Prefieres no esperar? Pruébalo ahora"** → `/demo`.

Fase 2: calendario integrado en el paso 3 (Cal.com autoalojado o similar) para reservar la cita al
momento. Decisión: herramienta de agenda.

**Modo llamada** (`?modo=llamada`): mismo componente, solo paso 3 reducido (nombre, teléfono,
franja, consentimiento).

## 4. Atribución y contexto

- `LeadForm` añade campos ocultos: `origen` (ruta de la página desde la que llegó o parámetro
  `origen`), `cta` (qué botón), `config` (configuración serializada del configurador), `utm_*`
  si existen, `demo_completada` (si el visitante terminó el simulador; `sessionStorage` con
  try/catch).
- Todo CTA de la web pasa por un helper `ctaHref({ to, modulo?, sector?, origen })` para no
  construir URLs a mano.

## 5. `/gracias` (NUEVA, `noindex`)

- Confirmación con lo que ha pedido ("Te escribimos antes de 24 h laborables a …").
- **Qué preparar para la demo**: carta actual (PDF o foto), nº de mesas, equipo que usáis.
- Mientras tanto: simulador, carta de ejemplo, guía según su momento.
- Evento de conversión (cuando haya analítica) disparado aquí, no en el clic.

## 6. `/contacto`

Queda para lo que **no** es venta: soporte, prensa, partners/distribuidores, gestorías (canal
prescriptor), trabajo. Selector de motivo con tarjetas; si elige "quiero contratar", redirige al
formulario de demo. Añadir bloque "Gestorías y asesorías": acceso gratuito al ERP para sus
clientes (argumento de canal).

## 7. CTAs por página

- Hero: primario `Solicitar demo` + secundario contextual (`Pruébalo` si hay demo; `Ver precio` si
  no).
- Cierre (`CtaBand`): tres salidas — Solicitar demo · Te llamamos · Pruébalo — con título
  contextual.
- Barra fija móvil (02).
- **Nada de pop-ups, exit-intent ni cuentas atrás.**

## 8. Lead magnets (sin muro salvo que aporte)

Sin pedir correo: guías, calculadoras, plantillas visibles en la web. Con correo opcional
("envíamelo"): resultado del configurador y de la calculadora, checklist de apertura en PDF,
plantilla de cuadrante de turnos y de escandallo (Excel). Fase 2: **auditor de la ficha de Google**
(patrón "Restaurant Grader" de Owner; necesita API de Google Places y backend).

## 9. Seguimiento comercial (fuera de la web, pero hay que decidirlo)

Endpoint de formularios, CRM, correo de confirmación automático con el resumen y enlace a la demo
interactiva, guion de demo por tipo de local, propuesta tipo en PDF generada desde la configuración
(ver `docs/TODO.md` §2 y §4).

## 10. Criterios de aceptación

- [x] `LeadForm` en 3 pasos con modo llamada, accesible (foco al cambiar de paso, errores
      anunciados), precarga por URL, campos de atribución.
- [x] `/gracias` y redirección tras envío correcto.
- [x] `/contacto` reorientado.
- [x] Helper de CTA usado en toda la web; `CtaBand` con tres salidas.
- [x] `npm test` verde; prueba manual de los tres modos con y sin endpoint (endpoint de prueba
      local en el puerto 4339 durante la verificación; ver notas).

## Notas de implementación (fase 6, 17-11-2026)

**Piezas**

| Pieza | Archivo |
| --- | --- |
| Lógica pura (opciones, lectura de URL, tipos de solicitud, `mailto`, validación) | `src/lib/lead.ts` |
| Atribución en `sessionStorage` (sin cookies), demo completada, última solicitud | `src/lib/attribution.ts` (se carga en `BaseLayout`, 0,5 KB gzip) |
| Formulario de demo en 3 pasos + modo llamada | `src/components/islands/LeadForm.vue` (7,3 KB gzip) |
| Formulario de contacto (lo que no es venta) | `src/components/islands/ContactForm.vue` (3,7 KB gzip) |
| Páginas | `src/pages/solicitar-demo.astro`, `gracias.astro`, `contacto.astro` |
| Cierre con tres salidas | `src/components/blocks/CtaBand.astro` |
| Comprobación | `scripts/check-lead.mjs` (`npm run check:lead`, 10 casos, dentro de `npm test`) |

**Formulario (`/solicitar-demo`)**

- Paso 1 *Tu local*: tipo con tarjetas e icono (9 sectores + «Otro tipo de local»), nº de locales
  (1 · 2 a 3 · 4 a 10 · más de 10, preseleccionado 1), momento (abrir · cambiar de TPV · añadir
  algo · solo mirar) y nombre del local opcional. Obligatorios: tipo y momento.
- Paso 2 *Qué te interesa*: los 16 productos como chips agrupados por familia (con «En camino»
  donde toca), «¿Qué usas hoy?» y «¿Necesitas equipo?». Nada obligatorio.
- Paso 3 *Cómo hablamos*: preferencia (videollamada · llamada · visita al local, «según la zona»),
  nombre, correo, teléfono (obligatorio solo si elige llamada), franja (por la mañana · después de
  comidas · por la tarde · me da igual), mensaje opcional y consentimiento.
- **Modo llamada** (`?modo=llamada`): solo nombre, teléfono, franja y consentimiento. Se puede
  cambiar de modo desde el propio formulario («¿Con una llamada te basta? / Pide una demo»), que
  actualiza la URL y el titular de la página.
- Accesibilidad: indicador de pasos con `aria-current="step"` (los pasos hechos son botones para
  volver), el foco va al titular de cada paso, errores en `<p id>` enlazados con
  `aria-describedby` y `aria-invalid` (en los grupos de tarjetas, `role="radiogroup"` en el
  `fieldset`), foco al primer campo con error, resumen en `aria-live`. Intro en un campo avanza de
  paso; flechas entre tarjetas (radios nativos). Los errores se limpian al escribir (no al salir
  del campo, para que la línea de error no desplace el botón bajo el ratón).
- **Sin JavaScript**: se ven los tres pasos seguidos con un solo botón y `required` nativos; el
  formulario hace `POST` al endpoint, o a `mailto:` en texto plano si no hay endpoint. La precarga
  por URL necesita JS (sin JS no se lee la URL).
- Titular y «Qué pasa después» cambian según la variante (demo · llamada · propuesta ·
  fundador) con un script en línea antes de pintar.

**Precarga por URL** (`parseLeadParams`): `modulo` (soluciones y `hardware`, `placas-qr`,
`puesta-en-marcha`; admite lista con comas), `sector`, `plan` (incluido `grupos`), `motivo`
(`propuesta`, `comisiones`, `fundador`), `modo`, `origen` (solo `[a-z0-9-]`), `equipo` y `config`
con sus tres formatos: configurador (`describeConfig()`; marca TPV, carta QR y backoffice si hay
plan, los módulos, hardware, placas y puesta en marcha; `config=f` → motivo fundador), placa QR
(«Placa de madera, de sobremesa, con NFC · mesa 7 · a nombre de «Casa Pepa»») y calculadora de
comisiones (pedidos, ticket, comisión, € al año, % que quiere pasar). Lo que trae se enseña en
«Lo que nos traes» y viaja en el envío. Lo desconocido se ignora (comprobado en `check:lead`).

**Atribución**: en la primera página de la sesión se guarda `entrada` (ruta + consulta),
`referrer` externo (origen + ruta, sin consulta), `llegada` y `utm_*`. El simulador (D1) marca
`demo_completada` al cobrar la mesa. Todo `sessionStorage` con try/catch; nada de terceros.

**Envío** (contrato en `docs/DESPLIEGUE.md` §6): JSON por `POST` a `PUBLIC_FORM_ENDPOINT` →
`/gracias?tipo=…&momento=…`. Sin endpoint (hoy): aviso + botón «Enviar por correo» con la
solicitud escrita; al pulsarlo, `/gracias?…&via=correo` (titular «Solo falta enviar el correo»).
Con error HTTP: aviso con el correo. Verificado con un endpoint de prueba local: demo, llamada y
contacto llegan con todos los campos y redirigen bien.

**`/gracias`** (`noindex`): variantes demo · llamada · propuesta · fundador · contacto (y aviso de
soporte si `motivo=soporte`), «Qué pasa ahora» en 2-3 pasos, «Si lo tienes a mano» (no en
contacto), «Mientras tanto» con simulador, carta y una tercera tarjeta según el momento (abrir →
momento abrir; cambiar → momento cambiar de TPV; añadir → hub; mirar → configurador; sin momento →
puesta en marcha). Nombre, correo y franja vienen de `sessionStorage`, no de la URL. Evento
`alacarta:conversion` disparado al cargar (sin analítica que lo escuche todavía). Tiempo: solo las
24 h laborables de `REPLY_HOURS`.

**`/contacto`**: tarjetas de motivo (soporte · gestoría o asesoría · partners y distribuidores ·
prensa · otra cosa) y una tarjeta-enlace «Quiero contratar o ver alaCarta» → demo. Correos general
y de soporte, «¿Prefieres hablar?» → `modo=llamada`. Bloque «Gestorías y asesorías» con tres
columnas. Sin teléfono (pendiente).

**`CtaBand`**: título + tres salidas — *Pruébalo* (demo del producto o simulador), *Calcula*
(Monta tu alaCarta con el producto o el sector, o la calculadora en momentos de comisiones) y
*Habla con nosotros* (Solicitar demo + Te llamamos). `origen` obligatorio en el tipo; las 21
plantillas que lo usan pasan un `origen` propio (`…-cierre`). Cabecera: solo «Pruébalo» y
«Solicitar demo» (sin «Te llamamos»); barra móvil y pie ya llevaban a `modo=llamada`.

**Desviaciones y decisiones por defecto**

- `/contacto` usa un formulario propio (`ContactForm.vue`) en vez del `LeadForm` con variante:
  son formularios distintos y así el de demo no carga lo de contacto.
- «Trabajo» no entra en los motivos de contacto (no hay vacantes que anunciar): queda «otra
  cosa».
- Bloque de gestorías **sin** «acceso gratuito» (doc 07: no confirmado). Se cuenta el acceso con su
  usuario, lo que da hoy el backoffice y que el ERP está en camino.
- El plan Grupos de `/precios` va ahora a la demo (`plan=grupos`) en vez de a contacto; un enlace
  antiguo `motivo=grupos` también se interpreta como plan Grupos.
- Franjas sin horas concretas (no hay horario comercial definido).
- «Visita al local» como preferencia, con «según la zona» (zona sin definir).
- Columna lateral sin teléfono (pendiente) y sin calendario (fase 2: herramienta de agenda).
- Lead magnets con correo (§8): no hechos; necesitan el endpoint.

**Pendiente (Jordi)**: endpoint de formularios y buzón de destino; teléfono comercial; zona de
visitas; herramienta de agenda; analítica que escuche `alacarta:conversion`.

**Capturas**: `docs/auditoria/capturas/fase-6/`.
