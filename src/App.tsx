import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import TShirt from './pages/TShirt';
import Product from './pages/Product';
import Menu from './components/Menu';
import Preloader from './components/Preloader';
import { AuthProvider } from './contexts/AuthContext';

function AppRoutes() {
  const location = useLocation();
  return (
    <Routes key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/products/:slug" element={<Product />} />
      <Route path="/tshirt/:id" element={<TShirt />} />
    </Routes>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      // Critical images that MUST load for the initial view
      const criticalImages = [
        // Main Backgrounds
        '/images/main-bg-1.png',
        '/images/mobile/main-bg-1.png',
        '/images/mobile/main-bg-2.png',
      ];

      // Secondary images that can load in background
      const secondaryImages = [
        '/images/main-bg-2.png',
        '/images/main-bg-3.png',
        '/images/tshirt-bg.png',
        '/images/mobile/main-bg-3.png',
        '/images/mobile/main-bg-4.png',
        '/images/mobile/main-bg-5.png',
        '/images/mobile/main-bg-6.png',
        '/images/mobile/main-bg-7.png',
        '/images/mobile/footer-bg.png',
        '/images/mobile/tshirt-bg-1.png',
        '/images/mobile/tshirt-bg-mid-2.png',
        '/images/mobile/tshirt-bg-mid-3.png',
        '/images/mobile/tshirt-bg-mid-4.png',
        '/images/mobile/tshirt-bg-last.png',
        '/images/tshirt-bg-last.png',
      ];

      const loadImage = (src: string) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      };

      // Wait for critical images and fonts
      try {
        await Promise.all([
          ...criticalImages.map(loadImage),
          document.fonts ? document.fonts.ready : Promise.resolve()
        ]);
      } catch (e) {
        console.error("Critical assets failed to load", e);
      }
      
      // Release preloader after critical assets
      setTimeout(() => {
        setIsLoading(false);
      }, 400);

      // Load secondary assets without blocking
      secondaryImages.forEach(loadImage);
    };

    loadAssets();
  }, []);
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="relative min-h-screen w-full font-sans bg-black">
          <Preloader isLoading={isLoading} />
          <Menu />
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

