import config from '../config.js'

// Builds the full URL from an endpoint path.
function buildApiUrl(endpoint) {
  const base = config.apiDomain.replace(/\/$/, '')
  const path = endpoint.replace(/^\//, '')
  return `${base}/${path}`
}

// Returns the Authorization header if a token is stored.
// Checks localStorage first (main app), then sessionStorage (ATM session).
function getAuthHeaders() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('atm-token')
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

// GET request
export async function get(endpoint, options = {}) {
  const url = buildApiUrl(endpoint)
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  })
}

// POST request
export async function post(endpoint, data, options = {}) {
  const url = buildApiUrl(endpoint)
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  })
}

// PUT request
export async function put(endpoint, data, options = {}) {
  const url = buildApiUrl(endpoint)
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  })
}

// PATCH request
export async function patch(endpoint, data, options = {}) {
  const url = buildApiUrl(endpoint)
  return fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  })
}

// DELETE request
export async function del(endpoint, options = {}) {
  const url = buildApiUrl(endpoint)
  return fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  })
}
