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
    'Plataforma integral de gestión para hostelería: TPV, comandero, cocina, carta QR, reservas, pedidos y gestión del negocio.',
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
  price?: number;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: opts.name,
  description: opts.description,
  url: absoluteUrl(opts.path),
  applicationCategory: opts.category ?? 'BusinessApplication',
  operatingSystem: 'Web, Android, iOS',
  provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  ...(opts.price !== undefined
    ? {
        offers: {
          '@type': 'Offer',
          price: opts.price,
          priceCurrency: 'EUR',
          description: 'Precio orientativo por local y mes, sin IVA',
        },
      }
    : {}),
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
