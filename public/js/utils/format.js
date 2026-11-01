// public/js/utils/format.js

export function formatPrice(amount) {
  if (amount == null) return '—';
  const n = Number(amount);
  return n.toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' FCFA';
}

export function discountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function formatDate(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Récupère l'URL de l'image principale avec sécurité
export function primaryImage(product) {
  // 1. L'image directe
  if (product?.image_url) return product.image_url;
  // 2. L'image dans le tableau (Supabase)
  const url = product?.product_images?.[0]?.url;
  if (url) return url;
  // 3. Image de secours (un joli sac ou un logo si l'image est introuvable)
  return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80';
}
