# 13 · Recursos, herramientas, "Por qué alaCarta", fundadores, novedades y legal

**Estado:** hecho (17-11-2026, fase 9) · **Prioridad:** 3 · **Depende de:** 01, 10 (D6), 11

## 1. Recursos (`/recursos`)

**Hoy:** índice + FAQ + 3 guías (elegir TPV, VeriFactu, carta QR) + centro de ayuda "en
construcción".

**Cambios:**

- Índice en tres bloques: *Aprende* (guías), *Herramientas* (calculadora, configurador, demo,
  comprobador de equipo), *Ayuda* (FAQ, centro de ayuda, contacto de soporte).
- **Guías nuevas** (priorizadas por intención y por el ecosistema):
  1. Cómo abrir un restaurante: checklist completo (apoya el momento "abrir").
  2. Registro de jornada en hostelería: qué es obligatorio hoy (2019) y qué está pendiente (RD de
     registro digital **no publicado** a 16-11-2026), con fecha de revisión visible.
  3. Cómo reducir los no-shows (datos con fuente).
  4. Canal propio frente a agregadores: cuentas reales.
  5. Escandallos: cómo calcular el coste por plato (con plantilla).
  6. Perfil de Empresa de Google para restaurantes: lo que funciona.
  7. Atención telefónica con IA: qué puede y qué no puede hacer.
  Cada guía con CTA contextual y enlaces a solución/momento.
- Guía VeriFactu: comprobar el estado del aplazamiento a 2028 en el BOE antes de publicar.
- **Centro de ayuda**: mientras no haya producto, cambiar "en construcción" por "Disponible con el
  lanzamiento; mientras tanto, escríbenos a soporte@". No enlazarlo en el menú principal hasta que
  exista (sí en el pie).

## 2. Herramientas (`/herramientas/*`)

- `/herramientas/calculadora-comisiones` (D6). Página propia indexable con texto explicativo
  (metodología, fuentes de los rangos de comisión).
- Fase 2: auditor de ficha de Google, generador de carta QR gratuito (ya en roadmap: imán potente,
  pero requiere backend).

## 3. "Por qué alaCarta" (`/por-que-alacarta`)

**Hoy:** comparativa "lo habitual / lo nuestro", principios de diseño, compromisos, "en qué punto
estamos". Buen contenido, sitio equivocado (primer nivel del menú).

**Cambios:**

- Sale del primer nivel (va a Recursos ▾ y pie).
- Reorientar a **ecosistema**: "Por qué un solo sistema y no siete herramientas". La tabla
  comparativa gana filas: teléfono, app, web, compras, equipo.
- Mantener los compromisos y la sección de honestidad, enlazando a `/novedades`.
- Añadir "Quién hay detrás" (equipo/fundador con nombre y foto **solo si Jordi lo aprueba**): en una
  marca nueva sin clientes, una cara real es la mejor prueba social disponible.

## 4. Locales fundadores (`/locales-fundadores`) — si se aprueba

Qué es, condiciones (precio bloqueado, puesta en marcha presencial incluida, línea directa con
producto, compromiso de feedback), plazas reales, a quién buscamos (tipos de local y zonas), FAQ y
formulario con `motivo=fundador`. Sin contadores ni urgencia artificial.

## 5. Novedades / estado del producto (`/novedades`)

Tabla viva por producto: disponible · piloto · en camino (trimestre). Alimentada desde el mismo
`status` de `solutions.ts`. Más un registro de cambios cuando haya producto. Convierte la honestidad
en argumento.

## 6. Integraciones

No como primer nivel (es un ecosistema propio), pero sí una sección en `/soluciones` y en el pie:
pagos/datáfonos, agregadores, gestorías/contabilidad, Google, impresoras. Todas con estado.

## 7. Legal (impacto del ecosistema)

- **Privacidad**: añadir tratamientos nuevos de la web (solicitudes de llamada, configuraciones
  enviadas, demo de llamada si se usa número real) y, a nivel de producto, informar de que alaCarta
  actuará como encargado para llamadas con IA (grabación/transcripción), RRHH (datos de empleados,
  geolocalización del fichaje) y app propia.
- **Cookies**: las demos usan `sessionStorage`/memoria, no cookies; mantener "sin cookies".
- Revisar por asesor antes de publicar (ya en TODO).

## 8. FAQ global (`/recursos/preguntas-frecuentes`)

Reorganizar por familias (Servicio, Canales, Gestión, Equipamiento, Precios, Empresa) y añadir las
preguntas nuevas de cada producto. Mantener JSON-LD `FAQPage`.

## 9. Criterios de aceptación

- [x] Recursos con 3 bloques; al menos 3 guías nuevas (registro de jornada, abrir restaurante,
      canal propio) con fecha de revisión.
- [x] Calculadora de comisiones publicada como herramienta.
- [x] Por qué reorientado; novedades con estados desde datos.
- [x] Fundadores solo si Jordi aprueba (si no, se omite sin dejar enlaces rotos).
- [x] Legal actualizado en borrador.
- [x] `npm test` verde.

## 10. Notas de implementación (fase 9, 17-11-2026)

**Hecho**

- **`/recursos`** en tres bloques con icono: *Aprende* (todas las guías, ordenadas por fecha de
  revisión, con «Revisada el …»), *Herramientas* (calculadora de comisiones, Monta tu alaCarta,
  demo interactiva, comprobador de equipo) y *Ayuda* (FAQ, centro de ayuda, soporte por correo),
  más una fila «Sobre alaCarta» (por qué, novedades, fundadores).
- **Esquema de guías** (`src/content.config.ts`): `reviewedAt` (fecha de revisión visible junto al
  título, con icono), `moments` (la guía aparece en «Para leer con calma» del momento) y `cta`
  (producto de contexto, titular y texto del cierre; `calculadora: true` cambia «Calcula» por la
  calculadora). `dateModified` del `Article` = la fecha más reciente de publicación, actualización
  y revisión. Las guías ya salen en las páginas de producto por `related` (fase 2).
- **3 guías nuevas**, con fuentes al final y aviso de estado:
  - `registro-de-jornada-hosteleria`: obligación de 2019 (art. 34.9 ET, RDL 8/2019), sanción
    (LISOS), lo propio de hostelería, el borrador del RD digital y su estado **comprobado el
    17-11-2026**: no aprobado ni publicado (referencias del Consejo de Ministros hasta el 10-11 y
    prensa del 16-11). Cómo lo cubre Equipo y RRHH sin prometer cumplimiento ni biometría.
  - `como-abrir-un-restaurante`: checklist en 9 bloques (local, Hacienda y Seguridad Social,
    licencias, sanidad, equipo, sistema, carta, canales, semana antes) y qué resuelve alaCarta.
  - `canal-propio-o-agregadores`: comisiones con fuente, ejemplo con los valores por defecto de la
    calculadora, coste real del canal propio, cuándo compensa cada uno y cómo usar los dos.
  - Enlazadas desde: RRHH y backoffice (jornada), TPV, carta QR, web y RRHH (abrir), pedidos
    online, app propia y clientes (canal propio), los tres momentos (bloque nuevo «Para leer con
    calma» en la plantilla de momento) y la calculadora. «Registro de jornada» sustituye al
    «Centro de ayuda» en el megamenú de Recursos (§1: el centro de ayuda sigue en el pie).
- **Centro de ayuda**: «En construcción» → «Disponible con el lanzamiento; mientras tanto,
  escríbenos a soporte@».
- **`/por-que-alacarta`** reescrita: «Por qué un solo sistema y no siete herramientas»; la tabla
  gana teléfono, app, web y Google, compras y equipo, con enlace a la pieza y chip «En camino» si
  toca (pasa a fichas a ≤ 720 px, sin scroll lateral); tres ideas (un sistema, sin comisiones, te
  lo dejamos funcionando); diseño; compromisos; «En qué punto estamos» con enlaces a novedades y
  fundadores. «Quién hay detrás» **preparado pero oculto**: se pinta solo si `TEAM` (en
  `src/data/site.ts`) tiene personas.
- **`/locales-fundadores`**: faltaba «a quién buscamos (tipos de local y zonas)»: sección nueva
  con los 9 sectores y un aviso de zona honesto (presencial donde podamos llegar; si no, remoto).
- **`/novedades`** completa: fecha de última actualización (`STATUS_UPDATED` en `site.ts`),
  leyenda de estados con el número de piezas, tabla por producto (en móvil, lista sin scroll),
  conexiones internas en camino, integraciones externas en camino y «Registro de cambios: empieza
  con el lanzamiento». Sin fechas de lanzamiento.
- **Integraciones**: datos nuevos en `src/data/integrations.ts` (pagos y datáfonos, agregadores,
  gestoría y contabilidad, Google, impresoras y equipos; cada una con estado y pieza de alaCarta),
  bloque `IntegrationsList.astro` en `/soluciones#integraciones` y franja «Integraciones: hoy / en
  camino» en el pie. Sin logotipos.
- **FAQ global** por familias (Servicio en sala y cocina, Clientes y canales, Gestión del negocio,
  Equipamiento y puesta en marcha, Precios y contratación, Sobre alaCarta), con icono y entradilla
  por grupo y `FAQPage`. Las preguntas de producto se leen de `solutions.ts`, `hardware.ts` y
  `onboarding.ts` (sin duplicar respuestas). Dos nuevas: «¿Qué está disponible hoy y qué está en
  camino?» y «¿Tenéis clientes a los que pueda preguntar?».
- **Legal en borrador**: aviso de borrador reforzado en `LegalLayout`; marcadores visibles
  `[pendiente: …]` (`Pending.astro`). Aviso legal con datos LSSI pendientes, precios, estado,
  demos, guías y marcas de terceros. Privacidad con cada tratamiento de la web (demo, «te
  llamamos», contexto y atribución, contacto, envío por correo, servidor), almacenamiento de sesión,
  demos sin datos, encargados pendientes y alaCarta como **encargado** en producto (reservas y
  clientes, llamadas con IA «cuando esté disponible» con aviso al llamante y datos mínimos, RRHH con
  geolocalización solo al fichar y sin biometría, app propia, ERP). Cookies: «sin cookies» y
  tabla de las 5 claves de `sessionStorage`.

**Desviaciones**

- Guías 3 a 7 de §1 (no-shows, escandallos, Perfil de Empresa, IA telefónica) no se han escrito:
  el mínimo eran 3. Herramientas de fase 2 (auditor de ficha, generador QR) siguen fuera.
- Fecha de revisión de las guías nuevas: **17-11-2026** (el día en que se comprobó), no 16-11.
- Fuente del rango 14–30 % sin nombrar al proveedor (igual que en `COMMISSION_RANGE`); se añade
  Merca2 (22-01-2026) como fuente de prensa. No hay tarifas oficiales públicas de los agregadores.
- Correcciones colaterales de coherencia: FAQ «¿Puedo gestionar varios locales?» y tarjeta de
  grupos del megamenú decían «varias sociedades en la misma cuenta» (depende del ERP, en camino).
- `<blockquote>` de `.prose` con estilo de aviso (lo usan las guías para el estado revisado).
- No se han hecho «condiciones de contratación» (§7 no las pide).

**Pendiente para Jordi**

- Datos de la sociedad (denominación, NIF, domicilio, registro, teléfono), DPD, proveedores de
  alojamiento, formularios y correo, plazos de conservación (propuesta: 12 meses) y proveedor de
  voz de la IA. Revisión legal completa; en particular, si la clave `alacarta:atribucion` de
  `sessionStorage` necesita consentimiento (art. 22.2 LSSI).
- Aprobar «Quién hay detrás» (nombre, cargo, foto) para rellenar `TEAM`.
- Zona de visitas de fundadores (el texto no fija ninguna).
- En `/novedades`, 13 piezas salen como «Disponible» por la decisión de estados del 16-11; la
  leyenda dice «desde el lanzamiento con los primeros locales». Validar el matiz.
- Revisar el registro de jornada cuando se publique el RD (cambiar `reviewedAt` y el texto) y el
  aplazamiento de VeriFactu en el BOE antes de publicar.
- Fuente neutral para las comisiones de los agregadores.

