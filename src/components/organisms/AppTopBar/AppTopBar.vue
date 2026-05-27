<template>
  <header class="topbar">
    <div>
      <h1 class="topbar-title">{{ title }}</h1>
      <p v-if="subtitle" class="topbar-subtitle">{{ subtitle }}</p>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<style scoped>
.topbar {
  height: 4rem;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 2rem;
}

.topbar-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.topbar-subtitle {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-muted);
}
</style>
