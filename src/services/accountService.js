import { get, patch } from '../utils/api.js'

// Fetches accounts for the current user (or all accounts for employees).
export async function getAccounts(options = {}) {
  const params = new URLSearchParams()

  if (options.userId != null) params.set('userId', options.userId)
  if (options.iban) params.set('iban', options.iban)
  if (options.name) params.set('name', options.name)
  if (options.type) params.set('type', options.type)
  if (options.status) params.set('status', options.status)
  if (options.page != null) params.set('page', options.page)
  if (options.size != null) params.set('size', options.size)
  if (options.sort) params.set('sort', options.sort)

  const endpoint = params.toString() ? `/accounts?${params.toString()}` : '/accounts'
  const response = await get(endpoint)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load accounts')
  }

  return data
}

// Updates an account's absolute limit and daily limit (employee only).
export async function updateAccount(iban, updates) {
  const response = await patch(`/accounts/${iban}`, updates)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update account')
  }

  return data
}
