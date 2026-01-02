import { useState, useEffect } from 'react';
import { Check, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '~/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Tag {
  id: string;
  name: string;
  category: 'style' | 'sector' | 'feature';
  color: string;
}

interface TagSelectorProps {
  tags: Tag[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export function TagSelector({ tags, selectedTags, onChange, maxTags = 5 }: TagSelectorProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedTags));

  useEffect(() => {
    setSelected(new Set(selectedTags));
  }, [selectedTags]);

  const toggleTag = (tagId: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(tagId)) {
      newSelected.delete(tagId);
    } else {
      if (maxTags && newSelected.size >= maxTags) return;
      newSelected.add(tagId);
    }
    setSelected(newSelected);
    onChange(Array.from(newSelected));
  };

  // Group tags by category
  const stylesTags = tags.filter(t => t.category === 'style');
  const sectorTags = tags.filter(t => t.category === 'sector');

  const limitReached = selected.size >= maxTags;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent)]" />
          <label className="block text-sm font-medium text-gray-700">
            Style & Secteur
          </label>
        </div>
        <motion.span 
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            limitReached 
              ? "bg-orange-100 text-orange-700" 
              : "bg-gray-100 text-gray-600"
          )}
          animate={{ scale: limitReached ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.2 }}
        >
          {selected.size}/{maxTags} sélectionnés
        </motion.span>
      </div>

      {/* Style Tags */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
            Style souhaité
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {stylesTags.map((tag) => {
              const isSelected = selected.has(tag.id);
              const isDisabled = !isSelected && limitReached;
              
              return (
                <motion.button
                  key={tag.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={!isDisabled ? { scale: 1.05 } : undefined}
                  whileTap={!isDisabled ? { scale: 0.95 } : undefined}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  disabled={isDisabled}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium",
                    "transition-all duration-200 shadow-sm",
                    isSelected
                      ? "text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow",
                    isDisabled && "opacity-40 cursor-not-allowed"
                  )}
                  style={{
                    backgroundColor: isSelected ? tag.color : undefined,
                    borderColor: isSelected ? tag.color : undefined,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {tag.name}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Sector Tags */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
            Secteur d'activité
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {sectorTags.map((tag) => {
              const isSelected = selected.has(tag.id);
              const isDisabled = !isSelected && limitReached;
              
              return (
                <motion.button
                  key={tag.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={!isDisabled ? { scale: 1.05 } : undefined}
                  whileTap={!isDisabled ? { scale: 0.95 } : undefined}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  disabled={isDisabled}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium",
                    "transition-all duration-200 shadow-sm",
                    isSelected
                      ? "text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow",
                    isDisabled && "opacity-40 cursor-not-allowed"
                  )}
                  style={{
                    backgroundColor: isSelected ? tag.color : undefined,
                    borderColor: isSelected ? tag.color : undefined,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {tag.name}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Limit Warning */}
      <AnimatePresence>
        {limitReached && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              Maximum de {maxTags} tags atteint. Désélectionnez-en un pour en choisir un autre.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden input for form */}
      <input 
        type="hidden" 
        name="selectedTags" 
        value={JSON.stringify(Array.from(selected))} 
      />
    </div>
  );
}
