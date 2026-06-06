import { get, patch } from '../utils/api.js'

function buildQuery(options = {}, allowedKeys = []) {
  const params = new URLSearchParams()

  for (const key of allowedKeys) {
    if (options[key] != null && options[key] !== '') {
      params.set(key, options[key])
    }
  }

  return params.toString()
}

async function fetchAccounts(endpoint, message = 'Failed to load accounts') {
  const response = await get(endpoint)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || message)
  }

  return data
}

// Employee-only private account search.
export async function getAccounts(options = {}) {
  const query = buildQuery(options, ['userId', 'iban', 'name', 'type', 'status', 'page', 'size', 'sort'])
  return fetchAccounts(query ? `/accounts?${query}` : '/accounts')
}

// Current active customer's own accounts.
export async function getOwnAccounts(options = {}) {
  const query = buildQuery(options, ['page', 'size', 'sort'])
  return fetchAccounts(query ? `/accounts/me?${query}` : '/accounts/me')
}

// Active customer public lookup for transfer targets.
export async function searchTransferTargets(options = {}) {
  const query = buildQuery(options, ['name', 'page', 'size', 'sort'])
  return fetchAccounts(
    query ? `/accounts/transfer-targets?${query}` : '/accounts/transfer-targets',
    'Failed to search transfer targets',
  )
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
