import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import FooterLinks from '../components/FooterLinks';
import { INFO_PAGE_KEYS, INFO_PAGES } from '../data/infoPages';
import { getProductMainImageScale, PRODUCTS } from '../data/products';
import { SITE_NAME } from '../lib/seo';

const desktopTshirtCardClassName = 'w-full max-w-[18rem] xl:max-w-[20rem] flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300';
const desktopTshirtFrameClassName = 'w-full aspect-square flex items-center justify-center';

function TshirtMainImageFallback({ tshirtId, name }: { tshirtId: number, name: string }) {
  const [cacheBuster] = useState(Date.now());
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

  const currentPath = `${paths[pathIndex]}?v=${cacheBuster}`;

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
      className="w-full h-auto drop-shadow-2xl aspect-square object-contain pointer-events-none select-none"
      style={imageScale === 1 ? undefined : { transform: `scale(${imageScale})`, transformOrigin: 'center' }}
    />
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
      name: 'xrostao clothing | χροσταω ρούχα και t-shirts',
      description: 'Συλλογή με xrostao clothing t-shirts από το drop anergia season.',
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
        title="xrostao clothing | χροσταω ρούχα και t-shirts"
        description="xrostao clothing και χροσταω ρούχα. T-shirts από το drop anergia season, προϊόντα xrostao clothing και αίτημα ενδιαφέροντος για το brand xrostao."
        canonicalPath="/"
        image="/images/main-bg-1.png"
        imageAlt="xrostao clothing t-shirts από το drop anergia season"
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

      <h1 className="sr-only">xrostao clothing, χροσταω clothing και t-shirts anergia season</h1>
      <p className="sr-only">
        Το xrostao clothing είναι brand με χροσταω ρούχα, t-shirts και προϊόντα από το drop anergia season.
        Εδώ βρίσκεις xrostao t-shirts, χροσταω clothing προϊόντα και πληροφορίες για το αίτημα ενδιαφέροντος.
      </p>
      
      {/* ================= DESKTOP VERSION ================= */}
      <div className="hidden md:flex flex-col w-full" aria-label="Συλλογή προϊόντων για desktop">
        {/* Section 1: PC Background 1 */}
        <section className="relative w-full h-[100dvh] flex items-center justify-center" aria-label="Πρώτη σειρά προϊόντων">
          <img 
            src="/images/main-bg-1.png" 
            alt=""
            aria-hidden="true"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover no-select pointer-events-none z-0"
          />
          <div className="relative z-10 w-full max-w-7xl px-8 flex flex-row items-center justify-center gap-12">
            {PRODUCTS.slice(0, 3).map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                aria-label={`Δες το προϊόν ${product.name}`}
                className={desktopTshirtCardClassName}
              >
                <div className={desktopTshirtFrameClassName}>
                  <TshirtMainImageFallback tshirtId={product.id} name={product.name} />
                </div>
                <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-white font-black italic text-xs tracking-widest uppercase shadow-xl">
                  δεσ το tshirt
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 2: PC Background 2 */}
        <section className="relative w-full h-[100dvh] flex items-center justify-center" aria-label="Δεύτερη σειρά προϊόντων">
          <img 
            src="/images/main-bg-2.png" 
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover no-select pointer-events-none z-0"
          />
          <div className="relative z-10 w-full max-w-7xl px-8 grid grid-cols-3 justify-items-center gap-12 translate-x-2 xl:translate-x-4">
            {PRODUCTS.slice(3, 9).map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                aria-label={`Δες το προϊόν ${product.name}`}
                className={desktopTshirtCardClassName}
              >
                <div className={desktopTshirtFrameClassName}>
                  <TshirtMainImageFallback tshirtId={product.id} name={product.name} />
                </div>
                <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-white font-black italic text-xs tracking-widest uppercase shadow-xl">
                  δεσ το tshirt
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: PC Background 3 (Skate) */}
        <section className="relative w-full h-[100dvh] flex items-center justify-center" aria-label="Τελικό featured προϊόν">
          <img 
            src="/images/main-bg-3.png" 
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover no-select pointer-events-none z-0"
          />
          <Link
            to={`/products/${PRODUCTS[9].slug}`}
            aria-label={`Δες το προϊόν ${PRODUCTS[9].name}`}
            className={`relative z-10 translate-x-2 xl:translate-x-4 ${desktopTshirtCardClassName}`}
          >
            <div className={desktopTshirtFrameClassName}>
              <TshirtMainImageFallback tshirtId={PRODUCTS[9].id} name={PRODUCTS[9].name} />
            </div>
            <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-white font-black italic text-xs tracking-widest uppercase shadow-xl">
              δεσ το tshirt
            </div>
          </Link>
        </section>

        <FooterLinks />
      </div>

      {/* ================= MOBILE VERSION ================= */}
      <div className="block md:hidden w-full flex flex-col" aria-label="Συλλογή προϊόντων για mobile">
        {/* Mobile Section 1: Background 1 */}
        <section className="relative w-full h-[100dvh]" aria-label={PRODUCTS[0].name}>
          <img src="/images/mobile/main-bg-1.png" alt="" aria-hidden="true" loading="eager" className="w-full h-full object-cover no-select" />
          <Link to={`/products/${PRODUCTS[0].slug}`} aria-label={`Δες το προϊόν ${PRODUCTS[0].name}`} className="absolute top-[66%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={1} name={PRODUCTS[0].name} />
          </Link>
        </section>

        {/* Mobile Section 2: Background 2 */}
        <section className="relative w-full h-[100dvh]" aria-label="Δεύτερη mobile ενότητα προϊόντων">
          <img src="/images/mobile/main-bg-2.png" alt="" aria-hidden="true" loading="eager" className="w-full h-full object-cover no-select" />
          <Link to={`/products/${PRODUCTS[1].slug}`} aria-label={`Δες το προϊόν ${PRODUCTS[1].name}`} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={2} name={PRODUCTS[1].name} />
          </Link>
          <Link to={`/products/${PRODUCTS[2].slug}`} aria-label={`Δες το προϊόν ${PRODUCTS[2].name}`} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={3} name={PRODUCTS[2].name} />
          </Link>
        </section>

        {/* Mobile Section 3: Background 3 */}
        <section className="relative w-full h-[100dvh]" aria-label="Τρίτη mobile ενότητα προϊόντων">
          <img src="/images/mobile/main-bg-3.png" alt="" aria-hidden="true" className="w-full h-full object-cover no-select" />
          <Link to={`/products/${PRODUCTS[3].slug}`} aria-label={`Δες το προϊόν ${PRODUCTS[3].name}`} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={4} name={PRODUCTS[3].name} />
          </Link>
          <Link to={`/products/${PRODUCTS[4].slug}`} aria-label={`Δες το προϊόν ${PRODUCTS[4].name}`} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={5} name={PRODUCTS[4].name} />
          </Link>
        </section>

        {/* Mobile Section 4: Background 4 */}
        <section className="relative w-full h-[100dvh]" aria-label="Τέταρτη mobile ενότητα προϊόντων">
          <img src="/images/mobile/main-bg-4.png" alt="" aria-hidden="true" className="w-full h-full object-cover no-select" />
          <Link to={`/products/${PRODUCTS[5].slug}`} aria-label={`Δες το προϊόν ${PRODUCTS[5].name}`} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={6} name={PRODUCTS[5].name} />
          </Link>
          <Link to={`/products/${PRODUCTS[6].slug}`} aria-label={`Δες το προϊόν ${PRODUCTS[6].name}`} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={7} name={PRODUCTS[6].name} />
          </Link>
        </section>

        {/* Mobile Section 5: Background 5 */}
        <section className="relative w-full h-[100dvh]" aria-label={PRODUCTS[7].name}>
          <img src="/images/mobile/main-bg-5.png" alt="" aria-hidden="true" className="w-full h-full object-cover no-select" />
          <Link to={`/products/${PRODUCTS[7].slug}`} aria-label={`Δες το προϊόν ${PRODUCTS[7].name}`} className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={8} name={PRODUCTS[7].name} />
          </Link>
        </section>

        {/* Mobile Section 6: Background 6 */}
        <section className="relative w-full h-[100dvh]" aria-label="Έκτη mobile ενότητα προϊόντων">
          <img src="/images/mobile/main-bg-6.png" alt="" aria-hidden="true" className="w-full h-full object-cover no-select" />
          <Link to={`/products/${PRODUCTS[8].slug}`} aria-label={`Δες το προϊόν ${PRODUCTS[8].name}`} className="absolute top-[21%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={9} name={PRODUCTS[8].name} />
          </Link>
          <Link to={`/products/${PRODUCTS[9].slug}`} aria-label={`Δες το προϊόν ${PRODUCTS[9].name}`} className="absolute top-[71%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={10} name={PRODUCTS[9].name} />
          </Link>
        </section>

        {/* Mobile Section 7: Background 7 */}
        <section className="relative w-full h-[100dvh]" aria-label="Τελευταίο visual section">
          <img src="/images/mobile/main-bg-7.png" alt="" aria-hidden="true" className="w-full h-full object-cover no-select" />
        </section>

        <FooterLinks />
      </div>

      <nav className="sr-only" aria-label="Γρήγορη πλοήγηση xrostao clothing">
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
