<script setup lang="ts">
/**
 * Formulario de demo y de contacto. Envía un JSON al endpoint de PUBLIC_FORM_ENDPOINT.
 * Si no hay endpoint configurado (desarrollo), lo dice y ofrece el correo como alternativa.
 *
 * Sin dependencias: validación propia, honeypot contra bots y consentimiento explícito.
 */
import { reactive, ref, computed, onMounted } from 'vue';
import { sectors } from '@/data/sectors';
import { solutions } from '@/data/solutions';
import { plans } from '@/data/pricing';
import { CONTACT_EMAIL, REPLY_HOURS } from '@/data/site';

const props = withDefaults(defineProps<{ variant?: 'demo' | 'contacto' }>(), { variant: 'demo' });

const ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined;

const form = reactive({
  nombre: '',
  email: '',
  telefono: '',
  local: '',
  sector: '',
  locales: '1',
  plan: '',
  modulos: [] as string[],
  motivo: '',
  mensaje: '',
  consentimiento: false,
  // honeypot: los humanos no lo ven ni lo rellenan
  web: '',
});

const errors = reactive<Record<string, string>>({});
const status = ref<'idle' | 'sending' | 'ok' | 'error' | 'noendpoint'>('idle');
const errorText = ref('');

const motivos = [
  { id: 'info', label: 'Información general' },
  { id: 'grupos', label: 'Grupos y cadenas' },
  { id: 'partners', label: 'Colaboraciones y distribuidores' },
  { id: 'soporte', label: 'Soporte a clientes' },
  { id: 'prensa', label: 'Prensa' },
  { id: 'otro', label: 'Otro' },
];

onMounted(() => {
  const q = new URLSearchParams(window.location.search);
  const plan = q.get('plan');
  if (plan && plans.some((p) => p.id === plan)) form.plan = plan;
  const motivo = q.get('motivo');
  if (motivo && motivos.some((m) => m.id === motivo)) form.motivo = motivo;
  const sector = q.get('sector');
  if (sector && sectors.some((s) => s.slug === sector)) form.sector = sector;
  const modulo = q.get('modulo');
  if (modulo && solutions.some((s) => s.slug === modulo)) form.modulos = [modulo];
});

const isDemo = computed(() => props.variant === 'demo');

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (form.nombre.trim().length < 2) errors.nombre = 'Escribe tu nombre.';
  if (!emailOk(form.email)) errors.email = 'Escribe un correo válido.';
  if (isDemo.value && form.local.trim().length < 2) errors.local = 'Dinos cómo se llama tu local.';
  if (isDemo.value && !form.sector) errors.sector = 'Elige el tipo de local.';
  if (!isDemo.value && form.mensaje.trim().length < 10) errors.mensaje = 'Cuéntanos un poco más.';
  if (!form.consentimiento)
    errors.consentimiento = 'Necesitamos tu consentimiento para contestarte.';
  return Object.keys(errors).length === 0;
}

async function submit() {
  if (form.web) return; // bot
  if (!validate()) return;
  if (!ENDPOINT) {
    status.value = 'noendpoint';
    return;
  }
  status.value = 'sending';
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        tipo: props.variant,
        origen: window.location.pathname,
        enviado: new Date().toISOString(),
        ...form,
        web: undefined,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    status.value = 'ok';
  } catch (e) {
    status.value = 'error';
    errorText.value = e instanceof Error ? e.message : 'Error desconocido';
  }
}

const mailto = computed(() => {
  const subject = encodeURIComponent(isDemo.value ? 'Solicitud de demo' : 'Contacto desde la web');
  const body = encodeURIComponent(
    [
      `Nombre: ${form.nombre}`,
      `Correo: ${form.email}`,
      form.telefono && `Teléfono: ${form.telefono}`,
      form.local && `Local: ${form.local}`,
      form.sector && `Tipo: ${form.sector}`,
      isDemo.value && `Locales: ${form.locales}`,
      form.plan && `Plan: ${form.plan}`,
      form.modulos.length && `Módulos: ${form.modulos.join(', ')}`,
      form.motivo && `Motivo: ${form.motivo}`,
      form.mensaje && `\n${form.mensaje}`,
    ]
      .filter(Boolean)
      .join('\n')
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});
</script>

<template>
  <div class="lead-form">
    <div v-if="status === 'ok'" class="notice is-ok lead-form__done" role="status">
      <strong>Recibido.</strong>
      {{
        isDemo
          ? `Te escribimos en menos de ${REPLY_HOURS} horas laborables para fijar la videollamada.`
          : `Te contestamos en menos de ${REPLY_HOURS} horas laborables.`
      }}
    </div>

    <form v-else class="lead-form__form" novalidate @submit.prevent="submit">
      <div class="lead-form__grid">
        <div class="field">
          <label for="lf-nombre">Nombre</label>
          <input
            id="lf-nombre"
            v-model="form.nombre"
            class="input"
            type="text"
            autocomplete="name"
            required
            :aria-invalid="!!errors.nombre"
          />
          <span v-if="errors.nombre" class="form-error">{{ errors.nombre }}</span>
        </div>
        <div class="field">
          <label for="lf-email">Correo electrónico</label>
          <input
            id="lf-email"
            v-model="form.email"
            class="input"
            type="email"
            autocomplete="email"
            required
            :aria-invalid="!!errors.email"
          />
          <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
        </div>
        <div class="field">
          <label for="lf-telefono">Teléfono <span class="hint">(opcional)</span></label>
          <input
            id="lf-telefono"
            v-model="form.telefono"
            class="input"
            type="tel"
            autocomplete="tel"
          />
        </div>

        <template v-if="isDemo">
          <div class="field">
            <label for="lf-local">Nombre del local o grupo</label>
            <input
              id="lf-local"
              v-model="form.local"
              class="input"
              type="text"
              autocomplete="organization"
              :aria-invalid="!!errors.local"
            />
            <span v-if="errors.local" class="form-error">{{ errors.local }}</span>
          </div>
          <div class="field">
            <label for="lf-sector">Tipo de local</label>
            <select
              id="lf-sector"
              v-model="form.sector"
              class="select"
              :aria-invalid="!!errors.sector"
            >
              <option value="" disabled>Elige una opción</option>
              <option v-for="s in sectors" :key="s.slug" :value="s.slug">{{ s.name }}</option>
            </select>
            <span v-if="errors.sector" class="form-error">{{ errors.sector }}</span>
          </div>
          <div class="field">
            <label for="lf-locales">Número de locales</label>
            <select id="lf-locales" v-model="form.locales" class="select">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3-5">3 a 5</option>
              <option value="6-15">6 a 15</option>
              <option value="16+">Más de 15</option>
            </select>
          </div>
          <div class="field">
            <label for="lf-plan">Plan que te interesa <span class="hint">(opcional)</span></label>
            <select id="lf-plan" v-model="form.plan" class="select">
              <option value="">Aún no lo sé</option>
              <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
          <fieldset class="field lead-form__full">
            <legend>Qué te gustaría ver <span class="hint">(opcional)</span></legend>
            <div class="lead-form__checks">
              <label v-for="s in solutions" :key="s.slug" class="lead-form__check">
                <input v-model="form.modulos" type="checkbox" :value="s.slug" />
                <span>{{ s.navLabel }}</span>
              </label>
            </div>
          </fieldset>
        </template>

        <template v-else>
          <div class="field">
            <label for="lf-motivo">Motivo</label>
            <select id="lf-motivo" v-model="form.motivo" class="select">
              <option value="">Elige una opción</option>
              <option v-for="m in motivos" :key="m.id" :value="m.id">{{ m.label }}</option>
            </select>
          </div>
        </template>

        <div class="field lead-form__full">
          <label for="lf-mensaje">
            {{ isDemo ? 'Algo que debamos saber' : 'Mensaje' }}
            <span v-if="isDemo" class="hint">(opcional)</span>
          </label>
          <textarea
            id="lf-mensaje"
            v-model="form.mensaje"
            class="textarea"
            :aria-invalid="!!errors.mensaje"
            :placeholder="
              isDemo
                ? 'Qué usas ahora, qué no funciona, cuándo abres…'
                : 'Cuéntanos en qué podemos ayudarte'
            "
          />
          <span v-if="errors.mensaje" class="form-error">{{ errors.mensaje }}</span>
        </div>

        <div class="field lead-form__full">
          <label class="lead-form__consent">
            <input v-model="form.consentimiento" type="checkbox" />
            <span>
              He leído la <a href="/legal/privacidad">política de privacidad</a> y acepto que
              alaCarta use estos datos para responder a mi solicitud.
            </span>
          </label>
          <span v-if="errors.consentimiento" class="form-error">{{ errors.consentimiento }}</span>
        </div>

        <!-- Honeypot -->
        <div class="lead-form__hp" aria-hidden="true">
          <label for="lf-web">Web</label>
          <input id="lf-web" v-model="form.web" type="text" tabindex="-1" autocomplete="off" />
        </div>
      </div>

      <div class="lead-form__actions">
        <button type="submit" class="btn is-primary is-lg" :disabled="status === 'sending'">
          {{ status === 'sending' ? 'Enviando…' : isDemo ? 'Solicitar la demo' : 'Enviar mensaje' }}
        </button>
        <p class="hint">
          Respondemos en menos de {{ REPLY_HOURS }} horas laborables. Sin compromiso.
        </p>
      </div>

      <div v-if="status === 'noendpoint'" class="notice" role="status">
        El envío automático aún no está configurado en este entorno.
        <a :href="mailto">Envíanos el mensaje por correo</a> y te contestamos igual.
      </div>
      <div v-if="status === 'error'" class="notice is-danger" role="alert">
        No se ha podido enviar ({{ errorText }}). <a :href="mailto">Escríbenos por correo</a> o
        inténtalo de nuevo en unos minutos.
      </div>
    </form>
  </div>
</template>

<style scoped>
.lead-form__form {
  display: grid;
  gap: var(--space-6);
}
.lead-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}
.lead-form__full {
  grid-column: 1 / -1;
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
  margin-bottom: var(--space-2);
}
.lead-form__checks {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.lead-form__check {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  font-size: var(--text-sm);
  cursor: pointer;
}
.lead-form__check:has(input:checked) {
  border-color: var(--color-ink);
  background: var(--color-bg-muted);
}
.lead-form__check input {
  accent-color: var(--black);
}
.lead-form__consent {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: var(--weight-regular);
}
.lead-form__consent input {
  margin-top: 0.25rem;
  accent-color: var(--black);
}
.lead-form__consent a {
  text-decoration: underline;
  color: var(--color-text-strong);
}
.lead-form__hp {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.lead-form__actions {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  flex-wrap: wrap;
}
.lead-form__actions .hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.lead-form__done {
  font-size: var(--text-base);
}
.notice a {
  text-decoration: underline;
  font-weight: var(--weight-medium);
}
@media (max-width: 640px) {
  .lead-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
