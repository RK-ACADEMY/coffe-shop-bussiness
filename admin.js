/**
 * Aura & Roast Artisanal Coffee - Admin Dashboard Controller
 */

// ==========================================================================
// 1. Navigation & Tab Switching
// ==========================================================================
const TAB_TITLES = {
  overview: {
    title: 'Dashboard Overview',
    subtitle: 'Monitor shop activity, configure offerings, and manage customer requests'
  },
  'menu-manager': {
    title: 'Menu Item Catalog',
    subtitle: 'Create, update, reprice, and manage stock for all coffee and food offerings'
  },
  'store-settings': {
    title: 'Store Settings & Branding',
    subtitle: 'Customize banner announcements, hero copy, address, and contact information'
  },
  'hours-schedule': {
    title: 'Operating Hours & Schedule',
    subtitle: 'Configure daily open & close hours to update the website status in real time'
  },
  orders: {
    title: 'Pickup Orders Management',
    subtitle: 'Track incoming customer mobile orders and update preparation status'
  },
  reservations: {
    title: 'Table Reservations',
    subtitle: 'Manage indoor lounge, patio, and cupping bar reservations'
  }
};

function switchTab(tabId) {
  // Update sidebar buttons
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update tab views
  document.querySelectorAll('.tab-content').forEach(section => {
    if (section.id === `tab-${tabId}`) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });

  // Update Page Title & Subtitle
  const meta = TAB_TITLES[tabId] || TAB_TITLES.overview;
  const titleEl = document.getElementById('view-title');
  const subEl = document.getElementById('view-subtitle');
  if (titleEl) titleEl.textContent = meta.title;
  if (subEl) subEl.textContent = meta.subtitle;

  // Refresh tab-specific data
  if (tabId === 'overview') renderOverview();
  if (tabId === 'menu-manager') renderMenuTable();
  if (tabId === 'store-settings') loadStoreSettingsForm();
  if (tabId === 'hours-schedule') renderHoursEditor();
  if (tabId === 'orders') renderOrdersTable();
  if (tabId === 'reservations') renderReservationsTable();
}

// Bind sidebar click events
document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.getAttribute('data-tab');
    if (tab) switchTab(tab);
  });
});

// ==========================================================================
// 2. Overview Tab Rendering
// ==========================================================================
function renderOverview() {
  const menuItems = CoffeeStore.getMenuItems();
  const orders = CoffeeStore.getOrders();
  const reservations = CoffeeStore.getReservations();
  const hours = CoffeeStore.getStoreHours();

  // Metrics
  const statMenuTotal = document.getElementById('stat-menu-total');
  const statOrdersTotal = document.getElementById('stat-orders-total');
  const statResTotal = document.getElementById('stat-res-total');
  const statTodayHours = document.getElementById('stat-today-hours');

  if (statMenuTotal) statMenuTotal.textContent = menuItems.length;
  if (statOrdersTotal) statOrdersTotal.textContent = orders.length;
  if (statResTotal) statResTotal.textContent = reservations.length;

  // Sidebar badges
  const badgeMenu = document.getElementById('badge-menu-count');
  const badgeOrders = document.getElementById('badge-orders-count');
  const badgeRes = document.getElementById('badge-res-count');
  if (badgeMenu) badgeMenu.textContent = menuItems.length;
  if (badgeOrders) badgeOrders.textContent = orders.length;
  if (badgeRes) badgeRes.textContent = reservations.length;

  // Today's hours
  const todayDay = new Date().getDay();
  const todaySchedule = hours.find(h => h.day === todayDay) || hours[0];
  if (statTodayHours) {
    if (todaySchedule.isClosed) {
      statTodayHours.textContent = 'Closed Today';
    } else {
      statTodayHours.textContent = `${formatTimeAmPm(todaySchedule.open)} - ${formatTimeAmPm(todaySchedule.close)}`;
    }
  }

  // Update Top Bar Store Status Pill
  updateStoreStatusPill(todaySchedule);

  // Recent Orders table in overview
  const tbody = document.getElementById('overview-orders-tbody');
  if (tbody) {
    tbody.innerHTML = '';
    const recentOrders = orders.slice(0, 5);
    if (recentOrders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--admin-text-muted);">No orders recorded yet.</td></tr>`;
      return;
    }

    recentOrders.forEach(ord => {
      const tr = document.createElement('tr');
      const itemsSummary = ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
      tr.innerHTML = `
        <td><strong>#${ord.id}</strong></td>
        <td>${escapeHtml(ord.customerName)}</td>
        <td style="max-width:280px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(itemsSummary)}</td>
        <td><strong>$${ord.total.toFixed(2)}</strong></td>
        <td><span class="status-pill status-${ord.status.toLowerCase()}">${ord.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

function updateStoreStatusPill(schedule) {
  const pill = document.getElementById('admin-store-status-pill');
  if (!pill) return;

  const now = new Date();
  const currentVal = now.getHours() + now.getMinutes() / 60;
  
  if (schedule.isClosed) {
    pill.textContent = '● Store Closed Today';
    pill.style.background = '#fee2e2';
    pill.style.color = '#b91c1c';
    return;
  }

  const [openH, openM] = schedule.open.split(':').map(Number);
  const [closeH, closeM] = schedule.close.split(':').map(Number);
  const openVal = openH + (openM || 0) / 60;
  const closeVal = closeH + (closeM || 0) / 60;

  if (currentVal >= openVal && currentVal < closeVal) {
    pill.textContent = `● Open Now (Closes ${formatTimeAmPm(schedule.close)})`;
    pill.style.background = '#dcfce7';
    pill.style.color = '#15803d';
  } else {
    pill.textContent = `● Store Closed (Opens ${formatTimeAmPm(schedule.open)})`;
    pill.style.background = '#fee2e2';
    pill.style.color = '#b91c1c';
  }
}

// ==========================================================================
// 3. Menu Manager
// ==========================================================================
function renderMenuTable() {
  const tbody = document.getElementById('menu-items-tbody');
  if (!tbody) return;

  const searchVal = (document.getElementById('menu-search-input')?.value || '').toLowerCase();
  const catVal = document.getElementById('menu-category-filter')?.value || 'all';

  let items = CoffeeStore.getMenuItems();

  if (catVal !== 'all') {
    items = items.filter(i => i.category === catVal);
  }

  if (searchVal) {
    items = items.filter(i => 
      i.name.toLowerCase().includes(searchVal) ||
      i.description.toLowerCase().includes(searchVal) ||
      (i.flavorTags && i.flavorTags.some(t => t.toLowerCase().includes(searchVal)))
    );
  }

  tbody.innerHTML = '';

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--admin-text-muted);">No matching menu items found.</td></tr>`;
    return;
  }

  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="item-cell">
          <img src="${item.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=120&q=80'}" alt="${escapeHtml(item.name)}" class="item-thumb">
          <div>
            <div class="item-name">${escapeHtml(item.name)}</div>
            <div class="item-desc-snippet">${escapeHtml(item.description)}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="badge badge-${item.category}">
          ${getCategoryLabel(item.category)}
        </span>
      </td>
      <td><strong>$${item.price.toFixed(2)}</strong></td>
      <td>${item.badge ? `<span style="font-size:0.75rem; background:rgba(201,136,96,0.15); color:var(--admin-accent); padding:2px 8px; border-radius:12px; font-weight:600;">${escapeHtml(item.badge)}</span>` : '<span style="color:var(--admin-text-muted);">-</span>'}</td>
      <td>
        <label class="switch">
          <input type="checkbox" class="toggle-stock-chk" data-id="${item.id}" ${item.available !== false ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </td>
      <td>
        <div style="display:flex; gap:0.4rem;">
          <button class="btn btn-secondary btn-icon btn-edit-item" data-id="${item.id}" title="Edit Item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="btn btn-danger btn-icon btn-delete-item" data-id="${item.id}" title="Delete Item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach table button events
  tbody.querySelectorAll('.toggle-stock-chk').forEach(chk => {
    chk.addEventListener('change', () => {
      const id = chk.getAttribute('data-id');
      const all = CoffeeStore.getMenuItems();
      const target = all.find(i => i.id === id);
      if (target) {
        target.available = chk.checked;
        CoffeeStore.saveMenuItems(all);
        showAdminToast(`Updated "${target.name}" stock: ${target.available ? 'In Stock' : 'Sold Out'}`);
      }
    });
  });

  tbody.querySelectorAll('.btn-edit-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openItemModal(id);
    });
  });

  tbody.querySelectorAll('.btn-delete-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const all = CoffeeStore.getMenuItems();
      const target = all.find(i => i.id === id);
      if (target && confirm(`Are you sure you want to delete "${target.name}"?`)) {
        const remaining = all.filter(i => i.id !== id);
        CoffeeStore.saveMenuItems(remaining);
        renderMenuTable();
        renderOverview();
        showAdminToast(`Deleted "${target.name}"`, 'warning');
      }
    });
  });
}

function getCategoryLabel(cat) {
  switch (cat) {
    case 'espresso': return 'Espresso';
    case 'cold': return 'Cold Brew';
    case 'specialty': return 'Signature';
    case 'tea': return 'Artisan Tea';
    case 'bakery': return 'Bakery & Food';
    default: return cat;
  }
}

// Bind search and filter
document.getElementById('menu-search-input')?.addEventListener('input', renderMenuTable);
document.getElementById('menu-category-filter')?.addEventListener('change', renderMenuTable);

// ==========================================================================
// 4. Item Modal Dialog (Add / Edit)
// ==========================================================================
const itemModal = document.getElementById('item-modal');
const itemForm = document.getElementById('item-form');
const itemImageInput = document.getElementById('item-image');
const itemImagePreview = document.getElementById('item-image-preview');

function openItemModal(itemId = null) {
  if (!itemModal) return;
  itemForm.reset();

  const modalTitle = document.getElementById('modal-item-title');
  const idInput = document.getElementById('item-id');
  const nameInput = document.getElementById('item-name');
  const catInput = document.getElementById('item-category');
  const priceInput = document.getElementById('item-price');
  const badgeInput = document.getElementById('item-badge');
  const tagsInput = document.getElementById('item-tags');
  const imageInput = document.getElementById('item-image');
  const descInput = document.getElementById('item-desc');
  const availInput = document.getElementById('item-available');

  if (itemId) {
    const items = CoffeeStore.getMenuItems();
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (modalTitle) modalTitle.textContent = `Edit "${item.name}"`;
    if (idInput) idInput.value = item.id;
    if (nameInput) nameInput.value = item.name;
    if (catInput) catInput.value = item.category;
    if (priceInput) priceInput.value = item.price.toFixed(2);
    if (badgeInput) badgeInput.value = item.badge || '';
    if (tagsInput) tagsInput.value = (item.flavorTags || []).join(', ');
    if (imageInput) imageInput.value = item.image || '';
    if (descInput) descInput.value = item.description || '';
    if (availInput) availInput.checked = item.available !== false;
    updateImagePreview(item.image);
  } else {
    if (modalTitle) modalTitle.textContent = 'Add New Menu Item';
    if (idInput) idInput.value = '';
    if (imageInput) imageInput.value = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80';
    if (availInput) availInput.checked = true;
    updateImagePreview('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80');
  }

  itemModal.showModal();
}

function updateImagePreview(url) {
  if (!itemImagePreview) return;
  if (url && url.startsWith('http')) {
    itemImagePreview.innerHTML = `<img src="${url}" alt="Preview" onerror="this.src=''; this.parentElement.innerHTML='<span style=\\'color:red; font-size:0.8rem;\\'>Invalid image URL</span>';">`;
  } else {
    itemImagePreview.innerHTML = `<span style="font-size:0.8rem; color:var(--admin-text-muted);">No image preview</span>`;
  }
}

if (itemImageInput) {
  itemImageInput.addEventListener('input', () => {
    updateImagePreview(itemImageInput.value.trim());
  });
}

function closeItemModal() {
  if (itemModal) itemModal.close();
}

document.getElementById('btn-add-item')?.addEventListener('click', () => openItemModal());
document.getElementById('btn-add-item-quick')?.addEventListener('click', () => openItemModal());
document.getElementById('btn-close-item-modal')?.addEventListener('click', closeItemModal);
document.getElementById('btn-cancel-item-modal')?.addEventListener('click', closeItemModal);

// Close modal on backdrop click
if (itemModal) {
  itemModal.addEventListener('click', (e) => {
    const rect = itemModal.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      itemModal.close();
    }
  });
}

// Form Submit Handler
if (itemForm) {
  itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('item-id')?.value;
    const name = document.getElementById('item-name')?.value.trim();
    const category = document.getElementById('item-category')?.value;
    const price = parseFloat(document.getElementById('item-price')?.value || '0');
    const badge = document.getElementById('item-badge')?.value.trim();
    const tagsRaw = document.getElementById('item-tags')?.value || '';
    const image = document.getElementById('item-image')?.value.trim() || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80';
    const description = document.getElementById('item-desc')?.value.trim();
    const available = document.getElementById('item-available')?.checked;

    const flavorTags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

    const items = CoffeeStore.getMenuItems();

    if (id) {
      // Edit existing
      const targetIndex = items.findIndex(i => i.id === id);
      if (targetIndex > -1) {
        items[targetIndex] = {
          ...items[targetIndex],
          name,
          category,
          price,
          badge,
          flavorTags,
          image,
          description,
          available
        };
        CoffeeStore.saveMenuItems(items);
        showAdminToast(`Updated "${name}" successfully!`, 'success');
      }
    } else {
      // Add new
      const newItem = {
        id: `item-${Date.now()}`,
        name,
        category,
        price,
        badge,
        flavorTags,
        image,
        description,
        available
      };
      items.push(newItem);
      CoffeeStore.saveMenuItems(items);
      showAdminToast(`Added "${name}" to the menu!`, 'success');
    }

    closeItemModal();
    renderMenuTable();
    renderOverview();
  });
}

// ==========================================================================
// 5. Store Settings Tab
// ==========================================================================
function loadStoreSettingsForm() {
  const settings = CoffeeStore.getStoreSettings();
  const nameInput = document.getElementById('setting-store-name');
  const taglineInput = document.getElementById('setting-tagline');
  const specialInput = document.getElementById('setting-daily-special');
  const addrInput = document.getElementById('setting-address');
  const phoneInput = document.getElementById('setting-phone');
  const emailInput = document.getElementById('setting-email');
  const heroTitleInput = document.getElementById('setting-hero-title');
  const heroDescInput = document.getElementById('setting-hero-desc');

  if (nameInput) nameInput.value = settings.storeName || '';
  if (taglineInput) taglineInput.value = settings.tagline || '';
  if (specialInput) specialInput.value = settings.dailySpecial || '';
  if (addrInput) addrInput.value = settings.address || '';
  if (phoneInput) phoneInput.value = settings.phone || '';
  if (emailInput) emailInput.value = settings.email || '';
  if (heroTitleInput) heroTitleInput.value = settings.heroTitle || '';
  if (heroDescInput) heroDescInput.value = settings.heroDesc || '';
}

const storeSettingsForm = document.getElementById('store-settings-form');
if (storeSettingsForm) {
  storeSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newSettings = {
      storeName: document.getElementById('setting-store-name')?.value.trim(),
      tagline: document.getElementById('setting-tagline')?.value.trim(),
      dailySpecial: document.getElementById('setting-daily-special')?.value.trim(),
      address: document.getElementById('setting-address')?.value.trim(),
      phone: document.getElementById('setting-phone')?.value.trim(),
      email: document.getElementById('setting-email')?.value.trim(),
      heroTitle: document.getElementById('setting-hero-title')?.value.trim(),
      heroDesc: document.getElementById('setting-hero-desc')?.value.trim()
    };

    CoffeeStore.saveStoreSettings(newSettings);
    showAdminToast('Store settings saved successfully! Changes are live.', 'success');
  });
}

// ==========================================================================
// 6. Hours & Schedule Tab
// ==========================================================================
function renderHoursEditor() {
  const tbody = document.getElementById('hours-editor-tbody');
  if (!tbody) return;

  const hours = CoffeeStore.getStoreHours();
  tbody.innerHTML = '';

  hours.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td>
        <input type="time" class="hour-open" data-day="${item.day}" value="${item.open}" ${item.isClosed ? 'disabled' : ''}>
      </td>
      <td>
        <input type="time" class="hour-close" data-day="${item.day}" value="${item.close}" ${item.isClosed ? 'disabled' : ''}>
      </td>
      <td>
        <label class="switch">
          <input type="checkbox" class="hour-closed" data-day="${item.day}" ${item.isClosed ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
        <span style="font-size:0.75rem; margin-left:0.5rem; color:var(--admin-text-muted);">${item.isClosed ? 'Closed' : 'Open'}</span>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Toggle time input disabled state on switch change
  tbody.querySelectorAll('.hour-closed').forEach(chk => {
    chk.addEventListener('change', () => {
      const day = chk.getAttribute('data-day');
      const row = chk.closest('tr');
      const openInp = row.querySelector('.hour-open');
      const closeInp = row.querySelector('.hour-close');
      const labelSpan = row.querySelector('td:last-child span');
      if (chk.checked) {
        if (openInp) openInp.disabled = true;
        if (closeInp) closeInp.disabled = true;
        if (labelSpan) labelSpan.textContent = 'Closed';
      } else {
        if (openInp) openInp.disabled = false;
        if (closeInp) closeInp.disabled = false;
        if (labelSpan) labelSpan.textContent = 'Open';
      }
    });
  });
}

const hoursForm = document.getElementById('hours-schedule-form');
if (hoursForm) {
  hoursForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rows = document.querySelectorAll('#hours-editor-tbody tr');
    const existing = CoffeeStore.getStoreHours();
    const updated = [];

    rows.forEach(row => {
      const openInp = row.querySelector('.hour-open');
      const closeInp = row.querySelector('.hour-close');
      const closedChk = row.querySelector('.hour-closed');
      const day = parseInt(openInp.getAttribute('data-day'), 10);
      const match = existing.find(h => h.day === day);

      updated.push({
        day,
        name: match ? match.name : 'Day',
        open: openInp.value || '07:00',
        close: closeInp.value || '20:00',
        isClosed: closedChk.checked
      });
    });

    CoffeeStore.saveStoreHours(updated);
    renderOverview();
    showAdminToast('Weekly operating hours updated and live!', 'success');
  });
}

// ==========================================================================
// 7. Orders Tab
// ==========================================================================
function renderOrdersTable() {
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;

  const statusFilter = document.getElementById('orders-status-filter')?.value || 'all';
  let orders = CoffeeStore.getOrders();

  if (statusFilter !== 'all') {
    orders = orders.filter(o => o.status === statusFilter);
  }

  tbody.innerHTML = '';

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--admin-text-muted);">No orders matching "${statusFilter}".</td></tr>`;
    return;
  }

  orders.forEach(order => {
    const tr = document.createElement('tr');
    const dateFormatted = new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + new Date(order.timestamp).toLocaleDateString() + ')';
    const itemsListHtml = order.items.map(i => `<span style="display:inline-block; background:#f0eae1; padding:2px 8px; border-radius:12px; margin:2px; font-size:0.75rem;">${i.quantity}x ${escapeHtml(i.name)}</span>`).join('');

    tr.innerHTML = `
      <td><strong>#${order.id}</strong></td>
      <td style="font-size:0.8rem; color:var(--admin-text-muted);">${dateFormatted}</td>
      <td><strong>${escapeHtml(order.customerName || 'Pickup Customer')}</strong></td>
      <td>${itemsListHtml}</td>
      <td><strong>$${order.total.toFixed(2)}</strong></td>
      <td>
        <select class="filter-select order-status-select" data-id="${order.id}" style="padding:0.3rem 0.6rem; font-size:0.8rem;">
          <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
          <option value="Ready" ${order.status === 'Ready' ? 'selected' : ''}>Ready for Pickup</option>
          <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
      </td>
      <td>
        <button class="btn btn-danger btn-icon btn-delete-order" data-id="${order.id}" title="Delete Order">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach status change events
  tbody.querySelectorAll('.order-status-select').forEach(select => {
    select.addEventListener('change', () => {
      const id = select.getAttribute('data-id');
      CoffeeStore.updateOrderStatus(id, select.value);
      showAdminToast(`Order #${id} marked as "${select.value}"`);
      renderOverview();
    });
  });

  // Attach delete events
  tbody.querySelectorAll('.btn-delete-order').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm(`Delete order #${id}?`)) {
        CoffeeStore.deleteOrder(id);
        renderOrdersTable();
        renderOverview();
        showAdminToast(`Order #${id} deleted`, 'warning');
      }
    });
  });
}

document.getElementById('orders-status-filter')?.addEventListener('change', renderOrdersTable);

// ==========================================================================
// 8. Reservations Tab
// ==========================================================================
function renderReservationsTable() {
  const tbody = document.getElementById('reservations-tbody');
  if (!tbody) return;

  const statusFilter = document.getElementById('res-status-filter')?.value || 'all';
  let reservations = CoffeeStore.getReservations();

  if (statusFilter !== 'all') {
    reservations = reservations.filter(r => r.status === statusFilter);
  }

  tbody.innerHTML = '';

  if (reservations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:2rem; color:var(--admin-text-muted);">No reservations matching "${statusFilter}".</td></tr>`;
    return;
  }

  reservations.forEach(res => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>#${res.id}</strong></td>
      <td><strong>${escapeHtml(res.name)}</strong></td>
      <td style="font-size:0.8rem;">
        <div>📞 ${escapeHtml(res.phone || '-')}</div>
        <div style="color:var(--admin-text-muted);">✉️ ${escapeHtml(res.email || '-')}</div>
      </td>
      <td>
        <div style="font-weight:600;">${res.date}</div>
        <div style="font-size:0.8rem; color:var(--admin-text-muted);">${res.time}</div>
      </td>
      <td><strong>${res.guests}</strong> guests</td>
      <td><span class="badge" style="background:#faedcd; color:#78350f;">${escapeHtml(res.seating || 'Standard')}</span></td>
      <td style="font-size:0.8rem; color:var(--admin-text-muted); max-width:180px;">${escapeHtml(res.notes || 'None')}</td>
      <td>
        <select class="filter-select res-status-select" data-id="${res.id}" style="padding:0.3rem 0.6rem; font-size:0.8rem;">
          <option value="Confirmed" ${res.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="Pending" ${res.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Seated" ${res.status === 'Seated' ? 'selected' : ''}>Seated</option>
          <option value="Cancelled" ${res.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <button class="btn btn-danger btn-icon btn-delete-res" data-id="${res.id}" title="Delete Reservation">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach status change events
  tbody.querySelectorAll('.res-status-select').forEach(select => {
    select.addEventListener('change', () => {
      const id = select.getAttribute('data-id');
      CoffeeStore.updateReservationStatus(id, select.value);
      showAdminToast(`Reservation #${id} updated to "${select.value}"`);
      renderOverview();
    });
  });

  // Attach delete events
  tbody.querySelectorAll('.btn-delete-res').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm(`Delete reservation #${id}?`)) {
        CoffeeStore.deleteReservation(id);
        renderReservationsTable();
        renderOverview();
        showAdminToast(`Reservation #${id} deleted`, 'warning');
      }
    });
  });
}

document.getElementById('res-status-filter')?.addEventListener('change', renderReservationsTable);

// ==========================================================================
// 9. Data Management & Factory Reset
// ==========================================================================
document.getElementById('btn-export-json')?.addEventListener('click', () => {
  const jsonStr = CoffeeStore.exportAll();
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aura-roast-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showAdminToast('Backup JSON downloaded successfully!');
});

document.getElementById('input-import-json')?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const success = CoffeeStore.importAll(event.target.result);
    if (success) {
      showAdminToast('Configuration imported successfully!', 'success');
      renderOverview();
      renderMenuTable();
      loadStoreSettingsForm();
      renderHoursEditor();
      renderOrdersTable();
      renderReservationsTable();
    } else {
      showAdminToast('Failed to import configuration file. Invalid JSON.', 'danger');
    }
  };
  reader.readAsText(file);
});

document.getElementById('btn-reset-defaults')?.addEventListener('click', () => {
  if (confirm('Reset all items, settings, hours, and demo data to factory defaults? Any custom modifications will be reset.')) {
    CoffeeStore.resetToDefaults();
    showAdminToast('Factory defaults restored!', 'info');
    renderOverview();
    renderMenuTable();
    loadStoreSettingsForm();
    renderHoursEditor();
    renderOrdersTable();
    renderReservationsTable();
  }
});

// ==========================================================================
// 10. Toast Notification System
// ==========================================================================
function showAdminToast(message, type = 'info') {
  const container = document.getElementById('admin-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'danger') toast.style.borderLeftColor = 'var(--admin-danger)';
  if (type === 'warning') toast.style.borderLeftColor = 'var(--admin-warning)';
  if (type === 'success') toast.style.borderLeftColor = 'var(--admin-success)';

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Helpers
function formatTimeAmPm(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m < 10 ? '0' + m : m} ${period}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================================================
// 11. Initial Startup
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  renderOverview();
  renderMenuTable();
  loadStoreSettingsForm();
  renderHoursEditor();
});
