/**
 * Composant FAQ locale pour les pages SEO
 * Génère une FAQ avec Schema.org intégré
 */

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface LocalFAQProps {
  title: string;
  faq: FAQItem[];
  ville?: string;
}

export function LocalFAQ({ title, faq, ville }: LocalFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Schema.org FAQPage
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-12"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        {title}
      </h2>

      <div className="space-y-4">
        {faq.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900 pr-8">{item.question}</span>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`} 
              />
            </button>
            <motion.div
              initial={false}
              animate={{ 
                height: openIndex === index ? 'auto' : 0,
                opacity: openIndex === index ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-4 text-gray-600">
                {item.answer}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}


