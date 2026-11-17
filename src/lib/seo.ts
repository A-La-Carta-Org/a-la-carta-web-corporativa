import { SITE_NAME, SITE_OG_IMAGE, SITE_URL, absoluteUrl } from '@/data/site';

export interface SeoProps {
  title: string;
  description: string;
  /** Path relativo, p. ej. «/precios». La home es «/». */
  path: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  /** Si se pasa, el <title> no añade el sufijo de marca */
  rawTitle?: boolean;
}

export const pageTitle = (title: string, raw = false) =>
  raw || title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

export const canonical = (path: string) => absoluteUrl(path);

export const defaultImage = SITE_OG_IMAGE;

/** JSON-LD de la organización, en todas las páginas */
export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/alacarta-logo.png`,
  description:
    'Ecosistema de gestión para hostelería: sala y cocina, clientes y canales propios, gestión del negocio y equipo, conectados en un solo sistema, con el equipamiento y la puesta en marcha.',
  areaServed: 'ES',
});

export const websiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'es-ES',
});

export const softwareJsonLd = (opts: {
  name: string;
  description: string;
  path: string;
  category?: string;
  /** Sistemas en los que funciona; por defecto, navegador, Android e iOS */
  os?: string;
  price?: number;
  /** Matiz del precio para `Offer.description` */
  priceNote?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: opts.name,
  description: opts.description,
  url: absoluteUrl(opts.path),
  applicationCategory: opts.category ?? 'BusinessApplication',
  operatingSystem: opts.os ?? 'Web, Android, iOS',
  provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  ...(opts.price !== undefined
    ? {
        offers: {
          '@type': 'Offer',
          price: opts.price,
          priceCurrency: 'EUR',
          description: opts.priceNote ?? 'Precio orientativo por local y mes, sin IVA',
        },
      }
    : {}),
});

/**
 * Servicios (web, puesta en marcha, equipamiento): `Service` en vez de `SoftwareApplication`.
 * Hardware y placas también van como `Service` (suministro configurado) y no como `Product`:
 * sin precio publicado ni valoraciones, Google marca un `Product` como incompleto. Nunca se
 * añaden precios ni valoraciones que no existan.
 */
export const serviceJsonLd = (opts: {
  name: string;
  description: string;
  path: string;
  /** Tipo de servicio en lenguaje llano: «Suministro e instalación de TPV para hostelería» */
  serviceType?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: opts.name,
  description: opts.description,
  url: absoluteUrl(opts.path),
  ...(opts.serviceType ? { serviceType: opts.serviceType } : {}),
  areaServed: 'ES',
  provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
});

export const faqJsonLd = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});
