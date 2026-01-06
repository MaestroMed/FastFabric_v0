import { Link } from 'react-router';
import { MapPin, Briefcase, FileText, Mail, Phone } from 'lucide-react';

// Villes prioritaires du 95 pour le maillage SEO
const villesPrioritaires = [
  { nom: 'Argenteuil', slug: 'argenteuil' },
  { nom: 'Cergy', slug: 'cergy' },
  { nom: 'Pontoise', slug: 'pontoise' },
  { nom: 'Sarcelles', slug: 'sarcelles' },
  { nom: 'Franconville', slug: 'franconville' },
  { nom: 'Ermont', slug: 'ermont' },
  { nom: 'Goussainville', slug: 'goussainville' },
  { nom: 'Bezons', slug: 'bezons' },
];

// Secteurs principaux pour le maillage SEO
const secteursPrincipaux = [
  { nom: 'Avocat', slug: 'avocat', icon: '⚖️' },
  { nom: 'Restaurant', slug: 'restaurant', icon: '🍽️' },
  { nom: 'Artisan', slug: 'artisan', icon: '🔧' },
  { nom: 'Immobilier', slug: 'immobilier', icon: '🏠' },
  { nom: 'Santé', slug: 'sante', icon: '🩺' },
  { nom: 'Coach', slug: 'coach', icon: '🎯' },
];

const footerLinks = {
  product: [
    { href: '/#offres', label: 'Tarifs' },
    { href: '/#realisations', label: 'Réalisations' },
    { href: '/#process', label: 'Processus' },
    { href: '/commander', label: 'Commander' },
  ],
  services: [
    { href: '/site-vitrine', label: 'Site Vitrine' },
    { href: '/landing-page', label: 'Landing Page' },
    { href: '/site-sur-mesure', label: 'Sur Mesure' },
  ],
  resources: [
    { href: '/blog', label: 'Blog' },
    { href: '/#faq', label: 'FAQ' },
  ],
  legal: [
    { href: '/cgv', label: 'CGV' },
    { href: '/confidentialite', label: 'Confidentialité' },
    { href: '/mentions-legales', label: 'Mentions légales' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Main footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                F
              </div>
              <span className="font-bold text-lg">FastFabric</span>
            </Link>
            <p className="text-gray-600 text-sm mb-4 max-w-xs">
              Sites web sur mesure, livrés en 2 heures. Design unique, qualité premium, prix transparent.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <a href="mailto:contact@fastfabric.fr" className="flex items-center gap-2 hover:text-gray-900">
                <Mail className="w-4 h-4" />
                contact@fastfabric.fr
              </a>
              <a href="tel:+33757847424" className="flex items-center gap-2 hover:text-gray-900">
                <Phone className="w-4 h-4" />
                07 57 84 74 24
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Ressources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Secteurs */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Secteurs
            </h4>
            <ul className="space-y-2">
              {secteursPrincipaux.map((secteur) => (
                <li key={secteur.slug}>
                  <Link
                    to={`/secteur/${secteur.slug}`}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                  >
                    <span>{secteur.icon}</span>
                    {secteur.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Légal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SEO Cities Section */}
        <div className="py-8 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Création de site web dans le Val-d'Oise (95)
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {villesPrioritaires.map((ville) => (
              <Link
                key={ville.slug}
                to={`/site-vitrine/${ville.slug}`}
                className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors"
              >
                Site web {ville.nom}
              </Link>
            ))}
            <Link
              to="/site-vitrine"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              Toutes les villes →
            </Link>
          </div>
        </div>

        {/* Blog links for SEO */}
        <div className="py-8 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Derniers articles
          </h4>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              to="/blog/comment-creer-site-vitrine-efficace"
              className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors"
            >
              Comment créer un site vitrine efficace
            </Link>
            <Link
              to="/blog/site-vitrine-vs-landing-page-que-choisir"
              className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors"
            >
              Site vitrine vs Landing page
            </Link>
            <Link
              to="/blog"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              Tous les articles →
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} FastFabric. Tous droits réservés.</p>
          <p>
            Sites web professionnels livrés en 2 heures dans le Val-d'Oise (95)
          </p>
        </div>
      </div>
    </footer>
  );
}
