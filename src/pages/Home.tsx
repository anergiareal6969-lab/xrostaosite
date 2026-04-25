import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { PRODUCTS } from '../data/products';

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-black flex flex-col">
      <Seo
        title="xrostao clothing | anergia season"
        description="xrostao clothing — anergia season. Μπλούζες. Κάνε αίτημα και δήλωσε ενδιαφέρον για το drop."
        canonicalPath="/"
        image="/images/main-bg-1.jpg"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'xrostao clothing',
          url: '/',
        }}
      />

      <h1 className="sr-only">xrostao clothing — anergia season</h1>
      <p className="sr-only">
        Streetwear drop με μπλούζες (t-shirts). Δες τα προϊόντα και κάνε αίτημα ενδιαφέροντος.
      </p>
      
      {/* ================= DESKTOP VERSION ================= */}
      <div className="hidden md:block relative w-full">
        {/* Desktop Backgrounds */}
        <img src="/images/main-bg-1.jpg" alt="Background 1" className="w-full h-auto block" />
        <img src="/images/main-bg-2.jpg" alt="Background 2" className="w-full h-auto block" />
        <img src="/images/main-bg-3.jpg" alt="Background 3" className="w-full h-auto block" />
        
        {/* Desktop T-shirts Overlay */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Link to={`/products/${PRODUCTS[0].slug}`} className="absolute top-[10%] left-[10%] w-[25%] pointer-events-auto hover:opacity-90">
            <img src="/images/tshirts/1/main.png" alt={PRODUCTS[0].name} className="w-full h-auto" />
          </Link>
          <Link to={`/products/${PRODUCTS[1].slug}`} className="absolute top-[25%] right-[10%] w-[25%] pointer-events-auto hover:opacity-90">
            <img src="/images/tshirts/2/main.png" alt={PRODUCTS[1].name} className="w-full h-auto" />
          </Link>
          <Link to={`/products/${PRODUCTS[2].slug}`} className="absolute top-[40%] left-[15%] w-[25%] pointer-events-auto hover:opacity-90">
            <img src="/images/tshirts/3/main.png" alt={PRODUCTS[2].name} className="w-full h-auto" />
          </Link>
          <Link to={`/products/${PRODUCTS[3].slug}`} className="absolute top-[55%] right-[15%] w-[25%] pointer-events-auto hover:opacity-90">
            <img src="/images/tshirts/4/main.png" alt={PRODUCTS[3].name} className="w-full h-auto" />
          </Link>
          <Link to={`/products/${PRODUCTS[4].slug}`} className="absolute top-[70%] left-[20%] w-[25%] pointer-events-auto hover:opacity-90">
            <img src="/images/tshirts/5/main.png" alt={PRODUCTS[4].name} className="w-full h-auto" />
          </Link>
          <Link to={`/products/${PRODUCTS[5].slug}`} className="absolute top-[85%] right-[20%] w-[25%] pointer-events-auto hover:opacity-90">
            <img src="/images/tshirts/6/main.png" alt={PRODUCTS[5].name} className="w-full h-auto" />
          </Link>
          <Link to={`/products/${PRODUCTS[6].slug}`} className="absolute top-[92%] left-[37%] w-[25%] pointer-events-auto hover:opacity-90">
            <img src="/images/tshirts/7/main.png" alt={PRODUCTS[6].name} className="w-full h-auto" />
          </Link>
        </div>
      </div>

      {/* ================= MOBILE VERSION ================= */}
      <div className="block md:hidden w-full flex flex-col">
        
        {/* Section 1 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-1.png" alt="Mobile Background 1" className="w-full h-auto block" />
          <Link to={`/products/${PRODUCTS[0].slug}`} className="absolute top-[66%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <img src="/images/tshirts/1/main.png" alt={PRODUCTS[0].name} className="w-full h-auto drop-shadow-2xl aspect-square object-contain" />
          </Link>
        </div>

        {/* Section 2 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-2.png" alt="Mobile Background 2" className="w-full h-auto block" />
          <Link to={`/products/${PRODUCTS[1].slug}`} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <img src="/images/tshirts/2/main.png" alt={PRODUCTS[1].name} className="w-full h-auto drop-shadow-2xl aspect-square object-contain" />
          </Link>
          <Link to={`/products/${PRODUCTS[2].slug}`} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <img src="/images/tshirts/3/main.png" alt={PRODUCTS[2].name} className="w-full h-auto drop-shadow-2xl aspect-square object-contain" />
          </Link>
        </div>

        {/* Section 3 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-3.png" alt="Mobile Background 3" className="w-full h-auto block" />
          <Link to={`/products/${PRODUCTS[3].slug}`} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <img src="/images/tshirts/4/main.png" alt={PRODUCTS[3].name} className="w-full h-auto drop-shadow-2xl aspect-square object-contain" />
          </Link>
          <Link to={`/products/${PRODUCTS[4].slug}`} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <img src="/images/tshirts/5/main.png" alt={PRODUCTS[4].name} className="w-full h-auto drop-shadow-2xl aspect-square object-contain" />
          </Link>
        </div>

        {/* Section 4 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-4.png" alt="Mobile Background 4" className="w-full h-auto block" />
          <Link to={`/products/${PRODUCTS[5].slug}`} className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <img src="/images/tshirts/6/main.png" alt={PRODUCTS[5].name} className="w-full h-auto drop-shadow-2xl aspect-square object-contain" />
          </Link>
          <Link to={`/products/${PRODUCTS[6].slug}`} className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <img src="/images/tshirts/7/main.png" alt={PRODUCTS[6].name} className="w-full h-auto drop-shadow-2xl aspect-square object-contain" />
          </Link>
        </div>

        {/* Section 5 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-5.png" alt="Mobile Background 5" className="w-full h-auto block" />
        </div>
      </div>

    </div>
  );
}
