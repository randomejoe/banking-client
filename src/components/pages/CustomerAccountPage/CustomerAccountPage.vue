<template>
  <AppShell title="My Account" subtitle="Your profile and account details" role="CUSTOMER" :user="user">
    <p v-if="isLoading" class="status-msg">Loading…</p>
    <p v-if="errorMessage" class="status-msg" style="color: var(--color-danger)">{{ errorMessage }}</p>

    <!-- Profile card -->
    <div class="section-card">
      <p class="section-label">Profile</p>
      <div class="profile-grid">
        <div v-for="field in profileFields" :key="field.label" class="profile-field">
          <p class="field-label">{{ field.label }}</p>
          <p class="field-value">{{ field.value }}</p>
        </div>
      </div>
    </div>

    <!-- Account cards -->
    <div v-for="account in accounts" :key="account.iban" class="section-card">
      <div class="account-header">
        <div class="account-header-left">
          <Badge :status="account.type ? account.type.toLowerCase() : 'checking'" />
          <Badge :status="account.status ? account.status.toLowerCase() : 'active'" />
        </div>
      </div>
      <p class="account-iban">{{ account.iban }}</p>
      <p class="account-balance">{{ formatAmount(account.balance) }}</p>
      <div class="account-limits">
        <div class="limit-item">
          <p class="limit-label">Absolute limit</p>
          <p class="limit-value">{{ formatAmount(account.absoluteLimit) }}</p>
        </div>
        <div class="limit-item">
          <p class="limit-label">Daily limit</p>
          <p class="limit-value">{{ formatAmount(account.dailyLimit) }}</p>
        </div>
      </div>
    </div>

    <!-- Recent transactions -->
    <div class="section-card" v-if="recentTransactions.length > 0">
      <p class="section-label">Recent transactions</p>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th><th>Type</th><th>From</th><th>To</th><th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <TransactionRow
              v-for="tx in recentTransactions"
              :key="tx.id"
              :transaction="tx"
            />
          </tbody>
        </table>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../../stores/auth.js'
import { getAccounts } from '../../../services/accountService.js'
import { getTransactions } from '../../../services/transactionService.js'
import AppShell from '../../organisms/AppShell/AppShell.vue'
import Badge from '../../atoms/Badge/Badge.vue'
import TransactionRow from '../../molecules/TransactionRow/TransactionRow.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const accounts = ref([])
const recentTransactions = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const profileFields = computed(() => {
  const u = user.value
  if (!u) return []
  return [
    { label: 'First name', value: u.firstName || '—' },
    { label: 'Last name',  value: u.lastName  || '—' },
    { label: 'Email',      value: u.email     || '—' },
    { label: 'BSN',        value: u.bsn       || '—' },
    { label: 'Phone',      value: u.phone     || '—' },
    { label: 'Status',     value: u.status    || '—' },
  ]
})

function formatAmount(amount) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount ?? 0)
}

onMounted(async () => {
  try {
    isLoading.value = true
    const [accData, txData] = await Promise.all([getAccounts(), getTransactions({ size: 5 })])
    accounts.value = accData.content ?? accData
    recentTransactions.value = txData.content ?? txData
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.section-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
}

.section-label {
  margin: 0 0 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-muted);
  font-weight: 600;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.profile-field {}
.field-label { margin: 0 0 0.25rem; font-size: 0.75rem; color: var(--color-muted); }
.field-value { margin: 0; font-size: 0.875rem; font-weight: 500; color: var(--color-text); }

.account-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.account-header-left {
  display: flex;
  gap: 0.5rem;
}

.account-iban    { margin: 0 0 0.25rem; font-family: monospace; font-size: 0.8125rem; color: var(--color-muted); }
.account-balance { margin: 0 0 1rem; font-size: 1.75rem; font-weight: 700; color: var(--color-text); }

.account-limits {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.limit-label { margin: 0 0 0.25rem; font-size: 0.75rem; color: var(--color-muted); }
.limit-value { margin: 0; font-size: 0.875rem; font-weight: 500; color: var(--color-text); }

.table-wrapper { overflow-x: auto; }
</style>
