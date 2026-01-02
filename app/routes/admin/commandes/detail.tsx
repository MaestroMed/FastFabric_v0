import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import type { Route } from "./+types/detail";
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { localStore } from '~/lib/store';
import { formatPrice, formatDate, getStatusLabel, getStatusColor, cn } from '~/lib/utils';
import { ArrowLeft, Mail, Phone, Building, Palette, FileText, Check } from 'lucide-react';

const statusFlow = [
  { value: 'new', label: 'Nouvelle', color: 'bg-blue-500' },
  { value: 'in_progress', label: 'En production', color: 'bg-purple-500' },
  { value: 'review', label: 'En révision', color: 'bg-orange-500' },
  { value: 'completed', label: 'Livrée', color: 'bg-green-500' },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Détail commande — Admin — FastFabric" },
  ];
}

export default function AdminCommandeDetail() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [tags, setTags] = useState<any[]>([]);

  useEffect(() => {
    const orders = localStore.getOrders();
    setOrder(orders.find((o: any) => o.id === params.id));
    setTags(localStore.getTags());
  }, [params.id]);

  const updateStatus = (status: string) => {
    localStore.updateOrderStatus(params.id!, status as any);
    setOrder({ ...order, status });
  };

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Commande introuvable</p>
        <Link to="/admin/commandes" className="text-[var(--accent)] hover:underline mt-4 inline-block">
          Retour aux commandes
        </Link>
      </div>
    );
  }

  const currentStatusIndex = statusFlow.findIndex(s => s.value === order.status);
  const selectedTags = order.selected_tags
    ?.map((id: string) => tags.find((t: any) => t.id === id))
    .filter(Boolean) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/commandes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{order.order_number}</h1>
            <p className="text-gray-600">{formatDate(order.created_at)}</p>
          </div>
        </div>
        <Badge className={getStatusColor(order.status)} size="md">
          {getStatusLabel(order.status)}
        </Badge>
      </div>

      {/* Status Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {statusFlow.map((status, index) => {
              const isCompleted = index < currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              
              return (
                <div key={status.value} className="flex-1 relative">
                  {index > 0 && (
                    <div className={cn(
                      "absolute top-5 -left-1/2 right-1/2 h-0.5",
                      isCompleted || isCurrent ? "bg-green-500" : "bg-gray-200"
                    )} />
                  )}
                  
                  <button
                    onClick={() => updateStatus(status.value)}
                    className="relative flex flex-col items-center gap-2 w-full"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold transition-all z-10",
                      isCompleted ? "bg-green-500" : isCurrent ? status.color : "bg-gray-200 text-gray-500"
                    )}>
                      {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                    </div>
                    <span className={cn(
                      "text-xs font-medium",
                      isCurrent ? "text-gray-900" : "text-gray-500"
                    )}>
                      {status.label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          
          {order.status !== 'cancelled' && (
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-center">
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => updateStatus('cancelled')}
              >
                Annuler la commande
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold">
                {order.customer.firstName[0]}{order.customer.lastName[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                {order.customer.company && (
                  <p className="text-sm text-gray-500">{order.customer.company}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <a 
                href={`mailto:${order.customer.email}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--accent)]"
              >
                <Mail className="w-4 h-4" />
                {order.customer.email}
              </a>
              {order.customer.phone && (
                <a 
                  href={`tel:${order.customer.phone}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--accent)]"
                >
                  <Phone className="w-4 h-4" />
                  {order.customer.phone}
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Project Info */}
        <Card>
          <CardHeader>
            <CardTitle>Projet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nom du projet</p>
              <p className="font-semibold text-gray-900">{order.project_details.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-700">{order.project_details.description}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Objectif</p>
              <p className="text-gray-700">{order.project_details.objective}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Montant</p>
              <p className="text-2xl font-bold text-[var(--accent)]">{formatPrice(order.amount_ttc)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Pages sélectionnées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {order.selected_pages?.map((page: string) => (
                <Badge key={page} variant="default">
                  {getPageName(page)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Style & Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Style & Couleurs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Tags sélectionnés</p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 rounded-full text-xs text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Palette de couleurs</p>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg shadow-sm"
                    style={{ backgroundColor: order.primary_color }}
                  />
                  <span className="text-xs font-mono">{order.primary_color}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg shadow-sm"
                    style={{ backgroundColor: order.secondary_color }}
                  />
                  <span className="text-xs font-mono">{order.secondary_color}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      {order.project_details.content && (
        <Card>
          <CardHeader>
            <CardTitle>Contenus fournis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{order.project_details.content}</p>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {order.project_details.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes additionnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{order.project_details.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getPageName(id: string): string {
  const names: Record<string, string> = {
    home: 'Accueil',
    legal: 'Mentions légales',
    about: 'À propos',
    services: 'Services',
    portfolio: 'Portfolio',
    blog: 'Blog',
    contact: 'Contact',
    faq: 'FAQ',
    pricing: 'Tarifs',
    team: 'Équipe',
    testimonials: 'Témoignages',
    cgv: 'CGV',
    cgu: 'CGU',
    privacy: 'Confidentialité',
  };
  return names[id] || id;
}



