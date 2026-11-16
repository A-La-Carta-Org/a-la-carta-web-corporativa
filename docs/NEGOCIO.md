# Negocio: propuesta de valor, posicionamiento y modelo

## 1. Qué es alaCarta

**alaCarta es una plataforma integral de gestión para hostelería.** Un solo sistema que reúne el
servicio (TPV, comandero, cocina, carta QR, reservas, pedidos) y la gestión (backoffice, informes,
clientes, inventario, facturación) para restaurantes, bares, cafeterías, pizzerías,
hamburgueserías, cervecerías, pubs, coctelerías, negocios de take away y delivery, y grupos con
varios locales.

No es un catálogo de soluciones, ni una capa sobre el software de otro. Es software propio con su
backoffice, su modelo de datos, sus clientes y su facturación.

## 2. Propuesta de valor

**Principal**: *Sala, cocina, pedidos y gestión. Un solo sistema.*

**Secundarias** (las que se repiten por la web):

- Controla pedidos, sala, cocina y ventas en un solo sistema.
- Una carta, un dato, un cambio: lo que cambias en el backoffice cambia en todos los canales.
- Precio claro, sin comisiones: cuota fija por local, 0 % por reserva, pedido o pago QR.
- Funciona con lo que tienes: tablets, móviles, equipos táctiles e impresoras estándar.
- Hecho para muchas horas: interfaz clara, legible con prisa y con poca luz.
- Adaptado a tu tipo de local: mismo sistema, distinta configuración.
- Preparado para la normativa: VeriFactu, datos en la UE, exportación cuando quieras.

## 3. Diferenciadores frente al mercado

| Diferenciador                     | Por qué importa                                                                 | Evidencia en la investigación |
| --------------------------------- | ------------------------------------------------------------------------------- | ----------------------------- |
| Plataforma propia e integral      | El sector adopta herramientas "fragmentadas, sin integración" (Segittur, 2026)   | `investigacion/mercado-y-seo.md` |
| Precio público, simple y completo | Solo 4 competidores españoles publican precio; todos fragmentan el coste total   | `investigacion/competidores-espana.md` |
| 0 % de comisiones                 | Last.app cobra 4 % + 0,20 € en QR/online; TheFork cobra por comensal              | ambos informes |
| Hardware estándar, sin permanencia | Varios actores atan a terminales propietarios y contratos de 24-36 meses          | `competidores-internacionales.md` |
| Identidad monocroma y sobria      | Ningún competidor español es minimalista; todos usan la estética SaaS colorida    | `competidores-espana.md` |
| Web por flujo de servicio y por sector | Nadie estructura la propuesta como "reserva → mesa → comanda → cocina → cuenta → cierre" | conclusión propia |
| Honestidad sobre el estado        | Varias webs mezclan cifras contradictorias o módulos "próximamente" sin avisar    | ambos informes |

## 4. A quién nos dirigimos

**Cliente principal**: el propietario o gerente de un local independiente o de un pequeño grupo
(1-15 locales) con servicio en mesa o mostrador, que ya tiene un TPV y está cansado de mantener
varias herramientas, o que abre un local nuevo y quiere empezar bien.

**Segmentos** (misma plataforma, configuración distinta): ver `src/data/sectors.ts` y las páginas
`/sectores/*`. El primer foco comercial debe ser **restaurantes y bares** (volumen y búsquedas) y
**grupos pequeños** (mayor valor por cuenta y menos sensibilidad al precio).

**No cliente por ahora**: grandes cadenas con requisitos de integración pesados, hoteles con PMS,
franquicias con central de compras. Se atienden desde el plan Grupos a medida cuando el producto
madure.

## 5. Momentos de compra

1. **Apertura de un local**: necesita todo, decide rápido, valora la puesta en marcha.
2. **Cambio de TPV**: tiene un sistema que no evoluciona o caro; busca precio claro y migración.
3. **Segundo o tercer local**: descubre que su herramienta no es multilocal.
4. **Presión normativa**: VeriFactu (2027/2028) obliga a revisar el software de facturación.
5. **Canal propio**: quiere dejar de pagar comisiones por reservas y pedidos que ya eran suyos.

La web cubre 1, 2, 4 y 5 en la home, precios y guías; 3 en `/sectores/grupos-y-cadenas`.

## 6. Tono de comunicación

- **Concreto**: cada frase dice qué hace el producto o qué gana el local. Nada de "soluciones
  innovadoras que revolucionan".
- **En lenguaje de local**: comanda, pase, marchar, arqueo, ronda, mitades.
- **Directo y elegante**: frases cortas, verbo claro, sin exclamaciones.
- **Honesto**: lo que no existe se dice que está en el plan de producto. Sin testimonios ni cifras
  inventadas. La página `/por-que-alacarta` lo declara explícitamente.
- **Español de España**, tuteo.

## 7. Modelo de negocio

**Ingresos recurrentes por suscripción** (ver `PRECIOS.md` para cifras y justificación):

- Cuota mensual o anual **por local**, con dos planes públicos (Esencial, Completo) y uno a medida
  (Grupos).
- **Módulos sueltos** sobre el plan Esencial.
- **Dispositivos adicionales** por unidad (TPV, comandero, pantalla de cocina).
- **Servicios**: puesta en marcha remota incluida; formación presencial y migración de datos como
  ingresos puntuales.
- **Sin comisiones** sobre reservas, pedidos ni pagos: es un diferenciador y renuncia deliberada.
- Futuro: integraciones premium, API para grupos, pagos integrados con margen sobre la pasarela (si
  se negocia), hardware certificado con margen (opcional, nunca obligatorio).

**Costes principales**: desarrollo del producto, infraestructura (VPS → gestionado), soporte,
cumplimiento (VeriFactu, RGPD), marketing de captación.

**Métricas a vigilar**: MRR por local, coste de adquisición, tiempo de puesta en marcha, churn
mensual, locales por cuenta (expansión), tickets de soporte por local.

## 8. Canales de captación

1. **SEO** por solución y por sector (ya estructurado en la web) y guías normativas (VeriFactu).
2. **Demo** como conversión principal; prueba de 14 días como segundo paso.
3. **Asesorías y gestorías** como prescriptores (acceso de solo lectura para la asesoría).
4. **Distribuidores e instaladores locales** para la parte presencial (más adelante).
5. Boca a boca entre hosteleros una vez haya casos reales.

## 9. Riesgos y mitigaciones

| Riesgo                                     | Mitigación                                                              |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| Producto aún no existe; la web promete     | Web honesta sobre el estado; demo con prototipo; prueba solo cuando haya MVP |
| Suelo de precio percibido (34-35 €)        | Esencial a 49 € con QR, backoffice e informes incluidos; comparar coste total |
| Competidores con mucha más velocidad       | Foco en pocos sectores y en integración real, no en número de funciones |
| Dependencia de normativa cambiante         | Guía VeriFactu mantenida; cumplimiento en el núcleo, no como módulo     |
| Soporte 365 que el sector espera           | Definir horario real antes de prometerlo; empezar con "24 h laborables" |
