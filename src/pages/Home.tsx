import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
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
      className="w-full h-auto drop-shadow-2xl aspect-square object-contain pointer-events-none select-none" 
    />
  );
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const scale = useTransform(x, [-200, 0], [0.5, 1]);
  const opacity = useTransform(x, [-200, -150], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -100) {
      // Swipe left -> next t-shirt
      setCurrentIndex((prev) => (prev + 1) % PRODUCTS.length);
    }
    x.set(0);
  };

  return (
    <div className="relative w-full min-h-screen bg-black flex flex-col overflow-hidden">
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
      <div className="hidden md:block relative w-full h-screen">
        {/* Main Background */}
        <img 
          src="/images/main-bg.png" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover no-select pointer-events-none"
        />
        
        {/* T-shirts Stack Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[40%] aspect-square flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {/* Render current and next for smoothness */}
              {[currentIndex + 1, currentIndex].map((idx) => {
                const productIdx = idx % PRODUCTS.length;
                const product = PRODUCTS[productIdx];
                const isTop = idx === currentIndex;

                return (
                  <motion.div
                    key={product.id}
                    style={isTop ? { x, scale, opacity, zIndex: 10 } : { zIndex: 5, scale: 0.9, opacity: 0.5 }}
                    drag={isTop ? "x" : false}
                    dragConstraints={{ left: -500, right: 0 }}
                    onDragEnd={handleDragEnd}
                    initial={isTop ? { x: 0, opacity: 1, scale: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1, scale: isTop ? 1 : 0.9 }}
                    exit={{ x: -500, opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
                  >
                    <Link
                      to={`/products/${product.slug}`}
                      className="w-full h-full flex flex-col items-center justify-center pointer-events-auto"
                      onClick={(e) => {
                        // Prevent click during drag
                        if (x.get() !== 0) e.preventDefault();
                      }}
                    >
                      <TshirtMainImageFallback tshirtId={product.id} name={product.name} />
                      {isTop && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-white font-black italic text-sm tracking-widest uppercase"
                        >
                          δεσ το tshirt
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ================= MOBILE VERSION ================= */}
      <div className="block md:hidden w-full flex flex-col">
        {/* Keep existing mobile logic as requested only for PC changes */}
        {/* Section 1 */}
        <div className="relative w-full">
          <img 
            src="/images/mobile/main-bg-1.png" 
            alt="Mobile Background 1" 
            className="w-full h-auto block no-select"
          />
          <Link to={`/products/${PRODUCTS[0].slug}`} className="absolute top-[66%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={1} name={PRODUCTS[0].name} />
          </Link>
        </div>

        {/* Section 2 */}
        <div className="relative w-full">
          <img 
            src="/images/mobile/main-bg-2.png" 
            alt="Mobile Background 2" 
            className="w-full h-auto block no-select" 
          />
          <Link to={`/products/${PRODUCTS[1].slug}`} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={2} name={PRODUCTS[1].name} />
          </Link>
          <Link to={`/products/${PRODUCTS[2].slug}`} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={3} name={PRODUCTS[2].name} />
          </Link>
        </div>

        {/* Section 3 */}
        <div className="relative w-full">
          <img 
            src="/images/mobile/main-bg-3.png" 
            alt="Mobile Background 3" 
            className="w-full h-auto block no-select" 
          />
          <Link to={`/products/${PRODUCTS[3].slug}`} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={4} name={PRODUCTS[3].name} />
          </Link>
          <Link to={`/products/${PRODUCTS[4].slug}`} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={5} name={PRODUCTS[4].name} />
          </Link>
        </div>

        {/* Section 4 */}
        <div className="relative w-full">
          <img 
            src="/images/mobile/main-bg-4.png" 
            alt="Mobile Background 4" 
            className="w-full h-auto block no-select" 
          />
          <Link to={`/products/${PRODUCTS[5].slug}`} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={6} name={PRODUCTS[5].name} />
          </Link>
          <Link to={`/products/${PRODUCTS[6].slug}`} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={7} name={PRODUCTS[6].name} />
          </Link>
        </div>

        {/* Section 5 */}
        <div className="relative w-full">
          <img 
            src="/images/mobile/main-bg-5.png" 
            alt="Mobile Background 5" 
            className="w-full h-auto block no-select" 
          />
          <Link to={`/products/${PRODUCTS[7].slug}`} className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={8} name={PRODUCTS[7].name} />
          </Link>
        </div>

        {/* Section 6 */}
        <div className="relative w-full">
          <img 
            src="/images/mobile/main-bg-6.png" 
            alt="Mobile Background 6" 
            className="w-full h-auto block no-select" 
          />
          <Link to={`/products/${PRODUCTS[8].slug}`} className="absolute top-[21%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={9} name={PRODUCTS[8].name} />
          </Link>
          <Link to={`/products/${PRODUCTS[9].slug}`} className="absolute top-[71%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <TshirtMainImageFallback tshirtId={10} name={PRODUCTS[9].name} />
          </Link>
        </div>

        {/* Section 7 */}
        <div className="relative w-full">
          <img 
            src="/images/mobile/main-bg-7.png" 
            alt="Mobile Background 7" 
            className="w-full h-auto block no-select" 
          />
        </div>
      </div>
    </div>
  );
}
