import { useState, useEffect } from 'react';
import type { Route } from "./+types/faq";
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/Card';
import { Input, Textarea } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { localStore, type FaqItem } from '~/lib/store';
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical, Save, X } from 'lucide-react';
import { cn } from '~/lib/utils';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FAQ — Admin — FastFabric" },
  ];
}

export default function AdminFaq() {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ question: '', answer: '', sort_order: 0 });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setFaqItems(localStore.getFaq());
  }, []);

  const handleEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setEditForm({
      question: item.question,
      answer: item.answer,
      sort_order: item.sort_order,
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setEditForm({
      question: '',
      answer: '',
      sort_order: faqItems.length + 1,
    });
  };

  const handleSave = () => {
    if (!editForm.question.trim() || !editForm.answer.trim()) return;

    const item: FaqItem = {
      id: isCreating ? '' : editingId!,
      question: editForm.question,
      answer: editForm.answer,
      sort_order: editForm.sort_order,
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStore.saveFaqItem(item);
    setFaqItems(localStore.getFaq());
    setEditingId(null);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette question ?')) {
      localStore.deleteFaqItem(id);
      setFaqItems(localStore.getFaq());
    }
  };

  const handleToggleVisibility = (item: FaqItem) => {
    localStore.saveFaqItem({ ...item, is_visible: !item.is_visible });
    setFaqItems(localStore.getFaq());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ</h1>
          <p className="text-gray-600">Gérez les questions fréquentes affichées sur le site</p>
        </div>
        <Button onClick={handleCreate} disabled={isCreating}>
          <Plus className="w-4 h-4" />
          Ajouter une question
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card className="border-[var(--accent)] bg-blue-50/30">
          <CardHeader>
            <CardTitle>Nouvelle question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Question"
              value={editForm.question}
              onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
              placeholder="Ex: Combien de temps pour recevoir mon site ?"
            />
            <Textarea
              label="Réponse"
              value={editForm.answer}
              onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
              placeholder="Rédigez une réponse claire et concise..."
              rows={4}
            />
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

      {/* FAQ List */}
      <div className="space-y-4">
        {faqItems.map((item) => (
          <Card 
            key={item.id} 
            className={cn(
              "transition-all",
              !item.is_visible && "opacity-60",
              editingId === item.id && "border-[var(--accent)] bg-blue-50/30"
            )}
          >
            {editingId === item.id ? (
              <CardContent className="space-y-4 pt-6">
                <Input
                  label="Question"
                  value={editForm.question}
                  onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                />
                <Textarea
                  label="Réponse"
                  value={editForm.answer}
                  onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                  rows={4}
                />
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
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-gray-400 cursor-grab">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{item.question}</h3>
                      {!item.is_visible && (
                        <Badge className="bg-gray-100 text-gray-600">Masqué</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.answer}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
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

        {faqItems.length === 0 && !isCreating && (
          <Card className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucune question FAQ pour le moment</p>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4" />
              Ajouter la première question
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}


