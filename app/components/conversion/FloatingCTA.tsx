/**
 * Floating CTA Button - Always visible on all pages
 * Appears after scrolling, positioned above WhatsApp button
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Sparkles } from 'lucide-react';

interface FloatingCTAProps {
  showAfterScroll?: number; // pixels before showing
  hideOnPages?: string[]; // pages where to hide (e.g., /commander)
}

export function FloatingCTA({ 
  showAfterScroll = 300,
  hideOnPages = ['/commander', '/admin']
}: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if on excluded page
    const currentPath = window.location.pathname;
    const isExcluded = hideOnPages.some(page => currentPath.startsWith(page));
    if (isExcluded) return;

    // Check sessionStorage for dismissed state
    const dismissed = sessionStorage.getItem('floatingCTADismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll, hideOnPages]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('floatingCTADismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 right-6 z-40 flex items-center gap-2"
        >
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          {/* CTA Button */}
          <Link to="/commander">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[var(--accent)] rounded-full blur-lg opacity-40 animate-pulse" />
              
              {/* Button */}
              <div className="relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[var(--accent)] to-[#2563eb] text-white rounded-full shadow-xl font-semibold">
                <Sparkles className="w-5 h-5" />
                <span>Commander mon site</span>
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Badge */}
              <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full animate-bounce">
                -10%
              </div>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Mobile-optimized floating bar at bottom
 */
export function MobileFloatingBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/commander') || currentPath.startsWith('/admin')) return;

    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        >
          <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-900">Site web à partir de</div>
              <div className="text-xl font-bold text-[var(--accent)]">299€</div>
            </div>
            <Link
              to="/commander"
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-full font-semibold"
            >
              Commander
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


