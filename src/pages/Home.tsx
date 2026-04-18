import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-black flex flex-col">
      
      {/* ================= DESKTOP VERSION ================= */}
      <div className="hidden md:block relative w-full">
        {/* Desktop Backgrounds */}
        <img src="/images/main-bg-1.jpg" alt="Background 1" className="w-full h-auto block" />
        <img src="/images/main-bg-2.jpg" alt="Background 2" className="w-full h-auto block" />
        <img src="/images/main-bg-3.jpg" alt="Background 3" className="w-full h-auto block" />
        
        {/* Desktop T-shirts Overlay */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Link to="/tshirt/1" className="absolute top-[10%] left-[10%] w-[25%] pointer-events-auto hover:opacity-90">
            <img src="/images/tshirts/1/main.png" alt="T-Shirt 1" className="w-full h-auto" />
          </Link>
          <Link to="/tshirt/2" className="absolute top-[25%] right-[10%] w-[25%] pointer-events-auto hover:opacity-90">
            <img src="/images/tshirts/2/main.png" alt="T-Shirt 2" className="w-full h-auto" />
          </Link>
          <Link to="/tshirt/3" className="absolute top-[40%] left-[15%] w-[25%] pointer-events-auto hover:opacity-90">
            <img src="/images/tshirts/3/main.png" alt="T-Shirt 3" className="w-full h-auto" />
          </Link>
          <Link to="/tshirt/4" className="absolute top-[55%] right-[15%] w-[25%] pointer-events-auto hover:opacity-90">
            <img src="/images/tshirts/4/main.png" alt="T-Shirt 4" className="w-full h-auto" />
          </Link>
          <Link to="/tshirt/5" className="absolute top-[70%] left-[20%] w-[25%] pointer-events-auto hover:opacity-90">
            <img src="/images/tshirts/5/main.png" alt="T-Shirt 5" className="w-full h-auto" />
          </Link>
          <Link to="/tshirt/6" className="absolute top-[85%] right-[20%] w-[25%] pointer-events-auto hover:opacity-90">
            <img src="/images/tshirts/6/main.png" alt="T-Shirt 6" className="w-full h-auto" />
          </Link>
          <Link to="/tshirt/7" className="absolute top-[92%] left-[37%] w-[25%] pointer-events-auto hover:opacity-90">
            <img src="/images/tshirts/7/main.png" alt="T-Shirt 7" className="w-full h-auto" />
          </Link>
        </div>
      </div>

      {/* ================= MOBILE VERSION ================= */}
      <div className="block md:hidden w-full flex flex-col">
        
        {/* Section 1 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-1.png" alt="Mobile Background 1" className="w-full h-auto block" />
          <Link to="/tshirt/1" className="absolute top-[66%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <img src="/images/tshirts/1/main.png" alt="T-Shirt 1" className="w-full h-auto drop-shadow-2xl aspect-square object-contain" />
          </Link>
        </div>

        {/* Section 2 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-2.png" alt="Mobile Background 2" className="w-full h-auto block" />
          <Link to="/tshirt/2" className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <img src="/images/tshirts/2/main.png" alt="T-Shirt 2" className="w-full h-auto drop-shadow-2xl aspect-square object-contain" />
          </Link>
          <Link to="/tshirt/3" className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <img src="/images/tshirts/3/main.png" alt="T-Shirt 3" className="w-full h-auto drop-shadow-2xl aspect-square object-contain" />
          </Link>
        </div>

        {/* Section 3 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-3.png" alt="Mobile Background 3" className="w-full h-auto block" />
          <Link to="/tshirt/4" className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <img src="/images/tshirts/4/main.png" alt="T-Shirt 4" className="w-full h-auto drop-shadow-2xl aspect-square object-contain" />
          </Link>
          <Link to="/tshirt/5" className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <img src="/images/tshirts/5/main.png" alt="T-Shirt 5" className="w-full h-auto drop-shadow-2xl aspect-square object-contain" />
          </Link>
        </div>

        {/* Section 4 */}
        <div className="relative w-full">
          <img src="/images/mobile/main-bg-4.png" alt="Mobile Background 4" className="w-full h-auto block" />
          <Link to="/tshirt/6" className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <img src="/images/tshirts/6/main.png" alt="T-Shirt 6" className="w-full h-auto drop-shadow-2xl aspect-square object-contain" />
          </Link>
          <Link to="/tshirt/7" className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] pointer-events-auto hover:opacity-90 transition-transform hover:scale-105">
            <img src="/images/tshirts/7/main.png" alt="T-Shirt 7" className="w-full h-auto drop-shadow-2xl aspect-square object-contain" />
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
