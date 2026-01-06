import { useState } from 'react';
import { Check, Type, Palette } from 'lucide-react';
import { cn } from '~/lib/utils';

interface LogoGeneratorProps {
  businessName: string;
  description: string;
  style: string;
  colors: string[];
  onSelect: (logoUrl: string | null, concept: string) => void;
}

// Prédéfinis de styles de logo texte
const logoStyles = [
  { id: 'modern', name: 'Moderne', font: 'font-sans font-bold tracking-tight' },
  { id: 'elegant', name: 'Élégant', font: 'font-serif italic' },
  { id: 'bold', name: 'Impact', font: 'font-black uppercase tracking-widest' },
  { id: 'minimal', name: 'Minimal', font: 'font-light tracking-[0.3em] uppercase' },
];

export function LogoGenerator({
  businessName,
  description,
  style,
  colors,
  onSelect,
}: LogoGeneratorProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>('modern');
  const [useInitials, setUseInitials] = useState(false);

  // Générer les initiales
  const initials = businessName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const displayText = useInitials ? initials : businessName;

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    const selectedStyleObj = logoStyles.find(s => s.id === styleId);
    onSelect(null, `Logo texte ${selectedStyleObj?.name} - ${useInitials ? 'Initiales' : 'Nom complet'}`);
  };

  const handleInitialsToggle = (useInit: boolean) => {
    setUseInitials(useInit);
    const selectedStyleObj = logoStyles.find(s => s.id === selectedStyle);
    onSelect(null, `Logo texte ${selectedStyleObj?.name} - ${useInit ? 'Initiales' : 'Nom complet'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-white/70">
          Style de logo
        </label>
      </div>

      {/* Toggle Initiales / Nom complet */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
        <button
          type="button"
          onClick={() => handleInitialsToggle(false)}
          className={cn(
            "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
            !useInitials 
              ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white" 
              : "text-white/50 hover:text-white/70"
          )}
        >
          <Type className="w-4 h-4 inline mr-2" />
          Nom complet
        </button>
        <button
          type="button"
          onClick={() => handleInitialsToggle(true)}
          className={cn(
            "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
            useInitials 
              ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white" 
              : "text-white/50 hover:text-white/70"
          )}
        >
          <Palette className="w-4 h-4 inline mr-2" />
          Initiales
        </button>
      </div>

      {/* Aperçu principal */}
      <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10" />
        <div className="relative flex items-center justify-center">
          <div 
            className={cn(
              "px-8 py-4 rounded-xl text-white text-3xl",
              logoStyles.find(s => s.id === selectedStyle)?.font
            )}
            style={{ 
              background: `linear-gradient(135deg, ${colors[0] || '#8b5cf6'} 0%, ${colors[1] || '#d946ef'} 100%)`,
              boxShadow: `0 20px 40px -10px ${colors[0] || '#8b5cf6'}50`
            }}
          >
            {displayText || 'Votre Logo'}
          </div>
        </div>
      </div>

      {/* Styles de logo */}
      <div className="grid grid-cols-2 gap-3">
        {logoStyles.map((logoStyle) => (
          <button
            key={logoStyle.id}
            type="button"
            onClick={() => handleStyleSelect(logoStyle.id)}
            className={cn(
              "relative p-4 rounded-xl border-2 transition-all duration-300 text-left",
              selectedStyle === logoStyle.id
                ? "border-violet-500/50 bg-violet-500/10"
                : "border-white/10 hover:border-white/20 bg-white/5"
            )}
          >
            {/* Preview mini */}
            <div 
              className={cn(
                "text-white mb-2 truncate",
                logoStyle.font,
                useInitials ? "text-xl" : "text-sm"
              )}
              style={{ color: colors[0] || '#8b5cf6' }}
            >
              {displayText || 'Logo'}
            </div>
            
            <p className="text-xs text-white/50">{logoStyle.name}</p>
            
            {selectedStyle === logoStyle.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Info */}
      <p className="text-xs text-white/40 text-center">
        💡 Votre logo sera créé avec votre palette de couleurs et le style choisi
      </p>

      {/* Hidden inputs */}
      <input 
        type="hidden" 
        name="logoOption" 
        value="text"
      />
      <input 
        type="hidden" 
        name="logoStyle" 
        value={selectedStyle} 
      />
      <input 
        type="hidden" 
        name="logoUseInitials" 
        value={useInitials ? 'true' : 'false'} 
      />
    </div>
  );
}
