<template>
  <tr class="tx-row">
    <td class="tx-cell tx-date">{{ formatDate(transaction.timestamp) }}</td>
    <td class="tx-cell">
      <Badge :status="transaction.type ? transaction.type.toLowerCase() : 'transfer'" />
    </td>
    <td class="tx-cell tx-iban">{{ shortIban(transaction.fromIban) }}</td>
    <td class="tx-cell tx-iban">{{ shortIban(transaction.toIban) }}</td>
    <td class="tx-cell tx-amount">{{ formatAmount(transaction.amount) }}</td>
    <td v-if="showInitiatedBy" class="tx-cell tx-muted">{{ transaction.initiatedByUserId }}</td>
  </tr>
</template>

<script setup>
import Badge from '../../atoms/Badge/Badge.vue'

defineProps({
  transaction: { type: Object, required: true },
  showInitiatedBy: { type: Boolean, default: false },
})

function formatAmount(amount) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount)
}

function shortIban(iban) {
  if (!iban) return '—'
  return iban.length > 8 ? '…' + iban.slice(-8) : iban
}

function formatDate(timestamp) {
  if (!timestamp) return '—'
  return new Date(timestamp).toLocaleDateString('nl-NL', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
</script>

<style scoped>
.tx-row:nth-child(even) {
  background-color: var(--color-row-alt);
}

.tx-cell {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.875rem;
  color: var(--color-text);
  vertical-align: middle;
}

.tx-date   { font-size: 0.8125rem; color: var(--color-muted); white-space: nowrap; }
.tx-iban   { font-family: monospace; font-size: 0.8125rem; }
.tx-amount { font-weight: 600; white-space: nowrap; }
.tx-muted  { font-size: 0.8125rem; color: var(--color-muted); }
</style>
