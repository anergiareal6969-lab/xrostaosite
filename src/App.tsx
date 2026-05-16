import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import TShirt from './pages/TShirt';
import Product from './pages/Product';
import Menu from './components/Menu';
import Preloader from './components/Preloader';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:slug" element={<Product />} />
        <Route path="/tshirt/:id" element={<TShirt />} />
      </Routes>
    </div>
  );
}

function WelcomeVideoOverlay() {
  const { shouldShowWelcomeVideo, dismissWelcomeVideo } = useAuth();
  const [hasVideoError, setHasVideoError] = useState(false);

  useEffect(() => {
    if (!shouldShowWelcomeVideo) {
      setHasVideoError(false);
    }
  }, [shouldShowWelcomeVideo]);

  if (!shouldShowWelcomeVideo || hasVideoError) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-black/80 p-3 shadow-2xl">
        <button
          type="button"
          onClick={dismissWelcomeVideo}
          className="absolute top-4 right-4 z-10 rounded-full bg-black/70 px-4 py-2 text-sm font-bold italic text-white border border-white/15 hover:bg-black/90 transition-all"
        >
          ΚΛΕΙΣΙΜΟ
        </button>

        <video
          className="w-full max-h-[80vh] rounded-2xl bg-black"
          controls
          autoPlay
          muted
          playsInline
          onEnded={dismissWelcomeVideo}
          onError={() => {
            setHasVideoError(true);
            dismissWelcomeVideo();
          }}
        >
          <source src="/images/first-login.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

function AppShell() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      // 1. Minimum preloader time (3s) to ensure images load
      const minTimePromise = new Promise(res => setTimeout(res, 3000));

      // 2. Maximum preloader time (10s) - ABSOLUTE SAFETY
      const maxTimeTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 10000);

      const criticalImages = [
        '/images/mobile/main-bg-1.png',
        '/images/mobile/main-bg-2.png',
        '/images/main-bg-1.png',
        '/images/main-bg-2.png',
      ];

      const loadImage = (src: string) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      };

      // Wait for at least the minimum time and ALL critical images
      try {
        await Promise.all([
          minTimePromise,
          ...criticalImages.map(loadImage)
        ]);
      } catch (e) {
        console.error("Asset load error", e);
      }
      
      // Final release
      setIsLoading(false);
      clearTimeout(maxTimeTimeout);

      // Background load the rest
      const secondaryImages = [
        '/images/mobile/main-bg-3.png',
        '/images/mobile/main-bg-4.png',
        '/images/mobile/main-bg-5.png',
        '/images/mobile/main-bg-6.png',
        '/images/mobile/main-bg-7.png',
        '/images/main-bg-3.png',
        '/images/tshirt-bg.png',
        '/images/mobile/footer-bg.png',
      ];
      secondaryImages.forEach(loadImage);
    };

    loadAssets();
  }, []);

  return (
    <div className="relative min-h-screen w-full font-sans bg-black">
      <Preloader isLoading={isLoading} />
      <Menu />
      <AppRoutes />
      <WelcomeVideoOverlay />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}
