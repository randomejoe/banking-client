import { get, post } from '../utils/api.js'

// Checks whether a token exists in localStorage.
export function isLoggedIn() {
  return !!localStorage.getItem('token')
}

// Sends login credentials and optionally stores the returned JWT token.
export async function login(email, password, options = {}) {
  const { persist = true } = options
  const response = await post('/auth/login', { email, password })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Login failed')
  }

  if (persist) {
    localStorage.setItem('token', data.token.value)
  }
  return data
}

// Registers a new customer account.
export async function register(firstName, lastName, email, bsn, phone, password) {
  const response = await post('/auth/register', {
    firstName,
    lastName,
    email,
    bsn,
    phoneNumber: phone,
    password,
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed')
  }

  return data
}

// Fetches the currently authenticated user from the API.
export async function getCurrentUser() {
  const response = await get('/auth/me')
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load user')
  }

  return data
}

// Removes the token from localStorage.
export function logout() {
  localStorage.removeItem('token')
}
