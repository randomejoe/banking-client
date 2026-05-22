<template>
  <AuthWrap>
    <h2 class="auth-heading">Welcome back</h2>
    <p class="auth-sub">Sign in to your account</p>

    <div class="form-stack">
      <Input
        v-model="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        :error="errors.email"
        required
      />
      <Input
        v-model="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        :error="errors.password"
        required
      />

      <Alert v-if="errorMessage" type="error" :message="errorMessage" />

      <Button
        label="Sign in"
        variant="primary"
        size="lg"
        :loading="isLoading"
        :disabled="isLoading"
        class="btn-full"
        @click="handleLogin"
      />
    </div>

    <p class="auth-switch">
      No account?
      <RouterLink to="/register">Request access</RouterLink>
    </p>
  </AuthWrap>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.js'
import AuthWrap from '../../organisms/AuthWrap/AuthWrap.vue'
import Input from '../../atoms/Input/Input.vue'
import Button from '../../atoms/Button/Button.vue'
import Alert from '../../atoms/Alert/Alert.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errors = ref({})
const errorMessage = ref('')
const isLoading = ref(false)

function validate() {
  const e = {}
  if (!email.value) e.email = 'Email is required'
  if (!password.value) e.password = 'Password is required'
  return e
}

async function handleLogin() {
  errors.value = validate()
  if (Object.keys(errors.value).length > 0) return

  try {
    isLoading.value = true
    errorMessage.value = ''
    const data = await authStore.login(email.value, password.value)

    const user = data.user
    if (user?.status === 'PENDING') {
      router.push('/pending')
      return
    }

    const redirect = route.query.redirect
    if (redirect) {
      router.push(redirect)
    } else if (user?.role === 'EMPLOYEE') {
      router.push('/employee/dashboard')
    } else {
      router.push('/customer/dashboard')
    }
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-heading {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
}

.auth-sub {
  margin: 0 0 1.5rem;
  font-size: 0.875rem;
  color: var(--color-muted);
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-full {
  width: 100%;
}

.auth-switch {
  margin: 1.25rem 0 0;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-muted);
}

.auth-switch a {
  color: var(--color-brand);
  font-weight: 500;
}
</style>
