/**
 * Cifras que cambian con suavidad en las islas Vue (totales del configurador, ahorro de la
 * calculadora, precio mensual/anual…). Devuelve un ref que persigue al valor de origen con
 * una curva de salida; con «reducir movimiento» salta directamente.
 *
 *   const total = computed(() => quote.value.monthly);
 *   const shown = useTweened(total);          // en la plantilla: fmt(shown)
 */
import { ref, watch, onBeforeUnmount, type Ref, type WatchSource } from 'vue';

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

export function useTweened(source: WatchSource<number>, duration = 480): Ref<number> {
  const read = () => (typeof source === 'function' ? (source as () => number)() : (source as Ref<number>).value);
  const shown = ref(read());
  let raf = 0;

  const reduce = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  watch(source, (to) => {
    cancelAnimationFrame(raf);
    const from = shown.value;
    if (reduce() || from === to || typeof window === 'undefined') {
      shown.value = to;
      return;
    }
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      shown.value = from + (to - from) * easeOutQuint(t);
      if (t < 1) raf = requestAnimationFrame(step);
      else shown.value = to;
    };
    raf = requestAnimationFrame(step);
  });

  onBeforeUnmount(() => cancelAnimationFrame(raf));
  return shown;
}
