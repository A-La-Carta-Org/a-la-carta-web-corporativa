/**
 * Fuente única de los precios de la web. Ninguna cifra de precio se escribe en otro sitio.
 *
 * ESTADO: propuesta orientativa (noviembre de 2026). La justificación está en
 * docs/PRECIOS.md y docs/auditoria/09. Son precios sin IVA, por local y mes salvo que se diga
 * otra cosa. Antes de la salida comercial hay que confirmarlos (ver docs/TODO.md).
 *
 * Modelo (decisión de Jordi, 16-11-2026, con las cifras por defecto de la auditoría 09):
 * - Suscripción por local. Tres planes públicos (Esencial, Completo, Total) y Grupos a medida.
 * - Esencial puede sumar módulos sueltos; Completo los lleva todos los de sala y canales.
 * - Total = Completo + app propia + llamadas con IA (200 min) + Equipo y RRHH (20 personas) +
 *   ERP (1 empresa). Sale más barato que Completo con esos cuatro complementos por separado.
 * - Complementos con precio público sobre cualquier plan (`addons`), con su unidad: local,
 *   empresa, minuto, persona o alta.
 * - Dispositivos adicionales por unidad. Puesta en marcha remota incluida. Sin permanencia.
 * - 0 % de comisión en carta QR, reservas y pedidos online. Los minutos de IA no son comisión.
 * - Hardware y placas QR: sin cifra hasta cerrar proveedor («en tu propuesta»).
 *
 * El configurador «Monta tu alaCarta» calcula con estos datos en src/lib/quote.ts.
 */
import type { SolutionSlug } from './solutions';
import { ctaHref } from '@/lib/cta';

export const PRICES_ARE_ESTIMATES = true;
export const CURRENCY = '€';
export const VAT_NOTE = '+ IVA';
export const ANNUAL_DISCOUNT = 15; // %
export const TRIAL_DAYS = 14;
export const SETUP_REMOTE_PRICE = 0;
export const ONSITE_TRAINING_FROM = 290;
export const MIN_LOCATIONS_GROUP = 3;

/** Texto para lo que todavía no tiene precio publicado */
export const NO_PRICE_LABEL = 'En tu propuesta';
/** Nota corta que acompaña a toda cifra mientras `PRICES_ARE_ESTIMATES` */
export const ESTIMATE_NOTE = 'Precios orientativos de lanzamiento, sin IVA.';

export type Billing = 'mensual' | 'anual';
export type PlanId = 'esencial' | 'completo' | 'total' | 'grupos';

export interface Plan {
  id: PlanId;
  name: string;
  /** Para quién es, una línea */
  claim: string;
  /** Precio mensual por local, pagando mes a mes. `null` = a medida */
  monthly: number | null;
  featured?: boolean;
  /** Qué incluye, en lenguaje de local */
  includes: string[];
  /** Módulos incluidos (para marcar la tabla) */
  modules: SolutionSlug[];
  /** Dispositivos incluidos por local */
  devices: { tpv: number; comandero: number; kds: number };
  cta: { label: string; href: string };
}

/* ── Complementos (sobre cualquier plan; los cuatro primeros, dentro del Total) ── */

/** Llamadas con IA: minutos incluidos al mes por local y precio del minuto extra */
export const IA_MINUTES_INCLUDED = 200;
export const IA_EXTRA_MINUTE = 0.12;
/** Equipo y RRHH: personas incluidas por local y precio de cada persona más */
export const RRHH_PEOPLE_INCLUDED = 20;
export const RRHH_EXTRA_PERSON = 1;
/** Web y presencia en Google: alta, una sola vez */
export const WEB_SETUP = 390;

export type AddonSlug = 'app-propia' | 'llamadas-ia' | 'rrhh' | 'erp' | 'web-para-restaurantes';

export interface Addon {
  module: AddonSlug;
  name: string;
  /** Cuota mensual */
  monthly: number;
  /** Por qué se multiplica la cuota */
  per: 'local' | 'empresa' | 'web';
  /** «/mes por local» */
  period: string;
  /** Lo que lleva la cuota («200 minutos al mes») */
  includes: string;
  /** Lo que se paga aparte del uso («minuto extra a 0,12 €») */
  extra?: string;
  /** Pago único al empezar */
  setup?: number;
  /** Si va dentro del plan Total */
  inTotal: boolean;
  /** Una línea, en lenguaje de local */
  text: string;
}

const fmtCents = (n: number) => n.toFixed(2).replace('.', ',');

export const addons: Addon[] = [
  {
    module: 'app-propia',
    name: 'App propia',
    monthly: 19,
    per: 'local',
    period: '/mes por local',
    includes: 'Reservas, pedidos y puntos con tu marca',
    inTotal: true,
    text: 'Sin comisión por pedido ni por reserva.',
  },
  {
    module: 'llamadas-ia',
    name: 'Llamadas con IA',
    monthly: 29,
    per: 'local',
    period: '/mes por local',
    includes: `${IA_MINUTES_INCLUDED} minutos al mes`,
    extra: `minuto extra a ${fmtCents(IA_EXTRA_MINUTE)} ${CURRENCY}`,
    inTotal: true,
    text: 'Pagas minutos, no reservas ni pedidos.',
  },
  {
    module: 'rrhh',
    name: 'Equipo y RRHH',
    monthly: 24,
    per: 'local',
    period: '/mes por local',
    includes: `Hasta ${RRHH_PEOPLE_INCLUDED} personas`,
    extra: `+${RRHH_EXTRA_PERSON} ${CURRENCY}/mes por persona más`,
    inTotal: true,
    text: 'Fichaje, turnos, vacaciones y variables para la gestoría.',
  },
  {
    module: 'erp',
    name: 'ERP',
    monthly: 29,
    per: 'empresa',
    period: '/mes por empresa',
    includes: 'Una empresa o sociedad',
    inTotal: true,
    text: 'Compras, stock, facturas, tesorería y contabilidad.',
  },
  {
    module: 'web-para-restaurantes',
    name: 'Web y presencia en Google',
    monthly: 24,
    per: 'web',
    period: '/mes',
    includes: 'Mantenimiento y ficha de Google',
    setup: WEB_SETUP,
    inTotal: false,
    text: 'Con la carta del sistema siempre al día. El dominio es tuyo.',
  },
];

export const getAddon = (slug: string) => addons.find((a) => a.module === slug);

/* ── Planes ────────────────────────────────────────────────────────── */

const servicioYCanales: SolutionSlug[] = [
  'tpv',
  'carta-qr',
  'backoffice',
  'comandero',
  'cocina',
  'reservas',
  'pedidos-online',
  'clientes',
];
const totalModules: SolutionSlug[] = [
  ...servicioYCanales,
  ...addons.filter((a) => a.inTotal).map((a) => a.module),
];

export const plans: Plan[] = [
  {
    id: 'esencial',
    name: 'Esencial',
    claim: 'Para cobrar bien, tener la carta al día y ver los números.',
    monthly: 49,
    includes: [
      'TPV para 1 terminal',
      'Carta digital QR con pedido desde la mesa',
      'Backoffice: carta, precios, usuarios',
      'Informes de ventas y cierre diario',
      'Hasta 3 usuarios',
      'Facturación preparada para VeriFactu',
      'Soporte por correo y chat',
    ],
    modules: ['tpv', 'carta-qr', 'backoffice'],
    devices: { tpv: 1, comandero: 0, kds: 0 },
    cta: {
      label: 'Empezar con Esencial',
      href: ctaHref({ to: 'demo', plan: 'esencial', origen: 'precios-plan' }),
    },
  },
  {
    id: 'completo',
    name: 'Completo',
    claim: 'Para locales con servicio en mesa, cocina y canales propios.',
    monthly: 99,
    featured: true,
    includes: [
      'Todo lo del plan Esencial',
      'Comandero móvil (hasta 3 dispositivos)',
      'Pantalla de cocina (1 pantalla)',
      'Reservas sin comisiones',
      'Pedidos online: take away y reparto propio',
      'Clientes y fidelización',
      'Inventario y escandallos',
      'Usuarios ilimitados',
      'Soporte prioritario',
    ],
    modules: servicioYCanales,
    devices: { tpv: 1, comandero: 3, kds: 1 },
    cta: {
      label: 'Empezar con Completo',
      href: ctaHref({ to: 'demo', plan: 'completo', origen: 'precios-plan' }),
    },
  },
  {
    id: 'total',
    name: 'Total',
    claim: 'Para tener el restaurante entero conectado, también la oficina.',
    monthly: 159,
    includes: [
      'Todo lo del plan Completo',
      'App propia con tu marca (en camino)',
      `Llamadas con IA: ${IA_MINUTES_INCLUDED} minutos al mes (en camino)`,
      `Equipo y RRHH: hasta ${RRHH_PEOPLE_INCLUDED} personas`,
      'ERP para 1 empresa (en camino)',
    ],
    modules: totalModules,
    devices: { tpv: 1, comandero: 3, kds: 1 },
    cta: {
      label: 'Empezar con Total',
      href: ctaHref({ to: 'demo', plan: 'total', origen: 'precios-plan' }),
    },
  },
  {
    id: 'grupos',
    name: 'Grupos',
    claim: `Para grupos y cadenas a partir de ${MIN_LOCATIONS_GROUP} locales.`,
    monthly: null,
    includes: [
      'Todo lo del plan Total en cada local',
      'Carta maestra con variantes por local',
      'Multiempresa: varias sociedades (con el ERP, en camino)',
      'Roles y permisos centralizados',
      'Informes comparativos entre locales',
      'API e integraciones (en camino)',
      'Gestor de cuenta y acuerdo de servicio',
    ],
    modules: totalModules,
    devices: { tpv: 1, comandero: 3, kds: 1 },
    cta: {
      label: 'Hablar con nosotros',
      href: ctaHref({ to: 'demo', plan: 'grupos', origen: 'precios-plan' }),
    },
  },
];

export const getPlan = (id: PlanId) => {
  const found = plans.find((p) => p.id === id);
  if (!found) throw new Error(`Plan desconocido: ${id}`);
  return found;
};
export const basePlan = plans[0]!;
export const featuredPlan = plans.find((p) => p.featured) ?? plans[1]!;
export const totalPlan = getPlan('total');

/** Lo que costarían por separado los complementos que lleva el Total (ancla del plan Total) */
export const totalAsSeparate =
  (getPlan('completo').monthly as number) +
  addons.filter((a) => a.inTotal).reduce((sum, a) => sum + a.monthly, 0);

/** Módulos que el plan Esencial puede añadir por separado (precio por local y mes) */
export interface AddonModule {
  module: SolutionSlug;
  name: string;
  monthly: number;
  note?: string;
  /** Dispositivos que incluye el módulo suelto */
  devices?: number;
}
export const addonModules: AddonModule[] = [
  {
    module: 'comandero',
    name: 'Comandero móvil',
    monthly: 19,
    note: 'Incluye 2 dispositivos',
    devices: 2,
  },
  {
    module: 'cocina',
    name: 'Pantalla de cocina',
    monthly: 19,
    note: 'Incluye 1 pantalla',
    devices: 1,
  },
  { module: 'reservas', name: 'Reservas', monthly: 19, note: 'Sin comisión por comensal' },
  {
    module: 'pedidos-online',
    name: 'Pedidos online',
    monthly: 29,
    note: 'Sin comisión por pedido',
  },
  { module: 'clientes', name: 'Clientes y fidelización', monthly: 19 },
];

/** Dispositivos adicionales, por unidad y mes, en cualquier plan */
export interface Device {
  id: 'tpv' | 'comandero' | 'kds';
  name: string;
  monthly: number;
}
export const devices: Device[] = [
  { id: 'tpv', name: 'Terminal TPV adicional', monthly: 12 },
  { id: 'comandero', name: 'Comandero adicional', monthly: 8 },
  { id: 'kds', name: 'Pantalla de cocina adicional', monthly: 12 },
];
export const getDevicePrice = (id: Device['id']) => devices.find((d) => d.id === id)!.monthly;

/** Servicios de puesta en marcha */
export const services = [
  {
    name: 'Puesta en marcha remota',
    price: 'Incluida',
    text: 'Configuración de carta, mesas, impresoras y usuarios por videollamada. Importación de tu carta actual.',
  },
  {
    name: 'Formación presencial',
    price: `desde ${ONSITE_TRAINING_FROM} ${CURRENCY}`,
    text: 'Una jornada en tu local con tu equipo, antes de la apertura o del cambio. Desplazamiento aparte.',
  },
  {
    name: 'Migración de datos',
    price: 'A medida',
    text: 'Traspaso de productos, clientes e histórico desde tu sistema actual.',
  },
] as const;

/* ── Locales fundadores (decisión de Jordi, 16-11-2026) ────────────── */

/** Plazas reales del programa. Sin cuenta atrás ni «quedan X»: se cambia aquí y en ningún otro sitio. */
export const FOUNDER_SPOTS = 20;
export const founderPerks: { title: string; text: string }[] = [
  {
    title: 'Precio bloqueado',
    text: 'La cuota con la que empiezas se mantiene mientras sigas con la suscripción, aunque la tarifa suba después.',
  },
  {
    title: 'Puesta en marcha presencial incluida',
    text: `Vamos a tu local a dejarlo todo funcionando y a formar a tu equipo. Lo que normalmente cuesta desde ${ONSITE_TRAINING_FROM} ${CURRENCY}, sin coste.`,
  },
  {
    title: 'Línea directa con producto',
    text: 'Hablas con quien diseña el sistema. Lo que echas en falta en tu día a día pesa en lo que construimos después.',
  },
];

/* ── Cálculos ──────────────────────────────────────────────────────── */

export const round2 = (n: number) => Math.round(n * 100) / 100;

/** Cuota del plan con descuento anual, en equivalente al mes (entera, como se publica) */
export const annualMonthly = (monthly: number) => Math.round(monthly * (1 - ANNUAL_DISCOUNT / 100));

/** Precio mensual según forma de pago. Con el anual, el equivalente al mes */
export const planMonthly = (plan: Plan, billing: Billing): number | null =>
  plan.monthly === null ? null : billing === 'anual' ? annualMonthly(plan.monthly) : plan.monthly;

/** Pago real al año con el anual */
export const planYearly = (plan: Plan): number | null =>
  plan.monthly === null ? null : (planMonthly(plan, 'anual') as number) * 12;

/** «49 €», «0,12 €», «1.428 €» */
export const fmtPrice = (n: number) => {
  const s = Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',');
  return `${s.replace(/^(\d+)/, (m) => m.replace(/\B(?=(\d{3})+(?!\d))/g, '.'))} ${CURRENCY}`;
};

/** El «desde» de toda la web */
export const FROM_PRICE = basePlan.monthly as number;
export const fromLabel = `desde ${fmtPrice(FROM_PRICE)}/mes por local`;

export const billingOptions: { id: Billing; label: string; note?: string }[] = [
  { id: 'mensual', label: 'Mensual' },
  { id: 'anual', label: 'Anual', note: `−${ANNUAL_DISCOUNT} %` },
];

/* ── Precio de cada producto (plantilla de producto y hub) ─────────── */

/**
 * Lectura ÚNICA del precio de un producto para la web: la mini-tarjeta del hero, la banda de
 * precio de cada página de producto y el JSON-LD salen de aquí. Para cambiar un precio basta con
 * tocar los datos de arriba: las páginas no se tocan.
 */
export interface SolutionPricing {
  /** Línea principal: «Incluido en todos los planes», «Incluido en el plan Total», «Complemento» */
  label: string;
  /** Cifra principal ya formateada («49 €», «99 €») o `null` si no hay tarifa publicada */
  amount: string | null;
  /** Unidad de la cifra: «/mes por local» */
  period: string;
  /** Alternativa: «o +19 €/mes por local sobre el Esencial» */
  alt?: string;
  /** Cómo se cobra cuando todavía no hay cifra («Cuota mensual más minutos de llamada») */
  unit?: string;
  /** Planes que lo incluyen, en orden */
  plans: Plan[];
  /** Plan con el que se suele empezar para tenerlo (preselección del formulario) */
  plan?: PlanId;
  /** Precio mensual orientativo para el JSON-LD (solo si es público) */
  monthly?: number;
  /** Texto para el JSON-LD (`Offer.description`) */
  offerNote?: string;
}

/**
 * Cómo se cobra cada complemento, en una línea. Se enseña junto a la cifra para que se entienda
 * la forma de pago.
 */
export const addonUnits: Partial<Record<SolutionSlug, string>> = {
  'app-propia': 'Cuota fija por local, sin comisión por pedido ni por reserva.',
  'llamadas-ia': `Cuota con ${IA_MINUTES_INCLUDED} minutos al mes; el minuto extra, a ${fmtCents(IA_EXTRA_MINUTE)} ${CURRENCY}. Nunca por reserva ni por pedido.`,
  'web-para-restaurantes': `${WEB_SETUP} ${CURRENCY} de alta, una sola vez, y cuota mensual con el mantenimiento incluido.`,
  erp: 'Cuota mensual por empresa o sociedad, tengas los locales que tengas.',
  rrhh: `Cuota por local hasta ${RRHH_PEOPLE_INCLUDED} personas; +${RRHH_EXTRA_PERSON} ${CURRENCY}/mes por cada persona más.`,
};

export const plansIncluding = (slug: SolutionSlug) => plans.filter((p) => p.modules.includes(slug));

export const solutionPricing = (slug: SolutionSlug): SolutionPricing => {
  const including = plansIncluding(slug);
  const loose = addonModules.find((a) => a.module === slug);
  const addon = getAddon(slug);
  const period = '/mes por local';
  const first = including.find((p) => p.monthly !== null);

  if (basePlan.modules.includes(slug)) {
    return {
      label: 'Incluido en todos los planes',
      amount: `desde ${fmtPrice(FROM_PRICE)}`,
      period,
      alt: `Con el plan ${basePlan.name}, sin comisiones.`,
      plans: including,
      plan: basePlan.id,
      monthly: FROM_PRICE,
      offerNote: `Incluido desde el plan ${basePlan.name}. Precio orientativo por local y mes, sin IVA.`,
    };
  }
  // Complemento que además va dentro del Total: la cifra es la del complemento (lo más barato
  // para tenerlo) y la alternativa, el plan que lo incluye.
  if (addon && first) {
    return {
      label: 'Complemento para cualquier plan',
      amount: fmtPrice(addon.monthly),
      period: addon.period,
      alt: `${addonUnits[slug]} Incluido en el plan ${first.name} (${fmtPrice(first.monthly as number)}/mes por local).`,
      plans: including,
      plan: first.id,
      monthly: addon.monthly,
      offerNote: `Complemento: ${fmtPrice(addon.monthly)}${addon.period}. Incluido en el plan ${first.name}. Precio orientativo, sin IVA.`,
    };
  }
  if (first) {
    return {
      label: `Incluido en el plan ${first.name}`,
      amount: fmtPrice(first.monthly as number),
      period,
      alt: loose
        ? `o +${fmtPrice(loose.monthly)}/mes por local sobre el ${basePlan.name}.`
        : undefined,
      plans: including,
      plan: first.id,
      monthly: first.monthly as number,
      offerNote: `Incluido en el plan ${first.name}. Precio orientativo por local y mes, sin IVA.`,
    };
  }
  if (addon) {
    return {
      label: 'Complemento para cualquier plan',
      amount: fmtPrice(addon.monthly),
      period: addon.period,
      alt: addonUnits[slug],
      plans: including,
      monthly: addon.monthly,
      offerNote: `Complemento: ${fmtPrice(addon.monthly)}${addon.period} y ${fmtPrice(addon.setup ?? 0)} de alta. Precio orientativo, sin IVA.`,
    };
  }
  return {
    label: 'Complemento para cualquier plan',
    amount: null,
    period,
    unit: addonUnits[slug],
    plans: including,
  };
};

/**
 * «Elige por dónde empezar» (hub de soluciones): tres caminos con precio. El tercero es el
 * ecosistema entero, que es el plan Total.
 */
export interface StartingPath {
  id: string;
  name: string;
  claim: string;
  /** Precio ya formateado o `null` */
  amount: string | null;
  includes: string[];
  plan?: PlanId;
  featured?: boolean;
}

export const startingPaths = (): StartingPath[] => {
  const completo = getPlan('completo');
  return [
    {
      id: basePlan.id,
      name: basePlan.name,
      claim: 'Cobrar bien y tener la carta al día.',
      amount: fmtPrice(basePlan.monthly as number),
      includes: ['TPV', 'Carta digital QR', 'Backoffice e informes'],
      plan: basePlan.id,
    },
    {
      id: completo.id,
      name: completo.name,
      claim: 'Sala, cocina y tus propios canales.',
      amount: fmtPrice(completo.monthly as number),
      includes: [
        `Todo lo del ${basePlan.name}`,
        'Comandero y pantalla de cocina',
        'Reservas, pedidos online y clientes',
      ],
      plan: completo.id,
      featured: true,
    },
    {
      id: 'ecosistema',
      name: `Todo el ecosistema: plan ${totalPlan.name}`,
      claim: 'El restaurante entero, también la oficina.',
      amount: fmtPrice(totalPlan.monthly as number),
      includes: [
        `Todo lo del ${completo.name}`,
        'App propia y llamadas con IA',
        'ERP y gestión del equipo',
      ],
      plan: totalPlan.id,
    },
  ];
};

/* ── Comparativa «herramientas sueltas» (docs/investigacion, consultado el 16-11-2026) ── */

/**
 * Lo que cuesta cada pieza contratada por separado, en RANGOS de precios PÚBLICOS con su
 * fuente. Solo tarifas publicadas; sin valoraciones de nadie. Fuentes y URL en
 * docs/investigacion/competidores-espana.md y ecosistema-y-embudo.md.
 */
export const COMPARISON_CHECKED = '16-11-2026';

/**
 * Rango habitual de comisión de los agregadores por pedido (calculadora D6). Fuente en
 * docs/investigacion/mercado-y-seo.md: recopilación de un proveedor del sector, no contrastada
 * con las tarifas oficiales. Pendiente (Jordi): sustituirla por las tarifas públicas de cada
 * plataforma cuando se puedan citar.
 */
export const COMMISSION_RANGE = {
  min: 14,
  max: 30,
  source: `recopilación publicada por un proveedor de software de hostelería, consultada el ${COMPARISON_CHECKED}; no contrastada con las tarifas oficiales de cada plataforma`,
};
export interface ComparisonRow {
  piece: string;
  /** Rango de mercado, ya escrito */
  market: string;
  /** Fuente pública del rango */
  source: string;
  /** Cómo va en alaCarta */
  alacarta: string;
}
export const comparisonRows: ComparisonRow[] = [
  {
    piece: 'TPV y gestión',
    market: '34–99 €/mes por local',
    source: 'Tarifas públicas de Ágora (Basic) y Qamarero (Basic)',
    alacarta: `Desde ${fmtPrice(FROM_PRICE)}/mes, con carta QR, backoffice e informes`,
  },
  {
    piece: 'Pantalla de cocina, cuando se cobra aparte',
    market: '35 €/mes por local',
    source: 'Configurador público de Last.app',
    alacarta: 'Incluida en Completo y Total',
  },
  {
    piece: 'Reservas',
    market: '64–82 €/mes, o comisión por comensal en los portales',
    source: 'Tarifas públicas de Ágora Bookings; planes de TheFork Manager',
    alacarta: 'Incluidas en Completo y Total, sin comisión por comensal',
  },
  {
    piece: 'Pedidos online y pago con QR',
    market: '4 % + 0,20 € por venta; agregadores, del 14 % al 30 % por pedido',
    source:
      'Tabla pública de Last.app; recopilación de comisiones publicada por un proveedor del sector (no contrastada)',
    alacarta: '0 % de comisión: solo la de tu pasarela de pago',
  },
  {
    piece: 'Recepcionista telefónica con IA',
    market: '49–199 €/mes según minutos',
    source:
      'Tarifas recopiladas por un proveedor del sector y página pública de Zenchef (99 €/mes); conviene verificarlas',
    alacarta: `${fmtPrice(getAddon('llamadas-ia')!.monthly)}/mes con ${IA_MINUTES_INCLUDED} minutos, o en el Total`,
  },
  {
    piece: 'Fichaje y turnos',
    market: 'Gratis hasta 5 personas y 3,50 €/mes por persona más',
    source: 'Tarifa pública de Square Turnos',
    alacarta: `${fmtPrice(getAddon('rrhh')!.monthly)}/mes por local hasta ${RRHH_PEOPLE_INCLUDED} personas, o en el Total`,
  },
  {
    piece: 'Control de costes y finanzas',
    market: '149–299 €/mes',
    source: 'Tarifas públicas de Haddock',
    alacarta: `ERP: ${fmtPrice(getAddon('erp')!.monthly)}/mes por empresa, o en el Total`,
  },
  {
    piece: 'Instalación y puesta en marcha',
    market: '150–500 € al empezar',
    source: 'Tarifas públicas de Qamarero y Last.app; Foodeo, según un tercero',
    alacarta: `Remota incluida; presencial desde ${fmtPrice(ONSITE_TRAINING_FROM)}`,
  },
];
