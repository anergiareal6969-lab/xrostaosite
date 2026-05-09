import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Seo from '../components/Seo';
import FooterLinks from '../components/FooterLinks';
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
      className="w-full h-auto drop-shadow-2xl aspect-square object-contain pointer-events-none select-none" 
    />
  );
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const step = 300 + 48;

  return (
    <div className="relative w-full min-h-screen bg-black flex flex-col overflow-x-hidden">
      <Seo
        title="xrostao clothing | anergia season"
        description="xrostao clothing — anergia season. Μπλούζες. Κάνε αίτημα και δήλωσε ενδιαφέρον για το drop."
        canonicalPath="/"
        image="/images/main-bg.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'xrostao clothing',
          url: '/',
        }}
      />

      <h1 className="sr-only">xrostao clothing — anergia season</h1>
      
      {/* ================= DESKTOP VERSION ================= */}
      <div className="hidden md:flex relative w-full h-screen overflow-hidden items-center justify-center">
        {/* Main Background */}
        <img 
          src="/images/main-bg.png" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover no-select pointer-events-none z-0"
        />
        
        {/* T-shirts Carousel */}
        <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full">
            {PRODUCTS.map((product, index) => {
              const isCenter = index === currentIndex;
              const distance = Math.abs(index - currentIndex);
              const x = (index - currentIndex) * step;

              return (
                <motion.div
                  key={product.id}
                  initial={false}
                  animate={{
                    x,
                    scale: isCenter ? 1 : 0.72,
                    opacity: isCenter ? 1 : 0.25,
                    filter: isCenter ? 'blur(0px) brightness(1)' : 'blur(10px) brightness(0.6)',
                    zIndex: isCenter ? 30 : 20 - distance
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 35 }}
                  onMouseDown={(e) => {
                    if (e.button !== 0) return;
                    setCurrentIndex(index);
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] aspect-square flex flex-col items-center justify-center cursor-pointer select-none"
                >
                  <TshirtMainImageFallback tshirtId={product.id} name={product.name} />

                  {isCenter && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${product.slug}`);
                      }}
                      className="absolute -bottom-24 bg-white/10 backdrop-blur-xl border border-white/30 px-10 py-4 rounded-2xl text-white font-black italic text-base tracking-widest uppercase hover:bg-white/20 transition-all shadow-2xl ring-1 ring-white/20 whitespace-nowrap"
                    >
                      δεσ το tshirt
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MOBILE VERSION ================= */}
      <div className="block md:hidden w-full flex flex-col">
        {/* Section 1 */}
        <div className="relative w-full">
          <img 
            src="/images/mobile/main-bg-1.png" 
            alt="Mobile Background 1" 
            className="w-full h-auto block no-select"
          />
          <div onClick={() => navigate(`/products/${PRODUCTS[0].slug}`)} className="absolute top-[66%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={1} name={PRODUCTS[0].name} />
          </div>
        </div>

        {/* Section 2 */}
        <div className="relative w-full">
          <img 
            src="/images/mobile/main-bg-2.png" 
            alt="Mobile Background 2" 
            className="w-full h-auto block no-select" 
          />
          <div onClick={() => navigate(`/products/${PRODUCTS[1].slug}`)} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={2} name={PRODUCTS[1].name} />
          </div>
          <div onClick={() => navigate(`/products/${PRODUCTS[2].slug}`)} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={3} name={PRODUCTS[2].name} />
          </div>
        </div>

        {/* Section 3 */}
        <div className="relative w-full">
          <img 
            src="/images/mobile/main-bg-3.png" 
            alt="Mobile Background 3" 
            className="w-full h-auto block no-select" 
          />
          <div onClick={() => navigate(`/products/${PRODUCTS[3].slug}`)} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={4} name={PRODUCTS[3].name} />
          </div>
          <div onClick={() => navigate(`/products/${PRODUCTS[4].slug}`)} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={5} name={PRODUCTS[4].name} />
          </div>
        </div>

        {/* Section 4 */}
        <div className="relative w-full">
          <img 
            src="/images/mobile/main-bg-4.png" 
            alt="Mobile Background 4" 
            className="w-full h-auto block no-select" 
          />
          <div onClick={() => navigate(`/products/${PRODUCTS[5].slug}`)} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={6} name={PRODUCTS[5].name} />
          </div>
          <div onClick={() => navigate(`/products/${PRODUCTS[6].slug}`)} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={7} name={PRODUCTS[6].name} />
          </div>
        </div>

        {/* Section 5 */}
        <div className="relative w-full">
          <img 
            src="/images/mobile/main-bg-5.png" 
            alt="Mobile Background 5" 
            className="w-full h-auto block no-select" 
          />
          <div onClick={() => navigate(`/products/${PRODUCTS[7].slug}`)} className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={8} name={PRODUCTS[7].name} />
          </div>
        </div>

        {/* Section 6 */}
        <div className="relative w-full">
          <img 
            src="/images/mobile/main-bg-6.png" 
            alt="Mobile Background 6" 
            className="w-full h-auto block no-select" 
          />
          <div onClick={() => navigate(`/products/${PRODUCTS[8].slug}`)} className="absolute top-[21%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={9} name={PRODUCTS[8].name} />
          </div>
          <div onClick={() => navigate(`/products/${PRODUCTS[9].slug}`)} className="absolute top-[71%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={10} name={PRODUCTS[9].name} />
          </div>
        </div>

        {/* Section 7 */}
        <div className="relative w-full">
          <img 
            src="/images/mobile/main-bg-7.png" 
            alt="Mobile Background 7" 
            className="w-full h-auto block no-select" 
          />
        </div>

        {/* Footer ONLY for Mobile */}
        <FooterLinks />
      </div>
    </div>
  );
}
