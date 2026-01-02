import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from "./+types/projet";
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { FormProgress } from '~/components/order/FormProgress';
import { PageSelector } from '~/components/order/PageSelector';
import { TagSelector } from '~/components/order/TagSelector';
import { ColorPicker } from '~/components/order/ColorPicker';
import { ProjectFilter } from '~/components/order/ProjectFilter';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { localStore } from '~/lib/store';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const steps = [
  { id: 1, name: 'Informations', description: 'Vos coordonnées' },
  { id: 2, name: 'Projet', description: 'Design & pages' },
  { id: 3, name: 'Contenu', description: 'Logo & textes' },
  { id: 4, name: 'Finalisation', description: 'Validation' },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projet — Commander — FastFabric" },
  ];
}

export async function clientLoader() {
  const offers = localStore.getOffers();
  const tags = localStore.getTags();
  const projects = localStore.getProjects();
  return { offers, tags, projects };
}

export default function CommanderStep2({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { offers, tags, projects } = loaderData;
  
  // Load step 1 data
  const [step1Data, setStep1Data] = useState<any>(null);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [primaryColor, setPrimaryColor] = useState('#0071e3');
  const [secondaryColor, setSecondaryColor] = useState('#5856d6');

  useEffect(() => {
    const saved = sessionStorage.getItem('ff_order_step1');
    if (!saved) {
      navigate('/commander');
      return;
    }
    setStep1Data(JSON.parse(saved));
    
    // Load step 2 if returning
    const step2Saved = sessionStorage.getItem('ff_order_step2');
    if (step2Saved) {
      const data = JSON.parse(step2Saved);
      setSelectedPages(data.selectedPages || []);
      setSelectedTags(data.selectedTags || []);
      setPrimaryColor(data.primaryColor || '#0071e3');
      setSecondaryColor(data.secondaryColor || '#5856d6');
    }
  }, [navigate]);

  const handleColorChange = useCallback((primary: string, secondary: string) => {
    setPrimaryColor(primary);
    setSecondaryColor(secondary);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to sessionStorage
    sessionStorage.setItem('ff_order_step2', JSON.stringify({
      selectedPages,
      selectedTags,
      primaryColor,
      secondaryColor,
    }));
    
    navigate('/commander/contenu');
  };

  if (!step1Data) return null;

  const selectedOffer = offers.find((o: any) => o.id === step1Data.selectedOffer);
  const defaultPages = selectedOffer?.default_pages?.map((id: string) => ({ id, name: getPageName(id), required: true })) || [];
  const optionalPages = selectedOffer?.optional_pages?.map((id: string) => ({ id, name: getPageName(id) })) || [];
  
  // Determine max pages based on offer
  const maxPages = selectedOffer?.name === 'One Page' ? 2 : selectedOffer?.name === 'Site Vitrine' ? 7 : undefined;

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <FormProgress steps={steps} currentStep={2} />
          
          <form onSubmit={handleSubmit}>
            {/* Page Selection */}
            <Card className="mb-8">
              <h2 className="text-xl font-bold mb-6">Pages du site</h2>
              <p className="text-gray-600 mb-6">
                Sélectionnez les pages que vous souhaitez pour votre site
              </p>
              
              <PageSelector
                defaultPages={defaultPages}
                optionalPages={optionalPages}
                selectedPages={selectedPages}
                onChange={setSelectedPages}
                maxPages={maxPages}
                offerName={selectedOffer?.name}
              />
            </Card>

            {/* Style & Sector Tags */}
            <Card className="mb-8">
              <h2 className="text-xl font-bold mb-6">Style & Inspiration</h2>
              <p className="text-gray-600 mb-6">
                Ces choix nous aident à créer un design qui vous correspond
              </p>
              
              <TagSelector
                tags={tags}
                selectedTags={selectedTags}
                onChange={setSelectedTags}
                maxTags={5}
              />
            </Card>

            {/* Color Picker */}
            <Card className="mb-8">
              <h2 className="text-xl font-bold mb-6">Couleurs</h2>
              <p className="text-gray-600 mb-6">
                Choisissez la palette de couleurs pour votre site
              </p>
              
              <ColorPicker
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                onChange={handleColorChange}
              />
            </Card>

            {/* Similar Projects */}
            {selectedTags.length > 0 && (
              <Card className="mb-8">
                <h2 className="text-xl font-bold mb-6">Réalisations similaires</h2>
                <p className="text-gray-600 mb-6">
                  Projets correspondant à vos critères
                </p>
                
                <ProjectFilter
                  projects={projects}
                  tags={tags}
                  selectedTagIds={selectedTags}
                />
              </Card>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => navigate('/commander')}
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </Button>
              
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

function getPageName(id: string): string {
  const names: Record<string, string> = {
    home: 'Accueil',
    legal: 'Mentions légales',
    about: 'À propos',
    services: 'Services',
    portfolio: 'Portfolio',
    blog: 'Blog',
    contact: 'Contact',
    faq: 'FAQ',
    pricing: 'Tarifs',
    team: 'Équipe',
    testimonials: 'Témoignages',
    cgv: 'CGV',
    cgu: 'CGU',
    privacy: 'Confidentialité',
  };
  return names[id] || id;
}

