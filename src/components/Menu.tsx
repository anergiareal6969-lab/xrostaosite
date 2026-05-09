import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, X, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

const INFO_PAGES = {
  who: {
    title: "ποιοι στον πούτσο είμαστε",
    text: "Κάποιοι άνεργοι σχεδιαστές που έπρεπε να κάνουν κάτι γιατί η ανεργία έχει βαρέσει κόκκινο. Επίσης το xrostao δεν θα έχει μόνο ρούχα με θέμα την ανεργία, απλά αυτό είναι το πρώτο drop του xrostao και απλά λέγεται anergia season, ναι οκ καταλάβατε.",
  },
  idea: {
    title: "ιδέα",
    text: "Κοίτα, η ιδέα που σκεφτήκαμε ήταν να βγάλουμε ρούχα. Ρούχα είναι, εγώ θα σου πρότεινα να μην πάρεις καν.",
  },
  how: {
    title: "πώς λειτουργεί το αίτημα",
    text: "Οκ, αυτό είναι σοβαρό. Επειδή δεν θέλαμε να είμαστε ίδιοι με όλους τους lousers, δεν βάλαμε στο site κάποιος να μπορεί να αγοράσει κάτι. Τα ρούχα αυτά δεν πολούνται!! Αλλά άμα κάνεις αίτημα, δηλώνεις το ενδιαφέρον σου, έτσι θα μαζευτούν πολλά αιτήματα και μια λαμπρή μέρα τα ρούχα θα κυκλοφορήσουν.",
  },
  unemployed: {
    title: "είσαι άνεργος;",
    text: "Οκ, τώρα αυτό θα έλεγα είναι ίσως ένα από τα μεγαλύτερα ερωτήματα του Σωκράτη. Άμα εσύ, ναι συγκεκριμένα εσύ, ΕΙΣΑΙ ΑΝΕΡΓΟΣ/Η!!! Άμα είσαι άνεργος/η θα πρέπει σίγουρα να φοράς τις μπλούζες αυτές εδώ αλλιώς ξέρεις... ναι... δεν είσαι σίγουρα άνεργος (αυτό σίγουρα δεν το είπα για να πάρεις τα ρούχα) χαχαχαχαχα giiiiiirl πλακίζω, μην πάρεις τίποτα από εδώ, στα παπάρια μου! Καλά, όχι στα παπάρια μου, αααΑΑααα.",
  }
};

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeInfo, setActiveInfo] = useState<keyof typeof INFO_PAGES | null>(null);
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
              {Object.entries(INFO_PAGES).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setActiveInfo(key as keyof typeof INFO_PAGES)}
                  className="text-left text-white/80 font-black italic text-sm md:text-base hover:text-white transition-colors uppercase tracking-widest"
                >
                  {info.title}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Modal (Center) */}
      <AnimatePresence>
        {activeInfo && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-2xl w-full bg-white/10 backdrop-blur-2xl border border-white/20 p-8 md:p-12 rounded-[2.5rem] shadow-2xl ring-1 ring-white/40"
            >
              <button 
                onClick={() => setActiveInfo(null)}
                className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-white font-black italic text-2xl md:text-4xl mb-6 uppercase tracking-tighter leading-none">
                {INFO_PAGES[activeInfo].title}
              </h2>
              <p className="text-white/90 font-bold italic text-lg md:text-2xl leading-relaxed whitespace-pre-wrap">
                {INFO_PAGES[activeInfo].text}
              </p>
            </motion.div>
          </div>
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
