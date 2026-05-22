<template>
  <AppShell title="Customers" subtitle="View and manage all registered customers" role="EMPLOYEE" :user="user">
    <!-- Search + filter bar -->
    <div class="filter-bar">
      <div class="filter-grid">
        <Input v-model="search" label="Search by name or email" placeholder="Alice…" />
        <Select v-model="statusFilter" label="Status" :options="statusOptions" placeholder="All statuses" />
      </div>
      <div class="filter-actions">
        <Button label="Search" variant="primary" size="sm" :loading="isLoading" @click="loadCustomers" />
        <Button label="Clear" variant="ghost" size="sm" @click="clearFilters" />
      </div>
    </div>

    <div class="section-card">
      <p v-if="isLoading" class="status-msg">Loading…</p>
      <p v-if="errorMessage" class="status-msg" style="color: var(--color-danger)">{{ errorMessage }}</p>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>BSN</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in customers" :key="c.id">
              <td class="td-name">{{ c.firstName }} {{ c.lastName }}</td>
              <td>{{ c.email }}</td>
              <td class="td-mono">{{ c.bsn }}</td>
              <td><Badge :status="(c.status || 'pending').toLowerCase()" /></td>
              <td>
                <Button
                  label="View details"
                  variant="secondary"
                  size="sm"
                  @click="router.push(`/employee/customers/${c.id}`)"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="customers.length === 0 && !isLoading" class="empty-state">No customers found.</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <Button label="← Previous" variant="secondary" size="sm" :disabled="page === 0" @click="changePage(page - 1)" />
        <span class="pagination-info">{{ page + 1 }} / {{ totalPages }}</span>
        <Button label="Next →" variant="secondary" size="sm" :disabled="page >= totalPages - 1" @click="changePage(page + 1)" />
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.js'
import { getCustomers } from '../../../services/userService.js'
import AppShell from '../../organisms/AppShell/AppShell.vue'
import Input from '../../atoms/Input/Input.vue'
import Select from '../../atoms/Select/Select.vue'
import Button from '../../atoms/Button/Button.vue'
import Badge from '../../atoms/Badge/Badge.vue'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const customers = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const search = ref('')
const statusFilter = ref('')
const page = ref(0)
const totalPages = ref(0)

const statusOptions = [
  { value: 'ACTIVE',  label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CLOSED',  label: 'Closed' },
]

function clearFilters() {
  search.value = ''
  statusFilter.value = ''
  page.value = 0
  loadCustomers()
}

function changePage(p) {
  page.value = p
  loadCustomers()
}

async function loadCustomers() {
  try {
    isLoading.value = true
    errorMessage.value = ''
    const data = await getCustomers({ search: search.value, status: statusFilter.value, page: page.value, size: 15 })
    customers.value = data.content ?? data
    totalPages.value = data.totalPages ?? 1
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

onMounted(loadCustomers)
</script>

<style scoped>
.section-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  overflow: hidden;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.table-wrapper { overflow-x: auto; }
.td-name { font-weight: 500; }
.td-mono { font-family: monospace; font-size: 0.8125rem; }

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
