/**
 * Atribución propia, sin cookies ni terceros (docs/auditoria/11 §4). Al llegar a la web se guarda
 * en `sessionStorage` la página de entrada, el referrer externo y los `utm_*` si vienen. El
 * formulario lo lee al enviar. Todo con try/catch: en modo privado o con el almacenamiento
 * bloqueado no se guarda nada y la web sigue igual.
 *
 * Este módulo no importa nada: se carga en todas las páginas desde `BaseLayout`.
 */
export const ATTRIBUTION_KEY = 'alacarta:atribucion';
/** Lo marca el simulador (D1) cuando el visitante cobra la mesa: «demo completada» */
export const DEMO_DONE_KEY = 'alacarta:demo-completada';
/** Lo último que se ha enviado, para que `/gracias` diga «te escribimos a …» sin ponerlo en la URL */
export const LAST_LEAD_KEY = 'alacarta:solicitud';

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

export interface Attribution {
  /** Primera página vista en la sesión (ruta + consulta, recortada) */
  entrada: string;
  /** Web externa desde la que llegó (vacío si directo o desde la propia web) */
  referrer: string;
  /** Fecha ISO de llegada */
  llegada: string;
  utm: Record<string, string>;
}

const read = <T>(key: string): T | null => {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const write = (key: string, value: unknown) => {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
};

/** Se llama en cada página. Solo escribe la primera vez (y los UTM si llegan más tarde) */
export const captureAttribution = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) utm[k] = v.slice(0, 100);
    }
    const prev = read<Attribution>(ATTRIBUTION_KEY);
    if (!prev) {
      let referrer = '';
      if (document.referrer) {
        const ref = new URL(document.referrer);
        if (ref.host !== window.location.host)
          referrer = `${ref.origin}${ref.pathname}`.slice(0, 200);
      }
      write(ATTRIBUTION_KEY, {
        entrada: `${window.location.pathname}${window.location.search}`.slice(0, 300),
        referrer,
        llegada: new Date().toISOString(),
        utm,
      } satisfies Attribution);
    } else if (Object.keys(utm).length && !Object.keys(prev.utm ?? {}).length) {
      write(ATTRIBUTION_KEY, { ...prev, utm });
    }
  } catch {
    /* nada */
  }
};

export const readAttribution = () => read<Attribution>(ATTRIBUTION_KEY);
export const readDemoDone = () => read<string>(DEMO_DONE_KEY);
export const markDemoDone = (demo: string) => write(DEMO_DONE_KEY, demo);

export interface LastLead {
  tipo: string;
  nombre?: string;
  email?: string;
  franja?: string;
  momento?: string;
  via?: 'endpoint' | 'correo';
}
export const saveLastLead = (lead: LastLead) => write(LAST_LEAD_KEY, lead);
export const readLastLead = () => read<LastLead>(LAST_LEAD_KEY);
