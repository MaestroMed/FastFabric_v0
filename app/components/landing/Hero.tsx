import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight, Zap, Sparkles } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { HeroAnimation, SpeedLines, TypeWriter } from './HeroAnimation';
import { useRef } from 'react';

interface HeroProps {
  stats: {
    totalOrders: number;
    monthlyOrders: number;
  };
}

export function Hero({ stats }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Animated Background - Digital Weaving */}
      <HeroAnimation />
      
      {/* Speed Lines Effect */}
      <SpeedLines />

      {/* Gradient overlays */}
      <div className="absolute inset-0 -z-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-[70%] h-[70%] bg-gradient-radial from-blue-500/10 to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-radial from-indigo-500/10 to-transparent" />
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10"
      >
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-full text-sm font-medium text-gray-700 mb-8 shadow-lg shadow-gray-200/30"
          >
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            <span>Disponible maintenant</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </motion.div>

          {/* Title with dramatic reveal */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Votre site web.
            </motion.span>
            <br />
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="relative inline-block"
            >
              <span className="gradient-text">
                <TypeWriter text="En 2 heures." />
              </span>
              {/* Underline animation */}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] to-indigo-500 origin-left rounded-full"
              />
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600 mb-8 leading-relaxed"
          >
            <span className="font-medium text-gray-900">Sites professionnels sur mesure</span>, livrés à une vitesse record.
            <br />
            Design unique, optimisé conversion, prêt à générer du business.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <Link to="/commander">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button size="lg" className="group relative overflow-hidden">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  Commander mon site
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
            <Link to="#realisations">
              <Button variant="ghost" size="lg" className="backdrop-blur-sm bg-white/50 hover:bg-white/80">
                Voir les réalisations
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-lg rounded-2xl border border-gray-200/50"
          >
            <div className="flex -space-x-3">
              {['JD', 'ML', 'PT', 'SR'].map((initials, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.1, type: 'spring' }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-md"
                  style={{
                    background: [
                      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    ][i]
                  }}
                >
                  {initials}
                </motion.div>
              ))}
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, type: 'spring' }}
                className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-md"
              >
                +{stats.totalOrders}
              </motion.div>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">{stats.monthlyOrders || 127} sites</strong> livrés ce mois
              </p>
              <p className="text-xs text-amber-500 font-medium">★★★★★ 4.9/5</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Visual - Fabrication Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative perspective-1000"
        >
          {/* Main Browser Mockup with Fabric Effect */}
          <motion.div 
            className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/80 shadow-2xl shadow-gray-300/50 overflow-hidden"
            whileHover={{ rotateY: 5, rotateX: -5 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {/* Browser Header */}
            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/90 border-b border-gray-200/60">
              <div className="flex gap-1.5">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-red-400" 
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                  className="w-3 h-3 rounded-full bg-yellow-400" 
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                  className="w-3 h-3 rounded-full bg-green-400" 
                />
              </div>
              <div className="flex-1 px-3 py-1.5 bg-white rounded-lg text-xs text-gray-500 text-center font-medium">
                votresite.fr
              </div>
            </div>

            {/* Animated Content Preview - "Fabrication" Effect */}
            <div className="p-6 space-y-4 min-h-[300px]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1, duration: 0.8 }}
                className="h-4 bg-gray-100 rounded overflow-hidden"
              >
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="h-full w-full bg-gradient-to-r from-gray-200 to-gray-100"
                />
              </motion.div>
              
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="h-8 bg-gray-900 rounded"
              />
              
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '50%' }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="h-3 bg-gray-200 rounded"
              />
              
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.7, type: 'spring' }}
                className="h-10 w-32 bg-[var(--accent)] rounded-full mt-4"
              />
              
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.9 + i * 0.15 }}
                    className="h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg"
                  />
                ))}
              </div>

              {/* Fabrication Progress Overlay */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 2.5, duration: 0.5 }}
                className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center pointer-events-none"
              >
                <motion.div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: 2, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full mx-auto mb-2"
                  />
                  <span className="text-sm font-medium text-gray-600">Fabrication en cours...</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating Cards with Enhanced Animation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
            transition={{ 
              opacity: { delay: 1.5 },
              x: { delay: 1.5 },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="absolute -left-8 top-8 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-100/80 p-4 flex items-center gap-3"
          >
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center"
            >
              <Zap className="w-5 h-5 text-[var(--accent)]" />
            </motion.div>
            <div>
              <p className="text-xs text-gray-500">Livraison express</p>
              <p className="font-bold text-gray-900">~2 heures</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
            transition={{ 
              opacity: { delay: 1.7 },
              x: { delay: 1.7 },
              y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }
            }}
            className="absolute -right-4 top-1/2 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-100/80 p-4 flex items-center gap-3"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-lg"
            >
              ✓
            </motion.div>
            <div>
              <p className="text-xs text-gray-500">100% sur mesure</p>
              <p className="font-bold text-gray-900">Design unique</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{ 
              opacity: { delay: 1.9 },
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }
            }}
            className="absolute left-12 -bottom-6 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-100/80 p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center text-lg font-bold text-purple-600">
              €
            </div>
            <div>
              <p className="text-xs text-gray-500">Prix fixe TTC</p>
              <p className="font-bold text-gray-900">Pas de surprise</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-1"
        >
          <motion.div
            animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-3 bg-gray-400 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
