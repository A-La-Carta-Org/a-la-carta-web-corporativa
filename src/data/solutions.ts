/**
 * Las soluciones (módulos) de la plataforma. Fuente única de su copy: la navegación, las
 * tarjetas de la home, el índice de soluciones y cada página de producto leen de aquí.
 *
 * Todas forman parte de un mismo sistema: comparten la carta, los precios, las mesas, los
 * usuarios y los datos. Esa es la idea que vende alaCarta y la que esta estructura refleja.
 */
export type SolutionSlug =
  | 'tpv'
  | 'comandero'
  | 'cocina'
  | 'carta-qr'
  | 'reservas'
  | 'pedidos'
  | 'gestion'
  | 'informes'
  | 'clientes';

export type MockupKey =
  | 'tpv'
  | 'comandero'
  | 'kds'
  | 'carta'
  | 'reservas'
  | 'pedidos'
  | 'backoffice'
  | 'informes'
  | 'clientes';

export interface Feature {
  title: string;
  text: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Solution {
  slug: SolutionSlug;
  /** Nombre corto, para menús y tarjetas */
  navLabel: string;
  /** Nombre completo del módulo */
  name: string;
  /** Una línea: qué hace, en lenguaje de local */
  tagline: string;
  /** H1 de su página */
  title: string;
  /** Meta title (≤ 60 caracteres aprox.) */
  seoTitle: string;
  /** Meta description (≤ 155 caracteres aprox.) */
  description: string;
  /** Entradilla del hero */
  intro: string;
  /** Qué maqueta se enseña en el hero */
  mockup: MockupKey;
  /** Qué hace el módulo, en seis puntos concretos */
  features: Feature[];
  /** Cómo encaja con el resto de la plataforma */
  connected: Feature[];
  /** Dudas frecuentes de este módulo */
  faqs: Faq[];
  /** Módulos que se suelen contratar con este */
  related: SolutionSlug[];
  /** Si está en el plan base o es un módulo adicional (ver pricing.ts) */
  availability: 'base' | 'modulo' | 'roadmap';
}

export const solutions: Solution[] = [
  {
    slug: 'tpv',
    navLabel: 'TPV',
    name: 'TPV para hostelería',
    tagline: 'Cobra, divide cuentas y cierra caja sin esperas.',
    title: 'Un TPV pensado para la barra y la sala, no para una tienda',
    seoTitle: 'TPV para hostelería: restaurantes, bares y cafeterías',
    description:
      'TPV táctil para restaurantes y bares: mesas, tickets, cobros divididos, cierre de caja y facturación en un sistema conectado con comandero, cocina y gestión.',
    intro:
      'Pantalla táctil para abrir mesas, mandar a cocina, cobrar como quiera el cliente y cerrar el día con la caja cuadrada. Funciona en el equipo que ya tienes y sigue cobrando si se cae internet.',
    mockup: 'tpv',
    availability: 'base',
    features: [
      {
        title: 'Plano de sala y mesas',
        text: 'Ves el estado de cada mesa de un vistazo: libre, ocupada, pendiente de cobro. Unes y separas mesas en dos toques.',
      },
      {
        title: 'Cobro flexible',
        text: 'Efectivo, tarjeta, pago mixto, dividir por comensal o por plato, invitaciones y descuentos con motivo.',
      },
      {
        title: 'Carta con modificadores',
        text: 'Puntos de la carne, sin cebolla, extra de queso: cada variante llega a cocina escrita, no gritada.',
      },
      {
        title: 'Cierre de caja guiado',
        text: 'Arqueo con desglose por forma de pago, retiradas, propinas y diferencias. Se envía solo al correo del responsable.',
      },
      {
        title: 'Facturación en regla',
        text: 'Tickets y facturas simplificadas con los requisitos de la normativa española, preparados para los sistemas de registro de facturación (VeriFactu).',
      },
      {
        title: 'Funciona sin internet',
        text: 'Si se corta la conexión, el TPV sigue cobrando e imprimiendo. Sincroniza en cuanto vuelve.',
      },
    ],
    connected: [
      {
        title: 'Con el comandero',
        text: 'Lo que el camarero pide en la mesa aparece en el TPV y en cocina al instante.',
      },
      {
        title: 'Con la gestión',
        text: 'Cambias un precio en el backoffice y cambia en el TPV, la carta QR y los pedidos online.',
      },
      {
        title: 'Con los informes',
        text: 'Cada ticket alimenta las ventas por hora, por producto y por camarero sin exportar nada.',
      },
    ],
    faqs: [
      {
        q: '¿Necesito comprar hardware nuevo?',
        a: 'No necesariamente. El TPV funciona en tablets y equipos táctiles con navegador moderno. Si tu impresora de tickets es de red o USB estándar, lo normal es que sirva. Lo comprobamos en la demo.',
      },
      {
        q: '¿Qué pasa si se cae internet?',
        a: 'El TPV sigue funcionando en modo local: abre mesas, cobra e imprime. Cuando vuelve la conexión, sincroniza con el resto de dispositivos y con la gestión.',
      },
      {
        q: '¿Puedo tener varios TPV en el mismo local?',
        a: 'Sí. Barra, sala y terraza pueden tener su propio terminal compartiendo mesas y caja, o cajas separadas si lo prefieres.',
      },
    ],
    related: ['comandero', 'cocina', 'gestion'],
  },
  {
    slug: 'comandero',
    navLabel: 'Comandero',
    name: 'Comandero móvil',
    tagline: 'La comanda sale de la mesa y llega a cocina al instante.',
    title: 'El comandero que ahorra viajes y errores en cada servicio',
    seoTitle: 'Comandero móvil para restaurantes y bares',
    description:
      'Comandero para móvil y tablet: toma la comanda en la mesa, envíala a cocina y barra, cobra en sala y controla el estado de cada mesa en tiempo real.',
    intro:
      'Toma nota en el móvil con la misma carta del TPV, envía cada plato a su zona de preparación y cobra en la mesa si hace falta. Menos pasos a la barra, menos notas perdidas.',
    mockup: 'comandero',
    availability: 'modulo',
    features: [
      {
        title: 'Misma carta, mismos precios',
        text: 'No hay que mantener nada por duplicado: el comandero lee la carta del sistema, con sus alérgenos y modificadores.',
      },
      {
        title: 'Envío por zonas',
        text: 'Bebidas a la barra, platos a cocina, postres a su partida. Cada ticket sale donde toca.',
      },
      {
        title: 'Marchar por tiempos',
        text: 'Entrantes, principales y postres se marchan cuando lo decide el camarero, no cuando lo decide la impresora.',
      },
      {
        title: 'Agotados en tiempo real',
        text: 'Cuando cocina marca un plato como agotado, desaparece de todos los comanderos en ese momento.',
      },
      {
        title: 'Cobro en mesa',
        text: 'Con un datáfono compatible, el camarero cobra sin que el cliente tenga que acercarse a la barra.',
      },
      {
        title: 'Cualquier móvil',
        text: 'Funciona en Android e iOS a través del navegador o como aplicación instalada. Sin dispositivos propietarios.',
      },
    ],
    connected: [
      {
        title: 'Con la cocina',
        text: 'La comanda aparece en la pantalla de cocina con la mesa, la hora y las notas.',
      },
      {
        title: 'Con el TPV',
        text: 'La mesa abierta desde el comandero se cobra desde el TPV o desde el propio móvil.',
      },
      {
        title: 'Con los informes',
        text: 'Tiempos de servicio y ventas por camarero quedan registrados sin hacer nada.',
      },
    ],
    faqs: [
      {
        q: '¿Cuántos comanderos puedo usar?',
        a: 'Los que necesites. Se añaden por dispositivo y se pueden activar o desactivar según la temporada.',
      },
      {
        q: '¿Funciona en la terraza si el wifi llega mal?',
        a: 'El comandero guarda la comanda y la envía en cuanto recupera cobertura. Aun así, recomendamos revisar la red: lo miramos contigo en la puesta en marcha.',
      },
      {
        q: '¿Los camareros necesitan formación?',
        a: 'La interfaz sigue la lógica de la carta impresa: categorías, platos, modificadores. La mayoría de equipos lo usa con soltura en el primer servicio.',
      },
    ],
    related: ['tpv', 'cocina', 'carta-qr'],
  },
  {
    slug: 'cocina',
    navLabel: 'Cocina (KDS)',
    name: 'Pantalla de cocina (KDS)',
    tagline: 'Cocina y sala ven lo mismo. Se acaban los tickets perdidos.',
    title: 'Una pantalla de cocina que ordena el pase',
    seoTitle: 'Pantalla de cocina KDS para restaurantes',
    description:
      'Sistema de pantallas de cocina (KDS) para restaurantes: comandas ordenadas por tiempo, partidas, avisos de retraso y marcado de platos listos. Sin papel.',
    intro:
      'Las comandas llegan a la pantalla ordenadas por hora y partida. El cocinero marca lo que sale, la sala recibe el aviso y nadie vuelve a preguntar «¿qué falta de la 12?».',
    mockup: 'kds',
    availability: 'modulo',
    features: [
      {
        title: 'Comandas por tiempo',
        text: 'Cada ticket muestra cuántos minutos lleva en pantalla. Pasado el umbral que definas, cambia de estado.',
      },
      {
        title: 'Pantalla por partida',
        text: 'Fríos, calientes, plancha, postres: cada zona ve solo lo suyo y el pase ve el conjunto.',
      },
      {
        title: 'Platos listos y recogidos',
        text: 'Un toque marca el plato como listo; el camarero lo ve en su comandero y lo recoge.',
      },
      {
        title: 'Agotados desde cocina',
        text: 'El cocinero marca un producto agotado y deja de venderse en TPV, comandero y carta QR.',
      },
      {
        title: 'Todos los canales juntos',
        text: 'Sala, take away, delivery propio y pedidos de la carta QR entran en la misma cola, identificados por origen.',
      },
      {
        title: 'Historial del servicio',
        text: 'Al cerrar, sabes el tiempo medio por plato y por franja: dónde se atasca y por qué.',
      },
    ],
    connected: [
      {
        title: 'Con el comandero y el TPV',
        text: 'Todo lo que se pide en sala entra sin pasos intermedios ni papel.',
      },
      {
        title: 'Con los pedidos online',
        text: 'Los pedidos de recogida y envío se programan en la cola según su hora de entrega.',
      },
      {
        title: 'Con los informes',
        text: 'Los tiempos de cocina se cruzan con las ventas para detectar los platos que frenan el servicio.',
      },
    ],
    faqs: [
      {
        q: '¿Sustituye a la impresora de cocina?',
        a: 'Puede sustituirla o convivir con ella. Algunos locales mantienen la impresora como respaldo durante las primeras semanas.',
      },
      {
        q: '¿Qué pantalla necesito?',
        a: 'Cualquier pantalla o tablet con navegador. Para cocina recomendamos tamaños a partir de 15 pulgadas y, si hay grasa o humedad, una pantalla con protección adecuada.',
      },
      {
        q: '¿Se puede usar sin comandero?',
        a: 'Sí. Las comandas pueden entrar desde el TPV, desde la carta QR o desde pedidos online. El comandero es la forma más cómoda, no la única.',
      },
    ],
    related: ['comandero', 'tpv', 'pedidos'],
  },
  {
    slug: 'carta-qr',
    navLabel: 'Carta QR',
    name: 'Carta digital QR',
    tagline: 'La carta siempre al día, con fotos, alérgenos y pedido desde la mesa.',
    title: 'Una carta digital que se actualiza sola y puede recibir pedidos',
    seoTitle: 'Carta digital QR para restaurantes y bares',
    description:
      'Carta digital con código QR conectada al TPV: precios siempre actualizados, alérgenos, fotos, idiomas y pedido desde la mesa opcional. Sin comisiones por pedido.',
    intro:
      'El cliente escanea y ve la misma carta que tiene el TPV: si cambias un precio o se agota un plato, la carta lo refleja al momento. Si quieres, también puede pedir y pagar desde la mesa.',
    mockup: 'carta',
    availability: 'base',
    features: [
      {
        title: 'Una sola carta para todo',
        text: 'La carta QR es la del sistema. Nada que mantener aparte, nada que se desactualice.',
      },
      {
        title: 'Alérgenos e idiomas',
        text: 'Los 14 alérgenos de declaración obligatoria, filtros por dieta y traducciones por idioma.',
      },
      {
        title: 'Pedido desde la mesa',
        text: 'Opcional: el cliente pide y la comanda entra en cocina identificada con su mesa. Útil en terrazas y locales con mucho volumen.',
      },
      {
        title: 'Pago en mesa',
        text: 'Con pasarela de pago conectada, el cliente paga su parte desde el móvil y la mesa se cierra en el TPV.',
      },
      {
        title: 'Menú del día y horarios',
        text: 'Cartas distintas por franja horaria o día de la semana, programadas una vez.',
      },
      {
        title: 'Diseño sobrio y legible',
        text: 'Pensada para leerse bien en cualquier móvil, con tu logotipo y tus fotos, sin publicidad ni marca ajena.',
      },
    ],
    connected: [
      {
        title: 'Con la gestión',
        text: 'Productos, precios, fotos y alérgenos se editan una vez en el backoffice.',
      },
      {
        title: 'Con la cocina',
        text: 'Los pedidos desde la mesa entran en la pantalla de cocina como una comanda más.',
      },
      {
        title: 'Con clientes',
        text: 'Si el cliente lo acepta, su pedido queda asociado a su ficha para futuras visitas.',
      },
    ],
    faqs: [
      {
        q: '¿Cobráis comisión por los pedidos desde la carta?',
        a: 'No. La carta QR tiene una cuota fija por local. Las comisiones que puedan aplicar son las de tu pasarela de pago, si activas el pago en mesa.',
      },
      {
        q: '¿Puedo usar la carta QR sin que el cliente pueda pedir?',
        a: 'Sí. Puedes activarla solo como carta de consulta y abrir el pedido desde la mesa más adelante, por zonas o por horarios.',
      },
      {
        q: '¿Necesito imprimir códigos nuevos si cambio la carta?',
        a: 'No. El QR apunta siempre a la carta actual. Solo cambiarías los códigos si reorganizas las mesas.',
      },
    ],
    related: ['tpv', 'cocina', 'clientes'],
  },
  {
    slug: 'reservas',
    navLabel: 'Reservas',
    name: 'Reservas',
    tagline: 'Reservas online y por teléfono en el mismo libro, sin comisiones.',
    title: 'Un libro de reservas conectado con la sala',
    seoTitle: 'Software de reservas para restaurantes sin comisiones',
    description:
      'Gestión de reservas para restaurantes: reservas desde tu web y Google, confirmaciones automáticas, control de no-shows, turnos y plano de sala conectado con el TPV.',
    intro:
      'Las reservas que entran por tu web, por Google o por teléfono van al mismo libro. Confirmas con un mensaje automático, controlas los turnos y, cuando el cliente llega, la mesa ya está preparada en el TPV.',
    mockup: 'reservas',
    availability: 'modulo',
    features: [
      {
        title: 'Reservas desde tu web y Google',
        text: 'Un botón de reserva propio, sin intermediarios ni comisión por comensal.',
      },
      {
        title: 'Confirmación y recordatorio',
        text: 'Mensajes automáticos por correo o SMS el día antes. El cliente confirma o cancela con un toque.',
      },
      {
        title: 'Turnos y aforo',
        text: 'Defines turnos, duración por mesa y aforo por zona. El sistema solo ofrece lo que de verdad puedes servir.',
      },
      {
        title: 'Garantía con tarjeta',
        text: 'Para fechas señaladas o grupos, pide una tarjeta como garantía y aplica tu política de cancelación.',
      },
      {
        title: 'Lista de espera',
        text: 'Cuando no hay hueco, el cliente se apunta y recibe aviso si se libera una mesa.',
      },
      {
        title: 'Historial del cliente',
        text: 'Visitas anteriores, preferencias y notas del servicio, para recibir mejor a quien vuelve.',
      },
    ],
    connected: [
      {
        title: 'Con el TPV',
        text: 'La reserva se sienta en una mesa del plano y la mesa se abre desde ahí.',
      },
      {
        title: 'Con clientes',
        text: 'Cada reserva alimenta la ficha del cliente: frecuencia, gasto medio, alérgenos declarados.',
      },
      {
        title: 'Con los informes',
        text: 'Ocupación por turno, no-shows y origen de las reservas en el mismo panel que las ventas.',
      },
    ],
    faqs: [
      {
        q: '¿Hay comisión por reserva?',
        a: 'No. Las reservas se incluyen en el módulo con una cuota fija por local, sin coste por comensal.',
      },
      {
        q: '¿Puedo seguir usando una plataforma de reservas de terceros?',
        a: 'Sí. Las integraciones con plataformas externas están en nuestro plan de producto; mientras tanto, puedes anotar esas reservas en el mismo libro.',
      },
      {
        q: '¿Qué pasa con las reservas por teléfono?',
        a: 'Se anotan en el mismo libro desde el TPV, el comandero o el backoffice, con las mismas confirmaciones automáticas.',
      },
    ],
    related: ['tpv', 'clientes', 'informes'],
  },
  {
    slug: 'pedidos',
    navLabel: 'Pedidos online',
    name: 'Pedidos online',
    tagline: 'Take away y delivery propio desde tu web, directos a cocina.',
    title: 'Pedidos para recoger y a domicilio sin pagar comisión por cada venta',
    seoTitle: 'Pedidos online para restaurantes: take away y delivery propio',
    description:
      'Pedidos online para restaurantes: tu propia tienda de take away y delivery conectada con el TPV y la cocina, con pago online y horarios de recogida. Sin comisiones por pedido.',
    intro:
      'Tu carta, en una página de pedidos con tu marca. El cliente elige recogida o envío, paga online y el pedido entra en cocina con su hora. Los agregadores pueden seguir, pero tu canal propio deja de depender de ellos.',
    mockup: 'pedidos',
    availability: 'modulo',
    features: [
      {
        title: 'Tienda con tu marca',
        text: 'Una dirección propia (pedidos.tulocal.com) con tu carta, tus fotos y tu logotipo.',
      },
      {
        title: 'Recogida y envío propio',
        text: 'Franjas de recogida, zonas de reparto por código postal y pedido mínimo por zona.',
      },
      {
        title: 'Pago online',
        text: 'Tarjeta, Apple Pay y Google Pay a través de tu pasarela. El dinero llega a tu cuenta, no a la de un intermediario.',
      },
      {
        title: 'Entrada directa a cocina',
        text: 'El pedido aparece en la pantalla de cocina programado para su hora. Nada que teclear.',
      },
      {
        title: 'Control de capacidad',
        text: 'Límite de pedidos por franja para que el take away no hunda el servicio de sala.',
      },
      {
        title: 'Agregadores (en el plan de producto)',
        text: 'La conexión con plataformas de reparto externas está prevista para recibir sus pedidos en la misma cola.',
      },
    ],
    connected: [
      {
        title: 'Con la cocina',
        text: 'Pedidos online y comandas de sala comparten cola, ordenados por hora de salida.',
      },
      {
        title: 'Con la gestión',
        text: 'La carta online es la misma: agotados, precios y fotos se actualizan solos.',
      },
      {
        title: 'Con clientes',
        text: 'Cada pedido queda en la ficha del cliente, útil para campañas y fidelización.',
      },
    ],
    faqs: [
      {
        q: '¿Ponéis repartidores?',
        a: 'No. El módulo gestiona pedidos para recoger y para reparto con tu propio equipo. Los agregadores con flota propia se podrán conectar cuando esté disponible esa integración.',
      },
      {
        q: '¿Cuánto cuesta por pedido?',
        a: 'alaCarta no cobra comisión por pedido. Pagas la cuota del módulo y las comisiones de tu pasarela de pago.',
      },
      {
        q: '¿Puedo tener precios distintos para take away?',
        a: 'Sí. Cada canal puede tener su propia lista de precios y su propia disponibilidad de productos.',
      },
    ],
    related: ['cocina', 'carta-qr', 'clientes'],
  },
  {
    slug: 'gestion',
    navLabel: 'Gestión',
    name: 'Backoffice y gestión',
    tagline: 'Carta, precios, usuarios, inventario y facturación desde cualquier sitio.',
    title: 'El panel desde el que se gobierna el negocio',
    seoTitle: 'Software de gestión para restaurantes y bares',
    description:
      'Backoffice para hostelería: cartas y precios centralizados, usuarios y permisos, inventario y escandallos, facturación y control de varios locales desde un solo panel web.',
    intro:
      'Todo lo que no se hace en el servicio se hace aquí: cambiar la carta, dar de alta a un camarero, revisar el stock, emitir una factura o configurar un local nuevo. Desde el navegador, sin estar en el local.',
    mockup: 'backoffice',
    availability: 'base',
    features: [
      {
        title: 'Cartas y precios centralizados',
        text: 'Una carta maestra con variantes por local, canal o franja. Un cambio se propaga a todos los puntos de venta.',
      },
      {
        title: 'Usuarios y permisos',
        text: 'Roles por puesto: quién puede anular, hacer descuentos, ver informes o tocar la configuración.',
      },
      {
        title: 'Inventario y escandallos',
        text: 'Ficha técnica por plato, consumo teórico con cada venta, mermas y pedidos a proveedor.',
      },
      {
        title: 'Facturación',
        text: 'Facturas completas a partir de tickets, series por local y exportación para tu asesoría.',
      },
      {
        title: 'Multiempresa y multilocal',
        text: 'Varias sociedades y varios locales bajo la misma cuenta, con datos separados y vista conjunta.',
      },
      {
        title: 'Registro de actividad',
        text: 'Quién cambió qué y cuándo: anulaciones, descuentos, cambios de precio y accesos.',
      },
    ],
    connected: [
      {
        title: 'Con todos los puntos de venta',
        text: 'TPV, comandero, carta QR y pedidos online leen la misma configuración.',
      },
      {
        title: 'Con los informes',
        text: 'Los escandallos convierten las ventas en margen real por plato y por local.',
      },
      {
        title: 'Con tu asesoría',
        text: 'Acceso de solo lectura para la gestoría y exportaciones en los formatos habituales.',
      },
    ],
    faqs: [
      {
        q: '¿Puedo gestionar varios locales desde la misma cuenta?',
        a: 'Sí. Es la base de la plataforma: cada local tiene su configuración y sus datos, y el grupo los ve en conjunto.',
      },
      {
        q: '¿Hace falta instalar algo?',
        a: 'No. El backoffice es una aplicación web. Entras desde cualquier navegador con tu usuario.',
      },
      {
        q: '¿Se integra con mi programa de contabilidad?',
        a: 'Exporta ventas, facturas y cierres en formatos estándar. Las integraciones directas con programas de contabilidad están en el plan de producto.',
      },
    ],
    related: ['tpv', 'informes', 'clientes'],
  },
  {
    slug: 'informes',
    navLabel: 'Informes',
    name: 'Informes y datos',
    tagline: 'Ventas, márgenes y tiempos de servicio sin abrir una hoja de cálculo.',
    title: 'Los números del negocio, claros y a tiempo',
    seoTitle: 'Informes y analítica para restaurantes',
    description:
      'Informes para hostelería: ventas por hora, producto, camarero y canal; márgenes por plato; comparativas entre locales y cierres diarios automáticos en el móvil.',
    intro:
      'Qué se vende, a qué hora, con qué margen y en qué local. Los informes se construyen solos con cada ticket y llegan a tu móvil al cerrar el día.',
    mockup: 'informes',
    availability: 'base',
    features: [
      {
        title: 'Ventas en tiempo real',
        text: 'Lo que lleva cada local ahora mismo, comparado con el mismo día de la semana pasada.',
      },
      {
        title: 'Por producto y categoría',
        text: 'Los platos que más venden, los que más margen dejan y los que no se piden nunca.',
      },
      {
        title: 'Por hora y por día',
        text: 'Las franjas fuertes y las flojas, para ajustar turnos y ofertas con datos.',
      },
      {
        title: 'Por camarero y por canal',
        text: 'Ticket medio por persona, ventas de sala frente a take away, pedidos QR frente a comanda.',
      },
      {
        title: 'Cierre diario en el móvil',
        text: 'Un resumen del día en tu correo o en la app al cerrar, sin pedirlo.',
      },
      {
        title: 'Exportación',
        text: 'Cualquier informe se descarga en CSV o Excel y se comparte con la asesoría o con socios.',
      },
    ],
    connected: [
      {
        title: 'Con el TPV y el comandero',
        text: 'Cada venta y cada tiempo de servicio ya está registrado; no hay que exportar nada.',
      },
      {
        title: 'Con la gestión',
        text: 'Los escandallos convierten ventas en margen; los usuarios, en rendimiento por persona.',
      },
      {
        title: 'Con reservas y pedidos',
        text: 'Ocupación, no-shows y pedidos online en el mismo panel que las ventas.',
      },
    ],
    faqs: [
      {
        q: '¿Puedo ver los informes desde el móvil?',
        a: 'Sí. El backoffice está diseñado para móvil y escritorio, y el cierre diario llega como resumen al correo.',
      },
      {
        q: '¿Se pueden comparar locales?',
        a: 'Sí, siempre que estén en la misma cuenta. Ventas, ticket medio y margen por local en la misma vista.',
      },
      {
        q: '¿Guardáis el histórico?',
        a: 'Todo el histórico de tu cuenta queda disponible mientras mantengas la suscripción, y puedes exportarlo en cualquier momento.',
      },
    ],
    related: ['gestion', 'tpv', 'clientes'],
  },
  {
    slug: 'clientes',
    navLabel: 'Clientes',
    name: 'Clientes y fidelización',
    tagline: 'Sabe quién vuelve, cuánto gasta y cómo traerlo de nuevo.',
    title: 'Una ficha de cliente que se llena con cada visita',
    seoTitle: 'Fidelización de clientes para restaurantes',
    description:
      'CRM y fidelización para hostelería: fichas de cliente a partir de reservas, pedidos y pagos; tarjetas de puntos digitales, campañas por correo y segmentación por hábitos.',
    intro:
      'Las reservas, los pedidos online y los pagos en mesa ya dicen quién es cada cliente. alaCarta lo guarda en una ficha y te deja premiar a quien vuelve sin tarjetas de cartón ni sorteos.',
    mockup: 'clientes',
    availability: 'modulo',
    features: [
      {
        title: 'Ficha automática',
        text: 'Reservas, pedidos y pagos se asocian al cliente con su consentimiento. Sin fichas que rellenar a mano.',
      },
      {
        title: 'Programa de puntos',
        text: 'Puntos por euro gastado o por visita, canjeables en el TPV o en la carta QR. Tú defines las reglas.',
      },
      {
        title: 'Campañas sencillas',
        text: 'Correo a quien no viene desde hace dos meses, aviso de menú nuevo a quien pide los martes.',
      },
      {
        title: 'Segmentos por hábitos',
        text: 'Clientes de mediodía, de fin de semana, de take away. Cada grupo con su mensaje.',
      },
      {
        title: 'Opiniones',
        text: 'Tras la visita, una petición de valoración que te llega a ti antes que a internet.',
      },
      {
        title: 'Protección de datos',
        text: 'Consentimientos registrados, baja en un clic y datos alojados en la Unión Europea.',
      },
    ],
    connected: [
      {
        title: 'Con reservas y pedidos',
        text: 'Son la fuente principal de la ficha: cada interacción suma información.',
      },
      {
        title: 'Con el TPV',
        text: 'Los puntos se acumulan y se canjean en el mismo cobro.',
      },
      {
        title: 'Con los informes',
        text: 'Clientes nuevos frente a recurrentes y el gasto medio de cada segmento.',
      },
    ],
    faqs: [
      {
        q: '¿Cómo se identifica al cliente en sala?',
        a: 'Por teléfono o correo al reservar, por su cuenta al pedir online o por el pago en mesa desde la carta QR. En barra, el camarero puede buscarlo o leer su tarjeta digital.',
      },
      {
        q: '¿Cumple con la protección de datos?',
        a: 'La plataforma registra los consentimientos y permite ejercer los derechos de acceso y supresión. La responsabilidad del tratamiento sigue siendo tuya como negocio; nosotros actuamos como encargados.',
      },
      {
        q: '¿Puedo importar mi base de clientes actual?',
        a: 'Sí, desde un archivo CSV, siempre que tengas la base legal para seguir tratando esos datos.',
      },
    ],
    related: ['reservas', 'pedidos', 'carta-qr'],
  },
];

export const getSolution = (slug: SolutionSlug) => {
  const found = solutions.find((s) => s.slug === slug);
  if (!found) throw new Error(`Solución desconocida: ${slug}`);
  return found;
};

export const solutionPath = (slug: SolutionSlug) => `/soluciones/${slug}`;
