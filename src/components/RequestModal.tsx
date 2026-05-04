import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  mode?: 'request' | 'purchase';
  selectedSize?: string | null;
}

export default function RequestModal({ isOpen, onClose, onSubmit, mode = 'request', selectedSize }: RequestModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      try {
        await loginWithGoogle();
        // After successful login, the email will be set by useEffect
        return;
      } catch (error) {
        console.error("Login failed:", error);
        return;
      }
    }

    if (!email) return;
    if (mode === 'purchase' && !selectedSize) {
      alert('Παρακαλώ επίλεξε μέγεθος!');
      return;
    }
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
                <label className="text-white/60 text-sm font-black italic ml-2">
                  {mode === 'purchase' ? `EMAIL (ΓΙΑ ΑΓΟΡΑ ΜΕΓΕΘΟΥΣ ${selectedSize})` : 'EMAIL'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  readOnly={!!user}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={`bg-white/5 border border-white/10 text-white p-4 rounded-xl focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20 ${user ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-black font-black italic py-3 px-6 rounded-xl hover:bg-white/90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {!user ? (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    ΕΙΣΟΔΟΣ ΜΕ GOOGLE
                  </>
                ) : (
                  isSubmitting 
                    ? 'ΑΠΟΣΤΟΛΗ...' 
                    : mode === 'purchase' 
                      ? 'ΟΛΟΚΛΗΡΩΣΗ ΑΓΟΡΑΣ' 
                      : 'ΕΤΟΙΜΟΣ ΓΙΑ ΒΑΘΙΑ ΑΝΕΡΓΙΑ'
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
