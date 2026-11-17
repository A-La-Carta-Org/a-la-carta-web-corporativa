<script setup lang="ts">
/**
 * D6 · Calculadora de comisiones (docs/auditoria/10 y 13). Cuánto se va al año en comisiones
 * por pedido (agregadores), por comensal (portales de reservas) y por pago con QR, y cuánto
 * costaría el canal propio con alaCarta (cuota fija, sin comisión).
 *
 * Dos tamaños: completo (`/herramientas/calculadora-comisiones`) y `compact` (en /precios y en
 * el momento «dejar las comisiones»): solo pedidos a domicilio.
 *
 * Los porcentajes por defecto son orientativos y llevan su fuente al lado. Sin backend ni
 * almacenamiento; sin JavaScript se ve un ejemplo calculado con los valores por defecto.
 */
import { computed, onMounted, reactive, ref } from 'vue';
import { addonModules, fmtPrice, getPlan } from '@/data/pricing';
import { ctaHref } from '@/lib/cta';

const props = withDefaults(
  defineProps<{
    compact?: boolean;
    origen?: string;
    /** Rango habitual de comisión de los agregadores y su fuente (se pinta junto al control) */
    range?: { min: number; max: number; source: string };
  }>(),
  {
    compact: false,
    origen: 'calculadora',
    range: () => ({ min: 14, max: 30, source: '' }),
  }
);

const ready = ref(false);
onMounted(() => {
  ready.value = true;
});

const v = reactive({
  orders: 300,
  ticket: 25,
  rate: 25,
  covers: 0,
  perCover: 0,
  qrPayments: 0,
  qrTicket: 30,
  qrRate: 4,
  qrFixed: 0.2,
  shift: 30,
});

const clampNum = (n: number, min: number, max: number) =>
  Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
function setNum(key: keyof typeof v, ev: Event, min: number, max: number) {
  v[key] = clampNum(Number((ev.target as HTMLInputElement).value), min, max);
}

const pedidos = addonModules.find((m) => m.module === 'pedidos-online')!;
const reservas = addonModules.find((m) => m.module === 'reservas')!;
const completo = getPlan('completo');

const r = computed(() => {
  const delivery = v.orders * v.ticket * (v.rate / 100) * 12;
  const bookings = props.compact ? 0 : v.covers * v.perCover * 12;
  const qr = props.compact ? 0 : v.qrPayments * (v.qrTicket * (v.qrRate / 100) + v.qrFixed) * 12;
  const totalYear = delivery + bookings + qr;
  // Con el canal propio: deja de pagar la parte que se pasa (pedidos y reservas) y todo el QR
  const saved = (delivery + bookings) * (v.shift / 100) + qr;
  // Lo que cuesta el canal propio sobre el Esencial (la carta QR va en todos los planes)
  const ownMonthly = (v.orders > 0 ? pedidos.monthly : 0) + (bookings > 0 ? reservas.monthly : 0);
  const ownYear = ownMonthly * 12;
  return { delivery, bookings, qr, totalYear, saved, ownMonthly, ownYear, net: saved - ownYear };
});

const money = (n: number) =>
  `${Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €`;

const leadHref = computed(() =>
  ctaHref({
    to: 'demo',
    motivo: 'comisiones',
    config: `comisiones_p${v.orders}_t${v.ticket}_c${v.rate}_s${v.shift}`,
    origen: props.origen,
  })
);
const fullHref = ctaHref({ to: 'calculadora', origen: props.origen });
</script>

<template>
  <div class="cc" :class="{ 'is-compact': compact }">
    <form class="cc__inputs" novalidate @submit.prevent>
      <fieldset class="cc__group">
        <legend>Pedidos a domicilio por agregadores</legend>
        <div class="cc__field">
          <label :for="`cc-orders-${origen}`">Pedidos al mes</label>
          <input
            :id="`cc-orders-${origen}`"
            class="input cc__num"
            type="number"
            inputmode="numeric"
            min="0"
            max="20000"
            :value="v.orders"
            :disabled="!ready"
            @input="setNum('orders', $event, 0, 20000)"
          />
        </div>
        <div class="cc__field">
          <label :for="`cc-ticket-${origen}`">Ticket medio (€)</label>
          <input
            :id="`cc-ticket-${origen}`"
            class="input cc__num"
            type="number"
            inputmode="decimal"
            min="1"
            max="500"
            :value="v.ticket"
            :disabled="!ready"
            @input="setNum('ticket', $event, 1, 500)"
          />
        </div>
        <div class="cc__field is-range">
          <label :for="`cc-rate-${origen}`">
            Comisión del agregador <output class="num">{{ v.rate }} %</output>
          </label>
          <input
            :id="`cc-rate-${origen}`"
            class="cc__range"
            type="range"
            min="5"
            max="40"
            step="1"
            :value="v.rate"
            :disabled="!ready"
            :aria-describedby="`cc-rate-help-${origen}`"
            @input="setNum('rate', $event, 5, 40)"
          />
          <small :id="`cc-rate-help-${origen}`" class="cc__help">
            Lo habitual va del {{ range.min }} % al {{ range.max }} % según el plan y si reparte la
            plataforma. Tu contrato manda.<template v-if="range.source">
              Fuente: {{ range.source }}.</template
            >
          </small>
        </div>
      </fieldset>

      <template v-if="!compact">
        <fieldset class="cc__group">
          <legend>Reservas que pagan por comensal</legend>
          <div class="cc__field">
            <label :for="`cc-covers-${origen}`">Comensales al mes con reserva de portal</label>
            <input
              :id="`cc-covers-${origen}`"
              class="input cc__num"
              type="number"
              inputmode="numeric"
              min="0"
              max="20000"
              :value="v.covers"
              :disabled="!ready"
              @input="setNum('covers', $event, 0, 20000)"
            />
          </div>
          <div class="cc__field">
            <label :for="`cc-percover-${origen}`">Coste por comensal (€)</label>
            <input
              :id="`cc-percover-${origen}`"
              class="input cc__num"
              type="number"
              inputmode="decimal"
              min="0"
              max="50"
              step="0.5"
              :value="v.perCover"
              :disabled="!ready"
              @input="setNum('perCover', $event, 0, 50)"
            />
          </div>
          <small class="cc__help">
            Mira tu última factura: no hay un precio público único por comensal. Si no pagas por
            reserva, déjalo en 0.
          </small>
        </fieldset>

        <fieldset class="cc__group">
          <legend>Pagos con QR que llevan comisión</legend>
          <div class="cc__field">
            <label :for="`cc-qr-${origen}`">Pagos con QR al mes</label>
            <input
              :id="`cc-qr-${origen}`"
              class="input cc__num"
              type="number"
              inputmode="numeric"
              min="0"
              max="20000"
              :value="v.qrPayments"
              :disabled="!ready"
              @input="setNum('qrPayments', $event, 0, 20000)"
            />
          </div>
          <div class="cc__field">
            <label :for="`cc-qrt-${origen}`">Importe medio (€)</label>
            <input
              :id="`cc-qrt-${origen}`"
              class="input cc__num"
              type="number"
              inputmode="decimal"
              min="1"
              max="500"
              :value="v.qrTicket"
              :disabled="!ready"
              @input="setNum('qrTicket', $event, 1, 500)"
            />
          </div>
          <div class="cc__field">
            <label :for="`cc-qrr-${origen}`">Comisión de la plataforma (%)</label>
            <input
              :id="`cc-qrr-${origen}`"
              class="input cc__num"
              type="number"
              inputmode="decimal"
              min="0"
              max="15"
              step="0.1"
              :value="v.qrRate"
              :disabled="!ready"
              @input="setNum('qrRate', $event, 0, 15)"
            />
          </div>
          <div class="cc__field">
            <label :for="`cc-qrf-${origen}`">Fijo por pago (€)</label>
            <input
              :id="`cc-qrf-${origen}`"
              class="input cc__num"
              type="number"
              inputmode="decimal"
              min="0"
              max="2"
              step="0.05"
              :value="v.qrFixed"
              :disabled="!ready"
              @input="setNum('qrFixed', $event, 0, 2)"
            />
          </div>
          <small class="cc__help">
            Por defecto, 4 % + 0,20 €: la tarifa pública de un TPV del mercado para pagos con QR,
            aparte de la pasarela. Con alaCarta solo pagas la de tu pasarela.
          </small>
        </fieldset>
      </template>

      <fieldset class="cc__group">
        <legend>Tu canal propio</legend>
        <div class="cc__field is-range">
          <label :for="`cc-shift-${origen}`">
            Pedidos {{ compact ? '' : 'y reservas ' }}que pasan a tu canal
            <output class="num">{{ v.shift }} %</output>
          </label>
          <input
            :id="`cc-shift-${origen}`"
            class="cc__range"
            type="range"
            min="0"
            max="100"
            step="5"
            :value="v.shift"
            :disabled="!ready"
            @input="setNum('shift', $event, 0, 100)"
          />
          <small class="cc__help">
            No todos se pasan: quien te descubre en un agregador seguirá ahí. Quien ya te conoce,
            puede pedir directo.
          </small>
        </div>
      </fieldset>
    </form>

    <div class="cc__out">
      <div class="cc__ticket">
        <p class="cc__head">Comisiones al año</p>
        <dl>
          <div class="cc__row">
            <dt>Pedidos por agregadores</dt>
            <dd>{{ money(r.delivery) }}</dd>
          </div>
          <template v-if="!compact">
            <div class="cc__row">
              <dt>Reservas por comensal</dt>
              <dd>{{ money(r.bookings) }}</dd>
            </div>
            <div class="cc__row">
              <dt>Pagos con QR</dt>
              <dd>{{ money(r.qr) }}</dd>
            </div>
          </template>
          <div class="cc__row is-total" aria-live="polite">
            <dt>Pagas al año</dt>
            <dd>{{ money(r.totalYear) }}</dd>
          </div>
        </dl>
        <div class="cc__rule" aria-hidden="true"></div>
        <p class="cc__head">Con tu canal propio en alaCarta</p>
        <dl>
          <div class="cc__row">
            <dt>
              Dejas de pagar ({{ v.shift }} %{{ !compact && r.qr > 0 ? ' + todo el QR' : '' }})
            </dt>
            <dd>{{ money(r.saved) }}</dd>
          </div>
          <div class="cc__row">
            <dt>Cuota del canal propio</dt>
            <dd>{{ r.ownYear > 0 ? `−${money(r.ownYear)}` : money(0) }}</dd>
          </div>
          <div class="cc__row is-total" aria-live="polite">
            <dt>{{ r.net >= 0 ? 'Te quedas al año' : 'Diferencia al año' }}</dt>
            <dd>{{ r.net >= 0 ? money(r.net) : `−${money(-r.net)}` }}</dd>
          </div>
          <div class="cc__row is-muted">
            <dt>Comisión por pedido o reserva</dt>
            <dd>0 €</dd>
          </div>
        </dl>
        <p class="cc__note">
          <template v-if="r.ownMonthly > 0">
            Cuota:
            {{ r.ownMonthly === pedidos.monthly ? 'Pedidos online' : 'Pedidos online y Reservas' }}
            sobre el plan Esencial ({{ fmtPrice(r.ownMonthly) }}/mes), o dentro del
            {{ completo.name }}
            con todo lo demás.
          </template>
          <template v-if="r.net < 0">
            Con estos números el canal propio no se paga solo con lo que ahorras en comisiones.
          </template>
          <template v-if="ready">Cálculo orientativo con tus cifras, sin IVA.</template>
          <template v-else>Ejemplo con valores de partida, no son datos de ningún local.</template>
        </p>
      </div>
      <div class="cc__actions">
        <a :href="leadHref" class="btn is-primary">Envíame el cálculo con mi propuesta</a>
        <a v-if="compact" :href="fullHref" class="link-arrow">
          Calculadora completa, con reservas y QR
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cc {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 24rem);
  gap: var(--space-10);
  align-items: start;
}
.cc__inputs {
  display: grid;
  gap: var(--space-6);
}
.cc__group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  margin: 0;
  padding: var(--space-5) var(--space-6) var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--white);
}
.cc__group legend {
  padding-inline: var(--space-2);
  margin-left: calc(var(--space-2) * -1);
  font-family: var(--font-display);
  font-weight: var(--weight-semibold);
  font-size: var(--text-md);
  color: var(--color-text-strong);
}
.cc__field {
  display: grid;
  gap: var(--space-2);
  align-content: start;
}
.cc__field label {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
}
.cc__field.is-range,
.cc__group > .cc__help {
  grid-column: 1 / -1;
}
.cc__num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
.cc__range {
  width: 100%;
  accent-color: var(--color-ink);
}
.cc__help {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: var(--leading-normal);
}
.cc__out {
  position: sticky;
  top: calc(var(--header-h) + var(--space-4));
  display: grid;
  gap: var(--space-5);
}
.cc__ticket {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--white);
  box-shadow: var(--shadow-device);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
  color: var(--color-text-strong);
}
.cc__head {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-muted);
}
.cc__ticket dl {
  display: grid;
  gap: var(--space-2);
}
.cc__row {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
}
.cc__row dd {
  flex: 0 0 auto;
  text-align: right;
}
.cc__row.is-total {
  padding-top: var(--space-2);
  border-top: 1px solid var(--color-border);
  font-size: var(--text-md);
  font-weight: var(--weight-semibold);
}
.cc__row.is-muted {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.cc__rule {
  border-top: 1.5px dashed var(--color-border-strong);
  margin-block: var(--space-2);
}
.cc__note {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: var(--leading-normal);
}
.cc__actions {
  display: grid;
  gap: var(--space-3);
  justify-items: center;
}
.cc__actions .btn {
  width: 100%;
  justify-content: center;
}
.cc.is-compact .cc__group {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
@media (max-width: 1024px) {
  .cc {
    grid-template-columns: minmax(0, 1fr);
  }
  .cc__out {
    position: static;
    max-width: 30rem;
    width: 100%;
    margin-inline: auto;
  }
}
@media (max-width: 520px) {
  .cc__group {
    grid-template-columns: minmax(0, 1fr);
    padding: var(--space-4) var(--space-4) var(--space-5);
  }
  .cc.is-compact .cc__group {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
