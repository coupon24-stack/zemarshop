// public/js/ui/navbar.js

import { initSupabase } from '../supabase-client.js';

export async function renderNavbar(activePage = 'home') {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  // 1. Vérifier la session Supabase
  const sb = await initSupabase();
  const { data: { session } } = await sb.auth.getSession();

  // 2. Détecter si on est dans un sous-dossier (client, vendor, admin)
  // On utilise window.location.pathname pour être sûr
  const path = window.location.pathname;
  const isSubfolder = path.includes('/client/') || path.includes('/vendor/') || path.includes('/admin/');
  const basePath = isSubfolder ? '../' : './';

  // 3. Définir les liens de navigation
  const links = [
    { href: 'index.html', label: 'Accueil', key: 'home' },
    { href: 'shop.html', label: 'Boutique', key: 'shop' },
    { href: 'shop.html#categories', label: 'Catégories', key: 'categories' },
    { href: 'register-vendor.html', label: 'Devenir vendeur', key: 'vendor' },
    { href: 'contact.html', label: 'Contact', key: 'contact' },
  ];

  const desktopLinks = links
    .map(l => `<a href="${basePath}${l.href}" class="${l.key === activePage ? 'active' : ''}">${l.label}</a>`)
    .join('');

  const mobileLinks = links
    .map(l => `<a href="${basePath}${l.href}">${l.label}</a>`)
    .join('');

  // 4. Gérer le bouton de connexion et le rôle
  let authBtnHtml = '';
  let mobileAuthBtnHtml = '';

  if (session) {
    // On récupère le rôle pour rediriger au bon endroit
    const { data: profile } = await sb.from('profiles').select('role').eq('id', session.user.id).single();
    const role = profile ? profile.role : 'client';
    
    let dashboardLink = 'client/dashboard.html';
    if (role === 'admin') dashboardLink = 'admin/dashboard.html';
    if (role === 'vendor') dashboardLink = 'vendor/dashboard.html';

    // Le lien vers le dashboard doit être relatif au sous-dossier
    // Si on est déjà dans /admin/, on va vers dashboard.html, sinon ../admin/dashboard.html
    const profileLink = isSubfolder 
      ? (path.includes(`/${role}/`) ? './dashboard.html' : `../${role}/dashboard.html`)
      : `./${dashboardLink}`;

    authBtnHtml = `<a href="${profileLink}" class="btn btn--ghost btn--sm navbar__hide-mobile">Mon Espace</a>`;
    mobileAuthBtnHtml = `<a href="${profileLink}" class="btn btn--ghost btn--full">Mon Espace</a>`;
  } else {
    authBtnHtml = `<a href="${basePath}login.html" class="btn btn--ghost btn--sm navbar__hide-mobile">Connexion</a>`;
    mobileAuthBtnHtml = `<a href="${basePath}login.html" class="btn btn--ghost btn--full">Connexion</a>`;
  }

  // 5. Construire la navbar
  const svgLogo = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 40" height="36" style="display: block;">
      <g fill="none" stroke="#E60023" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 14 H12" stroke-width="2" />
        <path d="M6 20 H14" stroke-width="2" />
        <path d="M2 26 H12" stroke-width="2" />
        <path d="M16 10 H22 L28 28 H44 L48 16 H20" />
      </g>
      <circle cx="30" cy="32" r="3.5" fill="#E60023" />
      <circle cx="42" cy="32" r="3.5" fill="#E60023" />
      <path d="M34 4 L36 9 L41 11 L36 13 L34 18 L32 13 L27 11 L32 9 Z" fill="#E60023" />
      <line x1="60" y1="10" x2="60" y2="30" stroke="#222222" stroke-width="1.5" />
      <text x="70" y="27" font-family="Inter, sans-serif" font-weight="800" font-size="24" fill="#222222" letter-spacing="1">ZEMAR</text>
      <circle cx="175" cy="25" r="3" fill="#E60023" />
    </svg>
  `;

  nav.innerHTML = `
    <div class="navbar__inner">
      <a href="${basePath}index.html" class="navbar__logo" aria-label="ZemarShop Accueil">
        ${svgLogo}
      </a>
      <nav class="navbar__links" aria-label="Navigation principale">${desktopLinks}</nav>
      <div class="navbar__actions">
        <a href="${basePath}cart.html" class="icon-btn cart-btn" aria-label="Panier">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 6h15l-1.5 9h-12z"/>
            <circle cx="9" cy="20" r="1.5"/>
            <circle cx="18" cy="20" r="1.5"/>
            <path d="M6 6 5 3H2"/>
          </svg>
          <span class="cart-count" id="cartCount">0</span>
        </a>
        ${authBtnHtml}
        <button class="hamburger" id="hamburger" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="mobile-drawer" id="mobileDrawer" aria-hidden="true">
      <nav class="mobile-drawer__links">
        ${mobileLinks}
        <hr />
        ${mobileAuthBtnHtml}
      </nav>
    </div>
  `;

  // Comportements
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  hamburger?.addEventListener('click', () => {
    const open = drawer.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  drawer?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('is-open');
      hamburger.classList.remove('is-open');
    });
  });
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 10);
  }, { passive: true });

  updateCartCount();
}

export function updateCartCount() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  const count = parseInt(localStorage.getItem('zemar_cart_count') || '0', 10);
  el.textContent = count > 0 ? String(count) : '';
  el.style.display = count > 0 ? 'flex' : 'none';
}
