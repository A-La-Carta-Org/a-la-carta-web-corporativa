/**
 * Scroll vertical suave con Lenis (rueda y trackpad; el táctil sigue siendo nativo).
 *
 * - Respeta «reducir movimiento»: no se activa.
 * - Los enlaces internos (#simulador, #configurador…) se desplazan con la misma suavidad y
 *   respetan `scroll-padding-top` (la cabecera fija no tapa el destino).
 * - Los contenedores con su propio scroll (menú móvil, listas de las demos) siguen
 *   funcionando: `allowNestedScroll` y `data-lenis-prevent`.
 * - Con el menú móvil abierto (html.menu-open) la página se detiene.
 */
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reduce.matches && !window.__lenis) {
  const lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    wheelMultiplier: 1,
    anchors: true,
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
    prevent: (node) => Boolean(node.closest?.('.mobile-menu, [data-lenis-prevent], dialog')),
  });
  window.__lenis = lenis;

  // Menú móvil abierto → la página no se mueve debajo
  const root = document.documentElement;
  let menuOpen = root.classList.contains('menu-open');
  new MutationObserver(() => {
    const now = root.classList.contains('menu-open');
    if (now === menuOpen) return;
    menuOpen = now;
    if (now) lenis.stop();
    else lenis.start();
  }).observe(root, { attributes: true, attributeFilter: ['class'] });
}
