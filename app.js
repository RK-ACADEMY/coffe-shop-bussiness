/**
 * Aura & Roast Artisanal Coffee - Main Application Logic
 * Integrates with shared-data.js (CoffeeStore) for live customization sync.
 */

// ==========================================================================
// 1. State & Persistence
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
// 2. DOM Elements Cache
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

// Active category filter state
let currentCategory = 'all';

// ==========================================================================
// 3. Dynamic Store Settings Applier
// ==========================================================================
function applyStoreSettings() {
  if (typeof CoffeeStore === 'undefined') return;
  const settings = CoffeeStore.getStoreSettings();

  const brandTitle = document.getElementById('store-brand-title');
  const specialText = document.getElementById('hero-daily-special-text');
  const heroTitle = document.getElementById('hero-title-text');
  const heroDesc = document.getElementById('hero-desc-text');
  const addrTop = document.getElementById('store-address-top');
  const addrVisit = document.getElementById('store-address-visit');
  const phoneVisit = document.getElementById('store-phone-visit');
  const emailVisit = document.getElementById('store-email-visit');

  if (brandTitle && settings.storeName) brandTitle.textContent = settings.storeName;
  if (specialText && settings.dailySpecial) specialText.textContent = settings.dailySpecial;
  if (heroTitle && settings.heroTitle) heroTitle.innerHTML = settings.heroTitle;
  if (heroDesc && settings.heroDesc) heroDesc.textContent = settings.heroDesc;
  if (addrTop && settings.address) addrTop.textContent = settings.address;
  if (addrVisit && settings.address) addrVisit.textContent = settings.address;
  if (phoneVisit && settings.phone) phoneVisit.textContent = settings.phone;
  if (emailVisit && settings.email) emailVisit.textContent = settings.email;
}

// ==========================================================================
// 4. Menu Rendering & Filtering
// ==========================================================================
function renderMenu(category = 'all') {
  if (!menuGrid) return;
  currentCategory = category;
  
  menuGrid.innerHTML = '';
  
  const allItems = typeof CoffeeStore !== 'undefined' ? CoffeeStore.getMenuItems() : [];
  const filtered = category === 'all' 
    ? allItems 
    : allItems.filter(item => item.category === category);

  if (filtered.length === 0) {
    menuGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--color-text-muted);">
        <p style="font-size: 1.1rem; font-weight: 600;">No items found in this category.</p>
        <p style="font-size: 0.9rem;">Check back soon or explore our other seasonal offerings.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const isAvailable = item.available !== false;
    const card = document.createElement('article');
    card.className = 'menu-card';
    card.setAttribute('data-id', item.id);
    if (!isAvailable) {
      card.style.opacity = '0.7';
    }
    
    card.innerHTML = `
      <div class="menu-card-img-wrapper">
        <img src="${item.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'}" alt="${item.name}" class="menu-card-img" loading="lazy">
        ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ''}
        ${!isAvailable ? `<span class="menu-badge" style="background:#b91c1c; right:12px; left:auto;">Sold Out</span>` : ''}
      </div>
      <div class="menu-card-body">
        <div class="menu-card-header">
          <h3 class="menu-item-title">${item.name}</h3>
          <span class="menu-item-price">$${Number(item.price).toFixed(2)}</span>
        </div>
        <p class="menu-item-desc">${item.description || ''}</p>
        <div class="menu-card-footer">
          <div class="flavor-tags">
            ${(item.flavorTags || []).map(tag => `<span class="flavor-tag">${tag}</span>`).join('')}
          </div>
          <button class="add-cart-btn" aria-label="Add ${item.name} to order" data-id="${item.id}" ${!isAvailable ? 'disabled style="background:#ccc; cursor:not-allowed;"' : ''}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </div>
    `;

    menuGrid.appendChild(card);
  });

  // Attach click listeners to card "add to cart" buttons
  const addButtons = menuGrid.querySelectorAll('.add-cart-btn:not([disabled])');
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
// 5. Cart Logic & Order Ahead
// ==========================================================================
function saveCart() {
  try {
    localStorage.setItem('aura_roast_cart', JSON.stringify(cart));
  } catch (e) {
    console.warn('Could not save cart', e);
  }
}

function addToCart(itemId) {
  const allItems = typeof CoffeeStore !== 'undefined' ? CoffeeStore.getMenuItems() : [];
  const product = allItems.find(p => p.id === itemId);
  if (!product || product.available === false) return;

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
        <div class="cart-item-price">$${Number(item.price).toFixed(2)}</div>
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

// Checkout simulation synced with Admin Orders
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const grandTotal = subtotal * 1.08;
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Save to shared store for Admin portal visibility
    if (typeof CoffeeStore !== 'undefined') {
      CoffeeStore.addOrder({
        id: orderId,
        customerName: 'Pickup Guest',
        timestamp: new Date().toISOString(),
        items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        total: grandTotal,
        status: 'Pending'
      });
    }

    showToast(`Order #${orderId} confirmed! ${totalCount} items ($${grandTotal.toFixed(2)}) placed for counter pickup.`, 'success');
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
    const phone = document.getElementById('res-phone')?.value || '';
    const email = document.getElementById('res-email')?.value || '';
    const guests = document.getElementById('res-guests')?.value || '2';
    const date = document.getElementById('res-date')?.value || 'Today';
    const time = document.getElementById('res-time')?.value || 'Selected time';
    const seating = document.querySelector('input[name="seating"]:checked')?.value || 'Lounge';
    const notes = document.getElementById('res-notes')?.value || '';
    
    const resId = `RES-${Math.floor(2000 + Math.random() * 8000)}`;

    // Save to shared store for Admin portal
    if (typeof CoffeeStore !== 'undefined') {
      CoffeeStore.addReservation({
        id: resId,
        name,
        phone,
        email,
        date,
        time,
        guests,
        seating,
        notes,
        status: 'Confirmed'
      });
    }

    showToast(`Table reserved for ${name} (${guests} guests) on ${date} at ${time}!`, 'success');
    reservationModal.close();
    reservationForm.reset();
  });
}

// ==========================================================================
// 7. Dynamic Business Hours & Live Status
// ==========================================================================
function calculateStoreStatus() {
  if (typeof CoffeeStore === 'undefined') return;
  const hours = CoffeeStore.getStoreHours();
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour + minute / 60;

  const todaySchedule = hours.find(h => h.day === day) || hours[0];

  let isOpen = false;
  let closeLabel = '';
  let nextOpenLabel = '';

  if (!todaySchedule.isClosed) {
    const [openH, openM] = todaySchedule.open.split(':').map(Number);
    const [closeH, closeM] = todaySchedule.close.split(':').map(Number);
    const openTime = openH + (openM || 0) / 60;
    const closeTime = closeH + (closeM || 0) / 60;

    isOpen = currentTime >= openTime && currentTime < closeTime;
    closeLabel = formatTimeAmPm(todaySchedule.close);
  }

  // Find next open day
  const nextDay = (day + 1) % 7;
  const nextSchedule = hours.find(h => h.day === nextDay);
  if (nextSchedule && !nextSchedule.isClosed) {
    nextOpenLabel = `${formatTimeAmPm(nextSchedule.open)} tomorrow`;
  } else {
    nextOpenLabel = 'soon';
  }

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
    if (liveText) liveText.textContent = todaySchedule.isClosed ? `Closed Today • Opens ${nextOpenLabel}` : `Closed • Opens at ${nextOpenLabel}`;
    if (cardDot) cardDot.className = 'live-dot closed';
    if (cardText) cardText.textContent = todaySchedule.isClosed ? `Closed Today` : `Closed • Opens at ${nextOpenLabel}`;
  }

  // Render & highlight hours list dynamically
  const hoursList = document.getElementById('hours-list');
  if (hoursList) {
    hoursList.innerHTML = '';
    // Display in order Mon-Sun (1, 2, 3, 4, 5, 6, 0)
    const sortedDays = [1, 2, 3, 4, 5, 6, 0];
    sortedDays.forEach(d => {
      const schedule = hours.find(h => h.day === d);
      if (!schedule) return;

      const isToday = schedule.day === day;
      const row = document.createElement('div');
      row.className = `hour-row ${isToday ? 'today' : ''}`;
      row.setAttribute('data-day', schedule.day);

      const hoursDisplay = schedule.isClosed 
        ? 'Closed' 
        : `${formatTimeAmPm(schedule.open)} – ${formatTimeAmPm(schedule.close)}`;

      row.innerHTML = `
        <span>
          ${schedule.name}
          ${isToday ? `<span class="today-badge" style="font-size:0.72rem; background:var(--color-accent-light); color:var(--color-primary); padding:2px 8px; border-radius:12px; margin-left:8px; font-weight:700;">Today</span>` : ''}
        </span>
        <span>${hoursDisplay}</span>
      `;
      hoursList.appendChild(row);
    });
  }
}

function formatTimeAmPm(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m < 10 ? '0' + m : m} ${period}`;
}

// ==========================================================================
// 8. Mobile Navigation & Scroll Behaviors
// ==========================================================================
if (menuToggleBtn && navLinks) {
  menuToggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });

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

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

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
// 11. Cross-Tab Synchronization via Storage Events
// ==========================================================================
window.addEventListener('storage', (e) => {
  if (e.key === 'aura_menu_items') {
    renderMenu(currentCategory);
  }
  if (e.key === 'aura_store_settings') {
    applyStoreSettings();
  }
  if (e.key === 'aura_store_hours') {
    calculateStoreStatus();
  }
});

// ==========================================================================
// 12. Initial Application Setup
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  applyStoreSettings();
  renderMenu('all');
  updateCartUI();
  calculateStoreStatus();
});
