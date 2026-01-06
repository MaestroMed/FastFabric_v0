import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import type { Route } from "./+types/index";
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { localStore } from '~/lib/store';
import { cn } from '~/lib/utils';
import { 
  ArrowRight, 
  Check, 
  Zap, 
  Star, 
  Shield, 
  Sparkles,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Crown,
  Rocket,
  Diamond,
  Clock,
  FileText
} from 'lucide-react';

// ============================================
// META & LOADER
// ============================================

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Commander votre site — FastFabric" },
    { name: "description", content: "Commandez votre site web sur mesure en quelques minutes. Livraison en 2 heures." },
  ];
}

export async function clientLoader() {
  const offers = localStore.getOffers();
  return { offers };
}

// ============================================
// COMPONENT
// ============================================

export default function CommanderPage({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { offers } = loaderData;
  
  // Pre-select offer from URL
  const preselectedOffer = searchParams.get('offre');
  
  const [selectedOffer, setSelectedOffer] = useState<string>(preselectedOffer || '');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    projectName: '',
    sector: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set default offer
  useEffect(() => {
    if (!selectedOffer && offers.length > 0) {
      const defaultOffer = offers.find((o: any) => o.name === 'Site Vitrine') || offers[1];
      if (defaultOffer) setSelectedOffer(defaultOffer.id);
    }
  }, [offers, selectedOffer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
    if (!formData.email.trim()) newErrors.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.projectName.trim()) newErrors.projectName = 'Nom du projet requis';
    if (!selectedOffer) newErrors.offer = 'Veuillez choisir une offre';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Save to session
    sessionStorage.setItem('ff_order_data', JSON.stringify({
      selectedOffer,
      formData,
    }));
    
    navigate('/commander/paiement');
  };

  const currentOffer = offers.find((o: any) => o.id === selectedOffer);

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-[#0a0a0f] pt-20 pb-16 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-white/80">Livraison en ~2 heures</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Commander votre site
            </h1>
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              Choisissez votre offre, remplissez vos infos, et c'est parti !
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                1
              </div>
              <span className="text-white font-medium">Votre commande</span>
            </div>
            <div className="w-12 h-px bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/40 font-bold">
                2
              </div>
              <span className="text-white/40 font-medium">Paiement</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Offers */}
              <div className="lg:col-span-2 space-y-6">
                {/* Offers Selection */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Crown className="w-6 h-6 text-amber-400" />
                    Choisir votre offre
                  </h2>
                  
                  <div className="grid gap-4">
                    {offers.filter((o: any) => o.price_ttc > 0).map((offer: any) => (
                      <button
                        key={offer.id}
                        type="button"
                        onClick={() => setSelectedOffer(offer.id)}
                        className={cn(
                          "relative w-full p-5 rounded-xl border-2 transition-all text-left group",
                          selectedOffer === offer.id
                            ? "border-violet-500 bg-violet-500/10"
                            : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                        )}
                      >
                        {/* Popular Badge */}
                        {offer.name === 'Site Vitrine' && (
                          <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full text-xs font-bold text-black">
                            ⭐ Le plus populaire
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Radio */}
                            <div className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                              selectedOffer === offer.id
                                ? "border-violet-500 bg-violet-500"
                                : "border-white/30"
                            )}>
                              {selectedOffer === offer.id && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </div>
                            
                            {/* Icon */}
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center",
                              offer.name === 'One Page' && "bg-emerald-500/20",
                              offer.name === 'Site Vitrine' && "bg-violet-500/20",
                              offer.name === 'Site Sur Mesure' && "bg-amber-500/20",
                            )}>
                              {offer.name === 'One Page' && <FileText className="w-6 h-6 text-emerald-400" />}
                              {offer.name === 'Site Vitrine' && <Rocket className="w-6 h-6 text-violet-400" />}
                              {offer.name === 'Site Sur Mesure' && <Diamond className="w-6 h-6 text-amber-400" />}
                            </div>
                            
                            {/* Info */}
                            <div>
                              <h3 className="text-lg font-bold text-white">{offer.name}</h3>
                              <p className="text-sm text-white/60">{offer.short_description}</p>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">{offer.price_ttc}€</div>
                            <div className="text-xs text-white/40">TTC</div>
                          </div>
                        </div>
                        
                        {/* Features */}
                        {selectedOffer === offer.id && (
                          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
                            {offer.features?.slice(0, 4).map((feature: string, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {errors.offer && (
                    <p className="text-red-400 text-sm mt-2">{errors.offer}</p>
                  )}
                </div>

                {/* Contact Info */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <User className="w-6 h-6 text-violet-400" />
                    Vos coordonnées
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FloatingInput
                      label="Prénom"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={errors.firstName}
                      icon={<User className="w-5 h-5" />}
                      required
                    />
                    <FloatingInput
                      label="Nom"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={errors.lastName}
                      icon={<User className="w-5 h-5" />}
                      required
                    />
                    <FloatingInput
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      icon={<Mail className="w-5 h-5" />}
                      required
                    />
                    <FloatingInput
                      label="Téléphone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      icon={<Phone className="w-5 h-5" />}
                    />
                    <FloatingInput
                      label="Entreprise (optionnel)"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      icon={<Building2 className="w-5 h-5" />}
                      className="md:col-span-2"
                    />
                  </div>
                </div>

                {/* Project Info */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-fuchsia-400" />
                    Votre projet
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FloatingInput
                      label="Nom du projet / entreprise"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      error={errors.projectName}
                      icon={<Sparkles className="w-5 h-5" />}
                      required
                    />
                    <div className="relative">
                      <select
                        name="sector"
                        value={formData.sector}
                        onChange={handleChange}
                        className="w-full h-14 px-4 pt-4 rounded-xl bg-white/5 border border-white/20 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-gray-900">Choisir un secteur...</option>
                        <option value="commerce" className="bg-gray-900">Commerce / Retail</option>
                        <option value="restaurant" className="bg-gray-900">Restaurant / Food</option>
                        <option value="artisan" className="bg-gray-900">Artisan / BTP</option>
                        <option value="sante" className="bg-gray-900">Santé / Bien-être</option>
                        <option value="beaute" className="bg-gray-900">Beauté / Esthétique</option>
                        <option value="avocat" className="bg-gray-900">Avocat / Juridique</option>
                        <option value="immobilier" className="bg-gray-900">Immobilier</option>
                        <option value="tech" className="bg-gray-900">Tech / Startup</option>
                        <option value="autre" className="bg-gray-900">Autre</option>
                      </select>
                      <label className="absolute left-4 top-2 text-xs text-white/50">
                        Secteur d'activité
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Récapitulatif</h3>
                    
                    {currentOffer && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">Offre</span>
                          <span className="text-white font-medium">{currentOffer.name}</span>
                        </div>
                        
                        {formData.projectName && (
                          <div className="flex justify-between items-center">
                            <span className="text-white/60">Projet</span>
                            <span className="text-white font-medium">{formData.projectName}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <Clock className="w-4 h-4" />
                          <span>Livraison estimée : ~{currentOffer.estimated_hours || 2}h</span>
                        </div>
                        
                        <div className="border-t border-white/10 pt-4 mt-4">
                          <div className="flex justify-between items-baseline">
                            <span className="text-white font-medium">Total TTC</span>
                            <span className="text-3xl font-bold text-white">{currentOffer.price_ttc}€</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
                    >
                      Continuer vers le paiement
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    {/* Trust Badges */}
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <span>Paiement 100% sécurisé</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <Star className="w-5 h-5 text-amber-400" />
                        <span>Satisfait ou refait</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <Zap className="w-5 h-5 text-violet-400" />
                        <span>Livraison express en 2h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </>
  );
}

// ============================================
// FLOATING INPUT COMPONENT
// ============================================

interface FloatingInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
  className?: string;
}

function FloatingInput({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  icon,
  required,
  className 
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  
  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {icon && (
          <div className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
            focused ? "text-violet-400" : "text-white/30"
          )}>
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className={cn(
            "w-full h-14 rounded-xl bg-white/5 border text-white outline-none transition-all",
            icon ? "pl-12 pr-4 pt-4" : "px-4 pt-4",
            error
              ? "border-red-500/50 focus:border-red-500"
              : "border-white/20 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          )}
        />
        <label
          className={cn(
            "absolute transition-all pointer-events-none",
            icon ? "left-12" : "left-4",
            (focused || hasValue)
              ? "top-2 text-xs"
              : "top-1/2 -translate-y-1/2 text-sm",
            error ? "text-red-400" : focused ? "text-violet-400" : "text-white/50"
          )}
        >
          {label}{required && ' *'}
        </label>
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
