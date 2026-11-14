// public/js/pages/shop.js

import { renderNavbar } from '../ui/navbar.js';
import { renderFooter } from '../ui/footer.js';
import { getCategories, getAllProducts } from '../supabase-client.js';
import { formatPrice, discountPercent, primaryImage } from '../utils/format.js';

// --- État de la page ---
let allProducts = [];
let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'new';

// --- Éléments DOM ---
const shopGrid = document.getElementById('shopGrid');
const noResults = document.getElementById('noResults');
const filtersScroll = document.getElementById('filtersScroll');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

// --- Initialisation ---
async function init() {
  renderNavbar('shop');
  renderFooter();

  // 1. On charge TOUS les produits
  allProducts = await getAllProducts();

  // 2. On charge les catégories (filtres)
  await loadCategories();

  // 3. On vérifie si on vient d'une recherche (depuis l'accueil)
  handleSearchFromUrl();

  // 4. On affiche la grille
  applyFilters();
}

// --- Chargement des catégories ---
async function loadCategories() {
  try {
    const categories = await getCategories();
    
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-pill is-active';
    allBtn.textContent = 'Tout voir';
    allBtn.dataset.id = 'all';
    allBtn.onclick = () => selectCategory('all', allBtn);
    filtersScroll.appendChild(allBtn);

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-pill';
      btn.textContent = cat.name;
      btn.dataset.id = cat.id.toString();
      btn.dataset.slug = cat.slug;
      btn.onclick = () => selectCategory(cat.id.toString(), btn);
      filtersScroll.appendChild(btn);
    });
  } catch (error) {
    console.error(error);
  }
}

// --- Sélection d'une catégorie ---
function selectCategory(catId, btnElement) {
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('is-active'));
  btnElement.classList.add('is-active');
  currentCategory = catId;
  applyFilters();
}

// --- Application des filtres ---
function applyFilters() {
  let filtered = allProducts.filter(p => {
    // Filtre catégorie (démo)
    if (currentCategory !== 'all') {
      const productNum = parseInt(p.id.replace('p', ''), 10);
      if (productNum % 2 !== parseInt(currentCategory, 10) % 2) return false;
    }
    // Filtre recherche (insensible à la casse)
    if (currentSearch) {
      const q = currentSearch.toLowerCase().trim();
      if (!p.name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Tri
  filtered.sort((a, b) => {
    if (currentSort === 'price_asc') return a.price_fcfa - b.price_fcfa;
    if (currentSort === 'price_desc') return b.price_fcfa - a.price_fcfa;
    return 0;
  });

  renderGrid(filtered);
}

// --- Affichage de la grille ---
function renderGrid(products) {
  if (products.length === 0) {
    shopGrid.innerHTML = '';
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
    shopGrid.innerHTML = products.map(createProductCard).join('');
  }
}

// --- Composant Carte Produit ---
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
        <button class="product-card__favorite" aria-label="Favori">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
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

// --- Écouteurs d'événements ---
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    applyFilters();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    applyFilters();
  });
}

// --- GESTION DE LA RECHERCHE DEPUIS L'URL ---
function handleSearchFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get('q');
  const catParam = params.get('category');

  if (searchQuery) {
    currentSearch = searchQuery;
    if (searchInput) searchInput.value = searchQuery;
  }

  if (catParam) {
    setTimeout(() => {
      const btn = document.querySelector(`.filter-pill[data-slug="${catParam}"]`);
      if (btn) btn.click();
    }, 100);
  }
}

// --- Lancer l'application ---
init();
