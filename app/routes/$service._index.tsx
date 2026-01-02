/**
 * Service Index Page - Lists all cities for a service
 * Routes: /site-vitrine, /landing-page, /site-sur-mesure
 */

import type { Route } from "./+types/$service._index";
import { Link } from 'react-router';
import { Header } from '~/components/layout/Header';
import { Footer } from '~/components/layout/Footer';
import { Button } from '~/components/ui/Button';
import { 
  villes95, 
  services, 
  getServiceBySlug,
  getVillesPrioritaires 
} from '~/data/villes-95';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';

export function meta({ params }: Route.MetaArgs) {
  const service = getServiceBySlug(params.service!);
  
  if (!service) {
    return [{ title: 'Service non trouvé — FastFabric' }];
  }

  return [
    { title: `${service.nom} Val-d'Oise (95) | Création web toutes villes | FastFabric` },
    { name: 'description', content: `Création de ${service.nom.toLowerCase()} dans tout le Val-d'Oise (95). 184 communes couvertes. Livraison 2h, design sur mesure, à partir de ${service.prix}.` },
    { property: 'og:title', content: `${service.nom} dans le Val-d'Oise (95) — FastFabric` },
    { name: 'geo.region', content: 'FR-95' },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const service = getServiceBySlug(params.service!);
  
  if (!service) {
    throw new Response('Not Found', { status: 404 });
  }

  const priorityVilles = getVillesPrioritaires();
  const otherVilles = villes95.filter(v => !v.isPrioritaire);
  const otherServices = services.filter(s => s.slug !== service.slug);

  return { service, priorityVilles, otherVilles, otherServices };
}

export default function ServiceIndex({ loaderData }: Route.ComponentProps) {
  const { service, priorityVilles, otherVilles, otherServices } = loaderData;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVilles = searchQuery
    ? [...priorityVilles, ...otherVilles].filter(v => 
        v.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.codePostal.includes(searchQuery)
      )
    : null;

  return (
    <>
      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm font-medium mb-6">
                <MapPin className="w-4 h-4" />
                Val-d'Oise (95) • 184 communes
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                {service.nom} dans le Val-d'Oise
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Création de {service.nom.toLowerCase()} dans toutes les villes du département 95.
                Livraison express en 2 heures, design sur mesure.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <span className="text-2xl font-bold text-gray-900">
                  À partir de <span className="text-[var(--accent)]">{service.prix}</span>
                </span>
                <Link to="/commander">
                  <Button size="lg">
                    Commander maintenant
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto px-6">
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher votre ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Search Results */}
        {filteredVilles && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {filteredVilles.length} résultat{filteredVilles.length > 1 ? 's' : ''} pour "{searchQuery}"
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredVilles.map((ville) => (
                  <Link
                    key={ville.slug}
                    to={`/${service.slug}/${ville.slug}`}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-[var(--accent)]/10 transition-colors group text-center"
                  >
                    <p className="font-semibold text-gray-900 group-hover:text-[var(--accent)]">
                      {ville.nom}
                    </p>
                    <p className="text-sm text-gray-500">{ville.codePostal}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Priority Cities */}
        {!filteredVilles && (
          <>
            <section className="py-16 bg-white">
              <div className="container mx-auto px-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  🏆 Grandes villes du Val-d'Oise
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {priorityVilles.map((ville, index) => (
                    <motion.div
                      key={ville.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/${service.slug}/${ville.slug}`}
                        className="block p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl hover:scale-105 transition-transform"
                      >
                        <h3 className="text-xl font-bold mb-1">{ville.nom}</h3>
                        <p className="text-gray-400 text-sm">{ville.codePostal}</p>
                        {ville.population && (
                          <p className="text-xs text-gray-500 mt-2">
                            {ville.population.toLocaleString()} habitants
                          </p>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* All Cities */}
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  📍 Toutes les communes du 95
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {otherVilles.map((ville) => (
                    <Link
                      key={ville.slug}
                      to={`/${service.slug}/${ville.slug}`}
                      className="p-3 bg-white rounded-xl hover:bg-[var(--accent)]/10 transition-colors group text-center border border-gray-100"
                    >
                      <p className="font-medium text-gray-900 group-hover:text-[var(--accent)] text-sm">
                        {ville.nom}
                      </p>
                      <p className="text-xs text-gray-400">{ville.codePostal}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Other Services */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Autres services dans le Val-d'Oise
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {otherServices.map((s) => (
                <Link
                  key={s.slug}
                  to={`/${s.slug}`}
                  className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-[var(--accent)]/10 transition-colors"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{s.nom}</h3>
                    <p className="text-gray-600">{s.description}</p>
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
              Votre ville n'est pas listée ?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Pas de problème ! Nous livrons partout en Île-de-France.
            </p>
            <Link to="/commander">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Commander maintenant
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

