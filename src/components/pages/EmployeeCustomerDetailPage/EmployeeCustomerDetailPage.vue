<template>
  <AppShell title="Customer Detail" subtitle="View account information and transaction history" role="EMPLOYEE" :user="user">
    <p v-if="isLoading" class="status-msg">Loading…</p>
    <p v-if="errorMessage" class="status-msg" style="color: var(--color-danger)">{{ errorMessage }}</p>

    <template v-if="customer">
      <!-- Profile -->
      <div class="section-card">
        <div class="card-header">
          <p class="section-label">Customer profile</p>
          <Badge :status="(customer.status || 'pending').toLowerCase()" />
        </div>
        <div class="profile-grid">
          <div v-for="field in profileFields" :key="field.label" class="profile-field">
            <p class="field-label">{{ field.label }}</p>
            <p class="field-value">{{ field.value }}</p>
          </div>
        </div>
      </div>

      <!-- Accounts -->
      <div v-if="accounts.length > 0">
        <div v-for="account in accounts" :key="account.iban" class="section-card">
          <div class="account-top">
            <div class="account-badges">
              <Badge :status="account.type ? account.type.toLowerCase() : 'checking'" />
              <Badge :status="account.status ? account.status.toLowerCase() : 'active'" />
            </div>
            <Button label="Edit limits" variant="secondary" size="sm" @click="openLimits(account)" />
          </div>
          <p class="account-iban">{{ account.iban }}</p>
          <p class="account-balance">{{ formatAmount(account.balance) }}</p>
          <div class="limits-row">
            <div><p class="field-label">Absolute limit</p><p class="field-value">{{ formatAmount(account.absoluteTransferLimit) }}</p></div>
            <div><p class="field-label">Daily limit</p><p class="field-value">{{ formatAmount(account.dailyTransferLimit) }}</p></div>
          </div>
        </div>
      </div>

      <!-- Transactions -->
      <div class="section-card">
        <p class="section-label">Recent transactions</p>
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Date</th><th>Type</th><th>From</th><th>To</th><th>Amount</th></tr></thead>
            <tbody>
              <TransactionRow v-for="tx in transactions" :key="tx.id" :transaction="tx" />
            </tbody>
          </table>
          <p v-if="transactions.length === 0" class="empty-state">No transactions found.</p>
        </div>
      </div>
    </template>

    <!-- Edit limits modal -->
    <AppModal v-model="showLimitsModal" title="Edit account limits">
      <div v-if="editingAccount" class="form-stack">
        <p class="iban-label">{{ editingAccount.iban }}</p>
        <Input v-model="editForm.absoluteTransferLimit" label="Absolute limit (€)" type="number" />
        <Input v-model="editForm.dailyTransferLimit"    label="Daily limit (€)"    type="number" />
        <Alert v-if="limitsError" type="error" :message="limitsError" />
        <div class="modal-actions">
          <Button label="Save changes" variant="primary" size="md" :loading="savingLimits" @click="saveLimits" />
          <Button label="Cancel" variant="secondary" size="md" @click="showLimitsModal = false" />
        </div>
      </div>
    </AppModal>
  </AppShell>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.js'
import { getCustomerById } from '../../../services/userService.js'
import { getAccounts, updateAccount } from '../../../services/accountService.js'
import { getTransactions } from '../../../services/transactionService.js'
import AppShell from '../../organisms/AppShell/AppShell.vue'
import Badge from '../../atoms/Badge/Badge.vue'
import Button from '../../atoms/Button/Button.vue'
import Input from '../../atoms/Input/Input.vue'
import Alert from '../../atoms/Alert/Alert.vue'
import AppModal from '../../molecules/AppModal/AppModal.vue'
import TransactionRow from '../../molecules/TransactionRow/TransactionRow.vue'

const route = useRoute()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const customer = ref(null)
const accounts = ref([])
const transactions = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const showLimitsModal = ref(false)
const editingAccount = ref(null)
const savingLimits = ref(false)
const limitsError = ref('')
const editForm = reactive({ absoluteTransferLimit: '', dailyTransferLimit: '' })

const profileFields = computed(() => {
  const c = customer.value
  if (!c) return []
  return [
    { label: 'First name', value: c.firstName || '—' },
    { label: 'Last name',  value: c.lastName  || '—' },
    { label: 'Email',      value: c.email     || '—' },
    { label: 'BSN',        value: c.bsn       || '—' },
    { label: 'Phone',      value: c.phoneNumber || '—' },
    { label: 'Role',       value: c.role      || '—' },
  ]
})

function formatAmount(n) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n ?? 0)
}

function openLimits(account) {
  editingAccount.value = account
  editForm.absoluteTransferLimit = String(account.absoluteTransferLimit ?? 0)
  editForm.dailyTransferLimit    = String(account.dailyTransferLimit    ?? 0)
  limitsError.value = ''
  showLimitsModal.value = true
}

async function saveLimits() {
  try {
    savingLimits.value = true
    limitsError.value = ''
    await updateAccount(editingAccount.value.iban, {
      absoluteTransferLimit: parseFloat(editForm.absoluteTransferLimit),
      dailyTransferLimit:    parseFloat(editForm.dailyTransferLimit),
    })
    showLimitsModal.value = false
    await loadCustomer()
  } catch (error) {
    limitsError.value = error.message
  } finally {
    savingLimits.value = false
  }
}

async function loadCustomer() {
  try {
    isLoading.value = true
    errorMessage.value = ''
    const [customerData, accountsData, txData] = await Promise.all([
      getCustomerById(route.params.id),
      getAccounts({ userId: route.params.id }),
      getTransactions({ customerId: route.params.id, size: 10 }),
    ])
    customer.value = customerData
    // Use full AccountResponse (has limits) instead of CustomerDetailResponse.accounts (no limits)
    accounts.value = accountsData.content ?? accountsData
    transactions.value = txData.content ?? txData
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

onMounted(loadCustomer)
</script>

<style scoped>
.section-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-label { margin: 0 0 1rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-muted); font-weight: 600; }

.profile-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.profile-field {}
.field-label { margin: 0 0 0.25rem; font-size: 0.75rem; color: var(--color-muted); }
.field-value { margin: 0; font-size: 0.875rem; font-weight: 500; color: var(--color-text); }

.account-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
.account-badges { display: flex; gap: 0.5rem; }
.account-iban    { margin: 0 0 0.25rem; font-family: monospace; font-size: 0.8125rem; color: var(--color-muted); }
.account-balance { margin: 0 0 1rem; font-size: 1.75rem; font-weight: 700; color: var(--color-text); }

.limits-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.table-wrapper { overflow-x: auto; }

.form-stack { display: flex; flex-direction: column; gap: 1rem; }
.iban-label { margin: 0; font-family: monospace; font-size: 0.875rem; color: var(--color-muted); }
.modal-actions { display: flex; gap: 0.75rem; }
.modal-actions > * { flex: 1; }
</style>
