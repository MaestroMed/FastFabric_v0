/**
 * Secteur Index Page - Page pilier pour un secteur d'activité
 * Routes: /secteur/avocat, /secteur/restaurant, etc.
 */

import type { Route } from "./+types/secteur.$secteur";
import { Link } from 'react-router';
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { Button } from '~/components/ui/Button';
import { Breadcrumbs, generateBreadcrumbs, Sidebar } from '~/components/seo';
import { 
  secteurs, 
  getSecteurBySlug,
  generateSecteurSEOTitle,
  generateSecteurSEODescription 
} from '~/data/secteurs';
import { services } from '~/data/villes-95';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Clock,
  Shield,
  Zap
} from 'lucide-react';

export function meta({ params }: Route.MetaArgs) {
  const secteur = getSecteurBySlug(params.secteur!);
  
  if (!secteur) {
    return [{ title: 'Secteur non trouvé — FastFabric' }];
  }

  return [
    { title: generateSecteurSEOTitle(secteur) },
    { name: 'description', content: generateSecteurSEODescription(secteur) },
    { name: 'keywords', content: secteur.keywords.join(', ') },
    { property: 'og:title', content: generateSecteurSEOTitle(secteur) },
    { property: 'og:description', content: generateSecteurSEODescription(secteur) },
    { property: 'og:type', content: 'website' },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const secteur = getSecteurBySlug(params.secteur!);
  
  if (!secteur) {
    throw new Response('Not Found', { status: 404 });
  }

  const otherSecteurs = secteurs.filter(s => s.slug !== secteur.slug).slice(0, 6);

  return { secteur, services, otherSecteurs };
}

export default function SecteurPage({ loaderData }: Route.ComponentProps) {
  const { secteur, services, otherSecteurs } = loaderData;

  // Schema.org for the sector
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Création de site web pour ${secteur.nom}`,
    "provider": {
      "@type": "Organization",
      "name": "FastFabric"
    },
    "description": secteur.description,
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Val-d'Oise (95)"
    }
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": secteur.faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <Header />

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1d1d1f_1px,transparent_1px),linear-gradient(to_bottom,#1d1d1f_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              {/* Breadcrumbs */}
              <Breadcrumbs 
                items={generateBreadcrumbs('secteur', { secteurName: secteur.nom })}
                className="justify-center mb-6"
              />

              {/* Sector badge */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm font-medium mb-6">
                  <span className="text-2xl">{secteur.icon}</span>
                  {secteur.nomPluriel}
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Site Web pour {secteur.nom}
                </h1>

                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  {secteur.problematique}
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <Link to="/commander">
                    <Button size="lg" className="text-lg px-8">
                      Créer mon site {secteur.nom.toLowerCase()}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    Livraison 2-4h
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    Satisfait ou remboursé
                  </span>
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    4.9/5 (127 avis)
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main content with sidebar */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Services for this sector */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Nos offres pour {secteur.nomPluriel.toLowerCase()}
                </h2>
                <div className="grid sm:grid-cols-3 gap-6">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={`/secteur/${secteur.slug}/${service.slug}`}
                        className="block p-6 bg-white border border-gray-200 rounded-2xl hover:border-[var(--accent)] hover:shadow-lg transition-all h-full"
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {service.nom}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {service.description}
                        </p>
                        <p className="text-2xl font-bold text-[var(--accent)]">
                          {service.prix}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Features */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Fonctionnalités recommandées
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {secteur.fonctionnalites.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Why FastFabric */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Pourquoi choisir FastFabric ?
                </h2>
                <div className="grid sm:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Zap,
                      title: 'Ultra rapide',
                      description: 'Votre site livré en 2-4 heures, pas en semaines.'
                    },
                    {
                      icon: Star,
                      title: 'Design premium',
                      description: 'Un design moderne adapté à votre secteur d\'activité.'
                    },
                    {
                      icon: Shield,
                      title: 'Zéro risque',
                      description: 'Satisfait ou remboursé sous 14 jours.'
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="w-14 h-14 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-7 h-7 text-[var(--accent)]" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Questions fréquentes - {secteur.nomPluriel}
                </h2>
                <div className="space-y-4">
                  {secteur.faq.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl p-6"
                    >
                      <h3 className="font-bold text-gray-900 mb-2">
                        {item.question}
                      </h3>
                      <p className="text-gray-600">
                        {item.answer}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <Sidebar
              relatedSecteurs={otherSecteurs}
            />
          </div>
        </div>

        {/* Other Sectors */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Autres secteurs d'activité
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {otherSecteurs.map((s) => (
                <Link
                  key={s.slug}
                  to={`/secteur/${s.slug}`}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:bg-[var(--accent)]/10 transition-colors group border border-gray-100"
                >
                  <span className="text-3xl">{s.icon}</span>
                  <span className="font-medium text-gray-900 group-hover:text-[var(--accent)] text-center text-sm">
                    {s.nom}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à créer votre site {secteur.nom.toLowerCase()} ?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Commandez maintenant et recevez votre site en quelques heures.
              À partir de 299€ seulement.
            </p>
            <Link to="/commander">
              <Button size="lg" className="text-lg px-8 bg-white text-gray-900 hover:bg-gray-100">
                Commander maintenant
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}


