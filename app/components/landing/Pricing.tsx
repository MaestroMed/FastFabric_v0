import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Check, Shield } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { cn } from '~/lib/utils';

interface Offer {
  id: string;
  name: string;
  description: string;
  price_ttc: number;
  features: string[];
  is_popular: boolean;
  estimated_hours: number;
}

interface PricingProps {
  offers: Offer[];
}

export function Pricing({ offers }: PricingProps) {
  return (
    <section id="offres" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
            Tarifs
          </span>
          <h2 className="text-4xl font-bold mt-2 mb-4">
            Une offre claire, sans surprise
          </h2>
          <p className="text-gray-600">
            Prix TTC, résultat garanti
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative bg-white rounded-2xl p-8 border-2 transition-all duration-300",
                offer.is_popular
                  ? "border-[var(--accent)] shadow-xl shadow-blue-100"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              {offer.is_popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-full">
                    Populaire
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-1">{offer.name}</h3>
                <p className="text-sm text-gray-500">{offer.description}</p>
              </div>

              <div className="text-center mb-8">
                {offer.price_ttc > 0 ? (
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold">{offer.price_ttc}</span>
                    <span className="text-xl font-semibold text-gray-400">€</span>
                    <span className="text-sm text-gray-400">TTC</span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold">Sur devis</span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {offer.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to={`/commander?offre=${offer.id}`} className="block">
                <Button
                  variant={offer.is_popular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  {offer.price_ttc > 0 ? 'Choisir cette offre' : 'Demander un devis'}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mt-12 py-4 px-6 bg-gray-50 rounded-xl max-w-lg mx-auto"
        >
          <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            <strong>Satisfait ou refait</strong> — Si le résultat ne vous convient pas, on recommence gratuitement
          </p>
        </motion.div>
      </div>
    </section>
  );
}



