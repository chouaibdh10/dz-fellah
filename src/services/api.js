const DEFAULT_BASE_URL = 'http://127.0.0.1:8000'

export const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '')

const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(ACCESS_KEY, access)
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

async function request(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`

  const finalHeaders = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...headers
  }

  if (auth) {
    const token = getAccessToken()
    if (token) finalHeaders.Authorization = `Bearer ${token}`
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined
  })

  const contentType = res.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await res.json().catch(() => null) : await res.text()

  if (!res.ok) {
    let message = `HTTP ${res.status}`

    if (typeof data === 'string') {
      message = data || message
    } else if (data && typeof data === 'object') {
      message = data.detail || data.message || message

      // DRF validation errors often look like: { field: ["msg"] }
      if (message === `HTTP ${res.status}`) {
        const keys = Object.keys(data)
        if (keys.length) {
          const firstKey = keys[0]
          const value = data[firstKey]
          if (Array.isArray(value) && value.length) {
            message = value[0]
          } else if (typeof value === 'string') {
            message = value
          } else {
            try {
              message = JSON.stringify(data)
            } catch {
              // keep default
            }
          }
        }
      }
    }

    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

export const api = {
  auth: {
    async login(email, password) {
      return request('/api/auth/login/', { method: 'POST', auth: false, body: { email, password } })
    },
    async register(payload) {
      return request('/api/auth/register/', { method: 'POST', auth: false, body: payload })
    },
    async me() {
      return request('/api/auth/me/', { method: 'GET', auth: true })
    },
    async updateMe(payload) {
      return request('/api/auth/me/', { method: 'PATCH', auth: true, body: payload })
    }
  },
  products: {
    async list() {
      return request('/api/products/', { method: 'GET', auth: false })
    },
    async get(id) {
      return request(`/api/products/${id}/`, { method: 'GET', auth: false })
    },
    async create(payload) {
      return request('/api/products/', { method: 'POST', auth: true, body: payload })
    },
    async update(id, payload) {
      return request(`/api/products/${id}/`, { method: 'PATCH', auth: true, body: payload })
    },
    async remove(id) {
      return request(`/api/products/${id}/`, { method: 'DELETE', auth: true })
    }
  },
  orders: {
    async list() {
      return request('/api/orders/', { method: 'GET', auth: true })
    },
    async create(payload) {
      return request('/api/orders/', { method: 'POST', auth: true, body: payload })
    },
    async setStatus(id, status) {
      return request(`/api/orders/${id}/status/`, { method: 'PATCH', auth: true, body: { status } })
    }
  }
}
