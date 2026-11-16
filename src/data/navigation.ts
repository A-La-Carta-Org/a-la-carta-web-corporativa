import { solutions } from './solutions';
import { sectors } from './sectors';

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  href: string;
  /** Si tiene hijos, se abre como menú desplegable */
  children?: NavLink[];
  /** Texto del enlace "ver todo" del desplegable */
  allLabel?: string;
}

export const mainNav: NavGroup[] = [
  {
    label: 'Soluciones',
    href: '/soluciones',
    allLabel: 'Ver todas las soluciones',
    children: solutions.map((s) => ({
      label: s.navLabel,
      href: `/soluciones/${s.slug}`,
      description: s.tagline,
    })),
  },
  {
    label: 'Sectores',
    href: '/sectores',
    allLabel: 'Ver todos los sectores',
    children: sectors.map((s) => ({
      label: s.navLabel,
      href: `/sectores/${s.slug}`,
      description: s.tagline,
    })),
  },
  { label: 'Precios', href: '/precios' },
  { label: 'Por qué alaCarta', href: '/por-que-alacarta' },
  {
    label: 'Recursos',
    href: '/recursos',
    allLabel: 'Ver recursos',
    children: [
      {
        label: 'Preguntas frecuentes',
        href: '/recursos/preguntas-frecuentes',
        description: 'Las dudas habituales antes de empezar',
      },
      {
        label: 'Guías',
        href: '/recursos/guias',
        description: 'Cómo elegir un TPV, VeriFactu, carta QR…',
      },
      {
        label: 'Centro de ayuda',
        href: '/recursos/ayuda',
        description: 'Documentación de uso de la plataforma',
      },
    ],
  },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Soluciones',
    links: solutions.map((s) => ({ label: s.navLabel, href: `/soluciones/${s.slug}` })),
  },
  {
    title: 'Sectores',
    links: sectors.map((s) => ({ label: s.navLabel, href: `/sectores/${s.slug}` })),
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Por qué alaCarta', href: '/por-que-alacarta' },
      { label: 'Precios', href: '/precios' },
      { label: 'Solicitar demo', href: '/solicitar-demo' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Preguntas frecuentes', href: '/recursos/preguntas-frecuentes' },
      { label: 'Guías', href: '/recursos/guias' },
      { label: 'Centro de ayuda', href: '/recursos/ayuda' },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: 'Aviso legal', href: '/legal/aviso-legal' },
  { label: 'Privacidad', href: '/legal/privacidad' },
  { label: 'Cookies', href: '/legal/cookies' },
];
