<template>
  <div class="atm-bg">
    <div class="atm-container">
      <div class="atm-header">
        <div class="atm-logo-icon">🏧</div>
        <span class="atm-logo-text">FHJ Bank ATM</span>
      </div>

      <div class="atm-card">
        <!-- Input step -->
        <template v-if="!confirmed && !success">
          <div class="card-title-row">
            <button class="back-btn" @click="router.push('/atm/menu')">←</button>
            <h3 class="atm-card-title">Withdraw</h3>
          </div>
          <p class="atm-sub">Account: <span class="iban-text">{{ iban }}</span></p>

          <div class="amount-field">
            <label class="field-label">Amount</label>
            <div class="amount-wrapper">
              <span class="amount-prefix">€</span>
              <input v-model="amount" type="number" min="0" step="0.01" placeholder="0.00" class="amount-input" />
            </div>
          </div>

          <Alert v-if="errorMessage" type="error" :message="errorMessage" />

          <Button label="Continue" variant="primary" size="lg" class="btn-full" @click="toConfirm" />
        </template>

        <!-- Confirm step -->
        <template v-else-if="confirmed && !success">
          <h3 class="atm-card-title">Confirm withdrawal</h3>
          <div class="confirm-box">
            <p class="confirm-label">Amount to withdraw</p>
            <p class="confirm-amount">{{ formatAmount(parseFloat(amount)) }}</p>
          </div>
          <p class="atm-sub">from account ending …{{ iban?.slice(-8) }}</p>
          <Alert v-if="errorMessage" type="error" :message="errorMessage" />
          <div class="btn-row">
            <Button label="Confirm" variant="primary" size="md" :loading="isLoading" class="btn-flex" @click="handleWithdraw" />
            <Button label="Back" variant="secondary" size="md" class="btn-flex" @click="confirmed = false" />
          </div>
        </template>

        <!-- Success step -->
        <template v-else>
          <div class="success-state">
            <div class="success-icon">✓</div>
            <h3 class="atm-card-title">Success!</h3>
            <p class="atm-sub">Withdrawn {{ formatAmount(parseFloat(amount)) }} from your account.</p>
            <p class="atm-sub">Please take your cash.</p>
            <Button label="New transaction" variant="primary" size="md" class="btn-full" @click="reset" />
            <button class="logout-btn" @click="handleLogout">Logout</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createTransaction } from '../../../services/transactionService.js'
import Button from '../../atoms/Button/Button.vue'
import Alert from '../../atoms/Alert/Alert.vue'

const router = useRouter()
const iban = ref('')
const amount = ref('')
const confirmed = ref(false)
const success = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

function formatAmount(n) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n ?? 0)
}

function toConfirm() {
  const amt = parseFloat(amount.value)
  if (!amt || amt <= 0) { errorMessage.value = 'Enter a valid amount.'; return }
  errorMessage.value = ''
  confirmed.value = true
}

function reset() {
  amount.value = ''
  confirmed.value = false
  success.value = false
  errorMessage.value = ''
  router.push('/atm/menu')
}

function handleLogout() {
  sessionStorage.removeItem('atm-token')
  sessionStorage.removeItem('atm-user')
  sessionStorage.removeItem('atm-iban')
  router.push('/atm')
}

async function handleWithdraw() {
  try {
    isLoading.value = true
    errorMessage.value = ''
    await createTransaction({
      fromIban: iban.value,
      toIban: 'ATM',
      amount: parseFloat(amount.value),
      type: 'WITHDRAWAL',
      description: 'ATM withdrawal',
    })
    success.value = true
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  iban.value = sessionStorage.getItem('atm-iban') || ''
  if (!iban.value) router.push('/atm/menu')
})
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

.atm-container { width: 100%; max-width: 22rem; }

.atm-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  margin-bottom: 1.5rem;
}

.atm-logo-icon {
  width: 2rem; height: 2rem;
  background-color: var(--color-brand);
  border-radius: 0.5rem;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
}

.atm-logo-text { font-size: 1.125rem; font-weight: 700; color: #fff; }

.atm-card {
  background-color: var(--color-surface);
  border-radius: 1.25rem;
  padding: 1.75rem;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-title-row { display: flex; align-items: center; gap: 0.75rem; }
.back-btn {
  background: none; border: none; font-size: 1.25rem;
  color: var(--color-muted); cursor: pointer; padding: 0;
}
.back-btn:hover { color: var(--color-text); }

.atm-card-title { margin: 0; font-size: 1rem; font-weight: 600; color: var(--color-text); text-align: center; flex: 1; }
.atm-sub { margin: 0; font-size: 0.8125rem; color: var(--color-muted); text-align: center; }
.iban-text { font-family: monospace; }

.amount-field { display: flex; flex-direction: column; gap: 0.375rem; }
.field-label { font-size: 0.875rem; font-weight: 500; color: var(--color-text); }

.amount-wrapper { position: relative; }
.amount-prefix {
  position: absolute; left: 0.875rem; top: 50%;
  transform: translateY(-50%); color: var(--color-muted); font-weight: 500; pointer-events: none;
}
.amount-input {
  width: 100%; padding: 0.875rem 0.875rem 0.875rem 2rem;
  border: 1px solid var(--color-border); border-radius: 0.75rem;
  background-color: var(--color-surface); color: var(--color-text);
  font-size: 1.5rem; font-weight: 700; outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.amount-input:focus { border-color: var(--color-brand); box-shadow: 0 0 0 3px var(--color-brand-soft); }

.confirm-box {
  background-color: var(--color-bg);
  border-radius: 0.75rem;
  padding: 1.25rem;
  text-align: center;
}
.confirm-label  { margin: 0 0 0.25rem; font-size: 0.75rem; color: var(--color-muted); }
.confirm-amount { margin: 0; font-size: 2rem; font-weight: 700; color: var(--color-text); }

.btn-full { width: 100%; }
.btn-row { display: flex; gap: 0.75rem; }
.btn-flex { flex: 1; width: 100%; }

.success-state {
  display: flex; flex-direction: column;
  align-items: center; gap: 0.75rem; text-align: center; padding: 0.5rem 0;
}

.success-icon {
  width: 3.5rem; height: 3.5rem;
  background-color: var(--color-success-soft);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; font-weight: 700; color: var(--color-success);
}

.logout-btn {
  background: none; border: none;
  color: var(--color-danger); font-size: 0.875rem;
  cursor: pointer; padding: 0.25rem;
}
.logout-btn:hover { text-decoration: underline; }
</style>
