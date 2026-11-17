/**
 * El ecosistema de alaCarta: familias, productos (soluciones) y entradas de equipamiento. Fuente
 * única de su copy: el menú, el pie, la home, el índice de soluciones, precios, novedades y cada
 * página de producto leen de aquí.
 *
 * Todo forma parte de un mismo sistema: comparten la carta, los precios, las mesas, los clientes,
 * los usuarios y los datos. Esa es la idea que vende alaCarta y la que esta estructura refleja.
 *
 * Honestidad estructural (docs/auditoria/01 §4):
 * - `status` dice si un producto está disponible, en piloto o en camino. Solo se enseña el chip
 *   cuando NO está disponible. Decisión de Jordi (16-11-2026): «en camino» solo en app propia,
 *   llamadas con IA y ERP; el resto, como hoy.
 * - Las integraciones que todavía no existen llevan `status: 'en-camino'` en `connections`.
 */
import type { IconName } from '@/components/ui/icons';
import type { HardwareSlug } from './hardware';

/* ── Tipos ─────────────────────────────────────────────────────────── */

export type FamilyId = 'servicio' | 'canales' | 'gestion' | 'equipamiento';

export type SolutionSlug =
  | 'tpv'
  | 'comandero'
  | 'cocina'
  | 'carta-qr'
  | 'reservas'
  | 'pedidos-online'
  | 'app-propia'
  | 'llamadas-ia'
  | 'clientes'
  | 'web-para-restaurantes'
  | 'backoffice'
  | 'erp'
  | 'rrhh';

/** Entradas de la familia «equipamiento» con página propia fuera de /soluciones */
export type EquipmentSlug = 'hardware' | 'placas-qr' | 'puesta-en-marcha';

/** Cualquier pieza del ecosistema */
export type EcosystemSlug = SolutionSlug | EquipmentSlug;

export type SolutionStatus = 'disponible' | 'piloto' | 'en-camino';

export type MockupKey =
  | 'tpv'
  | 'comandero'
  | 'kds'
  | 'carta'
  | 'reservas'
  | 'tienda-online'
  | 'backoffice'
  | 'panel-ventas'
  | 'clientes'
  | 'app'
  | 'web'
  | 'llamada'
  | 'erp'
  | 'rrhh';

export type DemoKey = 'simulador' | 'carta' | 'cambio-canales' | 'llamada' | 'placa';

export interface Feature {
  title: string;
  text: string;
  /** Si esta capacidad todavía no está hecha */
  status?: 'en-camino';
}

/** Bloque de capacidades con su propio título (backoffice: «Configurar» y «Ver») */
export interface FeatureGroup {
  title: string;
  text?: string;
  features: Feature[];
}

/**
 * Cifra de MERCADO con su fuente, nunca de clientes (docs/auditoria/04 §2). Si no hay fuente
 * pública que la sostenga, no se publica.
 */
export interface ProofPoint {
  value: string;
  label: string;
  source: string;
}

export interface Faq {
  q: string;
  a: string;
}

/** Con qué se conecta un producto y qué gana con ello */
export interface Connection {
  to: EcosystemSlug;
  title: string;
  text: string;
  /** Si la integración todavía no existe */
  status?: 'en-camino';
}

export interface Family {
  id: FamilyId;
  /** Nombre de la familia: «Servicio en sala y cocina» */
  name: string;
  /** Nombre corto para columnas estrechas (pie) */
  shortName: string;
  /** Mensaje de apoyo: «Servir mejor» */
  claim: string;
  /** Una o dos líneas que lo explican */
  text: string;
  icon: IconName;
  order: number;
}

export interface Solution {
  slug: SolutionSlug;
  family: FamilyId;
  icon: IconName;
  status: SolutionStatus;
  /** Matiz del estado, si no está disponible: «Sin fecha cerrada» */
  statusNote?: string;
  /** Nombre corto, para menús y tarjetas */
  navLabel: string;
  /** Nombre completo del producto */
  name: string;
  /** Una línea: qué hace, en lenguaje de local */
  tagline: string;
  /** H1 de su página */
  title: string;
  /** Meta title (≤ 60 caracteres) */
  seoTitle: string;
  /** Meta description (≤ 155 caracteres) */
  description: string;
  /** Entradilla del hero */
  intro: string;
  /** Qué maqueta se enseña en el hero (las de productos nuevos son provisionales) */
  mockup: MockupKey;
  /** Variante del hero en la plantilla de producto (docs/auditoria/04 §4) */
  heroVariant?: 'device' | 'split' | 'demo';
  /** Demo interactiva asociada (docs/auditoria/10) */
  demo?: DemoKey;
  /** Equipamiento recomendado (docs/auditoria/08) */
  hardware?: HardwareSlug[];
  /** Lo que deja de hacer o de pagar el local */
  replaces?: string[];
  /** Frase de resultado que cierra «Lo que dejas de hacer» */
  outcome?: string;
  /** Qué hace, en seis puntos concretos */
  features: Feature[];
  /** Si se quiere contar «Qué hace» en bloques con título (sustituye a `features` en la página) */
  featureGroups?: FeatureGroup[];
  /** Para quién es, cuando no basta con los sectores (ERP: propietario, grupos, gestoría) */
  forWho?: Feature[];
  /** Datos del sector con fuente que sostienen el problema */
  proofPoints?: ProofPoint[];
  /** Con qué se conecta del resto del ecosistema */
  connections: Connection[];
  /** Dudas frecuentes de este producto */
  faqs: Faq[];
  /** Titular del cierre de su página: «Ver el TPV con tu carta» */
  closingTitle: string;
  /** Productos que se suelen contratar con este */
  related: EcosystemSlug[];
  /** Tipo de JSON-LD: software o servicio */
  schemaType?: 'software' | 'service';
}

export interface EquipmentEntry {
  slug: EquipmentSlug;
  family: 'equipamiento';
  icon: IconName;
  status: SolutionStatus;
  statusNote?: string;
  navLabel: string;
  name: string;
  tagline: string;
  path: string;
  /** Con qué se conecta (mapa del ecosistema, D7) */
  connections?: Connection[];
}

/** Vista común de cualquier pieza del ecosistema, para menús, rejillas y tablas */
export interface EcosystemItem {
  slug: EcosystemSlug;
  family: FamilyId;
  icon: IconName;
  status: SolutionStatus;
  statusNote?: string;
  navLabel: string;
  name: string;
  tagline: string;
  path: string;
  /** true si tiene página bajo /soluciones */
  isSolution: boolean;
}

/* ── Familias ──────────────────────────────────────────────────────── */

export const families: Family[] = [
  {
    id: 'servicio',
    name: 'Servicio en sala y cocina',
    shortName: 'Servicio',
    claim: 'Servir mejor',
    text: 'La comanda sale de la mesa y llega a cocina y a caja sin que nadie la copie.',
    icon: 'bell',
    order: 1,
  },
  {
    id: 'canales',
    name: 'Clientes y canales',
    shortName: 'Clientes y canales',
    claim: 'Vender más, sin comisiones',
    text: 'Tus reservas, tus pedidos, tu app y tu teléfono, con tu marca y sin pagar por cada cliente.',
    icon: 'megaphone',
    order: 2,
  },
  {
    id: 'gestion',
    name: 'Gestión del negocio',
    shortName: 'Gestión',
    claim: 'Controlar el negocio',
    text: 'Ventas, compras, stock, facturas y horas de tu equipo en el mismo sitio.',
    icon: 'briefcase',
    order: 3,
  },
  {
    id: 'equipamiento',
    name: 'Equipamiento y servicios',
    shortName: 'Equipamiento',
    claim: 'Empezar sin líos',
    text: 'Hardware, placas QR y puesta en marcha: te lo dejamos funcionando.',
    icon: 'package',
    order: 4,
  },
];

export const getFamily = (id: FamilyId) => {
  const found = families.find((f) => f.id === id);
  if (!found) throw new Error(`Familia desconocida: ${id}`);
  return found;
};

/** Etiqueta visible de cada estado (el chip solo se pinta si no es «disponible») */
export const statusLabels: Record<SolutionStatus, string> = {
  disponible: 'Disponible',
  piloto: 'En piloto',
  'en-camino': 'En camino',
};

/* ── Productos ─────────────────────────────────────────────────────── */

export const solutions: Solution[] = [
  /* ── Servicio en sala y cocina ─────────────────────────────────── */
  {
    slug: 'tpv',
    family: 'servicio',
    icon: 'tpv',
    status: 'disponible',
    navLabel: 'TPV',
    name: 'TPV para hostelería',
    tagline: 'Cobra, divide cuentas y cierra caja sin esperas.',
    title: 'Un TPV pensado para la barra y la sala, no para una tienda',
    seoTitle: 'TPV para hostelería: restaurantes y bares',
    description:
      'TPV táctil para restaurantes y bares: mesas, tickets, cobros divididos, cierre de caja y facturación, conectado con comandero, cocina y gestión.',
    intro:
      'Pantalla táctil para abrir mesas, mandar a cocina, cobrar como quiera el cliente y cerrar el día con la caja cuadrada. Funciona en el equipo que ya tienes y sigue cobrando si se cae internet.',
    mockup: 'tpv',
    heroVariant: 'device',
    demo: 'simulador',
    hardware: ['terminal', 'impresora', 'cajon', 'datafono'],
    replaces: [
      'Cuadrar la caja a mano',
      'Copiar los precios en tres sitios',
      'Pagar licencia por cada caja de la terraza',
      'Quedarte sin cobrar si se cae internet',
    ],
    outcome:
      'Cobras rápido, cierras con la caja cuadrada y sigues vendiendo aunque falle la conexión.',
    features: [
      {
        title: 'Plano de sala y modo barra',
        text: 'Ves el estado de cada mesa de un vistazo y unes o separas mesas en dos toques. En barra, vendes sin abrir mesa.',
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
    connections: [
      {
        to: 'comandero',
        title: 'Con el comandero',
        text: 'Lo que el camarero pide en la mesa aparece en el TPV y en cocina al instante.',
      },
      {
        to: 'cocina',
        title: 'Con la cocina',
        text: 'Cada comanda sale hacia su partida con la mesa, la hora y las notas.',
      },
      {
        to: 'carta-qr',
        title: 'Con la carta QR',
        text: 'El pedido que hace el cliente desde la mesa entra como una comanda más y la mesa se cobra aquí.',
      },
      {
        to: 'reservas',
        title: 'Con las reservas',
        text: 'La mesa reservada aparece en el plano antes de que llegue el cliente.',
      },
      {
        to: 'backoffice',
        title: 'Con el backoffice',
        text: 'Cambias un precio en el backoffice y cambia en el TPV, la carta QR y los pedidos online. Cada ticket alimenta los informes.',
      },
      {
        to: 'llamadas-ia',
        title: 'Con las llamadas con IA',
        text: 'Los pedidos que toma el asistente por teléfono se aceptan en el TPV antes de ir a cocina.',
      },
      {
        to: 'erp',
        title: 'Con el ERP',
        text: 'El resumen diario de ventas pasa a la contabilidad y las facturas a empresas salen desde el TPV.',
        status: 'en-camino',
      },
      {
        to: 'rrhh',
        title: 'Con Equipo y RRHH',
        text: 'El camarero ficha desde el mismo TPV al empezar el turno.',
        status: 'en-camino',
      },
    ],
    faqs: [
      {
        q: '¿Necesito comprar hardware nuevo?',
        a: 'No necesariamente. El TPV funciona en tablets y equipos táctiles con navegador moderno. Si tu impresora de tickets es de red o USB estándar, lo normal es que sirva. Lo comprobamos en la demo.',
      },
      {
        q: '¿Funciona en Android, iPad y Windows?',
        a: 'Sí. El TPV funciona en el navegador, así que sirve en tablets Android, iPad y equipos Windows con un navegador actualizado.',
      },
      {
        q: '¿Qué pasa si se cae internet?',
        a: 'El TPV sigue funcionando en modo local: abre mesas, cobra e imprime. Cuando vuelve la conexión, sincroniza con el resto de dispositivos y con la gestión.',
      },
      {
        q: '¿Puedo tener varios TPV en el mismo local?',
        a: 'Sí. Barra, sala y terraza pueden tener su propio terminal compartiendo mesas y caja, o cajas separadas si lo prefieres.',
      },
      {
        q: '¿Qué datáfonos son compatibles?',
        a: 'La lista de datáfonos compatibles está en preparación. Si ya tienes uno de tu banco, dinos el modelo y lo comprobamos antes de empezar.',
      },
      {
        q: '¿Se puede fichar desde el TPV?',
        a: 'Todavía no: el fichaje desde el TPV está en camino. Hoy el equipo ficha con Equipo y RRHH, desde el móvil o en una tablet en la entrada.',
      },
    ],
    closingTitle: 'Ver el TPV con tu carta',
    related: ['comandero', 'cocina', 'backoffice'],
  },
  {
    slug: 'comandero',
    family: 'servicio',
    icon: 'phone',
    status: 'disponible',
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
    heroVariant: 'device',
    demo: 'simulador',
    hardware: ['movil', 'datafono'],
    replaces: [
      'La libreta y el boli',
      'Los viajes a la barra con cada comanda',
      'La letra que nadie entiende en cocina',
      '«¿Esto quién lo pidió?»',
    ],
    outcome: 'La comanda sale de la mesa y llega a cocina escrita, completa y a su hora.',
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
    connections: [
      {
        to: 'cocina',
        title: 'Con la cocina',
        text: 'La comanda aparece en la pantalla de cocina con la mesa, la hora y las notas.',
      },
      {
        to: 'tpv',
        title: 'Con el TPV',
        text: 'La mesa abierta desde el comandero se cobra desde el TPV o desde el propio móvil.',
      },
      {
        to: 'carta-qr',
        title: 'Con la carta QR',
        text: 'Lo que se agota desaparece a la vez del comandero y de la carta que ve el cliente.',
      },
      {
        to: 'backoffice',
        title: 'Con el backoffice',
        text: 'La carta y los agotados llegan solos; los tiempos de servicio y las ventas por camarero quedan registrados.',
      },
      {
        to: 'rrhh',
        title: 'Con Equipo y RRHH',
        text: 'Ventas por camarero y por turno, cruzadas con las horas trabajadas.',
        status: 'en-camino',
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
      {
        q: '¿Sirven los móviles que ya tenemos?',
        a: 'Normalmente sí, si son Android o iPhone recientes. Si prefieres móviles dedicados, te los enviamos configurados con funda y cargador.',
      },
    ],
    closingTitle: 'Ver el comandero con tu carta',
    related: ['tpv', 'cocina', 'carta-qr'],
  },
  {
    slug: 'cocina',
    family: 'servicio',
    icon: 'kitchen',
    status: 'disponible',
    navLabel: 'Pantalla de cocina',
    name: 'Pantalla de cocina (KDS)',
    tagline: 'Cocina y sala ven lo mismo. Se acaban los tickets perdidos.',
    title: 'Una pantalla de cocina que ordena el pase',
    seoTitle: 'Pantalla de cocina KDS para restaurantes',
    description:
      'Sistema de pantallas de cocina (KDS) para restaurantes: comandas ordenadas por tiempo, partidas, avisos de retraso y marcado de platos listos. Sin papel.',
    intro:
      'Las comandas llegan a la pantalla ordenadas por hora y partida. El cocinero marca lo que sale, la sala recibe el aviso y nadie vuelve a preguntar «¿qué falta de la 12?».',
    mockup: 'kds',
    heroVariant: 'device',
    demo: 'simulador',
    hardware: ['pantalla-cocina', 'impresora'],
    replaces: [
      'Tickets de papel que se pierden o se mojan',
      'Los gritos en el pase',
      'Platos que se olvidan',
      'Las comandas de delivery en otra tableta',
    ],
    outcome: 'Cada plato en su partida y a su tiempo, y la sala sabe cuándo está listo.',
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
    connections: [
      {
        to: 'comandero',
        title: 'Con el comandero y el TPV',
        text: 'Todo lo que se pide en sala entra sin pasos intermedios ni papel.',
      },
      {
        to: 'pedidos-online',
        title: 'Con los pedidos online',
        text: 'Los pedidos de recogida y envío se programan en la cola según su hora de entrega.',
      },
      {
        to: 'app-propia',
        title: 'Con la app propia',
        text: 'Los pedidos de tu app entran en la misma cola que los de sala.',
      },
      {
        to: 'llamadas-ia',
        title: 'Con las llamadas con IA',
        text: 'Los pedidos telefónicos aceptados en el TPV llegan a cocina como uno más.',
      },
      {
        to: 'backoffice',
        title: 'Con el backoffice',
        text: 'Los tiempos de cocina se cruzan con las ventas para detectar los platos que frenan el servicio.',
      },
      {
        to: 'erp',
        title: 'Con el ERP',
        text: 'Lo que sale de cocina descuenta su receta del stock del almacén.',
        status: 'en-camino',
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
      {
        q: '¿Puedo tener una pantalla por partida?',
        a: 'Sí. Cada partida puede tener su pantalla con solo lo suyo, y el pase una vista de conjunto. Las pantallas adicionales se suman por unidad.',
      },
    ],
    closingTitle: 'Ver la pantalla de cocina con tus platos',
    related: ['comandero', 'tpv', 'pedidos-online'],
  },
  {
    slug: 'carta-qr',
    family: 'servicio',
    icon: 'qr',
    status: 'disponible',
    navLabel: 'Carta digital QR',
    name: 'Carta digital QR',
    tagline: 'La carta siempre al día, con alérgenos y pedido desde la mesa.',
    title: 'Una carta digital que se actualiza sola y puede recibir pedidos',
    seoTitle: 'Carta digital QR para restaurantes y bares',
    description:
      'Carta digital QR conectada al TPV: precios siempre al día, alérgenos, fotos, idiomas y pedido desde la mesa opcional. Sin comisiones por pedido.',
    intro:
      'El cliente escanea y ve la misma carta que tiene el TPV: si cambias un precio o se agota un plato, la carta lo refleja al momento. Si quieres, también puede pedir y pagar desde la mesa.',
    mockup: 'carta',
    heroVariant: 'demo',
    demo: 'carta',
    hardware: ['placas-qr'],
    replaces: [
      'Reimprimir la carta cada vez que cambia un precio',
      'El PDF que nadie actualiza',
      'Los alérgenos apuntados a mano',
      'Las cartas plastificadas pegajosas',
    ],
    outcome: 'Una carta que siempre dice la verdad: precios, alérgenos y agotados al día.',
    features: [
      {
        title: 'Una sola carta para todo',
        text: 'La carta QR es la del sistema, con tu logo y tus fotos, sin publicidad ni marca ajena. Nada que mantener aparte.',
      },
      {
        title: 'Alérgenos, filtros e idiomas',
        text: 'Los 14 alérgenos de declaración obligatoria, filtros por alérgeno y por dieta, y traducciones por idioma.',
      },
      {
        title: 'Menú del día por horario',
        text: 'Cartas distintas por franja horaria o día de la semana, programadas una vez.',
      },
      {
        title: 'Pedir, llamar y pedir la cuenta',
        text: 'Opcional: el cliente pide desde la mesa, avisa al camarero o pide la cuenta. Todo llega identificado con su mesa.',
      },
      {
        title: 'Pago en mesa',
        text: 'Con pasarela de pago conectada, el cliente paga su parte desde el móvil y la mesa se cierra en el TPV.',
      },
      {
        title: 'Valoraciones y reseña en Google',
        text: 'Después de pagar, una valoración que te llega a ti y una invitación a dejar tu reseña en Google.',
        status: 'en-camino',
      },
    ],
    connections: [
      {
        to: 'backoffice',
        title: 'Con el backoffice',
        text: 'Productos, precios, fotos y alérgenos se editan una vez en el backoffice.',
      },
      {
        to: 'cocina',
        title: 'Con la cocina',
        text: 'Los pedidos desde la mesa entran en la pantalla de cocina como una comanda más.',
      },
      {
        to: 'tpv',
        title: 'Con el TPV',
        text: 'Lo que se paga desde el móvil cierra la mesa en el TPV.',
      },
      {
        to: 'clientes',
        title: 'Con clientes',
        text: 'Si el cliente lo acepta, su pedido queda asociado a su ficha para futuras visitas.',
      },
      {
        to: 'web-para-restaurantes',
        title: 'Con tu web',
        text: 'La misma carta aparece en tu web, siempre al día.',
      },
      {
        to: 'placas-qr',
        title: 'Con las placas QR',
        text: 'Cada placa identifica su mesa: el cliente pide y paga sin decir el número.',
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
      {
        q: '¿Tengo que comprar placas QR?',
        a: 'No es obligatorio. Puedes imprimir los códigos tú mismo o pedirnos placas para las mesas, con el número de mesa y NFC opcional.',
      },
    ],
    closingTitle: 'Ver tu carta en el móvil de tus clientes',
    related: ['tpv', 'cocina', 'clientes'],
  },

  /* ── Clientes y canales ────────────────────────────────────────── */
  {
    slug: 'reservas',
    family: 'canales',
    icon: 'calendar',
    status: 'disponible',
    navLabel: 'Reservas',
    name: 'Reservas',
    tagline: 'Reservas online y por teléfono en el mismo libro, sin comisiones.',
    title: 'Un libro de reservas conectado con la sala',
    seoTitle: 'Reservas para restaurantes, sin comisiones',
    description:
      'Reservas para restaurantes desde tu web y Google: confirmaciones automáticas, control de no-shows, turnos y plano de sala conectado con el TPV.',
    intro:
      'Las reservas que entran por tu web, por Google o por teléfono van al mismo libro. Confirmas con un mensaje automático, controlas los turnos y, cuando el cliente llega, la mesa ya está preparada en el TPV.',
    mockup: 'reservas',
    heroVariant: 'device',
    replaces: [
      'Pagar por cada comensal que reserva',
      'Apuntar las reservas en una libreta',
      'Los no-shows sin ninguna garantía',
      'Llamar uno a uno para confirmar',
    ],
    outcome: 'Un libro de reservas que confirma solo, avisa a tiempo y no cobra por comensal.',
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
    connections: [
      {
        to: 'tpv',
        title: 'Con el TPV',
        text: 'La reserva se sienta en una mesa del plano y la mesa se abre desde ahí.',
      },
      {
        to: 'clientes',
        title: 'Con clientes',
        text: 'Cada reserva alimenta la ficha del cliente: frecuencia, gasto medio, alérgenos declarados.',
      },
      {
        to: 'llamadas-ia',
        title: 'Con las llamadas con IA',
        text: 'Las reservas que toma el asistente por teléfono entran en el libro por confirmar.',
      },
      {
        to: 'app-propia',
        title: 'Con la app propia',
        text: 'Tus clientes reservan desde tu app con las mismas reglas de turnos y aforo.',
      },
      {
        to: 'web-para-restaurantes',
        title: 'Con tu web',
        text: 'El botón de reservar de tu web y de tu ficha de Google escribe en este mismo libro.',
      },
      {
        to: 'backoffice',
        title: 'Con el backoffice',
        text: 'Ocupación por turno, no-shows y origen de las reservas en el mismo panel que las ventas.',
      },
    ],
    proofPoints: [
      {
        value: '3,3 %',
        label: 'de las reservas acabaron en no-show en España en 2025, de media.',
        source: 'TheFork, datos de 2025',
      },
      {
        value: '0,66 %',
        label: 'de no-shows cuando la reserva se garantiza con tarjeta o prepago.',
        source: 'CoverManager, muestra de 9.500 restaurantes, 2025',
      },
    ],
    faqs: [
      {
        q: '¿Hay comisión por reserva?',
        a: 'No. Las reservas se incluyen con una cuota fija por local, sin coste por comensal.',
      },
      {
        q: '¿Puedo seguir usando una plataforma de reservas de terceros?',
        a: 'Sí. Las integraciones con plataformas externas están en nuestro plan de producto; mientras tanto, puedes anotar esas reservas en el mismo libro.',
      },
      {
        q: '¿Qué pasa con las reservas por teléfono?',
        a: 'Se anotan en el mismo libro desde el TPV, el comandero o el backoffice, con las mismas confirmaciones automáticas.',
      },
      {
        q: '¿Funciona con Reserva con Google?',
        a: 'El botón de reserva de tu ficha de Google puede apuntar a tu libro. La integración directa con Reserva con Google está en camino.',
      },
    ],
    closingTitle: 'Ver el libro de reservas con tus turnos',
    related: ['tpv', 'clientes', 'llamadas-ia'],
  },
  {
    slug: 'pedidos-online',
    family: 'canales',
    icon: 'bag',
    status: 'disponible',
    navLabel: 'Pedidos online',
    name: 'Pedidos online',
    tagline: 'Take away y reparto propio desde tu web, directos a cocina.',
    title: 'Pedidos para recoger y a domicilio sin pagar comisión por cada venta',
    seoTitle: 'Pedidos online para restaurantes, sin comisión',
    description:
      'Tu tienda de take away y reparto propio, conectada con el TPV y la cocina, con pago online y franjas de recogida. Sin comisión por pedido.',
    intro:
      'Tu carta, en una página de pedidos con tu marca que enlazas desde Instagram, Google o tu web. El cliente elige recogida o envío, paga online y el pedido entra en cocina con su hora. Los agregadores pueden seguir, pero tu canal propio deja de depender de ellos.',
    mockup: 'tienda-online',
    heroVariant: 'device',
    replaces: [
      'Pagar un 14-30 % por pedido a un agregador por clientes que ya eran tuyos',
      'Apuntar los pedidos por teléfono en un papel',
      'Teclear en el TPV lo que llega por otra tableta',
    ],
    outcome: 'Tus pedidos, con tu marca, directos a cocina y sin comisión por venta.',
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
        title: 'Agregadores en la misma cola',
        text: 'La conexión con Glovo, Uber Eats y Just Eat está en el plan de producto, para recibir sus pedidos en la misma cola.',
        status: 'en-camino',
      },
    ],
    connections: [
      {
        to: 'cocina',
        title: 'Con la cocina',
        text: 'Pedidos online y comandas de sala comparten cola, ordenados por hora de salida.',
      },
      {
        to: 'backoffice',
        title: 'Con el backoffice',
        text: 'La carta online es la misma: agotados, precios y fotos se actualizan solos.',
      },
      {
        to: 'clientes',
        title: 'Con clientes',
        text: 'Cada pedido queda en la ficha del cliente, útil para campañas y fidelización.',
      },
      {
        to: 'app-propia',
        title: 'Con la app propia',
        text: 'La misma tienda, dentro de una app con tu icono en el móvil del cliente.',
      },
      {
        to: 'web-para-restaurantes',
        title: 'Con tu web',
        text: 'El botón de pedir de tu web abre directamente tu tienda.',
      },
    ],
    faqs: [
      {
        q: '¿Ponéis repartidores?',
        a: 'No. Gestiona pedidos para recoger y para reparto con tu propio equipo. Los agregadores con flota propia se podrán conectar cuando esté disponible esa integración.',
      },
      {
        q: '¿Cuánto cuesta por pedido?',
        a: 'alaCarta no cobra comisión por pedido. Pagas la cuota fija y las comisiones de tu pasarela de pago.',
      },
      {
        q: '¿Puedo tener precios distintos para take away?',
        a: 'Sí. Cada canal puede tener su propia lista de precios y su propia disponibilidad de productos.',
      },
      {
        q: '¿En qué se diferencia de la app propia?',
        a: 'Los pedidos online son una tienda web que enlazas desde donde quieras. La app propia es esa misma tienda, más las reservas y los puntos, instalada en el móvil del cliente con tu marca.',
      },
    ],
    closingTitle: 'Ver tu tienda de pedidos con tu carta',
    related: ['cocina', 'app-propia', 'clientes'],
  },
  {
    slug: 'app-propia',
    family: 'canales',
    icon: 'app',
    status: 'en-camino',
    statusNote: 'En desarrollo, sin fecha cerrada. Primera versión como app web instalable.',
    navLabel: 'App propia',
    name: 'App propia de reservas y pedidos',
    tagline: 'Tu app con tu marca: reservas, pedidos y puntos, sin comisiones.',
    title: 'Tu app de reservas y pedidos, con tu nombre y sin comisiones',
    seoTitle: 'App propia para restaurantes: reservas y pedidos',
    description:
      'App con la marca de tu restaurante para reservar, pedir para recoger o a domicilio y sumar puntos, conectada con tu cocina. Sin comisión por pedido.',
    intro:
      'Tus clientes la instalan en el móvil con tu logo y tus colores. Desde ahí reservan, piden para recoger o a domicilio con tu reparto y suman puntos. La app no te trae clientes nuevos: hace que los que ya tienes vuelvan y pidan directo.',
    mockup: 'app',
    heroVariant: 'device',
    replaces: [
      'Pagar comisión por cada pedido de un cliente que ya es tuyo',
      'Depender de una plataforma para hablar con tus clientes',
      'Las tarjetas de puntos de cartón',
    ],
    outcome: 'Tus clientes vuelven y piden directo, desde una app con tu nombre.',
    features: [
      {
        title: 'Reservas en dos toques',
        text: 'Día, hora y número de personas. La reserva entra en tu libro con las mismas reglas de turnos y aforo.',
      },
      {
        title: 'Pedidos para recoger y a domicilio',
        text: 'Con franjas de recogida y zonas de reparto propio. El pedido llega a cocina con su hora.',
      },
      {
        title: 'Pago online',
        text: 'El cliente paga desde la app a través de tu pasarela. El dinero va a tu cuenta.',
      },
      {
        title: 'Carta siempre sincronizada',
        text: 'Es la carta del sistema: precios, fotos, alérgenos y agotados al día sin tocar nada.',
      },
      {
        title: 'Puntos y avisos',
        text: 'Con Clientes y fidelización, cada pedido y cada visita suman. Avisos de novedades a quien lo acepte.',
      },
      {
        title: 'Sin registro obligatorio',
        text: 'Se puede pedir sin crear cuenta. Para quien la crea, repetir el último pedido es un toque.',
      },
    ],
    connections: [
      {
        to: 'pedidos-online',
        title: 'Con los pedidos online',
        text: 'Es la misma tienda, con los mismos precios, zonas y franjas.',
      },
      {
        to: 'reservas',
        title: 'Con las reservas',
        text: 'Las reservas de la app entran en tu libro como las de la web.',
      },
      {
        to: 'clientes',
        title: 'Con clientes',
        text: 'Los puntos y la ficha del cliente se comparten con la sala y el TPV.',
      },
      {
        to: 'tpv',
        title: 'Con el TPV',
        text: 'Los pedidos de la app y los puntos del cliente se ven en el mismo TPV de la sala.',
      },
      {
        to: 'cocina',
        title: 'Con la cocina',
        text: 'Los pedidos de la app entran en la misma cola que los de sala.',
      },
      {
        to: 'web-para-restaurantes',
        title: 'Con tu web',
        text: 'Tu web invita a instalar la app a quien vuelve.',
      },
      {
        to: 'placas-qr',
        title: 'Con las placas QR',
        text: 'Después de pagar en la mesa, una invitación a instalar la app.',
        status: 'en-camino',
      },
    ],
    faqs: [
      {
        q: '¿Estará en App Store y Google Play?',
        a: 'La primera versión será una app web instalable: el cliente la añade a la pantalla de inicio con tu icono, sin pasar por las tiendas. La publicación en App Store y Google Play está en estudio y no la prometemos hasta tenerla decidida.',
      },
      {
        q: '¿Me traerá clientes nuevos?',
        a: 'No es su función. La app hace que los clientes que ya tienes vuelvan y pidan directo, sin comisión. Para que te conozcan funcionan mejor Google, tu web y, si quieres, los agregadores.',
      },
      {
        q: '¿Cobraréis comisión por pedido o por reserva?',
        a: 'No. Será una cuota fija por local. Las únicas comisiones serán las de tu pasarela de pago.',
      },
      {
        q: '¿En qué se diferencia de los pedidos online?',
        a: 'Los pedidos online son una tienda web que enlazas desde Instagram, Google o tu web. La app propia es esa misma tienda, más las reservas y los puntos, instalada en el móvil del cliente con tu marca.',
      },
      {
        q: '¿Cuándo estará disponible?',
        a: 'Está en desarrollo y no tiene fecha cerrada. Si te interesa, dínoslo en la demo y te avisamos en cuanto se pueda probar.',
      },
    ],
    closingTitle: 'Ver cómo sería la app de tu local',
    related: ['pedidos-online', 'clientes', 'reservas'],
  },
  {
    slug: 'llamadas-ia',
    family: 'canales',
    icon: 'ai-call',
    status: 'en-camino',
    statusNote: 'En preparación, sin fecha cerrada.',
    navLabel: 'Llamadas con IA',
    name: 'Llamadas con IA',
    tagline: 'Un asistente coge el teléfono cuando tú no puedes.',
    title: 'Un asistente que coge el teléfono cuando tú no puedes',
    seoTitle: 'Atención telefónica con IA para restaurantes',
    description:
      'Asistente de voz para tu restaurante: toma reservas por confirmar y pedidos para recoger, y responde con tu carta y tu horario. La IA propone, tú decides.',
    intro:
      'En pleno servicio nadie puede coger el teléfono, y cada llamada perdida es una mesa o un pedido que se va a otro sitio. El asistente atiende, deja la reserva o el pedido en el sistema y tú lo confirmas. La IA propone, tú decides.',
    mockup: 'llamada',
    heroVariant: 'device',
    demo: 'llamada',
    replaces: [
      'Dejar sonar el teléfono en pleno servicio',
      'Apuntar reservas en un pósit con prisa',
      'Perder el pedido de quien no vuelve a llamar',
    ],
    outcome: 'El teléfono se atiende aunque estés en pleno servicio, y tú decides qué se confirma.',
    features: [
      {
        title: 'Reservas por confirmar',
        text: 'Toma día, hora y personas y deja la reserva en tu libro pendiente de confirmar. También anula reservas desde el mismo número.',
      },
      {
        title: 'Pedidos para recoger',
        text: 'Anota el pedido y lo deja en el TPV para que lo aceptes antes de que pase a cocina. Si nadie lo acepta, caduca.',
      },
      {
        title: 'Responde con tu carta',
        text: 'Horario, dirección y platos los lee del sistema: no se inventa platos ni precios.',
      },
      {
        title: 'Pasa a una persona',
        text: 'Ante una alergia grave, una queja o un grupo grande, deriva la llamada al local.',
      },
      {
        title: 'Se presenta como asistente',
        text: 'Lo dice al empezar la llamada y guarda solo los datos necesarios para la reserva o el pedido.',
      },
      {
        title: 'Minutos, no comisiones',
        text: 'Cuota fija con minutos incluidos; el minuto de más se paga aparte. Nunca por reserva ni por pedido: una llamada se paga una vez, acabe en lo que acabe.',
      },
    ],
    connections: [
      {
        to: 'reservas',
        title: 'Con las reservas',
        text: 'La reserva telefónica entra en el libro por confirmar, con las reglas de turnos y aforo.',
      },
      {
        to: 'tpv',
        title: 'Con el TPV',
        text: 'Los pedidos para recoger esperan en el TPV hasta que alguien del local los acepta.',
      },
      {
        to: 'cocina',
        title: 'Con la cocina',
        text: 'Una vez aceptado, el pedido entra en la cola de cocina con su hora de recogida.',
      },
      {
        to: 'backoffice',
        title: 'Con el backoffice',
        text: 'Lee la carta, los alérgenos y los horarios del sistema: si los cambias, responde con lo nuevo.',
      },
      {
        to: 'clientes',
        title: 'Con clientes',
        text: 'Reconoce al cliente que llama y su historial de visitas.',
        status: 'en-camino',
      },
    ],
    faqs: [
      {
        q: '¿La IA confirma reservas sola?',
        a: 'No. Las deja por confirmar en tu libro y tú decides. Lo mismo con los pedidos: no pasan a cocina hasta que alguien del local los acepta.',
      },
      {
        q: '¿Toma pedidos a domicilio?',
        a: 'En la primera versión, solo pedidos para recoger. Los pedidos a domicilio por teléfono no están previstos de inicio.',
      },
      {
        q: '¿Qué pasa si el cliente pregunta por alérgenos?',
        a: 'Responde con la información de alérgenos de tu carta. Si es una alergia grave o una duda que no está en la carta, pasa la llamada a una persona.',
      },
      {
        q: '¿El cliente sabe que habla con un asistente?',
        a: 'Sí. Se presenta como asistente al empezar la llamada. Los datos que guarda son los mínimos para la reserva o el pedido.',
      },
      {
        q: '¿Cuándo estará disponible?',
        a: 'Está en preparación y no tiene fecha cerrada. En la demo te contamos su estado real.',
      },
    ],
    closingTitle: 'Ver cómo atendería el teléfono de tu local',
    related: ['reservas', 'tpv', 'pedidos-online'],
  },
  {
    slug: 'clientes',
    family: 'canales',
    icon: 'users',
    status: 'disponible',
    navLabel: 'Clientes y fidelización',
    name: 'Clientes y fidelización',
    tagline: 'Sabe quién vuelve, cuánto gasta y cómo traerlo de nuevo.',
    title: 'Una ficha de cliente que se llena con cada visita',
    seoTitle: 'Fidelización de clientes para restaurantes',
    description:
      'Fidelización para hostelería: fichas de cliente a partir de reservas, pedidos y pagos, puntos digitales, campañas por correo y segmentos por hábitos.',
    intro:
      'Las reservas, los pedidos online y los pagos en mesa ya dicen quién es cada cliente. alaCarta lo guarda en una ficha y te deja premiar a quien vuelve sin tarjetas de cartón ni sorteos.',
    mockup: 'clientes',
    heroVariant: 'device',
    replaces: [
      'Tarjetas de sellos que se pierden',
      'No saber quién no ha vuelto desde hace meses',
      'Campañas a toda la base con el mismo mensaje',
    ],
    outcome: 'Sabes quién vuelve y quién no, y a cada uno le llega su mensaje.',
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
    connections: [
      {
        to: 'reservas',
        title: 'Con reservas y pedidos',
        text: 'Son la fuente principal de la ficha: cada interacción suma información.',
      },
      {
        to: 'tpv',
        title: 'Con el TPV',
        text: 'Los puntos se acumulan y se canjean en el mismo cobro.',
      },
      {
        to: 'app-propia',
        title: 'Con la app propia',
        text: 'El cliente ve sus puntos y sus pedidos en tu app.',
      },
      {
        to: 'carta-qr',
        title: 'Con la carta QR',
        text: 'Después de pagar en la mesa, el cliente puede darse de alta con su consentimiento.',
      },
      {
        to: 'web-para-restaurantes',
        title: 'Con tu web',
        text: 'El formulario de tu web suma clientes a la misma base, con su consentimiento.',
      },
      {
        to: 'llamadas-ia',
        title: 'Con las llamadas con IA',
        text: 'El asistente reconoce al cliente que llama y su historial.',
        status: 'en-camino',
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
      {
        q: '¿Puedo mandar campañas por WhatsApp?',
        a: 'Las campañas salen por correo. Otros canales, como SMS o mensajería, los valoramos contigo según el caso y siempre con el consentimiento del cliente.',
      },
    ],
    closingTitle: 'Ver lo que sabrías de tus clientes',
    related: ['reservas', 'pedidos-online', 'app-propia'],
  },
  {
    slug: 'web-para-restaurantes',
    family: 'canales',
    icon: 'globe',
    status: 'disponible',
    navLabel: 'Web y presencia en Google',
    name: 'Web y presencia en Google',
    tagline: 'Una web que reserva, vende y aparece en Google, hecha por nosotros.',
    title: 'Una web que reserva, vende y aparece en Google. Hecha y mantenida por nosotros',
    seoTitle: 'Página web para restaurantes, hecha y mantenida',
    description:
      'Web para restaurantes con la carta sincronizada, botones de reservar y pedir, Perfil de Empresa de Google cuidado y mantenimiento. El dominio, a tu nombre.',
    intro:
      'Diseñamos tu web sobre una plantilla sobria, con tus textos, tus fotos y la carta del sistema, que se actualiza sola. Añadimos los botones de reservar y pedir, cuidamos tu ficha de Google y la mantenemos al día. El dominio es tuyo.',
    mockup: 'web',
    heroVariant: 'device',
    schemaType: 'service',
    replaces: [
      'Una web que nadie actualiza desde que se hizo',
      'La carta en PDF con los precios del año pasado',
      'Un horario en Google y otro en la puerta',
    ],
    outcome:
      'Una web al día, con tu carta, tus botones de reservar y pedir y tu ficha de Google cuidada.',
    features: [
      {
        title: 'Diseño a medida, sin complicaciones',
        text: 'Sobre una plantilla sobria y rápida, con tu logo, tus fotos y tus textos. Pensada para leerse bien en el móvil.',
      },
      {
        title: 'La carta, sincronizada',
        text: 'La carta de la web es la del sistema: cambias un precio en el backoffice y cambia también aquí.',
      },
      {
        title: 'Reservar y pedir',
        text: 'Botones de reserva y de pedido conectados con tu libro y tu tienda, si los tienes contratados.',
      },
      {
        title: 'Perfil de Empresa de Google',
        text: 'Alta y revisión de tu ficha: categorías, horarios, fotos, carta y enlace de reserva.',
      },
      {
        title: 'Datos coherentes en internet',
        text: 'El mismo nombre, dirección, teléfono y horario en tu web, en Google y en los directorios principales, con un informe mensual sencillo.',
      },
      {
        title: 'Mantenimiento incluido',
        text: 'Alojamiento, certificado de seguridad, copias y cambios de temporada. El dominio, a tu nombre.',
      },
    ],
    connections: [
      {
        to: 'backoffice',
        title: 'Con el backoffice',
        text: 'La carta, los precios y los alérgenos de la web salen del mismo sitio que los del TPV.',
      },
      {
        to: 'reservas',
        title: 'Con las reservas',
        text: 'El botón de reservar escribe directamente en tu libro.',
      },
      {
        to: 'pedidos-online',
        title: 'Con los pedidos online',
        text: 'El botón de pedir abre tu tienda, sin comisión.',
      },
      {
        to: 'app-propia',
        title: 'Con la app propia',
        text: 'Quien vuelve a tu web puede instalar tu app.',
      },
      {
        to: 'clientes',
        title: 'Con clientes',
        text: 'Los contactos de la web llegan a tu base de clientes con su consentimiento.',
      },
      {
        to: 'carta-qr',
        title: 'Con la carta QR',
        text: 'Después de pagar en la mesa, una invitación a dejar tu reseña en Google.',
        status: 'en-camino',
      },
    ],
    faqs: [
      {
        q: '¿Cuánto se tarda en tenerla?',
        a: 'Te damos una fecha concreta en la propuesta. Depende sobre todo de que tengamos tus textos, tus fotos y tu carta.',
      },
      {
        q: '¿El dominio es mío?',
        a: 'Sí. Se registra a tu nombre. Si un día decides irte, te lo llevas.',
      },
      {
        q: '¿Me garantizáis salir el primero en Google?',
        a: 'No. Nadie puede garantizarlo con honestidad. Lo que sí hacemos es que tu ficha y tu web estén completas, coherentes y al día, que es lo que depende de ti.',
      },
      {
        q: '¿Puedo contratar la web sin cambiar de TPV?',
        a: 'Sí. Es una buena forma de empezar. Mantenemos tu carta en alaCarta y, si más adelante añades el TPV o la carta QR, todo usa ya la misma carta.',
      },
    ],
    closingTitle: 'Ver cómo quedaría la web de tu local',
    related: ['reservas', 'pedidos-online', 'app-propia'],
  },

  /* ── Gestión del negocio ───────────────────────────────────────── */
  {
    slug: 'backoffice',
    family: 'gestion',
    icon: 'dashboard',
    status: 'disponible',
    navLabel: 'Backoffice e informes',
    name: 'Backoffice e informes',
    tagline: 'Carta, precios, escandallos y los números del negocio en un panel.',
    title: 'El panel desde el que ves y gobiernas el negocio',
    seoTitle: 'Backoffice e informes para restaurantes y bares',
    description:
      'Backoffice para hostelería: carta y precios por canal, escandallos, usuarios y permisos, ventas en tiempo real y cierre diario en el móvil.',
    intro:
      'Todo lo que no se hace en el servicio se hace aquí: cambiar la carta, dar de alta a un camarero, saber cuánto te cuesta un plato o ver cómo va el día. Desde el navegador, estés donde estés.',
    mockup: 'backoffice',
    heroVariant: 'device',
    demo: 'cambio-canales',
    replaces: [
      'Cambiar el mismo precio en tres sitios',
      'Esperar a fin de mes para saber si ganaste dinero',
      'La hoja de cálculo de escandallos que nadie actualiza',
    ],
    outcome: 'Cambias una vez, se cambia en todo, y ves cómo va el día desde el móvil.',
    features: [
      {
        title: 'Carta maestra y precios por canal',
        text: 'Una carta con variantes por local, canal o franja, con sus alérgenos. Un cambio llega al TPV, al comandero, a la carta QR y a la tienda online.',
      },
      {
        title: 'Escandallos y coste por plato',
        text: 'Receta, coste y margen de cada plato, con el stock de cocina descontado con cada venta.',
      },
      {
        title: 'Usuarios, permisos y registro',
        text: 'Roles por puesto y quién cambió qué y cuándo: anulaciones, descuentos, precios y accesos.',
      },
      {
        title: 'Ventas en tiempo real',
        text: 'Por producto, hora, camarero y canal, comparadas con el mismo día de la semana pasada.',
      },
      {
        title: 'Cierre diario en el móvil',
        text: 'El resumen del día llega al correo del responsable al cerrar, sin pedirlo.',
      },
      {
        title: 'Varios locales, una vista',
        text: 'Cada local con su configuración y sus datos, y el grupo comparado en la misma pantalla. Todo se exporta en CSV o Excel.',
      },
    ],
    featureGroups: [
      {
        title: 'Configurar',
        text: 'Lo que montas una vez y cambias cuando quieras, para todos los canales a la vez.',
        features: [
          {
            title: 'Carta maestra y precios por canal',
            text: 'Una carta con sus alérgenos y variantes por local, canal o franja. Un cambio llega al TPV, al comandero, a la carta QR y a la tienda online.',
          },
          {
            title: 'Escandallos y coste por plato',
            text: 'Receta, coste y margen de cada plato, con el stock de cocina descontado con cada venta.',
          },
          {
            title: 'Mesas, dispositivos e impresoras',
            text: 'Zonas y mesas del plano, terminales, comanderos, pantallas de cocina y a qué impresora va cada cosa.',
          },
          {
            title: 'Usuarios, permisos y registro',
            text: 'Roles por puesto y quién cambió qué y cuándo: anulaciones, descuentos, precios y accesos.',
          },
        ],
      },
      {
        title: 'Ver',
        text: 'Los números del negocio mientras pasan, no a fin de mes.',
        features: [
          {
            title: 'Ventas en tiempo real',
            text: 'Por producto, hora, camarero y canal, comparadas con el mismo día de la semana pasada.',
          },
          {
            title: 'Cierre diario en el móvil',
            text: 'El resumen del día llega al correo del responsable al cerrar, sin pedirlo.',
          },
          {
            title: 'Varios locales, una vista',
            text: 'Cada local con su configuración y sus datos, y el grupo comparado en la misma pantalla.',
          },
          {
            title: 'Exportación',
            text: 'Ventas, cierres y productos en CSV o Excel, para ti o para tu gestoría.',
          },
        ],
      },
    ],
    connections: [
      {
        to: 'tpv',
        title: 'Con todos los puntos de venta',
        text: 'TPV, comandero, carta QR y pedidos online leen la misma carta, precios y usuarios.',
      },
      {
        to: 'cocina',
        title: 'Con la cocina',
        text: 'Los tiempos de cocina se cruzan con las ventas por plato y por franja.',
      },
      {
        to: 'reservas',
        title: 'Con reservas y pedidos',
        text: 'Ocupación, no-shows y pedidos online en el mismo panel que las ventas.',
      },
      {
        to: 'erp',
        title: 'Con el ERP',
        text: 'Ventas y compras cruzadas para ver el margen real, no el teórico.',
        status: 'en-camino',
      },
      {
        to: 'rrhh',
        title: 'Con Equipo y RRHH',
        text: 'Coste de personal frente a ventas, hora a hora: a qué hora te sobra o te falta gente.',
        status: 'en-camino',
      },
    ],
    faqs: [
      {
        q: '¿Puedo gestionar varios locales desde la misma cuenta?',
        a: 'Sí. Es la base de la plataforma: cada local tiene su configuración y sus datos, y el grupo los ve en conjunto.',
      },
      {
        q: '¿Hace falta instalar algo?',
        a: 'No. El backoffice es una aplicación web. Entras desde cualquier navegador con tu usuario, también desde el móvil.',
      },
      {
        q: '¿Y la contabilidad?',
        a: 'Compras, facturas de proveedor, tesorería y contabilidad van en el ERP de alaCarta, que está en camino. Mientras tanto, el backoffice exporta ventas y cierres para tu gestoría.',
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
    closingTitle: 'Ver el backoffice con tu carta',
    related: ['tpv', 'erp', 'rrhh'],
  },
  {
    slug: 'erp',
    family: 'gestion',
    icon: 'erp',
    status: 'en-camino',
    statusNote: 'En preparación para alaCarta, sin fecha cerrada.',
    navLabel: 'ERP',
    name: 'ERP para hostelería',
    tagline: 'Compras, proveedores, stock, facturas y contabilidad.',
    title: 'Compras, proveedores, facturas y contabilidad, sin salir de alaCarta',
    seoTitle: 'ERP para hostelería: compras, stock y facturación',
    description:
      'ERP para restaurantes y grupos: proveedores, compras, almacén, facturas a empresas, tesorería, contabilidad y modelos de IVA, con acceso para tu gestoría.',
    intro:
      'La parte administrativa del negocio en el mismo sistema: lo que compras, lo que tienes en el almacén, lo que facturas a empresas y lo que llega al banco. Tu gestoría entra con su propio acceso.',
    mockup: 'erp',
    heroVariant: 'device',
    replaces: [
      'Pasar a mano las facturas de proveedor a una hoja',
      'Contar el almacén sin saber cuánto vale',
      'Llevar a la gestoría una caja de papeles cada trimestre',
    ],
    outcome:
      'Compras, almacén, facturas y banco en el mismo sitio, y tu gestoría entra a por lo que necesita.',
    features: [
      {
        title: 'Proveedores y compras',
        text: 'Proveedores con su fiscalidad, pedidos de compra, recepciones, facturas de proveedor y gastos recurrentes.',
      },
      {
        title: 'Almacén y stock',
        text: 'Almacenes, traspasos entre locales, recuentos, stock mínimo y valoración a coste medio.',
      },
      {
        title: 'Facturas a empresas',
        text: 'Del presupuesto al pedido, el albarán y la factura, con facturas simplificadas y rectificativas.',
      },
      {
        title: 'Tesorería y bancos',
        text: 'Cuentas, extractos bancarios en Norma 43, conciliación, remesas SEPA y previsión de cobros y pagos.',
      },
      {
        title: 'Contabilidad e impuestos',
        text: 'Plan general contable, asientos automáticos, libros y cierre. Libros de IVA y modelos 303, 111 y 347.',
      },
      {
        title: 'Acceso para la gestoría',
        text: 'Tu asesoría entra con su usuario, consulta y exporta, con registro de quién hace qué.',
      },
    ],
    forWho: [
      {
        title: 'Quien lleva la administración',
        text: 'El propietario o gerente que hoy pasa facturas a mano y quiere saber qué compra, qué tiene y qué debe.',
      },
      {
        title: 'Grupos con varias sociedades',
        text: 'Cada sociedad con su contabilidad, y los locales de una misma empresa compartiéndola.',
      },
      {
        title: 'Tu gestoría',
        text: 'Entra con su propio usuario, consulta y exporta lo que necesita sin pedirte papeles.',
      },
    ],
    connections: [
      {
        to: 'tpv',
        title: 'Con el TPV',
        text: 'El resumen diario de ventas genera su asiento y las facturas a empresas se emiten desde el TPV.',
        status: 'en-camino',
      },
      {
        to: 'backoffice',
        title: 'Con el backoffice',
        text: 'Las compras alimentan el coste de cada escandallo, y el margen por plato se calcula con precios reales.',
        status: 'en-camino',
      },
      {
        to: 'cocina',
        title: 'Con la cocina',
        text: 'Lo que sale de cocina descuenta su receta del stock del almacén.',
        status: 'en-camino',
      },
    ],
    faqs: [
      {
        q: '¿Está preparado para la factura electrónica y VeriFactu?',
        a: 'Está diseñado con la normativa de facturación española en mente y preparado para la factura electrónica. No lo anunciamos como certificado: en la demo te contamos el estado exacto.',
      },
      {
        q: '¿Tengo que dejar a mi gestoría?',
        a: 'No. Al contrario: tu gestoría entra con su propio acceso, consulta lo que necesita y exporta. Deja de recibir papeles sueltos.',
      },
      {
        q: '¿Va por local o por empresa?',
        a: 'Por empresa. Varios locales de la misma sociedad comparten contabilidad; si tienes varias sociedades, cada una lleva la suya.',
      },
      {
        q: '¿Las ventas del TPV pasan solas a la contabilidad?',
        a: 'Todavía no. Esa conexión está en camino. Hasta entonces, los cierres del backoffice se exportan para tu gestoría.',
      },
      {
        q: '¿Lee las facturas de proveedor automáticamente?',
        a: 'No. De momento las facturas de proveedor se registran en el ERP. No prometemos lectura automática hasta tenerla funcionando.',
      },
    ],
    closingTitle: 'Ver el ERP con tus compras',
    related: ['backoffice', 'rrhh', 'tpv'],
  },
  {
    slug: 'rrhh',
    family: 'gestion',
    icon: 'team',
    status: 'disponible',
    navLabel: 'Equipo y RRHH',
    name: 'Equipo y RRHH',
    tagline: 'Fichajes, turnos y vacaciones, sin papeles ni grupos de WhatsApp.',
    title: 'Fichajes, turnos y vacaciones de tu equipo, sin papeles ni grupos de WhatsApp',
    seoTitle: 'Control horario y turnos para hostelería',
    description:
      'Fichaje en el móvil o en una tablet con PIN, cuadrante de turnos, vacaciones, horas extra y cierre del mes para la gestoría. Registro exportable.',
    intro:
      'El registro de jornada es obligatorio desde 2019 y en hostelería los turnos cambian cada semana. Tu equipo ficha desde el móvil o en una tablet en la entrada, ve su cuadrante y pide vacaciones; tú lo apruebas y la gestoría recibe el mes cerrado.',
    mockup: 'rrhh',
    heroVariant: 'device',
    hardware: ['tablet-fichaje'],
    replaces: [
      'El cuadrante en un grupo de WhatsApp',
      'Las hojas de firmas que se pierden',
      'Sumar a mano las horas de cada uno a fin de mes',
    ],
    outcome:
      'Cada uno ficha, ve su turno y pide sus días; tú apruebas y la gestoría recibe el mes cerrado.',
    features: [
      {
        title: 'Fichaje sin excusas',
        text: 'Desde el móvil, también sin cobertura, o en una tablet en la entrada con PIN. Geocerca opcional y un registro que no se puede borrar, con rastro de cada corrección.',
      },
      {
        title: 'Cuadrante de turnos',
        text: 'Publicas la semana, el equipo intercambia turnos y coge turnos abiertos, con descansos y reglas de jornada.',
      },
      {
        title: 'Vacaciones y ausencias',
        text: 'Solicitudes con aprobación, cobertura mínima por puesto, festivos y calendarios por local.',
      },
      {
        title: 'Horas extra y cierre del mes',
        text: 'Bolsa de horas, horas extra y un cierre mensual firmado por cada persona. Registro exportable para una inspección.',
      },
      {
        title: 'Lo que necesita la gestoría',
        text: 'Las variables del mes listas para la nómina y el reparto de nóminas en PDF. La nómina la sigue calculando tu gestoría.',
      },
      {
        title: 'Documentos y comunicación',
        text: 'Documentos con firma, avisos internos, canal de denuncias, formación y prevención de riesgos.',
      },
    ],
    forWho: [
      {
        title: 'Locales con turnos que cambian',
        text: 'Turnos partidos, refuerzos de fin de semana y temporada: el cuadrante se publica y se cambia sin llamar a nadie.',
      },
      {
        title: 'Quien no quiere cambiar de TPV',
        text: 'Equipo y RRHH funciona por su cuenta. Es una buena forma de empezar con alaCarta.',
      },
      {
        title: 'Tu gestoría',
        text: 'Recibe el mes cerrado con horas, extras y ausencias, en lugar de hojas sueltas.',
      },
    ],
    proofPoints: [
      {
        value: '63,8 %',
        label: 'de rotación en hostelería, la más alta de todos los sectores.',
        source: 'Randstad Research, 2026',
      },
      {
        value: '2.800–5.000 €',
        label: 'cuesta reemplazar a una persona del equipo.',
        source: 'Randstad Research y Linkers, 2026',
      },
      {
        value: '2019',
        label:
          'Desde entonces el registro de jornada es obligatorio. El registro digital todavía no está aprobado.',
        source: 'Real Decreto-ley 8/2019. Revisado el 16-11-2026',
      },
    ],
    connections: [
      {
        to: 'tpv',
        title: 'Con el TPV',
        text: 'Fichar desde el TPV al empezar el turno, sin otro dispositivo.',
        status: 'en-camino',
      },
      {
        to: 'backoffice',
        title: 'Con el backoffice',
        text: 'Coste de personal frente a ventas, hora a hora: a qué hora te sobra o te falta gente.',
        status: 'en-camino',
      },
      {
        to: 'comandero',
        title: 'Con el comandero',
        text: 'Ventas por camarero y por turno, junto a sus horas trabajadas.',
        status: 'en-camino',
      },
    ],
    faqs: [
      {
        q: '¿Es obligatorio el registro de jornada digital?',
        a: 'El registro de jornada es obligatorio desde 2019 (Real Decreto-ley 8/2019). El real decreto que exigirá que sea digital no está aprobado ni publicado a 16 de noviembre de 2026. Equipo y RRHH está preparado para el registro digital y te avisaremos si cambia la norma.',
      },
      {
        q: '¿Calcula las nóminas?',
        a: 'No. Prepara las variables del mes (horas, extras, ausencias) para tu gestoría y reparte las nóminas en PDF a cada persona. El cálculo lo hace tu gestoría.',
      },
      {
        q: '¿Puedo usarlo sin el TPV de alaCarta?',
        a: 'Sí. Equipo y RRHH funciona por su cuenta y es una buena forma de empezar. Cuando añadas el TPV, se conectan.',
      },
      {
        q: '¿Y si alguien no tiene móvil o no quiere usarlo?',
        a: 'Puede fichar en una tablet en la entrada del local con su PIN.',
      },
      {
        q: '¿Usa huella o reconocimiento facial?',
        a: 'No. Se ficha con el móvil o con un PIN; no se usan datos biométricos.',
      },
    ],
    closingTitle: 'Ver el cuadrante con tu equipo',
    related: ['backoffice', 'tpv', 'erp'],
  },
];

/* ── Equipamiento y servicios (páginas propias, fuera de /soluciones) ── */

export const equipment: EquipmentEntry[] = [
  {
    slug: 'hardware',
    family: 'equipamiento',
    icon: 'printer',
    status: 'disponible',
    navLabel: 'Hardware',
    name: 'Hardware para hostelería',
    tagline: 'Terminales, impresoras y pantallas configurados. O usa los tuyos.',
    path: '/hardware',
    connections: [
      {
        to: 'tpv',
        title: 'Con el TPV',
        text: 'Terminal, impresora de tickets y cajón llegan configurados con tu carta y tus mesas.',
      },
      {
        to: 'comandero',
        title: 'Con el comandero',
        text: 'Móviles para el comandero, listos para tomar comandas desde el primer día.',
      },
      {
        to: 'cocina',
        title: 'Con la cocina',
        text: 'Pantalla de cocina con su soporte, o impresora de cocina si prefieres papel.',
      },
    ],
  },
  {
    slug: 'placas-qr',
    family: 'equipamiento',
    icon: 'qr-plate',
    status: 'disponible',
    navLabel: 'Placas QR para mesas',
    name: 'Placas QR para mesas',
    tagline: 'Con QR y NFC, que no se despegan ni caducan.',
    path: '/hardware/placas-qr',
  },
  {
    slug: 'puesta-en-marcha',
    family: 'equipamiento',
    icon: 'wrench',
    status: 'disponible',
    navLabel: 'Puesta en marcha',
    name: 'Puesta en marcha',
    tagline: 'Migración, configuración y formación: te lo dejamos funcionando.',
    path: '/puesta-en-marcha',
    connections: [
      {
        to: 'backoffice',
        title: 'Con el backoffice',
        text: 'Cargamos tu carta, tus precios y tus alérgenos antes de abrir.',
      },
      {
        to: 'tpv',
        title: 'Con el TPV',
        text: 'Dejamos montados la sala, las mesas y las impresoras, y formamos a tu equipo.',
      },
      {
        to: 'hardware',
        title: 'Con el hardware',
        text: 'El equipo llega configurado y lo revisamos contigo.',
      },
    ],
  },
];

/* ── Cómo viaja un dato (hub de soluciones, docs/auditoria/04 §3.4) ─── */

export interface DataStoryStep {
  /** Pieza del ecosistema donde pasa este paso */
  at: EcosystemSlug;
  text: string;
  /** Si este paso depende de una integración que todavía no existe */
  status?: 'en-camino';
}

export interface DataStory {
  id: 'reserva' | 'plato' | 'hora';
  title: string;
  text: string;
  steps: DataStoryStep[];
}

/** Tres historias que cruzan familias: el mismo dato, de un producto a otro */
export const dataStories: DataStory[] = [
  {
    id: 'reserva',
    title: 'Una reserva',
    text: 'De la llamada a la siguiente visita.',
    steps: [
      {
        at: 'llamadas-ia',
        text: 'Un cliente llama en pleno servicio y el asistente toma la reserva.',
        status: 'en-camino',
      },
      { at: 'reservas', text: 'Entra en el libro por confirmar y tú la confirmas.' },
      { at: 'tpv', text: 'La mesa aparece reservada en el plano antes de que llegue.' },
      { at: 'clientes', text: 'La visita y el gasto suman en su ficha.' },
      { at: 'clientes', text: 'Si pasa dos meses sin volver, le llega tu campaña.' },
    ],
  },
  {
    id: 'plato',
    title: 'Un plato',
    text: 'Del escandallo al pedido al proveedor.',
    steps: [
      { at: 'backoffice', text: 'Lo das de alta con su receta, su coste y su precio.' },
      { at: 'carta-qr', text: 'Aparece a la vez en el TPV, la carta QR y la tienda online.' },
      { at: 'comandero', text: 'El camarero lo pide en la mesa.' },
      { at: 'cocina', text: 'Llega a su partida con la mesa, la hora y las notas.' },
      {
        at: 'erp',
        text: 'Su receta se descuenta del almacén y, si baja del mínimo, toca pedir al proveedor.',
        status: 'en-camino',
      },
    ],
  },
  {
    id: 'hora',
    title: 'Una hora de trabajo',
    text: 'Del cuadrante al coste de personal.',
    steps: [
      { at: 'rrhh', text: 'Publicas el cuadrante de la semana y cada uno ve su turno.' },
      {
        at: 'rrhh',
        text: 'El equipo ficha al llegar, desde el móvil o en la tablet de la entrada.',
      },
      { at: 'tpv', text: 'Esa hora el TPV registra lo que se vende.' },
      {
        at: 'backoffice',
        text: 'Coste de personal frente a ventas, hora a hora: a qué hora te sobra o te falta gente.',
        status: 'en-camino',
      },
    ],
  },
];

/* ── Ayudas ────────────────────────────────────────────────────────── */

export const solutionPath = (slug: SolutionSlug) => `/soluciones/${slug}`;

export const getSolution = (slug: SolutionSlug) => {
  const found = solutions.find((s) => s.slug === slug);
  if (!found) throw new Error(`Solución desconocida: ${slug}`);
  return found;
};

const toItem = (x: Solution | EquipmentEntry): EcosystemItem => ({
  slug: x.slug,
  family: x.family,
  icon: x.icon,
  status: x.status,
  statusNote: x.statusNote,
  navLabel: x.navLabel,
  name: x.name,
  tagline: x.tagline,
  path: 'path' in x ? x.path : solutionPath(x.slug),
  isSolution: !('path' in x),
});

/** Todo el ecosistema, en el orden de las familias */
export const ecosystem: EcosystemItem[] = [...solutions, ...equipment]
  .map(toItem)
  .sort((a, b) => getFamily(a.family).order - getFamily(b.family).order);

export const getItem = (slug: EcosystemSlug) => {
  const found = ecosystem.find((i) => i.slug === slug);
  if (!found) throw new Error(`Pieza del ecosistema desconocida: ${slug}`);
  return found;
};

/** Piezas de una familia, en su orden */
export const itemsByFamily = (id: FamilyId) => ecosystem.filter((i) => i.family === id);

/** Familias ordenadas con sus piezas */
export const familiesWithItems = () =>
  [...families]
    .sort((a, b) => a.order - b.order)
    .map((f) => ({ ...f, items: itemsByFamily(f.id) }));

export const isSolutionSlug = (slug: string): slug is SolutionSlug =>
  solutions.some((s) => s.slug === slug);
