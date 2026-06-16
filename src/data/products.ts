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
    name: 'xrostao άδειο πορτοφόλι t-shirt anergia season',
    description: 'Αυτό που μας ενέπνευσε να φτιάξουμε αυτό το t-shirt είναι μια καθημερινή εικόνα που βλέπουμε κάθε φορά που κοιτάμε άμα μπορούμε να αγοράσουμε κάτι.',
    primaryImage: '/images/tshirts/1/main.png',
  },
  {
    id: 2,
    slug: 'epidoma-tshirt-anergia-season',
    name: 'xrostao επίδομα t-shirt anergia season',
    description: 'Απλά πάρε επίδομα ανεργίας, είναι δωρεάν χρήματα!!',
    primaryImage: '/images/tshirts/2/main.png',
  },
  {
    id: 3,
    slug: 'agrios-san-tigris-tshirt-anergia-season',
    name: 'xrostao άγριος σαν τίγρης t-shirt anergia season',
    description: 'Αυτό το t-shirt είναι για σκληρούς τίγρεις.',
    primaryImage: '/images/tshirts/3/main.png',
  },
  {
    id: 4,
    slug: 'ena-fili-tshirt-anergia-season',
    name: 'xrostao ένα φιλί t-shirt anergia season',
    description: 'Κάποια/ος σας χρωστάει ένα φιλί ή της/του χρωστάτε εσείς.',
    primaryImage: '/images/tshirts/4/main.png',
  },
  {
    id: 5,
    slug: 'ftino-faghto-tshirt-anergia-season',
    name: 'xrostao φθηνό φαγητό t-shirt anergia season',
    description: 'Αντί να φας κάτι πάρε αυτή την μπλούζα.',
    primaryImage: '/images/tshirts/5/main.png',
  },
  {
    id: 6,
    slug: 'tape-tshirt-anergia-season',
    name: 'xrostao tape t-shirt anergia season',
    description: 'Δεν υπάρχει εδώ description απλά έχει tape.',
    primaryImage: '/images/tshirts/6/main.png',
  },
  {
    id: 7,
    slug: 'pagkaki-tshirt-anergia-season',
    name: 'xrostao παγκάκι t-shirt anergia season',
    description: 'Φόρα αυτή την μπλούζα και πήγαινε και κάτσε σε ένα παγκάκι, αυτό.',
    primaryImage: '/images/tshirts/7/main.png',
  },
  {
    id: 8,
    slug: 'arabiko-tshirt-anergia-season',
    name: 'xrostao αραβικό t-shirt anergia season',
    description: 'Τα αραβικά γράμματα είναι fire απλά για αυτό υπάρχει αυτό το t-shirt.',
    primaryImage: '/images/tshirts/8/main.png',
  },
  {
    id: 9,
    slug: 'gimno-baddie-tshirt-anergia-season',
    name: 'xrostao γυμνό baddie t-shirt anergia season',
    description: 'Από billionaire σε millionaire.',
    primaryImage: '/images/tshirts/9/main.png',
  },
  {
    id: 10,
    slug: 'astegos-tshirt-anergia-season',
    name: 'xrostao άστεγος t-shirt anergia season',
    description: 'Άνεργος με κόκκινα γράμματα για να δηλώσουμε πως η ανεργία έχει βαρέσει κόκκινο.',
    primaryImage: '/images/tshirts/10/main.png',
  },
  {
    id: 11,
    slug: 'gamw-tous-logariasmous-tshirt-anergia-season',
    name: 'xrostao γαμώ τους λογαριασμούς t-shirt anergia season',
    description: 'Απλά ένα t-shirt που όταν το φορέσεις θα νιώσεις πιο ξέγνοιαστος για τα χρέη σου.',
    primaryImage: '/images/tshirts/11/main.png',
  },
  {
    id: 12,
    slug: 'expired-idol-tshirt-anergia-season',
    name: 'xrostao expired idol tshirt',
    description: 'Κάποτε θεωρούνταν 10άρι, ενώ πλέον όχι, οπότε γαμάει η ειρωνεία, στα ρούχα',
    primaryImage: '/images/tshirts/12/main.png',
  },
  {
    id: 13,
    slug: 'greek-traditions-tshirt-anergia-season',
    name: 'xrostao greek traditions tshirt',
    description: 'Πώς καταλαβαίνεις ότι γαμάει να είσαι στην Ελλάδα',
    primaryImage: '/images/tshirts/13/main.png',
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
  11: 1.2,
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
  return 1;
}

export function getProductDetailImageScale(id: number, imgNum: number) {
  return 1;
}
