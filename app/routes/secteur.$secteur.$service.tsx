/**
 * Secteur + Service Page
 * Routes: /secteur/avocat/site-vitrine, /secteur/restaurant/landing-page, etc.
 * High-value pages combining sector expertise with specific service offering
 */

import type { Route } from "./+types/secteur.$secteur.$service";
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
import { services, getServiceBySlug, getVillesPrioritaires } from '~/data/villes-95';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Clock,
  Shield,
  MapPin
} from 'lucide-react';

export function meta({ params }: Route.MetaArgs) {
  const secteur = getSecteurBySlug(params.secteur!);
  const service = getServiceBySlug(params.service!);
  
  if (!secteur || !service) {
    return [{ title: 'Page non trouvée — FastFabric' }];
  }

  return [
    { title: generateSecteurSEOTitle(secteur, service) },
    { name: 'description', content: generateSecteurSEODescription(secteur, service) },
    { name: 'keywords', content: [...secteur.keywords, ...service.keywords].join(', ') },
    { property: 'og:title', content: generateSecteurSEOTitle(secteur, service) },
    { property: 'og:description', content: generateSecteurSEODescription(secteur, service) },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const secteur = getSecteurBySlug(params.secteur!);
  const service = getServiceBySlug(params.service!);
  
  if (!secteur || !service) {
    throw new Response('Not Found', { status: 404 });
  }

  const otherServices = services.filter(s => s.slug !== service.slug);
  const otherSecteurs = secteurs.filter(s => s.slug !== secteur.slug).slice(0, 6);
  const priorityVilles = getVillesPrioritaires();

  return { secteur, service, otherServices, otherSecteurs, priorityVilles };
}

export default function SecteurServicePage({ loaderData }: Route.ComponentProps) {
  const { secteur, service, otherServices, otherSecteurs, priorityVilles } = loaderData;

  // Combined Schema.org
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${service.nom} pour ${secteur.nom}`,
    "provider": {
      "@type": "Organization",
      "name": "FastFabric",
      "url": "https://fastfabric.fr"
    },
    "description": `${service.description} pour ${secteur.nom.toLowerCase()}. ${secteur.problematique}`,
    "offers": {
      "@type": "Offer",
      "price": service.prix.replace('€', ''),
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Val-d'Oise (95)"
    }
  };

  return (
    <>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
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
                items={generateBreadcrumbs('secteur-service', { 
                  secteurName: secteur.nom, 
                  secteurSlug: secteur.slug,
                  serviceName: service.nom 
                })}
                className="justify-center mb-6"
              />

              <div className="text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm font-medium mb-6">
                  <span className="text-xl">{secteur.icon}</span>
                  {secteur.nom} × {service.nom}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {service.nom} pour {secteur.nom}
                </h1>

                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  {secteur.problematique} Nous créons votre {service.nom.toLowerCase()} en seulement 2 heures.
                </p>

                {/* Price & CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <div className="text-3xl font-bold text-gray-900">
                    <span className="text-[var(--accent)]">{service.prix}</span>
                    <span className="text-lg text-gray-500 font-normal ml-2">TTC</span>
                  </div>
                  <Link to="/commander">
                    <Button size="lg" className="text-lg px-8">
                      Commander maintenant
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    Livré en 2h
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

        {/* Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-16">
              {/* Why this combo */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Pourquoi un {service.nom.toLowerCase()} pour {secteur.nom.toLowerCase()} ?
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                  <p>
                    En tant que {secteur.nom.toLowerCase()}, votre présence en ligne est cruciale. 
                    {service.nom === 'Landing Page' && (
                      <> Une landing page percutante vous permet de convertir les visiteurs en clients avec un message clair et un appel à l'action efficace.</>
                    )}
                    {service.nom === 'Site Vitrine' && (
                      <> Un site vitrine professionnel présente l'ensemble de vos services et renforce votre crédibilité auprès de vos prospects.</>
                    )}
                    {service.nom === 'Site Sur Mesure' && (
                      <> Un site sur mesure répond parfaitement à vos besoins spécifiques et vous distingue de la concurrence.</>
                    )}
                  </p>
                </div>
              </section>

              {/* Features included */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Ce qui est inclus
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    ...secteur.fonctionnalites.slice(0, 4),
                    'Design responsive mobile',
                    'Optimisation SEO',
                    'Code source fourni',
                    'Livraison express 2-4h',
                  ].map((feature, index) => (
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

              {/* Available in cities */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  <MapPin className="inline w-8 h-8 mr-2 text-[var(--accent)]" />
                  Disponible dans le Val-d'Oise
                </h2>
                <p className="text-gray-600 mb-6">
                  Nous livrons dans toutes les villes du département 95. Voici les principales :
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {priorityVilles.slice(0, 8).map((ville) => (
                    <Link
                      key={ville.slug}
                      to={`/${service.slug}/${ville.slug}`}
                      className="p-3 bg-gray-50 rounded-xl text-center hover:bg-[var(--accent)]/10 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{ville.nom}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  to={`/${service.slug}`}
                  className="inline-flex items-center gap-2 text-[var(--accent)] mt-4 hover:underline"
                >
                  Voir toutes les villes
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </section>

              {/* FAQ */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Questions fréquentes
                </h2>
                <div className="space-y-4">
                  {secteur.faq.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-gray-50 rounded-xl p-6"
                    >
                      <h3 className="font-bold text-gray-900 mb-2">{item.question}</h3>
                      <p className="text-gray-600">{item.answer}</p>
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

        {/* Other services for this sector */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Autres offres pour {secteur.nomPluriel.toLowerCase()}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
              {otherServices.map((s) => (
                <Link
                  key={s.slug}
                  to={`/secteur/${secteur.slug}/${s.slug}`}
                  className="flex items-center justify-between p-6 bg-white rounded-2xl hover:shadow-lg transition-all border border-gray-100"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{s.nom}</h3>
                    <p className="text-gray-600 text-sm">{s.description}</p>
                  </div>
                  <span className="text-2xl font-bold text-[var(--accent)]">{s.prix}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à lancer votre {service.nom.toLowerCase()} ?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Commandez maintenant et recevez votre site en quelques heures.
              {service.prix !== 'Sur devis' && ` Seulement ${service.prix}.`}
            </p>
            <Link to="/commander">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Commander mon {service.nom.toLowerCase()}
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

