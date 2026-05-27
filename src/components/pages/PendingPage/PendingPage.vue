<template>
  <div class="pending-bg">
    <div class="pending-card">
      <div class="pending-icon">{{ pageContent.icon }}</div>
      <h2 class="pending-title">{{ pageContent.title }}</h2>
      <p class="pending-sub">
        {{ pageContent.message }}
      </p>

      <div class="pending-details">
        <p class="pending-details-label">Your details</p>
        <div class="pending-detail-row">
          <span class="pending-detail-key">Name</span>
          <span class="pending-detail-val">{{ user?.firstName }} {{ user?.lastName }}</span>
        </div>
        <div class="pending-detail-row">
          <span class="pending-detail-key">Email</span>
          <span class="pending-detail-val">{{ user?.email }}</span>
        </div>
        <div class="pending-detail-row">
          <span class="pending-detail-key">Status</span>
          <Badge :status="(user?.status || 'pending').toLowerCase()" />
        </div>
      </div>

      <Button label="Logout" variant="danger" size="md" class="btn-full" @click="handleLogout" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.js'
import Badge from '../../atoms/Badge/Badge.vue'
import Button from '../../atoms/Button/Button.vue'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const pageContent = computed(() => {
  if (user.value?.status === 'CLOSED') {
    return {
      icon: '!',
      title: 'Account closed',
      message: 'Your customer profile is closed. Banking and ATM features are unavailable for this account.',
    }
  }
  return {
    icon: '...',
    title: 'Account pending approval',
    message: 'Your account request is being reviewed by an employee. You will not have access to any features until it is approved.',
  }
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.pending-bg {
  min-height: 100vh;
  background-color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.pending-card {
  width: 100%;
  max-width: 26rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.pending-icon {
  font-size: 3rem;
}

.pending-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
}

.pending-sub {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-muted);
  line-height: 1.6;
}

.pending-details {
  width: 100%;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.25rem;
  text-align: left;
}

.pending-details-label {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-muted);
  font-weight: 600;
}

.pending-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.875rem;
}

.pending-detail-row:last-child {
  border-bottom: none;
}

.pending-detail-key {
  color: var(--color-muted);
}

.pending-detail-val {
  font-weight: 500;
  color: var(--color-text);
}

.btn-full {
  width: 100%;
}
</style>
