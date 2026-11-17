/**
 * Un solo sitio para construir los enlaces de conversión. Todo CTA de la web pasa por aquí para
 * llevar contexto (`origen`, `modulo`, `sector`, `config`…) hasta el formulario, sin montar
 * URLs a mano (docs/auditoria/01 §7 y 11 §4).
 *
 * Las cuatro puertas: probar (`probar`, `carta`), calcular (`precios`, `calculadora`), que te
 * llamen (`llamada`) y pedir demo (`demo`). `contacto` queda para lo que no es venta.
 */
import type { DemoKey, EcosystemSlug } from '@/data/solutions';
import type { SectorSlug } from '@/data/sectors';

export type CtaTarget =
  'demo' | 'llamada' | 'contacto' | 'probar' | 'carta' | 'precios' | 'calculadora';

export interface CtaOptions {
  to: CtaTarget;
  /** Producto que interesa (se preselecciona en el formulario) */
  modulo?: EcosystemSlug;
  sector?: SectorSlug;
  /** Desde dónde viene: «home-hero», «cabecera», «barra-movil», «sol-tpv»… */
  origen?: string;
  /** Configuración serializada del configurador o de la placa QR («placa:negro;mesa:7…») */
  config?: string;
  /** Resultado del comprobador de equipo de /hardware («equipo:tablet;impresora:red…») */
  equipo?: string;
  plan?: string;
  motivo?: string;
  /** Producto que se preselecciona en el configurador de precios (`?add=`) */
  add?: EcosystemSlug;
  /** Pantalla del simulador que se abre primero en móvil (`/demo?pantalla=caja`) */
  pantalla?: 'comandero' | 'cocina' | 'caja' | 'numeros';
  /** Comanda que llega al simulador desde la carta QR (`encodeOrder()` de src/data/demo.ts) */
  comanda?: string;
  /** Ancla opcional, sin «#» */
  hash?: string;
}

const paths: Record<CtaTarget, string> = {
  demo: '/solicitar-demo',
  llamada: '/solicitar-demo',
  contacto: '/contacto',
  probar: '/demo',
  carta: '/demo/carta',
  precios: '/precios',
  calculadora: '/herramientas/calculadora-comisiones',
};

/** Etiquetas por defecto de cada puerta, para no repetirlas por la web */
export const ctaLabels: Record<CtaTarget, string> = {
  demo: 'Solicitar demo',
  llamada: 'Te llamamos',
  contacto: 'Contacto',
  probar: 'Pruébalo',
  carta: 'Abrir la carta de ejemplo',
  precios: 'Ver precios',
  calculadora: 'Calcular comisiones',
};

export const ctaHref = ({
  to,
  modulo,
  sector,
  origen,
  config,
  equipo,
  plan,
  motivo,
  add,
  pantalla,
  comanda,
  hash,
}: CtaOptions): string => {
  const params = new URLSearchParams();
  if (to === 'llamada') params.set('modo', 'llamada');
  if (modulo) params.set('modulo', modulo);
  if (sector) params.set('sector', sector);
  if (plan) params.set('plan', plan);
  if (motivo) params.set('motivo', motivo);
  if (config) params.set('config', config);
  if (equipo) params.set('equipo', equipo);
  if (add) params.set('add', add);
  if (pantalla) params.set('pantalla', pantalla);
  if (comanda) params.set('comanda', comanda);
  if (origen) params.set('origen', origen);
  const query = params.toString();
  return `${paths[to]}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
};

/** Botón listo para PageHero/CtaBand: `{ label, href }` */
export const cta = (opts: CtaOptions & { label?: string }) => ({
  label: opts.label ?? ctaLabels[opts.to],
  href: ctaHref(opts),
});

/**
 * Adónde lleva el «Pruébalo» de cada demo (docs/auditoria/10). El simulador y la carta tienen
 * página propia; la llamada de ejemplo (D4) y «un cambio, todos los canales» (D2) viven dentro de
 * la página de su producto (`#pruebalo`) y en `/demo`. Una demo que todavía no exista se pone a
 * `null` y la página enseña otra salida.
 */
const demoTargets: Record<
  DemoKey,
  { to: CtaTarget; hash?: string } | { path: string; hash: string } | null
> = {
  simulador: { to: 'probar', hash: 'simulador' },
  carta: { to: 'carta' },
  placa: { to: 'carta' },
  llamada: { path: '/soluciones/llamadas-ia', hash: 'pruebalo' },
  'cambio-canales': { path: '/soluciones/backoffice', hash: 'pruebalo' },
};

/** Una línea por demo para la salida «Pruébalo» del cierre (`CtaBand`) */
export const demoShortTexts: Record<DemoKey, string> = {
  simulador: 'Toma una comanda y mira cómo llega a cocina y a caja.',
  carta: 'Abre la carta de ejemplo como la verá tu cliente en la mesa.',
  placa: 'Abre la carta de ejemplo como la verá tu cliente en la mesa.',
  llamada: 'Mira cómo se atiende una llamada de ejemplo, paso a paso.',
  'cambio-canales': 'Cambia un precio y míralo cambiar en todos los canales.',
};

/** Botón «Pruébalo» de una demo, o `null` si esa demo aún no está publicada */
export const demoCta = (
  demo: DemoKey | undefined,
  origen: string,
  label?: string,
  extra: Pick<CtaOptions, 'pantalla'> = {}
) => {
  const target = demo ? demoTargets[demo] : null;
  if (!target) return null;
  const text = label ?? ctaLabels.probar;
  // Demo dentro de una página de producto: ancla, sin parámetros (no es un paso de conversión)
  if ('path' in target) return { label: text, href: `${target.path}#${target.hash}` };
  return cta({ to: target.to, hash: target.hash, origen, label: text, ...extra });
};
