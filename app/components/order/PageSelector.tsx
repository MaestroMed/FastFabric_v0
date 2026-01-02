import { useState, useEffect } from 'react';
import { Check, Lock, Plus, AlertCircle } from 'lucide-react';
import { cn } from '~/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Page {
  id: string;
  name: string;
  required?: boolean;
}

interface PageSelectorProps {
  defaultPages: Page[];
  optionalPages: Page[];
  selectedPages: string[];
  onChange: (pages: string[]) => void;
  maxPages?: number;
  offerName?: string;
}

export function PageSelector({
  defaultPages,
  optionalPages,
  selectedPages,
  onChange,
  maxPages,
  offerName,
}: PageSelectorProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set([...defaultPages.map(p => p.id), ...selectedPages])
  );

  useEffect(() => {
    // Ensure default pages are always selected
    const defaultIds = defaultPages.map(p => p.id);
    const currentSelected = new Set([...defaultIds]);
    
    // Add previously selected optional pages that are still valid
    selectedPages.forEach(pageId => {
      if (optionalPages.some(p => p.id === pageId) || defaultIds.includes(pageId)) {
        currentSelected.add(pageId);
      }
    });
    
    setSelected(currentSelected);
    onChange(Array.from(currentSelected));
  }, [defaultPages.map(p => p.id).join(','), optionalPages.map(p => p.id).join(',')]);

  const togglePage = (pageId: string, isRequired: boolean) => {
    if (isRequired) return;
    
    const newSelected = new Set(selected);
    if (newSelected.has(pageId)) {
      newSelected.delete(pageId);
    } else {
      if (maxPages && newSelected.size >= maxPages) return;
      newSelected.add(pageId);
    }
    
    setSelected(newSelected);
    onChange(Array.from(newSelected));
  };

  const selectedCount = selected.size;
  const limitReached = maxPages !== undefined && maxPages > 0 && selectedCount >= maxPages;
  const isUnlimited = !maxPages || offerName === 'Sur Mesure';

  return (
    <div className="space-y-6">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pages du site
          </label>
          {offerName && (
            <p className="text-xs text-gray-500 mt-0.5">
              {offerName === 'One Page' && 'Idéal pour une page d\'atterrissage efficace'}
              {offerName === 'Site Vitrine' && 'Jusqu\'à 7 pages pour présenter votre activité'}
              {offerName === 'Sur Mesure' && 'Aucune limite, construisez votre site idéal'}
            </p>
          )}
        </div>
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
          limitReached 
            ? "bg-orange-100 text-orange-700" 
            : "bg-gray-100 text-gray-600"
        )}>
          {isUnlimited ? (
            <span>∞ pages</span>
          ) : (
            <>
              <span>{selectedCount}/{maxPages} pages</span>
              {limitReached && <AlertCircle className="w-4 h-4" />}
            </>
          )}
        </div>
      </div>

      {/* Required Pages */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
            Incluses par défaut
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {defaultPages.map((page) => (
              <motion.button
                key={page.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                type="button"
                disabled
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-900 text-white cursor-default shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                {page.name}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Optional Pages */}
      {optionalPages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              Optionnelles
            </span>
            <div className="flex-1 h-px bg-gray-200" />
            {!isUnlimited && (
              <span className="text-xs text-gray-400">
                {maxPages! - selectedCount} restantes
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {optionalPages.map((page) => {
                const isSelected = selected.has(page.id);
                const isDisabled = !isSelected && limitReached;
                
                return (
                  <motion.button
                    key={page.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={!isDisabled ? { scale: 1.02 } : undefined}
                    whileTap={!isDisabled ? { scale: 0.98 } : undefined}
                    type="button"
                    onClick={() => togglePage(page.id, false)}
                    disabled={isDisabled}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium",
                      "border-2 transition-all duration-200",
                      isSelected
                        ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-md shadow-blue-500/20"
                        : "border-gray-200 text-gray-600 hover:border-[var(--accent)] hover:text-[var(--accent)] bg-white",
                      isDisabled && "opacity-40 cursor-not-allowed hover:border-gray-200 hover:text-gray-600"
                    )}
                  >
                    <motion.span
                      initial={false}
                      animate={{ rotate: isSelected ? 0 : 0 }}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </motion.span>
                    {page.name}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Limit Warning */}
      {limitReached && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            Limite de pages atteinte pour cette offre. 
            {offerName !== 'Sur Mesure' && ' Passez à "Sur Mesure" pour plus de pages.'}
          </span>
        </motion.div>
      )}

      {/* Hidden input for form */}
      <input 
        type="hidden" 
        name="selectedPages" 
        value={JSON.stringify(Array.from(selected))} 
      />
    </div>
  );
}
