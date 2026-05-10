import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const INFO_PAGES = {
  who: {
    title: "ποιοι στον πούτσο είμαστε",
    text: "Κάποιοι άνεργοι σχεδιαστές που έπρεπε να κάνουν κάτι γιατί η ανεργία έχει βαρέσει κόκκινο. Επίσης το xrostao δεν θα έχει μόνο ρούχα με θέμα την ανεργία, απλά αυτό είναι το πρώτο drop του xrostao και απλά λέγεται anεργία season, ναι οκ καταλάβατε.",
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

export default function FooterLinks() {
  const [activeInfo, setActiveInfo] = useState<keyof typeof INFO_PAGES | null>(null);

  return (
    <div className="relative w-full bg-black py-20 px-4 flex flex-col items-center gap-6 mt-auto overflow-hidden">
      <picture className="absolute inset-0 w-full h-full opacity-60 pointer-events-none">
        <source media="(max-width: 767px)" srcSet="/images/mobile/footer-bg.png" />
        <img src="/images/mobile/footer-bg.png" className="w-full h-full object-cover" alt="" />
      </picture>
      
      <div className="relative z-10 flex flex-col md:flex-row flex-wrap items-center justify-center gap-6 md:gap-12">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white font-bold italic text-base md:text-2xl hover:opacity-80 transition-opacity">
          ρούχα
        </button>
        <button onClick={() => setActiveInfo('who')} className="text-white font-bold italic text-base md:text-2xl hover:opacity-80 transition-opacity">
          ποιοι στον πούτσο είμαστε
        </button>
        <button onClick={() => setActiveInfo('idea')} className="text-white font-bold italic text-base md:text-2xl hover:opacity-80 transition-opacity">
          ιδέα
        </button>
        <button onClick={() => setActiveInfo('how')} className="text-white font-bold italic text-base md:text-2xl hover:opacity-80 transition-opacity">
          πώς λειτουργεί το αίτημα
        </button>
        <button onClick={() => setActiveInfo('unemployed')} className="text-white font-bold italic text-base md:text-2xl hover:opacity-80 transition-opacity">
          είσαι άνεργος;
        </button>
      </div>

      <div className="relative z-10 mt-12 text-white font-sans font-bold italic text-sm text-center">
        © 2026 xrostao clothing
      </div>

      {/* Info Modal (Center) */}
      <AnimatePresence>
        {activeInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
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
    </div>
  );
}
