/**
 * Datos del sitio que aparecen en URLs absolutas, metadatos y JSON-LD.
 * Un solo sitio para el dominio, el nombre y los canales de contacto.
 */
export const SITE_URL = 'https://alacarta.com';
export const SITE_NAME = 'alaCarta';
export const SITE_TAGLINE = 'Ecosistema de gestión para hostelería';
/** Descripción genérica del sitio (la de la home, con precio, está en src/data/home.ts) */
export const SITE_DESCRIPTION =
  'Ecosistema de gestión para restaurantes, bares y cafeterías: sala, cocina, canales propios, gestión y equipo en un solo sistema, sin comisiones.';
export const SITE_LOCALE = 'es_ES';
export const SITE_LANG = 'es';

/** Imagen por defecto al compartir (1200×630). Se genera con `npm run build:og`. */
export const SITE_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const SITE_LOGO = `${SITE_URL}/brand/alacarta-logo.png`;

export const absoluteUrl = (path = '/') => `${SITE_URL}${path === '/' ? '' : path}`;

/**
 * Contacto. El correo usa el dominio previsto; el teléfono y la dirección postal no se
 * inventan: se añaden cuando existan (ver docs/TODO.md).
 */
export const CONTACT_EMAIL = 'hola@alacarta.com';
export const SUPPORT_EMAIL = 'soporte@alacarta.com';

/** Promesas operativas que la web hace y que el negocio debe poder cumplir. */
export const REPLY_HOURS = 24;
export const DEMO_MINUTES = 30;
export const TRIAL_DAYS = 14;

/** Subdominios del ecosistema (ver docs/ARQUITECTURA.md). Hoy solo existe la web. */
export const APP_URL = 'https://app.alacarta.com';
export const API_URL = 'https://api.alacarta.com';

/** Fecha del último cambio de los textos legales (se actualiza a mano). */
export const LEGAL_UPDATED = '2026-11-17';

/**
 * Última revisión del estado de cada pieza (`status` en solutions.ts, integraciones). Se enseña en
 * `/novedades`: cámbiala cada vez que cambie un estado.
 */
export const STATUS_UPDATED = '2026-11-17';

export const ORGANIZATION_REF = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
} as const;

/**
 * «Quién hay detrás» (docs/auditoria/13 §3). Vacío a propósito: nombre, cargo y foto del equipo
 * solo cuando Jordi lo apruebe. Mientras esté vacío, `/por-que-alacarta` no pinta la sección.
 * `photo` es una ruta en /public (p. ej. «/equipo/nombre.jpg», 480×480).
 */
export interface TeamMember {
  name: string;
  role: string;
  /** Una o dos frases en primera persona: de dónde viene y por qué hace alaCarta */
  bio: string;
  photo?: string;
}
export const TEAM: TeamMember[] = [];
