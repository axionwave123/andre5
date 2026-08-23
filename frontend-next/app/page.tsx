'use client';

import { useState } from 'react';

const screens = [
  { id: 'splash', name: '01 Splash' },
  { id: 'language', name: '02 Language' },
  { id: 'auth', name: '03 Login / Signup' },
  { id: 'location', name: '04 Location' },
  { id: 'home', name: '05 Home' },
  { id: 'marketplace', name: '07 Marketplace' },
  { id: 'product', name: '08 Product Details' },
  { id: 'property', name: '09 Property Details' },
  { id: 'cart', name: '14 Cart' },
  { id: 'checkout', name: '15-17 Checkout Flow' },
  { id: 'promoter', name: '18 Promoter Dashboard' },
  { id: 'seller', name: '19 Seller Dashboard' },
  { id: 'admin', name: '20 Admin Dashboard' },
];

export default function Home() {
  const [current, setCurrent] = useState('splash');

  return (
    <div className="min-h-screen">
      {current === 'splash' && (
        <div className="min-h-screen bg-gradient-to-br from-[#4A1DB8] via-[#6C2CFF] to-purple-500 flex flex-col items-center justify-center text-white p-6">
          <div className="w-20 h-20 bg-white text-[#6C2CFF] rounded-2xl flex items-center justify-center text-4xl font-extrabold mb-6 shadow-2xl">G</div>
          <h1 className="text-5xl font-bold mb-3">GREBY</h1>
          <p className="text-white/70 text-lg mb-10">Everything You Need, Anywhere You Are.</p>
          <div className="flex gap-6 mb-12 flex-wrap justify-center">
            {['Properties', 'Cars', 'Lands', 'Machines', 'Products'].map(c => (
              <div key={c} className="flex flex-col items-center">
                <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-2 text-xl">🏠</div>
                <span className="text-sm">{c}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={() => setCurrent('language')} className="btn-primary px-10">Get Started</button>
            <button onClick={() => setCurrent('home')} className="border border-white/50 text-white px-8 py-3 rounded-xl">Learn More</button>
          </div>
          <div className="absolute bottom-8">
            <span className="bg-[#FFB800] text-black text-xs font-bold px-3 py-1 rounded-full">20 SCREENS • NEXT.JS VERSION</span>
          </div>
        </div>
      )}

      {current === 'language' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-8">
            <h2 className="text-2xl font-bold mb-1">Choose Your Language</h2>
            <p className="text-gray-500 mb-6">Select your preferred language</p>
            {['English', 'Français', 'Español', 'العربية'].map((lang, i) => (
              <div key={lang} className={`flex items-center p-4 border-2 rounded-xl mb-3 cursor-pointer ${i===0 ? 'border-[#6C2CFF] bg-purple-50' : 'border-gray-200'}`}>
                <span className="mr-3">{['🇬🇧','🇫🇷','🇪🇸','🇸🇦'][i]}</span> {lang}
                {i===0 && <span className="ml-auto text-[#6C2CFF]">✓</span>}
              </div>
            ))}
            <button onClick={() => setCurrent('auth')} className="btn-primary w-full mt-4">Continue</button>
          </div>
        </div>
      )}

      {current === 'auth' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-8">
            <h2 className="text-2xl font-bold mb-1">Welcome Back!</h2>
            <p className="text-gray-500 mb-6">Login to your GREBY account</p>
            <input className="w-full border rounded-xl p-3 mb-3" placeholder="Email or Phone" />
            <input type="password" className="w-full border rounded-xl p-3 mb-4" placeholder="Password" />
            <button onClick={() => setCurrent('location')} className="btn-primary w-full">Login</button>
            <p className="text-center text-sm text-gray-500 mt-4">or continue with Google / Apple</p>
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
              <span className="bg-white text-[#6C2CFF] w-8 h-8 rounded-lg flex items-center justify-center font-extrabold">G</span>
              GREBY
            </div>
            <div className="flex gap-4 text-xl">
              <button onClick={() => setCurrent('cart')}>🛒</button>
              <button>👤</button>
            </div>
          </nav>
          <div className="bg-gradient-to-r from-[#4A1DB8] to-[#6C2CFF] text-white p-8">
            <h1 className="text-3xl font-bold mb-2">Find Everything.<br/>Earn Together.</h1>
            <p className="text-white/70 mb-6">Shop, Sell & Earn with GREBY Marketplace</p>
            <div className="flex gap-3">
              <button onClick={() => setCurrent('marketplace')} className="btn-accent">Shop Now</button>
              <button onClick={() => setCurrent('seller')} className="border border-white/50 px-6 py-3 rounded-xl">Become a Seller</button>
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {['Properties','Cars','Lands','Machines','Wholesale','Retail'].map(c => (
              <div key={c} onClick={() => setCurrent('marketplace')} className="card p-4 text-center cursor-pointer hover:shadow-md transition">
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-semibold text-sm">{c}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {current === 'marketplace' && (
        <div>
          <div className="bg-white p-4 border-b sticky top-0 flex gap-2">
            <button onClick={() => setCurrent('home')}>←</button>
            <input className="flex-1 border rounded-full px-4 py-2" placeholder="Search products, properties, cars..." />
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {t:'4 Bedroom Duplex',p:'₦120,000,000'},
              {t:'Toyota Camry 2020',p:'₦15,000,000'},
              {t:'Luxury Sofa',p:'₦350,000'},
              {t:'1 Plot of Land',p:'₦6,500,000'},
            ].map((item,i) => (
              <div key={i} onClick={() => setCurrent(i===2?'product':'property')} className="card cursor-pointer hover:shadow-lg transition">
                <div className="h-32 bg-gray-200"></div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm">{item.t}</h3>
                  <p className="text-[#6C2CFF] font-bold">{item.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {['product','property','cart','promoter','seller','admin','checkout'].includes(current) && (
        <div className="p-6 max-w-2xl mx-auto">
          <button onClick={() => setCurrent('home')} className="mb-4 text-[#6C2CFF]">← Back to Home</button>
          <div className="card p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 capitalize">{current} Screen</h2>
            <p className="text-gray-500 mb-6">This is the Next.js version of the {current} interface. Full interactive components can be expanded here.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {screens.map(s => (
                <button key={s.id} onClick={() => setCurrent(s.id)} className="text-sm px-3 py-1 rounded-full border hover:bg-purple-50">
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-[#6C2CFF] text-white rounded-full px-4 py-2 shadow-lg text-sm font-semibold cursor-pointer">
          Screens ▾
        </div>
      </div>
    </div>
  );
}
