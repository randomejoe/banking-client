<template>
  <div class="shell">
    <AppSidebar :role="role" :user="user" @logout="handleLogout" />
    <div class="shell-content">
      <AppTopBar :title="title" :subtitle="subtitle" />
      <main class="shell-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.js'
import AppSidebar from '../AppSidebar/AppSidebar.vue'
import AppTopBar from '../AppTopBar/AppTopBar.vue'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  role: { type: String, required: true },
  user: { type: Object, default: null },
})

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.shell {
  display: flex;
  min-height: 100vh;
}

.shell-content {
  flex: 1;
  margin-left: 15rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.shell-main {
  flex: 1;
  padding: 2rem;
}
</style>
