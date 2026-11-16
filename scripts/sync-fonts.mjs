/** Copia los subconjuntos latin y latin-ext de las fuentes desde node_modules a public/fonts. */
import { copyFileSync, mkdirSync } from 'node:fs';
mkdirSync('public/fonts', { recursive: true });
const files = [
  ['@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2', 'manrope-latin.woff2'],
  [
    '@fontsource-variable/manrope/files/manrope-latin-ext-wght-normal.woff2',
    'manrope-latin-ext.woff2',
  ],
  ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'inter-latin.woff2'],
  ['@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2', 'inter-latin-ext.woff2'],
];
for (const [from, to] of files) {
  copyFileSync(`node_modules/${from}`, `public/fonts/${to}`);
  console.log('✓', to);
}
