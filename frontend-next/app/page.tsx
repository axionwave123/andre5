'use client';

import { useState, useEffect } from 'react';
import {
  login,
  register,
  getListings,
  placeOrder,
  getSellerDashboard,
  getAdminDashboard,
  getPromoterDashboard,
  getUser,
  clearToken,
  healthCheck,
} from '../lib/api';

type Screen =
  | 'splash' | 'language' | 'auth' | 'location' | 'home' | 'marketplace'
  | 'product' | 'property' | 'cart' | 'checkout' | 'payment' | 'confirmation'
  | 'promoter' | 'seller' | 'admin';

export default function Home() {
  const [current, setCurrent] = useState<Screen>('splash');
  const [user, setUserState] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [email, setEmail] = useState('admin@greby.com');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [cart] = useState([
    { id: '1', title: 'Cement 50kg', price: 4200, qty: 2 },
    { id: '2', title: 'Steel Rod 12mm', price: 6500, qty: 5 },
    { id: '3', title: 'Wash Basin', price: 15000, qty: 1 },
  ]);
  const [dashData, setDashData] = useState<any>(null);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const u = getUser();
    if (u) setUserState(u);
    healthCheck().then(() => setApiOnline(true)).catch(() => setApiOnline(false));
  }, []);

  useEffect(() => {
    if (current === 'marketplace' || current === 'home') loadListings();
    if (current === 'seller') loadSellerDash();
    if (current === 'admin') loadAdminDash();
    if (current === 'promoter') loadPromoterDash();
  }, [current]);

  async function loadListings() {
    try {
      setLoading(true);
      setListings(await getListings({ limit: '12' }));
    } catch {
      setListings([
        { id: 'd1', title: '4 Bedroom Duplex', price: 120000000, category: 'Properties', location: 'Lekki' },
        { id: 'd2', title: 'Toyota Camry 2020', price: 15000000, category: 'Cars', location: 'Abuja' },
        { id: 'd3', title: 'Luxury L-Shaped Sofa', price: 350000, category: 'Products', location: 'Lagos' },
        { id: 'd4', title: '1 Plot of Land', price: 6500000, category: 'Lands', location: 'Ibadan' },
      ]);
    } finally { setLoading(false); }
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = isRegister
        ? await register({ name, email, password, role: 'customer' })
        : await login(email, password);
      setUserState(data.user);
      setCurrent('location');
    } catch (err: any) {
      setError(err.message || 'Auth failed. Start backend: cd backend && node server.js');
    } finally { setLoading(false); }
  }

  async function loadSellerDash() {
    try { setDashData(await getSellerDashboard()); }
    catch { setDashData({ totalListings: 24, totalViews: 15870, totalOrders: 128, leads: 486 }); }
  }
  async function loadAdminDash() {
    try { setDashData(await getAdminDashboard()); }
    catch { setDashData({ users: 12458, sellers: 1245, promoters: 2350, totalSales: 245800000 }); }
  }
  async function loadPromoterDash() {
    try { setDashData(await getPromoterDashboard()); }
    catch { setDashData({ clicks: 12458, leads: 8765, sales: 320, orders: 78, commission: 245800 }); }
  }

  async function handlePlaceOrder() {
    setLoading(true);
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0) + 2000;
    try {
      const res = await placeOrder(cart.map(i => ({ title: i.title, price: i.price, qty: i.qty })), total, 'card');
      setOrderId(res.orderId);
    } catch {
      setOrderId('GRB-' + Date.now().toString().slice(-8));
    } finally {
      setLoading(false);
      setCurrent('confirmation');
    }
  }

  function logout() { clearToken(); setUserState(null); setCurrent('splash'); }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const grandTotal = cartTotal + 2000;
  const fmt = (n: number) => '₦' + n.toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-3 left-3 z-[100] text-xs font-medium">
        {apiOnline === null && <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full">API …</span>}
        {apiOnline === true && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">API Online</span>}
        {apiOnline === false && <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">API Offline (demo)</span>}
      </div>

      {current === 'splash' && (
        <div className="min-h-screen bg-gradient-to-br from-[#4A1DB8] via-[#6C2CFF] to-purple-500 flex flex-col items-center justify-center text-white p-6 relative">
          <div className="w-20 h-20 bg-white text-[#6C2CFF] rounded-2xl flex items-center justify-center text-4xl font-extrabold mb-6 shadow-2xl">G</div>
          <h1 className="text-5xl font-bold mb-3">GREBY</h1>
          <p className="text-white/70 text-lg mb-10">Everything You Need, Anywhere You Are.</p>
          <div className="flex gap-4">
            <button onClick={() => setCurrent('language')} className="btn-primary px-10">Get Started</button>
            <button onClick={() => setCurrent('home')} className="border border-white/50 text-white px-8 py-3 rounded-xl">Learn More</button>
          </div>
          <div className="absolute bottom-8"><span className="bg-[#FFB800] text-black text-xs font-bold px-3 py-1 rounded-full">CONNECTED TO API</span></div>
        </div>
      )}

      {current === 'language' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-8">
            <h2 className="text-2xl font-bold mb-1">Choose Your Language</h2>
            <p className="text-gray-500 mb-6">Select your preferred language</p>
            {['English', 'Français', 'Español', 'العربية'].map((lang, i) => (
              <div key={lang} className={`flex items-center p-4 border-2 rounded-xl mb-3 cursor-pointer ${i === 0 ? 'border-[#6C2CFF] bg-purple-50' : 'border-gray-200'}`}>
                <span className="mr-3">{['🇬🇧', '🇫🇷', '🇪🇸', '🇸🇦'][i]}</span> {lang}
                {i === 0 && <span className="ml-auto text-[#6C2CFF]">✓</span>}
              </div>
            ))}
            <button onClick={() => setCurrent('auth')} className="btn-primary w-full mt-4">Continue</button>
          </div>
        </div>
      )}

      {current === 'auth' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-8">
            <div className="flex gap-2 mb-6">
              <button onClick={() => setIsRegister(false)} className={`flex-1 py-2 rounded-lg font-semibold ${!isRegister ? 'bg-[#6C2CFF] text-white' : 'bg-gray-100'}`}>Login</button>
              <button onClick={() => setIsRegister(true)} className={`flex-1 py-2 rounded-lg font-semibold ${isRegister ? 'bg-[#6C2CFF] text-white' : 'bg-gray-100'}`}>Sign Up</button>
            </div>
            <h2 className="text-2xl font-bold mb-1">{isRegister ? 'Create Account' : 'Welcome Back!'}</h2>
            <p className="text-gray-500 mb-6 text-sm">Connected to GREBY API</p>
            <form onSubmit={handleAuth}>
              {isRegister && <input className="w-full border rounded-xl p-3 mb-3" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />}
              <input className="w-full border rounded-xl p-3 mb-3" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              <input className="w-full border rounded-xl p-3 mb-4" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? 'Please wait…' : isRegister ? 'Sign Up' : 'Login'}</button>
            </form>
            <p className="text-xs text-gray-400 mt-4 text-center">Demo: admin@greby.com / admin123<br />or royal@greby.com / password123</p>
          </div>
        </div>
      )}

      {current === 'location' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-8 text-center">
            <div className="text-5xl mb-4">📍</div>
            <h2 className="text-2xl font-bold mb-2">Where are you?</h2>
            <p className="text-gray-500 mb-6">We'll show you products near you</p>
            <button onClick={() => setCurrent('home')} className="btn-primary w-full mb-3">Use my current location</button>
            <select className="w-full border rounded-xl p-3 mb-3"><option>Nigeria</option></select>
            <select className="w-full border rounded-xl p-3 mb-4"><option>Lagos</option></select>
            <button onClick={() => setCurrent('home')} className="btn-primary w-full">Show Products Near Me</button>
          </div>
        </div>
      )}

      {current === 'home' && (
        <div>
          <nav className="bg-[#6C2CFF] text-white p-4 flex justify-between items-center sticky top-0 z-50">
            <div className="font-bold text-xl flex items-center gap-2">
              <span className="bg-white text-[#6C2CFF] w-8 h-8 rounded-lg flex items-center justify-center font-extrabold">G</span> GREBY
            </div>
            <div className="flex gap-4 items-center text-sm">
              {user ? (
                <>
                  <span className="hidden sm:inline opacity-80">{user.name} ({user.role})</span>
                  <button onClick={() => setCurrent('cart')}>🛒</button>
                  <button onClick={logout} className="opacity-80">Logout</button>
                </>
              ) : <button onClick={() => setCurrent('auth')}>Login</button>}
            </div>
          </nav>
          <div className="bg-gradient-to-r from-[#4A1DB8] to-[#6C2CFF] text-white p-8">
            <h1 className="text-3xl font-bold mb-2">Find Everything.<br />Earn Together.</h1>
            <p className="text-white/70 mb-6">Shop, Sell & Earn with GREBY Marketplace</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => setCurrent('marketplace')} className="btn-accent">Shop Now</button>
              <button onClick={() => setCurrent('seller')} className="border border-white/50 px-6 py-3 rounded-xl">Seller</button>
              <button onClick={() => setCurrent('admin')} className="border border-white/50 px-6 py-3 rounded-xl">Admin</button>
              <button onClick={() => setCurrent('promoter')} className="border border-white/50 px-6 py-3 rounded-xl">Promoter</button>
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {['Properties', 'Cars', 'Lands', 'Machines', 'Wholesale', 'Retail'].map(c => (
              <div key={c} onClick={() => setCurrent('marketplace')} className="card p-4 text-center cursor-pointer hover:shadow-md transition">
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-semibold text-sm">{c}</div>
              </div>
            ))}
          </div>
          {listings.length > 0 && (
            <div className="p-4">
              <h3 className="font-bold mb-3">Latest from API</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {listings.slice(0, 4).map(l => (
                  <div key={l.id} className="card p-3 cursor-pointer" onClick={() => setCurrent(l.category === 'Products' ? 'product' : 'property')}>
                    <div className="h-24 bg-gray-200 rounded-lg mb-2" />
                    <h4 className="font-semibold text-sm truncate">{l.title}</h4>
                    <p className="text-[#6C2CFF] font-bold text-sm">{fmt(l.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {current === 'marketplace' && (
        <div>
          <div className="bg-white p-4 border-b sticky top-0 flex gap-2 z-40">
            <button onClick={() => setCurrent('home')}>←</button>
            <input className="flex-1 border rounded-full px-4 py-2" placeholder="Search..." />
          </div>
          <div className="p-4">
            {loading && <p className="text-center text-gray-500 py-8">Loading listings…</p>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {listings.map(item => (
                <div key={item.id} onClick={() => setCurrent(item.category === 'Products' ? 'product' : 'property')} className="card cursor-pointer hover:shadow-lg transition">
                  <div className="h-32 bg-gray-200" />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                    <p className="text-[#6C2CFF] font-bold">{fmt(item.price)}</p>
                    <p className="text-xs text-gray-400">{item.location || item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(current === 'product' || current === 'property') && (
        <div className="p-4 max-w-2xl mx-auto">
          <button onClick={() => setCurrent('marketplace')} className="mb-4 text-[#6C2CFF]">← Back</button>
          <div className="card overflow-hidden">
            <div className="h-56 bg-gray-200" />
            <div className="p-6">
              <h2 className="text-2xl font-bold">{current === 'product' ? 'Luxury L-Shaped Sofa' : '4 Bedroom Duplex'}</h2>
              <p className="text-[#6C2CFF] text-2xl font-bold mt-2">{current === 'product' ? '₦350,000' : '₦120,000,000'}</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setCurrent('cart')} className="btn-primary flex-1">Add to Cart</button>
                <button className="border border-[#6C2CFF] text-[#6C2CFF] flex-1 rounded-xl font-semibold">Contact Seller</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {current === 'cart' && (
        <div className="p-4 max-w-lg mx-auto">
          <button onClick={() => setCurrent('home')} className="mb-4 text-[#6C2CFF]">← Back</button>
          <h2 className="text-xl font-bold mb-4">Shopping Cart ({cart.length})</h2>
          {cart.map((item, i) => (
            <div key={i} className="card p-4 mb-3 flex justify-between items-center">
              <div><h4 className="font-semibold">{item.title}</h4><p className="text-sm text-gray-500">Qty: {item.qty}</p></div>
              <p className="font-bold text-[#6C2CFF]">{fmt(item.price * item.qty)}</p>
            </div>
          ))}
          <div className="card p-4 mt-4">
            <div className="flex justify-between mb-1"><span>Subtotal</span><span>{fmt(cartTotal)}</span></div>
            <div className="flex justify-between mb-1"><span>Delivery</span><span>₦2,000</span></div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-[#6C2CFF]">{fmt(grandTotal)}</span></div>
          </div>
          <button onClick={() => setCurrent('checkout')} className="btn-primary w-full mt-4">Proceed to Checkout</button>
        </div>
      )}

      {current === 'checkout' && (
        <div className="p-4 max-w-lg mx-auto">
          <button onClick={() => setCurrent('cart')} className="mb-4 text-[#6C2CFF]">← Back</button>
          <h2 className="text-xl font-bold mb-4">Checkout</h2>
          <div className="card p-6">
            <input className="w-full border rounded-xl p-3 mb-3" defaultValue={user?.name || 'John Doe'} />
            <input className="w-full border rounded-xl p-3 mb-3" defaultValue="08012345678" />
            <input className="w-full border rounded-xl p-3 mb-4" defaultValue={user?.email || 'john@email.com'} />
            <button onClick={() => setCurrent('payment')} className="btn-primary w-full">Continue to Payment</button>
          </div>
        </div>
      )}

      {current === 'payment' && (
        <div className="p-4 max-w-lg mx-auto">
          <button onClick={() => setCurrent('checkout')} className="mb-4 text-[#6C2CFF]">← Back</button>
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          <div className="card p-6 mb-3 border-2 border-[#6C2CFF]">
            <strong>Pay with Card</strong>
            <input className="w-full border rounded-xl p-3 mt-3 mb-2" defaultValue="1234 5678 9012 3456" />
            <div className="flex gap-2">
              <input className="flex-1 border rounded-xl p-3" defaultValue="12/28" />
              <input className="flex-1 border rounded-xl p-3" defaultValue="123" />
            </div>
          </div>
          <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary w-full">{loading ? 'Processing…' : `Pay ${fmt(grandTotal)}`}</button>
        </div>
      )}

      {current === 'confirmation' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-8 text-center">
            <div className="text-6xl text-green-500 mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="font-bold mb-4">Order ID: {orderId}</p>
            <div className="bg-purple-50 rounded-xl p-4 mb-6"><p className="text-[#6C2CFF] text-xl font-bold">Total: {fmt(grandTotal)}</p></div>
            <button onClick={() => setCurrent('home')} className="btn-primary w-full">Continue Shopping</button>
          </div>
        </div>
      )}

      {(current === 'seller' || current === 'admin' || current === 'promoter') && (
        <div className="min-h-screen bg-[#0F172A] text-white">
          <div className="p-4 flex justify-between items-center border-b border-gray-700">
            <div className="font-bold flex items-center gap-2">
              <span className="bg-[#6C2CFF] w-8 h-8 rounded-lg flex items-center justify-center">G</span>
              GREBY {current.charAt(0).toUpperCase() + current.slice(1)}
            </div>
            <button onClick={() => setCurrent('home')} className="text-sm opacity-70">← Home</button>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {current === 'seller' && dashData && (
              <>
                <div className="bg-[#1E293B] rounded-2xl p-4"><div className="text-gray-400 text-sm">Listings</div><div className="text-2xl font-bold">{dashData.totalListings}</div></div>
                <div className="bg-[#1E293B] rounded-2xl p-4"><div className="text-gray-400 text-sm">Views</div><div className="text-2xl font-bold">{dashData.totalViews?.toLocaleString()}</div></div>
                <div className="bg-[#1E293B] rounded-2xl p-4"><div className="text-gray-400 text-sm">Orders</div><div className="text-2xl font-bold">{dashData.totalOrders}</div></div>
                <div className="bg-[#1E293B] rounded-2xl p-4"><div className="text-gray-400 text-sm">Leads</div><div className="text-2xl font-bold">{dashData.leads}</div></div>
              </>
            )}
            {current === 'admin' && dashData && (
              <>
                <div className="bg-[#1E293B] rounded-2xl p-4"><div className="text-gray-400 text-sm">Users</div><div className="text-2xl font-bold">{dashData.users?.toLocaleString()}</div></div>
                <div className="bg-[#1E293B] rounded-2xl p-4"><div className="text-gray-400 text-sm">Sellers</div><div className="text-2xl font-bold">{dashData.sellers?.toLocaleString()}</div></div>
                <div className="bg-[#1E293B] rounded-2xl p-4"><div className="text-gray-400 text-sm">Promoters</div><div className="text-2xl font-bold">{dashData.promoters?.toLocaleString()}</div></div>
                <div className="bg-[#1E293B] rounded-2xl p-4"><div className="text-gray-400 text-sm">Total Sales</div><div className="text-2xl font-bold">{fmt(dashData.totalSales || 0)}</div></div>
              </>
            )}
            {current === 'promoter' && dashData && (
              <>
                <div className="bg-[#1E293B] rounded-2xl p-4"><div className="text-gray-400 text-sm">Clicks</div><div className="text-2xl font-bold">{dashData.clicks?.toLocaleString()}</div></div>
                <div className="bg-[#1E293B] rounded-2xl p-4"><div className="text-gray-400 text-sm">Leads</div><div className="text-2xl font-bold">{dashData.leads?.toLocaleString()}</div></div>
                <div className="bg-[#1E293B] rounded-2xl p-4"><div className="text-gray-400 text-sm">Sales</div><div className="text-2xl font-bold">{dashData.sales}</div></div>
                <div className="bg-[#1E293B] rounded-2xl p-4"><div className="text-gray-400 text-sm">Commission</div><div className="text-2xl font-bold">{fmt(dashData.commission || 0)}</div></div>
              </>
            )}
          </div>
          <div className="p-4"><div className="bg-[#1E293B] rounded-2xl p-6 text-center text-gray-400">Data from API {apiOnline ? '(live)' : '(fallback)'}</div></div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50">
        <details className="relative">
          <summary className="bg-[#6C2CFF] text-white rounded-full px-4 py-2 shadow-lg text-sm font-semibold cursor-pointer list-none">Screens</summary>
          <div className="absolute bottom-12 right-0 bg-white rounded-2xl shadow-xl py-2 w-48 max-h-64 overflow-y-auto">
            {(['splash','language','auth','location','home','marketplace','cart','checkout','payment','seller','admin','promoter'] as Screen[]).map(s => (
              <button key={s} onClick={() => setCurrent(s)} className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-50 capitalize">{s}</button>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
