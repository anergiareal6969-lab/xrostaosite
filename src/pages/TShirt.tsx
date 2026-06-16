import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getProductById, getProductDetailImageScale, PRODUCTS } from '../data/products';
import { useAuth } from '../contexts/AuthContext';
import Preloader from '../components/Preloader';
import Seo from '../components/Seo';
import FooterLinks from '../components/FooterLinks';

function TShirtImageFallback({ tshirtId, imgNum, onZoom, onImageLoad, altBase, canZoom }: { tshirtId: number, imgNum: number, onZoom: (src: string) => void, onImageLoad: () => void, altBase?: string, canZoom: boolean }) {
  const imageScale = getProductDetailImageScale(tshirtId, imgNum);
  const paths = [
    `/images/tshirts/${tshirtId}/page-${imgNum}.png`,
    `/images/tshirts/${tshirtId}/page-${imgNum}.jpeg`,
    `/images/tshirts/${tshirtId}/page-${imgNum}.jpg`,
    `/images/tshirts/${tshirtId}/page-${imgNum}.webp`
  ];
  const [pathIndex, setPathIndex] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);

  const currentPath = paths[pathIndex];

  if (hasFailed) return null;

  return (
    <div 
      className={`${imgNum <= 2 ? 'w-[115%] shrink-0' : 'w-[90%]'} ${imgNum >= 3 ? 'md:w-[50%] md:shrink' : 'md:w-[65%] md:shrink'} max-w-2xl transition-transform duration-300 ${canZoom ? 'cursor-pointer hover:scale-[1.02] md:hover:scale-105' : 'cursor-default'}`} 
      onClick={canZoom ? () => onZoom(currentPath) : undefined}
    >
      <img 
        key={`${tshirtId}-${imgNum}-${pathIndex}`}
        src={currentPath} 
        onLoad={onImageLoad}
        onError={() => {
          if (pathIndex < paths.length - 1) {
            setPathIndex(prev => prev + 1);
          } else {
            setHasFailed(true);
            onImageLoad();
          }
        }}
        alt={`${altBase || `T-Shirt ${tshirtId}`} — View ${imgNum}`}
        decoding="async"
        className="w-full h-auto object-contain drop-shadow-2xl pointer-events-none select-none"
        style={imageScale === 1 ? undefined : { transform: `scale(${imageScale})`, transformOrigin: 'center' }}
      />
    </div>
  );
}

export default function TShirt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tshirtId = parseInt(id || '1', 10);
  const product = getProductById(tshirtId);
  const { user } = useAuth();
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);

  const imagesCount = 4; // page-1 to page-4
  const sizes = ['S', 'M', 'L', 'XL'];
  const step = 450 + 48;
  const mobileStep = 280;
  const tshirtSectionNumbers = [1, 2, 3, 4];

  // Pick 3 random related products
  const relatedProducts = PRODUCTS.filter((p) => p.id !== tshirtId).sort(() => 0.5 - Math.random()).slice(0, 3);

  useEffect(() => {
    setIsLoading(true);
    setLoadedImagesCount(0);
    setCurrentIndex(0);
    window.scrollTo(0, 0);

    // Safety timer: maximum 10 seconds on mobile for preloader
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);
    
    return () => clearTimeout(safetyTimer);
  }, [id, user]);

  useEffect(() => {
    // If most critical images are loaded, we can show the page
    // background + at least 3 images
    if (loadedImagesCount >= 4) {
      const timer = setTimeout(() => setIsLoading(false), 700);
      return () => clearTimeout(timer);
    }
  }, [loadedImagesCount]);

  if (isNaN(tshirtId) || tshirtId < 1 || tshirtId > 13) {
    return <Navigate to="/" />;
  }

  const seoTitle = product ? `${product.name} | xrostao` : 'xrostao';

  return (
    <div key={tshirtId} className="relative w-full min-h-screen bg-black overflow-x-hidden flex flex-col items-center">
      <Seo
        title={seoTitle}
        description={product?.description || ''}
        canonicalPath={product ? `/products/${product.slug}` : `/tshirt/${tshirtId}`}
        image={product?.primaryImage}
        imageAlt={product?.name}
        robots="noindex,follow"
      />
      <Preloader isLoading={isLoading} />

      {/* ===== FIXED BACKGROUND ===== */}
      <picture className="fixed-bg" aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/images/mobile/tshirt-bg.png" />
        <img
          src="/images/tshirt-bg.png"
          alt=""
          aria-hidden="true"
          loading="eager"
          className="fixed-bg"
          onLoad={() => setLoadedImagesCount(prev => prev + 1)}
        />
      </picture>

      {/* ===== SCROLLABLE CONTENT ===== */}
      <div className="relative z-10 w-full flex flex-col">
        {/* T-Shirt image sections — scroll over fixed background */}
        {tshirtSectionNumbers.map((num) => (
          <section key={num} className="w-full min-h-[100svh] md:min-h-[100dvh] flex items-center justify-center py-12">
            <TShirtImageFallback 
              tshirtId={tshirtId} 
              imgNum={num} 
              onZoom={setZoomedImage} 
              onImageLoad={() => setLoadedImagesCount(prev => prev + 1)} 
              canZoom={true}
            />
          </section>
        ))}

        {/* Request / Purchase section */}
        <section className="w-full min-h-[100svh] md:min-h-[100dvh] flex items-center justify-center py-12">
          <div className="relative z-20 flex flex-col items-center gap-6 w-full max-w-md px-6">
            <a
              href="https://www.instagram.com/xrostaoclothing"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-sm bg-blue-400 hover:bg-blue-500 text-white flex items-center justify-center py-5 px-12 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
          </div>
        </section>

        {/* Related Products Section */}
        <section className="w-full flex flex-col items-center py-16 px-6 bg-black/40 backdrop-blur-sm z-20">
          <div className="w-full max-w-5xl">
            <h2 className="text-white font-black italic text-2xl md:text-4xl leading-none mb-8 text-center md:text-left">
              Σχετικά προϊόντα
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
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
          </div>
        </section>

        {/* Footer at the end of T-Shirt page scroll */}
        <FooterLinks />
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <img src={zoomedImage} alt="Zoomed T-Shirt" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}
