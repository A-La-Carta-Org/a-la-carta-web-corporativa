/**
 * Integraciones con servicios de fuera del ecosistema (docs/auditoria/13 §6): pagos y datáfonos,
 * agregadores, gestorías y contabilidad, Google, impresoras. Fuente única para la sección del hub
 * de soluciones, el pie y `/novedades`.
 *
 * Reglas:
 * - Lo de dentro (TPV ↔ cocina ↔ carta…) no va aquí: va en `connections` de `solutions.ts`.
 * - Cada entrada lleva su estado. «En camino» = no está hecha; nunca con fecha si no la hay.
 * - Sin logotipos de terceros (docs/DISENO.md §7). Las marcas se nombran en texto solo cuando ya
 *   las nombra el producto (agregadores en Pedidos online).
 * - El texto tiene que coincidir con lo que dicen las páginas de producto y sus FAQ.
 */
import type { IconName } from '@/components/ui/icons';
import type { EcosystemSlug } from './solutions';

export type IntegrationGroupId = 'pagos' | 'agregadores' | 'gestoria' | 'google' | 'equipos';

export interface IntegrationGroup {
  id: IntegrationGroupId;
  name: string;
  icon: IconName;
}

export interface Integration {
  id: string;
  group: IntegrationGroupId;
  name: string;
  text: string;
  status: 'disponible' | 'en-camino';
  /** Pieza de alaCarta donde se nota (su página explica el detalle) */
  via: EcosystemSlug;
}

export const integrationGroups: IntegrationGroup[] = [
  { id: 'pagos', name: 'Pagos y datáfonos', icon: 'card' },
  { id: 'agregadores', name: 'Agregadores de reparto', icon: 'bike' },
  { id: 'gestoria', name: 'Gestoría y contabilidad', icon: 'briefcase' },
  { id: 'google', name: 'Google', icon: 'globe' },
  { id: 'equipos', name: 'Impresoras y equipos', icon: 'printer' },
];

export const integrations: Integration[] = [
  /* Pagos */
  {
    id: 'pasarela',
    group: 'pagos',
    name: 'Tu pasarela de pago',
    text: 'Pagos online con tarjeta, Apple Pay y Google Pay en la tienda y en la carta QR. El dinero llega a tu cuenta.',
    status: 'disponible',
    via: 'pedidos-online',
  },
  {
    id: 'datafonos',
    group: 'pagos',
    name: 'Datáfonos conectados al TPV',
    text: 'Hoy cobras con el datáfono de tu banco y registras el cobro en el TPV. La lista de datáfonos compatibles está en preparación.',
    status: 'en-camino',
    via: 'tpv',
  },
  /* Agregadores */
  {
    id: 'agregadores',
    group: 'agregadores',
    name: 'Glovo, Uber Eats y Just Eat',
    text: 'Sus pedidos, en la misma cola de cocina que los tuyos. Mientras tanto, siguen en su tableta.',
    status: 'en-camino',
    via: 'pedidos-online',
  },
  /* Gestoría */
  {
    id: 'exportacion',
    group: 'gestoria',
    name: 'Exportación para tu gestoría',
    text: 'Ventas, cierres y productos en CSV o Excel, y las variables del mes del equipo listas para la nómina.',
    status: 'disponible',
    via: 'backoffice',
  },
  {
    id: 'contabilidad',
    group: 'gestoria',
    name: 'Contabilidad con acceso para la gestoría',
    text: 'Facturas de proveedor, tesorería, modelos de IVA y el resumen diario del TPV en la contabilidad, con el ERP.',
    status: 'en-camino',
    via: 'erp',
  },
  /* Google */
  {
    id: 'perfil-google',
    group: 'google',
    name: 'Perfil de Empresa de Google',
    text: 'Horario, carta y enlaces para reservar y pedir, cuidados por nosotros con el servicio de web.',
    status: 'disponible',
    via: 'web-para-restaurantes',
  },
  {
    id: 'reserva-google',
    group: 'google',
    name: 'Reserva con Google',
    text: 'Hoy el botón de reservar de tu ficha puede apuntar a tu libro. La integración directa está en camino.',
    status: 'en-camino',
    via: 'reservas',
  },
  /* Equipos */
  {
    id: 'impresoras',
    group: 'equipos',
    name: 'Impresoras de tickets y de cocina',
    text: 'Térmicas de red o USB compatibles con ESC/POS, la mayoría de las que ya hay en los locales.',
    status: 'disponible',
    via: 'hardware',
  },
  {
    id: 'tablets',
    group: 'equipos',
    name: 'Tablets, móviles y terminales',
    text: 'Cualquier equipo táctil con un navegador moderno, también el que ya tienes si sirve.',
    status: 'disponible',
    via: 'hardware',
  },
];

/** Grupos con sus integraciones, en orden */
export const integrationsByGroup = () =>
  integrationGroups.map((g) => ({ ...g, items: integrations.filter((i) => i.group === g.id) }));

export const integrationsAvailable = integrations.filter((i) => i.status === 'disponible');
export const integrationsPending = integrations.filter((i) => i.status === 'en-camino');
