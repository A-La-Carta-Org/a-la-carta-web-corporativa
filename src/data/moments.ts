/**
 * Los momentos de compra: en vez de por tipo de local, el visitante se reconoce por lo que le
 * está pasando (abrir, cambiar de TPV, dejar las comisiones). Fuente única para el menú, el pie y
 * las páginas `/momentos/*`.
 *
 * ESTADO: fase 8 (docs/auditoria/12 §4). Cada momento tiene su problema, su plan paso a paso, su
 * bloque propio (checklist de apertura, comparativa y migración, estrategia de canal propio), su
 * demo o herramienta y su FAQ. Los precios no se escriben aquí: `setup` es una configuración que
 * calcula `quote()` (src/lib/quote.ts).
 */
import type { IconName } from '@/components/ui/icons';
import type { QuoteConfig } from '@/lib/quote';
import type { HardwareKit } from './hardware';
import type { DemoBlockKey } from './sectors';
import type { EcosystemSlug, Faq } from './solutions';
import { onboardingSteps } from './onboarding';

export type MomentSlug = 'abrir-un-local' | 'cambiar-de-tpv' | 'dejar-las-comisiones';

export interface Moment {
  slug: MomentSlug;
  /** En primera persona, para el menú: «Voy a abrir un local» */
  navLabel: string;
  /** Nombre corto: «Abrir un local» */
  name: string;
  /** Una línea para menús y tarjetas */
  tagline: string;
  icon: IconName;
  /** H1 */
  title: string;
  /** ≤ 49 caracteres: con « | alaCarta» queda en ≤ 60 */
  seoTitle: string;
  /** ≤ 155 caracteres */
  description: string;
  intro: string;
  /** Motivo que llega al formulario de demo (src/lib/lead.ts) */
  motivo?: 'comisiones';
  /** Lo que preocupa en este momento */
  worries: { title: string; text: string }[];
  /** Cómo lo resolvemos, en pasos (con plazo orientativo si lo hay) */
  plan: { title: string; text: string; when?: string }[];
  planTitle: string;
  planText: string;
  /** Abrir: checklist de apertura con lo que resuelve alaCarta marcado */
  checklist?: {
    title: string;
    text: string;
    items: { text: string; covered: boolean; note: string }[];
  };
  /** Cambiar de TPV: «lo que tienes» frente al ecosistema */
  compare?: {
    title: string;
    text: string;
    rows: { need: string; before: string; after: string; piece?: EcosystemSlug }[];
  };
  /** Dejar las comisiones: los canales propios */
  channels?: {
    title: string;
    text: string;
    items: { piece: EcosystemSlug; title: string; text: string }[];
    /** La frase honesta sobre los agregadores */
    quote: string;
  };
  /** Configuración tipo, calculada con quote() */
  setup?: {
    config: Partial<QuoteConfig>;
    kits: HardwareKit['id'][];
    later: EcosystemSlug[];
    title: string;
    text: string;
    label: string;
  };
  demo: { key: DemoBlockKey; title: string; text: string };
  /** Productos y servicios que más pesan en este momento */
  links: EcosystemSlug[];
  faqs: Faq[];
}

export const moments: Moment[] = [
  {
    slug: 'abrir-un-local',
    navLabel: 'Voy a abrir un local',
    name: 'Abrir un local',
    tagline: 'Todo lo que necesitas para el primer servicio, de una vez.',
    icon: 'door',
    title: 'Vas a abrir un local: llega al primer servicio con todo funcionando',
    seoTitle: 'Abrir un restaurante o un bar con todo listo',
    description:
      'Vas a abrir un restaurante, un bar o una cafetería: TPV, carta QR, equipo, web y Google listos para el primer servicio. Cuota fija y sin permanencia.',
    intro:
      'Cuando abres, todo va a la vez: licencias, obra, carta, equipo, proveedores. Lo último que necesitas es montar cinco programas distintos. Te dejamos el sistema, el equipo y la carta listos para el primer servicio.',
    worries: [
      {
        title: 'El coste de arrancar',
        text: 'Cada euro antes de abrir pesa. Necesitas saber qué cuesta todo, al mes y de entrada, sin sorpresas.',
      },
      {
        title: 'Decidir rápido y bien',
        text: 'No hay tiempo para comparar diez proveedores ni para aprender un sistema complicado antes de la apertura.',
      },
      {
        title: 'Que el primer día funcione',
        text: 'El primer servicio es el peor momento para que falle la impresora o el TPV no cuadre.',
      },
    ],
    planTitle: 'Todo listo en una semana',
    planText:
      'Plazos orientativos desde que nos das el visto bueno. Si el equipo tiene que llegar o la carta es muy larga, te damos la fecha concreta en la propuesta.',
    plan: onboardingSteps.map((s) => ({ title: s.title, text: s.text, when: s.when })),
    checklist: {
      title: 'Lo que hay que tener antes de abrir',
      text: 'La lista de siempre, con lo que te resolvemos nosotros marcado. Lo demás depende de tu ayuntamiento, tu gestoría o tu banco, y te lo decimos claro.',
      items: [
        {
          text: 'Licencia de actividad y de apertura',
          covered: false,
          note: 'Ayuntamiento, con un técnico o tu gestoría.',
        },
        {
          text: 'Alta en Hacienda y en la Seguridad Social',
          covered: false,
          note: 'Tu gestoría. Nosotros te dejamos la facturación configurada con tus datos fiscales.',
        },
        {
          text: 'Registro sanitario',
          covered: false,
          note: 'Sanidad de tu comunidad autónoma.',
        },
        {
          text: 'Carta con precios y los 14 alérgenos',
          covered: true,
          note: 'Nos la mandas como la tengas y te la devolvemos montada en el TPV y en la carta QR.',
        },
        {
          text: 'TPV, cobro y cierre de caja',
          covered: true,
          note: 'Configurado con tus mesas, tus usuarios y tus formas de pago.',
        },
        {
          text: 'Equipo: terminal, impresora, comanderos',
          covered: true,
          note: 'Te llega listo para enchufar, o usamos el que ya tienes si sirve.',
        },
        {
          text: 'Datáfono',
          covered: false,
          note: 'Lo contratas con tu banco. Te ayudamos a encajarlo en el cobro.',
        },
        {
          text: 'Placas QR en las mesas',
          covered: true,
          note: 'Con el nombre de tu local y el número de cada mesa.',
        },
        {
          text: 'Fichaje y cuadrante del equipo',
          covered: true,
          note: 'El registro de jornada es obligatorio desde el primer día. Contratos y altas, con tu gestoría.',
        },
        {
          text: 'Web con la carta y el botón de reservar',
          covered: true,
          note: 'Si no tienes web, te la hacemos. Si ya la tienes, le añadimos la carta y las reservas.',
        },
        {
          text: 'Ficha de Google completa',
          covered: true,
          note: 'Horario, carta, fotos y enlaces para reservar y pedir, revisados antes de abrir.',
        },
        {
          text: 'Proveedores y primeras compras',
          covered: false,
          note: 'Cosa tuya por ahora. El ERP de alaCarta, en camino, llevará compras y facturas de proveedor.',
        },
      ],
    },
    setup: {
      config: { modules: ['web-para-restaurantes'], hardware: true, placas: true },
      kits: ['completo'],
      later: ['comandero', 'cocina', 'reservas', 'rrhh'],
      title: 'Una configuración tipo para abrir',
      text: 'Lo justo para el primer servicio: el plan Esencial, tu web con la carta y el equipo listo para enchufar. El comandero, la cocina o las reservas se añaden cuando el servicio lo pida.',
      label: 'Apertura · de partida',
    },
    demo: {
      key: 'simulador',
      title: 'Prueba el sistema antes de abrir',
      text: 'Haz de camarero, de cocina y de caja en un servicio de ejemplo. Así ves en cinco minutos cómo trabajará tu equipo el primer día.',
    },
    links: ['tpv', 'carta-qr', 'hardware', 'puesta-en-marcha', 'web-para-restaurantes', 'rrhh'],
    faqs: [
      {
        q: '¿Puedo empezar con poco y ampliar después?',
        a: 'Sí. Lo habitual es abrir con el TPV y la carta QR, y añadir comandero, cocina, reservas o pedidos cuando el servicio lo pida. Sin permanencia.',
      },
      {
        q: '¿Cuánto antes de abrir tengo que avisaros?',
        a: 'Cuanto antes, mejor, pero no hace falta mucho margen: el plazo habitual es de una semana. Te damos una fecha concreta en la propuesta según el equipo y la carta.',
      },
      {
        q: '¿Me ayudáis con la web y Google?',
        a: 'Sí. Podemos hacerte la web y dejar tu Perfil de Empresa de Google completo antes de abrir, con la carta y el enlace de reservas.',
      },
      {
        q: '¿Os ocupáis de las licencias?',
        a: 'No. Las licencias, el alta en Hacienda y el registro sanitario dependen de tu ayuntamiento, tu comunidad y tu gestoría. Nosotros nos ocupamos del sistema, el equipo, la carta y tus canales.',
      },
      {
        q: '¿Tengo que comprar el equipo?',
        a: 'No necesariamente. Si ya tienes tablets o una impresora térmica estándar, comprobamos si sirven. Si te falta equipo, te lo mandamos configurado y el precio va en tu propuesta.',
      },
    ],
  },
  {
    slug: 'cambiar-de-tpv',
    navLabel: 'Quiero cambiar de TPV',
    name: 'Cambiar de TPV',
    tagline: 'Cambia sin cerrar el local y sin perder tu carta.',
    icon: 'switch',
    title: 'Quieres cambiar de TPV: hazlo sin cerrar y sin perder nada',
    seoTitle: 'Cambiar de TPV en hostelería sin cerrar el local',
    description:
      'Cambia de TPV en tu restaurante o bar sin parar el servicio: importamos tu carta y tus clientes, formamos al equipo y lo montamos en paralelo.',
    intro:
      'Casi nadie cambia de TPV porque le guste el cambio: lo hace porque el actual se queda corto, cobra por todo o no está preparado para lo que viene. El miedo es razonable. Por eso el cambio lo hacemos nosotros, contigo y sin cerrar.',
    worries: [
      {
        title: 'Perder datos',
        text: 'La carta, los clientes y el histórico son años de trabajo. Nadie quiere volver a teclearlos.',
      },
      {
        title: 'Parar el local',
        text: 'No hay un buen día para cerrar. El cambio tiene que pasar sin que el cliente lo note.',
      },
      {
        title: 'Formar al equipo otra vez',
        text: 'Camareros que ya saben usar el sistema actual y no tienen tiempo para aprender uno nuevo.',
      },
      {
        title: 'La permanencia del actual',
        text: 'Contratos de uno o tres años, equipos en renting o cuotas que siguen después de irte.',
      },
    ],
    planTitle: 'El cambio, paso a paso',
    planText: 'Tu TPV actual sigue funcionando hasta el día que elijas. No hay un día sin sistema.',
    plan: [
      {
        title: 'Importamos lo que tienes',
        text: 'La carta y, si tu sistema actual lo permite, los clientes con su consentimiento y el histórico. Te decimos antes qué se puede traer y qué no.',
      },
      {
        title: 'Lo montamos en paralelo',
        text: 'Preparamos alaCarta mientras sigues trabajando con tu TPV. Lo puedes probar una semana con el local abierto antes de cambiar.',
      },
      {
        title: 'Formamos al equipo',
        text: 'Una sesión corta: la interfaz sigue la lógica de la carta, y la mayoría la usa con soltura en el primer servicio.',
      },
      {
        title: 'Primer servicio acompañado',
        text: 'Estamos contigo el día del cambio para resolver lo que surja al momento.',
      },
    ],
    compare: {
      title: 'Lo que tienes y lo que tendrías',
      text: 'No comparamos con ninguna marca: comparamos con lo habitual, que es un TPV para cobrar y una herramienta distinta para cada cosa.',
      rows: [
        {
          need: 'Cobrar y cerrar la caja',
          before: 'Sí, es lo que hace',
          after: 'Sí, con arqueo guiado',
          piece: 'tpv',
        },
        {
          need: 'Comandero y pantalla de cocina',
          before: 'Módulos aparte o en papel',
          after: 'En el mismo sistema',
          piece: 'cocina',
        },
        {
          need: 'Carta QR con pedido y pago',
          before: 'Otra app, a veces con comisión',
          after: 'Incluida en todos los planes, sin comisión',
          piece: 'carta-qr',
        },
        {
          need: 'Reservas',
          before: 'Plataforma aparte, a veces por comensal',
          after: 'En el plano del TPV, con cuota fija',
          piece: 'reservas',
        },
        {
          need: 'Pedidos para llevar y a domicilio',
          before: 'Agregadores con comisión por pedido',
          after: 'Tu tienda online, sin comisión',
          piece: 'pedidos-online',
        },
        {
          need: 'Cambiar un precio',
          before: 'En cada sitio, uno a uno',
          after: 'Una vez, en todos los canales',
          piece: 'backoffice',
        },
        {
          need: 'Fichajes y turnos',
          before: 'Papel, hojas de cálculo o WhatsApp',
          after: 'Equipo y RRHH, en el móvil',
          piece: 'rrhh',
        },
        {
          need: 'App propia y llamadas con IA',
          before: 'No suele haber',
          after: 'En el mismo sistema',
          piece: 'app-propia',
        },
      ],
    },
    demo: {
      key: 'comprobador',
      title: '¿Te sirve el equipo que ya tienes?',
      text: 'Cuatro preguntas sobre tu terminal, tu impresora y tus cajones. Al final sabes qué puedes reaprovechar y qué haría falta. No guarda nada.',
    },
    links: ['tpv', 'comandero', 'cocina', 'backoffice', 'puesta-en-marcha', 'hardware'],
    faqs: [
      {
        q: '¿Puedo usar el hardware que ya tengo?',
        a: 'En muchos casos, sí: tablets, equipos táctiles con navegador e impresoras térmicas estándar suelen servir. Lo comprobamos antes de empezar.',
      },
      {
        q: '¿Y si tengo permanencia con mi proveedor actual?',
        a: 'Revisa tu contrato antes de decidir. Si te queda poco, podemos preparar el cambio para que coincida con el final.',
      },
      {
        q: '¿Es buen momento por VeriFactu?',
        a: 'Es un motivo legítimo para revisar tu sistema de facturación, no para correr. Explicamos el calendario vigente y el aplazamiento anunciado en nuestra guía de VeriFactu.',
      },
      {
        q: '¿Qué pasa con las facturas que ya he emitido?',
        a: 'Se quedan en tu sistema anterior: no se traspasan. Te ayudamos a exportarlas para guardarlas el tiempo que obliga la ley.',
      },
      {
        q: '¿Cuánto cuesta la migración?',
        a: 'La puesta en marcha remota va incluida. Traer clientes e histórico desde otro sistema depende de lo que permita exportar, así que va a medida en tu propuesta.',
      },
    ],
  },
  {
    slug: 'dejar-las-comisiones',
    navLabel: 'Quiero dejar de pagar comisiones',
    name: 'Dejar las comisiones',
    tagline: 'Tus reservas y pedidos por tu canal, con cuota fija.',
    icon: 'percent-off',
    title: 'Quieres dejar de pagar comisiones por tus propios clientes',
    seoTitle: 'Dejar de pagar comisiones en reservas y pedidos',
    description:
      'Reservas, pedidos online, app y carta QR con tu marca y cuota fija, sin comisión por cliente. Cómo pasar a tu canal propio sin dejar los agregadores.',
    intro:
      'Los agregadores y las plataformas de reservas te traen clientes nuevos, y eso tiene valor. Lo que no tiene sentido es pagar comisión cada vez que vuelve un cliente que ya es tuyo. Tu canal propio hace que vuelvan sin intermediarios.',
    motivo: 'comisiones',
    worries: [
      {
        title: 'Comisiones por cada pedido',
        text: 'Los agregadores suelen quedarse entre un 14 % y un 30 % de cada pedido, según el plan y el reparto.',
      },
      {
        title: 'Coste por comensal en reservas',
        text: 'Algunas plataformas de reservas cobran por cada cliente sentado, también por los habituales.',
      },
      {
        title: 'El cliente no es tuyo',
        text: 'Sin sus datos ni su consentimiento, no puedes avisarle de un menú nuevo ni premiar que vuelva.',
      },
    ],
    planTitle: 'Cómo pasar a tu canal propio',
    planText: 'Sin cerrar la puerta a nadie: el agregador sigue trayendo clientes nuevos.',
    plan: [
      {
        title: 'Tu tienda y tu libro de reservas',
        text: 'Pedidos online y reservas con tu marca, enlazables desde Google, Instagram y tu web. Cuota fija, sin comisión.',
      },
      {
        title: 'Que el cliente sepa que puede pedirte directo',
        text: 'En la carta QR, en la bolsa del pedido y en tu ficha de Google: la próxima vez, directo.',
      },
      {
        title: 'Que vuelva',
        text: 'Ficha de cliente con su consentimiento, puntos y campañas sencillas para quien no viene desde hace tiempo.',
      },
      {
        title: 'Agregadores, sí, pero como escaparate',
        text: 'Lo sensato es usar los dos: los agregadores para que te conozcan, tu canal para que vuelvan.',
      },
    ],
    channels: {
      title: 'Tus canales, sin comisión',
      text: 'Cada pieza lleva al cliente a pedir o reservar directamente contigo. Las marcadas «en camino» todavía no están disponibles.',
      quote:
        'Los agregadores te traen clientes nuevos; tu canal propio hace que vuelvan sin comisión. Lo sensato es usar los dos.',
      items: [
        {
          piece: 'pedidos-online',
          title: 'Tu tienda de pedidos',
          text: 'Para recoger y a domicilio, con tu marca, tus franjas y tus zonas. El dinero va directo a tu cuenta.',
        },
        {
          piece: 'app-propia',
          title: 'Tu app',
          text: 'El pedido de siempre en dos toques, los puntos y tus avisos, con tu nombre en la pantalla del móvil.',
        },
        {
          piece: 'web-para-restaurantes',
          title: 'Tu web',
          text: 'Con la carta al día y los botones de reservar y pedir, para que quien te busca no acabe en otra plataforma.',
        },
        {
          piece: 'llamadas-ia',
          title: 'Tu teléfono, siempre atendido',
          text: 'La IA apunta reservas y pedidos para recoger cuando no puedes coger el teléfono. Sin comisión por llamada.',
        },
        {
          piece: 'placas-qr',
          title: 'La placa de la mesa',
          text: 'Quien ya está sentado ve tu carta y tu marca, no la de otro. Un buen sitio para decir «la próxima vez, pide directo».',
        },
        {
          piece: 'puesta-en-marcha',
          title: 'Tu ficha de Google',
          text: 'Los enlaces de reservar y pedir apuntando a tu canal, no al de un intermediario. Te la dejamos revisada.',
        },
      ],
    },
    demo: {
      key: 'calculadora',
      title: '¿Cuánto se te va en comisiones al año?',
      text: 'Pon tus pedidos, tu ticket medio y la comisión de tu plataforma; si quieres, también las reservas por comensal y los pagos con QR. No guarda nada ni te pide datos.',
    },
    links: [
      'pedidos-online',
      'reservas',
      'app-propia',
      'clientes',
      'web-para-restaurantes',
      'placas-qr',
    ],
    faqs: [
      {
        q: '¿Tengo que dejar Glovo, Uber Eats o Just Eat?',
        a: 'No. Te traen clientes nuevos. La idea es que quien ya te conoce pida por tu canal, sin comisión. La integración de los agregadores en la misma cola de cocina está en camino.',
      },
      {
        q: '¿Cuánto me puedo ahorrar?',
        a: 'Depende de cuántos pedidos y reservas pasen a tu canal. La calculadora de esta página hace la cuenta con tus números; en la demo la repasamos contigo.',
      },
      {
        q: '¿Hay alguna comisión con alaCarta?',
        a: 'No por pedido, reserva ni pago QR. Pagas la cuota fija y, si cobras online, la comisión de tu pasarela de pago, que no pasa por nosotros.',
      },
      {
        q: '¿Y si mi cliente prefiere seguir pidiendo por la plataforma?',
        a: 'Está en su derecho, y ese pedido te sigue llegando. El canal propio no obliga a nadie: lo pone fácil y lo premia, con puntos o una promoción solo para quien pide directo.',
      },
    ],
  },
];

export const getMoment = (slug: MomentSlug) => {
  const found = moments.find((m) => m.slug === slug);
  if (!found) throw new Error(`Momento desconocido: ${slug}`);
  return found;
};

export const momentPath = (slug: MomentSlug) => `/momentos/${slug}`;
