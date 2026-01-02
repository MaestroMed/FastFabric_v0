import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from "./+types/paiement";
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { FormProgress } from '~/components/order/FormProgress';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { localStore } from '~/lib/store';
import { ArrowLeft, Lock, CreditCard, Shield, Send, FileText, MessageSquare, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 1, name: 'Informations', description: 'Vos coordonnées' },
  { id: 2, name: 'Projet', description: 'Design & pages' },
  { id: 3, name: 'Contenu', description: 'Logo & textes' },
  { id: 4, name: 'Finalisation', description: 'Validation' },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Finalisation — Commander — FastFabric" },
  ];
}

export async function clientLoader() {
  const offers = localStore.getOffers();
  return { offers };
}

export default function CommanderStep4({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { offers } = loaderData;
  
  const [orderData, setOrderData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  });
  const [quoteData, setQuoteData] = useState({
    budget: '',
    deadline: '',
    additionalInfo: '',
    preferredContact: 'email',
  });

  useEffect(() => {
    const saved1 = sessionStorage.getItem('ff_order_step1');
    const saved2 = sessionStorage.getItem('ff_order_step2');
    const saved3 = sessionStorage.getItem('ff_order_step3');
    
    if (!saved1 || !saved2) {
      navigate('/commander');
      return;
    }
    
    setOrderData({
      step1: JSON.parse(saved1),
      step2: JSON.parse(saved2),
      step3: saved3 ? JSON.parse(saved3) : {},
    });
  }, [navigate]);

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    if (name === 'number') {
      value = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    }
    if (name === 'cvc') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuoteData(prev => ({ ...prev, [name]: value }));
  };

  const createOrder = async (isQuote: boolean) => {
    const selectedOffer = offers.find((o: any) => o.id === orderData.step1.selectedOffer);
    const logoExtra = orderData.step3?.logoOption === 'generated' ? 50 : 0;
    
    const order = localStore.createOrder({
      offer_id: orderData.step1.selectedOffer,
      customer: {
        firstName: orderData.step1.formData.firstName,
        lastName: orderData.step1.formData.lastName,
        email: orderData.step1.formData.email,
        phone: orderData.step1.formData.phone,
        company: orderData.step1.formData.company,
      },
      project_details: {
        name: orderData.step1.formData.projectName,
        description: orderData.step1.formData.projectDescription,
        objective: orderData.step1.formData.objective,
        content: orderData.step3?.content,
        inspiration: orderData.step3?.inspiration,
        notes: orderData.step3?.notes,
        ...(isQuote && {
          budget: quoteData.budget,
          deadline: quoteData.deadline,
          additionalInfo: quoteData.additionalInfo,
          preferredContact: quoteData.preferredContact,
        }),
      },
      selected_pages: orderData.step2.selectedPages,
      selected_tags: orderData.step2.selectedTags,
      primary_color: orderData.step2.primaryColor,
      secondary_color: orderData.step2.secondaryColor,
      amount_ttc: isQuote ? 0 : (selectedOffer?.price_ttc || 0) + logoExtra,
      is_quote: isQuote,
      status: isQuote ? 'quote_pending' : 'new',
    });
    
    // Clear session storage
    sessionStorage.removeItem('ff_order_step1');
    sessionStorage.removeItem('ff_order_step2');
    sessionStorage.removeItem('ff_order_step3');
    
    return order;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const order = await createOrder(false);
    navigate(`/commander/confirmation/${order.id}`);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate sending quote request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const order = await createOrder(true);
    navigate(`/commander/confirmation/${order.id}?type=quote`);
  };

  if (!orderData) return null;

  const selectedOffer = offers.find((o: any) => o.id === orderData.step1.selectedOffer);
  const isQuoteMode = selectedOffer?.price_ttc === 0;
  const logoExtra = orderData.step3?.logoOption === 'generated' ? 50 : 0;
  const total = (selectedOffer?.price_ttc || 0) + logoExtra;

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <FormProgress steps={steps} currentStep={4} />
          
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <Card className="sticky top-28">
                <h2 className="text-lg font-bold mb-6">Récapitulatif</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client</span>
                    <span className="font-medium text-right">
                      {orderData.step1.formData.firstName} {orderData.step1.formData.lastName}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projet</span>
                    <span className="font-medium">{orderData.step1.formData.projectName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Offre</span>
                    <span className="font-medium">{selectedOffer?.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pages</span>
                    <span className="font-medium">{orderData.step2.selectedPages.length} pages</span>
                  </div>
                  
                  {!isQuoteMode && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prix de base</span>
                        <span className="font-medium">{selectedOffer?.price_ttc}€</span>
                      </div>
                      
                      {logoExtra > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Création logo IA</span>
                          <span className="font-medium">+{logoExtra}€</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-900 font-semibold">
                      {isQuoteMode ? 'Type' : 'Total TTC'}
                    </span>
                    <span className="text-2xl font-bold text-[var(--accent)]">
                      {isQuoteMode ? 'Sur devis' : `${total}€`}
                    </span>
                  </div>
                  {!isQuoteMode && (
                    <p className="text-xs text-gray-500 mt-1">
                      Livraison estimée : ~{selectedOffer?.estimated_hours || 2}h
                    </p>
                  )}
                </div>
                
                {/* Color Preview */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Palette choisie</p>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded-lg shadow-sm border border-gray-200"
                      style={{ backgroundColor: orderData.step2.primaryColor }}
                    />
                    <div 
                      className="w-10 h-10 rounded-lg shadow-sm border border-gray-200"
                      style={{ backgroundColor: orderData.step2.secondaryColor }}
                    />
                  </div>
                </div>

                {/* Selected Pages */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Pages sélectionnées</p>
                  <div className="flex flex-wrap gap-1">
                    {orderData.step2.selectedPages.map((page: string) => (
                      <span key={page} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                        {page}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Payment or Quote Form */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {isQuoteMode ? (
                  <motion.form
                    key="quote-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleQuoteSubmit}
                  >
                    {/* Quote Request Form */}
                    <Card className="mb-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h2 className="font-bold">Demande de devis</h2>
                          <p className="text-sm text-gray-500">Nous vous répondrons sous 24h</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Budget estimé
                          </label>
                          <select
                            name="budget"
                            value={quoteData.budget}
                            onChange={handleQuoteChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                            required
                          >
                            <option value="">Sélectionner...</option>
                            <option value="500-1000">500€ - 1 000€</option>
                            <option value="1000-2000">1 000€ - 2 000€</option>
                            <option value="2000-5000">2 000€ - 5 000€</option>
                            <option value="5000+">5 000€ et plus</option>
                            <option value="unknown">Je ne sais pas</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline-block mr-1" />
                            Délai souhaité
                          </label>
                          <select
                            name="deadline"
                            value={quoteData.deadline}
                            onChange={handleQuoteChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                            required
                          >
                            <option value="">Sélectionner...</option>
                            <option value="urgent">Urgent (moins d'une semaine)</option>
                            <option value="normal">Normal (1-2 semaines)</option>
                            <option value="flexible">Flexible (plus de 2 semaines)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MessageSquare className="w-4 h-4 inline-block mr-1" />
                            Informations complémentaires
                          </label>
                          <textarea
                            name="additionalInfo"
                            value={quoteData.additionalInfo}
                            onChange={handleQuoteChange}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none"
                            placeholder="Décrivez vos besoins spécifiques, fonctionnalités souhaitées, intégrations..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Moyen de contact préféré
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="preferredContact"
                                value="email"
                                checked={quoteData.preferredContact === 'email'}
                                onChange={handleQuoteChange}
                                className="w-4 h-4 text-[var(--accent)]"
                              />
                              <span className="text-sm">Email</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="preferredContact"
                                value="phone"
                                checked={quoteData.preferredContact === 'phone'}
                                onChange={handleQuoteChange}
                                className="w-4 h-4 text-[var(--accent)]"
                              />
                              <span className="text-sm">Téléphone</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="preferredContact"
                                value="both"
                                checked={quoteData.preferredContact === 'both'}
                                onChange={handleQuoteChange}
                                className="w-4 h-4 text-[var(--accent)]"
                              />
                              <span className="text-sm">Les deux</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Info Box */}
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl mb-6">
                      <FileText className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-purple-900">Comment ça marche ?</p>
                        <p className="text-purple-700">
                          Nous analysons votre demande et vous envoyons un devis personnalisé sous 24h. 
                          Aucun engagement, aucun paiement à cette étape.
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={() => navigate('/commander/contenu')}
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Retour
                      </Button>
                      
                      <Button
                        type="submit"
                        size="lg"
                        isLoading={isProcessing}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isProcessing ? (
                          'Envoi en cours...'
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Envoyer ma demande
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="payment-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handlePayment}
                  >
                    <Card className="mb-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-[var(--accent)]" />
                        </div>
                        <div>
                          <h2 className="font-bold">Paiement sécurisé</h2>
                          <p className="text-sm text-gray-500">Vos données sont protégées</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Input
                          label="Nom sur la carte"
                          name="name"
                          value={cardData.name}
                          onChange={handleCardChange}
                          placeholder="JEAN DUPONT"
                          required
                        />
                        
                        <Input
                          label="Numéro de carte"
                          name="number"
                          value={cardData.number}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Expiration"
                            name="expiry"
                            value={cardData.expiry}
                            onChange={handleCardChange}
                            placeholder="MM/AA"
                            required
                          />
                          <Input
                            label="CVC"
                            name="cvc"
                            value={cardData.cvc}
                            onChange={handleCardChange}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-6 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                        <Lock className="w-4 h-4" />
                        <span>Paiement sécurisé SSL 256-bit</span>
                      </div>
                    </Card>

                    {/* Guarantee */}
                    <div className="flex items-start gap-3 p-4 bg-gray-100 rounded-xl mb-6">
                      <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Garantie satisfait ou refait</p>
                        <p className="text-gray-600">
                          Si le résultat ne vous convient pas, nous recommençons gratuitement
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={() => navigate('/commander/contenu')}
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Retour
                      </Button>
                      
                      <Button
                        type="submit"
                        size="lg"
                        isLoading={isProcessing}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        {isProcessing ? (
                          'Traitement...'
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Payer {total}€
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
