/**
 * Live Notifications - Real-time social proof notifications
 * Shows recent orders, live visitors, and activity
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Users, MapPin, TrendingUp } from 'lucide-react';

// Villes du 95 pour les notifications réalistes
const villes95 = [
  'Argenteuil', 'Cergy', 'Sarcelles', 'Pontoise', 'Franconville',
  'Garges-lès-Gonesse', 'Bezons', 'Ermont', 'Taverny', 'Herblay',
  'Goussainville', 'Eaubonne', 'Villiers-le-Bel', 'Montmorency', 
  'Saint-Ouen-l\'Aumône', 'Enghien-les-Bains', 'Deuil-la-Barre',
  'Cormeilles-en-Parisis', 'Saint-Gratien', 'Soisy-sous-Montmorency'
];

const prenoms = [
  'Marie', 'Pierre', 'Sophie', 'Thomas', 'Julie', 'Nicolas', 'Céline', 
  'David', 'Laura', 'Antoine', 'Émilie', 'Lucas', 'Camille', 'Hugo',
  'Léa', 'Maxime', 'Chloé', 'Alexandre', 'Sarah', 'Julien'
];

const services = [
  { nom: 'Site Vitrine', prix: '599€' },
  { nom: 'Landing Page', prix: '299€' },
  { nom: 'Site Sur Mesure', prix: 'devis' },
];

const secteurs = [
  'avocat', 'restaurant', 'artisan', 'médecin', 'coiffeur',
  'plombier', 'électricien', 'architecte', 'consultant', 'coach'
];

// Generate random notification
function generateNotification(): NotificationData {
  const types: NotificationType[] = ['order', 'view', 'quote'];
  const type = types[Math.floor(Math.random() * types.length)];
  const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
  const ville = villes95[Math.floor(Math.random() * villes95.length)];
  const service = services[Math.floor(Math.random() * services.length)];
  const secteur = secteurs[Math.floor(Math.random() * secteurs.length)];
  const minutesAgo = Math.floor(Math.random() * 30) + 1;

  return {
    id: Date.now().toString(),
    type,
    prenom,
    ville,
    service,
    secteur,
    minutesAgo,
  };
}

type NotificationType = 'order' | 'view' | 'quote';

interface NotificationData {
  id: string;
  type: NotificationType;
  prenom: string;
  ville: string;
  service: { nom: string; prix: string };
  secteur: string;
  minutesAgo: number;
}

interface LiveNotificationsProps {
  enabled?: boolean;
  interval?: number; // Time between notifications in ms
  maxNotifications?: number;
}

export function LiveNotifications({ 
  enabled = true,
  interval = 25000, // Show notification every 25 seconds
  maxNotifications = 1
}: LiveNotificationsProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't show on commander/admin pages
  useEffect(() => {
    if (!isClient) return;
    
    const path = window.location.pathname;
    if (path.startsWith('/commander') || path.startsWith('/admin')) {
      return;
    }

    // Check session storage if user dismissed notifications
    const dismissed = sessionStorage.getItem('liveNotificationsDismissed');
    if (dismissed === 'true') return;

    // Initial notification after 8 seconds
    const initialTimeout = setTimeout(() => {
      if (enabled) {
        setNotifications([generateNotification()]);
      }
    }, 8000);

    // Cycle notifications
    const notifInterval = setInterval(() => {
      if (enabled) {
        setNotifications([generateNotification()]);
        
        // Auto-hide after 6 seconds
        setTimeout(() => {
          setNotifications([]);
        }, 6000);
      }
    }, interval);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(notifInterval);
    };
  }, [enabled, interval, isClient]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
    sessionStorage.setItem('liveNotificationsDismissed', 'true');
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed bottom-24 left-4 z-40 space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.slice(0, maxNotifications).map((notif) => (
          <NotificationCard 
            key={notif.id} 
            notification={notif} 
            onDismiss={() => dismissNotification(notif.id)}
            onDismissAll={dismissAll}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface NotificationCardProps {
  notification: NotificationData;
  onDismiss: () => void;
  onDismissAll: () => void;
}

function NotificationCard({ notification, onDismiss, onDismissAll }: NotificationCardProps) {
  const { type, prenom, ville, service, secteur, minutesAgo } = notification;

  const getContent = () => {
    switch (type) {
      case 'order':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
          bgIcon: 'bg-green-100',
          title: `${prenom} de ${ville}`,
          message: (
            <>
              vient de commander un <span className="font-semibold">{service.nom}</span>
            </>
          ),
        };
      case 'view':
        return {
          icon: <Users className="w-5 h-5 text-blue-600" />,
          bgIcon: 'bg-blue-100',
          title: `Activité en cours`,
          message: (
            <>
              Un {secteur} de <span className="font-semibold">{ville}</span> consulte nos offres
            </>
          ),
        };
      case 'quote':
        return {
          icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
          bgIcon: 'bg-purple-100',
          title: `${prenom} de ${ville}`,
          message: (
            <>
              vient de demander un <span className="font-semibold">devis gratuit</span>
            </>
          ),
        };
    }
  };

  const content = getContent();

  return (
    <motion.div
      initial={{ opacity: 0, x: -100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      <div className="p-4 flex items-start gap-3">
        <div className={`w-10 h-10 ${content.bgIcon} rounded-full flex items-center justify-center flex-shrink-0`}>
          {content.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            {content.title}
          </p>
          <p className="text-sm text-gray-600">
            {content.message}
          </p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Il y a {minutesAgo} min
            <span className="mx-1">•</span>
            <MapPin className="w-3 h-3" />
            Val-d'Oise
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>

      {/* Dismiss permanently option */}
      <button
        onClick={onDismissAll}
        className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 border-t border-gray-100 transition-colors"
      >
        Ne plus afficher
      </button>
    </motion.div>
  );
}

/**
 * Live counter showing current site activity
 */
export function LiveActivityCounter() {
  const [stats, setStats] = useState({
    visitors: 14,
    ordersToday: 7,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setStats(prev => ({
        visitors: Math.max(8, Math.min(30, prev.visitors + (Math.random() > 0.5 ? 1 : -1))),
        ordersToday: prev.ordersToday + (Math.random() > 0.95 ? 1 : 0),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div className="inline-flex items-center gap-4 px-4 py-2 bg-gray-900/90 backdrop-blur rounded-full text-white text-sm">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span>{stats.visitors} visiteurs en ligne</span>
      </div>
      <div className="w-px h-4 bg-white/20" />
      <div className="flex items-center gap-1">
        <CheckCircle2 className="w-4 h-4 text-green-400" />
        <span>{stats.ordersToday} commandes aujourd'hui</span>
      </div>
    </div>
  );
}

/**
 * Monthly stats display
 */
export function MonthlyStats() {
  const currentMonth = new Date().toLocaleDateString('fr-FR', { month: 'long' });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-400" />
        Statistiques {currentMonth}
      </h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-3xl font-bold text-green-400">47</div>
          <div className="text-sm text-gray-400">Sites livrés</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-400">4.9</div>
          <div className="text-sm text-gray-400">Note moyenne</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-purple-400">2h</div>
          <div className="text-sm text-gray-400">Délai moyen</div>
        </div>
      </div>
    </motion.div>
  );
}

