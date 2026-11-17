<script setup lang="ts">
/**
 * Formulario de `/contacto` (docs/auditoria/11 §6): lo que **no** es venta. Motivo con tarjetas
 * (soporte, gestorías, partners, prensa, otra cosa); «Quiero contratar o ver alaCarta» es un enlace
 * al formulario de demo. Precarga `?motivo=` y envía como `LeadForm`: JSON a `PUBLIC_FORM_ENDPOINT`
 * y redirección a `/gracias?tipo=contacto`; sin endpoint, correo ya escrito. Sin JS, POST normal.
 */
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { buildMailto, contactMotives, emailOk, optionLabel } from '@/lib/lead';
import { UTM_KEYS, readAttribution, saveLastLead, type Attribution } from '@/lib/attribution';
import { CONTACT_EMAIL, REPLY_HOURS } from '@/data/site';

defineProps<{
  /** Trazados SVG de los iconos de cada motivo (de src/components/ui/icons.ts) */
  icons: Record<string, string>;
  /** Enlace a la demo para «Quiero contratar» (con `origen`) */
  salesHref: string;
}>();

const ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined;
const nativeAction = ENDPOINT || `mailto:${CONTACT_EMAIL}?subject=Contacto%20desde%20la%20web`;

const ready = ref(false);
const formRef = ref<HTMLFormElement | null>(null);
const noticeRef = ref<HTMLElement | null>(null);
const live = ref('');
const attribution = ref<Attribution | null>(null);
const origen = ref('');

const form = reactive({
  motivo: '',
  nombre: '',
  email: '',
  empresa: '',
  mensaje: '',
  consentimiento: false,
  web: '',
});
const errors = reactive<Record<string, string>>({});
const status = ref<'idle' | 'sending' | 'noendpoint' | 'error'>('idle');
const errorText = ref('');

onMounted(() => {
  const q = new URLSearchParams(window.location.search);
  const m = q.get('motivo');
  if (m && contactMotives.some((x) => x.id === m)) form.motivo = m;
  const o = q.get('origen');
  if (o && /^[a-z0-9][a-z0-9-]{0,79}$/.test(o)) origen.value = o;
  attribution.value = readAttribution();
  ready.value = true;
});

const keys = ['motivo', 'nombre', 'email', 'mensaje', 'consentimiento'];
function check(key: string) {
  switch (key) {
    case 'motivo':
      return form.motivo ? '' : 'Elige de qué se trata.';
    case 'nombre':
      return form.nombre.trim().length >= 2 ? '' : 'Escribe tu nombre.';
    case 'email':
      return emailOk(form.email) ? '' : 'Escribe un correo válido, por ejemplo nombre@empresa.es.';
    case 'mensaje':
      return form.mensaje.trim().length >= 10
        ? ''
        : 'Cuéntanos un poco más (al menos 10 caracteres).';
    case 'consentimiento':
      return form.consentimiento ? '' : 'Necesitamos tu consentimiento para contestarte.';
    default:
      return '';
  }
}
function revalidate(key: string) {
  if (errors[key] === undefined) return;
  const msg = check(key);
  if (msg) errors[key] = msg;
  else delete errors[key];
}
const describedBy = (key: string) => (errors[key] ? `cf-${key}-error` : undefined);

const thanks = (via?: 'correo') =>
  `/gracias?tipo=contacto${form.motivo ? `&motivo=${form.motivo}` : ''}${via ? `&via=${via}` : ''}`;

const mailto = computed(() =>
  buildMailto(CONTACT_EMAIL, 'contacto', [
    ['Motivo', optionLabel.contacto(form.motivo)],
    ['Nombre', form.nombre.trim()],
    ['Correo', form.email.trim()],
    ['Empresa o local', form.empresa.trim()],
    ['', form.mensaje.trim()],
  ])
);

function remember(via: 'endpoint' | 'correo') {
  saveLastLead({
    tipo: 'contacto',
    nombre: form.nombre.trim().split(/\s+/)[0],
    email: form.email.trim(),
    via,
  });
}

async function submit() {
  if (form.web) return;
  keys.forEach((k) => delete errors[k]);
  const failed = keys.filter((k) => {
    const msg = check(k);
    if (msg) errors[k] = msg;
    return Boolean(msg);
  });
  if (failed.length) {
    live.value = `Revisa ${failed.length === 1 ? 'un campo' : `${failed.length} campos`}: ${failed
      .map((k) => errors[k])
      .join(' ')}`;
    await nextTick();
    const first = failed[0]!;
    (
      formRef.value?.querySelector<HTMLElement>(`[name="${first}"]:checked`) ??
      formRef.value?.querySelector<HTMLElement>(`[name="${first}"]`)
    )?.focus();
    return;
  }
  if (!ENDPOINT) {
    status.value = 'noendpoint';
    await nextTick();
    noticeRef.value?.focus();
    return;
  }
  status.value = 'sending';
  const a = attribution.value;
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        tipo: 'contacto',
        enviado: new Date().toISOString(),
        pagina: window.location.pathname,
        motivo: form.motivo,
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        empresa: form.empresa.trim(),
        mensaje: form.mensaje.trim(),
        consentimiento: form.consentimiento,
        origen: origen.value,
        entrada: a?.entrada ?? '',
        referrer: a?.referrer ?? '',
        llegada: a?.llegada ?? '',
        ...Object.fromEntries(UTM_KEYS.map((k) => [k, a?.utm?.[k] ?? '']).filter(([, v]) => v)),
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    remember('endpoint');
    window.location.assign(thanks());
  } catch (e) {
    status.value = 'error';
    errorText.value = e instanceof Error ? e.message : 'error desconocido';
    await nextTick();
    noticeRef.value?.focus();
  }
}

function onMailto() {
  remember('correo');
  window.setTimeout(() => window.location.assign(thanks('correo')), 800);
}
</script>

<template>
  <form
    ref="formRef"
    class="cf"
    :action="nativeAction"
    method="post"
    :enctype="ENDPOINT ? undefined : 'text/plain'"
    :novalidate="ready"
    @submit.prevent="submit"
  >
    <p class="sr-only" aria-live="polite" aria-atomic="true">{{ live }}</p>

    <fieldset
      class="cf-group"
      role="radiogroup"
      aria-required="true"
      :aria-invalid="errors.motivo ? 'true' : undefined"
      :aria-describedby="describedBy('motivo')"
    >
      <legend>¿De qué se trata?</legend>
      <div class="cf-cards">
        <a :href="salesHref" class="cf-option is-sales">
          <!-- Trazados de icons.ts, fijos en build (no vienen del usuario) -->
          <!-- eslint-disable vue/no-v-html -->
          <svg
            class="cf-option__icon"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            v-html="icons.store"
          ></svg>
          <!-- eslint-enable vue/no-v-html -->
          <span class="cf-option__text">
            <span class="cf-option__label">Quiero contratar o ver alaCarta</span>
            <span class="cf-option__hint">Te llevamos al formulario de demo</span>
          </span>
          <svg
            class="cf-option__arrow"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
        <label v-for="m in contactMotives" :key="m.id" class="cf-option">
          <input v-model="form.motivo" type="radio" name="motivo" :value="m.id" required />
          <!-- Trazados de icons.ts, fijos en build (no vienen del usuario) -->
          <!-- eslint-disable vue/no-v-html -->
          <svg
            class="cf-option__icon"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            v-html="icons[m.icon]"
          ></svg>
          <!-- eslint-enable vue/no-v-html -->
          <span class="cf-option__text">
            <span class="cf-option__label">{{ m.label }}</span>
            <span class="cf-option__hint">{{ m.hint }}</span>
          </span>
        </label>
      </div>
      <Transition name="t-fade">
        <p v-if="errors.motivo" id="cf-motivo-error" class="form-error">{{ errors.motivo }}</p>
      </Transition>
    </fieldset>

    <div class="cf-grid">
      <div class="field">
        <label for="cf-nombre">Tu nombre</label>
        <input
          id="cf-nombre"
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
          <p v-if="errors.nombre" id="cf-nombre-error" class="form-error">{{ errors.nombre }}</p>
        </Transition>
      </div>
      <div class="field">
        <label for="cf-email">Correo electrónico</label>
        <input
          id="cf-email"
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
          <p v-if="errors.email" id="cf-email-error" class="form-error">{{ errors.email }}</p>
        </Transition>
      </div>
      <div class="field cf-full">
        <label for="cf-empresa"
          >Empresa, gestoría o local <span class="hint">(opcional)</span></label
        >
        <input
          id="cf-empresa"
          v-model="form.empresa"
          class="input"
          type="text"
          name="empresa"
          autocomplete="organization"
          maxlength="80"
        />
      </div>
      <div class="field cf-full">
        <label for="cf-mensaje">Mensaje</label>
        <textarea
          id="cf-mensaje"
          v-model="form.mensaje"
          class="textarea"
          name="mensaje"
          maxlength="3000"
          required
          placeholder="Cuéntanos en qué podemos ayudarte"
          :aria-invalid="errors.mensaje ? 'true' : undefined"
          :aria-describedby="describedBy('mensaje')"
          @input="revalidate('mensaje')"
        />
        <Transition name="t-fade">
          <p v-if="errors.mensaje" id="cf-mensaje-error" class="form-error">{{ errors.mensaje }}</p>
        </Transition>
      </div>
      <div class="field cf-full">
        <label class="cf-consent">
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
            He leído la <a href="/legal/privacidad">política de privacidad</a> y acepto que alaCarta
            use estos datos para responder a mi mensaje.
          </span>
        </label>
        <Transition name="t-fade">
          <p v-if="errors.consentimiento" id="cf-consentimiento-error" class="form-error">
            {{ errors.consentimiento }}
          </p>
        </Transition>
      </div>
    </div>

    <input type="hidden" name="origen" :value="origen" />
    <input type="hidden" name="redireccion" value="/gracias?tipo=contacto" />
    <div class="cf-hp" aria-hidden="true">
      <label for="cf-web">Web</label>
      <input
        id="cf-web"
        v-model="form.web"
        type="text"
        name="web"
        tabindex="-1"
        autocomplete="off"
      />
    </div>

    <div class="cf-actions">
      <button type="submit" class="btn is-primary is-lg" :disabled="status === 'sending'">
        {{ status === 'sending' ? 'Enviando…' : 'Enviar mensaje' }}
      </button>
      <p class="cf-actions__note">Te contestamos en menos de {{ REPLY_HOURS }} horas laborables.</p>
    </div>

    <Transition name="t-rise">
      <div
        v-if="status === 'noendpoint'"
        ref="noticeRef"
        class="notice cf-notice"
        role="status"
        tabindex="-1"
      >
        <p>
          <strong>El envío automático aún no está activo.</strong> Te abrimos el correo con tu
          mensaje ya escrito; solo tienes que darle a enviar.
        </p>
        <a :href="mailto" class="btn is-primary" @click="onMailto">Enviar por correo</a>
      </div>
    </Transition>
    <Transition name="t-rise">
      <div
        v-if="status === 'error'"
        ref="noticeRef"
        class="notice is-danger cf-notice"
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
</template>

<style scoped>
.cf {
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
.cf-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2);
}
.cf-option {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--white);
  cursor: pointer;
  font-size: var(--text-sm);
  transition:
    border-color var(--dur) var(--ease),
    background-color var(--dur) var(--ease);
}
.cf-option:hover {
  border-color: var(--color-text-muted);
  text-decoration: none;
}
.cf-option input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}
.cf-option:has(input:checked) {
  border-color: var(--color-ink);
  background: var(--color-bg-muted);
}
.cf-option:has(input:focus-visible) {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
.cf-group[aria-invalid='true'] label.cf-option {
  border-color: var(--color-danger);
}
.cf-option.is-sales {
  grid-column: 1 / -1;
  align-items: center;
  background: var(--color-bg-soft);
  border-style: dashed;
}
.cf-option__icon {
  flex: 0 0 auto;
  margin-top: 1px;
  color: var(--color-text-muted);
  transition: color var(--dur) var(--ease);
}
.cf-option__arrow {
  transition: translate var(--dur) var(--ease);
}
.cf-option.is-sales:hover .cf-option__arrow {
  translate: 2px 0;
}
.cf-option:has(input:checked) .cf-option__icon,
.cf-option.is-sales .cf-option__icon {
  color: var(--color-text-strong);
}
.cf-option__text {
  display: grid;
  gap: 2px;
  flex: 1 1 auto;
}
.cf-option__label {
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
  line-height: 1.3;
}
.cf-option__hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: 1.4;
}
.cf-option__arrow {
  flex: 0 0 auto;
  color: var(--color-text-strong);
}
.cf-group .form-error {
  margin-top: var(--space-2);
}
.cf-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}
.cf-full {
  grid-column: 1 / -1;
}
.field .hint {
  font-weight: var(--weight-regular);
}
.cf-consent {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: var(--weight-regular) !important;
}
.cf-consent input {
  margin-top: 0.25rem;
  accent-color: var(--black);
}
.cf-consent a {
  text-decoration: underline;
  color: var(--color-text-strong);
}
.cf-hp {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.cf-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}
.cf-actions__note {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.cf-notice {
  display: grid;
  gap: var(--space-3);
  justify-items: start;
}
.cf-notice:focus {
  outline: none;
}
.cf-notice a:not(.btn) {
  text-decoration: underline;
  font-weight: var(--weight-medium);
}
@media (max-width: 640px) {
  .cf-cards,
  .cf-grid {
    grid-template-columns: 1fr;
  }
}
</style>
