import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from "./+types/paiement";
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { localStore } from '~/lib/store';
import { cn } from '~/lib/utils';
import { 
  ArrowLeft, 
  Lock, 
  CreditCard, 
  Shield, 
  Check,
  Zap,
  Star,
  Clock,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Paiement — Commander — FastFabric" },
  ];
}

export async function clientLoader() {
  const offers = localStore.getOffers();
  return { offers };
}

// Same promo codes as commander page
const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  'FLASH10': { discount: 0.10, label: '-10% Flash' },
  'BIENVENUE15': { discount: 0.15, label: '-15% Bienvenue' },
  'VIP20': { discount: 0.20, label: '-20% VIP' },
};

export default function PaiementPage({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { offers } = loaderData;
  
  const [orderData, setOrderData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'later'>('card');

  useEffect(() => {
    const saved = sessionStorage.getItem('ff_order_data');
    if (!saved) {
      navigate('/commander');
      return;
    }
    setOrderData(JSON.parse(saved));
  }, [navigate]);
  
  // Get promo info
  const promoCode = orderData?.promoCode;
  const activePromo = promoCode ? PROMO_CODES[promoCode] : null;
  
  // Calculate discounted price
  const getDiscountedPrice = (price: number) => {
    if (!activePromo) return price;
    return Math.round(price * (1 - activePromo.discount));
  };

  const handlePayment = async () => {
    if (!orderData) return;
    
    setIsProcessing(true);
    
    const selectedOffer = offers.find((o: any) => o.id === orderData.selectedOffer);
    
    // Create order in local store (with discounted price)
    const order = localStore.createOrder({
      offer_id: orderData.selectedOffer,
      customer: {
        firstName: orderData.formData.firstName,
        lastName: orderData.formData.lastName,
        email: orderData.formData.email,
        phone: orderData.formData.phone,
        company: orderData.formData.company,
      },
      project_details: {
        name: orderData.formData.projectName,
        sector: orderData.formData.sector,
        promoCode: promoCode || null,
      },
      amount_ttc: total, // Use discounted price
      status: paymentMethod === 'card' ? 'payment_pending' : 'new',
    });

    if (paymentMethod === 'card') {
      // In production: redirect to Stripe Checkout
      // For now: simulate payment and redirect
      try {
        const response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            offerId: orderData.selectedOffer,
            customerEmail: orderData.formData.email,
          }),
        });
        
        if (response.ok) {
          const { url } = await response.json();
          if (url) {
            window.location.href = url;
            return;
          }
        }
      } catch (error) {
        console.log('Stripe not configured, simulating payment...');
      }
      
      // Fallback: simulate successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      sessionStorage.removeItem('ff_order_data');
      navigate(`/commander/confirmation/${order.id}`);
    } else {
      // Pay later - go to confirmation
      sessionStorage.removeItem('ff_order_data');
      navigate(`/commander/confirmation/${order.id}?type=pending`);
    }
  };

  if (!orderData) return null;

  const selectedOffer = offers.find((o: any) => o.id === orderData.selectedOffer);
  const originalPrice = selectedOffer?.price_ttc || 0;
  const total = getDiscountedPrice(originalPrice);

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-[#0a0a0f] pt-20 pb-16 relative overflow-hidden">
        {/* Background Effects - Lightweight static gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 max-w-4xl relative">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Finaliser votre commande
            </h1>
            <p className="text-lg text-white/60">
              Plus qu'une étape avant de recevoir votre site !
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-white/60 font-medium">Votre commande</span>
            </div>
            <div className="w-12 h-px bg-emerald-500" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                2
              </div>
              <span className="text-white font-medium">Paiement</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Order Summary */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                Récapitulatif de commande
              </h2>
              
              <div className="space-y-4">
                {/* Client */}
                <div className="p-4 bg-white/5 rounded-xl">
                  <h3 className="text-sm text-white/50 mb-2">Client</h3>
                  <p className="text-white font-medium">
                    {orderData.formData.firstName} {orderData.formData.lastName}
                  </p>
                  <p className="text-white/60 text-sm">{orderData.formData.email}</p>
                  {orderData.formData.company && (
                    <p className="text-white/60 text-sm">{orderData.formData.company}</p>
                  )}
                </div>

                {/* Project */}
                <div className="p-4 bg-white/5 rounded-xl">
                  <h3 className="text-sm text-white/50 mb-2">Projet</h3>
                  <p className="text-white font-medium">{orderData.formData.projectName}</p>
                  {orderData.formData.sector && (
                    <p className="text-white/60 text-sm capitalize">{orderData.formData.sector}</p>
                  )}
                </div>

                {/* Offer */}
                <div className="p-4 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-xl border border-violet-500/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm text-white/50 mb-1">Offre sélectionnée</h3>
                      <p className="text-white font-bold text-lg">{selectedOffer?.name}</p>
                    </div>
                    <div className="text-right">
                      {activePromo && (
                        <p className="text-sm text-white/40 line-through">{originalPrice}€</p>
                      )}
                      <p className="text-3xl font-bold text-white">{total}€</p>
                      <p className="text-xs text-white/50">TTC</p>
                    </div>
                  </div>
                  
                  {/* Promo code badge */}
                  {activePromo && (
                    <div className="mt-3 flex items-center justify-between p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300 font-medium text-sm">
                          Code {promoCode} : {activePromo.label}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-bold">
                        -{Math.round(originalPrice * activePromo.discount)}€
                      </span>
                    </div>
                  )}
                </div>

                {/* Delivery */}
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-white font-medium">Livraison express</p>
                    <p className="text-sm text-white/60">Votre site prêt en ~{selectedOffer?.estimated_hours || 2} heures</p>
                  </div>
                </div>

                {/* Features */}
                <div className="pt-4 space-y-2">
                  {selectedOffer?.features?.slice(0, 5).map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Payment */}
            <div className="space-y-6">
              {/* Payment Method Selection */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-violet-400" />
                  Mode de paiement
                </h2>
                
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4",
                      paymentMethod === 'card'
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/30"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                      paymentMethod === 'card' ? "border-violet-500 bg-violet-500" : "border-white/30"
                    )}>
                      {paymentMethod === 'card' && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Carte bancaire</p>
                      <p className="text-sm text-white/50">Paiement sécurisé via Stripe</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-xs font-bold text-blue-600">VISA</div>
                      <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                        <div className="flex">
                          <div className="w-3 h-3 bg-red-500 rounded-full -mr-1" />
                          <div className="w-3 h-3 bg-amber-400 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('later')}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4",
                      paymentMethod === 'later'
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/30"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                      paymentMethod === 'later' ? "border-violet-500 bg-violet-500" : "border-white/30"
                    )}>
                      {paymentMethod === 'later' && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Payer après réception</p>
                      <p className="text-sm text-white/50">On vous contacte pour valider</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Paiement 100% sécurisé</p>
                      <p className="text-sm text-white/50">Cryptage SSL 256-bit</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Satisfait ou refait</p>
                      <p className="text-sm text-white/50">Modifications gratuites incluses</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Livraison express</p>
                      <p className="text-sm text-white/50">Votre site prêt en 2h</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={cn(
                    "w-full py-4 px-6 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-3",
                    paymentMethod === 'card'
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25"
                      : "bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 shadow-lg shadow-violet-500/25",
                    isProcessing && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : paymentMethod === 'card' ? (
                    <>
                      <Lock className="w-5 h-5" />
                      Payer {total}€ de manière sécurisée
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Confirmer ma commande
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate('/commander')}
                  className="flex items-center justify-center gap-2 text-white/60 hover:text-white transition-colors py-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Modifier ma commande
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
