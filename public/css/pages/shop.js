// public/js/pages/shop.js

import { renderNavbar } from '../ui/navbar.js';
import { renderFooter } from '../ui/footer.js';
import { initSupabase, getCategories } from '../supabase-client.js';
import { formatPrice, discountPercent, primaryImage } from '../utils/format.js';

renderNavbar('shop');
renderFooter();

let allProducts = [];
let currentSearch = '';
let currentSort = 'new';
let currentCategory = 'all';

const shopGrid = document.getElementById('shopGrid');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const filtersScroll = document.getElementById('filtersScroll');
const searchFormShop = document.getElementById('searchFormShop');

async function init() {
  const sb = await initSupabase();
  
  // 1. Charger les produits depuis Supabase
  const { data, error } = await sb
    .from('products')
    .select(`id, name, price_fcfa, old_price_fcfa, image_url, category_id, shops ( name )`)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (!error && data) allProducts = data;

  // 2. Charger les catégories
  const categories = await getCategories();
  
  // Bouton "Tout voir"
  const allBtn = document.createElement('button');
  allBtn.className = 'filter-pill is-active';
  allBtn.textContent = 'Tout voir';
  allBtn.dataset.id = 'all';
  filtersScroll.appendChild(allBtn);

  if (categories) {
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-pill';
      btn.textContent = cat.name;
      btn.dataset.id = cat.id;
      filtersScroll.appendChild(btn);
    });
  }

  // 3. Lire les paramètres de l'URL (recherche depuis l'accueil)
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) {
    currentSearch = params.get('q');
    searchInput.value = currentSearch;
  }

  // 4. PREMIER AFFICHAGE (C'est ce qui manquait !)
  renderGrid();
}

function renderGrid() {
  let filtered = allProducts.filter(p => {
    // Filtre recherche
    if (currentSearch && !p.name.toLowerCase().includes(currentSearch.toLowerCase())) return false;
    // Filtre catégorie
    if (currentCategory !== 'all' && p.category_id !== currentCategory) return false;
    return true;
  });

  // Tri
  if (currentSort === 'price_asc') filtered.sort((a,b) => a.price_fcfa - b.price_fcfa);
  if (currentSort === 'price_desc') filtered.sort((a,b) => b.price_fcfa - a.price_fcfa);

  // Affichage
  if (filtered.length === 0) {
    shopGrid.innerHTML = '';
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
    shopGrid.innerHTML = filtered.map(p => {
      const discount = discountPercent(p.price_fcfa, p.old_price_fcfa);
      const badge = discount ? `<span class="badge badge--discount">-${discount}%</span>` : '';
      const oldPrice = p.old_price_fcfa ? `<span class="product-card__old-price">${formatPrice(p.old_price_fcfa)}</span>` : '';
      const img = primaryImage(p);
      
      return `
        <article class="product-card" onclick="window.location.href='./product.html?id=${p.id}'" style="cursor: pointer;">
          <div class="product-card__image-wrap">
            <img class="product-card__image" src="${img}" alt="${p.name}" loading="lazy" />
            <div class="product-card__badges">${badge}</div>
          </div>
          <div class="product-card__body">
            <div class="product-card__shop">${p.shops?.name || 'Boutique'}</div>
            <h3 class="product-card__name">${p.name}</h3>
            <div class="product-card__prices">
              <span class="product-card__price">${formatPrice(p.price_fcfa)}</span>
              ${oldPrice}
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
}

// --- ÉVÉNEMENTS ---
searchInput.addEventListener('input', (e) => { 
  currentSearch = e.target.value; 
  renderGrid(); 
});

sortSelect.addEventListener('change', (e) => { 
  currentSort = e.target.value; 
  renderGrid(); 
});

filtersScroll.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-pill')) {
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('is-active'));
    e.target.classList.add('is-active');
    currentCategory = e.target.dataset.id;
    renderGrid();
  }
});

// Bloquer le rechargement du formulaire de recherche
searchFormShop.addEventListener('submit', (e) => {
  e.preventDefault();
  currentSearch = searchInput.value;
  renderGrid();
});

// Lancer l'application
init();
