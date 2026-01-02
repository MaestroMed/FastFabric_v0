import { useEffect, useState } from 'react';
import type { Route } from "./+types/tags";
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/Card';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { localStore } from '~/lib/store';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import { cn } from '~/lib/utils';

const categories = [
  { value: 'style', label: 'Style' },
  { value: 'sector', label: 'Secteur' },
  { value: 'feature', label: 'Fonctionnalité' },
];

const defaultColors = [
  '#0071e3', '#5856d6', '#e91e63', '#ff9500', '#34c759',
  '#14b8a6', '#6366f1', '#ec4899', '#1d1d1f', '#c9a227',
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tags — Admin — FastFabric" },
  ];
}

export default function AdminTags() {
  const [tags, setTags] = useState<any[]>([]);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [newTag, setNewTag] = useState({
    name: '',
    category: 'style',
    color: '#0071e3',
  });

  useEffect(() => {
    setTags(localStore.getTags());
  }, []);

  const handleSaveTag = (tag: any) => {
    localStore.saveTag(tag);
    setTags(localStore.getTags());
    setEditingTag(null);
  };

  const handleAddTag = () => {
    if (newTag.name.trim()) {
      localStore.saveTag({
        id: Date.now().toString(),
        ...newTag,
      } as any);
      setTags(localStore.getTags());
      setNewTag({ name: '', category: 'style', color: '#0071e3' });
    }
  };

  const handleDeleteTag = (id: string) => {
    if (confirm('Supprimer ce tag ?')) {
      localStore.deleteTag(id);
      setTags(localStore.getTags());
    }
  };

  const groupedTags = categories.map(cat => ({
    ...cat,
    tags: tags.filter(t => t.category === cat.value),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
        <p className="text-gray-600">Gérez les tags de style et secteur</p>
      </div>

      {/* Add New Tag */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un tag</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Input
              placeholder="Nom du tag"
              value={newTag.name}
              onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 min-w-[200px]"
            />
            
            <select
              value={newTag.category}
              onChange={(e) => setNewTag(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newTag.color}
                onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                className="w-10 h-10 rounded-lg cursor-pointer border-0"
              />
              <div className="flex gap-1">
                {defaultColors.slice(0, 5).map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewTag(prev => ({ ...prev, color }))}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                      newTag.color === color ? "border-gray-900" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <Button onClick={handleAddTag}>
              <Plus className="w-4 h-4" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tags List by Category */}
      {groupedTags.map(group => (
        <Card key={group.value}>
          <CardHeader>
            <CardTitle>{group.label}</CardTitle>
          </CardHeader>
          <CardContent>
            {group.tags.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun tag dans cette catégorie</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {group.tags.map(tag => (
                  <div key={tag.id} className="relative group">
                    {editingTag?.id === tag.id ? (
                      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-xl">
                        <Input
                          value={editingTag.name}
                          onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                          className="w-32 text-sm"
                        />
                        <input
                          type="color"
                          value={editingTag.color}
                          onChange={(e) => setEditingTag({ ...editingTag, color: e.target.value })}
                          className="w-8 h-8 rounded cursor-pointer border-0"
                        />
                        <button
                          onClick={() => handleSaveTag(editingTag)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingTag(null)}
                          className="p-1 text-gray-400 hover:bg-gray-200 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingTag(tag)}
                            className="p-0.5 hover:bg-white/20 rounded"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            className="p-0.5 hover:bg-white/20 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}



