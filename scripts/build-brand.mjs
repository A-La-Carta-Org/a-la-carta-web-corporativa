/**
 * Genera los PNG de marca a partir de SVG escritos aquí mismo: favicon, iconos de app,
 * imagen Open Graph y logotipo horizontal. Se ejecuta con `npm run build:brand` y sus
 * resultados se versionan en public/ (no hace falta ejecutarlo en cada build).
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const INK = '#0b0b0a';
const WHITE = '#ffffff';

const mark = (color, x = 0, y = 0, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <rect x="2" y="2" width="12.5" height="12.5" rx="3.5" fill="${color}"/>
    <rect x="17.5" y="2" width="12.5" height="12.5" rx="3.5" fill="none" stroke="${color}" stroke-width="2"/>
    <rect x="2" y="17.5" width="12.5" height="12.5" rx="3.5" fill="none" stroke="${color}" stroke-width="2"/>
    <rect x="17.5" y="17.5" width="12.5" height="12.5" rx="3.5" fill="none" stroke="${color}" stroke-width="2"/>
  </g>`;

/* Icono de app: marca sobre fondo blanco con esquinas suaves (el sistema recorta) */
const appIcon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="${WHITE}"/>
  ${mark(INK, 96, 96, 10)}
</svg>`;

/* Logotipo horizontal: marca + palabra. La palabra se dibuja con la fuente del sistema
   al rasterizar, por lo que el PNG es una aproximación; el SVG de la web es el de referencia. */
const logo = (color, bg) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="320" viewBox="0 0 1200 320">
  ${bg ? `<rect width="1200" height="320" fill="${bg}"/>` : ''}
  ${mark(color, 60, 72, 5.5)}
  <text x="270" y="212" font-family="Manrope, Inter, Helvetica, Arial, sans-serif" font-weight="600" font-size="150" letter-spacing="-6" fill="${color}">alaCarta</text>
</svg>`;

/* Open Graph 1200×630 */
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${WHITE}"/>
  ${mark(INK, 80, 80, 3)}
  <text x="196" y="155" font-family="Manrope, Inter, Helvetica, Arial, sans-serif" font-weight="600" font-size="64" letter-spacing="-2.5" fill="${INK}">alaCarta</text>
  <text x="80" y="330" font-family="Manrope, Inter, Helvetica, Arial, sans-serif" font-weight="600" font-size="72" letter-spacing="-2.5" fill="${INK}">Sala, cocina, pedidos y gestión.</text>
  <text x="80" y="415" font-family="Manrope, Inter, Helvetica, Arial, sans-serif" font-weight="600" font-size="72" letter-spacing="-2.5" fill="${INK}">Un solo sistema.</text>
  <text x="80" y="520" font-family="Inter, Helvetica, Arial, sans-serif" font-size="30" fill="#74746e">Plataforma integral de gestión para hostelería · alacarta.com</text>
  <rect x="80" y="560" width="1040" height="2" fill="#e3e3df"/>
</svg>`;

mkdirSync('public/brand', { recursive: true });
const png = (svg, out, w, h) =>
  sharp(Buffer.from(svg))
    .resize(w, h)
    .png()
    .toFile(out)
    .then(() => console.log('✓', out));

await Promise.all([
  png(appIcon(512), 'public/icon-512.png', 512, 512),
  png(appIcon(192), 'public/icon-192.png', 192, 192),
  png(appIcon(180), 'public/apple-touch-icon.png', 180, 180),
  png(appIcon(32), 'public/favicon-32.png', 32, 32),
  png(og, 'public/og-image.png', 1200, 630),
  png(logo(INK), 'public/brand/alacarta-logo.png', 1200, 320),
  png(logo(WHITE, INK), 'public/brand/alacarta-logo-inverse.png', 1200, 320),
]);
writeFileSync('public/brand/alacarta-logo.svg', logo(INK).trim());
writeFileSync(
  'public/brand/alacarta-mark.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${mark(INK)}</svg>`
);
console.log('✓ public/brand/*.svg');
