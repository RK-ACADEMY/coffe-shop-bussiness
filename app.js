/**
 * Aura & Roast Artisanal Coffee - Main Application Logic
 */

// ==========================================================================
// 1. Menu Item Data Store
// ==========================================================================
const MENU_ITEMS = [
  {
    id: 'item-1',
    name: 'Single-Origin Pour Over',
    category: 'espresso',
    price: 5.75,
    description: 'Rotating micro-lot beans brewed via Chemex or V60 with precise water temp & ratio.',
    badge: 'Roaster Pick',
    flavorTags: ['Floral', 'Bergamot', 'Light Roast'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-2',
    name: 'Velvet Flat White',
    category: 'espresso',
    price: 4.85,
    description: 'Double ristretto shot crowned with micro-foamed whole or oat milk.',
    badge: 'Popular',
    flavorTags: ['Caramel', 'Silky', 'Balanced'],
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-3',
    name: 'Spanish Cortado',
    category: 'espresso',
    price: 4.25,
    description: 'Equal parts house espresso and lightly textured steamed milk in a Gibraltar glass.',
    badge: 'Classic',
    flavorTags: ['Cocoa', 'Nutty', 'Smooth'],
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-4',
    name: 'Honey Lavender Latte',
    category: 'specialty',
    price: 6.25,
    description: 'Wildflower local honey infused with French lavender, espresso, and creamy steamed oat milk.',
    badge: 'Signature',
    flavorTags: ['Floral', 'Sweet Honey', 'Aromatic'],
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-5',
    name: 'Smoked Cardamom Cappuccino',
    category: 'specialty',
    price: 5.95,
    description: 'Freshly ground green cardamom, raw turbinado sugar, and a velvety espresso head.',
    badge: 'Seasonal',
    flavorTags: ['Warm Spice', 'Rich', 'Smoky'],
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-6',
    name: 'Nitro Cold Brew on Tap',
    category: 'cold',
    price: 5.50,
    description: '18-hour cold steeped Colombian beans infused with nitrogen for a Guinness-like cascade and creamy mouthfeel.',
    badge: 'On Tap',
    flavorTags: ['Dark Chocolate', 'Ultra Smooth', 'Bold'],
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-7',
    name: 'Vanilla Sweet Cloud Cold Brew',
    category: 'cold',
    price: 5.00,
    description: 'Slow-steeped iced coffee topped with a whipped Madagascar vanilla cold foam cap.',
    badge: 'Bestseller',
    flavorTags: ['Bourbon Vanilla', 'Creamy', 'Chilled'],
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-8',
    name: 'Espresso Tonic Spritz',
    category: 'cold',
    price: 5.80,
    description: 'Double espresso pulled directly over artisanal botanical tonic, ice, and dehydrated grapefruit.',
    badge: 'Refreshing',
    flavorTags: ['Citrus', 'Effervescent', 'Crisp'],
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-9',
    name: 'Ceremonial Matcha Latte',
    category: 'tea',
    price: 6.40,
    description: 'First-harvest Uji matcha whisked to order with warm oat milk and touch of maple.',
    badge: 'Organic',
    flavorTags: ['Umami', 'Earthy', 'Antioxidant'],
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-10',
    name: 'Spiced Golden Chai Elixir',
    category: 'tea',
    price: 5.60,
    description: 'Slow-simmered Assam black tea with ginger, whole cloves, star anise, and organic honey.',
    badge: 'House Blend',
    flavorTags: ['Spicy', 'Comforting', 'Sweet'],
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-11',
    name: 'Brown Butter Almond Croissant',
    category: 'bakery',
    price: 4.95,
    description: 'Twice-baked butter croissant filled with frangipane cream and toasted sliced almonds.',
    badge: 'Baked Daily',
    flavorTags: ['Nutty', 'Flaky', 'Fresh'],
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'item-12',
    name: 'Avocado Heirloom Sourdough Tartine',
    category: 'bakery',
    price: 8.50,
    description: 'Grilled country sourdough, smashed Haas avocado, heirloom cherry tomatoes, dukkah, microgreens.',
    badge: 'Chef Favorite',
    flavorTags: ['Savory', 'Plant-Based', 'Crispy'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80'
  }
];

// ==========================================================================
// 2. State & Persistence
// ==========================================================================
let cart = [];
try {
  const savedCart = localStorage.getItem('aura_roast_cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
} catch (e) {
  console.warn('Could not read cart from localStorage', e);
}

// ==========================================================================
// 3. DOM Elements Cache
// ==========================================================================
const menuGrid = document.getElementById('menu-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartCounter = document.getElementById('cart-counter');
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsList = document.getElementById('cart-items-list');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartTaxEl = document.getElementById('cart-tax');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const heroOrderBtn = document.getElementById('hero-order-btn');

// Reservation Modal Elements
const reservationModal = document.getElementById('reservation-modal');
const openReserveBtn = document.getElementById('open-reserve-btn');
const aboutReserveBtn = document.getElementById('about-reserve-btn');
const visitReserveBtn = document.getElementById('visit-reserve-btn');
const closeReserveBtn = document.getElementById('close-reserve-btn');
const reservationForm = document.getElementById('reservation-form');
const resDateInput = document.getElementById('res-date');

// Mobile Nav
const menuToggleBtn = document.getElementById('menu-toggle-btn');
const navLinks = document.getElementById('nav-links');
const siteHeader = document.getElementById('site-header');

// Toast Container
const toastContainer = document.getElementById('toast-container');

// Newsletter
const newsletterForm = document.getElementById('newsletter-form');

// ==========================================================================
// 4. Menu Rendering & Filtering
// ==========================================================================
function renderMenu(category = 'all') {
  if (!menuGrid) return;
  
  menuGrid.innerHTML = '';
  
  const filtered = category === 'all' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === category);

  filtered.forEach(item => {
    const card = document.createElement('article');
    card.className = 'menu-card';
    card.setAttribute('data-id', item.id);
    
    card.innerHTML = `
      <div class="menu-card-img-wrapper">
        <img src="${item.image}" alt="${item.name}" class="menu-card-img" loading="lazy">
        ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ''}
      </div>
      <div class="menu-card-body">
        <div class="menu-card-header">
          <h3 class="menu-item-title">${item.name}</h3>
          <span class="menu-item-price">$${item.price.toFixed(2)}</span>
        </div>
        <p class="menu-item-desc">${item.description}</p>
        <div class="menu-card-footer">
          <div class="flavor-tags">
            ${item.flavorTags.map(tag => `<span class="flavor-tag">${tag}</span>`).join('')}
          </div>
          <button class="add-cart-btn" aria-label="Add ${item.name} to order" data-id="${item.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </div>
    `;

    menuGrid.appendChild(card);
  });

  // Attach click listeners to card "add to cart" buttons
  const addButtons = menuGrid.querySelectorAll('.add-cart-btn');
  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      addToCart(id);
    });
  });
}

// Filter button click handlers
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const category = btn.getAttribute('data-category');
    renderMenu(category);
  });
});

// ==========================================================================
// 5. Cart Logic & Drawer
// ==========================================================================
function saveCart() {
  try {
    localStorage.setItem('aura_roast_cart', JSON.stringify(cart));
  } catch (e) {
    console.warn('Could not save cart', e);
  }
}

function addToCart(itemId) {
  const product = MENU_ITEMS.find(p => p.id === itemId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === itemId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`Added "${product.name}" to your order!`, 'success');
}

function updateCartQuantity(itemId, delta) {
  const itemIndex = cart.findIndex(item => item.id === itemId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(itemId) {
  const item = cart.find(i => i.id === itemId);
  cart = cart.filter(i => i.id !== itemId);
  saveCart();
  updateCartUI();
  if (item) {
    showToast(`Removed "${item.name}"`, 'info');
  }
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCounter) {
    cartCounter.textContent = totalCount;
    cartCounter.style.transform = 'scale(1.25)';
    setTimeout(() => {
      cartCounter.style.transform = 'scale(1)';
    }, 200);
  }

  if (!cartItemsList) return;

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="cart-empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12h8"></path>
        </svg>
        <p style="font-weight: 600; font-size: 1.1rem; color: var(--color-primary); margin-bottom: 0.5rem;">Your order is empty</p>
        <p style="font-size: 0.85rem;">Explore our seasonal espresso, cold brews, and fresh bakery items.</p>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = '$0.00';
    if (cartTaxEl) cartTaxEl.textContent = '$0.00';
    if (cartTotalEl) cartTotalEl.textContent = '$0.00';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;

  let subtotal = 0;
  cartItemsList.innerHTML = '';

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-controls">
          <div class="qty-stepper">
            <button class="qty-btn" aria-label="Decrease quantity" data-id="${item.id}" data-action="dec">-</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="qty-btn" aria-label="Increase quantity" data-id="${item.id}" data-action="inc">+</button>
          </div>
          <button class="cart-item-remove" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `;
    cartItemsList.appendChild(itemEl);
  });

  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (cartTaxEl) cartTaxEl.textContent = `$${tax.toFixed(2)}`;
  if (cartTotalEl) cartTotalEl.textContent = `$${grandTotal.toFixed(2)}`;

  // Attach controls listeners
  cartItemsList.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      updateCartQuantity(id, action === 'inc' ? 1 : -1);
    });
  });

  cartItemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      removeFromCart(id);
    });
  });
}

function openCart() {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (openCartBtn) openCartBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

if (heroOrderBtn) {
  heroOrderBtn.addEventListener('click', () => {
    openCart();
  });
}

// Checkout simulation
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartTotalEl ? cartTotalEl.textContent : '';
    
    // Simulate order placement
    showToast(`Order confirmed! ${totalCount} items (${totalAmount}) placed for pickup.`, 'success');
    cart = [];
    saveCart();
    updateCartUI();
    closeCart();
  });
}

// ==========================================================================
// 6. Reservation Modal Handling (<dialog>)
// ==========================================================================
function openReservation() {
  if (reservationModal) {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    if (resDateInput) {
      resDateInput.min = today;
      if (!resDateInput.value) resDateInput.value = today;
    }
    reservationModal.showModal();
  }
}

function closeReservation() {
  if (reservationModal) {
    reservationModal.close();
  }
}

if (openReserveBtn) openReserveBtn.addEventListener('click', openReservation);
if (aboutReserveBtn) aboutReserveBtn.addEventListener('click', openReservation);
if (visitReserveBtn) visitReserveBtn.addEventListener('click', openReservation);
if (closeReserveBtn) closeReserveBtn.addEventListener('click', closeReservation);

// Close on backdrop click
if (reservationModal) {
  reservationModal.addEventListener('click', (e) => {
    const dialogDimensions = reservationModal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      reservationModal.close();
    }
  });
}

if (reservationForm) {
  reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('res-name')?.value || 'Guest';
    const guests = document.getElementById('res-guests')?.value || '2';
    const date = document.getElementById('res-date')?.value || 'Today';
    const time = document.getElementById('res-time')?.value || 'Selected time';
    
    showToast(`Table reserved for ${name} (${guests} guests) on ${date} at ${time}!`, 'success');
    reservationModal.close();
    reservationForm.reset();
  });
}

// ==========================================================================
// 7. Dynamic Business Hours & Live Status
// ==========================================================================
function calculateStoreStatus() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour + minute / 60;

  // Schedule definition
  // Mon-Thu (1-4): 7:00 AM (7.0) to 8:00 PM (20.0)
  // Fri (5): 7:00 AM (7.0) to 9:00 PM (21.0)
  // Sat (6): 8:00 AM (8.0) to 9:00 PM (21.0)
  // Sun (0): 8:00 AM (8.0) to 7:00 PM (19.0)
  let openTime = 7.0;
  let closeTime = 20.0;
  let closeLabel = '8:00 PM';
  let nextOpenLabel = '7:00 AM tomorrow';

  if (day === 5) {
    openTime = 7.0;
    closeTime = 21.0;
    closeLabel = '9:00 PM';
    nextOpenLabel = '8:00 AM tomorrow';
  } else if (day === 6) {
    openTime = 8.0;
    closeTime = 21.0;
    closeLabel = '9:00 PM';
    nextOpenLabel = '8:00 AM tomorrow';
  } else if (day === 0) {
    openTime = 8.0;
    closeTime = 19.0;
    closeLabel = '7:00 PM';
    nextOpenLabel = '7:00 AM tomorrow';
  }

  const isOpen = currentTime >= openTime && currentTime < closeTime;

  // Update Top Bar Pill
  const liveDot = document.getElementById('live-status-dot');
  const liveText = document.getElementById('live-status-text');
  const cardDot = document.getElementById('card-status-dot');
  const cardText = document.getElementById('card-status-text');

  if (isOpen) {
    if (liveDot) liveDot.className = 'live-dot';
    if (liveText) liveText.textContent = `Open Now • Closes at ${closeLabel}`;
    if (cardDot) cardDot.className = 'live-dot';
    if (cardText) cardText.textContent = `Open Now • Closes at ${closeLabel}`;
  } else {
    if (liveDot) liveDot.className = 'live-dot closed';
    if (liveText) liveText.textContent = `Closed • Opens at ${nextOpenLabel}`;
    if (cardDot) cardDot.className = 'live-dot closed';
    if (cardText) cardText.textContent = `Closed • Opens at ${nextOpenLabel}`;
  }

  // Highlight current day in hours list
  const hourRows = document.querySelectorAll('.hour-row');
  hourRows.forEach(row => {
    if (parseInt(row.getAttribute('data-day'), 10) === day) {
      row.classList.add('today');
      const daySpan = row.firstElementChild;
      if (daySpan && !daySpan.querySelector('.today-badge')) {
        const badge = document.createElement('span');
        badge.className = 'today-badge';
        badge.style.fontSize = '0.72rem';
        badge.style.background = 'var(--color-accent-light)';
        badge.style.color = 'var(--color-primary)';
        badge.style.padding = '2px 8px';
        badge.style.borderRadius = '12px';
        badge.style.marginLeft = '8px';
        badge.style.fontWeight = '700';
        badge.textContent = 'Today';
        daySpan.appendChild(badge);
      }
    }
  });
}

// ==========================================================================
// 8. Mobile Navigation & Scroll Behaviors
// ==========================================================================
if (menuToggleBtn && navLinks) {
  menuToggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });

  // Close mobile nav when clicking a link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
    });
  });
}

// Scroll header elevation
window.addEventListener('scroll', () => {
  if (siteHeader) {
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }
});

// ==========================================================================
// 9. Toast Notification System
// ==========================================================================
function showToast(message, type = 'info') {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  if (type === 'info') {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  }

  toast.innerHTML = `
    <span>${iconSvg}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove after 3.8s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3800);
}

// ==========================================================================
// 10. Newsletter Form Handling
// ==========================================================================
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    if (input && input.value) {
      showToast(`Welcome! A 15% discount code was sent to ${input.value}`, 'success');
      input.value = '';
    }
  });
}

// ==========================================================================
// 11. Initial Application Setup
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  renderMenu('all');
  updateCartUI();
  calculateStoreStatus();
});
