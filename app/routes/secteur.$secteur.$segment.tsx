/**
 * Smart Route Handler: /secteur/:secteur/:segment
 * Handles both:
 *   - /secteur/avocat/site-vitrine (Secteur + Service)
 *   - /secteur/avocat/argenteuil (Secteur + Ville)
 * 
 * Determines the type based on whether segment matches a service slug or ville slug
 */

import type { Route } from "./+types/secteur.$secteur.$segment";
import { Link } from 'react-router';
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { Button } from '~/components/ui/Button';
import { Breadcrumbs, Sidebar } from '~/components/seo';
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
  Phone 
} from 'lucide-react';

import { 
  getSecteurBySlug, 
  secteurs,
  generateSecteurSEOTitle,
  generateSecteurSEODescription
} from '~/data/secteurs';
import { 
  getVilleBySlug, 
  getServiceBySlug,
  services, 
  getVillesPrioritaires,
  getNearbyVilles,
  generateVilleDescription 
} from '~/data/villes-95';
import { 
  generateSecteurVilleContent, 
  generateSecteurVilleMetaTags,
  generateServiceSchema 
} from '~/lib/content-generator';

// Helper to determine if segment is a service or a ville
function getSegmentType(segment: string): 'service' | 'ville' | null {
  const service = getServiceBySlug(segment);
  if (service) return 'service';
  
  const ville = getVilleBySlug(segment);
  if (ville) return 'ville';
  
  return null;
}

export function meta({ params }: Route.MetaArgs) {
  const secteur = getSecteurBySlug(params.secteur!);
  const segmentType = getSegmentType(params.segment!);
  
  if (!secteur || !segmentType) {
    return [{ title: 'Page non trouvée — FastFabric' }];
  }

  if (segmentType === 'service') {
    const service = getServiceBySlug(params.segment!)!;
    return [
      { title: generateSecteurSEOTitle(secteur, service) },
      { name: 'description', content: generateSecteurSEODescription(secteur, service) },
      { name: 'keywords', content: [...secteur.keywords, ...service.keywords].join(', ') },
      { property: 'og:title', content: generateSecteurSEOTitle(secteur, service) },
      { property: 'og:description', content: generateSecteurSEODescription(secteur, service) },
    ];
  } else {
    const ville = getVilleBySlug(params.segment!)!;
    const meta = generateSecteurVilleMetaTags(ville, secteur);
    return [
      { title: meta.title },
      { name: 'description', content: meta.description },
      { name: 'keywords', content: meta.keywords },
      { property: 'og:title', content: meta.title },
      { property: 'og:description', content: meta.description },
      { property: 'og:type', content: 'website' },
      { name: 'geo.region', content: 'FR-95' },
      { name: 'geo.placename', content: ville.nom },
    ];
  }
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const secteur = getSecteurBySlug(params.secteur!);
  const segmentType = getSegmentType(params.segment!);
  
  if (!secteur || !segmentType) {
    throw new Response('Not Found', { status: 404 });
  }

  if (segmentType === 'service') {
    const service = getServiceBySlug(params.segment!)!;
    const otherServices = services.filter(s => s.slug !== service.slug);
    const otherSecteurs = secteurs.filter(s => s.slug !== secteur.slug).slice(0, 6);
    const priorityVilles = getVillesPrioritaires();
    
    return { 
      type: 'service' as const,
      secteur, 
      service, 
      otherServices, 
      otherSecteurs, 
      priorityVilles 
    };
  } else {
    const ville = getVilleBySlug(params.segment!)!;
    const content = generateSecteurVilleContent(ville, secteur, secteurs);
    const nearbyVilles = getNearbyVilles(ville);
    const priorityVilles = getVillesPrioritaires().filter(v => v.slug !== ville.slug).slice(0, 5);
    const otherSecteurs = secteurs.filter(s => s.id !== secteur.id).slice(0, 5);

    return { 
      type: 'ville' as const,
      secteur, 
      ville, 
      content, 
      nearbyVilles, 
      priorityVilles,
      otherSecteurs,
      services 
    };
  }
}

export default function SecteurSegmentPage({ loaderData }: Route.ComponentProps) {
  if (loaderData.type === 'service') {
    return <SecteurServiceView data={loaderData} />;
  } else {
    return <SecteurVilleView data={loaderData} />;
  }
}

// ============================================================================
// SECTEUR + SERVICE VIEW
// ============================================================================
function SecteurServiceView({ data }: { data: any }) {
  const { secteur, service, otherServices, otherSecteurs, priorityVilles } = data;

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
      "price": service.prixNum || 299,
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
              <Breadcrumbs 
                segments={[
                  { label: 'Secteurs', path: '/secteur' },
                  { label: secteur.nom, path: `/secteur/${secteur.slug}` },
                  { label: service.nom }
                ]}
              />

              <div className="text-center mt-6">
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

        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-16">
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

              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Ce qui est inclus</h2>
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

              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  <MapPin className="inline w-8 h-8 mr-2 text-[var(--accent)]" />
                  Disponible dans le Val-d'Oise
                </h2>
                <p className="text-gray-600 mb-6">
                  Nous livrons dans toutes les villes du département 95. Voici les principales :
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {priorityVilles.slice(0, 8).map((ville: any) => (
                    <Link
                      key={ville.slug}
                      to={`/secteur/${secteur.slug}/${ville.slug}`}
                      className="p-3 bg-gray-50 rounded-xl text-center hover:bg-[var(--accent)]/10 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{ville.nom}</span>
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Questions fréquentes</h2>
                <div className="space-y-4">
                  {secteur.faq.map((item: any, index: number) => (
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

            <Sidebar
              currentSecteur={secteur}
              otherSecteurs={otherSecteurs}
              showCities={false}
            />
          </div>
        </div>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Autres offres pour {secteur.nomPluriel.toLowerCase()}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
              {otherServices.map((s: any) => (
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

// ============================================================================
// SECTEUR + VILLE VIEW
// ============================================================================
function SecteurVilleView({ data }: { data: any }) {
  const { secteur, ville, content, nearbyVilles, priorityVilles, otherSecteurs, services } = data;

  const schemaOrg = generateServiceSchema(secteur, ville);

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <main className="pt-20">
        <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1d1d1f_1px,transparent_1px),linear-gradient(to_bottom,#1d1d1f_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <Breadcrumbs segments={[
                  { label: 'Secteurs', path: '/secteur' },
                  { label: secteur.nom, path: `/secteur/${secteur.slug}` },
                  { label: ville.nom }
                ]} />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-3xl mt-6"
                >
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm font-medium">
                      {secteur.icon} {secteur.nom}
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      <MapPin className="w-4 h-4" />
                      {ville.nom} ({ville.codePostal})
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    {content.h1}
                  </h1>

                  <p className="text-xl text-gray-600 mb-8">{content.intro}</p>

                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                    <div className="text-2xl font-bold text-gray-900">
                      À partir de <span className="text-[var(--accent)]">299€</span>
                    </div>
                    <Link to="/commander">
                      <Button size="lg" className="text-lg px-8">
                        Créer mon site {secteur.nom.toLowerCase()}
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
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

                <LocalContext
                  ville={ville}
                  description={generateVilleDescription(ville)}
                />

                <section className="py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Pourquoi un site web pour {secteur.nom.toLowerCase()} à {ville.nom} ?
                  </h2>
                  <p className="text-lg text-gray-700 mb-8">{content.problematique}</p>

                  <div className="space-y-4">
                    {content.arguments.map((arg: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{arg}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>

                <section className="py-12 bg-gray-50 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Fonctionnalités recommandées pour {secteur.nomPluriel.toLowerCase()}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {content.fonctionnalites.map((feature: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-4 bg-white rounded-xl"
                      >
                        <Zap className="w-5 h-5 text-[var(--accent)] flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>

                <section className="py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Nos offres pour {secteur.nom.toLowerCase()} à {ville.nom}
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-6">
                    {services.map((service: any) => (
                      <Link
                        key={service.id}
                        to="/commander"
                        className="group block p-6 bg-white rounded-2xl border border-gray-200 hover:border-[var(--accent)] hover:shadow-lg transition-all"
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--accent)]">
                          {service.nom}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-[var(--accent)]">{service.prix}</span>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>

                <LocalFAQ
                  title={`Questions fréquentes — ${secteur.nom} à ${ville.nom}`}
                  faq={content.faq}
                  ville={ville.nom}
                />

                {nearbyVilles.length > 0 && (
                  <section className="py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {secteur.nom} dans les villes voisines
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {nearbyVilles.map((nearbyVille: any) => (
                        <Link
                          key={nearbyVille.slug}
                          to={`/secteur/${secteur.slug}/${nearbyVille.slug}`}
                          className="p-4 bg-gray-50 rounded-xl hover:bg-[var(--accent)]/10 transition-colors text-center"
                        >
                          <span className="font-medium text-gray-900">{nearbyVille.nom}</span>
                          <span className="block text-sm text-gray-500">{nearbyVille.codePostal}</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <aside className="lg:col-span-1">
                <Sidebar
                  currentSecteur={secteur}
                  otherSecteurs={otherSecteurs}
                  priorityVilles={priorityVilles}
                  showCities={true}
                />
              </aside>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Autres secteurs à {ville.nom}
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherSecteurs.slice(0, 8).map((s: any) => (
                <Link
                  key={s.slug}
                  to={`/secteur/${s.slug}/${ville.slug}`}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl hover:bg-[var(--accent)]/10 transition-colors group"
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="font-medium text-gray-900 group-hover:text-[var(--accent)]">{s.nom}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à lancer votre site {secteur.nom.toLowerCase()} à {ville.nom} ?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Commandez maintenant et recevez votre site en quelques heures.
              À partir de 299€ seulement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/commander">
                <Button size="lg" className="text-lg px-8 bg-white text-gray-900 hover:bg-gray-100">
                  Commander mon site
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="tel:+33600000000" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
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


