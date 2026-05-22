<template>
  <button
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-else>{{ label }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost', 'danger'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  type: { type: String, default: 'button' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

defineEmits(['click'])

const classes = computed(() => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }
  const sizes = { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg' }
  const isDisabled = props.disabled || props.loading ? 'btn-disabled' : ''
  return ['btn', variants[props.variant], sizes[props.size], isDisabled].filter(Boolean).join(' ')
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, opacity 0.15s ease;
  white-space: nowrap;
}

.btn-primary { background-color: var(--color-brand); color: #fff; }
.btn-primary:hover:not(:disabled) { background-color: var(--color-brand-hover); }

.btn-secondary { background-color: var(--color-sidebar); color: var(--color-text); }
.btn-secondary:hover:not(:disabled) { background-color: #dde3ec; }

.btn-ghost { background-color: transparent; color: var(--color-text); }
.btn-ghost:hover:not(:disabled) { background-color: var(--color-sidebar); }

.btn-danger { background-color: var(--color-danger); color: #fff; }
.btn-danger:hover:not(:disabled) { background-color: #dc2626; }

.btn-sm { padding: 0.375rem 0.75rem; font-size: 0.8125rem; }
.btn-md { padding: 0.625rem 1rem; font-size: 0.875rem; }
.btn-lg { padding: 0.75rem 1.5rem; font-size: 0.9375rem; }

.btn-disabled { opacity: 0.5; cursor: not-allowed; }

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
