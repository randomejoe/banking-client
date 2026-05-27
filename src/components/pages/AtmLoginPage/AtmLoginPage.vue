<template>
  <div class="atm-bg">
    <div class="atm-container">
      <!-- ATM Header -->
      <div class="atm-header">
        <div class="atm-logo-icon">🏧</div>
        <span class="atm-logo-text">FHJ Bank ATM</span>
      </div>

      <div class="atm-card">
        <h2 class="atm-card-title">Insert your card</h2>

        <div class="form-stack">
          <Input v-model="email" label="Email" type="email" placeholder="you@example.com" />
          <Input v-model="password" label="PIN / Password" type="password" placeholder="••••••••" />
          <Alert v-if="errorMessage" type="error" :message="errorMessage" />
          <Button
            label="Enter"
            variant="primary"
            size="lg"
            :loading="isLoading"
            :disabled="isLoading"
            class="btn-full"
            @click="handleLogin"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../../../services/authService.js'
import Input from '../../atoms/Input/Input.vue'
import Button from '../../atoms/Button/Button.vue'
import Alert from '../../atoms/Alert/Alert.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }
  try {
    isLoading.value = true
    errorMessage.value = ''
    const data = await login(email.value, password.value, { persist: false })

    const user = data.user
    if (user?.role !== 'CUSTOMER') {
      errorMessage.value = 'ATM is for customers only.'
      return
    }
    if (user?.status !== 'ACTIVE') {
      errorMessage.value = 'Your account is not active. ATM access denied.'
      return
    }

    // Store ATM session token separately from the main app token
    sessionStorage.setItem('atm-token', data.token.value)
    sessionStorage.setItem('atm-user', JSON.stringify(user))
    router.push('/atm/menu')
  } catch (error) {
    errorMessage.value = error.message || 'Invalid credentials.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.atm-bg {
  min-height: 100vh;
  background-color: #474C59;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.atm-container {
  width: 100%;
  max-width: 22rem;
}

.atm-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  margin-bottom: 1.5rem;
}

.atm-logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--color-brand);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.atm-logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
}

.atm-card {
  background-color: var(--color-surface);
  border-radius: 1.25rem;
  padding: 2rem;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.3);
}

.atm-card-title {
  margin: 0 0 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  text-align: center;
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-full { width: 100%; }
</style>
