/**
 * Puesta en marcha: del primer contacto al primer servicio. Fuente única del copy de
 * /puesta-en-marcha (docs/auditoria/08).
 *
 * ESTADO: fase 3 (17-11-2026). Los plazos son orientativos y están pendientes de validar con
 * Jordi; la página los presenta así. Los precios de los servicios salen de pricing.ts
 * (`services`): remota incluida, presencial «desde», migración a medida. A los locales
 * fundadores la presencial les va incluida (decisión de Jordi, 16-11-2026).
 */
import type { IconName } from '@/components/ui/icons';

export interface OnboardingStep {
  when: string;
  title: string;
  text: string;
  icon: IconName;
}

export const onboardingSteps: OnboardingStep[] = [
  {
    when: 'Día 0',
    title: 'Demo y propuesta',
    text: 'Vemos tu local, tu carta y tu equipo. Te enviamos la propuesta por escrito, con el precio cerrado.',
    icon: 'message',
  },
  {
    when: 'Días 1 a 3',
    title: 'Cargamos tu carta',
    text: 'Importamos la carta desde PDF, Excel o tu TPV actual, y damos de alta mesas, zonas y usuarios.',
    icon: 'file-spreadsheet',
  },
  {
    when: 'Días 3 a 7',
    title: 'Llega el equipo configurado',
    text: 'Si lo necesitas, el hardware y las placas QR llegan listos para enchufar. Si usas el tuyo, lo dejamos conectado.',
    icon: 'truck',
  },
  {
    when: 'Día 7',
    title: 'Formación del equipo',
    text: 'Una sesión con tu gente, por videollamada o en el local, antes de abrir o del cambio.',
    icon: 'team',
  },
  {
    when: 'Primer servicio',
    title: 'Te acompañamos en directo',
    text: 'Estamos disponibles durante el primer servicio para resolver lo que surja al momento.',
    icon: 'lifebuoy',
  },
];

/** Lo que necesitamos de ti para empezar */
export const onboardingNeeds: string[] = [
  'Tu carta actual (PDF, foto o Excel), con precios y alérgenos si los tienes',
  'Los datos fiscales del negocio',
  'La lista del equipo que ya tienes: tablets, impresoras, datáfono',
  'Una foto o un dibujo del plano de sala con las mesas',
];

/* ── Migración ─────────────────────────────────────────────────────── */

export interface MigrationPath {
  id: 'tpv' | 'papel';
  title: string;
  text: string;
  icon: IconName;
  steps: string[];
}

/** Dos puntos de partida: vienes de otro TPV o vienes del papel */
export const migrationPaths: MigrationPath[] = [
  {
    id: 'tpv',
    title: 'Si vienes de otro TPV',
    text: 'Le pedimos a tu sistema actual lo que se pueda exportar y lo pasamos nosotros. Tú sigues con el viejo hasta el día del cambio.',
    icon: 'switch',
    steps: [
      'Exportas la carta y los clientes de tu TPV, o te ayudamos a hacerlo',
      'Lo cargamos y lo repasas con calma, sin prisa por cambiar',
      'Elegimos un día tranquilo para el cambio, sin cerrar el local',
    ],
  },
  {
    id: 'papel',
    title: 'Si vienes del papel o de una caja registradora',
    text: 'Nos mandas una foto de la carta y te la devolvemos montada. No hace falta pasar nada a limpio.',
    icon: 'clipboard-list',
    steps: [
      'Nos envías la carta como la tengas: PDF, foto o folio',
      'La montamos con familias, precios, alérgenos y a qué partida va cada plato',
      'Dibujamos tu sala a partir de una foto del plano o de las mesas',
    ],
  },
];

/** Qué se traspasa y qué no, dicho claro */
export const migrationImports: string[] = [
  'La carta: platos, familias, precios, modificadores y alérgenos',
  'Zonas, mesas y el plano de sala',
  'Usuarios y permisos de tu equipo',
  'Los clientes que dieron su consentimiento, con sus datos de contacto',
  'El histórico de ventas, si tu sistema actual permite exportarlo, para que puedas comparar',
];

export const migrationNotImported: string[] = [
  'Las facturas ya emitidas: se quedan en tu sistema anterior y te ayudamos a exportarlas para guardarlas',
  'Los botones y atajos de tu TPV anterior: se rehacen sobre tu carta, ordenados como trabaja tu equipo',
  'Los clientes sin consentimiento: no se traspasan, y vuelven a darse de alta con su próxima reserva o pedido',
];

/* ── Estrategia local ──────────────────────────────────────────────── */

export interface LocalStrategyItem {
  title: string;
  text: string;
  icon: IconName;
  /** Página donde se cuenta más */
  href?: string;
}

/** Que tus clientes te encuentren y reserven en tus canales desde el primer día */
export const localStrategy: LocalStrategyItem[] = [
  {
    title: 'Perfil de Google al día',
    text: 'Horario, carta, fotos y teléfono revisados, y el enlace para reservar y pedir en tu ficha.',
    icon: 'map-pin',
    href: '/soluciones/web-para-restaurantes',
  },
  {
    title: 'Tus enlaces en Instagram',
    text: 'El enlace de reservas y el de pedidos en la biografía y en las historias destacadas.',
    icon: 'megaphone',
  },
  {
    title: 'Placas QR en cada mesa',
    text: 'Con el número de mesa, para consultar la carta, pedir y pagar desde el móvil.',
    icon: 'qr-plate',
    href: '/hardware/placas-qr',
  },
  {
    title: 'Tu web con la carta',
    text: 'Si no tienes web, o la tienes sin carta ni botón de reservar, te la montamos.',
    icon: 'globe',
    href: '/soluciones/web-para-restaurantes',
  },
];

/* ── Preguntas frecuentes ──────────────────────────────────────────── */

export const onboardingFaqs: { q: string; a: string }[] = [
  {
    q: '¿Tengo que cerrar el local para el cambio?',
    a: 'No. Lo preparamos todo mientras sigues con tu sistema actual y elegimos contigo un día tranquilo para cambiar, normalmente al empezar la semana o antes de un servicio flojo.',
  },
  {
    q: '¿Y si algo falla el primer día?',
    a: 'Estamos disponibles durante el primer servicio para resolverlo al momento. Y como funciona en el navegador, si un equipo da guerra puedes seguir desde otra tablet o un móvil.',
  },
  {
    q: '¿Cuánto tiempo le quita a mi equipo?',
    a: 'Poco: una sesión de formación antes del cambio y un repaso rápido después. La carga de la carta y la configuración las hacemos nosotros.',
  },
  {
    q: '¿Cuánto se tarda de verdad?',
    a: 'Los plazos de esta página son orientativos para un local con la carta lista. En la propuesta te damos las fechas concretas para el tuyo, y dependen sobre todo de que tengamos tu carta y de si necesitas equipo.',
  },
  {
    q: '¿Qué pasa con mis datos del TPV anterior?',
    a: 'Importamos lo que tu sistema permita exportar: carta, clientes con consentimiento e histórico si se puede. Las facturas ya emitidas se quedan en tu sistema anterior y te ayudamos a guardarlas.',
  },
];
