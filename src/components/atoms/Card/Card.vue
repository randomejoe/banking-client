<template>
  <div class="card">
    <slot />
  </div>
</template>

<script setup>
// Simple card wrapper — all styling lives in the parent via scoped or global CSS.
// Use the `class` attribute to add spacing: <Card class="p-6">.
</script>

<style scoped>
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
</style>
