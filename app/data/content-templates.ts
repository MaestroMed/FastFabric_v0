/**
 * Templates de contenu dynamique pour générer du contenu unique
 * anti-thin content et anti-doorway pages
 */

import type { Ville, VilleType } from './villes-95';
import { secteurs, type Secteur } from './secteurs';

// ============================================================================
// TEMPLATES D'ACCROCHES SELON LE TYPE DE VILLE
// ============================================================================
export const accrochesParType: Record<VilleType, string[]> = {
  grande_ville: [
    "Dans une métropole dynamique comme {ville}, un site web professionnel est indispensable pour se démarquer.",
    "Avec plus de {population} habitants, {ville} offre un marché considérable pour votre activité en ligne.",
    "{ville}, pôle économique majeur du Val-d'Oise, mérite une présence digitale à la hauteur de son dynamisme.",
    "Les entreprises de {ville} ont besoin d'un site web moderne pour capter leur part du marché local.",
  ],
  ville_moyenne: [
    "{ville} est une commune où la proximité compte. Un site web renforce votre ancrage local.",
    "Dans une ville comme {ville}, votre site web devient votre meilleur ambassadeur 24h/24.",
    "Les habitants de {ville} cherchent en ligne avant d'acheter local. Soyez visible.",
    "{ville} et ses {population} habitants représentent un bassin de clients à conquérir en ligne.",
  ],
  commune_rurale: [
    "Même dans une commune comme {ville}, le digital est un levier de croissance puissant.",
    "À {ville}, un site web vous permet de rayonner bien au-delà des limites de la commune.",
    "Les artisans et commerces de {ville} gagnent à être présents sur Internet.",
    "{ville}, au cœur du Vexin, mérite une vitrine digitale moderne.",
  ],
};

// ============================================================================
// TEMPLATES D'ARGUMENTS SELON CONTEXTE
// ============================================================================
export const argumentsContextuels = {
  gare: [
    "La gare de {ville} draine un flux quotidien de voyageurs qui peuvent devenir vos clients.",
    "Proche de la gare, votre site web capte les recherches mobiles des voyageurs.",
    "Les usagers de la gare de {ville} cherchent des services locaux sur leur smartphone.",
  ],
  zone_commerciale: [
    "Complétez votre présence en zone commerciale par une vitrine digitale performante.",
    "Les zones d'activités de {ville} regroupent de nombreuses entreprises qui peuvent devenir vos clients.",
    "Dans un environnement commercial concurrentiel, le digital fait la différence.",
  ],
  proximite_paris: [
    "À proximité de Paris, {ville} bénéficie d'un dynamisme économique propice aux affaires.",
    "Les professionnels de {ville} servent une clientèle francilienne exigeante.",
    "Entre Paris et la campagne, {ville} attire des clients avec des besoins variés.",
  ],
  proximite_roissy: [
    "Proche de Roissy, {ville} est au cœur d'un bassin économique international.",
    "Les entreprises près de l'aéroport Charles de Gaulle ont besoin d'une image pro en ligne.",
    "Zone aéroportuaire oblige, les standards de professionnalisme sont élevés.",
  ],
};

// ============================================================================
// TEMPLATES DE FAQ LOCALES
// ============================================================================
export const faqTemplates = {
  prix: {
    question: "Quel est le prix d'un site web à {ville} ?",
    answer: "FastFabric propose des tarifs fixes et transparents : Landing Page à 299€, Site Vitrine à 599€. Ces prix sont identiques pour {ville} et toutes les communes du Val-d'Oise. Pas de surcoût géographique.",
  },
  delai: {
    question: "En combien de temps mon site sera-t-il prêt à {ville} ?",
    answer: "Votre site web est livré en 2 à 4 heures après validation de vos informations, que vous soyez à {ville} ou ailleurs dans le 95. C'est notre engagement FastFabric.",
  },
  zone: {
    question: "Intervenez-vous à {ville} et dans les environs ?",
    answer: "Oui, FastFabric dessert l'ensemble du Val-d'Oise (95), dont {ville} et les communes voisines : {villes_voisines}. Notre service est 100% en ligne pour une livraison rapide.",
  },
  qualite: {
    question: "La qualité est-elle la même pour une petite commune comme {ville} ?",
    answer: "Absolument. Que vous soyez à {ville} ou dans une grande ville, vous bénéficiez du même niveau de qualité : design sur mesure, code propre, et optimisation SEO incluse.",
  },
  suivi: {
    question: "Proposez-vous un accompagnement après la livraison à {ville} ?",
    answer: "Oui, FastFabric propose des forfaits de maintenance et un support réactif pour tous nos clients du Val-d'Oise, y compris à {ville}.",
  },
  seo_local: {
    question: "Mon site sera-t-il visible sur Google à {ville} ?",
    answer: "Nous optimisons chaque site pour le référencement local. Votre entreprise à {ville} apparaîtra sur les recherches type 'votre métier + {ville}' et générera des contacts qualifiés.",
  },
};

// ============================================================================
// TEMPLATES DE TITRES H2
// ============================================================================
export const h2Templates = {
  contexte: [
    "Votre site web à {ville}",
    "{ville} : l'opportunité digitale",
    "Développez votre présence en ligne à {ville}",
  ],
  pourquoi: [
    "Pourquoi créer un site web à {ville} ?",
    "Les avantages d'un site professionnel à {ville}",
    "Un site web pour réussir à {ville}",
  ],
  services: [
    "Nos offres de création web pour {ville}",
    "Sites web sur mesure à {ville}",
    "{service} à {ville} : notre solution",
  ],
  secteurs: [
    "Secteurs d'activité à {ville}",
    "Professionnels de {ville}, nous vous accompagnons",
    "Solutions par métier à {ville}",
  ],
  proximite: [
    "Création de site dans les environs de {ville}",
    "{ville} et les communes voisines",
    "Votre agence web près de {ville}",
  ],
};

// ============================================================================
// FONCTIONS DE GÉNÉRATION
// ============================================================================

/**
 * Génère une accroche contextuelle unique
 */
export function generateAccroche(ville: Ville): string {
  const type = ville.villeType || 'ville_moyenne';
  const templates = accrochesParType[type];
  const randomIndex = hashString(ville.slug) % templates.length;
  
  return templates[randomIndex]
    .replace(/{ville}/g, ville.nom)
    .replace(/{population}/g, ville.population?.toLocaleString() || 'plusieurs milliers');
}

/**
 * Génère des arguments contextuels basés sur les caractéristiques de la ville
 */
export function generateArguments(ville: Ville): string[] {
  const args: string[] = [];
  
  if (ville.hasGare) {
    const template = argumentsContextuels.gare[hashString(ville.slug + 'gare') % argumentsContextuels.gare.length];
    args.push(template.replace(/{ville}/g, ville.nom));
  }
  
  if (ville.hasZoneCommerciale) {
    const template = argumentsContextuels.zone_commerciale[hashString(ville.slug + 'zone') % argumentsContextuels.zone_commerciale.length];
    args.push(template.replace(/{ville}/g, ville.nom));
  }
  
  // Ajouter des arguments généraux pour avoir au moins 3 arguments
  const genericArgs = [
    `Un site web professionnel à ${ville.nom} vous différencie de la concurrence locale.`,
    `Captez les recherches "près de moi" des habitants de ${ville.nom} et environs.`,
    `Votre site web travaille pour vous 24h/24, même quand votre commerce est fermé.`,
    `Un design moderne reflète le professionnalisme de votre entreprise à ${ville.nom}.`,
  ];
  
  while (args.length < 4) {
    args.push(genericArgs[args.length]);
  }
  
  return args.slice(0, 4);
}

/**
 * Génère une liste de secteurs dominants pour une ville
 */
export function getSecteursForVille(ville: Ville): Secteur[] {
  if (ville.dominantSectors && ville.dominantSectors.length > 0) {
    return ville.dominantSectors
      .map(id => secteurs.find(s => s.id === id))
      .filter((s): s is Secteur => s !== undefined);
  }
  
  // Déterminer les secteurs par défaut selon le type de ville
  const sectorsByType: Record<VilleType, string[]> = {
    grande_ville: ['commerce', 'restaurant', 'sante', 'artisan', 'beaute', 'pme'],
    ville_moyenne: ['commerce', 'artisan', 'sante', 'beaute', 'auto-entrepreneur'],
    commune_rurale: ['artisan', 'commerce', 'auto-entrepreneur', 'association'],
  };
  
  const type = ville.villeType || 'ville_moyenne';
  return sectorsByType[type]
    .map(id => secteurs.find(s => s.id === id))
    .filter((s): s is Secteur => s !== undefined)
    .slice(0, 4);
}

/**
 * Génère un texte de contexte économique
 */
export function generateEconomicContext(ville: Ville): string {
  const type = ville.villeType || 'ville_moyenne';
  const population = ville.population?.toLocaleString() || 'plusieurs milliers d\'';
  
  const contexts: Record<VilleType, string> = {
    grande_ville: `Avec ${population} habitants, ${ville.nom} est un pôle économique majeur du Val-d'Oise. Son tissu d'entreprises diversifié — commerces, services, artisanat — crée un environnement propice au développement des affaires. Les professionnels locaux bénéficient d'un bassin de clients important et d'infrastructures de qualité.`,
    ville_moyenne: `${ville.nom} et ses ${population} habitants forment une commune dynamique où les commerces de proximité et les artisans jouent un rôle central dans l'économie locale. La ville offre un équilibre entre qualité de vie et opportunités professionnelles, attirant entreprises et clients.`,
    commune_rurale: `${ville.nom} est une commune rurale du Val-d'Oise où l'économie de proximité reste essentielle. Les artisans, commerces locaux et professionnels indépendants constituent le cœur de l'activité économique. Un site web permet de rayonner au-delà des limites de la commune.`,
  };
  
  return contexts[type];
}

/**
 * Génère un bloc de statistiques pour la ville
 */
export function generateStats(ville: Ville): { label: string; value: string }[] {
  const stats: { label: string; value: string }[] = [];
  
  if (ville.population) {
    stats.push({ label: 'Population', value: ville.population.toLocaleString() + ' hab.' });
  }
  
  stats.push({ label: 'Code postal', value: ville.codePostal });
  stats.push({ label: 'Département', value: 'Val-d\'Oise (95)' });
  
  if (ville.hasGare) {
    stats.push({ label: 'Gare', value: 'Oui - Réseau SNCF' });
  }
  
  if (ville.hasZoneCommerciale) {
    stats.push({ label: 'Zone commerciale', value: 'Oui' });
  }
  
  return stats.slice(0, 4);
}

// ============================================================================
// UTILITAIRES
// ============================================================================

/**
 * Hash simple pour obtenir un index reproductible à partir d'un string
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Formate le texte en remplaçant les variables
 */
export function formatTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}


