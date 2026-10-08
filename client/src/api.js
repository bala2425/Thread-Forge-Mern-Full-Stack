const API = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('threadforge-token');
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '', ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  getProducts: params => request(`/products${params ? `?${new URLSearchParams(params)}` : ''}`),
  getProduct: id => request(`/products/${id}`),
  register: body => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: body => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  placeOrder: body => request('/orders/place', { method: 'POST', body: JSON.stringify(body) }),
  getOrders: () => request('/orders'),
  createPaymentSession: body => request('/payments/create-session', { method: 'POST', body: JSON.stringify(body) }),
  uploadImage: file => {
    const token = localStorage.getItem('threadforge-token');
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API}/uploads`, { method: 'POST', headers: { Authorization: token ? `Bearer ${token}` : '' }, body: formData }).then(async response => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      return data;
    });
  },
  getAdminOrders: () => request('/admin/orders'),
  getAdminCustomers: () => request('/admin/customers'),
  getAdminInventory: () => request('/admin/inventory'),
  getDashboard: () => request('/admin/dashboard'),
  getProfile: () => request('/profile'),
  saveProfile: body => request('/profile/profile', { method: 'PUT', body: JSON.stringify(body) }),
  addAddress: body => request('/profile/addresses', { method: 'PUT', body: JSON.stringify(body) }),
  getCoupons: () => request('/coupons'),
  getBanners: () => request('/banners'),
  updateOrderStatus: (id, status) => request(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  createDesign: body => request('/designs', { method: 'POST', body: JSON.stringify(body) }),
  saveDesign: body => request('/designs', { method: 'POST', body: JSON.stringify(body) })
};
