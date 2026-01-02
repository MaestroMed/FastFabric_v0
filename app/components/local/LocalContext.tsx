/**
 * Composant de contexte local pour les pages SEO
 * Affiche les informations contextuelles sur une ville
 */

import { motion } from 'framer-motion';
import { MapPin, Users, Train, ShoppingBag, Building2 } from 'lucide-react';
import type { Ville } from '~/data/villes-95';

interface LocalContextProps {
  ville: Ville;
  description: string;
  economicContext?: string;
  stats?: { label: string; value: string }[];
}

export function LocalContext({ ville, description, economicContext, stats }: LocalContextProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-12 bg-gray-50 rounded-2xl p-8 my-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center">
          <MapPin className="w-6 h-6 text-[var(--accent)]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Votre site web à {ville.nom}
          </h2>
          <p className="text-gray-500 text-sm">{ville.codePostal} • Val-d'Oise</p>
        </div>
      </div>

      <div className="prose prose-lg max-w-none text-gray-700 mb-8">
        <p>{description}</p>
        {economicContext && <p className="text-gray-600">{economicContext}</p>}
      </div>

      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-xl text-center"
            >
              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {ville.population && (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-sm text-gray-600">
            <Users className="w-4 h-4 text-gray-400" />
            {ville.population.toLocaleString()} habitants
          </span>
        )}
        {ville.hasGare && (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-sm text-gray-600">
            <Train className="w-4 h-4 text-gray-400" />
            Gare SNCF
          </span>
        )}
        {ville.hasZoneCommerciale && (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-sm text-gray-600">
            <ShoppingBag className="w-4 h-4 text-gray-400" />
            Zone commerciale
          </span>
        )}
        {ville.villeType === 'grande_ville' && (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-sm text-gray-600">
            <Building2 className="w-4 h-4 text-gray-400" />
            Pôle économique
          </span>
        )}
      </div>
    </motion.section>
  );
}


