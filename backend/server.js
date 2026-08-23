/**
 * GREBY Marketplace Backend
 * Node.js + Express + SQLite
 * Roles: customer, seller, promoter, admin
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'greby-super-secret-change-in-production';

app.use(cors());
app.use(express.json());

// Database
const dbPath = path.join(__dirname, 'greby.db');
const db = new sqlite3.Database(dbPath);

// Init tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    city TEXT,
    country TEXT DEFAULT 'Nigeria',
    verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    location TEXT,
    images TEXT,
    status TEXT DEFAULT 'active',
    featured INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS wishlists (
    user_id TEXT,
    listing_id TEXT,
    PRIMARY KEY (user_id, listing_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    listing_id TEXT,
    user_id TEXT,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed admin if not exists
  db.get("SELECT id FROM users WHERE email = ?", ['admin@greby.com'], (err, row) => {
    if (!row) {
      const hash = bcrypt.hashSync('admin123', 10);
      db.run(`INSERT INTO users (id, name, email, password, role, verified) VALUES (?, ?, ?, ?, ?, 1)`,
        [uuidv4(), 'GREBY Admin', 'admin@greby.com', hash, 'admin']);
      console.log('Seeded admin@greby.com / admin123');
    }
  });
});

// Auth middleware
function auth(requiredRoles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'No token' });
    try {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

// ============ AUTH ============
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password, role = 'customer', city } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const hash = await bcrypt.hash(password, 10);
  const id = uuidv4();
  db.run(
    `INSERT INTO users (id, name, email, phone, password, role, city) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, name, email, phone, hash, role, city],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      const token = jwt.sign({ id, email, role, name }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ token, user: { id, name, email, role } });
    }
  );
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, city: user.city } });
  });
});

app.get('/api/auth/me', auth(), (req, res) => {
  db.get(`SELECT id, name, email, phone, role, city, country, verified FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

// ============ LISTINGS ============
app.get('/api/listings', (req, res) => {
  const { category, location, q, limit = 20, offset = 0 } = req.query;
  let sql = `SELECT l.*, u.name as seller_name, u.verified as seller_verified FROM listings l JOIN users u ON l.seller_id = u.id WHERE l.status = 'active'`;
  const params = [];
  if (category) { sql += ` AND l.category = ?`; params.push(category); }
  if (location) { sql += ` AND l.location LIKE ?`; params.push(`%${location}%`); }
  if (q) { sql += ` AND (l.title LIKE ? OR l.description LIKE ?)`; params.push(`%${q}%`, `%${q}%`); }
  sql += ` ORDER BY l.featured DESC, l.created_at DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({ ...r, images: r.images ? JSON.parse(r.images) : [] })));
  });
});

app.get('/api/listings/:id', (req, res) => {
  db.get(`SELECT l.*, u.name as seller_name, u.verified as seller_verified, u.phone as seller_phone 
          FROM listings l JOIN users u ON l.seller_id = u.id WHERE l.id = ?`, [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Not found' });
    db.run(`UPDATE listings SET views = views + 1 WHERE id = ?`, [req.params.id]);
    res.json({ ...row, images: row.images ? JSON.parse(row.images) : [] });
  });
});

app.post('/api/listings', auth(['seller', 'admin']), (req, res) => {
  const { title, description, category, price, location, images } = req.body;
  const id = uuidv4();
  db.run(
    `INSERT INTO listings (id, seller_id, title, description, category, price, location, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, req.user.id, title, description, category, price, location, JSON.stringify(images || [])],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id, message: 'Listing created' });
    }
  );
});

// ============ ORDERS / CART ============
app.post('/api/orders', auth(), (req, res) => {
  const { items, total, payment_method } = req.body;
  const id = 'GRB-' + Date.now().toString().slice(-8);
  db.run(
    `INSERT INTO orders (id, user_id, items, total, payment_method, status) VALUES (?, ?, ?, ?, ?, 'confirmed')`,
    [id, req.user.id, JSON.stringify(items), total, payment_method],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ orderId: id, message: 'Order placed successfully', total });
    }
  );
});

app.get('/api/orders', auth(), (req, res) => {
  db.all(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({ ...r, items: JSON.parse(r.items) })));
  });
});

// ============ WISHLIST ============
app.get('/api/wishlist', auth(), (req, res) => {
  db.all(`SELECT l.* FROM wishlists w JOIN listings l ON w.listing_id = l.id WHERE w.user_id = ?`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/wishlist/:listingId', auth(), (req, res) => {
  db.run(`INSERT OR IGNORE INTO wishlists (user_id, listing_id) VALUES (?, ?)`, [req.user.id, req.params.listingId], (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Added to wishlist' });
  });
});

app.delete('/api/wishlist/:listingId', auth(), (req, res) => {
  db.run(`DELETE FROM wishlists WHERE user_id = ? AND listing_id = ?`, [req.user.id, req.params.listingId], (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Removed' });
  });
});

// ============ DASHBOARDS ============
app.get('/api/dashboard/seller', auth(['seller', 'admin']), (req, res) => {
  const sellerId = req.user.role === 'admin' ? req.query.sellerId || req.user.id : req.user.id;
  db.get(`SELECT COUNT(*) as total_listings FROM listings WHERE seller_id = ?`, [sellerId], (err, listings) => {
    db.get(`SELECT SUM(views) as total_views FROM listings WHERE seller_id = ?`, [sellerId], (err2, views) => {
      db.get(`SELECT COUNT(*) as total_orders FROM orders`, [], (err3, orders) => {
        res.json({
          totalListings: listings?.total_listings || 0,
          totalViews: views?.total_views || 0,
          totalOrders: orders?.total_orders || 0,
          leads: Math.floor(Math.random() * 500)
        });
      });
    });
  });
});

app.get('/api/dashboard/admin', auth(['admin']), (req, res) => {
  db.get(`SELECT COUNT(*) as users FROM users`, [], (e1, u) => {
    db.get(`SELECT COUNT(*) as sellers FROM users WHERE role = 'seller'`, [], (e2, s) => {
      db.get(`SELECT COUNT(*) as promoters FROM users WHERE role = 'promoter'`, [], (e3, p) => {
        db.get(`SELECT SUM(total) as sales FROM orders`, [], (e4, o) => {
          res.json({
            users: u?.users || 0,
            sellers: s?.sellers || 0,
            promoters: p?.promoters || 0,
            totalSales: o?.sales || 0
          });
        });
      });
    });
  });
});

app.get('/api/dashboard/promoter', auth(['promoter', 'admin']), (req, res) => {
  res.json({
    clicks: 12458,
    leads: 8765,
    sales: 320,
    orders: 78,
    commission: 245800
  });
});

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'GREBY API' }));

app.listen(PORT, () => {
  console.log(`GREBY API running on http://localhost:${PORT}`);
});
