# TODO

Lista viva. Revisada el 16 de noviembre de 2026 contra el código. Leyenda: `[x]` hecho ·
`[ ]` pendiente · `[!]` bloqueado (necesita una decisión o un acceso que solo puede dar Jordi).

## 1. Hecho

- [x] Análisis en modo lectura de Ofasty (`docs/ANALISIS_OFASTY.md`).
- [x] Investigación de competencia (ES e internacional), mercado, normativa y SEO con fuentes
      (`docs/INVESTIGACION.md` + `docs/investigacion/`).
- [x] Posicionamiento, propuesta de valor, tono y modelo de negocio (`docs/NEGOCIO.md`).
- [x] Estrategia de precios y planes orientativos (`docs/PRECIOS.md`, `src/data/pricing.ts`).
- [x] Marca: nombre, símbolo, logotipo SVG y PNG, favicon, iconos, Open Graph (`public/brand`).
- [x] Sistema de diseño monocromo: tokens, tipografía autoalojada, primitivas (`docs/DISENO.md`).
- [x] Proyecto Astro 7 + Vue 3 + TypeScript, con `.nvmrc` (Node 22.23.5).
- [x] 36 páginas: home, 9 soluciones, 9 sectores, precios, por qué, recursos (FAQ, 3 guías,
      ayuda), demo, contacto, 3 legales, 404.
- [x] 9 maquetas del producto en HTML/CSS que definen el lenguaje visual del futuro TPV/backoffice.
- [x] SEO técnico: títulos, descripciones, canónicas, OG, JSON-LD, sitemap, robots, breadcrumbs.
- [x] Formularios de demo y contacto (Vue) con validación, honeypot, consentimiento y
      alternativa por correo si no hay endpoint.
- [x] Calidad: `astro check`, ESLint, Prettier, comprobador de enlaces internos, `npm test`.
- [x] Responsive verificado con capturas a 1440 y 390 px.
- [x] Dockerfile (Node → nginx), `nginx.conf`, `.dockerignore`, workflow de CI, `.env.example`.
- [x] Documentación completa (`README.md` y `docs/`).
- [x] Git local inicializado con el primer commit.

## 2. Pendiente: publicación de la web

- [!] **Dominio**: comprobar disponibilidad real de `alacarta.com` y registrarlo (y `.es`). Si no
      está libre, decidir nombre de dominio alternativo antes de cualquier otra cosa.
- [!] **GitHub**: crear organización/repositorio remoto y hacer el primer push (`docs/DESPLIEGUE.md`).
- [ ] Proteger `main`, activar Dependabot, comprobar que el workflow de CI pasa en remoto.
- [!] **Coolify**: crear la aplicación desde el Dockerfile, staging primero, variables de build.
- [!] **DNS**: registros A/CNAME para apex y `www`; reservar subdominios futuros.
- [ ] SSL por Let's Encrypt en Coolify; forzar HTTPS; añadir HSTS cuando esté estable.
- [!] **Correo corporativo**: elegir proveedor, crear `hola@` y `soporte@`, configurar SPF, DKIM y
      DMARC. La web ya usa esas direcciones.
- [!] **Formularios / leads**: decidir el endpoint (servicio de formularios, función propia o API
      futura), configurar `PUBLIC_FORM_ENDPOINT`, probar un envío real, definir a qué buzón llega.
- [ ] **Email transaccional**: proveedor para confirmaciones automáticas de demo (y en el futuro
      para la app). Puede esperar si el endpoint de formularios ya notifica por correo.
- [!] **CRM**: decidir dónde se gestionan los leads (hoja compartida al principio, CRM ligero
      después) y conectar el endpoint.
- [!] **Analítica**: decidir si se mide y con qué. Recomendación: herramienta sin cookies
      (Plausible, Umami o similar) para no necesitar banner. Rellenar `PUBLIC_ANALYTICS_*` y
      actualizar `/legal/cookies`.
- [!] **Legal / RGPD**: sociedad titular, NIF, domicilio y registro mercantil en los tres textos
      legales; revisión por asesor; registro de actividades de tratamiento; contratos de encargado
      con proveedores (correo, hosting, formularios).
- [ ] Teléfono y dirección postal de contacto si se quieren publicar (hoy la web no los inventa).
- [ ] Open Graph: validar la imagen generada en un validador de previsualizaciones; si la fuente
      del sistema desentona, regenerar `og-image.png` con Manrope instalada en el entorno de build.
- [ ] Search Console y Bing Webmaster: verificar propiedad y enviar sitemap.
- [ ] Monitorización de disponibilidad (Uptime Kuma u otro) y alertas.
- [ ] Copias de seguridad: el repositorio en GitHub es la copia; documentar quién tiene acceso.

## 3. Pendiente: contenido y producto en la web

- [ ] Confirmar cifras de precios (`src/data/pricing.ts`) o mantener la nota "orientativo".
- [ ] Decidir descuento anual definitivo y tramos del plan Grupos (`docs/PRECIOS.md` § 6).
- [ ] Revisar el copy de las 9 soluciones y 9 sectores con alguien de hostelería.
- [ ] Guía VeriFactu: actualizar cuando se publique el aplazamiento en el BOE.
- [ ] Añadir casos reales y prueba social **solo cuando existan** (clientes piloto).
- [ ] Centro de ayuda: sustituir el aviso "en construcción" por documentación real con el MVP.
- [ ] Sustituir maquetas por capturas reales cuando exista producto, manteniendo marco y tamaño.
- [ ] Páginas de cumplimiento (`/cumplimiento/verifactu`, `/ticketbai`, `/factura-electronica`)
      si el SEO normativo se confirma como prioridad.
- [ ] Herramienta gratuita de carta QR como imán de captación (idea de la investigación).
- [ ] Modo oscuro del TPV (maqueta) para la página de pubs y coctelerías.

## 4. Pendiente: contratos, soporte y lanzamiento comercial

- [!] **Contratos**: condiciones generales de contratación del servicio, acuerdo de nivel de
      servicio para Grupos, contrato de encargado de tratamiento para clientes.
- [!] **Soporte**: definir horario real y canal (correo + chat) antes de prometer más de "24 h
      laborables"; herramienta de tickets.
- [!] **Pagos**: cuenta de Stripe (u otro) para la suscripción y facturación a clientes.
- [ ] **Lanzamiento comercial**: locales piloto, guion de demo, propuesta tipo en PDF, lista de
      asesorías prescriptoras, perfil de empresa en Google.
- [ ] Redes y comunicación: decidir si se abren perfiles; la web no los enlaza hasta que existan.

## 5. Pendiente: producto (fuera de este repositorio)

Ver `docs/ROADMAP.md`. Decisiones que hay que tomar antes de empezar el MVP:

- [!] Lenguaje y framework del backend (recomendación: TypeScript).
- [!] Una app única con rutas (`app.alacarta.com/tpv`) o subdominios por aplicación.
- [!] Proveedor de pagos integrado en el TPV y para la suscripción.
- [!] Estrategia de impresión (servicio local, impresoras de red, ambos).
- [ ] Prototipo navegable del TPV para las demos mientras no haya MVP.

## 6. Bloqueos y decisiones ya tomadas (para no reabrirlas sin motivo)

- Stack: Astro 7 estático + Vue 3 para islas. Motivo en `docs/ARQUITECTURA.md`.
- Sin i18n en la fase de lanzamiento.
- Sin testimonios, cifras de clientes ni logotipos inventados. La web lo dice en `/por-que-alacarta`.
- Sin cookies ni scripts de terceros por defecto.
- Precio por local, sin comisiones, sin permanencia, puesta en marcha remota incluida.
- Node ≥ 22.23.4 obligatorio (Astro 7). Instalado 22.23.5 con nvm sin cambiar el `default` del VPS.
