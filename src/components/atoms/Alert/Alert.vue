<template>
  <div :class="['alert', `alert-${type}`]">
    <span class="alert-icon">{{ type === 'success' ? '✓' : '!' }}</span>
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator: (v) => ['success', 'error'].includes(v),
  },
  message: { type: String, required: true },
})
</script>

<style scoped>
.alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  border: 1px solid;
}

.alert-success {
  background-color: var(--color-success-soft);
  border-color: rgba(34, 197, 94, 0.25);
  color: #16a34a;
}

.alert-error {
  background-color: var(--color-danger-soft);
  border-color: rgba(239, 68, 68, 0.25);
  color: #dc2626;
}

.alert-icon {
  font-weight: 700;
  flex-shrink: 0;
}
</style>
