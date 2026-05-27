<template>
  <AppShell title="Dashboard" subtitle="Bank operations overview" role="EMPLOYEE" :user="user">
    <!-- Stat cards -->
    <div class="stats-grid">
      <div class="stat-link" @click="router.push('/employee/approvals')">
        <StatCard title="Pending approvals" :value="String(stats.pending)" icon="✓" color="#F59E0B" sub="Click to manage" />
      </div>
      <div class="stat-link" @click="router.push('/employee/customers')">
        <StatCard title="Total customers" :value="String(stats.customers)" icon="👥" color="#057AFF" sub="Click to manage" />
      </div>
      <div class="stat-link" @click="router.push('/employee/accounts')">
        <StatCard title="Active accounts" :value="String(stats.accounts)" icon="💳" color="#22C55E" sub="Click to manage" />
      </div>
      <div class="stat-link" @click="router.push('/employee/transactions')">
        <StatCard title="Transactions" :value="String(stats.transactions)" icon="📊" color="#8B5CF6" sub="Click to view" />
      </div>
    </div>

    <!-- Quick actions -->
    <div class="section-card">
      <p class="section-title">Quick actions</p>
      <div class="actions-grid">
        <button class="action-btn" @click="router.push('/employee/approvals')">
          <span class="action-icon">✓</span>
          <span>Review approvals</span>
        </button>
        <button class="action-btn" @click="router.push('/employee/transfer')">
          <span class="action-icon">⇄</span>
          <span>New transfer</span>
        </button>
        <button class="action-btn" @click="router.push('/employee/transactions')">
          <span class="action-icon">☰</span>
          <span>All transactions</span>
        </button>
      </div>
    </div>

    <p v-if="isLoading" class="status-msg">Loading stats…</p>
    <p v-if="errorMessage" class="status-msg" style="color: var(--color-danger)">{{ errorMessage }}</p>
  </AppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.js'
import { getCustomers } from '../../../services/userService.js'
import { getAccounts } from '../../../services/accountService.js'
import { getTransactions } from '../../../services/transactionService.js'
import AppShell from '../../organisms/AppShell/AppShell.vue'
import StatCard from '../../molecules/StatCard/StatCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const isLoading = ref(false)
const errorMessage = ref('')

const stats = ref({ pending: 0, customers: 0, accounts: 0, transactions: 0 })

onMounted(async () => {
  try {
    isLoading.value = true
    const [pendingData, allCustomers, allAccounts, allTransactions] = await Promise.all([
      getCustomers({ status: 'PENDING', size: 1 }),
      getCustomers({ size: 1 }),
      getAccounts({ size: 1 }),
      getTransactions({ size: 1 }),
    ])
    stats.value = {
      pending:      pendingData.totalElements ?? 0,
      customers:    allCustomers.totalElements ?? 0,
      accounts:     allAccounts.totalElements ?? 0,
      transactions: allTransactions.totalElements ?? 0,
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stat-link { cursor: pointer; }
.stat-link:hover { opacity: 0.9; }

.section-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
}

.section-title {
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.action-btn:hover {
  border-color: var(--color-brand);
  background-color: var(--color-brand-soft);
}

.action-icon { font-size: 1.125rem; }
</style>
