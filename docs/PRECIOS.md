# Precios: estrategia y propuesta

**Estado**: propuesta orientativa de lanzamiento (16 de noviembre de 2026). Las cifras viven en
`src/data/pricing.ts` y la web las marca como orientativas. Deben confirmarse antes de la salida
comercial (ver `TODO.md`).

## 1. Referencias de mercado (hechos recogidos en `investigacion/`)

| Competidor         | Entrada                               | Observaciones                                              |
| ------------------ | ------------------------------------- | ---------------------------------------------------------- |
| Ágora              | 34 €/mes/establecimiento (Basic)      | Sin hardware ni servicios; Professional 90 €               |
| Last.app           | 50 €/mes/local (anual) + 500 € instalación | KDS 35 €/mes aparte; QR/online 4 % + 0,20 €/venta     |
| Qamarero           | 99-119 €/mes (Basic) hasta 208 € (Total) | Implantación 200-500 €                                  |
| Haddock            | 149 € / 299 €/mes                      | Backoffice y control de costes                             |
| Square             | 0 €/mes (+1,25 % + 0,05 € por pago); Plus 59 € | Modelo de comisiones por pago                      |
| SumUp              | 0 €/mes + terminal 249 €; TPV Plus 49 €/mes | Comisiones 1,49 % / 0,75 %                          |
| Otter (UE)         | 34 / 49 / 89 €/mes por local           | Agregador convertido en TPV                                |
| Lightspeed         | 89 / 159 / 249 €/mes + 49 € por caja   | Comisiones y hardware no públicos                          |
| Ofasty (referencia)| 28,89 €/mes (Beply + TPV)              | Módulos de 3,90 a 8,90 €; comisiones por uso en app        |

Conclusiones:

- Hay un **suelo percibido de 34-35 €/mes** y un **tramo medio de 50-120 €** donde se vende la
  mayoría.
- El coste real está **fragmentado en todos los casos**: instalación, KDS aparte, comisiones,
  hardware. Nadie ofrece un precio completo y claro en el tramo de 60-100 €.
- Las comisiones por reserva/pedido/QR son habituales y generan rechazo.

## 2. Principios de la propuesta

1. **Por local**, no por usuario: el hostelero entiende "cuánto me cuesta este local".
2. **Dos planes públicos y uno a medida**. Pocos planes, fáciles de comparar.
3. **El plan base ya es útil**: TPV + carta QR + backoffice + informes. Nada de un "básico" que no
   sirve para trabajar.
4. **El plan Completo lo incluye todo**: evita la sensación de "módulos sorpresa" que la
   investigación detecta en la competencia.
5. **Módulos sueltos sobre el Esencial**, para quien solo necesita una cosa más.
6. **Dispositivos por unidad**, baratos, sin permanencia, activables por temporada.
7. **0 % de comisiones**: cuota fija. Es el argumento comercial más claro frente a Last.app, TheFork,
   Square o los agregadores.
8. **Puesta en marcha remota incluida**; lo presencial se paga (es coste real y filtra).
9. **Sin permanencia** mensual; **−15 % anual** (Ofasty 20 %, Last "un mes gratis" ≈ 8 %; 15 % es
   un punto medio que no regala demasiado margen).
10. **14 días de prueba sin tarjeta**: suficiente para configurar la carta y hacer un servicio.

## 3. Propuesta (precios sin IVA, por local y mes)

### Planes

| Plan     | Mensual | Anual (equiv./mes) | Para quién                                       |
| -------- | ------- | ------------------ | ------------------------------------------------ |
| Esencial | 49 €    | 42 €               | Cobrar bien, carta al día, ver los números        |
| Completo | 99 €    | 84 €               | Servicio en mesa, cocina y canales propios        |
| Grupos   | a medida (≥ 3 locales) | —       | Carta maestra, multiempresa, API, gestor de cuenta |

**Esencial incluye**: TPV (1 terminal), carta QR con pedido desde la mesa, backoffice (carta,
precios, usuarios), informes y cierre diario, 3 usuarios, facturación preparada para VeriFactu,
soporte por correo y chat.

**Completo incluye** lo anterior más: comandero (3 dispositivos), pantalla de cocina (1),
reservas, pedidos online, clientes y fidelización, inventario y escandallos, usuarios ilimitados,
soporte prioritario.

**Grupos**: todo lo del Completo en cada local + carta maestra con variantes, multiempresa, roles
centralizados, informes comparativos, API e integraciones, gestor de cuenta y acuerdo de servicio.
Se presupuesta por local con descuento por volumen (orientación interna: Completo −15 % a −30 %
según número de locales).

### Módulos sueltos sobre Esencial

| Módulo                   | €/mes | Nota                        |
| ------------------------ | ----- | --------------------------- |
| Comandero                | 19    | Incluye 2 dispositivos      |
| Pantalla de cocina       | 19    | Incluye 1 pantalla          |
| Reservas                 | 19    | Sin comisión por comensal   |
| Pedidos online           | 29    | Sin comisión por pedido     |
| Clientes y fidelización  | 19    |                             |

Esencial + todos los módulos = 154 €: el Completo (99 €) sale claramente a cuenta a partir del
tercer módulo, que es la lógica buscada.

### Dispositivos adicionales

| Dispositivo                    | €/mes |
| ------------------------------ | ----- |
| Terminal TPV adicional         | 12    |
| Comandero adicional            | 8     |
| Pantalla de cocina adicional   | 12    |

### Servicios

| Servicio                 | Precio          |
| ------------------------ | --------------- |
| Puesta en marcha remota  | Incluida        |
| Formación presencial     | desde 290 € + desplazamiento |
| Migración de datos       | A medida        |

## 4. Ejemplos de cuenta

| Caso                                              | Cálculo                                    | Total/mes |
| ------------------------------------------------- | ------------------------------------------ | --------- |
| Bar con 1 TPV y carta QR                          | Esencial                                   | 49 €      |
| Cafetería con TPV, QR y puntos                    | Esencial + Clientes                         | 68 €      |
| Restaurante con 2 TPV, 4 comanderos, cocina, reservas | Completo + 1 TPV + 1 comandero          | 119 €     |
| Pizzería con pedidos online y cocina               | Esencial + Pedidos + Cocina                 | 97 € (→ Completo 99 €) |
| Grupo de 4 restaurantes                           | Grupos: 4 × Completo con −20 %              | ≈ 317 €   |

Frente a Last.app (50 € + KDS 35 € + 500 € instalación + 4 % en QR/online) o Qamarero (99-208 €), el
restaurante del ejemplo paga menos y sin comisiones. Frente a Ágora Basic (34 €), el Esencial
cuesta 15 € más pero incluye carta QR, backoffice completo e informes.

## 5. Qué se enseña públicamente y qué no

**Público (en `/precios`)**: los dos planes con precio, el plan Grupos "a medida", la tabla módulo a
módulo, módulos sueltos, dispositivos, servicios con "incluida / desde / a medida", las cuatro
promesas de cero comisiones, y la nota "tarifa orientativa de lanzamiento".

**Solo en propuesta (tras la demo)**: descuentos por volumen de Grupos, precio de migración,
condiciones de formación, acuerdos de servicio, condiciones para distribuidores.

**Interno (no publicar)**: márgenes objetivo, coste de infraestructura por local, descuentos
comerciales máximos, política de impagos.

## 6. Decisiones pendientes (ver TODO)

- Confirmar las cifras con un cálculo de costes por local cuando exista el producto.
- Decidir si el plan Esencial lleva 1 o 2 usuarios "de dispositivo" además de los 3 de backoffice.
- Decidir si se ofrece hardware certificado con margen (nunca obligatorio).
- Decidir el descuento anual definitivo (15 % propuesto).
- Fijar el precio de Grupos por tramos (3-5, 6-15, 16+ locales).
