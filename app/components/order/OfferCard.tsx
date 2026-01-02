import { Check } from 'lucide-react';
import { cn, formatPrice } from '~/lib/utils';

interface Offer {
  id: string;
  name: string;
  description: string;
  price_ttc: number;
  features: string[];
  is_popular: boolean;
  estimated_hours: number;
}

interface OfferCardProps {
  offer: Offer;
  isSelected: boolean;
  onSelect: (offerId: string) => void;
}

export function OfferCard({ offer, isSelected, onSelect }: OfferCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(offer.id)}
      className={cn(
        "relative w-full text-left p-6 rounded-2xl border-2 transition-all duration-300",
        isSelected
          ? "border-[var(--accent)] bg-blue-50/50 shadow-lg shadow-blue-500/10"
          : "border-gray-200 hover:border-gray-300 bg-white",
        offer.is_popular && "ring-2 ring-[var(--accent)] ring-offset-2"
      )}
    >
      {/* Popular Badge */}
      {offer.is_popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 bg-[var(--accent)] text-white text-xs font-semibold rounded-full">
            Populaire
          </span>
        </div>
      )}

      {/* Selected Check */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{offer.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{offer.description}</p>
        </div>

        <div className="flex items-baseline gap-1">
          {offer.price_ttc > 0 ? (
            <>
              <span className="text-3xl font-bold text-gray-900">
                {offer.price_ttc}€
              </span>
              <span className="text-sm text-gray-500">TTC</span>
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-900">Sur devis</span>
          )}
        </div>

        {offer.estimated_hours > 0 && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            ⚡ Livré en ~{offer.estimated_hours}h
          </div>
        )}

        <ul className="space-y-2">
          {offer.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}



