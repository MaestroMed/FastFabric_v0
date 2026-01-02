import { motion } from 'framer-motion';
import { FileText, CreditCard, Code, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Remplissez le brief',
    description: 'Décrivez votre projet, partagez vos contenus et inspirations. Plus c\'est précis, plus c\'est rapide.',
    time: '~10 min',
  },
  {
    number: '02',
    icon: CreditCard,
    title: 'Réglez en ligne',
    description: 'Paiement sécurisé par carte. Votre commande est immédiatement mise en production.',
    time: '~2 min',
  },
  {
    number: '03',
    icon: Code,
    title: 'On construit',
    description: 'Notre équipe crée votre site sur mesure. Vous suivez l\'avancement en temps réel.',
    time: '~2h',
  },
  {
    number: '04',
    icon: Sparkles,
    title: 'Votre site est en ligne',
    description: 'Livraison du code source + mise en ligne optionnelle. Révisions incluses si besoin.',
    time: '✓ Terminé',
  },
];

export function Process() {
  return (
    <section id="process" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
            Processus
          </span>
          <h2 className="text-4xl font-bold mt-2 mb-4">
            Simple. Rapide. Efficace.
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            De votre commande à la mise en ligne, en seulement 4 étapes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-[var(--accent)] hover:shadow-xl transition-all duration-300"
            >
              <div className="text-4xl font-bold gradient-text mb-4">
                {step.number}
              </div>
              
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-[var(--accent)] mb-4 group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                <step.icon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{step.description}</p>
              
              <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-500">
                {step.time}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



