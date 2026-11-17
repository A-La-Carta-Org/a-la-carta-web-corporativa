/**
 * Comprobación de la lectura de parámetros del formulario de demo (src/lib/lead.ts): lo que llega
 * del configurador, de la placa QR, del comprobador de equipo y de la calculadora de comisiones se
 * entiende, y lo desconocido se ignora sin romper. Mismo enfoque que check-quote.mjs (Node quita
 * los tipos; un gancho resuelve el alias `@/`). Se lanza con `npm run check:lead` (en `npm test`).
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

const { parseLeadParams, leadKind, thanksHref, phoneOk, emailOk } = await import('@/lib/lead');
const { encodeConfig, describeConfig, decodeConfig } = await import('@/lib/quote');
const { ecosystem } = await import('@/data/solutions');
const { sectors } = await import('@/data/sectors');
const { plateSummary, evaluateEquipment } = await import('@/data/hardware');

const catalog = {
  products: ecosystem.map((i) => ({ slug: i.slug, label: i.navLabel })),
  sectors: sectors.map((s) => ({ slug: s.slug, name: s.name })),
};
const parse = (qs) => parseLeadParams(new URLSearchParams(qs), catalog);

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

check('Valores desconocidos se ignoran', () => {
  const c = parse(
    'modulo=foo&sector=bar&plan=oro&motivo=hack&modo=x&origen=%3Cscript%3E&config=zzz&equipo=a:b'
  );
  assert.equal(c.modo, 'demo');
  assert.deepEqual(c.productos, []);
  assert.equal(c.sector, null);
  assert.equal(c.plan, null);
  assert.equal(c.motivo, null);
  assert.equal(c.origen, null);
  assert.equal(c.config, null);
  assert.equal(c.equipo, null);
  assert.deepEqual(c.resumen, []);
});

check('Módulos de soluciones y de equipamiento', () => {
  const c = parse('modulo=reservas&sector=bares&origen=sol-reservas');
  assert.deepEqual(c.productos, ['reservas']);
  assert.equal(c.sector, 'bares');
  assert.equal(c.origen, 'sol-reservas');
  for (const slug of ['hardware', 'placas-qr', 'puesta-en-marcha']) {
    assert.deepEqual(parse(`modulo=${slug}`).productos, [slug]);
  }
});

check('Configurador: resumen con describeConfig y productos marcados', () => {
  const cfg = { modules: ['comandero', 'reservas'], locales: 2, billing: 'anual', hardware: true };
  const raw = encodeConfig(cfg);
  const c = parse(`config=${raw}&plan=completo&origen=configurador`);
  assert.equal(c.config.tipo, 'configurador');
  assert.equal(c.config.resumen, describeConfig(decodeConfig(raw)));
  for (const p of ['tpv', 'carta-qr', 'backoffice', 'comandero', 'reservas', 'hardware'])
    assert.ok(c.productos.includes(p), `falta ${p}`);
  assert.equal(c.hardware, 'necesito');
  assert.equal(c.resumen[0].label, 'Tu configuración');
  assert.ok(!c.resumen.some((r) => r.label === 'Plan'), 'el plan ya va en la configuración');
});

check('Configurador de fundadores (`config=f`) → motivo fundador', () => {
  assert.equal(parse('config=f&origen=fundadores').motivo, 'fundador');
});

check('Placa QR', () => {
  const raw = plateSummary({
    brand: 'La Plaza',
    table: 7,
    material: 'negro',
    format: 'sobremesa',
    nfc: true,
  });
  const c = parse(`modulo=placas-qr&origen=placas-configurador&config=${encodeURIComponent(raw)}`);
  assert.equal(c.config.tipo, 'placa');
  assert.match(c.config.resumen, /metacrilato negro, de sobremesa, con NFC/);
  assert.match(c.config.resumen, /mesa 7/);
  assert.match(c.config.resumen, /La Plaza/);
  assert.deepEqual(c.productos, ['placas-qr']);
  assert.equal(parse('config=placa:oro;mesa:1').config, null);
});

check('Comprobador de equipo', () => {
  const r = evaluateEquipment({ equipo: 'tablet', impresora: 'no', cajas: '2', modelo: 'X1' });
  const c = parse(`modulo=hardware&equipo=${encodeURIComponent(r.summary)}`);
  assert.equal(c.equipo.resultado, 'falta');
  assert.equal(c.hardware, 'necesito');
  assert.match(c.equipo.resumen, /una tablet/);
  assert.match(c.equipo.resumen, /modelo: X1/);
  const ok = evaluateEquipment({ equipo: 'ordenador', impresora: 'red', cajas: '1' });
  assert.equal(parse(`equipo=${encodeURIComponent(ok.summary)}`).hardware, 'tengo');
});

check('Calculadora de comisiones', () => {
  const c = parse('motivo=comisiones&config=comisiones_p300_t25_c25_s30&origen=calculadora');
  assert.equal(c.config.tipo, 'comisiones');
  assert.equal(c.motivo, 'comisiones');
  assert.match(c.config.resumen, /22\.500 €/);
  assert.ok(c.productos.includes('pedidos-online'));
  assert.equal(parse('config=comisiones_p1_t1_c99_s1').config, null);
});

check('Modo llamada, plan y grupos', () => {
  assert.equal(parse('modo=llamada&origen=barra-movil-home').modo, 'llamada');
  assert.equal(parse('plan=total').plan, 'total');
  assert.equal(parse('motivo=grupos').plan, 'grupos');
  assert.equal(parse('origen=momento-abrir-un-local-cierre').momento, 'abrir');
});

check('Tipo de solicitud y /gracias', () => {
  assert.equal(leadKind('llamada', 'propuesta'), 'llamada');
  assert.equal(leadKind('demo', 'propuesta'), 'propuesta');
  assert.equal(leadKind('demo', 'fundador'), 'fundador');
  assert.equal(leadKind('demo', null), 'demo');
  assert.equal(thanksHref('demo', { momento: 'abrir' }), '/gracias?tipo=demo&momento=abrir');
});

check('Validación de correo y teléfono', () => {
  assert.ok(emailOk('ana@bar.es'));
  assert.ok(!emailOk('ana@bar'));
  assert.ok(phoneOk('600 12 34 56'));
  assert.ok(phoneOk('+34 600-123-456'));
  assert.ok(!phoneOk('12345'));
});

if (process.exitCode) {
  console.error('\nLa lectura de parámetros del formulario no cuadra.');
} else {
  console.log(`✓ Formulario: ${n} comprobaciones correctas.`);
}
