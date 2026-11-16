/**
 * Fuente única de los precios de la web. Ninguna cifra de precio se escribe en otro sitio.
 *
 * ESTADO: propuesta orientativa (noviembre de 2026). La justificación está en
 * docs/PRECIOS.md. Son precios «desde», sin IVA, por local y mes. Antes de la salida
 * comercial hay que confirmarlos (ver docs/TODO.md).
 *
 * Modelo:
 * - Suscripción por local. Dos planes públicos y uno a medida para grupos.
 * - El plan Completo incluye todos los módulos. El Esencial puede añadir módulos sueltos.
 * - Dispositivos adicionales por unidad. Puesta en marcha remota incluida. Sin permanencia.
 * - 0 % de comisión en carta QR, reservas y pedidos online: solo cuota fija.
 */
import type { SolutionSlug } from './solutions';

export const PRICES_ARE_ESTIMATES = true;
export const CURRENCY = '€';
export const VAT_NOTE = '+ IVA';
export const ANNUAL_DISCOUNT = 15; // %
export const TRIAL_DAYS = 14;
export const SETUP_REMOTE_PRICE = 0;
export const ONSITE_TRAINING_FROM = 290;
export const MIN_LOCATIONS_GROUP = 3;

export type Billing = 'mensual' | 'anual';
export type PlanId = 'esencial' | 'completo' | 'grupos';

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
  cta: { label: string; href: string };
}

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
    modules: ['tpv', 'carta-qr', 'gestion', 'informes'],
    cta: { label: 'Empezar con Esencial', href: '/solicitar-demo?plan=esencial' },
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
    modules: [
      'tpv',
      'carta-qr',
      'gestion',
      'informes',
      'comandero',
      'cocina',
      'reservas',
      'pedidos',
      'clientes',
    ],
    cta: { label: 'Empezar con Completo', href: '/solicitar-demo?plan=completo' },
  },
  {
    id: 'grupos',
    name: 'Grupos',
    claim: `Para grupos y cadenas a partir de ${MIN_LOCATIONS_GROUP} locales.`,
    monthly: null,
    includes: [
      'Todo lo del plan Completo en cada local',
      'Carta maestra con variantes por local',
      'Multiempresa: varias sociedades',
      'Roles y permisos centralizados',
      'Informes comparativos entre locales',
      'API y integraciones',
      'Gestor de cuenta y acuerdo de servicio',
    ],
    modules: [
      'tpv',
      'carta-qr',
      'gestion',
      'informes',
      'comandero',
      'cocina',
      'reservas',
      'pedidos',
      'clientes',
    ],
    cta: { label: 'Hablar con nosotros', href: '/contacto?motivo=grupos' },
  },
];

export const basePlan = plans[0]!;
export const featuredPlan = plans.find((p) => p.featured) ?? plans[1]!;

/** Módulos que el plan Esencial puede añadir por separado (precio por local y mes) */
export interface AddonModule {
  module: SolutionSlug;
  name: string;
  monthly: number;
  note?: string;
}
export const addonModules: AddonModule[] = [
  { module: 'comandero', name: 'Comandero móvil', monthly: 19, note: 'Incluye 2 dispositivos' },
  { module: 'cocina', name: 'Pantalla de cocina', monthly: 19, note: 'Incluye 1 pantalla' },
  { module: 'reservas', name: 'Reservas', monthly: 19, note: 'Sin comisión por comensal' },
  { module: 'pedidos', name: 'Pedidos online', monthly: 29, note: 'Sin comisión por pedido' },
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

/* ── Cálculos ──────────────────────────────────────────────────────── */

export const round2 = (n: number) => Math.round(n * 100) / 100;

/** Precio mensual según forma de pago. Con el anual, el equivalente al mes */
export const planMonthly = (plan: Plan, billing: Billing): number | null =>
  plan.monthly === null
    ? null
    : billing === 'anual'
      ? Math.round(plan.monthly * (1 - ANNUAL_DISCOUNT / 100))
      : plan.monthly;

/** Pago real al año con el anual */
export const planYearly = (plan: Plan): number | null =>
  plan.monthly === null ? null : (planMonthly(plan, 'anual') as number) * 12;

/** «49 €» */
export const fmtPrice = (n: number) =>
  `${Number.isInteger(n) ? n : n.toFixed(2).replace('.', ',')} ${CURRENCY}`;

/** El «desde» de toda la web */
export const FROM_PRICE = basePlan.monthly as number;
export const fromLabel = `desde ${fmtPrice(FROM_PRICE)}/mes por local`;

export const billingOptions: { id: Billing; label: string; note?: string }[] = [
  { id: 'mensual', label: 'Mensual' },
  { id: 'anual', label: 'Anual', note: `−${ANNUAL_DISCOUNT} %` },
];
