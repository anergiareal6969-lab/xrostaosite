import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import FooterLinks from '../components/FooterLinks';
import { INFO_PAGE_KEYS, INFO_PAGES } from '../data/infoPages';
import { getProductMainImageScale, PRODUCTS } from '../data/products';
import { SITE_NAME } from '../lib/seo';

const desktopTshirtCardClassName = 'w-full max-w-[28rem] xl:max-w-[34rem] flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300';
const desktopTshirtFrameClassName = 'w-full aspect-square flex items-center justify-center';
const featuredInfoKeys = ['who', 'idea', 'how'] as const;

function TshirtMainImageFallback({
  tshirtId,
  name,
  loading = 'lazy',
  fetchPriority = 'auto',
}: {
  tshirtId: number;
  name: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
}) {
  const imageScale = getProductMainImageScale(tshirtId);
  const paths = [
    `/images/tshirts/${tshirtId}/main.png`,
    `/images/tshirts/${tshirtId}/main.jpeg`,
    `/images/tshirts/${tshirtId}/main.jpg`,
    `/images/tshirts/${tshirtId}/main.webp`,
    `/images/tshirts/${tshirtId}/page-1.png`,
    `/images/tshirts/${tshirtId}/page-1.jpeg`,
    `/images/tshirts/${tshirtId}/page-1.jpg`,
    `/images/tshirts/${tshirtId}/page-1.webp`
  ];
  const [pathIndex, setPathIndex] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);

  const currentPath = paths[pathIndex];

  if (hasFailed) return <div className="w-full aspect-square bg-gray-900/20 rounded-lg animate-pulse" />;

  return (
    <img
      key={`${tshirtId}-${pathIndex}`}
      src={currentPath}
      alt={name}
      onError={() => {
        if (pathIndex < paths.length - 1) {
          setPathIndex(prev => prev + 1);
        } else {
          setHasFailed(true);
        }
      }}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className="w-full h-auto drop-shadow-2xl aspect-square object-contain pointer-events-none select-none"
      style={imageScale === 1 ? undefined : { transform: `scale(${imageScale})`, transformOrigin: 'center' }}
    />
  );
}

function HomeSeoSection() {
  return (
    <section className="relative z-10 w-full px-4 py-16 md:py-24">
      {/* Dark overlay so glass cards are readable over the fixed bg */}
      <div className="pointer-events-none absolute inset-0 bg-black/60" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto">
        {/* Outer glass container */}
        <div className="relative overflow-hidden rounded-[2.5rem]">
          <div className="pointer-events-none absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_42%)]" aria-hidden="true" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start p-4 md:p-6">
            <article className="relative overflow-hidden bg-white/8 border border-white/10 rounded-[2rem] backdrop-blur-xl p-6 md:p-10 shadow-2xl">
              <div className="relative z-10">
                <h2 className="text-white font-black italic text-3xl md:text-5xl leading-none">
                  xrostao
                  <br />
                  και anergia season
                </h2>
                <p className="mt-6 text-white/55 font-black italic text-xs sm:text-sm uppercase tracking-[0.2em]">
                  Ακουλουθεί ai generated κειμενο.
                </p>
                <p className="mt-4 text-white/80 font-medium text-base md:text-lg leading-relaxed">
                  Το xrostao είναι ένα streetwear project με επίκεντρο t-shirts, visual ταυτότητα και ένα ύφος που
                  πατάει πάνω στην ανεργία, την καθημερινή πίεση και το ειρωνικό humor του drop anergia season.
                </p>
                <p className="mt-4 text-white/70 font-medium text-base md:text-lg leading-relaxed">
                  Στο site θα βρεις τα βασικά προϊόντα του drop, ξεχωριστές product pages, info pages για το concept και το
                  πώς λειτουργεί το αίτημα ενδιαφέροντος, μαζί με αναλυτικές εικόνες για κάθε t-shirt.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/how-it-works" className="inline-flex items-center justify-center bg-white text-black font-bold italic py-3 px-5 rounded-xl hover:bg-white/90 transition-all">
                    Πώς λειτουργεί
                  </Link>
                  <Link to="/who-we-are" className="inline-flex items-center justify-center bg-white/10 text-white font-bold italic py-3 px-5 rounded-xl hover:bg-white/15 transition-all">
                    Ποιοι είμαστε
                  </Link>
                </div>
              </div>
            </article>

            <aside className="grid gap-4">
              {featuredInfoKeys.map((key) => (
                <Link
                  key={key}
                  to={INFO_PAGES[key].path}
                  className="block bg-white/8 border border-white/10 rounded-[1.5rem] backdrop-blur-xl p-5 hover:bg-white/12 transition-colors"
                >
                  <h3 className="text-white font-black italic text-xl md:text-2xl leading-tight">
                    {INFO_PAGES[key].title}
                  </h3>
                  <p className="mt-3 text-white/70 text-sm md:text-base leading-relaxed">
                    {INFO_PAGES[key].description}
                  </p>
                </Link>
              ))}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const homeJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      alternateName: ['xrostao', 'χροσταω', 'χροσταω clothing'],
      url: '/',
      logo: '/images/ai-top.png',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      alternateName: ['xrostao', 'χροσταω clothing'],
      url: '/',
      inLanguage: 'el-GR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'xrostao | χροσταω ρούχα και t-shirts',
      description: 'Συλλογή με xrostao t-shirts από το drop anergia season.',
      url: '/',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: PRODUCTS.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `/products/${product.slug}`,
          name: product.name,
          image: product.primaryImage,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: INFO_PAGE_KEYS.map((key) => ({
        '@type': 'Question',
        name: INFO_PAGES[key].title,
        acceptedAnswer: {
          '@type': 'Answer',
          text: INFO_PAGES[key].text,
        },
      })),
    },
  ];

  return (
    <main className="relative w-full min-h-screen bg-black flex flex-col overflow-x-hidden">
      <Seo
        title="xrostao | χροσταω ρούχα και t-shirts"
        description="xrostao και χροσταω ρούχα. T-shirts από το drop anergia season, προϊόντα xrostao και αίτημα ενδιαφέροντος για το brand."
        canonicalPath="/"
        image="/images/ai-top.png"
        imageAlt="xrostao logo"
        keywords={[
          'xrostao clothing',
          'χροσταω ρούχα',
          'xrostao t-shirts',
          'anergia season',
          'streetwear',
          'ελληνικά t-shirts',
        ]}
        jsonLd={homeJsonLd}
      />

      <h1 className="sr-only">xrostao, χροσταω και t-shirts anergia season</h1>
      <p className="sr-only">
        Το xrostao είναι brand με χροσταω ρούχα, t-shirts και προϊόντα από το drop anergia season.
        Εδώ βρίσκεις xrostao t-shirts, προϊόντα και πληροφορίες για το αίτημα ενδιαφέροντος.
      </p>

      {/* ===== FIXED BACKGROUND ===== */}
      <picture className="fixed-bg" aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/images/mobile/home-bg.png" />
        <img
          src="/images/home-bg.png"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          className="fixed-bg"
        />
      </picture>

      {/* ===== SCROLLABLE CONTENT ===== */}
      <div className="relative z-10 w-full flex flex-col">

        {/* ================= DESKTOP VERSION ================= */}
        <div className="hidden md:flex w-full flex-col items-center gap-8 pt-[20vh] pb-16" aria-label="Συλλογή προϊόντων για desktop">
          {Array.from({ length: Math.ceil(PRODUCTS.length / 3) }).map((_, rowIndex) => {
            const rowProducts = PRODUCTS.slice(rowIndex * 3, rowIndex * 3 + 3);
            return (
              <section key={rowIndex} className="w-full min-h-[60dvh] flex items-center justify-center py-8" aria-label={`Σειρά προϊόντων ${rowIndex + 1}`}>
                <div className="w-full max-w-[120rem] px-8 flex flex-row flex-wrap items-center justify-center gap-12 xl:gap-16">
                  {rowProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      aria-label={`Δες το προϊόν ${product.name}`}
                      className={desktopTshirtCardClassName}
                    >
                      <div className={desktopTshirtFrameClassName}>
                        <TshirtMainImageFallback
                          tshirtId={product.id}
                          name={product.name}
                          loading={rowIndex === 0 ? "eager" : "lazy"}
                          fetchPriority={rowIndex === 0 && product.id === 1 ? 'high' : 'auto'}
                        />
                      </div>
                      <div className="mt-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-white font-black italic text-xs tracking-widest uppercase shadow-xl">
                        δεσ το tshirt
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* ================= MOBILE VERSION ================= */}
        <div className="block md:hidden w-full flex flex-col mt-[30vh]" aria-label="Συλλογή προϊόντων για mobile">
          {PRODUCTS.map((product, index) => (
            <section
              key={product.id}
              className="relative w-full min-h-[60svh] flex items-center justify-center py-12"
              aria-label={product.name}
            >
              <Link
                to={`/products/${product.slug}`}
                aria-label={`Δες το προϊόν ${product.name}`}
                className="w-[95%] max-w-md flex flex-col items-center hover:scale-105 transition-transform duration-300"
              >
                <TshirtMainImageFallback
                  tshirtId={product.id}
                  name={product.name}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                />
                <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-white font-black italic text-xs tracking-widest uppercase shadow-xl">
                  δεσ το tshirt
                </div>
              </Link>
            </section>
          ))}
        </div>

        {/* ===== SEO SECTION ===== */}
        <HomeSeoSection />

        {/* ===== FOOTER ===== */}
        <FooterLinks />
      </div>

      <nav className="sr-only" aria-label="Γρήγορη πλοήγηση xrostao">
        {PRODUCTS.map((product) => (
          <Link key={product.id} to={`/products/${product.slug}`}>
            {product.name}
          </Link>
        ))}
        {INFO_PAGE_KEYS.map((key) => (
          <Link key={key} to={INFO_PAGES[key].path}>
            {INFO_PAGES[key].title}
          </Link>
        ))}
      </nav>
    </main>
  );
}

