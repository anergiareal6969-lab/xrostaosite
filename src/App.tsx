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
      const allImages = [
        // Main Backgrounds
        '/images/main-bg.png',
        '/images/tshirt-bg.png',
        
        // Mobile Backgrounds
        '/images/mobile/main-bg-1.png',
        '/images/mobile/main-bg-2.png',
        '/images/mobile/main-bg-3.png',
        '/images/mobile/main-bg-4.png',
        '/images/mobile/main-bg-5.png',
        '/images/mobile/main-bg-6.png',
        '/images/mobile/main-bg-7.png',
        
        // UI & Common
        '/images/mobile/footer-bg.png',
        '/images/mobile/tshirt-bg-1.png',
        '/images/mobile/tshirt-bg-mid-2.png',
        '/images/mobile/tshirt-bg-mid-3.png',
        '/images/mobile/tshirt-bg-mid-4.png',
        '/images/mobile/tshirt-bg-last.png',
        '/images/tshirt-bg-last.png',

        // T-shirts
        ...Array.from({ length: 10 }, (_, i) => [
          `/images/tshirts/${i + 1}/main.png`,
          `/images/tshirts/${i + 1}/main.jpg`,
          `/images/tshirts/${i + 1}/main.jpeg`,
          `/images/tshirts/${i + 1}/main.webp`,
        ]).flat()
      ];

      // Use a Set to remove duplicates
      const uniqueImages = [...new Set(allImages)];

      const promises = uniqueImages.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // Continue even if one fails
        });
      });

      // Wait for ALL images and fonts to be ready
      await Promise.all([...promises, document.fonts.ready]);
      
      // Increased safety delay for a more stable white preloader phase
      setTimeout(() => {
        setIsLoading(false);
      }, 600); 
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

