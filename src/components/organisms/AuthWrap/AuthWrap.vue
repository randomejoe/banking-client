<template>
  <div class="auth-bg">
    <div class="auth-container">
      <div class="auth-logo">
        <div class="auth-logo-icon">🏦</div>
        <span class="auth-logo-text">FHJ Bank</span>
      </div>
      <div class="auth-card">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
// Centered layout for auth screens (login, register, pending).
</script>

<style scoped>
.auth-bg {
  min-height: 100vh;
  background-color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-container {
  width: 100%;
  max-width: 28rem;
}

.auth-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  margin-bottom: 2rem;
}

.auth-logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--color-brand);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.auth-logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
}

.auth-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1.25rem;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
</style>
