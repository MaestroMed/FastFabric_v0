import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Route } from "./+types/index";
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';
import { localStore } from '~/lib/store';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '~/lib/utils';
import { 
  TrendingUp, 
  TrendingDown,
  ShoppingCart, 
  CreditCard, 
  Clock, 
  ArrowRight, 
  CheckCircle2,
  AlertCircle,
  FileText,
  BarChart3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard — Admin — FastFabric" },
  ];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);

  useEffect(() => {
    const currentStats = localStore.getStats();
    setStats(currentStats);
    setRecentOrders(localStore.getOrders().slice(0, 5));

    // Generate last 7 days revenue data
    const orders = localStore.getOrders();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate.toDateString() === date.toDateString();
      });
      
      last7Days.push({
        day: dayStr,
        revenue: dayOrders.reduce((sum, o) => sum + (o.amount_ttc || 0), 0),
        orders: dayOrders.length,
      });
    }
    setRevenueData(last7Days);

    // Status distribution
    setStatusData([
      { name: 'Nouvelles', value: currentStats.pendingOrders, color: '#3b82f6' },
      { name: 'En cours', value: currentStats.inProgressOrders, color: '#8b5cf6' },
      { name: 'Terminées', value: currentStats.completedOrders, color: '#22c55e' },
      { name: 'Annulées', value: currentStats.cancelledOrders || 0, color: '#ef4444' },
    ].filter(d => d.value > 0));
  }, []);

  if (!stats) return null;

  const monthlyGrowth = stats.lastMonthOrders > 0 
    ? Math.round(((stats.monthlyOrders - stats.lastMonthOrders) / stats.lastMonthOrders) * 100)
    : 0;

  const revenueGrowth = stats.lastMonthRevenue > 0
    ? Math.round(((stats.monthlyRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100)
    : 0;

  const statCards = [
    { 
      label: 'Commandes ce mois', 
      value: stats.monthlyOrders, 
      icon: ShoppingCart, 
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: monthlyGrowth,
    },
    { 
      label: 'Revenus ce mois', 
      value: formatPrice(stats.monthlyRevenue), 
      icon: CreditCard, 
      color: 'text-green-600',
      bg: 'bg-green-50',
      trend: revenueGrowth,
    },
    { 
      label: 'En attente', 
      value: stats.pendingOrders, 
      icon: Clock, 
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      alert: stats.pendingOrders > 5,
    },
    { 
      label: 'Délai moyen', 
      value: `${stats.avgDeliveryTime}h`, 
      icon: TrendingUp, 
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de votre activité</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total des revenus</p>
          <p className="text-3xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.trend !== undefined && stat.trend !== 0 && (
                    <span className={`flex items-center text-xs font-medium ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(stat.trend)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            {stat.alert && (
              <div className="absolute top-2 right-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-500" />
              Revenus (7 derniers jours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.some(d => d.revenue > 0) ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0071e3" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0071e3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip 
                    formatter={(value: number) => [`${value}€`, 'Revenus']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0071e3" 
                    strokeWidth={2}
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-400">
                <p>Pas de données sur les 7 derniers jours</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition statuts</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {statusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-gray-600">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[150px] flex items-center justify-center text-gray-400">
                <p>Aucune commande</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats.pendingOrders > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {stats.pendingOrders} commande{stats.pendingOrders > 1 ? 's' : ''} en attente
              </p>
              <p className="text-sm text-gray-600">
                Des clients attendent leurs sites !
              </p>
            </div>
            <Link 
              to="/admin/commandes?status=new"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              Voir les commandes
            </Link>
          </div>
        </Card>
      )}

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières commandes</CardTitle>
          <Link 
            to="/admin/commandes" 
            className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune commande pour le moment</p>
              <p className="text-sm text-gray-400 mt-1">Les nouvelles commandes apparaîtront ici</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Commande</th>
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Projet</th>
                    <th className="pb-3 font-medium">Statut</th>
                    <th className="pb-3 font-medium text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <Link to={`/admin/commandes/${order.id}`} className="font-mono text-sm text-[var(--accent)] hover:underline">
                          {order.order_number}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {order.customer.firstName[0]}{order.customer.lastName[0]}
                          </div>
                          <span className="text-sm">{order.customer.firstName} {order.customer.lastName}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {order.project_details.name}
                      </td>
                      <td className="py-3">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </td>
                      <td className="py-3 text-right font-semibold">
                        {order.is_quote ? (
                          <span className="text-purple-600">Devis</span>
                        ) : (
                          formatPrice(order.amount_ttc)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Link to="/admin/offres" className="block">
          <Card className="hover:border-[var(--accent)] transition-colors cursor-pointer h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Offres</p>
                <p className="text-sm text-gray-500">Prix & services</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/admin/projets" className="block">
          <Card className="hover:border-[var(--accent)] transition-colors cursor-pointer h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Portfolio</p>
                <p className="text-sm text-gray-500">Réalisations</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/admin/faq" className="block">
          <Card className="hover:border-[var(--accent)] transition-colors cursor-pointer h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">FAQ</p>
                <p className="text-sm text-gray-500">Questions</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/admin/settings" className="block">
          <Card className="hover:border-[var(--accent)] transition-colors cursor-pointer h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">Paramètres</p>
                <p className="text-sm text-gray-500">Configuration</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
