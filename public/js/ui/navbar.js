// public/js/ui/navbar.js

export function renderNavbar(activePage = 'home') {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const links = [
    { href: 'index.html', label: 'Accueil', key: 'home' },
    { href: 'shop.html', label: 'Boutique', key: 'shop' },
    { href: 'shop.html#categories', label: 'Catégories', key: 'categories' },
    { href: 'auth/register-vendor.html', label: 'Devenir vendeur', key: 'vendor' },
    { href: 'contact.html', label: 'Contact', key: 'contact' },
  ];

  // On détecte si on est dans un sous-dossier (client ou vendor)
  const isClientArea = activePage === 'client';
  const isVendorArea = activePage === 'vendor';
  const isSubfolder = isClientArea || isVendorArea;
  const basePath = isSubfolder ? '../' : './';

  const adjustedLinks = links.map(l => ({
    ...l,
    href: isSubfolder ? '../' + l.href : './' + l.href
  }));

  const desktopLinks = adjustedLinks
    .map(l => `<a href="${l.href}" class="${l.key === activePage ? 'active' : ''}">${l.label}</a>`)
    .join('');

  const mobileLinks = adjustedLinks
    .map(l => `<a href="${l.href}">${l.label}</a>`)
    .join('');

  // Gestion du bouton d'action selon la page
  let authBtnHref = './login.html';
  let authBtnText = 'Connexion';
  let hideRegister = false;

  if (isClientArea) {
    authBtnHref = './dashboard.html';
    authBtnText = 'Mon Compte';
    hideRegister = true;
  } else if (isVendorArea) {
    authBtnHref = './dashboard.html';
    authBtnText = 'Mon Espace';
    hideRegister = true;
  }

  const registerBtn = hideRegister ? '' : 
    `<a href="${basePath}register-client.html" class="btn btn--primary btn--sm navbar__hide-mobile">Créer un compte</a>`;

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
        <a href="${isSubfolder ? './dashboard.html' : './login.html'}" class="btn btn--ghost btn--sm navbar__hide-mobile">${authBtnText}</a>
        ${registerBtn}
        <button class="hamburger" id="hamburger" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="mobile-drawer" id="mobileDrawer" aria-hidden="true">
      <nav class="mobile-drawer__links">
        ${mobileLinks}
        <hr />
        <a href="${isSubfolder ? './dashboard.html' : './login.html'}" class="btn btn--ghost btn--full">${authBtnText}</a>
        ${hideRegister ? '' : '<a href="./register-client.html" class="btn btn--primary btn--full">Créer un compte</a>'}
      </nav>
    </div>
  `;

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

function updateCartCount() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  const count = parseInt(localStorage.getItem('zemar_cart_count') || '0', 10);
  el.textContent = count > 0 ? String(count) : '';
  el.classList.toggle('is-visible', count > 0);
}
