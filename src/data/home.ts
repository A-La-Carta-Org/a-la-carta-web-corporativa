/**
 * Textos de la home que no viven en otra fuente (docs/auditoria/03). Lo que ya tiene fuente
 * propia se lee de allí: familias y productos (`solutions.ts`), puesta en marcha
 * (`onboarding.ts`), momentos (`moments.ts`), sectores (`sectors.ts`), precios y locales
 * fundadores (`pricing.ts`) y preguntas (`faqs.ts`).
 */
import { FOUNDER_SPOTS, FROM_PRICE, SETUP_REMOTE_PRICE, fmtPrice, fromLabel } from './pricing';
import { ctaHref } from '@/lib/cta';

/* SEO: título ≤ 60 y descripción ≤ 155 (docs/auditoria/03 §5) */
export const homeSeo = {
  title: 'alaCarta · Software para hostelería: TPV, reservas y ERP',
  description: `Software de gestión para restaurantes y bares: TPV, carta QR, reservas, pedidos, ERP y equipo. Todo en uno, conectado y sin comisiones. Desde ${fmtPrice(FROM_PRICE)}/mes.`,
};

/* 1 · Hero */
export const hero = {
  eyebrow: 'Ecosistema de gestión para hostelería',
  title: 'Todo tu restaurante, en un solo sistema.',
  /** El titular partido: la segunda parte va en serif cursiva y color de acento (docs/auditoria/14) */
  titleLead: 'Todo tu restaurante,',
  titleAccent: 'en un solo sistema.',
  text: 'TPV, comandero, cocina, carta QR, reservas, pedidos, app propia, llamadas con IA, stock y equipo. Conectados entre sí, con tu marca y sin comisiones.',
  primary: { label: 'Solicitar demo', href: ctaHref({ to: 'demo', origen: 'home-hero' }) },
  /** Baja al simulador de la propia home (no es un paso de conversión: sin `origen`) */
  secondary: { label: 'Pruébalo ahora', href: '#simulador' },
  note: `Sin permanencia · 0 % comisiones · ${fromLabel}`,
};

/* 2 · Lo que sustituye (sin marcas ajenas) */
export const replaces = {
  eyebrow: 'Lo que sustituye',
  before: [
    'El TPV de un proveedor',
    'La app de reservas que cobra por comensal',
    'La tienda online con comisión',
    'La carta en PDF',
    'El Excel de escandallos',
    'La app de fichaje',
    'El teléfono que nadie coge en pleno servicio',
  ],
  after: 'Un sistema, una cuota, un soporte.',
  text: 'Lo que hoy son siete proveedores, siete contraseñas y siete facturas, en un solo sitio y hablando entre sí.',
};

/* 3 · Simulador (D1) */
export const simulator = {
  eyebrow: 'Pruébalo aquí mismo',
  title: 'Toma una comanda y mira dónde llega',
  text: 'Haces de camarero, de cocina y de caja en La Plaza, un restaurante de ejemplo. Son tres pantallas del mismo sistema: lo que tocas en una aparece en las otras, sin copiar nada.',
};

/* 4 · Familias */
export const ecosystemIntro = {
  eyebrow: 'El ecosistema',
  title: 'Cuatro familias, un mismo sistema',
  text: 'Empieza por lo que necesitas hoy y añade el resto cuando el local lo pida. Todo comparte carta, mesas, clientes y datos.',
};

/* 5 · Un cambio, todos los canales (D2) */
export const oneSystem = {
  eyebrow: 'Todo conectado',
  title: 'Un cambio, todos los canales',
  text: 'Sube un precio o marca un plato como agotado y míralo cambiar a la vez en el TPV, la carta QR, la tienda online y la app.',
  points: [
    {
      title: 'Una carta para todos los canales',
      text: 'Cambias un precio o marcas un agotado y lo ven el TPV, el comandero, la carta QR y la tienda online al momento.',
    },
    {
      title: 'Un dato para cada decisión',
      text: 'Ventas, tiempos, ocupación y margen salen del mismo registro. No hay que cruzar exportaciones.',
    },
    {
      title: 'Un cambio para todos los locales',
      text: 'La carta maestra se publica en los locales que elijas, con sus excepciones. El grupo se ve en una pantalla.',
    },
  ],
};

/* 6 · Puesta en marcha */
export const setup = {
  eyebrow: 'Puesta en marcha',
  title: 'Te lo dejamos funcionando',
  text: 'Cargamos tu carta, configuramos el equipo y formamos a tu gente. Tú llegas al primer servicio con todo listo.',
  note: 'Plazos orientativos para un local; la fecha concreta va por escrito en tu propuesta.',
};

/* 7 · Sectores y momentos */
export const forYou = {
  eyebrow: 'Para ti',
  title: 'Tu tipo de local y tu momento',
  text: 'Es el mismo sistema, configurado para lo que haces y para lo que te está pasando ahora.',
  sectorsTitle: 'Para tu tipo de local',
  momentsTitle: 'Para tu momento',
};

/* 8 · Precio claro */
export const priceIntro = {
  eyebrow: 'Precio claro',
  title: 'Lo que cuesta, a la vista',
  text: 'Cuota fija por local, sin permanencia y sin pagar por cada reserva, pedido o cobro en la mesa.',
  figures: [
    { pre: 'desde', value: fmtPrice(FROM_PRICE), label: 'al mes por local, sin IVA' },
    { pre: 'comisión', value: '0 %', label: 'por reserva, pedido o pago en la mesa' },
    {
      pre: 'alta',
      value: fmtPrice(SETUP_REMOTE_PRICE),
      label: 'la puesta en marcha remota va incluida',
    },
  ],
};

/* 9 · Por qué (banda oscura) */
export const why = {
  eyebrow: 'Por qué alaCarta',
  title: 'Menos piezas, menos fricción',
  items: [
    {
      title: 'Un solo proveedor',
      text: 'Sala, canales, gestión y equipo con una cuota, un soporte y una factura. Si algo falla, sabes a quién llamar.',
    },
    {
      title: 'Un solo dato',
      text: 'La carta, las mesas, los clientes y las ventas se apuntan una vez y llegan a todas partes. Nada de integraciones que se rompen.',
    },
    {
      title: 'Sin comisiones',
      text: 'Ni por reserva, ni por pedido online, ni por cobro en la mesa. Tus clientes son tuyos y tu margen también.',
    },
    {
      title: 'Tu equipo o el nuestro',
      text: 'Funciona en tablets, móviles y equipos táctiles con navegador. Si te falta algo, te lo mandamos configurado.',
    },
  ],
};

/* 10 · Locales fundadores */
export const founders = {
  eyebrow: 'Locales fundadores',
  title: 'Estamos eligiendo los primeros locales',
  text: `Buscamos ${FOUNDER_SPOTS} locales que usen alaCarta en su servicio y nos cuenten qué falla. Son ${FOUNDER_SPOTS} plazas de verdad: las que podemos acompañar en persona. Sin cuenta atrás.`,
  cta: {
    label: 'Quiero ser local fundador',
    href: ctaHref({ to: 'demo', motivo: 'fundador', origen: 'home-fundadores' }),
  },
};

/* 11 · Confianza */
export const trust = {
  items: [
    {
      icon: 'shield',
      title: 'Preparado para VeriFactu',
      text: 'Diseñado según los requisitos de los sistemas de facturación de la normativa española.',
    },
    {
      icon: 'wifi-off',
      title: 'Sigue cobrando sin internet',
      text: 'El TPV trabaja en modo local y sincroniza cuando vuelve la conexión.',
    },
    {
      icon: 'lock',
      title: 'Datos en la Unión Europea',
      text: 'Alojamiento europeo, copias diarias y exportación de tus datos cuando quieras.',
    },
    {
      icon: 'clock',
      title: 'Registro de jornada sin papeles',
      text: 'Fichaje desde el móvil o una tablet, sin borrados y exportable para una inspección.',
    },
  ] as const,
};
