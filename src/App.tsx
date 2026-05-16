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
    <div key={location.pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:slug" element={<Product />} />
        <Route path="/tshirt/:id" element={<TShirt />} />
      </Routes>
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
