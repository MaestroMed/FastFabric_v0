/**
 * Social Proof Components for Maximum Conversion
 * - Real-time notifications
 * - Scarcity indicators
 * - Trust badges
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Users, Shield, Zap, Star } from 'lucide-react';

// Simulated recent orders for social proof
const recentOrders = [
  { name: 'Marie D.', city: 'Cergy', service: 'Site Vitrine', time: '2 min' },
  { name: 'Pierre L.', city: 'Argenteuil', service: 'One Page', time: '8 min' },
  { name: 'Sophie M.', city: 'Pontoise', service: 'Site Vitrine', time: '15 min' },
  { name: 'Thomas B.', city: 'Sarcelles', service: 'Sur Mesure', time: '23 min' },
  { name: 'Julie R.', city: 'Enghien', service: 'One Page', time: '31 min' },
  { name: 'Nicolas F.', city: 'Taverny', service: 'Site Vitrine', time: '45 min' },
  { name: 'Céline A.', city: 'Ermont', service: 'One Page', time: '1h' },
  { name: 'David K.', city: 'Franconville', service: 'Site Vitrine', time: '1h30' },
];

/**
 * Floating notification showing recent orders
 */
export function RecentOrderNotification() {
  const [currentOrder, setCurrentOrder] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show first notification after 5 seconds
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    // Cycle through notifications
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentOrder((prev) => (prev + 1) % recentOrders.length);
        setIsVisible(true);
      }, 500);
    }, 12000);

    // Auto-hide after 6 seconds
    const hideInterval = setInterval(() => {
      setTimeout(() => setIsVisible(false), 6000);
    }, 12000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
      clearInterval(hideInterval);
    };
  }, []);

  const order = recentOrders[currentOrder];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed bottom-24 left-4 z-50 max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                {order.name} de {order.city}
              </p>
              <p className="text-sm text-gray-600">
                vient de commander un <span className="font-medium">{order.service}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Il y a {order.time}
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Urgency bar showing limited availability
 */
export function UrgencyBar() {
  const [slotsRemaining, setSlotsRemaining] = useState(3);
  const [isVisible, setIsVisible] = useState(true);

  // Simulate decreasing slots
  useEffect(() => {
    const interval = setInterval(() => {
      setSlotsRemaining((prev) => {
        if (prev <= 1) return 3; // Reset
        return prev - 1;
      });
    }, 120000); // Every 2 minutes

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4"
    >
      <div className="container mx-auto flex items-center justify-center gap-3 text-sm">
        <Zap className="w-4 h-4 animate-pulse" />
        <span>
          <strong>🔥 Forte demande :</strong> Plus que{' '}
          <span className="font-bold underline">{slotsRemaining} places</span> disponibles aujourd'hui
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-white/70 hover:text-white"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Trust badges section
 */
export function TrustBadges() {
  const badges = [
    { icon: Shield, label: 'Satisfait ou remboursé', sublabel: '14 jours' },
    { icon: Zap, label: 'Livraison express', sublabel: '2-4 heures' },
    { icon: Star, label: 'Note clients', sublabel: '4.9/5 ⭐' },
    { icon: Users, label: 'Clients satisfaits', sublabel: '+500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
        >
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <badge.icon className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{badge.label}</p>
            <p className="text-xs text-gray-500">{badge.sublabel}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Guarantee badge for pricing section
 */
export function GuaranteeBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full"
    >
      <Shield className="w-5 h-5 text-green-600" />
      <span className="text-green-800 font-medium text-sm">
        Garantie satisfait ou remboursé 14 jours
      </span>
    </motion.div>
  );
}

/**
 * Live visitors counter
 */
export function LiveVisitors() {
  const [visitors, setVisitors] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitors((prev) => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(5, Math.min(25, prev + change));
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-full text-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span>{visitors} personnes consultent cette page</span>
    </div>
  );
}


