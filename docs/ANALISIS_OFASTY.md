# Análisis del proyecto de referencia (Ofasty)

Análisis en modo lectura de `~/proyectos/ofasty/ofasty-web-corporativa`, realizado el 16 de
noviembre de 2026. No se ha modificado ni copiado nada de ese proyecto. Sirve para entender el
contexto de negocio y decidir qué replantear en alaCarta.

## 1. Qué es y qué vende

Ofasty es la **capa de hostelería sobre Beply**, un ERP de terceros: el restaurante contrata un plan
de Beply (gestión, facturación con VeriFactu, contabilidad) y suma las soluciones de Ofasty (TPV,
comandero, carta QR, apps de reparto, llamadas con IA, "Ofasty App" de pedidos y reservas, y
páginas web). **Beply factura al cliente.** Es un catálogo de soluciones frontend sobre un
backoffice ajeno, no una plataforma propia.

Precio de entrada: 28,89 €/mes (plan Beply Estándar 19,99 € + TPV 8,90 €). Soluciones sueltas de
3,90 a 8,90 €/mes. Comisiones por uso en la app de pedidos (3 %) y por reserva (0,30 €). Alta de
49 € por plataforma de reparto. Web del restaurante 490 € + 19,90 €/mes.

## 2. Stack y arquitectura

| Aspecto    | Ofasty                                                                 |
| ---------- | ---------------------------------------------------------------------- |
| Framework  | Vue 3 + Vite + `vite-ssg` (prerender), vue-router, vue-i18n (ES/EN)    |
| Estilos    | CSS nativo con nesting, tokens en `src/styles/*.css`, Inter + Figtree  |
| SEO        | `@vueuse/head`, JSON-LD por composable, sitemap generado leyendo el router |
| Contenido  | `src/data/*.ts` como fuente única (plans, solutions, media, faqs…)      |
| Medios     | `media.ts` con claves; "escenas" animadas en vez de capturas que faltan |
| Calidad    | ESLint, Prettier, scripts de comprobación (i18n, contraste, medios)     |
| Despliegue | Dockerfile (node → nginx), GitLab CI con FTP, Hostinger; migración a Coolify pendiente |

**Puntos fuertes técnicos**: disciplina de tokens, fuente única de precios, prerender, sitemap
automático, comprobaciones por script, documentación interna abundante (CLAUDE.md, STYLE_GUIDE,
docs/goals).

**Puntos débiles técnicos**: `vite-ssg` con problemas de CSS crítico (concurrency 1, beasties),
hidratación completa de Vue en cada página aunque sea estática, i18n que duplica el coste de cada
texto, 24 rutas con una capa de redirecciones acumuladas, y según su TODO, las URL limpias en
producción servían la home (problema de hosting). La complejidad de medios (escenas, marcadores,
briefs) supera lo que una web corporativa necesita.

## 3. Navegación y páginas

Inicio · Soluciones (TPV, comandero, carta QR, delivery, llamadas IA, Ofasty App, páginas web) ·
Hardware · Precios · Cómo funciona · VeriFactu · Empresa · Blog · FAQ · Contacto · legales ·
landings por tipo de negocio generadas desde `business-types.ts`.

Observaciones:

- La oferta mezcla **producto** (TPV, comandero) con **servicios** (web del restaurante,
  instalación por horas) y con **productos de terceros** (Beply, Glovo). La propuesta es difícil de
  resumir en una frase.
- La página de precios necesita un configurador porque el modelo (plan ajeno + módulos propios +
  altas + pagos por uso) es complejo. El propio documento interno lo reconoce.
- Buen trabajo de SEO por keywords (docs/seo), landings por sector, blog con artículos reales.
- El copy es concreto y en lenguaje de local ("Cobra una mesa en dos toques"). Es lo más
  aprovechable como **referencia de tono**, no de texto.

## 4. Branding y estética

Naranja como único acento sobre blanco, Figtree para titulares, filetes en vez de tarjetas, "líneas
que se trazan". Rediseño de octubre 2026 bien razonado hacia lo sobrio. Sigue teniendo logotipo,
marca y color que no se pueden reutilizar.

## 5. Qué problemas resolvía bien

- Fuente única de precios y textos (evita incoherencias).
- Prerender para que bots y previews vean contenido.
- Landings por tipo de negocio.
- FAQ que caza objeciones reales.
- Enseñar el producto desde el primer segundo (capturas y demos).

## 6. Qué limitaciones tenía

1. **Dependencia estructural de un tercero** (Beply) en producto, facturación y marca.
2. **Modelo de precios fragmentado**: plan ajeno + módulos + altas + comisiones por uso.
3. **Catálogo heterogéneo**: software, servicios y revendedor de integraciones en la misma web.
4. **Sin backoffice propio**: no hay historia de "plataforma", solo de "soluciones".
5. **Prueba social inexistente** y sustituida por "ejemplos", con riesgo de parecer inventada.
6. **Complejidad técnica** (medios, escenas, i18n) desproporcionada para una web corporativa.
7. Varias soluciones "próximamente" visibles en la web (Ofasty App, Uber Eats, Just Eat).

## 7. Qué no conviene replicar en alaCarta

- El modelo "plan de otro + módulos nuestros".
- Vender servicios (web del restaurante, horas presenciales) al mismo nivel que el producto.
- Comisiones por uso en reservas y pedidos.
- Hardware como sección de primer nivel.
- Naranja, Figtree, logotipo, nombre de componentes y cualquier texto literal.
- Internacionalización desde el día uno (coste alto, valor bajo en fase de lanzamiento).
- Página de "Cómo funciona" separada: en alaCarta el flujo del servicio está en la home.

## 8. Qué sí se ha tomado como aprendizaje (reimplementado desde cero)

- Fuente única de datos en TypeScript.
- Tokens de diseño estrictos y CSS sin preprocesador.
- Salida estática y sitemap automático (resuelto mejor con Astro).
- Tono de copy concreto, en lenguaje de local.
- Landings por sector y FAQ con objeciones.
- Script de comprobación tras el build (aquí: enlaces internos).
- Dockerfile node → nginx para Coolify.

## 9. Oportunidades detectadas

- Presentar alaCarta como **plataforma** con backoffice propio, multiempresa y multilocal.
- **Precio simple y público** sin comisiones, frente al modelo fragmentado.
- Estructurar la web por **flujo del servicio** y por **tipo de local**, no por catálogo.
- Identidad **monocroma y sobria** que ningún competidor español usa.
- Honestidad explícita sobre el estado del producto en lugar de "ejemplos" de prueba social.
