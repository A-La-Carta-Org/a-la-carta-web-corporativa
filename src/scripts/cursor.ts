/**
 * Cursor circular en negativo: un círculo blanco con `mix-blend-mode: difference` que sigue al
 * ratón exactamente (sin retraso). Sobre blanco se ve negro; sobre negro, blanco; sobre el acento, su
 * complementario.
 *
 * - Grande en reposo; se encoge sobre lo que se puede pulsar y al hacer clic.
 * - Sobre campos de texto desaparece y vuelve el cursor de texto nativo.
 * - Solo con ratón (hover + puntero fino) y sin «reducir movimiento». En táctil no existe.
 */
const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

const INTERACTIVE = [
  'a[href]',
  'button:not(:disabled)',
  'summary',
  'label[for]',
  'label:has(input)',
  'select',
  '[role="button"]',
  '[role="tab"]',
  '[role="switch"]',
  '[role="option"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'input[type="range"]',
  'input[type="submit"]',
  'input[type="button"]',
  '[data-cursor="hover"]',
].join(',');

const TEXT = [
  'input:not([type="checkbox"], [type="radio"], [type="range"], [type="submit"], [type="button"], [type="color"], [type="file"])',
  'textarea',
  '[contenteditable="true"]',
].join(',');

declare global {
  interface Window {
    __cursor?: boolean;
  }
}

function init() {
  window.__cursor = true;
  const el = document.createElement('div');
  el.className = 'cursor';
  el.setAttribute('aria-hidden', 'true');
  document.body.append(el);
  document.documentElement.classList.add('has-cursor');

  // Posición pegada al puntero (sin inercia): el círculo es el cursor, no puede quedarse
  // detrás. Solo se anima el tamaño (CSS). Se pinta como mucho una vez por frame.
  let x = -100;
  let y = -100;
  let seen = false;
  let queued = false;
  // Se mueve con `translate` (no `transform`): CSS aplica `scale` sobre `transform`, y el
  // círculo escalado acababa desplazado hacia la esquina en proporción a la escala.
  const paint = () => {
    queued = false;
    el.style.translate = `${x}px ${y}px`;
  };

  const setState = (target: EventTarget | null) => {
    const t = target instanceof Element ? target : null;
    const isText = Boolean(t?.closest(TEXT));
    el.classList.toggle('is-text', isText);
    el.classList.toggle('is-hover', !isText && Boolean(t?.closest(INTERACTIVE)));
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      seen = true;
      el.classList.add('is-visible');
      el.classList.remove('is-hidden');
      setState(e.target);
      if (!queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
    },
    { passive: true }
  );
  // Con la rueda, lo que hay bajo el ratón cambia aunque el ratón no se mueva
  window.addEventListener(
    'scroll',
    () => {
      if (seen) setState(document.elementFromPoint(x, y));
    },
    { passive: true }
  );
  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') el.classList.add('is-down');
  });
  window.addEventListener('pointerup', () => el.classList.remove('is-down'));
  // Sale de la ventana (o entra en un iframe): se oculta
  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) el.classList.add('is-hidden');
  });
  window.addEventListener('blur', () => el.classList.add('is-hidden'));
}

if (fine.matches && !reduce.matches && !window.__cursor) init();

export {};
