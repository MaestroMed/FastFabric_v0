/**
 * Unified data store with Supabase/localStorage fallback
 * Uses Supabase when configured, falls back to localStorage for demo mode
 */

import type { Offer, Order, Project, Tag } from './supabase.server';
import { generateOrderNumber } from './utils';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Client-safe env helpers (read from VITE_ prefixed env vars)
function hasSupabase(): boolean {
  if (typeof window !== 'undefined') {
    // Client-side: check VITE_ prefixed env vars
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  }
  // Server-side: check process.env
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

function getSupabaseConfig() {
  if (typeof window !== 'undefined') {
    return {
      url: import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    };
  }
  return {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  };
}

// Extended types for local store
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_role?: string;
  author_company?: string;
  author_avatar_url?: string;
  content: string;
  rating: number;
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
}

export interface OrderRevision {
  id: string;
  order_id: string;
  revision_number: number;
  feedback: string;
  zones_to_modify: string[];
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  completed_at?: string;
}

const STORAGE_KEYS = {
  offers: 'ff_offers',
  orders: 'ff_orders',
  projects: 'ff_projects',
  tags: 'ff_tags',
  settings: 'ff_settings',
  faq: 'ff_faq',
  testimonials: 'ff_testimonials',
  revisions: 'ff_revisions',
};

// ============================================
// DEFAULT DATA
// ============================================

const defaultOffers: Offer[] = [
  {
    id: '1',
    name: 'One Page',
    description: 'Landing page haute conversion',
    price_ttc: 299,
    default_pages: ['home', 'legal'],
    optional_pages: ['contact', 'faq'],
    estimated_hours: 2,
    is_popular: false,
    sort_order: 1,
    features: [
      '1 page responsive',
      'Design sur mesure',
      'Formulaire de contact',
      'Optimisé SEO',
      'Livraison 2-4h',
      '1 révision incluse',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Site Vitrine',
    description: 'Présence professionnelle complète',
    price_ttc: 599,
    default_pages: ['home', 'legal', 'about', 'contact'],
    optional_pages: ['services', 'portfolio', 'blog', 'team', 'testimonials', 'faq', 'cgv', 'cgu', 'privacy'],
    estimated_hours: 6,
    is_popular: true,
    sort_order: 2,
    features: [
      'Jusqu\'à 5 pages',
      'Design premium',
      'Animations avancées',
      'Blog ou portfolio',
      'Livraison 4-8h',
      '2 révisions incluses',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Sur Mesure',
    description: 'Projet complexe ou spécifique',
    price_ttc: 0,
    default_pages: ['home', 'legal'],
    optional_pages: ['about', 'services', 'portfolio', 'blog', 'contact', 'faq', 'pricing', 'team', 'testimonials', 'cgv', 'cgu', 'privacy'],
    estimated_hours: 0,
    is_popular: false,
    sort_order: 3,
    features: [
      'Pages illimitées',
      'Fonctionnalités custom',
      'E-commerce possible',
      'Intégrations API',
      'Délai selon projet',
      'Support dédié',
    ],
    created_at: new Date().toISOString(),
  },
];

const defaultTags: Tag[] = [
  { id: '1', name: 'Minimaliste', category: 'style', color: '#1d1d1f' },
  { id: '2', name: 'Moderne', category: 'style', color: '#0071e3' },
  { id: '3', name: 'Corporate', category: 'style', color: '#2c3e50' },
  { id: '4', name: 'Créatif', category: 'style', color: '#e91e63' },
  { id: '5', name: 'Luxe', category: 'style', color: '#c9a227' },
  { id: '6', name: 'Tech', category: 'style', color: '#5856d6' },
  { id: '7', name: 'Restaurant', category: 'sector', color: '#ff9500' },
  { id: '8', name: 'Immobilier', category: 'sector', color: '#14b8a6' },
  { id: '9', name: 'Startup', category: 'sector', color: '#6366f1' },
  { id: '10', name: 'E-commerce', category: 'sector', color: '#10b981' },
  { id: '11', name: 'Coach', category: 'sector', color: '#f472b6' },
  { id: '12', name: 'Architecture', category: 'sector', color: '#78716c' },
];

const defaultProjects: (Project & { tags: string[] })[] = [
  {
    id: '1',
    name: 'Studio Archibald',
    category: 'Architecture',
    description: 'Site vitrine pour cabinet d\'architectes parisien',
    colors: ['#2d3436', '#dfe6e9'],
    preview_url: '',
    live_url: '',
    delivery_time: '2h30',
    is_featured: true,
    created_at: new Date().toISOString(),
    tags: ['1', '12'],
  },
  {
    id: '2',
    name: 'Maison Delacroix',
    category: 'Restaurant',
    description: 'Landing page pour restaurant gastronomique',
    colors: ['#2c3e50', '#c9a227'],
    preview_url: '',
    live_url: '',
    delivery_time: '1h45',
    is_featured: true,
    created_at: new Date().toISOString(),
    tags: ['5', '7'],
  },
  {
    id: '3',
    name: 'TechFlow SaaS',
    category: 'Startup',
    description: 'Site complet pour startup tech B2B',
    colors: ['#6c5ce7', '#a29bfe'],
    preview_url: '',
    live_url: '',
    delivery_time: '4h',
    is_featured: true,
    created_at: new Date().toISOString(),
    tags: ['2', '6', '9'],
  },
  {
    id: '4',
    name: 'Claire Martin Coaching',
    category: 'Coach',
    description: 'Site portfolio pour coach de vie',
    colors: ['#e17055', '#fab1a0'],
    preview_url: '',
    live_url: '',
    delivery_time: '2h',
    is_featured: true,
    created_at: new Date().toISOString(),
    tags: ['4', '11'],
  },
  {
    id: '5',
    name: 'GreenLeaf Bio',
    category: 'E-commerce',
    description: 'Boutique de produits bio et naturels',
    colors: ['#00b894', '#55efc4'],
    preview_url: '',
    live_url: '',
    delivery_time: '5h',
    is_featured: false,
    created_at: new Date().toISOString(),
    tags: ['2', '10'],
  },
  {
    id: '6',
    name: 'Immobilier Prestige',
    category: 'Immobilier',
    description: 'Site d\'agence immobilière haut de gamme',
    colors: ['#1e3799', '#4a69bd'],
    preview_url: '',
    live_url: '',
    delivery_time: '3h30',
    is_featured: true,
    created_at: new Date().toISOString(),
    tags: ['5', '8'],
  },
];

const defaultFaq: FaqItem[] = [
  {
    id: '1',
    question: 'Combien de temps pour recevoir mon site ?',
    answer: 'Nos délais varient selon l\'offre choisie : 2-4h pour une One Page, 4-8h pour un Site Vitrine. Pour les projets Sur Mesure, le délai est défini lors du devis.',
    sort_order: 1,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    question: 'Puis-je demander des modifications ?',
    answer: 'Absolument ! Chaque offre inclut un nombre de révisions (1 pour One Page, 2 pour Site Vitrine). Des révisions supplémentaires sont possibles moyennant un supplément.',
    sort_order: 2,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    question: 'Comment fonctionne le paiement ?',
    answer: 'Le paiement s\'effectue en ligne par carte bancaire via notre plateforme sécurisée Stripe. Vous recevez une facture par email après le paiement.',
    sort_order: 3,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    question: 'Que se passe-t-il après la commande ?',
    answer: 'Vous recevez un email de confirmation avec un lien de suivi. Notre équipe démarre immédiatement la création. Vous êtes notifié à chaque étape importante.',
    sort_order: 4,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    question: 'Le site est-il optimisé pour le référencement ?',
    answer: 'Oui ! Tous nos sites sont optimisés SEO dès la conception : balises meta, structure sémantique, performance, et mobile-first.',
    sort_order: 5,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    question: 'Proposez-vous l\'hébergement ?',
    answer: 'Nous livrons votre site prêt à déployer. Nous pouvons vous conseiller sur les meilleures options d\'hébergement selon vos besoins.',
    sort_order: 6,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    author_name: 'Marie Dubois',
    author_role: 'Fondatrice',
    author_company: 'Studio Créatif',
    content: 'Incroyable ! Mon site était prêt en moins de 3 heures. Qualité professionnelle, design magnifique. Je recommande à 100%.',
    rating: 5,
    is_featured: true,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    author_name: 'Thomas Martin',
    author_role: 'CEO',
    author_company: 'TechFlow',
    content: 'Le rapport qualité-prix est imbattable. L\'équipe a parfaitement compris notre vision et l\'a traduite en un site exceptionnel.',
    rating: 5,
    is_featured: true,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    author_name: 'Sophie Laurent',
    author_role: 'Coach',
    author_company: 'Zen Coaching',
    content: 'Service client au top, réactivité impressionnante. Mon site reflète exactement mon identité. Merci FastFabric !',
    rating: 5,
    is_featured: true,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
];

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ============================================
// SUPABASE CLIENT (lazy initialization)
// ============================================

let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  if (supabaseClient) return supabaseClient;
  
  try {
    const config = getSupabaseConfig();
    if (!config.url || !config.anonKey) return null;
    supabaseClient = createClient(config.url, config.anonKey);
    return supabaseClient;
  } catch {
    return null;
  }
}

// ============================================
// UNIFIED STORE API
// ============================================

export const localStore = {
  // ==================
  // OFFERS
  // ==================
  getOffers(): Offer[] {
    return getFromStorage(STORAGE_KEYS.offers, defaultOffers);
  },
  
  saveOffer(offer: Offer): void {
    const offers = this.getOffers();
    const index = offers.findIndex(o => o.id === offer.id);
    if (index >= 0) {
      offers[index] = offer;
    } else {
      offers.push({ ...offer, id: Date.now().toString() });
    }
    saveToStorage(STORAGE_KEYS.offers, offers);
  },
  
  deleteOffer(id: string): void {
    const offers = this.getOffers().filter(o => o.id !== id);
    saveToStorage(STORAGE_KEYS.offers, offers);
  },

  // ==================
  // ORDERS
  // ==================
  getOrders(): Order[] {
    return getFromStorage(STORAGE_KEYS.orders, []);
  },
  
  getOrderByNumber(orderNumber: string): Order | null {
    const orders = this.getOrders();
    return orders.find(o => o.order_number === orderNumber) || null;
  },
  
  getOrderById(id: string): Order | null {
    const orders = this.getOrders();
    return orders.find(o => o.id === id) || null;
  },
  
  createOrder(orderData: Partial<Order> & { is_quote?: boolean }): Order {
    const orders = this.getOrders();
    const order: Order = {
      id: Date.now().toString(),
      order_number: generateOrderNumber(),
      offer_id: orderData.offer_id || '',
      customer: orderData.customer || { firstName: '', lastName: '', email: '' },
      project_details: orderData.project_details || { name: '', description: '', objective: '' },
      selected_pages: orderData.selected_pages || [],
      selected_tags: orderData.selected_tags || [],
      primary_color: orderData.primary_color || '#0071e3',
      secondary_color: orderData.secondary_color || '#5856d6',
      logo_url: orderData.logo_url,
      status: orderData.is_quote ? 'quote_pending' : 'new',
      is_quote: orderData.is_quote || false,
      amount_ttc: orderData.amount_ttc || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    orders.unshift(order);
    saveToStorage(STORAGE_KEYS.orders, orders);
    return order;
  },
  
  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === id);
    if (order) {
      Object.assign(order, updates, { updated_at: new Date().toISOString() });
      saveToStorage(STORAGE_KEYS.orders, orders);
      return order;
    }
    return null;
  },
  
  updateOrderStatus(id: string, status: Order['status']): Order | null {
    return this.updateOrder(id, { status });
  },

  // ==================
  // REVISIONS
  // ==================
  getRevisions(orderId: string): OrderRevision[] {
    const all = getFromStorage<OrderRevision[]>(STORAGE_KEYS.revisions, []);
    return all.filter(r => r.order_id === orderId);
  },

  createRevision(orderId: string, feedback: string, zones: string[] = []): OrderRevision {
    const revisions = getFromStorage<OrderRevision[]>(STORAGE_KEYS.revisions, []);
    const orderRevisions = revisions.filter(r => r.order_id === orderId);
    
    const revision: OrderRevision = {
      id: Date.now().toString(),
      order_id: orderId,
      revision_number: orderRevisions.length + 1,
      feedback,
      zones_to_modify: zones,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    
    revisions.push(revision);
    saveToStorage(STORAGE_KEYS.revisions, revisions);
    
    // Update order revisions_used count
    const order = this.getOrderById(orderId);
    if (order) {
      this.updateOrder(orderId, { 
        revisions_used: (order.revisions_used || 0) + 1,
        status: 'review'
      });
    }
    
    return revision;
  },

  updateRevisionStatus(id: string, status: OrderRevision['status']): void {
    const revisions = getFromStorage<OrderRevision[]>(STORAGE_KEYS.revisions, []);
    const revision = revisions.find(r => r.id === id);
    if (revision) {
      revision.status = status;
      if (status === 'completed') {
        revision.completed_at = new Date().toISOString();
      }
      saveToStorage(STORAGE_KEYS.revisions, revisions);
    }
  },

  // ==================
  // PROJECTS
  // ==================
  getProjects(): (Project & { tags: string[] })[] {
    return getFromStorage(STORAGE_KEYS.projects, defaultProjects);
  },
  
  saveProject(project: Project & { tags: string[] }): void {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push({ ...project, id: Date.now().toString(), created_at: new Date().toISOString() });
    }
    saveToStorage(STORAGE_KEYS.projects, projects);
  },
  
  deleteProject(id: string): void {
    const projects = this.getProjects().filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.projects, projects);
  },

  // ==================
  // TAGS
  // ==================
  getTags(): Tag[] {
    return getFromStorage(STORAGE_KEYS.tags, defaultTags);
  },
  
  saveTag(tag: Tag): void {
    const tags = this.getTags();
    const index = tags.findIndex(t => t.id === tag.id);
    if (index >= 0) {
      tags[index] = tag;
    } else {
      tags.push({ ...tag, id: Date.now().toString() });
    }
    saveToStorage(STORAGE_KEYS.tags, tags);
  },
  
  deleteTag(id: string): void {
    const tags = this.getTags().filter(t => t.id !== id);
    saveToStorage(STORAGE_KEYS.tags, tags);
  },

  // ==================
  // FAQ
  // ==================
  getFaq(): FaqItem[] {
    return getFromStorage(STORAGE_KEYS.faq, defaultFaq).sort((a, b) => a.sort_order - b.sort_order);
  },

  getVisibleFaq(): FaqItem[] {
    return this.getFaq().filter(f => f.is_visible);
  },

  saveFaqItem(item: FaqItem): void {
    const faq = getFromStorage<FaqItem[]>(STORAGE_KEYS.faq, defaultFaq);
    const index = faq.findIndex(f => f.id === item.id);
    if (index >= 0) {
      faq[index] = { ...item, updated_at: new Date().toISOString() };
    } else {
      faq.push({ 
        ...item, 
        id: Date.now().toString(), 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    saveToStorage(STORAGE_KEYS.faq, faq);
  },

  deleteFaqItem(id: string): void {
    const faq = getFromStorage<FaqItem[]>(STORAGE_KEYS.faq, defaultFaq).filter(f => f.id !== id);
    saveToStorage(STORAGE_KEYS.faq, faq);
  },

  // ==================
  // TESTIMONIALS
  // ==================
  getTestimonials(): Testimonial[] {
    return getFromStorage(STORAGE_KEYS.testimonials, defaultTestimonials);
  },

  getVisibleTestimonials(): Testimonial[] {
    return this.getTestimonials().filter(t => t.is_visible);
  },

  getFeaturedTestimonials(): Testimonial[] {
    return this.getTestimonials().filter(t => t.is_visible && t.is_featured);
  },

  saveTestimonial(testimonial: Testimonial): void {
    const testimonials = getFromStorage<Testimonial[]>(STORAGE_KEYS.testimonials, defaultTestimonials);
    const index = testimonials.findIndex(t => t.id === testimonial.id);
    if (index >= 0) {
      testimonials[index] = testimonial;
    } else {
      testimonials.push({ 
        ...testimonial, 
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      });
    }
    saveToStorage(STORAGE_KEYS.testimonials, testimonials);
  },

  deleteTestimonial(id: string): void {
    const testimonials = getFromStorage<Testimonial[]>(STORAGE_KEYS.testimonials, defaultTestimonials).filter(t => t.id !== id);
    saveToStorage(STORAGE_KEYS.testimonials, testimonials);
  },

  // ==================
  // SETTINGS
  // ==================
  getSetting(key: string, defaultValue: any = null): any {
    const settings = getFromStorage<Record<string, any>>(STORAGE_KEYS.settings, {});
    return settings[key] ?? defaultValue;
  },
  
  setSetting(key: string, value: any): void {
    const settings = getFromStorage<Record<string, any>>(STORAGE_KEYS.settings, {});
    settings[key] = value;
    saveToStorage(STORAGE_KEYS.settings, settings);
  },

  // ==================
  // STATS
  // ==================
  getStats() {
    const orders = this.getOrders();
    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount_ttc || 0), 0);
    const now = new Date();
    
    const thisMonth = orders.filter(o => {
      const date = new Date(o.created_at);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    
    const lastMonth = orders.filter(o => {
      const date = new Date(o.created_at);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
    });

    const completedOrders = orders.filter(o => o.status === 'completed');
    const avgDeliveryTime = completedOrders.length > 0 
      ? completedOrders.reduce((sum, o) => {
          const created = new Date(o.created_at).getTime();
          const updated = new Date(o.updated_at).getTime();
          return sum + (updated - created);
        }, 0) / completedOrders.length / (1000 * 60 * 60) // in hours
      : 0;
    
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'new' || o.status === 'quote_pending').length,
      inProgressOrders: orders.filter(o => o.status === 'in_progress').length,
      completedOrders: completedOrders.length,
      cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue,
      monthlyRevenue: thisMonth.reduce((sum, o) => sum + (o.amount_ttc || 0), 0),
      monthlyOrders: thisMonth.length,
      lastMonthRevenue: lastMonth.reduce((sum, o) => sum + (o.amount_ttc || 0), 0),
      lastMonthOrders: lastMonth.length,
      avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10,
      quoteRequests: orders.filter(o => o.is_quote).length,
    };
  },

  // ==================
  // RESET
  // ==================
  reset(): void {
    saveToStorage(STORAGE_KEYS.offers, defaultOffers);
    saveToStorage(STORAGE_KEYS.orders, []);
    saveToStorage(STORAGE_KEYS.projects, defaultProjects);
    saveToStorage(STORAGE_KEYS.tags, defaultTags);
    saveToStorage(STORAGE_KEYS.settings, {});
    saveToStorage(STORAGE_KEYS.faq, defaultFaq);
    saveToStorage(STORAGE_KEYS.testimonials, defaultTestimonials);
    saveToStorage(STORAGE_KEYS.revisions, []);
  },
};
