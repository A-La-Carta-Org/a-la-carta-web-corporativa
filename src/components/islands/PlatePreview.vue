<script setup lang="ts">
/**
 * D8 · Vista previa configurable de la placa QR (docs/auditoria/08 y 10). Acabado, formato,
 * nombre del local, número de mesa y NFC. El QR llega por el slot, generado en build
 * (`QrCode.astro`), y abre la carta de ejemplo: funciona de verdad.
 *
 * El botón «Las quiero con mi alta» lleva la selección al formulario
 * (`?modulo=placas-qr&origen=placas-configurador&config=placa:negro;formato:…`).
 *
 * Sin JavaScript se ve la placa de ejemplo y el botón con la configuración por defecto; los
 * controles salen desactivados para no prometer lo que no responde.
 */
import { computed, onMounted, reactive, ref } from 'vue';
import {
  plateDefaults,
  plateFormats,
  plateMaterials,
  plateSummary,
  type PlateFormat,
  type PlateMaterial,
} from '@/data/hardware';
import { ctaHref } from '@/lib/cta';

const props = defineProps<{
  /** Enlace a la carta de ejemplo para quien está en el móvil (no puede escanear su pantalla) */
  cartaHref: string;
}>();

const ready = ref(false);
onMounted(() => {
  ready.value = true;
});

const plate = reactive({
  brand: plateDefaults.brand,
  table: plateDefaults.table as number | string,
  material: plateDefaults.material as PlateMaterial,
  format: plateDefaults.format as PlateFormat,
  nfc: plateDefaults.nfc,
});

const tableLabel = computed(() => {
  const n = String(plate.table).trim();
  return n ? `Mesa ${n}` : 'Mesa';
});
const brandLabel = computed(() => plate.brand.trim() || 'Tu local');
const materialLabel = computed(
  () => plateMaterials.find((m) => m.id === plate.material)?.label ?? ''
);
const formatLabel = computed(() => plateFormats.find((f) => f.id === plate.format)?.label ?? '');

const href = computed(() =>
  ctaHref({
    to: 'demo',
    modulo: 'placas-qr',
    origen: 'placas-configurador',
    config: plateSummary(plate),
  })
);
</script>

<template>
  <div class="pp">
    <div class="pp__stage">
      <figure
        class="pp__plate"
        :class="[`is-${plate.material}`, `is-${plate.format}`]"
        :aria-label="`Vista previa: placa ${materialLabel.toLowerCase()}, ${formatLabel.toLowerCase()}, ${brandLabel}, ${tableLabel.toLowerCase()}${plate.nfc ? ', con NFC' : ''}`"
      >
        <div class="pp__face">
          <p class="pp__brand">{{ brandLabel }}</p>
          <div class="pp__qr"><slot /></div>
          <Transition name="pp-in">
            <p :key="String(plate.nfc)" class="pp__hint">
              {{ plate.nfc ? 'Escanea o acerca el móvil' : 'Escanea para ver la carta y pedir' }}
            </p>
          </Transition>
          <p class="pp__table">{{ tableLabel }}</p>
          <Transition name="t-pop">
            <span v-if="plate.nfc" class="pp__nfc" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
                <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
                <path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" />
                <path d="M16.37 2a20.16 20.16 0 0 1 0 20" />
              </svg>
            </span>
          </Transition>
        </div>
        <Transition name="pp-base">
          <div v-if="plate.format !== 'adhesiva'" class="pp__base" aria-hidden="true"></div>
        </Transition>
      </figure>
      <p class="pp__caption">
        <span class="pp__desk">El QR funciona: escanéalo y abre la carta de ejemplo.</span>
        <a :href="props.cartaHref" class="link-arrow pp__mobile">Abrir la carta de ejemplo</a>
      </p>
    </div>

    <form class="pp__controls" novalidate @submit.prevent>
      <div class="pp__row">
        <div class="field">
          <label for="pp-brand">Nombre del local</label>
          <input
            id="pp-brand"
            v-model="plate.brand"
            class="input"
            type="text"
            maxlength="24"
            autocomplete="organization"
            :disabled="!ready"
          />
        </div>
        <div class="field pp__table-field">
          <label for="pp-table">Mesa</label>
          <input
            id="pp-table"
            v-model="plate.table"
            class="input"
            type="number"
            inputmode="numeric"
            min="1"
            max="999"
            :disabled="!ready"
          />
        </div>
      </div>

      <fieldset class="pp__group" :disabled="!ready">
        <legend>Acabado</legend>
        <div class="pp__seg">
          <label
            v-for="m in plateMaterials"
            :key="m.id"
            class="pp__opt"
            :class="{ 'is-on': plate.material === m.id }"
          >
            <input v-model="plate.material" type="radio" name="pp-material" :value="m.id" />
            <span class="pp__swatch" :class="`is-${m.id}`" aria-hidden="true"></span>
            <span>{{ m.label }}</span>
          </label>
        </div>
      </fieldset>

      <fieldset class="pp__group" :disabled="!ready">
        <legend>Formato</legend>
        <div class="pp__seg">
          <label
            v-for="f in plateFormats"
            :key="f.id"
            class="pp__opt is-stacked"
            :class="{ 'is-on': plate.format === f.id }"
          >
            <input v-model="plate.format" type="radio" name="pp-format" :value="f.id" />
            <span class="pp__opt-text">
              <span>{{ f.label }}</span>
              <span class="pp__opt-hint">{{ f.text }}</span>
            </span>
          </label>
        </div>
      </fieldset>

      <label class="pp__check">
        <input v-model="plate.nfc" type="checkbox" :disabled="!ready" />
        <span>
          Con NFC
          <span class="pp__opt-hint"
            >El cliente acerca el móvil y se abre la carta, sin cámara.</span
          >
        </span>
      </label>

      <div class="pp__cta">
        <a :href="href" class="btn is-primary is-lg">Las quiero con mi alta</a>
        <p class="pp__note">
          Vista previa orientativa. Cada placa tuya lleva su propio QR, que abre tu carta en esa
          mesa. Precio en tu propuesta.
        </p>
      </div>
    </form>
  </div>
</template>

<style scoped>
.pp {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: var(--space-12);
  align-items: center;
}

/* ── Placa ── */
.pp__stage {
  display: grid;
  justify-items: center;
  gap: var(--space-6);
  padding: var(--space-10) var(--space-6);
  border-radius: var(--radius-xl);
  background: var(--color-bg-muted);
  min-height: 27rem;
  align-content: center;
}
.pp__plate {
  display: grid;
  justify-items: center;
  margin: 0;
}
.pp__face {
  position: relative;
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  width: 15rem;
  padding: var(--space-6) var(--space-5) var(--space-5);
  border-radius: var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-sm);
  box-shadow: var(--shadow-device);
  transition:
    background-color var(--dur-slow) var(--ease),
    color var(--dur-slow) var(--ease),
    box-shadow var(--dur-slow) var(--ease),
    border-radius var(--dur) var(--ease);
}
.pp__brand {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-display);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-snug);
  font-size: var(--text-lg);
}
.pp__qr {
  padding: var(--space-3);
  background: var(--white);
  border-radius: var(--radius-md);
  line-height: 0;
  /* Solo el marco cambia: el QR no se escala ni se difumina, siempre nítido */
  transition: box-shadow var(--dur-slow) var(--ease);
}
.pp__hint {
  font-size: var(--text-xs);
  transition: color var(--dur-slow) var(--ease);
}
.pp__table {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
}
.pp__nfc {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  line-height: 0;
  opacity: 0.8;
}
.pp__base {
  width: 17rem;
  height: 0.75rem;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  background: var(--gray-800);
  transition:
    height var(--dur) var(--ease),
    width var(--dur) var(--ease),
    border-radius var(--dur) var(--ease),
    background-color var(--dur-slow) var(--ease);
}

/* Acabados */
.is-negro .pp__face {
  background: var(--black);
  color: var(--white);
}
.is-negro .pp__hint {
  color: var(--gray-300);
}
.is-blanco .pp__face {
  background: var(--white);
  color: var(--black);
  box-shadow:
    inset 0 0 0 1px var(--gray-200),
    var(--shadow-device);
}
.is-blanco .pp__qr {
  box-shadow: inset 0 0 0 1px var(--gray-200);
}
.is-blanco .pp__hint {
  color: var(--gray-500);
}
.is-madera .pp__face {
  background: var(--wood-300);
  color: var(--black);
}
.is-madera .pp__hint {
  color: var(--wood-700);
}
.is-madera .pp__base {
  background: var(--wood-700);
}

/* Formatos */
.is-adhesiva .pp__face {
  border-radius: var(--radius-lg);
}
.is-terraza .pp__face {
  border-radius: var(--radius-sm);
}
.is-terraza .pp__base {
  width: 18.5rem;
  height: 1.75rem;
  border-radius: var(--radius-sm);
}

.pp__caption {
  display: grid;
  justify-items: center;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-align: center;
}
.pp__mobile {
  display: none;
}

/* ── Controles ── */
.pp__controls {
  display: grid;
  gap: var(--space-6);
}
.pp__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 7rem;
  gap: var(--space-4);
}
.pp__group {
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
  display: grid;
  gap: var(--space-3);
}
.pp__group legend {
  padding: 0;
  margin-bottom: var(--space-3);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
}
.pp__seg {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-2);
}
.pp__opt {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
  cursor: pointer;
  transition:
    border-color var(--dur) var(--ease),
    box-shadow var(--dur) var(--ease);
}
.pp__opt.is-stacked {
  align-items: flex-start;
}
.pp__opt:hover {
  border-color: var(--gray-400);
}
.pp__opt.is-on {
  border-color: var(--color-ink);
  box-shadow: inset 0 0 0 1px var(--color-ink);
}
.pp__opt input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}
.pp__opt:has(input:focus-visible) {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}
.pp__group:disabled .pp__opt,
.pp__check:has(input:disabled) {
  cursor: default;
  opacity: 0.7;
}
.pp__swatch {
  flex: 0 0 auto;
  width: 1rem;
  height: 1rem;
  border-radius: var(--radius-xs);
  box-shadow: inset 0 0 0 1px var(--gray-300);
}
.pp__swatch.is-negro {
  background: var(--black);
}
.pp__swatch.is-blanco {
  background: var(--white);
}
.pp__swatch.is-madera {
  background: var(--wood-300);
}
.pp__opt-text {
  display: grid;
  gap: 0.15rem;
}
.pp__opt-hint {
  display: block;
  font-size: var(--text-xs);
  font-weight: var(--weight-regular);
  color: var(--color-text-muted);
}
.pp__check {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
  cursor: pointer;
}
.pp__check input {
  width: 1.05rem;
  height: 1.05rem;
  margin: 0.15rem 0 0;
  accent-color: var(--color-ink);
}
.pp__cta {
  display: grid;
  justify-items: start;
  gap: var(--space-3);
  padding-top: var(--space-5);
  border-top: 1px solid var(--color-border);
}
.pp__note {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  max-width: 34rem;
}

@media (max-width: 1024px) {
  .pp {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}
@media (max-width: 720px) {
  .pp__stage {
    min-height: 0;
    padding: var(--space-8) var(--space-4);
  }
  .pp__desk {
    display: none;
  }
  .pp__mobile {
    display: inline-flex;
  }
  .pp__seg {
    grid-template-columns: 1fr;
  }
}

/* ── Movimiento ── */
/* La peana aparece o se retira (formato adhesiva) creciendo desde la placa */
.pp-base-enter-active,
.pp-base-leave-active {
  transition:
    height var(--dur) var(--ease),
    width var(--dur) var(--ease),
    opacity var(--dur) var(--ease);
}
/* Especificidad suficiente para ganar a la peana de terraza (.is-terraza .pp__base) */
.pp__plate .pp__base.pp-base-enter-from,
.pp__plate .pp__base.pp-base-leave-to {
  height: 0;
  opacity: 0;
}
/* Texto de la placa que cambia (con o sin NFC): el nuevo entra con fundido, sin solaparse */
.pp-in-enter-active {
  transition: opacity var(--dur) var(--ease);
}
.pp-in-enter-from {
  opacity: 0;
}
.pp-in-leave-active {
  display: none;
}
</style>
