import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface PreloaderProps {
  isLoading: boolean;
}

const letters = "xrostao".split("");
const rgbColors = [
  '#ff0000', // Red
  '#00ff00', // Green
  '#0000ff', // Blue
  '#ffff00', // Yellow
  '#00ffff', // Cyan
  '#ff00ff', // Magenta
  '#ffffff'  // Back to white
];

export default function Preloader({ isLoading }: PreloaderProps) {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 2000); // Show skip after 2s for version 1.0.9

    if (!isLoading) {
      setIsFinalizing(true);
      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 800); 
      return () => {
        clearTimeout(timer);
        clearTimeout(skipTimer);
      };
    } else {
      setShowPreloader(true);
      setIsFinalizing(false);
    }
    return () => clearTimeout(skipTimer);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {showPreloader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center touch-none"
        >
          <div className="flex flex-col items-center gap-6 px-4">
            <h1 className="text-white font-sans font-bold italic text-5xl md:text-7xl tracking-tighter flex">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ color: "#ffffff" }}
                  animate={isFinalizing ? {
                    color: rgbColors,
                  } : {
                    color: "#ffffff",
                    scale: [0.98, 1, 0.98],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={isFinalizing ? {
                    duration: 1,
                    repeat: Infinity,
                    delay: index * 0.05,
                    ease: "linear"
                  } : {
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.1,
                    ease: "easeInOut"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>
            
            <div className="flex flex-col items-center gap-4">
              {!isFinalizing && (
                <div className="w-32 h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ 
                      duration: 1.2, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="w-full h-full bg-white/60"
                  />
                </div>
              )}

              {showSkip && !isFinalizing && (
                <button 
                  onClick={() => setShowPreloader(false)}
                  className="mt-4 px-6 py-2 border border-white/20 rounded-full text-white/40 text-xs font-bold italic hover:text-white/80 transition-colors uppercase tracking-widest"
                >
                  παρακαμψη (skip)
                </button>
              )}
            </div>
          </div>
          
          <div className="absolute bottom-8 text-white/20 text-[10px] font-mono tracking-widest uppercase bg-white/5 px-3 py-1 rounded-full">
            v1.0.9-force-update
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
