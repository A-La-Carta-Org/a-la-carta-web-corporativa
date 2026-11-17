/**
 * Los sectores (tipos de negocio). Una misma plataforma, configurada de forma distinta.
 * Cada sector enlaza con los módulos que más le aportan y explica sus problemas concretos.
 *
 * ESTADO: fase 8 (docs/auditoria/12 §2). Cada sector tiene su visual de hero (`hero`), su día
 * de servicio (`day`), su configuración recomendada (`recommended`, que toma el plan y los
 * complementos de `sectorPresets` en src/lib/quote.ts para no duplicar precios) y su demo.
 *
 * Reglas de copy: los productos «en camino» (app propia, llamadas con IA, ERP) se nombran, pero
 * la página les pone su chip. Las llamadas con IA solo apuntan reservas y pedidos PARA RECOGER.
 */
import type { IconName } from '@/components/ui/icons';
import type { KdsMode, TpvMode } from '@/components/mockups/modes';
import type { HardwareKit } from './hardware';
import type { EcosystemSlug, MockupKey, SolutionSlug, Faq } from './solutions';

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

/** Visual del hero: una maqueta principal, un móvil opcional y una tarjeta flotante */
export interface SectorHero {
  main: MockupKey;
  tpvMode?: TpvMode;
  kdsMode?: KdsMode;
  phone?: MockupKey;
  card: {
    icon: IconName;
    title: string;
    text: string;
    meta: string;
    /** Producto del que habla la tarjeta: si no está disponible, lleva su chip */
    product?: EcosystemSlug;
  };
  /** Descripción del conjunto para lectores de pantalla */
  alt: string;
}

/** Un momento del día de servicio y la pieza del ecosistema que actúa */
export interface DayMoment {
  time: string;
  title: string;
  text: string;
  piece: EcosystemSlug;
}

/** Demos que se pueden montar en una página de sector o de momento */
export type DemoBlockKey =
  'simulador' | 'carta' | 'canales' | 'llamada' | 'calculadora' | 'comprobador';

export interface SectorDemo {
  key: DemoBlockKey;
  title: string;
  text: string;
}

export interface Sector {
  slug: SectorSlug;
  navLabel: string;
  name: string;
  /** Icono de línea del tipo de local */
  icon: IconName;
  /** Con artículo, para titulares: «un bar», «una pizzería», «un grupo» */
  singular: string;
  /** Una línea para menús */
  tagline: string;
  /** H1 */
  title: string;
  /** ≤ 49 caracteres: con « | alaCarta» queda en ≤ 60 */
  seoTitle: string;
  /** ≤ 155 caracteres */
  description: string;
  intro: string;
  hero: SectorHero;
  /** Lo que suele fallar en este tipo de local */
  pains: { title: string; text: string }[];
  /** Cómo lo resuelve la plataforma, en el mismo orden */
  answers: { title: string; text: string }[];
  /** Un día en tu local: de la apertura al cierre */
  day: DayMoment[];
  /**
   * Configuración recomendada. El plan y los complementos salen de `sectorPresets` (quote.ts);
   * aquí solo va el porqué, el equipo y lo que se suele añadir después.
   */
  recommended: {
    text: string;
    kits: HardwareKit['id'][];
    /** Lo que suele venir después, cuando el local lo pide */
    later: EcosystemSlug[];
  };
  demo: SectorDemo;
  /** Módulos que más usa (enlaces en «Las piezas» y filtro de sectores en /soluciones/*) */
  modules: SolutionSlug[];
  faqs: Faq[];
}

export const sectors: Sector[] = [
  {
    slug: 'restaurantes',
    navLabel: 'Restaurantes',
    name: 'Restaurantes',
    icon: 'utensils',
    singular: 'un restaurante',
    tagline: 'Sala, cocina y reservas coordinadas en cada servicio.',
    title: 'Software para restaurantes que une la sala, la cocina y la gestión',
    seoTitle: 'Software para restaurantes: sala, cocina y equipo',
    description:
      'TPV, comandero, pantalla de cocina, reservas y turnos del equipo en un solo sistema para restaurantes con servicio en mesa. Cuota fija y sin permanencia.',
    intro:
      'Un restaurante con servicio en mesa vive de la coordinación: que la comanda llegue bien, que los tiempos cuadren, que la reserva de las 21:30 tenga mesa y que el cuadrante cubra el turno partido. alaCarta pone todo eso en el mismo sistema.',
    hero: {
      main: 'tpv',
      tpvMode: 'sala',
      phone: 'comandero',
      card: {
        icon: 'calendar',
        title: 'Reserva sentada',
        text: 'Mesa 12 · García, cliente habitual',
        meta: '21:30 · 4 personas · terraza',
      },
      alt: 'El TPV de sala con la mesa 12 abierta, el comandero en el móvil del camarero y una reserva que ya tiene su mesa en el plano',
    },
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
        title: 'Reservas y turnos, cada uno por su lado',
        text: 'Un cuaderno de reservas que no sabe qué mesas hay abiertas y un cuadrante en el grupo de WhatsApp que cambia cada semana.',
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
        title: 'Reservas en el plano y equipo en el móvil',
        text: 'La reserva ocupa su mesa en el TPV. El equipo ficha y ve su turno partido en el móvil, y tú cierras el mes para la gestoría.',
      },
    ],
    day: [
      {
        time: '10:30',
        title: 'Llega el equipo',
        text: 'Cada uno ficha desde el móvil al entrar y ve su turno. El cuadrante de la semana, con los turnos partidos, ya está publicado.',
        piece: 'rrhh',
      },
      {
        time: '13:45',
        title: 'Comandas desde la mesa',
        text: 'El camarero apunta en el comandero y cada plato llega a su partida con sus notas: «sin cebolla», «al punto».',
        piece: 'comandero',
      },
      {
        time: '14:30',
        title: 'El pase, en una pantalla',
        text: 'Cocina ordena por mesa y por tiempo. La sala ve qué está listo sin entrar a preguntar.',
        piece: 'cocina',
      },
      {
        time: '18:00',
        title: 'Suena el teléfono en plena preparación',
        text: 'La IA atiende, apunta la reserva para la cena y la deja por confirmar en tu libro. Tú decides.',
        piece: 'llamadas-ia',
      },
      {
        time: '00:15',
        title: 'Cierre en diez minutos',
        text: 'El arqueo te dice qué debería haber en caja por forma de pago, y las ventas por plato y por camarero ya están en el panel.',
        piece: 'backoffice',
      },
    ],
    recommended: {
      text: 'Para un restaurante con servicio en mesa: comandero, cocina, reservas y clientes, que es justo lo que lleva el plan Completo.',
      kits: ['sala', 'cocina'],
      later: ['rrhh', 'llamadas-ia', 'erp'],
    },
    demo: {
      key: 'simulador',
      title: 'Toma una comanda y mira cómo llega a cocina',
      text: 'Un servicio de ejemplo en La Plaza, un restaurante ficticio: apunta en el comandero, márcalo en cocina y cobra en el TPV. Sin registrarte.',
    },
    modules: ['tpv', 'comandero', 'cocina', 'reservas', 'backoffice', 'rrhh'],
    faqs: [
      {
        q: '¿Sirve para un restaurante pequeño con un solo camarero?',
        a: 'Sí. Puedes empezar con el TPV y la carta QR y añadir el comandero o la cocina cuando el servicio lo pida. No hay un tamaño mínimo.',
      },
      {
        q: '¿Qué pasa con el menú del día?',
        a: 'Se configura una vez con sus primeros, segundos y postres, por días de la semana y franja horaria. El TPV, el comandero y la carta QR lo muestran solo cuando toca.',
      },
      {
        q: '¿Puedo llevar los turnos partidos y los fichajes?',
        a: 'Sí, con Equipo y RRHH: cuadrante semanal con turnos partidos, fichaje desde el móvil o una tablet con PIN, vacaciones y el mes cerrado para la gestoría. No calcula nóminas.',
      },
      {
        q: '¿Las llamadas con IA ya funcionan?',
        a: 'Todavía no: están en camino. Cuando estén, atenderán reservas y pedidos para recoger y los dejarán por confirmar. Mientras tanto, las reservas entran por la web, Google y el TPV.',
      },
      {
        q: '¿Y las compras a proveedores?',
        a: 'El stock y los escandallos están en el backoffice. Las compras, las facturas de proveedor y la contabilidad irán en el ERP de alaCarta, que está en camino.',
      },
    ],
  },
  {
    slug: 'bares',
    navLabel: 'Bares',
    name: 'Bares',
    icon: 'wine',
    singular: 'un bar',
    tagline: 'Cobrar rápido en barra y no perder una caña de la terraza.',
    title: 'Software para bares: rápido en barra, ordenado en terraza',
    seoTitle: 'TPV para bares: barra, terraza y cierre de caja',
    description:
      'TPV en modo barra, comandero para la terraza, placas QR en las mesas, fichaje del equipo y cierre de caja en minutos. Para bares, sin comisiones.',
    intro:
      'En un bar el ritmo lo marca la barra. El TPV tiene que cobrar una caña en un toque y, a la vez, saber qué se ha servido en la mesa 4 de la terraza. alaCarta está hecho para las dos cosas, y para que el cierre no se alargue hasta las dos.',
    hero: {
      main: 'tpv',
      tpvMode: 'barra',
      phone: 'comandero',
      card: {
        icon: 'qr-plate',
        title: 'Terraza · mesa T4',
        text: 'Otra ronda pedida desde la placa QR',
        meta: '3 rondas · 18,40 € · sin pagar',
      },
      alt: 'El TPV en modo barra cobrando dos cañas y una ración, el comandero de la terraza y la mesa T4 pidiendo otra ronda desde su placa QR',
    },
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
        text: 'Contar, cuadrar y explicar diferencias a las dos de la mañana, sin saber de quién son.',
      },
    ],
    answers: [
      {
        title: 'Modo barra con favoritos',
        text: 'Lo que más se vende, a un toque. Cobro directo sin abrir mesa, y al modo sala con un toque cuando hace falta.',
      },
      {
        title: 'Comandero y placas QR en la terraza',
        text: 'El camarero apunta en el móvil, o la mesa pide otra ronda desde su placa QR. La cuenta se acumula sola.',
      },
      {
        title: 'Arqueo guiado y fichajes',
        text: 'El cierre te dice qué debería haber por forma de pago y señala las diferencias. Las horas de cada uno, fichadas.',
      },
    ],
    day: [
      {
        time: '08:00',
        title: 'Cafés y tostadas en barra',
        text: 'Modo barra: cobro directo sin abrir mesa y lo que más sale, a un toque. La cola avanza.',
        piece: 'tpv',
      },
      {
        time: '12:30',
        title: 'Abre la terraza',
        text: 'Cada mesa con su placa QR: el cliente ve la carta, pide otra ronda o paga desde el móvil.',
        piece: 'placas-qr',
      },
      {
        time: '14:00',
        title: 'Raciones y menú del día',
        text: 'El camarero apunta en el comandero sin volver a la barra, y la cuenta de cada mesa se suma sola.',
        piece: 'comandero',
      },
      {
        time: '16:00',
        title: 'Cambio de turno',
        text: 'Quien sale ficha la salida y quien entra, la entrada, desde el móvil o la tablet con PIN. Las horas quedan registradas.',
        piece: 'rrhh',
      },
      {
        time: '01:30',
        title: 'Cierre de caja',
        text: 'Arqueo guiado por forma de pago y diferencias señaladas por camarero. Te vas a casa con el día cuadrado.',
        piece: 'backoffice',
      },
    ],
    recommended: {
      text: 'Para un bar con terraza: el plan Esencial con el comandero para la terraza y placas QR en las mesas de fuera.',
      kits: ['barra'],
      later: ['rrhh', 'clientes'],
    },
    demo: {
      key: 'simulador',
      title: 'Apunta una ronda y cóbrala',
      text: 'Toma una comanda en el comandero, márcala en cocina y cóbrala en el TPV. Es el mismo flujo que la terraza de un bar, con la carta de un restaurante de ejemplo.',
    },
    modules: ['tpv', 'comandero', 'carta-qr', 'backoffice', 'rrhh'],
    faqs: [
      {
        q: '¿Puedo cobrar sin abrir mesa?',
        a: 'Sí. El modo barra cobra directamente, y el modo sala abre mesas. Se cambia de uno a otro en el mismo TPV.',
      },
      {
        q: '¿Funciona con mi impresora de tickets actual?',
        a: 'Si es una impresora térmica de red o USB estándar, lo normal es que sí. Lo comprobamos antes de empezar.',
      },
      {
        q: '¿Qué ganan las placas QR en la terraza?',
        a: 'Que la mesa pueda ver la carta, pedir otra ronda o pagar sin esperar a que pase el camarero. El pedido entra en el TPV con el número de mesa.',
      },
      {
        q: '¿Tengo que llevar el registro de jornada?',
        a: 'Sí, es obligatorio desde 2019. Con Equipo y RRHH el equipo ficha en el móvil o en una tablet con PIN, y el registro se exporta para la gestoría o una inspección.',
      },
    ],
  },
  {
    slug: 'cafeterias',
    navLabel: 'Cafeterías',
    name: 'Cafeterías',
    icon: 'coffee',
    singular: 'una cafetería',
    tagline: 'Desayunos, meriendas y para llevar sin colas en el mostrador.',
    title: 'Software para cafeterías: rapidez en el mostrador y control del día',
    seoTitle: 'TPV para cafeterías: mostrador y para llevar',
    description:
      'TPV de mostrador para cafeterías: cobro en dos toques, bebidas con sus opciones, puntos para los de cada día, placas QR y pedidos para recoger.',
    intro:
      'Una cafetería vende mucho en poco tiempo y repite clientes casi cada día. El sistema tiene que ser ágil a las ocho de la mañana, apuntar bien el café con leche de avena y saber quién es el cliente que viene a diario.',
    hero: {
      main: 'tpv',
      tpvMode: 'mostrador',
      phone: 'carta',
      card: {
        icon: 'award',
        title: 'Ana · 9 de 10 cafés',
        text: 'El próximo lo invita la casa',
        meta: 'Clienta desde marzo · 4 visitas esta semana',
      },
      alt: 'El TPV de mostrador con un café de avena para llevar, la carta QR de las mesas en un móvil y la ficha de puntos de una clienta habitual',
    },
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
        title: 'Puntos digitales y tu propia app',
        text: 'El cliente acumula por cada compra y canjea en caja. Con la app propia, además, pide para recoger.',
      },
    ],
    day: [
      {
        time: '07:30',
        title: 'El primer pico',
        text: 'Café con leche de avena, grande, para llevar: dos toques y cobrado. Las opciones salen claras para quien lo prepara.',
        piece: 'tpv',
      },
      {
        time: '08:15',
        title: 'La clienta de cada día',
        text: 'Ana suma su noveno café en su ficha de puntos. El siguiente lo invita la casa, sin tarjeta de cartón.',
        piece: 'clientes',
      },
      {
        time: '10:00',
        title: 'Pedido para recoger',
        text: 'Desde tu app propia, el cliente pide su desayuno, lo paga y lo recoge sin hacer cola.',
        piece: 'app-propia',
      },
      {
        time: '11:30',
        title: 'Mesas con su QR',
        text: 'En la zona de mesas, la placa QR enseña la carta con alérgenos y en otros idiomas. Se pide y se paga desde el móvil.',
        piece: 'placas-qr',
      },
      {
        time: '20:00',
        title: 'Cierre y lo de mañana',
        text: 'Las ventas por franja horaria te dicen cuánta bollería preparar mañana y cuándo reforzar el mostrador.',
        piece: 'backoffice',
      },
    ],
    recommended: {
      text: 'Para una cafetería: el plan Esencial con Clientes y fidelización para los puntos, y placas QR si tienes mesas.',
      kits: ['barra'],
      later: ['app-propia', 'pedidos-online'],
    },
    demo: {
      key: 'carta',
      title: 'Así ve tu carta el cliente de la mesa',
      text: 'Es la carta de La Plaza, un local de ejemplo: cambia de idioma, filtra por alérgenos, pide y paga tu parte (simulado). Sin registrarte.',
    },
    modules: ['tpv', 'clientes', 'carta-qr', 'backoffice', 'app-propia'],
    faqs: [
      {
        q: '¿Sirve para una panadería con cafetería?',
        a: 'Sí. El TPV combina venta rápida de mostrador con mesas, y los productos de panadería se gestionan con el mismo catálogo.',
      },
      {
        q: '¿Puedo hacer pedidos para recoger?',
        a: 'Sí, con los pedidos online: el cliente pide desde el móvil y recoge a la hora elegida sin hacer cola. Cuando esté la app propia, también desde ella.',
      },
      {
        q: '¿Cómo funcionan los puntos?',
        a: 'El cliente se identifica con su móvil al pagar, con su consentimiento, y suma puntos por cada compra. Tú decides cuántos hacen falta y qué se regala.',
      },
      {
        q: '¿La app propia está disponible?',
        a: 'Está en camino. Será una app web instalable con tu marca para pedir, reservar y ver los puntos. Mientras tanto, los puntos y los pedidos para recoger ya funcionan sin ella.',
      },
    ],
  },
  {
    slug: 'pizzerias',
    navLabel: 'Pizzerías',
    name: 'Pizzerías',
    icon: 'pizza',
    singular: 'una pizzería',
    tagline: 'Mitades, extras y pedidos para llevar sin que el horno se atasque.',
    title: 'Software para pizzerías: sala, recogida y reparto en una sola cola',
    seoTitle: 'TPV para pizzerías: pedidos, teléfono y horno',
    description:
      'Para pizzerías: pedidos online propios, una sola cola en el horno, pizzas por mitades y llamadas con IA para pedidos para recoger. Sin comisión.',
    intro:
      'Una pizzería trabaja a la vez para la sala, para quien recoge y para quien espera en casa, y el teléfono sigue siendo su canal número uno. Si cada canal tiene su pantalla y su papel, el horno se convierte en un cuello de botella.',
    hero: {
      main: 'kds',
      kdsMode: 'pizzeria',
      phone: 'tienda-online',
      card: {
        icon: 'ai-call',
        title: 'Llamada con IA',
        text: 'Pedido para recoger, pendiente de aceptar',
        meta: '21:15 · barbacoa familiar · mitad 4 quesos',
        product: 'llamadas-ia',
      },
      alt: 'La pantalla del horno con los pedidos de teléfono, tienda online, mostrador y reparto ordenados por hora de salida, la tienda online en un móvil y un pedido para recoger tomado por teléfono',
    },
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
        text: 'Sala, mostrador, tienda online y teléfono entran en la pantalla del horno ordenados por hora de salida.',
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
    day: [
      {
        time: '12:00',
        title: 'El teléfono empieza a sonar',
        text: 'La IA coge los pedidos para recoger, repite la pizza y la hora, y los deja pendientes de aceptar en el TPV. Los de reparto los pasa al local.',
        piece: 'llamadas-ia',
      },
      {
        time: '13:30',
        title: 'Una sola cola en el horno',
        text: 'Mostrador, tienda online y teléfono, en la misma pantalla y por hora de salida. El pizzero lee mitades y extras tal como se pidieron.',
        piece: 'cocina',
      },
      {
        time: '20:00',
        title: 'Pedidos online con franja',
        text: 'Cada cuarto de hora admite las pizzas que el horno puede sacar. Cuando una franja se llena, la tienda ofrece la siguiente.',
        piece: 'pedidos-online',
      },
      {
        time: '21:30',
        title: 'El pedido de los viernes',
        text: 'El cliente de siempre abre tu app, repite su pedido en dos toques y suma puntos. Sin comisión por pedido.',
        piece: 'app-propia',
      },
      {
        time: '23:30',
        title: 'Cierre y masa para mañana',
        text: 'Ventas por canal, las pizzas más pedidas y el stock de ingredientes para preparar el día siguiente.',
        piece: 'backoffice',
      },
    ],
    recommended: {
      text: 'Para una pizzería con recogida y reparto: pantalla de cocina, pedidos online propios y llamadas con IA para los pedidos para recoger.',
      kits: ['barra', 'cocina'],
      later: ['app-propia', 'clientes'],
    },
    demo: {
      key: 'llamada',
      title: 'Así se atiende un pedido por teléfono',
      text: 'Tres llamadas de ejemplo a un local ficticio. Sin audio: la conversación se escribe sola y, al colgar, ves lo que queda en tu sistema, pendiente de que tú decidas.',
    },
    modules: ['pedidos-online', 'cocina', 'tpv', 'clientes', 'llamadas-ia', 'app-propia'],
    faqs: [
      {
        q: '¿Puedo hacer pizzas por mitades?',
        a: 'Sí. El configurador permite definir mitades, tamaños, masas y extras con precios independientes.',
      },
      {
        q: '¿Gestiona a mis repartidores?',
        a: 'Los pedidos online asignan los pedidos a reparto propio y los agrupan por zona. La conexión con plataformas externas está en camino.',
      },
      {
        q: '¿La IA toma pedidos a domicilio por teléfono?',
        a: 'No. Cuando las llamadas con IA estén disponibles, apuntarán reservas y pedidos para recoger. Los pedidos a domicilio por teléfono los pasa a tu equipo, que confirma dirección y zona.',
      },
      {
        q: '¿Qué pasa si el horno no da abasto?',
        a: 'Cada franja de quince minutos admite un número de pedidos que tú decides. Cuando se llena, la tienda online ofrece la siguiente hora libre.',
      },
    ],
  },
  {
    slug: 'hamburgueserias',
    navLabel: 'Hamburgueserías',
    name: 'Hamburgueserías',
    icon: 'burger',
    singular: 'una hamburguesería',
    tagline: 'Pedido en pantalla, cocina en orden y recogida a su hora.',
    title: 'Software para hamburgueserías: del pedido al pase sin papel',
    seoTitle: 'TPV para hamburgueserías: pedidos y plancha',
    description:
      'Para hamburgueserías: pedido desde la mesa con QR, menús y extras guiados, pantalla de plancha, pedidos online con hora de recogida y tu propia app.',
    intro:
      'La hamburguesería moderna mezcla el servicio rápido con producto cuidado. El sistema debe tomar pedidos en mostrador, desde la mesa y desde casa, y mandarlos a la plancha en el orden correcto.',
    hero: {
      main: 'kds',
      kdsMode: 'hamburgueseria',
      phone: 'carta',
      card: {
        icon: 'bell',
        title: 'Pedido #45 listo',
        text: 'El número sale en la pantalla de recogida',
        meta: 'Mesa 6 · pedido desde el QR · 11 min',
      },
      alt: 'La pantalla de la plancha con pedidos de mostrador, mesa y recogida, la carta QR en el móvil del cliente y el aviso de un pedido listo',
    },
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
        text: 'Cada pedido muestra su tiempo en pantalla; cuando está listo, el número sale en la pantalla de recogida.',
      },
      {
        title: 'Franjas de recogida',
        text: 'Pedidos online con hora asignada y capacidad limitada por franja. La plancha respira.',
      },
    ],
    day: [
      {
        time: '13:00',
        title: 'Pedido desde la mesa',
        text: 'El cliente arma su menú en la carta QR: punto de la carne, sin pepinillo, patatas grandes. Llega a la plancha sin dudas.',
        piece: 'carta-qr',
      },
      {
        time: '13:20',
        title: 'Plancha en orden',
        text: 'Sala, mostrador y para llevar en la misma pantalla, con el tiempo de cada pedido a la vista y el número a la pantalla de recogida.',
        piece: 'cocina',
      },
      {
        time: '20:30',
        title: 'Recogida a su hora',
        text: 'Los pedidos online entran con hora asignada y límite por franja: el take away no ahoga a la sala a las nueve.',
        piece: 'pedidos-online',
      },
      {
        time: '21:00',
        title: 'Los de siempre, por tu app',
        text: 'Repiten su menú desde tu app propia y acumulan puntos. Ese pedido no paga comisión a nadie.',
        piece: 'app-propia',
      },
      {
        time: '00:00',
        title: 'Cierre',
        text: 'Qué combos se venden, qué extras dejan margen y cuánto pan y carne hace falta mañana.',
        piece: 'backoffice',
      },
    ],
    recommended: {
      text: 'Para una hamburguesería: pantalla de cocina y pedidos online sobre el plan Esencial, que ya incluye la carta QR para pedir desde la mesa.',
      kits: ['barra', 'cocina'],
      later: ['app-propia', 'clientes'],
    },
    demo: {
      key: 'carta',
      title: 'Pide desde la mesa, como tu cliente',
      text: 'Es la carta de La Plaza, un local de ejemplo: elige un plato con sus opciones, pídelo y mira cómo lo recibiría la cocina. Sin registrarte.',
    },
    modules: ['tpv', 'cocina', 'carta-qr', 'pedidos-online', 'app-propia'],
    faqs: [
      {
        q: '¿El cliente puede pedir desde la mesa sin camarero?',
        a: 'Sí. Con la carta QR y el pedido desde la mesa activados, el pedido entra en cocina identificado con el número de mesa.',
      },
      {
        q: '¿Puedo avisar al cliente cuando su pedido esté listo?',
        a: 'La pantalla de cocina permite marcar el pedido como listo y mostrar el número en una pantalla de recogida.',
      },
      {
        q: '¿Tenéis quiosco de autopedido?',
        a: 'Hoy no. El pedido desde la mesa con la carta QR cubre buena parte de lo que hace un quiosco sin comprar el aparato. Si lo necesitas, cuéntanoslo en la demo.',
      },
      {
        q: '¿Puedo tener mi propia app?',
        a: 'La app propia está en camino: con tu marca, para pedir, repetir el menú de siempre y sumar puntos. Los pedidos online con tu marca ya funcionan desde el navegador.',
      },
    ],
  },
  {
    slug: 'cervecerias',
    navLabel: 'Cervecerías',
    name: 'Cervecerías',
    icon: 'beer',
    singular: 'una cervecería',
    tagline: 'Grifos, rondas y raciones con el stock bajo control.',
    title: 'Software para cervecerías: rondas rápidas y control del barril',
    seoTitle: 'TPV para cervecerías: grifos, rondas y barriles',
    description:
      'TPV para cervecerías y tabernas: venta por formato y grifo, rondas por mesa, stock del barril por litros, placas QR en la terraza y caja por turno.',
    intro:
      'En una cervecería el producto estrella se mide en litros y la venta, en rondas. Hace falta saber qué grifo rinde, qué barril está a punto de acabarse y qué mesa debe tres rondas.',
    hero: {
      main: 'tpv',
      tpvMode: 'grifos',
      card: {
        icon: 'bell',
        title: 'Barril IPA · quedan 6 l',
        text: 'Toca cambiarlo antes del pico de la noche',
        meta: 'Grifo 3 · 30 l · 44 pintas servidas',
      },
      alt: 'El TPV con una mesa de terraza de ocho personas y tres rondas, la carta de grifos por formato y el aviso de que el barril de IPA se acaba',
    },
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
        text: 'El comandero o la placa QR suman rondas a la cuenta; el cliente paga al final o por partes.',
      },
      {
        title: 'Caja por turno y usuario',
        text: 'Cada camarero cierra su turno y el responsable ve el desglose por persona.',
      },
    ],
    day: [
      {
        time: '12:30',
        title: 'Vermut y primeras cañas',
        text: 'Caña, pinta o jarra, a un toque y con su precio. Cada formato descuenta su volumen del barril.',
        piece: 'tpv',
      },
      {
        time: '14:00',
        title: 'Raciones en la terraza',
        text: 'Las mesas piden otra ronda o una ración desde la placa QR, y el pedido llega a barra y a cocina.',
        piece: 'placas-qr',
      },
      {
        time: '20:00',
        title: 'Mesas grandes, muchas rondas',
        text: 'El camarero suma rondas a la cuenta desde el comandero. Se paga al final o por partes.',
        piece: 'comandero',
      },
      {
        time: '22:30',
        title: 'Aviso de barril',
        text: 'Quedan seis litros de IPA: el aviso llega antes de que el grifo escupa espuma en plena noche.',
        piece: 'backoffice',
      },
      {
        time: '01:00',
        title: 'Cierre por camarero',
        text: 'Cada uno cierra su caja y ficha la salida. Ves el desglose por persona y las horas de la noche.',
        piece: 'rrhh',
      },
    ],
    recommended: {
      text: 'Para una cervecería con raciones: comanderos para la sala, pantalla de cocina y placas QR en la terraza.',
      kits: ['sala', 'cocina'],
      later: ['rrhh', 'clientes'],
    },
    demo: {
      key: 'simulador',
      title: 'Una ronda, de la mesa a la caja',
      text: 'Apunta en el comandero, márcalo en cocina y cobra en el TPV. Es el mismo flujo que una mesa de cervecería, con la carta de un local de ejemplo.',
    },
    modules: ['tpv', 'comandero', 'backoffice', 'carta-qr'],
    faqs: [
      {
        q: '¿Controla el stock de barriles?',
        a: 'Sí. Cada formato de venta descuenta su volumen del barril en el inventario del backoffice y el sistema avisa cuando el stock baja del mínimo.',
      },
      {
        q: '¿Sirve también para una taberna con cocina?',
        a: 'Sí. Las raciones y platos se gestionan como en cualquier restaurante, con comandero y pantalla de cocina si hace falta.',
      },
      {
        q: '¿Y las botellas y las latas?',
        a: 'Cada producto se vende en su formato y descuenta lo suyo: el grifo por litros y las botellas por unidades. El aviso de stock mínimo funciona igual para los dos.',
      },
      {
        q: '¿Las placas QR sirven en una terraza al sol?',
        a: 'Hay acabados y un formato pensado para terraza. En la página de placas QR puedes ver cómo quedaría la tuya con el nombre de tu local.',
      },
    ],
  },
  {
    slug: 'pubs-coctelerias',
    navLabel: 'Pubs y coctelerías',
    name: 'Pubs y coctelerías',
    icon: 'cocktail',
    singular: 'un pub o una coctelería',
    tagline: 'Cobros rápidos de noche, recetas exactas y caja cuadrada al cierre.',
    title: 'Software para pubs y coctelerías: rapidez en barra, control de noche',
    seoTitle: 'TPV para pubs y coctelerías: barra de noche',
    description:
      'TPV en modo oscuro para pubs y coctelerías: cobro rápido en barra, recetas con dosis, invitaciones con motivo, cuentas abiertas y turnos de noche.',
    intro:
      'De noche el TPV se usa con prisa, con poca luz y con la música alta. Tiene que ser directo y legible, registrar cada invitación y, al cerrar, decir qué se ha servido de cada botella.',
    hero: {
      main: 'tpv',
      tpvMode: 'noche',
      card: {
        icon: 'receipt',
        title: 'Invitación registrada',
        text: 'Chupito · cumpleaños',
        meta: 'Autoriza Marta · 01:12 · cuenta de Laura',
      },
      alt: 'El TPV en modo oscuro con la cuenta abierta de un grupo, la carta de cócteles y una invitación registrada con su motivo y quién la autoriza',
    },
    pains: [
      {
        title: 'Cobros con prisa y poca luz',
        text: 'Una pantalla recargada o lenta se traduce en errores y en clientes que se van sin pagar.',
      },
      {
        title: 'Las botellas no cuadran',
        text: 'Sin dosis por receta y con invitaciones que no se apuntan, el inventario de destilados es un acto de fe cada mes.',
      },
      {
        title: 'Cuentas abiertas y turnos largos',
        text: 'Grupos que piden por turnos, cuentas que se mezclan y un equipo que cierra a las cuatro.',
      },
    ],
    answers: [
      {
        title: 'Modo oscuro, botones grandes',
        text: 'Lo que más se vende a un toque y una pantalla legible con poca luz, sin deslumbrar en la barra.',
      },
      {
        title: 'Recetas con dosis e invitaciones con motivo',
        text: 'Cada cóctel descuenta sus mililitros. Cada invitación queda registrada con quién la autoriza y por qué.',
      },
      {
        title: 'Cuentas por nombre y turnos de noche',
        text: 'Cuentas abiertas con nombre, división al pagar y propinas por camarero. Turnos de noche y fichajes, en el móvil.',
      },
    ],
    day: [
      {
        time: '19:00',
        title: 'Turnos de la noche',
        text: 'Quién abre, quién cierra y quién refuerza el sábado, publicado en el cuadrante. Cada uno ficha al entrar.',
        piece: 'rrhh',
      },
      {
        time: '21:00',
        title: 'Reservas de grupo',
        text: 'Cumpleaños y despedidas reservan zona con antelación y llegan con su nombre en el plano.',
        piece: 'reservas',
      },
      {
        time: '00:30',
        title: 'Barra a oscuras',
        text: 'El TPV en modo oscuro: un gin tonic se cobra en un toque, y la cuenta del grupo sigue abierta con su nombre.',
        piece: 'tpv',
      },
      {
        time: '01:15',
        title: 'Invitaciones con motivo',
        text: 'El chupito del cumpleaños queda registrado con quién lo autoriza. Se acabaron las copas que no aparecen en ningún sitio.',
        piece: 'tpv',
      },
      {
        time: '03:45',
        title: 'Cierre con las botellas cuadradas',
        text: 'Cada cóctel descontó sus dosis: el informe compara lo que debería quedar con lo que queda, y la caja, por camarero.',
        piece: 'backoffice',
      },
    ],
    recommended: {
      text: 'Para un pub o una coctelería: el plan Esencial con comanderos para la sala y reservas para los grupos. El modo oscuro va incluido.',
      kits: ['barra'],
      later: ['rrhh', 'clientes'],
    },
    demo: {
      key: 'simulador',
      title: 'Una comanda, de la mesa a la caja',
      text: 'Apunta, prepara y cobra en un servicio de ejemplo. El simulador usa la carta de un restaurante; tu TPV llevará la tuya, en modo oscuro.',
    },
    modules: ['tpv', 'backoffice', 'clientes', 'rrhh', 'reservas'],
    faqs: [
      {
        q: '¿Tiene modo oscuro para la barra?',
        a: 'Sí. El TPV puede trabajar en modo oscuro para locales con poca luz, con el mismo flujo de cobro.',
      },
      {
        q: '¿Puedo controlar las dosis de cada botella?',
        a: 'Con los escandallos del backoffice, cada receta descuenta sus dosis del inventario y el informe de mermas compara lo teórico con lo real.',
      },
      {
        q: '¿Cómo se controlan las invitaciones?',
        a: 'Cada invitación se registra en el TPV con su motivo y con quién la autoriza, y puedes limitar quién puede invitar. En el informe ves cuántas hay y de quién.',
      },
      {
        q: '¿Sirve para turnos que acaban de madrugada?',
        a: 'Sí. Los turnos de noche se publican en el cuadrante como cualquier otro y cada uno ficha su entrada y su salida desde el móvil o la tablet de la barra.',
      },
    ],
  },
  {
    slug: 'take-away-delivery',
    navLabel: 'Take away y delivery',
    name: 'Take away y delivery',
    icon: 'bike',
    singular: 'un negocio de take away',
    tagline: 'Tu canal propio de pedidos, sin comisión por venta.',
    title: 'Software para take away y delivery: pedidos propios y cocina ordenada',
    seoTitle: 'Software para take away y delivery sin comisiones',
    description:
      'Tienda online y app con tu marca, llamadas con IA para pedidos para recoger y una sola cola de cocina. Cuota fija, sin comisión por pedido.',
    intro:
      'Si vendes sobre todo para llevar, cada pedido que pasa por un agregador deja parte del margen fuera. alaCarta te da tu propio canal con tu marca, atiende el teléfono y manda cada pedido a cocina con su hora.',
    hero: {
      main: 'kds',
      kdsMode: 'takeaway',
      phone: 'tienda-online',
      card: {
        icon: 'app',
        title: 'Pedido por tu app',
        text: 'Repetido en dos toques, sin comisión',
        meta: 'Recoger 20:45 · 2 poke · pagado',
        product: 'app-propia',
      },
      alt: 'La pantalla de cocina con pedidos de la app, la tienda online y el mostrador por hora de salida, la tienda online en un móvil y un pedido repetido desde la app propia',
    },
    pains: [
      {
        title: 'Comisiones que se comen el margen',
        text: 'Las plataformas traen clientes, pero cobran por cada pedido, también por los que ya eran tuyos.',
      },
      {
        title: 'Tablets por cada canal',
        text: 'Una pantalla por plataforma, un papel por pedido, el teléfono sonando y alguien reteclando en el TPV.',
      },
      {
        title: 'Horas de entrega imposibles',
        text: 'Sin control de capacidad, se promete lo que la cocina no puede cumplir.',
      },
    ],
    answers: [
      {
        title: 'Tienda y app con tu marca',
        text: 'Pedidos y pagos online directos a tu cuenta. Cuota fija, sin comisión por pedido.',
      },
      {
        title: 'Una sola cola de cocina',
        text: 'Pedidos propios, de mostrador y del teléfono en la misma pantalla. Los de agregadores, cuando esté la integración.',
      },
      {
        title: 'Franjas con límite',
        text: 'Capacidad por cuarto de hora y zonas de reparto definidas. Lo que se promete, se cumple.',
      },
    ],
    day: [
      {
        time: '12:00',
        title: 'Pedidos de mediodía por teléfono',
        text: 'La IA atiende, toma el pedido para recoger y lo deja pendiente de aceptar. Los de reparto los pasa a tu equipo.',
        piece: 'llamadas-ia',
      },
      {
        time: '13:00',
        title: 'Una sola cola de cocina',
        text: 'Tienda online, app y mostrador ordenados por hora de salida. Los agregadores se sumarán a esta cola cuando la integración esté lista.',
        piece: 'cocina',
      },
      {
        time: '20:00',
        title: 'Franjas con límite',
        text: 'Capacidad por cuarto de hora y zonas de reparto: la tienda solo promete lo que la cocina puede cumplir.',
        piece: 'pedidos-online',
      },
      {
        time: '21:00',
        title: 'Clientes que repiten',
        text: 'Tu app propia con su pedido de siempre y sus puntos. Cada pedido que entra por aquí no paga comisión.',
        piece: 'app-propia',
      },
      {
        time: '23:30',
        title: 'Cierre por canal',
        text: 'Cuánto vendes por cada canal y qué clientes no piden desde hace un mes, para mandarles una campaña sencilla.',
        piece: 'clientes',
      },
    ],
    recommended: {
      text: 'Para un negocio de take away: cocina, pedidos online, app propia y llamadas con IA sobre el plan Esencial. Sin comisión por pedido.',
      kits: ['barra', 'cocina'],
      later: ['clientes', 'web-para-restaurantes'],
    },
    demo: {
      key: 'calculadora',
      title: '¿Cuánto se te va en comisiones?',
      text: 'Pon tus pedidos de un mes, tu ticket medio y la comisión de tu plataforma. La cuenta no guarda nada ni te pide datos.',
    },
    modules: ['pedidos-online', 'cocina', 'clientes', 'tpv', 'app-propia', 'llamadas-ia'],
    faqs: [
      {
        q: '¿Puedo dejar de usar los agregadores?',
        a: 'Eso lo decides tú. Muchos locales mantienen los agregadores para captar y usan el canal propio para fidelizar. alaCarta te da el canal propio desde el primer día.',
      },
      {
        q: '¿Cómo cobro los pedidos online?',
        a: 'A través de una pasarela de pago conectada a tu cuenta bancaria. alaCarta no interviene en el cobro ni retiene el dinero.',
      },
      {
        q: '¿Los pedidos de Glovo o Uber Eats entran en la misma pantalla?',
        a: 'Todavía no: la integración con agregadores está en camino. Hoy entran en la misma cola los pedidos de tu tienda online, del mostrador y del TPV.',
      },
      {
        q: '¿La IA puede coger pedidos a domicilio?',
        a: 'No. Las llamadas con IA, que están en camino, apuntarán pedidos para recoger y reservas. Los pedidos a domicilio por teléfono se pasan a tu equipo.',
      },
    ],
  },
  {
    slug: 'grupos-y-cadenas',
    navLabel: 'Grupos y cadenas',
    name: 'Grupos y cadenas',
    icon: 'building',
    singular: 'un grupo',
    tagline: 'Varios locales, una sola carta maestra y una vista conjunta.',
    title: 'Software para grupos de restauración y cadenas con varios locales',
    seoTitle: 'Software para grupos de restauración y cadenas',
    description:
      'Carta maestra con variantes por local, roles comunes, comparativas entre locales, RRHH de todos los centros y ERP multiempresa (en camino).',
    intro:
      'Cuando hay más de un local, el problema deja de ser el servicio y pasa a ser la coherencia: mismos precios donde toca, mismos permisos, el equipo de todos los centros en un sitio y datos comparables sin pedir hojas de cálculo a cada encargado.',
    hero: {
      main: 'backoffice',
      card: {
        icon: 'chart',
        title: 'Vista de grupo · hoy',
        text: 'Centro 3.240 € · Puerto 2.810 € · Norte 2.150 €',
        meta: 'Ticket medio 27,40 € · +6 % sobre el martes pasado',
      },
      alt: 'La carta maestra del backoffice con precios por local y canal, y las ventas de hoy de tres locales comparadas',
    },
    pains: [
      {
        title: 'Cada local, una isla',
        text: 'Cartas que se desincronizan, precios distintos por error y configuraciones que nadie recuerda.',
      },
      {
        title: 'Permisos y equipos imposibles de seguir',
        text: 'Quién puede anular, quién ha fichado y quién cubre el sábado en cada local, sin un criterio común.',
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
        title: 'Roles centrales y RRHH de todos los centros',
        text: 'Perfiles por puesto en todos los locales, y cuadrantes, fichajes y vacaciones de cada centro en el mismo sitio.',
      },
      {
        title: 'Vista de grupo en tiempo real',
        text: 'Ventas, ticket medio y margen por local en la misma pantalla, hoy y comparado.',
      },
    ],
    day: [
      {
        time: '09:00',
        title: 'Un cambio en la carta maestra',
        text: 'Subes el precio de un plato y se publica en los locales que tocan, con sus excepciones, en el TPV, la carta QR y la tienda.',
        piece: 'backoffice',
      },
      {
        time: '10:00',
        title: 'Cuadrantes de todos los centros',
        text: 'Cada encargado publica el suyo; tú ves horas, fichajes y vacaciones de todos los locales en el mismo sitio.',
        piece: 'rrhh',
      },
      {
        time: '14:00',
        title: 'Servicio en cada local',
        text: 'Cada local trabaja con su TPV y sus comanderos, con los mismos roles y permisos para todos.',
        piece: 'tpv',
      },
      {
        time: '17:00',
        title: 'Facturas de proveedor por sociedad',
        text: 'Compras, almacén y facturas de cada sociedad, con traspasos entre locales y acceso para la gestoría.',
        piece: 'erp',
      },
      {
        time: '23:59',
        title: 'La vista de grupo',
        text: 'Ventas, ticket medio y margen por local, comparados con la semana pasada, sin pedir hojas de cálculo.',
        piece: 'backoffice',
      },
    ],
    recommended: {
      text: 'Para un grupo de tres locales: el plan Completo en cada uno, Equipo y RRHH y el ERP para la sociedad. Con tres locales o más te preparamos precio por volumen.',
      kits: ['completo'],
      later: ['app-propia', 'llamadas-ia'],
    },
    demo: {
      key: 'canales',
      title: 'Cambia un precio. Mira dónde cambia.',
      text: 'Un backoffice reducido con tres platos de un local de ejemplo. Sube un precio o marca un plato como agotado y mira el TPV, la carta QR, la tienda online y la app.',
    },
    modules: ['backoffice', 'tpv', 'comandero', 'erp', 'rrhh'],
    faqs: [
      {
        q: '¿Puedo tener varias sociedades en la misma cuenta?',
        a: 'La cuenta agrupa todos tus locales. La facturación por sociedad, con sus series y sus datos fiscales, y la contabilidad multiempresa irán en el ERP de alaCarta, que está en camino.',
      },
      {
        q: '¿Hay API para integrar nuestros sistemas?',
        a: 'La API forma parte del plan para grupos. Permite leer ventas, productos y cierres, y está pensada para integraciones con contabilidad, RR. HH. y BI.',
      },
      {
        q: '¿Cada local puede tener precios distintos?',
        a: 'Sí. La carta maestra admite variantes por local, por zona y por canal. Un cambio común se publica en todos; una excepción, solo donde toca.',
      },
      {
        q: '¿Cómo es el precio para grupos?',
        a: 'A partir de tres locales preparamos un precio por volumen. En el configurador ves el máximo; la propuesta llega por escrito tras la demo.',
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

/** Otros tipos de local que no tienen página propia (índice de /sectores) */
export const otherVenues: string[] = [
  'Hoteles con restaurante',
  'Food trucks',
  'Obradores con venta',
  'Heladerías',
  'Restaurantes de playa',
  'Catering y eventos',
];
