import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import type { Route } from "./+types/edit";
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/Card';
import { Input, Textarea } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { localStore } from '~/lib/store';
import { ArrowLeft, Plus, X, Check } from 'lucide-react';
import { cn } from '~/lib/utils';

const allPages = [
  { id: 'home', name: 'Accueil' },
  { id: 'legal', name: 'Mentions légales' },
  { id: 'about', name: 'À propos' },
  { id: 'services', name: 'Services' },
  { id: 'portfolio', name: 'Portfolio' },
  { id: 'blog', name: 'Blog' },
  { id: 'contact', name: 'Contact' },
  { id: 'faq', name: 'FAQ' },
  { id: 'pricing', name: 'Tarifs' },
  { id: 'team', name: 'Équipe' },
  { id: 'testimonials', name: 'Témoignages' },
  { id: 'cgv', name: 'CGV' },
  { id: 'cgu', name: 'CGU' },
  { id: 'privacy', name: 'Confidentialité' },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Modifier offre — Admin — FastFabric" },
  ];
}

export default function AdminOffreEdit() {
  const params = useParams();
  const navigate = useNavigate();
  const isNew = params.id === 'new';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_ttc: 0,
    estimated_hours: 2,
    is_popular: false,
    default_pages: ['home', 'legal'],
    optional_pages: [] as string[],
    features: [] as string[],
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (!isNew) {
      const offers = localStore.getOffers();
      const offer = offers.find((o: any) => o.id === params.id);
      if (offer) {
        setFormData({
          name: offer.name,
          description: offer.description,
          price_ttc: offer.price_ttc,
          estimated_hours: offer.estimated_hours,
          is_popular: offer.is_popular,
          default_pages: offer.default_pages || ['home', 'legal'],
          optional_pages: offer.optional_pages || [],
          features: offer.features || [],
        });
      }
    }
  }, [params.id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const togglePage = (pageId: string, type: 'default' | 'optional') => {
    setFormData(prev => {
      const list = type === 'default' ? 'default_pages' : 'optional_pages';
      const currentList = prev[list];
      
      if (currentList.includes(pageId)) {
        return { ...prev, [list]: currentList.filter(id => id !== pageId) };
      } else {
        return { ...prev, [list]: [...currentList, pageId] };
      }
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const offer = {
      id: isNew ? Date.now().toString() : params.id,
      ...formData,
      sort_order: isNew ? localStore.getOffers().length + 1 : undefined,
      created_at: new Date().toISOString(),
    };
    
    localStore.saveOffer(offer as any);
    navigate('/admin/offres');
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/offres">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Nouvelle offre' : 'Modifier l\'offre'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Nom de l'offre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ex: Site Vitrine"
            />
            
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Description courte de l'offre"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prix TTC (€)"
                name="price_ttc"
                type="number"
                value={formData.price_ttc}
                onChange={handleChange}
                hint="0 = sur devis"
              />
              
              <Input
                label="Délai estimé (heures)"
                name="estimated_hours"
                type="number"
                value={formData.estimated_hours}
                onChange={handleChange}
              />
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_popular}
                onChange={(e) => setFormData(prev => ({ ...prev, is_popular: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span className="text-sm font-medium text-gray-700">Marquer comme "Populaire"</span>
            </label>
          </CardContent>
        </Card>

        {/* Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Pages incluses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Pages par défaut (obligatoires)</p>
              <div className="flex flex-wrap gap-2">
                {allPages.map(page => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => togglePage(page.id, 'default')}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                      formData.default_pages.includes(page.id)
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {formData.default_pages.includes(page.id) && <Check className="w-3 h-3 inline mr-1" />}
                    {page.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Pages optionnelles</p>
              <div className="flex flex-wrap gap-2">
                {allPages.filter(p => !formData.default_pages.includes(p.id)).map(page => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => togglePage(page.id, 'optional')}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                      formData.optional_pages.includes(page.id)
                        ? "bg-[var(--accent)] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {formData.optional_pages.includes(page.id) && <Check className="w-3 h-3 inline mr-1" />}
                    {page.name}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Fonctionnalités incluses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Ex: Design sur mesure"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link to="/admin/offres">
            <Button type="button" variant="ghost">
              Annuler
            </Button>
          </Link>
          <Button type="submit">
            {isNew ? 'Créer l\'offre' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
}



