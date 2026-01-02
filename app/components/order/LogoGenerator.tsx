import { useState } from 'react';
import { useFetcher } from 'react-router';
import { Sparkles, RefreshCw, Check, Wand2 } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { cn } from '~/lib/utils';

interface LogoGeneratorProps {
  businessName: string;
  description: string;
  style: string;
  colors: string[];
  onSelect: (logoUrl: string | null, concept: string) => void;
}

export function LogoGenerator({
  businessName,
  description,
  style,
  colors,
  onSelect,
}: LogoGeneratorProps) {
  const fetcher = useFetcher();
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);
  const [skipLogo, setSkipLogo] = useState(false);

  const isLoading = fetcher.state === 'submitting';
  const concepts = fetcher.data?.concepts || [];

  const generateLogos = () => {
    fetcher.submit(
      { businessName, description, style, colors: JSON.stringify(colors) },
      { method: 'POST', action: '/api/gemini/generate-logo' }
    );
  };

  const selectConcept = (index: number, concept: string) => {
    setSelectedConcept(index);
    setSkipLogo(false);
    onSelect(null, concept); // For now, just the concept text
  };

  const handleSkip = () => {
    setSkipLogo(true);
    setSelectedConcept(null);
    onSelect(null, '');
  };

  // Generate initials for placeholder logo
  const initials = businessName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Logo
        </label>
        <button
          type="button"
          onClick={handleSkip}
          className={cn(
            "text-sm",
            skipLogo ? "text-[var(--accent)] font-medium" : "text-gray-500 hover:text-gray-700"
          )}
        >
          {skipLogo ? '✓ Logo simple (texte)' : 'Utiliser un logo texte simple'}
        </button>
      </div>

      {!skipLogo && (
        <>
          {/* Generate Button */}
          {concepts.length === 0 && (
            <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Wand2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Génération de logo IA</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Notre IA va créer 4 concepts de logo personnalisés basés sur votre projet
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={generateLogos}
                  isLoading={isLoading}
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Générer des propositions
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-gray-100 animate-pulse flex items-center justify-center"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                </div>
              ))}
            </div>
          )}

          {/* Concepts */}
          {concepts.length > 0 && !isLoading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Sélectionnez un concept
                </span>
                <button
                  type="button"
                  onClick={generateLogos}
                  className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Régénérer
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {concepts.map((concept: string, index: number) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectConcept(index, concept)}
                    className={cn(
                      "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
                      selectedConcept === index
                        ? "border-[var(--accent)] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {/* Preview placeholder */}
                    <div 
                      className="aspect-square rounded-lg mb-3 flex items-center justify-center text-white font-bold text-2xl"
                      style={{ 
                        background: `linear-gradient(135deg, ${colors[0] || '#0071e3'} 0%, ${colors[1] || '#5856d6'} 100%)` 
                      }}
                    >
                      {initials}
                    </div>
                    
                    <p className="text-xs text-gray-600 line-clamp-3">{concept}</p>
                    
                    {selectedConcept === index && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Skip Logo Preview */}
      {skipLogo && (
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
              style={{ 
                background: `linear-gradient(135deg, ${colors[0] || '#0071e3'} 0%, ${colors[1] || '#5856d6'} 100%)` 
              }}
            >
              {initials}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{businessName}</p>
              <p className="text-sm text-gray-500">Logo texte avec vos initiales</p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden inputs */}
      <input 
        type="hidden" 
        name="logoOption" 
        value={skipLogo ? 'text' : selectedConcept !== null ? 'generated' : ''} 
      />
      <input 
        type="hidden" 
        name="logoConcept" 
        value={selectedConcept !== null ? concepts[selectedConcept] : ''} 
      />
    </div>
  );
}



