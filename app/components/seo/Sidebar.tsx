/**
 * SEO Sidebar Component for Internal Linking
 * Enhanced version with better geographic and sectoral linking
 */

import { Link } from 'react-router';
import { MapPin, Briefcase, FileText, ArrowRight, Building2 } from 'lucide-react';
import type { Ville } from '~/data/villes-95';
import type { Secteur } from '~/data/secteurs';
import { services as allServices } from '~/data/villes-95';

interface SidebarProps {
  // Current context
  currentService?: typeof allServices[0];
  currentVille?: Ville;
  currentSecteur?: Secteur;
  
  // Related content
  nearbyVilles?: Ville[];
  priorityVilles?: Ville[];
  otherSecteurs?: Secteur[];
  relatedSecteurs?: Secteur[];
  relatedArticles?: { slug: string; title: string }[];
  
  // Display options
  showCities?: boolean;
  showSectors?: boolean;
  className?: string;
}

export function Sidebar({
  currentService,
  currentVille,
  currentSecteur,
  nearbyVilles = [],
  priorityVilles = [],
  otherSecteurs = [],
  relatedSecteurs = [],
  relatedArticles = [],
  showCities = true,
  showSectors = true,
  className = '',
}: SidebarProps) {
  // Merge related secteurs and other secteurs
  const secteursList = relatedSecteurs.length > 0 ? relatedSecteurs : otherSecteurs;
  
  // Determine which cities to show
  const citiesToShow = nearbyVilles.length > 0 ? nearbyVilles : priorityVilles;
  
  // Build the correct link based on context
  const getCityLink = (ville: Ville) => {
    if (currentSecteur) {
      return `/secteur/${currentSecteur.slug}/${ville.slug}`;
    }
    if (currentService) {
      return `/${currentService.slug}/${ville.slug}`;
    }
    return `/site-vitrine/${ville.slug}`;
  };

  const getSecteurLink = (secteur: Secteur) => {
    if (currentVille) {
      return `/secteur/${secteur.slug}/${currentVille.slug}`;
    }
    return `/secteur/${secteur.slug}`;
  };

  return (
    <aside className={`space-y-6 sticky top-24 ${className}`}>
      {/* Nearby/Priority Cities */}
      {showCities && citiesToShow.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
            <MapPin className="w-5 h-5 text-[var(--accent)]" />
            {nearbyVilles.length > 0 ? 'Villes proches' : 'Villes principales'}
          </h3>
          <ul className="space-y-2">
            {citiesToShow.slice(0, 6).map((ville) => (
              <li key={ville.slug}>
                <Link
                  to={getCityLink(ville)}
                  className="flex items-center justify-between text-gray-600 hover:text-[var(--accent)] transition-colors py-1.5 px-2 rounded-lg hover:bg-gray-50"
                >
                  <span className="font-medium">{ville.nom}</span>
                  <span className="text-xs text-gray-400">{ville.codePostal}</span>
                </Link>
              </li>
            ))}
          </ul>
          {currentService && (
            <Link
              to={`/${currentService.slug}`}
              className="flex items-center gap-1 text-sm text-[var(--accent)] mt-4 hover:underline font-medium"
            >
              Toutes les villes du 95
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}

      {/* Related Sectors */}
      {showSectors && secteursList.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
            <Briefcase className="w-5 h-5 text-[var(--accent)]" />
            {currentVille ? `Secteurs à ${currentVille.nom}` : 'Secteurs d\'activité'}
          </h3>
          <ul className="space-y-2">
            {secteursList.slice(0, 6).map((secteur) => (
              <li key={secteur.slug}>
                <Link
                  to={getSecteurLink(secteur)}
                  className="flex items-center gap-2 text-gray-600 hover:text-[var(--accent)] transition-colors py-1.5 px-2 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-lg">{secteur.icon}</span>
                  <span className="font-medium">{secteur.nom}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Services disponibles */}
      {!currentService && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
            <Building2 className="w-5 h-5 text-[var(--accent)]" />
            Nos offres
          </h3>
          <ul className="space-y-3">
            {allServices.map((service) => (
              <li key={service.slug}>
                <Link
                  to={currentVille ? `/${service.slug}/${currentVille.slug}` : `/${service.slug}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-[var(--accent)]/10 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-gray-900 block">{service.nom}</span>
                    <span className="text-sm text-gray-500">{service.description}</span>
                  </div>
                  <span className="font-bold text-[var(--accent)]">{service.prix}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
            <FileText className="w-5 h-5 text-[var(--accent)]" />
            Articles liés
          </h3>
          <ul className="space-y-3">
            {relatedArticles.slice(0, 4).map((article) => (
              <li key={article.slug}>
                <Link
                  to={`/blog/${article.slug}`}
                  className="block text-gray-600 hover:text-[var(--accent)] transition-colors leading-snug py-1"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/blog"
            className="flex items-center gap-1 text-sm text-[var(--accent)] mt-4 hover:underline font-medium"
          >
            Tous les articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <h3 className="font-bold text-lg mb-2">
          Besoin d'un site web ?
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          Livraison en 2 heures, design sur mesure, à partir de 299€.
        </p>
        <Link
          to="/commander"
          className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors"
        >
          Commander maintenant
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
