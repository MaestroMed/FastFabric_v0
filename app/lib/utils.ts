import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `FF-${year}-${random}`;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: 'Nouvelle',
    in_progress: 'En production',
    review: 'En révision',
    completed: 'Livrée',
    cancelled: 'Annulée',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-purple-100 text-purple-700',
    review: 'bg-orange-100 text-orange-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export const defaultPages = [
  { id: 'home', name: 'Accueil', required: true },
  { id: 'legal', name: 'Mentions légales', required: true },
];

export const optionalPages = [
  { id: 'about', name: 'À propos' },
  { id: 'services', name: 'Services' },
  { id: 'portfolio', name: 'Portfolio' },
  { id: 'blog', name: 'Blog' },
  { id: 'contact', name: 'Contact' },
  { id: 'faq', name: 'FAQ' },
  { id: 'pricing', name: 'Tarifs' },
  { id: 'team', name: 'Équipe' },
  { id: 'testimonials', name: 'Témoignages' },
  { id: 'cgv', name: 'CGV' },
  { id: 'cgu', name: 'CGU' },
  { id: 'privacy', name: 'Confidentialité' },
];

export const stylePresets = [
  { id: 'minimal', name: 'Minimaliste', color: '#1d1d1f' },
  { id: 'modern', name: 'Moderne', color: '#0071e3' },
  { id: 'corporate', name: 'Corporate', color: '#2c3e50' },
  { id: 'creative', name: 'Créatif', color: '#e91e63' },
  { id: 'luxury', name: 'Luxe', color: '#c9a227' },
  { id: 'tech', name: 'Tech', color: '#5856d6' },
  { id: 'eco', name: 'Éco/Nature', color: '#34c759' },
  { id: 'playful', name: 'Dynamique', color: '#ff9500' },
];

export const colorPalettes = [
  { id: 'blue', name: 'Bleu', primary: '#0071e3', secondary: '#5856d6' },
  { id: 'purple', name: 'Violet', primary: '#5856d6', secondary: '#a855f7' },
  { id: 'green', name: 'Vert', primary: '#34c759', secondary: '#10b981' },
  { id: 'orange', name: 'Orange', primary: '#ff9500', secondary: '#f59e0b' },
  { id: 'red', name: 'Rouge', primary: '#ff3b30', secondary: '#ef4444' },
  { id: 'pink', name: 'Rose', primary: '#ec4899', secondary: '#f472b6' },
  { id: 'teal', name: 'Turquoise', primary: '#14b8a6', secondary: '#06b6d4' },
  { id: 'dark', name: 'Sombre', primary: '#1d1d1f', secondary: '#374151' },
  { id: 'gold', name: 'Doré', primary: '#c9a227', secondary: '#d4af37' },
];



