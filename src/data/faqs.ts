import type { Faq } from './solutions';
import { TRIAL_DAYS, ANNUAL_DISCOUNT, MIN_LOCATIONS_GROUP } from './pricing';
import { REPLY_HOURS, DEMO_MINUTES } from './site';

export interface FaqGroup {
  id: string;
  title: string;
  items: Faq[];
}

/** Preguntas generales: la página de FAQ, y una selección en la home y en precios */
export const faqGroups: FaqGroup[] = [
  {
    id: 'producto',
    title: 'Sobre la plataforma',
    items: [
      {
        q: '¿Qué es exactamente alaCarta?',
        a: 'Una plataforma de gestión para negocios de hostelería. Reúne en un solo sistema el TPV, el comandero, la pantalla de cocina, la carta QR, las reservas, los pedidos online, la gestión del negocio, los informes y los clientes. Contratas los módulos que necesitas y todos comparten la misma carta, las mismas mesas y los mismos datos.',
      },
      {
        q: '¿Sirve para mi tipo de local?',
        a: 'Está pensada para restaurantes, bares, cafeterías, pizzerías, hamburgueserías, cervecerías, pubs, coctelerías, negocios de take away y delivery, y grupos con varios locales. Es la misma plataforma configurada de forma distinta, no un programa por sector.',
      },
      {
        q: '¿Necesito comprar hardware?',
        a: 'En la mayoría de los casos, no. El TPV, el comandero y la pantalla de cocina funcionan en tablets, móviles y equipos táctiles con navegador moderno. Las impresoras térmicas de red o USB estándar suelen servir. Lo revisamos contigo antes de empezar.',
      },
      {
        q: '¿Qué pasa si se cae internet?',
        a: 'El TPV sigue cobrando e imprimiendo en modo local y sincroniza cuando vuelve la conexión. Los módulos que dependen de internet por naturaleza, como los pedidos online, se reanudan solos.',
      },
      {
        q: '¿Cumple con VeriFactu?',
        a: 'La plataforma está diseñada para cumplir los requisitos de los sistemas informáticos de facturación establecidos en la normativa española (Reglamento VeriFactu). La obligación para empresas y autónomos arranca en 2027 según la norma vigente, y la Administración ha anunciado un aplazamiento pendiente de publicación oficial. Te mantendremos informado de los plazos en nuestra guía.',
      },
      {
        q: '¿Puedo gestionar varios locales?',
        a: 'Sí. Varios locales y varias sociedades conviven en la misma cuenta, con datos separados y vista conjunta. Para grupos a partir de tres locales hay un plan específico.',
      },
    ],
  },
  {
    id: 'precios',
    title: 'Precios y contratación',
    items: [
      {
        q: '¿Hay permanencia?',
        a: 'No. La suscripción mensual se cancela cuando quieras. Si eliges pago anual, se aplica el descuento y el compromiso es de ese año.',
      },
      {
        q: '¿Cobráis comisión por pedidos, reservas o pagos por QR?',
        a: 'No. alaCarta cobra una cuota fija por local y módulo. Las únicas comisiones que verás son las de tu pasarela de pago o tu banco, que no pasan por nosotros.',
      },
      {
        q: '¿Hay periodo de prueba?',
        a: `Sí: ${TRIAL_DAYS} días con la plataforma completa, sin tarjeta. Si al terminar no sigues, no se cobra nada.`,
      },
      {
        q: '¿Qué incluye la puesta en marcha?',
        a: 'La configuración remota de carta, mesas, impresoras y usuarios, y la importación de tu carta actual, están incluidas. La formación presencial en el local se contrata aparte.',
      },
      {
        q: '¿Cuánto ahorro con el pago anual?',
        a: `Un ${ANNUAL_DISCOUNT} % sobre la cuota mensual, aplicado a los planes. Los dispositivos adicionales se facturan igual.`,
      },
      {
        q: '¿Cómo funciona el plan para grupos?',
        a: `A partir de ${MIN_LOCATIONS_GROUP} locales preparamos una propuesta a medida: incluye todos los módulos en cada local, la carta maestra, los roles centrales, la API y un gestor de cuenta.`,
      },
    ],
  },
  {
    id: 'puesta-en-marcha',
    title: 'Puesta en marcha y soporte',
    items: [
      {
        q: '¿Cuánto se tarda en empezar?',
        a: 'Depende del tamaño de la carta y de los módulos. Un local con TPV y carta QR suele estar operativo en pocos días desde que nos envías la carta. Te damos una fecha concreta en la demo.',
      },
      {
        q: '¿Cómo es la demo?',
        a: `Una videollamada de unos ${DEMO_MINUTES} minutos en la que vemos tu local, tus canales y tu carta, y te enseñamos la plataforma con un caso parecido al tuyo. Sin compromiso.`,
      },
      {
        q: '¿Qué soporte hay?',
        a: `Soporte por correo y chat en todos los planes, con respuesta en menos de ${REPLY_HOURS} horas laborables, y soporte prioritario en el plan Completo y en Grupos. El centro de ayuda documenta cada módulo.`,
      },
      {
        q: '¿Puedo migrar desde mi sistema actual?',
        a: 'Sí. Importamos tu carta y, si el sistema actual lo permite, tus clientes e histórico. Lo valoramos caso por caso.',
      },
      {
        q: '¿Dónde están mis datos?',
        a: 'En servidores de la Unión Europea, con copias de seguridad diarias. Puedes exportar tus datos en cualquier momento.',
      },
    ],
  },
];

/** Las que se muestran en la home */
export const homeFaqs: Faq[] = [
  faqGroups[0]!.items[0]!,
  faqGroups[0]!.items[2]!,
  faqGroups[1]!.items[1]!,
  faqGroups[1]!.items[0]!,
  faqGroups[2]!.items[0]!,
];

/** Las que se muestran en precios */
export const pricingFaqs: Faq[] = faqGroups[1]!.items;
