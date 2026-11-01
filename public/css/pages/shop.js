// public/js/pages/shop.js

import { renderNavbar } from '../ui/navbar.js';
import { renderFooter } from '../ui/footer.js';
import { getCategories, getAllProducts } from '../supabase-client.js'; // <-- Import mis à jour
import { formatPrice, discountPercent, primaryImage } from '../utils/format.js';

let allProducts = [];
let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'new';

const shopGrid = document.getElementById('shopGrid');
const noResults = document.getElementById('noResults');
const filtersScroll = document.getElementById('filtersScroll');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

async function init() {
  renderNavbar('shop');
  renderFooter();

  // ON CHARGE TOUS LES PRODUITS DIRECTEMENT
  allProducts = await getAllProducts();

  await loadCategories();
  applyFilters(); 
}

async function loadCategories() {
  const categories = await getCategories();
  
  const allBtn = document.createElement('button');
  allBtn.className = 'filter-pill is-active';
  allBtn.textContent = 'Tout voir';
  allBtn.onclick = () => {
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('is-active'));
    allBtn.classList.add('is-active');
    currentCategory = 'all';
    applyFilters();
  };
  filtersScroll.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-pill';
    btn.textContent = cat.name;
    btn.onclick = () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentCategory = cat.id.toString();
      applyFilters();
    };
    filtersScroll.appendChild(btn);
  });
}

function applyFilters() {
  let filtered = allProducts.filter(p => {
    if (currentCategory !== 'all') {
      // Filtre factice pour la démo (affiche 1 produit sur 2)
      const productNum = parseInt(p.id.replace('p', ''), 10);
      if (productNum % 2 !== parseInt(currentCategory, 10) % 2) return false;
    }
    if (currentSearch && !p.name.toLowerCase().includes(currentSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (currentSort === 'price_asc') return a.price_fcfa - b.price_fcfa;
    if (currentSort === 'price_desc') return b.price_fcfa - a.price_fcfa;
    return 0;
  });

  if (filtered.length === 0) {
    shopGrid.innerHTML = '';
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
    shopGrid.innerHTML = filtered.map(createProductCard).join('');
  }
}

function createProductCard(product) {
  const img = primaryImage(product);
  const discount = discountPercent(product.price_fcfa, product.old_price_fcfa);
  const oldPriceHtml = product.old_price_fcfa ? `<span class="product-card__old-price">${formatPrice(product.old_price_fcfa)}</span>` : '';
  const discountBadge = discount ? `<span class="badge badge--discount">-${discount}%</span>` : '';
  const shopName = product.shops?.name || 'Boutique Zemar';

  return `
    <article class="product-card" onclick="window.location.href='./product.html?id=${product.id}'" style="cursor: pointer;">
      <div class="product-card__image-wrap">
        <img class="product-card__image" src="${img}" alt="${product.name}" loading="lazy" />
        <div class="product-card__badges">${discountBadge}</div>
      </div>
      <div class="product-card__body">
        <div class="product-card__shop">${shopName}</div>
        <h3 class="product-card__name">${product.name}</h3>
        <div class="product-card__prices">
          <span class="product-card__price">${formatPrice(product.price_fcfa)}</span>
          ${oldPriceHtml}
        </div>
        <div class="product-card__actions">
          <button class="btn btn--primary">Voir le produit</button>
        </div>
      </div>
    </article>
  `;
}

searchInput.addEventListener('input', (e) => { currentSearch = e.target.value; applyFilters(); });
sortSelect.addEventListener('change', (e) => { currentSort = e.target.value; applyFilters(); });

init();