import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import type { Route } from "./+types/index";
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { FormProgress } from '~/components/order/FormProgress';
import { OfferCard } from '~/components/order/OfferCard';
import { Input, Textarea, Select } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { localStore } from '~/lib/store';
import { ArrowRight } from 'lucide-react';

const steps = [
  { id: 1, name: 'Informations', description: 'Vos coordonnées' },
  { id: 2, name: 'Projet', description: 'Design & pages' },
  { id: 3, name: 'Contenu', description: 'Logo & textes' },
  { id: 4, name: 'Finalisation', description: 'Validation' },
];

const objectiveOptions = [
  { value: 'leads', label: 'Générer des leads / demandes de contact' },
  { value: 'showcase', label: 'Présenter mon activité' },
  { value: 'portfolio', label: 'Montrer mes réalisations' },
  { value: 'booking', label: 'Prendre des rendez-vous' },
  { value: 'sell', label: 'Vendre des produits/services' },
  { value: 'other', label: 'Autre' },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Commander — FastFabric" },
    { name: "description", content: "Commandez votre site web sur mesure en quelques minutes." },
  ];
}

export async function clientLoader() {
  const offers = localStore.getOffers();
  return { offers };
}

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
    // Load saved data from sessionStorage
    const saved = sessionStorage.getItem('ff_order_step1');
    if (saved) {
      const data = JSON.parse(saved);
      setFormData(data.formData || formData);
      setSelectedOffer(data.selectedOffer || selectedOffer);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    
    // Save to sessionStorage
    sessionStorage.setItem('ff_order_step1', JSON.stringify({
      formData,
      selectedOffer,
    }));
    
    // Navigate to next step
    navigate('/commander/projet');
  };

  const selectedOfferData = offers.find(o => o.id === selectedOffer);

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <FormProgress steps={steps} currentStep={1} />
          
          <form onSubmit={handleSubmit}>
            {/* Customer Info */}
            <Card className="mb-8">
              <h2 className="text-xl font-bold mb-6">Vos informations</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Prénom"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  required
                  placeholder="Jean"
                />
                <Input
                  label="Nom"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  required
                  placeholder="Dupont"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                  placeholder="jean@exemple.fr"
                />
                <Input
                  label="Téléphone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="06 12 34 56 78"
                />
              </div>
              
              <Input
                label="Entreprise"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Nom de votre entreprise (optionnel)"
                hint="Si applicable"
              />
            </Card>

            {/* Offer Selection */}
            <Card className="mb-8">
              <h2 className="text-xl font-bold mb-6">Choisissez votre offre</h2>
              
              {errors.offer && (
                <p className="text-red-500 text-sm mb-4">{errors.offer}</p>
              )}
              
              <div className="grid md:grid-cols-3 gap-4">
                {offers.map(offer => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    isSelected={selectedOffer === offer.id}
                    onSelect={setSelectedOffer}
                  />
                ))}
              </div>
            </Card>

            {/* Project Info */}
            <Card className="mb-8">
              <h2 className="text-xl font-bold mb-6">Votre projet</h2>
              
              <div className="space-y-4">
                <Input
                  label="Nom du projet / entreprise"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  error={errors.projectName}
                  required
                  placeholder="Ex: Studio Archibald"
                />
                
                <Textarea
                  label="Décrivez votre activité"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  error={errors.projectDescription}
                  required
                  placeholder="Ex: Cabinet d'architecte spécialisé dans la rénovation de maisons anciennes en région parisienne..."
                  hint="Plus c'est détaillé, plus le résultat sera précis"
                />
                
                <Select
                  label="Objectif principal du site"
                  name="objective"
                  value={formData.objective}
                  onChange={handleInputChange}
                  error={errors.objective}
                  required
                  options={objectiveOptions}
                />
              </div>
            </Card>

            {/* Summary & Next */}
            <div className="flex items-center justify-between">
              <div>
                {selectedOfferData && selectedOfferData.price_ttc > 0 && (
                  <p className="text-gray-600">
                    Offre sélectionnée: <strong>{selectedOfferData.name}</strong> — 
                    <span className="text-lg font-bold text-[var(--accent)] ml-2">
                      {selectedOfferData.price_ttc}€ TTC
                    </span>
                  </p>
                )}
              </div>
              
              <Button type="submit" size="lg" className="group">
                Continuer
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </>
  );
}

