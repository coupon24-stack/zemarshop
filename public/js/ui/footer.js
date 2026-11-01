// public/js/ui/footer.js

export function renderFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  // Logo version footer : Chariot Blanc et Texte Blanc pour le fond rouge
  const svgLogoFooter = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 40" height="30" width="160" style="display: block; margin-bottom: 16px;">
      <!-- Le Chariot (Blanc) -->
      <g fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 14 H12" stroke-width="2" />
        <path d="M6 20 H14" stroke-width="2" />
        <path d="M2 26 H12" stroke-width="2" />
        <path d="M16 10 H22 L28 28 H44 L48 16 H20" />
      </g>
      <circle cx="30" cy="32" r="3.5" fill="#ffffff" />
      <circle cx="42" cy="32" r="3.5" fill="#ffffff" />
      
      <!-- Étoile/Étincelle -->
      <path d="M34 4 L36 9 L41 11 L36 13 L34 18 L32 13 L27 11 L32 9 Z" fill="#ffffff" />

      <!-- Ligne séparatrice -->
      <line x1="60" y1="10" x2="60" y2="30" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/>

      <!-- Texte ZEMAR -->
      <text x="70" y="27" font-family="Inter, sans-serif" font-weight="800" font-size="24" fill="#ffffff" letter-spacing="1">ZEMAR</text>
      <circle cx="175" cy="25" r="3" fill="#ffffff" />
    </svg>
  `;

  footer.innerHTML = `
    <div class="footer__inner container">
      <div class="footer__col footer__col--brand">
        <a href="./index.html">${svgLogoFooter}</a>
        <p class="footer__desc">
          ZemarShop, la marketplace ivoirienne qui rassemble les meilleurs vendeurs
          et vous livre partout en Côte d'Ivoire.
        </p>
      </div>
      <div class="footer__col">
        <h4 class="footer__title">Boutique</h4>
        <ul class="footer__list">
          <li><a href="./shop.html">Tous les produits</a></li>
          <li><a href="./shop.html#categories">Catégories</a></li>
          <li><a href="./shop.html?sort=new">Nouveautés</a></li>
          <li><a href="./shop.html?sort=popular">Populaires</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h4 class="footer__title">Vendeurs</h4>
        <ul class="footer__list">
          <li><a href="./auth/register-vendor.html">Devenir vendeur</a></li>
          <li><a href="./vendor/dashboard.html">Espace vendeur</a></li>
          <li><a href="./contact.html">Aide vendeurs</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h4 class="footer__title">Informations</h4>
        <ul class="footer__list">
          <li><a href="./contact.html">Contact</a></li>
          <li><a href="./legal/cgu.html">Conditions générales</a></li>
          <li><a href="./legal/confidentialite.html">Confidentialité</a></li>
          <li><a href="./legal/livraison.html">Livraison</a></li>
          <li><a href="./legal/remboursement.html">Remboursement</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="container">
        <p>© ${new Date().getFullYear()} ZemarShop — Tous droits réservés.</p>
        <p class="footer__tagline">Tout ce que tu cherches, au même endroit.</p>
      </div>
    </div>
  `;
}