<template>
  <div class="form-field">
    <label v-if="label" :for="id" class="form-field-label">
      {{ label }}<span v-if="required" class="form-field-required">*</span>
    </label>
    <slot />
    <p v-if="error" class="form-field-error">{{ error }}</p>
  </div>
</template>

<script setup>
// Generic field wrapper. Pair it with any input via the default slot.
defineProps({
  label: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  id: { type: String, default: '' },
})
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.form-field-required {
  color: var(--color-danger);
  margin-left: 0.125rem;
}

.form-field-error {
  font-size: 0.75rem;
  color: var(--color-danger);
  margin: 0;
}
</style>
