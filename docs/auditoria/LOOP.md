# LOOP · Implementación nocturna de la auditoría del ecosistema

Eres el **orquestador** del loop que implementa `docs/auditoria/01`–`13` en este worktree
(`/home/jordi/proyectos/alacarta/alacarta-web-ecosistema`, rama `ecosistema`). Jordi está
durmiendo: **no preguntes nada, no esperes confirmación**. Si algo no está decidido, usa la
propuesta por defecto del documento correspondiente y anótalo en `docs/auditoria/LOG-LOOP.md`.

## Reglas inquebrantables

- Trabaja **solo** dentro de `/home/jordi/proyectos/alacarta/alacarta-web-ecosistema`. **Nunca** toques
  `/home/jordi/proyectos/alacarta/alacarta-web-corporativa` (allí hay otra sesión haciendo un
  rediseño), ni `~/proyectos/ofasty`, ni `~/proyectos/gestitec` (solo lectura si hiciera falta).
- **Sin commits, sin push, sin despliegues**, sin tocar DNS, Coolify ni GitHub.
- Node: antes de cada `npm`/`npx`: `source ~/.nvm/nvm.sh && nvm use`.
- Servidor de previsualización de este worktree: **puerto 4331** (`npx astro preview --port 4331`
  en segundo plano tras `npm run build`; `npx astro preview stop` si hay que reiniciarlo). El 4329 es
  del otro directorio: no lo uses ni lo pares.
- Capturas: Playwright en `/home/jordi/proyectos/app-video-generator/node_modules/playwright`
  (requerir por ruta absoluta desde un script en tu directorio scratchpad). Guarda las capturas en
  `docs/auditoria/capturas/<fase>/` (están en `.gitignore`? si no, añade `docs/auditoria/capturas/`
  a `.gitignore`) para que Jordi las vea mañana.
- Diseño: `docs/DISENO.md` manda (monocromo, tokens, iconos de línea). Nada de testimonios, cifras
  de clientes ni logotipos inventados. Respetar la lista de **afirmaciones prohibidas** de
  `01-estrategia-y-arquitectura.md` §4 y de `07`. **Nunca** mencionar GestiTec, Ofasty ni Beply en
  la web.
- Las decisiones de Jordi están en `00-INDICE.md` ("Tomadas el 16-11-2026"): cúmplelas.

## Cómo ejecutar cada fase

Para cada fase, en orden y **una detrás de otra** (nunca en paralelo: comparten datos):

1. Lanza **un subagente `general-purpose`** con el *brief común* (abajo) + el *brief de la fase*.
   Así cada fase arranca con el contexto limpio.
2. Cuando vuelva: comprueba tú mismo `npm test` (debe pasar), mira 3-6 capturas clave de la fase y,
   si ves problemas (desbordes, textos cortados, menús rotos, contraste, afirmaciones prohibidas,
   enlaces rotos), corrígelos tú o con un subagente de seguimiento.
3. Marca en el documento de la fase **Estado: hecho** y los criterios cumplidos (si el subagente no
   lo hizo) y añade una entrada en `docs/auditoria/LOG-LOOP.md`: fecha/hora, fase, qué se hizo,
   desviaciones, pendientes, ruta de capturas, resultado de `npm test`.
4. Pasa a la siguiente fase. Si una fase falla dos veces, déjala documentada en el log como
   bloqueada y continúa con la siguiente que no dependa de ella.

Al terminar todas: fase 10 (QA) y un resumen final al principio de `LOG-LOOP.md` ("Para Jordi:
qué hay, qué falta, qué decidir, cómo verlo": `cd ../alacarta-web-ecosistema && npm run dev`).

## Brief común (pégalo en cada subagente)

> Proyecto: `/home/jordi/proyectos/alacarta/alacarta-web-ecosistema` (Astro 7 estático + islas Vue 3,
> CSS nativo con tokens). Es un worktree en la rama `ecosistema`: trabaja solo aquí. No toques
> `/home/jordi/proyectos/alacarta/alacarta-web-corporativa`. Sin commits ni push.
> Lee primero: `README.md`, `docs/DISENO.md`, `docs/auditoria/00-INDICE.md`,
> `docs/auditoria/01-estrategia-y-arquitectura.md` (familias, URLs, honestidad, §4 afirmaciones
> prohibidas) y los documentos de tu fase. Mira el código existente antes de crear nada nuevo y
> reutiliza componentes, tokens y datos (`src/data/*` es la fuente única).
> Copy en español de España, tuteo, concreto, en lenguaje de local, mismo tono que el actual.
> Nada inventado (testimonios, clientes, métricas). Nunca mencionar GestiTec, Ofasty ni Beply.
> Node: `source ~/.nvm/nvm.sh && nvm use` antes de npm/npx. Verifica con `npm test` (check + lint +
> build + enlaces). Previsualiza en el puerto 4331 (`npx astro preview --port 4331` en segundo plano;
> no uses el 4329). Capturas con Playwright desde
> `/home/jordi/proyectos/app-video-generator/node_modules/playwright` a 1440 y 390 px, en
> `docs/auditoria/capturas/<fase>/`; míralas y corrige lo que se vea mal.
> Al acabar: en tu documento de fase pon **Estado: hecho**, marca criterios y añade "Notas de
> implementación" con desviaciones. Responde con: archivos tocados, qué se hizo, desviaciones,
> pendientes, rutas de capturas, resultado de `npm test`.

## Fases

### Fase 1 · Fundación (docs 02 y 04 §2; copy de 05-08)

1. **Modelo de datos** en `src/data/solutions.ts` según 04 §2: `family`, `icon`, `status`
   ('disponible'|'piloto'|'en-camino'), `statusNote?`, `replaces?`, `connections` (sustituye a
   `connected`: `{ to, title, text, status?: 'en-camino' }`), `demo?`, `hardware?`, `heroVariant?`.
   `families` (servicio, canales, gestion, equipamiento) con nombre, claim, icono y orden.
   Productos en `/soluciones` (13): tpv, comandero, cocina, carta-qr, reservas, pedidos-online
   (renombra `pedidos`), app-propia (nuevo), llamadas-ia (nuevo), clientes, web-para-restaurantes
   (nuevo), backoffice (nuevo, fusiona `gestion` + `informes`, que desaparecen), erp (nuevo), rrhh
   (nuevo). Hardware, placas QR y puesta en marcha son entradas de la familia "equipamiento" con
   rutas propias (`/hardware`, `/hardware/placas-qr`, `/puesta-en-marcha`), sin página
   `/soluciones/*`.
   - Copy real de los productos nuevos según 05-07 (name, navLabel, tagline, title, seoTitle ≤ 60,
     description ≤ 155, intro, 6 features, connections, ≥ 4 FAQ, related).
   - Estado (decisión de Jordi): `en-camino` **solo** en app-propia, llamadas-ia y erp; el resto
     `disponible`. Integraciones no construidas con `status: 'en-camino'` en `connections`.
   - Actualiza todas las referencias a slugs antiguos (pricing, sectors, faqs, home, páginas,
     maquetas). Para productos nuevos, reutiliza temporalmente la maqueta más parecida.
   - `Sector` gana `icon` y `singular` ("un restaurante", "una pizzería", "un grupo"…); úsalo en
     `sectores/[slug].astro` en lugar de la regex de singular.
2. **Iconos** (02 §3) en `Icon.astro`, mismo estilo; trazados de Lucide (ISC) permitidos: en un
   directorio nuevo y vacío del scratchpad, `npm pack lucide-static`, `tar xzf` y **leer** los SVG
   como datos (no ejecutar nada). Comentario de atribución. Quita el mapa local de iconos de
   `SolutionGrid.astro`; `SectorGrid` muestra iconos.
3. **Navegación** (02 completo): modelo nuevo en `navigation.ts`, megamenús (Soluciones por 4
   familias + tarjeta "Pruébalo ahora" con mini QR a `/demo/carta`; Sectores con tipos + "Tu
   momento" + destacado grupos; Recursos en 3 columnas), Hardware y Precios directos, cabecera con
   "Pruébalo" + "Solicitar demo", menú móvil con iconos, barra fija móvil de conversión, pie nuevo.
   QR: añade `qrcode` como devDependency y genera SVG en build en `src/components/ui/QrCode.astro`
   (props url/size/label) con URL absoluta `${SITE_URL}/demo/carta`.
   `src/data/moments.ts` con los 3 momentos (slug, navLabel, name, tagline, icon).
4. **Helper de CTA** `src/lib/cta.ts` (`ctaHref({ to, modulo?, sector?, origen?, config? })`) usado
   en cabecera, pie, barra móvil, PageHero/CtaBand y páginas de solución y sector.
5. **Páginas provisionales** para que no haya enlaces rotos (contenido mínimo pero real y digno,
   comentario `<!-- Provisional fase 1: se completa en docs/auditoria/NN -->`): `/hardware`,
   `/hardware/placas-qr`, `/puesta-en-marcha`, `/demo`, `/demo/carta` (noindex),
   `/momentos/[slug]` (3), `/herramientas/calculadora-comisiones`, `/locales-fundadores`,
   `/novedades`, `/gracias` (noindex).
6. `/soluciones` y la tabla de `/precios` agrupadas por familia (rediseño completo después; sin
   precios nuevos todavía).

### Fase 2 · Hub y plantilla de producto + familias (docs 04, 05, 06, 07)

Hub `/soluciones` completo (04 §3, con el mapa del ecosistema como versión estática SVG; la versión
interactiva llega en la fase 4). Plantilla `/soluciones/[slug]` con bloques condicionales (04 §4):
hero con mini-tarjeta de precio y chip de estado, "Lo que dejas de hacer", qué hace, conexiones como
diagrama radial (líneas discontinuas y chip para "en camino"), equipamiento recomendado, para quién,
banda de precio, FAQ ≥ 4, cierre con tres salidas. Aplica el contenido específico de 05, 06 y 07 a
cada producto. Maquetas nuevas en el lenguaje de las existentes: `MockApp`, `MockWeb`,
`MockLlamada` (transcripción + reserva), `MockErp`, `MockRrhh` (cuadrante semanal + fichajes).
JSON-LD: `SoftwareApplication` para software, `Service` para web.

### Fase 3 · Equipamiento y servicios (doc 08)

`/hardware` (dos caminos, kits, dispositivos, comprobador de equipo de 4 preguntas que rellena el
formulario vía URL, FAQ), `/hardware/placas-qr` (con la vista previa D8 si es sencilla; si no, una
versión estática con QR funcional y D8 en la fase 4), `/puesta-en-marcha` (línea temporal, migración,
estrategia local, qué necesitamos, qué cuesta, FAQ). Datos en `src/data/hardware.ts` y
`src/data/onboarding.ts`. Precios de hardware: "en tu propuesta" (no inventar).

### Fase 4 · Demos interactivas (doc 10)

En este orden: `src/data/demo.ts` (La Plaza), D3 carta QR en `/demo/carta` + QR grande en
`/soluciones/carta-qr` (hero variante demo con placa dibujada), D1 simulador del servicio (en `/demo`
y como componente reutilizable para la home), D2 "un cambio, todos los canales", D7 mapa interactivo
del ecosistema (sustituye al SVG estático del hub), D4 llamada de ejemplo con transcripción animada
(sin audio; fase 2 con número real queda pendiente), D8 vista previa de placa. Islas Vue con
`client:visible`, sin cookies, `sessionStorage` siempre con try/catch, accesibles, con fallback sin
JS, peso controlado, y CTA final con `origen`.

### Fase 5 · Precios y configurador (doc 09 + D5, D6)

Plan Total (159 €; 135 € anual) y complementos con las cifras orientativas de 09 en `pricing.ts`;
lógica pura en `src/lib/quote.ts`; configurador "Monta tu alaCarta" con forma de carta y ticket en
monoespaciada, URL compartible y paso de la configuración al formulario; comparativa
"herramientas sueltas vs alaCarta" solo con rangos de precios públicos con fuente de
`docs/investigacion`; calculadora de comisiones completa en `/herramientas/calculadora-comisiones`
y reducida en `/precios`; locales fundadores en precios. Actualiza `docs/PRECIOS.md`.

### Fase 6 · Embudo (doc 11)

`LeadForm` en 3 pasos con modo llamada, precarga por URL (`modulo`, `sector`, `plan`, `config`,
`motivo`, `modo`, `origen`), campos de atribución, redirección a `/gracias` completa, `/contacto`
reorientado (gestorías, partners, soporte, prensa), `CtaBand` con tres salidas en toda la web.

### Fase 7 · Home (doc 03)

Toda la estructura de 03 usando las piezas ya hechas (simulador, familias, D2, puesta en marcha,
momentos, precio claro, fundadores, FAQ ampliada, cierre con tres salidas). Ojo: en el otro
directorio se está rediseñando el hero (`HeroStage`, acento de color, serif). **No lo copies**: aquí
se mantiene el diseño monocromo de `docs/DISENO.md`; la fusión se decidirá con Jordi.

### Fase 8 · Sectores y momentos (doc 12)

Plantilla de sector nueva (hero propio, "un día en tu local", configuración recomendada enlazada al
configurador, demo relevante, FAQ ≥ 4), copy ampliado con los productos nuevos según la tabla de 12,
índice de sectores, y las 3 páginas de momento completas con `src/data/moments.ts` ampliado.

### Fase 9 · Recursos, empresa y legal (doc 13)

Índice de recursos en 3 bloques, al menos 3 guías nuevas con fecha de revisión (registro de jornada
con el estado legal real: RD de registro digital **no publicado** a 16-11-2026; abrir un
restaurante; canal propio frente a agregadores), "Por qué alaCarta" reorientado al ecosistema,
`/locales-fundadores` completa, `/novedades` alimentada por `status`, sección de integraciones en el
hub y el pie, FAQ global por familias, legales en borrador ampliados.

### Fase 10 · QA final

Recorre todas las plantillas a 1440 y 390 (capturas en `capturas/qa/`), enlaces, títulos y
descripciones (longitudes), JSON-LD válido, accesibilidad básica (foco, teclado en menús y demos,
`aria-live`), peso de islas, ninguna afirmación prohibida (`grep` de "GestiTec", "Ofasty", "Beply",
"certificad", "garantiza", "nómina"…). Actualiza `README.md` (páginas, estructura), `docs/TODO.md`,
`docs/NEGOCIO.md`, `docs/ROADMAP.md` y `docs/ARQUITECTURA.md` con el ecosistema. Escribe el resumen
final para Jordi al principio de `LOG-LOOP.md`.
