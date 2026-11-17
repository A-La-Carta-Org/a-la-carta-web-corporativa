<script setup lang="ts">
/**
 * D7 · Mapa interactivo del ecosistema (docs/auditoria/10). Recibe la geometría y las conexiones
 * ya calculadas en build (`EcosystemMap.astro`): así la isla no arrastra `solutions.ts` ni el
 * juego de iconos.
 *
 * Sin JavaScript (o antes de hidratar) es el mapa ESTÁTICO de la fase 2: cada pieza enlaza a su
 * página y en móvil se ve la lista por familias. Al hidratar, tocar (o pasar el ratón, o llegar
 * con el teclado) a una pieza ilumina sus conexiones, apaga el resto y abre una ficha con qué hace
 * y con qué se conecta. Las integraciones o piezas que no existen todavía van en discontinuo y con
 * su chip «En camino». Teclado: Tab o flechas para moverse, Intro o espacio para elegir, Escape
 * para soltar.
 */
import { computed, nextTick, onMounted, ref } from 'vue';

export interface MapEdge {
  to: string;
  text: string;
  pending: boolean;
}
export interface MapNode {
  slug: string;
  navLabel: string;
  name: string;
  tagline: string;
  path: string;
  family: string;
  status: string;
  statusLabel: string;
  statusNote?: string;
  pending: boolean;
  icon: string;
  x: number;
  y: number;
  lx: number;
  ly: number;
  anchor: 'start' | 'middle' | 'end';
  lines: string[];
  edges: MapEdge[];
}
export interface MapFamily {
  id: string;
  name: string;
  short: string;
  lx: number;
  ly: number;
  items: string[];
}

const props = defineProps<{
  nodes: MapNode[];
  families: MapFamily[];
  width: number;
  height: number;
  radius: number;
  lineHeight: number;
}>();

const cx = props.width / 2;
const cy = props.height / 2;
const R = props.radius;

const ready = ref(false);
const selected = ref<string | null>(null);
const hovered = ref<string | null>(null);
const live = ref('');

const bySlug = computed(() => Object.fromEntries(props.nodes.map((n) => [n.slug, n])));
const focusSlug = computed(() => hovered.value ?? selected.value);
const focusNode = computed(() => (focusSlug.value ? bySlug.value[focusSlug.value] : undefined));
const selNode = computed(() => (selected.value ? bySlug.value[selected.value] : undefined));
const neighbours = computed(() => new Set(focusNode.value?.edges.map((e) => e.to) ?? []));

const lit = (slug: string) =>
  !focusSlug.value || slug === focusSlug.value || neighbours.value.has(slug);

/** Curva de una pieza a otra, combada hacia el núcleo */
const curve = (a: MapNode, b: MapNode) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const qx = cx + (mx - cx) * 0.35;
  const qy = cy + (my - cy) * 0.35;
  return `M${a.x} ${a.y} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${b.x} ${b.y}`;
};
const edgesDrawn = computed(() => {
  const n = focusNode.value;
  if (!n) return [];
  return n.edges
    .map((e) => ({ e, to: bySlug.value[e.to] }))
    .filter((x) => x.to)
    .map((x) => ({ d: curve(n, x.to!), pending: x.e.pending, key: `${n.slug}-${x.e.to}` }));
});

function select(slug: string, announce = true) {
  selected.value = selected.value === slug ? null : slug;
  const n = selected.value ? bySlug.value[selected.value] : undefined;
  if (announce)
    live.value = n
      ? `${n.navLabel}: se conecta con ${n.edges.length} piezas. La ficha está debajo del mapa.`
      : 'Ninguna pieza seleccionada.';
}

function onNodeClick(e: MouseEvent, slug: string) {
  if (!ready.value) return; // sin JS: el enlace navega
  e.preventDefault();
  select(slug);
}

const order = computed(() => props.nodes.map((n) => n.slug));
function onNodeKey(e: KeyboardEvent, slug: string) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    select(slug);
    return;
  }
  if (e.key === 'Escape') {
    selected.value = null;
    hovered.value = null;
    live.value = 'Ninguna pieza seleccionada.';
    return;
  }
  const dir = ['ArrowRight', 'ArrowDown'].includes(e.key)
    ? 1
    : ['ArrowLeft', 'ArrowUp'].includes(e.key)
      ? -1
      : 0;
  if (!dir) return;
  e.preventDefault();
  const i = order.value.indexOf(slug);
  const next = order.value[(i + dir + order.value.length) % order.value.length]!;
  nextTick(() => document.getElementById(`eco-node-${next}`)?.focus());
}

/** Ficha en móvil: debajo de la familia de la pieza elegida */
const familyOfSel = computed(() => selNode.value?.family);

const edgeLabel = (e: MapEdge) => bySlug.value[e.to]?.navLabel ?? e.to;
const edgeIcon = (e: MapEdge) => bySlug.value[e.to]?.icon ?? '';
const edgePath = (e: MapEdge) => bySlug.value[e.to]?.path ?? '#';

function closeCard() {
  const slug = selected.value;
  selected.value = null;
  live.value = 'Ficha cerrada.';
  if (slug)
    nextTick(() =>
      (
        document.getElementById(`eco-node-${slug}`) ?? document.getElementById(`eco-li-${slug}`)
      )?.focus()
    );
}

onMounted(() => {
  ready.value = true;
});
</script>

<template>
  <!-- Los trazados de icono vienen de icons.ts en build (datos propios, no del usuario) -->
  <!-- eslint-disable vue/no-v-html -->
  <figure class="eco" :class="{ 'is-ready': ready, 'has-focus': Boolean(focusSlug) }">
    <svg
      class="eco__svg"
      :viewBox="`0 0 ${width} ${height}`"
      role="group"
      aria-label="Mapa del ecosistema de alaCarta: las piezas de cada familia, conectadas al mismo sistema"
    >
      <g class="eco__spokes" aria-hidden="true">
        <line
          v-for="n in nodes"
          :key="n.slug"
          :x1="cx"
          :y1="cy"
          :x2="n.x"
          :y2="n.y"
          :class="{ 'is-pending': n.pending }"
        />
      </g>

      <g class="eco__edges" aria-hidden="true">
        <path v-for="e in edgesDrawn" :key="e.key" :d="e.d" :class="{ 'is-pending': e.pending }" />
      </g>

      <g class="eco__families" aria-hidden="true">
        <text v-for="f in families" :key="f.id" :x="f.lx" :y="f.ly" text-anchor="middle">
          {{ f.short.toUpperCase() }}
        </text>
      </g>

      <g class="eco__core" aria-hidden="true">
        <rect :x="cx - 150" :y="cy - 66" width="300" height="132" rx="20" />
        <g :transform="`translate(${cx - 11} ${cy - 44})`" class="eco__mark">
          <rect x="0" y="0" width="10" height="10" rx="2.5" class="is-fill" />
          <rect x="12" y="0" width="10" height="10" rx="2.5" />
          <rect x="0" y="12" width="10" height="10" rx="2.5" />
          <rect x="12" y="12" width="10" height="10" rx="2.5" />
        </g>
        <text
          :x="cx"
          :y="cy + 12"
          text-anchor="middle"
          class="eco__core-title"
          :class="{ 'is-long': (focusNode?.navLabel.length ?? 0) > 16 }"
        >
          {{ focusNode ? focusNode.navLabel : 'Un solo sistema' }}
        </text>
        <text :x="cx" :y="cy + 36" text-anchor="middle" class="eco__core-text">
          {{
            focusNode
              ? `se conecta con ${focusNode.edges.length} piezas`
              : 'carta · mesas · clientes · ventas · equipo'
          }}
        </text>
      </g>

      <!-- Piezas: enlaces sin JS; botones al hidratar -->
      <template v-for="n in nodes" :key="n.slug">
        <a
          v-if="!ready"
          :href="n.path"
          class="eco__node"
          :class="{ 'is-pending': n.pending }"
          :aria-label="`${n.navLabel}${n.pending ? ` (${n.statusLabel.toLowerCase()})` : ''}`"
        >
          <circle :cx="n.x" :cy="n.y" :r="R" />
          <g
            :transform="`translate(${n.x - 11} ${n.y - 11}) scale(0.9167)`"
            class="eco__icon"
            v-html="n.icon"
          />
          <text :x="n.lx" :y="n.ly" :text-anchor="n.anchor" class="eco__label">
            <tspan
              v-for="(l, i) in n.lines"
              :key="i"
              :x="n.lx"
              :dy="i === 0 ? 0 : lineHeight"
              :class="{ 'is-status': n.pending && i === n.lines.length - 1 }"
            >
              {{ l }}
            </tspan>
          </text>
        </a>
        <g
          v-else
          :id="`eco-node-${n.slug}`"
          class="eco__node"
          :class="{
            'is-pending': n.pending,
            'is-dim': !lit(n.slug),
            'is-sel': selected === n.slug,
            'is-hover': focusSlug === n.slug,
          }"
          role="button"
          tabindex="0"
          :aria-pressed="selected === n.slug"
          :aria-label="`${n.navLabel}${n.pending ? ` (${n.statusLabel.toLowerCase()})` : ''}: ver con qué se conecta`"
          @click="onNodeClick($event, n.slug)"
          @keydown="onNodeKey($event, n.slug)"
          @pointerenter="(e: PointerEvent) => e.pointerType === 'mouse' && (hovered = n.slug)"
          @pointerleave="hovered = null"
          @focus="hovered = n.slug"
          @blur="hovered = null"
        >
          <circle :cx="n.x" :cy="n.y" :r="R + 14" class="eco__hit" />
          <circle :cx="n.x" :cy="n.y" :r="R" />
          <g
            :transform="`translate(${n.x - 11} ${n.y - 11}) scale(0.9167)`"
            class="eco__icon"
            v-html="n.icon"
          />
          <text :x="n.lx" :y="n.ly" :text-anchor="n.anchor" class="eco__label">
            <tspan
              v-for="(l, i) in n.lines"
              :key="i"
              :x="n.lx"
              :dy="i === 0 ? 0 : lineHeight"
              :class="{ 'is-status': n.pending && i === n.lines.length - 1 }"
            >
              {{ l }}
            </tspan>
          </text>
        </g>
      </template>
    </svg>

    <!-- Móvil: lista por familias; al hidratar, cada pieza abre su ficha debajo de su familia -->
    <div class="eco__list">
      <div class="eco__list-core">
        <span class="eco__list-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <span>
          <b>Un solo sistema</b>
          <span>carta · mesas · clientes · ventas · equipo</span>
        </span>
      </div>
      <div v-for="f in families" :key="f.id" class="eco__list-family">
        <p class="eco__list-name">{{ f.name }}</p>
        <ul role="list">
          <li
            v-for="slug in f.items"
            :key="slug"
            :class="{ 'is-pending': bySlug[slug]!.pending, 'is-sel': selected === slug }"
          >
            <a v-if="!ready" :href="bySlug[slug]!.path">
              <span class="eco__li-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" v-html="bySlug[slug]!.icon"></svg>
              </span>
              {{ bySlug[slug]!.navLabel }}
            </a>
            <button
              v-else
              :id="`eco-li-${slug}`"
              type="button"
              :aria-expanded="selected === slug"
              :aria-controls="`eco-card-${f.id}`"
              @click="select(slug)"
            >
              <span class="eco__li-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" v-html="bySlug[slug]!.icon"></svg>
              </span>
              {{ bySlug[slug]!.navLabel }}
            </button>
            <span v-if="bySlug[slug]!.pending" class="chip is-status">{{
              bySlug[slug]!.statusLabel
            }}</span>
          </li>
        </ul>
        <div
          v-if="ready && selNode && familyOfSel === f.id"
          :id="`eco-card-${f.id}`"
          class="eco__card is-inline"
        >
          <div>
            <p class="eco__card-title">
              <span>{{ selNode.name }}</span>
              <span v-if="selNode.pending" class="chip is-status" :title="selNode.statusNote">{{
                selNode.statusLabel
              }}</span>
            </p>
            <p class="eco__card-tag">{{ selNode.tagline }}</p>
          </div>
          <p class="eco__card-sub">Se conecta con</p>
          <ul class="eco__conns" role="list">
            <li v-for="e in selNode.edges" :key="e.to" :class="{ 'is-pending': e.pending }">
              <a :href="edgePath(e)" class="eco__conn-name">{{ edgeLabel(e) }}</a>
              <span v-if="e.pending" class="chip is-status">En camino</span>
              <span class="eco__conn-text">{{ e.text }}</span>
            </li>
          </ul>
          <a :href="selNode.path" class="link-arrow"
            >Ver {{ selNode.navLabel }} <span aria-hidden="true">→</span></a
          >
        </div>
      </div>
    </div>

    <!-- Escritorio: ficha bajo el mapa -->
    <div v-if="ready" class="eco__panel">
      <div v-if="selNode" class="eco__card">
        <div class="eco__card-head">
          <span class="eco__card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" v-html="selNode.icon"></svg>
          </span>
          <div>
            <h3 class="eco__card-title">
              <span>{{ selNode.name }}</span>
              <span v-if="selNode.pending" class="chip is-status" :title="selNode.statusNote">{{
                selNode.statusLabel
              }}</span>
            </h3>
            <p class="eco__card-tag">{{ selNode.tagline }}</p>
            <a :href="selNode.path" class="link-arrow"
              >Ver {{ selNode.navLabel }} <span aria-hidden="true">→</span></a
            >
          </div>
          <button type="button" class="eco__close" aria-label="Cerrar la ficha" @click="closeCard">
            ×
          </button>
        </div>
        <ul
          class="eco__conns is-grid"
          role="list"
          :aria-label="`${selNode.navLabel} se conecta con`"
        >
          <li v-for="e in selNode.edges" :key="e.to" :class="{ 'is-pending': e.pending }">
            <span class="eco__conn-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" v-html="edgeIcon(e)"></svg>
            </span>
            <span>
              <a :href="edgePath(e)" class="eco__conn-name">{{ edgeLabel(e) }}</a>
              <span v-if="e.pending" class="chip is-status">En camino</span>
              <span class="eco__conn-text">{{ e.text }}</span>
            </span>
          </li>
        </ul>
      </div>
      <p v-else class="eco__empty">
        Toca un producto del mapa para ver qué hace y con qué se conecta. Con el teclado: tabulador
        o flechas, e Intro.
      </p>
    </div>

    <figcaption class="eco__legend">
      <span class="eco__key"><i class="is-solid"></i> Disponible</span>
      <span class="eco__key"><i class="is-dashed"></i> En camino</span>
      <span v-if="!ready" class="eco__hint">Cada pieza lleva a su página.</span>
    </figcaption>
    <p class="sr-only" role="status" aria-live="polite">{{ live }}</p>
  </figure>
</template>

<style scoped>
.eco {
  margin: 0;
  display: grid;
  gap: var(--space-6);
}
.eco svg {
  overflow: visible;
}
.eco__svg {
  width: 100%;
  height: auto;
  display: block;
  font-family: var(--font-body);
}
.eco__spokes line {
  stroke: var(--gray-300);
  stroke-width: 1.25;
  transition: opacity var(--dur) var(--ease);
}
.eco__spokes line.is-pending {
  stroke-dasharray: 5 6;
  stroke: var(--gray-400);
}
.eco.has-focus .eco__spokes line {
  opacity: 0.25;
}
.eco__edges path {
  fill: none;
  stroke: var(--black);
  stroke-width: 2;
  stroke-linecap: round;
}
.eco__edges path.is-pending {
  stroke: var(--gray-500);
  stroke-dasharray: 6 6;
}
.eco__families text {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  fill: var(--gray-500);
  paint-order: stroke;
  stroke: var(--white);
  stroke-width: 8px;
  stroke-linejoin: round;
  transition: opacity var(--dur) var(--ease);
}
.eco.has-focus .eco__families text {
  opacity: 0;
}
.eco__core rect:first-child {
  fill: var(--black);
}
.eco__mark rect {
  fill: none;
  stroke: var(--white);
  stroke-width: 1.6;
}
.eco__mark rect.is-fill {
  fill: var(--white);
}
.eco__core-title {
  fill: var(--white);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 22px;
  letter-spacing: -0.02em;
}
.eco__core-title.is-long {
  font-size: 17px;
}
.eco__core-text {
  fill: var(--gray-400);
  font-size: 12.5px;
}
.eco__node {
  cursor: pointer;
  transition: opacity var(--dur) var(--ease);
}
.eco__node circle:not(.eco__hit) {
  fill: var(--white);
  stroke: var(--gray-300);
  stroke-width: 1.25;
  transition:
    stroke var(--dur-fast) var(--ease),
    fill var(--dur-fast) var(--ease);
}
.eco__hit {
  fill: transparent;
  stroke: none;
}
.eco__node.is-pending circle:not(.eco__hit) {
  stroke-dasharray: 4 4;
  stroke: var(--gray-400);
}
.eco__icon {
  fill: none;
  stroke: var(--black);
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.eco__label {
  font-size: 13px;
  font-weight: 500;
  fill: var(--black);
}
.eco__label .is-status {
  font-size: 11px;
  font-weight: 400;
  fill: var(--gray-500);
}
.eco__node.is-dim {
  opacity: 0.28;
}
.eco__node:hover circle:not(.eco__hit),
.eco__node.is-hover circle:not(.eco__hit) {
  stroke: var(--black);
  stroke-width: 2;
}
.eco__node.is-sel circle:not(.eco__hit) {
  fill: var(--black);
  stroke: var(--black);
}
.eco__node.is-sel .eco__icon {
  stroke: var(--white);
}
.eco__node:focus {
  outline: none;
}
.eco__node:focus-visible circle:not(.eco__hit) {
  stroke: var(--black);
  stroke-width: 3;
}
.eco__node:focus-visible .eco__label {
  text-decoration: underline;
}
a.eco__node:hover .eco__label {
  text-decoration: underline;
}

/* Ficha */
.eco__panel {
  min-height: 9rem;
}
.eco__empty {
  padding: var(--space-6);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}
.eco__card {
  display: grid;
  gap: var(--space-5);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--white);
}
.eco__card-head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--space-4);
  align-items: start;
}
.eco__card-head > div {
  display: grid;
  gap: var(--space-2);
  justify-items: start;
}
.eco__card-icon {
  width: 3rem;
  height: 3rem;
  display: grid;
  place-items: center;
  border-radius: var(--radius-pill);
  background: var(--black);
  color: var(--white);
}
.eco__card-icon svg,
.eco__conn-icon svg,
.eco__li-icon svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.eco__card-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-3);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  color: var(--color-text-strong);
}
.eco__card-tag {
  color: var(--color-text-muted);
}
.eco__close {
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--color-bg-muted);
  font-size: var(--text-xl);
  line-height: 1;
  cursor: pointer;
}
.eco__card-sub {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-muted);
}
.eco__conns {
  display: grid;
  gap: var(--space-4);
}
.eco__conns.is-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4) var(--space-6);
}
.eco__conns li {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
  font-size: var(--text-sm);
}
.eco__conns li.is-pending {
  border-top-style: dashed;
}
.eco__conns li > span:last-child {
  display: grid;
  gap: 2px;
  justify-items: start;
}
.eco__conn-icon {
  flex: 0 0 auto;
  margin-top: 2px;
  color: var(--color-text-muted);
}
.eco__conn-name {
  font-weight: var(--weight-medium);
  color: var(--color-text-strong);
}
.eco__conn-text {
  color: var(--color-text-muted);
}

/* Leyenda */
.eco__legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--space-2) var(--space-6);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
.eco__key {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}
.eco__key i {
  display: inline-block;
  width: 1.75rem;
  border-top: 1.5px solid var(--gray-400);
}
.eco__key i.is-dashed {
  border-top-style: dashed;
}

/* Lista (móvil) */
.eco__list {
  display: none;
}
@media (max-width: 1024px) {
  .eco__conns.is-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 720px) {
  .eco__svg,
  .eco__panel {
    display: none;
  }
  .eco__list {
    display: grid;
    gap: var(--space-5);
    padding-left: var(--space-5);
    border-left: 1.5px solid var(--gray-300);
    margin-left: var(--space-5);
  }
  .eco__list-core {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-left: calc(-1 * var(--space-5) - var(--space-5) - 1px);
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    background: var(--black);
    color: var(--white);
  }
  .eco__list-core b {
    display: block;
    font-family: var(--font-display);
    font-weight: var(--weight-semibold);
    font-size: var(--text-lg);
    letter-spacing: var(--tracking-snug);
  }
  .eco__list-core span span {
    font-size: var(--text-xs);
    color: var(--gray-400);
  }
  .eco__list-mark {
    flex: 0 0 auto;
    display: grid;
    grid-template-columns: 10px 10px;
    gap: 2px;
  }
  .eco__list-mark i {
    width: 10px;
    height: 10px;
    border-radius: 2.5px;
    border: 1.5px solid var(--white);
  }
  .eco__list-mark i:first-child {
    background: var(--white);
  }
  .eco__list-name {
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-text-muted);
    margin-bottom: var(--space-2);
  }
  .eco__list-family > ul {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
  .eco__list-family > ul > li {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: 0 0.7rem 0 0;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
  }
  .eco__list-family > ul > li:not(.is-pending) {
    padding-right: 0;
  }
  .eco__list-family > ul > li.is-pending {
    border-style: dashed;
    border-color: var(--gray-400);
  }
  .eco__list-family > ul > li.is-sel {
    border-color: var(--black);
    border-style: solid;
    background: var(--black);
  }
  .eco__list-family > ul > li.is-sel button {
    color: var(--white);
  }
  .eco__list-family > ul > li > a,
  .eco__list-family > ul > li > button {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    min-height: 2.5rem;
    padding: 0 0.7rem;
    border: 0;
    background: none;
    font: inherit;
    color: var(--color-text-strong);
    cursor: pointer;
  }
  .eco__card.is-inline {
    margin-top: var(--space-3);
    padding: var(--space-5);
    gap: var(--space-3);
  }
  .eco__card.is-inline .eco__card-title {
    font-size: var(--text-lg);
  }
  .eco__card.is-inline .eco__conns {
    gap: var(--space-3);
  }
  .eco__card.is-inline .eco__conns li {
    display: grid;
    gap: 2px;
    justify-items: start;
  }
}
</style>
