/**
 * Navegación: menú principal (megamenús), pie y enlaces legales. Las columnas de Soluciones, de
 * Sectores y del pie se generan desde los datos (`solutions`, `sectors`, `moments`), nunca a mano.
 * Modelo y contenido: docs/auditoria/02.
 */
import type { IconName } from '@/components/ui/icons';
import { familiesWithItems } from './solutions';
import { sectors, sectorPath } from './sectors';
import { moments, momentPath } from './moments';
import { SITE_URL } from './site';
import { ctaHref } from '@/lib/cta';

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon?: IconName;
  /** Chip pequeño gris: «Nuevo» o «En camino» */
  badge?: 'nuevo' | 'pronto';
}

export interface NavColumn {
  title: string;
  icon?: IconName;
  links: NavLink[];
}

export interface NavFeatured {
  title: string;
  text: string;
  href: string;
  label: string;
  icon?: IconName;
  /** Mini QR con URL absoluta (se genera en build) */
  qr?: { url: string; label: string; href: string };
}

export interface NavGroup {
  id: string;
  label: string;
  href: string;
  /** Si tiene columnas, se abre como megamenú */
  columns?: NavColumn[];
  featured?: NavFeatured;
  /** Enlaces del pie del panel */
  footerLinks?: NavLink[];
  /** Ancho del panel: todo el contenedor o ajustado a su contenido */
  wide?: boolean;
}

export const badgeLabels: Record<NonNullable<NavLink['badge']>, string> = {
  nuevo: 'Nuevo',
  pronto: 'En camino',
};

/** URL absoluta de la carta de ejemplo, para los QR que se escanean con otro móvil */
export const DEMO_CARTA_URL = `${SITE_URL}/demo/carta`;

const solutionColumns: NavColumn[] = familiesWithItems().map((f) => ({
  title: f.name,
  icon: f.icon,
  links: f.items.map((i) => ({
    label: i.navLabel,
    href: i.path,
    description: i.tagline,
    icon: i.icon,
    badge: i.status === 'en-camino' ? 'pronto' : undefined,
  })),
}));

export const mainNav: NavGroup[] = [
  {
    id: 'soluciones',
    label: 'Soluciones',
    href: '/soluciones',
    wide: true,
    columns: solutionColumns,
    featured: {
      title: 'Pruébalo ahora, sin registrarte',
      text: 'Toma una comanda en el móvil y mira cómo llega a cocina y a caja.',
      href: ctaHref({ to: 'probar', origen: 'menu' }),
      label: 'Abrir demo interactiva',
      icon: 'play',
      qr: {
        url: DEMO_CARTA_URL,
        label: 'o escanea y abre la carta de ejemplo',
        href: ctaHref({ to: 'carta', origen: 'menu' }),
      },
    },
    footerLinks: [
      { label: 'Ver el ecosistema completo', href: '/soluciones' },
      { label: 'Comparar planes', href: '/precios' },
    ],
  },
  {
    id: 'sectores',
    label: 'Sectores',
    href: '/sectores',
    columns: [
      {
        title: 'Tu tipo de local',
        links: sectors.map((s) => ({
          label: s.navLabel,
          href: sectorPath(s.slug),
          icon: s.icon,
        })),
      },
      {
        title: 'Tu momento',
        links: moments.map((m) => ({
          label: m.navLabel,
          href: momentPath(m.slug),
          description: m.tagline,
          icon: m.icon,
        })),
      },
    ],
    featured: {
      title: '¿Tienes varios locales?',
      text: 'Carta maestra, roles centrales y comparativas entre locales en la misma cuenta.',
      href: sectorPath('grupos-y-cadenas'),
      label: 'Ver grupos y cadenas',
      icon: 'building',
    },
    footerLinks: [{ label: 'Ver todos los sectores', href: '/sectores' }],
  },
  { id: 'hardware', label: 'Hardware', href: '/hardware' },
  { id: 'precios', label: 'Precios', href: '/precios' },
  {
    id: 'recursos',
    label: 'Recursos',
    href: '/recursos',
    columns: [
      {
        title: 'Aprende',
        links: [
          { label: 'Guías', href: '/recursos/guias', icon: 'book' },
          { label: 'VeriFactu', href: '/recursos/guias/verifactu-restaurantes', icon: 'shield' },
          {
            label: 'Registro de jornada',
            href: '/recursos/guias/registro-de-jornada-hosteleria',
            icon: 'clock',
          },
          { label: 'Preguntas frecuentes', href: '/recursos/preguntas-frecuentes', icon: 'help' },
        ],
      },
      {
        title: 'Herramientas',
        links: [
          {
            label: 'Calculadora de comisiones',
            href: '/herramientas/calculadora-comisiones',
            icon: 'calculator',
          },
          {
            label: 'Monta tu alaCarta',
            href: '/precios#monta',
            icon: 'receipt',
          },
          { label: 'Demo interactiva', href: '/demo', icon: 'play' },
        ],
      },
      {
        title: 'Empresa',
        links: [
          { label: 'Por qué alaCarta', href: '/por-que-alacarta', icon: 'layers' },
          { label: 'Locales fundadores', href: '/locales-fundadores', icon: 'award' },
          { label: 'Novedades', href: '/novedades', icon: 'newspaper' },
          { label: 'Contacto', href: '/contacto', icon: 'message' },
        ],
      },
    ],
    footerLinks: [{ label: 'Ver todos los recursos', href: '/recursos' }],
  },
];

/** Acciones de la cabecera */
export const headerActions = {
  try: { label: 'Pruébalo', href: ctaHref({ to: 'probar', origen: 'cabecera' }) },
  demo: { label: 'Solicitar demo', href: ctaHref({ to: 'demo', origen: 'cabecera' }) },
};

/** Pie: una columna por familia + empresa y recursos */
export const footerNav: { title: string; links: NavLink[] }[] = [
  ...familiesWithItems().map((f) => ({
    title: f.shortName,
    links: f.items.map((i) => ({ label: i.navLabel, href: i.path })),
  })),
  {
    title: 'Empresa y recursos',
    links: [
      { label: 'Sectores', href: '/sectores' },
      { label: 'Precios', href: '/precios' },
      { label: 'Demo interactiva', href: '/demo' },
      { label: 'Calculadora de comisiones', href: '/herramientas/calculadora-comisiones' },
      { label: 'Por qué alaCarta', href: '/por-que-alacarta' },
      { label: 'Locales fundadores', href: '/locales-fundadores' },
      { label: 'Novedades', href: '/novedades' },
      { label: 'Guías', href: '/recursos/guias' },
      { label: 'Preguntas frecuentes', href: '/recursos/preguntas-frecuentes' },
      { label: 'Centro de ayuda', href: '/recursos/ayuda' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: 'Aviso legal', href: '/legal/aviso-legal' },
  { label: 'Privacidad', href: '/legal/privacidad' },
  { label: 'Cookies', href: '/legal/cookies' },
];
