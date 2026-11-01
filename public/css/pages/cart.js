// public/js/pages/cart.js

import { renderNavbar } from '../ui/navbar.js';
import { renderFooter } from '../ui/footer.js';
import { formatPrice } from '../utils/format.js';

const DELIVERY_FEE = 1500;
let cart = [];

const productsDB = {
  'p1': { id: 'p1', name: 'Robe africaine wax élégante', price: 15000, shop: 'Boutique Awa', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600' },
  'p2': { id: 'p2', name: 'Sneakers blanches homme', price: 22500, shop: 'Kicks CI', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600' },
  'p3': { id: 'p3', name: 'Sac à main cuir premium', price: 18000, shop: 'Élégance Shop', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600' },
  'p4': { id: 'p4', name: 'Casque Bluetooth sans fil', price: 12500, shop: 'TechZone', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
  'p5': { id: 'p5', name: 'Montre connectée sport', price: 32000, shop: 'Gadget CI', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
  'p6': { id: 'p6', name: 'Parfum femme délicat', price: 9500, shop: 'Beauty Store', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600' },
  'p7': { id: 'p7', name: 'Smartphone Android 128Go', price: 85000, shop: 'Phone City', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600' },
  'p8': { id: 'p8', name: 'Lampe déco design moderne', price: 7500, shop: 'Maison & Co', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600' }
};

function init() {
  renderNavbar('shop');
  renderFooter();

  // LECTURE DU PANIER
  try {
    const savedCart = localStorage.getItem('zemar_cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
  } catch (e) {
    console.error("Erreur lecture panier", e);
    cart = [];
  }

  renderCart();

  // Gestion des clics
  const listEl = document.getElementById('cartItemsList');
  if (listEl) {
    listEl.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      const id = target.dataset.id;
      if (!id) return;

      if (target.classList.contains('btn-plus')) {
        changeQuantity(id, 1);
      } else if (target.classList.contains('btn-minus')) {
        changeQuantity(id, -1);
      } else if (target.classList.contains('btn-remove')) {
        removeItem(id);
      }
    });
  }
}

function renderCart() {
  const emptyEl = document.getElementById('emptyCart');
  const contentEl = document.getElementById('cartContent');
  const listEl = document.getElementById('cartItemsList');

  if (cart.length === 0) {
    emptyEl.classList.remove('hidden');
    contentEl.classList.add('hidden');
    return;
  }

  emptyEl.classList.add('hidden');
  contentEl.classList.remove('hidden');

  let html = '';
  cart.forEach(item => {
    const product = productsDB[item.id];
    if (product) {
      html += `
        <div class="cart-item">
          <img class="cart-item__image" src="${product.image}" alt="${product.name}" />
          <div class="cart-item__info">
            <div>
              <div class="cart-item__shop">${product.shop}</div>
              <h3 class="cart-item__name">${product.name}</h3>
              <div class="cart-item__price">${formatPrice(product.price)}</div>
            </div>
            <div class="cart-item__actions">
              <div class="quantity-control">
                <button class="btn-minus" data-id="${item.id}">−</button>
                <span>${item.quantity}</span>
                <button class="btn-plus" data-id="${item.id}">+</button>
              </div>
              <button class="cart-item__remove btn-remove" data-id="${item.id}">
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>
      `;
    }
  });

  listEl.innerHTML = html;
  updateTotals();
}

function updateTotals() {
  let subtotal = 0;
  cart.forEach(item => {
    const product = productsDB[item.id];
    if (product) subtotal += product.price * item.quantity;
  });

  const total = subtotal + DELIVERY_FEE;

  document.getElementById('subtotalPrice').textContent = formatPrice(subtotal);
  document.getElementById('deliveryPrice').textContent = formatPrice(DELIVERY_FEE);
  document.getElementById('totalPrice').textContent = formatPrice(total);
}

function changeQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('zemar_cart', JSON.stringify(cart));
}

init();