import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import type { Route } from "./+types/edit";
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/Card';
import { Input, Textarea } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { localStore } from '~/lib/store';
import { ArrowLeft, Check, Upload } from 'lucide-react';
import { cn } from '~/lib/utils';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Modifier projet — Admin — FastFabric" },
  ];
}

export default function AdminProjetEdit() {
  const params = useParams();
  const navigate = useNavigate();
  const isNew = params.id === 'new';

  const [tags, setTags] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    colors: ['#0071e3', '#5856d6'],
    delivery_time: '2h',
    live_url: '',
    preview_url: '',
    is_featured: false,
    tags: [] as string[],
  });

  useEffect(() => {
    setTags(localStore.getTags());
    
    if (!isNew) {
      const projects = localStore.getProjects();
      const project = projects.find((p: any) => p.id === params.id);
      if (project) {
        setFormData({
          name: project.name,
          category: project.category,
          description: project.description,
          colors: project.colors || ['#0071e3', '#5856d6'],
          delivery_time: project.delivery_time,
          live_url: project.live_url || '',
          preview_url: project.preview_url || '',
          is_featured: project.is_featured,
          tags: project.tags || [],
        });
      }
    }
  }, [params.id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((c, i) => i === index ? value : c),
    }));
  };

  const toggleTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const project = {
      id: isNew ? Date.now().toString() : params.id,
      ...formData,
      created_at: new Date().toISOString(),
    };
    
    localStore.saveProject(project as any);
    navigate('/admin/projets');
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/projets">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Nouveau projet' : 'Modifier le projet'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nom du projet"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ex: Studio Archibald"
              />
              
              <Input
                label="Catégorie"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="Ex: Architecture"
              />
            </div>
            
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Description du projet"
            />
            
            <Input
              label="Temps de livraison"
              name="delivery_time"
              value={formData.delivery_time}
              onChange={handleChange}
              placeholder="Ex: 2h30"
            />
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span className="text-sm font-medium text-gray-700">Mettre en avant (vedette)</span>
            </label>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Couleurs du projet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Couleur principale</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.colors[0]}
                    onChange={(e) => handleColorChange(0, e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-0"
                  />
                  <Input
                    value={formData.colors[0]}
                    onChange={(e) => handleColorChange(0, e.target.value)}
                    className="flex-1 font-mono"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Couleur secondaire</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.colors[1]}
                    onChange={(e) => handleColorChange(1, e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-0"
                  />
                  <Input
                    value={formData.colors[1]}
                    onChange={(e) => handleColorChange(1, e.target.value)}
                    className="flex-1 font-mono"
                  />
                </div>
              </div>
            </div>
            
            {/* Preview */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-2">Aperçu</p>
              <div 
                className="h-24 rounded-xl flex items-center justify-center text-white font-semibold"
                style={{ 
                  background: `linear-gradient(135deg, ${formData.colors[0]} 0%, ${formData.colors[1]} 100%)` 
                }}
              >
                {formData.name || 'Nom du projet'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Style tags */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Style</p>
                <div className="flex flex-wrap gap-2">
                  {tags.filter(t => t.category === 'style').map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                        formData.tags.includes(tag.id)
                          ? "text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                      style={{
                        backgroundColor: formData.tags.includes(tag.id) ? tag.color : undefined,
                      }}
                    >
                      {formData.tags.includes(tag.id) && <Check className="w-3 h-3 inline mr-1" />}
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sector tags */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Secteur</p>
                <div className="flex flex-wrap gap-2">
                  {tags.filter(t => t.category === 'sector').map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                        formData.tags.includes(tag.id)
                          ? "text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                      style={{
                        backgroundColor: formData.tags.includes(tag.id) ? tag.color : undefined,
                      }}
                    >
                      {formData.tags.includes(tag.id) && <Check className="w-3 h-3 inline mr-1" />}
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URLs */}
        <Card>
          <CardHeader>
            <CardTitle>Liens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="URL du site (optionnel)"
              name="live_url"
              type="url"
              value={formData.live_url}
              onChange={handleChange}
              placeholder="https://exemple.com"
            />
            
            <Input
              label="URL de preview (optionnel)"
              name="preview_url"
              type="url"
              value={formData.preview_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link to="/admin/projets">
            <Button type="button" variant="ghost">
              Annuler
            </Button>
          </Link>
          <Button type="submit">
            {isNew ? 'Créer le projet' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
}



