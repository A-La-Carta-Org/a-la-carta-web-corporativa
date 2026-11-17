import { getSolution, type Faq, type FamilyId, type SolutionSlug } from './solutions';
import { hardwareFaqs } from './hardware';
import { onboardingFaqs } from './onboarding';
import {
  TRIAL_DAYS,
  ANNUAL_DISCOUNT,
  MIN_LOCATIONS_GROUP,
  IA_MINUTES_INCLUDED,
  IA_EXTRA_MINUTE,
  RRHH_PEOPLE_INCLUDED,
  RRHH_EXTRA_PERSON,
  FOUNDER_SPOTS,
  fmtPrice,
  getAddon,
  getPlan,
  totalAsSeparate,
} from './pricing';
import { REPLY_HOURS, DEMO_MINUTES } from './site';

export interface FaqGroup {
  id: FamilyId | 'precios' | 'empresa';
  title: string;
  /** Una línea bajo el título del grupo */
  text?: string;
  items: Faq[];
}

/** Reutiliza la pregunta de un producto (una sola fuente: `solutions.ts`) */
const fromSolution = (slug: SolutionSlug, q: string): Faq => {
  const found = getSolution(slug).faqs.find((f) => f.q === q);
  if (!found) throw new Error(`Pregunta desconocida en ${slug}: ${q}`);
  return found;
};
const fromList = (list: Faq[], q: string): Faq => {
  const found = list.find((f) => f.q === q);
  if (!found) throw new Error(`Pregunta desconocida: ${q}`);
  return found;
};

/**
 * Preguntas generales, agrupadas por familia del ecosistema (docs/auditoria/13 §8): la página de
 * preguntas frecuentes, y una selección en la home y en precios. Las de producto se leen de su
 * ficha en `solutions.ts`, `hardware.ts` y `onboarding.ts` para no repetir respuestas.
 */
export const faqGroups: FaqGroup[] = [
  {
    id: 'servicio',
    title: 'Servicio en sala y cocina',
    text: 'TPV, comandero, pantalla de cocina y carta QR.',
    items: [
      {
        q: '¿Qué pasa si se cae internet?',
        a: 'El TPV sigue cobrando e imprimiendo en modo local y sincroniza cuando vuelve la conexión. Los módulos que dependen de internet por naturaleza, como los pedidos online, se reanudan solos.',
      },
      fromSolution('tpv', '¿Puedo tener varios TPV en el mismo local?'),
      fromSolution('comandero', '¿Los camareros necesitan formación?'),
      fromSolution('cocina', '¿Sustituye a la impresora de cocina?'),
      fromSolution('carta-qr', '¿Puedo usar la carta QR sin que el cliente pueda pedir?'),
      fromSolution('carta-qr', '¿Cobráis comisión por los pedidos desde la carta?'),
      {
        q: '¿Cumple con VeriFactu?',
        a: 'Está diseñada con los requisitos de los sistemas informáticos de facturación (Reglamento VeriFactu) en mente. No la anunciamos como certificada: en la demo te contamos el estado exacto. La obligación arranca en 2027 según la norma vigente y Hacienda ha anunciado un aplazamiento que aún no está publicado en el BOE. Los plazos, al día, en nuestra guía de VeriFactu.',
      },
    ],
  },
  {
    id: 'canales',
    title: 'Clientes y canales',
    text: 'Reservas, pedidos online, app propia, llamadas con IA, clientes y web.',
    items: [
      fromSolution('reservas', '¿Hay comisión por reserva?'),
      fromSolution('reservas', '¿Funciona con Reserva con Google?'),
      fromSolution('pedidos-online', '¿Ponéis repartidores?'),
      {
        q: '¿La app y la web llevan mi marca?',
        a: 'Sí. La web la hacemos con tus textos, tus fotos y tu carta, y el dominio se registra a tu nombre. La app propia lleva tu logo y tus colores; está en desarrollo, sin fecha cerrada, y su primera versión será una app web que el cliente instala en el móvil sin pasar por las tiendas.',
      },
      {
        q: '¿Cómo funcionan las llamadas con IA?',
        a: 'Un asistente coge el teléfono cuando en el local no podéis. Se presenta como asistente, responde con tu carta y tu horario, y deja las reservas por confirmar en tu libro y los pedidos para recoger pendientes de aceptar: la IA propone y tú decides. Si hay una alergia grave o una duda que no sabe resolver, pasa la llamada a una persona. Está en preparación, sin fecha cerrada.',
      },
      fromSolution('llamadas-ia', '¿El cliente sabe que habla con un asistente?'),
      fromSolution('llamadas-ia', '¿Toma pedidos a domicilio?'),
      fromSolution('web-para-restaurantes', '¿El dominio es mío?'),
    ],
  },
  {
    id: 'gestion',
    title: 'Gestión del negocio',
    text: 'Backoffice e informes, ERP, y equipo y RRHH.',
    items: [
      {
        q: '¿Puedo gestionar varios locales?',
        a: 'Sí. Varios locales conviven en la misma cuenta, con datos separados y vista conjunta. Varias sociedades en la misma cuenta llegan con el ERP, que está en camino. Para grupos a partir de tres locales hay un plan específico.',
      },
      fromSolution('backoffice', '¿Y la contabilidad?'),
      fromSolution('erp', '¿Tengo que dejar a mi gestoría?'),
      fromSolution('rrhh', '¿Es obligatorio el registro de jornada digital?'),
      fromSolution('rrhh', '¿Calcula las nóminas?'),
      fromSolution('rrhh', '¿Usa huella o reconocimiento facial?'),
    ],
  },
  {
    id: 'equipamiento',
    title: 'Equipamiento y puesta en marcha',
    text: 'Hardware, placas QR, migración y los primeros días.',
    items: [
      {
        q: '¿Puedo usar mi hardware?',
        a: 'Sí, si sirve. El TPV, el comandero y la pantalla de cocina funcionan en tablets, móviles y equipos táctiles con un navegador moderno, y las impresoras térmicas de red o USB estándar suelen valer. Si te falta algo, te proponemos un kit que llega configurado. Lo revisamos contigo antes de empezar.',
      },
      fromSolution('tpv', '¿Funciona en Android, iPad y Windows?'),
      fromList(hardwareFaqs, '¿Qué pasa si se rompe en pleno servicio?'),
      fromList(hardwareFaqs, '¿Puedo usar el datáfono de mi banco?'),
      {
        q: '¿Cuánto se tarda en empezar?',
        a: 'Depende del tamaño de la carta y de los módulos. Un local con TPV y carta QR suele estar operativo en pocos días desde que nos envías la carta. Te damos una fecha concreta en la demo.',
      },
      {
        q: '¿Puedo migrar desde mi sistema actual?',
        a: 'Sí. Importamos tu carta y, si el sistema actual lo permite, tus clientes e histórico. Lo valoramos caso por caso.',
      },
      fromList(onboardingFaqs, '¿Tengo que cerrar el local para el cambio?'),
      fromList(onboardingFaqs, '¿Y si algo falla el primer día?'),
    ],
  },
  {
    id: 'precios',
    title: 'Precios y contratación',
    text: 'Planes, complementos, permanencia y prueba.',
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
        a: `Un ${ANNUAL_DISCOUNT} % sobre la cuota del plan. Los módulos sueltos, los complementos y los dispositivos adicionales se facturan igual.`,
      },
      {
        q: '¿Qué lleva el plan Total?',
        a: `Todo lo del plan Completo más la app propia, las llamadas con IA (${IA_MINUTES_INCLUDED} minutos al mes), Equipo y RRHH hasta ${RRHH_PEOPLE_INCLUDED} personas y el ERP para una empresa. Por separado saldría a ${fmtPrice(totalAsSeparate)} al mes; el Total cuesta ${fmtPrice(getPlan('total').monthly as number)}.`,
      },
      {
        q: '¿Qué pasa si me paso de minutos con la IA?',
        a: `Cada minuto de más se cobra a ${fmtPrice(IA_EXTRA_MINUTE)}, sin cambiar de cuota. Nunca se cobra por reserva ni por pedido: pagas minutos de llamada, acabe la llamada en lo que acabe.`,
      },
      {
        q: '¿El ERP va por local o por empresa?',
        a: `Por empresa: ${fmtPrice(getAddon('erp')!.monthly)} al mes por cada sociedad, tengas los locales que tengas. El plan Total incluye una.`,
      },
      {
        q: '¿Puedo contratar solo Equipo y RRHH?',
        a: `Sí. Equipo y RRHH, el ERP y la web se pueden contratar sin plan de TPV. Equipo y RRHH cuesta ${fmtPrice(getAddon('rrhh')!.monthly)} al mes por local hasta ${RRHH_PEOPLE_INCLUDED} personas, y ${fmtPrice(RRHH_EXTRA_PERSON)} al mes por cada persona más.`,
      },
      {
        q: '¿El hardware es en propiedad?',
        a: 'Estamos cerrando la fórmula con el proveedor. En tu propuesta te decimos por escrito si es compra, renting o las dos, con el precio de cada kit. Y siempre puedes usar el equipo que ya tienes si sirve.',
      },
      {
        q: '¿Los precios llevan IVA?',
        a: 'No. Todos los precios de la web se muestran sin IVA, que se suma en la factura. Son orientativos de lanzamiento: el precio cerrado va por escrito en tu propuesta.',
      },
      {
        q: '¿Cómo funciona el plan para grupos?',
        a: `A partir de ${MIN_LOCATIONS_GROUP} locales preparamos una propuesta a medida: incluye todo lo del plan Total en cada local, la carta maestra, los roles centrales, la API y un gestor de cuenta.`,
      },
      {
        q: '¿Qué es un local fundador?',
        a: `Uno de los ${FOUNDER_SPOTS} primeros locales que usan alaCarta en su servicio y nos cuentan qué falla. A cambio, precio bloqueado mientras siga, puesta en marcha presencial incluida y línea directa con producto. Sin cuenta atrás.`,
      },
    ],
  },
  {
    id: 'empresa',
    title: 'Sobre alaCarta',
    text: 'Quiénes somos, en qué punto estamos y cómo trabajamos.',
    items: [
      {
        q: '¿Qué es exactamente alaCarta?',
        a: 'El ecosistema de gestión para hostelería: un solo sistema para la sala y la cocina (TPV, comandero, pantalla de cocina, carta QR), para tus clientes y canales (reservas, pedidos online, web, app propia y llamadas con IA), para la gestión (backoffice e informes, ERP, equipo y RRHH) y el equipamiento y la puesta en marcha. Todo comparte la misma carta, las mismas mesas y los mismos datos. Lo que aún está en camino se marca así en cada página.',
      },
      {
        q: '¿Tengo que contratarlo todo?',
        a: 'No. Empiezas por lo que necesitas hoy, por ejemplo el TPV y la carta QR, y añades el resto cuando el local lo pida. Como todo comparte la misma carta y los mismos datos, lo que sumas después llega ya conectado. Equipo y RRHH, el ERP y la web se pueden contratar incluso sin el TPV.',
      },
      {
        q: '¿Sirve para mi tipo de local?',
        a: 'Está pensada para restaurantes, bares, cafeterías, pizzerías, hamburgueserías, cervecerías, pubs, coctelerías, negocios de take away y delivery, y grupos con varios locales. Es la misma plataforma configurada de forma distinta, no un programa por sector.',
      },
      {
        q: '¿Qué está disponible hoy y qué está en camino?',
        a: 'Cada pieza lleva su estado en la web: si no pone nada, es parte del sistema que contratas; si pone «En camino», todavía no está y no tiene fecha cerrada. Lo tienes todo en una sola lista en la página de novedades, que sale de los mismos datos que el resto de la web.',
      },
      {
        q: '¿Tenéis clientes a los que pueda preguntar?',
        a: 'Todavía no. alaCarta es nuevo y no vamos a enseñarte clientes, cifras ni opiniones que no existen. Por eso hay un programa de locales fundadores: los primeros que lo usan en su servicio, con condiciones a cambio de contarnos qué falla.',
      },
      {
        q: '¿Cómo es la demo?',
        a: `Una videollamada de unos ${DEMO_MINUTES} minutos en la que vemos tu local, tus canales y tu carta, y te enseñamos la plataforma con un caso parecido al tuyo. Sin compromiso.`,
      },
      {
        q: '¿Qué soporte hay?',
        a: `Soporte por correo y chat en todos los planes, con respuesta en menos de ${REPLY_HOURS} horas laborables, y soporte prioritario en el plan Completo y en Grupos. El centro de ayuda, con la documentación de cada pieza, se publica con el lanzamiento.`,
      },
      {
        q: '¿Dónde están mis datos?',
        a: 'En servidores de la Unión Europea, con copias de seguridad diarias. Puedes exportar tus datos en cualquier momento.',
      },
    ],
  },
];

const allFaqs = faqGroups.flatMap((g) => g.items);
const pick = (q: string): Faq => {
  const found = allFaqs.find((f) => f.q === q);
  if (!found) throw new Error(`Pregunta frecuente desconocida: ${q}`);
  return found;
};

/** Las que se muestran en la home (docs/auditoria/03 §3.12), en este orden */
export const homeFaqs: Faq[] = [
  pick('¿Qué es exactamente alaCarta?'),
  pick('¿Tengo que contratarlo todo?'),
  pick('¿Puedo usar mi hardware?'),
  pick('¿Cobráis comisión por pedidos, reservas o pagos por QR?'),
  pick('¿La app y la web llevan mi marca?'),
  pick('¿Cómo funcionan las llamadas con IA?'),
  pick('¿Hay permanencia?'),
  pick('¿Cuánto se tarda en empezar?'),
];

/** Las que se muestran en precios */
export const pricingFaqs: Faq[] = faqGroups.find((g) => g.id === 'precios')!.items;
