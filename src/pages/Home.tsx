import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Seo from '../components/Seo';
import FooterLinks from '../components/FooterLinks';
import { PRODUCTS } from '../data/products';

const desktopTshirtCardClassName = 'w-full max-w-[18rem] xl:max-w-[20rem] flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300';
const desktopTshirtFrameClassName = 'w-full aspect-square flex items-center justify-center';

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
      className="w-full h-auto drop-shadow-2xl aspect-square object-contain pointer-events-none select-none" 
    />
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-black flex flex-col overflow-x-hidden">
      <Seo
        title="xrostao clothing | anergia season"
        description="xrostao clothing — anergia season. Μπλούζες. Κάνε αίτημα και δήλωσε ενδιαφέρον για το drop."
        canonicalPath="/"
        image="/images/main-bg-1.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'xrostao clothing',
          url: '/',
        }}
      />

      <h1 className="sr-only">xrostao clothing — anergia season</h1>
      
      {/* ================= DESKTOP VERSION ================= */}
      <div className="hidden md:flex flex-col w-full">
        {/* Section 1: PC Background 1 */}
        <div className="relative w-full h-screen flex items-center justify-center">
          <img 
            src="/images/main-bg-1.png" 
            alt="Background 1" 
            className="absolute inset-0 w-full h-full object-cover no-select pointer-events-none z-0"
          />
          <div className="relative z-10 w-full max-w-7xl px-8 flex flex-row items-center justify-center gap-12">
            {PRODUCTS.slice(0, 3).map((product) => (
              <div 
                key={product.id}
                onClick={() => navigate(`/products/${product.slug}`)}
                className={desktopTshirtCardClassName}
              >
                <div className={desktopTshirtFrameClassName}>
                  <TshirtMainImageFallback tshirtId={product.id} name={product.name} />
                </div>
                <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-white font-black italic text-xs tracking-widest uppercase shadow-xl">
                  δεσ το tshirt
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: PC Background 2 */}
        <div className="relative w-full h-screen flex items-center justify-center">
          <img 
            src="/images/main-bg-2.png" 
            alt="Background 2" 
            className="absolute inset-0 w-full h-full object-cover no-select pointer-events-none z-0"
          />
          <div className="relative z-10 w-full max-w-7xl px-8 grid grid-cols-3 gap-12">
            {PRODUCTS.slice(3, 9).map((product) => (
              <div 
                key={product.id}
                onClick={() => navigate(`/products/${product.slug}`)}
                className={desktopTshirtCardClassName}
              >
                <div className={desktopTshirtFrameClassName}>
                  <TshirtMainImageFallback tshirtId={product.id} name={product.name} />
                </div>
                <div className="mt-4 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1 rounded-full text-white font-black italic text-[10px] tracking-widest uppercase shadow-xl">
                  δεσ το tshirt
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: PC Background 3 (Skate) */}
        <div className="relative w-full h-screen flex items-center justify-center">
          <img 
            src="/images/main-bg-3.png" 
            alt="Background 3" 
            className="absolute inset-0 w-full h-full object-cover no-select pointer-events-none z-0"
          />
          <div 
            onClick={() => navigate(`/products/${PRODUCTS[9].slug}`)}
            className={`relative z-10 ${desktopTshirtCardClassName}`}
          >
            <div className={desktopTshirtFrameClassName}>
              <TshirtMainImageFallback tshirtId={PRODUCTS[9].id} name={PRODUCTS[9].name} />
            </div>
            <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-white font-black italic text-xs tracking-widest uppercase shadow-xl">
              δεσ το tshirt
            </div>
          </div>
        </div>

        <FooterLinks />
      </div>

      {/* ================= MOBILE VERSION ================= */}
      <div className="block md:hidden w-full flex flex-col">
        {/* Mobile Section 1: Background 1 */}
        <div className="relative w-full h-screen">
          <img src="/images/mobile/main-bg-1.png" alt="Mobile BG 1" className="w-full h-full object-cover no-select" />
          <div onClick={() => navigate(`/products/${PRODUCTS[0].slug}`)} className="absolute top-[66%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={1} name={PRODUCTS[0].name} />
          </div>
        </div>

        {/* Mobile Section 2: Background 2 */}
        <div className="relative w-full h-screen">
          <img src="/images/mobile/main-bg-2.png" alt="Mobile BG 2" className="w-full h-full object-cover no-select" />
          <div onClick={() => navigate(`/products/${PRODUCTS[1].slug}`)} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={2} name={PRODUCTS[1].name} />
          </div>
          <div onClick={() => navigate(`/products/${PRODUCTS[2].slug}`)} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={3} name={PRODUCTS[2].name} />
          </div>
        </div>

        {/* Mobile Section 3: Background 3 */}
        <div className="relative w-full h-screen">
          <img src="/images/mobile/main-bg-3.png" alt="Mobile BG 3" className="w-full h-full object-cover no-select" />
          <div onClick={() => navigate(`/products/${PRODUCTS[3].slug}`)} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={4} name={PRODUCTS[3].name} />
          </div>
          <div onClick={() => navigate(`/products/${PRODUCTS[4].slug}`)} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={5} name={PRODUCTS[4].name} />
          </div>
        </div>

        {/* Mobile Section 4: Background 4 */}
        <div className="relative w-full h-screen">
          <img src="/images/mobile/main-bg-4.png" alt="Mobile BG 4" className="w-full h-full object-cover no-select" />
          <div onClick={() => navigate(`/products/${PRODUCTS[5].slug}`)} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={6} name={PRODUCTS[5].name} />
          </div>
          <div onClick={() => navigate(`/products/${PRODUCTS[6].slug}`)} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={7} name={PRODUCTS[6].name} />
          </div>
        </div>

        {/* Mobile Section 5: Background 5 */}
        <div className="relative w-full h-screen">
          <img src="/images/mobile/main-bg-5.png" alt="Mobile BG 5" className="w-full h-full object-cover no-select" />
          <div onClick={() => navigate(`/products/${PRODUCTS[7].slug}`)} className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={8} name={PRODUCTS[7].name} />
          </div>
        </div>

        {/* Mobile Section 6: Background 6 */}
        <div className="relative w-full h-screen">
          <img src="/images/mobile/main-bg-6.png" alt="Mobile BG 6" className="w-full h-full object-cover no-select" />
          <div onClick={() => navigate(`/products/${PRODUCTS[8].slug}`)} className="absolute top-[21%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={9} name={PRODUCTS[8].name} />
          </div>
          <div onClick={() => navigate(`/products/${PRODUCTS[9].slug}`)} className="absolute top-[71%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] hover:scale-105 transition-transform">
            <TshirtMainImageFallback tshirtId={10} name={PRODUCTS[9].name} />
          </div>
        </div>

        {/* Mobile Section 7: Background 7 */}
        <div className="relative w-full h-screen">
          <img src="/images/mobile/main-bg-7.png" alt="Mobile BG 7" className="w-full h-full object-cover no-select" />
        </div>

        <FooterLinks />
      </div>
    </div>
  );
}
