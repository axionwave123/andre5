const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('greby_token');
}

export function setToken(token: string) {
  localStorage.setItem('greby_token', token);
}

export function clearToken() {
  localStorage.removeItem('greby_token');
  localStorage.removeItem('greby_user');
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem('greby_user');
  return u ? JSON.parse(u) : null;
}

export function setUser(user: any) {
  localStorage.setItem('greby_user', JSON.stringify(user));
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data;
}

// Auth
export async function login(email: string, password: string) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  setUser(data.user);
  return data;
}

export async function register(payload: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: string;
  city?: string;
}) {
  const data = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setToken(data.token);
  setUser(data.user);
  return data;
}

export async function getMe() {
  return request('/api/auth/me');
}

// Listings
export async function getListings(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/listings${qs ? `?${qs}` : ''}`);
}

export async function getListing(id: string) {
  return request(`/api/listings/${id}`);
}

export async function createListing(payload: any) {
  return request('/api/listings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Orders
export async function placeOrder(items: any[], total: number, payment_method: string) {
  return request('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ items, total, payment_method }),
  });
}

export async function getOrders() {
  return request('/api/orders');
}

// Wishlist
export async function getWishlist() {
  return request('/api/wishlist');
}

export async function addToWishlist(listingId: string) {
  return request(`/api/wishlist/${listingId}`, { method: 'POST' });
}

export async function removeFromWishlist(listingId: string) {
  return request(`/api/wishlist/${listingId}`, { method: 'DELETE' });
}

// Dashboards
export async function getSellerDashboard() {
  return request('/api/dashboard/seller');
}

export async function getAdminDashboard() {
  return request('/api/dashboard/admin');
}

export async function getPromoterDashboard() {
  return request('/api/dashboard/promoter');
}

export async function healthCheck() {
  return request('/api/health');
}
