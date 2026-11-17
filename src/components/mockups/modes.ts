/**
 * Variantes de contenido de las maquetas según el tipo de local (docs/auditoria/12 §2.1). Viven
 * aquí, en TypeScript, para que los datos (`src/data/sectors.ts`) puedan nombrarlas.
 */

/** TPV: sala (por defecto), barra, mostrador, grifos (cervecería) y noche (modo oscuro) */
export type TpvMode = 'sala' | 'barra' | 'mostrador' | 'grifos' | 'noche';

/** Pantalla de cocina: restaurante (por defecto), pizzería, hamburguesería y take away */
export type KdsMode = 'restaurante' | 'pizzeria' | 'hamburgueseria' | 'takeaway';
