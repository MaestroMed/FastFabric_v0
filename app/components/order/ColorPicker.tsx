import { useState, useEffect } from 'react';
import { Check, Palette, Pipette } from 'lucide-react';
import { cn, colorPalettes } from '~/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorPickerProps {
  primaryColor: string;
  secondaryColor: string;
  onChange: (primary: string, secondary: string) => void;
  previewElement?: React.RefObject<HTMLDivElement | null>;
}

export function ColorPicker({ 
  primaryColor, 
  secondaryColor, 
  onChange,
  previewElement 
}: ColorPickerProps) {
  const [primary, setPrimary] = useState(primaryColor);
  const [secondary, setSecondary] = useState(secondaryColor);
  const [customMode, setCustomMode] = useState(false);
  const [hoveredPalette, setHoveredPalette] = useState<string | null>(null);

  useEffect(() => {
    // Update CSS variables for live preview
    document.documentElement.style.setProperty('--preview-primary', primary);
    document.documentElement.style.setProperty('--preview-secondary', secondary);
    
    // Update preview element if provided
    if (previewElement?.current) {
      previewElement.current.style.setProperty('--accent', primary);
    }
    
    onChange(primary, secondary);
  }, [primary, secondary, onChange, previewElement]);

  const selectPalette = (palette: typeof colorPalettes[0]) => {
    setPrimary(palette.primary);
    setSecondary(palette.secondary);
    setCustomMode(false);
  };

  const currentPalette = colorPalettes.find(
    p => p.primary === primary && p.secondary === secondary
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[var(--accent)]" />
          <label className="block text-sm font-medium text-gray-700">
            Palette de couleurs
          </label>
        </div>
        {currentPalette && !customMode && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-gray-500"
          >
            {currentPalette.name}
          </motion.span>
        )}
      </div>

      {/* Preset Palettes */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {colorPalettes.map((palette, index) => {
          const isSelected = primary === palette.primary && secondary === palette.secondary && !customMode;
          const isHovered = hoveredPalette === palette.id;
          
          return (
            <motion.button
              key={palette.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => selectPalette(palette)}
              onMouseEnter={() => setHoveredPalette(palette.id)}
              onMouseLeave={() => setHoveredPalette(null)}
              className={cn(
                "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200",
                isSelected 
                  ? "border-[var(--accent)] bg-blue-50 shadow-lg shadow-blue-500/10" 
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md bg-white"
              )}
            >
              <div className="flex gap-1.5">
                <motion.div 
                  className="w-7 h-7 rounded-full shadow-sm ring-2 ring-white"
                  style={{ backgroundColor: palette.primary }}
                  animate={{ 
                    scale: isHovered || isSelected ? 1.1 : 1,
                    rotate: isHovered ? -10 : 0
                  }}
                />
                <motion.div 
                  className="w-7 h-7 rounded-full shadow-sm ring-2 ring-white -ml-2"
                  style={{ backgroundColor: palette.secondary }}
                  animate={{ 
                    scale: isHovered || isSelected ? 1.1 : 1,
                    rotate: isHovered ? 10 : 0
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">{palette.name}</span>
              
              <AnimatePresence>
                {isSelected && (
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Custom Colors Toggle */}
      <motion.button
        type="button"
        onClick={() => setCustomMode(!customMode)}
        className="flex items-center gap-2 text-sm text-[var(--accent)] hover:underline"
        whileHover={{ x: 3 }}
      >
        <Pipette className="w-4 h-4" />
        {customMode ? 'Utiliser les palettes prédéfinies' : 'Choisir des couleurs personnalisées'}
      </motion.button>

      {/* Custom Color Pickers */}
      <AnimatePresence>
        {customMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-medium">Couleur principale</label>
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <input
                      type="color"
                      value={primary}
                      onChange={(e) => setPrimary(e.target.value)}
                      className="w-14 h-14 rounded-xl cursor-pointer border-0 p-1 bg-white shadow-sm"
                    />
                  </motion.div>
                  <input
                    type="text"
                    value={primary}
                    onChange={(e) => setPrimary(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-medium">Couleur secondaire</label>
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <input
                      type="color"
                      value={secondary}
                      onChange={(e) => setSecondary(e.target.value)}
                      className="w-14 h-14 rounded-xl cursor-pointer border-0 p-1 bg-white shadow-sm"
                    />
                  </motion.div>
                  <input
                    type="text"
                    value={secondary}
                    onChange={(e) => setSecondary(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Preview */}
      <motion.div 
        layout
        className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Aperçu en direct</span>
          <div className="flex gap-1">
            <div 
              className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm"
              style={{ backgroundColor: primary }}
            />
            <div 
              className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm -ml-1"
              style={{ backgroundColor: secondary }}
            />
          </div>
        </div>
        
        <motion.div 
          layout
          className="h-28 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden relative"
          style={{ 
            background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)` 
          }}
        >
          {/* Animated pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}
          />
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={`${primary}-${secondary}`}
          >
            Votre site
          </motion.span>
        </motion.div>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-shadow hover:shadow-lg"
            style={{ backgroundColor: primary }}
          >
            Bouton principal
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md"
            style={{ 
              backgroundColor: 'transparent',
              border: `2px solid ${primary}`,
              color: primary
            }}
          >
            Bouton secondaire
          </motion.button>
        </div>
      </motion.div>

      {/* Hidden inputs for form */}
      <input type="hidden" name="primaryColor" value={primary} />
      <input type="hidden" name="secondaryColor" value={secondary} />
    </div>
  );
}
