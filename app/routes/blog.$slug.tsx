/**
 * Blog Article Page
 * Individual article with full SEO optimization
 */

import type { Route } from "./+types/blog.$slug";
import { Link } from 'react-router';
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { Button } from '~/components/ui/Button';
import { Breadcrumbs, generateBreadcrumbs, Sidebar } from '~/components/seo';
import { secteurs } from '~/data/secteurs';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, ArrowLeft, Share2, Tag } from 'lucide-react';

// Sample articles data (would come from Supabase in production)
const articlesData: Record<string, any> = {
  'comment-creer-site-vitrine-efficace': {
    slug: 'comment-creer-site-vitrine-efficace',
    title: 'Comment créer un site vitrine efficace en 2026',
    excerpt: 'Découvrez les 5 clés pour créer un site vitrine qui convertit en 2026.',
    meta_description: 'Guide complet pour créer un site vitrine efficace en 2026. Design, SEO, mobile-first : tous nos conseils.',
    category: 'guide',
    tags: ['site vitrine', 'création site', 'webdesign', 'seo'],
    reading_time: 5,
    published_at: '2025-12-15',
    content: `
# Comment créer un site vitrine efficace en 2026

Un site vitrine est la carte de visite digitale de votre entreprise. Voici les clés pour créer un site qui convertit.

## 1. Définir vos objectifs

Avant de commencer, posez-vous les bonnes questions : Qui sont vos clients cibles ? Quel message voulez-vous transmettre ? Quelles actions attendez-vous des visiteurs ?

## 2. Choisir un design professionnel

Le design doit refléter votre image de marque tout en restant épuré et moderne. Privilégiez la lisibilité et la navigation intuitive.

### Les éléments clés du design

- **Typographie** : Choisissez 2-3 polices maximum, lisibles sur tous les écrans
- **Couleurs** : Définissez une palette cohérente avec votre identité
- **Images** : Optez pour des visuels de qualité professionnelle
- **Espaces** : Aérez votre design pour une meilleure lisibilité

## 3. Optimiser pour le mobile

Plus de 60% du trafic web provient des mobiles. Votre site doit être parfaitement responsive.

Le design "mobile-first" consiste à concevoir d'abord pour les petits écrans, puis à adapter pour les plus grands. Cette approche garantit une expérience optimale sur tous les appareils.

## 4. Soigner le contenu

Des textes clairs, des images de qualité, et des appels à l'action visibles sont essentiels pour convertir vos visiteurs.

### Structure recommandée

1. **Accueil** : Proposition de valeur claire et CTA visible
2. **À propos** : Votre histoire et vos valeurs
3. **Services** : Ce que vous proposez
4. **Contact** : Formulaire et coordonnées

## 5. Travailler le SEO

Un site invisible sur Google ne sert à rien. Optimisez vos titres, descriptions et contenus pour le référencement naturel.

### Checklist SEO

- ✅ Balises title uniques sur chaque page
- ✅ Meta descriptions attractives
- ✅ URLs propres et descriptives
- ✅ Balises H1, H2, H3 hiérarchisées
- ✅ Images optimisées avec attributs alt
- ✅ Site rapide (Core Web Vitals)

## Conclusion

Créer un site vitrine efficace demande méthode et expertise. Chez FastFabric, nous vous livrons votre site professionnel en seulement 2 heures.

**À partir de 299€**, bénéficiez d'un site moderne, responsive et optimisé pour le SEO.
    `,
  },
  'site-vitrine-vs-landing-page-que-choisir': {
    slug: 'site-vitrine-vs-landing-page-que-choisir',
    title: 'Site vitrine vs Landing page : que choisir pour votre entreprise ?',
    excerpt: 'Landing page ou site vitrine ? Découvrez les avantages de chaque solution.',
    meta_description: 'Comparatif complet entre site vitrine et landing page. Découvrez quelle solution choisir.',
    category: 'comparatif',
    tags: ['landing page', 'site vitrine', 'comparatif', 'création site'],
    reading_time: 4,
    published_at: '2025-12-10',
    content: `
# Site vitrine vs Landing page : que choisir ?

Vous hésitez entre un site vitrine et une landing page ? Ce guide vous aide à faire le bon choix.

## Qu'est-ce qu'une Landing Page ?

Une landing page (ou page d'atterrissage) est une page unique conçue pour convertir. Elle se concentre sur un seul objectif : capture d'email, vente, prise de RDV...

**Avantages :**
- Taux de conversion élevé
- Message clair et focalisé
- Prix accessible (299€ chez FastFabric)
- Livraison rapide

**Inconvénients :**
- Contenu limité
- Moins de possibilités SEO
- Image potentiellement moins "établie"

## Qu'est-ce qu'un Site Vitrine ?

Un site vitrine comporte plusieurs pages pour présenter l'ensemble de votre activité : accueil, services, à propos, contact...

**Avantages :**
- Présentation complète de votre offre
- Meilleur référencement (plus de contenus)
- Image professionnelle renforcée
- Évolutif dans le temps

**Inconvénients :**
- Budget plus élevé
- Temps de création plus long
- Nécessite plus de contenus

## Tableau comparatif

| Critère | Landing Page | Site Vitrine |
|---------|--------------|--------------|
| Prix | 299€ | 599€ |
| Délai | 2h | 2-4h |
| Pages | 1 | 5+ |
| SEO | Limité | Complet |
| Conversion | Très élevée | Moyenne |

## Comment choisir ?

**Optez pour une Landing Page si :**
- Vous lancez un produit/service spécifique
- Vous avez un budget limité
- Vous voulez tester une idée rapidement
- Vous avez une campagne publicitaire ciblée

**Optez pour un Site Vitrine si :**
- Vous voulez présenter plusieurs services
- Vous visez un référencement naturel durable
- Vous représentez une entreprise établie
- Vous avez besoin de crédibilité

## Notre conseil

Commencez par une landing page pour valider votre marché, puis évoluez vers un site vitrine complet. C'est la stratégie la plus efficace pour minimiser les risques.
    `,
  },
};

// Related articles (simplified)
const relatedArticles = [
  { slug: 'comment-creer-site-vitrine-efficace', title: 'Comment créer un site vitrine efficace en 2026' },
  { slug: 'site-vitrine-vs-landing-page-que-choisir', title: 'Site vitrine vs Landing page : que choisir ?' },
  { slug: 'tendances-webdesign-2026', title: 'Tendances web design 2026' },
];

export function meta({ params }: Route.MetaArgs) {
  const article = articlesData[params.slug!];
  
  if (!article) {
    return [{ title: 'Article non trouvé — FastFabric' }];
  }

  return [
    { title: `${article.title} | Blog FastFabric` },
    { name: 'description', content: article.meta_description || article.excerpt },
    { name: 'keywords', content: article.tags.join(', ') },
    { property: 'og:title', content: article.title },
    { property: 'og:description', content: article.excerpt },
    { property: 'og:type', content: 'article' },
    { property: 'article:published_time', content: article.published_at },
    { name: 'twitter:card', content: 'summary_large_image' },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const article = articlesData[params.slug!];
  
  if (!article) {
    throw new Response('Not Found', { status: 404 });
  }

  const relatedSecteurs = secteurs.slice(0, 4);
  const related = relatedArticles.filter(a => a.slug !== params.slug).slice(0, 3);

  return { article, relatedSecteurs, relatedArticles: related };
}

// Simple markdown to HTML converter
function renderMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-8 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mb-6">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Lists
    .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 list-decimal">$2</li>')
    // Checkboxes
    .replace(/^- ✅ (.*$)/gim, '<li class="ml-4 flex items-start gap-2"><span class="text-green-600">✓</span>$1</li>')
    // Paragraphs
    .replace(/^(?!<[hlu]|<li)(.*$)/gim, (match) => {
      if (match.trim() === '') return '<br/>';
      if (match.startsWith('<')) return match;
      return `<p class="text-gray-600 leading-relaxed mb-4">${match}</p>`;
    })
    // Tables (simplified)
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      if (cells.every(c => c.trim().match(/^-+$/))) return '';
      return `<tr>${cells.map(c => `<td class="border border-gray-200 px-4 py-2">${c.trim()}</td>`).join('')}</tr>`;
    });
}

export default function BlogArticle({ loaderData }: Route.ComponentProps) {
  const { article, relatedSecteurs, relatedArticles } = loaderData;

  // Article Schema.org
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "datePublished": article.published_at,
    "author": {
      "@type": "Organization",
      "name": "FastFabric"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FastFabric",
      "url": "https://fastfabric.fr"
    }
  };

  return (
    <>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="pt-20">
        {/* Article Header */}
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <Breadcrumbs 
              items={generateBreadcrumbs('blog', { articleTitle: article.title })}
              className="mb-6"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              {/* Category */}
              <span className="inline-block px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm font-medium mb-4">
                {article.category === 'guide' ? 'Guide' : 
                 article.category === 'comparatif' ? 'Comparatif' :
                 article.category === 'local' ? 'Local' :
                 article.category === 'secteur' ? 'Secteur' : 'Actualité'}
              </span>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              <p className="text-xl text-gray-600 mb-6">
                {article.excerpt}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.published_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {article.reading_time} min de lecture
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <article className="lg:col-span-2">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200">
                {article.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Share */}
              <div className="flex items-center gap-4 mt-8">
                <span className="text-gray-600">Partager :</span>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* CTA */}
              <div className="mt-12 p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-2">
                  Prêt à créer votre site ?
                </h3>
                <p className="text-gray-300 mb-4">
                  Mettez en pratique ces conseils avec FastFabric. Livraison en 2 heures.
                </p>
                <Link to="/commander">
                  <Button className="bg-white text-gray-900 hover:bg-gray-100">
                    Commander maintenant
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
                <Link
                  to="/blog"
                  className="flex items-center gap-2 text-gray-600 hover:text-[var(--accent)]"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Retour au blog
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <Sidebar
              relatedSecteurs={relatedSecteurs}
              relatedArticles={relatedArticles}
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

