/**
 * Admin Blog Management
 * Create, edit, publish articles with AI generation support
 */

import { useState } from 'react';
import type { Route } from "./+types/blog";
import { Link } from 'react-router';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sparkles,
  Calendar,
  Clock,
  Save,
  X,
  FileText,
  Tag,
  Search
} from 'lucide-react';

// Sample articles (would come from Supabase)
const initialArticles = [
  {
    id: '1',
    slug: 'comment-creer-site-vitrine-efficace',
    title: 'Comment créer un site vitrine efficace en 2026',
    excerpt: 'Découvrez les 5 clés pour créer un site vitrine qui convertit.',
    category: 'guide',
    tags: ['site vitrine', 'création site', 'webdesign'],
    is_published: true,
    published_at: '2025-12-15',
    reading_time: 5,
  },
  {
    id: '2',
    slug: 'site-vitrine-vs-landing-page-que-choisir',
    title: 'Site vitrine vs Landing page : que choisir ?',
    excerpt: 'Landing page ou site vitrine ? Découvrez les avantages de chaque solution.',
    category: 'comparatif',
    tags: ['landing page', 'site vitrine', 'comparatif'],
    is_published: true,
    published_at: '2025-12-10',
    reading_time: 4,
  },
  {
    id: '3',
    slug: 'brouillon-seo-local',
    title: '[BROUILLON] SEO local pour les PME',
    excerpt: 'Guide du référencement local pour les petites entreprises.',
    category: 'guide',
    tags: ['seo', 'local', 'pme'],
    is_published: false,
    published_at: null,
    reading_time: 6,
  },
];

const categories = [
  { value: 'guide', label: 'Guide' },
  { value: 'comparatif', label: 'Comparatif' },
  { value: 'local', label: 'Local' },
  { value: 'secteur', label: 'Secteur' },
  { value: 'actualite', label: 'Actualité' },
];

const aiPromptTemplates = [
  { id: 'guide', label: 'Guide pratique', prompt: 'Rédige un guide pratique sur [sujet] pour les entrepreneurs. Structure avec H2, listes à puces, conseils actionnables.' },
  { id: 'comparatif', label: 'Comparatif', prompt: 'Compare [option A] et [option B] pour les TPE/PME. Inclus tableau comparatif, avantages/inconvénients, recommandations.' },
  { id: 'local', label: 'Article local', prompt: 'Rédige un article sur pourquoi les entreprises de [ville] ont besoin d\'un site web. Contexte local, avantages, exemples.' },
  { id: 'secteur', label: 'Focus secteur', prompt: 'Rédige un guide sur le site web idéal pour [secteur]. Fonctionnalités essentielles, erreurs à éviter, exemples.' },
];

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Gestion du Blog — Admin FastFabric' }];
}

export default function AdminBlog() {
  const [articles, setArticles] = useState(initialArticles);
  const [showEditor, setShowEditor] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<typeof initialArticles[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [aiPrompt, setAIPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // New article form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'guide',
    tags: '',
    meta_description: '',
  });

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'published' && article.is_published) ||
      (filterStatus === 'draft' && !article.is_published);
    return matchesSearch && matchesStatus;
  });

  const handleCreateNew = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'guide',
      tags: '',
      meta_description: '',
    });
    setShowEditor(true);
  };

  const handleEdit = (article: typeof initialArticles[0]) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: '',
      category: article.category,
      tags: article.tags.join(', '),
      meta_description: '',
    });
    setShowEditor(true);
  };

  const handleTogglePublish = (articleId: string) => {
    setArticles(articles.map(a => 
      a.id === articleId 
        ? { ...a, is_published: !a.is_published, published_at: !a.is_published ? new Date().toISOString().split('T')[0] : null }
        : a
    ));
  };

  const handleDelete = (articleId: string) => {
    if (confirm('Supprimer cet article ?')) {
      setArticles(articles.filter(a => a.id !== articleId));
    }
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation (would call Gemini API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Sample generated content
    const generatedContent = `# ${aiPrompt}\n\nContenu généré par IA...\n\n## Introduction\n\nVoici une introduction générée automatiquement.\n\n## Points clés\n\n- Point 1\n- Point 2\n- Point 3\n\n## Conclusion\n\nConclusion de l'article.`;
    
    setFormData(prev => ({
      ...prev,
      title: aiPrompt,
      slug: aiPrompt.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      content: generatedContent,
      excerpt: `Guide complet sur ${aiPrompt}.`,
    }));
    
    setIsGenerating(false);
    setShowAIModal(false);
    setAIPrompt('');
  };

  const handleSave = () => {
    const newArticle = {
      id: editingArticle?.id || Date.now().toString(),
      slug: formData.slug,
      title: formData.title,
      excerpt: formData.excerpt,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()),
      is_published: false,
      published_at: null,
      reading_time: Math.ceil(formData.content.length / 1000),
    };

    if (editingArticle) {
      setArticles(articles.map(a => a.id === editingArticle.id ? { ...a, ...newArticle } : a));
    } else {
      setArticles([newArticle, ...articles]);
    }

    setShowEditor(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Blog</h1>
          <p className="text-gray-600">Créez et gérez vos articles SEO</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Générer avec IA
          </Button>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouvel article
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{articles.length}</div>
          <div className="text-sm text-gray-500">Articles total</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {articles.filter(a => a.is_published).length}
          </div>
          <div className="text-sm text-gray-500">Publiés</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {articles.filter(a => !a.is_published).length}
          </div>
          <div className="text-sm text-gray-500">Brouillons</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'published', 'draft'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Tous' : status === 'published' ? 'Publiés' : 'Brouillons'}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Article</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Catégorie</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Statut</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredArticles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{article.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{article.excerpt}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                    {categories.find(c => c.value === article.category)?.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {article.is_published ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                      <Eye className="w-3 h-3" />
                      Publié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                      <EyeOff className="w-3 h-3" />
                      Brouillon
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {article.published_at ? (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.published_at).toLocaleDateString('fr-FR')}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleTogglePublish(article.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        article.is_published 
                          ? 'text-orange-600 hover:bg-orange-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={article.is_published ? 'Dépublier' : 'Publier'}
                    >
                      {article.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
              </h2>
              <button
                onClick={() => setShowEditor(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      title: e.target.value,
                      slug: generateSlug(e.target.value)
                    }));
                  }}
                  placeholder="Titre de l'article"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">/blog/</span>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="slug-de-l-article"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Category & Tags */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (séparés par des virgules)
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="seo, création site, webdesign"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extrait
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Courte description de l'article (affichée dans les listes)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                  rows={2}
                />
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description (SEO)
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Description pour les moteurs de recherche (155 caractères max)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                  rows={2}
                  maxLength={160}
                />
                <div className="text-right text-xs text-gray-400 mt-1">
                  {formData.meta_description.length}/160
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu (Markdown)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="# Titre&#10;&#10;Contenu de l'article en Markdown..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none font-mono text-sm"
                  rows={15}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
              <Button variant="secondary" onClick={() => setShowEditor(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Enregistrer
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* AI Generation Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                Générer avec l'IA
              </h2>
              <button
                onClick={() => setShowAIModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-600">
                Décrivez le sujet de l'article que vous souhaitez générer.
              </p>

              {/* Quick prompts */}
              <div className="flex flex-wrap gap-2">
                {aiPromptTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setAIPrompt(template.prompt)}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {template.label}
                  </button>
                ))}
              </div>

              <textarea
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                placeholder="Ex: Comment créer un site vitrine pour un restaurant"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                rows={4}
              />
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowAIModal(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleGenerateWithAI} 
                disabled={!aiPrompt.trim() || isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Générer
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}


