/**
 * Application Configuration
 *
 * Override using environment variables (VITE_ prefix for Vite).
 * Create a .env file in the project root to set custom values:
 *   VITE_API_DOMAIN=http://localhost:8080
 */

const config = {
  // Base URL for the banking API (Spring Boot runs on 8080 by default)
  apiDomain: import.meta.env.VITE_API_DOMAIN || 'http://localhost:8080',
}

export default Object.freeze(config)
