import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Fragment, lazy, Suspense, useState, useEffect } from 'react';
import Lenis from 'lenis';
import Menu from './components/Menu';
import Preloader from './components/Preloader';
import { AuthProvider } from './contexts/AuthContext';
import { INFO_PAGE_KEYS, INFO_PAGES } from './data/infoPages';

const Home = lazy(() => import('./pages/Home'));
const TShirt = lazy(() => import('./pages/TShirt'));
const Product = lazy(() => import('./pages/Product'));
const InfoPage = lazy(() => import('./pages/InfoPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

function RouteFallback() {
  return <div className="min-h-screen w-full bg-black" aria-hidden="true" />;
}

function AppRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<RouteFallback />}>
      <div key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:slug" element={<Product />} />
          <Route path="/tshirt/:id" element={<TShirt />} />
          {INFO_PAGE_KEYS.map((key) => {
            const infoPage = INFO_PAGES[key];

            return (
              <Fragment key={infoPage.path}>
                <Route
                  path={infoPage.path}
                  element={
                    <InfoPage
                      title={infoPage.title}
                      description={infoPage.description}
                      canonicalPath={infoPage.path}
                      text={infoPage.text}
                    />
                  }
                />
              </Fragment>
            );
          })}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Suspense>
  );
}

function AppShell() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadAssets = async () => {
      // Keep the intro smooth without holding back the first render for too long.
      const minDelay = 1200;
      const minTimePromise = new Promise<void>((resolve) => setTimeout(resolve, minDelay));

      // 2. Maximum preloader time (10s) - ABSOLUTE SAFETY
      const maxTimeTimeout = setTimeout(() => {
        if (isActive) setIsLoading(false);
      }, 10000);

      const criticalImages = [
        '/images/mobile/home-bg.png',
        '/images/home-bg.png',
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
        await Promise.all([minTimePromise, ...criticalImages.map(loadImage)]);
      } catch (e) {
        console.error('Asset load error', e);
      }

      // Final release
      if (isActive) setIsLoading(false);
      clearTimeout(maxTimeTimeout);
    };

    void loadAssets();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const prefetchRouteChunks = () => {
      void import('./pages/Product');
      void import('./pages/InfoPage');
      void import('./pages/TShirt');
      void import('./pages/NotFound');
    };

    const idleWindow = window as IdleWindow;

    if (typeof idleWindow.requestIdleCallback === 'function') {
      const idleId = idleWindow.requestIdleCallback(prefetchRouteChunks, { timeout: 2000 });

      return () => {
        idleWindow.cancelIdleCallback?.(idleId);
      };
    }

    const timer = setTimeout(prefetchRouteChunks, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
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
