<template>
  <div class="stat-card">
    <div class="stat-card-body">
      <p class="stat-card-title">{{ title }}</p>
      <p class="stat-card-value">{{ value }}</p>
      <p v-if="sub" class="stat-card-sub">{{ sub }}</p>
    </div>
    <div class="stat-card-icon" :style="{ backgroundColor: iconBg }">
      <span class="stat-card-icon-text" :style="{ color: color }">{{ icon }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, default: '◆' },   // Unicode / emoji icon
  color: { type: String, default: '#057AFF' },
  sub: { type: String, default: '' },
})

// Creates a soft translucent background from the icon colour.
const iconBg = computed(() => {
  return props.color + '18' // adds ~10% alpha
})
</script>

<style scoped>
.stat-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.stat-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-card-title {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-muted);
}

.stat-card-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
}

.stat-card-sub {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-muted);
}

.stat-card-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card-icon-text {
  font-size: 1.125rem;
  line-height: 1;
}
</style>
