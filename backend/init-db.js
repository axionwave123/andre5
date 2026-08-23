/**
 * Seed sample data for GREBY
 */
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'greby.db'));

const sellers = [
  { name: 'Royal Homes Ltd', email: 'royal@greby.com', role: 'seller' },
  { name: 'Comfort Furnitures', email: 'comfort@greby.com', role: 'seller' },
  { name: 'AutoMax Lagos', email: 'automax@greby.com', role: 'seller' }
];

const listings = [
  { title: '4 Bedroom Duplex', category: 'Properties', price: 120000000, location: 'Lekki, Lagos', desc: 'Beautiful modern duplex' },
  { title: 'Toyota Camry 2020', category: 'Cars', price: 15000000, location: 'Abuja', desc: 'Clean Tokunbo' },
  { title: '2 Acres of Land', category: 'Lands', price: 45000000, location: 'Ibadan', desc: 'Dry land with C of O' },
  { title: 'Industrial Generator', category: 'Machines', price: 12500000, location: 'Lagos', desc: '50KVA diesel' },
  { title: 'Luxury L-Shaped Sofa', category: 'Products', price: 350000, location: 'Lagos', desc: 'Premium quality' },
  { title: '1 Plot of Land', category: 'Lands', price: 6500000, location: 'Ibadan', desc: 'Residential plot' },
  { title: 'Toyota RAV4 2019', category: 'Cars', price: 12500000, location: 'Abuja', desc: 'Foreign used' },
  { title: '4 Bedroom Bungalow', category: 'Properties', price: 75000000, location: 'Lagos', desc: 'Fully finished' }
];

async function seed() {
  const hash = await bcrypt.hash('password123', 10);

  for (const s of sellers) {
    const id = uuidv4();
    await new Promise((resolve) => {
      db.run(`INSERT OR IGNORE INTO users (id, name, email, password, role, verified, city) VALUES (?, ?, ?, ?, ?, 1, 'Lagos')`,
        [id, s.name, s.email, hash, s.role], resolve);
    });
  }

  db.all(`SELECT id FROM users WHERE role = 'seller'`, [], (err, rows) => {
    if (err || !rows.length) return console.log('No sellers');
    listings.forEach((l, i) => {
      const seller = rows[i % rows.length];
      db.run(`INSERT INTO listings (id, seller_id, title, description, category, price, location, images, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), seller.id, l.title, l.desc, l.category, l.price, l.location, JSON.stringify([]), i < 3 ? 1 : 0]);
    });
    console.log('Seeded listings and sellers. Login with any seller email / password123');
    db.close();
  });
}

seed();
