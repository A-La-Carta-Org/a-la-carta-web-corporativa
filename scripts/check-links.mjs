/**
 * Comprueba que todos los enlaces internos del HTML generado en dist/ apuntan a una página
 * que existe y que las anclas (`/precios#monta`, `#pruebalo`…) apuntan a un `id` real de la
 * página de destino. Se ejecuta tras el build (`npm run check:links`). Falla con código 1 si hay
 * rotos.
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

/** Devuelve el archivo HTML que sirve una ruta, o null si no existe. */
const fileFor = (clean) => {
  if (clean === '/') return join(DIST, 'index.html');
  const base = join(DIST, clean);
  for (const candidate of [`${base}.html`, join(base, 'index.html'), base]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
};

const exists = (href) => {
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '') return true;
  return fileFor(clean) !== null || existsSync(join(DIST, clean));
};

const idCache = new Map();
const idsOf = (file) => {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
};

let broken = 0;
let anchors = 0;
const seen = new Map();
const report = (href, file) => {
  broken++;
  const list = seen.get(href) ?? [];
  list.push(relative(DIST, file));
  seen.set(href, list);
};

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/href="((?:\/(?!\/)[^"]*)|(?:#[^"]+))"/g)) {
    const href = m[1].replaceAll('&amp;', '&');
    if (!exists(href)) {
      report(href, file);
      continue;
    }
    const hash = href.indexOf('#');
    if (hash === -1) continue;
    const fragment = decodeURIComponent(href.slice(hash + 1));
    if (!fragment) continue;
    const clean = href.slice(0, hash).split('?')[0];
    const target = clean ? fileFor(clean) : file;
    if (!target) continue;
    anchors++;
    if (!idsOf(target).has(fragment)) report(href, file);
  }
}
if (broken) {
  console.error(`✗ ${broken} enlace(s) o ancla(s) interno(s) roto(s):`);
  for (const [href, files] of seen)
    console.error(`  ${href}  ←  ${[...new Set(files)].join(', ')}`);
  process.exit(1);
}
console.log(
  `✓ ${htmlFiles.length} páginas, sin enlaces internos rotos (${anchors} anclas comprobadas)`
);
