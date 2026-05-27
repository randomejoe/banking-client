<template>
  <AppShell title="Search IBAN" subtitle="Look up an account by customer name" role="CUSTOMER" :user="user">
    <!-- Search bar -->
    <div class="section-card search-card">
      <div class="search-row">
        <Input v-model="firstName" label="First name" placeholder="Alice" />
        <Input v-model="lastName"  label="Last name"  placeholder="Johnson" />
        <div class="search-btn-wrap">
          <Button label="Search" variant="primary" size="md" :loading="isLoading" @click="handleSearch" />
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="searched" class="section-card">
      <div class="card-header">
        <p class="card-title">Results</p>
        <span class="card-count">{{ results.length }} found</span>
      </div>

      <div v-if="results.length === 0" class="empty-state">No accounts found.</div>

      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th><th>IBAN</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in results" :key="r.iban">
              <td>{{ r.name }}</td>
              <td class="iban-cell">{{ r.iban }}</td>
              <td>
                <Button
                  label="Copy IBAN"
                  variant="secondary"
                  size="sm"
                  @click="copyIban(r.iban)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Alert v-if="copyConfirm" type="success" message="IBAN copied to clipboard!" />
    <p v-if="errorMessage" class="status-msg" style="color: var(--color-danger)">{{ errorMessage }}</p>
  </AppShell>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../../stores/auth.js'
import { getAccounts } from '../../../services/accountService.js'
import AppShell from '../../organisms/AppShell/AppShell.vue'
import Input from '../../atoms/Input/Input.vue'
import Button from '../../atoms/Button/Button.vue'
import Alert from '../../atoms/Alert/Alert.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const firstName = ref('')
const lastName = ref('')
const results = ref([])
const searched = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const copyConfirm = ref(false)

async function handleSearch() {
  try {
    isLoading.value = true
    errorMessage.value = ''
    const name = [firstName.value, lastName.value].filter(Boolean).join(' ').trim()
    // GET /accounts?name=... returns AccountSearchResponse { iban, firstName, lastName }
    const data = await getAccounts({ name, status: 'ACTIVE', size: 50 })
    const accounts = data.content ?? data
    results.value = accounts.map(a => ({
      name: `${a.firstName} ${a.lastName}`,
      iban: a.iban,
    }))
    searched.value = true
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

async function copyIban(iban) {
  try {
    await navigator.clipboard.writeText(iban)
    copyConfirm.value = true
    setTimeout(() => (copyConfirm.value = false), 2500)
  } catch {
    // fallback: just show the IBAN in an alert
    alert(iban)
  }
}
</script>

<style scoped>
.section-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  margin-bottom: 1.25rem;
  overflow: hidden;
}

.search-card { padding: 1.25rem; }

.search-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.75rem;
  align-items: flex-end;
}

.search-btn-wrap { display: flex; align-items: flex-end; }

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.card-title { margin: 0; font-size: 0.9375rem; font-weight: 600; color: var(--color-text); }
.card-count { font-size: 0.8125rem; color: var(--color-muted); }

.table-wrapper { overflow-x: auto; }
.iban-cell { font-family: monospace; font-size: 0.8125rem; }
</style>
