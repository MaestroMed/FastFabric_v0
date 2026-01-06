import { useState, useEffect, useRef } from 'react';
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
  MessageSquare,
  Target,
  Crown,
  Rocket,
  Diamond
} from 'lucide-react';

// ============================================
// META & LOADER
// ============================================

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Commander votre site — FastFabric" },
    { name: "description", content: "Commandez votre site web sur mesure en quelques minutes. Livraison en 2h." },
  ];
}

export async function clientLoader() {
  const offers = localStore.getOffers();
  return { offers };
}

// ============================================
// ANIMATED PROGRESS BAR COMPONENT
// ============================================

const steps = [
  { id: 1, name: 'Informations', icon: User },
  { id: 2, name: 'Projet', icon: Briefcase },
  { id: 3, name: 'Contenu', icon: MessageSquare },
  { id: 4, name: 'Paiement', icon: Shield },
];

function PremiumProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="relative mb-12">
      {/* Background track */}
      <div className="absolute top-6 left-0 right-0 h-1 bg-white/10 rounded-full" />
      
      {/* Animated progress track */}
      <div 
        className="absolute top-6 left-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />
      
      {/* Glowing effect on progress */}
      <div 
        className="absolute top-6 left-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full blur-sm transition-all duration-700 ease-out"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />
      
      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              {/* Step circle */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative",
                  isCompleted && "bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/50",
                  isCurrent && "bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/50 ring-4 ring-violet-500/30 animate-pulse",
                  !isCompleted && !isCurrent && "bg-white/10 border border-white/20"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Icon className={cn(
                    "w-5 h-5 transition-colors",
                    isCurrent ? "text-white" : "text-white/40"
                  )} />
                )}
                
                {/* Ripple effect for current step */}
                {isCurrent && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-violet-500/50 animate-ping" />
                    <span className="absolute inset-0 rounded-full bg-violet-500/30 animate-pulse" />
                  </>
                )}
              </div>
              
              {/* Step label */}
              <span className={cn(
                "mt-3 text-sm font-medium transition-colors",
                isCurrent ? "text-white" : isCompleted ? "text-violet-300" : "text-white/40"
              )}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
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
  required?: boolean;
  icon: React.ElementType;
  placeholder?: string;
}

function FloatingInput({ label, name, type = 'text', value, onChange, error, required, icon: Icon, placeholder }: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  
  return (
    <div className="relative group">
      {/* Glow effect on focus */}
      <div className={cn(
        "absolute -inset-0.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 blur transition-opacity duration-300",
        isFocused && "opacity-75"
      )} />
      
      <div className={cn(
        "relative flex items-center bg-white/5 border rounded-xl transition-all duration-300",
        error 
          ? "border-red-500/50" 
          : isFocused 
            ? "border-violet-500/50 bg-white/10" 
            : "border-white/10 hover:border-white/20"
      )}>
        {/* Icon */}
        <div className={cn(
          "pl-4 transition-colors duration-300",
          isFocused ? "text-violet-400" : "text-white/40"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        
        {/* Input */}
        <div className="relative flex-1 px-3 py-4">
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent text-white outline-none placeholder-transparent peer"
            placeholder={placeholder || label}
            required={required}
          />
          
          {/* Floating label */}
          <label className={cn(
            "absolute left-0 transition-all duration-300 pointer-events-none",
            hasValue || isFocused
              ? "-top-2 text-xs text-violet-400"
              : "top-1/2 -translate-y-1/2 text-white/50"
          )}>
            {label} {required && <span className="text-pink-400">*</span>}
          </label>
        </div>
        
        {/* Validation indicator */}
        {hasValue && !error && (
          <div className="pr-4">
            <Check className="w-5 h-5 text-emerald-400" />
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
}

// ============================================
// PREMIUM OFFER CARD COMPONENT
// ============================================

interface Offer {
  id: string;
  name: string;
  description: string;
  price_ttc: number;
  features: string[];
  is_popular: boolean;
  estimated_hours: number;
}

function PremiumOfferCard({ 
  offer, 
  isSelected, 
  onSelect 
}: { 
  offer: Offer; 
  isSelected: boolean; 
  onSelect: (id: string) => void;
}) {
  const icons = {
    'one-page': Rocket,
    'site-vitrine': Crown,
    'sur-mesure': Diamond,
  };
  
  const Icon = icons[offer.id as keyof typeof icons] || Star;
  
  const gradients = {
    'one-page': 'from-blue-500 to-cyan-500',
    'site-vitrine': 'from-violet-500 to-fuchsia-500',
    'sur-mesure': 'from-amber-500 to-orange-500',
  };
  
  const gradient = gradients[offer.id as keyof typeof gradients] || 'from-violet-500 to-fuchsia-500';
  
  return (
    <button
      type="button"
      onClick={() => onSelect(offer.id)}
      className={cn(
        "relative w-full text-left rounded-2xl transition-all duration-500 group overflow-hidden",
        isSelected 
          ? "scale-[1.02]" 
          : "hover:scale-[1.01]"
      )}
    >
      {/* Background layers */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 rounded-2xl",
        gradient,
        isSelected && "opacity-100"
      )} />
      
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br blur-xl opacity-0 transition-opacity duration-500",
        gradient,
        isSelected && "opacity-50"
      )} />
      
      <div className={cn(
        "relative p-6 rounded-2xl border-2 transition-all duration-300 bg-white/5 backdrop-blur-sm",
        isSelected 
          ? "border-white/30 bg-white/10" 
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
      )}>
        {/* Popular badge */}
        {offer.is_popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-sm" />
              <span className="relative px-4 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                POPULAIRE
              </span>
            </div>
          </div>
        )}
        
        {/* Selected indicator */}
        <div className={cn(
          "absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300",
          isSelected 
            ? "bg-white text-violet-600 scale-100" 
            : "bg-white/10 text-white/30 scale-90"
        )}>
          <Check className="w-4 h-4" />
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          {/* Icon & Name */}
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
              isSelected 
                ? "bg-white/20" 
                : "bg-gradient-to-br " + gradient
            )}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{offer.name}</h3>
              <p className="text-sm text-white/60">{offer.description}</p>
            </div>
          </div>
          
          {/* Price */}
          <div className="flex items-baseline gap-1">
            {offer.price_ttc > 0 ? (
              <>
                <span className="text-4xl font-black text-white">{offer.price_ttc}€</span>
                <span className="text-white/50 text-sm">TTC</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-white">Sur devis</span>
            )}
          </div>
          
          {/* Delivery time */}
          {offer.estimated_hours > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">
                Livré en ~{offer.estimated_hours}h
              </span>
            </div>
          )}
          
          {/* Features */}
          <ul className="space-y-2.5 pt-2">
            {offer.features.slice(0, 6).map((feature, index) => (
              <li 
                key={index} 
                className="flex items-center gap-3 text-sm text-white/80"
              >
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                  isSelected ? "bg-white/20" : "bg-white/10"
                )}>
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  );
}

// ============================================
// OBJECTIVE SELECT COMPONENT
// ============================================

const objectives = [
  { value: 'leads', label: 'Générer des leads / contacts', icon: Target },
  { value: 'showcase', label: 'Présenter mon activité', icon: Building2 },
  { value: 'portfolio', label: 'Montrer mes réalisations', icon: Star },
  { value: 'booking', label: 'Prendre des rendez-vous', icon: MessageSquare },
  { value: 'sell', label: 'Vendre des produits/services', icon: Rocket },
];

function ObjectiveSelect({ value, onChange, error }: { value: string; onChange: (val: string) => void; error?: string }) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-white/70">
        Objectif principal du site <span className="text-pink-400">*</span>
      </label>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {objectives.map((obj) => {
          const isSelected = value === obj.value;
          const Icon = obj.icon;
          
          return (
            <button
              key={obj.value}
              type="button"
              onClick={() => onChange(obj.value)}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-300 text-left group",
                isSelected 
                  ? "border-violet-500/50 bg-violet-500/10" 
                  : "border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/[0.07]"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                  isSelected ? "bg-violet-500/20 text-violet-400" : "bg-white/10 text-white/40 group-hover:text-white/60"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  isSelected ? "text-white" : "text-white/70"
                )}>
                  {obj.label}
                </span>
              </div>
              
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CommanderStep1({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { offers } = loaderData;
  
  const preselectedOffer = searchParams.get('offre');
  
  const [selectedOffer, setSelectedOffer] = useState<string>(preselectedOffer || '');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    projectName: '',
    projectDescription: '',
    objective: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = sessionStorage.getItem('ff_order_step1');
    if (saved) {
      const data = JSON.parse(saved);
      setFormData(data.formData || formData);
      setSelectedOffer(data.selectedOffer || selectedOffer);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
    if (!formData.email.trim()) newErrors.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!selectedOffer) newErrors.offer = 'Sélectionnez une offre';
    if (!formData.projectName.trim()) newErrors.projectName = 'Nom du projet requis';
    if (!formData.projectDescription.trim()) newErrors.projectDescription = 'Description requise';
    if (!formData.objective) newErrors.objective = 'Objectif requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    sessionStorage.setItem('ff_order_step1', JSON.stringify({
      formData,
      selectedOffer,
    }));
    
    navigate('/commander/projet');
  };

  const selectedOfferData = offers.find((o: Offer) => o.id === selectedOffer);

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-16 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orbs */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[150px]" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
          
          {/* Radial fade */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0f_70%)]" />
        </div>
        
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Création en quelques minutes
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Créez votre site web
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Remplissez ce formulaire et recevez votre site professionnel en quelques heures
            </p>
          </div>
          
          {/* Progress */}
          <PremiumProgress currentStep={1} />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Info Section */}
            <section className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-pink-500/20 rounded-3xl blur-xl" />
              <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Vos informations</h2>
                    <p className="text-sm text-white/50">Pour vous contacter</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <FloatingInput
                    label="Prénom"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                    required
                    icon={User}
                    placeholder="Jean"
                  />
                  <FloatingInput
                    label="Nom"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                    required
                    icon={User}
                    placeholder="Dupont"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <FloatingInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                    icon={Mail}
                    placeholder="jean@exemple.fr"
                  />
                  <FloatingInput
                    label="Téléphone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    icon={Phone}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                
                <FloatingInput
                  label="Entreprise (optionnel)"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  icon={Building2}
                  placeholder="Nom de votre entreprise"
                />
              </div>
            </section>

            {/* Offer Selection Section */}
            <section className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-fuchsia-500/20 rounded-3xl blur-xl" />
              <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Choisissez votre offre</h2>
                    <p className="text-sm text-white/50">Adaptée à vos besoins</p>
                  </div>
                </div>
                
                {errors.offer && (
                  <p className="text-red-400 text-sm mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    {errors.offer}
                  </p>
                )}
                
                <div className="grid md:grid-cols-3 gap-6">
                  {offers.map((offer: Offer) => (
                    <PremiumOfferCard
                      key={offer.id}
                      offer={offer}
                      isSelected={selectedOffer === offer.id}
                      onSelect={setSelectedOffer}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Project Info Section */}
            <section className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500/20 via-pink-500/20 to-orange-500/20 rounded-3xl blur-xl" />
              <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Votre projet</h2>
                    <p className="text-sm text-white/50">Décrivez votre activité</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <FloatingInput
                    label="Nom du projet / entreprise"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    error={errors.projectName}
                    required
                    icon={Briefcase}
                    placeholder="Ex: Studio Archibald"
                  />
                  
                  {/* Textarea with special styling */}
                  <div className="relative group">
                    <div className={cn(
                      "absolute -inset-0.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 blur transition-opacity duration-300",
                      formData.projectDescription && "opacity-50"
                    )} />
                    <div className="relative bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 focus-within:border-violet-500/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-white/40 mt-0.5" />
                        <div className="flex-1">
                          <label className="text-sm text-white/50 block mb-2">
                            Décrivez votre activité <span className="text-pink-400">*</span>
                          </label>
                          <textarea
                            name="projectDescription"
                            value={formData.projectDescription}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full bg-transparent text-white outline-none resize-none placeholder-white/30"
                            placeholder="Ex: Cabinet d'architecte spécialisé dans la rénovation de maisons anciennes en région parisienne. Nous souhaitons présenter nos réalisations et générer des demandes de devis..."
                          />
                        </div>
                      </div>
                      {errors.projectDescription && (
                        <p className="mt-2 text-sm text-red-400">{errors.projectDescription}</p>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-white/30">Plus c'est détaillé, plus le résultat sera précis</p>
                  </div>
                  
                  <ObjectiveSelect 
                    value={formData.objective}
                    onChange={(val) => {
                      setFormData(prev => ({ ...prev, objective: val }));
                      if (errors.objective) setErrors(prev => ({ ...prev, objective: '' }));
                    }}
                    error={errors.objective}
                  />
                </div>
              </div>
            </section>

            {/* Submit Section */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 rounded-2xl blur-xl" />
              <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Summary */}
                  <div className="text-center sm:text-left">
                    {selectedOfferData && selectedOfferData.price_ttc > 0 ? (
                      <div>
                        <p className="text-white/50 text-sm">Offre sélectionnée</p>
                        <p className="text-white font-semibold">
                          {selectedOfferData.name} — 
                          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 ml-2">
                            {selectedOfferData.price_ttc}€
                          </span>
                          <span className="text-white/50 text-sm ml-1">TTC</span>
                        </p>
                      </div>
                    ) : (
                      <p className="text-white/50">Sélectionnez une offre pour continuer</p>
                    )}
                  </div>
                  
                  {/* Submit button */}
                  <button
                    type="submit"
                    className="group relative px-8 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {/* Button gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    
                    {/* Content */}
                    <span className="relative flex items-center gap-2">
                      Continuer
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </form>
          
          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span>Livraison en 2-6h</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span>4.9/5 sur 127 avis</span>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
