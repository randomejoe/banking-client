<template>
  <AuthWrap>
    <!-- Success state -->
    <div v-if="submitted" class="success-state">
      <div class="success-icon">✓</div>
      <h2 class="auth-heading">Request submitted</h2>
      <p class="auth-sub">
        Your account is pending approval. An employee will review your request
        before you can access the banking system.
      </p>
      <Button label="Back to login" variant="secondary" size="md" class="btn-full" @click="router.push('/login')" />
    </div>

    <!-- Registration form -->
    <template v-else>
      <h2 class="auth-heading">Create account</h2>
      <p class="auth-sub">Your request will be reviewed by an employee</p>

      <div class="form-stack">
        <div class="form-row-2">
          <Input v-model="form.firstName" label="First name" :error="errors.firstName" required />
          <Input v-model="form.lastName" label="Last name" :error="errors.lastName" required />
        </div>
        <Input v-model="form.email" label="Email" type="email" placeholder="you@example.com" :error="errors.email" required />
        <Input v-model="form.bsn" label="BSN" placeholder="123456789" :error="errors.bsn" required />
        <Input v-model="form.phone" label="Phone" placeholder="+31 6 ..." :error="errors.phone" required />
        <Input v-model="form.password" label="Password" type="password" placeholder="Min 8 characters" :error="errors.password" required />
        <Input v-model="form.confirm" label="Confirm password" type="password" placeholder="Repeat password" :error="errors.confirm" required />

        <Alert v-if="errorMessage" type="error" :message="errorMessage" />

        <Button
          label="Submit request"
          variant="primary"
          size="lg"
          :loading="isLoading"
          :disabled="isLoading"
          class="btn-full"
          @click="handleRegister"
        />
      </div>

      <p class="auth-switch">
        Already have an account?
        <RouterLink to="/login">Sign in</RouterLink>
      </p>
    </template>
  </AuthWrap>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.js'
import AuthWrap from '../../organisms/AuthWrap/AuthWrap.vue'
import Input from '../../atoms/Input/Input.vue'
import Button from '../../atoms/Button/Button.vue'
import Alert from '../../atoms/Alert/Alert.vue'

const router = useRouter()
const authStore = useAuthStore()

const submitted = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const errors = ref({})

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  bsn: '',
  phone: '',
  password: '',
  confirm: '',
})

function validate() {
  const e = {}
  if (!form.firstName) e.firstName = 'Required'
  if (!form.lastName) e.lastName = 'Required'
  if (!form.email || !form.email.includes('@')) e.email = 'Valid email required'
  if (!form.bsn || form.bsn.length !== 9) e.bsn = 'BSN must be 9 digits'
  if (!form.phone) e.phone = 'Required'
  if (!form.password || form.password.length < 8) e.password = 'Minimum 8 characters'
  if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
  return e
}

async function handleRegister() {
  errors.value = validate()
  if (Object.keys(errors.value).length > 0) return

  try {
    isLoading.value = true
    errorMessage.value = ''
    await authStore.register(form.firstName, form.lastName, form.email, form.bsn, form.phone, form.password)
    submitted.value = true
  } catch (error) {
    errorMessage.value = error.message || 'Registration failed. Please try again.'
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

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
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

.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  padding: 1rem 0;
}

.success-icon {
  width: 4rem;
  height: 4rem;
  background-color: var(--color-success-soft);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-success);
}
</style>
