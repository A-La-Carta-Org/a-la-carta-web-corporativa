# 07 · Familia "Gestión del negocio": backoffice e informes, ERP, equipo y RRHH

**Estado:** hecho (fase 2; demo D2 en la fase 4; precios de ERP y RRHH en la fase 5) · **Prioridad:** 2 · **Depende de:** 01 (decisión sobre informes), 04, 10 (D2)

Base factual: informe sobre GestiTec (16-11-2026). **GestiTec Personal** está en producción y es
completo. **GestiTec Negocio** (ERP) está construido en una rama, **sin desplegar**, pensado para
pymes de servicios, **sin integración con TPV ni escandallos**. Ninguna de las dos tiene marca
blanca: hay que crear una variante de build "alaCarta". La web **no menciona GestiTec**.

## Backoffice e informes · `/soluciones/backoffice` (fusiona `/gestion` + `/informes`)

- **H1**: "El panel desde el que ves y gobiernas el negocio."
- **Dos bloques** dentro de la página:
  1. *Configurar*: carta maestra, precios por canal, alérgenos, mesas y zonas, dispositivos e
     impresoras, usuarios y permisos, multilocal, registro de actividad.
  2. *Ver*: ventas en tiempo real, por producto/hora/camarero/canal, cierre diario al móvil,
     comparativa entre locales, exportación. Maqueta de informes actual.
- **Escandallos y coste por plato** se quedan aquí (no en el ERP): receta → coste → margen por
  plato, con stock de cocina descontado por venta. Es lo que más pide el sector (investigación B.3,
  B.9). Estado: del producto alaCarta, por construir.
- **Demo**: D2 "un cambio, todos los canales".
- **Conexiones**: con todo; en especial ERP (*en camino*: ventas y compras cruzadas para margen
  real) y RRHH (*en camino*: coste de personal sobre ventas por hora).
- Eliminar las páginas `/soluciones/gestion` e `/soluciones/informes`; actualizar enlaces, precios
  (tabla), sectores (`modules`) y FAQ.

## ERP · `/soluciones/erp` (NUEVA)

- **Nombre en la web**: "ERP para hostelería" en SEO; en el menú "ERP: compras, stock y
  facturación".
- **H1**: "Compras, proveedores, facturas y contabilidad, sin salir de alaCarta."
- **Para quién**: el propietario que lleva la administración, el grupo con varias sociedades, y la
  **gestoría** (acceso gratuito: argumento de canal de prescripción ya previsto en negocio).
- **Qué hace** (solo lo implementado en Negocio, según el informe):
  - Proveedores y contactos con su fiscalidad; pedidos de compra y recepciones; facturas de
    proveedor y gastos recurrentes.
  - Almacenes, movimientos, traspasos entre locales, recuentos, valoración a coste medio, stock
    mínimo.
  - Facturas a empresas (presupuesto → pedido → albarán → factura; simplificadas y rectificativas).
  - Tesorería: cuentas, extractos bancarios (Norma 43), conciliación, remesas SEPA, previsión.
  - Contabilidad: plan general, asientos automáticos, libros, cierre; libros de IVA y modelos 303,
    111 y 347.
  - Acceso para la gestoría, exportación, auditoría.
- **No decir**: VeriFactu "listo/certificado" (no probado con la AEAT), lectura automática de
  facturas (OCR apagado), Facturae "validado en FACe", "del ticket a la contabilidad" (no hay
  integración aún). Lo que sí: "preparado para la factura electrónica" con matiz.
- **Conexión con el TPV** (la razón de que sea *ecosistema*): resumen diario de ventas → asiento;
  facturas a empresa emitidas desde el TPV; compras → coste de escandallo. **Todo "en camino"**
  hasta que exista. Mostrarlo en el diagrama con línea discontinua.
- **Estado del producto**: `piloto` o `en-camino` hasta que Negocio esté desplegado con marca
  alaCarta.
- **Maqueta nueva**: `MockErp` (facturas de proveedor + stock) con el lenguaje visual de alaCarta
  (no el de GestiTec).
- **Precio**: complemento por empresa/sociedad, incluido en Total (09).

## Equipo y RRHH · `/soluciones/rrhh` (NUEVA)

- **Nombre**: "Equipo y RRHH". SEO: "control horario hostelería", "fichaje restaurante",
  "cuadrante de turnos restaurante" (hipótesis de buen volumen; verificar).
- **H1**: "Fichajes, turnos y vacaciones de tu equipo, sin papeles ni grupos de WhatsApp."
- **Problema** (con fuentes de la investigación): rotación del 63,8 %, coste de reemplazo
  2.800-5.000 €, personal > 45 % de la facturación en muchos locales; **registro de jornada
  obligatorio** desde 2019 (RDL 8/2019). El real decreto de registro **digital** no está aprobado
  ni publicado a 16-11-2026 (dictamen desfavorable del Consejo de Estado, dos aplazamientos): decir
  "preparado para el registro digital" y nunca "ya obligatorio". Fecha de revisión visible.
- **Qué hace** (todo implementado en Personal):
  - Fichaje desde el móvil (también sin cobertura) o en una **tablet en la entrada con PIN**,
    geocerca opcional; registro inmutable con rastro de correcciones.
  - Cuadrante de turnos, publicación, intercambios entre compañeros, turnos abiertos, descansos y
    reglas de jornada.
  - Vacaciones y ausencias con aprobación, cobertura mínima, festivos y calendarios.
  - Horas extra y bolsa de horas; cierre mensual firmado; registro exportable para inspección.
  - Variables del mes para la gestoría y reparto de nóminas en PDF (**no calcula nóminas**).
  - Documentos con firma, comunicación interna, canal de denuncias, formación y PRL.
  - Acceso para gestoría.
- **Conexión ecosistema**: fichar desde el TPV (*en camino*: existe el contrato de integración en
  Personal; falta el lado TPV); coste de personal por hora frente a ventas (*en camino*); ventas por
  camarero.
- **No decir**: cumplimiento legal garantizado, biometría, app en tiendas, cálculo de nóminas.
- **Estado**: el más maduro del ecosistema → candidato a `disponible` en cuanto exista la marca
  alaCarta. **Puede venderse ya suelto** a locales que no cambian de TPV: puerta de entrada al
  ecosistema (decisión de negocio).
- **Maqueta nueva**: `MockRrhh` (cuadrante semanal con turnos de sala/cocina y fichajes del día).
- **Precio**: complemento por local con tramo de empleados (09).

## Criterios de aceptación

- [x] `backoffice` sustituye a `gestion` e `informes` en datos, rutas, enlaces y tabla de precios.
- [x] Páginas ERP y RRHH con plantilla 04, maquetas nuevas y estado honesto.
- [x] Ninguna afirmación prohibida (01 §4); integraciones con línea discontinua y chip.
- [x] `npm test` verde, capturas revisadas.

## Notas de implementación · datos (fase 1, 16-11-2026)

Solo datos y copy base en `src/data/solutions.ts`; las páginas se completan en la fase 2, así que
los criterios de este documento siguen sin marcar.

- `backoffice` sustituye a `gestion` e `informes` en datos, rutas, tabla de precios, sectores y
  guía; FAQ fusionadas (5). Escandallos se quedan aquí.
- `erp` (en camino): solo lo implementado según el informe; integraciones con TPV, backoffice y
  cocina "en camino"; FAQ honestas (sin VeriFactu certificado, sin OCR, sin "del ticket a la
  contabilidad"). No se menciona el acceso gratuito de la gestoría (no confirmado).
- `rrhh` (disponible, decisión de Jordi): registro de jornada obligatorio desde 2019 y RD digital
  no publicado a 16-11-2026; "no calcula nóminas", sin biometría; integraciones en camino.
- Ninguna mención a GestiTec.

## Notas de implementación (fase 2 · páginas, 17-11-2026)

- Backoffice: «Qué hace» en dos bloques, **Configurar** (carta maestra y precios por canal,
  escandallos, mesas/dispositivos/impresoras, usuarios y registro) y **Ver** (ventas en tiempo
  real, cierre diario, varios locales, exportación), con `featureGroups`. La demo D2 «un cambio,
  todos los canales» llega en la fase 4: hasta entonces no hay «Pruébalo» en esta página.
- Maquetas nuevas: `MockErp` (facturas de proveedor con estado, compras del mes, pendiente de pago,
  bajo mínimo y valor del almacén a coste medio) y `MockRrhh` (cuadrante semanal publicado de
  sala, barra y cocina con el día de hoy marcado, libres y vacaciones, y fichajes de hoy por móvil
  o tablet con PIN). Proveedores y personas inventados como ejemplo de interfaz; lenguaje visual
  de alaCarta.
- ERP y RRHH con bloque «Pensado para» (`forWho`): propietario, grupos con varias sociedades y
  gestoría; RRHH con «Quien no quiere cambiar de TPV» (se vende suelto).
- RRHH con datos del sector: rotación 63,8 % (Randstad Research, 2026), reemplazo 2.800–5.000 €
  (Randstad Research y Linkers) y registro de jornada desde 2019 con «registro digital todavía no
  aprobado» y fecha de revisión (16-11-2026). No se publica el «45 % de la facturación».
- ERP sigue `en-camino`; todas sus conexiones con línea discontinua y chip. Sin acceso gratuito
  de la gestoría (no confirmado). Precio: «En tu propuesta», por empresa (ERP) y por local según
  el equipo (RRHH) hasta la fase 5.
