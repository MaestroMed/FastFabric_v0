-- FastFabric Database Schema
-- Run this migration in your Supabase SQL Editor

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Offers / Products
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_ttc DECIMAL(10,2) NOT NULL DEFAULT 0,
  default_pages TEXT[] DEFAULT '{}',
  optional_pages TEXT[] DEFAULT '{}',
  max_pages INTEGER,
  estimated_hours INTEGER DEFAULT 2,
  is_popular BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  max_revisions INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags for projects and filtering
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('style', 'sector', 'feature')),
  color VARCHAR(7) NOT NULL DEFAULT '#0071e3',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  description TEXT,
  colors TEXT[] DEFAULT '{}',
  preview_url TEXT,
  live_url TEXT,
  delivery_time VARCHAR(20),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project-Tag relationship
CREATE TABLE IF NOT EXISTS project_tags (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

-- Customer orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  offer_id UUID REFERENCES offers(id),
  
  -- Customer info
  customer_first_name VARCHAR(100) NOT NULL,
  customer_last_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  customer_company VARCHAR(100),
  
  -- Project details
  project_name VARCHAR(100) NOT NULL,
  project_description TEXT,
  project_objective TEXT,
  project_content TEXT,
  project_inspiration TEXT,
  project_notes TEXT,
  
  -- Quote specific (for "Sur devis")
  quote_budget VARCHAR(50),
  quote_deadline VARCHAR(50),
  quote_additional_info TEXT,
  quote_preferred_contact VARCHAR(20),
  
  -- Design choices
  selected_pages TEXT[] DEFAULT '{}',
  selected_tags UUID[] DEFAULT '{}',
  primary_color VARCHAR(7) DEFAULT '#0071e3',
  secondary_color VARCHAR(7) DEFAULT '#5856d6',
  logo_url TEXT,
  
  -- Status & payment
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'quote_pending', 'quote_sent', 'in_progress', 'review', 'completed', 'cancelled')),
  is_quote BOOLEAN DEFAULT FALSE,
  amount_ttc DECIMAL(10,2) DEFAULT 0,
  
  -- Stripe
  stripe_payment_intent_id VARCHAR(255),
  stripe_checkout_session_id VARCHAR(255),
  paid_at TIMESTAMPTZ,
  
  -- Revisions
  revisions_used INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order revisions history
CREATE TABLE IF NOT EXISTS order_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  feedback TEXT NOT NULL,
  zones_to_modify TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  invoice_number VARCHAR(20) UNIQUE NOT NULL,
  amount_ht DECIMAL(10,2) NOT NULL,
  amount_tva DECIMAL(10,2) NOT NULL,
  amount_ttc DECIMAL(10,2) NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings (key-value store)
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ items
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name VARCHAR(100) NOT NULL,
  author_role VARCHAR(100),
  author_company VARCHAR(100),
  author_avatar_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_offers_updated_at ON offers;
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_faq_items_updated_at ON faq_items;
CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON faq_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ policies (for anon users)
CREATE POLICY "Offers are viewable by everyone" ON offers FOR SELECT USING (true);
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);
CREATE POLICY "Featured projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Project tags are viewable by everyone" ON project_tags FOR SELECT USING (true);
CREATE POLICY "Visible FAQ items are viewable by everyone" ON faq_items FOR SELECT USING (is_visible = true);
CREATE POLICY "Visible testimonials are viewable by everyone" ON testimonials FOR SELECT USING (is_visible = true);

-- Orders: customers can view their own orders by order_number
CREATE POLICY "Orders are viewable by order number" ON orders FOR SELECT 
  USING (true); -- We'll control access via the API layer for simplicity

-- Order revisions: linked to orders
CREATE POLICY "Revisions are viewable" ON order_revisions FOR SELECT USING (true);

-- AUTHENTICATED (admin) policies
CREATE POLICY "Admins can manage offers" ON offers FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage tags" ON tags FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage projects" ON projects FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage project_tags" ON project_tags FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage orders" ON orders FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage revisions" ON order_revisions FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage invoices" ON invoices FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage settings" ON settings FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage FAQ" ON faq_items FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT 
  USING (auth.role() = 'authenticated');

-- INSERT policies for public (order creation)
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create revision requests" ON order_revisions FOR INSERT WITH CHECK (true);

-- ============================================
-- SEED DATA
-- ============================================

-- Default offers
INSERT INTO offers (name, description, price_ttc, default_pages, optional_pages, max_pages, estimated_hours, is_popular, sort_order, features, max_revisions)
VALUES 
  ('One Page', 'Landing page haute conversion', 299, 
   ARRAY['home', 'legal'], 
   ARRAY['contact', 'faq'], 
   2, 2, false, 1, 
   ARRAY['1 page responsive', 'Design sur mesure', 'Formulaire de contact', 'Optimisé SEO', 'Livraison 2-4h', '1 révision incluse'],
   1),
  ('Site Vitrine', 'Présence professionnelle complète', 599, 
   ARRAY['home', 'legal', 'about', 'contact'], 
   ARRAY['services', 'portfolio', 'blog', 'team', 'testimonials', 'faq', 'cgv', 'cgu', 'privacy'], 
   7, 6, true, 2, 
   ARRAY['Jusqu''à 5 pages', 'Design premium', 'Animations avancées', 'Blog ou portfolio', 'Livraison 4-8h', '2 révisions incluses'],
   2),
  ('Sur Mesure', 'Projet complexe ou spécifique', 0, 
   ARRAY['home', 'legal'], 
   ARRAY['about', 'services', 'portfolio', 'blog', 'contact', 'faq', 'pricing', 'team', 'testimonials', 'cgv', 'cgu', 'privacy'], 
   NULL, 0, false, 3, 
   ARRAY['Pages illimitées', 'Fonctionnalités custom', 'E-commerce possible', 'Intégrations API', 'Délai selon projet', 'Support dédié'],
   5)
ON CONFLICT DO NOTHING;

-- Default tags
INSERT INTO tags (name, category, color)
VALUES 
  ('Minimaliste', 'style', '#1d1d1f'),
  ('Moderne', 'style', '#0071e3'),
  ('Corporate', 'style', '#2c3e50'),
  ('Créatif', 'style', '#e91e63'),
  ('Luxe', 'style', '#c9a227'),
  ('Tech', 'style', '#5856d6'),
  ('Restaurant', 'sector', '#ff9500'),
  ('Immobilier', 'sector', '#14b8a6'),
  ('Startup', 'sector', '#6366f1'),
  ('E-commerce', 'sector', '#10b981'),
  ('Coach', 'sector', '#f472b6'),
  ('Architecture', 'sector', '#78716c')
ON CONFLICT DO NOTHING;

-- Default FAQ
INSERT INTO faq_items (question, answer, sort_order, is_visible)
VALUES
  ('Combien de temps pour recevoir mon site ?', 'Nos délais varient selon l''offre choisie : 2-4h pour une One Page, 4-8h pour un Site Vitrine. Pour les projets Sur Mesure, le délai est défini lors du devis.', 1, true),
  ('Puis-je demander des modifications ?', 'Absolument ! Chaque offre inclut un nombre de révisions (1 pour One Page, 2 pour Site Vitrine). Des révisions supplémentaires sont possibles moyennant un supplément.', 2, true),
  ('Comment fonctionne le paiement ?', 'Le paiement s''effectue en ligne par carte bancaire via notre plateforme sécurisée Stripe. Vous recevez une facture par email après le paiement.', 3, true),
  ('Que se passe-t-il après la commande ?', 'Vous recevez un email de confirmation avec un lien de suivi. Notre équipe démarre immédiatement la création. Vous êtes notifié à chaque étape importante.', 4, true),
  ('Le site est-il optimisé pour le référencement ?', 'Oui ! Tous nos sites sont optimisés SEO dès la conception : balises meta, structure sémantique, performance, et mobile-first.', 5, true),
  ('Proposez-vous l''hébergement ?', 'Nous livrons votre site prêt à déployer. Nous pouvons vous conseiller sur les meilleures options d''hébergement selon vos besoins.', 6, true)
ON CONFLICT DO NOTHING;

-- Default testimonials
INSERT INTO testimonials (author_name, author_role, author_company, content, rating, is_featured, is_visible)
VALUES
  ('Marie Dubois', 'Fondatrice', 'Studio Créatif', 'Incroyable ! Mon site était prêt en moins de 3 heures. Qualité professionnelle, design magnifique. Je recommande à 100%.', 5, true, true),
  ('Thomas Martin', 'CEO', 'TechFlow', 'Le rapport qualité-prix est imbattable. L''équipe a parfaitement compris notre vision et l''a traduite en un site exceptionnel.', 5, true, true),
  ('Sophie Laurent', 'Coach', 'Zen Coaching', 'Service client au top, réactivité impressionnante. Mon site reflète exactement mon identité. Merci FastFabric !', 5, true, true)
ON CONFLICT DO NOTHING;


