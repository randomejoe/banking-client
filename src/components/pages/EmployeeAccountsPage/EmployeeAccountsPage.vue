<template>
  <AppShell title="Accounts" subtitle="View and manage all bank accounts" role="EMPLOYEE" :user="user">
    <!-- Search bar -->
    <div class="filter-bar">
      <div class="filter-grid">
        <Input v-model="ibanSearch" label="Search by IBAN" placeholder="NL…" />
        <Select v-model="statusFilter" label="Status" :options="statusOptions" placeholder="All statuses" />
      </div>
      <div class="filter-actions">
        <Button label="Search" variant="primary" size="sm" :loading="isLoading" @click="loadAccounts" />
        <Button label="Clear" variant="ghost" size="sm" @click="clearSearch" />
      </div>
    </div>

    <div class="section-card">
      <p v-if="isLoading" class="status-msg">Loading…</p>
      <p v-if="errorMessage" class="status-msg" style="color: var(--color-danger)">{{ errorMessage }}</p>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>IBAN</th><th>Type</th><th>Balance</th><th>Abs. limit</th><th>Daily limit</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="account in accounts" :key="account.iban">
              <td class="td-mono">{{ account.iban }}</td>
              <td><Badge :status="account.type ? account.type.toLowerCase() : 'checking'" /></td>
              <td class="td-amount">{{ formatAmount(account.balance) }}</td>
              <td>{{ formatAmount(account.absoluteTransferLimit) }}</td>
              <td>{{ formatAmount(account.dailyTransferLimit) }}</td>
              <td><Badge :status="account.status ? account.status.toLowerCase() : 'active'" /></td>
              <td>
                <Button label="Edit limits" variant="secondary" size="sm" @click="openEdit(account)" />
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="accounts.length === 0 && !isLoading" class="empty-state">No accounts found.</p>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <Button label="← Previous" variant="secondary" size="sm" :disabled="page === 0" @click="changePage(page - 1)" />
        <span class="pagination-info">{{ page + 1 }} / {{ totalPages }}</span>
        <Button label="Next →" variant="secondary" size="sm" :disabled="page >= totalPages - 1" @click="changePage(page + 1)" />
      </div>
    </div>

    <!-- Edit limits modal -->
    <AppModal v-model="showEditModal" title="Edit account limits">
      <div v-if="editingAccount" class="form-stack">
        <p class="iban-label">{{ editingAccount.iban }}</p>
        <Input v-model="editForm.absoluteTransferLimit" label="Absolute limit (€)" type="number" />
        <Input v-model="editForm.dailyTransferLimit"    label="Daily limit (€)"    type="number" />
        <Select v-model="editForm.status" label="Status" :options="statusOptions" />
        <Alert v-if="editError" type="error" :message="editError" />
        <div class="modal-actions">
          <Button label="Save" variant="primary" size="md" :loading="isSaving" @click="saveAccount" />
          <Button label="Cancel" variant="secondary" size="md" @click="showEditModal = false" />
        </div>
      </div>
    </AppModal>
  </AppShell>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../../../stores/auth.js'
import { getAccounts, updateAccount } from '../../../services/accountService.js'
import AppShell from '../../organisms/AppShell/AppShell.vue'
import Input from '../../atoms/Input/Input.vue'
import Select from '../../atoms/Select/Select.vue'
import Button from '../../atoms/Button/Button.vue'
import Badge from '../../atoms/Badge/Badge.vue'
import Alert from '../../atoms/Alert/Alert.vue'
import AppModal from '../../molecules/AppModal/AppModal.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const accounts = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const ibanSearch = ref('')
const statusFilter = ref('')
const page = ref(0)
const totalPages = ref(0)

const showEditModal = ref(false)
const editingAccount = ref(null)
const isSaving = ref(false)
const editError = ref('')
const editForm = reactive({ absoluteTransferLimit: '', dailyTransferLimit: '', status: 'ACTIVE' })
const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'CLOSED', label: 'Closed' },
]

function formatAmount(n) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n ?? 0)
}

function openEdit(account) {
  editingAccount.value = account
  editForm.absoluteTransferLimit = String(account.absoluteTransferLimit ?? 0)
  editForm.dailyTransferLimit    = String(account.dailyTransferLimit    ?? 0)
  editForm.status = account.status || 'ACTIVE'
  editError.value = ''
  showEditModal.value = true
}

async function saveAccount() {
  try {
    isSaving.value = true
    editError.value = ''
    await updateAccount(editingAccount.value.iban, {
      absoluteTransferLimit: parseFloat(editForm.absoluteTransferLimit),
      dailyTransferLimit:    parseFloat(editForm.dailyTransferLimit),
      status: editForm.status,
    })
    showEditModal.value = false
    await loadAccounts()
  } catch (error) {
    editError.value = error.message
  } finally {
    isSaving.value = false
  }
}

function clearSearch() {
  ibanSearch.value = ''
  statusFilter.value = ''
  page.value = 0
  loadAccounts()
}

function changePage(p) {
  page.value = p
  loadAccounts()
}

async function loadAccounts() {
  try {
    isLoading.value = true
    errorMessage.value = ''
    const data = await getAccounts({
      iban: ibanSearch.value,
      status: statusFilter.value,
      page: page.value,
      size: 15,
      sort: 'createdAt,desc',
    })
    accounts.value = data.content ?? data
    totalPages.value = data.totalPages ?? 1
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

onMounted(loadAccounts)
</script>

<style scoped>
.section-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  overflow: hidden;
}

.filter-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
.table-wrapper { overflow-x: auto; }
.td-mono   { font-family: monospace; font-size: 0.8125rem; }
.td-amount { font-weight: 600; }

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}
.pagination-info { font-size: 0.875rem; color: var(--color-muted); }

.form-stack { display: flex; flex-direction: column; gap: 1rem; }
.iban-label { margin: 0; font-family: monospace; font-size: 0.875rem; color: var(--color-muted); }
.modal-actions { display: flex; gap: 0.75rem; }
.modal-actions > * { flex: 1; }
</style>
