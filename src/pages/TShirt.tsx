import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Preloader from '../components/Preloader';
import RequestModal from '../components/RequestModal';

function TShirtImageFallback({ tshirtId, imgNum, onZoom, mobileTopClass, onImageLoad }: { tshirtId: number, imgNum: number, onZoom: (src: string) => void, mobileTopClass: string, onImageLoad: () => void }) {
  // Use a timestamp to prevent the browser from showing old cached images
  const [cacheBuster] = useState(Date.now());
  const paths = [
    `/images/tshirts/${tshirtId}/page-${imgNum}.png?v=${cacheBuster}`,
    `/images/tshirts/${tshirtId}/page-${imgNum}.jpeg?v=${cacheBuster}`,
    `/images/tshirts/${tshirtId}/page-${imgNum}.jpg?v=${cacheBuster}`
  ];
  const [pathIndex, setPathIndex] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);

  if (hasFailed) return null;

  return (
    <div 
      className={`absolute left-[50%] md:top-[47%] md:left-[48%] -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] md:w-[35%] cursor-pointer transition-transform duration-300 hover:scale-105 ${mobileTopClass}`} 
      onClick={() => onZoom(paths[pathIndex])}
    >
      <img 
        key={`${tshirtId}-${imgNum}-${pathIndex}`}
        src={paths[pathIndex]} 
        onLoad={onImageLoad}
        onError={() => {
          if (pathIndex < paths.length - 1) {
            setPathIndex(pathIndex + 1);
          } else {
            setHasFailed(true);
            onImageLoad(); // Count failure as "loaded" so we don't block forever
          }
        }}
        alt={`T-Shirt ${tshirtId} View ${imgNum}`}
        className="w-full h-auto object-contain drop-shadow-2xl"
      />
    </div>
  );
}

export default function TShirt() {
  const { id } = useParams();
  const tshirtId = parseInt(id || '1', 10);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [canPurchase, setCanPurchase] = useState(false);
  const [hoursRemaining, setHoursRemaining] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // All t-shirts now have exactly 5 images total (4 t-shirts + 1 button).
  const imageCount = 5;
  const tshirtsCount = 4; // Number of tshirt images (page-1 to page-4)
  const sizes = ['S', 'M', 'L', 'XL'];

  useEffect(() => {
    // Reset state on ID change
    setIsLoading(true);
    setLoadedImagesCount(0);
    setSelectedSize(null);
    setHoursRemaining(null);
    window.scrollTo(0, 0);
    checkIfRequested();
  }, [id]);

  const checkIfRequested = async () => {
    try {
      const apiUrl = '/api/check-request';
      console.log(`Checking request status at: ${apiUrl}`);
      const response = await fetch(`${apiUrl}?tshirtId=${tshirtId}`);
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Server returned HTML instead of JSON. Check API routing.');
      }

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
    console.log('Submit button pressed for:', email);
    try {
      const apiUrl = '/api/request';
      console.log(`Sending request to: ${apiUrl}`);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tshirtId })
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Server returned HTML instead of JSON. Check API routing.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData.details || errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success' || data.status === 'already_requested') {
        setHasRequested(true);
      } else {
        throw new Error(data.details || 'Unknown error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert(`Σφάλμα: ${err instanceof Error ? err.message : 'Κάτι πήγε στραβά!'}`);
    }
  };

  useEffect(() => {
    // Once all tshirt images are loaded, hide the preloader
    if (loadedImagesCount >= tshirtsCount) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500); // Small extra delay for smoothness
      return () => clearTimeout(timer);
    }
  }, [loadedImagesCount]);

  const handleImageLoad = () => {
    setLoadedImagesCount(prev => prev + 1);
  };

  if (isNaN(tshirtId) || tshirtId < 1 || tshirtId > 7) {
    return <Navigate to="/" />;
  }

  const images = Array.from({ length: imageCount }, (_, i) => i + 1);

  return (
    <div key={tshirtId} className="relative w-full bg-black flex flex-col">
      <Preloader isLoading={isLoading} />
      <RequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleRequestSubmit}
        mode={canPurchase ? 'purchase' : 'request'}
        selectedSize={selectedSize}
      />
      {images.map((imgNum, index) => {
        // Determine the background image based on the index
        let desktopBgImage = '/images/tshirt-bg-mid.jpg'; // Default for middle images
        let mobileBgImage = '/images/mobile/tshirt-bg-mid.png';
        let mobileTopClass = 'max-md:top-[52%]'; // Adjusted slightly up for mid
        
        if (index === 0) {
          desktopBgImage = '/images/tshirt-bg-1.jpg'; // First image background (with logo)
          mobileBgImage = '/images/mobile/tshirt-bg-1.png';
          mobileTopClass = 'max-md:top-[60%]'; // Logo pushes circle down even more
        } else if (index === images.length - 1) {
          desktopBgImage = '/images/tshirt-bg-last.jpg'; // Last image background (with button)
          mobileBgImage = '/images/mobile/tshirt-bg-last.png';
          mobileTopClass = 'max-md:top-[46%]'; // Button pushes circle up (if used)
        }

        const isLastImage = index === images.length - 1;

        return (
          <div key={imgNum} className="relative w-full flex items-center justify-center overflow-hidden">
            {/* Split explicit images for accurate DOM height calculation, preventing absolute jump bugs */}
            <img src={mobileBgImage} alt="" className="w-full h-auto block md:hidden pointer-events-none" />
            <img src={desktopBgImage} alt="" className="w-full h-auto hidden md:block pointer-events-none" />

            {/* Logo Link (Only on the first image) */}
            {index === 0 && (
              <Link to="/" className="absolute top-[5%] md:top-[5%] left-[5%] md:left-[5%] z-20 w-[30%] md:w-[15%] h-[15%] rounded-full cursor-pointer hover:opacity-80 transition-opacity">
                 {/* Invisible clickable area over the logo in the background image */}
              </Link>
            )}

            {/* T-Shirt Image - Centered exactly in the middle faded logo with format fallback */}
            {!isLastImage && (
              <TShirtImageFallback tshirtId={tshirtId} imgNum={imgNum} onZoom={setZoomedImage} mobileTopClass={mobileTopClass} onImageLoad={handleImageLoad} />
            )}

            {/* Request Button (Only on the last image) - Positioned exactly in the center */}
            {isLastImage && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-6 w-full">
                {canPurchase && (
                  <div className="flex gap-4 mb-4">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-2 border-white font-bold italic text-lg md:text-2xl transition-all ${
                          selectedSize === size ? 'bg-white text-black' : 'bg-black/40 text-white hover:bg-white/20'
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
                  className={`${
                    canPurchase 
                      ? 'bg-blue-400 hover:bg-blue-500' 
                      : hasRequested 
                        ? 'bg-green-500 hover:bg-green-500 cursor-default' 
                        : 'bg-blue-400 hover:bg-blue-500'
                  } text-white font-sans font-bold italic text-xl md:text-3xl py-4 px-12 md:px-24 rounded-md shadow-lg transition-colors`}
                >
                  {canPurchase ? 'ἀγόρασον' : hasRequested ? 'αιτημα εληφθη' : 'αίτημα'}
                </button>

                {hasRequested && !canPurchase && hoursRemaining !== null && (
                  <div className="text-white font-sans font-medium text-sm md:text-base opacity-80 mt-2">
                    Διαθέσιμο για αγορά σε: <span className="font-bold">{formatTimeRemaining(hoursRemaining)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}


      {/* Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <img 
            src={zoomedImage} 
            alt="Zoomed T-Shirt" 
            className="max-w-full max-h-full object-contain"
          />
          <button 
            className="absolute top-4 right-4 text-white p-2 bg-black/50 rounded-md hover:bg-black/80 transition-colors"
            onClick={() => setZoomedImage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}
    </div>
  );
}
