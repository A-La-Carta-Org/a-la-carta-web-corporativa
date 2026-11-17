<script setup lang="ts">
/**
 * Formulario de `/solicitar-demo` (docs/auditoria/11 §3-4). Tres pasos — tu local, qué te
 * interesa, cómo hablamos — y un **modo llamada** (`?modo=llamada`) con solo nombre, teléfono,
 * franja y consentimiento.
 *
 * - Precarga por URL con `parseLeadParams()` (src/lib/lead.ts): `modulo`, `sector`, `plan`,
 *   `config` (configurador, placa QR o calculadora), `equipo`, `motivo`, `modo`, `origen`. Lo que
 *   trae se enseña en «Lo que nos traes» y viaja en el envío.
 * - Atribución: página de entrada, referrer externo y `utm_*` de `sessionStorage`
 *   (src/lib/attribution.ts), sin cookies ni terceros. También si el visitante terminó el simulador.
 * - Envío: JSON por POST a `PUBLIC_FORM_ENDPOINT` y redirección a `/gracias`. Sin endpoint, abre el
 *   correo con la solicitud ya escrita (y luego `/gracias?via=correo`).
 * - Accesible: un encabezado por paso que recibe el foco, errores enlazados con
 *   `aria-describedby`, foco al primer error y avisos en `aria-live`. Intro avanza de paso.
 * - Sin JavaScript (o antes de hidratar) es un formulario de un paso con todo visible que se envía
 *   con un POST normal al endpoint (o al correo si no hay endpoint).
 *
 * Los catálogos (productos, familias, tipos de local) llegan por props desde Astro para no meter
 * `solutions.ts` en el JavaScript del cliente.
 */
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import {
  buildMailto,
  emailOk,
  hardwareOptions,
  leadKind,
  localesOptions,
  momentOptions,
  optionLabel,
  parseLeadParams,
  phoneOk,
  preferenceOptions,
  slotOptions,
  thanksHref,
  type LeadContext,
  type LeadKind,
} from '@/lib/lead';
import {
  UTM_KEYS,
  readAttribution,
  readDemoDone,
  saveLastLead,
  type Attribution,
} from '@/lib/attribution';
import { CONTACT_EMAIL, REPLY_HOURS } from '@/data/site';

interface ProductOption {
  slug: string;
  label: string;
  family: string;
  /** Texto del chip de estado si no está disponible («En camino») */
  status?: string;
}
interface FamilyOption {
  id: string;
  name: string;
}
interface SectorOption {
  slug: string;
  name: string;
  /** Trazados SVG del icono (de src/components/ui/icons.ts) */
  icon: string;
}

const props = defineProps<{
  products: ProductOption[];
  families: FamilyOption[];
  sectors: SectorOption[];
}>();

const ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined;
/** Sin JS: POST normal al endpoint; sin endpoint, al correo */
const nativeAction = ENDPOINT || `mailto:${CONTACT_EMAIL}?subject=Solicitud%20de%20demo`;

const ready = ref(false);
const step = ref(1);
const modo = ref<'demo' | 'llamada'>('demo');
const ctx = ref<LeadContext | null>(null);
const attribution = ref<Attribution | null>(null);
const demoDone = ref<string | null>(null);
const formRef = ref<HTMLFormElement | null>(null);
const noticeRef = ref<HTMLElement | null>(null);
const live = ref('');

const form = reactive({
  tipo: '',
  locales: '1',
  momento: '',
  local: '',
  productos: [] as string[],
  usaHoy: '',
  hardware: '',
  preferencia: 'videollamada',
  franja: 'igual',
  nombre: '',
  email: '',
  telefono: '',
  mensaje: '',
  consentimiento: false,
  // honeypot: los humanos no lo ven ni lo rellenan
  web: '',
});
const errors = reactive<Record<string, string>>({});
const status = ref<'idle' | 'sending' | 'noendpoint' | 'error'>('idle');
const errorText = ref('');

const steps = [
  { n: 1, title: 'Tu local' },
  { n: 2, title: 'Qué te interesa' },
  { n: 3, title: 'Cómo hablamos' },
];
const total = steps.length;

const sectorOptions = computed(() => [
  ...props.sectors,
  {
    slug: 'otro',
    name: 'Otro tipo de local',
    icon: '<path d="M4 10v10h16V10"/><path d="M3 10l2-6h14l2 6"/><path d="M10 20v-5h4v5"/>',
  },
]);
const productsByFamily = computed(() =>
  props.families
    .map((f) => ({ ...f, items: props.products.filter((p) => p.family === f.id) }))
    .filter((f) => f.items.length)
);

const isCall = computed(() => modo.value === 'llamada');
const kind = computed<LeadKind>(() => leadKind(modo.value, ctx.value?.motivo ?? null));
const phoneRequired = computed(() => isCall.value || form.preferencia === 'llamada');

/* ── Precarga ──────────────────────────────────────────────────────── */

onMounted(() => {
  const q = new URLSearchParams(window.location.search);
  const c = parseLeadParams(q, {
    products: props.products,
    sectors: props.sectors.map((s) => ({ slug: s.slug, name: s.name })),
  });
  ctx.value = c;
  modo.value = c.modo;
  if (c.sector) form.tipo = c.sector;
  if (c.momento) form.momento = c.momento;
  if (c.hardware) form.hardware = c.hardware;
  form.productos = [...c.productos];
  if (c.modo === 'llamada') form.preferencia = 'llamada';
  attribution.value = readAttribution();
  demoDone.value = readDemoDone();
  ready.value = true;
  nextTick(() => {
    settled.value = true;
  });
});

/* ── Movimiento ────────────────────────────────────────────────────── */

/** Hasta después de hidratar no se anima nada (el paso de «todo visible» a «paso 1» es seco) */
const settled = ref(false);
/** Paso adelante o atrás: los pasos entran desde ese lado; al cambiar de modo, solo funden */
const stepDir = ref('16px');
const stepFx = ref<'t-step' | 't-fade'>('t-step');
watch(step, (n, o) => {
  stepFx.value = 't-step';
  stepDir.value = n >= o ? '16px' : '-16px';
});
/*
 * Los pasos van con v-show (siguen en el DOM para el envío sin JS y para llevar el foco al
 * primer error): el que se va desaparece al momento y el que llega entra animado, así nunca
 * se ven dos a la vez ni cambia el foco que ponen goTo() y setMode().
 */
const instantLeave = (_el: Element, done: () => void) => done();

/* ── Validación ────────────────────────────────────────────────────── */

const fieldsOfStep: Record<number, string[]> = {
  1: ['tipo', 'momento'],
  2: [],
  3: ['nombre', 'email', 'telefono', 'consentimiento'],
};
const callFields = ['nombre', 'telefono', 'consentimiento'];

function check(key: string): string {
  switch (key) {
    case 'tipo':
      return form.tipo ? '' : 'Elige el tipo de local.';
    case 'momento':
      return form.momento ? '' : 'Dinos en qué momento estás.';
    case 'nombre':
      return form.nombre.trim().length >= 2 ? '' : 'Escribe tu nombre.';
    case 'email':
      return emailOk(form.email) ? '' : 'Escribe un correo válido, por ejemplo nombre@tulocal.es.';
    case 'telefono':
      if (!form.telefono.trim())
        return phoneRequired.value ? 'Escribe un teléfono para que podamos llamarte.' : '';
      return phoneOk(form.telefono) ? '' : 'Revisa el teléfono: debe tener al menos 9 cifras.';
    case 'consentimiento':
      return form.consentimiento ? '' : 'Necesitamos tu consentimiento para contestarte.';
    default:
      return '';
  }
}

/** Valida una lista de campos, pinta los errores y devuelve los que fallan */
function validate(keys: string[]) {
  keys.forEach((k) => delete errors[k]);
  const failed = keys.filter((k) => {
    const msg = check(k);
    if (msg) errors[k] = msg;
    return Boolean(msg);
  });
  return failed;
}

/** Revalida un campo al salir si ya tenía error (no molesta mientras se escribe) */
function revalidate(key: string) {
  if (errors[key] === undefined) return;
  const msg = check(key);
  if (msg) errors[key] = msg;
  else delete errors[key];
}

async function reportErrors(failed: string[]) {
  live.value =
    failed.length === 1
      ? `Revisa un campo: ${errors[failed[0]!]}`
      : `Revisa ${failed.length} campos: ${failed.map((k) => errors[k]).join(' ')}`;
  await nextTick();
  const first = failed[0]!;
  const el =
    formRef.value?.querySelector<HTMLElement>(`[name="${first}"]:checked`) ??
    formRef.value?.querySelector<HTMLElement>(`[name="${first}"]`);
  el?.focus();
}

/* ── Pasos ─────────────────────────────────────────────────────────── */

async function goTo(n: number) {
  step.value = n;
  live.value = `Paso ${n} de ${total}: ${steps[n - 1]!.title}.`;
  await nextTick();
  document.getElementById(`lf-step-${n}-title`)?.focus();
}

function next() {
  const failed = validate(fieldsOfStep[step.value] ?? []);
  if (failed.length) return reportErrors(failed);
  return goTo(step.value + 1);
}

function back() {
  if (step.value > 1) goTo(step.value - 1);
}

function setMode(m: 'demo' | 'llamada') {
  stepFx.value = 't-fade';
  modo.value = m;
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (m === 'llamada') form.preferencia = 'llamada';
  try {
    const url = new URL(window.location.href);
    if (m === 'llamada') url.searchParams.set('modo', 'llamada');
    else url.searchParams.delete('modo');
    window.history.replaceState(null, '', url);
  } catch {
    /* nada */
  }
  window.dispatchEvent(new CustomEvent('alacarta:lead-modo', { detail: m }));
  live.value = m === 'llamada' ? 'Formulario corto: te llamamos.' : 'Formulario completo de demo.';
  nextTick(() => {
    const id = m === 'llamada' ? 'lf-step-3-title' : `lf-step-${step.value}-title`;
    document.getElementById(id)?.focus();
  });
}

/* ── Envío ─────────────────────────────────────────────────────────── */

const productNames = computed(() =>
  form.productos.map((s) => props.products.find((p) => p.slug === s)?.label ?? s)
);
const sectorName = computed(
  () => sectorOptions.value.find((s) => s.slug === form.tipo)?.name ?? ''
);

const payload = () => {
  const c = ctx.value;
  const a = attribution.value;
  const call = isCall.value;
  const utm = Object.fromEntries(UTM_KEYS.map((k) => [k, a?.utm?.[k] ?? '']).filter(([, v]) => v));
  return {
    tipo: kind.value,
    enviado: new Date().toISOString(),
    pagina: window.location.pathname,
    // Tu local
    tipo_local: call ? (c?.sector ?? '') : form.tipo,
    locales: call ? '' : form.locales,
    momento: call ? '' : form.momento,
    local: call ? '' : form.local.trim(),
    // Qué te interesa
    productos: call ? (c?.productos ?? []) : form.productos,
    usa_hoy: call ? '' : form.usaHoy.trim(),
    necesita_equipo: call ? '' : form.hardware,
    // Cómo hablamos
    nombre: form.nombre.trim(),
    email: call ? '' : form.email.trim(),
    telefono: form.telefono.trim(),
    preferencia: call ? 'llamada' : form.preferencia,
    franja: form.franja,
    mensaje: call ? '' : form.mensaje.trim(),
    consentimiento: form.consentimiento,
    // Contexto que trae la URL
    origen: c?.origen ?? '',
    motivo: c?.motivo ?? '',
    plan: c?.plan ?? '',
    config: c?.config?.raw ?? '',
    config_tipo: c?.config?.tipo ?? '',
    equipo: c?.equipo?.raw ?? '',
    resumen: c?.resumen.map((r) => `${r.label}: ${r.value}`) ?? [],
    // Atribución (sessionStorage, sin cookies)
    entrada: a?.entrada ?? '',
    referrer: a?.referrer ?? '',
    llegada: a?.llegada ?? '',
    ...utm,
    demo_completada: demoDone.value ?? '',
  };
};

const mailto = computed(() => {
  const call = isCall.value;
  return buildMailto(CONTACT_EMAIL, kind.value, [
    ['Nombre', form.nombre.trim()],
    ['Correo', !call && form.email.trim()],
    ['Teléfono', form.telefono.trim()],
    ['Prefiero', call ? 'Que me llaméis' : optionLabel.preferencia(form.preferencia)],
    ['Franja', optionLabel.franja(form.franja)],
    ['Tipo de local', call ? (ctx.value?.sector ?? '') : sectorName.value],
    ['Nombre del local', !call && form.local.trim()],
    ['Locales', !call && optionLabel.locales(form.locales)],
    ['Momento', !call && optionLabel.momento(form.momento)],
    ['Me interesa', !call && productNames.value.join(', ')],
    ['Uso hoy', !call && form.usaHoy.trim()],
    ['¿Necesito equipo?', !call && optionLabel.hardware(form.hardware)],
    ...(ctx.value?.resumen.map((r) => [r.label, r.value] as [string, string]) ?? []),
    ['Origen', ctx.value?.origen],
    ['', !call && form.mensaje.trim()],
  ]);
});

const thanks = (via?: 'correo') =>
  thanksHref(kind.value, { momento: isCall.value ? undefined : form.momento || undefined, via });

function remember(via: 'endpoint' | 'correo') {
  saveLastLead({
    tipo: kind.value,
    nombre: form.nombre.trim().split(/\s+/)[0],
    email: isCall.value ? undefined : form.email.trim(),
    franja: optionLabel.franja(form.franja),
    momento: form.momento || undefined,
    via,
  });
}

async function send() {
  if (form.web) return; // bot
  const keys = isCall.value ? callFields : [...fieldsOfStep[1]!, ...fieldsOfStep[3]!];
  const failed = validate(keys);
  if (failed.length) {
    if (!isCall.value && failed.some((k) => fieldsOfStep[1]!.includes(k)) && step.value !== 1) {
      step.value = 1;
    }
    return reportErrors(failed);
  }
  if (!ENDPOINT) {
    status.value = 'noendpoint';
    live.value = 'El envío automático no está activo: puedes mandarnos la solicitud por correo.';
    await nextTick();
    noticeRef.value?.focus();
    return;
  }
  status.value = 'sending';
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload()),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    remember('endpoint');
    window.location.assign(thanks());
  } catch (e) {
    status.value = 'error';
    errorText.value = e instanceof Error ? e.message : 'error desconocido';
    live.value = 'No se ha podido enviar.';
    await nextTick();
    noticeRef.value?.focus();
  }
}

/** Sin endpoint: se abre el correo y, un momento después, la página de gracias */
function onMailto() {
  remember('correo');
  window.setTimeout(() => window.location.assign(thanks('correo')), 800);
}

function onSubmit() {
  if (!isCall.value && step.value < total) return next();
  return send();
}

const submitLabel = computed(() => {
  if (status.value === 'sending') return 'Enviando…';
  if (ready.value && !isCall.value && step.value < total) return 'Siguiente';
  const labels: Record<LeadKind, string> = {
    demo: 'Solicitar la demo',
    llamada: 'Que me llaméis',
    propuesta: 'Pedir la propuesta',
    fundador: 'Solicitar plaza de fundador',
    contacto: 'Enviar',
  };
  return labels[kind.value];
});

/** Visible: sin JS, todo; con JS, el paso actual (en modo llamada, solo el 3 reducido) */
const showStep = (n: number) => !ready.value || (isCall.value ? n === 3 : step.value === n);
const describedBy = (key: string, hint?: string) =>
  [hint, errors[key] ? `lf-${key}-error` : ''].filter(Boolean).join(' ') || undefined;
</script>

<template>
  <div
    class="lf"
    :class="{ 'is-ready': ready, 'is-call': isCall }"
    :style="{ '--step-dir': stepDir }"
  >
    <p class="sr-only" aria-live="polite" aria-atomic="true">{{ live }}</p>

    <!-- Lo que llega de otras páginas (configurador, placa, comprobador…) -->
    <section v-if="ctx && ctx.resumen.length" class="lf-context" aria-labelledby="lf-context-title">
      <h2 id="lf-context-title" class="lf-context__title">Lo que nos traes</h2>
      <dl class="lf-context__list">
        <div v-for="r in ctx.resumen" :key="r.label">
          <dt>{{ r.label }}</dt>
          <dd>{{ r.value }}</dd>
        </div>
      </dl>
      <p class="lf-context__note">
        Lo tendremos delante cuando hablemos. Se puede cambiar después.
      </p>
    </section>

    <!-- Indicador de pasos -->
    <Transition name="t-collapse" :css="settled">
      <nav v-if="ready && !isCall" class="lf-progress" aria-label="Pasos del formulario">
        <ol>
          <li
            v-for="s in steps"
            :key="s.n"
            :class="{ 'is-current': step === s.n, 'is-done': step > s.n }"
            :aria-current="step === s.n ? 'step' : undefined"
          >
            <button v-if="step > s.n" type="button" class="lf-progress__btn" @click="goTo(s.n)">
              <span class="lf-progress__n" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="12" height="12"><path d="m5 12 5 5L20 7" /></svg>
              </span>
              <span>{{ s.title }}</span>
              <span class="sr-only">(hecho, volver)</span>
            </button>
            <span v-else class="lf-progress__btn">
              <span class="lf-progress__n" aria-hidden="true">{{ s.n }}</span>
              <span>{{ s.title }}</span>
            </span>
          </li>
        </ol>
      </nav>
    </Transition>

    <form
      ref="formRef"
      class="lf-form"
      :action="nativeAction"
      method="post"
      :enctype="ENDPOINT ? undefined : 'text/plain'"
      :novalidate="ready"
      @submit.prevent="onSubmit"
    >
      <!-- Paso 1 · Tu local -->
      <Transition :name="stepFx" :css="settled" @leave="instantLeave">
        <section v-show="showStep(1)" class="lf-step" aria-labelledby="lf-step-1-title">
          <header class="lf-step__head">
            <p class="lf-step__count">Paso 1 de {{ total }}</p>
            <h2 id="lf-step-1-title" tabindex="-1">Tu local</h2>
          </header>

          <fieldset
            class="lf-group"
            role="radiogroup"
            aria-required="true"
            :aria-invalid="errors.tipo ? 'true' : undefined"
            :aria-describedby="describedBy('tipo')"
          >
            <legend>¿Qué tipo de local tienes?</legend>
            <div class="lf-cards is-sectors">
              <label v-for="s in sectorOptions" :key="s.slug" class="lf-option is-card">
                <input v-model="form.tipo" type="radio" name="tipo" :value="s.slug" required />
                <!-- Trazados de icons.ts, fijos en build (no vienen del usuario) -->
                <!-- eslint-disable vue/no-v-html -->
                <svg
                  class="lf-option__icon"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  v-html="s.icon"
                ></svg>
                <!-- eslint-enable vue/no-v-html -->
                <span class="lf-option__label">{{ s.name }}</span>
              </label>
            </div>
            <Transition name="t-fade">
              <p v-if="errors.tipo" id="lf-tipo-error" class="form-error">{{ errors.tipo }}</p>
            </Transition>
          </fieldset>

          <fieldset class="lf-group" role="radiogroup">
            <legend>¿Cuántos locales?</legend>
            <div class="lf-pills">
              <label v-for="o in localesOptions" :key="o.id" class="lf-option is-pill">
                <input v-model="form.locales" type="radio" name="locales" :value="o.id" />
                <span class="lf-option__label">{{ o.label }}</span>
              </label>
            </div>
          </fieldset>

          <fieldset
            class="lf-group"
            role="radiogroup"
            aria-required="true"
            :aria-invalid="errors.momento ? 'true' : undefined"
            :aria-describedby="describedBy('momento')"
          >
            <legend>¿En qué momento estás?</legend>
            <div class="lf-cards is-two">
              <label v-for="o in momentOptions" :key="o.id" class="lf-option is-card is-text">
                <input v-model="form.momento" type="radio" name="momento" :value="o.id" required />
                <span class="lf-option__label">{{ o.label }}</span>
                <span class="lf-option__hint">{{ o.hint }}</span>
              </label>
            </div>
            <Transition name="t-fade">
              <p v-if="errors.momento" id="lf-momento-error" class="form-error">
                {{ errors.momento }}
              </p>
            </Transition>
          </fieldset>

          <div class="field">
            <label for="lf-local">
              Nombre del local o del grupo <span class="hint">(opcional)</span>
            </label>
            <input
              id="lf-local"
              v-model="form.local"
              class="input"
              type="text"
              name="local"
              autocomplete="organization"
              maxlength="80"
            />
          </div>
        </section>
      </Transition>

      <!-- Paso 2 · Qué te interesa -->
      <Transition :name="stepFx" :css="settled" @leave="instantLeave">
        <section v-show="showStep(2)" class="lf-step" aria-labelledby="lf-step-2-title">
          <header class="lf-step__head">
            <p class="lf-step__count">Paso 2 de {{ total }}</p>
            <h2 id="lf-step-2-title" tabindex="-1">Qué te interesa</h2>
            <p class="lf-step__text">
              Marca lo que quieras ver. Si no lo tienes claro, lo vemos juntos.
            </p>
          </header>

          <fieldset class="lf-group">
            <legend class="sr-only">Productos que te interesan</legend>
            <div class="lf-families">
              <div v-for="f in productsByFamily" :key="f.id" class="lf-family">
                <p :id="`lf-fam-${f.id}`" class="lf-family__name">{{ f.name }}</p>
                <div class="lf-chips" role="group" :aria-labelledby="`lf-fam-${f.id}`">
                  <label v-for="p in f.items" :key="p.slug" class="lf-chip">
                    <input
                      v-model="form.productos"
                      type="checkbox"
                      name="productos"
                      :value="p.slug"
                    />
                    <span>{{ p.label }}</span>
                    <span v-if="p.status" class="lf-chip__status">{{ p.status }}</span>
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          <div class="field">
            <label for="lf-usa">¿Qué usas hoy? <span class="hint">(opcional)</span></label>
            <input
              id="lf-usa"
              v-model="form.usaHoy"
              class="input"
              type="text"
              name="usa_hoy"
              maxlength="120"
              placeholder="Otro TPV, caja registradora, libreta y papel…"
            />
          </div>

          <fieldset class="lf-group" role="radiogroup">
            <legend>
              ¿Necesitas equipo? <span class="hint">Tablet, impresora de tickets, cajón…</span>
            </legend>
            <div class="lf-pills">
              <label v-for="o in hardwareOptions" :key="o.id" class="lf-option is-pill">
                <input v-model="form.hardware" type="radio" name="necesita_equipo" :value="o.id" />
                <span class="lf-option__label">{{ o.label }}</span>
              </label>
            </div>
          </fieldset>
        </section>
      </Transition>

      <!-- Paso 3 · Cómo hablamos (en modo llamada, reducido) -->
      <Transition :name="stepFx" :css="settled" @leave="instantLeave">
        <section v-show="showStep(3)" class="lf-step" aria-labelledby="lf-step-3-title">
          <header class="lf-step__head">
            <p v-if="!isCall" class="lf-step__count">Paso 3 de {{ total }}</p>
            <h2 id="lf-step-3-title" tabindex="-1">
              {{ isCall ? 'Te llamamos' : 'Cómo hablamos' }}
            </h2>
            <p v-if="isCall" class="lf-step__text">
              Déjanos tu nombre y tu teléfono y te llamamos cuando mejor te venga.
            </p>
          </header>

          <fieldset v-if="!isCall" class="lf-group" role="radiogroup">
            <legend>¿Cómo prefieres verlo?</legend>
            <div class="lf-cards is-three">
              <label v-for="o in preferenceOptions" :key="o.id" class="lf-option is-card is-text">
                <input v-model="form.preferencia" type="radio" name="preferencia" :value="o.id" />
                <span class="lf-option__label">{{ o.label }}</span>
                <span class="lf-option__hint">{{ o.hint }}</span>
              </label>
            </div>
          </fieldset>

          <div class="lf-grid">
            <div class="field">
              <label for="lf-nombre">Tu nombre</label>
              <input
                id="lf-nombre"
                v-model="form.nombre"
                class="input"
                type="text"
                name="nombre"
                autocomplete="name"
                maxlength="80"
                required
                :aria-invalid="errors.nombre ? 'true' : undefined"
                :aria-describedby="describedBy('nombre')"
                @input="revalidate('nombre')"
              />
              <Transition name="t-fade">
                <p v-if="errors.nombre" id="lf-nombre-error" class="form-error">
                  {{ errors.nombre }}
                </p>
              </Transition>
            </div>
            <div v-if="!isCall" class="field">
              <label for="lf-email">Correo electrónico</label>
              <input
                id="lf-email"
                v-model="form.email"
                class="input"
                type="email"
                name="email"
                autocomplete="email"
                maxlength="120"
                required
                :aria-invalid="errors.email ? 'true' : undefined"
                :aria-describedby="describedBy('email')"
                @input="revalidate('email')"
              />
              <Transition name="t-fade">
                <p v-if="errors.email" id="lf-email-error" class="form-error">{{ errors.email }}</p>
              </Transition>
            </div>
            <div class="field">
              <label for="lf-telefono">
                Teléfono
                <span v-if="!phoneRequired" class="hint">(opcional)</span>
              </label>
              <input
                id="lf-telefono"
                v-model="form.telefono"
                class="input"
                type="tel"
                name="telefono"
                autocomplete="tel"
                inputmode="tel"
                maxlength="24"
                :required="phoneRequired"
                :aria-invalid="errors.telefono ? 'true' : undefined"
                :aria-describedby="
                  describedBy('telefono', !phoneRequired ? 'lf-telefono-hint' : '')
                "
                @input="revalidate('telefono')"
              />
              <p v-if="!phoneRequired" id="lf-telefono-hint" class="hint">
                Solo si prefieres que te llamemos.
              </p>
              <Transition name="t-fade">
                <p v-if="errors.telefono" id="lf-telefono-error" class="form-error">
                  {{ errors.telefono }}
                </p>
              </Transition>
            </div>
          </div>

          <fieldset class="lf-group" role="radiogroup">
            <legend>¿Cuándo te viene mejor?</legend>
            <div class="lf-pills">
              <label v-for="o in slotOptions" :key="o.id" class="lf-option is-pill">
                <input v-model="form.franja" type="radio" name="franja" :value="o.id" />
                <span class="lf-option__label">{{ o.label }}</span>
              </label>
            </div>
          </fieldset>

          <div v-if="!isCall" class="field">
            <label for="lf-mensaje"
              >Algo que debamos saber <span class="hint">(opcional)</span></label
            >
            <textarea
              id="lf-mensaje"
              v-model="form.mensaje"
              class="textarea"
              name="mensaje"
              maxlength="1500"
              placeholder="Cuándo abres, qué no te funciona, cuántas mesas tienes…"
            />
          </div>

          <div class="field">
            <label class="lf-consent">
              <input
                v-model="form.consentimiento"
                type="checkbox"
                name="consentimiento"
                value="si"
                required
                :aria-invalid="errors.consentimiento ? 'true' : undefined"
                :aria-describedby="describedBy('consentimiento')"
                @change="revalidate('consentimiento')"
              />
              <span>
                He leído la <a href="/legal/privacidad">política de privacidad</a> y acepto que
                alaCarta use estos datos para responder a mi solicitud.
              </span>
            </label>
            <Transition name="t-fade">
              <p v-if="errors.consentimiento" id="lf-consentimiento-error" class="form-error">
                {{ errors.consentimiento }}
              </p>
            </Transition>
          </div>
        </section>
      </Transition>

      <!-- Contexto y atribución (también para el envío sin JavaScript) -->
      <input type="hidden" name="modo" :value="modo" />
      <input type="hidden" name="origen" :value="ctx?.origen ?? ''" />
      <input type="hidden" name="motivo" :value="ctx?.motivo ?? ''" />
      <input type="hidden" name="plan" :value="ctx?.plan ?? ''" />
      <input type="hidden" name="config" :value="ctx?.config?.raw ?? ''" />
      <input type="hidden" name="equipo" :value="ctx?.equipo?.raw ?? ''" />
      <input type="hidden" name="entrada" :value="attribution?.entrada ?? ''" />
      <input type="hidden" name="referrer" :value="attribution?.referrer ?? ''" />
      <input type="hidden" name="redireccion" value="/gracias?tipo=demo" />

      <!-- Honeypot -->
      <div class="lf-hp" aria-hidden="true">
        <label for="lf-web">Web</label>
        <input
          id="lf-web"
          v-model="form.web"
          type="text"
          name="web"
          tabindex="-1"
          autocomplete="off"
        />
      </div>

      <div class="lf-actions">
        <button
          v-if="ready && !isCall && step > 1"
          type="button"
          class="btn is-secondary is-lg"
          @click="back"
        >
          Atrás
        </button>
        <button type="submit" class="btn is-primary is-lg" :disabled="status === 'sending'">
          {{ submitLabel }}
          <svg
            v-if="ready && !isCall && step < total"
            class="btn-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
        <p class="lf-actions__note">
          Respondemos en menos de {{ REPLY_HOURS }} horas laborables. Sin compromiso.
        </p>
      </div>

      <Transition name="t-rise">
        <div
          v-if="status === 'noendpoint'"
          ref="noticeRef"
          class="notice lf-notice"
          role="status"
          tabindex="-1"
        >
          <p>
            <strong>El envío automático aún no está activo.</strong> Te abrimos el correo con tu
            solicitud ya escrita; solo tienes que darle a enviar.
          </p>
          <a :href="mailto" class="btn is-primary" @click="onMailto">Enviar por correo</a>
        </div>
      </Transition>
      <Transition name="t-rise">
        <div
          v-if="status === 'error'"
          ref="noticeRef"
          class="notice is-danger lf-notice"
          role="alert"
          tabindex="-1"
        >
          <p>
            No se ha podido enviar ({{ errorText }}). Inténtalo de nuevo en unos minutos o
            <a :href="mailto" @click="onMailto">mándanoslo por correo</a>.
          </p>
        </div>
      </Transition>
    </form>

    <p v-if="ready" class="lf-switch">
      <template v-if="isCall">
        ¿Prefieres ver la plataforma en pantalla?
        <button type="button" class="lf-link" @click="setMode('demo')">Pide una demo</button>
      </template>
      <template v-else>
        ¿Con una llamada te basta?
        <button type="button" class="lf-link" @click="setMode('llamada')">Te llamamos</button>
      </template>
    </p>
  </div>
</template>

<style scoped>
.lf {
  display: grid;
  gap: var(--space-6);
}
fieldset {
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
}
legend {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
  padding: 0;
  margin-bottom: var(--space-3);
}
legend .hint {
  display: block;
  font-weight: var(--weight-regular);
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  margin-top: 2px;
}

/* Lo que nos traes */
.lf-context {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-soft);
  padding: var(--space-4) var(--space-5);
  display: grid;
  gap: var(--space-3);
}
.lf-context__title {
  font-size: var(--text-xs);
  font-family: var(--font-body);
  font-weight: var(--weight-medium);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);
}
.lf-context__list {
  display: grid;
  gap: var(--space-2);
}
.lf-context__list div {
  display: grid;
  grid-template-columns: 9rem minmax(0, 1fr);
  gap: var(--space-3);
  font-size: var(--text-sm);
}
.lf-context__list dt {
  color: var(--color-text-muted);
}
.lf-context__list dd {
  color: var(--color-text-strong);
}
.lf-context__note {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* Indicador de pasos */
.lf-progress ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-2);
}
.lf-progress li {
  border-top: 2px solid var(--color-border);
  padding-top: var(--space-3);
  transition: border-top-color var(--dur) var(--ease);
}
.lf-progress li.is-current,
.lf-progress li.is-done {
  border-top-color: var(--color-ink);
}
.lf-progress__btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  background: none;
  border: 0;
  padding: 0;
  text-align: left;
}
.lf-progress li.is-current .lf-progress__btn {
  color: var(--color-text-strong);
  font-weight: var(--weight-medium);
}
button.lf-progress__btn {
  cursor: pointer;
  color: var(--color-text-strong);
}
button.lf-progress__btn:hover span:not(.lf-progress__n) {
  text-decoration: underline;
}
.lf-progress__n {
  flex: 0 0 auto;
  width: 1.375rem;
  height: 1.375rem;
  display: grid;
  place-items: center;
  border-radius: var(--radius-pill);
  background: var(--color-bg-muted);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  transition:
    background-color var(--dur) var(--ease),
    color var(--dur) var(--ease);
}
.is-current .lf-progress__n,
.is-done .lf-progress__n {
  background: var(--color-ink);
  color: var(--white);
}
.lf-progress__n svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Pasos */
.lf-form {
  display: grid;
  gap: var(--space-8);
}
.lf-step {
  display: grid;
  gap: var(--space-6);
}
.lf:not(.is-ready) .lf-step + .lf-step {
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border);
}
.lf-step__head {
  display: grid;
  gap: var(--space-1);
}
.lf-step__count {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}
.lf-step__head h2 {
  font-size: var(--text-2xl);
  scroll-margin-top: calc(var(--header-h) + var(--space-6));
}
/* El foco va al titular del paso para lectores de pantalla; no es un control: sin marco */
.lf-step__head h2:focus,
.lf-step__head h2:focus-visible {
  outline: none;
}
.lf-step__text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}
.lf-group {
  display: grid;
}
.lf-group .form-error {
  margin-top: var(--space-2);
}

/* Opciones (radio con aspecto de tarjeta o de píldora) */
.lf-cards {
  display: grid;
  gap: var(--space-2);
}
.lf-cards.is-sectors {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.lf-cards.is-two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.lf-cards.is-three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.lf-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.lf-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--white);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--color-text);
  transition:
    border-color var(--dur) var(--ease),
    background-color var(--dur) var(--ease),
    color var(--dur) var(--ease);
}
.lf-option:hover {
  border-color: var(--color-text-muted);
}
.lf-option input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}
.lf-option:has(input:checked) {
  border-color: var(--color-ink);
  background: var(--color-bg-muted);
  color: var(--color-text-strong);
}
.lf-option:has(input:focus-visible) {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
.lf-group[aria-invalid='true'] .lf-option {
  border-color: var(--color-danger);
}
.lf-option.is-card {
  padding: var(--space-3) var(--space-4);
  min-height: 3.25rem;
}
.lf-option.is-card.is-text {
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
}
.lf-option.is-pill {
  padding: 0.55rem 0.95rem;
  border-radius: var(--radius-pill);
}
.lf-option__icon {
  flex: 0 0 auto;
  color: var(--color-text-muted);
  transition: color var(--dur) var(--ease);
}
.lf-option:has(input:checked) .lf-option__icon {
  color: var(--color-text-strong);
}
.lf-option__label {
  font-weight: var(--weight-medium);
  line-height: 1.3;
  min-width: 0;
  hyphens: auto;
  overflow-wrap: anywhere;
}
.lf-option__hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: 1.4;
}

/* Productos por familia */
.lf-families {
  display: grid;
  gap: var(--space-5);
}
.lf-family {
  display: grid;
  gap: var(--space-2);
}
.lf-family__name {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}
.lf-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.lf-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.45rem 0.8rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
  font-size: var(--text-sm);
  cursor: pointer;
  background: var(--white);
  transition:
    border-color var(--dur) var(--ease),
    background-color var(--dur) var(--ease),
    color var(--dur) var(--ease);
}
.lf-chip:hover {
  border-color: var(--color-text-muted);
}
.lf-chip:has(input:checked) {
  border-color: var(--color-ink);
  background: var(--color-bg-muted);
  color: var(--color-text-strong);
}
.lf-chip:has(input:focus-visible) {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
.lf-chip input {
  accent-color: var(--black);
  margin: 0;
}
.lf-chip__status {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  border-left: 1px solid var(--color-border);
  padding-left: var(--space-2);
}

/* Datos de contacto */
.lf-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}
.is-call .lf-grid {
  grid-template-columns: 1fr;
}
.field .hint {
  font-weight: var(--weight-regular);
}
.lf-consent {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: var(--weight-regular) !important;
}
.lf-consent input {
  margin-top: 0.25rem;
  accent-color: var(--black);
}
.lf-consent a {
  text-decoration: underline;
  color: var(--color-text-strong);
}
.lf-hp {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

/* Acciones */
.lf-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3) var(--space-4);
  flex-wrap: wrap;
}
.lf-actions__note {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.lf-notice {
  display: grid;
  gap: var(--space-3);
  justify-items: start;
}
.lf-notice:focus {
  outline: none;
}
.lf-notice a:not(.btn) {
  text-decoration: underline;
  font-weight: var(--weight-medium);
}
.lf-switch {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-5);
}
.lf-link {
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  color: var(--color-text-strong);
  font-weight: var(--weight-medium);
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

@media (max-width: 640px) {
  .lf-cards.is-sectors,
  .lf-cards.is-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .lf-cards.is-three,
  .lf-grid {
    grid-template-columns: 1fr;
  }
  .lf-option.is-card {
    gap: var(--space-2);
    padding: var(--space-3);
  }
  .lf-context__list div {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .lf-progress__btn {
    flex-direction: column;
    align-items: flex-start;
    font-size: var(--text-xs);
  }
  .lf-actions .btn {
    flex: 1 1 auto;
  }
}
</style>
