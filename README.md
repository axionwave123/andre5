# GREBY Marketplace — Complete System

**Everything You Need, Anywhere You Are.**

20-screen marketplace for Properties • Cars • Lands • Machines • Wholesale & Retail.

---

## Quick Start (Static UI)

1. Open `index.html` in a browser  
2. Or enable **GitHub Pages** (Settings → Pages → Branch: `main` → Save)  
3. Live URL will be: `https://axionwave123.github.io/andre5/`

A floating **Screens** button (bottom-right) lets you jump between all 20 screens.

---

## Project Structure

```
andre5/
├── index.html              # Full interactive static UI (all 20 screens)
├── css/styles.css          # Complete design system
├── js/app.js               # Navigation + Chart.js dashboards
├── backend/                # Node.js + Express + SQLite API
│   ├── server.js
│   ├── package.json
│   └── init-db.js
├── frontend-next/          # Next.js 14 + React + Tailwind version
│   ├── app/
│   ├── package.json
│   └── ...
└── .github/workflows/      # Auto-deploy to GitHub Pages
```

---

## 1. Expanded Screens (Static Version)

All 20 screens from the original design are implemented in `index.html` with:

- Splash / Language / Auth / Location
- Home with categories & bottom nav
- Marketplace + Search + Filters
- Product Details + Property/Car Details
- Enquiry flow, Reviews & Videos
- Wishlist, Price Alerts, Cart
- Checkout → Payment → Order Confirmation
- Promoter Dashboard (affiliate stats)
- Seller Dashboard (listings + Chart.js)
- Admin Dashboard (platform overview + verifications)

---

## 2. Backend (Node.js + Express + SQLite)

```bash
cd backend
npm install
node server.js          # runs on http://localhost:4000
node init-db.js         # seed sample sellers & listings
```

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login → JWT |
| GET  | `/api/listings` | Search / filter listings |
| GET  | `/api/listings/:id` | Single listing |
| POST | `/api/listings` | Create listing (seller) |
| POST | `/api/orders` | Place order |
| GET  | `/api/wishlist` | User wishlist |
| GET  | `/api/dashboard/seller` | Seller stats |
| GET  | `/api/dashboard/admin` | Admin stats |
| GET  | `/api/dashboard/promoter` | Promoter stats |

**Default admin:** `admin@greby.com` / `admin123`  
**Sample sellers:** any `*@greby.com` / `password123`

Roles: `customer` • `seller` • `promoter` • `admin`

---

## 3. Next.js Version

```bash
cd frontend-next
npm install
npm run dev          # http://localhost:3000
```

Modern React 18 + Next.js 14 App Router + Tailwind CSS.  
Includes splash → auth → home → marketplace flow and dashboard placeholders.  
Easily expandable with the same API.

---

## 4. GitHub Pages

A GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) is included.

**To enable:**

1. Go to your repo → **Settings → Pages**
2. Under “Build and deployment” choose **GitHub Actions**
3. Push any change to `main` (or run the workflow manually)
4. Site will be live at:  
   **https://axionwave123.github.io/andre5/**

Alternatively (classic method):  
Settings → Pages → Source: Deploy from branch `main` / root.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#6C2CFF` | Brand, buttons, links |
| Accent | `#FFB800` | CTAs, badges |
| Dark | `#1F2937` | Text |
| Success | `#10B981` | Verified |
| Dashboard BG | `#0F172A` | Dark panels |

---

## Tech Stack

- **Frontend (Static):** HTML5, CSS3, Vanilla JS, Bootstrap 5, Chart.js, Font Awesome
- **Frontend (Modern):** Next.js 14, React 18, Tailwind CSS
- **Backend:** Node.js, Express, SQLite, JWT, bcrypt
- **Deploy:** GitHub Pages / Netlify / Vercel / any Node host for API

---

**GREBY** — Everything You Need, Anywhere You Are.
