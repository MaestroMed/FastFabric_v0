import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { Route } from "./+types/index";
import { Card } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { localStore } from '~/lib/store';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '~/lib/utils';
import { Search, Eye, Download, FileText, CreditCard, Calendar, ArrowUpDown, RefreshCw } from 'lucide-react';
import { cn } from '~/lib/utils';

const statusFilters = [
  { value: '', label: 'Toutes' },
  { value: 'new', label: 'Nouvelles' },
  { value: 'quote_pending', label: 'Devis en attente' },
  { value: 'in_progress', label: 'En production' },
  { value: 'review', label: 'En révision' },
  { value: 'completed', label: 'Livrées' },
  { value: 'cancelled', label: 'Annulées' },
];

const typeFilters = [
  { value: '', label: 'Tous types' },
  { value: 'paid', label: 'Payées' },
  { value: 'quote', label: 'Devis' },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Commandes — Admin — FastFabric" },
  ];
}

export default function AdminCommandes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  
  const statusFilter = searchParams.get('status') || '';
  const typeFilter = searchParams.get('type') || '';
  const search = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'created_at';
  const sortOrder = searchParams.get('order') || 'desc';

  useEffect(() => {
    setOrders(localStore.getOrders());
    setOffers(localStore.getOffers());
  }, []);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const toggleSort = (field: string) => {
    const params = new URLSearchParams(searchParams);
    if (sortBy === field) {
      params.set('order', sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      params.set('sort', field);
      params.set('order', 'desc');
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesStatus = !statusFilter || order.status === statusFilter;
      const matchesType = !typeFilter || 
        (typeFilter === 'quote' ? order.is_quote : !order.is_quote);
      const matchesSearch = !search || 
        order.order_number.toLowerCase().includes(search.toLowerCase()) ||
        order.project_details.name.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(search.toLowerCase()) ||
        `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'amount':
          comparison = (a.amount_ttc || 0) - (b.amount_ttc || 0);
          break;
        case 'created_at':
        default:
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const hasActiveFilters = statusFilter || typeFilter || search;

  const stats = {
    total: orders.length,
    filtered: filteredOrders.length,
    totalRevenue: filteredOrders.reduce((sum, o) => sum + (o.amount_ttc || 0), 0),
    quotes: filteredOrders.filter(o => o.is_quote).length,
    paid: filteredOrders.filter(o => !o.is_quote).length,
  };

  const exportOrders = () => {
    const csv = [
      ['Numéro', 'Date', 'Client', 'Email', 'Téléphone', 'Entreprise', 'Projet', 'Offre', 'Pages', 'Montant TTC', 'Status', 'Type'],
      ...filteredOrders.map(o => {
        const offer = offers.find(of => of.id === o.offer_id);
        return [
          o.order_number,
          formatDate(o.created_at),
          `${o.customer.firstName} ${o.customer.lastName}`,
          o.customer.email,
          o.customer.phone || '',
          o.customer.company || '',
          o.project_details.name,
          offer?.name || '',
          o.selected_pages?.length || 0,
          o.amount_ttc,
          getStatusLabel(o.status),
          o.is_quote ? 'Devis' : 'Payée'
        ].map(v => `"${v}"`).join(',');
      })
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes-fastfabric-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-600">
            {hasActiveFilters 
              ? `${stats.filtered} sur ${stats.total} commande(s)` 
              : `${stats.total} commande(s) au total`}
          </p>
        </div>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              <RefreshCw className="w-4 h-4" />
              Réinitialiser
            </Button>
          )}
          <Button variant="outline" onClick={exportOrders}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.filtered}</p>
          <p className="text-sm text-gray-500">Commandes</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-green-600">{formatPrice(stats.totalRevenue)}</p>
          <p className="text-sm text-gray-500">Total</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.paid}</p>
          <p className="text-sm text-gray-500">Payées</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.quotes}</p>
          <p className="text-sm text-gray-500">Devis</p>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="sm" className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par numéro, projet, email ou nom..."
              value={search}
              onChange={(e) => updateFilter('q', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            {typeFilters.map((t) => (
              <button
                key={t.value}
                onClick={() => updateFilter('type', t.value)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2",
                  typeFilter === t.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {t.value === 'paid' && <CreditCard className="w-4 h-4" />}
                {t.value === 'quote' && <FileText className="w-4 h-4" />}
                {t.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusFilters.map((s) => (
            <button
              key={s.value}
              onClick={() => updateFilter('status', s.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                statusFilter === s.value
                  ? "bg-[var(--accent)] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Orders Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button 
                    onClick={() => toggleSort('created_at')}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    <Calendar className="w-3 h-3" />
                    Commande
                    {sortBy === 'created_at' && (
                      <ArrowUpDown className={cn("w-3 h-3", sortOrder === 'asc' && "rotate-180")} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Projet
                </th>
                <th className="px-6 py-3 text-left">
                  <button 
                    onClick={() => toggleSort('amount')}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Montant
                    {sortBy === 'amount' && (
                      <ArrowUpDown className={cn("w-3 h-3", sortOrder === 'asc' && "rotate-180")} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center">
                      <Search className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 font-medium">Aucune commande trouvée</p>
                      <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos filtres</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {order.is_quote ? (
                          <FileText className="w-4 h-4 text-purple-500" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-green-500" />
                        )}
                        <div>
                          <Link 
                            to={`/admin/commandes/${order.id}`}
                            className="font-mono font-medium text-gray-900 hover:text-[var(--accent)]"
                          >
                            {order.order_number}
                          </Link>
                          <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {order.customer.firstName[0]}{order.customer.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-900 truncate">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{order.customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-medium">{order.project_details.name}</p>
                      <p className="text-sm text-gray-500">
                        {order.selected_pages?.length || 0} pages
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {order.is_quote ? (
                        <span className="text-purple-600 font-medium">Sur devis</span>
                      ) : (
                        <span className="font-semibold text-gray-900">{formatPrice(order.amount_ttc)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/admin/commandes/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                          Détails
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
