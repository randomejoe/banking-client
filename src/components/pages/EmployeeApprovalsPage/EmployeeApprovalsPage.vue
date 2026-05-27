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
                    @click="startApprove(customer)"
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

    <!-- Approve confirm modal -->
    <AppModal v-model="showApproveModal" title="Approve customer">
      <div v-if="selectedCustomer" class="form-stack">
        <p class="modal-text">
          Set the limits that will be applied to the new checking and savings accounts for
          {{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }}.
        </p>
        <Input v-model="approvalForm.absoluteTransferLimit" label="Absolute limit (€)" type="number" />
        <Input v-model="approvalForm.dailyTransferLimit" label="Daily limit (€)" type="number" />
        <Alert v-if="approvalError" type="error" :message="approvalError" />
        <div class="modal-actions">
          <Button label="Confirm approval" variant="primary" size="md" :loading="isSavingApproval" @click="confirmApprove" />
          <Button label="Cancel" variant="secondary" size="md" @click="showApproveModal = false" />
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
import Input from '../../atoms/Input/Input.vue'
import Alert from '../../atoms/Alert/Alert.vue'
import AppModal from '../../molecules/AppModal/AppModal.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const customers = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const showDetail = ref(false)
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const selectedCustomer = ref(null)
const approvalForm = ref({ absoluteTransferLimit: '1000.00', dailyTransferLimit: '500.00' })
const approvalError = ref('')
const isSavingApproval = ref(false)

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

function startApprove(customer) {
  selectedCustomer.value = customer
  approvalForm.value = { absoluteTransferLimit: '1000.00', dailyTransferLimit: '500.00' }
  approvalError.value = ''
  showApproveModal.value = true
}

function validateApprovalLimits() {
  const absoluteTransferLimit = parseFloat(approvalForm.value.absoluteTransferLimit)
  const dailyTransferLimit = parseFloat(approvalForm.value.dailyTransferLimit)

  if (Number.isNaN(absoluteTransferLimit) || absoluteTransferLimit < 0) {
    return 'Absolute limit must be zero or greater.'
  }
  if (Number.isNaN(dailyTransferLimit) || dailyTransferLimit < 0) {
    return 'Daily limit must be zero or greater.'
  }
  return ''
}

async function confirmApprove() {
  try {
    const validationError = validateApprovalLimits()
    if (validationError) {
      approvalError.value = validationError
      return
    }

    isSavingApproval.value = true
    approvalError.value = ''
    await updateCustomer(selectedCustomer.value.id, {
      status: 'ACTIVE',
      absoluteTransferLimit: parseFloat(approvalForm.value.absoluteTransferLimit),
      dailyTransferLimit: parseFloat(approvalForm.value.dailyTransferLimit),
    })
    showApproveModal.value = false
    await loadCustomers()
  } catch (error) {
    approvalError.value = error.message
  } finally {
    isSavingApproval.value = false
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
    const data = await getCustomers({ status: 'PENDING', size: 50, sort: 'createdAt,asc' })
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

.form-stack { display: flex; flex-direction: column; gap: 1rem; }

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
