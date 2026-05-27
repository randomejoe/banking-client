<template>
  <AppShell title="All Transactions" subtitle="Full transaction history across all accounts" role="EMPLOYEE" :user="user">
    <!-- Filters -->
    <div class="filter-bar">
      <div class="filter-grid">
        <Input v-model="filters.minAmount" label="Min amount"  type="number" placeholder="0.00" />
        <Input v-model="filters.maxAmount" label="Max amount"  type="number" placeholder="0.00" />
        <Input v-model="filters.iban"      label="IBAN"        placeholder="NL…" />
        <Input v-model="filters.customerId" label="Customer ID" type="number" placeholder="123" />
        <Input v-model="filters.startDate" label="From date" type="date" />
        <Input v-model="filters.endDate" label="To date" type="date" />
        <Select v-model="filters.type"     label="Type" :options="typeOptions" placeholder="All types" />
      </div>
      <div class="filter-actions">
        <Button label="Apply filters" variant="primary" size="sm" @click="loadTransactions" />
        <Button label="Clear" variant="ghost" size="sm" @click="clearFilters" />
      </div>
    </div>

    <!-- Table -->
    <div class="section-card">
      <div class="card-header">
        <p class="card-title">Transactions</p>
        <span class="card-count">{{ total }} records</span>
      </div>

      <p v-if="isLoading" class="status-msg">Loading…</p>
      <p v-if="errorMessage" class="status-msg" style="color: var(--color-danger)">{{ errorMessage }}</p>

      <div v-if="!isLoading" class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th><th>Type</th><th>From IBAN</th><th>To IBAN</th><th>Amount</th><th>Initiated by</th>
            </tr>
          </thead>
          <tbody>
            <TransactionRow
              v-for="tx in transactions"
              :key="tx.id"
              :transaction="tx"
              :show-initiated-by="true"
            />
          </tbody>
        </table>
        <p v-if="transactions.length === 0 && !isLoading" class="empty-state">No transactions found.</p>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <Button label="← Previous" variant="secondary" size="sm" :disabled="page === 0" @click="changePage(page - 1)" />
        <span class="pagination-info">{{ page + 1 }} / {{ totalPages }}</span>
        <Button label="Next →" variant="secondary" size="sm" :disabled="page >= totalPages - 1" @click="changePage(page + 1)" />
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../../../stores/auth.js'
import { getTransactions } from '../../../services/transactionService.js'
import AppShell from '../../organisms/AppShell/AppShell.vue'
import Input from '../../atoms/Input/Input.vue'
import Select from '../../atoms/Select/Select.vue'
import Button from '../../atoms/Button/Button.vue'
import TransactionRow from '../../molecules/TransactionRow/TransactionRow.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const transactions = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const page = ref(0)
const total = ref(0)
const totalPages = ref(0)

const filters = reactive({
  minAmount: '', maxAmount: '', iban: '', customerId: '', startDate: '', endDate: '', type: '',
})

const typeOptions = [
  { value: 'TRANSFER',   label: 'Transfer' },
  { value: 'DEPOSIT',    label: 'Deposit' },
  { value: 'WITHDRAWAL', label: 'Withdrawal' },
]

function clearFilters() {
  Object.keys(filters).forEach(k => (filters[k] = ''))
  page.value = 0
  loadTransactions()
}

function changePage(p) {
  page.value = p
  loadTransactions()
}

async function loadTransactions() {
  try {
    isLoading.value = true
    errorMessage.value = ''
    const data = await getTransactions({ ...filters, page: page.value, size: 20 })
    transactions.value = data.content ?? data
    total.value = data.totalElements ?? transactions.value.length
    totalPages.value = data.totalPages ?? 1
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

onMounted(loadTransactions)
</script>

<style scoped>
.section-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.card-title { margin: 0; font-size: 0.9375rem; font-weight: 600; color: var(--color-text); }
.card-count { font-size: 0.8125rem; color: var(--color-muted); }

.filter-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
.table-wrapper { overflow-x: auto; }

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}
.pagination-info { font-size: 0.875rem; color: var(--color-muted); }
</style>
