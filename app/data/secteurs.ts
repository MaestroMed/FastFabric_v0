/**
 * Secteurs d'activité pour le SEO sectoriel
 * 12 métiers ciblés avec keywords et contenu spécifique
 */

export interface Secteur {
  id: string;
  slug: string;
  nom: string;
  nomPluriel: string;
  icon: string;
  description: string;
  problematique: string;
  fonctionnalites: string[];
  keywords: string[];
  faq: { question: string; answer: string }[];
  volumeEstime: 'eleve' | 'moyen' | 'faible';
}

export const secteurs: Secteur[] = [
  {
    id: 'avocat',
    slug: 'avocat',
    nom: 'Avocat',
    nomPluriel: 'Avocats',
    icon: '⚖️',
    description: 'Site web professionnel pour cabinet d\'avocat et juriste',
    problematique: 'Les avocats ont besoin d\'inspirer confiance dès le premier regard. Un site web professionnel renforce votre crédibilité et permet à vos futurs clients de vous trouver facilement.',
    fonctionnalites: [
      'Présentation des domaines de compétence',
      'Formulaire de prise de RDV sécurisé',
      'Section actualités juridiques',
      'Biographies de l\'équipe',
      'Mentions déontologiques obligatoires',
      'Témoignages clients anonymisés',
    ],
    keywords: ['site avocat', 'site cabinet juridique', 'site juriste', 'création site avocat', 'site web avocat'],
    faq: [
      {
        question: 'Un avocat peut-il avoir un site internet ?',
        answer: 'Oui, absolument. Le Règlement Intérieur National de la profession d\'avocat autorise la création de sites internet, sous réserve de respecter certaines règles déontologiques.',
      },
      {
        question: 'Quelles informations obligatoires sur un site d\'avocat ?',
        answer: 'Mentions légales, barreau d\'appartenance, assurance responsabilité civile, et mode de facturation doivent être clairement indiqués.',
      },
      {
        question: 'Combien coûte un site pour avocat ?',
        answer: 'Chez FastFabric, un site vitrine professionnel pour avocat coûte 599€ TTC, livré en 2-4 heures.',
      },
    ],
    volumeEstime: 'eleve',
  },
  {
    id: 'restaurant',
    slug: 'restaurant',
    nom: 'Restaurant',
    nomPluriel: 'Restaurants',
    icon: '🍽️',
    description: 'Site web et carte digitale pour restaurant et traiteur',
    problematique: 'Dans un secteur ultra-concurrentiel, votre site web est votre vitrine 24h/24. Il doit donner envie, présenter votre carte et permettre les réservations facilement.',
    fonctionnalites: [
      'Menu/carte digitale avec photos',
      'Système de réservation en ligne',
      'Galerie photos des plats',
      'Horaires et localisation',
      'Intégration Google Maps',
      'Lien vers services de livraison',
    ],
    keywords: ['site restaurant', 'site traiteur', 'carte digitale restaurant', 'menu en ligne', 'site web restaurant'],
    faq: [
      {
        question: 'Comment présenter ma carte sur le site ?',
        answer: 'Nous créons une carte digitale élégante avec photos, descriptions et prix. Elle est facile à modifier depuis votre espace.',
      },
      {
        question: 'Puis-je intégrer un système de réservation ?',
        answer: 'Oui, nous intégrons les principaux systèmes (TheFork, Google Reserve) ou un formulaire de réservation direct.',
      },
      {
        question: 'Le site sera-t-il visible sur Google ?',
        answer: 'Absolument, nous optimisons votre fiche Google Business et le référencement local pour apparaître dans les recherches "restaurant + ville".',
      },
    ],
    volumeEstime: 'eleve',
  },
  {
    id: 'artisan',
    slug: 'artisan',
    nom: 'Artisan',
    nomPluriel: 'Artisans',
    icon: '🔧',
    description: 'Site web pour artisan plombier, électricien, menuisier, maçon',
    problematique: 'Les artisans sont souvent débordés et n\'ont pas le temps de gérer leur présence en ligne. Un site efficace génère des demandes de devis qualifiées automatiquement.',
    fonctionnalites: [
      'Formulaire de demande de devis',
      'Galerie de réalisations',
      'Zones d\'intervention',
      'Certifications et assurances',
      'Témoignages clients',
      'Numéro de téléphone cliquable',
    ],
    keywords: ['site artisan', 'site plombier', 'site électricien', 'site menuisier', 'site maçon', 'site web artisan'],
    faq: [
      {
        question: 'Comment recevoir des demandes de devis via mon site ?',
        answer: 'Nous intégrons un formulaire de devis intelligent qui vous envoie directement les demandes par email ou SMS.',
      },
      {
        question: 'Puis-je montrer mes réalisations ?',
        answer: 'Oui, une galerie photos/vidéos de vos chantiers inspire confiance et montre votre savoir-faire.',
      },
      {
        question: 'Mon site sera-t-il trouvé localement ?',
        answer: 'Nous optimisons votre site pour les recherches locales type "plombier + ville" pour capter les clients de votre zone.',
      },
    ],
    volumeEstime: 'eleve',
  },
  {
    id: 'immobilier',
    slug: 'immobilier',
    nom: 'Agence Immobilière',
    nomPluriel: 'Agences Immobilières',
    icon: '🏠',
    description: 'Site web pour agence immobilière et agent indépendant',
    problematique: 'L\'immobilier est hyper-local. Votre site doit affirmer votre expertise du territoire et faciliter la mise en relation avec vendeurs et acheteurs.',
    fonctionnalites: [
      'Catalogue de biens avec filtres',
      'Fiches détaillées avec galerie',
      'Formulaire d\'estimation gratuite',
      'Espace vendeurs / acheteurs',
      'Intégration portails (SeLoger, LeBonCoin)',
      'Google Maps des biens',
    ],
    keywords: ['site agence immobilière', 'site agent immobilier', 'site mandataire', 'création site immobilier'],
    faq: [
      {
        question: 'Puis-je afficher mes annonces sur le site ?',
        answer: 'Oui, nous créons un catalogue de biens élégant que vous pouvez gérer facilement.',
      },
      {
        question: 'Le site peut-il générer des estimations ?',
        answer: 'Nous intégrons un formulaire d\'estimation qui capte les coordonnées des vendeurs potentiels.',
      },
      {
        question: 'Êtes-vous compatible avec les portails ?',
        answer: 'Le site complète votre présence sur les portails et renforce votre image de marque locale.',
      },
    ],
    volumeEstime: 'moyen',
  },
  {
    id: 'sante',
    slug: 'sante',
    nom: 'Professionnel de Santé',
    nomPluriel: 'Professionnels de Santé',
    icon: '🩺',
    description: 'Site web pour médecin, kinésithérapeute, dentiste, ostéopathe',
    problematique: 'Les patients cherchent en ligne avant de prendre RDV. Un site professionnel avec prise de RDV intégrée facilite leur parcours et remplit votre agenda.',
    fonctionnalites: [
      'Prise de RDV en ligne (Doctolib)',
      'Présentation du cabinet',
      'Spécialités et actes pratiqués',
      'Informations pratiques (accès, parking)',
      'Équipe soignante',
      'Conseils santé / actualités',
    ],
    keywords: ['site médecin', 'site kinésithérapeute', 'site dentiste', 'site ostéopathe', 'site cabinet médical'],
    faq: [
      {
        question: 'Puis-je intégrer Doctolib ?',
        answer: 'Oui, nous intégrons le widget Doctolib ou tout autre système de prise de RDV que vous utilisez.',
      },
      {
        question: 'Y a-t-il des règles particulières pour un site médical ?',
        answer: 'Oui, nous respectons les règles déontologiques (pas de publicité, informations objectives, etc.).',
      },
      {
        question: 'Le site aide-t-il à trouver de nouveaux patients ?',
        answer: 'Absolument, le référencement local vous fait apparaître sur les recherches "médecin + ville".',
      },
    ],
    volumeEstime: 'moyen',
  },
  {
    id: 'beaute',
    slug: 'beaute',
    nom: 'Salon de Beauté',
    nomPluriel: 'Salons de Beauté',
    icon: '💇',
    description: 'Site web pour coiffeur, esthéticienne, spa, institut de beauté',
    problematique: 'L\'image est primordiale dans la beauté. Votre site doit refléter votre univers et permettre aux clients de réserver facilement leurs prestations.',
    fonctionnalites: [
      'Galerie de réalisations',
      'Carte des prestations avec tarifs',
      'Réservation en ligne',
      'Présentation de l\'équipe',
      'Produits utilisés / vendus',
      'Avis clients mis en avant',
    ],
    keywords: ['site coiffeur', 'site esthéticienne', 'site salon de coiffure', 'site institut beauté', 'site spa'],
    faq: [
      {
        question: 'Mes clients pourront-ils réserver en ligne ?',
        answer: 'Oui, nous intégrons un système de réservation avec choix du créneau et du praticien.',
      },
      {
        question: 'Comment mettre en avant mon travail ?',
        answer: 'Une galerie Instagram-like de vos plus belles réalisations inspire confiance et montre votre talent.',
      },
      {
        question: 'Le site est-il adapté aux mobiles ?',
        answer: 'Évidemment, 80% de vos clients vous cherchent sur smartphone. Le site est 100% responsive.',
      },
    ],
    volumeEstime: 'moyen',
  },
  {
    id: 'commerce',
    slug: 'commerce',
    nom: 'Commerce de Proximité',
    nomPluriel: 'Commerces de Proximité',
    icon: '🛍️',
    description: 'Site web pour boutique, épicerie, fleuriste, boulangerie',
    problematique: 'Face aux grandes enseignes, les commerces de proximité doivent affirmer leur identité locale et faciliter le contact avec leur clientèle.',
    fonctionnalites: [
      'Présentation des produits/services',
      'Horaires d\'ouverture dynamiques',
      'Click & Collect (optionnel)',
      'Localisation et itinéraire',
      'Actualités et promotions',
      'Réseaux sociaux intégrés',
    ],
    keywords: ['site boutique', 'site commerce', 'site fleuriste', 'site boulangerie', 'site épicerie'],
    faq: [
      {
        question: 'Puis-je vendre en ligne ?',
        answer: 'Pour le e-commerce complet, c\'est un projet "Sur Mesure". Mais nous pouvons intégrer du Click & Collect simple.',
      },
      {
        question: 'Comment informer mes clients des nouveautés ?',
        answer: 'Une section actualités vous permet de communiquer promotions et nouveautés facilement.',
      },
      {
        question: 'Le site affiche-t-il mes horaires ?',
        answer: 'Oui, avec des horaires dynamiques et la possibilité d\'indiquer les fermetures exceptionnelles.',
      },
    ],
    volumeEstime: 'moyen',
  },
  {
    id: 'coach',
    slug: 'coach',
    nom: 'Coach & Consultant',
    nomPluriel: 'Coachs & Consultants',
    icon: '🎯',
    description: 'Site web pour coach, consultant, formateur, thérapeute',
    problematique: 'Votre expertise doit transparaître dès le premier clic. Un site qui inspire confiance et présente clairement vos services convertit les visiteurs en clients.',
    fonctionnalites: [
      'Page "À propos" impactante',
      'Présentation des services',
      'Témoignages et success stories',
      'Prise de RDV découverte',
      'Blog pour asseoir l\'expertise',
      'Intégration calendrier (Calendly)',
    ],
    keywords: ['site coach', 'site consultant', 'site formateur', 'site thérapeute', 'site coaching'],
    faq: [
      {
        question: 'Comment montrer mon expertise ?',
        answer: 'Une section blog et des études de cas démontrent votre valeur ajoutée et améliorent votre SEO.',
      },
      {
        question: 'Puis-je intégrer un calendrier de RDV ?',
        answer: 'Oui, Calendly, Cal.com ou tout autre outil de prise de RDV s\'intègre parfaitement.',
      },
      {
        question: 'Le site m\'aidera-t-il à être trouvé ?',
        answer: 'Le référencement sur votre spécialité et zone géographique vous apporte des prospects qualifiés.',
      },
    ],
    volumeEstime: 'moyen',
  },
  {
    id: 'association',
    slug: 'association',
    nom: 'Association',
    nomPluriel: 'Associations',
    icon: '🤝',
    description: 'Site web pour association, ONG, club sportif',
    problematique: 'Les associations ont souvent peu de moyens mais un grand besoin de visibilité pour recruter des adhérents et des bénévoles.',
    fonctionnalites: [
      'Présentation de la mission',
      'Actualités et événements',
      'Formulaire d\'adhésion',
      'Galerie photos',
      'Appel aux dons (optionnel)',
      'Contact et localisation',
    ],
    keywords: ['site association', 'site ONG', 'site club sportif', 'site association loi 1901'],
    faq: [
      {
        question: 'Le prix est-il adapté aux associations ?',
        answer: 'Oui, nos tarifs fixes sont accessibles. Une landing page à 299€ suffit souvent pour une petite association.',
      },
      {
        question: 'Puis-je recevoir des dons en ligne ?',
        answer: 'Nous pouvons intégrer un bouton de don via HelloAsso ou PayPal pour faciliter les contributions.',
      },
      {
        question: 'Comment gérer les adhésions ?',
        answer: 'Un formulaire d\'adhésion vous envoie directement les demandes. Pour la gestion complète, voyez notre offre Sur Mesure.',
      },
    ],
    volumeEstime: 'faible',
  },
  {
    id: 'auto-entrepreneur',
    slug: 'auto-entrepreneur',
    nom: 'Auto-Entrepreneur',
    nomPluriel: 'Auto-Entrepreneurs',
    icon: '💼',
    description: 'Site web pour auto-entrepreneur, freelance, indépendant',
    problematique: 'En solo, chaque euro compte. Un site pro mais abordable vous différencie et génère des contacts qualifiés sans exploser votre budget.',
    fonctionnalites: [
      'Page unique percutante (One Page)',
      'Présentation des services',
      'Portfolio / réalisations',
      'Formulaire de contact',
      'Témoignages clients',
      'Liens réseaux sociaux',
    ],
    keywords: ['site auto-entrepreneur', 'site freelance', 'site indépendant', 'création site micro-entreprise'],
    faq: [
      {
        question: 'Quel budget pour un site d\'auto-entrepreneur ?',
        answer: 'Notre Landing Page à 299€ est parfaite pour démarrer. Professionnelle et livrée en 2h.',
      },
      {
        question: 'Puis-je mettre à jour le site moi-même ?',
        answer: 'Le code source vous appartient. Pour les modifications, nous proposons un forfait maintenance.',
      },
      {
        question: 'Le site sera-t-il professionnel ?',
        answer: 'Absolument. Design moderne, responsive, et optimisé comme pour une grande entreprise.',
      },
    ],
    volumeEstime: 'eleve',
  },
  {
    id: 'pme',
    slug: 'pme-tpe',
    nom: 'PME / TPE',
    nomPluriel: 'PME / TPE',
    icon: '🏢',
    description: 'Site web professionnel pour petite et moyenne entreprise',
    problematique: 'Une PME a besoin d\'un site qui reflète son professionnalisme, présente son offre clairement et génère des leads commerciaux.',
    fonctionnalites: [
      'Pages multiples structurées',
      'Présentation de l\'entreprise',
      'Services / produits détaillés',
      'Équipe et valeurs',
      'Formulaire de contact pro',
      'Espace actualités',
    ],
    keywords: ['site PME', 'site TPE', 'site entreprise', 'création site professionnel', 'site société'],
    faq: [
      {
        question: 'Combien de pages puis-je avoir ?',
        answer: 'Notre Site Vitrine à 599€ inclut jusqu\'à 5 pages. Au-delà, voyez notre offre Sur Mesure.',
      },
      {
        question: 'Le site sera-t-il évolutif ?',
        answer: 'Oui, le code est propre et documenté. Il peut évoluer avec vos besoins.',
      },
      {
        question: 'Puis-je avoir plusieurs formulaires ?',
        answer: 'Absolument, formulaire de contact général, demande de devis, candidature... tout est possible.',
      },
    ],
    volumeEstime: 'eleve',
  },
  {
    id: 'startup',
    slug: 'startup',
    nom: 'Startup',
    nomPluriel: 'Startups',
    icon: '🚀',
    description: 'Landing page et site web pour startup et projet innovant',
    problematique: 'Les startups ont besoin de tester vite et d\'itérer. Une landing page pro permet de valider un concept et de collecter des leads rapidement.',
    fonctionnalites: [
      'Design moderne et impactant',
      'Proposition de valeur claire',
      'Formulaire de capture email',
      'Social proof (logos, chiffres)',
      'CTA conversion optimisé',
      'Analytics intégrés',
    ],
    keywords: ['landing page startup', 'site startup', 'MVP site web', 'site lancement produit'],
    faq: [
      {
        question: 'Une landing page suffit-elle pour lancer ?',
        answer: 'Oui ! C\'est même recommandé pour tester votre proposition de valeur avant d\'investir plus.',
      },
      {
        question: 'Puis-je collecter des emails ?',
        answer: 'Nous intégrons Mailchimp, Brevo, ou tout autre outil pour construire votre liste.',
      },
      {
        question: 'Le site peut-il évoluer ensuite ?',
        answer: 'Bien sûr, commencez par une landing page puis évoluez vers un site complet.',
      },
    ],
    volumeEstime: 'moyen',
  },
];

// Helpers
export function getSecteurBySlug(slug: string): Secteur | undefined {
  return secteurs.find(s => s.slug === slug);
}

export function getSecteursByVolume(volume: Secteur['volumeEstime']): Secteur[] {
  return secteurs.filter(s => s.volumeEstime === volume);
}

export function getAllSecteurSlugs(): string[] {
  return secteurs.map(s => s.slug);
}

export function generateSecteurSEOTitle(secteur: Secteur, service?: { nom: string }): string {
  if (service) {
    return `${service.nom} pour ${secteur.nom} | Création en 2h | FastFabric`;
  }
  return `Site Web pour ${secteur.nom} | Création en 2h | FastFabric`;
}

export function generateSecteurSEODescription(secteur: Secteur, service?: { nom: string; prix: string }): string {
  if (service) {
    return `Création de ${service.nom.toLowerCase()} pour ${secteur.nom.toLowerCase()}. ${secteur.problematique.slice(0, 100)}... À partir de ${service.prix}. Livré en 2h.`;
  }
  return `${secteur.description}. ${secteur.problematique.slice(0, 100)}... À partir de 299€. Livré en 2 heures.`;
}


