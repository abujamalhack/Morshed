import axios from 'axios';

// تكوين axios الأساسي
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// طلب interceptors لإضافة التوكن
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// رد interceptors للتعامل مع الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// خدمات المصادقة
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  }
};

// خدمات المنتجات
export const productsAPI = {
  getProducts: async (category = null) => {
    const url = category ? `/products?category=${category}` : '/products';
    const response = await api.get(url);
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  }
};

// خدمات الطلبات
export const ordersAPI = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getDeliveryStatus: async (deliveryId) => {
    const response = await api.get(`/orders/delivery/${deliveryId}`);
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  }
};

// خدمات الدفع
export const paymentAPI = {
  initiatePayment: async (paymentData) => {
    const response = await api.post('/payment/initiate', paymentData);
    return response.data;
  },

  verifyPayment: async (paymentId) => {
    const response = await api.get(`/payment/verify/${paymentId}`);
    return response.data;
  },

  getPaymentMethods: async () => {
    const response = await api.get('/payment/methods');
    return response.data;
  }
};

// خدمات المحفظة
export const walletAPI = {
  getBalance: async () => {
    const response = await api.get('/wallet/balance');
    return response.data;
  },

  getTransactions: async (page = 1) => {
    const response = await api.get(`/wallet/transactions?page=${page}`);
    return response.data;
  },

  deposit: async (amount, method) => {
    const response = await api.post('/wallet/deposit', { amount, method });
    return response.data;
  },

  withdraw: async (amount) => {
    const response = await api.post('/wallet/withdraw', { amount });
    return response.data;
  }
};

// خدمات الإشعارات
export const notificationsAPI = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }
};

export default api;
