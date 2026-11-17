/**
 * «La Plaza», el restaurante FICTICIO de todas las demos de la web (docs/auditoria/10). Fuente
 * única: la carta QR de ejemplo (D3), el simulador del servicio (D1), «un cambio, todos los
 * canales» (D2) y la llamada de ejemplo (D4) leen de aquí. Cambiar un plato aquí lo cambia en
 * todas, que es justo lo que alaCarta vende: una carta, un dato.
 *
 * Las islas Vue importan este módulo: que no importe nada pesado (ni `solutions.ts` ni iconos).
 * Precios en céntimos para no arrastrar decimales. Las cifras de «Números de hoy» son de un
 * restaurante inventado, no datos de clientes de alaCarta.
 */

export type Lang = 'es' | 'en' | 'fr';
export type Text = Record<Lang, string>;

export const demoVenue = {
  name: 'La Plaza',
  table: 7,
  /** Lo que se escribe en la cabecera de las demos */
  note: 'Restaurante ficticio',
};

/* ── Alérgenos (los 14 de declaración obligatoria, Reglamento UE 1169/2011) ── */

export type AllergenId =
  | 'gluten'
  | 'crustaceos'
  | 'huevo'
  | 'pescado'
  | 'cacahuete'
  | 'soja'
  | 'lacteos'
  | 'frutos-cascara'
  | 'apio'
  | 'mostaza'
  | 'sesamo'
  | 'sulfitos'
  | 'altramuces'
  | 'moluscos';

export interface Allergen {
  id: AllergenId;
  /** Monograma de la insignia (iconos de línea pequeños, sin color) */
  code: string;
  label: Text;
}

export const allergens: Allergen[] = [
  { id: 'gluten', code: 'G', label: { es: 'Gluten', en: 'Gluten', fr: 'Gluten' } },
  { id: 'crustaceos', code: 'Cr', label: { es: 'Crustáceos', en: 'Crustaceans', fr: 'Crustacés' } },
  { id: 'huevo', code: 'H', label: { es: 'Huevo', en: 'Egg', fr: 'Œuf' } },
  { id: 'pescado', code: 'P', label: { es: 'Pescado', en: 'Fish', fr: 'Poisson' } },
  { id: 'cacahuete', code: 'Ca', label: { es: 'Cacahuete', en: 'Peanut', fr: 'Arachide' } },
  { id: 'soja', code: 'So', label: { es: 'Soja', en: 'Soy', fr: 'Soja' } },
  { id: 'lacteos', code: 'L', label: { es: 'Lácteos', en: 'Milk', fr: 'Lait' } },
  {
    id: 'frutos-cascara',
    code: 'F',
    label: { es: 'Frutos de cáscara', en: 'Tree nuts', fr: 'Fruits à coque' },
  },
  { id: 'apio', code: 'Ap', label: { es: 'Apio', en: 'Celery', fr: 'Céleri' } },
  { id: 'mostaza', code: 'Mo', label: { es: 'Mostaza', en: 'Mustard', fr: 'Moutarde' } },
  { id: 'sesamo', code: 'Se', label: { es: 'Sésamo', en: 'Sesame', fr: 'Sésame' } },
  { id: 'sulfitos', code: 'Su', label: { es: 'Sulfitos', en: 'Sulphites', fr: 'Sulfites' } },
  { id: 'altramuces', code: 'Al', label: { es: 'Altramuces', en: 'Lupin', fr: 'Lupin' } },
  { id: 'moluscos', code: 'M', label: { es: 'Moluscos', en: 'Molluscs', fr: 'Mollusques' } },
];

/** Filtros de la carta: excluyen platos con estos alérgenos (o que no cumplen la dieta) */
export interface DietFilter {
  id: string;
  label: Text;
  excludes?: AllergenId[];
  /** Solo platos marcados como vegetarianos */
  vegetarian?: boolean;
}

export const dietFilters: DietFilter[] = [
  {
    id: 'sin-gluten',
    label: { es: 'Sin gluten', en: 'Gluten free', fr: 'Sans gluten' },
    excludes: ['gluten'],
  },
  {
    id: 'sin-lactosa',
    label: { es: 'Sin lácteos', en: 'Dairy free', fr: 'Sans lait' },
    excludes: ['lacteos'],
  },
  {
    id: 'sin-huevo',
    label: { es: 'Sin huevo', en: 'Egg free', fr: 'Sans œuf' },
    excludes: ['huevo'],
  },
  {
    id: 'sin-frutos',
    label: { es: 'Sin frutos de cáscara', en: 'Nut free', fr: 'Sans fruits à coque' },
    excludes: ['frutos-cascara', 'cacahuete'],
  },
  {
    id: 'sin-marisco',
    label: {
      es: 'Sin pescado ni marisco',
      en: 'No fish or seafood',
      fr: 'Sans poisson ni fruits de mer',
    },
    excludes: ['pescado', 'crustaceos', 'moluscos'],
  },
  {
    id: 'vegetariano',
    label: { es: 'Vegetariano', en: 'Vegetarian', fr: 'Végétarien' },
    vegetarian: true,
  },
];

/* ── Carta ─────────────────────────────────────────────────────────── */

export type CategoryId = 'menu' | 'picar' | 'arroces' | 'principales' | 'postres' | 'bebidas';

export interface Category {
  id: CategoryId;
  label: Text;
  /** Solo se enseña en este horario (menú del día) */
  schedule?: { days: number[]; from: string; to: string };
}

export const categories: Category[] = [
  {
    id: 'menu',
    label: { es: 'Menú del día', en: 'Set lunch', fr: 'Menu du jour' },
    schedule: { days: [1, 2, 3, 4, 5], from: '13:00', to: '16:00' },
  },
  { id: 'picar', label: { es: 'Para picar', en: 'To share', fr: 'À partager' } },
  { id: 'arroces', label: { es: 'Arroces', en: 'Rice dishes', fr: 'Riz' } },
  { id: 'principales', label: { es: 'Principales', en: 'Mains', fr: 'Plats' } },
  { id: 'postres', label: { es: 'Postres', en: 'Desserts', fr: 'Desserts' } },
  { id: 'bebidas', label: { es: 'Bebidas', en: 'Drinks', fr: 'Boissons' } },
];

export interface ModifierOption {
  id: string;
  label: Text;
}

export interface Modifier {
  id: string;
  label: Text;
  /** Obligatorio: no se puede añadir sin elegir */
  required: boolean;
  options: ModifierOption[];
}

/** Partida de cocina a la que va cada plato (la barra no pasa por la pantalla de cocina) */
export type Station = 'frios' | 'calientes' | 'postres' | 'barra';

export interface Dish {
  id: string;
  category: CategoryId;
  name: Text;
  text: Text;
  /** Céntimos */
  price: number;
  allergens: AllergenId[];
  vegetarian?: boolean;
  /** Agotado hoy */
  soldOut?: boolean;
  modifiers?: Modifier[];
  station: Station;
  /** Nombre corto para la comanda de cocina y el ticket */
  short: string;
}

const punto: Modifier = {
  id: 'punto',
  label: { es: 'Punto de la carne', en: 'How would you like it?', fr: 'Cuisson' },
  required: true,
  options: [
    { id: 'poco', label: { es: 'Poco hecho', en: 'Rare', fr: 'Saignant' } },
    { id: 'al-punto', label: { es: 'Al punto', en: 'Medium', fr: 'À point' } },
    { id: 'hecho', label: { es: 'Hecho', en: 'Well done', fr: 'Bien cuit' } },
  ],
};

export const dishes: Dish[] = [
  /* Menú del día: los modificadores son los platos a elegir */
  {
    id: 'menu-dia',
    category: 'menu',
    name: { es: 'Menú del día', en: 'Set lunch', fr: 'Menu du jour' },
    text: {
      es: 'Primero, segundo, postre o café, pan y bebida',
      en: 'Starter, main, dessert or coffee, bread and a drink',
      fr: 'Entrée, plat, dessert ou café, pain et boisson',
    },
    price: 1450,
    allergens: ['gluten', 'lacteos', 'pescado'],
    station: 'calientes',
    short: 'Menú del día',
    modifiers: [
      {
        id: 'primero',
        label: { es: 'Primero', en: 'Starter', fr: 'Entrée' },
        required: true,
        options: [
          {
            id: 'crema',
            label: { es: 'Crema de calabaza', en: 'Pumpkin soup', fr: 'Velouté de potiron' },
          },
          {
            id: 'ensalada',
            label: { es: 'Ensalada de la casa', en: 'House salad', fr: 'Salade maison' },
          },
        ],
      },
      {
        id: 'segundo',
        label: { es: 'Segundo', en: 'Main', fr: 'Plat' },
        required: true,
        options: [
          {
            id: 'merluza',
            label: { es: 'Merluza a la plancha', en: 'Grilled hake', fr: 'Merlu grillé' },
          },
          { id: 'pollo', label: { es: 'Pollo al horno', en: 'Roast chicken', fr: 'Poulet rôti' } },
        ],
      },
      {
        id: 'postre',
        label: { es: 'Postre', en: 'Dessert', fr: 'Dessert' },
        required: true,
        options: [
          {
            id: 'postre',
            label: { es: 'Postre del día', en: 'Dessert of the day', fr: 'Dessert du jour' },
          },
          { id: 'cafe', label: { es: 'Café', en: 'Coffee', fr: 'Café' } },
        ],
      },
    ],
  },

  /* Para picar */
  {
    id: 'croquetas',
    category: 'picar',
    name: { es: 'Croquetas de jamón', en: 'Ham croquettes', fr: 'Croquettes au jambon' },
    text: { es: '6 unidades, caseras', en: '6 pieces, homemade', fr: '6 pièces, maison' },
    price: 900,
    allergens: ['gluten', 'lacteos', 'huevo'],
    station: 'calientes',
    short: 'Croquetas',
  },
  {
    id: 'bravas',
    category: 'picar',
    name: { es: 'Bravas de la casa', en: 'House patatas bravas', fr: 'Patatas bravas maison' },
    text: {
      es: 'Patata, salsa brava y alioli',
      en: 'Potatoes, spicy sauce and aioli',
      fr: 'Pommes de terre, sauce piquante et aïoli',
    },
    price: 750,
    allergens: ['huevo'],
    vegetarian: true,
    station: 'calientes',
    short: 'Bravas',
    modifiers: [
      {
        id: 'salsa',
        label: { es: 'Salsa', en: 'Sauce', fr: 'Sauce' },
        required: false,
        options: [
          {
            id: 'ambas',
            label: { es: 'Brava y alioli', en: 'Spicy and aioli', fr: 'Piquante et aïoli' },
          },
          { id: 'brava', label: { es: 'Solo brava', en: 'Spicy only', fr: 'Piquante seule' } },
          { id: 'alioli', label: { es: 'Solo alioli', en: 'Aioli only', fr: 'Aïoli seul' } },
        ],
      },
    ],
  },
  {
    id: 'burrata',
    category: 'picar',
    name: { es: 'Ensalada de burrata', en: 'Burrata salad', fr: 'Salade de burrata' },
    text: {
      es: 'Tomate, albahaca, pesto',
      en: 'Tomato, basil, pesto',
      fr: 'Tomate, basilic, pesto',
    },
    price: 1250,
    allergens: ['lacteos', 'frutos-cascara'],
    vegetarian: true,
    station: 'frios',
    short: 'Burrata',
  },
  {
    id: 'pulpo',
    category: 'picar',
    name: { es: 'Pulpo a la brasa', en: 'Chargrilled octopus', fr: 'Poulpe grillé' },
    text: {
      es: 'Con parmentier de patata',
      en: 'With potato parmentier',
      fr: 'Avec parmentier de pommes de terre',
    },
    price: 1800,
    allergens: ['moluscos', 'lacteos'],
    station: 'calientes',
    short: 'Pulpo brasa',
  },
  {
    id: 'alcachofas',
    category: 'picar',
    name: { es: 'Alcachofas confitadas', en: 'Confit artichokes', fr: 'Artichauts confits' },
    text: { es: 'Con jamón ibérico', en: 'With Iberian ham', fr: 'Au jambon ibérique' },
    price: 1100,
    allergens: [],
    soldOut: true,
    station: 'calientes',
    short: 'Alcachofas',
  },

  /* Arroces */
  {
    id: 'senoret',
    category: 'arroces',
    name: { es: 'Arroz del señoret', en: 'Señoret rice', fr: 'Riz du señoret' },
    text: {
      es: 'Marisco pelado. Precio por persona, mínimo 2',
      en: 'Peeled seafood. Price per person, min. 2',
      fr: 'Fruits de mer décortiqués. Prix par personne, min. 2',
    },
    price: 1700,
    allergens: ['pescado', 'crustaceos', 'moluscos'],
    station: 'calientes',
    short: 'Arroz señoret',
  },
  {
    id: 'arroz-setas',
    category: 'arroces',
    name: {
      es: 'Arroz meloso de setas',
      en: 'Creamy mushroom rice',
      fr: 'Riz crémeux aux champignons',
    },
    text: {
      es: 'Setas de temporada y parmesano',
      en: 'Seasonal mushrooms and parmesan',
      fr: 'Champignons de saison et parmesan',
    },
    price: 1600,
    allergens: ['lacteos', 'apio'],
    vegetarian: true,
    station: 'calientes',
    short: 'Arroz setas',
  },

  /* Principales */
  {
    id: 'entrecot',
    category: 'principales',
    name: { es: 'Entrecot de vaca', en: 'Beef entrecôte', fr: 'Entrecôte de bœuf' },
    text: {
      es: '300 g, con patatas y pimientos',
      en: '300 g, with potatoes and peppers',
      fr: '300 g, avec pommes de terre et poivrons',
    },
    price: 2400,
    allergens: [],
    station: 'calientes',
    short: 'Entrecot',
    modifiers: [punto],
  },
  {
    id: 'secreto',
    category: 'principales',
    name: { es: 'Secreto ibérico', en: 'Iberian pork secreto', fr: 'Secreto de porc ibérique' },
    text: { es: 'Con chimichurri', en: 'With chimichurri', fr: 'Sauce chimichurri' },
    price: 1950,
    allergens: ['sulfitos'],
    station: 'calientes',
    short: 'Secreto',
  },
  {
    id: 'lubina',
    category: 'principales',
    name: { es: 'Lubina a la brasa', en: 'Chargrilled sea bass', fr: 'Bar grillé' },
    text: { es: 'Con verduras salteadas', en: 'With sautéed vegetables', fr: 'Légumes sautés' },
    price: 2100,
    allergens: ['pescado'],
    station: 'calientes',
    short: 'Lubina',
  },

  /* Postres */
  {
    id: 'tarta-queso',
    category: 'postres',
    name: { es: 'Tarta de queso', en: 'Baked cheesecake', fr: 'Gâteau au fromage' },
    text: { es: 'Al horno, cremosa', en: 'Creamy, oven-baked', fr: 'Crémeux, cuit au four' },
    price: 650,
    allergens: ['lacteos', 'huevo', 'gluten'],
    vegetarian: true,
    station: 'postres',
    short: 'Tarta queso',
  },
  {
    id: 'coulant',
    category: 'postres',
    name: { es: 'Coulant de chocolate', en: 'Chocolate fondant', fr: 'Moelleux au chocolat' },
    text: { es: 'Con helado de vainilla', en: 'With vanilla ice cream', fr: 'Glace vanille' },
    price: 700,
    allergens: ['gluten', 'lacteos', 'huevo', 'soja'],
    vegetarian: true,
    station: 'postres',
    short: 'Coulant',
  },
  {
    id: 'fruta',
    category: 'postres',
    name: { es: 'Fruta de temporada', en: 'Seasonal fruit', fr: 'Fruits de saison' },
    text: { es: 'Según mercado', en: 'Market selection', fr: 'Selon le marché' },
    price: 500,
    allergens: [],
    vegetarian: true,
    station: 'postres',
    short: 'Fruta',
  },

  /* Bebidas */
  {
    id: 'agua',
    category: 'bebidas',
    name: { es: 'Agua mineral 1 l', en: 'Still water 1 l', fr: 'Eau minérale 1 l' },
    text: { es: 'Natural o con gas', en: 'Still or sparkling', fr: 'Plate ou gazeuse' },
    price: 290,
    allergens: [],
    vegetarian: true,
    station: 'barra',
    short: 'Agua 1 l',
  },
  {
    id: 'cana',
    category: 'bebidas',
    name: { es: 'Caña', en: 'Draught beer', fr: 'Bière pression' },
    text: { es: 'Cerveza de barril', en: 'Small glass', fr: 'Petit verre' },
    price: 250,
    allergens: ['gluten'],
    vegetarian: true,
    station: 'barra',
    short: 'Caña',
  },
  {
    id: 'vino',
    category: 'bebidas',
    name: { es: 'Copa de vino tinto', en: 'Glass of red wine', fr: 'Verre de vin rouge' },
    text: { es: 'Crianza de la casa', en: 'House crianza', fr: 'Crianza de la maison' },
    price: 380,
    allergens: ['sulfitos'],
    vegetarian: true,
    station: 'barra',
    short: 'Copa tinto',
  },
];

export const getDish = (id: string) => dishes.find((d) => d.id === id);

/* ── Sala (TPV del simulador) ──────────────────────────────────────── */

export type TableState = 'libre' | 'ocupada' | 'reservada' | 'cuenta';

export interface DemoTable {
  n: number;
  seats: number;
  state: TableState;
  /** Texto pequeño bajo el número: «21:30», «48 min» */
  note?: string;
}

/** Plano de sala de La Plaza a las 21:00 de un viernes. La 7 es la de las demos */
export const tables: DemoTable[] = [
  { n: 1, seats: 2, state: 'ocupada', note: '35 min' },
  { n: 2, seats: 4, state: 'ocupada', note: 'QR · 12 min' },
  { n: 3, seats: 2, state: 'libre' },
  { n: 4, seats: 4, state: 'ocupada', note: '48 min' },
  { n: 5, seats: 6, state: 'reservada', note: '21:30' },
  { n: 6, seats: 2, state: 'cuenta', note: 'Cuenta' },
  { n: 7, seats: 4, state: 'libre' },
  { n: 8, seats: 4, state: 'ocupada', note: '20 min' },
  { n: 9, seats: 2, state: 'libre' },
  { n: 10, seats: 8, state: 'reservada', note: '22:00' },
];

export const tableStateLabels: Record<TableState, string> = {
  libre: 'Libre',
  ocupada: 'Ocupada',
  reservada: 'Reservada',
  cuenta: 'Pendiente de cobro',
};

/** Comanda que ya está en la pantalla de cocina cuando empieza el simulador */
export const kitchenBacklog = {
  label: 'Mesa 4',
  /** Segundos de reloj simulado que lleva en cocina */
  elapsed: 9 * 60,
  lines: [
    { qty: 2, name: 'Croquetas', note: '', done: true },
    { qty: 1, name: 'Pulpo brasa', note: '', done: false },
    { qty: 1, name: 'Arroz setas', note: 'sin parmesano', done: false },
  ],
};

/** Comanda que se carga si se salta al paso 2 sin haber pedido nada */
export const sampleOrder: { dish: string; qty: number; mods?: Record<string, string> }[] = [
  { dish: 'croquetas', qty: 1 },
  { dish: 'entrecot', qty: 1, mods: { punto: 'al-punto' } },
  { dish: 'burrata', qty: 1 },
  { dish: 'agua', qty: 2 },
];

/** Números del día de La Plaza antes de la venta del simulador (restaurante ficticio) */
export const salesToday = {
  /** Céntimos */
  total: 128640,
  tickets: 38,
  /** Platos más vendidos hoy: id de plato → unidades */
  top: { croquetas: 21, bravas: 17, entrecot: 12, 'tarta-queso': 11, senoret: 9 } as Record<
    string,
    number
  >,
};

/** Reloj acelerado de la cocina: 1 s real = 20 s de servicio */
export const KITCHEN_SPEED = 20;
/** A partir de aquí (segundos simulados) la comanda sale en rojo */
export const KITCHEN_LATE = 15 * 60;

/* ── Un cambio, todos los canales (D2) ─────────────────────────────── */

/** Tres platos del backoffice reducido */
export const channelDishes = ['croquetas', 'senoret', 'tarta-queso'];

/* ── Llamada de ejemplo (D4) ──────────────────────────────────────── */

export type CallScenarioId = 'reserva' | 'recoger' | 'pregunta';

export interface CallLine {
  who: 'ia' | 'cliente';
  text: string;
}

export interface CallScenario {
  id: CallScenarioId;
  tab: string;
  /** Hora de la llamada */
  at: string;
  caller: string;
  lines: CallLine[];
}

/**
 * Tres llamadas de ejemplo. Solo lo que el asistente puede hacer (docs/auditoria/06): reservas que
 * quedan POR CONFIRMAR, pedidos PARA RECOGER que el local acepta en el TPV y preguntas que
 * responde con la carta del sistema, pasando a una persona si hay alergia grave.
 */
export const callScenarios: CallScenario[] = [
  {
    id: 'reserva',
    tab: 'Reservar mesa',
    at: '20:47',
    caller: 'Pablo M.',
    lines: [
      {
        who: 'ia',
        text: 'Hola, has llamado a La Plaza. Soy el asistente del restaurante. ¿En qué te ayudo?',
      },
      { who: 'cliente', text: 'Quería reservar para mañana a las nueve. Somos cuatro.' },
      {
        who: 'ia',
        text: 'Mañana sábado a las 21:00 para cuatro tengo sitio en interior o en terraza. ¿Qué preferís?',
      },
      { who: 'cliente', text: 'Terraza. Y uno de nosotros es celíaco.' },
      {
        who: 'ia',
        text: 'Anotado: terraza y un comensal celíaco. ¿A nombre de quién la dejo?',
      },
      { who: 'cliente', text: 'Pablo Martín.' },
      {
        who: 'ia',
        text: 'Gracias, Pablo. La reserva queda pendiente de confirmar: te llegará un SMS en cuanto el restaurante la confirme.',
      },
    ],
  },
  {
    id: 'recoger',
    tab: 'Pedir para recoger',
    at: '20:31',
    caller: 'Lucía R.',
    lines: [
      {
        who: 'ia',
        text: 'Hola, has llamado a La Plaza. Soy el asistente del restaurante. ¿En qué te ayudo?',
      },
      { who: 'cliente', text: 'Quiero pedir para llevar. ¿Me lo podéis traer a casa?' },
      {
        who: 'ia',
        text: 'Por teléfono solo preparamos pedidos para recoger en el restaurante. ¿Te lo dejo para recoger?',
      },
      { who: 'cliente', text: 'Vale. Dos de croquetas y unas bravas. Paso a las nueve y media.' },
      {
        who: 'ia',
        text: 'Dos croquetas de jamón y unas bravas de la casa, 25,50 € en total, para recoger a las 21:30. ¿A nombre de quién?',
      },
      { who: 'cliente', text: 'Lucía.' },
      {
        who: 'ia',
        text: 'Hecho, Lucía. El restaurante tiene que aceptar el pedido; si hay cualquier problema, te llamarán.',
      },
    ],
  },
  {
    id: 'pregunta',
    tab: 'Horario y alérgenos',
    at: '19:58',
    caller: 'Número desconocido',
    lines: [
      {
        who: 'ia',
        text: 'Hola, has llamado a La Plaza. Soy el asistente del restaurante. ¿En qué te ayudo?',
      },
      { who: 'cliente', text: '¿Abrís el domingo a mediodía?' },
      { who: 'ia', text: 'Sí, el domingo abrimos de 13:00 a 16:00. Por la noche, cerrado.' },
      {
        who: 'cliente',
        text: '¿Y el arroz del señoret lleva gluten? Mi hija es alérgica, y bastante.',
      },
      {
        who: 'ia',
        text: 'Según nuestra carta, el arroz del señoret no lleva gluten; lleva pescado, crustáceos y moluscos. Como es una alergia importante, prefiero pasarte con el restaurante para que te lo confirmen en cocina.',
      },
      { who: 'cliente', text: 'Perfecto, gracias.' },
      { who: 'ia', text: 'Te paso ahora mismo. Un momento, por favor.' },
    ],
  },
];

/* ── Ayudas ────────────────────────────────────────────────────────── */

/** 1250 → «12,50 €» */
export const eur = (cents: number, symbol = true) => {
  const s = (cents / 100).toFixed(2).replace('.', ',');
  const withThousands = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return symbol ? `${withThousands} €` : withThousands;
};

/** Segundos → «mm:ss» */
export const clock = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/**
 * La comanda viaja de la carta QR al simulador en la URL (`/demo?comanda=…`): `id*cantidad` y los
 * modificadores como `~opción` y la nota como `!texto`, separados por comas:
 * `entrecot~al-punto!sin pimientos*1,croquetas*2`.
 */
export interface OrderLineSeed {
  dish: string;
  qty: number;
  mods?: Record<string, string>;
  note?: string;
}

export const encodeOrder = (lines: OrderLineSeed[]) =>
  lines
    .map((l) => {
      const mods = l.mods
        ? Object.values(l.mods)
            .map((o) => `~${o}`)
            .join('')
        : '';
      const note = l.note
        ? `!${l.note
            .replace(/[*,!~]/g, ' ')
            .trim()
            .slice(0, 60)}`
        : '';
      return `${l.dish}${mods}${note}*${l.qty}`;
    })
    .join(',');

export const decodeOrder = (raw: string): OrderLineSeed[] => {
  const out: OrderLineSeed[] = [];
  for (const part of raw.split(',').slice(0, 20)) {
    const [head = '', qtyRaw] = part.split('*');
    const [withMods = '', noteRaw] = head.split('!');
    const [id = '', ...opts] = withMods.split('~');
    const dish = getDish(id);
    if (!dish) continue;
    const qty = Math.min(Math.max(Number.parseInt(qtyRaw ?? '1', 10) || 1, 1), 20);
    const mods: Record<string, string> = {};
    for (const m of dish.modifiers ?? []) {
      const found = m.options.find((o) => opts.includes(o.id));
      if (found) mods[m.id] = found.id;
    }
    const note = noteRaw?.trim().slice(0, 60);
    out.push({ dish: id, qty, mods, ...(note ? { note } : {}) });
  }
  return out;
};

/** Texto de los modificadores elegidos, en español, para cocina y ticket: «al punto» */
export const modsText = (dish: Dish, mods: Record<string, string> = {}, lang: Lang = 'es') =>
  (dish.modifiers ?? [])
    .map((m) => m.options.find((o) => o.id === mods[m.id])?.label[lang])
    .filter(Boolean)
    .map((t) => (lang === 'es' ? t!.toLowerCase() : t))
    .join(' · ');

/** sessionStorage sin romper nada si está bloqueado (modo privado, iframes, cookies off) */
export const store = {
  get<T>(key: string): T | null {
    try {
      const raw = window.sessionStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: unknown) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* sin almacenamiento: la demo sigue funcionando en memoria */
    }
  },
  remove(key: string) {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      /* nada */
    }
  },
};

/** true si el visitante pidió menos movimiento */
export const prefersReducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};
