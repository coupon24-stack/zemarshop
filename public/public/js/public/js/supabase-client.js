// public/js/supabase-client.js
import { CONFIG, isSupabaseReady } from './config.js';

let supabaseClient = null;

export async function initSupabase() {
  if (CONFIG.MODE_DEMO || !isSupabaseReady()) {
    console.info('[ZemarShop] Mode DÉMO actif — données locales.');
    return null;
  }
  const { createClient } = await import(
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'
  );
  supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  console.info('[ZemarShop] Connecté à Supabase.');
  return supabaseClient;
}

export async function getCategories() {
  if (CONFIG.MODE_DEMO || !supabaseClient) {
    return DEMO_CATEGORIES;
  }
  const { data, error } = await supabaseClient
    .from('categories').select('*').eq('is_active', true).order('display_order');
  if (error) throw error;
  return data;
}

export async function getPopularProducts(limit = 8) {
  if (CONFIG.MODE_DEMO || !supabaseClient) {
    return DEMO_PRODUCTS.slice(0, limit);
  }
  const { data, error } = await supabaseClient
    .from('products')
    .select(`id, name, price_fcfa, old_price_fcfa, quantity,
             product_images ( url ), shops ( name )`)
    .eq('status', 'approved').eq('is_featured', true)
    .order('created_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return data;
}

export async function getNewProducts(limit = 8) {
  if (CONFIG.MODE_DEMO || !supabaseClient) {
    return DEMO_PRODUCTS.slice().reverse().slice(0, limit);
  }
  const { data, error } = await supabaseClient
    .from('products')
    .select(`id, name, price_fcfa, old_price_fcfa, quantity,
             product_images ( url ), shops ( name )`)
    .eq('status', 'approved')
    .order('created_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return data;
}

const DEMO_CATEGORIES = [
  { id: 1, name: 'Mode homme',        slug: 'mode-homme',       icon: '👔' },
  { id: 2, name: 'Mode femme',        slug: 'mode-femme',       icon: '👗' },
  { id: 3, name: 'Chaussures',        slug: 'chaussures',       icon: '👟' },
  { id: 4, name: 'Sacs & accessoires',slug: 'sacs-accessoires', icon: '👜' },
  { id: 5, name: 'Beauté & soins',    slug: 'beaute-soins',     icon: '💄' },
  { id: 6, name: 'Téléphones',        slug: 'telephones',       icon: '📱' },
  { id: 7, name: 'Informatique',      slug: 'informatique',     icon: '💻' },
  { id: 8, name: 'Électronique',      slug: 'electronique',     icon: '🎧' },
  { id: 9, name: 'Maison & déco',     slug: 'maison-deco',      icon: '🏠' },
  { id: 10,name: 'Sport',             slug: 'sport',            icon: '⚽' },
  { id: 11,name: 'Enfants',           slug: 'enfants',          icon: '🧸' },
  { id: 12,name: 'Autres',            slug: 'autres',           icon: '📦' },
];

const DEMO_PRODUCTS = [
  { id: 'p1', name: 'Robe africaine wax élégante', price_fcfa: 15000, old_price_fcfa: 20000, quantity: 12,
    shops: { name: 'Boutique Awa' },
    product_images: [{ url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600' }] },
  { id: 'p2', name: 'Sneakers blanches homme', price_fcfa: 22500, old_price_fcfa: null, quantity: 8,
    shops: { name: 'Kicks CI' },
    product_images: [{ url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600' }] },
  { id: 'p3', name: 'Sac à main cuir premium', price_fcfa: 18000, old_price_fcfa: 24000, quantity: 5,
    shops: { name: 'Élégance Shop' },
    product_images: [{ url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600' }] },
  { id: 'p4', name: 'Casque Bluetooth sans fil', price_fcfa: 12500, old_price_fcfa: 15000, quantity: 20,
    shops: { name: 'TechZone' },
    product_images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' }] },
  { id: 'p5', name: 'Montre connectée sport', price_fcfa: 32000, old_price_fcfa: null, quantity: 3,
    shops: { name: 'Gadget CI' },
    product_images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' }] },
  { id: 'p6', name: 'Parfum femme délicat', price_fcfa: 9500, old_price_fcfa: 13000, quantity: 15,
    shops: { name: 'Beauty Store' },
    product_images: [{ url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600' }] },
  { id: 'p7', name: 'Smartphone Android 128Go', price_fcfa: 85000, old_price_fcfa: 95000, quantity: 6,
    shops: { name: 'Phone City' },
    product_images: [{ url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600' }] },
  { id: 'p8', name: 'Lampe déco design moderne', price_fcfa: 7500, old_price_fcfa: null, quantity: 25,
    shops: { name: 'Maison & Co' },
    product_images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600' }] },
];
