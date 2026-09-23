/**
 * Aura & Roast Artisanal Coffee - Shared Data Store
 * Provides persistent storage and synchronization across the customer website and admin portal.
 */

const DEFAULT_MENU_ITEMS = [
  {
    id: 'item-1',
    name: 'Single-Origin Pour Over',
    category: 'espresso',
    price: 5.75,
    description: 'Rotating micro-lot beans brewed via Chemex or V60 with precise water temp & ratio.',
    badge: 'Roaster Pick',
    flavorTags: ['Floral', 'Bergamot', 'Light Roast'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'item-2',
    name: 'Velvet Flat White',
    category: 'espresso',
    price: 4.85,
    description: 'Double ristretto shot crowned with micro-foamed whole or oat milk.',
    badge: 'Popular',
    flavorTags: ['Caramel', 'Silky', 'Balanced'],
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'item-3',
    name: 'Spanish Cortado',
    category: 'espresso',
    price: 4.25,
    description: 'Equal parts house espresso and lightly textured steamed milk in a Gibraltar glass.',
    badge: 'Classic',
    flavorTags: ['Cocoa', 'Nutty', 'Smooth'],
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'item-4',
    name: 'Honey Lavender Latte',
    category: 'specialty',
    price: 6.25,
    description: 'Wildflower local honey infused with French lavender, espresso, and creamy steamed oat milk.',
    badge: 'Signature',
    flavorTags: ['Floral', 'Sweet Honey', 'Aromatic'],
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'item-5',
    name: 'Smoked Cardamom Cappuccino',
    category: 'specialty',
    price: 5.95,
    description: 'Freshly ground green cardamom, raw turbinado sugar, and a velvety espresso head.',
    badge: 'Seasonal',
    flavorTags: ['Warm Spice', 'Rich', 'Smoky'],
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'item-6',
    name: 'Nitro Cold Brew on Tap',
    category: 'cold',
    price: 5.50,
    description: '18-hour cold steeped Colombian beans infused with nitrogen for a Guinness-like cascade and creamy mouthfeel.',
    badge: 'On Tap',
    flavorTags: ['Dark Chocolate', 'Ultra Smooth', 'Bold'],
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'item-7',
    name: 'Vanilla Sweet Cloud Cold Brew',
    category: 'cold',
    price: 5.00,
    description: 'Slow-steeped iced coffee topped with a whipped Madagascar vanilla cold foam cap.',
    badge: 'Bestseller',
    flavorTags: ['Bourbon Vanilla', 'Creamy', 'Chilled'],
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'item-8',
    name: 'Espresso Tonic Spritz',
    category: 'cold',
    price: 5.80,
    description: 'Double espresso pulled directly over artisanal botanical tonic, ice, and dehydrated grapefruit.',
    badge: 'Refreshing',
    flavorTags: ['Citrus', 'Effervescent', 'Crisp'],
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'item-9',
    name: 'Ceremonial Matcha Latte',
    category: 'tea',
    price: 6.40,
    description: 'First-harvest Uji matcha whisked to order with warm oat milk and touch of maple.',
    badge: 'Organic',
    flavorTags: ['Umami', 'Earthy', 'Antioxidant'],
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'item-10',
    name: 'Spiced Golden Chai Elixir',
    category: 'tea',
    price: 5.60,
    description: 'Slow-simmered Assam black tea with ginger, whole cloves, star anise, and organic honey.',
    badge: 'House Blend',
    flavorTags: ['Spicy', 'Comforting', 'Sweet'],
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'item-11',
    name: 'Brown Butter Almond Croissant',
    category: 'bakery',
    price: 4.95,
    description: 'Twice-baked butter croissant filled with frangipane cream and toasted sliced almonds.',
    badge: 'Baked Daily',
    flavorTags: ['Nutty', 'Flaky', 'Fresh'],
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'item-12',
    name: 'Avocado Heirloom Sourdough Tartine',
    category: 'bakery',
    price: 8.50,
    description: 'Grilled country sourdough, smashed Haas avocado, heirloom cherry tomatoes, dukkah, microgreens.',
    badge: 'Chef Favorite',
    flavorTags: ['Savory', 'Plant-Based', 'Crispy'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    available: true
  }
];

const DEFAULT_STORE_SETTINGS = {
  storeName: 'Aura & Roast',
  tagline: 'Artisanal Coffee & Roastery',
  dailySpecial: '✨ Daily Special: Ethiopian Yirgacheffe Natural Process',
  address: "442 Roaster's Way, Arts District, Portland, OR",
  phone: '(503) 555-0194',
  email: 'hello@auraandroast.com',
  heroTitle: 'Crafted with passion of heart, <span>brewed</span> to your perfection.',
  heroDesc: 'Welcome to Aura & Roast. We partner directly with sustainable high-altitude farmers to handcraft small-batch roasts, sensory pour-overs, and unforgettable coffee moments in the heart of the city.'
};

const DEFAULT_STORE_HOURS = [
  { day: 1, name: 'Monday', open: '07:00', close: '20:00', isClosed: false },
  { day: 2, name: 'Tuesday', open: '07:00', close: '20:00', isClosed: false },
  { day: 3, name: 'Wednesday', open: '07:00', close: '20:00', isClosed: false },
  { day: 4, name: 'Thursday', open: '07:00', close: '20:00', isClosed: false },
  { day: 5, name: 'Friday', open: '07:00', close: '21:00', isClosed: false },
  { day: 6, name: 'Saturday', open: '08:00', close: '21:00', isClosed: false },
  { day: 0, name: 'Sunday', open: '08:00', close: '19:00', isClosed: false }
];

const DEFAULT_INITIAL_ORDERS = [
  {
    id: 'ORD-1001',
    customerName: 'Marcus C.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    items: [
      { name: 'Vanilla Sweet Cloud Cold Brew', quantity: 1, price: 5.00 },
      { name: 'Brown Butter Almond Croissant', quantity: 2, price: 4.95 }
    ],
    total: 16.09,
    status: 'Ready'
  },
  {
    id: 'ORD-1002',
    customerName: 'Elena R.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    items: [
      { name: 'Honey Lavender Latte', quantity: 1, price: 6.25 },
      { name: 'Avocado Heirloom Sourdough Tartine', quantity: 1, price: 8.50 }
    ],
    total: 15.93,
    status: 'Preparing'
  }
];

const DEFAULT_INITIAL_RESERVATIONS = [
  {
    id: 'RES-2001',
    name: 'Sophia Al-Mansoor',
    phone: '(503) 555-8291',
    email: 'sophia@example.com',
    date: new Date().toISOString().split('T')[0],
    time: '02:30 PM',
    guests: '2',
    seating: 'Patio',
    notes: 'Window side if possible',
    status: 'Confirmed'
  }
];

// Data Store Controller API
const CoffeeStore = {
  // Menu Items
  getMenuItems() {
    try {
      const data = localStorage.getItem('aura_menu_items');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading menu items', e);
    }
    this.saveMenuItems(DEFAULT_MENU_ITEMS);
    return DEFAULT_MENU_ITEMS;
  },

  saveMenuItems(items) {
    try {
      localStorage.setItem('aura_menu_items', JSON.stringify(items));
    } catch (e) {
      console.warn('Error saving menu items', e);
    }
  },

  // Store Settings
  getStoreSettings() {
    try {
      const data = localStorage.getItem('aura_store_settings');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.heroTitle && parsed.heroTitle.includes('Crafted with passion,') && !parsed.heroTitle.includes('of heart')) {
          parsed.heroTitle = parsed.heroTitle.replace('Crafted with passion,', 'Crafted with passion of heart,');
          this.saveStoreSettings(parsed);
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading store settings', e);
    }
    this.saveStoreSettings(DEFAULT_STORE_SETTINGS);
    return DEFAULT_STORE_SETTINGS;
  },

  saveStoreSettings(settings) {
    try {
      localStorage.setItem('aura_store_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Error saving store settings', e);
    }
  },

  // Store Hours
  getStoreHours() {
    try {
      const data = localStorage.getItem('aura_store_hours');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading store hours', e);
    }
    this.saveStoreHours(DEFAULT_STORE_HOURS);
    return DEFAULT_STORE_HOURS;
  },

  saveStoreHours(hours) {
    try {
      localStorage.setItem('aura_store_hours', JSON.stringify(hours));
    } catch (e) {
      console.warn('Error saving store hours', e);
    }
  },

  // Orders
  getOrders() {
    try {
      const data = localStorage.getItem('aura_orders');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading orders', e);
    }
    this.saveOrders(DEFAULT_INITIAL_ORDERS);
    return DEFAULT_INITIAL_ORDERS;
  },

  saveOrders(orders) {
    try {
      localStorage.setItem('aura_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Error saving orders', e);
    }
  },

  addOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);
    return order;
  },

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.saveOrders(orders);
    }
  },

  deleteOrder(orderId) {
    const orders = this.getOrders().filter(o => o.id !== orderId);
    this.saveOrders(orders);
  },

  // Reservations
  getReservations() {
    try {
      const data = localStorage.getItem('aura_reservations');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading reservations', e);
    }
    this.saveReservations(DEFAULT_INITIAL_RESERVATIONS);
    return DEFAULT_INITIAL_RESERVATIONS;
  },

  saveReservations(reservations) {
    try {
      localStorage.setItem('aura_reservations', JSON.stringify(reservations));
    } catch (e) {
      console.warn('Error saving reservations', e);
    }
  },

  addReservation(res) {
    const list = this.getReservations();
    list.unshift(res);
    this.saveReservations(list);
    return res;
  },

  updateReservationStatus(resId, newStatus) {
    const list = this.getReservations();
    const target = list.find(r => r.id === resId);
    if (target) {
      target.status = newStatus;
      this.saveReservations(list);
    }
  },

  deleteReservation(resId) {
    const list = this.getReservations().filter(r => r.id !== resId);
    this.saveReservations(list);
  },

  // Factory Reset
  resetToDefaults() {
    this.saveMenuItems(DEFAULT_MENU_ITEMS);
    this.saveStoreSettings(DEFAULT_STORE_SETTINGS);
    this.saveStoreHours(DEFAULT_STORE_HOURS);
    this.saveOrders(DEFAULT_INITIAL_ORDERS);
    this.saveReservations(DEFAULT_INITIAL_RESERVATIONS);
  },

  // Export / Import
  exportAll() {
    return JSON.stringify({
      menu: this.getMenuItems(),
      settings: this.getStoreSettings(),
      hours: this.getStoreHours(),
      orders: this.getOrders(),
      reservations: this.getReservations(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  },

  importAll(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.menu) this.saveMenuItems(data.menu);
      if (data.settings) this.saveStoreSettings(data.settings);
      if (data.hours) this.saveStoreHours(data.hours);
      if (data.orders) this.saveOrders(data.orders);
      if (data.reservations) this.saveReservations(data.reservations);
      return true;
    } catch (e) {
      console.error('Failed to import data', e);
      return false;
    }
  }
};
