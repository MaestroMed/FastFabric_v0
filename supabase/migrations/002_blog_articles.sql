-- Migration: Blog Articles for SEO
-- Creates table for blog articles with full SEO support

-- Blog articles table
CREATE TABLE IF NOT EXISTS blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  category TEXT NOT NULL DEFAULT 'guide',
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  author TEXT DEFAULT 'FastFabric',
  reading_time INTEGER DEFAULT 5,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for published articles
CREATE INDEX IF NOT EXISTS idx_blog_articles_published 
ON blog_articles (is_published, published_at DESC);

-- Create index for category
CREATE INDEX IF NOT EXISTS idx_blog_articles_category 
ON blog_articles (category);

-- Create index for slug lookup
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug 
ON blog_articles (slug);

-- Enable RLS
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
CREATE POLICY "Public can read published articles"
ON blog_articles FOR SELECT
USING (is_published = true);

-- Admins can do everything
CREATE POLICY "Admins can manage articles"
ON blog_articles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_blog_article_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_articles_updated_at
BEFORE UPDATE ON blog_articles
FOR EACH ROW
EXECUTE FUNCTION update_blog_article_updated_at();

-- Insert sample articles for SEO
INSERT INTO blog_articles (slug, title, content, excerpt, meta_description, category, tags, is_published, published_at) VALUES
(
  'comment-creer-site-vitrine-efficace',
  'Comment créer un site vitrine efficace en 2026',
  E'# Comment créer un site vitrine efficace en 2026\n\nUn site vitrine est la carte de visite digitale de votre entreprise. Voici les clés pour créer un site qui convertit.\n\n## 1. Définir vos objectifs\n\nAvant de commencer, posez-vous les bonnes questions : Qui sont vos clients cibles ? Quel message voulez-vous transmettre ? Quelles actions attendez-vous des visiteurs ?\n\n## 2. Choisir un design professionnel\n\nLe design doit refléter votre image de marque tout en restant épuré et moderne. Privilégiez la lisibilité et la navigation intuitive.\n\n## 3. Optimiser pour le mobile\n\nPlus de 60% du trafic web provient des mobiles. Votre site doit être parfaitement responsive.\n\n## 4. Soigner le contenu\n\nDes textes clairs, des images de qualité, et des appels à l''action visibles sont essentiels pour convertir vos visiteurs.\n\n## 5. Travailler le SEO\n\nUn site invisible sur Google ne sert à rien. Optimisez vos titres, descriptions et contenus pour le référencement naturel.\n\n## Conclusion\n\nCréer un site vitrine efficace demande méthode et expertise. Chez FastFabric, nous vous livrons votre site professionnel en seulement 2 heures.',
  'Découvrez les 5 clés pour créer un site vitrine qui convertit en 2026. Guide complet avec conseils de professionnels.',
  'Guide complet pour créer un site vitrine efficace en 2026. Design, SEO, mobile-first : tous nos conseils pour un site qui convertit.',
  'guide',
  ARRAY['site vitrine', 'création site', 'webdesign', 'seo'],
  true,
  now()
),
(
  'site-vitrine-vs-landing-page-que-choisir',
  'Site vitrine vs Landing page : que choisir pour votre entreprise ?',
  E'# Site vitrine vs Landing page : que choisir ?\n\nVous hésitez entre un site vitrine et une landing page ? Ce guide vous aide à faire le bon choix.\n\n## Qu''est-ce qu''une Landing Page ?\n\nUne landing page (ou page d''atterrissage) est une page unique conçue pour convertir. Elle se concentre sur un seul objectif : capture d''email, vente, prise de RDV...\n\n**Avantages :**\n- Taux de conversion élevé\n- Message clair et focalisé\n- Prix accessible (299€ chez FastFabric)\n- Livraison rapide\n\n## Qu''est-ce qu''un Site Vitrine ?\n\nUn site vitrine comporte plusieurs pages pour présenter l''ensemble de votre activité : accueil, services, à propos, contact...\n\n**Avantages :**\n- Présentation complète de votre offre\n- Meilleur référencement (plus de contenus)\n- Image professionnelle renforcée\n- Évolutif dans le temps\n\n## Comment choisir ?\n\n**Optez pour une Landing Page si :**\n- Vous lancez un produit/service spécifique\n- Vous avez un budget limité\n- Vous voulez tester une idée rapidement\n\n**Optez pour un Site Vitrine si :**\n- Vous voulez présenter plusieurs services\n- Vous visez un référencement naturel durable\n- Vous représentez une entreprise établie\n\n## Notre conseil\n\nCommencez par une landing page pour valider votre marché, puis évoluez vers un site vitrine complet.',
  'Landing page ou site vitrine ? Découvrez les avantages de chaque solution pour faire le meilleur choix pour votre entreprise.',
  'Comparatif complet entre site vitrine et landing page. Découvrez quelle solution choisir selon votre activité et vos objectifs.',
  'comparatif',
  ARRAY['landing page', 'site vitrine', 'comparatif', 'création site'],
  true,
  now()
),
(
  'pourquoi-entreprises-cergy-ont-besoin-site-web',
  'Pourquoi les entreprises de Cergy ont besoin d''un site web en 2026',
  E'# Pourquoi les entreprises de Cergy ont besoin d''un site web\n\nCergy, préfecture du Val-d''Oise, compte plus de 66 000 habitants et des milliers d''entreprises. Dans ce contexte concurrentiel, un site web professionnel est devenu indispensable.\n\n## Le contexte économique de Cergy\n\nAvec l''université Paris-Cergy, les centres commerciaux et les zones d''activité, Cergy est un pôle économique majeur du 95. La concurrence y est forte dans tous les secteurs.\n\n## Les avantages d''un site web pour une entreprise cergypontaine\n\n### 1. Visibilité locale\n\nVos clients potentiels cherchent "plombier Cergy" ou "restaurant Cergy" sur Google. Sans site web, vous êtes invisible.\n\n### 2. Crédibilité\n\n87% des consommateurs font des recherches en ligne avant d''acheter localement. Un site professionnel inspire confiance.\n\n### 3. Disponibilité 24/7\n\nVotre site travaille pour vous même quand votre commerce est fermé. Prise de RDV, demandes de devis, tout se fait en ligne.\n\n### 4. Différenciation\n\nBeaucoup de commerces cergypontains n''ont pas encore de site. C''est l''opportunité de vous démarquer.\n\n## FastFabric, votre partenaire local\n\nNous connaissons le tissu économique du Val-d''Oise et créons des sites adaptés aux entreprises locales. Livraison en 2 heures, à partir de 299€.',
  'Découvrez pourquoi un site web est essentiel pour les entreprises de Cergy. Visibilité, crédibilité et différenciation locale.',
  'Les entreprises de Cergy ont besoin d''un site web pour exister en 2026. Découvrez les avantages d''une présence en ligne locale.',
  'local',
  ARRAY['cergy', 'val-d-oise', 'site web local', 'entreprise 95'],
  true,
  now()
),
(
  'site-web-ideal-restaurant',
  'Le site web idéal pour un restaurant : guide complet',
  E'# Le site web idéal pour un restaurant\n\nDans la restauration, l''appétit commence par les yeux. Votre site web doit donner envie de réserver une table.\n\n## Les éléments indispensables\n\n### 1. La carte en ligne\n\nVotre menu doit être facilement accessible, lisible sur mobile, avec des photos appétissantes. Pensez à inclure les allergènes et options végétariennes.\n\n### 2. Système de réservation\n\nIntégrez TheFork, Google Reserve ou un formulaire de réservation directe. Facilitez la vie de vos clients !\n\n### 3. Photos professionnelles\n\nInvestissez dans des photos de qualité de vos plats, de la salle et de l''équipe. L''ambiance doit transparaître.\n\n### 4. Informations pratiques\n\n- Horaires d''ouverture (avec fermetures exceptionnelles)\n- Adresse avec Google Maps\n- Numéro de téléphone cliquable\n- Moyens de paiement acceptés\n\n### 5. Avis clients\n\nIntégrez les avis Google ou TripAdvisor. La preuve sociale rassure les nouveaux clients.\n\n## Erreurs à éviter\n\n- Site non responsive (60% des recherches sont mobiles !)\n- Menu en PDF difficile à lire\n- Photos amateur ou anciennes\n- Informations obsolètes\n\n## Notre offre pour les restaurants\n\nChez FastFabric, nous créons des sites sur mesure pour les restaurants du Val-d''Oise. Design appétissant, réservation intégrée, livré en 2 heures.',
  'Guide complet pour créer le site web idéal pour votre restaurant. Menu digital, réservation, photos : tous nos conseils.',
  'Créez le site web parfait pour votre restaurant. Guide complet : menu en ligne, réservation, photos, et tous les éléments indispensables.',
  'secteur',
  ARRAY['restaurant', 'site restaurant', 'menu digital', 'réservation en ligne'],
  true,
  now()
),
(
  'tendances-webdesign-2026',
  'Tendances web design 2026 : ce qui va marquer l''année',
  E'# Tendances web design 2026\n\nLe web design évolue constamment. Voici les tendances qui vont dominer 2026.\n\n## 1. Le minimalisme poussé à l''extrême\n\nMoins c''est plus. Les interfaces épurées, avec beaucoup d''espace blanc et une typographie soignée, dominent.\n\n## 2. Les micro-interactions\n\nChaque clic, survol ou scroll déclenche une animation subtile. Ces micro-interactions rendent l''expérience plus engageante.\n\n## 3. Le dark mode par défaut\n\nDe plus en plus de sites proposent un mode sombre par défaut, plus reposant pour les yeux et économe en énergie sur les écrans OLED.\n\n## 4. L''IA générative\n\nL''intelligence artificielle permet de personnaliser l''expérience utilisateur en temps réel : contenus, recommandations, chatbots...\n\n## 5. Le scroll horizontal\n\nLongtemps tabou, le scroll horizontal revient pour les portfolios et les expériences immersives.\n\n## 6. La 3D accessible\n\nGrâce à WebGL et Three.js, la 3D devient accessible à tous sans plugin.\n\n## Comment appliquer ces tendances ?\n\nChez FastFabric, nous créons des sites modernes intégrant les meilleures pratiques du moment. Design premium, livré en 2 heures.',
  'Découvrez les 6 grandes tendances du web design en 2026 : minimalisme, micro-interactions, dark mode, IA et plus encore.',
  'Les tendances web design 2026 : minimalisme, micro-interactions, dark mode, IA générative. Guide complet pour un site moderne.',
  'actualite',
  ARRAY['webdesign', 'tendances', '2026', 'design', 'UX'],
  true,
  now()
);


