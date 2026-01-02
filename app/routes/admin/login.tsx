import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import type { Route } from "./+types/login";
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { signIn, createSessionCookie, getSession } from '~/lib/auth.server';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Connexion Admin — FastFabric" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

// Server-side: check if already logged in
export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (session) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/admin' },
    });
  }
  return null;
}

// Server-side: handle login
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirectTo') as string || '/admin';

  if (!email || !password) {
    return { error: 'Email et mot de passe requis' };
  }

  const result = await signIn(email, password);

  if (!result.success || !result.session) {
    return { error: result.error || 'Erreur de connexion' };
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectTo,
      'Set-Cookie': createSessionCookie(result.session),
    },
  });
}

export default function AdminLogin({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-2xl mb-4">
            <span className="text-2xl font-black text-gray-900">F</span>
          </div>
          <h1 className="text-2xl font-bold text-white">FastFabric</h1>
          <p className="text-gray-400 mt-1">Espace Administration</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8">
          <form method="post" onSubmit={() => setIsLoading(true)}>
            <input type="hidden" name="redirectTo" value={redirectTo} />
            
            {/* Error message */}
            {actionData?.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{actionData.error}</p>
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                    placeholder="admin@fastfabric.fr"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-6 bg-white text-gray-900 hover:bg-gray-100"
              isLoading={isLoading}
            >
              {isLoading ? 'Connexion...' : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-500 text-center">
              Mode démo : <code className="text-gray-400">admin@fastfabric.fr</code> / <code className="text-gray-400">admin123</code>
            </p>
          </div>
        </Card>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a 
            href="/" 
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Retour au site
          </a>
        </div>
      </motion.div>
    </div>
  );
}


