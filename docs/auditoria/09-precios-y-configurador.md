# 09 · Precios (`/precios`) y configurador "Monta tu alaCarta"

**Estado:** hecho (fase 5, 17-11-2026) · **Prioridad:** 2 · **Depende de:** 01, decisiones de precio de Jordi, 10 (D5, D6)

## 1. Diagnóstico

Lo bueno, que se conserva: precio público por local, sin comisiones ni permanencia, tabla módulo a
módulo, cuatro "0" (reserva, pedido, QR, alta), nota de "tarifa orientativa", pago anual −15 %.

Lo que falla con el ecosistema nuevo:

1. **Faltan 7 productos**: app propia, llamadas IA, web, ERP, RRHH, hardware y placas QR. La tabla
   pasará de 9 a 16 filas.
2. **Dos planes** no comunican el ecosistema; el plan Completo se presenta como techo y no hay ancla
   de "todo".
3. **No se puede calcular un caso**. El visitante que quiere "Completo + 2 TPV + RRHH para 12
   empleados + kit" no tiene forma de verlo sin pedir demo.
4. **No hay comparación con lo que paga hoy** (herramientas sueltas + comisiones), que es el
   argumento económico más fuerte del ecosistema.
5. Hardware y servicios están en una lista lateral sin protagonismo.

## 2. Propuesta de estructura de la oferta (cifras ORIENTATIVAS, decisión de Jordi)

### Planes por local (software)

| Plan | €/mes (anual) | Incluye |
| --- | --- | --- |
| **Esencial** | 49 (42) | TPV (1), carta QR con pedido en mesa, backoffice e informes, 3 usuarios |
| **Completo** ★ | 99 (84) | + comandero (3), cocina (1), reservas, pedidos online, clientes, escandallos, usuarios ilimitados |
| **Total** (nuevo) | 159 (135) | + app propia, llamadas con IA (200 min/mes), Equipo y RRHH (hasta 20 empleados), ERP (1 empresa), soporte prioritario |
| **Grupos** | a medida | Total en cada local + carta maestra, multiempresa, comparativas, API, gestor de cuenta |

Justificación: Total sale más barato que Completo + complementos (99 + 19 + 29 + 24 + 29 = 200 €), lo
que **empuja a comprar el ecosistema**, y ancla el Completo como opción razonable.

### Complementos (sobre cualquier plan)

| Complemento | Propuesta | Referencia |
| --- | --- | --- |
| App propia | 19 €/mes por local | Ofasty: 3 % por pedido + 0,30 €/reserva (aquí sin comisión) |
| Llamadas con IA | 29 €/mes con 200 min, minuto extra 0,12 € | Ofasty 4,90 € + 0,10 €/min (agente Beply); Zenchef 99 €/mes. **Depende del coste del proveedor de voz.** |
| Equipo y RRHH | 24 €/mes por local hasta 20 empleados; +1 €/empleado extra | GestiTec Personal 7,90 € con 3 usuarios + tramos; Sesame/Factorial por empleado |
| ERP | 29 €/mes por empresa | GestiTec Negocio 14,90 € |
| Web y presencia en Google | 390 € de alta + 24 €/mes | Ofasty 490 € + 19,90 € |
| Módulos sueltos sobre Esencial | los actuales (19-29 €) | — |
| Dispositivos extra | los actuales (8-12 €) | — |

### Equipamiento y servicios

- Hardware: kits "precio en tu propuesta" (o "desde" si se publican); siempre "usa el tuyo".
- Placas QR: pack de 10 desde X € (decisión); imprimibles gratis.
- Puesta en marcha remota: 0 €. Presencial: desde 290 € + desplazamiento. Migración: a medida.

### Locales fundadores (si se aprueba)

No es un descuento con cuenta atrás (la investigación desaconseja la escasez falsa). Propuesta:
**precio bloqueado mientras siga la suscripción**, puesta en marcha presencial incluida, línea
directa con producto, y el compromiso de dar feedback. Número de plazas real (p. ej. 20) y visible
sin contador agresivo.

## 3. Estructura de la página

1. **Hero** (se mantiene): "Un precio por local. Sin comisiones, sin permanencia."
2. **Planes** (4 columnas: Esencial, Completo ★, Total, Grupos) con conmutador mensual/anual. En
   móvil, carrusel con Completo primero.
3. **Configurador "Monta tu alaCarta"** (D5) con ancla `#configurador`: la carta de módulos + el
   ticket. Precarga por URL (`?plan=`, `?add=`, `?sector=`, `?locales=`). CTA "Recibir esta
   propuesta" (correo) y "Revisarla en una demo".
4. **Comparativa honesta "Herramientas sueltas vs alaCarta"** (nuevo, sin marcas): tabla de lo que
   suele pagar un restaurante tipo por TPV + KDS + reservas por comensal + tienda con comisión +
   fichaje + web, frente a alaCarta Completo/Total. Las cifras del lado "suelto" deben venir de
   precios públicos con fuente (investigación) y mostrarse como rango.
5. **Calculadora de comisiones** reducida (D6) con enlace a la herramienta completa.
6. **Módulo a módulo** (tabla actual ampliada a familias, filas agrupadas con subtítulo de familia
   e icono; chip de estado si no está disponible).
7. **Complementos** (tarjetas con precio y enlace a su página).
8. **Equipamiento y puesta en marcha** (dos columnas: kits/placas y servicios).
9. **Cero comisiones, de verdad** (se mantiene; añadir "0 € por llamada atendida: pagas minutos, no
   reservas").
10. **Locales fundadores** (si se aprueba).
11. **FAQ** ampliada: ¿qué pasa si me paso de minutos de IA? ¿el ERP es por local o por empresa?
    ¿puedo contratar solo RRHH? ¿el hardware es en propiedad? ¿IVA?
12. **Cierre**.

## 4. Datos

- `src/data/pricing.ts`: añadir plan `total`, `addons` (complementos con unidad: local, empresa,
  empleado, minuto, alta), `hardwareKits`, `qrPlates`, `founders`. Mantener `PRICES_ARE_ESTIMATES`.
- Lógica del configurador en un módulo puro `src/lib/quote.ts` (testeable): entradas → líneas del
  ticket, totales mensual/único/anual, recomendación de plan.

## 5. Criterios de aceptación

- [x] 4 planes + complementos + equipamiento coherentes en tabla, tarjetas y configurador.
- [x] Configurador: URL compartible, recomienda el plan más barato equivalente, pasa la
      configuración al formulario (`config` serializado).
- [x] Nota "orientativo" visible mientras `PRICES_ARE_ESTIMATES`.
- [x] Sin escasez falsa ni cuentas atrás.
- [x] `npm test` verde; capturas 1440/390.

## Notas de implementación (fase 5, 17-11-2026)

**Datos** (`src/data/pricing.ts`, fuente única): plan **Total** 159 €/mes (135 € con pago anual)
con `devices` por plan; `addons` con unidad (`per`: local, empresa, web), lo incluido y el uso
extra: app propia 19 €/local, llamadas con IA 29 €/local con 200 min (minuto extra 0,12 €),
Equipo y RRHH 24 €/local hasta 20 personas (+1 €/persona), ERP 29 €/empresa (el Total incluye
una), web 24 €/mes + 390 € de alta (fuera del Total). `totalAsSeparate` = 200 € (ancla del Total).
`FOUNDER_SPOTS` (20) y `founderPerks` se mueven aquí. `comparisonRows` y `COMMISSION_RANGE` con
fuente y fecha de consulta. Hardware, kits y placas siguen "En tu propuesta". Grupos pasa a ser
"Total en cada local".

**`solutionPricing()`**: los complementos que van en el Total muestran la cifra del complemento
("Complemento para cualquier plan · 29 €/mes por empresa") y como alternativa "Incluido en el
plan Total (159 €/mes por local)". JSON-LD con el precio del complemento. La banda de precio ya no
tacha planes cuando es un complemento. El camino "Todo el ecosistema" del hub es ahora el plan
Total con precio.

**Lógica** (`src/lib/quote.ts`, pura): `quote(config)` calcula los tres caminos (Esencial con
sueltos, Completo, Total) con complementos, dispositivos de más, minutos y personas extra, y elige
el más barato; devuelve líneas, subtotal mensual, 12 meses, ahorro anual (solo sobre la cuota del
plan, como dice la FAQ), pagos únicos, pendientes, `better` (ahorro frente al camino de abajo),
`upsell` (plan de arriba si cuesta ≤ 30 €/local más) y avisos (Grupos desde 3 locales, app o IA
sin reservas/pedidos, fundador). `encodeConfig/decodeConfig` (ej.
`co.kd.re.rh_l2_t2_e25_a_h_f`), `configFromParams` (`config`, `add`, `plan`, `sector`,
`locales`), `describeConfig` (resumen legible para el formulario de la fase 6) y
`sectorPresets`. Comprobación sin dependencias: `scripts/check-quote.mjs` (tipos quitados por Node
≥ 22.18 y un gancho de resolución para `@/`), `npm run check:quote`, incluido en `npm test`
(17 casos).

**D5** (`islands/Configurator.vue`, `#monta`): carta en cinco secciones con precio de carta y
línea de puntos; casillas nativas, pasos −/+ con número editable; locales, pago y "local
fundador" arriba; "Ya tengo TPV" para contratar solo ERP, RRHH o web. Ticket en `--font-mono`
(la monoespaciada del sistema que ya define `tokens.css`), con borde dentado, líneas que entran
con una animación corta (sin ella con `prefers-reduced-motion`), comisiones 0,00 €, total,
12 meses, ahorro anual, pago único y notas. `aria-live` con el total. URL y `sessionStorage`
(try/catch) al cambiar algo. Botones: "Recibir esta propuesta por correo"
(`motivo=propuesta`) y "Revisarla en una demo", ambos con `config`, `plan` y
`origen=configurador`; "Copiar enlace" y "Empezar de cero". Sin JS: la carta con precios.

**D6** (`islands/CommissionCalculator.vue`): completa (agregadores, reservas por comensal, QR con
comisión, % que pasa al canal propio) y `compact` (solo agregadores). Resultado en ticket con lo
que pagas, lo que dejas de pagar, la cuota del canal propio y la diferencia (si sale negativa, lo
dice). CTA con `motivo=comisiones` y la cuenta en `config`.

**Página** `/precios`: hero, 4 planes (2×2 en tablet, carrusel con Completo primero en móvil),
configurador, comparativa, calculadora reducida, módulo a módulo (columna Total; "opcional" en
vez de "—"; en ≤ 720 px cada fila es una ficha con las cuatro casillas, sin scroll lateral),
complementos en tarjetas con "Añadir a mi cuenta", equipamiento y servicios, cero comisiones (con
"0 € por llamada atendida"), bloque de fundadores y FAQ ampliada (Total, minutos de IA, ERP por
empresa, solo RRHH, hardware en propiedad, IVA, fundador).

**Enlaces**: "Monta tu alaCarta" → `#monta` en menú (sin "pronto"), plantilla de producto,
banda de precio, hub y su cierre; sectores (`?sector=`), `/hardware` y `/hardware/placas-qr`
(`?add=`), calculadora (`?add=pedidos-online`), fundadores (`?config=f`).

**Desviaciones y decisiones por defecto**:

- Ancla `#monta` (el brief) en vez de `#configurador` (este documento).
- Descuento anual solo sobre la cuota del plan (lo que ya decía la FAQ); complementos, sueltos y
  dispositivos, igual en mensual y anual. A confirmar por Jordi.
- El Total incluye **un** ERP por cuenta, no uno por local; el resto de empresas a 29 €.
- Llamadas con IA y app propia sin Reservas ni Pedidos online: aviso, no se añaden solos.
- Fundador no descuenta nada: bloquea el precio e incluye la presencial (0 € en el ticket).
- Locales del configurador: de 1 a 20; desde 3, aviso de Grupos ("esta cuenta es el máximo").
- `?sector=` con presets orientativos por tipo de local (no estaban definidos).
- Comparativa con marcas **solo como fuente** de cada rango (no como columnas); las recopilaciones
  de terceros (comisiones de agregadores, IA telefónica, Foodeo) van marcadas como tales.
  No se suman los rangos en un total (mezclaría productos distintos); la última fila es el Total.
- Prettier pasado sobre `src/components/islands/*.vue` (sin cambios de comportamiento).
- Peso gzip: `Configurator` 9,3 KB (lleva `quote.ts`), `CommissionCalculator` 3,4 KB,
  `PricingPlans` 1,4 KB, datos de precios compartidos 2,0 KB (más el runtime de Vue común).

**Pendiente (Jordi)**: confirmar todas las cifras nuevas; descuento anual sobre complementos;
fuente neutral de comisiones de agregadores; si la comparativa nombra proveedores como fuente
(publicidad comparativa: hay que poder demostrar cada cifra); precio de kits y placas.
**Fase 6**: hecho. El formulario lee `config` (`decodeConfig`/`describeConfig`), el `config` de
la calculadora de comisiones y los `motivo` nuevos (`propuesta`, `comisiones`, `fundador`); ver
notas del doc 11. El plan Grupos va ahora a la demo con `plan=grupos`.
**Capturas**: `docs/auditoria/capturas/fase-5/`.
