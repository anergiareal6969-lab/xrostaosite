import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export default function RequestModal({ isOpen, onClose, onSubmit }: RequestModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await onSubmit(email);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-black/40 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-white/60 text-sm font-bold italic ml-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-white/5 border border-white/10 text-white p-4 rounded-xl focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-black font-bold italic py-3 px-6 rounded-xl hover:bg-white/90 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'ΑΠΟΣΤΟΛΗ...' : 'ΕΤΟΙΜΟΣ ΓΙΑ ΒΑΘΙΑ ΑΝΕΡΓΙΑ'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
