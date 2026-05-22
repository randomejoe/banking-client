import { defineStore } from 'pinia'
import {
  isLoggedIn,
  login as loginRequest,
  register as registerRequest,
  getCurrentUser,
  logout as logoutRequest,
} from '../services/authService.js'

// Manages the current user's authentication state.
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: isLoggedIn(),
    isLoading: false,
    errorMessage: '',
  }),

  actions: {
    // Logs in and stores the user.
    async login(email, password) {
      try {
        this.isLoading = true
        this.errorMessage = ''
        const data = await loginRequest(email, password)
        this.user = data.user
        this.isAuthenticated = true
        return data
      } catch (error) {
        this.errorMessage = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Registers a new customer account.
    async register(firstName, lastName, email, bsn, phone, password) {
      try {
        this.isLoading = true
        this.errorMessage = ''
        return await registerRequest(firstName, lastName, email, bsn, phone, password)
      } catch (error) {
        this.errorMessage = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Loads the authenticated user from the API.
    async loadCurrentUser() {
      if (!this.isAuthenticated) {
        this.user = null
        return null
      }
      try {
        this.isLoading = true
        this.errorMessage = ''
        const user = await getCurrentUser()
        this.user = user
        return user
      } catch (error) {
        this.user = null
        this.isAuthenticated = false
        this.errorMessage = error.message
        logoutRequest()
        return null
      } finally {
        this.isLoading = false
      }
    },

    // Clears auth state and removes the stored token.
    logout() {
      logoutRequest()
      this.user = null
      this.isAuthenticated = false
      this.errorMessage = ''
    },
  },
})
