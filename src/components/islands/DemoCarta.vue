<script setup lang="ts">
/**
 * D3 · Carta QR de ejemplo de «La Plaza» (docs/auditoria/10). Carta completa con categorías,
 * alérgenos y filtros, idiomas (ES/EN/FR con textos reales de la demo), menú del día por horario,
 * pedido desde la mesa con modificadores y nota, confirmación con enlace al simulador
 * (`/demo?comanda=…#simulador`) y pago en mesa simulado. Todo sale de `src/data/demo.ts`.
 *
 * Dos modos: `page` (la página /demo/carta, pensada para el móvil del visitante) y `embed` (un
 * móvil dibujado con la misma carta, en /soluciones/carta-qr, para quien no quiera sacar el
 * teléfono). Sin backend ni cookies: el pedido vive en memoria y en `sessionStorage`.
 *
 * Sin JavaScript (o antes de hidratar) se ve la carta entera en español, sin botones de pedido.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  allergens,
  categories,
  demoVenue,
  dietFilters,
  dishes,
  encodeOrder,
  eur,
  modsText,
  store,
  type Dish,
  type Lang,
} from '@/data/demo';
import { ctaHref } from '@/lib/cta';

const props = withDefaults(defineProps<{ mode?: 'page' | 'embed'; origen?: string }>(), {
  mode: 'page',
  origen: 'demo-carta',
});
const isEmbed = props.mode === 'embed';
const uid = isEmbed ? 'dce' : 'dcp';

/* ── Textos de la interfaz, en los tres idiomas de la demo ── */
const ui = {
  es: {
    table: 'Mesa',
    sample: 'Carta de ejemplo',
    lang: 'Idioma',
    filters: 'Alérgenos y dietas',
    filtersHint: 'Oculta los platos que no te van bien.',
    hidden: (n: number) =>
      n === 1 ? '1 plato oculto por tus filtros' : `${n} platos ocultos por tus filtros`,
    clear: 'Quitar filtros',
    soldOut: 'Agotado hoy',
    add: (d: string) => `Añadir ${d}`,
    remove: (d: string) => `Quitar un ${d}`,
    menuWhen: 'De lunes a viernes, de 13:00 a 16:00',
    menuOff: 'El menú del día solo aparece en su horario: de lunes a viernes, de 13:00 a 16:00.',
    menuShow: 'Verlo igualmente',
    waiter: 'Llamar al camarero',
    bill: 'Pedir la cuenta',
    viewOrder: 'Ver pedido',
    items: (n: number) => (n === 1 ? '1 artículo' : `${n} artículos`),
    order: 'Tu pedido',
    note: 'Nota para cocina',
    notePh: 'Sin cebolla, la salsa aparte…',
    required: 'Obligatorio',
    optional: 'Opcional',
    addFor: (p: string) => `Añadir · ${p}`,
    total: 'Total',
    send: 'Pedir a cocina',
    close: 'Cerrar',
    empty: 'Aún no has añadido nada.',
    sentTitle: 'Pedido enviado a cocina',
    sentText: (n: number) => `La cocina ya lo tiene en su pantalla, con la mesa ${n} y tus notas.`,
    seeKitchen: 'Mira cómo lo recibe la cocina',
    pay: 'Pagar mi parte',
    keep: 'Seguir mirando la carta',
    payTitle: 'Pagar desde la mesa',
    tableTotal: 'Total de la mesa',
    split: 'Dividir entre',
    whole: 'Todo',
    yourPart: 'Tu parte',
    payBtn: (p: string) => `Pagar ${p} con tarjeta`,
    sim: 'Simulación: no se cobra nada.',
    paidTitle: 'Pago hecho',
    paidText:
      'En un local de verdad, tu parte se descuenta de la mesa en el TPV. Aquí es una simulación: no se ha cobrado nada.',
    waiterDone: 'Aviso enviado: el camarero lo ve en su comandero.',
    billDone: 'Cuenta pedida: el camarero lo ve en su comandero.',
    added: (d: string) => `${d}: añadido a tu pedido.`,
    allergens: 'Alérgenos',
    allergensNote: 'Si tienes una alergia grave, díselo al personal antes de pedir.',
    contains: 'Contiene',
    veg: 'Vegetariano',
    categories: 'Categorías',
  },
  en: {
    table: 'Table',
    sample: 'Sample menu',
    lang: 'Language',
    filters: 'Allergens and diets',
    filtersHint: 'Hide dishes that are not right for you.',
    hidden: (n: number) =>
      n === 1 ? '1 dish hidden by your filters' : `${n} dishes hidden by your filters`,
    clear: 'Clear filters',
    soldOut: 'Sold out today',
    add: (d: string) => `Add ${d}`,
    remove: (d: string) => `Remove one ${d}`,
    menuWhen: 'Monday to Friday, 1 pm to 4 pm',
    menuOff: 'The set lunch only shows during its hours: Monday to Friday, 1 pm to 4 pm.',
    menuShow: 'Show it anyway',
    waiter: 'Call the waiter',
    bill: 'Ask for the bill',
    viewOrder: 'View order',
    items: (n: number) => (n === 1 ? '1 item' : `${n} items`),
    order: 'Your order',
    note: 'Note for the kitchen',
    notePh: 'No onion, sauce on the side…',
    required: 'Required',
    optional: 'Optional',
    addFor: (p: string) => `Add · ${p}`,
    total: 'Total',
    send: 'Send to kitchen',
    close: 'Close',
    empty: 'Nothing added yet.',
    sentTitle: 'Order sent to the kitchen',
    sentText: (n: number) =>
      `The kitchen already has it on screen, with table ${n} and your notes.`,
    seeKitchen: 'See how the kitchen gets it',
    pay: 'Pay my share',
    keep: 'Back to the menu',
    payTitle: 'Pay at the table',
    tableTotal: 'Table total',
    split: 'Split between',
    whole: 'All',
    yourPart: 'Your share',
    payBtn: (p: string) => `Pay ${p} by card`,
    sim: 'Simulation: nothing is charged.',
    paidTitle: 'Payment done',
    paidText:
      'In a real restaurant, your share comes off the table on the till. This is a simulation: nothing has been charged.',
    waiterDone: 'Request sent: the waiter sees it on their handheld.',
    billDone: 'Bill requested: the waiter sees it on their handheld.',
    added: (d: string) => `${d}: added to your order.`,
    allergens: 'Allergens',
    allergensNote: 'If you have a severe allergy, please tell our staff before ordering.',
    contains: 'Contains',
    veg: 'Vegetarian',
    categories: 'Categories',
  },
  fr: {
    table: 'Table',
    sample: 'Carte d’exemple',
    lang: 'Langue',
    filters: 'Allergènes et régimes',
    filtersHint: 'Masque les plats qui ne vous conviennent pas.',
    hidden: (n: number) =>
      n === 1 ? '1 plat masqué par vos filtres' : `${n} plats masqués par vos filtres`,
    clear: 'Retirer les filtres',
    soldOut: 'Épuisé aujourd’hui',
    add: (d: string) => `Ajouter ${d}`,
    remove: (d: string) => `Retirer un ${d}`,
    menuWhen: 'Du lundi au vendredi, de 13 h à 16 h',
    menuOff: 'Le menu du jour n’apparaît qu’à ses horaires : du lundi au vendredi, de 13 h à 16 h.',
    menuShow: 'Le voir quand même',
    waiter: 'Appeler le serveur',
    bill: 'Demander l’addition',
    viewOrder: 'Voir la commande',
    items: (n: number) => (n === 1 ? '1 article' : `${n} articles`),
    order: 'Votre commande',
    note: 'Note pour la cuisine',
    notePh: 'Sans oignon, sauce à part…',
    required: 'Obligatoire',
    optional: 'Facultatif',
    addFor: (p: string) => `Ajouter · ${p}`,
    total: 'Total',
    send: 'Envoyer en cuisine',
    close: 'Fermer',
    empty: 'Vous n’avez encore rien ajouté.',
    sentTitle: 'Commande envoyée en cuisine',
    sentText: (n: number) => `La cuisine l’a déjà à l’écran, avec la table ${n} et vos notes.`,
    seeKitchen: 'Voir comment la cuisine la reçoit',
    pay: 'Payer ma part',
    keep: 'Revenir à la carte',
    payTitle: 'Payer à table',
    tableTotal: 'Total de la table',
    split: 'Partager entre',
    whole: 'Tout',
    yourPart: 'Votre part',
    payBtn: (p: string) => `Payer ${p} par carte`,
    sim: 'Simulation : rien n’est débité.',
    paidTitle: 'Paiement effectué',
    paidText:
      'Dans un vrai restaurant, votre part est déduite de la table sur la caisse. Ici, c’est une simulation : rien n’a été débité.',
    waiterDone: 'Demande envoyée : le serveur la voit sur son terminal.',
    billDone: 'Addition demandée : le serveur la voit sur son terminal.',
    added: (d: string) => `${d} : ajouté à votre commande.`,
    allergens: 'Allergènes',
    allergensNote: 'En cas d’allergie grave, prévenez le personnel avant de commander.',
    contains: 'Contient',
    veg: 'Végétarien',
    categories: 'Catégories',
  },
} as const;

const langs: { id: Lang; label: string; name: string }[] = [
  { id: 'es', label: 'ES', name: 'Español' },
  { id: 'en', label: 'EN', name: 'English' },
  { id: 'fr', label: 'FR', name: 'Français' },
];

/* ── Estado ── */
interface Line {
  key: string;
  dish: string;
  qty: number;
  mods: Record<string, string>;
  note: string;
}
type View = 'carta' | 'sent' | 'pay' | 'paid';

const STORE_KEY = 'alacarta-demo-carta';
const ready = ref(false);
const lang = ref<Lang>('es');
const active = ref<string[]>([]);
const filtersOpen = ref(false);
const cart = ref<Line[]>([]);
const sent = ref<Line[]>([]);
const view = ref<View>('carta');
const split = ref(1);
const forceMenu = ref(false);
const inSchedule = ref(false);
const live = ref('');
const currentCat = ref<string>('');

const sheetDish = ref<Dish | null>(null);
const sheetMods = ref<Record<string, string>>({});
const sheetNote = ref('');
const sheetQty = ref(1);
const cartOpen = ref(false);
const triedAdd = ref(false);

const root = ref<HTMLElement | null>(null);
const scroller = ref<HTMLElement | null>(null);
const sheet = ref<HTMLElement | null>(null);
const viewHead = ref<HTMLElement | null>(null);
let opener: HTMLElement | null = null;
let observer: IntersectionObserver | null = null;

const t = computed(() => ui[lang.value]);
const dishById = (id: string) => dishes.find((d) => d.id === id)!;
const allergenById = (id: string) => allergens.find((a) => a.id === id)!;

/* ── Carta visible ── */
const menuVisible = computed(() => ready.value && (inSchedule.value || forceMenu.value));
const excluded = computed(() => {
  const set = new Set<string>();
  let veg = false;
  for (const id of active.value) {
    const f = dietFilters.find((x) => x.id === id);
    f?.excludes?.forEach((a) => set.add(a));
    if (f?.vegetarian) veg = true;
  }
  return { set, veg };
});
const passes = (d: Dish) =>
  !d.allergens.some((a) => excluded.value.set.has(a)) && (!excluded.value.veg || d.vegetarian);

const sections = computed(() =>
  categories
    .filter((c) => c.id !== 'menu' || menuVisible.value)
    .map((c) => ({
      cat: c,
      items: dishes.filter((d) => d.category === c.id && passes(d)),
    }))
    .filter((s) => s.items.length > 0)
);
const hiddenCount = computed(
  () => dishes.filter((d) => (d.category !== 'menu' || menuVisible.value) && !passes(d)).length
);
const usedAllergens = computed(() =>
  allergens.filter((a) => dishes.some((d) => d.allergens.includes(a.id)))
);

/* ── Pedido ── */
const lineKey = (dish: string, mods: Record<string, string>, note: string) =>
  `${dish}|${Object.entries(mods)
    .map(([k, v]) => `${k}:${v}`)
    .join(',')}|${note.trim()}`;
const linePrice = (l: Line) => dishById(l.dish).price * l.qty;
const cartCount = computed(() => cart.value.reduce((n, l) => n + l.qty, 0));
const cartTotal = computed(() => cart.value.reduce((n, l) => n + linePrice(l), 0));
const sentTotal = computed(() => sent.value.reduce((n, l) => n + linePrice(l), 0));
const myPart = computed(() => Math.ceil(sentTotal.value / split.value));
const qtyOf = (dish: string) =>
  cart.value.filter((l) => l.dish === dish).reduce((n, l) => n + l.qty, 0);

function addLine(dish: string, mods: Record<string, string>, note: string, qty = 1) {
  const key = lineKey(dish, mods, note);
  const found = cart.value.find((l) => l.key === key);
  if (found) found.qty += qty;
  else cart.value.push({ key, dish, qty, mods: { ...mods }, note: note.trim() });
  live.value = t.value.added(dishById(dish).name[lang.value]);
}

function quickAdd(d: Dish, ev: Event) {
  if (d.modifiers?.length) {
    openDish(d, ev.currentTarget as HTMLElement);
    return;
  }
  addLine(d.id, {}, '');
}

function quickRemove(d: Dish) {
  const lines = cart.value.filter((l) => l.dish === d.id);
  const last = lines[lines.length - 1];
  if (!last) return;
  changeQty(last, -1);
}

function changeQty(l: Line, delta: number) {
  l.qty += delta;
  if (l.qty <= 0) cart.value = cart.value.filter((x) => x !== l);
}

const missingRequired = computed(() =>
  (sheetDish.value?.modifiers ?? []).filter((m) => m.required && !sheetMods.value[m.id])
);

function confirmDish() {
  triedAdd.value = true;
  if (!sheetDish.value || missingRequired.value.length) return;
  addLine(sheetDish.value.id, sheetMods.value, sheetNote.value, sheetQty.value);
  closeSheet();
}

function sendOrder() {
  if (!cart.value.length) return;
  for (const l of cart.value) {
    const found = sent.value.find((s) => s.key === l.key);
    if (found) found.qty += l.qty;
    else sent.value.push({ ...l });
  }
  cart.value = [];
  closeSheet(false);
  goView('sent');
  live.value = t.value.sentTitle;
}

function pay() {
  goView('paid');
  live.value = t.value.paidTitle;
}

const kitchenHref = computed(() =>
  ctaHref({
    to: 'probar',
    origen: props.origen,
    comanda: encodeOrder(
      sent.value.map((l) => ({ dish: l.dish, qty: l.qty, mods: l.mods, note: l.note }))
    ),
    hash: 'simulador',
  })
);
const promoHref = ctaHref({ to: 'demo', modulo: 'carta-qr', origen: `${props.origen}-banda` });
const finalHref = ctaHref({ to: 'demo', modulo: 'carta-qr', origen: `${props.origen}-pago` });

/* ── Avisos al camarero ── */
function notify(kind: 'waiter' | 'bill') {
  live.value = kind === 'waiter' ? t.value.waiterDone : t.value.billDone;
}

/* ── Vistas y hojas ── */
async function goView(v: View) {
  view.value = v;
  await nextTick();
  if (isEmbed) scroller.value?.scrollTo({ top: 0 });
  else if (v !== 'carta') root.value?.scrollIntoView({ block: 'start' });
  viewHead.value?.focus();
}

async function openDish(d: Dish, from: HTMLElement) {
  opener = from;
  sheetDish.value = d;
  sheetMods.value = Object.fromEntries(
    (d.modifiers ?? []).filter((m) => !m.required).map((m) => [m.id, m.options[0]!.id])
  );
  sheetNote.value = '';
  sheetQty.value = 1;
  triedAdd.value = false;
  await nextTick();
  focusSheet();
}

async function openCart(ev: Event) {
  opener = ev.currentTarget as HTMLElement;
  cartOpen.value = true;
  await nextTick();
  focusSheet();
}

function focusSheet() {
  sheet.value?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
}

function closeSheet(restore = true) {
  sheetDish.value = null;
  cartOpen.value = false;
  if (restore) opener?.focus();
  opener = null;
}

const sheetOpen = computed(() => Boolean(sheetDish.value) || cartOpen.value);

function onSheetKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault();
    closeSheet();
    return;
  }
  if (e.key !== 'Tab' || !sheet.value) return;
  const items = [
    ...sheet.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input, textarea, a[href], [tabindex="0"]'
    ),
  ];
  if (!items.length) return;
  const first = items[0]!;
  const last = items[items.length - 1]!;
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/* ── Categorías: saltar y saber dónde estás ── */
function goCat(id: string, ev: Event) {
  ev.preventDefault();
  const el = root.value?.querySelector<HTMLElement>(`#${uid}-${id}`);
  if (!el) return;
  currentCat.value = id;
  if (isEmbed && scroller.value) {
    const head = scroller.value.querySelector<HTMLElement>('.dc__head')?.offsetHeight ?? 0;
    scroller.value.scrollTo({ top: el.offsetTop - head - 8 });
  } else {
    el.scrollIntoView({ block: 'start' });
  }
  el.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
}

function observe() {
  observer?.disconnect();
  if (!('IntersectionObserver' in window) || !root.value) return;
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        if (e.isIntersecting) currentCat.value = e.target.id.replace(`${uid}-`, '');
    },
    { root: isEmbed ? scroller.value : null, rootMargin: '-30% 0px -60% 0px' }
  );
  root.value.querySelectorAll('.dc__section').forEach((s) => observer!.observe(s));
}

/* ── Ciclo de vida ── */
onMounted(() => {
  const now = new Date();
  const menu = categories.find((c) => c.id === 'menu')?.schedule;
  if (menu) {
    const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    inSchedule.value = menu.days.includes(now.getDay()) && hm >= menu.from && hm < menu.to;
  }
  if (!isEmbed) {
    const saved = store.get<{ lang: Lang; active: string[]; cart: Line[]; sent: Line[] }>(
      STORE_KEY
    );
    if (saved) {
      if (['es', 'en', 'fr'].includes(saved.lang)) lang.value = saved.lang;
      if (Array.isArray(saved.active)) active.value = saved.active;
      if (Array.isArray(saved.cart))
        cart.value = saved.cart.filter((l) => dishes.some((d) => d.id === l.dish));
      if (Array.isArray(saved.sent))
        sent.value = saved.sent.filter((l) => dishes.some((d) => d.id === l.dish));
    }
  }
  ready.value = true;
  nextTick(observe);
});

onBeforeUnmount(() => observer?.disconnect());

watch([sections, view], () => nextTick(observe));
watch(
  [lang, active, cart, sent],
  () => {
    if (!ready.value || isEmbed) return;
    store.set(STORE_KEY, {
      lang: lang.value,
      active: active.value,
      cart: cart.value,
      sent: sent.value,
    });
  },
  { deep: true }
);

function toggleFilter(id: string) {
  active.value = active.value.includes(id)
    ? active.value.filter((x) => x !== id)
    : [...active.value, id];
}
</script>

<template>
  <div ref="root" class="dc" :class="[`is-${mode}`, { 'is-ready': ready }]" :lang="lang">
    <div class="dc__screen">
      <div ref="scroller" class="dc__scroll">
        <!-- Cabecera: local, mesa, idioma y categorías -->
        <header class="dc__head">
          <div class="dc__brand">
            <div>
              <p class="dc__name">{{ demoVenue.name }}</p>
              <p class="dc__meta">{{ t.table }} {{ demoVenue.table }} · {{ t.sample }}</p>
            </div>
            <div v-if="ready" class="dc__langs" role="group" :aria-label="t.lang">
              <button
                v-for="l in langs"
                :key="l.id"
                type="button"
                class="dc__lang"
                :class="{ 'is-on': lang === l.id }"
                :aria-pressed="lang === l.id"
                :aria-label="l.name"
                :lang="l.id"
                @click="lang = l.id"
              >
                {{ l.label }}
              </button>
            </div>
          </div>
          <nav v-if="view === 'carta'" class="dc__cats" :aria-label="t.categories">
            <a
              v-for="s in sections"
              :key="s.cat.id"
              :href="`#${uid}-${s.cat.id}`"
              class="dc__cat"
              :class="{ 'is-on': currentCat === s.cat.id }"
              :aria-current="currentCat === s.cat.id ? 'true' : undefined"
              @click="goCat(s.cat.id, $event)"
            >
              {{ s.cat.label[lang] }}
            </a>
          </nav>
        </header>

        <!-- ── Carta ── -->
        <div v-show="view === 'carta'" class="dc__body">
          <div v-if="ready" class="dc__filters">
            <button
              type="button"
              class="dc__filters-toggle"
              :aria-expanded="filtersOpen"
              :aria-controls="`${uid}-filters`"
              @click="filtersOpen = !filtersOpen"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M3 5h18M6 12h12M10 19h4" />
              </svg>
              {{ t.filters }}
              <span v-if="active.length" class="dc__count">{{ active.length }}</span>
            </button>
            <div v-show="filtersOpen" :id="`${uid}-filters`" class="dc__filters-panel">
              <p class="dc__hint">{{ t.filtersHint }}</p>
              <div class="dc__chips">
                <button
                  v-for="f in dietFilters"
                  :key="f.id"
                  type="button"
                  class="dc__chip"
                  :class="{ 'is-on': active.includes(f.id) }"
                  :aria-pressed="active.includes(f.id)"
                  @click="toggleFilter(f.id)"
                >
                  {{ f.label[lang] }}
                </button>
              </div>
            </div>
            <p v-if="hiddenCount > 0" class="dc__hidden" aria-live="polite">
              {{ t.hidden(hiddenCount) }} ·
              <button type="button" class="dc__link" @click="active = []">{{ t.clear }}</button>
            </p>
          </div>

          <p v-if="ready && !menuVisible" class="dc__menu-off">
            {{ t.menuOff }}
            <button type="button" class="dc__link" @click="forceMenu = true">
              {{ t.menuShow }}
            </button>
          </p>

          <section
            v-for="s in sections"
            :id="`${uid}-${s.cat.id}`"
            :key="s.cat.id"
            class="dc__section"
          >
            <h2 class="dc__title" tabindex="-1">
              {{ s.cat.label[lang] }}
              <span v-if="s.cat.schedule" class="dc__sched">{{ t.menuWhen }}</span>
            </h2>
            <ul class="dc__list" role="list">
              <li
                v-for="d in s.items"
                :key="d.id"
                class="dc__item"
                :class="{ 'is-off': d.soldOut }"
              >
                <div class="dc__copy">
                  <p class="dc__dish">{{ d.name[lang] }}</p>
                  <p class="dc__text">{{ d.soldOut ? t.soldOut : d.text[lang] }}</p>
                  <p v-if="d.allergens.length || d.vegetarian" class="dc__al">
                    <abbr
                      v-for="a in d.allergens"
                      :key="a"
                      :title="allergenById(a).label[lang]"
                      aria-hidden="true"
                      >{{ allergenById(a).code }}</abbr
                    >
                    <span v-if="d.vegetarian" class="dc__veg">{{ t.veg }}</span>
                    <span v-if="d.allergens.length" class="sr-only">
                      {{ t.contains }}:
                      {{ d.allergens.map((a) => allergenById(a).label[lang]).join(', ') }}
                    </span>
                  </p>
                </div>
                <div class="dc__side">
                  <span class="dc__price">{{ eur(d.price) }}</span>
                  <div v-if="ready && !d.soldOut" class="dc__qty">
                    <template v-if="qtyOf(d.id) > 0 && !d.modifiers?.length">
                      <button
                        type="button"
                        class="dc__btn-q"
                        :aria-label="t.remove(d.name[lang])"
                        @click="quickRemove(d)"
                      >
                        −
                      </button>
                      <span class="dc__q" aria-hidden="true">{{ qtyOf(d.id) }}</span>
                    </template>
                    <button
                      type="button"
                      class="dc__btn-q"
                      :class="{ 'is-on': qtyOf(d.id) > 0 }"
                      :aria-label="t.add(d.name[lang])"
                      @click="quickAdd(d, $event)"
                    >
                      <span v-if="d.modifiers?.length && qtyOf(d.id) > 0">{{ qtyOf(d.id) }}</span>
                      <span v-else>+</span>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </section>

          <section class="dc__legend" :aria-label="t.allergens">
            <h2 class="dc__legend-title">{{ t.allergens }}</h2>
            <ul role="list">
              <li v-for="a in usedAllergens" :key="a.id">
                <abbr aria-hidden="true">{{ a.code }}</abbr> {{ a.label[lang] }}
              </li>
            </ul>
            <p class="dc__hint">{{ t.allergensNote }}</p>
          </section>
        </div>

        <!-- ── Pedido enviado ── -->
        <div v-if="view === 'sent'" class="dc__body dc__done">
          <span class="dc__ok" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M20 6 9 17l-5-5" /></svg>
          </span>
          <h2 ref="viewHead" tabindex="-1">{{ t.sentTitle }}</h2>
          <p class="dc__muted">{{ t.sentText(demoVenue.table) }}</p>
          <ul class="dc__ticket" role="list">
            <li v-for="l in sent" :key="l.key">
              <span class="dc__tq">{{ l.qty }}</span>
              <span class="dc__tn">
                {{ dishById(l.dish).name[lang] }}
                <small v-if="modsText(dishById(l.dish), l.mods, lang) || l.note">
                  {{
                    [modsText(dishById(l.dish), l.mods, lang), l.note].filter(Boolean).join(' · ')
                  }}
                </small>
              </span>
              <span class="dc__tp">{{ eur(linePrice(l), false) }}</span>
            </li>
          </ul>
          <a :href="kitchenHref" class="btn is-primary dc__wide">
            {{ t.seeKitchen }} <span aria-hidden="true">→</span>
          </a>
          <button type="button" class="btn is-secondary dc__wide" @click="goView('pay')">
            {{ t.pay }}
          </button>
          <button type="button" class="dc__link" @click="goView('carta')">{{ t.keep }}</button>
        </div>

        <!-- ── Pagar mi parte (simulado) ── -->
        <div v-if="view === 'pay'" class="dc__body dc__done">
          <h2 ref="viewHead" tabindex="-1">{{ t.payTitle }}</h2>
          <p class="dc__sim">{{ t.sim }}</p>
          <div class="dc__row">
            <span>{{ t.tableTotal }}</span><b class="dc__num">{{ eur(sentTotal) }}</b>
          </div>
          <fieldset class="dc__split">
            <legend>{{ t.split }}</legend>
            <div class="dc__chips">
              <button
                v-for="n in [1, 2, 3, 4]"
                :key="n"
                type="button"
                class="dc__chip"
                :class="{ 'is-on': split === n }"
                :aria-pressed="split === n"
                @click="split = n"
              >
                {{ n === 1 ? t.whole : n }}
              </button>
            </div>
          </fieldset>
          <div class="dc__row is-strong">
            <span>{{ t.yourPart }}</span><b class="dc__num">{{ eur(myPart) }}</b>
          </div>
          <button type="button" class="btn is-primary dc__wide" @click="pay">
            {{ t.payBtn(eur(myPart)) }}
          </button>
          <button type="button" class="dc__link" @click="goView('sent')">{{ t.close }}</button>
        </div>

        <!-- ── Pagado ── -->
        <div v-if="view === 'paid'" class="dc__body dc__done">
          <span class="dc__ok" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M20 6 9 17l-5-5" /></svg>
          </span>
          <h2 ref="viewHead" tabindex="-1">{{ t.paidTitle }}</h2>
          <p class="dc__muted">{{ t.paidText }}</p>
          <div class="dc__final" lang="es">
            <p>
              <b>¿Quieres verlo con tu carta?</b> Te la montamos en una demo corta, con tus platos y
              tus mesas.
            </p>
            <a :href="finalHref" class="btn is-primary dc__wide">Solicitar demo</a>
          </div>
          <button type="button" class="dc__link" @click="goView('carta')">{{ t.keep }}</button>
        </div>

        <!-- Banda de alaCarta (siempre en español: es nuestra voz, no la del restaurante) -->
        <aside v-if="!isEmbed" class="dc__promo" lang="es">
          <p>
            Esta es una carta de ejemplo de alaCarta, de un restaurante ficticio. ¿Quieres la tuya,
            conectada con tu TPV?
          </p>
          <a :href="promoHref" class="link-arrow"
            >Solicitar demo <span aria-hidden="true">→</span></a
          >
          <a href="/soluciones/carta-qr" class="link-arrow"
            >Ver la carta digital QR <span aria-hidden="true">→</span></a
          >
        </aside>
      </div>

      <!-- Barra inferior: avisos o pedido -->
      <div v-if="ready && view === 'carta'" class="dc__bar">
        <button v-if="cartCount > 0" type="button" class="dc__cta" @click="openCart">
          <span>{{ t.viewOrder }} · {{ t.items(cartCount) }}</span>
          <b class="dc__num">{{ eur(cartTotal) }}</b>
        </button>
        <div v-else class="dc__actions">
          <button type="button" class="dc__ghost" @click="notify('waiter')">{{ t.waiter }}</button>
          <button type="button" class="dc__ghost" @click="notify('bill')">{{ t.bill }}</button>
        </div>
      </div>
      <p class="sr-only" role="status" aria-live="polite">{{ live }}</p>
      <p v-if="live && ready && view === 'carta'" class="dc__toast" aria-hidden="true">
        {{ live }}
      </p>

      <!-- Hojas: plato con opciones y pedido -->
      <div v-if="sheetOpen" class="dc__backdrop" @click="closeSheet()"></div>
      <div
        v-if="sheetOpen"
        ref="sheet"
        class="dc__sheet"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${uid}-sheet-title`"
        @keydown="onSheetKey"
      >
        <template v-if="sheetDish">
          <div class="dc__sheet-head">
            <h2 :id="`${uid}-sheet-title`" tabindex="-1" data-autofocus>
              {{ sheetDish.name[lang] }}
            </h2>
            <button type="button" class="dc__x" :aria-label="t.close" @click="closeSheet()">
              ×
            </button>
          </div>
          <p class="dc__muted">{{ sheetDish.text[lang] }}</p>
          <fieldset
            v-for="m in sheetDish.modifiers"
            :key="m.id"
            class="dc__mod"
            :class="{ 'is-missing': triedAdd && m.required && !sheetMods[m.id] }"
          >
            <legend>
              {{ m.label[lang] }}
              <span class="dc__req">{{ m.required ? t.required : t.optional }}</span>
            </legend>
            <label v-for="o in m.options" :key="o.id" class="dc__opt">
              <input
                v-model="sheetMods[m.id]"
                type="radio"
                :name="`${uid}-${m.id}`"
                :value="o.id"
              />
              <span>{{ o.label[lang] }}</span>
            </label>
          </fieldset>
          <label class="dc__note">
            <span>{{ t.note }}</span>
            <textarea
              v-model="sheetNote"
              rows="2"
              maxlength="80"
              :placeholder="t.notePh"
            ></textarea>
          </label>
          <button type="button" class="btn is-primary dc__wide" @click="confirmDish">
            {{ t.addFor(eur(sheetDish.price * sheetQty)) }}
          </button>
        </template>

        <template v-else>
          <div class="dc__sheet-head">
            <h2 :id="`${uid}-sheet-title`" tabindex="-1" data-autofocus>
              {{ t.order }} · {{ t.table }} {{ demoVenue.table }}
            </h2>
            <button type="button" class="dc__x" :aria-label="t.close" @click="closeSheet()">
              ×
            </button>
          </div>
          <p v-if="!cart.length" class="dc__muted">{{ t.empty }}</p>
          <ul class="dc__ticket" role="list">
            <li v-for="l in cart" :key="l.key">
              <span class="dc__stepper">
                <button
                  type="button"
                  :aria-label="t.remove(dishById(l.dish).name[lang])"
                  @click="changeQty(l, -1)"
                >
                  −
                </button>
                <span class="dc__tq">{{ l.qty }}</span>
                <button
                  type="button"
                  :aria-label="t.add(dishById(l.dish).name[lang])"
                  @click="changeQty(l, 1)"
                >
                  +
                </button>
              </span>
              <span class="dc__tn">
                {{ dishById(l.dish).name[lang] }}
                <small v-if="modsText(dishById(l.dish), l.mods, lang) || l.note">
                  {{
                    [modsText(dishById(l.dish), l.mods, lang), l.note].filter(Boolean).join(' · ')
                  }}
                </small>
              </span>
              <span class="dc__tp">{{ eur(linePrice(l), false) }}</span>
            </li>
          </ul>
          <div class="dc__row is-strong">
            <span>{{ t.total }}</span><b class="dc__num">{{ eur(cartTotal) }}</b>
          </div>
          <button
            type="button"
            class="btn is-primary dc__wide"
            :disabled="!cart.length"
            @click="sendOrder"
          >
            {{ t.send }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dc {
  --dc-pad: var(--space-4);
  color: var(--color-text);
}
.dc svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.dc__screen {
  position: relative;
}

/* Modo página: la carta ocupa la página, centrada y estrecha */
.dc.is-page .dc__scroll > * {
  max-width: var(--container-narrow);
  margin-inline: auto;
}
.dc.is-page .dc__head {
  position: sticky;
  top: var(--header-h);
  z-index: 3;
  max-width: none;
  background: var(--white);
  border-bottom: 1px solid var(--color-border);
}
.dc.is-page .dc__head > * {
  max-width: var(--container-narrow);
  margin-inline: auto;
}
.dc.is-page .dc__section {
  scroll-margin-top: calc(var(--header-h) + 7.5rem);
}

/* Modo móvil dibujado: un teléfono con la carta dentro y su propio scroll */
.dc.is-embed {
  width: 100%;
  max-width: 20rem;
  margin-inline: auto;
  padding: 8px;
  border-radius: 2.4rem;
  background: var(--gray-900);
  box-shadow: var(--shadow-device);
  font-size: var(--text-sm);
}
.dc.is-embed .dc__screen {
  height: 38rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 1.9rem;
  background: var(--white);
}
.dc.is-embed .dc__scroll {
  flex: 1 1 auto;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
.dc.is-embed .dc__head {
  position: sticky;
  top: 0;
  z-index: 3;
  padding-top: var(--space-5);
  background: var(--white);
  border-bottom: 1px solid var(--color-border);
}
.dc.is-embed {
  --dc-pad: 0.9rem;
}
.dc.is-embed .dc__name {
  font-size: var(--text-lg);
}
.dc.is-embed .dc__meta,
.dc.is-embed .dc__menu-off,
.dc.is-embed .dc__ghost,
.dc.is-embed .dc__cat {
  font-size: var(--text-xs);
}
.dc.is-embed .dc__lang {
  min-width: 1.9rem;
}

/* Cabecera */
.dc__brand {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--dc-pad) var(--space-3);
}
.dc__name {
  font-family: var(--font-display);
  font-weight: var(--weight-semibold);
  font-size: var(--text-2xl);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-strong);
  line-height: 1.1;
}
.dc__meta {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
.dc__langs {
  display: inline-flex;
  padding: 2px;
  border-radius: var(--radius-pill);
  background: var(--color-bg-muted);
}
.dc__lang {
  min-width: 2.25rem;
  min-height: 2rem;
  padding: 0 0.5rem;
  border: 0;
  border-radius: var(--radius-pill);
  background: transparent;
  font: inherit;
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
  cursor: pointer;
}
.dc__lang.is-on {
  background: var(--white);
  color: var(--color-text-strong);
  box-shadow: var(--shadow-sm);
}
.dc__cats {
  display: flex;
  gap: var(--space-1);
  padding: 0 var(--dc-pad) var(--space-3);
  overflow-x: auto;
  scrollbar-width: none;
}
.dc__cat {
  flex: 0 0 auto;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-pill);
  background: var(--color-bg-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
  text-decoration: none;
  transition: background var(--dur-fast) var(--ease);
}
.dc__cat:hover {
  text-decoration: none;
  background: var(--gray-200);
}
.dc__cat.is-on {
  background: var(--black);
  color: var(--white);
}

/* Cuerpo */
.dc__body {
  padding: var(--space-5) var(--dc-pad) var(--space-10);
}
.dc__filters {
  margin-bottom: var(--space-5);
  display: grid;
  gap: var(--space-3);
}
.dc__filters-toggle {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 2.5rem;
  padding: 0 var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
  background: var(--white);
  font: inherit;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
  cursor: pointer;
}
.dc__count {
  display: inline-grid;
  place-items: center;
  min-width: 1.25rem;
  height: 1.25rem;
  border-radius: var(--radius-pill);
  background: var(--black);
  color: var(--white);
  font-size: var(--text-xs);
}
.dc__filters-panel {
  display: grid;
  gap: var(--space-2);
}
.dc__hint,
.dc__muted {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
.dc__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.dc__chip {
  min-height: 2.25rem;
  padding: 0 0.85rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
  background: var(--white);
  font: inherit;
  font-size: var(--text-sm);
  color: var(--color-text-strong);
  cursor: pointer;
}
.dc__chip.is-on {
  background: var(--black);
  border-color: var(--black);
  color: var(--white);
}
.dc__hidden {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
.dc__link {
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
.dc__menu-off {
  margin-bottom: var(--space-6);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-bg-soft);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
.dc__section {
  margin-bottom: var(--space-8);
}
.dc__title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-1) var(--space-3);
  font-size: var(--text-xl);
  margin-bottom: var(--space-1);
}
.dc__title:focus {
  outline: none;
}
.dc__sched {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
  letter-spacing: 0;
}
.dc__item {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border);
}
.dc__item.is-off {
  opacity: 0.5;
}
.dc__copy {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.dc__dish {
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
}
.dc__text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
.dc__al {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-1);
  margin-top: var(--space-1);
}
.dc abbr {
  display: inline-grid;
  place-items: center;
  min-width: 1.375rem;
  height: 1.375rem;
  padding: 0 3px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
  font-size: 0.6875rem;
  font-weight: var(--weight-medium);
  text-decoration: none;
  color: var(--color-text);
}
.dc__veg {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-left: var(--space-1);
}
.dc__side {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-2);
}
.dc__price,
.dc__num,
.dc__tp,
.dc__tq {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
.dc__price {
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
}
.dc__qty {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}
.dc__q {
  min-width: 1rem;
  text-align: center;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}
.dc__btn-q {
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--white);
  font: inherit;
  font-size: var(--text-lg);
  line-height: 1;
  color: var(--color-text-strong);
  cursor: pointer;
}
.dc__btn-q.is-on {
  background: var(--black);
  border-color: var(--black);
  color: var(--white);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
}
.dc__legend {
  margin-top: var(--space-10);
  display: grid;
  gap: var(--space-3);
}
.dc__legend-title {
  font-size: var(--text-base);
}
.dc__legend ul {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
}
.dc__legend li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Pedido enviado, pago */
.dc__done {
  display: grid;
  gap: var(--space-4);
  justify-items: start;
}
.dc__done h2 {
  font-size: var(--text-2xl);
}
.dc__done h2:focus {
  outline: none;
}
.dc__ok {
  width: 2.75rem;
  height: 2.75rem;
  display: grid;
  place-items: center;
  border-radius: var(--radius-pill);
  background: var(--black);
  color: var(--white);
}
.dc__wide {
  width: 100%;
}
.dc__ticket {
  width: 100%;
  border-top: 1px dashed var(--color-border-strong);
}
.dc__ticket li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
  font-size: var(--text-sm);
}
.dc__tn {
  flex: 1 1 auto;
  min-width: 0;
  color: var(--color-text-strong);
}
.dc__tn small {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.dc__tq {
  min-width: 1.25rem;
  text-align: center;
}
.dc__stepper {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}
.dc__stepper button {
  width: 1.9rem;
  height: 1.9rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--white);
  font: inherit;
  cursor: pointer;
}
.dc__row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
.dc__row.is-strong {
  font-size: var(--text-lg);
  color: var(--color-text-strong);
}
.dc__sim {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  background: var(--color-warn-soft);
  color: var(--color-warn);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
}
.dc__split {
  border: 0;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--space-2);
}
.dc__split legend {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  margin-bottom: var(--space-2);
}
.dc__final {
  width: 100%;
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  background: var(--color-bg-soft);
  font-size: var(--text-sm);
}

.dc__promo {
  margin: 0 auto var(--space-10);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  background: var(--color-bg-soft);
  display: grid;
  gap: var(--space-3);
  justify-items: start;
  font-size: var(--text-sm);
}
.dc.is-page .dc__promo {
  width: calc(100% - 2 * var(--dc-pad));
}

/* Barra inferior */
.dc__bar {
  z-index: 3;
  padding: var(--space-3) var(--dc-pad);
  background: var(--white);
  border-top: 1px solid var(--color-border);
}
.dc.is-page .dc__bar {
  position: sticky;
  bottom: 0;
  padding-bottom: max(var(--space-3), env(safe-area-inset-bottom));
}
.dc.is-page .dc__bar > * {
  max-width: calc(var(--container-narrow) - 2 * var(--dc-pad));
  margin-inline: auto;
}
.dc__cta {
  width: 100%;
  min-height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-5);
  border: 0;
  border-radius: var(--radius-md);
  background: var(--black);
  color: var(--white);
  font: inherit;
  font-weight: var(--weight-medium);
  cursor: pointer;
}
.dc__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}
.dc__ghost {
  min-height: 2.75rem;
  padding: 0 var(--space-2);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--white);
  font: inherit;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
  cursor: pointer;
}
.dc__toast {
  position: absolute;
  left: 50%;
  bottom: 4.75rem;
  translate: -50% 0;
  z-index: 4;
  width: max-content;
  max-width: calc(100% - 2rem);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--gray-900);
  color: var(--white);
  font-size: var(--text-xs);
  text-align: center;
  pointer-events: none;
  animation: dc-toast 3.2s var(--ease) forwards;
}
.dc.is-page .dc__toast {
  position: fixed;
  bottom: 5.5rem;
}
@keyframes dc-toast {
  0%,
  85% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* Hojas */
.dc__backdrop {
  position: absolute;
  inset: 0;
  z-index: 5;
  background: rgb(11 11 10 / 0.35);
}
.dc__sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 6;
  max-height: 85%;
  overflow-y: auto;
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5) var(--dc-pad) var(--space-6);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  background: var(--white);
}
.dc.is-page .dc__backdrop {
  position: fixed;
  z-index: 80;
}
.dc.is-page .dc__sheet {
  position: fixed;
  z-index: 81;
  max-height: 85vh;
  max-width: var(--container-narrow);
  margin-inline: auto;
}
.dc__sheet-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-3);
}
.dc__sheet-head h2 {
  font-size: var(--text-xl);
}
.dc__sheet-head h2:focus {
  outline: none;
}
.dc__sheet-head h2:focus-visible {
  outline: 2px solid var(--color-focus);
}
.dc__x {
  width: 2.25rem;
  height: 2.25rem;
  flex: 0 0 auto;
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--color-bg-muted);
  font-size: var(--text-xl);
  line-height: 1;
  cursor: pointer;
}
.dc__mod {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-4) var(--space-3);
  margin: 0;
}
.dc__mod.is-missing {
  border-color: var(--color-danger);
}
.dc__mod legend {
  padding: 0 var(--space-1);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
}
.dc__req {
  margin-left: var(--space-2);
  font-weight: var(--weight-regular);
  color: var(--color-text-muted);
}
.dc__mod.is-missing .dc__req {
  color: var(--color-danger);
}
.dc__opt {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 2.5rem;
  font-size: var(--text-sm);
  cursor: pointer;
}
.dc__opt input {
  width: 1.1rem;
  height: 1.1rem;
  accent-color: var(--black);
}
.dc__note {
  display: grid;
  gap: var(--space-1);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
}
.dc__note textarea {
  font: inherit;
  font-weight: var(--weight-regular);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  resize: vertical;
}
</style>
