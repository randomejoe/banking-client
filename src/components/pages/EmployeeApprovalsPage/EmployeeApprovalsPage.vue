<template>
  <AppShell title="Approvals" subtitle="Review pending customer registrations" role="EMPLOYEE" :user="user">
    <p v-if="isLoading" class="status-msg">Loading…</p>
    <p v-if="errorMessage" class="status-msg" style="color: var(--color-danger)">{{ errorMessage }}</p>

    <div class="section-card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer.id">
              <td class="td-name">{{ customer.firstName }} {{ customer.lastName }}</td>
              <td>{{ customer.email }}</td>
              <td><Badge :status="(customer.status || 'pending').toLowerCase()" /></td>
              <td>
                <div class="action-row">
                  <Button label="View" variant="secondary" size="sm" @click="openDetail(customer)" />
                  <Button
                    v-if="customer.status === 'PENDING'"
                    label="Approve"
                    variant="primary"
                    size="sm"
                    @click="handleApprove(customer)"
                  />
                  <Button
                    v-if="customer.status === 'PENDING'"
                    label="Reject"
                    variant="danger"
                    size="sm"
                    @click="startReject(customer)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="customers.length === 0 && !isLoading" class="empty-state">No customers found.</p>
      </div>
    </div>

    <!-- Detail modal -->
    <AppModal v-model="showDetail" title="Customer details">
      <div v-if="selectedCustomer" class="detail-rows">
        <div class="detail-row" v-for="field in detailFields" :key="field.label">
          <span class="detail-key">{{ field.label }}</span>
          <span class="detail-val">{{ field.value }}</span>
        </div>
      </div>
    </AppModal>

    <!-- Reject confirm modal -->
    <AppModal v-model="showRejectModal" title="Reject customer">
      <p class="modal-text">Are you sure you want to reject this customer's request? This cannot be undone.</p>
      <div class="modal-actions">
        <Button label="Confirm reject" variant="danger" size="md" @click="confirmReject" />
        <Button label="Cancel" variant="secondary" size="md" @click="showRejectModal = false" />
      </div>
    </AppModal>
  </AppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../../stores/auth.js'
import { getCustomers, getCustomerById, updateCustomer } from '../../../services/userService.js'
import AppShell from '../../organisms/AppShell/AppShell.vue'
import Badge from '../../atoms/Badge/Badge.vue'
import Button from '../../atoms/Button/Button.vue'
import AppModal from '../../molecules/AppModal/AppModal.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const customers = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const showDetail = ref(false)
const showRejectModal = ref(false)
const selectedCustomer = ref(null)

const detailFields = computed(() => {
  const c = selectedCustomer.value
  if (!c) return []
  return [
    { label: 'Name',   value: `${c.firstName} ${c.lastName}` },
    { label: 'Email',  value: c.email },
    { label: 'BSN',    value: c.bsn || '—' },
    { label: 'Phone',  value: c.phoneNumber || '—' },
    { label: 'Status', value: c.status },
  ]
})

async function openDetail(customer) {
  showDetail.value = true
  selectedCustomer.value = customer
  try {
    // Fetch full detail (has bsn, phoneNumber) since list only returns summary
    const detail = await getCustomerById(customer.id)
    selectedCustomer.value = detail
  } catch {
    // keep the summary data if detail fetch fails
  }
}

function startReject(customer) {
  selectedCustomer.value = customer
  showRejectModal.value = true
}

async function handleApprove(customer) {
  try {
    await updateCustomer(customer.id, { status: 'ACTIVE' })
    await loadCustomers()
  } catch (error) {
    errorMessage.value = error.message
  }
}

async function confirmReject() {
  try {
    await updateCustomer(selectedCustomer.value.id, { status: 'CLOSED' })
    showRejectModal.value = false
    await loadCustomers()
  } catch (error) {
    errorMessage.value = error.message
  }
}

async function loadCustomers() {
  try {
    isLoading.value = true
    errorMessage.value = ''
    const data = await getCustomers({ size: 50 })
    customers.value = data.content ?? data
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

.table-wrapper { overflow-x: auto; }

.td-name { font-weight: 500; }
.td-mono { font-family: monospace; font-size: 0.8125rem; }

.action-row {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.detail-rows { display: flex; flex-direction: column; }
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.875rem;
}
.detail-row:last-child { border-bottom: none; }
.detail-key { color: var(--color-muted); }
.detail-val { font-weight: 500; color: var(--color-text); }

.modal-text { margin: 0 0 1.25rem; font-size: 0.875rem; color: var(--color-muted); }
.modal-actions { display: flex; gap: 0.75rem; }
.modal-actions > * { flex: 1; }
</style>
