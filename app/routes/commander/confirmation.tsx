import { useParams, useSearchParams, Link } from 'react-router';
import { useEffect, useState } from 'react';
import type { Route } from "./+types/confirmation";
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { localStore } from '~/lib/store';
import { Check, Clock, Mail, ArrowRight, FileText, MessageSquare, Phone, Calendar } from 'lucide-react';
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
  const isQuote = searchParams.get('type') === 'quote';

  useEffect(() => {
    const orders = localStore.getOrders();
    const found = orders.find((o: any) => o.id === params.id);
    setOrder(found);
  }, [params.id]);

  if (!order) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Commande introuvable</p>
            <Link to="/commander">
              <Button>Nouvelle commande</Button>
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
      
      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Success Icon */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className={`w-20 h-20 mx-auto ${isQuote ? 'bg-purple-500' : 'bg-green-500'} rounded-full flex items-center justify-center mb-6`}
              >
                {isQuote ? (
                  <FileText className="w-10 h-10 text-white" />
                ) : (
                  <Check className="w-10 h-10 text-white" />
                )}
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mb-2"
              >
                {isQuote ? 'Demande envoyée !' : 'Commande confirmée !'}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600"
              >
                {isQuote 
                  ? 'Merci pour votre demande. Notre équipe analyse votre projet.'
                  : 'Merci pour votre confiance. Votre projet est maintenant en production.'
                }
              </motion.p>
            </div>

            {/* Order Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="mb-8">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-1">
                    {isQuote ? 'Numéro de demande' : 'Numéro de commande'}
                  </p>
                  <p className={`text-2xl font-mono font-bold ${isQuote ? 'text-purple-600' : 'text-[var(--accent)]'}`}>
                    {order.order_number}
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${isQuote ? 'bg-purple-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {isQuote ? (
                        <Calendar className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-[var(--accent)]" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {isQuote ? 'Réponse sous' : 'Livraison estimée'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isQuote ? '24 heures maximum' : 'Dans les prochaines heures'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {isQuote ? 'Confirmation envoyée' : 'Email de confirmation'}
                      </p>
                      <p className="text-sm text-gray-600">Envoyé à {order.customer.email}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Project Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="mb-8">
                <h2 className="font-bold mb-4">Récapitulatif du projet</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Projet</span>
                    <span className="font-medium">{order.project_details.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Pages</span>
                    <span className="font-medium">{order.selected_pages?.length || 0} pages</span>
                  </div>
                  {!isQuote && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Montant</span>
                      <span className="font-bold text-[var(--accent)]">{order.amount_ttc}€ TTC</span>
                    </div>
                  )}
                  {isQuote && order.project_details.budget && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Budget estimé</span>
                      <span className="font-medium">{order.project_details.budget}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Couleurs</span>
                    <div className="flex gap-1">
                      <div 
                        className="w-6 h-6 rounded border border-gray-200"
                        style={{ backgroundColor: order.primary_color }}
                      />
                      <div 
                        className="w-6 h-6 rounded border border-gray-200"
                        style={{ backgroundColor: order.secondary_color }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className={`mb-8 ${isQuote ? 'bg-purple-50 border-purple-100' : 'bg-blue-50 border-blue-100'}`}>
                <h2 className="font-bold mb-4">Prochaines étapes</h2>
                
                {isQuote ? (
                  <ol className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Analyse de votre demande</p>
                        <p className="text-sm text-gray-600">Notre équipe étudie votre projet en détail</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Réception du devis</p>
                        <p className="text-sm text-gray-600">Vous recevrez un devis détaillé sous 24h</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Échange téléphonique</p>
                        <p className="text-sm text-gray-600">Nous pouvons prévoir un appel pour affiner vos besoins</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        4
                      </div>
                      <div>
                        <p className="font-medium">Démarrage du projet</p>
                        <p className="text-sm text-gray-600">Une fois le devis accepté, on commence !</p>
                      </div>
                    </li>
                  </ol>
                ) : (
                  <ol className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Production en cours</p>
                        <p className="text-sm text-gray-600">Notre équipe travaille sur votre site</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Livraison par email</p>
                        <p className="text-sm text-gray-600">Vous recevrez le site et le code source</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Révisions si besoin</p>
                        <p className="text-sm text-gray-600">Demandez des ajustements gratuitement</p>
                      </div>
                    </li>
                  </ol>
                )}
              </Card>
            </motion.div>

            {/* Contact Info for Quote */}
            {isQuote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="mb-8 bg-gray-50">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    <h2 className="font-bold">Une question ?</h2>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    N'hésitez pas à nous contacter si vous avez des informations à ajouter.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <a href="mailto:contact@fastfabric.fr" className="flex items-center gap-2 text-[var(--accent)] hover:underline">
                      <Mail className="w-4 h-4" />
                      contact@fastfabric.fr
                    </a>
                    <a href="tel:+33123456789" className="flex items-center gap-2 text-[var(--accent)] hover:underline">
                      <Phone className="w-4 h-4" />
                      01 23 45 67 89
                    </a>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Retour à l'accueil
                </Button>
              </Link>
              <Link to="/commander">
                <Button size="lg" className={`w-full sm:w-auto group ${isQuote ? 'bg-purple-600 hover:bg-purple-700' : ''}`}>
                  {isQuote ? 'Autre demande' : 'Commander un autre site'}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
