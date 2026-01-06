/**
 * Landing Page Ads - Landing Page / One Page
 * Page dédiée aux campagnes Google Ads (sans navigation pour max conversion)
 */

import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import type { Route } from "./+types/ads.landing-page";
import { 
  Check, ArrowRight, Star, Shield, Zap, Clock, 
  Phone, CheckCircle2, Users, Award, Target, TrendingUp
} from 'lucide-react';

export function meta() {
  return [
    { title: "Création Landing Page Haute Conversion | Livré en 2h | 299€ | FastFabric" },
    { name: "description", content: "Créez votre landing page haute conversion en 2 heures. Design optimisé leads, responsive, SEO. À partir de 299€. Devis gratuit immédiat." },
    { name: "robots", content: "noindex, nofollow" }, // No index for Ads pages
  ];
}

const features = [
  "Page unique impactante",
  "Design haute conversion",
  "Responsive mobile parfait",
  "Optimisé pour les leads",
  "Formulaire intégré",
  "Hébergement 1 an inclus",
  "Analytics configuré",
  "1 révision gratuite",
];

const useCases = [
  {
    icon: Target,
    title: "Lancement produit",
    desc: "Présentez votre nouveau produit de façon percutante",
  },
  {
    icon: TrendingUp,
    title: "Campagnes Ads",
    desc: "Optimisez le ROI de vos campagnes publicitaires",
  },
  {
    icon: Users,
    title: "Génération de leads",
    desc: "Collectez des contacts qualifiés efficacement",
  },
];

const testimonials = [
  {
    name: "Thomas B.",
    role: "Consultant à Sarcelles",
    content: "Ma landing page m'a généré 40 leads en 1 mois. Investissement rentabilisé x10 !",
    rating: 5,
  },
  {
    name: "Julie R.",
    role: "Coach à Enghien",
    content: "Livraison ultra rapide, design canon. J'ai triplé mes inscriptions à mes webinars.",
    rating: 5,
  },
  {
    name: "Nicolas F.",
    role: "Artisan à Taverny",
    content: "Simple, efficace, pas cher. Exactement ce qu'il me fallait pour mes Ads Google.",
    rating: 5,
  },
];

const guarantees = [
  { icon: Shield, text: "Satisfait ou remboursé 14j" },
  { icon: Zap, text: "Livraison express 2h" },
  { icon: Award, text: "Design conversion" },
  { icon: Users, text: "+500 clients satisfaits" },
];

export default function AdsLandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Store lead
    const leads = JSON.parse(localStorage.getItem('fastfabric_leads') || '[]');
    leads.push({
      ...formData,
      source: 'ads-landing-page',
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('fastfabric_leads', JSON.stringify(leads));

    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header - no navigation */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
              <Zap className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">FastFabric</span>
          </div>
          <a 
            href="tel:+33757847424" 
            className="flex items-center gap-2 text-[var(--accent)] font-semibold"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">01 23 45 67 89</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 lg:py-20 relative overflow-hidden" id="top">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.1),transparent_50%)]" />

        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="text-white">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/20 border border-[var(--accent)]/30 rounded-full text-sm font-medium mb-6"
              >
                <Target className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-[var(--accent)]">Optimisé pour la conversion</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-5xl font-bold leading-tight mb-6"
              >
                Votre <span className="text-[var(--accent)]">Landing Page</span>
                <br />livrée en <span className="text-[var(--accent)]">2 heures</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 mb-8"
              >
                Une page unique qui convertit. Design pensé pour générer des leads
                et maximiser le ROI de vos campagnes.
              </motion.p>

              {/* Price */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-baseline gap-4 mb-8"
              >
                <div className="text-5xl font-black">299€</div>
                <div className="text-xl text-gray-400 line-through">399€</div>
                <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                  -25%
                </div>
              </motion.div>

              {/* Features list */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-3 mb-8"
              >
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </motion.div>

              {/* Guarantees */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                {guarantees.map((g) => (
                  <div key={g.text} className="flex items-center gap-2 text-sm text-gray-400">
                    <g.icon className="w-4 h-4 text-[var(--accent)]" />
                    {g.text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
                    >
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Merci {formData.name} !
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Nous vous rappelons dans les 5 prochaines minutes.
                    </p>
                    <Link
                      to="/commander"
                      className="inline-flex items-center gap-2 text-[var(--accent)] font-semibold"
                    >
                      Commander directement en ligne
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Votre devis en 2 min
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Décrivez votre projet, on vous rappelle sous 5 min
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Votre nom *
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                          placeholder="Jean Dupont"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Votre email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                          placeholder="jean@entreprise.fr"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Votre téléphone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                          placeholder="06 12 34 56 78"
                        />
                      </div>

                      <div>
                        <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                          Votre projet *
                        </label>
                        <select
                          id="project"
                          required
                          value={formData.project}
                          onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                        >
                          <option value="">Sélectionnez...</option>
                          <option value="ads">Campagne Google/Facebook Ads</option>
                          <option value="product">Lancement produit/service</option>
                          <option value="event">Événement / Webinar</option>
                          <option value="lead">Génération de leads</option>
                          <option value="other">Autre projet</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--accent)] text-white rounded-xl font-bold text-lg hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          'Envoi en cours...'
                        ) : (
                          <>
                            Recevoir mon devis gratuit
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      <p className="text-center text-sm text-gray-500">
                        ✓ Rappel sous 5 min · ✓ Sans engagement · ✓ 100% gratuit
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            La landing page parfaite pour...
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Quel que soit votre objectif, nous créons une page qui convertit
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-sm"
              >
                <div className="w-14 h-14 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <uc.icon className="w-7 h-7 text-[var(--accent)]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{uc.title}</h3>
                <p className="text-gray-600">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            +500 professionnels nous font confiance
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{t.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi FastFabric ?
          </h2>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div></div>
              <div className="font-bold text-gray-900">FastFabric</div>
              <div className="font-bold text-gray-500">Agence classique</div>
            </div>
            
            {[
              { label: 'Prix', ff: '299€', other: '1 500€+' },
              { label: 'Délai', ff: '2 heures', other: '2-4 semaines' },
              { label: 'Révisions', ff: 'Incluses', other: 'Facturées' },
              { label: 'Hébergement', ff: '1 an offert', other: 'En supplément' },
              { label: 'Support', ff: 'Réactif', other: 'Variable' },
            ].map((row) => (
              <div key={row.label} className="grid grid-cols-3 gap-4 py-4 border-b border-gray-200">
                <div className="font-medium text-gray-700">{row.label}</div>
                <div className="text-center text-green-600 font-semibold">{row.ff}</div>
                <div className="text-center text-gray-400">{row.other}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-[var(--accent)] to-[#2563eb]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Lancez votre landing page maintenant
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            299€ tout compris. Livraison en 2 heures. Satisfait ou remboursé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#top"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--accent)] rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Demander mon devis gratuit
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="tel:+33757847424"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Nous appeler
            </a>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-sm">
        <div className="container mx-auto px-6 text-center">
          <p>© {new Date().getFullYear()} FastFabric. Création de sites web professionnels.</p>
          <p className="mt-2">
            <Link to="/mentions-legales" className="underline">Mentions légales</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

