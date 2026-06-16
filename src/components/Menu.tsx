import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, X, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { INFO_PAGES, INFO_PAGE_KEYS } from '../data/infoPages';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      {/* Menu Button (Top Left) */}
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all active:scale-95"
        >
          {isOpen ? <X className="w-6 h-6 md:w-8 md:h-8" /> : <MenuIcon className="w-6 h-6 md:w-8 md:h-8" />}
        </button>
      </div>

      {/* Glassy Menu Content (Top Left) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="fixed top-20 left-4 md:top-24 md:left-6 z-50 w-64 md:w-80 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl ring-1 ring-white/30"
          >
            <nav className="flex flex-col gap-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-white font-black italic text-lg md:text-xl hover:opacity-70 transition-opacity uppercase tracking-widest">
                ρούχα
              </Link>

              {INFO_PAGE_KEYS.map((key) => (
                <Link
                  key={key}
                  to={INFO_PAGES[key].path}
                  onClick={() => setIsOpen(false)}
                  className="text-left text-white/80 font-black italic text-sm md:text-base hover:text-white transition-colors uppercase tracking-widest"
                >
                  {INFO_PAGES[key].title}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Button (Top Right) */}
      {user && (
        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-white p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all flex items-center justify-center"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/20" />
              ) : (
                <UserIcon className="w-6 h-6 md:w-8 md:h-8" />
              )}
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-64 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl ring-1 ring-white/30"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
}
