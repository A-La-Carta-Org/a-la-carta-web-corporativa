<script setup lang="ts">
/**
 * D2 · «Un cambio, todos los canales» (docs/auditoria/10). Un backoffice reducido con tres platos
 * de La Plaza (`channelDishes` de `src/data/demo.ts`): cambias un precio o marcas un plato como
 * agotado y el TPV, la carta QR, la tienda online y la app propia lo reflejan a la vez, con un
 * destello gris de 120 ms que se apaga con suavidad, y cada cifra que cambia destella (`t-flash`).
 * La app propia lleva su chip «En camino» (01 §4).
 *
 * Sin backend, sin cookies, sin almacenamiento. Sin JavaScript se ven los cuatro canales con los
 * mismos precios y los controles desactivados.
 */
import { computed, onMounted, reactive, ref } from 'vue';
import { allergens, channelDishes, dishes, eur } from '@/data/demo';
import { ctaHref } from '@/lib/cta';

const props = withDefaults(defineProps<{ origen?: string }>(), { origen: 'demo-cambio-canales' });

const base = channelDishes.map((id) => dishes.find((d) => d.id === id)!);
const items = reactive(
  base.map((d) => ({
    id: d.id,
    name: d.short,
    full: d.name.es,
    price: d.price,
    off: false,
    al: d.allergens.map((a) => allergens.find((x) => x.id === a)?.code).join(' · '),
  }))
);

const ready = ref(false);
const flash = ref(false);
const live = ref('');
const lastChange = ref('');
let flashTimer: number | undefined;

const changed = computed(() => items.some((it, i) => it.price !== base[i]!.price || it.off));
const href = computed(() => ctaHref({ to: 'demo', modulo: 'backoffice', origen: props.origen }));

const channels = [
  { id: 'tpv', label: 'TPV' },
  { id: 'carta', label: 'Carta QR' },
  { id: 'tienda', label: 'Tienda online' },
  { id: 'app', label: 'App propia', soon: true },
] as const;

function hhmm() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function changed4(text: string) {
  flash.value = false;
  window.clearTimeout(flashTimer);
  requestAnimationFrame(() => {
    flash.value = true;
    flashTimer = window.setTimeout(() => (flash.value = false), 120);
  });
  lastChange.value = `${hhmm()} · ${text}`;
  live.value = `${text}. Actualizado a la vez en el TPV, la carta QR, la tienda online y la app.`;
}

function step(it: (typeof items)[number], delta: number) {
  const next = Math.min(9900, Math.max(100, it.price + delta));
  if (next === it.price) return;
  it.price = next;
  changed4(`${it.name} a ${eur(it.price)}`);
}

function toggle(it: (typeof items)[number]) {
  it.off = !it.off;
  changed4(it.off ? `${it.name}, agotado` : `${it.name}, disponible de nuevo`);
}

function reset() {
  items.forEach((it, i) => {
    it.price = base[i]!.price;
    it.off = false;
  });
  changed4('Carta como estaba');
}

onMounted(() => {
  ready.value = true;
});
</script>

<template>
  <div class="cd" :class="{ 'is-ready': ready }">
    <!-- Backoffice reducido -->
    <div class="cd__office">
      <p class="cd__label"><span>Backoffice</span> <small>donde cambias la carta</small></p>
      <div class="mk cd__panel">
        <div class="mk-topbar">
          <span class="mk-strong">Carta</span>
          <span class="mk-right mk-muted">La Plaza</span>
        </div>
        <ul class="cd__rows" role="list">
          <li v-for="it in items" :key="it.id" class="cd__row">
            <span class="cd__name">
              <b>{{ it.full }}</b>
              <Transition name="t-pop">
                <span v-if="it.off" class="mk-pill is-warn">Agotado</span>
              </Transition>
            </span>
            <span class="cd__price" role="group" :aria-label="`Precio de ${it.full}`">
              <button
                type="button"
                class="cd__step"
                :disabled="!ready"
                :aria-label="`Bajar el precio de ${it.full} 50 céntimos`"
                @click="step(it, -50)"
              >
                −
              </button>
              <Transition enter-active-class="t-flash" leave-active-class="cd-gone">
                <span :key="it.price" class="num cd__value">{{ eur(it.price) }}</span>
              </Transition>
              <button
                type="button"
                class="cd__step"
                :disabled="!ready"
                :aria-label="`Subir el precio de ${it.full} 50 céntimos`"
                @click="step(it, 50)"
              >
                +
              </button>
            </span>
            <button
              type="button"
              role="switch"
              class="cd__switch"
              :aria-checked="it.off"
              :disabled="!ready"
              @click="toggle(it)"
            >
              <span class="cd__track" aria-hidden="true"><span></span></span>
              <span
                >Agotado<span class="sr-only">: {{ it.full }}</span></span
              >
            </button>
          </li>
        </ul>
        <div class="cd__foot">
          <Transition name="cd-in">
            <span :key="lastChange" class="mk-muted">{{
              lastChange || 'Prueba: sube un precio o agota un plato.'
            }}</span>
          </Transition>
          <Transition name="t-fade">
            <button v-if="changed" type="button" class="cd__reset" @click="reset">Deshacer</button>
          </Transition>
        </div>
      </div>
    </div>

    <div class="cd__arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </div>

    <!-- Los cuatro canales -->
    <div class="cd__channels">
      <p class="cd__label"><span>Se actualiza solo en</span> <small>sin tocar nada más</small></p>
      <ul class="cd__grid" role="list">
        <li
          v-for="c in channels"
          :key="c.id"
          class="cd__ch"
          :class="[`is-${c.id}`, { 'is-flash': flash }]"
        >
          <p class="cd__ch-head">
            <b>{{ c.label }}</b>
            <span v-if="'soon' in c" class="chip is-status">En camino</span>
          </p>
          <div class="mk cd__mini" aria-hidden="true">
            <!-- TPV: botones de producto -->
            <div v-if="c.id === 'tpv'" class="cd__tiles">
              <span v-for="it in items" :key="it.id" class="mk-tile" :class="{ 'is-off': it.off }">
                {{ it.name }}
                <Transition enter-active-class="t-flash" leave-active-class="cd-gone">
                  <span :key="it.off ? 'off' : it.price" class="num">{{
                    it.off ? 'Agotado' : eur(it.price, false)
                  }}</span>
                </Transition>
              </span>
            </div>
            <!-- Carta QR: lista con precio -->
            <div v-else-if="c.id === 'carta'" class="cd__list">
              <div v-for="it in items" :key="it.id" class="mk-row" :class="{ 'is-off': it.off }">
                <span class="grow"
                  >{{ it.name }}<span class="sub">{{ it.off ? 'Agotado hoy' : it.al }}</span></span
                >
                <Transition enter-active-class="t-flash" leave-active-class="cd-gone">
                  <span :key="it.price" class="num">{{ eur(it.price) }}</span>
                </Transition>
              </div>
            </div>
            <!-- Tienda online: con botón de añadir -->
            <div v-else-if="c.id === 'tienda'" class="cd__list">
              <div v-for="it in items" :key="it.id" class="mk-row" :class="{ 'is-off': it.off }">
                <span class="grow"
                  >{{ it.name
                  }}<Transition enter-active-class="t-flash" leave-active-class="cd-gone"
                    ><span :key="it.price" class="sub num">{{ eur(it.price) }}</span></Transition
                  ></span
                >
                <span class="mk-btn" :class="{ 'is-dark': !it.off }">{{
                  it.off ? 'No disponible' : 'Añadir'
                }}</span>
              </div>
            </div>
            <!-- App propia: tarjetas -->
            <div v-else class="cd__cards">
              <span v-for="it in items" :key="it.id" class="cd__card" :class="{ 'is-off': it.off }">
                <span class="cd__img"></span>
                <span class="mk-strong">{{ it.name }}</span>
                <Transition enter-active-class="t-flash" leave-active-class="cd-gone">
                  <span :key="it.off ? 'off' : it.price" class="num">{{
                    it.off ? 'Agotado' : eur(it.price)
                  }}</span>
                </Transition>
              </span>
            </div>
          </div>
          <p class="sr-only">
            {{ c.label }}:
            {{ items.map((it) => `${it.full} ${it.off ? 'agotado' : eur(it.price)}`).join(', ') }}
          </p>
        </li>
      </ul>
    </div>

    <div class="cd__close">
      <p>
        Esto es lo que significa <b>un solo sistema</b>: no hay que sincronizar nada. Lo cambias una
        vez y lo ve el camarero, el cliente en la mesa y quien pide desde casa. ¿Quieres verlo con
        tu carta?
      </p>
      <a :href="href" class="link-arrow">Solicitar demo <span aria-hidden="true">→</span></a>
    </div>
    <p class="sr-only" role="status" aria-live="polite">{{ live }}</p>
  </div>
</template>

<style scoped>
.cd {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1.25fr);
  grid-template-areas:
    'office arrow channels'
    'close close close';
  gap: var(--space-6) var(--space-6);
  align-items: center;
}
.cd svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.cd__office {
  grid-area: office;
  display: grid;
  gap: var(--space-3);
}
.cd__channels {
  grid-area: channels;
  display: grid;
  gap: var(--space-3);
}
.cd__arrow {
  grid-area: arrow;
  color: var(--color-text-muted);
}
.cd__close {
  grid-area: close;
  display: grid;
  gap: var(--space-2);
  justify-items: start;
  max-width: 44rem;
  font-size: var(--text-md);
}
.cd__label {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-weight: var(--weight-semibold);
}
.cd__label small {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-regular);
  color: var(--color-text-muted);
}
.cd .mk {
  --mk-fs: 12.5px;
  user-select: auto;
}
.cd__panel {
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-device);
}
.cd__rows {
  padding: 4px 14px;
}
.cd__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--gray-150);
}
.cd__row:last-child {
  border-bottom: 0;
}
.cd__name {
  display: grid;
  gap: 3px;
  justify-items: start;
}
.cd__name b {
  font-weight: 500;
}
.cd__price {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.cd__value {
  min-width: 4.5rem;
  text-align: center;
  font-weight: 600;
}
.cd__step {
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  background: var(--white);
  font: inherit;
  font-size: 15px;
  cursor: pointer;
}
.cd__step:hover:not(:disabled) {
  border-color: var(--black);
}
.cd__switch {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 2.25rem;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  cursor: pointer;
}
.cd__track {
  width: 30px;
  height: 18px;
  padding: 2px;
  border-radius: 999px;
  background: var(--gray-300);
  transition: background-color var(--dur) var(--ease);
}
.cd__track span {
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: var(--white);
  transition: translate var(--dur) var(--ease);
}
.cd__switch[aria-checked='true'] .cd__track {
  background: var(--black);
}
.cd__switch[aria-checked='true'] .cd__track span {
  translate: 12px 0;
}
.cd button:disabled {
  opacity: 0.5;
  cursor: default;
}
.cd__foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  min-height: 2.75rem;
  padding: 6px 14px;
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
}
.cd__reset {
  padding: 4px 0;
  border: 0;
  background: none;
  font: inherit;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
}

.cd__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}
.cd__ch {
  display: grid;
  gap: var(--space-2);
  align-content: start;
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--white);
  transition: background-color var(--dur-slow) var(--ease);
}
.cd__ch.is-flash {
  background: var(--gray-100);
  transition: none;
}
.cd__ch-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
}
.cd__ch-head b {
  font-weight: var(--weight-medium);
}
.cd__mini {
  --mk-fs: 10.5px !important;
  background: transparent;
}
.cd__tiles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
}
.cd__tiles .mk-tile {
  min-height: 52px;
  background: var(--white);
}
.cd__tiles .mk-tile.is-off {
  text-decoration: none;
}
.cd__list .mk-row {
  padding: 5px 0;
}
.cd__list .is-off {
  opacity: 0.45;
}
.cd__list .mk-btn {
  padding: 3px 7px;
  font-size: 9.5px;
}
.cd__cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
}
.cd__card {
  display: grid;
  gap: 2px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--gray-150);
}
.cd__card.is-off {
  opacity: 0.45;
}
.cd__img {
  display: block;
  height: 26px;
  border-radius: 5px;
  background: var(--gray-100);
}

@media (max-width: 960px) {
  .cd {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'office' 'arrow' 'channels' 'close';
  }
  .cd__arrow {
    justify-self: center;
    rotate: 90deg;
  }
}
@media (max-width: 520px) {
  .cd__row {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .cd__switch {
    grid-column: 1 / -1;
  }
  .cd__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* ── Movimiento ── */
/* Lo agotado se apaga y vuelve con suavidad en todos los canales */
.cd__list .mk-row,
.cd__card,
.cd__tiles .mk-tile {
  transition: opacity var(--dur) var(--ease);
}
.cd__list .mk-btn {
  transition:
    background-color var(--dur) var(--ease),
    color var(--dur) var(--ease),
    border-color var(--dur) var(--ease);
}
/* Cifra sustituida: la anterior se retira al instante y la nueva entra con destello (t-flash) */
.cd-gone {
  display: none;
}
/* Texto del último cambio */
.cd-in-enter-active {
  transition:
    opacity var(--dur) var(--ease),
    translate var(--dur) var(--ease);
}
.cd-in-enter-from {
  opacity: 0;
  translate: 0 4px;
}
.cd-in-leave-active {
  display: none;
}
</style>
