<template>
  <div class="atm-bg">
    <div class="atm-container">
      <div class="atm-header">
        <div class="atm-logo-icon">🏧</div>
        <span class="atm-logo-text">FHJ Bank ATM</span>
      </div>

      <div class="atm-card">
        <p class="welcome-text">Welcome, {{ user?.firstName }}</p>

        <!-- Account selector -->
        <Select
          v-model="selectedIban"
          label="Select account"
          :options="accountOptions"
          placeholder="Select account"
        />

        <!-- Balance display -->
        <div v-if="selectedAccount" class="balance-display">
          <p class="balance-label">Available balance</p>
          <p class="balance-amount">{{ formatAmount(selectedAccount.balance) }}</p>
        </div>

        <!-- Actions -->
        <div class="action-grid">
          <button class="atm-action deposit" @click="router.push('/atm/deposit')">
            <span class="action-icon">+</span>
            <span>Deposit</span>
          </button>
          <button class="atm-action withdraw" @click="router.push('/atm/withdraw')">
            <span class="action-icon">−</span>
            <span>Withdraw</span>
          </button>
        </div>

        <button class="logout-btn" type="button" @click="handleLogout">⎋ Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAccounts } from '../../../services/accountService.js'
import Select from '../../atoms/Select/Select.vue'

const router = useRouter()

const user = ref(null)
const accounts = ref([])
const selectedIban = ref('')

const selectedAccount = computed(() => accounts.value.find(a => a.iban === selectedIban.value))

const accountOptions = computed(() =>
  accounts.value.map(a => ({
    value: a.iban,
    label: `${a.type?.toLowerCase() || 'account'} — …${a.iban?.slice(-8)}`,
  }))
)

function formatAmount(n) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n ?? 0)
}

function handleLogout() {
  sessionStorage.removeItem('atm-token')
  sessionStorage.removeItem('atm-user')
  sessionStorage.removeItem('atm-iban')
  router.push('/atm')
}

onMounted(async () => {
  const stored = sessionStorage.getItem('atm-user')
  if (stored) user.value = JSON.parse(stored)

  try {
    const data = await getAccounts()
    accounts.value = data.content ?? data
    if (accounts.value.length > 0) {
      selectedIban.value = accounts.value[0].iban
      sessionStorage.setItem('atm-iban', selectedIban.value)
    }
  } catch {
    router.push('/atm')
  }
})

// Watch selected IBAN to persist it for deposit/withdraw pages
import { watch } from 'vue'
watch(selectedIban, (val) => { sessionStorage.setItem('atm-iban', val) })
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
  width: 2rem;
  height: 2rem;
  background-color: var(--color-brand);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
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

.welcome-text { margin: 0; font-size: 0.875rem; color: var(--color-muted); }

.balance-display {
  background-color: var(--color-bg);
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
}
.balance-label  { margin: 0 0 0.25rem; font-size: 0.75rem; color: var(--color-muted); }
.balance-amount { margin: 0; font-size: 2rem; font-weight: 700; color: var(--color-text); }

.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.atm-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  transition: background-color 0.15s ease;
}

.deposit  { background-color: var(--color-success-soft); border-color: rgba(34, 197, 94, 0.25); }
.deposit:hover  { background-color: rgba(34, 197, 94, 0.18); }
.withdraw { background-color: var(--color-brand-soft); border-color: rgba(5, 122, 255, 0.25); }
.withdraw:hover { background-color: rgba(5, 122, 255, 0.18); }

.action-icon { font-size: 1.75rem; font-weight: 300; color: inherit; }
.deposit  .action-icon { color: var(--color-success); }
.withdraw .action-icon { color: var(--color-brand); }

.logout-btn {
  width: 100%;
  padding: 0.625rem;
  border: none;
  border-radius: 0.75rem;
  background: transparent;
  color: var(--color-danger);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.logout-btn:hover { background-color: var(--color-danger-soft); }
</style>
