# Log del loop del ecosistema

## Para Jordi (resumen, 17-11-2026 · 05:00)

**Qué hay.** Las 10 fases del `LOOP.md` están hechas, en el worktree `alacarta-web-ecosistema`
(rama `ecosistema`), **sin commits, sin push y sin despliegues**. `npm test` en verde: check 0/0,
lint, configurador 17/17, formulario 10/10, 55 páginas (antes 36), sin enlaces rotos (425 anclas).
Ninguna mención a GestiTec, Ofasty ni Beply en `src/` ni en `dist/`. Docs 02-13 en **Estado: hecho**.

- **Ecosistema**: 4 familias, 13 productos en `/soluciones` + hardware, placas QR y puesta en marcha.
  "En camino" solo en app propia, llamadas con IA, ERP e integraciones no hechas.
- **Navegación**: megamenús por familia con iconos y tarjeta "Pruébalo" con QR real, barra móvil
  de conversión, pie nuevo con integraciones.
- **Demos jugables** (islas Vue, < 9 KB gzip cada una): simulador del servicio, carta QR de La Plaza
  (escaneable), "un cambio, todos los canales", mapa interactivo, llamada con IA (sin audio), vista
  previa de placa, comprobador de equipo, configurador "Monta tu alaCarta" y calculadora de comisiones.
- **Precios**: plan Total 159 € (135 € anual) + complementos orientativos, configurador con ticket y
  URL compartible, comparativa con fuentes, locales fundadores (20 plazas, sin contadores).
- **Embudo**: formulario en 3 pasos con modo "te llamamos", precarga desde configurador/comprobador/
  placas, atribución sin cookies, `/gracias` por variante, `/contacto` reorientado.
- **Home, 9 sectores, 3 momentos, recursos (3 guías nuevas), por qué, novedades, legales en borrador.**
- **QA**: contraste AA corregido (gris secundario y ámbar), un `h1` por página, foco visible, teclado
  en menús y demos, JSON-LD válido (104 bloques, sin valoraciones), títulos ≤ 60 y descripciones ≤ 155.

**Cómo verlo.**

```bash
cd /home/jordi/proyectos/alacarta/alacarta-web-ecosistema
source ~/.nvm/nvm.sh && nvm use && npm run dev
```

(O el build ya servido en `http://localhost:4331` si sigue levantado.) Capturas de cada fase en
`docs/auditoria/capturas/<fase>/` (fase-1 … fase-9 y `qa/`, ~440 PNG). Para revisar el diff:
`git status` / `git diff --stat` (66 archivos modificados + nuevos sin seguimiento).

**Qué decidir** (todo consolidado en `docs/TODO.md` §1). Lo más urgente:

1. **Honestidad de estado**: `/novedades` muestra 13 piezas "Disponible" aunque el producto aún no
   existe (decisión del 16-11; la leyenda lo matiza "desde el lanzamiento"). ¿Basta?
2. **Precios**: confirmar todas las cifras de `pricing.ts`; ¿descuento anual también en
   complementos?; validar los presets por sector (salen como precio público en cada sector).
3. **Comparativa de `/precios`**: cita competidores como **fuente** de rangos públicos (publicidad
   comparativa). ¿Se publica así? Falta fuente neutral para comisiones de agregadores.
4. **Datos que faltan**: endpoint de formularios y buzón (hoy el formulario cae a "enviar por
   correo"), teléfono comercial, proveedor de voz IA, hardware/placas (proveedor, precio, garantía),
   zona de visitas, agenda, datos de la sociedad y DPD para los legales, equipo para "Quién hay detrás".
5. **Copy**: H1 de la home ("Todo tu restaurante, en un solo sistema."); ¿API pública en Grupos?;
   frase comparativa de la pantalla de cocina.
6. **Legal**: revisión completa; ¿la atribución en `sessionStorage` requiere consentimiento (art. 22.2
   LSSI)?; volver a comprobar registro de jornada digital y aplazamiento de VeriFactu en el BOE.
7. **Fusión** con el rediseño del otro directorio (`HeroStage`, acento, serif): aquí se mantuvo el
   monocromo de `docs/DISENO.md`, como pedía el loop.

**Qué falta (no bloquea).** Lead magnets con correo (necesitan endpoint), más guías (no-shows,
escandallos, Perfil de Google, IA telefónica), variantes de demo por sector (D1 modo barra, D3 con
mitades, D2 multilocal), sincronía del simulador entre dispositivos (necesita API), Lighthouse.

**Retoques del orquestador fuera de los subagentes**: "módulo de gestión" → "backoffice" en la FAQ de
pubs; plan Grupos y `/por-que-alacarta` matizados (multiempresa y API "en camino"); líneas de estado
de 06 y 07 actualizadas.

---

## Fase 10 · QA final — hecha (17-11-2026, 05:00)

- **Corregido**: varios `h1` en `/solicitar-demo` (4) y `/gracias` (5) → uno; descripción del 404;
  contraste (`--gray-500` #74746e → #696963, `--color-warn` #a6690b → #946009, `--gray-400` retirado
  como color de texto); espacios comidos por Astro en los marcadores `[pendiente]`; `h2` oculto
  "Planes" en `/precios`; foco más visible en campos; FAQ de VeriFactu reescrita en línea honesta;
  plan Total con "(en camino)" en app, IA y ERP; frase del Total en la home; Prettier en `src/` y
  `scripts/` (`docs` y `README.md` en `.prettierignore`); `check-links.mjs` comprueba anclas.
- **Sin fallos**: 55 páginas sin scroll horizontal ni errores de consola a 390 y 1440; 104 JSON-LD
  válidos, 32 `FAQPage` solo con FAQ visible, ofertas = `pricing.ts`; teclado en megamenús, menú
  móvil, demos y formulario; `lang="es"`; `prefers-reduced-motion`; grep de prohibidas limpio.
- **Dejado así a propósito**: legales con `noindex` y fuera del sitemap mientras sean borradores.
- **JS**: páginas sin islas 1,7 KB gzip; con islas 36-50 KB (runtime de Vue 30 KB compartido);
  `/contacto` y `/solicitar-demo` hidratan al cargar (≈ 47-51 KB).
- **Docs**: `README.md`, `docs/ARQUITECTURA.md`, `docs/NEGOCIO.md`, `docs/ROADMAP.md`,
  `docs/TODO.md` (consolidado), `docs/DISENO.md` (tokens nuevos), `00-INDICE.md` (loop completado).
- **Capturas**: `docs/auditoria/capturas/qa/` (54 PNG, 27 plantillas).
- **npm test**: verde (55 páginas, 425 anclas).

---

## Fase 1 · Fundación — hecha (16-11-2026, 23:36)

- **Qué se hizo**: modelo de datos nuevo en `src/data/solutions.ts` (4 familias, 13 productos con
  `family/icon/status/connections/replaces/demo/hardware/heroVariant`, 6 productos nuevos con copy
  completo; `gestion` + `informes` → `backoffice`, `pedidos` → `pedidos-online`); `moments.ts`,
  `hardware.ts`, `onboarding.ts`; `Sector` con `icon` y `singular`. 46 iconos nuevos (Lucide ISC,
  leídos como datos) en `src/components/ui/icons.ts`. Megamenús (Soluciones por familias + tarjeta
  "Pruébalo" con QR generado en build, Sectores, Recursos), cabecera con dos CTA, menú móvil con
  iconos, `MobileCtaBar`, pie nuevo. `src/lib/cta.ts`. Páginas provisionales: `/hardware`,
  `/hardware/placas-qr`, `/puesta-en-marcha`, `/demo`, `/demo/carta`, `/momentos/*` (3),
  `/herramientas/calculadora-comisiones`, `/locales-fundadores`, `/novedades`, `/gracias`.
  `/soluciones` y tabla de `/precios` agrupadas por familia. 301 en `nginx.conf` para los slugs
  antiguos. 36 → 52 páginas.
- **Desviaciones**: "Web y presencia en Google" va en Clientes y canales (01/06) y no en
  Equipamiento (02 §2.1). Productos nuevos usan maqueta provisional (se cambian en fase 2).
  Calculadora: rango de comisión 14–30 % con fuente. Arreglo de reglas CSS a hijos con `:global()`.
- **Revisión del orquestador**: grep de afirmaciones prohibidas limpio (solo negaciones honestas:
  "no calcula nóminas", "no lo anunciamos como certificado", IA solo pedidos para recoger). Corregido
  "módulo de gestión" → "backoffice" en `sectors.ts` (FAQ de pubs).
- **Pendientes**: LeadForm sin `modo/origen/motivo` ni redirección a `/gracias` (fase 6); "Monta tu
  alaCarta" apunta a `/precios#modulos` (fase 5); títulos/descripciones largos en páginas antiguas
  (fase 10); tabla de precios a 390 px con scroll horizontal (rediseño fase 5).
- **Capturas**: `docs/auditoria/capturas/fase-1/` (40 PNG).
- **npm test**: verde (52 páginas, sin enlaces rotos, 0 errores/avisos).

---

## Fase 2 · Hub y plantilla de producto + familias — hecha (17-11-2026, 00:05)

- **Qué se hizo**: hub `/soluciones` completo (hero, mapa del ecosistema SVG estático en
  `EcosystemMap.astro`, 4 familias con maqueta, "Cómo viaja un dato", "Por dónde empezar").
  Plantilla `/soluciones/[slug]` con bloques condicionales: hero + `PriceMini` con chip de estado,
  `ReplacesTicket` ("Lo que dejas de hacer"), features, "Pruébalo" (si hay demo), diagrama radial
  `ConnectionsDiagram` (discontinuo + chip "en camino"; lista en ≤ 860 px), `ProofPoints` con fuente,
  `HardwareCards`, para quién, `PriceBand`, FAQ ≥ 4, cierre con tres salidas. Precio centralizado en
  `solutionPricing(slug)` (`pricing.ts`). Maquetas nuevas: `MockApp`, `MockWeb`, `MockLlamada`,
  `MockErp`, `MockRrhh`. JSON-LD `SoftwareApplication`/`Service` sin valoraciones. Títulos ≤ 60 y
  descripciones ≤ 155 en los 13 productos. Docs 04-07 en "hecho".
- **Desviaciones**: bloque "Relacionado" retirado (lo cubre el diagrama radial); chip de estado
  dentro de la mini-tarjeta; "Todo el ecosistema" sin precio hasta la fase 5; "El más elegido" →
  "Recomendado" (no hay datos); pedidos online sin cifra de mercado (fuente no contrastada).
- **Revisión del orquestador**: mapa, radial de ERP (todo "en camino", correcto), maqueta RRHH y
  página de llamadas IA a 390 revisados; sin problemas. Las píldoras verde/ámbar de las maquetas
  ya existían (`.mk-pill.is-ok/.is-warn`). Grep de prohibidas limpio.
- **Pendientes**: D1/D2/D4/D7 (fase 4), plan Total y precios nuevos (fase 5), JSON-LD de
  hardware/puesta en marcha (fase 3), privacidad de llamadas (fase 9). Frase comparativa de precio
  de la pantalla de cocina sin validar por Jordi.
- **Capturas**: `docs/auditoria/capturas/fase-2/` (54 PNG).
- **npm test**: verde (52 páginas, 0 errores/avisos, sin enlaces rotos).

---

## Fase 3 · Equipamiento y servicios — hecha (17-11-2026, 00:25)

- **Qué se hizo**: `/hardware` completo (kit dibujado, dos caminos, 4 kits, 8 dispositivos con
  "Con el tuyo: …", instalación y garantía, FAQ) con **comprobador de equipo** de 4 preguntas
  (`EquipmentChecker.vue`, teclado, fallback sin JS) que lleva a
  `/solicitar-demo?modulo=hardware&equipo=…&origen=comprobador-hardware`. `/hardware/placas-qr` con
  la **vista previa D8** ya hecha (`PlatePreview.vue`: nombre, mesa, acabado, formato, NFC; QR real
  a `/demo/carta`). `/puesta-en-marcha` (línea temporal, migración desde TPV/papel, estrategia local,
  qué necesitamos, qué cuesta, FAQ). Datos en `hardware.ts`/`onboarding.ts`. JSON-LD `Service` +
  `FAQPage`. Doc 08 en "hecho".
- **Desviaciones**: JSON-LD `Service` en vez de `Product` (sin precio, Google lo marca incompleto);
  tokens `--wood-300/700` solo para la placa de madera; formato "para terraza" (08) en vez de
  "colgante" (10); checklist descargable no hecha (necesita captura de correo).
- **Revisión del orquestador**: el "presencial desde 290 €" ya existía en `pricing.ts`
  (`ONSITE_TRAINING_FROM`) y está en 08/09. Capturas del resultado del comprobador (390), la placa
  configurada y puesta en marcha (1440) correctas.
- **Pendientes**: LeadForm debe leer `equipo`, `config` y módulos de equipamiento (fase 6); hardware
  y placas en el configurador (fase 5); **Jordi**: plazos de la línea temporal, proveedor,
  compra/renting, garantía, precio de placas.
- **Capturas**: `docs/auditoria/capturas/fase-3/` (18 PNG).
- **npm test**: verde (52 páginas).

---

## Fase 4 · Demos interactivas — hecha salvo D5/D6 (van en fase 5) (17-11-2026, 00:58)

- **Qué se hizo**: `src/data/demo.ts` (La Plaza: 14 alérgenos ES/EN/FR, 17 platos, modificadores,
  10 mesas, números de ejemplo, 3 llamadas). Islas Vue: **D1** `ServiceSimulator.vue` (comandero →
  cocina → caja → números, guía de 4 pasos, pestañas en móvil, lee `?comanda=` y `?pantalla=`);
  **D2** `ChannelsDemo.vue` (precio/agotado → TPV, carta, tienda, app "en camino"); **D3**
  `DemoCarta.vue` en `/demo/carta` y bloque con QR grande en `/soluciones/carta-qr` (pedido →
  "mira cómo lo recibe la cocina" en D1); **D4** `CallDemo.vue` en `/soluciones/llamadas-ia`
  (3 llamadas, sin audio; a domicilio → "por teléfono solo recogida"); **D7**
  `EcosystemMapIsland.vue` sustituye al mapa estático del hub (SVG como fallback sin JS; teclado con
  flechas/Intro/Escape). D8 revisada, sin cambios. `/demo` es ya un índice real. `demoCta()` activa
  las 5 demos en las páginas de producto.
- **Peso (gzip)**: D1 7,8 KB · D3 8,5 KB · D4 4,0 KB · D7 3,7 KB · D2 2,6 KB · datos 4,8 KB ·
  runtime Vue compartido 31,2 KB. Todas < 30 KB.
- **Desviaciones**: alérgenos con insignias de letra (no 14 iconos); sin QR "ábrelo en tu móvil"
  ni sincronía entre pestañas en D1 (no hay API); en D1 "Cobrar" se activa tras "Listo" para guiar.
- **Revisión del orquestador**: capturas D1 (cocina 1440, comanda 390), D3 (390), D7 (Reservas),
  D4 (recoger, 390) correctas; grep limpio.
- **Pendientes**: montar D1/D2/mapa en la home (fase 7); D4 con número y audio cuando haya
  proveedor de voz (**Jordi**); README de islas (fase 10).
- **Capturas**: `docs/auditoria/capturas/fase-4/` (58 PNG).
- **npm test**: verde (52 páginas).

---

## Fase 5 · Precios y configurador — hecha (17-11-2026, 01:30)

- **Qué se hizo**: plan **Total** 159 €/mes (135 € anual; ancla "por separado 200 €") y
  complementos de 09 en `pricing.ts` (app 19 €/local, IA 29 €/local con 200 min + 0,12 €/min,
  RRHH 24 €/local hasta 20 + 1 €/persona, ERP 29 €/empresa, web 24 €/mes + 390 € alta). Grupos =
  "Total en cada local". `solutionPricing()` devuelve ya cifra para los 5 productos nuevos.
  `src/lib/quote.ts` (lógica pura, 3 caminos, el más barato, URL compacta, `describeConfig()`),
  comprobado por `scripts/check-quote.mjs` (17 casos, añadido a `npm test`). **D5**
  `Configurator.vue` en `/precios#monta` (carta + ticket monoespaciado, `?config/?add/?sector`,
  `aria-live`, fallback sin JS, dos CTA con `origen=configurador`). **D6**
  `CommissionCalculator.vue` completa en `/herramientas/calculadora-comisiones` y reducida en
  `/precios`. `/precios` rediseñada; tabla de módulos en fichas a 390 px (sin scroll lateral).
  Comparativa "por piezas" con rangos públicos, fuente y fecha. `/locales-fundadores` completa
  (20 plazas, sin contadores, `motivo=fundador`). `docs/PRECIOS.md` reescrito.
- **Peso (gzip)**: Configurator 9,3 KB · CommissionCalculator 3,4 KB · PricingPlans 1,4 KB.
- **Desviaciones**: ancla `#monta` (09 decía `#configurador`); descuento anual solo en la cuota del
  plan; el Total incluye 1 ERP por cuenta; fundador = precio bloqueado + presencial incluida (sin
  descuento); presets por sector definidos por el implementador.
- **Revisión del orquestador**: cifras = doc 09; ninguna mención a marcas propias prohibidas (la
  comparativa del doc 09 citaba Ofasty/GestiTec y **no** se han trasladado a la web). Capturas del
  configurador, tabla móvil y comparativa correctas.
- **Para Jordi**: confirmar cifras; ¿descuento anual también en complementos?; la comparativa cita
  competidores (Ágora, Qamarero, Last.app, TheFork, Zenchef, Square, Haddock) como **fuente** de
  rangos públicos: validar si se quiere publicidad comparativa; fuente neutral para comisiones de
  agregadores; precio de kits y placas.
- **Capturas**: `docs/auditoria/capturas/fase-5/` (48 PNG).
- **npm test**: verde (check, lint, 17/17 quote, 52 páginas, enlaces).

---

## Fase 6 · Embudo — hecha (17-11-2026, 02:05)

- **Qué se hizo**: `LeadForm.vue` reescrito en 3 pasos (tu local · qué te interesa · cómo
  hablamos) con **modo llamada** (`modo=llamada`: nombre, teléfono, franja), validación accesible
  (`aria-describedby`, `aria-invalid`, foco al primer error, `aria-live`) y fallback sin JS de un
  paso. Precarga por URL (`modulo` incl. equipamiento, `sector`, `plan`, `motivo`, `modo`, `origen`,
  `equipo`, `config` en sus 3 formatos) resumida en "Lo que nos traes". Lógica pura en
  `src/lib/lead.ts` (comprobada por `scripts/check-lead.mjs`, 10 casos, en `npm test`). Atribución
  en `sessionStorage` (`src/lib/attribution.ts`; entrada, referrer, UTM, simulador completado), sin
  cookies ni terceros. Envío: JSON a `PUBLIC_FORM_ENDPOINT` → `/gracias?tipo=…`; sin endpoint,
  "Enviar por correo" (mailto ya redactado) → `/gracias?…&via=correo`. `/gracias` con variantes
  (demo, llamada, propuesta, fundador, contacto). `/contacto` reorientado (soporte, gestorías,
  partners, prensa; ventas → demo) con `ContactForm.vue`. `CtaBand` con tres salidas y `origen`
  obligatorio en las 21 plantillas. Contrato del endpoint en `docs/DESPLIEGUE.md` §6.
- **Desviaciones**: formulario de contacto propio; sin motivo "Trabajo"; gestorías sin "acceso
  gratuito" (no confirmado); Grupos → demo con `plan=grupos`; franjas sin horas concretas; sin JS no
  se precargan parámetros.
- **Revisión del orquestador**: capturas de precarga desde configurador (390), paso 2 (1440) y
  CtaBand (390) correctas; grep limpio.
- **Para Jordi**: endpoint de formularios y buzón; teléfono comercial; zona de visitas; herramienta
  de agenda; analítica que escuche `alacarta:conversion`; lead magnets con correo (necesitan endpoint).
- **Capturas**: `docs/auditoria/capturas/fase-6/` (42 PNG).
- **npm test**: verde (check, lint, quote 17/17, lead 10/10, 52 páginas, enlaces).

---

## Fase 7 · Home — hecha (17-11-2026, 02:30)

- **Qué se hizo**: `src/pages/index.astro` y `src/data/home.ts` reescritos según 03: hero monocromo
  sin JS (`HomeHeroVisual.astro`: TPV + carta QR en móvil + placa con QR real + tarjeta "Llamada con
  IA · En camino"), "Lo que sustituye", simulador D1 (`readUrl={false}`, `origen=home-simulador`),
  4 familias, D2 + "Todo conectado", "Te lo dejamos funcionando" (5 pasos de `onboarding.ts`),
  sectores y momentos, precio claro (desde 49 €, 0 % comisión, caminos, ancla del Total, enlaces al
  configurador y la calculadora), por qué, fundadores, confianza, FAQ (8, `FAQPage`) y cierre.
  4 preguntas nuevas en `faqs.ts`. Título 56 car., descripción 151. JSON-LD `Organization`,
  `WebSite`, `SoftwareApplication` (oferta orientativa 49 €), `FAQPage`. **No** se ha copiado el
  `HeroStage` del otro directorio.
- **Rendimiento**: 2 islas (`client:visible`, margen 600 px); JS en carga ≈ 4,6 KB gzip, con ambas
  islas ≈ 48 KB. CLS 0,0000. FCP/LCP ≈ 1,2–1,5 s en móvil simulado (CPU ×4, red lenta; Lighthouse
  no instalado). Sin desbordes a 390 ni errores de consola.
- **Desviaciones**: composición alternativa de 03 en el hero (no mapa compacto); puntos de D2 bajo
  la demo; 5 pasos de puesta en marcha; `origen=home-cierre`; título SEO acortado (el de 03 tenía 77);
  "compras" → "stock" en la entradilla (compras = ERP, en camino).
- **Revisión del orquestador**: hero a 1440/390 correcto; comprobado con captura a 3× que la carta
  del hero es monocroma (el azul/naranja de la captura era suavizado de subpíxel).
- **Para Jordi**: validar H1 "Todo tu restaurante, en un solo sistema."; ¿la entradilla debe
  nombrar app propia y llamadas con IA (en camino) sin chip?; Lighthouse; eventos de analítica.
- **Capturas**: `docs/auditoria/capturas/fase-7/` (22 PNG).
- **npm test**: verde.

---

## Fase 8 · Sectores y momentos — hecha (17-11-2026, 03:10)

- **Qué se hizo**: plantilla de sector nueva para los 9 sectores: hero con visual propio
  (`SectorHeroVisual.astro`; TPV en modo barra/mostrador/grifos/noche, cocina, carta maestra),
  problemas → soluciones, "Un día en tu local" (`DayTimeline.astro`, 5 momentos con chip "en
  camino"), configuración recomendada (`RecommendedSetup.astro`: presets de `quote.ts` y precio
  calculado con `quote()`, enlace a `/precios?sector=…#monta`), una demo relevante
  (`DemoBlock.astro`, `client:visible`), FAQ 4-5 con `FAQPage`, otros sectores y `CtaBand`
  (`origen=sector-<slug>`). `sectors.ts` y `moments.ts` reescritos. Índice `/sectores` rehecho.
  3 momentos completos: abrir un local (checklist de 12 puntos, plazos, simulador), cambiar de TPV
  (qué se trae, VeriFactu con fechas de la guía, comparativa sin marcas, comprobador de equipo),
  dejar las comisiones (calculadora, 6 canales propios, `motivo=comisiones`). Títulos ≤ 60,
  descripciones ≤ 155, migas JSON-LD en todas. `MockTpv`/`MockKds` parametrizados por `mode`.
- **Desviaciones**: bares usa el simulador normal (D1 sin modo barra); pizzerías usa la demo de
  llamada (D3 sin mitades); grupos usa D2 sin variante multilocal; quiosco de hamburguesería no se
  anuncia; FAQ de grupos corregida (multiempresa llega con el ERP, en camino).
- **Revisión del orquestador**: corregidas dos afirmaciones que contradecían esa FAQ: plan Grupos en
  `pricing.ts` ("Multiempresa: varias sociedades (con el ERP, en camino)", "API e integraciones
  (en camino)") y `/por-que-alacarta` ("Multilocal desde el primer día; varias sociedades con el
  ERP, que está en camino"). Capturas de hero de pubs (modo noche), "un día" de pizzerías (390) y
  configuración de bares correctas.
- **Para Jordi**: validar los presets por sector (son precio público orientativo en cada página);
  cifras de ejemplo de maquetas inventadas como interfaz; checklist de apertura descargable
  (necesita correo); ¿API pública en el plan Grupos?
- **Capturas**: `docs/auditoria/capturas/fase-8/` (60 PNG).
- **npm test**: verde (tras los retoques del orquestador).

---

## Fase 9 · Recursos, empresa y legal — hecha (17-11-2026, 03:45)

- **Qué se hizo**: `/recursos` en 3 bloques (Aprende, Herramientas, Ayuda) + "Sobre alaCarta".
  Esquema de guías con `reviewedAt`, `moments`, `cta`. **3 guías nuevas** con fuentes:
  registro de jornada (RD de registro digital **no aprobado ni publicado**, comprobado el
  17-11-2026), cómo abrir un restaurante, canal propio o agregadores. Enlazadas desde productos,
  momentos ("Para leer con calma") y calculadora. `/por-que-alacarta` reescrita ("un solo sistema y no
  siete herramientas"; "Quién hay detrás" preparado y oculto hasta que haya datos en `TEAM`).
  `/locales-fundadores` + "a quién buscamos". `/novedades` completa desde `status` y conexiones, sin
  fechas inventadas. Integraciones en `src/data/integrations.ts` (sin logos) en `/soluciones#integraciones`
  y franja del pie. FAQ global por familias con `FAQPage`. Legales en borrador ampliados con marcadores
  `[pendiente: …]` (aviso legal, privacidad por tratamiento, cookies = sin cookies + claves de
  `sessionStorage`). Centro de ayuda: "disponible con el lanzamiento". 52 → 55 páginas.
  `grep "Provisional fase 1"` vacío.
- **Desviaciones**: solo las 3 guías pedidas; fecha de revisión 17-11-2026; corregidas otras dos
  promesas de "varias sociedades" (FAQ y megamenú de grupos); arreglado en las páginas tocadas el
  espacio que Astro se come entre texto y etiqueta en línea (resto de la web pendiente → QA).
- **Revisión del orquestador**: grep de prohibidas limpio (solo negaciones y una fuente de la AEPD);
  captura de `/novedades` correcta.
- **Para Jordi**: datos de la sociedad, DPD, proveedores, plazos de conservación, revisión legal
  (¿la atribución en `sessionStorage` requiere consentimiento, art. 22.2 LSSI?); nombre/cargo/foto
  para "Quién hay detrás"; zona de visitas de fundadores; **validar que /novedades muestre 13 piezas
  "Disponible"** (decisión del 16-11) aunque el producto aún no existe — la leyenda lo matiza "desde el
  lanzamiento con los primeros locales"; volver a comprobar registro de jornada y VeriFactu en el BOE
  antes de publicar; fuente neutral de comisiones.
- **Capturas**: `docs/auditoria/capturas/fase-9/` (44 PNG).
- **npm test**: verde (55 páginas).
