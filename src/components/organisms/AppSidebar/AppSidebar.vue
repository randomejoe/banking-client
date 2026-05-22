<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon">🏦</div>
      <span class="sidebar-logo-text">FHJ Bank</span>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="sidebar-link"
        :class="{ 'sidebar-link-active': isActive(item.path) }"
      >
        <span class="sidebar-link-icon">{{ item.icon }}</span>
        {{ item.label }}
      </RouterLink>
    </nav>

    <!-- User info + logout -->
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <p class="sidebar-user-name">{{ user?.firstName }} {{ user?.lastName }}</p>
        <p class="sidebar-user-role">{{ user?.role?.toLowerCase() }}</p>
      </div>
      <button class="sidebar-logout" type="button" @click="$emit('logout')">
        ⎋ Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const props = defineProps({
  role: { type: String, required: true },
  user: { type: Object, default: null },
})

defineEmits(['logout'])

const route = useRoute()

const customerNav = [
  { label: 'Dashboard',    path: '/customer/dashboard',   icon: '⊞' },
  { label: 'Account',      path: '/customer/account',     icon: '💳' },
  { label: 'Transfer',     path: '/customer/transfer',    icon: '⇄' },
  { label: 'Transactions', path: '/customer/transactions', icon: '☰' },
  { label: 'Search IBAN',  path: '/customer/search-iban', icon: '🔍' },
]

const employeeNav = [
  { label: 'Dashboard',    path: '/employee/dashboard',   icon: '⊞' },
  { label: 'Approvals',    path: '/employee/approvals',   icon: '✓' },
  { label: 'Customers',    path: '/employee/customers',   icon: '👥' },
  { label: 'Accounts',     path: '/employee/accounts',    icon: '💳' },
  { label: 'Transfer',     path: '/employee/transfer',    icon: '⇄' },
  { label: 'Transactions', path: '/employee/transactions', icon: '☰' },
]

const navItems = computed(() => {
  return props.role === 'EMPLOYEE' ? employeeNav : customerNav
})

function isActive(path) {
  return route.path === path
}
</script>

<style scoped>
.sidebar {
  width: 15rem;
  min-height: 100vh;
  background-color: var(--color-sidebar);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.sidebar-logo-icon {
  width: 2rem;
  height: 2rem;
  background-color: var(--color-brand);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.sidebar-logo-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.sidebar-nav {
  flex: 1;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.sidebar-link:hover {
  background-color: #dde3ec;
}

.sidebar-link-active {
  background-color: var(--color-brand);
  color: #ffffff;
}

.sidebar-link-active:hover {
  background-color: var(--color-brand-hover);
}

.sidebar-link-icon {
  font-size: 1rem;
  width: 1.25rem;
  text-align: center;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid var(--color-border);
}

.sidebar-user {
  padding: 0.5rem 0.75rem 0.75rem;
}

.sidebar-user-name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-user-role {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-muted);
  text-transform: capitalize;
}

.sidebar-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border: none;
  border-radius: 0.625rem;
  background: transparent;
  color: var(--color-danger);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.sidebar-logout:hover {
  background-color: var(--color-danger-soft);
}
</style>
