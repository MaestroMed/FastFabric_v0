import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, Zap, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '~/lib/utils';

const navLinks = [
  { href: '/#realisations', label: 'Réalisations' },
  { href: '/#offres', label: 'Offres' },
  { href: '/#process', label: 'Processus' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
];

const serviceLinks = [
  { href: '/site-vitrine', label: 'Site Vitrine', price: '599€', desc: 'Site multi-pages professionnel' },
  { href: '/landing-page', label: 'Landing Page', price: '299€', desc: 'Page unique haute conversion' },
  { href: '/site-sur-mesure', label: 'Sur Mesure', price: 'Devis', desc: 'Projet web personnalisé' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
  }, [location]);

  const isCommanderPage = location.pathname.startsWith('/commander');

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 py-2 shadow-sm'
            : 'bg-white/50 backdrop-blur-sm py-4'
        )}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow">
                <Zap className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">FastFabric</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Services Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
                  Services
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    isServicesOpen && "rotate-180"
                  )} />
                </button>

                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="p-2">
                        {serviceLinks.map((service) => (
                          <Link
                            key={service.href}
                            to={service.href}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <div>
                              <div className="font-medium text-gray-900 group-hover:text-[var(--accent)] transition-colors">
                                {service.label}
                              </div>
                              <div className="text-sm text-gray-500">{service.desc}</div>
                            </div>
                            <div className="text-sm font-bold text-[var(--accent)]">
                              {service.price}
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 p-3 bg-gray-50">
                        <Link
                          to="/commander"
                          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[var(--accent)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--accent)]/90 transition-colors"
                        >
                          Commander maintenant
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA - Always visible and prominent */}
            {!isCommanderPage && (
              <div className="hidden md:flex items-center gap-3">
                {/* Price badge */}
                <div className="text-right hidden lg:block">
                  <div className="text-xs text-gray-500">À partir de</div>
                  <div className="text-lg font-bold text-gray-900">299€</div>
                </div>

                {/* Main CTA */}
                <Link to="/commander">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group"
                  >
                    {/* Glow effect on scroll */}
                    {isScrolled && (
                      <div className="absolute inset-0 bg-[var(--accent)] rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                    )}
                    <div className={cn(
                      "relative flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all",
                      isScrolled
                        ? "bg-[var(--accent)] text-white shadow-lg"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    )}>
                      <Zap className="w-4 h-4" />
                      Commander
                    </div>
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Urgency banner - Shows when scrolled on non-commander pages */}
        <AnimatePresence>
          {isScrolled && !isCommanderPage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="hidden md:block overflow-hidden bg-gradient-to-r from-[var(--accent)] to-[#2563eb]"
            >
              <div className="container mx-auto px-6 py-1.5 flex items-center justify-center gap-2 text-white text-sm">
                <span className="animate-pulse">🔥</span>
                <span className="font-medium">Livraison express en 2h</span>
                <span className="mx-2 opacity-50">|</span>
                <span>Satisfait ou remboursé 14j</span>
                <Link to="/commander" className="ml-2 underline font-semibold hover:no-underline">
                  En profiter →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white pt-20 lg:hidden overflow-auto"
          >
            <nav className="container mx-auto px-6 py-8">
              {/* Services section */}
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Nos offres
                </div>
                <div className="space-y-2">
                  {serviceLinks.map((service) => (
                    <Link
                      key={service.href}
                      to={service.href}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">{service.label}</div>
                        <div className="text-sm text-gray-500">{service.desc}</div>
                      </div>
                      <div className="text-lg font-bold text-[var(--accent)]">{service.price}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Nav links */}
              <div className="border-t border-gray-100 pt-6 mb-6">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block py-3 text-lg font-medium text-gray-900"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              {!isCommanderPage && (
                <Link to="/commander">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--accent)] text-white rounded-xl font-bold text-lg shadow-lg"
                  >
                    <Zap className="w-5 h-5" />
                    Commander mon site
                  </motion.button>
                </Link>
              )}

              {/* Trust */}
              <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
                <span>✓ Livré en 2h</span>
                <span>✓ 14j remboursé</span>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
