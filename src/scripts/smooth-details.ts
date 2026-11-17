/**
 * Acordeones suaves: anima la altura de cualquier <details> al abrir y cerrar, y el contenido
 * aparece con un fundido corto. Funciona en todos los navegadores (Web Animations API) y sigue
 * siendo un <details> nativo: teclado, lectores de pantalla y buscar en la página intactos.
 *
 * - Respeta los grupos exclusivos (`name="faq"`): el que estaba abierto se cierra animado.
 * - Con «reducir movimiento» o `data-instant` no hace nada (comportamiento nativo).
 */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const running = new WeakMap<HTMLDetailsElement, Animation>();

const DURATION = 320;
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

const contentOf = (d: HTMLDetailsElement) =>
  Array.from(d.children).filter((c): c is HTMLElement => c.tagName !== 'SUMMARY');

function finish(d: HTMLDetailsElement) {
  d.classList.remove('is-animating');
  d.style.height = '';
  running.delete(d);
}

function animate(d: HTMLDetailsElement, open: boolean) {
  running.get(d)?.cancel();
  const start = d.getBoundingClientRect().height;
  // Mientras se anima, sale del grupo exclusivo para que el navegador no lo cierre de golpe
  const group = d.getAttribute('name');
  if (group) d.removeAttribute('name');

  let end: number;
  if (open) {
    d.open = true;
    end = d.getBoundingClientRect().height;
    contentOf(d).forEach((c) =>
      c.animate(
        [
          { opacity: 0, translate: '0 -4px' },
          { opacity: 1, translate: '0 0' },
        ],
        { duration: DURATION, easing: EASING }
      )
    );
  } else {
    d.open = false;
    end = d.getBoundingClientRect().height;
    d.open = true;
  }

  d.classList.add('is-animating');
  const anim = d.animate({ height: [`${start}px`, `${end}px`] }, { duration: DURATION, easing: EASING });
  running.set(d, anim);
  const done = () => {
    if (!open) d.open = false;
    if (group) d.setAttribute('name', group);
    finish(d);
  };
  anim.onfinish = done;
  anim.oncancel = () => {
    if (group) d.setAttribute('name', group);
    finish(d);
  };
}

document.addEventListener('click', (e) => {
  if (reduce.matches) return;
  const summary = (e.target as Element | null)?.closest('summary');
  const d = summary?.parentElement;
  if (!(d instanceof HTMLDetailsElement) || summary !== d.querySelector(':scope > summary')) return;
  if (d.hasAttribute('data-instant')) return;
  e.preventDefault();

  // A mitad de animación, un clic invierte el destino; si no, alterna el estado
  const opening = running.has(d) ? !d.dataset.opening : !d.open;

  if (opening) {
    const group = d.getAttribute('name');
    if (group) {
      document
        .querySelectorAll<HTMLDetailsElement>(`details[name="${CSS.escape(group)}"][open]`)
        .forEach((other) => other !== d && toggle(other, false));
    }
  }
  toggle(d, opening);
});

function toggle(d: HTMLDetailsElement, open: boolean) {
  if (open) d.dataset.opening = '1';
  else delete d.dataset.opening;
  animate(d, open);
}

export {};
