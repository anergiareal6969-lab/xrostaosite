import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { PRODUCTS } from '../data/products';

function TshirtMainImageFallback({ tshirtId, name }: { tshirtId: number, name: string }) {
  const [cacheBuster] = useState(Date.now());
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
      className="w-full h-auto drop-shadow-2xl aspect-square object-contain" 
    />
  );
}

const DESKTOP_TSHIRT_POSITIONS = [
  'top-[8%] left-[8%] w-[18%]',
  'top-[16%] right-[8%] w-[18%]',
  'top-[28%] left-[18%] w-[18%]',
  'top-[36%] right-[18%] w-[18%]',
  'top-[48%] left-[9%] w-[18%]',
  'top-[56%] right-[10%] w-[18%]',
  'top-[67%] left-[24%] w-[17%]',
  'top-[73%] right-[26%] w-[17%]',
  'top-[82%] left-[8%] w-[16%]',
  'top-[84%] right-[10%] w-[16%]',
] as const;

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-black flex flex-col">
      <Seo
        title="xrostao clothing | anergia season"
        description="xrostao clothing — anergia season. Μπλούζες. Κάνε αίτημα και δήλωσε ενδιαφέρον για το drop."
        canonicalPath="/"
        image="/images/main-bg-1.jpg"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'xrostao clothing',
          url: '/',
        }}
      />

      <h1 className="sr-only">xrostao clothing — anergia season</h1>
      <p className="sr-only">
        Streetwear drop με μπλούζες (t-shirts). Δες τα προϊόντα και κάνε αίτημα ενδιαφέροντος.
      </p>
      
      {/* ================= DESKTOP VERSION ================= */}
      <div className="hidden md:block relative w-full">
        {/* Desktop Backgrounds */}
        <img src="/images/main-bg-1.jpg" alt="Background 1" className="w-full h-auto block" />
        <img src="/images/main-bg-2.jpg" alt="Background 2" className="w-full h-auto block" />
        <img src="/images/main-bg-3.jpg" alt="Background 3" className="w-full h-auto block" />
        
        {/* Desktop T-shirts Overlay */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {PRODUCTS.map((product, index) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              className={`absolute pointer-events-auto transition-opacity hover:opacity-90 ${DESKTOP_TSHIRT_POSITIONS[index]}`}
            >
              <TshirtMainImageFallback tshirtId={product.id} name={product.name} />
            </Link>
          ))}
        </div>
      </div>

      {/* ================= MOBILE VERSION ================= */}
      <div className="block md:hidden w-full flex flex-col">
        
        {/* Section 1 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-1.png" alt="Mobile Background 1" className="w-full h-auto block" />
          <Link to={`/products/${PRODUCTS[0].slug}`} className="absolute top-[66%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={1} name={PRODUCTS[0].name} />
          </Link>
        </div>

        {/* Section 2 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-2.png" alt="Mobile Background 2" className="w-full h-auto block" />
          <Link to={`/products/${PRODUCTS[1].slug}`} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={2} name={PRODUCTS[1].name} />
          </Link>
          <Link to={`/products/${PRODUCTS[2].slug}`} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={3} name={PRODUCTS[2].name} />
          </Link>
        </div>

        {/* Section 3 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-3.png" alt="Mobile Background 3" className="w-full h-auto block" />
          <Link to={`/products/${PRODUCTS[3].slug}`} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={4} name={PRODUCTS[3].name} />
          </Link>
          <Link to={`/products/${PRODUCTS[4].slug}`} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={5} name={PRODUCTS[4].name} />
          </Link>
        </div>

        {/* Section 4 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-4.png" alt="Mobile Background 4" className="w-full h-auto block" />
          <Link to={`/products/${PRODUCTS[5].slug}`} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={6} name={PRODUCTS[5].name} />
          </Link>
          <Link to={`/products/${PRODUCTS[6].slug}`} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={7} name={PRODUCTS[6].name} />
          </Link>
        </div>

        {/* Section 5 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-5.png" alt="Mobile Background 5" className="w-full h-auto block" />
          <Link to={`/products/${PRODUCTS[7].slug}`} className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={8} name={PRODUCTS[7].name} />
          </Link>
        </div>

        {/* Section 6 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-6.png" alt="Mobile Background 6" className="w-full h-auto block" />
          <Link to={`/products/${PRODUCTS[8].slug}`} className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={9} name={PRODUCTS[8].name} />
          </Link>
        </div>

        {/* Section 7 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-7.png" alt="Mobile Background 7" className="w-full h-auto block" />
          <Link to={`/products/${PRODUCTS[9].slug}`} className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={10} name={PRODUCTS[9].name} />
          </Link>
        </div>
      </div>

    </div>
  );
}
