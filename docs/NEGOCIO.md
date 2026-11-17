# Negocio: ecosistema, propuesta de valor y modelo

Revisado el 17-11-2026 tras el replanteamiento como ecosistema (`docs/auditoria/01`). Las cifras
viven en `src/data/pricing.ts` y se justifican en `docs/PRECIOS.md`.

## 1. Qué es alaCarta

> **alaCarta es el ecosistema que hace funcionar un restaurante: lo que pasa en la sala, lo que
> entra por el teléfono y el móvil del cliente, lo que pasa en la oficina y el equipo, y el
> equipamiento para que todo arranque. Todo conectado, con una cuota y un solo interlocutor.**

Tres consecuencias que guían la web:

1. **El producto no es el TPV, es la conexión.** Cada página enseña con qué se conecta lo que vende
   (diagrama de conexiones) y la web lo **demuestra** con demos vivas en vez de afirmarlo.
2. **Software, equipamiento y servicio con una sola lógica**: «te lo dejamos funcionando». Todo
   cuelga de un sistema propio; nada se vende suelto sobre la plataforma de otro.
3. **Embudo de cuatro puertas**: probar, calcular, que te llamen y pedir demo (§7).

Mensaje principal: **«Todo tu restaurante, en un solo sistema.»** «Ecosistema» se usa en titulares
de marca (home, `/soluciones`, por qué); en el resto, lenguaje de local. «Todo en uno» no se usa
como claim (está saturado).

## 2. Posicionamiento

| | |
| --- | --- |
| **Para** | propietarios y gerentes de 1 a 15 locales de hostelería |
| **Que** | pagan 4-7 herramientas sueltas, comisiones por sus propios clientes, y no ven el negocio entero |
| **alaCarta es** | el ecosistema de gestión para hostelería |
| **Que** | conecta sala, cocina, canales propios, gestión y equipo en un solo sistema, con una cuota fija, sin comisiones y llave en mano |
| **A diferencia de** | TPV con módulos de terceros (integraciones que se rompen y cada una cobra) o suites caras y opacas |
| **Porque** | un mismo dato (carta, mesa, cliente, venta, persona) alimenta todo, y la web lo enseña funcionando |

El hueco de mercado (`docs/investigacion/ecosistema-y-embudo.md`): nadie en España une TPV + ERP
+ RRHH + IA telefónica + web con marca propia y **precio público**, ni enseña una demo jugable que
conecte sala, cocina y caja.

## 3. Las cuatro familias

| Familia | Mensaje | Productos (estado en la web) |
| --- | --- | --- |
| **Servicio en sala y cocina** | La comanda sale de la mesa y llega a cocina y a caja sin que nadie la copie | TPV · Comandero · Pantalla de cocina · Carta digital QR |
| **Clientes y canales** | Tus reservas, tus pedidos, tu app y tu teléfono, con tu marca y sin pagar por cada cliente | Reservas · Pedidos online · **App propia** (en camino) · **Llamadas con IA** (en camino) · Clientes y fidelización · Web y presencia en Google |
| **Gestión del negocio** | Ventas, compras, stock, facturas y horas de tu equipo en el mismo sitio | Backoffice e informes · **ERP** (en camino) · Equipo y RRHH |
| **Equipamiento y servicios** | Hardware, placas QR y puesta en marcha: te lo dejamos funcionando | Hardware · Placas QR para mesas · Puesta en marcha |

- «Informes» dejó de ser producto: es parte de **Backoffice e informes** (decisión del 16-11-2026).
- El chip **«En camino»** va solo en lo que depende de terceros o de ramas sin desplegar (app
  propia, llamadas con IA, ERP) y en las integraciones no hechas. El resto se presenta como
  «Disponible desde el lanzamiento con los primeros locales» (`/novedades`).
- Origen técnico (solo en documentación, nunca en la web): ERP y RRHH parten de GestiTec con marca
  alaCarta; las llamadas con IA necesitan un proveedor de voz. Ver `docs/ROADMAP.md`.

## 4. A quién nos dirigimos

**Cliente principal**: propietario o gerente de un local independiente o de un grupo pequeño
(1-15 locales) con servicio en mesa o mostrador, que mantiene varias herramientas sueltas o que
abre un local nuevo.

**Sectores** (mismo sistema, configuración distinta; `src/data/sectors.ts`): restaurantes, bares,
cafeterías, pizzerías, hamburgueserías, cervecerías, pubs y coctelerías, take away y delivery,
grupos y cadenas. Cada sector tiene una **configuración recomendada** con precio calculado por el
configurador. Primer foco comercial: restaurantes y bares (volumen) y grupos pequeños (valor).

**Momentos de compra** (`src/data/moments.ts`, `/momentos/*`): abrir un local, cambiar de TPV,
dejar de pagar comisiones. Además: segundo local (→ grupos) y presión normativa (VeriFactu y
registro de jornada, cubiertos con guías con fecha de revisión).

**No cliente por ahora**: grandes cadenas con integraciones pesadas, hoteles con PMS, franquicias
con central de compras.

## 5. Modelo comercial

Precios orientativos sin IVA, por local y mes. Detalle y justificación en `docs/PRECIOS.md`.

| Pieza | Qué es | Precio |
| --- | --- | --- |
| **Esencial** | TPV, carta QR, backoffice e informes | 49 € |
| **Completo** | Esencial + comandero, cocina, reservas, pedidos online y clientes | 99 € |
| **Total** | Completo + app propia, llamadas con IA (200 min), ERP (1 empresa) y Equipo y RRHH | 159 € (por separado saldría a 200 €) |
| **Grupos** | Total en cada local + carta maestra, a partir de 3 locales | a medida |
| Anual | −15 % sobre la cuota del plan | Esencial 42 €, Completo 84 €, Total 135 € |

**Complementos** con precio público sobre cualquier plan: app propia 19 €/local · llamadas con IA
29 €/local con 200 minutos y 0,12 €/minuto extra · Equipo y RRHH 24 €/local hasta 20 personas y
1 €/persona más · ERP 29 €/empresa · web y presencia en Google 24 €/mes + 390 € de alta. Los
cuatro primeros van dentro del Total.

**Módulos sueltos** sobre el Esencial (comandero, cocina, reservas, pedidos online, clientes) y
**dispositivos adicionales** (terminal 12 €, comandero 8 €, pantalla 12 €).

**Equipamiento** a presupuesto («en tu propuesta»), con kits orientativos y siempre la opción de
usar el equipo propio. **Servicios**: puesta en marcha remota incluida; presencial desde 290 €;
migración a medida.

**0 % de comisión** por reserva, pedido o pago QR: es la bandera. Los minutos de IA son coste de uso,
no comisión, y se dice así.

**Configurador «Monta tu alaCarta»** (`/precios#monta`): el visitante marca lo que necesita como
en una carta y el ticket le dice qué camino le sale más barato (Esencial con sueltos, Completo o
Total), cuánto ahorra pagando el año y qué va en la propuesta. La configuración viaja al formulario.

**Métricas a vigilar**: MRR por local, mezcla de planes (peso del Total), complementos por local,
coste de adquisición por puerta del embudo, tiempo de puesta en marcha, churn, tickets de soporte.

## 6. Locales fundadores

Decisión del 16-11-2026 (`/locales-fundadores`): **20 plazas reales**, sin cuentas atrás ni
contadores. Condiciones: **precio bloqueado** mientras siga la suscripción, **puesta en marcha
presencial incluida** (sin descuento en la cuota) y **línea directa con producto**. A cambio: que lo
usen de verdad en servicio, que cuenten qué falla y paciencia con lo que está en camino. Se busca
variedad de sectores y locales a los que se pueda ir en persona (zona por definir). Entran con
`motivo=fundador` por el mismo formulario.

Es el sustituto honesto de la prueba social que todavía no existe: demos, transparencia de estado
(`/novedades`), fundadores y, cuando haya datos, la cara del equipo.

## 7. Embudo: cuatro puertas, un formulario

| Puerta | Para quien | Dónde | Conversión |
| --- | --- | --- | --- |
| **Probar** | Quiere verlo funcionar sin hablar con nadie | `/demo` (simulador, cambio de canales), `/demo/carta` (QR escaneable), demos en cada producto | Siguiente paso: demo con su carta |
| **Calcular** | Quiere saber cuánto cuesta o cuánto pierde | Configurador en `/precios#monta`, calculadora de comisiones, comprobador de equipo, placa QR | «Recibir esta propuesta» con la configuración |
| **Te llamamos** | No quiere rellenar ni agendar | `/solicitar-demo?modo=llamada` (nombre, teléfono, franja), barra móvil | Llamada en la franja elegida |
| **Demo** | Está decidiendo | `/solicitar-demo` en 3 pasos | Videollamada de 30 minutos y propuesta por escrito |

Reglas: todo CTA lleva contexto (`origen`, `modulo`, `sector`, `config`…) y el formulario lo
arrastra hasta el lead; `/gracias` explica qué pasa ahora y dispara el evento de conversión;
atribución propia sin cookies. Detalle técnico en `docs/ARQUITECTURA.md`.

Captación: SEO por producto, sector, momento y guía; gestorías y asesorías como prescriptores
(`/contacto`); instaladores y distribuidores para lo presencial (más adelante); boca a boca desde
los fundadores.

## 8. Tono

- **Concreto**: cada frase dice qué hace el producto o qué gana el local.
- **En lenguaje de local**: comanda, pase, marchar, arqueo, ronda, mitades.
- **Directo y elegante**: frases cortas, sin exclamaciones. Español de España, tuteo.
- **Honesto**: lo que no existe lleva «En camino» o se dice que no se hace («no calcula nóminas»,
  «la IA no toma pedidos a domicilio»). Sin testimonios ni cifras inventadas. Nunca se nombran en
  la web las marcas técnicas de origen.

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
| --- | --- |
| El producto aún no existe y la web promete un ecosistema | Estado por producto en datos, chip «En camino», `/novedades`, demos con restaurante ficticio declarado, fundadores |
| Prometer integraciones que no están | Conexiones con estado propio en `solutions.ts` e `integrations.ts`; discontinuas en los diagramas |
| Dependencia de terceros (voz IA, marca blanca del ERP/RRHH, hardware) | Precio y página publicados como «en camino» o «en tu propuesta»; nada con fecha inventada |
| Suelo de precio percibido (34-35 €) | Esencial a 49 € ya útil; comparativa «por piezas» con fuentes; Total como ancla |
| Normativa cambiante (VeriFactu, registro de jornada) | Guías con fecha de revisión; nunca «certificado» ni «cumplimiento garantizado» |
| Soporte que el sector espera 365 días | Prometer solo «24 h laborables» hasta definir horario real |
