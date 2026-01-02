import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from "./+types/contenu";
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { FormProgress } from '~/components/order/FormProgress';
import { LogoGenerator } from '~/components/order/LogoGenerator';
import { Textarea } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { localStore } from '~/lib/store';
import { ArrowLeft, ArrowRight, Upload, X } from 'lucide-react';

const steps = [
  { id: 1, name: 'Informations', description: 'Vos coordonnées' },
  { id: 2, name: 'Projet', description: 'Design & pages' },
  { id: 3, name: 'Contenu', description: 'Logo & textes' },
  { id: 4, name: 'Finalisation', description: 'Validation' },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contenu — Commander — FastFabric" },
  ];
}

export async function clientLoader() {
  const tags = localStore.getTags();
  const offers = localStore.getOffers();
  return { tags, offers };
}

export default function CommanderStep3({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { tags, offers } = loaderData;
  
  const [step1Data, setStep1Data] = useState<any>(null);
  const [step2Data, setStep2Data] = useState<any>(null);
  
  const [content, setContent] = useState('');
  const [inspiration, setInspiration] = useState('');
  const [notes, setNotes] = useState('');
  const [logoOption, setLogoOption] = useState<'text' | 'generated' | ''>('');
  const [logoConcept, setLogoConcept] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  useEffect(() => {
    const saved1 = sessionStorage.getItem('ff_order_step1');
    const saved2 = sessionStorage.getItem('ff_order_step2');
    
    if (!saved1 || !saved2) {
      navigate('/commander');
      return;
    }
    
    setStep1Data(JSON.parse(saved1));
    setStep2Data(JSON.parse(saved2));
    
    // Load step 3 if returning
    const saved3 = sessionStorage.getItem('ff_order_step3');
    if (saved3) {
      const data = JSON.parse(saved3);
      setContent(data.content || '');
      setInspiration(data.inspiration || '');
      setNotes(data.notes || '');
      setLogoOption(data.logoOption || '');
      setLogoConcept(data.logoConcept || '');
    }
  }, [navigate]);

  const handleLogoSelect = (url: string | null, concept: string) => {
    setLogoOption(concept ? 'generated' : 'text');
    setLogoConcept(concept);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    sessionStorage.setItem('ff_order_step3', JSON.stringify({
      content,
      inspiration,
      notes,
      logoOption,
      logoConcept,
      uploadedFiles,
    }));
    
    navigate('/commander/paiement');
  };

  if (!step1Data || !step2Data) return null;

  // Get selected style tag names
  const selectedStyleTags = step2Data.selectedTags
    .map((id: string) => tags.find((t: any) => t.id === id)?.name)
    .filter(Boolean)
    .join(', ');

  // Check if this is a quote-based order
  const selectedOffer = offers.find((o: any) => o.id === step1Data.selectedOffer);
  const isQuoteMode = selectedOffer?.price_ttc === 0;

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <FormProgress steps={steps} currentStep={3} />
          
          <form onSubmit={handleSubmit}>
            {/* Logo */}
            <Card className="mb-8">
              <h2 className="text-xl font-bold mb-6">Votre logo</h2>
              
              <LogoGenerator
                businessName={step1Data.formData.projectName}
                description={step1Data.formData.projectDescription}
                style={selectedStyleTags}
                colors={[step2Data.primaryColor, step2Data.secondaryColor]}
                onSelect={handleLogoSelect}
              />
            </Card>

            {/* Content */}
            <Card className="mb-8">
              <h2 className="text-xl font-bold mb-6">Contenus textuels</h2>
              
              <Textarea
                label="Textes pour votre site"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Collez ici les textes que vous souhaitez sur votre site : présentation, services, à propos, etc. Plus c'est détaillé, mieux c'est !"
                hint="Vous pouvez aussi nous laisser rédiger les textes, décrivez juste ce que vous voulez communiquer"
                className="min-h-[200px]"
              />
            </Card>

            {/* Images Upload */}
            <Card className="mb-8">
              <h2 className="text-xl font-bold mb-6">Images</h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[var(--accent)] transition-colors">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <Upload className="w-10 h-10 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-1">
                      Glissez vos images ici ou <span className="text-[var(--accent)]">parcourir</span>
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, WebP — Max 10MB par fichier</p>
                  </label>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm"
                      >
                        <span className="truncate max-w-[200px]">{file}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Inspiration */}
            <Card className="mb-8">
              <h2 className="text-xl font-bold mb-6">Sites d'inspiration</h2>
              
              <Textarea
                label="URLs de sites qui vous plaisent (optionnel)"
                name="inspiration"
                value={inspiration}
                onChange={(e) => setInspiration(e.target.value)}
                placeholder="https://exemple1.com&#10;https://exemple2.com"
                hint="Collez les liens de sites dont vous aimez le design ou la structure"
              />
            </Card>

            {/* Notes */}
            <Card className="mb-8">
              <h2 className="text-xl font-bold mb-6">Notes additionnelles</h2>
              
              <Textarea
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Toute autre information utile pour votre projet..."
              />
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => navigate('/commander/projet')}
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </Button>
              
              <Button type="submit" size="lg" className="group">
                {isQuoteMode ? 'Continuer vers la demande' : 'Continuer vers le paiement'}
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

