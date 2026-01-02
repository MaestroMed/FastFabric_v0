import { useState, useEffect } from 'react';
import type { Route } from "./+types/settings";
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/Card';
import { Input, Textarea } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { localStore } from '~/lib/store';
import { Save, RefreshCw, Palette, Globe, Key } from 'lucide-react';
import { colorPalettes } from '~/lib/utils';
import { cn } from '~/lib/utils';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Paramètres — Admin — FastFabric" },
  ];
}

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'FastFabric',
    siteDescription: 'Sites web sur mesure en 2 heures',
    contactEmail: 'contact@fastfabric.fr',
    contactPhone: '',
    accentColor: '#0071e3',
    heroTitle: 'Votre site web. En 2 heures.',
    heroSubtitle: 'Sites professionnels sur mesure, livrés à une vitesse record.',
    geminiApiKey: '',
    stripePublicKey: '',
    stripeSecretKey: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings from store
    const savedSettings = {
      siteName: localStore.getSetting('siteName', 'FastFabric'),
      siteDescription: localStore.getSetting('siteDescription', 'Sites web sur mesure en 2 heures'),
      contactEmail: localStore.getSetting('contactEmail', 'contact@fastfabric.fr'),
      contactPhone: localStore.getSetting('contactPhone', ''),
      accentColor: localStore.getSetting('accentColor', '#0071e3'),
      heroTitle: localStore.getSetting('heroTitle', 'Votre site web. En 2 heures.'),
      heroSubtitle: localStore.getSetting('heroSubtitle', 'Sites professionnels sur mesure, livrés à une vitesse record.'),
      geminiApiKey: localStore.getSetting('geminiApiKey', ''),
      stripePublicKey: localStore.getSetting('stripePublicKey', ''),
      stripeSecretKey: localStore.getSetting('stripeSecretKey', ''),
    };
    setSettings(savedSettings);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    Object.entries(settings).forEach(([key, value]) => {
      localStore.setSetting(key, value);
    });
    
    // Update CSS variable
    document.documentElement.style.setProperty('--accent', settings.accentColor);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Réinitialiser toutes les données ? Cette action est irréversible.')) {
      localStore.reset();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600">Configuration globale du site</p>
        </div>
        <Button onClick={handleSave} className={saved ? 'bg-green-500 hover:bg-green-600' : ''}>
          <Save className="w-4 h-4" />
          {saved ? 'Enregistré !' : 'Enregistrer'}
        </Button>
      </div>

      {/* General */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-500" />
            <CardTitle>Informations générales</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nom du site"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
            />
            <Input
              label="Email de contact"
              name="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={handleChange}
            />
          </div>
          
          <Textarea
            label="Description du site"
            name="siteDescription"
            value={settings.siteDescription}
            onChange={handleChange}
          />
          
          <Input
            label="Téléphone (optionnel)"
            name="contactPhone"
            value={settings.contactPhone}
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-gray-500" />
            <CardTitle>Apparence</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur principale
            </label>
            <div className="flex flex-wrap gap-3">
              {colorPalettes.map(palette => (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => {
                    setSettings(prev => ({ ...prev, accentColor: palette.primary }));
                    setSaved(false);
                  }}
                  className={cn(
                    "w-10 h-10 rounded-lg transition-transform hover:scale-110",
                    settings.accentColor === palette.primary && "ring-2 ring-offset-2 ring-gray-900"
                  )}
                  style={{ backgroundColor: palette.primary }}
                />
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => {
                    setSettings(prev => ({ ...prev, accentColor: e.target.value }));
                    setSaved(false);
                  }}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Input
              label="Titre du hero"
              name="heroTitle"
              value={settings.heroTitle}
              onChange={handleChange}
            />
            <Textarea
              label="Sous-titre du hero"
              name="heroSubtitle"
              value={settings.heroSubtitle}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-gray-500" />
            <CardTitle>Clés API</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Clé API Gemini"
            name="geminiApiKey"
            type="password"
            value={settings.geminiApiKey}
            onChange={handleChange}
            hint="Pour la génération de logos IA"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Clé publique Stripe"
              name="stripePublicKey"
              type="password"
              value={settings.stripePublicKey}
              onChange={handleChange}
              hint="pk_test_..."
            />
            <Input
              label="Clé secrète Stripe"
              name="stripeSecretKey"
              type="password"
              value={settings.stripeSecretKey}
              onChange={handleChange}
              hint="sk_test_..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="text-red-700">Zone dangereuse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Réinitialiser les données</p>
              <p className="text-sm text-gray-600">
                Supprime toutes les commandes, projets et paramètres
              </p>
            </div>
            <Button variant="danger" onClick={handleReset}>
              <RefreshCw className="w-4 h-4" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



