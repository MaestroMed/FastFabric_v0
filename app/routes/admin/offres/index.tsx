import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Route } from "./+types/index";
import { Card } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { localStore } from '~/lib/store';
import { formatPrice } from '~/lib/utils';
import { Plus, Edit, Trash2, GripVertical, Check } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Offres — Admin — FastFabric" },
  ];
}

export default function AdminOffres() {
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    setOffers(localStore.getOffers());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette offre ?')) {
      localStore.deleteOffer(id);
      setOffers(localStore.getOffers());
    }
  };

  const togglePopular = (offer: any) => {
    localStore.saveOffer({ ...offer, is_popular: !offer.is_popular });
    setOffers(localStore.getOffers());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offres</h1>
          <p className="text-gray-600">Gérez vos tarifs et options</p>
        </div>
        <Link to="/admin/offres/new">
          <Button>
            <Plus className="w-4 h-4" />
            Nouvelle offre
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {offers.map((offer) => (
          <Card key={offer.id} className="flex items-start gap-6">
            <div className="text-gray-400 cursor-move">
              <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{offer.name}</h3>
                {offer.is_popular && (
                  <Badge variant="info">Populaire</Badge>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">{offer.description}</p>
              
              <div className="flex items-baseline gap-2 mb-4">
                {offer.price_ttc > 0 ? (
                  <>
                    <span className="text-2xl font-bold text-gray-900">{offer.price_ttc}€</span>
                    <span className="text-sm text-gray-500">TTC</span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-gray-900">Sur devis</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {offer.features?.slice(0, 4).map((feature: string, i: number) => (
                  <Badge key={i} variant="default">
                    <Check className="w-3 h-3 mr-1" />
                    {feature}
                  </Badge>
                ))}
                {offer.features?.length > 4 && (
                  <Badge variant="default">+{offer.features.length - 4} autres</Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePopular(offer)}
              >
                {offer.is_popular ? 'Retirer badge' : 'Marquer populaire'}
              </Button>
              <Link to={`/admin/offres/${offer.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                  Modifier
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(offer.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}



