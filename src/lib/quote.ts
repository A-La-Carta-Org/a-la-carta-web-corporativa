/**
 * Lógica del configurador «Monta tu alaCarta» (docs/auditoria/09 y 10 · D5). Módulo PURO: sin
 * DOM, sin Vue, sin fechas. Entra una configuración y sale el ticket: líneas, subtotal mensual,
 * total anual, ahorro por pagar el año, pagos únicos, lo que va «en tu propuesta» y avisos.
 *
 * - Elige solo el plan más barato que cubre lo marcado (Esencial con sueltos, Completo o Total)
 *   y dice cuánto ahorra frente a la alternativa inmediata.
 * - Las cifras salen de src/data/pricing.ts; aquí no se escribe ningún precio.
 * - `encodeConfig` / `decodeConfig` dan el parámetro compacto `config=` de la URL, que viaja al
 *   formulario de demo con `ctaHref({ to: 'demo', config, origen: 'configurador' })`.
 *
 * Comprobación: `npm run check:quote` (scripts/check-quote.mjs) recalcula casos conocidos.
 */
import {
  ANNUAL_DISCOUNT,
  IA_EXTRA_MINUTE,
  IA_MINUTES_INCLUDED,
  MIN_LOCATIONS_GROUP,
  NO_PRICE_LABEL,
  ONSITE_TRAINING_FROM,
  RRHH_EXTRA_PERSON,
  RRHH_PEOPLE_INCLUDED,
  addonModules,
  addons,
  annualMonthly,
  fmtPrice,
  getAddon,
  getDevicePrice,
  getPlan,
  round2,
  type Billing,
  type PlanId,
} from '@/data/pricing';

/* ── Entradas ──────────────────────────────────────────────────────── */

/** Lo que se puede marcar además de lo que va en todos los planes (TPV, carta QR, backoffice) */
export type QuoteModule =
  | 'comandero'
  | 'cocina'
  | 'reservas'
  | 'pedidos-online'
  | 'clientes'
  | 'app-propia'
  | 'llamadas-ia'
  | 'web-para-restaurantes'
  | 'erp'
  | 'rrhh';

export interface QuoteConfig {
  modules: QuoteModule[];
  /** Número de locales (cuota por local) */
  locales: number;
  /** Terminales TPV por local */
  terminales: number;
  /** Comanderos por local (si hay comandero) */
  comanderos: number;
  /** Pantallas de cocina por local (si hay cocina) */
  pantallas: number;
  /** Minutos de llamada con IA al mes por local (estimación) */
  minutos: number;
  /** Personas del equipo por local (Equipo y RRHH) */
  personas: number;
  /** Empresas o sociedades (ERP) */
  empresas: number;
  billing: Billing;
  /** Quiere hardware (kits): precio en la propuesta */
  hardware: boolean;
  /** Quiere placas QR para las mesas: precio en la propuesta */
  placas: boolean;
  /** Formación presencial en el local */
  presencial: boolean;
  /** Migración de datos desde otro sistema */
  migracion: boolean;
  /** Se apunta a locales fundadores */
  fundador: boolean;
  /** Ya tiene TPV y solo quiere gestión o web (sin plan de alaCarta) */
  sinTpv: boolean;
}

export const QUOTE_LIMITS = {
  locales: { min: 1, max: 20 },
  terminales: { min: 1, max: 10 },
  comanderos: { min: 1, max: 20 },
  pantallas: { min: 1, max: 6 },
  minutos: { min: 0, max: 3000, step: 50 },
  personas: { min: 1, max: 200 },
  empresas: { min: 1, max: 10 },
} as const;
type NumKey = keyof typeof QUOTE_LIMITS;

export const defaultConfig = (): QuoteConfig => ({
  modules: [],
  locales: 1,
  terminales: 1,
  comanderos: 2,
  pantallas: 1,
  minutos: IA_MINUTES_INCLUDED,
  personas: 12,
  empresas: 1,
  billing: 'mensual',
  hardware: false,
  placas: false,
  presencial: false,
  migracion: false,
  fundador: false,
  sinTpv: false,
});

/** Módulos que se pueden tener sin plan («ya tengo TPV») */
export const STANDALONE_MODULES: QuoteModule[] = ['erp', 'rrhh', 'web-para-restaurantes'];

/* ── Salida ────────────────────────────────────────────────────────── */

export type QuotePlan = Exclude<PlanId, 'grupos'> | 'ninguno';

export interface QuoteLine {
  id: string;
  label: string;
  /** Matiz: «2 × 12 €», «incluye 3 comanderos» */
  detail?: string;
  /** Importe al mes (equivalente al mes si se paga el año). `null` = sin cifra */
  amount: number | null;
  /** Texto en lugar del importe: «incluido», «En tu propuesta», «A medida» */
  text?: string;
  /** El importe es un mínimo («desde») */
  from?: boolean;
}

export interface Quote {
  plan: QuotePlan;
  planName: string;
  /** Líneas de la cuota mensual */
  lines: QuoteLine[];
  /** Pagos únicos y servicios */
  once: QuoteLine[];
  /** Subtotal mensual (equivalente al mes con el pago anual) */
  monthly: number;
  /** Lo que se paga en 12 meses de cuota */
  yearly: number;
  /** Ahorro anual del pago anual. Con «mensual», lo que ahorrarías pasándote al anual */
  annualSaving: number;
  /** Suma de los pagos únicos con cifra */
  onceTotal: number;
  /** Algún pago único es «desde» */
  onceFrom: boolean;
  /** Lo que va «en tu propuesta» o «a medida» */
  pending: string[];
  /** «Te sale mejor el plan Completo: −X €/mes» */
  better?: { planName: string; vs: string; saving: number };
  /** Plan de arriba, si sale por poco más */
  upsell?: { planName: string; extra: number; adds: string[] };
  /** Comisiones por pedido, reserva o pago QR: siempre 0 */
  commissions: 0;
  notices: string[];
}

/* ── Nombres cortos para el ticket ─────────────────────────────────── */

export const moduleNames: Record<QuoteModule, string> = {
  comandero: 'Comandero',
  cocina: 'Pantalla de cocina',
  reservas: 'Reservas',
  'pedidos-online': 'Pedidos online',
  clientes: 'Clientes y fidelización',
  'app-propia': 'App propia',
  'llamadas-ia': 'Llamadas con IA',
  'web-para-restaurantes': 'Web y Google',
  erp: 'ERP',
  rrhh: 'Equipo y RRHH',
};

const ALL_MODULES = Object.keys(moduleNames) as QuoteModule[];
export const isQuoteModule = (s: string): s is QuoteModule => (ALL_MODULES as string[]).includes(s);

/* ── Utilidades ────────────────────────────────────────────────────── */

const clamp = (key: NumKey, n: number) => {
  const { min, max } = QUOTE_LIMITS[key];
  if (!Number.isFinite(n)) return defaultConfig()[key];
  return Math.min(max, Math.max(min, Math.round(n)));
};

/** Devuelve una copia limpia: números dentro de rango, módulos válidos y sin repetir */
export const normalizeConfig = (c: Partial<QuoteConfig>): QuoteConfig => {
  const d = defaultConfig();
  const merged = { ...d, ...c };
  const modules = ALL_MODULES.filter((m) => (merged.modules ?? []).includes(m));
  return {
    ...merged,
    modules,
    locales: clamp('locales', merged.locales),
    terminales: clamp('terminales', merged.terminales),
    comanderos: clamp('comanderos', merged.comanderos),
    pantallas: clamp('pantallas', merged.pantallas),
    minutos: clamp('minutos', merged.minutos),
    personas: clamp('personas', merged.personas),
    empresas: clamp('empresas', merged.empresas),
    billing: merged.billing === 'anual' ? 'anual' : 'mensual',
  };
};

const has = (c: QuoteConfig, m: QuoteModule) => c.modules.includes(m);

/** «app propia, ERP y equipo y RRHH»: minúscula salvo siglas, y «y» antes del último */
export const listNames = (names: string[]) => {
  const lc = names.map((n) => (/^[A-Z]{2,}/.test(n) ? n : n.charAt(0).toLowerCase() + n.slice(1)));
  return lc.length > 1 ? `${lc.slice(0, -1).join(', ')} y ${lc.at(-1)}` : (lc[0] ?? '');
};
const times = (n: number, unit: number) => (n > 1 ? `${n} × ${fmtPrice(round2(unit))}` : undefined);

/* ── Cálculo de un camino (un plan concreto) ───────────────────────── */

interface PathResult {
  plan: QuotePlan;
  lines: QuoteLine[];
  monthly: number;
  /** Cuota mensual de plan (para el ahorro anual) */
  planFee: number;
}

const planOrder: QuotePlan[] = ['esencial', 'completo', 'total'];

/** ¿Este plan cubre lo marcado? Esencial siempre (con sueltos); los demás, también */
const pathFor = (c: QuoteConfig, plan: QuotePlan): PathResult => {
  const lines: QuoteLine[] = [];
  const L = c.locales;
  const perLocal = (n: number) => (L > 1 ? `${L} locales × ${fmtPrice(round2(n))}` : undefined);
  let planFee = 0;

  if (plan !== 'ninguno') {
    const p = getPlan(plan);
    const fee = c.billing === 'anual' ? annualMonthly(p.monthly as number) : (p.monthly as number);
    planFee = fee * L;
    lines.push({
      id: `plan-${p.id}`,
      label: `Plan ${p.name}`,
      detail:
        perLocal(fee) ?? (c.billing === 'anual' ? `pago anual, −${ANNUAL_DISCOUNT} %` : undefined),
      amount: planFee,
    });

    // Módulos sueltos sobre Esencial
    if (plan === 'esencial') {
      for (const m of addonModules) {
        if (!has(c, m.module as QuoteModule)) continue;
        lines.push({
          id: `mod-${m.module}`,
          label: m.name,
          detail: perLocal(m.monthly),
          amount: m.monthly * L,
        });
      }
    }

    // Dispositivos de más
    const included = p.devices;
    const comanderosIncl =
      plan === 'esencial'
        ? (addonModules.find((m) => m.module === 'comandero')?.devices ?? 0)
        : included.comandero;
    const kdsIncl =
      plan === 'esencial'
        ? (addonModules.find((m) => m.module === 'cocina')?.devices ?? 0)
        : included.kds;
    const extra: [string, string, number, number][] = [
      [
        'tpv',
        'Terminal TPV de más',
        Math.max(0, c.terminales - included.tpv),
        getDevicePrice('tpv'),
      ],
      [
        'comandero',
        'Comandero de más',
        has(c, 'comandero') ? Math.max(0, c.comanderos - comanderosIncl) : 0,
        getDevicePrice('comandero'),
      ],
      [
        'kds',
        'Pantalla de cocina de más',
        has(c, 'cocina') ? Math.max(0, c.pantallas - kdsIncl) : 0,
        getDevicePrice('kds'),
      ],
    ];
    for (const [id, label, n, price] of extra) {
      if (n <= 0) continue;
      const units = n * L;
      lines.push({ id: `dev-${id}`, label, detail: times(units, price), amount: units * price });
    }
  }

  // Complementos
  const inPlan = (slug: string) =>
    plan !== 'ninguno' && getPlan(plan).modules.includes(slug as never);
  for (const a of addons) {
    if (!has(c, a.module)) continue;
    if (plan === 'ninguno' && !STANDALONE_MODULES.includes(a.module)) continue;
    const included = inPlan(a.module);
    if (a.module === 'erp') {
      const paid = included ? Math.max(0, c.empresas - 1) : c.empresas;
      if (included) {
        lines.push({
          id: 'addon-erp',
          label: 'ERP',
          detail: '1 empresa',
          amount: null,
          text: 'incluido',
        });
      }
      if (paid > 0) {
        lines.push({
          id: included ? 'addon-erp-extra' : 'addon-erp',
          label: included ? 'ERP, otra empresa' : 'ERP',
          detail: times(paid, a.monthly) ?? (paid === 1 ? '1 empresa' : undefined),
          amount: paid * a.monthly,
        });
      }
      continue;
    }
    if (included) {
      lines.push({
        id: `addon-${a.module}`,
        label: moduleNames[a.module],
        detail: a.includes,
        amount: null,
        text: 'incluido',
      });
    } else {
      const units = a.per === 'local' ? L : 1;
      lines.push({
        id: `addon-${a.module}`,
        label: moduleNames[a.module],
        detail: times(units, a.monthly) ?? a.includes,
        amount: units * a.monthly,
      });
    }
    // Uso por encima de lo incluido
    if (a.module === 'llamadas-ia' && c.minutos > IA_MINUTES_INCLUDED) {
      const mins = (c.minutos - IA_MINUTES_INCLUDED) * L;
      lines.push({
        id: 'use-ia',
        label: 'Minutos de IA de más',
        detail: `${mins} min × ${fmtPrice(IA_EXTRA_MINUTE)}`,
        amount: round2(mins * IA_EXTRA_MINUTE),
      });
    }
    if (a.module === 'rrhh' && c.personas > RRHH_PEOPLE_INCLUDED) {
      const people = (c.personas - RRHH_PEOPLE_INCLUDED) * L;
      lines.push({
        id: 'use-rrhh',
        label: 'Personas de más',
        detail: `${people} × ${fmtPrice(RRHH_EXTRA_PERSON)}`,
        amount: people * RRHH_EXTRA_PERSON,
      });
    }
  }

  const monthly = round2(lines.reduce((s, l) => s + (l.amount ?? 0), 0));
  return { plan, lines, monthly, planFee };
};

/** Lo que lleva un plan además de lo marcado (para «incluye también…») */
const bonusOf = (c: QuoteConfig, plan: QuotePlan): string[] => {
  if (plan === 'ninguno' || plan === 'esencial') return [];
  const p = getPlan(plan);
  return ALL_MODULES.filter((m) => p.modules.includes(m as never) && !has(c, m)).map(
    (m) => moduleNames[m]
  );
};

/* ── Presupuesto ───────────────────────────────────────────────────── */

export const quote = (input: Partial<QuoteConfig>): Quote => {
  const c = normalizeConfig(input);
  const notices: string[] = [];

  // Camino elegido: el más barato de los que cubren lo marcado
  let chosen: PathResult;
  let better: Quote['better'];
  let upsell: Quote['upsell'];
  if (c.sinTpv) {
    chosen = pathFor(c, 'ninguno');
    const ignored = c.modules.filter((m) => !STANDALONE_MODULES.includes(m));
    if (ignored.length) {
      notices.push(
        `${ignored.map((m) => moduleNames[m]).join(', ')}: van sobre un plan de alaCarta. Quita «Ya tengo TPV» para sumarlos.`
      );
    }
  } else {
    const paths = planOrder.map((p) => pathFor(c, p));
    chosen = paths.reduce((best, p) => (p.monthly < best.monthly ? p : best), paths[0]!);
    const idx = planOrder.indexOf(chosen.plan);
    // Ahorro frente al plan de abajo (el que tendría quien suma piezas sueltas)
    if (idx > 0) {
      const below = paths[idx - 1]!;
      const saving = round2(below.monthly - chosen.monthly);
      if (saving > 0) {
        better = {
          planName: getPlan(chosen.plan as PlanId).name,
          vs:
            below.plan === 'esencial'
              ? 'Esencial con módulos sueltos'
              : `${getPlan(below.plan as PlanId).name} con complementos`,
          saving,
        };
      }
    }
    // Plan de arriba por poco más: se enseña qué añade, sin empujar
    const above = paths[idx + 1];
    if (above) {
      const extra = round2(above.monthly - chosen.monthly);
      const adds = bonusOf(c, above.plan).filter((n) => !bonusOf(c, chosen.plan).includes(n));
      if (extra > 0 && extra <= 30 * c.locales && adds.length) {
        upsell = { planName: getPlan(above.plan as PlanId).name, extra, adds };
      }
    }
    const bonus = bonusOf(c, chosen.plan);
    if (bonus.length) {
      const planLine = chosen.lines[0]!;
      planLine.detail = [planLine.detail, `incluye también ${listNames(bonus)}`]
        .filter(Boolean)
        .join(' · ');
    }
  }

  // Pagos únicos y servicios
  const once: QuoteLine[] = [];
  const pending: string[] = [];
  const web = getAddon('web-para-restaurantes')!;
  if (has(c, 'web-para-restaurantes')) {
    once.push({ id: 'once-web', label: 'Alta de la web', amount: web.setup ?? 0 });
  }
  once.push({ id: 'once-remota', label: 'Puesta en marcha remota', amount: 0, text: 'incluida' });
  if (c.presencial || c.fundador) {
    once.push(
      c.fundador
        ? {
            id: 'once-presencial',
            label: 'Puesta en marcha presencial',
            detail: 'local fundador',
            amount: 0,
            text: 'incluida',
          }
        : {
            id: 'once-presencial',
            label: 'Formación presencial',
            detail:
              c.locales > 1
                ? `${c.locales} locales, desplazamiento aparte`
                : 'desplazamiento aparte',
            amount: ONSITE_TRAINING_FROM * c.locales,
            from: true,
          }
    );
  }
  if (c.migracion) {
    once.push({
      id: 'once-migracion',
      label: 'Migración de datos',
      amount: null,
      text: 'A medida',
    });
    pending.push('Migración de datos');
  }
  if (c.hardware) {
    once.push({
      id: 'once-hardware',
      label: 'Hardware',
      detail: 'o usa el tuyo',
      amount: null,
      text: NO_PRICE_LABEL,
    });
    pending.push('Hardware');
  }
  if (c.placas) {
    once.push({ id: 'once-placas', label: 'Placas QR', amount: null, text: NO_PRICE_LABEL });
    pending.push('Placas QR');
  }

  // Avisos honestos
  if (c.locales >= MIN_LOCATIONS_GROUP) {
    notices.push(
      `Con ${c.locales} locales te corresponde el plan Grupos: te preparamos precio por volumen, así que esta cuenta es el máximo.`
    );
  }
  const plan = chosen.plan;
  const covered = (m: QuoteModule) =>
    has(c, m) || (plan !== 'ninguno' && getPlan(plan).modules.includes(m as never));
  if (has(c, 'app-propia') && !c.sinTpv && !covered('reservas') && !covered('pedidos-online')) {
    notices.push(
      'La app propia enseña tu carta; para reservar o pedir desde ella, añade Reservas o Pedidos online.'
    );
  }
  if (has(c, 'llamadas-ia') && !c.sinTpv && !covered('reservas') && !covered('pedidos-online')) {
    notices.push(
      'Las llamadas con IA apuntan reservas y pedidos para recoger: necesitan Reservas o Pedidos online.'
    );
  }
  if (c.fundador) {
    notices.push(
      'Local fundador: este precio se queda bloqueado mientras sigas con la suscripción.'
    );
  }

  const monthly = chosen.monthly;
  const fullPlanFee = plan === 'ninguno' ? 0 : (getPlan(plan).monthly as number) * c.locales;
  const annualSaving =
    plan === 'ninguno'
      ? 0
      : (fullPlanFee - annualMonthly(getPlan(plan).monthly as number) * c.locales) * 12;

  return {
    plan,
    planName: plan === 'ninguno' ? 'Sin plan' : getPlan(plan).name,
    lines: chosen.lines,
    once,
    monthly,
    yearly: round2(monthly * 12),
    annualSaving: round2(annualSaving),
    onceTotal: round2(once.reduce((s, l) => s + (l.amount ?? 0), 0)),
    onceFrom: once.some((l) => l.from),
    pending,
    better,
    upsell,
    commissions: 0,
    notices,
  };
};

/* ── URL: `config=` compacto ───────────────────────────────────────── */

/**
 * Formato: segmentos separados por «_». El primero (si hay módulos) son códigos de dos letras
 * unidos por «.»; el resto, una letra con número opcional. Solo se escribe lo que no es por
 * defecto. Ejemplo: `co.kd.re.rh_l2_t2_e25_a_f` = comandero, cocina, reservas y RRHH en 2
 * locales, 2 TPV por local, 25 personas, pago anual, local fundador.
 */
const moduleCodes: Record<QuoteModule, string> = {
  comandero: 'co',
  cocina: 'kd',
  reservas: 're',
  'pedidos-online': 'po',
  clientes: 'cl',
  'app-propia': 'ap',
  'llamadas-ia': 'ia',
  'web-para-restaurantes': 'we',
  erp: 'er',
  rrhh: 'rh',
};
const numCodes: Record<NumKey, string> = {
  locales: 'l',
  terminales: 't',
  comanderos: 'c',
  pantallas: 'k',
  minutos: 'n',
  personas: 'e',
  empresas: 's',
};
const flagCodes = {
  hardware: 'h',
  placas: 'q',
  presencial: 'p',
  migracion: 'g',
  fundador: 'f',
  sinTpv: 'x',
} as const;
type FlagKey = keyof typeof flagCodes;

export const encodeConfig = (input: Partial<QuoteConfig>): string => {
  const c = normalizeConfig(input);
  const d = defaultConfig();
  const parts: string[] = [];
  if (c.modules.length) parts.push(c.modules.map((m) => moduleCodes[m]).join('.'));
  for (const key of Object.keys(numCodes) as NumKey[]) {
    if (c[key] !== d[key]) parts.push(`${numCodes[key]}${c[key]}`);
  }
  if (c.billing === 'anual') parts.push('a');
  for (const key of Object.keys(flagCodes) as FlagKey[]) {
    if (c[key]) parts.push(flagCodes[key]);
  }
  return parts.join('_');
};

export const decodeConfig = (raw: string | null | undefined): QuoteConfig => {
  const c: Partial<QuoteConfig> = { modules: [] };
  if (!raw) return normalizeConfig(c);
  const byModule = Object.fromEntries(
    Object.entries(moduleCodes).map(([k, v]) => [v, k as QuoteModule])
  );
  const byNum = Object.fromEntries(Object.entries(numCodes).map(([k, v]) => [v, k as NumKey]));
  const byFlag = Object.fromEntries(Object.entries(flagCodes).map(([k, v]) => [v, k as FlagKey]));
  for (const part of raw.slice(0, 200).split('_')) {
    if (/^[a-z]{2}(\.[a-z]{2})*$/.test(part)) {
      for (const code of part.split('.')) {
        const m = byModule[code];
        if (m) c.modules!.push(m);
      }
      continue;
    }
    const match = /^([a-z])(\d{1,5})?$/.exec(part);
    if (!match) continue;
    const [, key, num] = match;
    if (key === 'a') c.billing = 'anual';
    else if (num !== undefined && byNum[key!]) c[byNum[key!]!] = Number(num);
    else if (byFlag[key!]) c[byFlag[key!]!] = true;
  }
  return normalizeConfig(c);
};

/** Resumen legible de una configuración (para el formulario y el correo de propuesta) */
export const describeConfig = (input: Partial<QuoteConfig>): string => {
  const c = normalizeConfig(input);
  const q = quote(c);
  const bits = [
    q.plan === 'ninguno' ? 'Sin plan (ya tiene TPV)' : `Plan ${q.planName}`,
    `${c.locales} ${c.locales === 1 ? 'local' : 'locales'}`,
    ...c.modules.map((m) => moduleNames[m]),
    c.terminales > 1 ? `${c.terminales} TPV por local` : '',
    c.hardware ? 'hardware' : '',
    c.placas ? 'placas QR' : '',
    c.presencial ? 'formación presencial' : '',
    c.migracion ? 'migración' : '',
    c.fundador ? 'local fundador' : '',
    c.billing === 'anual' ? 'pago anual' : 'pago mensual',
    `${fmtPrice(q.monthly)}/mes orientativo`,
  ];
  return bits.filter(Boolean).join(' · ');
};

/* ── Preselecciones que llegan por URL ─────────────────────────────── */

/** `?plan=`: marca lo que lleva ese plan */
export const modulesOfPlan = (plan: string): QuoteModule[] => {
  if (!['esencial', 'completo', 'total', 'grupos'].includes(plan)) return [];
  const p = getPlan(plan as PlanId);
  return ALL_MODULES.filter((m) => p.modules.includes(m as never));
};

/**
 * `?sector=`: punto de partida orientativo por tipo de local (lo que suelen necesitar, no lo
 * que deben contratar). El visitante lo cambia en un clic. Las páginas de sector enseñan este
 * mismo punto de partida como «configuración recomendada» (src/pages/sectores/[slug].astro).
 */
export const sectorPresets: Record<string, Partial<QuoteConfig>> = {
  restaurantes: { modules: ['comandero', 'cocina', 'reservas', 'clientes'], comanderos: 3 },
  bares: { modules: ['comandero'], comanderos: 2, placas: true },
  cafeterias: { modules: ['clientes'], placas: true },
  pizzerias: { modules: ['cocina', 'pedidos-online', 'llamadas-ia'] },
  hamburgueserias: { modules: ['cocina', 'pedidos-online'] },
  cervecerias: { modules: ['comandero', 'cocina'], comanderos: 3, placas: true },
  'pubs-coctelerias': { modules: ['comandero', 'reservas'], comanderos: 2 },
  'take-away-delivery': { modules: ['cocina', 'pedidos-online', 'app-propia', 'llamadas-ia'] },
  'grupos-y-cadenas': {
    modules: ['comandero', 'cocina', 'reservas', 'pedidos-online', 'clientes', 'erp', 'rrhh'],
    locales: 3,
    comanderos: 3,
  },
};

/** Lee la URL de /precios: `config`, o bien `add`, `plan`, `sector` y `locales` */
export const configFromParams = (params: URLSearchParams): QuoteConfig | null => {
  const raw = params.get('config');
  if (raw) return decodeConfig(raw);
  const add = params.get('add');
  const plan = params.get('plan');
  const sector = params.get('sector');
  const locales = params.get('locales');
  if (!add && !plan && !sector && !locales) return null;
  const c: Partial<QuoteConfig> = { ...(sector ? sectorPresets[sector] : {}) };
  const modules = new Set<QuoteModule>(c.modules ?? []);
  if (plan) modulesOfPlan(plan).forEach((m) => modules.add(m));
  if (add) {
    for (const slug of add.split(',')) {
      if (isQuoteModule(slug)) modules.add(slug);
      else if (slug === 'hardware') c.hardware = true;
      else if (slug === 'placas-qr') c.placas = true;
    }
  }
  c.modules = [...modules];
  if (locales) c.locales = Number(locales);
  return normalizeConfig(c);
};
