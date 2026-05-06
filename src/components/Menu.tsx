import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, X, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-4">
        <button 
          onClick={() => setIsOpen(true)}
          className="text-white p-2 bg-black/50 rounded-md hover:bg-black/80 transition-colors"
        >
          <MenuIcon className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {user && (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-white p-2 bg-black/50 rounded-md hover:bg-black/80 transition-colors flex items-center justify-center"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/20" />
              ) : (
                <UserIcon className="w-6 h-6 md:w-8 md:h-8" />
              )}
            </button>

            {isProfileOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white/10 border border-white/20 p-5 rounded-2xl shadow-2xl backdrop-blur-xl ring-1 ring-white/30">
                <div className="flex flex-col gap-1 mb-4">
                  <p className="text-white/40 text-[10px] font-black italic uppercase tracking-widest">Username</p>
                  <p className="text-white font-black italic text-sm md:text-base break-all uppercase leading-none">
                    {user.username}
                  </p>
                </div>
                <div className="flex flex-col gap-1 mb-6">
                  <p className="text-white/40 text-[10px] font-black italic uppercase tracking-widest">Email</p>
                  <p className="text-white font-black italic text-xs md:text-sm break-all leading-none">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-black italic text-xs md:text-sm py-3 rounded-xl transition-all border border-white/10 uppercase tracking-tighter"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
