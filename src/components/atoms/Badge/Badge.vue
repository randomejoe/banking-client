<template>
  <span :class="['badge', `badge-${status}`]">{{ status }}</span>
</template>

<script setup>
defineProps({
  // Maps directly to a status/type string from the API.
  status: {
    type: String,
    required: true,
    validator: (v) =>
      ['active', 'pending', 'closed', 'transfer', 'deposit', 'withdrawal', 'checking', 'savings', 'ACTIVE', 'PENDING', 'CLOSED'].includes(v),
  },
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.badge-active,
.badge-ACTIVE   { background-color: var(--color-success-soft); color: #16a34a; }
.badge-pending,
.badge-PENDING  { background-color: var(--color-warning-soft); color: #d97706; }
.badge-closed,
.badge-CLOSED   { background-color: var(--color-danger-soft); color: #dc2626; }
.badge-transfer { background-color: var(--color-brand-soft); color: var(--color-brand); }
.badge-deposit  { background-color: var(--color-success-soft); color: #16a34a; }
.badge-withdrawal { background-color: var(--color-warning-soft); color: #d97706; }
.badge-checking { background-color: rgba(139, 92, 246, 0.1); color: #7c3aed; }
.badge-savings  { background-color: var(--color-brand-soft); color: var(--color-brand); }
</style>
