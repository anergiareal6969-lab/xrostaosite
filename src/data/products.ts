export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  primaryImage: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: 'adeio-portofoli-tshirt-anergia-szn',
    name: 'xrostao άδειο πορτοφόλι t-shirt — anergia szn',
    description:
      'Αυτό που μας ενέπνευσε να φτιάξουμε αυτό το t-shirt είναι μια καθημερινή εικόνα που βλέπουμε κάθε φορά που κοιτάμε αν μπορούμε να αγοράσουμε κάτι.',
    primaryImage: '/images/tshirts/1/main.png',
  },
  {
    id: 2,
    slug: 'gamw-tous-logariasmous-tshirt-anergia-season',
    name: 'xrostao γαμώ τους λογαριασμούς t-shirt — anergia season',
    description:
      'Απλά ένα t-shirt που όταν το φορέσεις θα νιώσεις πιο ξέγνοιαστος για τα χρέη σου.',
    primaryImage: '/images/tshirts/2/main.png',
  },
  {
    id: 3,
    slug: 'epidoma-tshirt-anergia-season',
    name: 'xrostao επίδομα t-shirt — anergia season',
    description: 'Απλά πάρε επίδομα ανεργίας. Είναι money glitch.',
    primaryImage: '/images/tshirts/3/main.png',
  },
  {
    id: 4,
    slug: 'anergia-tshirt-anergia-season',
    name: 'xrostao ανεργία t-shirt — anergia season',
    description:
      '«Άνεργος» με κόκκινα γράμματα, για να δηλώσουμε πως η ανεργία έχει βαρέσει κόκκινο.',
    primaryImage: '/images/tshirts/4/main.png',
  },
  {
    id: 5,
    slug: 'ena-fili-tshirt-anergia-season',
    name: 'xrostao ένα φιλί t-shirt — anergia season',
    description: 'Κάποια σου χρωστάει ένα φιλί ή της χρωστάς εσύ.',
    primaryImage: '/images/tshirts/5/main.png',
  },
  {
    id: 6,
    slug: 'legend-tshirt-anergia-season',
    name: 'xrostao legen(d) t-shirt — anergia season',
    description:
      'Δεν είχα να φάω.\n\nΤώρα στα πεντάστερα…\n\nΕστιατόρια: τα παρατημένα μακαρόνια ρουφάω.',
    primaryImage: '/images/tshirts/6/main.png',
  },
  {
    id: 7,
    slug: 'pagkaki-tshirt-anergia-season',
    name: 'xrostao παγκάκι t-shirt — anergia season',
    description:
      'Φόρα αυτή τη μπλούζα και πήγαινε και κάτσε σε ένα παγκάκι. Αυτό.',
    primaryImage: '/images/tshirts/7/main.png',
  },
  {
    id: 8,
    slug: 'tshirt-8-anergia-season',
    name: 'xrostao dolario t-shirt — anergia season',
    description:
      'Ένα σχέδιο που οκ το δολάριο image πλέον δεν είναι tuff, απλά η μπλούζα αυτή είναι κομπλέ.',
    primaryImage: '/images/tshirts/8/main.png',
  },
  {
    id: 9,
    slug: 'tshirt-9-anergia-season',
    name: 'xrostao tape t-shirt — anergia season',
    description: 'Δεν υπάρχει εδώ description, απλά έχει tape.',
    primaryImage: '/images/tshirts/9/main.png',
  },
  {
    id: 10,
    slug: 'tshirt-10-anergia-season',
    name: 'xrostao gimno baddie t-shirt — anergia season',
    description: 'Άμα έχεις τέτοια baddies σίγουρα θα χρωστάς for real.',
    primaryImage: '/images/tshirts/10/main.png',
  },
];

export function getProductById(id: number) {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

const MAIN_IMAGE_SCALE_BY_ID: Record<number, number> = {
  1: 1.5,
  2: 1.2,
  3: 1,
  4: 1.03,
  5: 0.97,
  6: 1.05,
  7: 1.01,
  8: 0.98,
  9: 1.01,
  10: 0.92,
};

const DETAIL_IMAGE_SCALE_BY_KEY: Record<string, number> = {
  '1-1': 1.5,
  '1-2': 1.3,
  '1-3': 1.11,
  '1-4': 1.09,
  '2-1': 1.2,
  '2-2': 1.23,
  '2-3': 1.09,
  '2-4': 1.13,
  '3-1': 1,
  '3-2': 1.39,
  '3-3': 1.18,
  '3-4': 0.97,
  '4-1': 1.03,
  '4-2': 0.99,
  '4-3': 1,
  '4-4': 1,
  '5-1': 0.97,
  '5-2': 1.15,
  '5-3': 1,
  '5-4': 1,
  '6-1': 1.05,
  '6-2': 1.06,
  '6-3': 1,
  '6-4': 1,
  '7-1': 1.01,
  '7-2': 0.78,
  '7-3': 1.11,
  '7-4': 1,
  '8-1': 0.98,
  '8-2': 1.13,
  '8-3': 1,
  '8-4': 1,
  '9-1': 1.01,
  '9-2': 1.01,
  '9-3': 1,
  '9-4': 1,
  '10-1': 0.92,
  '10-2': 0.78,
  '10-3': 1.33,
  '10-4': 1.21,
};

export function getProductMainImageScale(id: number) {
  return MAIN_IMAGE_SCALE_BY_ID[id] ?? 1;
}

export function getProductDetailImageScale(id: number, imgNum: number) {
  return DETAIL_IMAGE_SCALE_BY_KEY[`${id}-${imgNum}`] ?? getProductMainImageScale(id);
}
