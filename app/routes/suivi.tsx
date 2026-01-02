import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import type { Route } from "./+types/suivi";
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { localStore } from '~/lib/store';
import { formatDate, getStatusLabel, getStatusColor } from '~/lib/utils';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Palette, 
  FileText,
  MessageSquare,
  ArrowRight,
  AlertCircle,
  Loader2,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Suivi commande ${params.orderNumber} — FastFabric` },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

const statusSteps = [
  { id: 'new', label: 'Commande reçue', icon: Package },
  { id: 'in_progress', label: 'En production', icon: Loader2 },
  { id: 'review', label: 'En révision', icon: MessageSquare },
  { id: 'completed', label: 'Livré', icon: CheckCircle2 },
];

export default function OrderTracking() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [offer, setOffer] = useState<any>(null);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [submittingRevision, setSubmittingRevision] = useState(false);

  useEffect(() => {
    const foundOrder = localStore.getOrderByNumber(params.orderNumber!);
    if (foundOrder) {
      setOrder(foundOrder);
      const offers = localStore.getOffers();
      setOffer(offers.find(o => o.id === foundOrder.offer_id));
      setRevisions(localStore.getRevisions(foundOrder.id));
    }
    setLoading(false);
  }, [params.orderNumber]);

  const handleRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionFeedback.trim() || !order) return;

    setSubmittingRevision(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newRevision = localStore.createRevision(order.id, revisionFeedback);
    setRevisions([...revisions, newRevision]);
    setOrder({ ...order, status: 'review', revisions_used: (order.revisions_used || 0) + 1 });
    setRevisionFeedback('');
    setShowRevisionForm(false);
    setSubmittingRevision(false);
  };

  const getCurrentStepIndex = () => {
    if (order?.status === 'quote_pending' || order?.status === 'quote_sent') return -1;
    if (order?.status === 'cancelled') return -2;
    return statusSteps.findIndex(s => s.id === order?.status);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </main>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <div className="bg-white rounded-2xl p-12 shadow-sm">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande introuvable</h1>
              <p className="text-gray-600 mb-6">
                Le numéro de commande <strong>{params.orderNumber}</strong> n'existe pas ou a été supprimé.
              </p>
              <Link to="/">
                <Button>Retour à l'accueil</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentStep = getCurrentStepIndex();
  const isQuote = order.is_quote;
  const maxRevisions = offer?.max_revisions || 1;
  const revisionsLeft = maxRevisions - (order.revisions_used || 0);
  const canRequestRevision = order.status === 'completed' && revisionsLeft > 0;

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className={getStatusColor(order.status)} size="md">
              {getStatusLabel(order.status)}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">
              {order.project_details.name}
            </h1>
            <p className="text-gray-600 mt-2">
              Commande {order.order_number} • {formatDate(order.created_at)}
            </p>
          </motion.div>

          {/* Progress Steps */}
          {!isQuote && currentStep >= 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="mb-8 p-6">
                <div className="flex items-center justify-between relative">
                  {/* Progress line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
                  <div 
                    className="absolute top-5 left-0 h-0.5 bg-green-500 transition-all duration-500"
                    style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                  />
                  
                  {statusSteps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.id} className="relative z-10 flex flex-col items-center">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center transition-all
                          ${isCompleted ? 'bg-green-500 text-white' : 
                            isCurrent ? 'bg-[var(--accent)] text-white ring-4 ring-[var(--accent)]/20' : 
                            'bg-gray-200 text-gray-500'}
                        `}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isCurrent && step.id === 'in_progress' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        <span className={`
                          mt-2 text-xs font-medium text-center
                          ${isCurrent ? 'text-gray-900' : 'text-gray-500'}
                        `}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Quote Status */}
          {isQuote && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="mb-8 p-6 border-purple-200 bg-purple-50/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Demande de devis</h3>
                    <p className="text-gray-600 mt-1">
                      {order.status === 'quote_pending' 
                        ? 'Votre demande est en cours d\'analyse. Nous vous répondrons sous 24h.'
                        : order.status === 'quote_sent'
                        ? 'Un devis vous a été envoyé par email. Vérifiez votre boîte de réception.'
                        : 'Statut de votre demande de devis.'}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Project Details */}
              <Card>
                <h2 className="font-bold text-lg mb-4">Détails du projet</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-gray-900">{order.project_details.description}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Objectif</p>
                    <p className="text-gray-900">{order.project_details.objective}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Pages</p>
                    <div className="flex flex-wrap gap-2">
                      {order.selected_pages?.map((page: string) => (
                        <Badge key={page} variant="default">{page}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Palette de couleurs</p>
                    <div className="flex gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: order.primary_color }}
                      />
                      <div 
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: order.secondary_color }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Revision Request */}
              {canRequestRevision && !showRevisionForm && (
                <Card className="border-orange-200 bg-orange-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Besoin de modifications ?</h3>
                      <p className="text-sm text-gray-600">
                        Il vous reste {revisionsLeft} révision{revisionsLeft > 1 ? 's' : ''} incluse{revisionsLeft > 1 ? 's' : ''}
                      </p>
                    </div>
                    <Button onClick={() => setShowRevisionForm(true)}>
                      Demander une révision
                    </Button>
                  </div>
                </Card>
              )}

              {/* Revision Form */}
              <AnimatePresence>
                {showRevisionForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card>
                      <h3 className="font-bold text-lg mb-4">Demander une révision</h3>
                      <form onSubmit={handleRevisionSubmit}>
                        <textarea
                          value={revisionFeedback}
                          onChange={(e) => setRevisionFeedback(e.target.value)}
                          className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                          rows={4}
                          placeholder="Décrivez les modifications souhaitées en détail..."
                          required
                        />
                        <div className="flex gap-3 mt-4">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowRevisionForm(false)}
                          >
                            Annuler
                          </Button>
                          <Button type="submit" isLoading={submittingRevision}>
                            <Send className="w-4 h-4" />
                            Envoyer la demande
                          </Button>
                        </div>
                      </form>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Revision History */}
              {revisions.length > 0 && (
                <Card>
                  <h3 className="font-bold text-lg mb-4">Historique des révisions</h3>
                  <div className="space-y-4">
                    {revisions.map((revision, index) => (
                      <div 
                        key={revision.id}
                        className="p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Révision #{revision.revision_number}</span>
                          <Badge className={
                            revision.status === 'completed' ? 'bg-green-100 text-green-700' :
                            revision.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                          }>
                            {revision.status === 'completed' ? 'Terminée' :
                             revision.status === 'in_progress' ? 'En cours' : 'En attente'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{revision.feedback}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(revision.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Order Summary */}
              <Card>
                <h3 className="font-bold text-lg mb-4">Récapitulatif</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Offre</span>
                    <span className="font-medium">{offer?.name || '-'}</span>
                  </div>
                  
                  {!isQuote && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant TTC</span>
                      <span className="font-bold text-[var(--accent)]">{order.amount_ttc}€</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pages</span>
                    <span className="font-medium">{order.selected_pages?.length || 0}</span>
                  </div>
                  
                  {!isQuote && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Révisions utilisées</span>
                      <span className="font-medium">{order.revisions_used || 0} / {maxRevisions}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Contact */}
              <Card className="bg-gray-900 text-white">
                <h3 className="font-bold text-lg mb-2">Une question ?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Notre équipe est disponible pour vous aider.
                </p>
                <a href="mailto:contact@fastfabric.fr">
                  <Button variant="secondary" className="w-full bg-white text-gray-900 hover:bg-gray-100">
                    Nous contacter
                  </Button>
                </a>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}


