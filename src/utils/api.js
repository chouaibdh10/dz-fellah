// API Service - Centralized API calls for DZ-Fellah
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Token management
const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

const setTokens = (access, refresh) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

const readResponseData = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return { data: await response.json(), isJson: true };
    } catch {
      // Fall through to text parsing
    }
  }
  const text = await response.text();
  return { data: text, isJson: false };
};

const buildNonJsonError = (response, text) => {
  const snippet = (text || '').slice(0, 200).replace(/\s+/g, ' ').trim();
  return new Error(
    `API invalide (${response.status}). Réponse non-JSON. ` +
    `Vérifiez que le backend Django tourne et que VITE_API_URL pointe vers lui. ` +
    (snippet ? `Aperçu: ${snippet}` : '')
  );
};

const normalizeWilayaCode = (value) => {
  if (value === undefined || value === null) return value;
  const trimmed = String(value).trim();
  if (trimmed === '') return trimmed;
  if (/^\d+$/.test(trimmed)) {
    return String(parseInt(trimmed, 10));
  }
  return trimmed;
};

const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

// Base fetch wrapper with auth
const apiFetch = async (endpoint, options = {}) => {
  const token = getAccessToken();
  
  const headers = {
    ...options.headers,
  };
  
  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 - try to refresh token
  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the request with new token
      headers['Authorization'] = `Bearer ${getAccessToken()}`;
      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } else {
      // Refresh failed, logout
      clearTokens();
      window.location.href = '/login';
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
  }

  return response;
};

// Refresh access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    const response = await fetch(`${API_BASE_URL}/users/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setTokens(data.access, data.refresh);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

// ==================== AUTH API ====================
export const authAPI = {
  // Login
  login: async (email, password) => {
    const response = await apiFetch('/users/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const { data, isJson } = await readResponseData(response);

    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);

      const detail = data?.detail || 'Erreur de connexion';
      // Backend resends verification email and returns 403 when email is not verified.
      if (response.status === 403 && String(detail).toLowerCase().includes('email non vérifié')) {
        const error = new Error(detail);
        error.code = 'EMAIL_NOT_VERIFIED';
        error.email = email;
        throw error;
      }

      throw new Error(detail);
    }
    
    setTokens(data.access, data.refresh);
    return data;
  },

  // Register Client
  registerClient: async (userData) => {
    const payload = { ...userData };
    if (Object.prototype.hasOwnProperty.call(payload, 'wilaya')) {
      payload.wilaya = normalizeWilayaCode(payload.wilaya);
    }
    const response = await apiFetch('/users/client-registration/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const { data, isJson } = await readResponseData(response);

    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || Object.values(data).flat().join(', ') || 'Erreur d\'inscription');
    }

    return data;
  },

  // Register Producer
  registerProducer: async (userData) => {
    const payload = { ...userData };
    if (Object.prototype.hasOwnProperty.call(payload, 'wilaya')) {
      payload.wilaya = normalizeWilayaCode(payload.wilaya);
    }
    const response = await apiFetch('/users/producer-registration/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const { data, isJson } = await readResponseData(response);

    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || Object.values(data).flat().join(', ') || 'Erreur d\'inscription');
    }

    return data;
  },

  // Verify email (uidb64 + token)
  verifyEmail: async (uidb64, token) => {
    const response = await apiFetch(`/users/verify-email/${encodeURIComponent(uidb64)}/${encodeURIComponent(token)}/`, {
      method: 'GET',
    });

    const { data, isJson } = await readResponseData(response);

    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.error || data.detail || 'Erreur de vérification email');
    }

    return data;
  },

  // Logout
  logout: async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      return;
    }
    try {
      // Backend expects refresh_token + Bearer access header
      const response = await apiFetch('/users/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      // We clear tokens client-side regardless; logout is best-effort.
      if (!response.ok) {
        const { data } = await readResponseData(response);
        if (response.status !== 400) {
          console.error('Logout failed:', response.status, data);
        }
      }
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      clearTokens();
    }
  },

  // Get current user profile
  getProfile: async () => {
    const response = await apiFetch('/users/profile/');

    const { data, isJson } = await readResponseData(response);

    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || 'Erreur de récupération du profil');
    }

    return data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const payload = { ...profileData };

    // Normalize wilaya codes ("09" -> "9")
    if (Object.prototype.hasOwnProperty.call(payload, 'wilaya')) {
      payload.wilaya = normalizeWilayaCode(payload.wilaya);
    }

    const hasBinaryFile = Object.values(payload).some(
      (v) => v instanceof File || v instanceof Blob
    );

    const body = hasBinaryFile
      ? (() => {
          const fd = new FormData();
          for (const [key, value] of Object.entries(payload)) {
            if (value === undefined) continue;
            // Allow null to clear fields
            if (value === null) {
              fd.append(key, '');
              continue;
            }
            fd.append(key, value);
          }
          return fd;
        })()
      : JSON.stringify(payload);

    const response = await apiFetch('/users/profile/', {
      method: 'PATCH',
      body,
    });

    const { data, isJson } = await readResponseData(response);

    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || 'Erreur de mise à jour du profil');
    }

    return data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await apiFetch('/users/password/forgot/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Erreur lors de l\'envoi');
    }
    
    return data;
  },

  // Reset password
  resetPassword: async (uidb64, token, password) => {
    const response = await apiFetch(`/users/password/reset/${uidb64}/${token}/`, {
      method: 'POST',
      body: JSON.stringify({ new_password: password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Erreur lors de la réinitialisation');
    }
    
    return data;
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    const response = await apiFetch('/users/password/change/', {
      method: 'POST',
      body: JSON.stringify({ 
        old_password: oldPassword, 
        new_password: newPassword 
      }),
    });

    const { data, isJson } = await readResponseData(response);

    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || 'Erreur lors du changement de mot de passe');
    }

    return data;
  },
};

// ==================== PRODUCTS API ====================
export const productsAPI = {
  // List all products
  listAll: async () => {
    const response = await apiFetch('/products/');

    const { data, isJson } = await readResponseData(response);

    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || 'Erreur de récupération des produits');
    }

    // Django paginated response: { count, next, previous, results }
    if (data && typeof data === 'object' && Array.isArray(data.results)) {
      return data.results;
    }

    return data;
  },

  // Search products
  search: async (query) => {
    const response = await apiFetch(`/products/search/?q=${encodeURIComponent(query)}`);

    const { data, isJson } = await readResponseData(response);

    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || 'Erreur de recherche');
    }

    if (data && typeof data === 'object' && Array.isArray(data.results)) {
      return data.results;
    }

    return data;
  },

  // Get product details
  getDetails: async (productId) => {
    const response = await apiFetch(`/products/${productId}/`);
    
    if (!response.ok) {
      throw new Error('Produit non trouvé');
    }
    
    return response.json();
  },

  // Add product (producer only)
  addProduct: async (productData) => {
    const isFormData = productData instanceof FormData;

    // Backend expects: unit_type (maps to sale_unit), and stock_quantity (maps to stock)
    // Producer UI often uses: sale_unit, stock, initial_*.
    let payload = productData;
    if (!isFormData && productData && typeof productData === 'object') {
      const unitType = productData.unit_type ?? productData.sale_unit;
      const stockQuantity = productData.stock_quantity ?? productData.stock;

      payload = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        unit_type: unitType,
        product_type: productData.product_type,
        category: productData.category,
        stock_quantity: stockQuantity,
        initial_harvest_date: productData.initial_harvest_date,
        initial_stock: productData.initial_stock,
        is_active: productData.is_active,
      };

      // ImageField requires multipart upload; ignore URL strings to avoid serializer errors.
      if (productData.photo instanceof File) {
        payload.photo = productData.photo;
      }
    }

    const response = await apiFetch('/products/add/', {
      method: 'POST',
      body: isFormData ? payload : JSON.stringify(payload),
    });

    const { data, isJson } = await readResponseData(response);

    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);

      // DRF serializer errors are often objects like: { field: ["msg"] }
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const entries = Object.entries(data);
        if (entries.length) {
          const firstFew = entries.slice(0, 3).map(([field, messages]) => {
            const msg = Array.isArray(messages) ? messages[0] : String(messages);
            return `${field}: ${msg}`;
          });
          throw new Error(firstFew.join(' | '));
        }
      }

      throw new Error(data.detail || data.error || 'Erreur lors de l\'ajout du produit');
    }

    return data;
  },

  // Add batch to product
  addBatch: async (productId, batchData) => {
    const response = await apiFetch(`/products/${productId}/add-batch/`, {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Erreur lors de l\'ajout du lot');
    }
    
    return data;
  },

  // List product batches
  listBatches: async (productId) => {
    const response = await apiFetch(`/products/${productId}/batches/`);
    
    if (!response.ok) {
      throw new Error('Erreur de récupération des lots');
    }
    
    return response.json();
  },

  // Update batch stock
  updateBatchStock: async (batchId, stock) => {
    const response = await apiFetch(`/products/batches/${batchId}/update-stock/`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Erreur de mise à jour du stock');
    }
    
    return data;
  },

  // Update dry product stock
  updateDryProductStock: async (productId, stock) => {
    const response = await apiFetch(`/products/${productId}/update-stock/`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Erreur de mise à jour du stock');
    }
    
    return data;
  },

  // Get anti-waste baskets
  getAntiWasteBaskets: async () => {
    const response = await apiFetch('/products/anti-waste/');
    
    if (!response.ok) {
      throw new Error('Erreur de récupération des paniers anti-gaspi');
    }
    
    return response.json();
  },

  // Dashboard APIs (producer)
  getDashboardOverview: async () => {
    const response = await apiFetch('/products/dashboard/overview/');
    if (!response.ok) throw new Error('Erreur dashboard overview');
    return response.json();
  },

  getDashboardSalesTrend: async () => {
    const response = await apiFetch('/products/dashboard/sales-trend/');
    if (!response.ok) throw new Error('Erreur dashboard sales trend');
    return response.json();
  },

  getDashboardCategoryBreakdown: async () => {
    const response = await apiFetch('/products/dashboard/category-breakdown/');
    if (!response.ok) throw new Error('Erreur dashboard category breakdown');
    return response.json();
  },

  getDashboardTopProducts: async () => {
    const response = await apiFetch('/products/dashboard/top-products/');
    if (!response.ok) throw new Error('Erreur dashboard top products');
    return response.json();
  },

  getDashboardRecentActivity: async () => {
    const response = await apiFetch('/products/dashboard/recent-activity/');
    if (!response.ok) throw new Error('Erreur dashboard recent activity');
    return response.json();
  },
};

// ==================== CART & ORDERS API ====================
export const ordersAPI = {
  // Get cart
  getCart: async () => {
    const response = await apiFetch('/orders/cart/');

    const { data, isJson } = await readResponseData(response);
    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || data.error || 'Erreur de récupération du panier');
    }

    return data;
  },

  // Add item to cart
  addToCart: async (productId, quantity, batchId = null, isAntigaspi = false) => {
    const response = await apiFetch('/orders/cart/items/', {
      method: 'POST',
      // Backend serializer currently accepts only: product_id, quantity
      // (extra keys can cause 400 depending on DRF config/version)
      body: JSON.stringify({ product_id: productId, quantity }),
    });

    const { data, isJson } = await readResponseData(response);
    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      console.error('addToCart failed:', { status: response.status, data, productId, quantity, batchId, isAntigaspi });
      const msg =
        (data && typeof data === 'object' && (data.detail || data.error))
          ? (data.detail || data.error)
          : (typeof data === 'object'
              ? Object.values(data).flat().join(', ')
              : null);
      throw new Error(msg || 'Erreur lors de l\'ajout au panier');
    }

    return data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    const response = await apiFetch(`/orders/cart/items/${itemId}/`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });

    const { data, isJson } = await readResponseData(response);
    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      const msg =
        (data && typeof data === 'object' && (data.detail || data.error))
          ? (data.detail || data.error)
          : (typeof data === 'object'
              ? Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`).join(' | ')
              : null);
      throw new Error(msg || 'Erreur de mise à jour du panier');
    }

    return data;
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const response = await apiFetch(`/orders/cart/items/${itemId}/`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }
    
    return true;
  },

  // Clear cart
  clearCart: async () => {
    const response = await apiFetch('/orders/cart/', {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors du vidage du panier');
    }
    
    return true;
  },

  // Checkout (create order from cart)
  checkout: async (deliveryInfo = {}) => {
    const response = await apiFetch('/orders/cart/', {
      method: 'POST',
      body: JSON.stringify(deliveryInfo),
    });

    const { data, isJson } = await readResponseData(response);
    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || data.error || 'Erreur lors de la commande');
    }

    return data;
  },

  // List orders
  listOrders: async () => {
    const response = await apiFetch('/orders/');

    const { data, isJson } = await readResponseData(response);
    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || data.error || 'Erreur de récupération des commandes');
    }

    return data;
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    const response = await apiFetch(`/orders/${orderId}/`);

    const { data, isJson } = await readResponseData(response);
    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || data.error || 'Commande non trouvée');
    }

    return data;
  },

  // ==================== PRODUCER SUB-ORDERS ====================
  listProducerSubOrders: async () => {
    const response = await apiFetch('/orders/producer/suborders/');

    const { data, isJson } = await readResponseData(response);
    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || data.error || 'Erreur de récupération des commandes producteur');
    }

    return data;
  },

  updateProducerSubOrderStatus: async (subOrderId, statusValue) => {
    const response = await apiFetch(`/orders/producer/suborders/${subOrderId}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status: statusValue }),
    });

    const { data, isJson } = await readResponseData(response);
    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      const msg =
        (data && typeof data === 'object' && (data.detail || data.error))
          ? (data.detail || data.error)
          : (typeof data === 'object'
              ? Object.values(data).flat().join(', ')
              : null);
      throw new Error(msg || 'Erreur lors de la mise à jour du statut');
    }

    return data;
  },
};

// ==================== ADMIN STATS API ====================
export const adminAPI = {
  getDashboardOverview: async () => {
    const response = await apiFetch('/users/admin/dashboard/overview/');
    if (!response.ok) throw new Error('Erreur dashboard admin overview');
    return response.json();
  },

  getDashboardSalesTrend: async (months = 7) => {
    const response = await apiFetch(`/users/admin/dashboard/sales-trend/?months=${encodeURIComponent(months)}`);
    if (!response.ok) throw new Error('Erreur dashboard admin sales trend');
    return response.json();
  },

  getDashboardCategoryBreakdown: async () => {
    const response = await apiFetch('/users/admin/dashboard/category-breakdown/');
    if (!response.ok) throw new Error('Erreur dashboard admin category breakdown');
    return response.json();
  },

  getDashboardRecentActivity: async (limit = 8) => {
    const response = await apiFetch(`/users/admin/dashboard/recent-activity/?limit=${encodeURIComponent(limit)}`);
    if (!response.ok) throw new Error('Erreur dashboard admin recent activity');
    return response.json();
  },

  getAnalyticsSummary: async () => {
    const response = await apiFetch('/users/admin/analytics/summary/');
    if (!response.ok) throw new Error('Erreur analytics admin');
    return response.json();
  },
};

// ==================== SHOPS API ====================
export const shopsAPI = {
  // List all shops
  listAll: async () => {
    const response = await apiFetch('/shops/');
    
    if (!response.ok) {
      throw new Error('Erreur de récupération des boutiques');
    }
    
    return response.json();
  },

  // Get my shop (producer)
  getMyShop: async () => {
    const response = await apiFetch('/shops/my-shop/');
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No shop yet
      }
      throw new Error('Erreur de récupération de la boutique');
    }
    
    return response.json();
  },

  // Create shop
  createShop: async (shopData) => {
    const isFormData = shopData instanceof FormData;
    
    const response = await apiFetch('/shops/create/', {
      method: 'POST',
      body: isFormData ? shopData : JSON.stringify(shopData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Erreur lors de la création de la boutique');
    }
    
    return data;
  },

  // Get shop details
  getDetails: async (shopId) => {
    const response = await apiFetch(`/shops/${shopId}/`);
    
    if (!response.ok) {
      throw new Error('Boutique non trouvée');
    }
    
    return response.json();
  },

  // Update shop
  updateShop: async (shopId, shopData) => {
    const isFormData = shopData instanceof FormData;
    
    const response = await apiFetch(`/shops/${shopId}/`, {
      method: 'PUT',
      body: isFormData ? shopData : JSON.stringify(shopData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Erreur de mise à jour de la boutique');
    }
    
    return data;
  },
};

// ==================== NOTIFICATIONS API ====================
export const notificationsAPI = {
  // List notifications
  list: async () => {
    const response = await apiFetch('/notifications/');

    const { data, isJson } = await readResponseData(response);
    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || data.error || 'Erreur de récupération des notifications');
    }

    return data;
  },

  unreadCount: async () => {
    const response = await apiFetch('/notifications/unread_count/');

    const { data, isJson } = await readResponseData(response);
    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || data.error || 'Erreur de récupération du compteur');
    }

    return data;
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    const response = await apiFetch(`/notifications/${notificationId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_read: true }),
    });

    const { data, isJson } = await readResponseData(response);
    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || data.error || 'Erreur lors du marquage');
    }

    return data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await apiFetch('/notifications/mark_all_read/', {
      method: 'POST',
    });

    const { data, isJson } = await readResponseData(response);
    if (!response.ok) {
      if (!isJson) throw buildNonJsonError(response, data);
      throw new Error(data.detail || data.error || 'Erreur lors du marquage');
    }

    return data;
  },

  // Delete notification
  delete: async (notificationId) => {
    const response = await apiFetch(`/notifications/${notificationId}/`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }
    
    return true;
  },
};

// ==================== SEASONAL PRODUCTS API ====================
export const seasonalAPI = {
  // List seasonal products
  list: async () => {
    const response = await apiFetch('/products/seasonal/');
    
    if (!response.ok) {
      throw new Error('Erreur de récupération des produits de saison');
    }
    
    return response.json();
  },
};

export default {
  auth: authAPI,
  products: productsAPI,
  orders: ordersAPI,
  shops: shopsAPI,
  notifications: notificationsAPI,
  seasonal: seasonalAPI,
};
