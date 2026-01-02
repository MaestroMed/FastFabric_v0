import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client pour les opérations publiques
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin pour les opérations serveur
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Types
export interface Offer {
  id: string;
  name: string;
  description: string;
  price_ttc: number;
  default_pages: string[];
  optional_pages: string[];
  estimated_hours: number;
  is_popular: boolean;
  sort_order: number;
  features: string[];
  max_revisions?: number;
  max_pages?: number;
  created_at: string;
}

export type OrderStatus = 'new' | 'quote_pending' | 'quote_sent' | 'in_progress' | 'review' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  offer_id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
  };
  project_details: {
    name: string;
    description: string;
    objective: string;
    content?: string;
    inspiration?: string;
    notes?: string;
    // Quote specific
    budget?: string;
    deadline?: string;
    additionalInfo?: string;
    preferredContact?: string;
  };
  selected_pages: string[];
  selected_tags: string[];
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
  status: OrderStatus;
  is_quote?: boolean;
  amount_ttc: number;
  // Stripe
  stripe_payment_intent_id?: string;
  stripe_checkout_session_id?: string;
  paid_at?: string;
  // Revisions
  revisions_used?: number;
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  colors: string[];
  preview_url?: string;
  live_url?: string;
  delivery_time: string;
  is_featured: boolean;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  category: 'style' | 'sector' | 'feature';
  color: string;
}

export interface ProjectTag {
  project_id: string;
  tag_id: string;
}

export interface Setting {
  key: string;
  value: any;
}

// Helpers
export async function getOffers() {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .order('sort_order');
  
  if (error) throw error;
  return data as Offer[];
}

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_tags (
        tag_id,
        tags (*)
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('category', { ascending: true });
  
  if (error) throw error;
  return data as Tag[];
}

export async function getOrders() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      offers (name, price_ttc)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createOrder(order: Partial<Order>) {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();
  
  if (error) throw error;
  return data as Order;
}

export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getSetting(key: string) {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data?.value;
}

export async function setSetting(key: string, value: any) {
  const { error } = await supabaseAdmin
    .from('settings')
    .upsert({ key, value });
  
  if (error) throw error;
}
