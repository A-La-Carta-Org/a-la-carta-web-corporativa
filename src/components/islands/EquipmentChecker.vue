<script setup lang="ts">
/**
 * Comprobador de equipo de /hardware (docs/auditoria/08): cuatro preguntas → «te sirve / lo
 * revisamos / te falta» → botón que lleva al formulario de demo con el resultado en la URL
 * (`?modulo=hardware&origen=comprobador-hardware&equipo=…`).
 *
 * Accesible con teclado: cada pregunta es un `fieldset` con radios nativos, Intro avanza, el foco
 * pasa al título de cada paso. Sin JavaScript (o antes de hidratar) se ve la lista de preguntas
 * y un enlace a la demo, que es el mismo camino.
 */
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import {
  checkerQuestions,
  evaluateEquipment,
  verdictLabels,
  type CheckerAnswers,
} from '@/data/hardware';
import { ctaHref } from '@/lib/cta';

const props = withDefaults(defineProps<{ origen?: string }>(), {
  origen: 'comprobador-hardware',
});
const ORIGEN = props.origen;
const total = checkerQuestions.length;

const ready = ref(false);
const step = ref(0);
const answers = reactive<CheckerAnswers>({});
const heading = ref<HTMLElement | null>(null);

onMounted(() => {
  ready.value = true;
});

const question = computed(() => checkerQuestions[step.value]);
const done = computed(() => step.value >= total);
const canNext = computed(() => {
  const q = question.value;
  if (!q) return false;
  return q.kind === 'text' || Boolean(answers[q.id]);
});
const result = computed(() => (done.value ? evaluateEquipment(answers) : null));

const fallbackHref = ctaHref({ to: 'demo', modulo: 'hardware', origen: ORIGEN });
const resultHref = computed(() =>
  result.value
    ? ctaHref({ to: 'demo', modulo: 'hardware', origen: ORIGEN, equipo: result.value.summary })
    : fallbackHref
);

async function focusHeading() {
  await nextTick();
  heading.value?.focus();
}

function next() {
  if (!canNext.value) return;
  step.value += 1;
  focusHeading();
}

function back() {
  if (step.value === 0) return;
  step.value -= 1;
  focusHeading();
}

function restart() {
  (Object.keys(answers) as (keyof CheckerAnswers)[]).forEach((k) => delete answers[k]);
  step.value = 0;
  focusHeading();
}
</script>

<template>
  <div class="eqc">
    <!-- Sin JS / antes de hidratar: las preguntas y el mismo destino -->
    <div v-if="!ready" class="eqc__fallback">
      <p class="eqc__progress">Cuatro preguntas</p>
      <ol class="eqc__list">
        <li v-for="q in checkerQuestions" :key="q.id">{{ q.title }}</li>
      </ol>
      <p class="eqc__help">
        Respóndelas al pedir la demo y te decimos qué te sirve y qué te falta.
      </p>
      <a :href="fallbackHref" class="btn is-primary">Contarnos qué equipo tengo</a>
    </div>

    <form v-else-if="!done && question" class="eqc__step" novalidate @submit.prevent="next">
      <div class="eqc__head">
        <p class="eqc__progress">Pregunta {{ step + 1 }} de {{ total }}</p>
        <div class="eqc__bar" aria-hidden="true">
          <span v-for="i in total" :key="i" :class="{ 'is-on': i <= step + 1 }"></span>
        </div>
      </div>

      <fieldset class="eqc__fieldset">
        <legend class="eqc__title">
          <span ref="heading" tabindex="-1" class="eqc__focus">{{ question.title }}</span>
        </legend>
        <p v-if="question.help" :id="`eqc-help-${question.id}`" class="eqc__help">
          {{ question.help }}
        </p>

        <div v-if="question.kind === 'choice'" class="eqc__options">
          <label
            v-for="opt in question.options"
            :key="opt.id"
            class="eqc__opt"
            :class="{ 'is-on': answers[question.id] === opt.id }"
          >
            <input
              v-model="answers[question.id]"
              type="radio"
              :name="`eqc-${question.id}`"
              :value="opt.id"
              :aria-describedby="question.help ? `eqc-help-${question.id}` : undefined"
            />
            <span class="eqc__opt-text">
              <span class="eqc__opt-label">{{ opt.label }}</span>
              <span v-if="opt.hint" class="eqc__opt-hint">{{ opt.hint }}</span>
            </span>
          </label>
        </div>

        <div v-else class="field eqc__field">
          <label :for="`eqc-${question.id}`">{{ question.fieldLabel }}</label>
          <input
            :id="`eqc-${question.id}`"
            v-model="answers[question.id]"
            class="input"
            type="text"
            maxlength="60"
            autocomplete="off"
            :aria-describedby="question.help ? `eqc-help-${question.id}` : undefined"
          />
        </div>
      </fieldset>

      <div class="eqc__actions">
        <button v-if="step > 0" type="button" class="btn is-ghost" @click="back">Atrás</button>
        <button type="submit" class="btn is-primary" :disabled="!canNext">
          {{ step === total - 1 ? 'Ver el resultado' : 'Siguiente' }}
        </button>
      </div>
    </form>

    <div v-else-if="result" class="eqc__result" :class="`is-${result.verdict}`">
      <div class="eqc__head">
        <p class="eqc__progress">Resultado</p>
        <div class="eqc__bar" aria-hidden="true">
          <span v-for="i in total" :key="i" class="is-on"></span>
        </div>
      </div>
      <h3 class="eqc__title">
        <span ref="heading" tabindex="-1" class="eqc__focus">{{ result.title }}</span>
      </h3>
      <p class="eqc__help">{{ result.text }}</p>

      <ul class="eqc__lines">
        <li v-for="line in result.lines" :key="line.name" class="eqc__line">
          <span class="eqc__verdict" :class="`is-${line.verdict}`">
            {{ verdictLabels[line.verdict] }}
          </span>
          <span class="eqc__line-body">
            <strong>{{ line.name }}</strong>
            <span>{{ line.text }}</span>
          </span>
        </li>
      </ul>

      <p class="eqc__suggestion">{{ result.suggestion }}</p>

      <div class="eqc__actions">
        <a :href="resultHref" class="btn is-primary">Pedir propuesta con este equipo</a>
        <button type="button" class="btn is-ghost" @click="restart">Volver a empezar</button>
      </div>
      <p class="eqc__note">Te llevamos al formulario con tus respuestas ya anotadas.</p>
    </div>
  </div>
</template>

<style scoped>
.eqc {
  display: grid;
  gap: var(--space-5);
  padding: var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  min-height: 25rem;
  align-content: start;
}
.eqc__fallback,
.eqc__step,
.eqc__result {
  display: grid;
  gap: var(--space-5);
  align-content: start;
}
.eqc__fallback .btn {
  justify-self: start;
}
.eqc__head {
  display: grid;
  gap: var(--space-2);
}
.eqc__progress {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-muted);
}
.eqc__bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-1);
}
.eqc__bar span {
  height: 3px;
  border-radius: var(--radius-pill);
  background: var(--color-border);
  transition: background var(--dur) var(--ease);
}
.eqc__bar span.is-on {
  background: var(--color-ink);
}
.eqc__fieldset {
  border: 0;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--space-3);
  min-width: 0;
}
.eqc__title {
  padding: 0;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-snug);
  color: var(--color-text-strong);
  line-height: var(--leading-snug);
}
.eqc__focus:focus {
  outline: none;
}
.eqc__focus:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}
.eqc__help {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
.eqc__list {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding-left: 1.25rem;
  list-style: decimal;
  font-size: var(--text-sm);
  color: var(--color-text);
}
.eqc__options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
  margin-top: var(--space-2);
}
.eqc__opt {
  position: relative;
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  padding: var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    border-color var(--dur-fast) var(--ease),
    background var(--dur-fast) var(--ease);
}
.eqc__opt:hover {
  border-color: var(--gray-400);
}
.eqc__opt.is-on {
  border-color: var(--color-ink);
  background: var(--color-bg-soft);
  box-shadow: inset 0 0 0 1px var(--color-ink);
}
.eqc__opt input {
  flex: 0 0 auto;
  width: 1.05rem;
  height: 1.05rem;
  margin: 0.1rem 0 0;
  accent-color: var(--color-ink);
}
.eqc__opt:has(input:focus-visible) {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}
.eqc__opt-text {
  display: grid;
  gap: 0.15rem;
}
.eqc__opt-label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
}
.eqc__opt-hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.eqc__field {
  margin-top: var(--space-2);
}
.eqc__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
}
.eqc__actions .btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.eqc__lines {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-border);
}
.eqc__line {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  gap: var(--space-4);
  align-items: start;
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border);
  font-size: var(--text-sm);
}
.eqc__line-body {
  display: grid;
  gap: var(--space-1);
  color: var(--color-text-muted);
}
.eqc__line-body strong {
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
}
.eqc__verdict {
  justify-self: start;
  padding: 0.15rem 0.55rem;
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  white-space: nowrap;
}
.eqc__verdict.is-sirve {
  background: var(--color-ok-soft);
  color: var(--color-ok);
}
.eqc__verdict.is-revisar {
  background: var(--color-warn-soft);
  color: var(--color-warn);
}
.eqc__verdict.is-falta {
  background: var(--color-bg-muted);
  color: var(--color-text-strong);
}
.eqc__suggestion {
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
}
.eqc__note {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
@media (max-width: 640px) {
  .eqc {
    padding: var(--space-5);
  }
  .eqc__options {
    grid-template-columns: 1fr;
  }
  .eqc__line {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}
</style>
