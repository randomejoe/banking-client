import { get, post } from '../utils/api.js'

// Fetches a paginated list of transactions, with optional filters.
export async function getTransactions(filters = {}) {
  const params = new URLSearchParams()

  if (filters.customerId != null) params.set('customerId', filters.customerId)
  if (filters.iban) params.set('iban', filters.iban)
  if (filters.type) params.set('type', filters.type)
  if (filters.minAmount != null && filters.minAmount !== '') params.set('minAmount', filters.minAmount)
  if (filters.maxAmount != null && filters.maxAmount !== '') params.set('maxAmount', filters.maxAmount)
  if (filters.page != null) params.set('page', filters.page)
  if (filters.size != null) params.set('size', filters.size)

  const endpoint = params.toString() ? `/transactions?${params.toString()}` : '/transactions'
  const response = await get(endpoint)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load transactions')
  }

  return data
}

// Creates a new transaction (transfer, deposit, or withdrawal).
export async function createTransaction(payload) {
  const response = await post('/transactions', payload)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Transaction failed')
  }

  return data
}
