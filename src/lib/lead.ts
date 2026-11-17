/**
 * Lógica del formulario de demo y de contacto (docs/auditoria/11). Módulo PURO: sin DOM ni Vue,
 * para poder comprobarlo con `npm run check:lead` (scripts/check-lead.mjs).
 *
 * - Opciones de cada paso (momento, nº de locales, preferencia, franja, motivos de contacto).
 * - `parseLeadParams()`: lee lo que trae la URL desde otras páginas (`modulo`, `sector`, `plan`,
 *   `config`, `equipo`, `motivo`, `modo`, `origen`), lo valida y devuelve un resumen legible.
 *   Lo desconocido se ignora sin romper.
 * - `config` llega con tres formatos: el del configurador (`quote.ts`, p. ej. `rs.cl_l2_a`), el de
 *   la placa QR (`placa:negro;formato:sobremesa;nfc:si;mesa:7;local:…`) y el de la calculadora de
 *   comisiones (`comisiones_p300_t25_c25_s30`).
 * - `buildMailto()`: la alternativa por correo cuando no hay endpoint.
 */
import { checkerQuestions, plateFormats, plateMaterials, verdictLabels } from '@/data/hardware';
import type { CheckVerdict } from '@/data/hardware';
import { fmtPrice, plans, type PlanId } from '@/data/pricing';
import { decodeConfig, describeConfig, encodeConfig, quote } from '@/lib/quote';

/* ── Opciones ──────────────────────────────────────────────────────── */

export const localesOptions = [
  { id: '1', label: '1' },
  { id: '2-3', label: '2 a 3' },
  { id: '4-10', label: '4 a 10' },
  { id: '10+', label: 'Más de 10' },
] as const;

export const momentOptions = [
  { id: 'abrir', label: 'Voy a abrir', hint: 'Un local nuevo o una reapertura' },
  { id: 'cambiar', label: 'Quiero cambiar de TPV', hint: 'Tengo uno y no me convence' },
  { id: 'anadir', label: 'Quiero añadir algo', hint: 'Reservas, pedidos, carta QR…' },
  { id: 'mirar', label: 'Solo estoy mirando', hint: 'Sin prisa, para comparar' },
] as const;
export type MomentId = (typeof momentOptions)[number]['id'];

export const hardwareOptions = [
  { id: 'necesito', label: 'Sí, me falta equipo' },
  { id: 'tengo', label: 'No, quiero usar el mío' },
  { id: 'nose', label: 'No lo sé' },
] as const;
export type HardwareNeed = (typeof hardwareOptions)[number]['id'];

export const preferenceOptions = [
  { id: 'videollamada', label: 'Videollamada', hint: 'Te enseñamos la plataforma en pantalla' },
  { id: 'llamada', label: 'Llamada', hint: 'Te llamamos y lo hablamos' },
  { id: 'visita', label: 'Visita al local', hint: 'Según la zona' },
] as const;
export type PreferenceId = (typeof preferenceOptions)[number]['id'];

export const slotOptions = [
  { id: 'manana', label: 'Por la mañana' },
  { id: 'mediodia', label: 'Después de comidas' },
  { id: 'tarde', label: 'Por la tarde' },
  { id: 'igual', label: 'Me da igual' },
] as const;
export type SlotId = (typeof slotOptions)[number]['id'];

/** Motivos que llegan al formulario de demo desde otras páginas */
export const leadMotives = {
  propuesta: 'Quieres la propuesta por escrito',
  comisiones: 'Quieres dejar de pagar comisiones',
  fundador: 'Quieres ser local fundador',
} as const;
export type LeadMotive = keyof typeof leadMotives;

/** Motivos de `/contacto` (lo que no es venta). «Quiero contratar» es un enlace a la demo */
export const contactMotives = [
  {
    id: 'soporte',
    label: 'Soporte',
    hint: 'Ya trabajas con alaCarta y necesitas ayuda',
    icon: 'lifebuoy',
  },
  {
    id: 'gestoria',
    label: 'Gestoría o asesoría',
    hint: 'Llevas restaurantes y quieres conocerlo',
    icon: 'briefcase',
  },
  {
    id: 'partners',
    label: 'Partners y distribuidores',
    hint: 'Instaladores, proveedores, integraciones',
    icon: 'building',
  },
  { id: 'prensa', label: 'Prensa', hint: 'Información, entrevistas, imágenes', icon: 'newspaper' },
  { id: 'otro', label: 'Otra cosa', hint: 'Cuéntanos', icon: 'message' },
] as const;
export type ContactMotive = (typeof contactMotives)[number]['id'];

const label = <T extends { id: string; label: string }>(
  list: readonly T[],
  id: string | undefined
) => list.find((o) => o.id === id)?.label ?? '';

export const optionLabel = {
  locales: (id?: string) => label(localesOptions, id),
  momento: (id?: string) => label(momentOptions, id),
  hardware: (id?: string) => label(hardwareOptions, id),
  preferencia: (id?: string) => label(preferenceOptions, id),
  franja: (id?: string) => label(slotOptions, id),
  contacto: (id?: string) => label(contactMotives, id),
};

/* ── Lectura de la URL ─────────────────────────────────────────────── */

export interface LeadCatalog {
  /** Productos que se pueden marcar (soluciones y equipamiento) */
  products: { slug: string; label: string }[];
  sectors: { slug: string; name: string }[];
}

export type ConfigKind = 'configurador' | 'placa' | 'comisiones';

export interface LeadSummaryItem {
  label: string;
  value: string;
}

export interface LeadContext {
  modo: 'demo' | 'llamada';
  motivo: LeadMotive | null;
  origen: string | null;
  sector: string | null;
  plan: PlanId | null;
  /** Productos preseleccionados en el paso 2 */
  productos: string[];
  /** Respuesta preseleccionada a «¿necesitas equipo?» */
  hardware: HardwareNeed | null;
  /** Momento deducido del origen (páginas de momentos) */
  momento: MomentId | null;
  config: { tipo: ConfigKind; raw: string; resumen: string } | null;
  equipo: { raw: string; resumen: string; resultado: CheckVerdict | null } | null;
  /** Lo que se enseña en «Lo que nos traes» */
  resumen: LeadSummaryItem[];
}

const SAFE_ORIGIN = /^[a-z0-9][a-z0-9-]{0,79}$/;
const MAX_RAW = 300;

/** «clave:valor;clave:valor» → objeto (placa y comprobador) */
const pairs = (raw: string) => {
  const out: Record<string, string> = {};
  for (const part of raw.slice(0, MAX_RAW).split(';')) {
    const i = part.indexOf(':');
    if (i < 1) continue;
    out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
};

/** Texto que viene del visitante: sin caracteres de control y recortado */
const clean = (s: string, max = 60) =>
  s
    .replace(/[\p{Cc}<>]/gu, '')
    .trim()
    .slice(0, max);

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

const parsePlate = (raw: string) => {
  const p = pairs(raw);
  const material = plateMaterials.find((m) => m.id === p.placa);
  if (!material) return null;
  const format = plateFormats.find((f) => f.id === p.formato);
  const mesa = p.mesa ? clean(p.mesa, 8) : '';
  const local = p.local ? clean(p.local, 40) : '';
  const bits = [
    `Placa de ${lower(material.label)}${format ? `, ${lower(format.label)}` : ''}${
      p.nfc === 'si' ? ', con NFC' : p.nfc === 'no' ? ', sin NFC' : ''
    }`,
    mesa ? `mesa ${mesa}` : '',
    local ? `a nombre de «${local}»` : '',
  ];
  return bits.filter(Boolean).join(' · ');
};

const parseCommissions = (raw: string) => {
  const m = /^comisiones_p(\d{1,6})_t(\d{1,4})_c(\d{1,2})_s(\d{1,3})$/.exec(raw);
  if (!m) return null;
  const [orders, ticket, rate, shift] = m.slice(1).map(Number) as [number, number, number, number];
  if (rate > 60 || shift > 100) return null;
  const yearly = Math.round(orders * ticket * (rate / 100) * 12);
  return [
    `${orders} pedidos al mes por agregadores`,
    `ticket medio de ${fmtPrice(ticket)}`,
    `comisión del ${rate} %`,
    `unos ${fmtPrice(yearly)} al año en comisiones`,
    `quieres pasar el ${shift} % a tu canal`,
  ].join(' · ');
};

const parseQuote = (raw: string) => {
  if (!/^[a-z0-9._]{1,200}$/.test(raw)) return null;
  const c = decodeConfig(raw);
  // Si no se ha reconocido nada, es basura: se ignora
  if (!encodeConfig(c)) return null;
  return c;
};

const parseEquipment = (raw: string) => {
  const p = pairs(raw);
  const answer = (id: string) => {
    const q = checkerQuestions.find((x) => x.id === id);
    return q?.options?.find((o) => o.id === p[id])?.label ?? '';
  };
  const equipo = answer('equipo');
  const impresora = answer('impresora');
  const cajas = answer('cajas');
  const modelo = p.modelo ? clean(p.modelo, 60) : '';
  const resultado = (['sirve', 'revisar', 'falta'] as const).find((v) => v === p.resultado) ?? null;
  if (!equipo && !impresora && !cajas && !resultado) return null;
  const bits = [
    equipo ? `Cobro: ${lower(equipo)}` : '',
    impresora ? `impresora: ${lower(impresora)}` : '',
    modelo ? `modelo: ${modelo}` : '',
    cajas ? `puntos de cobro: ${lower(cajas)}` : '',
    resultado ? `resultado: ${lower(verdictLabels[resultado])}` : '',
  ];
  return { resumen: bits.filter(Boolean).join(' · '), resultado };
};

/** Productos que lleva siempre un plan de alaCarta (los marca el configurador por defecto) */
const BASE_PRODUCTS = ['tpv', 'carta-qr', 'backoffice'];

export const parseLeadParams = (q: URLSearchParams, catalog: LeadCatalog): LeadContext => {
  const productSlugs = new Set(catalog.products.map((p) => p.slug));
  const productName = (slug: string) =>
    catalog.products.find((p) => p.slug === slug)?.label ?? slug;
  const ctx: LeadContext = {
    modo: q.get('modo') === 'llamada' ? 'llamada' : 'demo',
    motivo: null,
    origen: null,
    sector: null,
    plan: null,
    productos: [],
    hardware: null,
    momento: null,
    config: null,
    equipo: null,
    resumen: [],
  };
  const add = (slug: string) => {
    if (productSlugs.has(slug) && !ctx.productos.includes(slug)) ctx.productos.push(slug);
  };

  const origen = q.get('origen');
  if (origen && SAFE_ORIGIN.test(origen)) ctx.origen = origen;
  if (ctx.origen?.startsWith('momento-abrir-un-local')) ctx.momento = 'abrir';
  if (ctx.origen?.startsWith('momento-cambiar-de-tpv')) ctx.momento = 'cambiar';

  const motivo = q.get('motivo');
  if (motivo && motivo in leadMotives) ctx.motivo = motivo as LeadMotive;

  const sector = q.get('sector');
  if (sector && catalog.sectors.some((s) => s.slug === sector)) ctx.sector = sector;

  const plan = q.get('plan');
  if (plan && plans.some((p) => p.id === plan)) ctx.plan = plan as PlanId;
  // Enlace antiguo de grupos (`/contacto?motivo=grupos`) reconducido a la demo
  if (motivo === 'grupos' && !ctx.plan) ctx.plan = 'grupos';

  const fromModulo: string[] = [];
  for (const slug of (q.get('modulo') ?? '').split(',').slice(0, 20)) {
    if (productSlugs.has(slug)) {
      add(slug);
      fromModulo.push(slug);
    }
  }

  // config: tres formatos
  const rawConfig = (q.get('config') ?? '').trim().slice(0, MAX_RAW);
  if (rawConfig.startsWith('placa:')) {
    const resumen = parsePlate(rawConfig);
    if (resumen) {
      ctx.config = { tipo: 'placa', raw: rawConfig, resumen };
      add('placas-qr');
    }
  } else if (rawConfig.startsWith('comisiones_')) {
    const resumen = parseCommissions(rawConfig);
    if (resumen) {
      ctx.config = { tipo: 'comisiones', raw: rawConfig, resumen };
      add('pedidos-online');
      if (!ctx.motivo) ctx.motivo = 'comisiones';
    }
  } else if (rawConfig) {
    const c = parseQuote(rawConfig);
    if (c) {
      const qt = quote(c);
      ctx.config = { tipo: 'configurador', raw: rawConfig, resumen: describeConfig(c) };
      if (qt.plan !== 'ninguno') {
        BASE_PRODUCTS.forEach(add);
        if (!ctx.plan) ctx.plan = qt.plan;
      }
      c.modules.forEach(add);
      if (c.hardware) {
        add('hardware');
        ctx.hardware = 'necesito';
      }
      if (c.placas) add('placas-qr');
      if (c.presencial || c.migracion) add('puesta-en-marcha');
      if (c.fundador && !ctx.motivo) ctx.motivo = 'fundador';
    }
  }

  const rawEquipo = (q.get('equipo') ?? '').trim().slice(0, MAX_RAW);
  if (rawEquipo) {
    const e = parseEquipment(rawEquipo);
    if (e) {
      ctx.equipo = { raw: rawEquipo, ...e };
      add('hardware');
      ctx.hardware = e.resultado === 'falta' ? 'necesito' : 'tengo';
    }
  }

  // Resumen legible
  const r = ctx.resumen;
  if (ctx.config?.tipo === 'configurador')
    r.push({ label: 'Tu configuración', value: ctx.config.resumen });
  if (ctx.config?.tipo === 'placa') r.push({ label: 'Tu placa QR', value: ctx.config.resumen });
  if (ctx.config?.tipo === 'comisiones')
    r.push({ label: 'Tus comisiones', value: ctx.config.resumen });
  if (ctx.equipo) r.push({ label: 'Tu equipo', value: ctx.equipo.resumen });
  if (ctx.plan && ctx.config?.tipo !== 'configurador') {
    const p = plans.find((x) => x.id === ctx.plan)!;
    r.push({
      label: 'Plan',
      value:
        p.monthly === null
          ? `${p.name} (a medida)`
          : `${p.name} · ${fmtPrice(p.monthly)}/mes por local`,
    });
  }
  if (fromModulo.length && !ctx.config && !ctx.equipo)
    r.push({ label: 'Te interesa', value: fromModulo.map(productName).join(', ') });
  if (ctx.sector) {
    const s = catalog.sectors.find((x) => x.slug === ctx.sector)!;
    r.push({ label: 'Tipo de local', value: s.name });
  }
  if (ctx.motivo) r.push({ label: 'Motivo', value: leadMotives[ctx.motivo] });
  return ctx;
};

/* ── Envío ─────────────────────────────────────────────────────────── */

/** Tipo de solicitud: decide el asunto, el botón y la variante de `/gracias` */
export type LeadKind = 'demo' | 'llamada' | 'propuesta' | 'fundador' | 'contacto';

export const leadKind = (modo: LeadContext['modo'], motivo: LeadMotive | null): LeadKind =>
  modo === 'llamada'
    ? 'llamada'
    : motivo === 'propuesta'
      ? 'propuesta'
      : motivo === 'fundador'
        ? 'fundador'
        : 'demo';

export const leadSubjects: Record<LeadKind, string> = {
  demo: 'Solicitud de demo',
  llamada: 'Que me llaméis',
  propuesta: 'Solicitud de propuesta',
  fundador: 'Solicitud de local fundador',
  contacto: 'Contacto desde la web',
};

/** URL de `/gracias` (sin datos personales: el nombre y el correo van en sessionStorage) */
export const thanksHref = (kind: LeadKind, extra: { momento?: string; via?: 'correo' } = {}) => {
  const p = new URLSearchParams({ tipo: kind });
  if (extra.momento) p.set('momento', extra.momento);
  if (extra.via) p.set('via', extra.via);
  return `/gracias?${p.toString()}`;
};

/** Correo con la solicitud en texto plano (alternativa sin endpoint o si falla el envío) */
export const buildMailto = (
  email: string,
  kind: LeadKind,
  lines: [string, string | undefined | null | false][]
) => {
  const body = lines
    .filter(([, v]) => v)
    .map(([k, v]) => (k ? `${k}: ${v}` : `\n${v}`))
    .join('\n');
  return `mailto:${email}?subject=${encodeURIComponent(leadSubjects[kind])}&body=${encodeURIComponent(body)}`;
};

export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
/** Teléfono español o internacional: al menos 9 cifras, admite espacios, guiones y «+» */
export const phoneOk = (v: string) => {
  const digits = v.replace(/[\s\-().]/g, '');
  return /^\+?\d{9,15}$/.test(digits);
};
