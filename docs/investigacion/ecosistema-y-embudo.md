# Competencia: arquitectura web, embudo y módulos nuevos — alaCarta

Fecha de comprobación de todos los datos marcados como **hecho**: 16-11-2026 (salvo que se indique otra). Fuente principal: lectura directa de las webs con WebFetch; donde la web bloqueó el acceso (Toast 403, Popmenu 403, Sunday parcial) se indica la fuente alternativa. **Hipótesis** = inferencia propia, no verificada.

Limitaciones: WebFetch convierte el HTML en texto, así que no se ven iconos, sticky bars, pop-ups de salida ni widgets de chat cargados por JS. Lo que se dice de esos elementos es en su mayoría hipótesis.

---

## A) Arquitectura de información y navegación

### Patrones observados

| Web | Cómo agrupa el menú de producto | Hardware | Integraciones | Notas |
|---|---|---|---|---|
| **Toast** (vía espejo cloudfront de pos.toasttab.com) | 5 ítems: Restaurants, Retail, Products, Pricing, Resources. "Restaurants" = tarjetas destacadas (Restaurant POS, Switch to Toast, New openings) + Service models + Restaurant concepts (~14) + Capabilities. "Products" = 4 destacados (Toast Platform, Toast IQ…) + **suites**: Operations, Marketing, Digital Storefront, Supplier & Accounting, Management, Team (nómina, turnos, propinas), Hardware, Finance | Suite dentro de Products, no ítem top-level | Dentro de Capabilities | Resources destaca "Toast vs. Square", **"Toast Menu Checker"** y un hub de comparativas. **Hecho** — https://d2a0efs422ycyj.cloudfront.net/compare/toast-vs-square |
| **Square** | Top: Business types / Products / **Hardware** / Pricing / What's new. Paneles por tipo de negocio en dos columnas: "Discover" (overview, "Switch to Square", subtipos) y "Capabilities" | **Top-level**, con mosaico de iconos+imagen (Handheld, Terminal, Register, Stand, Kiosk, Kits…) | En Developers | **Hecho** — https://squareup.com/us/en/point-of-sale/restaurants |
| **Lightspeed** | Business types (Retail, Restaurant, Golf) / Products por vertical / Partners / Resources. Badges "New" en ítems | Dentro del vertical restaurante, al mismo nivel que Integrations, Enterprise y Pricing | Sí, ítem propio | **Hecho** — https://www.lightspeedhq.com/pos/restaurant/ |
| **SpotOn** | Restaurants (Full service / Counter service + "New openings", "Switch to SpotOn") / **Solutions agrupadas por función**: Operations, Service, Team, Digital, Tables, Engagement, Finance; encima: Point-of-sale, Hardware, **Ecosystem**, Integrations | Enlace en Solutions | Enlace en Solutions | Tienen una página "Ecosystem" explícita. **Hecho** — https://www.spoton.com/restaurants/ |
| **TouchBistro** | Products = **tarjeta destacada** (TouchBistro One, "New") + Point of Sale / **Front of House / Back of House / Guest Engagement** | No es top-level | Top-level | En la home, la sección "Integrated Solutions" usa pestañas FOH/BOH/Guest. Barra superior con teléfono de ventas y banner promocional. **Hecho** — https://www.touchbistro.com/ |
| **Owner.com** | **Por objetivo**: Grow online discovery / Grow repeat orders / Grow online sales / Run your restaurant | No | "POS Integrations" dentro de Run | **Hecho** — https://www.owner.com/ |
| **Qamarero** | **Por objetivo**: Para operar / Para crecer / Para repartir / Para controlar, + "Inteligencia artificial" destacado. Soluciones = por tipo de negocio (incl. "Grupos, cadenas y franquicias") | No hay tienda; "funciona con tus dispositivos" | No hay sección propia | **Hecho** — https://qamarero.com/ |
| **Last.app** | Productos: **La plataforma** / Sala y cocina / Delivery y venta online / Reservas y clientes / Gestión y control. Top-level: Tipo de negocio, **Integraciones (250+)**, Precios, Recursos, Distribuidores | No hay sección; "funciona en Windows, Android, iOS" | **Top-level** | **Hecho** — https://www.last.app/es |
| **Zenchef** | Product (Reserve, Promote, Pay, Insights, Connect, AI) / **Ecosystem** (Integrations, app) / **Solutions por objetivo y por rol** (dueño, grupos, sala) | — | Bajo "Ecosystem" | Footer con páginas "Switch to Zenchef" vs TheFork/OpenTable. **Hecho** — https://www.zenchef.com/ |
| **Sunday** | Products (Pay, Ordering, Handhelds, Guest Platform) + menú "sunday AI" agrupado por objetivo (operaciones, equipo, clientes, negocio) | Handhelds como producto | "Discover all integrations" | **Hecho** — https://sundayapp.com/ |
| **Revo/Cegid** | revo.works redirige (301) a cegid.com/ib/es/productos/tpv-hosteleria-software-restaurantes/; la web de Cegid devolvió 403. Revo ya no tiene web propia | — | Página de partners/integradores | **Hecho** (redirección) |

### Conclusiones A
1. **Tres esquemas dominan** (hecho, tabla): (a) por *suite funcional* (Toast, SpotOn, Last.app), (b) por *zona del local* FOH/BOH/Guest (TouchBistro), (c) por *objetivo de negocio* "operar / crecer / controlar" (Owner, Qamarero, Zenchef Solutions). Casi todos añaden un segundo eje **por tipo de negocio** (servicio en mesa / mostrador / bar / grupos).
2. **"Plataforma/ecosistema" como ítem explícito**: Toast ("Toast Platform" destacado), SpotOn ("Ecosystem"), Last.app ("La plataforma"), Zenchef ("Ecosystem"). Es una página-hub, no un producto (hecho).
3. **Hardware top-level solo en quien lo vende con precio** (Square). Los españoles (Last, Qamarero) lo esconden o dicen "usa tus equipos" (hecho).
4. **Tarjetas destacadas dentro del mega-menú**: Toast (Platform, Switch to Toast, New openings) y TouchBistro (TouchBistro One). Las entradas "Switch to X" y "New openings" se repiten en Toast, Square y SpotOn: **segmentan por momento vital del restaurante** (abrir vs cambiar de TPV) (hecho).
5. Iconos en dropdowns: solo verificado en el mosaico de hardware de Square; en el resto, el texto no permite verlo (sin dato).

---

## B) Tácticas de conversión

### CTAs
- **Demo como CTA principal casi universal**: Toast "Get a Free Demo" + "See Pricing" + "Get a Quote" para "Build your own" (hecho, espejo Toast); Lightspeed "Watch a demo" + "Request a quote" + "Talk to an expert" (lightbox) (hecho); TouchBistro "Book a Demo" / "Get a Quote" / "See Pricing" (hecho); Last.app "Agendar una demo" / "Hablar con ventas", aunque **enlaza a admin.last.app/signup**, no a un calendario (hecho).
- **Self-serve**: solo Square ("Sign up", compra de hardware con carrito) y SumUp ("No necesito un datáfono: Registrarme") (hecho).
- **Teléfono visible**: Toast ("Call Sales" en la cabecera), Lightspeed (cabecera), TouchBistro (barra superior), Last.app (ventas +34 937 377 823 y soporte 365), Flipdish ES (+34 932 71 56 26). Qamarero **no muestra teléfono** (hecho).
- **Chat**: Owner ofrece "Chat with Owner Agent" (su IA) como canal (hecho). No se vio chat en Last, Qamarero ni Lightspeed (hecho con la limitación de JS).
- TouchBistro pone botones que abren ChatGPT/Claude/Gemini/Perplexity con una pregunta sobre la marca ya escrita (hecho): es una táctica para aparecer en buscadores con IA.

### Formularios de demo
- **Owner**: multi-paso; el paso 1 es "What kind of restaurant are you?" (Quick service / Full service / Other) (hecho — https://www.owner.com/demo).
- **Qamarero**: formulario de 4 pasos (restaurante + ciudad + "todavía no he abierto" → nombre → email → teléfono con prefijo), con **escasez** ("48 de 100 plazas") y cuenta atrás hasta el 30/11 (hecho — https://qamarero.com/).
- **Loman (IA de voz)**: "Start Demo Call": eliges cocina, dejas nombre, email, teléfono y restaurante, y **la IA te llama** (hecho — https://loman.ai/).
- **Bookline**: calendario para "reunión de descubrimiento" (hecho).

### Calculadoras y herramientas
- **Owner.com no tiene calculadora de ahorro de comisiones oficial** (la búsqueda solo encontró calculadoras de terceros: ResDiary, NextOrder, Restolabs). En su lugar usa el **Restaurant Grader**: introduces el nombre del restaurante y te da una "online health score" (SEO de Google, qué falla en tu web, quién te gana) (hecho — https://grader.owner.com/). En la home muestra un ejemplo con 36/100 y "$450/mes de ventas perdidas", con el CTA "Get my AI report".
- **Toast**: "Toast Menu Checker" (en Resources) y una "New steps of service ROI calculator" (hecho que existen — https://pos.toasttab.com/es-us/resources/new-steps-of-service-roi-calculator; no se pudo leer el contenido, 403).
- **Zenchef**: ROI calculator en Resources (hecho). **MarketMan**: ROI calculator en el banner superior ("Calculate Your Savings") (hecho — https://www.marketman.com/). **Loman**: ROI Calculator en Resources (hecho). **TouchBistro / SpotOn**: Profit Margin Calculator (hecho).
- **Sunday**: no tiene calculadora; usa cifras de resultado ("72 min recuperados por camarero y turno", "+10 %") (hecho).
- **No se encontró ninguna calculadora española de ahorro de comisiones de delivery** (hecho de búsqueda negativa). Es un hueco disponible.

### Demos interactivas y "pruébalo"
- **Square**: "Take a two-minute POS tour", sin formulario, con enlaces por tipo de negocio (hecho — https://squareup.com/us/en/point-of-sale/restaurants/full-service-demo). Squirrel y Mews tienen tours guiados autoservicio (hecho por búsqueda). No se encontró ningún TPV español con tour clicable tipo Navattic/Storylane (búsqueda negativa).
- **Qamarero**: botón "Probar carta" que abre una carta demo y una sección "Abre la carta como un cliente" (hecho — https://www.qamarero.com/carta-digital/).
- **Bookline**: "Prueba la IA de voz" llamando al **+34 932 71 58 11** y "Prueba la IA de WhatsApp" al +34 930 46 68 99 (hecho — https://www.bookline.ai/es). Es el único jugador español que deja probar el producto sin hablar con ventas.

### Lead magnets
- **TouchBistro**: generador gratuito de menú QR abierto a no clientes; pide un formulario y luego da el enlace al generador (hecho). También un informe anual del sector y una guía de TPV.
- **Qamarero /recursos**: calculadora de escandallo, plantilla de horarios del personal, plantilla de hamburguesas (guarda con Google), 5 guías y 2 checklists, **sin email obligatorio** según la página (hecho — https://qamarero.com/recursos/).
- **Owner**: guías SEO, comparativa de creadores de web y Grader (hecho).
- **Ofertas con fecha límite**: Qamarero (-50 % Black Friday), Zenchef (3 meses gratis hasta el 30/11), TouchBistro (3 meses gratis) (hecho). Contrasta con la marca "honesta" de alaCarta (ver pitfalls).
- Pop-ups de salida y CTA fijos: no se pueden ver con WebFetch (sin dato).

---

## C) Competidores por categoría de los módulos nuevos

### C1. Llamadas con IA
- **Bookline** (ES): voz, WhatsApp e Instagram 24/7; dice tener 1.200+ clientes y 450 M€+ en reservas gestionadas (dato de la propia empresa). Precio a medida, sin permanencia, 25+ integraciones. Demo por teléfono real (hecho — https://www.bookline.ai/es).
- **Zenchef AI Concierge**: 99 €/mes (en la imagen de la página), reservas directas en Zenchef, sin número de demo (hecho — https://www.zenchef.com/call-ai).
- **Qamarero Recepcionista IA**: marcada "nueva"; requiere Qamarero Reservas; precio no publicado (hecho — https://qamarero.com/blog/mejores-recepcionistas-ia-restaurantes/).
- **CoverManager AI Concierge**: complemento aparte del plan de reservas (hecho, fuente secundaria: el mismo blog de Qamarero).
- **Precios públicos en España** (según el blog de Qamarero, que es competidor; conviene verificarlos): heydiga 49 €/200 min y 99 €/500 min; BenCall 99 €/500 min y 199 €/1.250 min, con 0,20 €/min de exceso; fonio 119 €/mes por 1.000 min; Voice Booking IA 179 €/360 min.
- **EE. UU.**: Slang.ai (97 idiomas, voces de marca, integración con OpenTable/Resy/SevenRooms, sin número de demo) (hecho — https://www.slang.ai/). Loman (pedidos telefónicos al TPV, "Start Demo Call" que te llama, ROI calculator) (hecho). **Owner AI Phone Ordering** está en lista de espera (hecho — https://www.owner.com/ai-phone-ordering). Popmenu AI Answering envía por SMS un enlace al pedido online y dice haber atendido 6,1 M de llamadas (hecho, notas de prensa de Popmenu).
- Patrón: los nativos de reservas (Zenchef, CoverManager, Qamarero) venden la IA **como complemento de su libro de reservas**; los especialistas (Bookline, fonio) venden por minutos o por proyecto. **Hipótesis**: el diferencial de alaCarta es que la llamada acaba en el mismo TPV/KDS (pedido) y en el mismo libro de reservas, como promete Loman en EE. UU. En España nadie lo demuestra con un número de prueba ligado a un TPV.

### C2. Web, app de marca blanca y SEO local
- **Owner.com**: el producto completo es "web + SEO + ficha/listings + reseñas + app + pedidos + marketing", contado como una secuencia de 4 pasos (visibilidad en Google → pedido online → repetición con app y fidelización → marketing automático) y presentado como un sistema "run by experts" (hecho — https://www.owner.com/how-owner-works).
- **Qamarero página web**: diseño a medida, "No garantiza una posición concreta en Google", el SEO continuado y la publicidad se contratan aparte, pedidos y reservas se conectan pero se contratan por separado. CTAs "Quiero mi web", "Ver webs reales" y "Revisemos mi web" (hecho — https://qamarero.com/pagina-web-restaurantes/). **No vende Google Business Profile como servicio** (hecho).
- **Flipdish ES**: "web y app a medida", TPV, quiosco, KDS, repartidores vía Uber Direct, enlace a contenido sobre VeriFactu y teléfono español (hecho — https://www.flipdish.com/es).
- **BentoBox (Fiserv/Clover)**: "digital front door"; dice que los pedidos online no tienen comisión (hecho, fuente propia vía búsqueda).
- Otros en ES: RestroAPP (app nativa de marca blanca), Cegid (tienda online sin comisión) (hecho por búsqueda, sin verificar en detalle).
- **Hueco**: ningún competidor español con TPV vende de forma explícita la **gestión de la ficha de Google Business Profile** con entregables concretos (hecho de búsqueda negativa; hipótesis sobre la oportunidad).

### C3. ERP / back-office
- **MarketMan**: se presenta como capa de back-office *junto al* TPV (no lo sustituye), con un muro de logos de TPV, contabilidad y distribuidores, comparativas en el footer y ROI calculator destacado (hecho — https://www.marketman.com/).
- **Gstock**: compras, inventario, mermas y escandallos; la vinculación con el TPV y el consumo teórico frente al real aparecen en el plan Premium según el blog de Qamarero; se conecta con Ágora, Sage, SAP y Vectron (hecho, fuentes secundarias).
- **Yurest**: "ERP todo en uno con IA" (compras con OCR, cocina, inventario, finanzas, RRHH), "por y para hosteleros" (hecho vía Capterra; su web devolvió 404).
- **Mapal**: suite de personal + formación + cumplimiento; compró Inpulse (compras e inventario con IA) para cubrir el back-office (hecho — alimarket). **No encontré ninguna fusión Mapal–Harri**: el encargo la mencionaba, pero son empresas distintas (hecho de búsqueda negativa).
- Qamarero ya incluye en su menú escandallos, mermas, VeriFactu/TicketBAI, facturas de proveedores y APPCC (hecho). **Hipótesis**: el argumento contra los ERP independientes es "sin integración que mantener: el escandallo descuenta stock con la venta del TPV". Gstock lo cobra en el plan alto.

### C4. RRHH y control horario
- **Situación legal (hecho, comprobado el 16-11-2026)**: el registro de jornada es obligatorio desde 2019 (RDL 8/2019, art. 34.9 ET), con conservación de 4 años. El **Real Decreto de registro digital NO está aprobado ni publicado en el BOE** a 24-10-2026 (https://tusjornadas.com/guias/registro-horario-digital-2026/) ni a 13-10-2026 (https://www.dsi-net.com/registro-horario-digital-obligatorio/). El Consejo de Estado emitió un dictamen desfavorable en marzo de 2026 (las fuentes dan el 19 o el 23 de marzo) y el Gobierno ha aplazado la aprobación en julio y en septiembre. El borrador exige formato digital, inalterabilidad, trazabilidad y acceso remoto de la Inspección. Entrada en vigor prevista a los 20 días de publicarse, con un posible periodo de adaptación de 6 a 12 meses para pymes (en debate). Una fuente habla de "elecciones del 29-11-2026": **no verificado, no usar**.
- **Implicación**: la web no puede decir "obligatorio desde X". Sí puede decir "preparado para el registro digital que prepara el Gobierno" y "cumple hoy la obligación de 2019" (hipótesis de redacción).
- **Skello**: planificador con reglas del convenio que avisa antes de publicar el cuadrante; "se conecta con cualquier TPV"; tarifa plana por local (hecho, blog y búsqueda de Skello).
- **Combo**: páginas por sector (restauración tradicional, rápida, hoteles), prueba gratis "sin tarjeta" y 13.000 empresas; parte del contenido no está adaptado a España (menciona la DPAE francesa) (hecho — https://combohr.com/es/).
- **Sesame**: nace del fichaje; QR, facial, WhatsApp, jornadas partidas y nocturnas; se le critica que no tiene reglas específicas de hostelería (hecho, fuentes secundarias).
- **7shifts / Factorial**: no se pudieron leer (página vacía y 404).
- Last.app y Qamarero ya incluyen fichaje y turnos en su menú (hecho). **Hipótesis**: el diferencial real es el **coste de personal contra las ventas del TPV en la misma pantalla** (% de coste laboral por turno), que un HR genérico no tiene.

### C5. Placas QR y NFC físicas
- **Qamarero**: QR único por mesa; la **impresión de 50 QR con tu diseño solo viene en la puesta en marcha Pro (500 € + IVA)** (hecho — https://qamarero.com/implementacion). La página de carta no habla de soportes ni NFC (hecho).
- **Sunday**: solo QR ("one QR code" o uno por mesa); no se encontraron NFC ni soportes incluidos (hecho de búsqueda).
- **Honei**: pedir y pagar con QR, sin NFC documentado (hecho de búsqueda; su web devolvió 404).
- **mintQR**: soportes de mesa en forma de cubo y pirámide, NFC por +1,10 €/ud., presupuesto a partir de 100 ud. (hecho por búsqueda — https://mintqr.com/en/).
- **Toast**: se pueden descargar diseños de mesa con QR; el servicio de carteles QR solo existe en EE. UU. (hecho, ayuda de Toast).
- No encontré "Mr. Menu". **Hueco** (hipótesis): ningún TPV español presenta la placa QR+NFC como producto físico con ficha, fotos y precio.

### C6. Páginas de hardware
- **Square**: tarjetas con foto, precio y **cuota mensual** (Register 899 $ o 44 $/mes en 24 meses; Handheld 399 $ o 37 $/mes), "Kits", "Compare", carrito (hecho — https://squareup.com/us/en/hardware).
- **Toast**: "Build your Starter Kit, starting at $0 upfront", bundle Flex + Tap + router, financiación al 0 % sujeta a aprobación; pagar hardware a plazos sube la comisión de cobro (3,09 % frente a 2,49 %, según NerdWallet) (hecho — https://pos.toasttab.com/shop/bundles y NerdWallet).
- **SumUp ES**: 3 kits (549 €, 599 € y 649 €), precio tachado con % de descuento, IVA incluido mostrado, envío gratis y 30 días de devolución (hecho — https://www.sumup.com/es-ES/catalogo-tienda/).
- **Lightspeed ES**: productos sueltos sin precio, CTA "Habla con un experto"; permite traer tu hardware avisando de la compatibilidad, con remisión al centro de ayuda (hecho — https://lightspeedhq.com/es/tpv/restaurant/hardware).
- **Last.app / Qamarero**: sin tienda; "funciona con lo que tienes" (hecho).

---

## D) Recomendaciones para alaCarta

1. **Mega-menú "Producto" en tres columnas por momento del servicio, con columna de ecosistema destacada.** Columnas: *Sala y cocina* (TPV, comandero, KDS, carta QR, placas QR/NFC) · *Clientes y ventas* (reservas, app propia y pedidos, llamadas IA, web y SEO local) · *Gestión* (backoffice e informes, ERP, RRHH). Arriba, una tarjeta "La plataforma alaCarta" que lleve a la página-hub del ecosistema (patrón Toast, SpotOn y Last, hecho). No conviene ordenar por objetivo ("crecer"), porque eso vende promesas; ordenar por zona del local es más honesto y encaja con la marca (hipótesis).
2. **Hardware como ítem de primer nivel**, aunque tenga pocos productos: es donde alaCarta puede diferenciarse de Last y Qamarero, que lo esconden (hecho). Tarjetas con foto monocroma, precio con IVA, kits por tipo de local (bar, restaurante con sala, cafetería de mostrador) y una lista "si ya tienes equipo: compatible / no compatible" (patrón Square + SumUp + aviso de Lightspeed).
3. **Página "Plataforma" con un recorrido del dato, no un diagrama de logos**: "una reserva por teléfono con IA → mesa en el plano → comanda → KDS → cobro → stock descontado → hora de personal imputada → cierre contable". Cada paso enlaza a su módulo. Owner cuenta así su sistema en 4 pasos numerados (hecho); alaCarta puede hacerlo con 8 pasos y un único caso real (hipótesis).
4. **Segundo eje en la navegación: "Para tu local"** (bar, restaurante, cafetería, grupos) y **"Abrir un local" frente a "Cambiar de TPV"** como dos entradas claras, porque son los que mejor convierten en Toast, Square y SpotOn (patrón hecho; conversión hipótesis). "Cambiar de TPV" debe incluir el plan de migración y la puesta en marcha.
5. **Demo de llamada IA con número real** ("Llama al 9xx xxx xxx y reserva en un restaurante ficticio"), y además "que te llame la IA" con un formulario mínimo (patrones Bookline y Loman, hecho). En España solo Bookline lo hace, y Bookline no tiene TPV. Al terminar la llamada, enseñar en pantalla la reserva o el pedido creados (hipótesis de máximo impacto).
6. **Carta QR demo "escanéala ahora"**: un QR en la home y en la página de carta que abre una carta ficticia en el móvil del visitante, y en escritorio un iframe "ábrela como cliente" (patrón Qamarero, hecho). Si el pedido de prueba aparece en un KDS simulado en la web, se demuestra la integración en 10 segundos (hipótesis).
7. **Tour clicable del backoffice y del TPV sin formulario** (Navattic/Storylane o uno propio), de 2 minutos, como el "two-minute POS tour" de Square (hecho). Ningún TPV español tiene uno (búsqueda negativa), así que es un diferencial fácil.
8. **Calculadora "cuánto te cuestan hoy tus herramientas sueltas"**: el usuario marca qué paga (TPV, reservas, carta, fichaje, ERP, web, comisiones de delivery en % de ventas) y la calculadora compara con el precio fijo por local de alaCarta. Variante: calculadora de comisiones de delivery con pedidos al mes × ticket × % comisión. No existe ninguna española (hecho de búsqueda negativa). Va en la página de Precios y en la de App propia, no como pop-up.
9. **Auditor gratuito de la ficha de Google y la web** (patrón Owner Grader, hecho): metes el nombre del local y recibes una nota con horarios, fotos, reseñas sin responder, carta enlazada, velocidad de la web y enlace de reserva. Es el lead magnet natural del módulo web + SEO local, que ningún competidor español vende de forma explícita (hecho de búsqueda negativa).
10. **Recursos sin muro de email** (como Qamarero, hecho): calculadora de escandallo, plantilla de cuadrante de turnos, checklist de apertura y guía de registro de jornada **con el estado legal real y la fecha de actualización** (el RD digital no está aprobado a 16-11-2026). Encaja con la marca honesta y da autoridad para SEO (hipótesis).
11. **Formulario de demo en 3 pasos con calendario integrado**: tipo de local → nº de locales y módulos de interés → cita en calendario. Owner y Qamarero cualifican primero (hecho); Last.app manda al alta y pierde la reserva de demo (hecho). Junto al formulario: teléfono visible y "te llamamos" (hipótesis).
12. **Página de "Puesta en marcha" con alcance, plazo y precio**: Qamarero publica Basic a 200 € y Pro a 500 €, con "valor estimado" (hecho). alaCarta puede mejorarlo con un calendario día a día (día 1 carga de carta, día 3 formación, día 7 primer servicio acompañado) y entregables físicos (placas, kit instalado) (hipótesis).
13. **Página de integraciones aunque sea un ecosistema propio**: delivery (Glovo, Uber Eats, Just Eat), pagos, gestorías y contabilidad, VeriFactu/TicketBAI. Last.app la tiene en el primer nivel (250+, hecho) y MarketMan la usa para quitar miedos (hecho). En alaCarta debería ir en el pie de página o dentro de "Plataforma", no en el primer nivel (hipótesis).
14. **Páginas comparativas "alaCarta frente a herramientas sueltas"** (no contra marcas al principio): el mismo formato que "Toast vs Square", con pestañas y FAQ (hecho), pero comparando el coste y las integraciones de montar TPV + reservas + Skello + Gstock + web por separado (hipótesis).

### Errores a evitar
- **Escasez y cuentas atrás falsas** ("48 de 100 plazas", -50 % Black Friday): son habituales (Qamarero, Zenchef, TouchBistro, hecho), pero chocan con la marca honesta y con el precio fijo. Mejor un "precio igual para todos, publicado".
- **Prometer posiciones en Google**: incluso Qamarero aclara que no las garantiza (hecho). Vender entregables (ficha optimizada, reseñas respondidas, datos estructurados), no rankings.
- **Afirmar que el registro digital es obligatorio**: a 16-11-2026 el RD no está publicado (hecho). Hay que poner la fecha de revisión en la página.
- **Cifras de resultado sin fuente** ("+10 % de ventas", "72 min por turno" como Sunday, hecho): sin clientes reales, mejor usar calculadoras con los datos del propio usuario.
- **Mega-menú de más de 25 enlaces** (Qamarero y Lightspeed rozan los 30, hecho): con 14 módulos, agrupar y enlazar a hubs.
- **CTA "Agendar demo" que lleva a un alta** (Last.app, hecho): el destino tiene que coincidir con lo que promete el botón.
- **Copiar el "IA" como menú propio**: Qamarero y Sunday lo destacan (hecho). En alaCarta la IA de llamadas es un módulo más dentro de "Clientes y ventas", y no una capa de marketing (hipótesis de marca).
