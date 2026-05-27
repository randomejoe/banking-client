<template>
  <div class="input-field">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}<span v-if="required" class="input-required">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="['input', error ? 'input-error' : '']"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" class="input-error-msg">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: () => `input-${Math.random().toString(36).slice(2, 7)}` },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.input-required {
  color: var(--color-danger);
  margin-left: 0.125rem;
}

.input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input::placeholder {
  color: var(--color-muted);
}

.input:focus {
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px var(--color-brand-soft);
}

.input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--color-bg);
}

.input.input-error {
  border-color: var(--color-danger);
}

.input.input-error:focus {
  box-shadow: 0 0 0 3px var(--color-danger-soft);
}

.input-error-msg {
  font-size: 0.75rem;
  color: var(--color-danger);
  margin: 0;
}
</style>
