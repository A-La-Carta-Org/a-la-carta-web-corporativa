<script setup lang="ts">
/**
 * Los cuatro planes con el selector mensual/anual. Sin JavaScript se ven con el precio mensual.
 * En móvil van en carrusel horizontal, con el recomendado (Completo) primero.
 */
import { ref, computed } from 'vue';
import {
  plans,
  billingOptions,
  planMonthly,
  planYearly,
  fmtPrice,
  VAT_NOTE,
  TRIAL_DAYS,
  totalAsSeparate,
  type Billing,
} from '@/data/pricing';

const billing = ref<Billing>('mensual');

const cards = computed(() =>
  plans.map((p) => {
    const monthly = planMonthly(p, billing.value);
    const yearly = planYearly(p);
    return { ...p, monthlyNow: monthly, yearly };
  })
);
</script>

<template>
  <div class="pricing">
    <div class="pricing__toggle" role="radiogroup" aria-label="Forma de pago">
      <button
        v-for="opt in billingOptions"
        :key="opt.id"
        type="button"
        role="radio"
        :aria-checked="billing === opt.id"
        class="pricing__opt"
        :class="{ 'is-on': billing === opt.id }"
        @click="billing = opt.id"
      >
        {{ opt.label }}
        <span v-if="opt.note" class="pricing__opt-note">{{ opt.note }}</span>
      </button>
    </div>

    <ul role="list" class="pricing__grid">
      <li v-for="p in cards" :key="p.id" class="plan" :class="{ 'is-featured': p.featured }">
        <div class="plan__head">
          <div class="plan__name-row">
            <h3>{{ p.name }}</h3>
            <span v-if="p.featured" class="chip is-dark">Recomendado</span>
          </div>
          <p class="plan__claim">{{ p.claim }}</p>
        </div>

        <div class="plan__price">
          <template v-if="p.monthlyNow !== null">
            <span class="plan__amount">{{ fmtPrice(p.monthlyNow) }}</span>
            <span class="plan__unit"
              >/mes por local <small>{{ VAT_NOTE }}</small></span
            >
            <span v-if="billing === 'anual' && p.yearly" class="plan__yearly">
              {{ fmtPrice(p.yearly) }} al año, en un pago
            </span>
            <span v-else-if="p.id === 'total'" class="plan__yearly">
              Por separado saldría a {{ fmtPrice(totalAsSeparate) }}/mes
            </span>
            <span v-else class="plan__yearly"
              >Sin permanencia · {{ TRIAL_DAYS }} días de prueba</span
            >
          </template>
          <template v-else>
            <span class="plan__amount is-text">A medida</span>
            <span class="plan__unit">según locales y volumen</span>
            <span class="plan__yearly">Propuesta en 48 h laborables</span>
          </template>
        </div>

        <a :href="p.cta.href" class="btn is-lg" :class="p.featured ? 'is-primary' : 'is-secondary'">
          {{ p.cta.label }}
        </a>

        <ul class="check-list plan__includes">
          <li v-for="line in p.includes" :key="line">{{ line }}</li>
        </ul>
      </li>
    </ul>
    <p class="pricing__hint">Desliza para ver los cuatro planes.</p>
  </div>
</template>

<style scoped>
.pricing {
  display: grid;
  gap: var(--space-10);
}
.pricing__toggle {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: var(--radius-md);
  background: var(--color-bg-muted);
  margin-inline: auto;
}
.pricing__opt {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.5rem 1rem;
  border-radius: calc(var(--radius-md) - 3px);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
  transition:
    background-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}
.pricing__opt.is-on {
  background: var(--white);
  color: var(--color-text-strong);
  box-shadow: var(--shadow-sm);
}
.pricing__opt-note {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.pricing__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
  align-items: stretch;
}
.plan {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--white);
}
.plan.is-featured {
  border-color: var(--color-ink);
}
.plan__head {
  display: grid;
  gap: var(--space-2);
}
.plan__name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
}
.plan__name-row h3 {
  font-size: var(--text-xl);
}
.plan__claim {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}
.plan__price {
  display: grid;
  gap: var(--space-1);
  padding-block: var(--space-2);
  border-block: 1px solid var(--color-border);
}
.plan__amount {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-tight);
  line-height: 1;
  color: var(--color-text-strong);
}
.plan__amount.is-text {
  font-size: var(--text-2xl);
  padding-block: 0.3rem;
}
.plan__unit {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
.plan__unit small {
  font-size: var(--text-xs);
}
.plan__yearly {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.plan__includes {
  margin-top: var(--space-2);
}
@media (max-width: 1180px) {
  .pricing__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: 48rem;
    margin-inline: auto;
  }
}
.pricing__hint {
  display: none;
  margin-top: calc(var(--space-8) * -1);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-align: center;
}
/* Móvil: carrusel con el recomendado primero; se ve asomar la tarjeta siguiente */
@media (max-width: 720px) {
  .pricing__grid {
    display: flex;
    max-width: none;
    margin-inline: calc(var(--gutter, 1rem) * -1);
    padding: 2px var(--gutter, 1rem) var(--space-3);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--gutter, 1rem);
    overscroll-behavior-x: contain;
  }
  .plan {
    flex: 0 0 min(84%, 22rem);
    scroll-snap-align: start;
  }
  .plan.is-featured {
    order: -1;
  }
  .pricing__hint {
    display: block;
  }
}
</style>
