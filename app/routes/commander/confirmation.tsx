import { useParams, useSearchParams, Link } from 'react-router';
import { useEffect, useState } from 'react';
import type { Route } from "./+types/confirmation";
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { localStore } from '~/lib/store';
import { 
  Check, 
  Clock, 
  Mail, 
  ArrowRight, 
  MessageSquare, 
  Phone, 
  Sparkles,
  Zap,
  PartyPopper
} from 'lucide-react';
import { motion } from 'framer-motion';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Confirmation — FastFabric" },
  ];
}

export default function CommanderConfirmation() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const isPending = searchParams.get('type') === 'pending';

  useEffect(() => {
    const orders = localStore.getOrders();
    const found = orders.find((o: any) => o.id === params.id);
    setOrder(found);
  }, [params.id]);

  if (!order) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/60 mb-4">Commande introuvable</p>
            <Link 
              to="/commander"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-medium"
            >
              Nouvelle commande
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-[#0a0a0f] pt-20 pb-16 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-6 max-w-2xl relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Success Animation */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="relative w-24 h-24 mx-auto mb-8"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl animate-pulse" />
                {/* Main circle */}
                <div className="relative w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  {isPending ? (
                    <Clock className="w-12 h-12 text-white" />
                  ) : (
                    <Check className="w-12 h-12 text-white" strokeWidth={3} />
                  )}
                </div>
                {/* Sparkles */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-2 -right-2"
                >
                  <PartyPopper className="w-8 h-8 text-amber-400" />
                </motion.div>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              >
                {isPending ? 'Commande reçue !' : 'Merci pour votre commande !'}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/60 max-w-md mx-auto"
              >
                {isPending 
                  ? 'Nous vous contacterons pour finaliser le paiement.'
                  : 'Votre site est maintenant en production. On se retrouve dans quelques heures !'
                }
              </motion.p>
            </div>

            {/* Order Number */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6 text-center"
            >
              <p className="text-sm text-white/50 mb-2">Numéro de commande</p>
              <p className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                {order.order_number}
              </p>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid sm:grid-cols-2 gap-4 mb-8"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Livraison express</p>
                  <p className="text-sm text-white/50">Votre site prêt en ~2 heures</p>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Confirmation envoyée</p>
                  <p className="text-sm text-white/50">{order.customer?.email}</p>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8"
            >
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Récapitulatif
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/60">Projet</span>
                  <span className="text-white font-medium">{order.project_details?.name || 'Mon projet'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/60">Client</span>
                  <span className="text-white font-medium">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </span>
                </div>
                {order.amount_ttc > 0 && (
                  <div className="flex justify-between py-3">
                    <span className="text-white/60">Montant</span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
                      {order.amount_ttc}€ TTC
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 backdrop-blur-xl rounded-2xl border border-violet-500/20 p-6 mb-8"
            >
              <h2 className="text-lg font-bold text-white mb-4">Et maintenant ?</h2>
              
              <ol className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Commande confirmée</p>
                    <p className="text-sm text-white/50">Votre projet est bien enregistré</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-white font-medium">Création en cours</p>
                    <p className="text-sm text-white/50">Notre équipe travaille sur votre site</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white/60 text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-white/60 font-medium">Livraison par email</p>
                    <p className="text-sm text-white/40">Vous recevrez tout par email</p>
                  </div>
                </li>
              </ol>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-5 h-5 text-white/60" />
                <h2 className="font-bold text-white">Une question ?</h2>
              </div>
              <p className="text-sm text-white/50 mb-4">
                Notre équipe est disponible pour vous aider.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="mailto:contact@fastfabric.fr" 
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  contact@fastfabric.fr
                </a>
                <a 
                  href="https://wa.me/33600000000" 
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-emerald-400 text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                to="/"
                className="px-8 py-4 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-colors text-center"
              >
                Retour à l'accueil
              </Link>
              <Link 
                to="/commander"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold transition-all flex items-center justify-center gap-2 group"
              >
                Commander un autre site
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
