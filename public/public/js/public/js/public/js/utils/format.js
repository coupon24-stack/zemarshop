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

export function primaryImage(product) {
  const url = product?.product_images?.[0]?.url;
  return url || './assets/images/placeholders/product.png';
}
