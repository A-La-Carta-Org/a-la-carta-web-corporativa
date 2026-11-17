/** Textos de la home que no viven en otra fuente (soluciones, sectores, precios, FAQ). */
import { TRIAL_DAYS, fromLabel } from './pricing';

export const hero = {
  eyebrow: 'Plataforma integral para hostelería',
  title: 'Sala, cocina, pedidos y gestión. Un solo sistema.',
  /** El titular partido: la segunda parte va en serif cursiva y color de acento */
  titleLead: 'Sala, cocina, pedidos y gestión.',
  titleAccent: 'Un solo sistema.',
  text: 'alaCarta reúne el TPV, el comandero, la pantalla de cocina, la carta QR, las reservas, los pedidos online y los informes en una plataforma que se adapta a tu tipo de local.',
  primary: { label: 'Solicitar demo', href: '/solicitar-demo' },
  secondary: { label: 'Ver precios', href: '/precios' },
  note: `Sin permanencia · ${TRIAL_DAYS} días de prueba · ${fromLabel}`,
};

export const flow = {
  eyebrow: 'Un servicio, de principio a fin',
  title: 'Cada paso del servicio pasa por el mismo sistema',
  text: 'De la reserva al cierre de caja, la información no se copia de un sitio a otro: fluye.',
  steps: [
    {
      title: 'Reserva',
      text: 'Entra por tu web, Google o teléfono y se sienta en el plano de sala.',
    },
    {
      title: 'Mesa',
      text: 'El TPV y el comandero ven la misma mesa, con su historial y sus notas.',
    },
    {
      title: 'Comanda',
      text: 'Se toma en el móvil o la pide el cliente por QR. Llega escrita a cada partida.',
    },
    {
      title: 'Cocina',
      text: 'La pantalla ordena el pase por tiempos y avisa a la sala cuando sale.',
    },
    {
      title: 'Cuenta',
      text: 'Se divide como quiera el cliente y se cobra en barra, en la mesa o en el móvil.',
    },
    { title: 'Cierre', text: 'La caja cuadra sola y el resumen del día llega al responsable.' },
  ],
};

export const connected = {
  eyebrow: 'Todo conectado',
  title: 'Una carta, un dato, un cambio',
  text: 'Los módulos no son programas distintos que se hablan entre sí. Son vistas del mismo sistema.',
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

export const why = {
  eyebrow: 'Por qué alaCarta',
  title: 'Menos piezas, menos fricción',
  items: [
    {
      title: 'Un solo proveedor',
      text: 'TPV, comandero, cocina, QR, reservas, pedidos y gestión con una sola cuota, un solo soporte y una sola factura.',
    },
    {
      title: 'Precio claro, sin comisiones',
      text: 'Cuota fija por local y módulo. Ninguna comisión por reserva, pedido online o pago por QR.',
    },
    {
      title: 'Funciona con lo que tienes',
      text: 'Tablets, móviles y equipos táctiles con navegador. Impresoras térmicas estándar. Sin hardware propietario.',
    },
    {
      title: 'Hecho para muchas horas',
      text: 'Interfaz clara, sin ruido, legible con prisa y con poca luz. Un camarero nuevo la usa en su primer turno.',
    },
  ],
};

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
  ] as const,
};
