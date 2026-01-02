import { useState, useEffect } from 'react';
import type { Route } from "./+types/temoignages";
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/Card';
import { Input, Textarea } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { localStore, type Testimonial } from '~/lib/store';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Save, X, Quote } from 'lucide-react';
import { cn } from '~/lib/utils';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Témoignages — Admin — FastFabric" },
  ];
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    author_name: '',
    author_role: '',
    author_company: '',
    content: '',
    rating: 5,
    is_featured: false,
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setTestimonials(localStore.getTestimonials());
  }, []);

  const handleEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setEditForm({
      author_name: item.author_name,
      author_role: item.author_role || '',
      author_company: item.author_company || '',
      content: item.content,
      rating: item.rating,
      is_featured: item.is_featured,
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setEditForm({
      author_name: '',
      author_role: '',
      author_company: '',
      content: '',
      rating: 5,
      is_featured: false,
    });
  };

  const handleSave = () => {
    if (!editForm.author_name.trim() || !editForm.content.trim()) return;

    const item: Testimonial = {
      id: isCreating ? '' : editingId!,
      author_name: editForm.author_name,
      author_role: editForm.author_role || undefined,
      author_company: editForm.author_company || undefined,
      content: editForm.content,
      rating: editForm.rating,
      is_featured: editForm.is_featured,
      is_visible: true,
      created_at: new Date().toISOString(),
    };

    localStore.saveTestimonial(item);
    setTestimonials(localStore.getTestimonials());
    setEditingId(null);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce témoignage ?')) {
      localStore.deleteTestimonial(id);
      setTestimonials(localStore.getTestimonials());
    }
  };

  const handleToggleVisibility = (item: Testimonial) => {
    localStore.saveTestimonial({ ...item, is_visible: !item.is_visible });
    setTestimonials(localStore.getTestimonials());
  };

  const handleToggleFeatured = (item: Testimonial) => {
    localStore.saveTestimonial({ ...item, is_featured: !item.is_featured });
    setTestimonials(localStore.getTestimonials());
  };

  const renderStars = (rating: number, editable = false) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!editable}
          onClick={() => editable && setEditForm({ ...editForm, rating: star })}
          className={cn(
            "transition-colors",
            editable && "cursor-pointer hover:scale-110",
            star <= rating ? "text-yellow-400" : "text-gray-300"
          )}
        >
          <Star className="w-5 h-5 fill-current" />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Témoignages</h1>
          <p className="text-gray-600">Gérez les avis clients affichés sur le site</p>
        </div>
        <Button onClick={handleCreate} disabled={isCreating}>
          <Plus className="w-4 h-4" />
          Ajouter un témoignage
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card className="border-[var(--accent)] bg-blue-50/30">
          <CardHeader>
            <CardTitle>Nouveau témoignage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nom *"
                value={editForm.author_name}
                onChange={(e) => setEditForm({ ...editForm, author_name: e.target.value })}
                placeholder="Marie Dupont"
              />
              <Input
                label="Rôle"
                value={editForm.author_role}
                onChange={(e) => setEditForm({ ...editForm, author_role: e.target.value })}
                placeholder="CEO"
              />
            </div>
            <Input
              label="Entreprise"
              value={editForm.author_company}
              onChange={(e) => setEditForm({ ...editForm, author_company: e.target.value })}
              placeholder="Ma Super Boîte"
            />
            <Textarea
              label="Témoignage *"
              value={editForm.content}
              onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              placeholder="Un service exceptionnel..."
              rows={4}
            />
            <div className="flex items-center gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                {renderStars(editForm.rating, true)}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.is_featured}
                  onChange={(e) => setEditForm({ ...editForm, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span className="text-sm font-medium text-gray-700">Mettre en avant</span>
              </label>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4" />
                Enregistrer
              </Button>
              <Button variant="ghost" onClick={handleCancel}>
                <X className="w-4 h-4" />
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {testimonials.map((item) => (
          <Card 
            key={item.id} 
            className={cn(
              "transition-all",
              !item.is_visible && "opacity-60",
              editingId === item.id && "border-[var(--accent)] bg-blue-50/30 md:col-span-2"
            )}
          >
            {editingId === item.id ? (
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nom *"
                    value={editForm.author_name}
                    onChange={(e) => setEditForm({ ...editForm, author_name: e.target.value })}
                  />
                  <Input
                    label="Rôle"
                    value={editForm.author_role}
                    onChange={(e) => setEditForm({ ...editForm, author_role: e.target.value })}
                  />
                </div>
                <Input
                  label="Entreprise"
                  value={editForm.author_company}
                  onChange={(e) => setEditForm({ ...editForm, author_company: e.target.value })}
                />
                <Textarea
                  label="Témoignage *"
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  rows={4}
                />
                <div className="flex items-center gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                    {renderStars(editForm.rating, true)}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.is_featured}
                      onChange={(e) => setEditForm({ ...editForm, is_featured: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                    <span className="text-sm font-medium text-gray-700">Mettre en avant</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </Button>
                  <Button variant="ghost" onClick={handleCancel}>
                    <X className="w-4 h-4" />
                    Annuler
                  </Button>
                </div>
              </CardContent>
            ) : (
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                      {item.author_name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.author_name}</p>
                      <p className="text-sm text-gray-500">
                        {item.author_role}{item.author_role && item.author_company && ' • '}{item.author_company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.is_featured && (
                      <Badge className="bg-yellow-100 text-yellow-700">En avant</Badge>
                    )}
                    {!item.is_visible && (
                      <Badge className="bg-gray-100 text-gray-600">Masqué</Badge>
                    )}
                  </div>
                </div>

                <div className="relative mb-4">
                  <Quote className="absolute -left-1 -top-2 w-6 h-6 text-gray-200" />
                  <p className="text-gray-600 pl-6 italic">{item.content}</p>
                </div>

                <div className="flex items-center justify-between">
                  {renderStars(item.rating)}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        item.is_featured 
                          ? "text-yellow-500 hover:bg-yellow-50" 
                          : "text-gray-400 hover:bg-gray-100"
                      )}
                      title={item.is_featured ? "Retirer de la une" : "Mettre en avant"}
                    >
                      <Star className={cn("w-4 h-4", item.is_featured && "fill-current")} />
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(item)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        item.is_visible 
                          ? "text-green-600 hover:bg-green-50" 
                          : "text-gray-400 hover:bg-gray-100"
                      )}
                      title={item.is_visible ? "Masquer" : "Afficher"}
                    >
                      {item.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}

        {testimonials.length === 0 && !isCreating && (
          <Card className="md:col-span-2 text-center py-12">
            <p className="text-gray-500 mb-4">Aucun témoignage pour le moment</p>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4" />
              Ajouter le premier témoignage
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}


