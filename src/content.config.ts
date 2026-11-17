import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** Guías: artículos largos y útiles en Markdown. Pocos y buenos, nada de relleno SEO. */
const guias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guias' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /**
     * Última vez que se comprobaron los datos y el estado legal (BOE, AEAT, Ministerio de
     * Trabajo…). Se enseña arriba, junto al título, y alimenta `dateModified` si es la más reciente.
     */
    reviewedAt: z.coerce.date().optional(),
    readingMinutes: z.number().int().positive(),
    /** Piezas del ecosistema relacionadas: la guía aparece en sus páginas («Para leer con calma») */
    related: z.array(z.string()).default([]),
    /** Momentos relacionados (`/momentos/*`): la guía aparece en su página */
    moments: z.array(z.string()).default([]),
    /** Cierre propio de la guía: producto de contexto y textos de la banda */
    cta: z
      .object({
        modulo: z.string().optional(),
        title: z.string().optional(),
        text: z.string().optional(),
        /** Sustituye la salida «Calcula» por la calculadora de comisiones */
        calculadora: z.boolean().default(false),
      })
      .optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { guias };
