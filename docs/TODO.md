# TODO

Lista viva. Consolidada el 17-11-2026 al cerrar el loop del ecosistema (`docs/auditoria/LOG-LOOP.md`,
fases 1-10). Leyenda: `[x]` hecho · `[ ]` pendiente · `[!]` necesita una decisión, un dato o un
acceso que solo puede dar Jordi. Lo que no tiene dato se muestra en la web sin inventarlo («en tu
propuesta», «en camino», `[pendiente]` en los legales).

## 1. Para Jordi: decisiones y datos que faltan

### Producto y proveedores

- [!] **Proveedor de voz para las llamadas con IA** (socio o propio), idiomas confirmados, número
      de demostración y audio para la demo de `/soluciones/llamadas-ia`.
- [!] **Marca blanca del ERP y de Equipo y RRHH**: plazo de la variante de build con marca alaCarta
      y qué hacer con la gestión central, que hoy no distingue marcas.
- [!] **Hardware**: proveedor, compra o renting, garantía, plazos y precio de los kits.
- [!] **Placas QR**: proveedor, precio por placa y plazo de entrega.
- [!] **Puesta en marcha**: validar los plazos de la línea temporal (día 0, días 1-3, 3-7, día 7).
- [!] ¿**API pública** en el plan Grupos? Hoy figura «en camino».
- [!] Validar que `/novedades` muestre **13 piezas «Disponible»** aunque el producto aún no existe
      (decisión del 16-11-2026; la leyenda lo matiza «desde el lanzamiento con los primeros locales»).

### Precios (`src/data/pricing.ts`, `docs/PRECIOS.md`)

- [!] Confirmar cifras: Esencial 49 €, Completo 99 €, Total 159 €, complementos, módulos sueltos,
      dispositivos, presencial desde 290 €, web 390 € de alta.
- [!] ¿El **descuento anual** se aplica también a los complementos? Hoy solo a la cuota del plan.
- [!] Validar los **presets por sector** (son precio público orientativo en cada página de sector).
- [!] La comparativa «por piezas» de `/precios` cita competidores (Ágora, Qamarero, Last.app,
      TheFork, Zenchef, Square, Haddock) como **fuente** de rangos públicos: validar si se quiere
      publicidad comparativa.
- [!] **Fuente neutral** para el rango de comisiones de agregadores (14-30 %): hoy es una
      recopilación de un proveedor del sector, marcada como no contrastada.
- [!] Frase comparativa de precio de la pantalla de cocina (fase 2), sin validar.

### Copy y marca

- [!] Validar el H1 de la home, «Todo tu restaurante, en un solo sistema.»
- [!] ¿La entradilla de la home debe nombrar app propia y llamadas con IA (en camino) sin chip?
- [!] «Quién hay detrás» en `/por-que-alacarta`: nombre, cargo y foto (preparado y oculto hasta que
      haya datos en `TEAM`).
- [!] Cifras de ejemplo de las maquetas: son interfaz inventada de un restaurante ficticio; validar
      que se queden así.

### Embudo y comercial

- [!] **Endpoint de formularios** y buzón de ventas (contrato en `docs/DESPLIEGUE.md` §6). Sin él
      la web ofrece enviar por correo.
- [!] **Teléfono comercial** para «te llamamos» (y, si se quiere, publicarlo).
- [!] **Zona de visitas** presenciales (fundadores y puesta en marcha).
- [!] **Herramienta de agenda** para la demo (hoy «te escribimos para buscar hueco»).
- [!] **Analítica**: decidir si se mide y con qué (recomendación: sin cookies) y escuchar el evento
      `alacarta:conversion` que dispara `/gracias`.
- [ ] Imanes con correo (checklist de apertura, plantillas): necesitan el endpoint.

### Legal

- [!] Datos de la sociedad (denominación, NIF, domicilio, registro mercantil), delegado de
      protección de datos, proveedores (hosting, formularios, correo) y plazos de conservación.
      Hoy marcados como `[pendiente]` en los tres textos.
- [!] Revisión por un asesor; ¿la atribución en `sessionStorage` requiere consentimiento (art. 22.2
      LSSI)?
- [ ] Al publicar los legales revisados: quitarles `noindex`, sacarlos del filtro del sitemap
      (`astro.config.mjs`) y del `Disallow` de `robots.txt`.
- [ ] Antes de publicar, volver a comprobar en el BOE VeriFactu (aplazamiento anunciado, no
      publicado a 16-11-2026) y el registro digital de jornada (real decreto no aprobado a
      17-11-2026), y actualizar las guías y su `reviewedAt`.

## 2. Publicación de la web

- [!] **Dominio**: comprobar y registrar `alacarta.com` (y `.es`).
- [!] **GitHub**: repositorio remoto y primer push; proteger `main`, Dependabot, CI en verde.
- [!] **Coolify**: aplicación desde el Dockerfile, staging primero, variables de build.
- [!] **DNS** para apex y `www`; reservar subdominios futuros. SSL y HSTS cuando esté estable.
- [!] **Correo corporativo** (`hola@`, `soporte@`) con SPF, DKIM y DMARC.
- [!] **CRM** o, al principio, hoja compartida para los leads.
- [ ] Open Graph: validar la imagen en un validador de previsualizaciones.
- [ ] Search Console y Bing Webmaster; enviar el sitemap.
- [ ] Lighthouse en entorno real (no instalado en el VPS); medido a mano: CLS 0, FCP/LCP ≈ 1,2-1,5 s
      en móvil simulado.
- [ ] Monitorización de disponibilidad y alertas.

## 3. Contenido y producto en la web

- [ ] Revisar el copy de productos, sectores y momentos con alguien de hostelería.
- [ ] Prueba social **solo cuando exista** (fundadores).
- [ ] Centro de ayuda real con el lanzamiento (hoy «disponible con el lanzamiento»).
- [ ] Sustituir maquetas por capturas reales manteniendo marco y tamaño.
- [ ] Al cambiar el estado de una pieza o integración: solo `status` en `solutions.ts` o
      `integrations.ts` (la web se actualiza sola) y fecha en `/novedades`.
- [ ] Demos que quedaron simplificadas: D1 sin modo barra para bares, D3 sin mitades para
      pizzerías, D2 sin variante multilocal para grupos, alérgenos con letras en vez de iconos.
- [ ] Modo oscuro del TPV (maqueta) para pubs y coctelerías.

## 4. Contratos, soporte y lanzamiento comercial

- [!] Condiciones generales de contratación, nivel de servicio para Grupos, contrato de encargado
      de tratamiento para clientes.
- [!] Soporte: horario real y canales antes de prometer más de «24 h laborables».
- [!] Pagos: proveedor para la suscripción y la facturación a clientes.
- [ ] Lanzamiento: selección de los 20 locales fundadores, guion de demo, propuesta tipo, gestorías
      prescriptoras, perfil de empresa en Google.

## 5. Hecho

- [x] Web inicial (16-11-2026): marca, sistema de diseño, 36 páginas, SEO técnico, maquetas,
      formularios, Dockerfile y documentación.
- [x] Auditoría del replanteamiento como ecosistema (`docs/auditoria/01-13`).
- [x] Loop de implementación (17-11-2026), fases 1-10: modelo de datos por familias con estado y
      conexiones; megamenús, cabecera y barra móvil; hub y plantilla de producto; hardware, placas y
      puesta en marcha; demos D1-D8; plan Total, complementos, configurador y calculadora;
      formulario en 3 pasos, modo llamada, `/gracias` y atribución; home; 9 sectores y 3 momentos;
      recursos, 6 guías, por qué, fundadores, novedades e integraciones; legales en borrador.
- [x] QA final (fase 10): 55 páginas sin desbordes a 390 ni a 1440 ni errores de consola; enlaces y
      425 anclas comprobados en `npm test`; SEO (títulos, descripciones, un `h1`, `noindex`,
      sitemap); JSON-LD válido; contraste AA (gris secundario y aviso oscurecidos); teclado en
      menús, demos y formulario; espacios comidos por Astro; formato con Prettier.

## 6. Decisiones ya tomadas (para no reabrirlas sin motivo)

- Stack: Astro 7 estático + Vue 3 para islas (`docs/ARQUITECTURA.md`). Node ≥ 22.23.4.
- Ecosistema en 4 familias; Informes fusionado en Backoffice; ERP y RRHH como productos aparte
  (16-11-2026).
- Plan Total (159 €) y complementos publicados con cifras orientativas (16-11-2026).
- Chip «En camino» solo en lo nuevo que depende de terceros o ramas sin desplegar y en las
  integraciones no hechas (16-11-2026).
- Locales fundadores: 20 plazas, precio bloqueado, presencial incluida, línea directa, sin cuentas
  atrás (16-11-2026).
- Sin testimonios, cifras de clientes ni logotipos inventados. Sin cookies ni scripts de terceros.
- Las marcas técnicas de origen no aparecen nunca en la web.
- Precio por local, sin comisiones, sin permanencia, puesta en marcha remota incluida.
