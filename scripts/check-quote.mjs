/**
 * Comprobación mínima de la lógica del configurador (src/lib/quote.ts) sin añadir dependencias:
 * Node ≥ 22.18 ejecuta TypeScript quitando los tipos, y un gancho de resolución traduce el alias
 * `@/` a `src/` y añade la extensión `.ts`. Recalcula casos conocidos con los precios de
 * src/data/pricing.ts y falla si algo no cuadra. Se lanza con `npm run check:quote` (incluido en
 * `npm test`).
 */
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('..', import.meta.url));

registerHooks({
  resolve(specifier, context, nextResolve) {
    let spec = specifier;
    if (spec.startsWith('@/')) spec = pathToFileURL(`${root}src/${spec.slice(2)}`).href;
    const isLocal = spec.startsWith('file:') || spec.startsWith('.');
    if (isLocal && !/\.[cm]?[jt]s$/.test(spec)) {
      const base = spec.startsWith('file:') ? spec : new URL(spec, context.parentURL).href;
      if (existsSync(fileURLToPath(`${base}.ts`))) spec = `${base}.ts`;
    }
    return nextResolve(spec, context);
  },
});

const { quote, encodeConfig, decodeConfig, configFromParams, defaultConfig } =
  await import('@/lib/quote');
const pricing = await import('@/data/pricing');

let n = 0;
const check = (name, fn) => {
  try {
    fn();
    n += 1;
  } catch (err) {
    console.error(`✗ ${name}\n  ${err.message}`);
    process.exitCode = 1;
  }
};

check('Plan Total: 159 €, 135 € con pago anual', () => {
  const total = pricing.getPlan('total');
  assert.equal(total.monthly, 159);
  assert.equal(pricing.planMonthly(total, 'anual'), 135);
  assert.ok(pricing.totalAsSeparate > total.monthly, 'el Total debe salir más barato por separado');
  assert.equal(pricing.totalAsSeparate, 200);
});

check('Sin nada marcado: Esencial 49 €', () => {
  const q = quote({});
  assert.equal(q.plan, 'esencial');
  assert.equal(q.monthly, 49);
  assert.equal(q.yearly, 588);
  assert.equal(q.commissions, 0);
});

check('Esencial + clientes = 68 €', () => {
  assert.equal(quote({ modules: ['clientes'] }).monthly, 68);
});

check('Tres módulos: recomienda Completo y dice el ahorro', () => {
  const q = quote({ modules: ['cocina', 'reservas', 'pedidos-online'] });
  assert.equal(q.plan, 'completo');
  assert.equal(q.monthly, 99);
  assert.equal(q.better?.saving, 49 + 19 + 19 + 29 - 99);
});

check('Ejemplo de PRECIOS.md: 2 TPV, 4 comanderos, cocina y reservas = 119 €', () => {
  const q = quote({ modules: ['comandero', 'cocina', 'reservas'], terminales: 2, comanderos: 4 });
  assert.equal(q.plan, 'completo');
  assert.equal(q.monthly, 99 + 12 + 8);
});

check('Completo + los cuatro complementos del Total: recomienda Total', () => {
  const q = quote({
    modules: ['comandero', 'cocina', 'reservas', 'app-propia', 'llamadas-ia', 'erp', 'rrhh'],
  });
  assert.equal(q.plan, 'total');
  assert.equal(q.monthly, 159);
  assert.equal(q.better?.saving, 200 - 159);
});

check('Uso por encima de lo incluido: minutos y personas', () => {
  const q = quote({ modules: ['llamadas-ia', 'rrhh'], minutos: 300, personas: 25 });
  // Esencial 49 + IA 29 + 100 min × 0,12 + RRHH 24 + 5 personas × 1
  assert.equal(q.monthly, 49 + 29 + 12 + 24 + 5);
});

check('ERP por empresa: el Total incluye una', () => {
  const all = ['comandero', 'cocina', 'reservas', 'app-propia', 'llamadas-ia', 'erp', 'rrhh'];
  assert.equal(quote({ modules: all, empresas: 2 }).monthly, 159 + 29);
});

check('Pago anual: descuento solo en la cuota del plan', () => {
  const q = quote({ modules: ['comandero'], billing: 'anual' });
  assert.equal(q.monthly, 42 + 19);
  assert.equal(q.annualSaving, (49 - 42) * 12);
  const m = quote({ billing: 'mensual' });
  assert.equal(m.annualSaving, 84, 'en mensual dice lo que ahorrarías');
});

check('Varios locales y aviso de Grupos', () => {
  const q = quote({ locales: 3 });
  assert.equal(q.monthly, 49 * 3);
  assert.ok(q.notices.some((t) => t.includes('Grupos')));
});

check('Ya tengo TPV: solo ERP y RRHH, sin plan', () => {
  const q = quote({ sinTpv: true, modules: ['erp', 'rrhh', 'reservas'] });
  assert.equal(q.plan, 'ninguno');
  assert.equal(q.monthly, 29 + 24);
  assert.ok(q.notices.length > 0, 'avisa de lo que necesita plan');
});

check('Web: cuota y alta; presencial «desde»; fundador la incluye', () => {
  const q = quote({ modules: ['web-para-restaurantes'], presencial: true });
  assert.equal(q.monthly, 49 + 24);
  assert.equal(q.onceTotal, pricing.WEB_SETUP + pricing.ONSITE_TRAINING_FROM);
  assert.ok(q.onceFrom);
  const f = quote({ fundador: true });
  assert.equal(f.onceTotal, 0);
  assert.ok(f.once.some((l) => l.id === 'once-presencial' && l.amount === 0));
});

check('Hardware y placas: sin cifra, «en tu propuesta»', () => {
  const q = quote({ hardware: true, placas: true });
  assert.deepEqual(q.pending, ['Hardware', 'Placas QR']);
  assert.ok(
    q.once.filter((l) => l.amount === null).every((l) => l.text === pricing.NO_PRICE_LABEL)
  );
});

check('URL: ida y vuelta, y lo por defecto no se escribe', () => {
  assert.equal(encodeConfig(defaultConfig()), '');
  const c = {
    ...defaultConfig(),
    modules: ['comandero', 'cocina', 'rrhh'],
    locales: 2,
    terminales: 2,
    personas: 25,
    billing: 'anual',
    fundador: true,
    hardware: true,
  };
  const s = encodeConfig(c);
  assert.equal(s, 'co.kd.rh_l2_t2_e25_a_h_f');
  assert.deepEqual(decodeConfig(s), c);
  assert.ok(/^[a-z0-9._]*$/.test(s), 'solo caracteres seguros en URL');
});

check('URL: entradas raras no rompen nada', () => {
  const c = decodeConfig('zz.co_l999_t-3_<script>_k0');
  assert.deepEqual(c.modules, ['comandero']);
  assert.equal(c.locales, 20);
  assert.equal(c.pantallas, 1);
});

check('?add=erp preselecciona el ERP; ?plan=completo marca sus módulos', () => {
  const a = configFromParams(new URLSearchParams('add=erp'));
  assert.deepEqual(a.modules, ['erp']);
  const p = configFromParams(new URLSearchParams('plan=completo'));
  assert.equal(quote(p).plan, 'completo');
  assert.equal(configFromParams(new URLSearchParams('origen=x')), null);
  assert.ok(configFromParams(new URLSearchParams('add=hardware')).hardware);
});

check('solutionPricing: los productos nuevos tienen cifra', () => {
  for (const slug of ['app-propia', 'llamadas-ia', 'web-para-restaurantes', 'erp', 'rrhh']) {
    const sp = pricing.solutionPricing(slug);
    assert.ok(sp.amount, `${slug} sin cifra`);
    assert.ok(typeof sp.monthly === 'number', `${slug} sin precio para JSON-LD`);
  }
  assert.equal(pricing.startingPaths()[2].amount, '159 €');
});

if (process.exitCode) {
  console.error('\nLa lógica del configurador no cuadra.');
} else {
  console.log(`✓ Configurador: ${n} comprobaciones correctas.`);
}
