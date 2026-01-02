/**
 * Liste complète des 184 communes du Val-d'Oise (95)
 * Données enrichies pour le SEO local avec contenu contextuel unique
 */

export type VilleType = 'grande_ville' | 'ville_moyenne' | 'commune_rurale';

export interface Ville {
  nom: string;
  slug: string;
  codePostal: string;
  population?: number;
  isPrioritaire?: boolean;
  description?: string; // Description unique pour le SEO
  landmarks?: string[]; // Points d'intérêt locaux
  economicActivity?: string; // Type d'activité économique dominante
  nearbyVilles?: string[]; // Slugs des villes voisines
  // Champs supplémentaires pour contenu contextuel
  villeType?: VilleType;
  hasGare?: boolean;
  hasZoneCommerciale?: boolean;
  dominantSectors?: string[]; // IDs des secteurs dominants
}

// ============================================================================
// 10 VILLES PRIORITAIRES - Données complètes et enrichies
// ============================================================================
export const villesPrioritaires: Ville[] = [
  { 
    nom: 'Argenteuil', 
    slug: 'argenteuil', 
    codePostal: '95100', 
    population: 110000, 
    isPrioritaire: true,
    villeType: 'grande_ville',
    hasGare: true,
    hasZoneCommerciale: true,
    description: `Plus grande ville du Val-d'Oise avec plus de 110 000 habitants, Argenteuil est un pôle économique majeur aux portes de Paris et de La Défense. La ville compte plus de 10 000 entreprises et commerces, notamment dans les secteurs du commerce, des services et de l'industrie. Avec ses quartiers en pleine rénovation urbaine et sa situation stratégique le long de la Seine, Argenteuil attire de nombreux entrepreneurs et professionnels qui souhaitent développer leur activité dans un bassin de vie dynamique.`,
    landmarks: ['Basilique Saint-Denys', 'Les Berges de Seine', 'Centre-ville commercial', 'Marché aux fleurs', 'Parc des Berges'],
    economicActivity: 'Commerce, services, industrie, artisanat',
    nearbyVilles: ['bezons', 'sannois', 'cormeilles-en-parisis', 'epinay-sur-seine', 'colombes'],
    dominantSectors: ['commerce', 'artisan', 'restaurant', 'sante', 'beaute']
  },
  { 
    nom: 'Sarcelles', 
    slug: 'sarcelles', 
    codePostal: '95200', 
    population: 58000, 
    isPrioritaire: true,
    villeType: 'grande_ville',
    hasGare: true,
    hasZoneCommerciale: true,
    description: `Sarcelles est une ville dynamique de 58 000 habitants, connue pour son grand centre commercial Les Flanades et sa diversité culturelle unique en Île-de-France. Véritable carrefour commercial du nord de Paris, la ville offre un tissu économique riche avec de nombreuses opportunités pour les commerces de proximité, restaurants, et prestataires de services. Son marché hebdomadaire est l'un des plus importants du département.`,
    landmarks: ['Centre commercial Les Flanades', 'Parc Kennedy', 'Église Saint-Pierre', 'Marché de Sarcelles', 'Médiathèque'],
    economicActivity: 'Commerce, services, restauration',
    nearbyVilles: ['villiers-le-bel', 'garges-les-gonesse', 'arnouville', 'saint-brice-sous-foret', 'ecouen'],
    dominantSectors: ['commerce', 'restaurant', 'beaute', 'sante', 'artisan']
  },
  { 
    nom: 'Cergy', 
    slug: 'cergy', 
    codePostal: '95000', 
    population: 66000, 
    isPrioritaire: true,
    villeType: 'grande_ville',
    hasGare: true,
    hasZoneCommerciale: true,
    description: `Préfecture du Val-d'Oise et cœur de l'agglomération de Cergy-Pontoise, Cergy est une ville nouvelle de 66 000 habitants qui incarne la modernité. Elle accueille l'Université CY Cergy Paris (25 000 étudiants), de nombreuses écoles supérieures, et un tissu économique diversifié allant des startups aux grandes entreprises. Le quartier d'affaires, les zones commerciales comme les 3 Fontaines, et la base de loisirs en font un lieu de vie et de travail attractif.`,
    landmarks: ['Axe Majeur', 'Port Cergy', 'Université CY Cergy Paris', 'Centre commercial Les 3 Fontaines', 'Base de loisirs', 'Préfecture'],
    economicActivity: 'Tertiaire, éducation, technologie, commerce',
    nearbyVilles: ['pontoise', 'osny', 'vaureal', 'jouy-le-moutier', 'eragny', 'saint-ouen-l-aumone'],
    dominantSectors: ['startup', 'pme', 'coach', 'sante', 'restaurant']
  },
  { 
    nom: 'Pontoise', 
    slug: 'pontoise', 
    codePostal: '95300', 
    population: 32000, 
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: true,
    hasZoneCommerciale: false,
    description: `Ville d'art et d'histoire, chef-lieu du Val-d'Oise, Pontoise séduit par son patrimoine exceptionnel et son centre historique préservé. Avec 32 000 habitants, elle attire les professions libérales (avocats, médecins, notaires), les commerces de qualité et les artisans d'art. La cathédrale Saint-Maclou, les ruelles pavées et les musées témoignent d'un passé riche, tandis que sa vie économique reste tournée vers les services et le conseil.`,
    landmarks: ['Cathédrale Saint-Maclou', 'Musée Tavet-Delacour', 'Centre historique', 'Tribunal judiciaire', 'Jardin de la Ville'],
    economicActivity: 'Services, professions libérales, commerce, artisanat d\'art',
    nearbyVilles: ['cergy', 'saint-ouen-l-aumone', 'osny', 'auvers-sur-oise', 'herouville'],
    dominantSectors: ['avocat', 'sante', 'commerce', 'artisan', 'immobilier']
  },
  { 
    nom: 'Garges-lès-Gonesse', 
    slug: 'garges-les-gonesse', 
    codePostal: '95140', 
    population: 43000, 
    isPrioritaire: true,
    villeType: 'grande_ville',
    hasGare: true,
    hasZoneCommerciale: true,
    description: `Garges-lès-Gonesse est une ville de 43 000 habitants en pleine transformation urbaine. Sa position stratégique à proximité de l'aéroport Roissy-Charles de Gaulle et de Paris en fait un pôle attractif pour les entreprises de logistique, transport et services. Le projet du Grand Paris Express (ligne 17) renforcera encore son accessibilité. De nombreux commerces et artisans y prospèrent grâce à un bassin de population dense.`,
    landmarks: ['Centre commercial', 'Parc de la Courneuve à proximité', 'Médiathèque', 'Nouveau quartier rénové'],
    economicActivity: 'Commerce, services, logistique, transport',
    nearbyVilles: ['sarcelles', 'gonesse', 'arnouville', 'stains', 'dugny'],
    dominantSectors: ['commerce', 'artisan', 'restaurant', 'auto-entrepreneur', 'sante']
  },
  { 
    nom: 'Franconville', 
    slug: 'franconville', 
    codePostal: '95130', 
    population: 36000, 
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: true,
    hasZoneCommerciale: true,
    description: `Nichée au cœur de la vallée de Montmorency, Franconville offre un cadre de vie privilégié à ses 36 000 habitants. La ville bénéficie de la proximité de la forêt de Montmorency, d'un centre-ville commerçant dynamique et d'excellentes connexions ferroviaires (gare de Franconville - Le Plessis-Bouchard). Les artisans, commerces de proximité et professions libérales y trouvent une clientèle fidèle et aisée.`,
    landmarks: ['Forêt de Montmorency', 'Centre-ville commerçant', 'Gare de Franconville', 'Parc Cadet de Vaux', 'Église Saint-Martin'],
    economicActivity: 'Commerce, services, artisanat, professions libérales',
    nearbyVilles: ['sannois', 'ermont', 'le-plessis-bouchard', 'montigny-les-cormeilles', 'cormeilles-en-parisis'],
    dominantSectors: ['commerce', 'artisan', 'sante', 'beaute', 'immobilier']
  },
  { 
    nom: 'Goussainville', 
    slug: 'goussainville', 
    codePostal: '95190', 
    population: 32000, 
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: true,
    hasZoneCommerciale: true,
    description: `À quelques minutes de l'aéroport Roissy-Charles de Gaulle, Goussainville (32 000 habitants) est un pôle économique orienté vers la logistique, le transport et les services aux entreprises. La zone d'activités et la proximité de Roissy attirent de nombreuses entreprises tandis que le centre-ville conserve un tissu commercial de proximité actif. Le Vieux Pays, village historique préservé, ajoute une touche patrimoniale unique.`,
    landmarks: ['Zone d\'activité', 'Vieux pays de Goussainville', 'Gare de Goussainville', 'Centre commercial'],
    economicActivity: 'Logistique, transport, services, commerce',
    nearbyVilles: ['louvres', 'gonesse', 'le-thillay', 'roissy-en-france', 'fontenay-en-parisis'],
    dominantSectors: ['pme', 'artisan', 'commerce', 'restaurant', 'auto-entrepreneur']
  },
  { 
    nom: 'Bezons', 
    slug: 'bezons', 
    codePostal: '95870', 
    population: 31000, 
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: false,
    hasZoneCommerciale: true,
    description: `Aux portes de La Défense et à seulement 15 minutes de Paris, Bezons (31 000 habitants) connaît un essor économique remarquable. Ses zones d'activités accueillent des entreprises de services, de technologie et d'industrie, tandis que les bords de Seine offrent un cadre agréable. L'arrivée du tramway T2 a renforcé son attractivité. C'est un choix stratégique pour les professionnels souhaitant allier proximité parisienne et qualité de vie.`,
    landmarks: ['Bords de Seine', 'Quartier des Bruyères', 'Centre-ville rénové', 'Tramway T2'],
    economicActivity: 'Tertiaire, services, industrie, technologie',
    nearbyVilles: ['argenteuil', 'cormeilles-en-parisis', 'herblay', 'houilles', 'nanterre'],
    dominantSectors: ['pme', 'startup', 'coach', 'artisan', 'commerce']
  },
  { 
    nom: 'Ermont', 
    slug: 'ermont', 
    codePostal: '95120', 
    population: 29000, 
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: true,
    hasZoneCommerciale: true,
    description: `Ermont est une ville résidentielle dynamique de 29 000 habitants, dotée d'un centre-ville commerçant particulièrement actif. Sa gare d'Ermont-Eaubonne, nœud ferroviaire majeur (Transilien H et J), en fait un point de passage stratégique. Les commerces de proximité, restaurants et professions libérales y prospèrent grâce à un flux constant de clients. La ville attire également de nombreux artisans et prestataires de services.`,
    landmarks: ['Centre commercial', 'Gare d\'Ermont-Eaubonne', 'Parc de Cernay', 'Église Sainte-Radegonde', 'Marché couvert'],
    economicActivity: 'Commerce, services, professions libérales, artisanat',
    nearbyVilles: ['eaubonne', 'franconville', 'sannois', 'saint-gratien', 'montmorency'],
    dominantSectors: ['commerce', 'sante', 'beaute', 'artisan', 'restaurant']
  },
  { 
    nom: 'Villiers-le-Bel', 
    slug: 'villiers-le-bel', 
    codePostal: '95400', 
    population: 28000, 
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: true,
    hasZoneCommerciale: true,
    description: `Villiers-le-Bel (28 000 habitants) est une commune en plein renouveau, bénéficiant d'importants projets de rénovation urbaine. Sa position entre Paris et l'aéroport de Roissy, ainsi que l'arrivée future de la ligne 17 du Grand Paris Express, en font un territoire d'avenir pour les entrepreneurs. Les commerces de proximité et artisans y trouvent une clientèle locale fidèle, tandis que les nouveaux quartiers attirent de jeunes actifs.`,
    landmarks: ['Centre-ville rénové', 'Parc des sports', 'Gare de Villiers-le-Bel', 'Médiathèque', 'Nouveau quartier écologique'],
    economicActivity: 'Commerce, artisanat, services, BTP',
    nearbyVilles: ['sarcelles', 'arnouville', 'gonesse', 'goussainville', 'ecouen'],
    dominantSectors: ['artisan', 'commerce', 'restaurant', 'auto-entrepreneur', 'sante']
  },
];

// ============================================================================
// VILLES TIER 2 - Effort modéré, données enrichies
// ============================================================================
export const villesTier2: Ville[] = [
  {
    nom: 'Taverny',
    slug: 'taverny',
    codePostal: '95150',
    population: 27000,
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: true,
    hasZoneCommerciale: true,
    description: `Taverny (27 000 habitants) est une ville résidentielle prisée au pied de la forêt de Montmorency. Son centre-ville commerçant dynamique, ses marchés et sa qualité de vie attirent familles et professionnels. Les artisans, commerces et professions libérales y trouvent une clientèle fidèle et exigeante.`,
    landmarks: ['Forêt de Montmorency', 'Centre-ville commerçant', 'Gare de Taverny', 'Parc de la Tuyolle'],
    economicActivity: 'Commerce, artisanat, services, professions libérales',
    nearbyVilles: ['saint-leu-la-foret', 'beauchamp', 'le-plessis-bouchard', 'franconville'],
    dominantSectors: ['commerce', 'artisan', 'sante', 'beaute', 'immobilier']
  },
  {
    nom: 'Enghien-les-Bains',
    slug: 'enghien-les-bains',
    codePostal: '95880',
    population: 12000,
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: true,
    hasZoneCommerciale: false,
    description: `Enghien-les-Bains est une station thermale et balnéaire unique en Île-de-France, réputée pour son casino, son lac et ses établissements de bien-être. Cette ville au cachet exceptionnel attire une clientèle haut de gamme : instituts de beauté, restaurants gastronomiques, professions libérales et commerces de luxe y prospèrent.`,
    landmarks: ['Casino d\'Enghien', 'Lac d\'Enghien', 'Thermes', 'Centre-ville chic', 'Port de plaisance'],
    economicActivity: 'Tourisme, bien-être, restauration haut de gamme, commerce de luxe',
    nearbyVilles: ['saint-gratien', 'montmorency', 'deuil-la-barre', 'epinay-sur-seine', 'soisy-sous-montmorency'],
    dominantSectors: ['beaute', 'restaurant', 'sante', 'immobilier', 'coach']
  },
  {
    nom: 'Eaubonne',
    slug: 'eaubonne',
    codePostal: '95600',
    population: 25000,
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: true,
    hasZoneCommerciale: false,
    description: `Eaubonne est une ville résidentielle de 25 000 habitants dotée d'un noeud ferroviaire majeur (gare d'Ermont-Eaubonne). Son centre-ville commerçant et sa proximité avec la vallée de Montmorency en font un lieu de vie apprécié. Les commerces de proximité et professionnels de santé y sont particulièrement bien implantés.`,
    landmarks: ['Gare d\'Ermont-Eaubonne', 'Centre-ville', 'Parc de Mézières', 'Église Saint-Médard'],
    economicActivity: 'Commerce, santé, services, artisanat',
    nearbyVilles: ['ermont', 'saint-gratien', 'montmorency', 'soisy-sous-montmorency'],
    dominantSectors: ['sante', 'commerce', 'beaute', 'artisan', 'immobilier']
  },
  {
    nom: 'Saint-Ouen-l\'Aumône',
    slug: 'saint-ouen-l-aumone',
    codePostal: '95310',
    population: 24000,
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: true,
    hasZoneCommerciale: true,
    description: `Saint-Ouen-l'Aumône (24 000 habitants) est un pôle économique majeur de l'agglomération de Cergy-Pontoise. La zone commerciale des Bertheminots et les nombreuses zones d'activités attirent entreprises et commerces. La ville combine patrimoine historique (abbaye de Maubuisson) et développement économique moderne.`,
    landmarks: ['Abbaye de Maubuisson', 'Zone commerciale', 'Gare de Saint-Ouen-l\'Aumône', 'Bords de l\'Oise'],
    economicActivity: 'Commerce, logistique, industrie, services',
    nearbyVilles: ['pontoise', 'cergy', 'mery-sur-oise', 'pierrelaye', 'eragny'],
    dominantSectors: ['commerce', 'pme', 'artisan', 'restaurant', 'auto-entrepreneur']
  },
  {
    nom: 'Cormeilles-en-Parisis',
    slug: 'cormeilles-en-parisis',
    codePostal: '95240',
    population: 24000,
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: true,
    hasZoneCommerciale: true,
    description: `Perchée sur les coteaux de la Seine, Cormeilles-en-Parisis (24 000 habitants) offre un panorama exceptionnel sur Paris et La Défense. Cette ville en plein développement séduit par son cadre de vie et ses projets urbains ambitieux. Les commerces et artisans locaux bénéficient d'une population croissante et d'un pouvoir d'achat confortable.`,
    landmarks: ['Fort de Cormeilles', 'Vignes historiques', 'Centre-ville', 'Vue sur Paris', 'Gare de Cormeilles'],
    economicActivity: 'Commerce, artisanat, services, construction',
    nearbyVilles: ['argenteuil', 'herblay', 'montigny-les-cormeilles', 'franconville', 'sannois'],
    dominantSectors: ['artisan', 'commerce', 'immobilier', 'sante', 'beaute']
  },
  {
    nom: 'Montmorency',
    slug: 'montmorency',
    codePostal: '95160',
    population: 22000,
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: true,
    hasZoneCommerciale: false,
    description: `Montmorency est une ville historique au charme unique, dominée par sa forêt et son patrimoine remarquable. Avec 22 000 habitants, elle attire une population aisée appréciant le cadre de vie préservé. Le centre-ville commerçant et les nombreuses professions libérales témoignent d'une activité économique qualitative.`,
    landmarks: ['Forêt de Montmorency', 'Collégiale Saint-Martin', 'Maison de Jean-Jacques Rousseau', 'Centre historique'],
    economicActivity: 'Professions libérales, commerce de qualité, santé, artisanat d\'art',
    nearbyVilles: ['enghien-les-bains', 'eaubonne', 'soisy-sous-montmorency', 'andilly', 'saint-prix'],
    dominantSectors: ['sante', 'avocat', 'commerce', 'beaute', 'coach']
  },
  {
    nom: 'Deuil-la-Barre',
    slug: 'deuil-la-barre',
    codePostal: '95170',
    population: 22000,
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: true,
    hasZoneCommerciale: false,
    description: `Deuil-la-Barre est une ville résidentielle de 22 000 habitants réputée pour sa qualité de vie. Son centre-ville animé et son marché attirent une population familiale et active. Les commerces de proximité, restaurants et prestataires de services y prospèrent grâce à une clientèle locale fidèle.`,
    landmarks: ['Centre-ville', 'Parc de la Chevrette', 'Gare de Deuil-Montmagny', 'Marché'],
    economicActivity: 'Commerce, restauration, services, santé',
    nearbyVilles: ['montmagny', 'groslay', 'montmorency', 'saint-brice-sous-foret', 'sarcelles'],
    dominantSectors: ['commerce', 'restaurant', 'sante', 'beaute', 'artisan']
  },
  {
    nom: 'Saint-Gratien',
    slug: 'saint-gratien',
    codePostal: '95210',
    population: 21000,
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: true,
    hasZoneCommerciale: false,
    description: `Saint-Gratien (21 000 habitants) est une ville résidentielle élégante aux portes d'Enghien-les-Bains. Sa proximité avec le lac d'Enghien et Paris lui confère un attrait particulier. Les commerces de qualité, restaurants et professions libérales y trouvent une clientèle au pouvoir d'achat élevé.`,
    landmarks: ['Bords du lac d\'Enghien', 'Centre-ville', 'Gare de Saint-Gratien', 'Église Saint-Gratien'],
    economicActivity: 'Commerce de qualité, restauration, professions libérales, santé',
    nearbyVilles: ['enghien-les-bains', 'ermont', 'sannois', 'eaubonne', 'epinay-sur-seine'],
    dominantSectors: ['commerce', 'restaurant', 'sante', 'immobilier', 'beaute']
  },
  {
    nom: 'Soisy-sous-Montmorency',
    slug: 'soisy-sous-montmorency',
    codePostal: '95230',
    population: 18000,
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: false,
    hasZoneCommerciale: false,
    description: `Soisy-sous-Montmorency est une commune résidentielle de 18 000 habitants nichée au coeur de la vallée de Montmorency. Son cadre verdoyant et sa tranquillité attirent familles et retraités aisés. Les commerces de proximité et artisans locaux y trouvent une clientèle stable et fidèle.`,
    landmarks: ['Forêt de Montmorency', 'Centre-ville', 'Parc', 'Église Saint-Pierre'],
    economicActivity: 'Commerce de proximité, artisanat, services',
    nearbyVilles: ['montmorency', 'eaubonne', 'andilly', 'margency', 'enghien-les-bains'],
    dominantSectors: ['artisan', 'commerce', 'sante', 'beaute', 'immobilier']
  },
  {
    nom: 'Sannois',
    slug: 'sannois',
    codePostal: '95110',
    population: 27000,
    isPrioritaire: true,
    villeType: 'ville_moyenne',
    hasGare: true,
    hasZoneCommerciale: false,
    description: `Sannois (27 000 habitants) est une ville dynamique située sur les hauteurs dominant la vallée de la Seine. Son centre-ville commerçant actif et sa vie associative riche en font une commune vivante et attractive. Les commerces, artisans et professions libérales y bénéficient d'une population diversifiée.`,
    landmarks: ['Moulin de Sannois', 'Butte de Sannois', 'Centre-ville', 'Gare de Sannois', 'Marché'],
    economicActivity: 'Commerce, artisanat, services, professions libérales',
    nearbyVilles: ['argenteuil', 'franconville', 'ermont', 'saint-gratien', 'cormeilles-en-parisis'],
    dominantSectors: ['commerce', 'artisan', 'sante', 'beaute', 'restaurant']
  },
];

// ============================================================================
// AUTRES VILLES - Avec données de base et templates de contenu
// ============================================================================
export const autresVilles: Ville[] = [
  // Villes moyennes restantes (10 000 - 30 000 habitants)
  { nom: 'Herblay-sur-Seine', slug: 'herblay', codePostal: '95220', population: 27000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: true, nearbyVilles: ['conflans-sainte-honorine', 'pierrelaye', 'cormeilles-en-parisis', 'bezons'] },
  { nom: 'Gonesse', slug: 'gonesse', codePostal: '95500', population: 27000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: true, nearbyVilles: ['garges-les-gonesse', 'arnouville', 'goussainville', 'bonneuil-en-france'] },
  { nom: 'Montigny-lès-Cormeilles', slug: 'montigny-les-cormeilles', codePostal: '95370', population: 22000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: true, nearbyVilles: ['cormeilles-en-parisis', 'franconville', 'herblay', 'sannois'] },
  { nom: 'Osny', slug: 'osny', codePostal: '95520', population: 18000, villeType: 'ville_moyenne', hasGare: false, hasZoneCommerciale: true, nearbyVilles: ['cergy', 'pontoise', 'boissy-l-aillerie', 'ableiges'] },
  { nom: 'Éragny', slug: 'eragny', codePostal: '95610', population: 17000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: true, nearbyVilles: ['cergy', 'saint-ouen-l-aumone', 'neuville-sur-oise', 'conflans-sainte-honorine'] },
  { nom: 'Jouy-le-Moutier', slug: 'jouy-le-moutier', codePostal: '95280', population: 17000, villeType: 'ville_moyenne', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['cergy', 'vaureal', 'courdimanche', 'boisemont'] },
  { nom: 'Domont', slug: 'domont', codePostal: '95330', population: 16000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['ezanville', 'bouffemont', 'montmorency', 'moisselles'] },
  { nom: 'Vauréal', slug: 'vaureal', codePostal: '95490', population: 16000, villeType: 'ville_moyenne', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['cergy', 'jouy-le-moutier', 'osny', 'menucourt'] },
  { nom: 'Saint-Leu-la-Forêt', slug: 'saint-leu-la-foret', codePostal: '95320', population: 16000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['taverny', 'bouffemont', 'saint-prix', 'le-plessis-bouchard'] },
  { nom: 'Montmagny', slug: 'montmagny', codePostal: '95360', population: 15000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['deuil-la-barre', 'groslay', 'villetaneuse', 'epinay-sur-seine'] },
  { nom: 'Arnouville', slug: 'arnouville', codePostal: '95400', population: 14000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['sarcelles', 'villiers-le-bel', 'garges-les-gonesse', 'gonesse'] },
  { nom: 'Enghien-les-Bains', slug: 'enghien-les-bains', codePostal: '95880', population: 12000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['saint-gratien', 'montmorency', 'deuil-la-barre', 'epinay-sur-seine'], dominantSectors: ['beaute', 'sante', 'commerce', 'immobilier'] },
  { nom: 'Persan', slug: 'persan', codePostal: '95340', population: 12000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['beaumont-sur-oise', 'champagne-sur-oise', 'bernes-sur-oise', 'bruyeres-sur-oise'] },
  { nom: 'L\'Isle-Adam', slug: 'l-isle-adam', codePostal: '95290', population: 12000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['parmain', 'mery-sur-oise', 'villiers-adam', 'presles'], dominantSectors: ['immobilier', 'commerce', 'sante', 'beaute'] },
  { nom: 'Louvres', slug: 'louvres', codePostal: '95380', population: 11000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['goussainville', 'puiseux-en-france', 'marly-la-ville', 'fosses'] },
  { nom: 'Méry-sur-Oise', slug: 'mery-sur-oise', codePostal: '95540', population: 10000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['auvers-sur-oise', 'pontoise', 'saint-ouen-l-aumone', 'l-isle-adam'] },
  { nom: 'Ezanville', slug: 'ezanville', codePostal: '95460', population: 10000, villeType: 'ville_moyenne', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['domont', 'ecouen', 'sarcelles', 'villiers-le-bel'] },
  { nom: 'Beaumont-sur-Oise', slug: 'beaumont-sur-oise', codePostal: '95260', population: 10000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['persan', 'mours', 'bernes-sur-oise', 'nointel'] },
  { nom: 'Fosses', slug: 'fosses', codePostal: '95470', population: 10000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['survilliers', 'marly-la-ville', 'louvres', 'saint-witz'] },
  
  // Petites villes (5 000 - 10 000 habitants)
  { nom: 'Groslay', slug: 'groslay', codePostal: '95410', population: 9000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['deuil-la-barre', 'montmagny', 'sarcelles'] },
  { nom: 'Pierrelaye', slug: 'pierrelaye', codePostal: '95480', population: 9000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: true, nearbyVilles: ['herblay', 'saint-ouen-l-aumone', 'franconville'] },
  { nom: 'Écouen', slug: 'ecouen', codePostal: '95440', population: 8000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['sarcelles', 'ezanville', 'villiers-le-bel'], dominantSectors: ['artisan', 'commerce', 'sante'] },
  { nom: 'Saint-Prix', slug: 'saint-prix', codePostal: '95390', population: 8000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['saint-leu-la-foret', 'montmorency', 'taverny'] },
  { nom: 'Le Plessis-Bouchard', slug: 'le-plessis-bouchard', codePostal: '95130', population: 8000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['franconville', 'taverny', 'saint-leu-la-foret'] },
  { nom: 'Courdimanche', slug: 'courdimanche', codePostal: '95800', population: 8000, villeType: 'ville_moyenne', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['vaureal', 'jouy-le-moutier', 'cergy'] },
  { nom: 'Auvers-sur-Oise', slug: 'auvers-sur-oise', codePostal: '95430', population: 7000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['mery-sur-oise', 'pontoise', 'butry-sur-oise'], dominantSectors: ['artisan', 'commerce', 'restaurant'] },
  { nom: 'Magny-en-Vexin', slug: 'magny-en-vexin', codePostal: '95420', population: 6000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['chars', 'arthies', 'maudetour-en-vexin'] },
  { nom: 'Menucourt', slug: 'menucourt', codePostal: '95180', population: 6000, villeType: 'ville_moyenne', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['vaureal', 'boisemont', 'courdimanche'] },
  { nom: 'Bouffémont', slug: 'bouffemont', codePostal: '95570', population: 6000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['domont', 'moisselles', 'saint-leu-la-foret'] },
  { nom: 'Marly-la-Ville', slug: 'marly-la-ville', codePostal: '95670', population: 6000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['fosses', 'louvres', 'survilliers'] },
  { nom: 'Parmain', slug: 'parmain', codePostal: '95620', population: 5500, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['l-isle-adam', 'valmondois', 'champagne-sur-oise'] },
  { nom: 'Champagne-sur-Oise', slug: 'champagne-sur-oise', codePostal: '95660', population: 5000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['persan', 'parmain', 'l-isle-adam'] },
  { nom: 'Maurecourt', slug: 'maurecourt', codePostal: '78780', population: 5000, villeType: 'ville_moyenne', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['conflans-sainte-honorine', 'andrésy', 'jouy-le-moutier'] },
  { nom: 'Viarmes', slug: 'viarmes', codePostal: '95270', population: 5000, villeType: 'ville_moyenne', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['luzarches', 'asnières-sur-oise', 'seugy'] },
  
  // Communes rurales (< 5 000 habitants)
  { nom: 'Bruyères-sur-Oise', slug: 'bruyeres-sur-oise', codePostal: '95820', population: 4500, villeType: 'commune_rurale', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['bernes-sur-oise', 'persan', 'beaumont-sur-oise'] },
  { nom: 'Le Thillay', slug: 'le-thillay', codePostal: '95500', population: 4500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['gonesse', 'goussainville', 'roissy-en-france'] },
  { nom: 'Luzarches', slug: 'luzarches', codePostal: '95270', population: 4500, villeType: 'commune_rurale', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['viarmes', 'chaumontel', 'belloy-en-france'] },
  { nom: 'Presles', slug: 'presles', codePostal: '95590', population: 4000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['nointel', 'beaumont-sur-oise', 'mours'] },
  { nom: 'Survilliers', slug: 'survilliers', codePostal: '95470', population: 4000, villeType: 'commune_rurale', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['fosses', 'saint-witz', 'marly-la-ville'] },
  { nom: 'Puiseux-en-France', slug: 'puiseux-en-france', codePostal: '95380', population: 4000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['louvres', 'epiais-les-louvres', 'fontenay-en-parisis'] },
  { nom: 'Chaumontel', slug: 'chaumontel', codePostal: '95270', population: 3500, villeType: 'commune_rurale', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['luzarches', 'asnières-sur-oise', 'viarmes'] },
  { nom: 'Montsoult', slug: 'montsoult', codePostal: '95560', population: 3500, villeType: 'commune_rurale', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['maffliers', 'baillet-en-france', 'bouffemont'] },
  { nom: 'Margency', slug: 'margency', codePostal: '95580', population: 3000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['montmorency', 'andilly', 'soisy-sous-montmorency'] },
  { nom: 'Asnières-sur-Oise', slug: 'asnieres-sur-oise', codePostal: '95270', population: 3000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['viarmes', 'chaumontel', 'luzarches'] },
  { nom: 'Saint-Witz', slug: 'saint-witz', codePostal: '95470', population: 3000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['survilliers', 'fosses', 'vemars'] },
  { nom: 'Andilly', slug: 'andilly', codePostal: '95580', population: 2500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['margency', 'montmorency', 'soisy-sous-montmorency'] },
  { nom: 'Boissy-l\'Aillerie', slug: 'boissy-l-aillerie', codePostal: '95650', population: 2500, villeType: 'commune_rurale', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['osny', 'courcelles-sur-viosne', 'montgeroult'] },
  { nom: 'Fontenay-en-Parisis', slug: 'fontenay-en-parisis', codePostal: '95190', population: 2500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['goussainville', 'puiseux-en-france', 'chatenay-en-france'] },
  { nom: 'Bernes-sur-Oise', slug: 'bernes-sur-oise', codePostal: '95340', population: 2500, villeType: 'commune_rurale', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['bruyeres-sur-oise', 'persan', 'beaumont-sur-oise'] },
  { nom: 'Attainville', slug: 'attainville', codePostal: '95570', population: 2000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['moisselles', 'bouffemont', 'domont'] },
  { nom: 'Chars', slug: 'chars', codePostal: '95750', population: 2000, villeType: 'commune_rurale', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['santeuil', 'nucourt', 'breancon'] },
  { nom: 'Belloy-en-France', slug: 'belloy-en-france', codePostal: '95270', population: 2000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['luzarches', 'jagny-sous-bois', 'chaumontel'] },
  { nom: 'Mours', slug: 'mours', codePostal: '95260', population: 2000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['beaumont-sur-oise', 'presles', 'nointel'] },
  { nom: 'Baillet-en-France', slug: 'baillet-en-france', codePostal: '95560', population: 2000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['montsoult', 'maffliers', 'villaines-sous-bois'] },
  { nom: 'Nesles-la-Vallée', slug: 'nesles-la-vallee', codePostal: '95690', population: 2000, villeType: 'commune_rurale', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['frouville', 'hedouville', 'labbeville'] },
  { nom: 'Maffliers', slug: 'maffliers', codePostal: '95560', population: 2000, villeType: 'commune_rurale', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['montsoult', 'baillet-en-france', 'chauvry'] },
  { nom: 'Butry-sur-Oise', slug: 'butry-sur-oise', codePostal: '95430', population: 2000, villeType: 'commune_rurale', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['auvers-sur-oise', 'valmondois', 'mery-sur-oise'] },
  { nom: 'Neuville-sur-Oise', slug: 'neuville-sur-oise', codePostal: '95000', population: 2000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['cergy', 'eragny', 'conflans-sainte-honorine'] },
  { nom: 'Us', slug: 'us', codePostal: '95450', population: 1500, villeType: 'commune_rurale', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['ableiges', 'santeuil', 'sagy'] },
  { nom: 'Sagy', slug: 'sagy', codePostal: '95450', population: 1500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['condecourt', 'longuesse', 'seraincourt'] },
  { nom: 'Cormeilles-en-Vexin', slug: 'cormeilles-en-vexin', codePostal: '95830', population: 1500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['marines', 'fremecourt', 'haravilliers'] },
  { nom: 'Ableiges', slug: 'ableiges', codePostal: '95450', population: 1500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['osny', 'us', 'boissy-l-aillerie'] },
  { nom: 'Moisselles', slug: 'moisselles', codePostal: '95570', population: 1500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['bouffemont', 'attainville', 'domont'] },
  { nom: 'Chennevières-lès-Louvres', slug: 'chennevieres-les-louvres', codePostal: '95380', population: 1500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['puiseux-en-france', 'louvres', 'epiais-les-louvres'] },
  { nom: 'Seugy', slug: 'seugy', codePostal: '95270', population: 1500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['viarmes', 'luzarches', 'asnières-sur-oise'] },
  { nom: 'Vigny', slug: 'vigny', codePostal: '95450', population: 1200, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['longuesse', 'avernes', 'themericourt'] },
  { nom: 'Valmondois', slug: 'valmondois', codePostal: '95760', population: 1200, villeType: 'commune_rurale', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['butry-sur-oise', 'parmain', 'auvers-sur-oise'] },
  { nom: 'Seraincourt', slug: 'seraincourt', codePostal: '95450', population: 1000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['sagy', 'condecourt', 'gaillon-sur-montcient'] },
  { nom: 'Condécourt', slug: 'condecourt', codePostal: '95450', population: 1000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['sagy', 'seraincourt', 'longuesse'] },
  { nom: 'Nointel', slug: 'nointel', codePostal: '95590', population: 1000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['presles', 'mours', 'beaumont-sur-oise'] },
  { nom: 'Bonneuil-en-France', slug: 'bonneuil-en-france', codePostal: '95500', population: 1000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['gonesse', 'garges-les-gonesse', 'le-thillay'] },
  { nom: 'Aincourt', slug: 'aincourt', codePostal: '95510', population: 1000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['arthies', 'villers-en-arthies', 'vienne-en-arthies'] },
  { nom: 'Châtenay-en-France', slug: 'chatenay-en-france', codePostal: '95190', population: 1000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['goussainville', 'fontenay-en-parisis', 'puiseux-en-france'] },
  { nom: 'Jagny-sous-Bois', slug: 'jagny-sous-bois', codePostal: '95850', population: 1000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['belloy-en-france', 'mareil-en-france', 'luzarches'] },
  { nom: 'Saint-Clair-sur-Epte', slug: 'saint-clair-sur-epte', codePostal: '95770', population: 1000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['montreuil-sur-epte', 'buhy', 'guerny'] },
  { nom: 'Bray-et-Lû', slug: 'bray-et-lu', codePostal: '95710', population: 1000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['chaussy', 'villarceaux', 'amenucourt'] },
  { nom: 'Le Mesnil-Aubry', slug: 'le-mesnil-aubry', codePostal: '95720', population: 1000, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['bouqueval', 'ezanville', 'villiers-le-bel'] },
  { nom: 'Avernes', slug: 'avernes', codePostal: '95450', population: 900, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['themericourt', 'vigny', 'gadancourt'] },
  { nom: 'Nucourt', slug: 'nucourt', codePostal: '95420', population: 900, villeType: 'commune_rurale', hasGare: true, hasZoneCommerciale: false, nearbyVilles: ['chars', 'clery-en-vexin', 'brignancourt'] },
  { nom: 'Vétheuil', slug: 'vetheuil', codePostal: '95510', population: 900, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['haute-isle', 'la-roche-guyon', 'saint-cyr-en-arthies'] },
  { nom: 'Grisy-les-Plâtres', slug: 'grisy-les-platres', codePostal: '95810', population: 800, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['cormeilles-en-vexin', 'marines', 'theuville'] },
  { nom: 'Villers-en-Arthies', slug: 'villers-en-arthies', codePostal: '95510', population: 800, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['vienne-en-arthies', 'aincourt', 'arthies'] },
  { nom: 'Longuesse', slug: 'longuesse', codePostal: '95450', population: 800, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['vigny', 'condecourt', 'sagy'] },
  { nom: 'Mareil-en-France', slug: 'mareil-en-france', codePostal: '95850', population: 800, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['jagny-sous-bois', 'belloy-en-france', 'villaines-sous-bois'] },
  { nom: 'Arronville', slug: 'arronville', codePostal: '95810', population: 700, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['menouville', 'epiais-rhus', 'labbeville'] },
  { nom: 'Épiais-Rhus', slug: 'epiais-rhus', codePostal: '95810', population: 700, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['vallangoujard', 'arronville', 'labbeville'] },
  { nom: 'Boisemont', slug: 'boisemont', codePostal: '95000', population: 700, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['menucourt', 'jouy-le-moutier', 'cergy'] },
  { nom: 'Chauvry', slug: 'chauvry', codePostal: '95560', population: 700, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['maffliers', 'nerville-la-foret', 'montsoult'] },
  { nom: 'Hérouville', slug: 'herouville', codePostal: '95300', population: 700, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['pontoise', 'saint-ouen-l-aumone', 'mery-sur-oise'] },
  { nom: 'Montgeroult', slug: 'montgeroult', codePostal: '95650', population: 600, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['courcelles-sur-viosne', 'boissy-l-aillerie', 'genicourt'] },
  { nom: 'Frouville', slug: 'frouville', codePostal: '95690', population: 600, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['nesles-la-vallee', 'hedouville', 'arronville'] },
  { nom: 'Hédouville', slug: 'hedouville', codePostal: '95690', population: 600, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['nesles-la-vallee', 'frouville', 'arronville'] },
  { nom: 'Vienne-en-Arthies', slug: 'vienne-en-arthies', codePostal: '95510', population: 600, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['villers-en-arthies', 'aincourt', 'saint-cyr-en-arthies'] },
  { nom: 'Villaines-sous-Bois', slug: 'villaines-sous-bois', codePostal: '95570', population: 600, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['baillet-en-france', 'mareil-en-france', 'montsoult'] },
  { nom: 'Jambville', slug: 'jambville', codePostal: '78440', population: 600, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['chaussy', 'guernes', 'fontenay-saint-pere'] },
  { nom: 'Genainville', slug: 'genainville', codePostal: '95420', population: 500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['magny-en-vexin', 'omerville', 'wy-dit-joli-village'] },
  { nom: 'Nerville-la-Forêt', slug: 'nerville-la-foret', codePostal: '95590', population: 500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['chauvry', 'presles', 'mours'] },
  { nom: 'Arthies', slug: 'arthies', codePostal: '95420', population: 500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['magny-en-vexin', 'aincourt', 'maudetour-en-vexin'] },
  { nom: 'Maudétour-en-Vexin', slug: 'maudetour-en-vexin', codePostal: '95420', population: 500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['magny-en-vexin', 'arthies', 'hodent'] },
  { nom: 'Haravilliers', slug: 'haravilliers', codePostal: '95640', population: 500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['breancon', 'le-heaulme', 'cormeilles-en-vexin'] },
  { nom: 'Le Perchay', slug: 'le-perchay', codePostal: '95450', population: 500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['us', 'commeny', 'santeuil'] },
  { nom: 'Clery-en-Vexin', slug: 'clery-en-vexin', codePostal: '95420', population: 500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['nucourt', 'magny-en-vexin', 'brignancourt'] },
  { nom: 'La Roche-Guyon', slug: 'la-roche-guyon', codePostal: '95780', population: 500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['haute-isle', 'vetheuil', 'bennecourt'] },
  { nom: 'Bouqueval', slug: 'bouqueval', codePostal: '95720', population: 500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['le-mesnil-aubry', 'gonesse', 'bonneuil-en-france'] },
  { nom: 'Vallangoujard', slug: 'vallangoujard', codePostal: '95810', population: 500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['epiais-rhus', 'arronville', 'menouville'] },
  { nom: 'Bréançon', slug: 'breancon', codePostal: '95640', population: 500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['haravilliers', 'santeuil', 'le-heaulme'] },
  { nom: 'Épiais-lès-Louvres', slug: 'epiais-les-louvres', codePostal: '95380', population: 500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['louvres', 'chennevieres-les-louvres', 'puiseux-en-france'] },
  { nom: 'Béthemont-la-Forêt', slug: 'bethemont-la-foret', codePostal: '95840', population: 400, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['chauvry', 'taverny', 'saint-leu-la-foret'] },
  { nom: 'Courcelles-sur-Viosne', slug: 'courcelles-sur-viosne', codePostal: '95650', population: 400, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['montgeroult', 'boissy-l-aillerie', 'osny'] },
  { nom: 'Génicourt', slug: 'genicourt', codePostal: '95650', population: 400, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['montgeroult', 'courcelles-sur-viosne', 'livilliers'] },
  { nom: 'Labbeville', slug: 'labbeville', codePostal: '95690', population: 400, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['nesles-la-vallee', 'arronville', 'vallangoujard'] },
  { nom: 'Menouville', slug: 'menouville', codePostal: '95810', population: 400, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['arronville', 'vallangoujard', 'marines'] },
  { nom: 'Santeuil', slug: 'santeuil', codePostal: '95640', population: 400, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['chars', 'breancon', 'us'] },
  { nom: 'Chaussy', slug: 'chaussy', codePostal: '95710', population: 400, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['villarceaux', 'bray-et-lu', 'magny-en-vexin'] },
  { nom: 'Thémericourt', slug: 'themericourt', codePostal: '95450', population: 400, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['avernes', 'vigny', 'gadancourt'] },
  { nom: 'Saint-Gervais', slug: 'saint-gervais', codePostal: '95420', population: 400, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['magny-en-vexin', 'hodent', 'genainville'] },
  { nom: 'Wy-dit-Joli-Village', slug: 'wy-dit-joli-village', codePostal: '95420', population: 350, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['guiry-en-vexin', 'magny-en-vexin', 'genainville'] },
  { nom: 'Amenucourt', slug: 'amenucourt', codePostal: '95510', population: 350, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['bray-et-lu', 'chaussy', 'vetheuil'] },
  { nom: 'Buhy', slug: 'buhy', codePostal: '95770', population: 350, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['saint-clair-sur-epte', 'montreuil-sur-epte', 'banthelu'] },
  { nom: 'Livilliers', slug: 'livilliers', codePostal: '95300', population: 500, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['pontoise', 'osny', 'genicourt'] },
  { nom: 'Le Heaulme', slug: 'le-heaulme', codePostal: '95640', population: 300, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['haravilliers', 'breancon', 'moussy'] },
  { nom: 'Commeny', slug: 'commeny', codePostal: '95450', population: 400, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['le-perchay', 'us', 'gadancourt'] },
  { nom: 'Moussy', slug: 'moussy', codePostal: '95640', population: 300, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['le-heaulme', 'haravilliers', 'neuilly-en-vexin'] },
  { nom: 'Neuilly-en-Vexin', slug: 'neuilly-en-vexin', codePostal: '95640', population: 300, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['moussy', 'le-heaulme', 'chars'] },
  { nom: 'Frémécourt', slug: 'fremecourt', codePostal: '95830', population: 300, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['cormeilles-en-vexin', 'marines', 'grisy-les-platres'] },
  { nom: 'Brignancourt', slug: 'brignancourt', codePostal: '95640', population: 300, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['nucourt', 'clery-en-vexin', 'chars'] },
  { nom: 'Montreuil-sur-Epte', slug: 'montreuil-sur-epte', codePostal: '95770', population: 300, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['saint-clair-sur-epte', 'buhy', 'banthelu'] },
  { nom: 'Saint-Cyr-en-Arthies', slug: 'saint-cyr-en-arthies', codePostal: '95510', population: 300, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['vetheuil', 'vienne-en-arthies', 'villers-en-arthies'] },
  { nom: 'Haute-Isle', slug: 'haute-isle', codePostal: '95780', population: 250, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['la-roche-guyon', 'vetheuil', 'amenucourt'] },
  { nom: 'Guiry-en-Vexin', slug: 'guiry-en-vexin', codePostal: '95450', population: 250, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['wy-dit-joli-village', 'themericourt', 'gadancourt'] },
  { nom: 'Hodent', slug: 'hodent', codePostal: '95420', population: 200, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['magny-en-vexin', 'maudetour-en-vexin', 'saint-gervais'] },
  { nom: 'Theuville', slug: 'theuville', codePostal: '95810', population: 200, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['grisy-les-platres', 'marines', 'cormeilles-en-vexin'] },
  { nom: 'Gadancourt', slug: 'gadancourt', codePostal: '95450', population: 200, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['themericourt', 'avernes', 'guiry-en-vexin'] },
  { nom: 'Gouzangrez', slug: 'gouzangrez', codePostal: '95450', population: 200, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['ableiges', 'us', 'commeny'] },
  { nom: 'Omerville', slug: 'omerville', codePostal: '95420', population: 200, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['genainville', 'magny-en-vexin', 'saint-gervais'] },
  { nom: 'Banthelu', slug: 'banthelu', codePostal: '95420', population: 200, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['buhy', 'montreuil-sur-epte', 'saint-clair-sur-epte'] },
  { nom: 'Le Bellay-en-Vexin', slug: 'le-bellay-en-vexin', codePostal: '95750', population: 200, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['chars', 'nucourt', 'breancon'] },
  { nom: 'Charmont', slug: 'charmont', codePostal: '95420', population: 150, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['magny-en-vexin', 'hodent', 'clery-en-vexin'] },
  { nom: 'Villarceaux', slug: 'villarceaux', codePostal: '95710', population: 100, villeType: 'commune_rurale', hasGare: false, hasZoneCommerciale: false, nearbyVilles: ['chaussy', 'bray-et-lu', 'omerville'] },
];

// ============================================================================
// FUSION : Toutes les villes du 95
// ============================================================================
export const villes95: Ville[] = [...villesPrioritaires, ...villesTier2, ...autresVilles];

// ============================================================================
// SERVICES
// ============================================================================
export const services = [
  {
    id: 'site-vitrine',
    nom: 'Site Vitrine',
    slug: 'site-vitrine',
    description: 'Site professionnel multi-pages',
    prix: '599€',
    prixNum: 599,
    keywords: ['site vitrine', 'site professionnel', 'site entreprise', 'création site'],
    features: ['5 pages incluses', 'Design sur mesure', 'Responsive mobile', 'SEO optimisé', 'Formulaire de contact', 'Hébergement 1 an'],
    deliveryTime: '2-4h',
  },
  {
    id: 'landing-page',
    nom: 'Landing Page',
    slug: 'landing-page',
    description: 'Page d\'atterrissage haute conversion',
    prix: '299€',
    prixNum: 299,
    keywords: ['landing page', 'one page', 'page atterrissage', 'page conversion'],
    features: ['1 page impactante', 'Design conversion', 'Responsive mobile', 'SEO basique', 'Formulaire intégré', 'Hébergement 1 an'],
    deliveryTime: '2h',
  },
  {
    id: 'site-sur-mesure',
    nom: 'Site Sur Mesure',
    slug: 'site-sur-mesure',
    description: 'Projet web personnalisé',
    prix: 'Sur devis',
    prixNum: 0,
    keywords: ['site sur mesure', 'site personnalisé', 'développement web', 'projet web'],
    features: ['Pages illimitées', 'Fonctionnalités custom', 'Design unique', 'SEO avancé', 'Accompagnement dédié', 'Maintenance incluse'],
    deliveryTime: 'Variable',
  },
];

// ============================================================================
// HELPERS
// ============================================================================
export function getVilleBySlug(slug: string): Ville | undefined {
  return villes95.find(v => v.slug === slug);
}

export function getServiceBySlug(slug: string) {
  return services.find(s => s.slug === slug);
}

export function getVillesPrioritaires(): Ville[] {
  return villes95.filter(v => v.isPrioritaire);
}

export function getAllVilleSlugs(): string[] {
  return villes95.map(v => v.slug);
}

export function getNearbyVilles(ville: Ville): Ville[] {
  if (!ville.nearbyVilles) return [];
  return ville.nearbyVilles
    .map(slug => getVilleBySlug(slug))
    .filter((v): v is Ville => v !== undefined)
    .slice(0, 6);
}

// ============================================================================
// GENERATION DE CONTENU SEO
// ============================================================================
export function generateSEOTitle(ville: Ville, service: typeof services[0]): string {
  return `${service.nom} à ${ville.nom} (${ville.codePostal}) | Livraison 2h | FastFabric`;
}

export function generateSEODescription(ville: Ville, service: typeof services[0]): string {
  const population = ville.population ? `, ville de ${ville.population.toLocaleString()} habitants` : '';
  return `Création de ${service.nom.toLowerCase()} à ${ville.nom}${population}. Livraison en 2h, design sur mesure, à partir de ${service.prix}. Devis gratuit pour votre site web dans le ${ville.codePostal}.`;
}

export function generateH1(ville: Ville, service: typeof services[0]): string {
  return `${service.nom} à ${ville.nom}`;
}

export function generateLocalKeywords(ville: Ville, service: typeof services[0]): string[] {
  const baseKeywords = [
    ...service.keywords.map(k => `${k} ${ville.nom}`),
    `création site ${ville.nom}`,
    `agence web ${ville.nom}`,
    `webdesigner ${ville.nom}`,
    `développeur web ${ville.codePostal}`,
    `site internet ${ville.nom}`,
  ];
  
  // Ajouter des keywords contextuels selon le type de ville
  if (ville.villeType === 'grande_ville') {
    baseKeywords.push(`entreprise web ${ville.nom}`);
  }
  if (ville.hasGare) {
    baseKeywords.push(`création site près gare ${ville.nom}`);
  }
  
  return baseKeywords;
}

/**
 * Génère une description contextuelle unique pour les villes non-prioritaires
 */
export function generateVilleDescription(ville: Ville): string {
  if (ville.description) return ville.description;
  
  const populationText = ville.population 
    ? `${ville.population.toLocaleString()} habitants` 
    : 'une population dynamique';
  
  const typeText = {
    'grande_ville': 'ville majeure du Val-d\'Oise',
    'ville_moyenne': 'commune dynamique du Val-d\'Oise',
    'commune_rurale': 'charmante commune rurale du Val-d\'Oise',
  }[ville.villeType || 'ville_moyenne'];
  
  const gareText = ville.hasGare 
    ? ', desservie par le réseau ferré francilien,' 
    : '';
  
  const commerceText = ville.hasZoneCommerciale 
    ? ' La ville dispose de zones commerciales qui favorisent l\'activité économique locale.' 
    : '';
  
  return `${ville.nom} est une ${typeText} comptant ${populationText}${gareText} située dans le département 95.${commerceText} Les entreprises locales, artisans et professions libérales y trouvent un environnement propice à leur développement. FastFabric accompagne les professionnels de ${ville.nom} dans leur transformation digitale avec des sites web livrés en 2 heures.`;
}

/**
 * Génère un argumentaire adapté au type de ville
 */
export function generateVilleArguments(ville: Ville, service: typeof services[0]): string[] {
  const baseArguments = [
    `Un ${service.nom.toLowerCase()} professionnel augmente votre visibilité auprès des ${ville.population ? Math.round(ville.population / 10).toLocaleString() : 'nombreux'} foyers de ${ville.nom}`,
    `Livraison express en ${service.deliveryTime} pour être présent en ligne rapidement`,
  ];
  
  if (ville.villeType === 'grande_ville') {
    baseArguments.push(`Dans une ville de ${ville.population?.toLocaleString()} habitants, un site web vous différencie de la concurrence`);
    baseArguments.push(`Captez les recherches locales type "${service.nom.toLowerCase()} ${ville.nom}" sur Google`);
  } else if (ville.villeType === 'ville_moyenne') {
    baseArguments.push(`Renforcez votre ancrage local à ${ville.nom} avec un site qui inspire confiance`);
    baseArguments.push(`Développez votre notoriété dans le bassin de vie de ${ville.nom}`);
  } else {
    baseArguments.push(`Démarquez-vous dans votre commune avec un site web professionnel`);
    baseArguments.push(`Touchez les habitants des communes voisines en quelques clics`);
  }
  
  if (ville.hasGare) {
    baseArguments.push(`La gare de ${ville.nom} amène un flux de clients potentiels - soyez visible en ligne`);
  }
  
  if (ville.hasZoneCommerciale) {
    baseArguments.push(`Complétez votre présence physique en zone commerciale par une vitrine digitale`);
  }
  
  return baseArguments;
}

/**
 * Génère une FAQ locale adaptée
 */
export function generateLocalFAQ(ville: Ville, service: typeof services[0]): { question: string; answer: string }[] {
  const faq = [
    {
      question: `Combien coûte un ${service.nom.toLowerCase()} à ${ville.nom} ?`,
      answer: `Chez FastFabric, le prix d'un ${service.nom.toLowerCase()} est de ${service.prix}, que vous soyez à ${ville.nom} ou ailleurs dans le Val-d'Oise. Pas de surcoût géographique, prix transparent.`,
    },
    {
      question: `En combien de temps puis-je avoir mon site à ${ville.nom} ?`,
      answer: `Votre ${service.nom.toLowerCase()} est livré en ${service.deliveryTime} après validation de vos informations. FastFabric dessert ${ville.nom} (${ville.codePostal}) et toutes les communes du 95.`,
    },
  ];
  
  if (ville.nearbyVilles && ville.nearbyVilles.length > 0) {
    const nearbyNames = ville.nearbyVilles
      .slice(0, 3)
      .map(slug => getVilleBySlug(slug)?.nom)
      .filter(Boolean)
      .join(', ');
    faq.push({
      question: `Intervenez-vous aussi près de ${ville.nom} ?`,
      answer: `Oui, FastFabric crée des sites web pour ${ville.nom} et toutes les communes environnantes : ${nearbyNames}, et l'ensemble du Val-d'Oise.`,
    });
  }
  
  faq.push({
    question: `Pourquoi choisir FastFabric pour mon site à ${ville.nom} ?`,
    answer: `FastFabric combine rapidité (livraison 2h), qualité (design sur mesure) et prix accessibles (à partir de 299€). Nous comprenons les besoins des entreprises locales du Val-d'Oise.`,
  });
  
  return faq;
}
