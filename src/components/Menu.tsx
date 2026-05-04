import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, X } from 'lucide-react';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 text-white p-2 bg-black/50 rounded-md hover:bg-black/80 transition-colors"
      >
        <MenuIcon className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <button 
            onClick={closeMenu}
            className="absolute top-4 left-4 md:top-6 md:left-6 text-white p-2 bg-black/50 rounded-md z-10 hover:bg-black/80 transition-colors"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <nav className="relative z-10 flex flex-col items-center gap-6 md:gap-8 text-center px-4">
            <Link onClick={closeMenu} to="/" className="text-white font-bold italic text-2xl md:text-5xl hover:opacity-80">
              ρούχα
            </Link>
            <Link onClick={closeMenu} to="/who-we-are" className="text-white font-bold italic text-2xl md:text-5xl hover:opacity-80">
              ποιοι στον πούτσο είμαστε
            </Link>
            <Link onClick={closeMenu} to="/idea" className="text-white font-bold italic text-2xl md:text-5xl hover:opacity-80">
              ιδέα
            </Link>
            <Link onClick={closeMenu} to="/how-it-works" className="text-white font-bold italic text-2xl md:text-5xl hover:opacity-80">
              πώς λειτουργεί το αίτημα
            </Link>
            <Link onClick={closeMenu} to="/are-you-unemployed" className="text-white font-bold italic text-2xl md:text-5xl hover:opacity-80">
              είσαι άνεργος;
            </Link>
          </nav>

          <div className="absolute bottom-8 z-10 text-white font-sans font-bold italic text-xs md:text-sm text-center">
            © 2026 xrostao clothing
          </div>
        </div>
      )}
    </>
  );
}
