/**
 * Comprueba que todos los enlaces internos del HTML generado en dist/ apuntan a una página
 * que existe. Se ejecuta tras el build (`npm run check:links`). Falla con código 1 si hay rotos.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const htmlFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) htmlFiles.push(p);
  }
};
walk(DIST);

const exists = (href) => {
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '') return true;
  if (clean === '/') return existsSync(join(DIST, 'index.html'));
  const base = join(DIST, clean);
  return existsSync(base) || existsSync(`${base}.html`) || existsSync(join(base, 'index.html'));
};

let broken = 0;
const seen = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = m[1];
    if (href.startsWith('//')) continue;
    if (!exists(href)) {
      broken++;
      const list = seen.get(href) ?? [];
      list.push(relative(DIST, file));
      seen.set(href, list);
    }
  }
}
if (broken) {
  console.error(`✗ ${broken} enlace(s) interno(s) roto(s):`);
  for (const [href, files] of seen)
    console.error(`  ${href}  ←  ${[...new Set(files)].join(', ')}`);
  process.exit(1);
}
console.log(`✓ ${htmlFiles.length} páginas, sin enlaces internos rotos`);
