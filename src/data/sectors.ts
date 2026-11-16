/**
 * Los sectores (tipos de negocio). Una misma plataforma, configurada de forma distinta.
 * Cada sector enlaza con los módulos que más le aportan y explica sus problemas concretos.
 */
import type { SolutionSlug, Faq } from './solutions';

export type SectorSlug =
  | 'restaurantes'
  | 'bares'
  | 'cafeterias'
  | 'pizzerias'
  | 'hamburgueserias'
  | 'cervecerias'
  | 'pubs-coctelerias'
  | 'take-away-delivery'
  | 'grupos-y-cadenas';

export interface Sector {
  slug: SectorSlug;
  navLabel: string;
  name: string;
  /** Una línea para menús */
  tagline: string;
  /** H1 */
  title: string;
  seoTitle: string;
  description: string;
  intro: string;
  /** Lo que suele fallar en este tipo de local */
  pains: { title: string; text: string }[];
  /** Cómo lo resuelve la plataforma, en el mismo orden */
  answers: { title: string; text: string }[];
  /** Módulos recomendados, el primero es el que se enseña en el hero */
  modules: SolutionSlug[];
  faqs: Faq[];
}

export const sectors: Sector[] = [
  {
    slug: 'restaurantes',
    navLabel: 'Restaurantes',
    name: 'Restaurantes',
    tagline: 'Sala, cocina y reservas coordinadas en cada servicio.',
    title: 'Software para restaurantes que une la sala, la cocina y la gestión',
    seoTitle: 'Software para restaurantes: TPV, comandero, cocina y reservas',
    description:
      'Software de gestión para restaurantes: TPV, comandero, pantalla de cocina, reservas e informes en una sola plataforma. Para locales con servicio en mesa de cualquier tamaño.',
    intro:
      'Un restaurante con servicio en mesa vive de la coordinación: que la comanda llegue bien, que los tiempos cuadren y que la reserva de las 21:30 tenga mesa. alaCarta pone esas tres cosas en el mismo sistema.',
    pains: [
      {
        title: 'La comanda pasa por demasiadas manos',
        text: 'Libreta, barra, cocina. Cada paso es una oportunidad de error y un viaje que no sirve al cliente.',
      },
      {
        title: 'Cocina y sala no ven lo mismo',
        text: 'El pase pregunta qué falta, la sala pregunta cuánto queda. Nadie tiene la foto completa.',
      },
      {
        title: 'Las reservas van por su cuenta',
        text: 'Un cuaderno o una app aparte que no sabe qué mesas hay abiertas ni quién ha venido antes.',
      },
    ],
    answers: [
      {
        title: 'Comandero conectado a cocina',
        text: 'La comanda se envía desde la mesa a cada partida con sus notas. Sin libreta y sin intermediarios.',
      },
      {
        title: 'Pantalla de cocina con tiempos',
        text: 'Cocina marca lo que sale y la sala lo ve en el momento. Los retrasos se ven antes de que se quejen.',
      },
      {
        title: 'Reservas sentadas en el plano',
        text: 'La reserva ocupa su mesa en el TPV, con el historial del cliente a un toque.',
      },
    ],
    modules: ['tpv', 'comandero', 'cocina', 'reservas', 'informes'],
    faqs: [
      {
        q: '¿Sirve para un restaurante pequeño con un solo camarero?',
        a: 'Sí. Puedes empezar con el TPV y la carta QR y añadir el comandero o la cocina cuando el servicio lo pida. No hay un tamaño mínimo.',
      },
      {
        q: '¿Qué pasa con el menú del día?',
        a: 'Se configura una vez con sus primeros, segundos y postres, por días de la semana y franja horaria. El TPV, el comandero y la carta QR lo muestran solo cuando toca.',
      },
    ],
  },
  {
    slug: 'bares',
    navLabel: 'Bares',
    name: 'Bares',
    tagline: 'Cobrar rápido en barra y no perder una caña de la terraza.',
    title: 'Software para bares: rápido en barra, ordenado en terraza',
    seoTitle: 'Software TPV para bares: barra, terraza y cierre de caja',
    description:
      'TPV y comandero para bares: cobro rápido en barra, control de la terraza, tapas y raciones con modificadores, cierre de caja en minutos y carta QR sin comisiones.',
    intro:
      'En un bar el ritmo lo marca la barra. El TPV tiene que cobrar una caña en un toque y, a la vez, saber qué se ha servido en la mesa 4 de la terraza. alaCarta está hecho para las dos cosas.',
    pains: [
      {
        title: 'La barra no puede esperar',
        text: 'Cada segundo de más en un cobro es cola. Un TPV lento o con demasiados pasos se nota en caja.',
      },
      {
        title: 'La terraza se descontrola',
        text: 'Consumiciones apuntadas de memoria, mesas que se van sin pagar del todo, rondas que nadie recuerda.',
      },
      {
        title: 'El cierre de caja se eterniza',
        text: 'Contar, cuadrar y explicar diferencias a las dos de la mañana, sin saber de dónde vienen.',
      },
    ],
    answers: [
      {
        title: 'Botones directos y favoritos',
        text: 'Lo que más se vende, a un toque. Cobro rápido sin abrir mesa para la barra.',
      },
      {
        title: 'Mesas de terraza en el móvil',
        text: 'El camarero apunta en el comandero y la cuenta se acumula sola. Se cobra en la mesa o en barra.',
      },
      {
        title: 'Arqueo guiado',
        text: 'El cierre te dice qué debería haber en caja por forma de pago y señala las diferencias.',
      },
    ],
    modules: ['tpv', 'comandero', 'carta-qr', 'informes'],
    faqs: [
      {
        q: '¿Puedo cobrar sin abrir mesa?',
        a: 'Sí. El modo barra cobra directamente, y el modo sala abre mesas. Se cambia de uno a otro en el mismo TPV.',
      },
      {
        q: '¿Funciona con mi impresora de tickets actual?',
        a: 'Si es una impresora térmica de red o USB estándar, lo normal es que sí. Lo comprobamos antes de empezar.',
      },
    ],
  },
  {
    slug: 'cafeterias',
    navLabel: 'Cafeterías',
    name: 'Cafeterías',
    tagline: 'Desayunos, meriendas y para llevar sin colas en el mostrador.',
    title: 'Software para cafeterías: rapidez en el mostrador y control del día',
    seoTitle: 'TPV para cafeterías: mostrador, para llevar y fidelización',
    description:
      'TPV para cafeterías y panaderías-cafetería: cobro ágil en mostrador, modificadores de bebida, para llevar, programa de puntos digital e informes por franja horaria.',
    intro:
      'Una cafetería vende mucho en poco tiempo y repite clientes casi cada día. El sistema tiene que ser ágil a las ocho de la mañana y saber quién es el cliente que viene a diario.',
    pains: [
      {
        title: 'Picos de mañana',
        text: 'Veinte minutos en los que todo el mundo quiere su café a la vez. Cada paso de más en el TPV es cola.',
      },
      {
        title: 'Variantes infinitas',
        text: 'Con leche de avena, descafeinado, en vaso grande, para llevar. Si no se apunta bien, se hace mal.',
      },
      {
        title: 'Clientes fieles sin reconocer',
        text: 'Quien viene cada día merece algo más que una tarjeta de cartón con sellos.',
      },
    ],
    answers: [
      {
        title: 'Cobro en mostrador en dos toques',
        text: 'Productos favoritos, pago con tarjeta integrado y ticket opcional. Sin abrir mesa.',
      },
      {
        title: 'Modificadores claros',
        text: 'Cada bebida con sus opciones en pantalla, impresas en la etiqueta o en la pantalla de preparación.',
      },
      {
        title: 'Puntos digitales',
        text: 'El cliente acumula por cada compra desde su móvil y canjea en caja. Sin tarjetas físicas.',
      },
    ],
    modules: ['tpv', 'clientes', 'carta-qr', 'informes'],
    faqs: [
      {
        q: '¿Sirve para una panadería con cafetería?',
        a: 'Sí. El TPV combina venta rápida de mostrador con mesas, y los productos de panadería se gestionan con el mismo catálogo.',
      },
      {
        q: '¿Puedo hacer pedidos para recoger?',
        a: 'Con el módulo de pedidos online, el cliente pide desde el móvil y recoge a la hora elegida sin hacer cola.',
      },
    ],
  },
  {
    slug: 'pizzerias',
    navLabel: 'Pizzerías',
    name: 'Pizzerías',
    tagline: 'Mitades, extras y pedidos para llevar sin que el horno se atasque.',
    title: 'Software para pizzerías: sala, recogida y reparto en una sola cola',
    seoTitle: 'Software para pizzerías: TPV, pedidos online y cocina',
    description:
      'TPV y pedidos online para pizzerías: pizzas por mitades, ingredientes extra, pedidos para recoger y a domicilio directos al horno, control de capacidad y reparto propio.',
    intro:
      'Una pizzería trabaja a la vez para la sala, para quien recoge y para quien espera en casa. Si cada canal tiene su pantalla y su papel, el horno se convierte en un cuello de botella.',
    pains: [
      {
        title: 'Pedidos por tres sitios',
        text: 'Teléfono, mostrador y plataformas. Cada uno con su formato y todos a la vez a las nueve y media.',
      },
      {
        title: 'Mitades y extras mal apuntados',
        text: 'La pizza que vuelve porque faltaba un ingrediente cuesta el doble: producto y tiempo.',
      },
      {
        title: 'El horno no sabe la hora de entrega',
        text: 'Sin una cola ordenada por hora, lo urgente y lo que puede esperar se mezclan.',
      },
    ],
    answers: [
      {
        title: 'Una sola cola de pedidos',
        text: 'Sala, recogida y reparto entran en la pantalla de cocina ordenados por hora de salida.',
      },
      {
        title: 'Configurador de pizza',
        text: 'Mitades, masas, tamaños y extras con su precio. Lo que elige el cliente es lo que lee el pizzero.',
      },
      {
        title: 'Capacidad por franja',
        text: 'Límite de pedidos cada quince minutos para que el horno dé abasto y la hora prometida se cumpla.',
      },
    ],
    modules: ['pedidos', 'cocina', 'tpv', 'clientes'],
    faqs: [
      {
        q: '¿Puedo hacer pizzas por mitades?',
        a: 'Sí. El configurador permite definir mitades, tamaños, masas y extras con precios independientes.',
      },
      {
        q: '¿Gestiona a mis repartidores?',
        a: 'El módulo de pedidos asigna pedidos a reparto propio y agrupa por zona. La conexión con plataformas externas está en el plan de producto.',
      },
    ],
  },
  {
    slug: 'hamburgueserias',
    navLabel: 'Hamburgueserías',
    name: 'Hamburgueserías',
    tagline: 'Pedido en pantalla, cocina en orden y recogida a su hora.',
    title: 'Software para hamburgueserías: del pedido al pase sin papel',
    seoTitle: 'Software para hamburgueserías: TPV, kiosco QR y cocina',
    description:
      'TPV, pedido desde el móvil y pantalla de cocina para hamburgueserías: menús y combos, puntos de la carne, extras, pedidos para llevar y a domicilio con hora de recogida.',
    intro:
      'La hamburguesería moderna mezcla el servicio rápido con producto cuidado. El sistema debe tomar pedidos en mostrador, desde la mesa y desde casa, y mandarlos a la plancha en el orden correcto.',
    pains: [
      {
        title: 'Combos y extras complican el pedido',
        text: 'Menú con bebida y patatas, sin pepinillo, extra de bacon. Cada opción es un posible error.',
      },
      {
        title: 'Tiempo de espera sin control',
        text: 'El cliente no sabe cuánto queda y el equipo tampoco. Las quejas llegan tarde.',
      },
      {
        title: 'Take away que pisa la sala',
        text: 'Los pedidos para llevar entran de golpe y la plancha deja de atender a quien está sentado.',
      },
    ],
    answers: [
      {
        title: 'Menús y modificadores guiados',
        text: 'El pedido se construye paso a paso en TPV, carta QR o tienda online. Llega a cocina sin ambigüedad.',
      },
      {
        title: 'Pantalla de cocina con tiempos',
        text: 'Cada pedido muestra su tiempo en pantalla; se puede avisar al cliente cuando está listo.',
      },
      {
        title: 'Franjas de recogida',
        text: 'Pedidos online con hora asignada y capacidad limitada por franja. La plancha respira.',
      },
    ],
    modules: ['tpv', 'cocina', 'carta-qr', 'pedidos'],
    faqs: [
      {
        q: '¿El cliente puede pedir desde la mesa sin camarero?',
        a: 'Sí. Con la carta QR y el pedido desde la mesa activados, el pedido entra en cocina identificado con el número de mesa.',
      },
      {
        q: '¿Puedo avisar al cliente cuando su pedido esté listo?',
        a: 'La pantalla de cocina permite marcar el pedido como listo y mostrar el número en una pantalla de recogida.',
      },
    ],
  },
  {
    slug: 'cervecerias',
    navLabel: 'Cervecerías',
    name: 'Cervecerías',
    tagline: 'Grifos, rondas y raciones con el stock bajo control.',
    title: 'Software para cervecerías: rondas rápidas y control del barril',
    seoTitle: 'Software TPV para cervecerías y tabernas',
    description:
      'TPV para cervecerías: venta por tamaños y grifos, rondas por mesa, raciones con modificadores, control de stock de barriles y botellas, y cierre de caja por turno.',
    intro:
      'En una cervecería el producto estrella se mide en litros y la venta en rondas. Hace falta saber qué grifo rinde, qué barril está a punto de acabarse y qué mesa debe tres rondas.',
    pains: [
      {
        title: 'El barril se acaba sin aviso',
        text: 'Sin consumo teórico por venta, el stock de cerveza es una estimación a ojo.',
      },
      {
        title: 'Rondas sin control',
        text: 'Mesas grandes, muchas rondas y una cuenta que al final no cuadra con lo servido.',
      },
      {
        title: 'Turnos largos y cierres confusos',
        text: 'Varios camareros en la misma caja a lo largo de la noche. ¿De quién es la diferencia?',
      },
    ],
    answers: [
      {
        title: 'Stock por litros y formato',
        text: 'Cada caña, pinta o jarra descuenta su volumen del barril. Aviso cuando toca cambiarlo.',
      },
      {
        title: 'Rondas acumuladas en la mesa',
        text: 'El comandero suma rondas a la cuenta; el cliente paga al final o por partes.',
      },
      {
        title: 'Caja por turno y usuario',
        text: 'Cada camarero cierra su turno y el responsable ve el desglose por persona.',
      },
    ],
    modules: ['tpv', 'comandero', 'gestion', 'informes'],
    faqs: [
      {
        q: '¿Controla el stock de barriles?',
        a: 'Sí. Cada formato de venta descuenta su volumen del barril en el inventario y el sistema avisa cuando el stock baja del mínimo.',
      },
      {
        q: '¿Sirve también para una taberna con cocina?',
        a: 'Sí. Las raciones y platos se gestionan como en cualquier restaurante, con comandero y pantalla de cocina si hace falta.',
      },
    ],
  },
  {
    slug: 'pubs-coctelerias',
    navLabel: 'Pubs y coctelerías',
    name: 'Pubs y coctelerías',
    tagline: 'Cobros rápidos de noche, recetas exactas y caja cuadrada al cierre.',
    title: 'Software para pubs y coctelerías: rapidez en barra, control de noche',
    seoTitle: 'Software TPV para pubs, coctelerías y bares de copas',
    description:
      'TPV para pubs y coctelerías: cobro rápido en barra con poca luz, recetas de cóctel con escandallo, control de bebidas por dosis, cuentas abiertas y cierre de caja por turno.',
    intro:
      'De noche el TPV se usa con prisa, con poca luz y con la música alta. Tiene que ser directo, legible y fiable, y al cerrar debe decir qué se ha servido de cada botella.',
    pains: [
      {
        title: 'Cobros con prisa y poca luz',
        text: 'Una pantalla recargada o lenta se traduce en errores y en clientes que se van sin pagar.',
      },
      {
        title: 'Las botellas no cuadran',
        text: 'Sin dosis por receta, el inventario de destilados es un acto de fe cada mes.',
      },
      {
        title: 'Cuentas abiertas que se pierden',
        text: 'Grupos que piden por turnos, cuentas que se mezclan, propinas que no se registran.',
      },
    ],
    answers: [
      {
        title: 'Interfaz clara, botones grandes',
        text: 'Lo que más se vende a un toque y una pantalla legible con poca luz. Modo oscuro incluido.',
      },
      {
        title: 'Recetas con dosis',
        text: 'Cada cóctel descuenta sus mililitros del inventario. El margen por copa, calculado.',
      },
      {
        title: 'Cuentas por cliente o por grupo',
        text: 'Cuentas abiertas con nombre, división al pagar y propinas registradas por camarero.',
      },
    ],
    modules: ['tpv', 'gestion', 'informes', 'clientes'],
    faqs: [
      {
        q: '¿Tiene modo oscuro para la barra?',
        a: 'Sí. El TPV puede trabajar en modo oscuro para locales con poca luz, con el mismo flujo de cobro.',
      },
      {
        q: '¿Puedo controlar las dosis de cada botella?',
        a: 'Con los escandallos del módulo de gestión, cada receta descuenta sus dosis del inventario y el informe de mermas compara lo teórico con lo real.',
      },
    ],
  },
  {
    slug: 'take-away-delivery',
    navLabel: 'Take away y delivery',
    name: 'Take away y delivery',
    tagline: 'Tu canal propio de pedidos, sin comisión por venta.',
    title: 'Software para take away y delivery: pedidos propios y cocina ordenada',
    seoTitle: 'Software para take away y delivery propio sin comisiones',
    description:
      'Plataforma para negocios de comida para llevar y a domicilio: tienda online propia, pedidos directos a cocina, franjas de recogida, zonas de reparto y clientes fidelizados.',
    intro:
      'Si vendes sobre todo para llevar, cada pedido que pasa por un agregador deja parte del margen fuera. alaCarta te da tu propio canal con tu marca y manda cada pedido a cocina con su hora.',
    pains: [
      {
        title: 'Comisiones que se comen el margen',
        text: 'Las plataformas traen clientes, pero cobran por cada pedido, también por los que ya eran tuyos.',
      },
      {
        title: 'Tablets por cada canal',
        text: 'Una pantalla por plataforma, un papel por pedido y alguien reteclando en el TPV.',
      },
      {
        title: 'Horas de entrega imposibles',
        text: 'Sin control de capacidad, se promete lo que la cocina no puede cumplir.',
      },
    ],
    answers: [
      {
        title: 'Tienda propia con tu marca',
        text: 'Pedidos y pagos online directos a tu cuenta. Cuota fija, sin comisión por pedido.',
      },
      {
        title: 'Una sola cola de cocina',
        text: 'Pedidos propios, de mostrador y, cuando esté disponible, de agregadores en la misma pantalla.',
      },
      {
        title: 'Franjas con límite',
        text: 'Capacidad por cuarto de hora y zonas de reparto definidas. Lo que se promete, se cumple.',
      },
    ],
    modules: ['pedidos', 'cocina', 'clientes', 'tpv'],
    faqs: [
      {
        q: '¿Puedo dejar de usar los agregadores?',
        a: 'Eso lo decides tú. Muchos locales mantienen los agregadores para captar y usan el canal propio para fidelizar. alaCarta te da el canal propio desde el primer día.',
      },
      {
        q: '¿Cómo cobro los pedidos online?',
        a: 'A través de una pasarela de pago conectada a tu cuenta bancaria. alaCarta no interviene en el cobro ni retiene el dinero.',
      },
    ],
  },
  {
    slug: 'grupos-y-cadenas',
    navLabel: 'Grupos y cadenas',
    name: 'Grupos y cadenas',
    tagline: 'Varios locales, una sola carta maestra y una vista conjunta.',
    title: 'Software para grupos de restauración y cadenas con varios locales',
    seoTitle: 'Software para cadenas de restaurantes y grupos multilocal',
    description:
      'Plataforma multilocal para grupos de restauración: carta maestra con variantes por local, usuarios y permisos centralizados, informes comparativos y facturación por sociedad.',
    intro:
      'Cuando hay más de un local, el problema deja de ser el servicio y pasa a ser la coherencia: mismos precios donde toca, mismos permisos, y datos comparables sin pedir hojas de cálculo a cada encargado.',
    pains: [
      {
        title: 'Cada local, una isla',
        text: 'Cartas que se desincronizan, precios distintos por error y configuraciones que nadie recuerda.',
      },
      {
        title: 'Permisos imposibles de seguir',
        text: 'Quién puede anular, hacer descuentos o ver la caja en cada local, sin un criterio común.',
      },
      {
        title: 'Datos que llegan tarde',
        text: 'Comparar locales exige consolidar a mano. Para cuando está hecho, ya es historia.',
      },
    ],
    answers: [
      {
        title: 'Carta maestra con variantes',
        text: 'Una carta común, con excepciones por local o zona. Un cambio se publica donde corresponde.',
      },
      {
        title: 'Roles centrales',
        text: 'Perfiles por puesto, aplicados a todos los locales. Un encargado nuevo hereda su rol en un clic.',
      },
      {
        title: 'Vista de grupo en tiempo real',
        text: 'Ventas, ticket medio y margen por local en la misma pantalla, hoy y comparado.',
      },
    ],
    modules: ['gestion', 'informes', 'tpv', 'comandero'],
    faqs: [
      {
        q: '¿Puedo tener varias sociedades en la misma cuenta?',
        a: 'Sí. La plataforma es multiempresa: cada sociedad factura con sus series y sus datos fiscales, y el grupo las ve en conjunto.',
      },
      {
        q: '¿Hay API para integrar nuestros sistemas?',
        a: 'La API forma parte del plan para grupos. Permite leer ventas, productos y cierres, y está pensada para integraciones con contabilidad, RR. HH. y BI.',
      },
    ],
  },
];

export const getSector = (slug: SectorSlug) => {
  const found = sectors.find((s) => s.slug === slug);
  if (!found) throw new Error(`Sector desconocido: ${slug}`);
  return found;
};

export const sectorPath = (slug: SectorSlug) => `/sectores/${slug}`;
