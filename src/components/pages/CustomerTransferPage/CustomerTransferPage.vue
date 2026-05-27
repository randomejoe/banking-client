<template>
  <AppShell title="Transfer" subtitle="Move money between accounts" role="CUSTOMER" :user="user">
    <div class="transfer-wrap">
      <div class="section-card">
        <h3 class="card-title">New transfer</h3>

        <div class="form-stack">
          <!-- From account -->
          <Select
            v-model="fromIban"
            label="From account"
            :options="accountOptions"
            placeholder="Select account"
          />

          <!-- Account info bar -->
          <div v-if="fromAccount" class="info-bar">
            <span>Balance: <strong>{{ formatAmount(fromAccount.balance) }}</strong></span>
            <span>Daily remaining: <strong>{{ formatAmount(fromAccount.dailyTransferLimit - usedToday) }}</strong></span>
          </div>

          <!-- Transfer type toggle -->
          <div class="field-group">
            <label class="field-label">Transfer type</label>
            <div class="toggle-row">
              <button
                class="toggle-btn"
                :class="{ active: transferType === 'other' }"
                type="button"
                @click="transferType = 'other'"
              >Other person</button>
              <button
                class="toggle-btn"
                :class="{ active: transferType === 'own' }"
                type="button"
                @click="transferType = 'own'"
              >Own account</button>
            </div>
          </div>

          <!-- Destination -->
          <Select
            v-if="transferType === 'own'"
            v-model="toIban"
            label="To account"
            :options="otherAccountOptions"
            placeholder="Select account"
          />
          <Input
            v-else
            v-model="toIban"
            label="To IBAN"
            placeholder="NL00BANK0000000000"
            :error="errors.toIban"
          />

          <!-- Amount -->
          <div class="field-group">
            <label class="field-label">Amount</label>
            <div class="amount-wrapper">
              <span class="amount-prefix">€</span>
              <input
                v-model="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="amount-input"
              />
            </div>
            <p v-if="errors.amount" class="field-error">{{ errors.amount }}</p>
          </div>

          <Input v-model="description" label="Description" placeholder="Optional note" />

          <Alert v-if="feedback.message" :type="feedback.type" :message="feedback.message" />

          <Button
            label="Confirm transfer"
            variant="primary"
            size="lg"
            :loading="isLoading"
            :disabled="isLoading"
            class="btn-full"
            @click="handleTransfer"
          />
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../../stores/auth.js'
import { getAccounts } from '../../../services/accountService.js'
import { createTransaction } from '../../../services/transactionService.js'
import AppShell from '../../organisms/AppShell/AppShell.vue'
import Select from '../../atoms/Select/Select.vue'
import Input from '../../atoms/Input/Input.vue'
import Button from '../../atoms/Button/Button.vue'
import Alert from '../../atoms/Alert/Alert.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const accounts = ref([])
const fromIban = ref('')
const toIban = ref('')
const amount = ref('')
const description = ref('')
const transferType = ref('other')
const isLoading = ref(false)
const errors = ref({})
const feedback = ref({ type: 'success', message: '' })
const usedToday = ref(0) // ideally fetched from API

const fromAccount = computed(() => accounts.value.find(a => a.iban === fromIban.value))

const accountOptions = computed(() =>
  accounts.value.map(a => ({ value: a.iban, label: `${a.iban} (${formatAmount(a.balance)})` }))
)

const otherAccountOptions = computed(() =>
  accounts.value
    .filter(a => a.iban !== fromIban.value)
    .map(a => ({ value: a.iban, label: `${a.iban} (${a.type})` }))
)

function formatAmount(n) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n ?? 0)
}

function validate() {
  const e = {}
  const amt = parseFloat(amount.value)
  if (!amt || amt <= 0) e.amount = 'Enter a valid amount'
  if (transferType.value === 'other' && !toIban.value) e.toIban = 'IBAN is required'
  return e
}

async function handleTransfer() {
  errors.value = validate()
  if (Object.keys(errors.value).length > 0) return

  try {
    isLoading.value = true
    feedback.value.message = ''

    await createTransaction({
      fromIban: fromIban.value,
      toIban: toIban.value,
      amount: parseFloat(amount.value),
      description: description.value,
      type: 'TRANSFER',
    })

    feedback.value = { type: 'success', message: `Transfer of ${formatAmount(parseFloat(amount.value))} submitted successfully.` }
    amount.value = ''
    description.value = ''
    toIban.value = ''
  } catch (error) {
    feedback.value = { type: 'error', message: error.message }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  try {
    const data = await getAccounts()
    accounts.value = data.content ?? data
    if (accounts.value.length > 0) fromIban.value = accounts.value[0].iban
  } catch (error) {
    feedback.value = { type: 'error', message: error.message }
  }
})
</script>

<style scoped>
.transfer-wrap {
  max-width: 36rem;
}

.section-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
}

.card-title {
  margin: 0 0 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-bar {
  display: flex;
  gap: 1.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--color-bg);
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-muted);
}

.field-group { display: flex; flex-direction: column; gap: 0.375rem; }
.field-label { font-size: 0.875rem; font-weight: 500; color: var(--color-text); }
.field-error { margin: 0; font-size: 0.75rem; color: var(--color-danger); }

.toggle-row { display: flex; gap: 0.5rem; }
.toggle-btn {
  flex: 1;
  padding: 0.625rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}
.toggle-btn.active {
  background-color: var(--color-brand);
  border-color: var(--color-brand);
  color: #fff;
}

.amount-wrapper {
  position: relative;
}
.amount-prefix {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-muted);
  font-weight: 500;
  pointer-events: none;
}
.amount-input {
  width: 100%;
  padding: 0.75rem 0.875rem 0.75rem 2rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 1.25rem;
  font-weight: 600;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.amount-input:focus {
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px var(--color-brand-soft);
}

.btn-full { width: 100%; }
</style>
