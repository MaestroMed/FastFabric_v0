import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '~/components/ui/Button';

export function FinalCTA() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gray-900 rounded-3xl p-12 md:p-16 overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-blue-500/30 to-transparent" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-purple-500/30 to-transparent" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Prêt à avoir votre site ?
              </h2>
              <p className="text-xl text-gray-300">
                Commandez maintenant, recevez votre site dans les heures qui suivent.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/commander">
                <Button size="lg" className="group whitespace-nowrap">
                  Commander mon site
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 bg-gradient-to-br from-[var(--accent)] to-purple-500 rounded-full flex items-center justify-center text-white"
              >
                <div className="text-center">
                  <Zap className="w-6 h-6 mx-auto" />
                  <span className="text-sm font-bold">2h</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



