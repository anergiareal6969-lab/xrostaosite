import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { INFO_PAGES, type InfoPageKey } from '../data/infoPages';

export default function FooterLinks() {
  const [activeInfo, setActiveInfo] = useState<InfoPageKey | null>(null);

  return (
    <div className="relative w-full bg-black py-20 px-4 flex flex-col items-center gap-6 mt-auto overflow-hidden">
      <picture className="absolute inset-0 w-full h-full opacity-60 pointer-events-none">
        <source media="(max-width: 767px)" srcSet="/images/mobile/footer-bg.png" />
        <source media="(min-width: 768px)" srcSet="/images/pc-footer-bg.png" />
        <img src="/images/pc-footer-bg.png" className="w-full h-full object-cover" alt="" />
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
        <button onClick={() => setActiveInfo('images')} className="text-white font-bold italic text-base md:text-2xl hover:opacity-80 transition-opacity">
          εικόνες
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
