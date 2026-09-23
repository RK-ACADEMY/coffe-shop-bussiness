# ☕ Aura & Roast — Artisanal Coffee & Roastery

A modern, responsive, and interactive website and full administrative portal for an artisanal coffee shop business. Built with zero dependencies, vanilla web standards (HTML5, Modern CSS3, ES6+ JavaScript), and persistent local state synchronization.

---

## 🌟 Key Features

### Customer Website (`index.html`)
- **Aesthetic Branding**: Warm espresso tones, caramel accents, glassmorphic navigation header, and editorial typography (*Playfair Display* & *Plus Jakarta Sans*).
- **Dynamic Store Hours**: Live status pill (`🟢 Open Now` / `🔴 Closed`) calculated in real time against the shop's weekly schedule.
- **Interactive Seasonal Menu**: Filterable by categories (*Espresso & Hot Brews*, *Cold Brew & Iced*, *Signature Drinks*, *Artisanal Teas*, *Bakery & Food*) with flavor notes and pricing.
- **Online Order Ahead & Cart Drawer**: Slide-out cart with item steppers, tax calculation, and simulated checkout flow.
- **Table & Tasting Reservation System**: Modal booking form with guest count, time slot, and seating preference (*Indoor Lounge*, *Sunlit Patio*, *Espresso Bar*).
- **Craft Timeline & Customer Testimonials**: Bean-to-cup sourcing story and guest reviews.

### Separate Admin Portal (`admin.html`)
- **Dashboard Overview**: Live KPI counters for active menu items, total pickup orders, table bookings, and operating hours.
- **Menu Catalog Manager (CRUD)**: Add new items, update prices and descriptions, upload images, and toggle live stock availability (*In Stock* / *Sold Out*).
- **Store Settings & Content**: Modify store name, address, contact phone/email, daily special announcement banner, and hero copy.
- **Weekly Schedule Editor**: Configure custom opening and closing times per day, or mark days as closed.
- **Order Tracking**: Manage incoming mobile pickup orders through stages (*Pending*, *Preparing*, *Ready for Pickup*, *Completed*).
- **Reservation Management**: Track and confirm table booking requests.
- **Data Backup & Restore**: One-click JSON export/import and factory reset.

---

## 🚀 Getting Started

### Option 1: Native Local Server (Recommended)
Run the included lightweight PowerShell server on port 8000:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 8000
```
Then visit:
- **Customer Site**: [http://localhost:8000/](http://localhost:8000/)
- **Staff Admin Portal**: [http://localhost:8000/admin.html](http://localhost:8000/admin.html)

### Option 2: Open Directly
Double-click `index.html` to open directly in any modern browser (Chrome, Edge, Firefox, Safari).

---

## 📁 Project Structure

```text
├── index.html         # Customer-facing website
├── styles.css         # Main responsive stylesheet & design tokens
├── app.js             # Customer application logic & cart management
├── admin.html         # Staff administration portal
├── admin.css          # Admin dashboard theme and data tables
├── admin.js           # Admin controller & CRUD operations
├── shared-data.js     # Unified persistent store & synchronization layer
├── server.ps1         # Built-in local HTTP server using .NET HttpListener
└── README.md          # Project documentation
```

---

## 📄 License
MIT License. Free to customize and use for your coffee shop business!
