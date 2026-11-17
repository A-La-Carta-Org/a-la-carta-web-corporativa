# 01 · Estrategia: de "9 módulos" a "un ecosistema que funciona"

**Estado:** pendiente de validación por Jordi · **Prioridad:** 0 (todo lo demás cuelga de aquí)

## 1. El cambio de planteamiento

La web actual vende **un software de sala** (TPV + módulos) con un buen argumento: "una carta, un
dato, un cambio". La empresa que se quiere vender ahora es más grande:

> **alaCarta es el ecosistema que hace funcionar un restaurante: lo que pasa en la sala, lo que
> entra por el teléfono y el móvil del cliente, lo que pasa en la oficina y el equipo, y el
> equipamiento para que todo arranque. Todo conectado, con una cuota y un solo interlocutor.**

Tres consecuencias:

1. **El producto no es el TPV, es la conexión.** Cada página debe enseñar *con qué se conecta* lo
   que vende, y la web debe **demostrarlo** (demos vivas) en vez de afirmarlo.
2. **alaCarta vende software, equipamiento y servicio**, pero con una lógica única: "te lo
   dejamos funcionando". La decisión anterior de no vender hardware ni webs (heredada del análisis
   de Ofasty) se revisa: el problema de Ofasty no era vender servicios, era venderlos **sueltos y
   sobre la plataforma de otro**. Aquí todo cuelga de un sistema propio.
3. **El embudo se amplía**: además de "pide una demo", el visitante puede *probar* (demos), *calcular*
   (configurador, calculadora de comisiones) y *pedir que le llamen*. Cuatro puertas, un formulario.

## 2. Posicionamiento

| | |
| --- | --- |
| **Para** | propietarios y gerentes de 1 a 15 locales de hostelería |
| **Que** | pagan 4-7 herramientas sueltas, comisiones por sus propios clientes, y no ven el negocio entero |
| **alaCarta es** | el ecosistema de gestión para hostelería |
| **Que** | conecta sala, cocina, canales propios, gestión y equipo en un solo sistema, con una cuota fija, sin comisiones y llave en mano |
| **A diferencia de** | TPV con módulos de terceros (integraciones que se rompen y cada una cobra), o suites caras y opacas |
| **Porque** | un mismo dato (carta, mesa, cliente, venta, empleado) alimenta todo, y la web lo enseña funcionando |

**Mensaje principal (hero):** "Todo tu restaurante, en un solo sistema."
**Mensajes de apoyo**, uno por familia:

- Servir mejor: *la comanda sale de la mesa y llega a cocina y a caja sin que nadie la copie.*
- Vender más, sin comisiones: *tus reservas, tus pedidos, tu app y tu teléfono, con tu marca y sin
  pagar por cada cliente.*
- Controlar el negocio: *ventas, compras, stock, facturas y horas de tu equipo en el mismo sitio.*
- Empezar sin líos: *hardware, placas QR, web y formación: te lo dejamos funcionando.*

**Palabras**: "ecosistema" se usa en titulares de marca (home, /soluciones, por qué) y en el resto
se habla en lenguaje de local. "Todo en uno" está saturado en el mercado: evitarlo como claim.

## 3. Las familias del ecosistema (y el destino de cada pieza de la lista de Jordi)

| Familia | Producto (nombre en la web) | Slug | Origen técnico | Estado real hoy |
| --- | --- | --- | --- | --- |
| **Servicio en sala y cocina** | TPV | `/soluciones/tpv` | alaCarta (por construir) | Diseño |
| | Comandero | `/soluciones/comandero` | alaCarta | Diseño |
| | Pantalla de cocina | `/soluciones/cocina` | alaCarta | Diseño |
| | Carta digital QR (pedido y pago en mesa) | `/soluciones/carta-qr` | alaCarta | Diseño |
| **Clientes y canales** | Reservas | `/soluciones/reservas` | alaCarta | Diseño |
| | Pedidos online (take away y reparto propio) | `/soluciones/pedidos-online` | alaCarta | Diseño |
| | **App propia** (reservas y pedidos con tu marca) | `/soluciones/app-propia` | alaCarta (PWA) | Nuevo |
| | **Llamadas con IA** | `/soluciones/llamadas-ia` | Proveedor de voz por decidir + herramientas alaCarta | Nuevo; en Ofasty el agente era de Beply |
| | Clientes y fidelización | `/soluciones/clientes` | alaCarta | Diseño |
| | **Web y presencia en Google** | `/soluciones/web-para-restaurantes` | Servicio alaCarta | Nuevo (Ofasty lo vendía) |
| **Gestión del negocio** | **Backoffice e informes** (fusiona "Gestión" e "Informes") | `/soluciones/backoffice` | alaCarta | Diseño |
| | **ERP**: compras, proveedores, stock, facturación, tesorería, contabilidad | `/soluciones/erp` | GestiTec Negocio con tema alaCarta | Construido en rama, **sin desplegar**; sin integración TPV |
| | **Equipo y RRHH**: fichaje, turnos, vacaciones, nóminas para la gestoría | `/soluciones/rrhh` | GestiTec Personal con tema alaCarta | **En producción** (GestiTec); marca blanca por hacer |
| **Equipamiento y servicios** | **Hardware** (kits y dispositivos) | `/hardware` | Proveedor a decidir | Nuevo |
| | **Placas QR para mesas** (QR + NFC) | `/hardware/placas-qr` | Proveedor/impresión a decidir | Nuevo |
| | **Puesta en marcha** (migración, configuración, formación, estrategia local) | `/puesta-en-marcha` | Servicio alaCarta | Nuevo como página |

### Sobre "informes" (la duda de Jordi)

Recomendación: **"Informes" deja de ser un producto y pasa a ser una capacidad del Backoffice**.
El hostelero no compra informes; compra "ver cómo va el negocio". Reparto claro:

- **Backoffice e informes** (alaCarta): todo lo operativo y lo que sale del servicio — carta,
  precios, mesas, dispositivos, usuarios, escandallos y coste por plato, stock de cocina consumido
  por receta, ventas en tiempo real, cierre diario, comparativas entre locales.
- **ERP** (GestiTec Negocio): todo lo administrativo y económico — proveedores, pedidos de compra y
  recepciones, facturas de proveedor y gastos, almacén valorado, facturas a empresas, tesorería y
  bancos, contabilidad y modelos de IVA, acceso de la gestoría.
- **Equipo y RRHH** (GestiTec Personal): personas, horas y documentos.

La frontera la marca el usuario: el gerente vive en el Backoffice; la administración y la gestoría
viven en el ERP. **Los informes de coste de personal sobre ventas** (lo que de verdad pide el sector)
son el gran argumento del ecosistema: ventas por hora del TPV + horas fichadas de RRHH = "a qué hora
te sobra o te falta gente". Hay que construir esa integración para poder decirlo; mientras tanto, se
cuenta como "en camino".

## 4. Honestidad sobre el estado (regla nueva y obligatoria)

Hoy **nada del TPV existe** y la web lo cuenta en `/por-que-alacarta`. Con 16 productos, la
honestidad tiene que ser estructural, no un párrafo:

- Campo `status` en cada producto: `disponible` · `piloto` (con locales fundadores) · `en-camino`
  (con trimestre si se conoce). Se muestra como chip pequeño en menú, tarjetas y hero del producto
  **solo si no es `disponible`**.
- Las integraciones que no existen (TPV → ERP, fichaje desde el TPV, ventas por hora vs horas
  trabajadas, agregadores) se marcan "en camino" dentro de la sección "Conectado" de cada página.
- **Prohibido** según el informe de GestiTec: decir "VeriFactu certificado/listo", "escandallos en
  el ERP", "calcula nóminas", "app nativa en las tiendas", "biometría", "TicketBAI", "cumplimiento
  legal garantizado", "pedidos a domicilio por teléfono con IA", idiomas de la IA sin confirmar.
- **La palabra GestiTec no aparece en la web de alaCarta.** ERP y RRHH son "de alaCarta". Requisito
  técnico previo: variante de build con marca alaCarta (tokens, logos, manifiesto PWA, nombre de
  marca en i18n, correos, dominio). GestiTec Central no distingue marcas: decisión pendiente.
- Página `/novedades` (o sección en por qué) con lo que hay, lo que está en piloto y lo que viene:
  convierte la falta de producto en transparencia.

## 5. Mapa de URLs propuesto

```
/                                   Home (03)
/soluciones                         Hub del ecosistema con mapa interactivo (04)
/soluciones/tpv · comandero · cocina · carta-qr                     (05)
/soluciones/reservas · pedidos-online · app-propia · llamadas-ia
           · clientes · web-para-restaurantes                       (06)
/soluciones/backoffice · erp · rrhh                                 (07)
/hardware · /hardware/placas-qr · /puesta-en-marcha                 (08)
/precios  (planes + configurador "Monta tu alaCarta")               (09)
/demo · /demo/carta                 Demos interactivas (10)
/solicitar-demo · /gracias · /contacto                              (11)
/sectores + 9 sectores                                              (12)
/momentos/abrir-un-local · cambiar-de-tpv · dejar-las-comisiones    (12)
/herramientas/calculadora-comisiones                                (13)
/recursos · guias · preguntas-frecuentes · ayuda                    (13)
/por-que-alacarta · /locales-fundadores · /novedades                (13)
/legal/*                                                             (13)
```

Cambios de slug (sin coste: la web no está publicada): `pedidos` → `pedidos-online`, `gestion` +
`informes` → `backoffice`. Sin redirecciones necesarias; el comprobador de enlaces lo valida.

## 6. Modelo comercial (marco; cifras en 09)

- **Software por local**: Esencial · Completo · **Total** (nuevo: Completo + ERP + RRHH + app propia
  + llamadas con IA con minutos incluidos). Grupos a medida.
- **Complementos** con precio público: app propia, llamadas IA (cuota + minutos), ERP (por
  empresa), RRHH (por local con tramo de empleados), web y presencia local (alta + cuota).
- **Equipamiento** a presupuesto con kits orientativos; "usa el tuyo" siempre como opción.
- **Servicios**: puesta en marcha remota incluida; presencial y migración con precio.
- **0 % de comisión** sigue siendo la bandera. Los minutos de IA no son comisión (coste de uso), y se
  dice así.

## 7. Embudo (marco; detalle en 11)

| Etapa | Qué busca el visitante | Qué le damos | Conversión |
| --- | --- | --- | --- |
| Descubrir | "TPV bar", "software restaurante", "cómo abrir un restaurante", "comisiones glovo" | Páginas de solución, sector, momento, guías, calculadora | Siguiente clic, calculadora |
| Considerar | ¿Funciona de verdad? ¿Cuánto cuesta todo? | Demos vivas, carta QR escaneable, configurador, hardware, puesta en marcha | Configuración enviada por correo, "te llamamos" |
| Decidir | ¿Me lo montáis? ¿Me podéis migrar? | Demo con persona, propuesta cerrada, locales fundadores | Solicitud de demo |
| Después | ¿Y ahora qué? | `/gracias` con pasos, demo interactiva, guía de preparación | Asistir a la demo |

Regla: **todo CTA lleva contexto** (`?origen=`, `?modulo=`, `?sector=`, `?config=`) y el formulario
lo arrastra hasta el lead.

## 8. Competencia: lo que cambia con el ecosistema

(Resumen; detalle en `docs/investigacion/` y en el informe de ecosistema y embudo de esta auditoría.)

- Last.app ya vende TPV + delivery + reservas + fichaje + IA, pero cobra comisiones en QR y online,
  500 € de instalación y el KDS aparte. Su menú es "Productos · Tipo de negocio · Integraciones".
- Revo/Cegid tiene ecosistema completo pero solo iPad, precio opaco y web absorbida por Cegid.
- Nadie en España une **TPV + ERP contable + RRHH + IA telefónica + web** con marca propia y precio
  público. Ese es el hueco: *el ecosistema completo con precio público*.
- Nadie enseña en su web una demo jugable que conecte sala, cocina y caja. Ofasty sí tenía TPV
  jugable y llamada "leída"; se reimplementa mejor y conectado.

## 9. Decisiones que necesita Jordi (bloquean partes de la implementación)

1. ¿Aprobado el mensaje "Todo tu restaurante, en un solo sistema" y el uso de "ecosistema"?
2. ¿Se fusiona Informes en Backoffice como propone el punto 3?
3. Estado real que se publica de cada producto (`status`) y trimestres.
4. Proveedor del agente de voz de IA (¿Beply como socio, otro proveedor, propio?).
5. ¿Programa de locales fundadores? Condiciones y nº de plazas.
6. Precios de los complementos nuevos y del plan Total (propuesta en 09).
7. Proveedor de hardware y de placas QR; ¿se publican precios de kits?
8. Teléfono comercial para "te llamamos" y para la demo de llamada IA.
9. Marca blanca de GestiTec: plazo para tener ERP y RRHH con marca alaCarta.
