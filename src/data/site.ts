/**
 * Datos del sitio que aparecen en URLs absolutas, metadatos y JSON-LD.
 * Un solo sitio para el dominio, el nombre y los canales de contacto.
 */
export const SITE_URL = 'https://alacarta.com';
export const SITE_NAME = 'alaCarta';
export const SITE_TAGLINE = 'Plataforma integral de gestión para hostelería';
export const SITE_DESCRIPTION =
  'TPV, comandero, cocina, carta QR, reservas, pedidos y gestión del negocio en una sola plataforma para restaurantes, bares, cafeterías y grupos.';
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
export const LEGAL_UPDATED = '2026-11-16';

export const ORGANIZATION_REF = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
} as const;
