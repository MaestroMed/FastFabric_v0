/**
 * Exit Intent Popup - Shows when user is about to leave
 * Offers a discount or incentive to stay
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Clock, ArrowRight, Zap } from 'lucide-react';

interface ExitIntentPopupProps {
  delay?: number; // Minimum time on page before showing (ms)
  cookieExpiry?: number; // Days before showing again
}

export function ExitIntentPopup({ 
  delay = 5000,
  cookieExpiry = 7 
}: ExitIntentPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [canShow, setCanShow] = useState(false);

  // Check if popup should show
  useEffect(() => {
    // Don't show on commander or admin pages
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/commander') || currentPath.startsWith('/admin')) return;

    // Check if already shown recently
    const lastShown = localStorage.getItem('exitPopupLastShown');
    if (lastShown) {
      const daysSinceShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
      if (daysSinceShown < cookieExpiry) return;
    }

    // Wait for delay before enabling
    const timer = setTimeout(() => setCanShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay, cookieExpiry]);

  // Detect exit intent
  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (!canShow || isOpen) return;
    
    // Only trigger when mouse leaves through top of viewport
    if (e.clientY <= 0) {
      setIsOpen(true);
      localStorage.setItem('exitPopupLastShown', Date.now().toString());
    }
  }, [canShow, isOpen]);

  // Mobile: detect back button or tab switch
  const handleVisibilityChange = useCallback(() => {
    if (!canShow || isOpen) return;
    
    if (document.hidden) {
      // User switched tabs - show popup when they come back
      const showOnReturn = () => {
        setIsOpen(true);
        localStorage.setItem('exitPopupLastShown', Date.now().toString());
        document.removeEventListener('visibilitychange', showOnReturn);
      };
      document.addEventListener('visibilitychange', showOnReturn, { once: true });
    }
  }, [canShow, isOpen]);

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleMouseLeave, handleVisibilityChange]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[101] max-w-lg w-full"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-[var(--accent)] to-[#7c3aed] p-8 text-white text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
                >
                  <Gift className="w-8 h-8" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Attendez ! 🎁
                </h2>
                <p className="text-white/90">
                  Nous avons une offre spéciale pour vous
                </p>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Offer */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-6 h-6 text-green-600" />
                    <span className="text-green-800 font-bold text-lg">Offre exclusive</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-2">
                    -15% sur votre site web
                  </div>
                  <p className="text-gray-600">
                    Utilisez le code <span className="font-mono font-bold bg-white px-2 py-1 rounded">BIENVENUE15</span> lors de votre commande
                  </p>
                </div>

                {/* Urgency */}
                <div className="flex items-center gap-2 text-amber-600 mb-6">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Offre valable 24h uniquement</span>
                </div>

                {/* CTA */}
                <Link
                  to="/commander"
                  onClick={handleClose}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-[var(--accent)] text-white rounded-xl font-bold text-lg hover:bg-[var(--accent)]/90 transition-colors"
                >
                  Profiter de l'offre
                  <ArrowRight className="w-5 h-5" />
                </Link>

                {/* Secondary action */}
                <button
                  onClick={handleClose}
                  className="w-full mt-3 py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                >
                  Non merci, je préfère payer plein tarif
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

