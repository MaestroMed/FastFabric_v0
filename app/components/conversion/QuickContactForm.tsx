/**
 * Quick Contact Form - Mini form for bottom of SEO pages
 * 3 fields only: name, email, type of site
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, Loader2, Sparkles, ArrowRight } from 'lucide-react';

interface QuickContactFormProps {
  ville?: string;
  service?: string;
  secteur?: string;
  className?: string;
}

type SiteType = 'landing-page' | 'site-vitrine' | 'site-sur-mesure';

export function QuickContactForm({ 
  ville, 
  service, 
  secteur,
  className = '' 
}: QuickContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    siteType: '' as SiteType | '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Store lead in localStorage for demo
      const leads = JSON.parse(localStorage.getItem('fastfabric_leads') || '[]');
      leads.push({
        ...formData,
        ville,
        service,
        secteur,
        timestamp: new Date().toISOString(),
        source: window.location.pathname,
      });
      localStorage.setItem('fastfabric_leads', JSON.stringify(leads));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStatus('success');
      
      // Redirect to commander after 2s
      setTimeout(() => {
        window.location.href = `/commander?prefill=${encodeURIComponent(formData.siteType)}`;
      }, 2000);
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 text-center ${className}`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4"
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Merci {formData.name} ! 🎉
        </h3>
        <p className="text-gray-600">
          Redirection vers le formulaire de commande...
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      <div className="relative p-8 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-[var(--accent)] font-semibold">Devis gratuit en 2 min</span>
        </div>
        
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {ville 
            ? `Votre site web à ${ville}` 
            : secteur 
              ? `Un site web pour votre activité`
              : 'Lancez votre projet maintenant'
          }
        </h3>
        <p className="text-gray-400 mb-8">
          Recevez une réponse personnalisée dans les 5 minutes
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label htmlFor="quick-name" className="block text-sm font-medium text-gray-300 mb-2">
                Votre nom
              </label>
              <input
                type="text"
                id="quick-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jean Dupont"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="quick-email" className="block text-sm font-medium text-gray-300 mb-2">
                Votre email
              </label>
              <input
                type="email"
                id="quick-email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jean@entreprise.fr"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label htmlFor="quick-phone" className="block text-sm font-medium text-gray-300 mb-2">
                Téléphone <span className="text-gray-500">(optionnel)</span>
              </label>
              <input
                type="tel"
                id="quick-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="06 12 34 56 78"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
              />
            </div>

            {/* Site Type */}
            <div>
              <label htmlFor="quick-type" className="block text-sm font-medium text-gray-300 mb-2">
                Type de site souhaité
              </label>
              <select
                id="quick-type"
                required
                value={formData.siteType}
                onChange={(e) => setFormData({ ...formData, siteType: e.target.value as SiteType })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-gray-900">Sélectionnez...</option>
                <option value="landing-page" className="bg-gray-900">Landing Page (299€)</option>
                <option value="site-vitrine" className="bg-gray-900">Site Vitrine (599€)</option>
                <option value="site-sur-mesure" className="bg-gray-900">Sur Mesure (devis)</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                Recevoir mon devis gratuit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Trust */}
          <p className="text-center text-gray-500 text-sm">
            ✓ Réponse en 5 min · ✓ Sans engagement · ✓ Devis 100% gratuit
          </p>
        </form>
      </div>
    </motion.div>
  );
}

/**
 * Compact version for sidebars
 */
export function QuickContactFormCompact({ className = '' }: { className?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Store lead
    const leads = JSON.parse(localStorage.getItem('fastfabric_leads') || '[]');
    leads.push({
      email,
      timestamp: new Date().toISOString(),
      source: window.location.pathname,
      type: 'newsletter',
    });
    localStorage.setItem('fastfabric_leads', JSON.stringify(leads));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-xl p-4 text-center ${className}`}>
        <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
        <p className="text-green-700 font-medium">Merci ! On vous recontacte.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre email"
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--accent)] text-white rounded-xl font-semibold hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Être rappelé
          </>
        )}
      </button>
    </form>
  );
}

