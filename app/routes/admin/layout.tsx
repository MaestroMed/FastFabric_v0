import { useState } from 'react';
import { Link, Outlet, useLocation, Form } from 'react-router';
import type { Route } from "./+types/layout";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  FolderOpen, 
  Tags, 
  Settings, 
  Menu, 
  X,
  LogOut,
  ChevronDown,
  MessageSquare,
  Star,
  HelpCircle
} from 'lucide-react';
import { cn } from '~/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Commandes', href: '/admin/commandes', icon: ShoppingCart },
  { name: 'Offres', href: '/admin/offres', icon: Package },
  { name: 'Projets', href: '/admin/projets', icon: FolderOpen },
  { name: 'Tags', href: '/admin/tags', icon: Tags },
  { name: 'FAQ', href: '/admin/faq', icon: HelpCircle },
  { name: 'Témoignages', href: '/admin/temoignages', icon: Star },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
];

// Protect all admin routes
export async function loader({ request }: Route.LoaderArgs) {
  const { requireAuth } = await import('~/lib/auth.server');
  const session = await requireAuth(request);
  return { user: session.user };
}

// Handle logout
export async function action({ request }: Route.ActionArgs) {
  const { createLogoutCookie } = await import('~/lib/auth.server');
  const formData = await request.formData();
  const intent = formData.get('intent');
  
  if (intent === 'logout') {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/admin/login',
        'Set-Cookie': createLogoutCookie(),
      },
    });
  }
  
  return null;
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-900 text-sm font-bold">
                F
              </div>
              <span className="font-bold text-white">FastFabric</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/admin' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-white/10 text-white" 
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 space-y-1">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <FolderOpen className="w-5 h-5" />
              Voir le site
            </Link>
            <Form method="post">
              <input type="hidden" name="intent" value="logout" />
              <button
                type="submit"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </Form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {loaderData.user.email[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {loaderData.user.email}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown menu */}
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setUserMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Connecté en tant que</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{loaderData.user.email}</p>
                      </div>
                      <Link
                        to="/admin/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 inline-block mr-2" />
                        Paramètres
                      </Link>
                      <Form method="post">
                        <input type="hidden" name="intent" value="logout" />
                        <button
                          type="submit"
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 inline-block mr-2" />
                          Déconnexion
                        </button>
                      </Form>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
