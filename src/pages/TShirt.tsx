import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Preloader from '../components/Preloader';
import RequestModal from '../components/RequestModal';
import Seo from '../components/Seo';
import FooterLinks from '../components/FooterLinks';
import { getProductById } from '../data/products';
import { useAuth } from '../contexts/AuthContext';

function TShirtImageFallback({ tshirtId, imgNum, onZoom, mobileTopClass, onImageLoad, altBase, canZoom }: { tshirtId: number, imgNum: number, onZoom: (src: string) => void, mobileTopClass: string, onImageLoad: () => void, altBase?: string, canZoom: boolean }) {
  const [cacheBuster] = useState(Date.now());
  const paths = [
    `/images/tshirts/${tshirtId}/page-${imgNum}.png`,
    `/images/tshirts/${tshirtId}/page-${imgNum}.jpeg`,
    `/images/tshirts/${tshirtId}/page-${imgNum}.jpg`,
    `/images/tshirts/${tshirtId}/page-${imgNum}.webp`
  ];
  const [pathIndex, setPathIndex] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);

  const currentPath = `${paths[pathIndex]}?v=${cacheBuster}`;

  if (hasFailed) return null;

  return (
    <div 
      className={`absolute left-[50%] md:top-1/2 md:left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] md:w-[80%] transition-transform duration-300 ${canZoom ? 'cursor-pointer hover:scale-105' : 'cursor-default'} ${mobileTopClass}`} 
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
        className="w-full h-auto object-contain drop-shadow-2xl pointer-events-none select-none"
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
  const [canPurchase, setCanPurchase] = useState(false);
  const [hoursRemaining, setHoursRemaining] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const imagesCount = 4; // page-1 to page-4
  const sizes = ['S', 'M', 'L', 'XL'];
  const step = 450 + 48;
  const mobileStep = 280;

  useEffect(() => {
    setIsLoading(true);
    setLoadedImagesCount(0);
    setSelectedSize(null);
    setHoursRemaining(null);
    setCurrentIndex(0);
    window.scrollTo(0, 0);
    checkIfRequested();

    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);
    
    return () => clearTimeout(safetyTimer);
  }, [id, user]);

  const checkIfRequested = async () => {
    try {
      const apiUrl = '/api/check-request';
      const emailParam = user?.email ? `&email=${encodeURIComponent(user.email)}` : '';
      const response = await fetch(`${apiUrl}?tshirtId=${tshirtId}${emailParam}`);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setHasRequested(data.requested);
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
    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tshirtId })
      });
      const data = await response.json();
      if (data.status === 'success' || data.status === 'already_requested') {
        setHasRequested(true);
      }
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  useEffect(() => {
    if (loadedImagesCount >= imagesCount + 1) { // images + background
      setIsLoading(false);
    }
  }, [loadedImagesCount]);

  if (isNaN(tshirtId) || tshirtId < 1 || tshirtId > 10) {
    return <Navigate to="/" />;
  }

  const seoTitle = product ? `${product.name} | xrostao clothing` : 'xrostao clothing';

  return (
    <div key={tshirtId} className="relative w-full min-h-screen bg-black overflow-x-hidden flex flex-col items-center">
      <Seo title={seoTitle} description={product?.description || ''} canonicalPath={`/tshirt/${tshirtId}`} image={product?.primaryImage} />
      <Preloader isLoading={isLoading} />
      <RequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleRequestSubmit}
        mode={canPurchase ? 'purchase' : 'request'}
        selectedSize={selectedSize}
      />

      {/* Main Content Area - 4 Sections with different Backgrounds */}
      <div className="w-full flex flex-col">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="relative w-full min-h-screen flex items-center justify-center">
            {/* Background for each section */}
            <picture className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <source media="(max-width: 767px)" srcSet={`/images/mobile/tshirt-bg-${num}.png`} />
              <source media="(min-width: 768px)" srcSet={`/images/tshirt-bg.png`} />
              <img 
                src="/images/tshirt-bg.png" 
                alt="" 
                className={`w-full h-full object-cover no-select ${num % 2 === 0 ? 'rotate-180' : ''}`}
                onLoad={() => setLoadedImagesCount(prev => prev + 1)}
              />
            </picture>

            {/* T-Shirt Overlay for each section */}
            <div className="relative z-10 w-[80%] md:w-[40%] aspect-square flex items-center justify-center">
              <TShirtImageFallback 
                tshirtId={tshirtId} 
                imgNum={num} 
                onZoom={setZoomedImage} 
                mobileTopClass="top-1/2" 
                onImageLoad={() => setLoadedImagesCount(prev => prev + 1)} 
                canZoom={true}
              />
            </div>

            {/* Request Button only on the last section */}
            {num === 4 && (
              <div className="absolute bottom-[10%] flex flex-col items-center gap-6 w-full max-w-md z-20">
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
                  disabled={hasRequested && !canPurchase}
                  className={`w-full max-w-sm ${
                    canPurchase 
                      ? 'bg-blue-400 hover:bg-blue-500' 
                      : hasRequested 
                        ? 'bg-green-500 hover:bg-green-500 cursor-default' 
                        : 'bg-blue-400 hover:bg-blue-500'
                  } text-white font-sans font-bold italic text-xl md:text-3xl py-5 px-12 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 transition-all active:scale-95`}
                >
                  {canPurchase ? 'ἀγόρασον' : hasRequested ? 'αιτημα εληφθη' : 'αίτημα'}
                </button>

                {hasRequested && !canPurchase && hoursRemaining !== null && (
                  <div className="text-white font-sans font-medium text-sm md:text-base opacity-80 mt-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                    Διαθέσιμο για αγορά σε: <span className="font-bold">{formatTimeRemaining(hoursRemaining)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

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
