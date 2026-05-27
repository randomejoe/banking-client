import { get, patch } from '../utils/api.js'

// Fetches a paginated list of customers (employee only).
export async function getCustomers(options = {}) {
  const params = new URLSearchParams()

  if (options.status) params.set('status', options.status)
  if (options.search) params.set('search', options.search)
  if (options.page != null) params.set('page', options.page)
  if (options.size != null) params.set('size', options.size)
  if (options.sort) params.set('sort', options.sort)

  const endpoint = params.toString() ? `/users?${params.toString()}` : '/users'
  const response = await get(endpoint)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load customers')
  }

  return data
}

// Fetches a single customer with their accounts (employee only).
export async function getCustomerById(id) {
  const response = await get(`/users/${id}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load customer')
  }

  return data
}

// Updates a customer's status or limits (employee only).
export async function updateCustomer(id, updates) {
  const response = await patch(`/users/${id}`, updates)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update customer')
  }

  return data
}
