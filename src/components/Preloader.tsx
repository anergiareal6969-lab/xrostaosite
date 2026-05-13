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

  useEffect(() => {
    if (!isLoading) {
      setIsFinalizing(true);
      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 1800); // Effect lasts for 1.8s
      return () => clearTimeout(timer);
    } else {
      setShowPreloader(true);
      setIsFinalizing(false);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {showPreloader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center"
        >
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-white font-sans font-bold italic text-4xl md:text-6xl tracking-tighter flex">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ color: "#ffffff" }}
                  animate={isFinalizing ? {
                    color: rgbColors,
                  } : {
                    color: "#ffffff",
                    scale: [0.95, 1, 0.95],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={isFinalizing ? {
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.1,
                    ease: "linear"
                  } : {
                    duration: 2.5, // Slightly slower pulse for a more stable feel
                    repeat: Infinity,
                    delay: index * 0.15, // More staggered
                    ease: "easeInOut"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>
            
            {!isFinalizing && (
              <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="w-full h-full bg-white"
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
