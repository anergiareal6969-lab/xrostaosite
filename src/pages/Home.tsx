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
  const mobileStep = 240;

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
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MOBILE VERSION ================= */}
      <div className="block md:hidden relative w-full min-h-screen overflow-hidden">
        <img
          src="/images/main-bg.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover no-select pointer-events-none z-0"
        />

        <div className="relative z-10 w-full h-screen flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full">
            {PRODUCTS.map((product, index) => {
              const isCenter = index === currentIndex;
              const distance = Math.abs(index - currentIndex);
              const x = (index - currentIndex) * mobileStep;

              return (
                <motion.div
                  key={product.id}
                  initial={false}
                  animate={{
                    x,
                    scale: isCenter ? 1 : 0.72,
                    opacity: isCenter ? 1 : 0.25,
                    filter: isCenter ? 'blur(0px) brightness(1)' : 'blur(10px) brightness(0.6)',
                    zIndex: isCenter ? 30 : 20 - distance,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 35 }}
                  onMouseDown={(e) => {
                    if (e.button !== 0) return;
                    setCurrentIndex(index);
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] aspect-square flex flex-col items-center justify-center cursor-pointer select-none"
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
                      className="absolute -bottom-20 bg-white/10 backdrop-blur-xl border border-white/30 px-8 py-3 rounded-2xl text-white font-black italic text-sm tracking-widest uppercase hover:bg-white/20 transition-all shadow-2xl ring-1 ring-white/20 whitespace-nowrap"
                    >
                      δεσ το tshirt
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 pb-10">
          <FooterLinks />
        </div>
      </div>
    </div>
  );
}
