// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';

/**
 * Web corporativa de alaCarta.
 *
 * - Salida estática (SSG): cada URL se genera como un archivo HTML en el build. Un servidor
 *   estático (nginx, Coolify) la sirve sin Node en producción.
 * - `format: 'file'` genera `/precios.html` en vez de `/precios/index.html`, de modo que la URL
 *   canónica no lleva barra final y nginx la resuelve con `try_files $uri $uri.html`.
 * - Vue solo se usa en islas interactivas (formularios, selector de precios). El resto es HTML
 *   sin JavaScript.
 */
export default defineConfig({
  site: 'https://alacarta.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  integrations: [
    vue(),
    sitemap({
      // Fuera del sitemap: errores, legales en borrador y páginas `noindex` (gracias, demo de carta)
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/legal/') &&
        !page.includes('/gracias') &&
        !page.includes('/demo/carta'),
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  devToolbar: { enabled: false },
});
