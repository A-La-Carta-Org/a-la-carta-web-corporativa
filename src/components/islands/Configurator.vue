<script setup lang="ts">
/**
 * D5 · «Monta tu alaCarta» (docs/auditoria/09 y 10). El configurador ES una carta: cinco
 * secciones como las de un menú (para servir, para vender más, para gestionar, para equipar,
 * para empezar) y, al lado, el ticket de TPV que se va escribiendo en monoespaciada.
 *
 * - Toda la cuenta la hace `quote()` (src/lib/quote.ts, módulo puro y comprobado con
 *   `npm run check:quote`). Aquí solo hay interfaz.
 * - Lee `?config=` (compartible) o `?add=`, `?plan=`, `?sector=`, `?locales=` para preseleccionar
 *   lo que llega desde las páginas de producto y sector. Al cambiar algo reescribe la URL
 *   (`/precios?config=…#monta`) y lo guarda en `sessionStorage` (con try/catch).
 * - Los botones llevan la configuración al formulario con `ctaHref({ config, origen })`.
 * - Accesible: casillas y botones nativos, pasos con etiqueta, total en `aria-live`.
 * - Sin JavaScript (o antes de hidratar) se ve la carta con sus precios, sin casillas.
 */
import { computed, onMounted, reactive, ref, watch } from 'vue';
import {
  ESTIMATE_NOTE,
  IA_MINUTES_INCLUDED,
  NO_PRICE_LABEL,
  ONSITE_TRAINING_FROM,
  RRHH_PEOPLE_INCLUDED,
  FOUNDER_SPOTS,
  addonModules,
  billingOptions,
  fmtPrice,
  getAddon,
  getDevicePrice,
  getPlan,
  type Billing,
} from '@/data/pricing';
import {
  QUOTE_LIMITS,
  STANDALONE_MODULES,
  configFromParams,
  decodeConfig,
  defaultConfig,
  encodeConfig,
  listNames,
  quote,
  type QuoteConfig,
  type QuoteModule,
} from '@/lib/quote';
import { ctaHref } from '@/lib/cta';

const props = withDefaults(
  defineProps<{
    /** Productos que todavía no están disponibles (chip «En camino») */
    soon?: string[];
    origen?: string;
  }>(),
  { soon: () => [], origen: 'configurador' }
);

const STORAGE_KEY = 'alacarta:monta';
type NumKey = keyof typeof QUOTE_LIMITS;

/* ── La carta ──────────────────────────────────────────────────────── */

interface Dish {
  id: string;
  name: string;
  desc: string;
  /** Precio de carta, ya escrito */
  price: string;
  /** Unidad pequeña junto al precio */
  unit?: string;
  /** Qué se marca: un módulo, un interruptor o nada (incluido) */
  module?: QuoteModule;
  flag?: 'hardware' | 'placas' | 'presencial' | 'migracion';
  included?: boolean;
  /** Paso numérico que aparece al marcarlo (o siempre, si está incluido) */
  qty?: { key: NumKey; label: string; help?: string };
  /** Slug para el chip de estado */
  slug?: string;
}
interface Course {
  id: string;
  title: string;
  note: string;
  dishes: Dish[];
}

const loose = (m: string) => addonModules.find((a) => a.module === m)!;
const add = (m: string) => getAddon(m)!;
const completo = getPlan('completo');
const total = getPlan('total');
const esencial = getPlan('esencial');

const courses: Course[] = [
  {
    id: 'servir',
    title: 'Para servir',
    note: 'Sala, barra y cocina',
    dishes: [
      {
        id: 'tpv',
        name: 'TPV',
        desc: `Cobro, mesas y cierre de caja. Incluye 1 terminal; cada uno más, ${fmtPrice(getDevicePrice('tpv'))}/mes.`,
        price: 'incluido',
        included: true,
        qty: { key: 'terminales', label: 'Terminales por local' },
      },
      {
        id: 'carta-qr',
        name: 'Carta digital QR',
        desc: 'La carta del TPV en el móvil del cliente, con pedido desde la mesa.',
        price: 'incluida',
        included: true,
      },
      {
        id: 'comandero',
        name: 'Comandero',
        module: 'comandero',
        slug: 'comandero',
        desc: `Los camareros piden desde el móvil. Suelto lleva ${loose('comandero').devices}; en ${completo.name} y ${total.name}, ${completo.devices.comandero}.`,
        price: fmtPrice(loose('comandero').monthly),
        unit: '/local',
        qty: { key: 'comanderos', label: 'Comanderos por local' },
      },
      {
        id: 'cocina',
        name: 'Pantalla de cocina',
        module: 'cocina',
        slug: 'cocina',
        desc: 'Las comandas llegan solas a la cocina, con tiempos y avisos.',
        price: fmtPrice(loose('cocina').monthly),
        unit: '/local',
        qty: { key: 'pantallas', label: 'Pantallas por local' },
      },
    ],
  },
  {
    id: 'vender',
    title: 'Para vender más',
    note: 'Tus canales, sin comisiones',
    dishes: [
      {
        id: 'reservas',
        name: 'Reservas',
        module: 'reservas',
        slug: 'reservas',
        desc: 'Desde tu web y Google, sin pagar por comensal.',
        price: fmtPrice(loose('reservas').monthly),
        unit: '/local',
      },
      {
        id: 'pedidos-online',
        name: 'Pedidos online',
        module: 'pedidos-online',
        slug: 'pedidos-online',
        desc: 'Take away y reparto propio, sin comisión por pedido.',
        price: fmtPrice(loose('pedidos-online').monthly),
        unit: '/local',
      },
      {
        id: 'clientes',
        name: 'Clientes y fidelización',
        module: 'clientes',
        slug: 'clientes',
        desc: 'Fichas, puntos y campañas para que vuelvan.',
        price: fmtPrice(loose('clientes').monthly),
        unit: '/local',
      },
      {
        id: 'app-propia',
        name: 'App propia',
        module: 'app-propia',
        slug: 'app-propia',
        desc: 'Reservas, pedidos y puntos con tu marca, en el móvil de tus clientes.',
        price: fmtPrice(add('app-propia').monthly),
        unit: '/local',
      },
      {
        id: 'llamadas-ia',
        name: 'Llamadas con IA',
        module: 'llamadas-ia',
        slug: 'llamadas-ia',
        desc: `Coge el teléfono y apunta reservas y pedidos para recoger. ${IA_MINUTES_INCLUDED} minutos al mes; el extra, ${add('llamadas-ia').extra?.replace('minuto extra a ', '')}/min.`,
        price: fmtPrice(add('llamadas-ia').monthly),
        unit: '/local',
        qty: { key: 'minutos', label: 'Minutos al mes por local', help: 'Una estimación' },
      },
      {
        id: 'web',
        name: 'Web y presencia en Google',
        module: 'web-para-restaurantes',
        slug: 'web-para-restaurantes',
        desc: `Tu web con la carta del sistema y tu ficha de Google al día. ${fmtPrice(add('web-para-restaurantes').setup ?? 0)} de alta.`,
        price: fmtPrice(add('web-para-restaurantes').monthly),
        unit: '/mes',
      },
    ],
  },
  {
    id: 'gestionar',
    title: 'Para gestionar',
    note: 'La oficina y el equipo',
    dishes: [
      {
        id: 'backoffice',
        name: 'Backoffice e informes',
        desc: 'Carta, precios, escandallos, ventas en tiempo real y cierre diario.',
        price: 'incluido',
        included: true,
      },
      {
        id: 'erp',
        name: 'ERP',
        module: 'erp',
        slug: 'erp',
        desc: `Compras, stock, facturas, tesorería y contabilidad. Por empresa; el ${total.name} incluye una.`,
        price: fmtPrice(add('erp').monthly),
        unit: '/empresa',
        qty: { key: 'empresas', label: 'Empresas o sociedades' },
      },
      {
        id: 'rrhh',
        name: 'Equipo y RRHH',
        module: 'rrhh',
        slug: 'rrhh',
        desc: `Fichaje, turnos, vacaciones y variables para la gestoría. Hasta ${RRHH_PEOPLE_INCLUDED} personas por local.`,
        price: fmtPrice(add('rrhh').monthly),
        unit: '/local',
        qty: { key: 'personas', label: 'Personas por local' },
      },
    ],
  },
  {
    id: 'equipar',
    title: 'Para equipar',
    note: 'O usa lo que ya tienes',
    dishes: [
      {
        id: 'hardware',
        name: 'Hardware',
        flag: 'hardware',
        slug: 'hardware',
        desc: 'Terminales, impresoras y pantallas configurados. Si tienes equipo, lo revisamos.',
        price: NO_PRICE_LABEL.toLowerCase(),
      },
      {
        id: 'placas',
        name: 'Placas QR para las mesas',
        flag: 'placas',
        slug: 'placas-qr',
        desc: 'Una placa por mesa, con QR y NFC opcional. Imprimirlas tú es gratis.',
        price: NO_PRICE_LABEL.toLowerCase(),
      },
    ],
  },
  {
    id: 'empezar',
    title: 'Para empezar',
    note: 'Te lo dejamos funcionando',
    dishes: [
      {
        id: 'remota',
        name: 'Puesta en marcha remota',
        desc: 'Carta, mesas, impresoras y usuarios configurados por videollamada.',
        price: 'incluida',
        included: true,
      },
      {
        id: 'presencial',
        name: 'Formación presencial',
        flag: 'presencial',
        desc: 'Una jornada en tu local con tu equipo. Desplazamiento aparte.',
        price: `desde ${fmtPrice(ONSITE_TRAINING_FROM)}`,
      },
      {
        id: 'migracion',
        name: 'Migración de datos',
        flag: 'migracion',
        desc: 'Productos, clientes e histórico desde tu sistema actual.',
        price: 'a medida',
      },
    ],
  },
];

/* ── Estado ────────────────────────────────────────────────────────── */

const ready = ref(false);
const touched = ref(false);
const config = reactive<QuoteConfig>(defaultConfig());
const copyState = ref<'idle' | 'ok' | 'fail'>('idle');

const apply = (c: QuoteConfig) => Object.assign(config, c, { modules: [...c.modules] });

onMounted(() => {
  try {
    const fromUrl = configFromParams(new URLSearchParams(window.location.search));
    if (fromUrl) apply(fromUrl);
    else {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (saved) apply(decodeConfig(saved));
    }
  } catch {
    /* sin almacenamiento o URL rara: se empieza de cero */
  }
  ready.value = true;
});

const encoded = computed(() => encodeConfig(config));
const q = computed(() => quote(config));

watch(encoded, (enc) => {
  if (!ready.value) return;
  if (!touched.value) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, enc);
  } catch {
    /* modo privado: no pasa nada */
  }
  try {
    const url = new URL(window.location.href);
    ['config', 'add', 'plan', 'sector', 'locales'].forEach((k) => url.searchParams.delete(k));
    if (enc) url.searchParams.set('config', enc);
    url.hash = 'monta';
    window.history.replaceState(window.history.state, '', url);
  } catch {
    /* sin History API */
  }
  copyState.value = 'idle';
});

const touch = () => {
  touched.value = true;
};

const isOn = (d: Dish) =>
  d.included
    ? !config.sinTpv
    : d.module
      ? config.modules.includes(d.module)
      : d.flag
        ? config[d.flag]
        : false;

const isDisabled = (d: Dish) =>
  Boolean(config.sinTpv && d.module && !STANDALONE_MODULES.includes(d.module));

function toggle(d: Dish) {
  touch();
  if (d.module) {
    const i = config.modules.indexOf(d.module);
    if (i >= 0) config.modules.splice(i, 1);
    else config.modules.push(d.module);
  } else if (d.flag) {
    config[d.flag] = !config[d.flag];
  }
}

function step(key: NumKey, dir: 1 | -1) {
  touch();
  const lim = QUOTE_LIMITS[key];
  const by = 'step' in lim ? lim.step : 1;
  config[key] = Math.min(lim.max, Math.max(lim.min, config[key] + dir * by));
}
function setNum(key: NumKey, ev: Event) {
  const v = Number((ev.target as HTMLInputElement).value);
  if (!Number.isFinite(v)) return;
  touch();
  const lim = QUOTE_LIMITS[key];
  config[key] = Math.min(lim.max, Math.max(lim.min, Math.round(v)));
}
function setBilling(b: Billing) {
  touch();
  config.billing = b;
}
function setFlag(key: 'fundador' | 'sinTpv', ev: Event) {
  touch();
  config[key] = (ev.target as HTMLInputElement).checked;
}
function reset() {
  touch();
  apply(defaultConfig());
}

const isSoon = (d: Dish) => Boolean(d.slug && props.soon.includes(d.slug));

/** Lo marcado que todavía está en camino: se dice en el ticket, sin fecha inventada */
const soonNote = computed(() => {
  const names = courses
    .flatMap((c) => c.dishes)
    .filter((d) => isSoon(d) && isOn(d) && !isDisabled(d))
    .map((d) => d.name);
  if (!names.length) return '';
  return `${listNames(names).replace(/^./, (c) => c.toUpperCase())}: ${names.length > 1 ? 'están' : 'está'} en camino; en la propuesta te decimos cuándo.`;
});

/* ── Ticket ────────────────────────────────────────────────────────── */

const money = (n: number) => {
  const [int, dec] = n.toFixed(2).split('.');
  return `${int!.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${dec} €`;
};

const metaLine = computed(() =>
  [
    `${config.locales} ${config.locales === 1 ? 'local' : 'locales'}`,
    config.billing === 'anual' ? 'pago anual' : 'pago mensual',
    config.fundador ? 'fundador' : '',
  ]
    .filter(Boolean)
    .join(' · ')
);

const liveText = computed(
  () =>
    `Total orientativo: ${fmtPrice(q.value.monthly)} al mes${
      q.value.plan !== 'ninguno' ? `, plan ${q.value.planName}` : ''
    }.`
);

const proposalHref = computed(() =>
  ctaHref({
    to: 'demo',
    config: encoded.value || undefined,
    plan: q.value.plan !== 'ninguno' ? q.value.plan : undefined,
    motivo: 'propuesta',
    origen: props.origen,
  })
);
const demoHref = computed(() =>
  ctaHref({
    to: 'demo',
    config: encoded.value || undefined,
    plan: q.value.plan !== 'ninguno' ? q.value.plan : undefined,
    motivo: config.fundador ? 'fundador' : undefined,
    origen: props.origen,
  })
);

async function copyLink() {
  try {
    const url = new URL(window.location.href);
    url.search = encoded.value ? `?config=${encoded.value}` : '';
    url.hash = 'monta';
    await window.navigator.clipboard.writeText(url.toString());
    copyState.value = 'ok';
  } catch {
    copyState.value = 'fail';
  }
}
</script>

<template>
  <div class="mt" :class="{ 'is-ready': ready }">
    <!-- Carta -->
    <div class="mt__menu">
      <div v-if="ready" class="mt__globals">
        <div class="mt__global">
          <span id="mt-l-label" class="mt__global-label">Locales</span>
          <div class="mt__stepper" role="group" aria-labelledby="mt-l-label">
            <button
              type="button"
              class="mt__step"
              aria-label="Un local menos"
              :disabled="config.locales <= QUOTE_LIMITS.locales.min"
              @click="step('locales', -1)"
            >
              −
            </button>
            <input
              class="mt__num"
              type="number"
              inputmode="numeric"
              aria-label="Número de locales"
              :min="QUOTE_LIMITS.locales.min"
              :max="QUOTE_LIMITS.locales.max"
              :value="config.locales"
              @change="setNum('locales', $event)"
            />
            <button
              type="button"
              class="mt__step"
              aria-label="Un local más"
              :disabled="config.locales >= QUOTE_LIMITS.locales.max"
              @click="step('locales', 1)"
            >
              +
            </button>
          </div>
        </div>
        <div class="mt__global">
          <span id="mt-b-label" class="mt__global-label">Pago</span>
          <div class="mt__toggle" role="radiogroup" aria-labelledby="mt-b-label">
            <button
              v-for="opt in billingOptions"
              :key="opt.id"
              type="button"
              role="radio"
              :aria-checked="config.billing === opt.id"
              :class="{ 'is-on': config.billing === opt.id }"
              @click="setBilling(opt.id)"
            >
              {{ opt.label }}<span v-if="opt.note" class="mt__toggle-note">{{ opt.note }}</span>
            </button>
          </div>
        </div>
        <label class="mt__check">
          <input type="checkbox" :checked="config.fundador" @change="setFlag('fundador', $event)" />
          <span class="mt__box" aria-hidden="true"></span>
          <span>
            Quiero ser local fundador
            <small>Precio bloqueado y presencial incluida. {{ FOUNDER_SPOTS }} plazas.</small>
          </span>
        </label>
        <a href="#mt-ticket" class="mt__jump">
          <span>Tu ticket</span>
          <b class="num">{{ fmtPrice(q.monthly) }}/mes</b>
        </a>
      </div>

      <section v-for="course in courses" :key="course.id" class="mt__course">
        <h3 class="mt__course-title">
          <span>{{ course.title }}</span>
          <small>{{ course.note }}</small>
        </h3>

        <label v-if="ready && course.id === 'servir'" class="mt__check is-inline">
          <input type="checkbox" :checked="config.sinTpv" @change="setFlag('sinTpv', $event)" />
          <span class="mt__box" aria-hidden="true"></span>
          <span>
            Ya tengo TPV: solo quiero gestión o web
            <small>ERP, Equipo y RRHH y la web se pueden contratar sin plan.</small>
          </span>
        </label>

        <ul role="list" class="mt__dishes">
          <li
            v-for="d in course.dishes"
            :key="d.id"
            class="mt__dish"
            :class="{
              'is-on': ready && isOn(d),
              'is-included': d.included,
              'is-disabled': ready && isDisabled(d),
            }"
          >
            <!-- Con JS: casilla (o marca fija si está incluido) -->
            <component :is="ready && !d.included ? 'label' : 'div'" class="mt__dish-row">
              <input
                v-if="ready && !d.included"
                type="checkbox"
                :checked="isOn(d)"
                :disabled="isDisabled(d)"
                @change="toggle(d)"
              />
              <span
                v-if="ready"
                class="mt__box"
                :class="{ 'is-fixed': d.included }"
                aria-hidden="true"
              ></span>
              <span class="mt__dish-name">
                {{ d.name }}
                <span v-if="isSoon(d)" class="chip is-status">En camino</span>
              </span>
              <span class="mt__leader" aria-hidden="true"></span>
              <span class="mt__dish-price num">
                {{ d.price }}<small v-if="d.unit">{{ d.unit }}</small>
              </span>
            </component>
            <p class="mt__dish-desc">{{ d.desc }}</p>

            <div v-if="ready && d.qty && isOn(d) && !(d.included && config.sinTpv)" class="mt__qty">
              <span :id="`mt-q-${d.id}`">{{ d.qty.label }}</span>
              <div class="mt__stepper" role="group" :aria-labelledby="`mt-q-${d.id}`">
                <button
                  type="button"
                  class="mt__step"
                  :aria-label="`Menos: ${d.qty.label.toLowerCase()}`"
                  :disabled="config[d.qty.key] <= QUOTE_LIMITS[d.qty.key].min"
                  @click="step(d.qty.key, -1)"
                >
                  −
                </button>
                <input
                  class="mt__num"
                  type="number"
                  inputmode="numeric"
                  :aria-label="d.qty.label"
                  :min="QUOTE_LIMITS[d.qty.key].min"
                  :max="QUOTE_LIMITS[d.qty.key].max"
                  :value="config[d.qty.key]"
                  @change="setNum(d.qty.key, $event)"
                />
                <button
                  type="button"
                  class="mt__step"
                  :aria-label="`Más: ${d.qty.label.toLowerCase()}`"
                  :disabled="config[d.qty.key] >= QUOTE_LIMITS[d.qty.key].max"
                  @click="step(d.qty.key, 1)"
                >
                  +
                </button>
              </div>
              <small v-if="d.qty.help" class="mt__qty-help">{{ d.qty.help }}</small>
            </div>
          </li>
        </ul>
      </section>

      <p v-if="!ready" class="mt__fallback">
        Precios orientativos por local y mes, sin IVA. Sobre el {{ esencial.name }} se suman los
        módulos sueltos; el {{ completo.name }} y el {{ total.name }} los llevan dentro. Para hacer
        tu cuenta, cuéntanos tu local en la demo.
        <a :href="ctaHref({ to: 'demo', origen: props.origen })" class="link-arrow"
          >Pedir mi propuesta</a
        >
      </p>
    </div>

    <!-- Ticket -->
    <aside v-if="ready" id="mt-ticket" class="mt__aside" aria-labelledby="mt-ticket-title">
      <div class="tk">
        <div class="tk__head">
          <p id="mt-ticket-title" class="tk__brand">alaCarta</p>
          <p class="tk__meta">Propuesta orientativa</p>
          <p class="tk__meta">{{ metaLine }}</p>
        </div>

        <ul role="list" class="tk__lines">
          <li v-for="l in q.lines" :key="l.id" class="tk__line">
            <span class="tk__label">{{ l.label }}</span>
            <span class="tk__amount">{{ l.amount === null ? l.text : money(l.amount) }}</span>
            <span v-if="l.detail" class="tk__detail">{{ l.detail }}</span>
          </li>
          <li v-if="!q.lines.length" class="tk__line is-empty">
            <span class="tk__label">Marca algo en la carta</span>
          </li>
        </ul>

        <div class="tk__rule" aria-hidden="true"></div>
        <p class="tk__row">
          <span>Comisiones por pedido o reserva</span><span>{{ money(0) }}</span>
        </p>
        <p class="tk__total">
          <span>Total al mes</span><span>{{ money(q.monthly) }}</span>
        </p>
        <p class="tk__row is-muted">
          <span>12 meses</span><span>{{ money(q.yearly) }}</span>
        </p>
        <p v-if="q.annualSaving > 0" class="tk__row is-muted">
          <span>{{
            config.billing === 'anual' ? 'Ahorras pagando el año' : 'Pagando el año ahorrarías'
          }}</span>
          <span>{{ money(q.annualSaving) }}</span>
        </p>

        <template v-if="q.once.length">
          <div class="tk__rule" aria-hidden="true"></div>
          <p class="tk__section">Pago único</p>
          <ul role="list" class="tk__lines">
            <li v-for="l in q.once" :key="l.id" class="tk__line">
              <span class="tk__label">{{ l.label }}</span>
              <span class="tk__amount">
                {{
                  l.text && (l.amount === 0 || l.amount === null)
                    ? l.text.toLowerCase()
                    : `${l.from ? 'desde ' : ''}${money(l.amount ?? 0)}`
                }}
              </span>
              <span v-if="l.detail" class="tk__detail">{{ l.detail }}</span>
            </li>
          </ul>
          <p v-if="q.onceTotal > 0" class="tk__row">
            <span>Total pago único</span>
            <span>{{ q.onceFrom ? 'desde ' : '' }}{{ money(q.onceTotal) }}</span>
          </p>
        </template>

        <div
          v-if="q.better || q.upsell || q.notices.length || soonNote"
          class="tk__rule"
          aria-hidden="true"
        ></div>
        <p v-if="q.better" class="tk__note is-strong">
          * Te sale mejor el plan {{ q.better.planName }}: −{{ money(q.better.saving) }}/mes frente
          a {{ q.better.vs }}.
        </p>
        <p v-if="q.upsell" class="tk__note">
          * Por {{ money(q.upsell.extra) }}/mes más, el plan {{ q.upsell.planName }} añade
          {{ listNames(q.upsell.adds) }}.
        </p>
        <p v-for="n in q.notices" :key="n" class="tk__note">* {{ n }}</p>
        <p v-if="soonNote" class="tk__note">* {{ soonNote }}</p>

        <p class="tk__foot">{{ ESTIMATE_NOTE }} La cifra cerrada va en tu propuesta.</p>
      </div>

      <p class="sr-only" aria-live="polite">{{ liveText }}</p>

      <div class="mt__actions">
        <a :href="proposalHref" class="btn is-primary">Recibir esta propuesta por correo</a>
        <a :href="demoHref" class="btn is-secondary">Revisarla en una demo</a>
        <div class="mt__actions-row">
          <button type="button" class="mt__link" @click="copyLink">Copiar enlace</button>
          <button type="button" class="mt__link" @click="reset">Empezar de cero</button>
        </div>
        <p class="mt__copy" aria-live="polite">
          <template v-if="copyState === 'ok'">
            Enlace copiado. Quien lo abra verá esta misma cuenta.
          </template>
          <template v-else-if="copyState === 'fail'">
            No se ha podido copiar: copia la dirección de la barra del navegador.
          </template>
        </p>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.mt {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 24rem);
  gap: var(--space-10);
  align-items: start;
}
.mt:not(.is-ready) {
  grid-template-columns: minmax(0, 1fr);
}

/* ── Carta ── */
.mt__menu {
  display: grid;
  gap: var(--space-10);
  padding: var(--space-8) var(--space-8) var(--space-10);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--white);
}
.mt__globals {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4) var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border);
}
.mt__global {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.mt__global-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-muted);
}
.mt__toggle {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: var(--radius-md);
  background: var(--color-bg-muted);
}
.mt__toggle button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 0.4rem 0.8rem;
  border-radius: calc(var(--radius-md) - 3px);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
}
.mt__toggle button.is-on {
  background: var(--white);
  color: var(--color-text-strong);
  box-shadow: var(--shadow-sm);
}
.mt__toggle-note {
  font-size: var(--text-xs);
}
.mt__jump {
  display: none;
}

.mt__course {
  display: grid;
  gap: var(--space-4);
}
.mt__course-title {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1.5px solid var(--color-ink);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  letter-spacing: var(--tracking-snug);
}
.mt__course-title small {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-muted);
}
.mt__dishes {
  display: grid;
}
.mt__dish {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-3) 0;
  border-bottom: 1px dashed var(--color-border);
}
.mt__dish:last-child {
  border-bottom: 0;
}
.mt__dish-row {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
}
label.mt__dish-row {
  cursor: pointer;
}
.mt__dish-name {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-weight: var(--weight-semibold);
  font-size: var(--text-md);
  color: var(--color-text-strong);
}
.mt__leader {
  flex: 1 1 auto;
  min-width: var(--space-6);
  border-bottom: 1.5px dotted var(--gray-400);
  transform: translateY(-0.25em);
}
.mt__dish-price {
  flex: 0 0 auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-strong);
}
.mt__dish-price small {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.mt__dish-desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  max-width: 34rem;
}
.is-ready .mt__dish-desc {
  padding-left: calc(1.125rem + var(--space-3));
}
.mt__dish.is-disabled .mt__dish-row,
.mt__dish.is-disabled .mt__dish-desc {
  opacity: 0.45;
}
.mt__dish.is-disabled label.mt__dish-row {
  cursor: not-allowed;
}

/* Casilla propia, sobre el input nativo (sigue siendo el que recibe teclado y foco) */
.mt input[type='checkbox'] {
  position: absolute;
  opacity: 0;
  width: 1.125rem;
  height: 1.125rem;
  margin: 0;
}
.mt__box {
  position: relative;
  flex: 0 0 auto;
  width: 1.125rem;
  height: 1.125rem;
  border: 1.5px solid var(--gray-400);
  border-radius: 4px;
  background: var(--white);
  transform: translateY(0.15em);
  transition:
    background-color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);
}
.mt__box::after {
  content: '';
  position: absolute;
  inset: 0.15rem 0.33rem 0.3rem;
  border: solid var(--white);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  transition: transform var(--dur-fast) var(--ease);
}
.mt__dish.is-on .mt__box,
.mt__check input:checked + .mt__box {
  background: var(--color-ink);
  border-color: var(--color-ink);
}
.mt__dish.is-on .mt__box::after,
.mt__check input:checked + .mt__box::after {
  transform: rotate(45deg) scale(1);
}
.mt__box.is-fixed {
  background: var(--gray-400) !important;
  border-color: var(--gray-400) !important;
}
.mt input[type='checkbox']:focus-visible + .mt__box {
  outline: 2px solid var(--color-ink);
  outline-offset: 3px;
}

.mt__check {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
  cursor: pointer;
}
.mt__check small {
  display: block;
  font-weight: var(--weight-regular);
  color: var(--color-text-muted);
}
.mt__check.is-inline {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-bg-soft);
}

.mt__qty {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-3);
  margin-top: var(--space-2);
  padding-left: calc(1.125rem + var(--space-3));
  font-size: var(--text-sm);
  color: var(--color-text);
}
.mt__qty-help {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.mt__stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.mt__step {
  width: 2.25rem;
  height: 2.25rem;
  font-size: var(--text-md);
  color: var(--color-text-strong);
}
.mt__step:hover:not(:disabled) {
  background: var(--color-bg-muted);
}
.mt__step:disabled {
  color: var(--gray-300);
}
.mt__num {
  width: 3.5rem;
  height: 2.25rem;
  border: 0;
  border-inline: 1px solid var(--color-border);
  text-align: center;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-strong);
  background: var(--white);
  -moz-appearance: textfield;
  appearance: textfield;
}
.mt__num::-webkit-inner-spin-button,
.mt__num::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.mt__fallback {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  display: grid;
  gap: var(--space-3);
  justify-items: start;
}

/* ── Ticket ── */
.mt__aside {
  position: sticky;
  top: calc(var(--header-h, 4rem) + var(--space-4));
  display: grid;
  gap: var(--space-5);
}
.tk {
  --tk-pad: var(--space-6);
  position: relative;
  display: grid;
  gap: var(--space-3);
  padding: var(--tk-pad) var(--tk-pad) calc(var(--tk-pad) + 6px);
  background: var(--white);
  border: 1px solid var(--color-border);
  border-bottom: 0;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  box-shadow: var(--shadow-device);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
  color: var(--color-text-strong);
}
/* Borde dentado del papel */
.tk::after {
  content: '';
  position: absolute;
  left: -1px;
  right: -1px;
  bottom: -8px;
  height: 8px;
  background:
    linear-gradient(135deg, var(--white) 50%, transparent 50%) 0 0 / 12px 8px repeat-x,
    linear-gradient(225deg, var(--white) 50%, transparent 50%) 0 0 / 12px 8px repeat-x;
}
.tk__head {
  display: grid;
  gap: 2px;
  justify-items: center;
  padding-bottom: var(--space-3);
  border-bottom: 1.5px dashed var(--color-border-strong);
  text-align: center;
}
.tk__brand {
  font-family: var(--font-display);
  font-weight: var(--weight-semibold);
  font-size: var(--text-lg);
  letter-spacing: var(--tracking-snug);
}
.tk__meta {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-muted);
}
.tk__lines {
  display: grid;
  gap: var(--space-2);
}
.tk__line {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: var(--space-3);
  animation: tk-in var(--dur) var(--ease) both;
}
.tk__line.is-empty {
  color: var(--color-text-muted);
}
.tk__amount {
  text-align: right;
  white-space: nowrap;
}
.tk__detail {
  grid-column: 1 / -1;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.tk__rule {
  border-top: 1.5px dashed var(--color-border-strong);
  margin-block: var(--space-1);
}
.tk__row,
.tk__total {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
}
.tk__row > span:last-child,
.tk__total > span:last-child {
  flex: 0 0 auto;
  white-space: nowrap;
  text-align: right;
}
.tk__row.is-muted {
  color: var(--color-text-muted);
  font-size: var(--text-xs);
}
.tk__total {
  padding-block: var(--space-2);
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  text-transform: uppercase;
}
.tk__section {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-muted);
}
.tk__note {
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  color: var(--color-text-muted);
}
.tk__note.is-strong {
  color: var(--color-text-strong);
}
.tk__foot {
  margin-top: var(--space-2);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-align: center;
}
@keyframes tk-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .tk__line {
    animation: none;
  }
}

.mt__actions {
  display: grid;
  gap: var(--space-3);
  margin-top: var(--space-3);
}
.mt__actions .btn {
  justify-content: center;
}
.mt__actions-row {
  display: flex;
  justify-content: center;
  gap: var(--space-6);
}
.mt__link {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.mt__copy {
  min-height: 1.25em;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-align: center;
}

@media (max-width: 1024px) {
  .mt {
    grid-template-columns: minmax(0, 1fr);
  }
  .mt__aside {
    position: static;
    max-width: 30rem;
    width: 100%;
    margin-inline: auto;
  }
  .mt__jump {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    margin-left: auto;
    padding: 0.4rem 0.8rem;
    border-radius: var(--radius-pill);
    background: var(--color-ink);
    color: var(--white);
    font-size: var(--text-sm);
  }
}
@media (max-width: 640px) {
  .mt__menu {
    padding: var(--space-5) var(--space-4) var(--space-6);
    gap: var(--space-8);
  }
  .mt__globals {
    gap: var(--space-4);
  }
  .mt__jump {
    margin-left: 0;
  }
  .mt__dish-name {
    font-size: var(--text-sm);
  }
  .tk {
    --tk-pad: var(--space-5);
  }
}
</style>
