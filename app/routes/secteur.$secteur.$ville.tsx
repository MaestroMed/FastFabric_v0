/**
 * Route dynamique : /secteur/:secteur/:ville
 * Pages Secteur x Ville pour les 10 villes prioritaires (120 pages)
 * Exemple: /secteur/avocat/argenteuil
 */

import type { Route } from "./+types/secteur.$secteur.$ville";
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

import { getSecteurBySlug, secteurs } from '~/data/secteurs';
import { 
  getVilleBySlug, 
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

export function meta({ params }: Route.MetaArgs) {
  const secteur = getSecteurBySlug(params.secteur!);
  const ville = getVilleBySlug(params.ville!);

  if (!secteur || !ville) {
    return [{ title: 'Page non trouvée — FastFabric' }];
  }

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

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const secteur = getSecteurBySlug(params.secteur!);
  const ville = getVilleBySlug(params.ville!);

  if (!secteur || !ville) {
    throw new Response('Not Found', { status: 404 });
  }

  const content = generateSecteurVilleContent(ville, secteur, secteurs);
  const nearbyVilles = getNearbyVilles(ville);
  const priorityVilles = getVillesPrioritaires().filter(v => v.slug !== ville.slug).slice(0, 5);
  const otherSecteurs = secteurs.filter(s => s.id !== secteur.id).slice(0, 5);

  return { 
    secteur, 
    ville, 
    content, 
    nearbyVilles, 
    priorityVilles,
    otherSecteurs,
    services 
  };
}

export default function SecteurVillePage({ loaderData }: Route.ComponentProps) {
  const { secteur, ville, content, nearbyVilles, priorityVilles, otherSecteurs, services } = loaderData;

  const schemaOrg = generateServiceSchema(secteur, ville);

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
                  className="max-w-3xl"
                >
                  {/* Badges */}
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

                  <p className="text-xl text-gray-600 mb-8">
                    {content.intro}
                  </p>

                  {/* Price & CTA */}
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

                  {/* Trust indicators */}
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

                {/* Local Context */}
                <LocalContext
                  ville={ville}
                  description={generateVilleDescription(ville)}
                />

                {/* Problématique du secteur */}
                <section className="py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Pourquoi un site web pour {secteur.nom.toLowerCase()} à {ville.nom} ?
                  </h2>
                  <p className="text-lg text-gray-700 mb-8">
                    {content.problematique}
                  </p>

                  {/* Arguments */}
                  <div className="space-y-4">
                    {content.arguments.map((arg, index) => (
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

                {/* Fonctionnalités recommandées */}
                <section className="py-12 bg-gray-50 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Fonctionnalités recommandées pour {secteur.nomPluriel.toLowerCase()}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {content.fonctionnalites.map((feature, index) => (
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

                {/* Services */}
                <section className="py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Nos offres pour {secteur.nom.toLowerCase()} à {ville.nom}
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-6">
                    {services.map((service) => (
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

                {/* FAQ */}
                <LocalFAQ
                  title={`Questions fréquentes — ${secteur.nom} à ${ville.nom}`}
                  faq={content.faq}
                  ville={ville.nom}
                />

                {/* Nearby cities */}
                {nearbyVilles.length > 0 && (
                  <section className="py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {secteur.nom} dans les villes voisines
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {nearbyVilles.map((nearbyVille) => (
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

              {/* Sidebar */}
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

        {/* Other Sectors */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Autres secteurs à {ville.nom}
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherSecteurs.slice(0, 8).map((s) => (
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

        {/* CTA */}
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
              <a href="tel:+33757847424" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
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

