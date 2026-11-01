// public/js/pages/product.js

import { renderNavbar } from '../ui/navbar.js';
import { renderFooter } from '../ui/footer.js';
import { formatPrice } from '../utils/format.js';

// Base de données temporaire en dur
const productsDB = {
  'p1': {
    id: 'p1', name: 'Robe africaine wax élégante', price: 15000, oldPrice: 20000,
    shop: 'Boutique Awa', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600'
  },
  'p2': {
    id: 'p2', name: 'Sneakers blanches homme', price: 22500, oldPrice: null,
    shop: 'Kicks CI', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600'
  },
  'p3': {
    id: 'p3', name: 'Sac à main cuir premium', price: 18000, oldPrice: 24000,
    shop: 'Élégance Shop', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'
  },
  'p4': {
    id: 'p4', name: 'Casque Bluetooth sans fil', price: 12500, oldPrice: 15000,
    shop: 'TechZone', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'
  }
};

function init() {
  renderNavbar('shop'); 
  renderFooter();

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  // Si pas d'id, on prend le p4 par défaut
  const product = productsDB[productId] || productsDB['p4'];

  // Remplissage de la page
  document.getElementById('productImage').src = product.image;
  document.getElementById('thumb1').src = product.image;
  document.getElementById('thumb2').src = product.image;
  document.getElementById('thumb3').src = product.image;
  
  document.getElementById('productShop').textContent = product.shop;
  document.getElementById('productTitle').textContent = product.name;
  document.getElementById('productPrice').textContent = formatPrice(product.price);
  
  if (product.oldPrice) {
    document.getElementById('productOldPrice').textContent = formatPrice(product.oldPrice);
    const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    document.getElementById('productDiscount').textContent = `-${discount}%`;
    document.getElementById('productDiscount').style.display = 'inline-flex';
  }

  document.getElementById('productDesc').textContent = 
    "Un produit de qualité supérieure, disponible exclusivement sur ZemarShop. " +
    "Commandez maintenant et profitez de notre livraison rapide.";

  // Remplir les produits similaires
  const similarGrid = document.getElementById('similarProducts');
  similarGrid.innerHTML = Object.values(productsDB)
    .filter(p => p.id !== product.id)
    .slice(0, 3)
    .map(p => `
      <article class="product-card" onclick="window.location.href='./product.html?id=${p.id}'" style="cursor: pointer;">
        <div class="product-card__image-wrap">
          <img class="product-card__image" src="${p.image}" alt="${p.name}" />
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${p.name}</h3>
          <div class="product-card__prices">
            <span class="product-card__price">${formatPrice(p.price)}</span>
          </div>
        </div>
      </article>
    `).join('');
}

init();