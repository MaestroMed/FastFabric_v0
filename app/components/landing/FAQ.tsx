import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '~/lib/utils';
import type { FaqItem } from '~/lib/store';

// Default FAQs as fallback
const defaultFaqs = [
  {
    id: '1',
    question: 'Comment pouvez-vous livrer si vite ?',
    answer: 'Notre processus est optimisé pour la rapidité. Grâce à notre expertise et nos outils, nous créons des sites sur mesure en un temps record. Plus vos informations sont complètes dès le départ, plus la livraison est rapide.',
    sort_order: 1,
    is_visible: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    question: 'Le site est-il vraiment sur mesure ?',
    answer: 'Absolument. Chaque site est créé spécifiquement pour vous, en fonction de vos besoins, votre identité et vos contenus. Pas de templates génériques, pas de copier-coller. Votre site est unique.',
    sort_order: 2,
    is_visible: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    question: 'Que reçois-je exactement ?',
    answer: 'Vous recevez l\'intégralité du code source (HTML, CSS, JS ou React). Sur demande, nous pouvons également mettre le site en ligne sur votre hébergement ou vous recommander une solution. Tout vous appartient.',
    sort_order: 3,
    is_visible: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    question: 'Et si je ne suis pas satisfait ?',
    answer: 'Les révisions sont incluses dans chaque offre. Si le résultat final ne correspond vraiment pas à vos attentes, nous retravaillons le site gratuitement. Votre satisfaction est notre priorité.',
    sort_order: 4,
    is_visible: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '5',
    question: 'Puis-je modifier le site après ?',
    answer: 'Oui, vous avez le code source complet. Vous pouvez le modifier vous-même ou nous confier les mises à jour. Nous proposons aussi des forfaits de maintenance si besoin.',
    sort_order: 5,
    is_visible: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '6',
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer: 'Nous acceptons toutes les cartes bancaires (Visa, Mastercard, Amex) via notre plateforme de paiement sécurisée. Le paiement déclenche immédiatement la production.',
    sort_order: 6,
    is_visible: true,
    created_at: '',
    updated_at: '',
  },
];

interface FAQProps {
  faqItems?: FaqItem[];
}

export function FAQ({ faqItems }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = faqItems && faqItems.length > 0 ? faqItems : defaultFaqs;

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-blue-100 text-[var(--accent)] rounded-full text-sm font-medium mb-4">
            ❓ FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur FastFabric
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <span className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0",
                  openIndex === index 
                    ? "bg-[var(--accent)] text-white rotate-0" 
                    : "bg-gray-100 text-gray-500"
                )}>
                  {openIndex === index ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
