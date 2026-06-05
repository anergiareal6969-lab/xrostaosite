import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Preloader from '../components/Preloader';
import RequestModal from '../components/RequestModal';
import Seo from '../components/Seo';
import FooterLinks from '../components/FooterLinks';
import { getProductById, getProductDetailImageScale } from '../data/products';
import { useAuth } from '../contexts/AuthContext';
import { toApiUrl } from '../lib/api';

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
      className={`w-[90%] md:w-[65%] max-w-2xl transition-transform duration-300 ${canZoom ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`} 
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [requestConfirmed, setRequestConfirmed] = useState(false);
  const [canPurchase, setCanPurchase] = useState(false);
  const [hoursRemaining, setHoursRemaining] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const imagesCount = 4; // page-1 to page-4
  const sizes = ['S', 'M', 'L', 'XL'];
  const step = 450 + 48;
  const mobileStep = 280;
  const tshirtSectionNumbers = [1, 2, 3, 4];

  useEffect(() => {
    setIsLoading(true);
    setLoadedImagesCount(0);
    setSelectedSize(null);
    setHoursRemaining(null);
    setCurrentIndex(0);
    setRequestConfirmed(false);
    window.scrollTo(0, 0);
    checkIfRequested();

    // Safety timer: maximum 10 seconds on mobile for preloader
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);
    
    return () => clearTimeout(safetyTimer);
  }, [id, user]);

  const checkIfRequested = async () => {
    try {
      const apiUrl = toApiUrl('/api/check-request');
      const emailParam = user?.email ? `&email=${encodeURIComponent(user.email)}` : '';
      const response = await fetch(`${apiUrl}?tshirtId=${tshirtId}${emailParam}`);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setHasRequested(data.requested);
      setRequestConfirmed(data.requested);
      setCanPurchase(data.canPurchase);
      if (data.requested && data.hoursRemaining) {
        setHoursRemaining(data.hoursRemaining);
      }
    } catch (err) {
      console.error('Failed to check request status:', err);
    }
  };

  const formatTimeRemaining = (hours: number) => {
    const totalMinutes = Math.floor(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}ώ ${m}λ`;
  };

  const handleRequestSubmit = async (email: string) => {
    const response = await fetch(toApiUrl('/api/request'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, tshirtId })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data || data.status !== 'success') {
      const details = data?.status
        ? `${data.status}${data.requestId ? ` (id: ${data.requestId})` : ''}`
        : `HTTP ${response.status}`;
      throw new Error(`Request failed: ${details}`);
    }

    setHasRequested(true);
    setRequestConfirmed(true);
    setCanPurchase(false);
    setHoursRemaining(24);
    checkIfRequested();
  };

  useEffect(() => {
    // If most critical images are loaded, we can show the page
    // background + at least 3 images
    if (loadedImagesCount >= 4) {
      const timer = setTimeout(() => setIsLoading(false), 700);
      return () => clearTimeout(timer);
    }
  }, [loadedImagesCount]);

  if (isNaN(tshirtId) || tshirtId < 1 || tshirtId > 11) {
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
      <RequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleRequestSubmit}
        mode={canPurchase ? 'purchase' : 'request'}
        selectedSize={selectedSize}
      />

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
            {canPurchase && (
              <div className="flex gap-4 mb-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-2 border-white font-bold italic text-lg md:text-2xl transition-all rounded-xl ${
                      selectedSize === size ? 'bg-white text-black' : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={(requestConfirmed || hasRequested) && !canPurchase}
              className={`w-full max-w-sm ${
                canPurchase
                  ? 'bg-blue-400 hover:bg-blue-500'
                  : (requestConfirmed || hasRequested)
                    ? 'bg-green-500 hover:bg-green-500 cursor-default'
                    : 'bg-blue-400 hover:bg-blue-500'
              } text-white font-sans font-bold italic text-xl md:text-3xl py-5 px-12 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 transition-all active:scale-95`}
            >
              {canPurchase ? 'ἀγόρασον' : (requestConfirmed || hasRequested) ? 'αιτημα εληφθη' : 'αίτημα'}
            </button>

            {(requestConfirmed || hasRequested) && !canPurchase && (
              <button
                type="button"
                disabled
                className="w-full max-w-sm bg-white/10 text-white/85 font-sans font-bold italic text-sm md:text-base leading-relaxed py-4 px-6 rounded-2xl border border-white/15 backdrop-blur-md cursor-default"
              >
                Μπορείς να κάνεις μόνο ένα αίτημα, γιατί θα μας πρήξεις με πολλά αιτήματα και μετά,
                σαν άνεργος, θα αγοράζεις μπλούζες, οπότε άστο καλύτερα.
              </button>
            )}

            {(requestConfirmed || hasRequested) && !canPurchase && hoursRemaining !== null && (
              <div className="text-white font-sans font-medium text-sm md:text-base opacity-80 mt-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                Διαθέσιμο για αγορά σε: <span className="font-bold">{formatTimeRemaining(hoursRemaining)}</span>
              </div>
            )}
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
