# FastFabric Premium

> Sites web sur mesure, livrés en 2 heures

Application complète de vente de sites web avec backoffice d'administration.

## Stack Technique

- **Frontend/Backend**: React Router v7 (ex-Remix)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Base de données**: Supabase (PostgreSQL) ou localStorage pour démo
- **IA**: Google Gemini API (génération de logos)
- **Paiement**: Prêt pour Stripe (mock pour démo)

## Fonctionnalités

### Landing Page
- Hero animé avec statistiques temps réel
- Carrousel de projets filtrable par tags
- Section offres dynamiques (gérées depuis le backoffice)
- Section processus
- FAQ accordéon
- Footer complet

### Formulaire de commande (4 étapes)
1. **Informations** - Coordonnées client + sélection offre
2. **Projet** - Sélection pages (boutons), tags de style, palette de couleurs avec preview live
3. **Contenu** - Upload contenus, génération de logo IA, sites d'inspiration
4. **Paiement** - Récapitulatif + paiement sécurisé

### Backoffice Admin
- **Dashboard** - Stats, commandes récentes, actions rapides
- **Commandes** - Liste, filtres, workflow de status (Nouvelle → En production → En révision → Livrée)
- **Offres** - CRUD complet, pages par défaut/optionnelles, prix TTC, badge populaire
- **Projets** - Portfolio, tags, couleurs, mise en avant
- **Tags** - Gestion par catégorie (Style, Secteur, Fonctionnalité)
- **Paramètres** - Configuration site, couleur accent, clés API

## Structure du projet

```
app/
├── components/
│   ├── landing/         # Composants de la landing page
│   ├── layout/          # Header, Footer
│   ├── order/           # Composants du formulaire
│   │   ├── PageSelector.tsx
│   │   ├── TagSelector.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── ProjectFilter.tsx
│   │   └── LogoGenerator.tsx
│   └── ui/              # Composants réutilisables
├── lib/
│   ├── store.ts         # Store localStorage pour démo
│   ├── supabase.server.ts
│   ├── gemini.server.ts
│   └── utils.ts
└── routes/
    ├── home.tsx         # Landing page
    ├── commander/       # Formulaire 4 étapes
    ├── admin/           # Backoffice
    └── api/             # API endpoints
```

## Installation

```bash
# Cloner et installer
cd fastfabric-premium
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés

# Lancer en développement
npm run dev
```

## Variables d'environnement

```env
# Supabase (optionnel - utilise localStorage par défaut)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gemini API (optionnel - fallback texte si absent)
GEMINI_API_KEY=your-gemini-api-key

# Stripe (pour paiement réel)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Déploiement

L'application est prête pour déploiement sur:
- **Vercel** - Recommandé, zero-config
- **Netlify** - Via adapter
- **Docker** - Dockerfile inclus

```bash
# Build de production
npm run build

# Démarrer en production
npm run start
```

## Personnalisation

### Offres
Gérez vos offres depuis le backoffice `/admin/offres`:
- Nom, description, prix TTC
- Pages incluses par défaut / optionnelles
- Fonctionnalités
- Badge "Populaire"

### Style
Depuis `/admin/settings`:
- Couleur accent du site
- Textes du hero
- Clés API

### Portfolio
Depuis `/admin/projets`:
- Ajouter des réalisations
- Associer des tags
- Définir les couleurs de preview

## Licence

MIT
