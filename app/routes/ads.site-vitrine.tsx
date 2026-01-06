/**
 * Landing Page Ads - Site Vitrine
 * Page dédiée aux campagnes Google Ads (sans navigation pour max conversion)
 */

import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import type { Route } from "./+types/ads.site-vitrine";
import { 
  Check, ArrowRight, Star, Shield, Zap, Clock, 
  Phone, Mail, CheckCircle2, Users, Award
} from 'lucide-react';

export function meta() {
  return [
    { title: "Création Site Vitrine Professionnel | Livré en 4h | 599€ | FastFabric" },
    { name: "description", content: "Créez votre site vitrine professionnel en 4 heures seulement. Design sur mesure, 5 pages incluses, SEO optimisé. À partir de 599€. Devis gratuit immédiat." },
    { name: "robots", content: "noindex, nofollow" }, // No index for Ads pages
  ];
}

const features = [
  "5 pages professionnelles",
  "Design 100% personnalisé",
  "Responsive mobile parfait",
  "SEO optimisé Google",
  "Formulaire de contact",
  "Hébergement 1 an inclus",
  "Nom de domaine offert*",
  "2 révisions gratuites",
];

const testimonials = [
  {
    name: "Marie D.",
    role: "Avocate à Cergy",
    content: "Mon site a été livré en 3 heures. Qualité impeccable, mes clients sont impressionnés !",
    rating: 5,
  },
  {
    name: "Pierre L.",
    role: "Plombier à Argenteuil", 
    content: "Enfin un site pro à prix accessible. J'ai déjà reçu 5 demandes de devis cette semaine.",
    rating: 5,
  },
  {
    name: "Sophie M.",
    role: "Coach sportif à Pontoise",
    content: "Réactif, professionnel et le résultat dépasse mes attentes. Je recommande à 100%.",
    rating: 5,
  },
];

const guarantees = [
  { icon: Shield, text: "Satisfait ou remboursé 14j" },
  { icon: Zap, text: "Livraison express 4h" },
  { icon: Award, text: "Design premium" },
  { icon: Users, text: "+500 clients satisfaits" },
];

export default function AdsSiteVitrine() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    activity: '',
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
      source: 'ads-site-vitrine',
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
      <section className="bg-gradient-to-br from-gray-50 to-white py-12 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                <span className="animate-pulse">🔥</span>
                Offre limitée - Économisez 100€
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Votre <span className="text-[var(--accent)]">Site Vitrine</span> professionnel
                <br />livré en <span className="text-[var(--accent)]">4 heures</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                Design sur mesure, optimisé SEO, responsive mobile.
                Le site qui fait la différence pour votre activité.
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-8">
                <div className="text-5xl font-black text-gray-900">599€</div>
                <div className="text-xl text-gray-400 line-through">699€</div>
                <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                  -100€
                </div>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Guarantees */}
              <div className="flex flex-wrap gap-4">
                {guarantees.map((g) => (
                  <div key={g.text} className="flex items-center gap-2 text-sm text-gray-600">
                    <g.icon className="w-4 h-4 text-[var(--accent)]" />
                    {g.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Form */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8"
              >
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
                      Devis gratuit en 2 min
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Recevez un rappel personnalisé sous 5 minutes
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
                        <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-1">
                          Votre activité *
                        </label>
                        <input
                          type="text"
                          id="activity"
                          required
                          value={formData.activity}
                          onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                          placeholder="Plombier, Avocat, Restaurant..."
                        />
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
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Ils nous font confiance
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
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

      {/* Process */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Un processus simple et rapide pour obtenir votre site professionnel
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Décrivez votre projet', desc: 'Remplissez le formulaire avec vos besoins' },
              { step: '2', title: 'Validez le devis', desc: 'Paiement sécurisé par carte bancaire' },
              { step: '3', title: 'On crée votre site', desc: 'Notre équipe se met au travail' },
              { step: '4', title: 'Livraison en 4h', desc: 'Recevez votre site prêt à l\'emploi' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-[var(--accent)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Prêt à lancer votre site vitrine ?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Rejoignez les +500 professionnels qui nous font confiance.
            Livraison garantie en 4 heures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#top"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--accent)] text-white rounded-full font-bold hover:bg-[var(--accent)]/90 transition-colors"
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
            * Sous conditions, voir les CGV. 
            <Link to="/mentions-legales" className="underline ml-2">Mentions légales</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

