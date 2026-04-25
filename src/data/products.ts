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
];

export function getProductById(id: number) {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
