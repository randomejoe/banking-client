<template>
  <AppShell title="Dashboard" :subtitle="`Welcome back, ${firstName}`" role="CUSTOMER" :user="user">
    <!-- Total balance hero card -->
    <div class="hero-card">
      <p class="hero-label">Total balance</p>
      <p class="hero-amount">{{ formatAmount(totalBalance) }}</p>
      <p class="hero-sub">{{ accounts.length }} account{{ accounts.length !== 1 ? 's' : '' }}</p>
    </div>

    <!-- Individual account cards -->
    <div class="account-grid">
      <div
        v-for="account in accounts"
        :key="account.iban"
        class="account-card"
        @click="router.push('/customer/account')"
      >
        <div class="account-card-top">
          <Badge :status="account.type ? account.type.toLowerCase() : 'checking'" />
          <span class="account-iban-short">…{{ account.iban?.slice(-8) }}</span>
        </div>
        <p class="account-balance">{{ formatAmount(account.balance) }}</p>
        <p class="account-iban-full">{{ account.iban }}</p>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="actions-grid">
      <button class="action-btn" @click="router.push('/customer/transfer')">
        <span class="action-icon">⇄</span>
        <span>Transfer</span>
      </button>
      <button class="action-btn" @click="router.push('/customer/transactions')">
        <span class="action-icon">☰</span>
        <span>Transactions</span>
      </button>
      <button class="action-btn" @click="router.push('/customer/search-iban')">
        <span class="action-icon">🔍</span>
        <span>Search IBAN</span>
      </button>
      <button class="action-btn" @click="router.push('/atm')">
        <span class="action-icon">🏧</span>
        <span>ATM</span>
      </button>
    </div>

    <p v-if="isLoading" class="status-msg">Loading accounts…</p>
    <p v-if="errorMessage" class="status-msg" style="color: var(--color-danger)">{{ errorMessage }}</p>
  </AppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.js'
import { getAccounts } from '../../../services/accountService.js'
import AppShell from '../../organisms/AppShell/AppShell.vue'
import Badge from '../../atoms/Badge/Badge.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const firstName = computed(() => user.value?.firstName || user.value?.name?.split(' ')[0] || '')

const accounts = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const totalBalance = computed(() => accounts.value.reduce((sum, a) => sum + (a.balance || 0), 0))

function formatAmount(amount) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount)
}

onMounted(async () => {
  try {
    isLoading.value = true
    const data = await getAccounts()
    accounts.value = data.content ?? data
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.hero-card {
  background: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-hover) 100%);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 1.25rem;
}

.hero-label  { margin: 0 0 0.25rem; font-size: 0.875rem; color: rgba(255,255,255,0.7); }
.hero-amount { margin: 0; font-size: 2.5rem; font-weight: 700; color: #fff; }
.hero-sub    { margin: 0.5rem 0 0; font-size: 0.75rem; color: rgba(255,255,255,0.6); }

.account-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.account-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.account-card:hover {
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px var(--color-brand-soft);
}

.account-card-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.account-iban-short { font-size: 0.75rem; color: var(--color-muted); }
.account-balance    { margin: 0 0 0.25rem; font-size: 1.375rem; font-weight: 600; color: var(--color-text); }
.account-iban-full  { margin: 0; font-size: 0.75rem; font-family: monospace; color: var(--color-muted); }

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.action-btn {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.action-btn:hover {
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px var(--color-brand-soft);
}

.action-icon {
  font-size: 1.375rem;
}
</style>
