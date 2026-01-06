/**
 * Système de génération de contenu contextuel
 * Génère du contenu unique pour chaque page locale/sectorielle
 * Respect des guidelines Google : pas de thin content, pas de doorway pages
 */

import type { Ville } from '~/data/villes-95';
import { 
  services, 
  generateVilleDescription, 
  generateVilleArguments, 
  generateLocalFAQ,
  getNearbyVilles 
} from '~/data/villes-95';
import { 
  generateAccroche, 
  generateArguments, 
  getSecteursForVille,
  generateEconomicContext,
  generateStats 
} from '~/data/content-templates';
import type { Secteur } from '~/data/secteurs';

// ============================================================================
// TYPES
// ============================================================================
export interface LocalPageContent {
  // BLOC 1: Hero
  h1: string;
  accroche: string;
  badge: string;
  
  // BLOC 2: Contexte local
  villeDescription: string;
  economicContext: string;
  stats: { label: string; value: string }[];
  
  // BLOC 3: Argumentaire
  arguments: string[];
  
  // BLOC 4: Features du service
  features: string[];
  
  // BLOC 5: Secteurs locaux
  localSecteurs: Secteur[];
  
  // BLOC 6: Maillage géographique
  nearbyVilles: Ville[];
  
  // BLOC 7: FAQ locale
  faq: { question: string; answer: string }[];
  
  // BLOC 8: CTA
  ctaTitle: string;
  ctaSubtitle: string;
  price: string;
}

export interface SecteurVilleContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  problematique: string;
  fonctionnalites: string[];
  arguments: string[];
  faq: { question: string; answer: string }[];
  nearbyVilles: Ville[];
  otherSecteurs: Secteur[];
  services: typeof services;
}

// ============================================================================
// GÉNÉRATEUR DE CONTENU LOCAL (Service + Ville)
// ============================================================================
export function generateLocalPageContent(
  ville: Ville, 
  service: typeof services[0]
): LocalPageContent {
  const nearbyVilles = getNearbyVilles(ville);
  
  return {
    // BLOC 1: Hero dynamique
    h1: `${service.nom} à ${ville.nom}`,
    accroche: generateAccroche(ville),
    badge: `${ville.nom} (${ville.codePostal})`,
    
    // BLOC 2: Contexte local unique
    villeDescription: generateVilleDescription(ville),
    economicContext: generateEconomicContext(ville),
    stats: generateStats(ville),
    
    // BLOC 3: Argumentaire adapté
    arguments: generateVilleArguments(ville, service),
    
    // BLOC 4: Features du service
    features: service.features || [
      'Design sur mesure',
      'Livraison express',
      'Code source fourni',
      'Responsive mobile',
      'SEO optimisé',
      'Support inclus',
    ],
    
    // BLOC 5: Secteurs locaux
    localSecteurs: getSecteursForVille(ville),
    
    // BLOC 6: Maillage géographique
    nearbyVilles,
    
    // BLOC 7: FAQ locale
    faq: generateLocalFAQ(ville, service),
    
    // BLOC 8: CTA
    ctaTitle: `Lancez votre ${service.nom.toLowerCase()} à ${ville.nom}`,
    ctaSubtitle: nearbyVilles.length > 0 
      ? `Nous desservons ${ville.nom} et les communes voisines : ${nearbyVilles.slice(0, 3).map(v => v.nom).join(', ')}...`
      : `Nous desservons ${ville.nom} et l'ensemble du Val-d'Oise.`,
    price: service.prix,
  };
}

// ============================================================================
// GÉNÉRATEUR DE CONTENU SECTEUR + VILLE (pour villes prioritaires)
// ============================================================================
export function generateSecteurVilleContent(
  ville: Ville,
  secteur: Secteur,
  allSecteurs: Secteur[]
): SecteurVilleContent {
  const nearbyVilles = getNearbyVilles(ville);
  const otherSecteurs = allSecteurs.filter(s => s.id !== secteur.id).slice(0, 5);
  
  // Générer l'intro contextuelle
  const intro = generateSecteurVilleIntro(ville, secteur);
  
  // Générer les arguments spécifiques au secteur + ville
  const contentArguments = generateSecteurVilleArguments(ville, secteur);
  
  // Générer la FAQ combinée
  const faq = generateSecteurVilleFAQ(ville, secteur);
  
  return {
    h1: `${secteur.nom} à ${ville.nom} : Création de site web`,
    metaTitle: `Site Web ${secteur.nom} à ${ville.nom} | Création 2h | FastFabric`,
    metaDescription: `Création de site web professionnel pour ${secteur.nom.toLowerCase()} à ${ville.nom}. ${secteur.problematique.slice(0, 80)}... Livré en 2h, à partir de 299€.`,
    intro,
    problematique: secteur.problematique,
    fonctionnalites: secteur.fonctionnalites,
    arguments: contentArguments,
    faq,
    nearbyVilles,
    otherSecteurs,
    services,
  };
}

function generateSecteurVilleIntro(ville: Ville, secteur: Secteur): string {
  const population = ville.population?.toLocaleString() || 'plusieurs milliers d\'';
  
  const intros: Record<string, string> = {
    avocat: `Les cabinets d'avocats de ${ville.nom} font face à une concurrence accrue. Dans une ville de ${population} habitants, un site web professionnel est devenu indispensable pour attirer de nouveaux clients et affirmer votre expertise juridique.`,
    restaurant: `${ville.nom} compte de nombreux restaurants et établissements culinaires. Pour vous démarquer dans cette ville de ${population} habitants, votre site web doit donner envie, présenter votre carte et faciliter les réservations.`,
    artisan: `Les artisans de ${ville.nom} — plombiers, électriciens, menuisiers — sont sollicités dans toute la zone. Un site web professionnel vous permet de recevoir des demandes de devis qualifiées et de rayonner au-delà de ${ville.nom}.`,
    immobilier: `Le marché immobilier de ${ville.nom} est actif, avec ${population} habitants et une demande constante. Votre agence ou cabinet d'agent immobilier a besoin d'un site qui affirme votre expertise locale.`,
    sante: `Les professionnels de santé de ${ville.nom} — médecins, kinés, dentistes — répondent aux besoins d'une population de ${population} habitants. Un site web avec prise de RDV facilite l'accès aux soins.`,
    beaute: `Coiffeurs et esthéticiennes de ${ville.nom} misent sur l'image et la fidélisation. Votre site web doit refléter votre univers et permettre à vos clients de réserver facilement.`,
    commerce: `Les commerces de proximité de ${ville.nom} font face à la concurrence des grandes enseignes. Un site web professionnel renforce votre identité locale et attire les habitants des alentours.`,
    coach: `Coachs et consultants à ${ville.nom} doivent démontrer leur expertise pour convaincre. Un site web impactant, avec témoignages et prise de RDV, convertit les visiteurs en clients.`,
    association: `Les associations de ${ville.nom} ont besoin de visibilité pour recruter des adhérents et des bénévoles. Un site web simple et efficace sert votre mission.`,
    'auto-entrepreneur': `Les auto-entrepreneurs de ${ville.nom} cherchent à se faire connaître sans exploser leur budget. Une landing page professionnelle à 299€ est la solution idéale.`,
    'pme-tpe': `Les PME et TPE de ${ville.nom} ont besoin d'un site qui reflète leur professionnalisme. Notre Site Vitrine à 599€ présente votre entreprise sous son meilleur jour.`,
    startup: `Les startups près de ${ville.nom} doivent valider rapidement leur concept. Une landing page impactante permet de tester le marché et de collecter des leads.`,
  };
  
  return intros[secteur.id] || `Les ${secteur.nomPluriel.toLowerCase()} de ${ville.nom} ont besoin d'un site web professionnel pour développer leur activité dans cette ville de ${population} habitants.`;
}

function generateSecteurVilleArguments(ville: Ville, secteur: Secteur): string[] {
  const baseArguments = [
    `Un site web professionnel inspire confiance aux ${secteur.id === 'avocat' ? 'justiciables' : 'clients'} de ${ville.nom}`,
    `Apparaissez en première page sur les recherches "${secteur.nom.toLowerCase()} ${ville.nom}"`,
    `Recevez des demandes qualifiées 24h/24, même quand vous êtes occupé`,
    `Démarquez-vous des concurrents qui n'ont pas encore de site moderne`,
  ];
  
  if (ville.hasGare) {
    baseArguments.push(`La gare de ${ville.nom} amène des clients potentiels de toute l'Île-de-France`);
  }
  
  if (ville.population && ville.population > 30000) {
    baseArguments.push(`Dans une ville de ${ville.population.toLocaleString()} habitants, la concurrence est forte : démarquez-vous en ligne`);
  }
  
  return baseArguments.slice(0, 5);
}

function generateSecteurVilleFAQ(ville: Ville, secteur: Secteur): { question: string; answer: string }[] {
  const faq = [
    {
      question: `Combien coûte un site web pour ${secteur.nom.toLowerCase()} à ${ville.nom} ?`,
      answer: `Chez FastFabric, une Landing Page pour ${secteur.nom.toLowerCase()} coûte 299€, un Site Vitrine 599€. Prix identiques pour ${ville.nom} et toutes les communes du Val-d'Oise.`,
    },
    {
      question: `En combien de temps est livré mon site à ${ville.nom} ?`,
      answer: `Votre site web est livré en 2 à 4 heures après validation de vos informations. FastFabric dessert ${ville.nom} et l'ensemble du département 95.`,
    },
    ...secteur.faq.slice(0, 2),
  ];
  
  return faq;
}

// ============================================================================
// GÉNÉRATION DE MÉTA TAGS
// ============================================================================
export function generateLocalMetaTags(ville: Ville, service: typeof services[0]) {
  return {
    title: `${service.nom} à ${ville.nom} (${ville.codePostal}) | Livraison 2h | FastFabric`,
    description: `Création de ${service.nom.toLowerCase()} à ${ville.nom}. ${ville.population ? `Ville de ${ville.population.toLocaleString()} hab.` : ''} Livraison en 2h, design sur mesure, à partir de ${service.prix}. Devis gratuit.`,
    keywords: [
      `${service.nom.toLowerCase()} ${ville.nom}`,
      `création site ${ville.nom}`,
      `agence web ${ville.nom}`,
      `site internet ${ville.codePostal}`,
      `webdesigner ${ville.nom}`,
    ].join(', '),
  };
}

export function generateSecteurVilleMetaTags(ville: Ville, secteur: Secteur) {
  return {
    title: `Site Web ${secteur.nom} à ${ville.nom} | Création 2h | FastFabric`,
    description: `Création de site web pour ${secteur.nom.toLowerCase()} à ${ville.nom}. ${secteur.problematique.slice(0, 80)}... À partir de 299€, livré en 2h.`,
    keywords: [
      `site ${secteur.nom.toLowerCase()} ${ville.nom}`,
      ...secteur.keywords.slice(0, 3),
      `création site ${ville.nom}`,
    ].join(', '),
  };
}

// ============================================================================
// SCHEMA.ORG GÉNÉRATION
// ============================================================================
export function generateLocalBusinessSchema(ville: Ville, service: typeof services[0]) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "FastFabric",
    "description": `Création de ${service.nom.toLowerCase()} à ${ville.nom}`,
    "url": `https://fastfabric.fr/${service.slug}/${ville.slug}`,
    "areaServed": {
      "@type": "City",
      "name": ville.nom,
      "postalCode": ville.codePostal,
      "addressCountry": "FR"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": service.nom,
      "itemListElement": [{
        "@type": "Offer",
        "name": `${service.nom} à ${ville.nom}`,
        "price": service.prixNum || 299,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      }]
    },
    "priceRange": service.prix,
    "telephone": "+33757847424",
    "email": "contact@fastfabric.fr"
  };
}

export function generateServiceSchema(secteur: Secteur, ville: Ville) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Création de site web pour ${secteur.nom}`,
    "description": secteur.problematique,
    "provider": {
      "@type": "Organization",
      "name": "FastFabric",
      "url": "https://fastfabric.fr"
    },
    "serviceType": `Site web ${secteur.nom}`,
    "areaServed": {
      "@type": "City",
      "name": ville.nom,
      "postalCode": ville.codePostal
    },
    "offers": services.map(s => ({
      "@type": "Offer",
      "name": `${s.nom} pour ${secteur.nom} à ${ville.nom}`,
      "price": s.prixNum || 0,
      "priceCurrency": "EUR"
    }))
  };
}

