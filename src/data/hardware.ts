/**
 * Equipamiento: dispositivos, kits, requisitos para usar el equipo propio, comprobador de equipo
 * y placas QR. Fuente única del copy de /hardware y /hardware/placas-qr (docs/auditoria/08).
 *
 * ESTADO: fase 3 (17-11-2026). Proveedor, precios y fórmula (compra o renting) están por decidir.
 * Por eso ningún precio de hardware se escribe aquí: kits, dispositivos y placas van «en tu
 * propuesta» hasta que Jordi publique cifras. Tampoco se nombran marcas ni modelos concretos.
 * Lo único con cifra son las licencias de terminal adicional, que salen de pricing.ts.
 */
import type { IconName } from '@/components/ui/icons';
import { devices as deviceLicenses, fmtPrice } from './pricing';

export type HardwareSlug =
  | 'terminal'
  | 'impresora'
  | 'cajon'
  | 'movil'
  | 'pantalla-cocina'
  | 'datafono'
  | 'tablet-fichaje'
  | 'placas-qr';

export interface HardwareDevice {
  slug: HardwareSlug;
  name: string;
  icon: IconName;
  text: string;
  /** Si ya tienes uno: cuándo te sirve el tuyo */
  ownOk?: string;
  /** Si todavía no se puede ofrecer con garantías (p. ej. lista de compatibles sin cerrar) */
  status?: 'en-camino';
}

/** Texto único para el precio del equipamiento mientras no haya cifras publicadas */
export const HARDWARE_PRICE_LABEL = 'Precio en tu propuesta';

export const hardwareDevices: HardwareDevice[] = [
  {
    slug: 'terminal',
    name: 'Terminal táctil todo en uno',
    icon: 'tpv',
    text: 'Para barra y caja. Llega configurado con tu carta, tus mesas y tus usuarios.',
    ownOk: 'Te sirve una tablet, un ordenador o un táctil con navegador actualizado.',
  },
  {
    slug: 'impresora',
    name: 'Impresora de tickets',
    icon: 'printer',
    text: 'Térmica, de red o USB. En caja y, si quieres, en cocina como respaldo.',
    ownOk: 'Si es térmica de red o USB, compatible ESC/POS, lo normal es que sirva.',
  },
  {
    slug: 'cajon',
    name: 'Cajón portamonedas',
    icon: 'receipt',
    text: 'Se abre solo al cobrar en efectivo desde el TPV.',
    ownOk: 'Si se conecta a tu impresora de tickets, lo aprovechamos.',
  },
  {
    slug: 'movil',
    name: 'Móviles para comandero',
    icon: 'smartphone',
    text: 'Android de gama media, con funda y cargador múltiple. O los móviles que ya tenéis.',
    ownOk: 'Cualquier Android o iPhone reciente con navegador actualizado.',
  },
  {
    slug: 'pantalla-cocina',
    name: 'Pantalla de cocina',
    icon: 'monitor',
    text: 'Táctil, con soporte de pared y protección para la grasa y la humedad.',
    ownOk: 'Una pantalla o tablet con navegador; mejor a partir de 15 pulgadas.',
  },
  {
    slug: 'tablet-fichaje',
    name: 'Tablet de fichaje',
    icon: 'tablet',
    text: 'En la entrada del local, para que el equipo fiche con su PIN.',
    ownOk: 'Cualquier tablet con navegador, fija en la pared o en un soporte.',
  },
  {
    slug: 'datafono',
    name: 'Datáfonos',
    icon: 'card',
    text: 'La lista de modelos compatibles está en preparación. Si ya tienes uno del banco, lo revisamos contigo.',
    status: 'en-camino',
  },
  {
    slug: 'placas-qr',
    name: 'Placas QR para mesas',
    icon: 'qr-plate',
    text: 'De sobremesa, adhesivas o para terraza, con el número de mesa y NFC opcional.',
    ownOk: 'imprime tú los códigos de cada mesa desde el backoffice.',
  },
];

export const getDevice = (slug: HardwareSlug) => {
  const found = hardwareDevices.find((d) => d.slug === slug);
  if (!found) throw new Error(`Dispositivo desconocido: ${slug}`);
  return found;
};

export interface HardwareKit {
  id: 'barra' | 'sala' | 'cocina' | 'completo';
  name: string;
  /** Para quién es, una línea */
  forWho: string;
  contents: string[];
  /** Iconos de lo que lleva, para la tarjeta */
  icons: IconName[];
}

/** Kits orientativos por tipo de local (docs/auditoria/08). Sin precio hasta que se publique. */
export const hardwareKits: HardwareKit[] = [
  {
    id: 'barra',
    name: 'Kit Barra',
    forWho: 'Bares y cafeterías que cobran en barra.',
    contents: ['Terminal táctil', 'Impresora de tickets', 'Cajón portamonedas'],
    icons: ['tpv', 'printer', 'receipt'],
  },
  {
    id: 'sala',
    name: 'Kit Sala',
    forWho: 'Restaurantes con servicio en mesa.',
    contents: ['Todo el kit Barra', '2 móviles para comandero'],
    icons: ['tpv', 'printer', 'smartphone'],
  },
  {
    id: 'cocina',
    name: 'Kit Cocina',
    forWho: 'Cocinas que quieren dejar el papel.',
    contents: ['Pantalla de cocina', 'Soporte de pared'],
    icons: ['monitor'],
  },
  {
    id: 'completo',
    name: 'Kit Completo',
    forWho: 'Locales que quieren tenerlo todo listo el primer día.',
    contents: ['Todo el kit Sala', 'Todo el kit Cocina', 'Placas QR para las mesas'],
    icons: ['tpv', 'smartphone', 'monitor', 'qr-plate'],
  },
];

/** Lo mínimo para usar tu propio equipo */
export const ownEquipmentRequirements: string[] = [
  'Tablet, ordenador o terminal táctil con un navegador actualizado',
  'Impresora térmica de tickets de red o USB (compatible ESC/POS)',
  'Conexión a internet por wifi o cable en la zona de caja',
  'Móviles Android o iPhone recientes para el comandero',
];

/** Cómo llega el equipo configurado: tres pasos cortos */
export const hardwareDelivery: { title: string; text: string; icon: IconName }[] = [
  {
    title: 'Lo preparamos con tu carta',
    text: 'Antes de enviarlo cargamos tu carta, tus mesas, tus usuarios y a qué impresora va cada cosa.',
    icon: 'settings',
  },
  {
    title: 'Llega listo para enchufar',
    text: 'Lo conectas a la corriente y a la red del local. Nada que instalar.',
    icon: 'truck',
  },
  {
    title: 'Lo revisamos contigo',
    text: 'Por videollamada comprobamos que todo imprime y cobra donde toca. Si lo prefieres, vamos al local.',
    icon: 'check',
  },
];

/* ── Comprobador de equipo (isla de /hardware) ─────────────────────── */

export type CheckerQuestionId = 'equipo' | 'impresora' | 'modelo' | 'cajas';

export interface CheckerOption {
  id: string;
  label: string;
  hint?: string;
}

export interface CheckerQuestion {
  id: CheckerQuestionId;
  title: string;
  help?: string;
  kind: 'choice' | 'text';
  options?: CheckerOption[];
  /** Solo para `text`: etiqueta del campo */
  fieldLabel?: string;
}

export const checkerQuestions: CheckerQuestion[] = [
  {
    id: 'equipo',
    title: '¿Con qué vas a cobrar?',
    help: 'Lo que tengas hoy en la barra o en la caja.',
    kind: 'choice',
    options: [
      { id: 'tablet', label: 'Una tablet', hint: 'Android o iPad' },
      { id: 'ordenador', label: 'Un ordenador', hint: 'Windows o Mac, táctil o no' },
      {
        id: 'terminal',
        label: 'El terminal de mi TPV actual',
        hint: 'Una pantalla táctil todo en uno',
      },
      { id: 'nada', label: 'Nada todavía', hint: 'Abro local o uso caja registradora' },
    ],
  },
  {
    id: 'impresora',
    title: '¿Tienes impresora de tickets?',
    help: 'Mira el cable que sale por detrás: el de red es como el del router.',
    kind: 'choice',
    options: [
      { id: 'red', label: 'Sí, térmica con cable de red' },
      { id: 'usb', label: 'Sí, térmica por USB' },
      { id: 'otra', label: 'Sí, pero no sé cómo se conecta', hint: 'O va por Bluetooth' },
      { id: 'no', label: 'No tengo' },
    ],
  },
  {
    id: 'modelo',
    title: '¿Sabes la marca y el modelo?',
    help: 'Suele venir en una pegatina debajo o detrás. Si no lo sabes, déjalo en blanco: lo miramos en la demo.',
    kind: 'text',
    fieldLabel: 'Marca y modelo del terminal o la impresora (opcional)',
  },
  {
    id: 'cajas',
    title: '¿Cuántos puntos de cobro tienes?',
    help: 'Cada sitio donde se cobra: la barra, la caja de la entrada, la terraza.',
    kind: 'choice',
    options: [
      { id: '1', label: 'Uno' },
      { id: '2', label: 'Dos' },
      { id: '3', label: 'Tres o más' },
    ],
  },
];

export type CheckerAnswers = Partial<Record<CheckerQuestionId, string>>;

/** Lo que vale cada pieza revisada */
export type CheckVerdict = 'sirve' | 'revisar' | 'falta';

export const verdictLabels: Record<CheckVerdict, string> = {
  sirve: 'Te sirve',
  revisar: 'Lo revisamos',
  falta: 'Te falta',
};

export interface CheckLine {
  name: string;
  /** Con artículo, para las frases del resultado: «la impresora de tickets» */
  ref: string;
  verdict: CheckVerdict;
  text: string;
}

export interface CheckResult {
  verdict: CheckVerdict;
  title: string;
  text: string;
  lines: CheckLine[];
  /** Qué te proponemos para lo que falta */
  suggestion: string;
  /** Resumen corto para el formulario (`?equipo=`) */
  summary: string;
}

const extraTerminal = deviceLicenses.find((d) => d.id === 'tpv');

/**
 * Resultado del comprobador. Reglas sencillas y prudentes: lo que no se puede asegurar sin ver
 * el modelo queda «lo revisamos», nunca «te sirve».
 */
export const evaluateEquipment = (a: CheckerAnswers): CheckResult => {
  const lines: CheckLine[] = [];

  // Equipo de cobro
  if (a.equipo === 'tablet' || a.equipo === 'ordenador') {
    lines.push({
      name: 'Equipo de cobro',
      ref: 'el equipo de cobro',
      verdict: 'sirve',
      text:
        a.equipo === 'tablet'
          ? 'alaCarta funciona en el navegador de tu tablet. Para la barra, mejor con un soporte.'
          : 'alaCarta funciona en el navegador. Si la pantalla no es táctil, se cobra con el ratón: funciona, aunque en barra es más lento.',
    });
  } else if (a.equipo === 'terminal') {
    lines.push({
      name: 'Equipo de cobro',
      ref: 'el equipo de cobro',
      verdict: 'revisar',
      text: 'Si lleva Windows o Android con un navegador actualizado, normalmente sirve. Algunos terminales solo abren el programa de su marca: lo comprobamos con el modelo.',
    });
  } else {
    lines.push({
      name: 'Equipo de cobro',
      ref: 'el equipo de cobro',
      verdict: 'falta',
      text: 'Necesitas una tablet, un ordenador o un terminal táctil. Te lo enviamos configurado o te decimos qué comprar.',
    });
  }

  // Impresora
  if (a.impresora === 'red') {
    lines.push({
      name: 'Impresora de tickets',
      ref: 'la impresora de tickets',
      verdict: 'sirve',
      text: 'Una térmica de red compatible ESC/POS, que es lo habitual, sirve desde cualquier equipo del local.',
    });
  } else if (a.impresora === 'usb') {
    const withPc = a.equipo === 'ordenador' || a.equipo === 'terminal';
    lines.push({
      name: 'Impresora de tickets',
      ref: 'la impresora de tickets',
      verdict: withPc ? 'sirve' : 'revisar',
      text: withPc
        ? 'Conectada por USB al equipo de caja, si es compatible ESC/POS, lo normal es que sirva.'
        : 'Con tablet, la impresora USB depende del modelo. Lo más sencillo suele ser una de red: lo vemos contigo.',
    });
  } else if (a.impresora === 'otra') {
    lines.push({
      name: 'Impresora de tickets',
      ref: 'la impresora de tickets',
      verdict: 'revisar',
      text: 'Con la marca y el modelo te decimos si sirve. Las de Bluetooth dan más guerra; las de red o USB son las más fiables.',
    });
  } else {
    lines.push({
      name: 'Impresora de tickets',
      ref: 'la impresora de tickets',
      verdict: 'falta',
      text: 'Para el ticket del cliente y, si quieres, para cocina. Térmica, de red o USB.',
    });
  }

  // Puntos de cobro
  const cajas = a.cajas === '3' ? 3 : a.cajas === '2' ? 2 : 1;
  const extraText = extraTerminal
    ? ` Cada terminal adicional, +${fmtPrice(extraTerminal.monthly)}/mes.`
    : '';
  lines.push({
    name:
      cajas === 1
        ? 'Un punto de cobro'
        : cajas === 2
          ? 'Dos puntos de cobro'
          : 'Tres o más puntos de cobro',
    ref: 'los puntos de cobro',
    verdict: 'sirve',
    text:
      cajas === 1
        ? 'Con un equipo de cobro basta. Tu plan incluye el primer terminal.'
        : `Hace falta un equipo en cada uno. Tu plan incluye el primer terminal.${extraText}`,
  });

  const missing = lines.filter((l) => l.verdict === 'falta');
  const toCheck = lines.filter((l) => l.verdict === 'revisar');
  const verdict: CheckVerdict = missing.length ? 'falta' : toCheck.length ? 'revisar' : 'sirve';
  const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

  const title =
    verdict === 'falta'
      ? `Te falta: ${missing.map((l) => lower(l.name)).join(' y ')}`
      : verdict === 'revisar'
        ? 'Casi seguro que te sirve'
        : 'Te sirve lo que tienes';
  const text =
    verdict === 'falta'
      ? 'Lo que ya tienes lo aprovechamos. Lo que falta te lo enviamos configurado, con tu carta cargada.'
      : verdict === 'revisar'
        ? `Solo queda comprobar ${toCheck.map((l) => l.ref).join(' y ')}. Con el modelo, lo confirmamos antes de empezar.`
        : 'Con lo que tienes puedes empezar. En la puesta en marcha lo dejamos conectado y probado.';

  const suggestion =
    missing.length === 2
      ? cajas > 1
        ? `Te proponemos un kit Barra por punto de cobro (${cajas === 3 ? 'tres o más' : 'dos'}).`
        : 'Te proponemos el kit Barra: terminal, impresora y cajón, configurados.'
      : missing.length === 1
        ? `Te proponemos solo lo que falta, ${missing[0]!.ref}, ya configurado.`
        : 'No necesitas comprar nada para empezar.';

  const summary = [
    `equipo:${a.equipo ?? 'nada'}`,
    `impresora:${a.impresora ?? 'no'}`,
    a.modelo?.trim() ? `modelo:${a.modelo.trim().slice(0, 60)}` : '',
    `cajas:${a.cajas ?? '1'}`,
    `resultado:${verdict}`,
  ]
    .filter(Boolean)
    .join(';');

  return { verdict, title, text, lines, suggestion, summary };
};

/* ── Placas QR (página y vista previa D8) ──────────────────────────── */

export type PlateMaterial = 'negro' | 'blanco' | 'madera';
export type PlateFormat = 'sobremesa' | 'adhesiva' | 'terraza';

export const plateMaterials: { id: PlateMaterial; label: string }[] = [
  { id: 'negro', label: 'Metacrilato negro' },
  { id: 'blanco', label: 'Metacrilato blanco' },
  { id: 'madera', label: 'Madera' },
];

export const plateFormats: { id: PlateFormat; label: string; text: string }[] = [
  { id: 'sobremesa', label: 'De sobremesa', text: 'De pie sobre la mesa, con peana.' },
  { id: 'adhesiva', label: 'Adhesiva', text: 'Pegada a la mesa o a la barra.' },
  {
    id: 'terraza',
    label: 'Para terraza',
    text: 'Con base pesada, para que no la tumbe el viento.',
  },
];

/** Valores de partida de la vista previa (los de la carta de ejemplo) */
export const plateDefaults = {
  brand: 'La Plaza',
  table: 7,
  material: 'negro' as PlateMaterial,
  format: 'sobremesa' as PlateFormat,
  nfc: true,
};

/** Resumen de la placa para el formulario (`?config=`) */
export const plateSummary = (p: {
  brand: string;
  table: number | string;
  material: PlateMaterial;
  format: PlateFormat;
  nfc: boolean;
}) =>
  [
    `placa:${p.material}`,
    `formato:${p.format}`,
    `nfc:${p.nfc ? 'si' : 'no'}`,
    `mesa:${p.table}`,
    p.brand.trim() ? `local:${p.brand.trim().slice(0, 40)}` : '',
  ]
    .filter(Boolean)
    .join(';');

/* ── Preguntas frecuentes ──────────────────────────────────────────── */

export const hardwareFaqs: { q: string; a: string }[] = [
  {
    q: '¿Tengo que comprar el equipo con vosotros?',
    a: 'No. alaCarta funciona en el navegador y no tiene hardware propietario. Si tu equipo cumple los requisitos, lo aprovechamos; si te falta algo, te lo enviamos configurado o te decimos qué comprar.',
  },
  {
    q: '¿Es compra o renting?',
    a: 'Estamos cerrando la fórmula con el proveedor. En tu propuesta te decimos por escrito si es compra, renting o las dos, con el precio de cada kit o pieza.',
  },
  {
    q: '¿Qué garantía tiene?',
    a: 'La garantía y cómo se sustituye un equipo averiado dependen del proveedor que estamos cerrando. Van por escrito en tu propuesta, antes de que firmes nada.',
  },
  {
    q: '¿Qué pasa si se rompe en pleno servicio?',
    a: 'Como alaCarta funciona en el navegador, puedes seguir desde otra tablet, un portátil o un móvil con tu usuario mientras se sustituye el equipo. Tu carta y tus mesas no viven en el aparato: entras con tu usuario y sigues.',
  },
  {
    q: '¿Puedo usar el datáfono de mi banco?',
    a: 'La lista de datáfonos compatibles está en preparación. Mientras tanto puedes seguir cobrando con el tuyo y registrar el cobro con tarjeta en el TPV. Dinos el modelo y te contamos qué opciones hay.',
  },
  {
    q: '¿Quién lo instala?',
    a: 'El equipo llega configurado y la puesta en marcha remota está incluida: por videollamada lo dejamos imprimiendo y cobrando. Si prefieres que vayamos al local, se contrata aparte.',
  },
];

export const plateFaqs: { q: string; a: string }[] = [
  {
    q: '¿Qué pasa con las placas si cambio la carta?',
    a: 'Nada: siguen valiendo. El QR apunta a la mesa, no a un PDF. Cambias platos, precios o el menú del día en el backoffice y cada mesa ve la carta nueva al momento.',
  },
  {
    q: '¿Tengo que comprar placas para usar la carta QR?',
    a: 'No. Puedes descargar los códigos de cada mesa desde el backoffice e imprimirlos. Las placas son para quien quiere algo que dure y se vea bien.',
  },
  {
    q: '¿Qué es el NFC y lo necesito?',
    a: 'Es un chip dentro de la placa: el cliente acerca el móvil y se abre la carta, sin abrir la cámara. Es opcional; el QR funciona igual sin él.',
  },
  {
    q: '¿Cuánto cuestan?',
    a: 'Te damos el precio en tu propuesta, según el número de mesas, el acabado y el formato. Estamos cerrando proveedor y no publicamos cifras hasta tenerlas confirmadas.',
  },
  {
    q: '¿Cuándo llegan?',
    a: 'Con el resto de la puesta en marcha, antes del primer servicio. La fecha concreta va en tu propuesta.',
  },
];
