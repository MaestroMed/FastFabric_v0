/**
 * Dynamic SEO Local Pages
 * Routes: /site-vitrine/argenteuil, /landing-page/cergy, etc.
 * 
 * This generates 552 unique pages (184 villes × 3 services)
 * for maximum local SEO coverage in Val-d'Oise (95)
 */

import type { Route } from "./+types/$service.$ville";
import { Link } from 'react-router';
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { Button } from '~/components/ui/Button';
import { Breadcrumbs, generateBreadcrumbs, Sidebar } from '~/components/seo';
import { TrustBadges, GuaranteeBadge } from '~/components/conversion/SocialProof';
import { 
  villes95, 
  services, 
  getVilleBySlug, 
  getServiceBySlug,
  generateSEOTitle,
  generateSEODescription,
  generateH1,
  generateLocalKeywords,
  getNearbyVilles,
  generateVilleDescription,
  generateLocalFAQ,
} from '~/data/villes-95';
import { secteurs } from '~/data/secteurs';
import { 
  generateLocalPageContent,
  generateLocalMetaTags,
  generateLocalBusinessSchema 
} from '~/lib/content-generator';
import { getSecteursForVille } from '~/data/content-templates';
import { LocalContext, LocalFAQ } from '~/components/local';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Star,
  Zap,
  Shield,
  Phone,
  Building,
  Users,
  Landmark
} from 'lucide-react';

export function meta({ params }: Route.MetaArgs) {
  const ville = getVilleBySlug(params.ville!);
  const service = getServiceBySlug(params.service!);
  
  if (!ville || !service) {
    return [{ title: 'Page non trouvée — FastFabric' }];
  }

  const title = generateSEOTitle(ville, service);
  const description = generateSEODescription(ville, service);
  const keywords = generateLocalKeywords(ville, service);

  return [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords.join(', ') },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'geo.region', content: 'FR-95' },
    { name: 'geo.placename', content: ville.nom },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const ville = getVilleBySlug(params.ville!);
  const service = getServiceBySlug(params.service!);
  
  if (!ville || !service) {
    throw new Response('Not Found', { status: 404 });
  }

  // Get nearby cities using the real geographic data
  const nearbyVilles = getNearbyVilles(ville);

  // Get all services for cross-linking
  const otherServices = services.filter(s => s.slug !== service.slug);
  
  // Get related sectors based on ville type
  const relatedSecteurs = getSecteursForVille(ville);
  
  // Generate dynamic content
  const pageContent = generateLocalPageContent(ville, service);

  return { ville, service, nearbyVilles, otherServices, relatedSecteurs, pageContent };
}

export default function LocalSEOPage({ loaderData }: Route.ComponentProps) {
  const { ville, service, nearbyVilles, otherServices, relatedSecteurs, pageContent } = loaderData;

  const features = [
    'Livraison express en 2-4 heures',
    'Design 100% sur mesure',
    'Responsive mobile',
    'Optimisé SEO',
    'Code source fourni',
    'Révisions incluses',
  ];

  // Schema.org LocalBusiness with enriched data
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "FastFabric",
    "description": generateSEODescription(ville, service),
    "areaServed": {
      "@type": "City",
      "name": ville.nom,
      "postalCode": ville.codePostal,
      "addressCountry": "FR",
      ...(ville.population && { "population": ville.population })
    },
    "priceRange": "€€",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": service.nom,
      "itemListElement": [{
        "@type": "Offer",
        "name": `${service.nom} à ${ville.nom}`,
        "price": service.prix.replace('€', '').replace('Sur devis', ''),
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      }]
    }
  };

  // Generate unique content based on city data
  const getUniqueContent = () => {
    if (ville.description) {
      return ville.description;
    }
    // Default content for cities without custom description
    return `${ville.nom} est une commune dynamique du Val-d'Oise (${ville.codePostal})${ville.population ? ` comptant environ ${ville.population.toLocaleString()} habitants` : ''}. Les entreprises et professionnels de ${ville.nom} peuvent désormais bénéficier de notre service de création de site web express.`;
  };

  return (
    <>
      <Header />

      {/* Schema.org */}
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
              className="max-w-4xl mx-auto text-center"
            >
              {/* Breadcrumbs */}
              <Breadcrumbs 
                items={generateBreadcrumbs('service-ville', {
                  serviceName: service.nom,
                  serviceSlug: service.slug,
                  villeName: ville.nom
                })}
                className="justify-center mb-6"
              />

              {/* Location badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm font-medium mb-6">
                <MapPin className="w-4 h-4" />
                {ville.nom} ({ville.codePostal})
                {ville.population && (
                  <span className="text-[var(--accent)]/70">• {(ville.population / 1000).toFixed(0)}k hab.</span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                {generateH1(ville, service)}
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Besoin d'un {service.nom.toLowerCase()} à <strong>{ville.nom}</strong> ? 
                FastFabric crée votre site web professionnel en <strong>2 heures</strong>, 
                avec un design sur mesure et une livraison express.
              </p>

              {/* Price & CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <div className="text-3xl font-bold text-gray-900">
                  À partir de <span className="text-[var(--accent)]">{service.prix}</span>
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
            </motion.div>
          </div>
        </section>

        {/* Main content with sidebar */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Unique city content section */}
              <section className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="w-6 h-6 text-[var(--accent)]" />
                  Votre site web à {ville.nom}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {getUniqueContent()}
                </p>
                
                {/* City stats */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {ville.population && (
                    <div className="bg-white p-4 rounded-xl">
                      <Users className="w-5 h-5 text-[var(--accent)] mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {ville.population.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">habitants</div>
                    </div>
                  )}
                  {ville.economicActivity && (
                    <div className="bg-white p-4 rounded-xl sm:col-span-2">
                      <Landmark className="w-5 h-5 text-[var(--accent)] mb-2" />
                      <div className="font-semibold text-gray-900">Économie locale</div>
                      <div className="text-sm text-gray-600">{ville.economicActivity}</div>
                    </div>
                  )}
                </div>

                {/* Landmarks if available */}
                {ville.landmarks && ville.landmarks.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Points d'intérêt à {ville.nom}</h3>
                    <div className="flex flex-wrap gap-2">
                      {ville.landmarks.map((landmark) => (
                        <span
                          key={landmark}
                          className="px-3 py-1 bg-white rounded-full text-sm text-gray-600"
                        >
                          📍 {landmark}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Why choose us */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Pourquoi choisir FastFabric à {ville.nom} ?
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Zap,
                      title: 'Rapidité inégalée',
                      description: `Votre ${service.nom.toLowerCase()} livré en quelques heures, pas en semaines.`
                    },
                    {
                      icon: MapPin,
                      title: 'Expertise locale',
                      description: `Nous connaissons ${ville.nom} et le Val-d'Oise. Design adapté à votre marché local.`
                    },
                    {
                      icon: Shield,
                      title: 'Qualité garantie',
                      description: 'Satisfait ou remboursé sous 14 jours. Zéro risque pour vous.'
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-6"
                    >
                      <div className="w-14 h-14 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-7 h-7 text-[var(--accent)]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* What's included */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Ce qui est inclus dans votre {service.nom}
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8">
                  <GuaranteeBadge />
                </div>
              </section>

              {/* Other Services */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Autres services à {ville.nom}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {otherServices.map((s) => (
                    <Link
                      key={s.slug}
                      to={`/${s.slug}/${ville.slug}`}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-[var(--accent)] transition-colors"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">{s.nom}</h3>
                        <p className="text-sm text-gray-600">{s.description}</p>
                      </div>
                      <span className="text-[var(--accent)] font-bold">{s.prix}</span>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Dynamic Local FAQ */}
              <LocalFAQ
                title={`Questions fréquentes — ${service.nom} à ${ville.nom}`}
                faq={pageContent.faq}
                ville={ville.nom}
              />

              {/* Local Sectors */}
              {relatedSecteurs.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Secteurs d'activité à {ville.nom}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {relatedSecteurs.map((secteur) => (
                      <Link
                        key={secteur.slug}
                        to={`/secteur/${secteur.slug}/${ville.slug}`}
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-[var(--accent)]/10 transition-colors text-center"
                      >
                        <span className="text-3xl">{secteur.icon}</span>
                        <span className="font-medium text-gray-900 text-sm">{secteur.nom}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <Sidebar
              currentService={service}
              currentVille={ville}
              nearbyVilles={nearbyVilles}
              otherSecteurs={relatedSecteurs}
              showCities={true}
              showSectors={true}
            />
          </div>
        </div>

        {/* Nearby Cities - Full width for SEO */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {service.nom} dans les villes voisines
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {nearbyVilles.map((v) => (
                <Link
                  key={v.slug}
                  to={`/${service.slug}/${v.slug}`}
                  className="text-center p-4 bg-white rounded-xl hover:bg-[var(--accent)]/10 transition-colors group border border-gray-100"
                >
                  <p className="font-medium text-gray-900 group-hover:text-[var(--accent)]">
                    {v.nom}
                  </p>
                  <p className="text-xs text-gray-500">{v.codePostal}</p>
                </Link>
              ))}
            </div>
            
            {/* Link to all cities */}
            <div className="mt-8 text-center">
              <Link 
                to={`/${service.slug}`}
                className="text-[var(--accent)] hover:underline font-medium"
              >
                Voir toutes les villes du Val-d'Oise →
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <TrustBadges />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à lancer votre projet à {ville.nom} ?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Commandez maintenant et recevez votre site en quelques heures.
              {service.prix !== 'Sur devis' && ` À partir de ${service.prix} seulement.`}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/commander">
                <Button size="lg" className="text-lg px-8 bg-white text-gray-900 hover:bg-gray-100">
                  Commander mon {service.nom.toLowerCase()}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="tel:+33757847424" className="flex items-center gap-2 text-gray-400 hover:text-white">
                <Phone className="w-5 h-5" />
                Ou appelez-nous
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
