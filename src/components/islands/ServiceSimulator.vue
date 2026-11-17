<script setup lang="ts">
/**
 * D1 · Simulador del servicio (docs/auditoria/10). Tres pantallas del mismo sistema,
 * sincronizadas, con la carta de La Plaza (`src/data/demo.ts`):
 *
 *  1. Comandero: mesa 7, añades platos (el entrecot pide el punto) y «Enviar a cocina».
 *  2. Cocina: la comanda entra con temporizador acelerado ×20; «Listo» la pasa a «Para recoger» y
 *     el comandero recibe el aviso «Mesa 7 lista».
 *  3. Caja: la mesa 7 pasa a pendiente de cobro; se divide por comensales y se cobra.
 *  4. Números de hoy: la venta suma al momento (ventas, tickets, ticket medio, más vendidos).
 *
 * La guía de pasos marca el progreso y permite saltar (completa lo anterior con una comanda de
 * ejemplo). En pantallas estrechas, una pantalla cada vez con pestañas y un punto de «novedad».
 * Admite `?comanda=` (viene de la carta QR, `encodeOrder()`) y `?pantalla=` (pestaña inicial).
 *
 * Reutilizable: la home (fase 7) lo monta igual, con otro `origen`. Sin backend, sin cookies, sin
 * almacenamiento. Sin JavaScript se ven las tres pantallas en su estado inicial.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import {
  KITCHEN_LATE,
  KITCHEN_SPEED,
  categories,
  clock,
  decodeOrder,
  demoVenue,
  dishes,
  eur,
  kitchenBacklog,
  modsText,
  salesToday,
  sampleOrder,
  tableStateLabels,
  tables,
  type Dish,
  type OrderLineSeed,
  type TableState,
} from '@/data/demo';
import { ctaHref } from '@/lib/cta';
import { markDemoDone } from '@/lib/attribution';
import { useTweened } from '@/lib/tween';

const props = withDefaults(defineProps<{ origen?: string; readUrl?: boolean }>(), {
  origen: 'demo-simulador',
  readUrl: true,
});

type Screen = 'comandero' | 'cocina' | 'caja' | 'numeros';
interface Line {
  id: number;
  dish: string;
  qty: number;
  mods: Record<string, string>;
  /** Nota del cliente (llega desde la carta QR) */
  note?: string;
  done: boolean;
}

const screens: { id: Screen; label: string; step: number }[] = [
  { id: 'comandero', label: 'Comandero', step: 1 },
  { id: 'cocina', label: 'Cocina', step: 2 },
  { id: 'caja', label: 'Caja', step: 3 },
  { id: 'numeros', label: 'Números', step: 4 },
];
const steps = [
  { n: 1, label: 'Toma la comanda', screen: 'comandero' as Screen },
  { n: 2, label: 'Cocina la prepara', screen: 'cocina' as Screen },
  { n: 3, label: 'Cobra', screen: 'caja' as Screen },
  { n: 4, label: 'Mira los números', screen: 'numeros' as Screen },
];
const TABLE = demoVenue.table;
const menuCats = categories.filter((c) => c.id !== 'menu');
const dishById = (id: string) => dishes.find((d) => d.id === id)!;

/* ── Estado ── */
const ready = ref(false);
const narrow = ref(false);
const tab = ref<Screen>('comandero');
const fresh = reactive<Record<Screen, boolean>>({
  comandero: false,
  cocina: false,
  caja: false,
  numeros: false,
});
const live = ref('');
const now = ref(0);
let started = 0;
let timer: number | undefined;
let lineId = 0;

const cat = ref(menuCats[0]?.id ?? 'picar');
const draft = ref<Line[]>([]);
const picking = ref<Dish | null>(null);
const picked = ref<Record<string, string>>({});

interface Ticket {
  lines: Line[];
  source: 'comandero' | 'qr';
  sentAt: number;
  status: 'cocina' | 'listo';
  number: number;
}
const ticket = ref<Ticket | null>(null);
const backlog = reactive({
  ...kitchenBacklog,
  lines: kitchenBacklog.lines.map((l) => ({ ...l })),
  status: 'cocina' as 'cocina' | 'listo',
});
const readyNotice = ref(false);
const shake = ref(false);

const pay = reactive({
  open: false,
  split: 1,
  paid: 0,
  method: 'tarjeta' as 'tarjeta' | 'efectivo',
});
const closed = ref<{ number: number; total: number } | null>(null);
const sales = reactive({
  total: salesToday.total,
  tickets: salesToday.tickets,
  top: { ...salesToday.top },
});
const flash = ref(false);

/* ── Derivados ── */
/** Modificadores y nota de una línea, para cocina y caja */
const detail = (l: Line) =>
  [modsText(dishById(l.dish), l.mods), l.note].filter(Boolean).join(' · ');
const lineTotal = (l: Line) => dishById(l.dish).price * l.qty;
const draftTotal = computed(() => draft.value.reduce((n, l) => n + lineTotal(l), 0));
const draftCount = computed(() => draft.value.reduce((n, l) => n + l.qty, 0));
const ticketTotal = computed(() =>
  ticket.value ? ticket.value.lines.reduce((n, l) => n + lineTotal(l), 0) : 0
);
const kitchenLines = computed(() =>
  ticket.value ? ticket.value.lines.filter((l) => dishById(l.dish).station !== 'barra') : []
);
const barLines = computed(() =>
  ticket.value ? ticket.value.lines.filter((l) => dishById(l.dish).station === 'barra') : []
);
const elapsed = (sentAt: number, base = 0) =>
  base + Math.max(0, ((now.value || sentAt) - sentAt) / 1000) * KITCHEN_SPEED;
const ticketElapsed = computed(() => (ticket.value ? elapsed(ticket.value.sentAt) : 0));
const backlogElapsed = computed(() => elapsed(started, kitchenBacklog.elapsed));

const mesa7 = computed<TableState>(() => {
  if (closed.value || !ticket.value) return 'libre';
  return ticket.value.status === 'listo' ? 'cuenta' : 'ocupada';
});
const floor = computed(() =>
  tables.map((t) =>
    t.n === TABLE
      ? {
          ...t,
          state: mesa7.value,
          note:
            mesa7.value === 'ocupada'
              ? 'En cocina'
              : mesa7.value === 'cuenta'
                ? 'Cobrar'
                : undefined,
        }
      : t
  )
);

const done = computed<Record<number, boolean>>(() => ({
  1: Boolean(ticket.value),
  2: ticket.value?.status === 'listo',
  3: Boolean(closed.value),
  4: Boolean(closed.value),
}));
const current = computed(() => (!done.value[1] ? 1 : !done.value[2] ? 2 : !done.value[3] ? 3 : 4));
// El formulario de demo envía «demo_completada» si el visitante llegó a cobrar la mesa
watch(
  () => done.value[3],
  (v) => {
    if (v) markDemoDone('simulador');
  }
);

const parts = computed(() => {
  const total = ticketTotal.value;
  const base = Math.floor(total / pay.split);
  return Array.from({ length: pay.split }, (_, i) =>
    i === pay.split - 1 ? total - base * (pay.split - 1) : base
  );
});
const avg = computed(() => Math.round(sales.total / sales.tickets));
const top3 = computed(() =>
  Object.entries(sales.top)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, n]) => ({ name: dishById(id)?.short ?? id, n }))
);
const ctaDemo = computed(() => ctaHref({ to: 'demo', origen: props.origen }));

/* ── Movimiento (solo presentación: no toca el flujo) ── */
// Cifras que cambian con suavidad; se muestran redondeadas a céntimos o unidades
const draftShown = useTweened(draftTotal);
const partShown = useTweened(() => parts.value[pay.paid] ?? 0);
const salesShown = useTweened(() => sales.total);
const ticketsShown = useTweened(() => sales.tickets);
const avgShown = useTweened(avg);
// Sentido del cambio de pestaña (en estrecho): la pantalla nueva entra desde ese lado
const stepDir = ref(16);
watch(tab, (to, from) => {
  const i = (s: Screen) => screens.findIndex((x) => x.id === s);
  stepDir.value = i(to) >= i(from) ? 16 : -16;
});
/**
 * Al salir de una lista animada, el elemento se queda fijo donde estaba (absoluto) mientras se
 * desvanece, para que los demás se recoloquen con suavidad en vez de saltar al final.
 */
function pinLeave(el: Element) {
  const e = el as HTMLElement;
  const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = e;
  Object.assign(e.style, {
    position: 'absolute',
    top: `${offsetTop}px`,
    left: `${offsetLeft}px`,
    width: `${offsetWidth}px`,
    height: `${offsetHeight}px`,
    margin: '0',
    boxSizing: 'border-box',
  });
}

/* ── Avisos ── */
function say(msg: string) {
  live.value = msg;
}
function mark(...targets: Screen[]) {
  for (const s of targets) if (!narrow.value || s !== tab.value) fresh[s] = true;
}

/* ── Comandero ── */
function addDish(d: Dish) {
  if (d.soldOut) return;
  const required = (d.modifiers ?? []).filter((m) => m.required);
  if (required.length) {
    picking.value = d;
    picked.value = {};
    nextTick(() => document.getElementById('sim-pick-title')?.focus());
    return;
  }
  const mods = Object.fromEntries((d.modifiers ?? []).map((m) => [m.id, m.options[0]!.id]));
  pushDraft(d.id, mods);
}
function pick(modId: string, optId: string) {
  if (!picking.value) return;
  picked.value[modId] = optId;
  const required = (picking.value.modifiers ?? []).filter((m) => m.required);
  if (required.every((m) => picked.value[m.id])) {
    const d = picking.value;
    pushDraft(d.id, { ...picked.value });
    picking.value = null;
    nextTick(() => document.getElementById(`sim-add-${d.id}`)?.focus());
  }
}
function pushDraft(dish: string, mods: Record<string, string>) {
  const key = JSON.stringify(mods);
  const found = draft.value.find((l) => l.dish === dish && JSON.stringify(l.mods) === key);
  if (found) found.qty++;
  else draft.value.push({ id: ++lineId, dish, qty: 1, mods, done: false });
  const d = dishById(dish);
  say(
    `${d.short}${modsText(d, mods) ? `, ${modsText(d, mods)}` : ''}: añadido a la mesa ${TABLE}.`
  );
}
function minus(l: Line) {
  l.qty--;
  if (l.qty <= 0) draft.value = draft.value.filter((x) => x !== l);
}

function send(source: 'comandero' | 'qr' = 'comandero', seed?: OrderLineSeed[]) {
  const lines: Line[] = seed
    ? seed.map((s) => ({
        id: ++lineId,
        dish: s.dish,
        qty: s.qty,
        mods: s.mods ?? {},
        note: s.note,
        done: false,
      }))
    : draft.value.map((l) => ({ ...l }));
  if (!lines.length) return;
  ticket.value = {
    lines,
    source,
    sentAt: Date.now(),
    status: 'cocina',
    number: salesToday.tickets + 1,
  };
  draft.value = [];
  picking.value = null;
  readyNotice.value = false;
  closed.value = null;
  pay.open = false;
  pay.paid = 0;
  mark('cocina', 'caja');
  say(`Comanda de la mesa ${TABLE} enviada: ya está en la pantalla de cocina y en la caja.`);
}

/* ── Cocina ── */
function toggleLine(l: { done: boolean }) {
  l.done = !l.done;
}
function kitchenReady() {
  if (!ticket.value) return;
  ticket.value.status = 'listo';
  ticket.value.lines.forEach((l) => (l.done = true));
  readyNotice.value = true;
  shake.value = true;
  window.setTimeout(() => (shake.value = false), 700);
  try {
    navigator.vibrate?.(120);
  } catch {
    /* sin vibración */
  }
  mark('comandero', 'caja');
  say(`Mesa ${TABLE} lista: el comandero recibe el aviso y la caja la pasa a pendiente de cobro.`);
}
function backlogReady() {
  backlog.status = 'listo';
  backlog.lines.forEach((l) => (l.done = true));
  say('Mesa 4 lista para recoger en el pase.');
}

/* ── Caja ── */
function openPay() {
  pay.open = true;
  pay.paid = 0;
  nextTick(() => document.getElementById('sim-pay-title')?.focus());
}
function payPart() {
  pay.paid++;
  if (pay.paid < pay.split) {
    say(`Parte ${pay.paid} de ${pay.split} cobrada.`);
    return;
  }
  closeSale();
}
function closeSale() {
  if (!ticket.value) return;
  const total = ticketTotal.value;
  sales.total += total;
  sales.tickets += 1;
  for (const l of ticket.value.lines) sales.top[l.dish] = (sales.top[l.dish] ?? 0) + l.qty;
  closed.value = { number: ticket.value.number, total };
  pay.open = false;
  readyNotice.value = false;
  flash.value = true;
  window.setTimeout(() => (flash.value = false), 900);
  mark('numeros');
  say(`Mesa ${TABLE} cobrada: ${eur(total)}. La venta ya suma en los números de hoy.`);
}

/* ── Guía de pasos ── */
function goStep(n: number) {
  if (n >= 2 && !done.value[1]) send('comandero', draft.value.length ? draft.value : sampleOrder);
  if (n >= 3 && !done.value[2]) kitchenReady();
  if (n >= 4 && !done.value[3]) {
    pay.split = 1;
    closeSale();
  }
  show(steps[n - 1]!.screen);
}
function show(s: Screen) {
  tab.value = s;
  fresh[s] = false;
  nextTick(() => document.getElementById(`sim-h-${s}`)?.focus({ preventScroll: !narrow.value }));
}
function restart() {
  draft.value = [];
  picking.value = null;
  ticket.value = null;
  readyNotice.value = false;
  closed.value = null;
  pay.open = false;
  pay.paid = 0;
  pay.split = 1;
  backlog.status = 'cocina';
  backlog.lines = kitchenBacklog.lines.map((l) => ({ ...l }));
  started = Date.now();
  sales.total = salesToday.total;
  sales.tickets = salesToday.tickets;
  sales.top = { ...salesToday.top };
  (Object.keys(fresh) as Screen[]).forEach((k) => (fresh[k] = false));
  show('comandero');
  say('Simulador reiniciado: la mesa 7 está libre.');
}

function onTabKey(e: KeyboardEvent, i: number) {
  const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
  if (!dir) return;
  e.preventDefault();
  const next = screens[(i + dir + screens.length) % screens.length]!;
  show(next.id);
  nextTick(() => document.getElementById(`sim-tab-${next.id}`)?.focus());
}

/* ── Ciclo de vida ── */
let mq: MediaQueryList | null = null;
const onMq = () => (narrow.value = Boolean(mq?.matches));

onMounted(() => {
  started = Date.now();
  now.value = started;
  try {
    mq = window.matchMedia('(max-width: 900px)');
    onMq();
    mq.addEventListener('change', onMq);
  } catch {
    narrow.value = false;
  }
  if (props.readUrl) {
    const q = new URLSearchParams(window.location.search);
    const pantalla = q.get('pantalla');
    if (pantalla && screens.some((s) => s.id === pantalla)) tab.value = pantalla as Screen;
    const raw = q.get('comanda');
    if (raw) {
      const seed = decodeOrder(raw);
      if (seed.length) {
        send('qr', seed);
        tab.value = 'cocina';
        fresh.cocina = false;
        say(
          'Ha llegado un pedido desde la carta QR de la mesa 7: míralo en la pantalla de cocina.'
        );
      }
    }
  }
  timer = window.setInterval(() => {
    if (document.visibilityState === 'visible') now.value = Date.now();
  }, 500);
  ready.value = true;
});
onBeforeUnmount(() => {
  window.clearInterval(timer);
  mq?.removeEventListener('change', onMq);
});

const panelAttrs = (s: Screen) =>
  narrow.value && ready.value
    ? {
        role: 'tabpanel',
        id: `sim-panel-${s}`,
        'aria-labelledby': `sim-tab-${s}`,
        hidden: tab.value !== s,
      }
    : {};
</script>

<template>
  <div
    class="sim"
    :class="{ 'is-ready': ready, 'is-narrow': narrow && ready }"
    :style="{ '--step-dir': `${stepDir}px` }"
  >
    <!-- Guía de pasos -->
    <div class="sim__guide">
      <ol class="sim__steps" role="list">
        <li v-for="s in steps" :key="s.n">
          <button
            type="button"
            class="sim__step"
            :class="{ 'is-done': done[s.n], 'is-current': current === s.n && !done[s.n] }"
            :aria-current="current === s.n ? 'step' : undefined"
            :disabled="!ready"
            @click="goStep(s.n)"
          >
            <span class="sim__step-n" aria-hidden="true">
              <svg v-if="done[s.n]" viewBox="0 0 24 24" width="14" height="14">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <template v-else>{{ s.n }}</template>
            </span>
            <span>{{ s.label }}</span>
            <span v-if="done[s.n]" class="sr-only">(hecho)</span>
          </button>
        </li>
      </ol>
      <button type="button" class="sim__restart" :disabled="!ready" @click="restart">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Reiniciar
      </button>
    </div>

    <p v-if="!ready" class="sim__nojs">
      Así se ve un momento del servicio en La Plaza, un restaurante ficticio. Con JavaScript
      activado puedes tomar tú la comanda y seguirla hasta la caja.
    </p>

    <!-- Pestañas (solo en pantallas estrechas) -->
    <div
      v-if="narrow && ready"
      class="sim__tabs"
      role="tablist"
      aria-label="Pantallas del simulador"
    >
      <button
        v-for="(s, i) in screens"
        :id="`sim-tab-${s.id}`"
        :key="s.id"
        type="button"
        role="tab"
        class="sim__tab"
        :aria-selected="tab === s.id"
        :aria-controls="`sim-panel-${s.id}`"
        :tabindex="tab === s.id ? 0 : -1"
        @click="show(s.id)"
        @keydown="onTabKey($event, i)"
      >
        {{ s.label }}
        <Transition name="t-pop">
          <span v-if="fresh[s.id]" class="sim__dot"><span class="sr-only">(novedad)</span></span>
        </Transition>
      </button>
    </div>

    <div class="sim__stage">
      <!-- 1 · Comandero -->
      <section class="sim__panel is-comandero" v-bind="panelAttrs('comandero')">
        <h3 :id="`sim-h-comandero`" class="sim__label" tabindex="-1">
          <span>Comandero</span> <small>móvil del camarero</small>
        </h3>
        <div class="sim__phone" :class="{ 'is-shake': shake }">
          <div class="mk sim__cmd">
            <div class="sim__cmd-head">
              <span class="mk-muted">‹ Sala</span>
              <span class="mk-strong">Mesa {{ TABLE }} · 4 pax</span>
            </div>
            <Transition name="sim-note">
              <div v-if="readyNotice" key="lista" class="sim__notice" role="note">
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span
                  ><b>Mesa {{ TABLE }} lista</b> · recoger en el pase</span
                >
              </div>
              <div
                v-else-if="ticket && !closed"
                key="cocina"
                class="sim__notice is-soft"
                role="note"
              >
                <span>{{
                  ticket.source === 'qr'
                    ? 'Pedido desde la carta QR · en cocina'
                    : 'Comanda enviada · en cocina'
                }}</span>
              </div>
            </Transition>

            <div class="sim__cats" role="group" aria-label="Categorías de la carta">
              <button
                v-for="c in menuCats"
                :key="c.id"
                type="button"
                class="mk-tab"
                :class="{ 'is-on': cat === c.id }"
                :aria-pressed="cat === c.id"
                :disabled="!ready"
                @click="cat = c.id"
              >
                {{ c.label.es }}
              </button>
            </div>

            <Transition name="sim-swap">
              <div v-if="picking" key="pick" class="sim__pick">
                <p id="sim-pick-title" class="mk-strong" tabindex="-1">
                  {{ picking.short }} · {{ picking.modifiers?.find((m) => m.required)?.label.es }}
                </p>
                <p class="mk-muted">Obligatorio: cocina necesita saberlo.</p>
                <template v-for="m in picking.modifiers?.filter((x) => x.required)" :key="m.id">
                  <div class="sim__pick-opts" role="group" :aria-label="m.label.es">
                    <button
                      v-for="o in m.options"
                      :key="o.id"
                      type="button"
                      class="mk-btn"
                      :class="{ 'is-dark': picked[m.id] === o.id }"
                      @click="pick(m.id, o.id)"
                    >
                      {{ o.label.es }}
                    </button>
                  </div>
                </template>
                <button type="button" class="sim__textbtn" @click="picking = null">Cancelar</button>
              </div>

              <ul v-else :key="cat" class="sim__menu" role="list">
                <li
                  v-for="d in dishes.filter((x) => x.category === cat)"
                  :key="d.id"
                  class="mk-row"
                  :class="{ 'is-off': d.soldOut }"
                >
                  <span class="grow">
                    {{ d.short }}
                    <span class="sub"
                      >{{ eur(d.price)
                      }}{{ d.modifiers?.some((m) => m.required) ? ' · elige punto' : '' }}</span
                    >
                  </span>
                  <span v-if="d.soldOut" class="mk-pill is-warn">Agotado</span>
                  <button
                    v-else
                    :id="`sim-add-${d.id}`"
                    type="button"
                    class="sim__add"
                    :aria-label="`Añadir ${d.short}`"
                    :disabled="!ready"
                    @click="addDish(d)"
                  >
                    +
                  </button>
                </li>
              </ul>
            </Transition>

            <div class="sim__cmd-foot">
              <TransitionGroup
                v-if="draft.length"
                tag="ul"
                name="t-list"
                class="sim__draft"
                role="list"
                aria-label="Comanda de la mesa 7"
                @before-leave="pinLeave"
              >
                <li v-for="l in draft" :key="l.id">
                  <button
                    type="button"
                    class="sim__minus"
                    :aria-label="`Quitar un ${dishById(l.dish).short}`"
                    @click="minus(l)"
                  >
                    −
                  </button>
                  <span class="num">{{ l.qty }}</span>
                  <span class="grow">
                    {{ dishById(l.dish).short
                    }}<small v-if="modsText(dishById(l.dish), l.mods)">
                      · {{ modsText(dishById(l.dish), l.mods) }}</small
                    >
                  </span>
                </li>
              </TransitionGroup>
              <div class="mk-row">
                <span class="grow mk-muted"
                  >{{ draftCount }} {{ draftCount === 1 ? 'artículo' : 'artículos' }}</span
                >
                <span class="num mk-strong">{{ eur(Math.round(draftShown)) }}</span>
              </div>
              <button
                type="button"
                class="mk-btn is-dark is-block sim__send"
                :disabled="!ready || !draft.length"
                @click="send()"
              >
                Enviar a cocina
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 2 · Cocina -->
      <section class="sim__panel is-cocina" v-bind="panelAttrs('cocina')">
        <h3 :id="`sim-h-cocina`" class="sim__label" tabindex="-1">
          <span>Cocina</span> <small>pantalla del pase</small>
        </h3>
        <div class="sim__screen mk">
          <div class="mk-topbar">
            <span class="mk-strong">Pase</span>
            <span class="mk-right mk-muted">Reloj ×{{ KITCHEN_SPEED }}</span>
          </div>
          <div class="sim__kds">
            <p class="sim__col-title mk-muted">En preparación</p>
            <TransitionGroup tag="div" name="t-list" class="sim__cards" @before-leave="pinLeave">
              <article
                v-if="ticket && ticket.status === 'cocina'"
                key="mesa"
                class="sim__card is-new"
              >
                <header>
                  <span class="mk-strong"
                    >Mesa {{ TABLE
                    }}<span class="sim__src">
                      · {{ ticket.source === 'qr' ? 'QR' : 'Comandero' }}</span
                    ></span
                  >
                  <span
                    class="num mk-pill"
                    :class="ticketElapsed >= KITCHEN_LATE ? 'is-danger' : 'is-ok'"
                    >{{ clock(ticketElapsed) }}</span
                  >
                </header>
                <ul role="list">
                  <li v-for="l in kitchenLines" :key="l.id">
                    <button
                      type="button"
                      class="sim__check"
                      :aria-pressed="l.done"
                      @click="toggleLine(l)"
                    >
                      <span class="mk-check" :class="{ 'is-on': l.done }" aria-hidden="true"></span>
                      <span class="grow">
                        {{ l.qty }} {{ dishById(l.dish).short }}
                        <span v-if="detail(l)" class="sub">{{ detail(l) }}</span>
                      </span>
                    </button>
                  </li>
                </ul>
                <p v-if="barLines.length" class="sim__bar-note mk-muted">
                  + {{ barLines.reduce((n, l) => n + l.qty, 0) }} bebida(s): van a barra
                </p>
                <button type="button" class="mk-btn is-dark is-block" @click="kitchenReady">
                  Listo
                </button>
              </article>
              <article
                v-if="backlog.status === 'cocina'"
                key="backlog"
                class="sim__card"
                :class="{ 'is-late': backlogElapsed >= KITCHEN_LATE }"
              >
                <header>
                  <span class="mk-strong">{{ backlog.label }}</span>
                  <span
                    class="num mk-pill"
                    :class="backlogElapsed >= KITCHEN_LATE ? 'is-danger' : ''"
                    >{{ clock(backlogElapsed) }}</span
                  >
                </header>
                <ul role="list">
                  <li v-for="(l, i) in backlog.lines" :key="i">
                    <button
                      type="button"
                      class="sim__check"
                      :aria-pressed="l.done"
                      :disabled="!ready"
                      @click="toggleLine(l)"
                    >
                      <span class="mk-check" :class="{ 'is-on': l.done }" aria-hidden="true"></span>
                      <span class="grow">
                        {{ l.qty }} {{ l.name }}
                        <span v-if="l.note" class="sub">{{ l.note }}</span>
                      </span>
                    </button>
                  </li>
                </ul>
                <button
                  type="button"
                  class="mk-btn is-block"
                  :disabled="!ready"
                  @click="backlogReady"
                >
                  Listo
                </button>
              </article>
              <p v-if="!ticket && ready" key="vacio" class="sim__empty mk-muted">
                La comanda de la mesa {{ TABLE }} aparecerá aquí en cuanto la envíes desde el
                comandero.
              </p>
            </TransitionGroup>
            <p class="sim__col-title mk-muted">Para recoger</p>
            <TransitionGroup
              tag="ul"
              name="t-list"
              class="sim__pickup"
              role="list"
              @before-leave="pinLeave"
            >
              <li v-if="ticket && ticket.status === 'listo'" key="mesa" class="mk-row">
                <span class="grow mk-strong">Mesa {{ TABLE }}</span>
                <span class="mk-pill is-ok">Avisado</span>
              </li>
              <li v-if="backlog.status === 'listo'" key="backlog" class="mk-row">
                <span class="grow mk-strong">{{ backlog.label }}</span>
                <span class="mk-pill is-ok">Avisado</span>
              </li>
              <li
                v-if="!(ticket && ticket.status === 'listo') && backlog.status !== 'listo'"
                key="nada"
                class="mk-row mk-muted"
              >
                Nada esperando en el pase.
              </li>
            </TransitionGroup>
          </div>
        </div>
      </section>

      <!-- 3 · Caja -->
      <section class="sim__panel is-caja" v-bind="panelAttrs('caja')">
        <h3 :id="`sim-h-caja`" class="sim__label" tabindex="-1">
          <span>Caja</span> <small>TPV de la barra</small>
        </h3>
        <div class="sim__screen mk">
          <div class="mk-topbar">
            <span class="mk-strong">Sala</span>
            <span class="mk-right"
              ><span class="mk-pill is-ok"><i class="mk-dot"></i> Conectado</span></span
            >
          </div>
          <div class="sim__tpv">
            <ul class="sim__floor" role="list" aria-label="Plano de sala">
              <li
                v-for="t in floor"
                :key="t.n"
                class="sim__table"
                :class="[`is-${t.state}`, { 'is-focus': t.n === TABLE }]"
              >
                <b class="num">{{ t.n }}</b>
                <span>{{ t.note ?? tableStateLabels[t.state] }}</span>
                <span class="sr-only">Mesa {{ t.n }}: {{ tableStateLabels[t.state] }}</span>
              </li>
            </ul>

            <div class="sim__bill">
              <div class="sim__bill-head">
                <span class="mk-strong">Mesa {{ TABLE }}</span>
                <span
                  class="mk-pill"
                  :class="{ 'is-warn': mesa7 === 'cuenta', 'is-dark': mesa7 === 'ocupada' }"
                  >{{ tableStateLabels[mesa7] }}</span
                >
              </div>

              <Transition name="sim-swap">
                <div v-if="closed" key="cerrada" class="sim__bill-body">
                  <p class="sim__closed">
                    <b>Venta cerrada</b> · ticket
                    <span class="num">T-{{ String(closed.number).padStart(4, '0') }}</span> ·
                    <span class="num">{{ eur(closed.total) }}</span>
                  </p>
                  <p class="mk-muted">
                    La mesa {{ TABLE }} vuelve a estar libre y la venta ya está en los números.
                  </p>
                </div>

                <div v-else-if="ticket" key="cuenta" class="sim__bill-body">
                  <ul class="sim__lines" role="list">
                    <li v-for="l in ticket.lines" :key="l.id" class="mk-row">
                      <span class="num mk-muted">{{ l.qty }}</span>
                      <span class="grow">
                        {{ dishById(l.dish).short }}
                        <span v-if="detail(l)" class="sub">{{ detail(l) }}</span>
                      </span>
                      <span class="num">{{ eur(lineTotal(l), false) }}</span>
                    </li>
                  </ul>
                  <div class="sim__sum">
                    <span>Total</span><span class="num">{{ eur(ticketTotal) }}</span>
                  </div>

                  <Transition name="sim-swap">
                    <div v-if="pay.open" key="cobro" class="sim__pay">
                      <p id="sim-pay-title" class="mk-strong" tabindex="-1">
                        Cobrar la mesa {{ TABLE }}
                      </p>
                      <div class="sim__opts" role="group" aria-label="Dividir entre comensales">
                        <span class="mk-muted">Dividir</span>
                        <button
                          v-for="n in [1, 2, 3, 4]"
                          :key="n"
                          type="button"
                          class="mk-btn"
                          :class="{ 'is-dark': pay.split === n }"
                          :aria-pressed="pay.split === n"
                          :disabled="pay.paid > 0"
                          @click="pay.split = n"
                        >
                          {{ n === 1 ? 'No' : n }}
                        </button>
                      </div>
                      <div class="sim__opts" role="group" aria-label="Forma de pago">
                        <span class="mk-muted">Pago</span>
                        <button
                          v-for="m in ['tarjeta', 'efectivo'] as const"
                          :key="m"
                          type="button"
                          class="mk-btn"
                          :class="{ 'is-dark': pay.method === m }"
                          :aria-pressed="pay.method === m"
                          @click="pay.method = m"
                        >
                          {{ m === 'tarjeta' ? 'Tarjeta' : 'Efectivo' }}
                        </button>
                      </div>
                      <button
                        type="button"
                        class="mk-btn is-dark is-block sim__go"
                        @click="payPart"
                      >
                        {{
                          pay.split > 1
                            ? `Cobrar parte ${pay.paid + 1} de ${pay.split} ·`
                            : 'Cobrar ·'
                        }}
                        <span class="num">{{ eur(Math.round(partShown)) }}</span>
                      </button>
                    </div>
                    <div v-else key="cobrar" class="sim__bill-body">
                      <button
                        type="button"
                        class="mk-btn is-block sim__go"
                        :class="{ 'is-dark': mesa7 === 'cuenta' }"
                        :disabled="mesa7 !== 'cuenta'"
                        @click="openPay"
                      >
                        Cobrar
                      </button>
                      <p v-if="mesa7 !== 'cuenta'" class="mk-muted sim__hint">
                        Se cobra cuando cocina la marque como lista.
                      </p>
                    </div>
                  </Transition>
                </div>

                <p v-else key="libre" class="mk-muted">
                  Libre. La comanda aparecerá aquí sola en cuanto el camarero la envíe.
                </p>
              </Transition>
            </div>
          </div>
        </div>
      </section>

      <!-- 4 · Números -->
      <section class="sim__panel is-numeros" v-bind="panelAttrs('numeros')">
        <h3 :id="`sim-h-numeros`" class="sim__label" tabindex="-1">
          <span>Números de hoy</span> <small>backoffice, al momento</small>
        </h3>
        <div class="sim__nums" :class="{ 'is-flash': flash }">
          <dl class="sim__stats">
            <div>
              <dt>Ventas de hoy</dt>
              <dd class="num">{{ eur(Math.round(salesShown)) }}</dd>
              <Transition name="t-pop">
                <dd v-if="closed" class="sim__delta num">+{{ eur(closed.total) }}</dd>
              </Transition>
            </div>
            <div>
              <dt>Tickets</dt>
              <dd class="num">{{ Math.round(ticketsShown) }}</dd>
            </div>
            <div>
              <dt>Ticket medio</dt>
              <dd class="num">{{ eur(Math.round(avgShown)) }}</dd>
            </div>
            <div>
              <dt>Más vendidos</dt>
              <dd>
                <TransitionGroup
                  tag="ol"
                  name="t-list"
                  class="sim__top"
                  role="list"
                  @before-leave="pinLeave"
                >
                  <li v-for="t in top3" :key="t.name">
                    <span>{{ t.name }}</span> <span class="num">{{ t.n }}</span>
                  </li>
                </TransitionGroup>
              </dd>
            </div>
          </dl>
          <Transition name="sim-swap">
            <div v-if="closed" key="fin" class="sim__end">
              <p>
                <b>Eso es un solo sistema:</b> nadie ha copiado la comanda ni ha cuadrado nada a
                mano. ¿Quieres verlo con tu carta?
              </p>
              <div class="sim__end-actions">
                <a :href="ctaDemo" class="btn is-primary">Solicitar demo</a>
                <button type="button" class="btn is-secondary" @click="restart">
                  Volver a empezar
                </button>
              </div>
            </div>
            <p v-else key="ficticio" class="sim__fict">
              La Plaza es un restaurante ficticio: sus números son de ejemplo.
            </p>
          </Transition>
        </div>
      </section>
    </div>

    <p class="sr-only" role="status" aria-live="polite">{{ live }}</p>
  </div>
</template>

<style scoped>
.sim {
  display: grid;
  gap: var(--space-6);
}
.sim svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Guía de pasos */
.sim__guide {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3) var(--space-6);
}
.sim__steps {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  counter-reset: none;
}
.sim__step {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 2.5rem;
  padding: 0 var(--space-4) 0 var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--white);
  font: inherit;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
  cursor: pointer;
  transition:
    border-color var(--dur) var(--ease),
    color var(--dur) var(--ease);
}
.sim__step:hover:not(:disabled) {
  border-color: var(--gray-400);
}
.sim__step-n {
  width: 1.6rem;
  height: 1.6rem;
  display: grid;
  place-items: center;
  border-radius: var(--radius-pill);
  background: var(--color-bg-muted);
  font-size: var(--text-xs);
  color: var(--color-text-strong);
  transition:
    background-color var(--dur) var(--ease),
    color var(--dur) var(--ease);
}
.sim__step.is-current {
  border-color: var(--black);
  color: var(--color-text-strong);
}
.sim__step.is-current .sim__step-n,
.sim__step.is-done .sim__step-n {
  background: var(--black);
  color: var(--white);
}
.sim__step.is-done {
  color: var(--color-text-strong);
}
.sim__restart {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 2.5rem;
  padding: 0 var(--space-3);
  border: 0;
  background: none;
  font: inherit;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
  cursor: pointer;
}
.sim__restart:hover {
  text-decoration: underline;
}
.sim__nojs {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* Escenario */
.sim__stage {
  display: grid;
  grid-template-columns: 17.5rem minmax(0, 1fr) minmax(0, 1.08fr);
  grid-template-areas:
    'cmd kds tpv'
    'num num num';
  gap: var(--space-6) var(--space-6);
  align-items: start;
}
.sim__panel.is-comandero {
  grid-area: cmd;
}
.sim__panel.is-cocina {
  grid-area: kds;
}
.sim__panel.is-caja {
  grid-area: tpv;
}
.sim__panel.is-numeros {
  grid-area: num;
}
.sim__panel {
  display: grid;
  gap: var(--space-3);
  min-width: 0;
}
.sim__label {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  font-size: var(--text-base);
  font-family: var(--font-display);
}
.sim__label small {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-regular);
  color: var(--color-text-muted);
}
.sim__label:focus {
  outline: none;
}
.sim__label:focus-visible {
  outline: 2px solid var(--color-focus);
}

/* Las maquetas, a tamaño de uso: letra y botones más grandes que en las maquetas estáticas */
.sim .mk {
  --mk-fs: 12.5px;
  user-select: auto;
}
.sim .mk-btn {
  min-height: 2.25rem;
  font: inherit;
  font-weight: 500;
  cursor: pointer;
}
.sim .mk-btn:disabled {
  opacity: 0.45;
  cursor: default;
}
.sim .mk-tab {
  border: 0;
  background: none;
  font: inherit;
  font-weight: 500;
  min-height: 2rem;
  cursor: pointer;
}
.sim .mk-tab.is-on {
  background: var(--gray-100);
}
.sim .mk-pill {
  font-size: 10.5px;
}
.sim .mk-row .sub {
  font-size: 11px;
}

/* Comandero */
.sim__phone {
  width: 100%;
  max-width: 17.5rem;
  height: 36rem;
  padding: 8px;
  border-radius: 2.2rem;
  background: var(--gray-900);
  box-shadow: var(--shadow-device);
}
.sim__phone.is-shake {
  animation: sim-shake 0.5s linear;
}
@keyframes sim-shake {
  0%,
  100% {
    translate: 0 0;
  }
  20%,
  60% {
    translate: -4px 0;
  }
  40%,
  80% {
    translate: 4px 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sim__phone.is-shake {
    animation: none;
  }
}
.sim__cmd {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 1.75rem;
  overflow: hidden;
  padding-top: 26px;
}
.sim__cmd-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 14px 8px;
  border-bottom: 1px solid var(--gray-150);
}
.sim__notice {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 10px 0;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--black);
  color: var(--white);
}
.sim__notice.is-soft {
  background: var(--gray-100);
  color: var(--gray-700);
}
.sim__cats {
  display: flex;
  gap: 2px;
  padding: 8px 8px 4px;
  flex-wrap: wrap;
  flex: 0 0 auto;
  border-bottom: 1px solid var(--gray-150);
}
.sim__cats .mk-tab {
  flex: 0 0 auto;
  white-space: nowrap;
  padding: 4px 8px;
}
.sim__menu {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 0 14px;
}
.sim__menu .mk-row {
  min-height: 3rem;
}
.sim__menu .is-off {
  opacity: 0.55;
}
.sim__add {
  width: 2.25rem;
  height: 2.25rem;
  flex: 0 0 auto;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  background: var(--white);
  font: inherit;
  font-size: 16px;
  cursor: pointer;
}
.sim__add:hover:not(:disabled) {
  border-color: var(--black);
}
.sim__pick {
  flex: 1 1 auto;
  display: grid;
  align-content: start;
  gap: 8px;
  padding: 10px 14px;
}
.sim__pick p:focus {
  outline: none;
}
.sim__pick-opts {
  display: grid;
  gap: 6px;
}
.sim__textbtn {
  justify-self: start;
  padding: 4px 0;
  border: 0;
  background: none;
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}
.sim__cmd-foot {
  padding: 6px 12px 14px;
  border-top: 1px solid var(--gray-150);
  background: var(--gray-50);
  flex: 0 0 auto;
}
.sim__draft {
  max-height: 6.5rem;
  overflow-y: auto;
  padding: 2px 0 4px;
  display: grid;
  gap: 2px;
}
.sim__draft li {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sim__draft .grow {
  flex: 1 1 auto;
  min-width: 0;
}
.sim__draft small {
  color: var(--gray-500);
}
.sim__minus {
  width: 1.6rem;
  height: 1.6rem;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  background: var(--white);
  font: inherit;
  cursor: pointer;
}
.sim__send {
  min-height: 2.75rem !important;
}

/* Pantallas de navegador (cocina y caja) */
.sim__screen {
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-device);
}

/* Cocina */
.sim__kds {
  padding: 10px;
  background: var(--gray-50);
  min-height: 31rem;
  display: grid;
  align-content: start;
  gap: 8px;
}
.sim__col-title {
  font-size: 10.5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.sim__cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11.5rem, 1fr));
  gap: 8px;
  align-items: start;
}
.sim__card {
  display: grid;
  gap: 6px;
  padding: 8px 10px 10px;
  border: 1px solid var(--gray-200);
  border-radius: 10px;
  background: var(--white);
}
.sim__card.is-new {
  border-color: var(--black);
  box-shadow: 0 0 0 1px var(--black);
}
.sim__card.is-late {
  border-color: var(--color-danger);
}
.sim__card header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--gray-150);
}
.sim__src {
  font-weight: 400;
  color: var(--gray-500);
}
.sim__check {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 5px 0;
  border: 0;
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.sim__check .mk-check {
  margin-top: 2px;
}
.sim__check .sub {
  display: block;
  color: var(--gray-500);
  font-size: 11px;
}
.sim__bar-note {
  font-size: 11px;
}
.sim__empty {
  padding: 18px 12px;
  border: 1px dashed var(--gray-300);
  border-radius: 10px;
  text-align: center;
  line-height: 1.5;
}
.sim__pickup {
  padding: 0 10px;
  border-radius: 10px;
  background: var(--white);
  border: 1px solid var(--gray-200);
}

/* Caja */
.sim__tpv {
  display: grid;
  gap: 10px;
  padding: 10px;
  min-height: 31rem;
  align-content: start;
}
.sim__floor {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
}
.sim__table {
  display: grid;
  gap: 1px;
  padding: 6px 7px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  background: var(--white);
  min-height: 3rem;
  font-size: 10px;
  color: var(--gray-500);
  white-space: nowrap;
  overflow: hidden;
}
.sim__table b {
  font-size: 13px;
  color: var(--black);
}
.sim__table.is-ocupada {
  background: var(--gray-100);
  border-color: var(--gray-100);
}
.sim__table.is-reservada {
  border-style: dashed;
  border-color: var(--gray-400);
}
.sim__table.is-cuenta {
  background: var(--color-warn-soft);
  border-color: var(--color-warn-soft);
  color: var(--color-warn);
}
.sim__table.is-focus {
  box-shadow: 0 0 0 2px var(--black);
}
.sim__bill {
  display: grid;
  gap: 6px;
  padding: 10px 12px 12px;
  border: 1px solid var(--gray-200);
  border-radius: 10px;
}
.sim__bill-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sim__lines {
  max-height: 11rem;
  overflow-y: auto;
}
.sim__sum {
  display: flex;
  justify-content: space-between;
  padding-top: 6px;
  border-top: 1px dashed var(--gray-300);
  font-weight: 600;
  font-size: 14px;
}
.sim__pay {
  display: grid;
  gap: 6px;
  padding-top: 6px;
}
.sim__pay p:focus {
  outline: none;
}
.sim__opts {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}
.sim__opts > span {
  width: 3.5rem;
}
.sim__opts .mk-btn {
  min-width: 2.5rem;
  padding: 6px 10px;
}
.sim__go {
  min-height: 2.75rem !important;
}
.sim__hint {
  font-size: 11px;
}
.sim__closed {
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--color-ok-soft);
  color: var(--color-ok);
}

/* Números */
.sim__nums {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: var(--space-6);
  align-items: center;
  padding: var(--space-5) var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--white);
  transition: background-color var(--dur-slow) var(--ease);
}
.sim__nums.is-flash {
  background: var(--gray-100);
}
.sim__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
  margin: 0;
}
.sim__stats > div {
  display: grid;
  align-content: start;
  gap: 2px;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}
.sim__stats dt {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.sim__stats dd {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  color: var(--color-text-strong);
}
.sim__stats .num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
}
.sim__delta {
  font-size: var(--text-sm) !important;
  font-weight: var(--weight-medium) !important;
  color: var(--color-ok) !important;
}
.sim__top {
  display: grid;
  gap: 2px;
  font-size: var(--text-sm);
  font-weight: var(--weight-regular);
}
.sim__top li {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
}
.sim__end {
  display: grid;
  gap: var(--space-3);
  font-size: var(--text-sm);
}
.sim__end-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.sim__fict {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* Intermedio: comandero + cocina arriba, caja y números debajo */
@media (max-width: 1180px) {
  .sim__stage {
    grid-template-columns: 17.5rem minmax(0, 1fr);
    grid-template-areas:
      'cmd kds'
      'tpv tpv'
      'num num';
  }
  .sim__kds,
  .sim__tpv {
    min-height: 0;
  }
  .sim__tpv {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
  .sim__nums {
    grid-template-columns: 1fr;
  }
}

/* Estrecho: una pantalla cada vez, con pestañas */
.sim__tabs {
  display: flex;
  gap: 2px;
  padding: 3px;
  border-radius: var(--radius-md);
  background: var(--color-bg-muted);
}
.sim__tab {
  position: relative;
  flex: 1 1 0;
  min-height: 2.5rem;
  border: 0;
  border-radius: calc(var(--radius-md) - 3px);
  background: transparent;
  font: inherit;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
  cursor: pointer;
}
.sim__tab[aria-selected='true'] {
  background: var(--white);
  color: var(--color-text-strong);
  box-shadow: var(--shadow-sm);
}
.sim__dot {
  display: inline-block;
  margin-left: 4px;
  vertical-align: 2px;
  width: 7px;
  height: 7px;
  border-radius: var(--radius-pill);
  background: var(--black);
}
@media (max-width: 900px) {
  .sim__stage {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: none;
  }
  .sim__stage > .sim__panel {
    grid-area: auto;
  }
  .sim.is-narrow .sim__panel[hidden] {
    display: none;
  }
  .sim__phone {
    margin-inline: auto;
  }
  .sim__tpv {
    grid-template-columns: 1fr;
  }
  .sim__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .sim__guide {
    justify-content: flex-start;
  }
  .sim__steps {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
  }
  .sim__step {
    width: 100%;
    font-size: var(--text-xs);
  }
}

/* ── Movimiento: todo cambio de estado llega con suavidad ── */
/* Contenedores de listas animadas: lo que sale se fija aquí (pinLeave) */
.sim__draft,
.sim__cards,
.sim__pickup,
.sim__top {
  position: relative;
}
/* Cuenta de la caja: envoltorio neutro (misma rejilla y hueco que .sim__bill) */
.sim__bill-body {
  display: grid;
  gap: 6px;
}
.sim .mk-pill {
  transition:
    background-color var(--dur) var(--ease),
    color var(--dur) var(--ease),
    border-color var(--dur) var(--ease);
}
.sim .mk-check {
  transition:
    background-color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);
}
.sim .mk-check.is-on::after {
  animation: sim-tick var(--dur) var(--ease);
}
@keyframes sim-tick {
  from {
    opacity: 0;
    scale: 0.4;
  }
}
.sim__card {
  transition:
    border-color var(--dur) var(--ease),
    box-shadow var(--dur) var(--ease);
}
.sim__table {
  transition:
    background-color var(--dur) var(--ease),
    border-color var(--dur) var(--ease),
    color var(--dur) var(--ease),
    box-shadow var(--dur) var(--ease);
}
/* En estrecho, la pantalla elegida entra desde el lado de la pestaña (--step-dir) */
@media (max-width: 900px) {
  .sim.is-narrow .sim__panel:not([hidden]) {
    animation: sim-panel-in var(--dur) var(--ease);
  }
}
@keyframes sim-panel-in {
  from {
    opacity: 0;
    translate: var(--step-dir, 16px) 0;
  }
}
/*
 * Contenido que se sustituye dentro de una pantalla de altura fija: entra con fundido y lo que
 * sale desaparece al instante (sin ocupar sitio a la vez ni retrasar el foco que se le pone).
 */
.sim-swap-enter-active {
  transition:
    opacity var(--dur) var(--ease),
    translate var(--dur) var(--ease);
}
.sim-swap-enter-from {
  opacity: 0;
  translate: 0 6px;
}
.sim-swap-leave-active,
.sim-note-leave-active {
  display: none;
}
/* Avisos del comandero («Comanda enviada», «Mesa 7 lista»): aparecen con un pequeño rebote */
.sim-note-enter-active {
  transition:
    opacity var(--dur) var(--ease),
    scale var(--dur) cubic-bezier(0.34, 1.4, 0.64, 1);
}
.sim-note-enter-from {
  opacity: 0;
  scale: 0.94;
}
</style>
