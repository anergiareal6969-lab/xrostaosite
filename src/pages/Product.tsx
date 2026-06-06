import { Link, Navigate, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { getProductBySlug, getProductMainImageScale, PRODUCTS } from '../data/products';
import { SITE_NAME } from '../lib/seo';

export default function Product() {
  const { slug } = useParams();
  const product = getProductBySlug(slug || '');

  if (!product) return <Navigate to="/" />;

  const productPageImageScale = 1;
  const imageFrameSize = 800;
  const imageMaxWidth = 700;
  const title = `${product.name} | xrostao`;
  const description = product.description.replace(/\s+/g, ' ').trim();
  const relatedProducts = PRODUCTS.filter((item) => item.id !== product.id).slice(0, 3);
  const faqItems = [
    {
      question: `Τι είναι το ${product.name};`,
      answer: `${product.name} είναι μέρος του drop anergia season του xrostao και παρουσιάζεται με ξεχωριστές product φωτογραφίες και περιγραφή.`,
    },
    {
      question: 'Μπορώ να το αγοράσω απευθείας;',
      answer: 'Η λογική του site βασίζεται πρώτα σε αίτημα ενδιαφέροντος. Από τη product page μπορείς να πας στη σελίδα του t-shirt και να δεις πώς λειτουργεί το αίτημα.',
    },
    {
      question: 'Πού βλέπω περισσότερες εικόνες και λεπτομέρειες;',
      answer: 'Πάτησε στο "Δες το t-shirt" για να ανοίξεις την αναλυτική σελίδα με όλες τις εικόνες του συγκεκριμένου προϊόντος.',
    },
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: [product.primaryImage],
      brand: {
        '@type': 'Brand',
        name: SITE_NAME,
      },
      category: 'T-Shirts',
      sku: `xrostao-tshirt-${product.id}`,
      url: `/products/${product.slug}`,
      mainEntityOfPage: `/products/${product.slug}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'ρούχα',
          item: '/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: product.name,
          item: `/products/${product.slug}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <main className="relative w-full min-h-screen bg-black flex flex-col">
      <Seo
        title={title}
        description={description}
        canonicalPath={`/products/${product.slug}`}
        image={product.primaryImage}
        imageAlt={product.name}
        ogType="product"
        keywords={[product.name, 'xrostao', 't-shirt', 'anergia season', 'streetwear']}
        jsonLd={jsonLd}
      />

      {/* ===== FIXED BACKGROUND ===== */}
      <picture className="fixed-bg" aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/images/mobile/product-bg.png" />
        <img
          src="/images/product-bg.png"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          className="fixed-bg"
        />
      </picture>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-28 pb-10">
        <nav className="sr-only" aria-label="Breadcrumb">
          <Link to="/">ρούχα</Link>
          <span>{product.name}</span>
        </nav>
        <h1 className="text-white font-bold italic text-3xl md:text-5xl leading-tight">
          {product.name}
        </h1>
        <p className="text-white/80 font-sans font-medium text-base md:text-lg mt-6 whitespace-pre-wrap leading-relaxed">
          {product.description}
        </p>

        <div className="mt-10 flex flex-col xl:flex-row gap-8 xl:gap-12 items-start">
          <div
            className="w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 flex items-center justify-center p-6 md:p-8"
            style={{ maxWidth: `${imageFrameSize}px`, minHeight: `${imageFrameSize}px` }}
          >
            <img
              src={product.primaryImage}
              alt={product.name}
              className="w-full"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{
                maxWidth: `${imageMaxWidth}px`,
                ...(productPageImageScale === 1 ? {} : { transform: `scale(${productPageImageScale})`, transformOrigin: 'center' }),
              }}
            />
          </div>

          <div className="flex w-full xl:w-auto shrink-0 flex-col gap-4 xl:pt-2">
            <Link
              to={`/tshirt/${product.id}`}
              className="inline-flex items-center justify-center bg-white text-black font-bold italic py-3 px-6 rounded-xl hover:bg-white/90 transition-all active:scale-95 xl:min-w-[180px]"
            >
              Δες το t-shirt
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-white/10 text-white font-bold italic py-3 px-6 rounded-xl hover:bg-white/15 transition-all active:scale-95 xl:min-w-[180px]"
            >
              Πίσω στα ρούχα
            </Link>
          </div>
        </div>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="bg-white/8 border border-white/10 rounded-[1.75rem] p-6 md:p-8 backdrop-blur-xl shadow-2xl">
            <h2 className="text-white font-black italic text-2xl md:text-4xl leading-none">
              Γιατί ξεχωρίζει
            </h2>
            <p className="mt-5 text-white/80 leading-relaxed text-base md:text-lg">
              Το συγκεκριμένο t-shirt ανήκει στο πρώτο drop του xrostao και κρατά το ίδιο visual ύφος του
              anergia season: έντονο print, σαφές concept και φωτογραφίες που δείχνουν το ρούχο όπως πραγματικά
              εμφανίζεται μέσα στο site.
            </p>
            <p className="mt-4 text-white/70 leading-relaxed text-base md:text-lg">
              Αν θες να δεις όλες τις λήψεις ή να προχωρήσεις σε αίτημα ενδιαφέροντος, η αναλυτική σελίδα του t-shirt
              είναι το επόμενο βήμα. Εκεί εμφανίζονται οι διαφορετικές όψεις και το flow του αιτήματος.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={`/tshirt/${product.id}`} className="inline-flex items-center justify-center bg-white text-black font-bold italic py-3 px-5 rounded-xl hover:bg-white/90 transition-all">
                Άνοιξε όλες τις εικόνες
              </Link>
              <Link to="/how-it-works" className="inline-flex items-center justify-center bg-white/10 text-white font-bold italic py-3 px-5 rounded-xl hover:bg-white/15 transition-all">
                Δες το αίτημα
              </Link>
            </div>
          </article>

          <aside className="bg-white/8 border border-white/10 rounded-[1.75rem] p-6 md:p-8 backdrop-blur-xl shadow-2xl">
            <h2 className="text-white font-black italic text-2xl md:text-4xl leading-none">
              Συχνές ερωτήσεις
            </h2>
            <div className="mt-5 space-y-5">
              {faqItems.map((item) => (
                <div key={item.question} className="border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
                  <h3 className="text-white font-bold italic text-lg md:text-xl">{item.question}</h3>
                  <p className="mt-2 text-white/70 leading-relaxed text-sm md:text-base">{item.answer}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-14">
          <h2 className="text-white font-black italic text-2xl md:text-4xl leading-none">
            Σχετικά προϊόντα
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                to={`/products/${item.slug}`}
                className="flex flex-col items-center text-center bg-white/8 border border-white/10 rounded-[1.5rem] p-5 backdrop-blur-xl hover:bg-white/12 transition-colors"
              >
                <img 
                  src={item.primaryImage} 
                  alt={item.name} 
                  className="w-full max-w-[10rem] object-contain drop-shadow-2xl mb-4 pointer-events-none" 
                  loading="lazy" 
                />
                <h3 className="text-white font-bold italic text-lg leading-tight">{item.name}</h3>
                <p className="mt-3 text-white/65 text-sm leading-relaxed">
                  {item.description.replace(/\s+/g, ' ').trim()}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
