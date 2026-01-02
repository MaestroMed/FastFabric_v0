/**
 * Blog Index Page
 * Lists all published articles for SEO and content marketing
 */

import type { Route } from "./+types/blog._index";
import { Link } from 'react-router';
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { Breadcrumbs } from '~/components/seo';
import { getPublishedBlogArticles, type BlogArticle } from '~/data/blog-articles';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Blog — Conseils création de site web | FastFabric' },
    { name: 'description', content: 'Guides, tutoriels et conseils pour créer un site web efficace. Découvrez nos articles sur le webdesign, le SEO et la création de sites professionnels.' },
    { property: 'og:title', content: 'Blog FastFabric — Conseils création de site web' },
    { property: 'og:description', content: 'Guides et conseils pour créer un site web efficace.' },
  ];
}

// Sample articles until Supabase is connected
const sampleArticles = [
  {
    slug: 'comment-creer-site-vitrine-efficace',
    title: 'Comment créer un site vitrine efficace en 2026',
    excerpt: 'Découvrez les 5 clés pour créer un site vitrine qui convertit en 2026. Guide complet avec conseils de professionnels.',
    category: 'guide',
    tags: ['site vitrine', 'création site', 'webdesign'],
    reading_time: 5,
    published_at: '2025-12-15',
    featured_image: null,
  },
  {
    slug: 'site-vitrine-vs-landing-page-que-choisir',
    title: 'Site vitrine vs Landing page : que choisir pour votre entreprise ?',
    excerpt: 'Landing page ou site vitrine ? Découvrez les avantages de chaque solution pour faire le meilleur choix.',
    category: 'comparatif',
    tags: ['landing page', 'site vitrine', 'comparatif'],
    reading_time: 4,
    published_at: '2025-12-10',
    featured_image: null,
  },
  {
    slug: 'pourquoi-entreprises-cergy-ont-besoin-site-web',
    title: 'Pourquoi les entreprises de Cergy ont besoin d\'un site web en 2026',
    excerpt: 'Découvrez pourquoi un site web est essentiel pour les entreprises de Cergy. Visibilité, crédibilité et différenciation.',
    category: 'local',
    tags: ['cergy', 'val-d-oise', 'site web local'],
    reading_time: 4,
    published_at: '2025-12-05',
    featured_image: null,
  },
  {
    slug: 'site-web-ideal-restaurant',
    title: 'Le site web idéal pour un restaurant : guide complet',
    excerpt: 'Guide complet pour créer le site web idéal pour votre restaurant. Menu digital, réservation, photos.',
    category: 'secteur',
    tags: ['restaurant', 'site restaurant', 'menu digital'],
    reading_time: 6,
    published_at: '2025-11-28',
    featured_image: null,
  },
  {
    slug: 'tendances-webdesign-2026',
    title: 'Tendances web design 2026 : ce qui va marquer l\'année',
    excerpt: 'Découvrez les 6 grandes tendances du web design en 2026 : minimalisme, micro-interactions, dark mode et plus.',
    category: 'actualite',
    tags: ['webdesign', 'tendances', '2026'],
    reading_time: 5,
    published_at: '2025-11-20',
    featured_image: null,
  },
];

const categoryLabels: Record<string, string> = {
  guide: 'Guide',
  comparatif: 'Comparatif',
  local: 'Local',
  secteur: 'Secteur',
  actualite: 'Actualité',
};

const categoryColors: Record<string, string> = {
  guide: 'bg-blue-100 text-blue-700',
  comparatif: 'bg-purple-100 text-purple-700',
  local: 'bg-green-100 text-green-700',
  secteur: 'bg-orange-100 text-orange-700',
  actualite: 'bg-pink-100 text-pink-700',
};

export async function clientLoader() {
  // For now, use sample articles
  // When Supabase is connected, use: localStore.getPublishedArticles()
  return { articles: sampleArticles };
}

export default function BlogIndex({ loaderData }: Route.ComponentProps) {
  const { articles } = loaderData;

  // Group articles by category
  const categories = [...new Set(articles.map(a => a.category))];

  return (
    <>
      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <Breadcrumbs items={[{ label: 'Blog' }]} className="mb-6" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Blog FastFabric
              </h1>
              <p className="text-xl text-gray-600">
                Guides, conseils et actualités pour créer un site web qui convertit.
                Apprenez des meilleurs pratiques du webdesign et du SEO.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Articles */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {/* Category filters */}
            <div className="flex flex-wrap gap-3 mb-12">
              <span className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">
                Tous
              </span>
              {categories.map((category) => (
                <span
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 ${categoryColors[category] || 'bg-gray-100 text-gray-700'}`}
                >
                  {categoryLabels[category] || category}
                </span>
              ))}
            </div>

            {/* Articles grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.article
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Image placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>

                  <div className="p-6">
                    {/* Category badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${categoryColors[article.category] || 'bg-gray-100 text-gray-700'}`}>
                      {categoryLabels[article.category] || article.category}
                    </span>

                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--accent)] transition-colors">
                      <Link to={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.published_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.reading_time} min
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-xs text-gray-500"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à créer votre site ?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Appliquez ces conseils avec FastFabric. Site professionnel livré en 2 heures.
            </p>
            <Link
              to="/commander"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Commander maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

