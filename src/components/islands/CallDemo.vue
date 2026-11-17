<script setup lang="ts">
/**
 * D4 · Llamada con IA de ejemplo (docs/auditoria/10), fase 1: SIN audio y sin número real. Tres
 * llamadas a La Plaza (`callScenarios` de `src/data/demo.ts`) cuya transcripción se va escribiendo;
 * al colgar aparece lo que el asistente deja en el sistema, siempre pendiente de una persona:
 * la reserva POR CONFIRMAR en el libro (y el SMS al confirmarla tú), el pedido PARA RECOGER que
 * aceptas en el TPV, o la llamada pasada al local por una alergia grave. «La IA propone, tú
 * decides.» Sin idiomas ni proveedor de voz: no están decididos (docs/auditoria/06).
 *
 * Accesible: pestañas con flechas, controles con botones reales, cada frase completa se anuncia
 * por `aria-live` (no letra a letra). Con `prefers-reduced-motion`, las frases salen enteras.
 * Sin JavaScript se ve la primera llamada completa y su resultado.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { callScenarios, prefersReducedMotion, type CallScenarioId } from '@/data/demo';
import { ctaHref } from '@/lib/cta';

const props = withDefaults(defineProps<{ origen?: string }>(), { origen: 'demo-llamada' });

const ready = ref(false);
const sel = ref<CallScenarioId>('reserva');
const shown = ref(0); // frases completas
const typed = ref(0); // letras de la frase en curso
const playing = ref(false);
const finished = ref(false);
const seconds = ref(0);
const accepted = ref(false);
const live = ref('');
let raf = 0;
let last = 0;
let wait = 0;
let reduced = false;

const scenario = computed(() => callScenarios.find((s) => s.id === sel.value)!);
const lines = computed(() => scenario.value.lines);
/** Antes de hidratar (o sin JS): la llamada entera, con su resultado */
const visible = computed(() => (ready.value ? lines.value.slice(0, shown.value) : lines.value));
const current = computed(() =>
  playing.value || shown.value < lines.value.length ? lines.value[shown.value] : undefined
);
const showResult = computed(() => !ready.value || finished.value);
const demoHref = computed(() =>
  ctaHref({ to: 'demo', modulo: 'llamadas-ia', origen: props.origen })
);
const duration = computed(
  () =>
    `${String(Math.floor(seconds.value / 60)).padStart(2, '0')}:${String(Math.floor(seconds.value % 60)).padStart(2, '0')}`
);

const CHARS_PER_S = 38;
const PAUSE = 0.7;

function tick(ts: number) {
  if (!playing.value) return;
  const dt = last ? (ts - last) / 1000 : 0;
  last = ts;
  seconds.value += dt;
  const line = lines.value[shown.value];
  if (!line) return finish();
  if (wait > 0) {
    wait -= dt;
  } else if (reduced) {
    completeLine();
    wait = 1.1;
  } else {
    typed.value = Math.min(
      line.text.length,
      typed.value + dt * CHARS_PER_S * (line.who === 'cliente' ? 0.85 : 1)
    );
    if (typed.value >= line.text.length) {
      completeLine();
      wait = PAUSE;
    }
  }
  raf = requestAnimationFrame(tick);
}

function completeLine() {
  const line = lines.value[shown.value];
  if (!line) return;
  live.value = `${line.who === 'ia' ? 'Asistente' : 'Cliente'}: ${line.text}`;
  shown.value += 1;
  typed.value = 0;
  if (shown.value >= lines.value.length) finish();
}

function finish() {
  playing.value = false;
  finished.value = true;
  cancelAnimationFrame(raf);
  live.value = resultAnnounce[sel.value];
}

const resultAnnounce: Record<CallScenarioId, string> = {
  reserva: 'Llamada terminada. La reserva está en tu libro, pendiente de que la confirmes.',
  recoger: 'Llamada terminada. El pedido para recoger espera en el TPV a que lo aceptes.',
  pregunta: 'Llamada terminada. La pregunta de alergia se ha pasado al local.',
};

function play() {
  if (finished.value) reset(false);
  playing.value = true;
  last = 0;
  raf = requestAnimationFrame(tick);
}
function pause() {
  playing.value = false;
  cancelAnimationFrame(raf);
}
function skip() {
  pause();
  seconds.value = Math.max(
    seconds.value,
    lines.value.reduce((n, l) => n + l.text.length / CHARS_PER_S + PAUSE, 0)
  );
  shown.value = lines.value.length;
  typed.value = 0;
  finish();
}
function reset(announce = true) {
  pause();
  shown.value = 0;
  typed.value = 0;
  seconds.value = 0;
  finished.value = false;
  accepted.value = false;
  wait = 0;
  if (announce) live.value = 'Llamada reiniciada.';
}

const ids = callScenarios.map((s) => s.id);
function choose(id: CallScenarioId) {
  if (id === sel.value) return;
  reset(false);
  sel.value = id;
}
function onTabKey(e: KeyboardEvent, i: number) {
  const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
  if (!dir) return;
  e.preventDefault();
  const next = ids[(i + dir + ids.length) % ids.length]!;
  choose(next);
  nextTick(() => document.getElementById(`call-tab-${next}`)?.focus());
}

function accept() {
  accepted.value = true;
  live.value =
    sel.value === 'reserva'
      ? 'Reserva confirmada. Al cliente le llega el SMS de confirmación.'
      : 'Pedido aceptado: pasa a cocina para las 21:30.';
}

onMounted(() => {
  reduced = prefersReducedMotion();
  ready.value = true;
});
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
  <div class="call" :class="{ 'is-ready': ready }">
    <div v-if="ready" class="call__tabs" role="tablist" aria-label="Llamadas de ejemplo">
      <button
        v-for="(s, i) in callScenarios"
        :id="`call-tab-${s.id}`"
        :key="s.id"
        type="button"
        role="tab"
        class="call__tab"
        :aria-selected="sel === s.id"
        aria-controls="call-panel"
        :tabindex="sel === s.id ? 0 : -1"
        @click="choose(s.id)"
        @keydown="onTabKey($event, i)"
      >
        {{ s.tab }}
      </button>
    </div>

    <div
      id="call-panel"
      class="call__stage"
      :role="ready ? 'tabpanel' : undefined"
      :aria-labelledby="ready ? `call-tab-${sel}` : undefined"
    >
      <!-- La llamada -->
      <div class="mk call__phone">
        <div class="mk-topbar">
          <span class="call__live" :class="{ 'is-on': playing }" aria-hidden="true"></span>
          <span class="mk-strong">{{
            playing ? 'En llamada' : finished || !ready ? 'Llamada terminada' : 'Llamada entrante'
          }}</span>
          <span class="mk-muted">{{ scenario.at }} · {{ scenario.caller }}</span>
          <span class="mk-right num mk-muted">{{ duration }}</span>
        </div>
        <ol class="call__talk" role="list" aria-label="Transcripción">
          <li v-for="(l, i) in visible" :key="i" class="call__msg" :class="`is-${l.who}`">
            <span class="call__who">{{ l.who === 'ia' ? 'Asistente' : 'Cliente' }}</span>
            {{ l.text }}
          </li>
          <li
            v-if="ready && playing && current"
            class="call__msg is-typing"
            :class="`is-${current.who}`"
            aria-hidden="true"
          >
            <span class="call__who">{{ current.who === 'ia' ? 'Asistente' : 'Cliente' }}</span>
            {{ current.text.slice(0, Math.floor(typed)) }}<span class="call__caret"></span>
          </li>
          <li v-if="ready && !playing && shown === 0" class="call__idle mk-muted">
            Pulsa «Reproducir» y mira cómo atiende el asistente. Sin audio: es una simulación.
          </li>
        </ol>
        <div v-if="ready" class="call__controls">
          <button v-if="!playing" type="button" class="mk-btn is-dark" @click="play">
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M7 4v16l13-8z" />
            </svg>
            {{ finished ? 'Otra vez' : shown > 0 ? 'Seguir' : 'Reproducir' }}
          </button>
          <button v-else type="button" class="mk-btn is-dark" @click="pause">
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M8 5v14M16 5v14" />
            </svg>
            Pausa
          </button>
          <button v-if="!finished" type="button" class="mk-btn" @click="skip">Ver entera</button>
          <span class="mk-pill">Simulación · sin audio</span>
        </div>
      </div>

      <!-- Lo que deja en el sistema -->
      <div class="call__result" aria-label="Lo que queda en el sistema">
        <p class="call__label">Lo que queda en tu sistema</p>
        <div v-if="!showResult" class="call__wait mk">
          <p class="mk-muted">
            Al colgar, aquí verás lo que el asistente deja en el sistema. Nada se confirma sin ti.
          </p>
        </div>

        <!-- Reserva por confirmar -->
        <div v-else-if="sel === 'reserva'" class="mk call__panel">
          <div class="mk-topbar">
            <span class="mk-strong">Reservas</span><span class="mk-right mk-muted">Sáb 22</span>
          </div>
          <div class="call__body">
            <div class="mk-row">
              <span class="num mk-muted">20:30</span>
              <span class="grow">Marta G.<span class="sub">2 pax · interior</span></span>
              <span class="mk-pill is-ok">Confirmada</span>
            </div>
            <div class="mk-row call__new">
              <span class="num mk-muted">21:00</span>
              <span class="grow"
                >Pablo M.<span class="sub">4 pax · terraza · 1 celíaco · por teléfono</span></span
              >
              <span class="mk-pill" :class="accepted ? 'is-ok' : 'is-warn'">{{
                accepted ? 'Confirmada' : 'Por confirmar'
              }}</span>
            </div>
            <div class="mk-row">
              <span class="num mk-muted">21:30</span>
              <span class="grow">Grupo Ruiz<span class="sub">6 pax · interior</span></span>
              <span class="mk-pill is-ok">Confirmada</span>
            </div>
            <div v-if="!accepted" class="call__btns">
              <button type="button" class="mk-btn is-dark" :disabled="!ready" @click="accept">
                Confirmar la de las 21:00
              </button>
            </div>
            <div v-else class="call__sms">
              <span class="mk-muted">SMS que recibe Pablo</span>
              <p>
                La Plaza: reserva confirmada para 4 personas el sábado 22 a las 21:00, en terraza.
                Si no podéis venir, anúlala con un toque desde este mensaje.
              </p>
            </div>
          </div>
        </div>

        <!-- Pedido para recoger por aceptar -->
        <div v-else-if="sel === 'recoger'" class="mk call__panel">
          <div class="mk-topbar">
            <span class="mk-strong">TPV · Pedidos</span
            ><span class="mk-right mk-muted">por aceptar</span>
          </div>
          <div class="call__body">
            <div class="mk-row">
              <span class="grow mk-strong"
                >Recogida · Lucía<span class="sub">por teléfono · para las 21:30</span></span
              >
              <span class="mk-pill" :class="accepted ? 'is-ok' : 'is-warn'">{{
                accepted ? 'Aceptado' : 'Pendiente'
              }}</span>
            </div>
            <div class="mk-row">
              <span class="num mk-muted">2</span><span class="grow">Croquetas de jamón</span
              ><span class="num">18,00</span>
            </div>
            <div class="mk-row">
              <span class="num mk-muted">1</span><span class="grow">Bravas de la casa</span
              ><span class="num">7,50</span>
            </div>
            <div class="mk-row">
              <span class="grow mk-strong">Total</span><span class="num mk-strong">25,50 €</span>
            </div>
            <div v-if="!accepted" class="call__btns">
              <button type="button" class="mk-btn is-dark" :disabled="!ready" @click="accept">
                Aceptar el pedido
              </button>
              <span class="mk-muted">Si nadie lo acepta, caduca y no llega a cocina.</span>
            </div>
            <p v-else class="call__done">
              Aceptado: entra en la pantalla de cocina con su hora de recogida.
            </p>
          </div>
        </div>

        <!-- Pregunta: pasada al local -->
        <div v-else class="mk call__panel">
          <div class="mk-topbar">
            <span class="mk-strong">Llamadas de hoy</span>
          </div>
          <div class="call__body">
            <div class="mk-row call__new">
              <span class="num mk-muted">19:58</span>
              <span class="grow"
                >Horario del domingo y alergia al gluten<span class="sub"
                  >Horario respondido con tus datos. Alergia grave: pasada a una persona.</span
                ></span
              >
              <span class="mk-pill">Pasada al local</span>
            </div>
            <div class="mk-row">
              <span class="num mk-muted">19:40</span>
              <span class="grow"
                >Grupo de 14 personas<span class="sub"
                  >Grupo grande: pasada a una persona.</span
                ></span
              >
              <span class="mk-pill">Pasada al local</span>
            </div>
            <p class="call__done is-soft">
              Responde con la carta y el horario del sistema; ante una alergia grave, una queja o un
              grupo grande, pasa la llamada al local.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="call__close">
      <p>
        <b>La IA propone, tú decides.</b> Llamadas con IA está en camino: esto es una simulación sin
        audio, con un restaurante ficticio. ¿Te contamos cómo atendería tu teléfono?
      </p>
      <a :href="demoHref" class="link-arrow">Solicitar demo <span aria-hidden="true">→</span></a>
    </div>
    <p class="sr-only" role="status" aria-live="polite">{{ live }}</p>
  </div>
</template>

<style scoped>
.call {
  display: grid;
  gap: var(--space-6);
}
.call svg {
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.call .mk {
  --mk-fs: 12.5px;
  user-select: auto;
}
.call .mk-btn {
  font: inherit;
  font-weight: 500;
  min-height: 2.25rem;
  cursor: pointer;
}
.call .mk-btn:disabled {
  opacity: 0.5;
}
.call__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.call__tab {
  min-height: 2.5rem;
  padding: 0 var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--white);
  font: inherit;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
  cursor: pointer;
}
.call__tab[aria-selected='true'] {
  background: var(--black);
  border-color: var(--black);
  color: var(--white);
}
.call__stage {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: var(--space-6);
  align-items: start;
}
.call__phone,
.call__panel,
.call__wait {
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-device);
}
.call__wait {
  padding: var(--space-6);
  box-shadow: none;
  border-style: dashed;
  background: var(--gray-50);
}
.call__live {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--gray-300);
}
.call__live.is-on {
  background: var(--color-ok);
}
.call__talk {
  display: grid;
  gap: 8px;
  align-content: start;
  min-height: 21rem;
  padding: 12px;
}
.call__msg {
  max-width: 88%;
  padding: 8px 10px;
  border-radius: 12px 12px 12px 3px;
  background: var(--gray-100);
  line-height: 1.45;
}
.call__msg.is-cliente {
  justify-self: end;
  border-radius: 12px 12px 3px 12px;
  background: var(--white);
  border: 1px solid var(--gray-200);
}
.call__who {
  display: block;
  font-size: 10.5px;
  font-weight: 500;
  color: var(--gray-500);
}
.call__caret {
  display: inline-block;
  width: 1px;
  height: 1em;
  margin-left: 1px;
  vertical-align: -2px;
  background: var(--gray-700);
}
.call__idle {
  padding: 24px 12px;
  text-align: center;
}
.call__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
}
.call__controls .mk-pill {
  margin-left: auto;
}
.call__label {
  margin-bottom: var(--space-3);
  font-family: var(--font-display);
  font-weight: var(--weight-semibold);
}
.call__body {
  padding: 4px 12px 12px;
}
.call__new {
  margin-inline: -12px;
  padding-inline: 12px;
  background: var(--gray-50);
}
.call__btns {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
}
.call__sms {
  display: grid;
  gap: 4px;
  margin-top: 10px;
}
.call__sms p {
  padding: 10px 12px;
  border-radius: 12px 12px 12px 3px;
  background: var(--gray-100);
  line-height: 1.45;
}
.call__done {
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--color-ok-soft);
  color: var(--color-ok);
  line-height: 1.45;
}
.call__done.is-soft {
  background: var(--gray-50);
  color: var(--gray-700);
}
.call__close {
  display: grid;
  gap: var(--space-2);
  justify-items: start;
}
@media (max-width: 860px) {
  .call__stage {
    grid-template-columns: minmax(0, 1fr);
  }
  .call__talk {
    min-height: 0;
  }
}
</style>
