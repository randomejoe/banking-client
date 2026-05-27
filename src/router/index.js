import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

import LoginPage from '../components/pages/LoginPage/LoginPage.vue'
import RegisterPage from '../components/pages/RegisterPage/RegisterPage.vue'
import PendingPage from '../components/pages/PendingPage/PendingPage.vue'

import CustomerDashboardPage from '../components/pages/CustomerDashboardPage/CustomerDashboardPage.vue'
import CustomerAccountPage from '../components/pages/CustomerAccountPage/CustomerAccountPage.vue'
import CustomerTransferPage from '../components/pages/CustomerTransferPage/CustomerTransferPage.vue'
import CustomerTransactionsPage from '../components/pages/CustomerTransactionsPage/CustomerTransactionsPage.vue'
import CustomerSearchIbanPage from '../components/pages/CustomerSearchIbanPage/CustomerSearchIbanPage.vue'

import EmployeeDashboardPage from '../components/pages/EmployeeDashboardPage/EmployeeDashboardPage.vue'
import EmployeeApprovalsPage from '../components/pages/EmployeeApprovalsPage/EmployeeApprovalsPage.vue'
import EmployeeCustomersPage from '../components/pages/EmployeeCustomersPage/EmployeeCustomersPage.vue'
import EmployeeCustomerDetailPage from '../components/pages/EmployeeCustomerDetailPage/EmployeeCustomerDetailPage.vue'
import EmployeeAccountsPage from '../components/pages/EmployeeAccountsPage/EmployeeAccountsPage.vue'
import EmployeeTransferPage from '../components/pages/EmployeeTransferPage/EmployeeTransferPage.vue'
import EmployeeAllTransactionsPage from '../components/pages/EmployeeAllTransactionsPage/EmployeeAllTransactionsPage.vue'

import AtmLoginPage from '../components/pages/AtmLoginPage/AtmLoginPage.vue'
import AtmMenuPage from '../components/pages/AtmMenuPage/AtmMenuPage.vue'
import AtmDepositPage from '../components/pages/AtmDepositPage/AtmDepositPage.vue'
import AtmWithdrawPage from '../components/pages/AtmWithdrawPage/AtmWithdrawPage.vue'

const routes = [
  { path: '/', redirect: '/login' },

  // Auth
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },
  { path: '/pending', name: 'pending', component: PendingPage, meta: { requiresAuth: true } },

  // Customer
  { path: '/customer/dashboard', name: 'customer-dashboard', component: CustomerDashboardPage, meta: { requiresAuth: true, role: 'CUSTOMER' } },
  { path: '/customer/account', name: 'customer-account', component: CustomerAccountPage, meta: { requiresAuth: true, role: 'CUSTOMER' } },
  { path: '/customer/transfer', name: 'customer-transfer', component: CustomerTransferPage, meta: { requiresAuth: true, role: 'CUSTOMER' } },
  { path: '/customer/transactions', name: 'customer-transactions', component: CustomerTransactionsPage, meta: { requiresAuth: true, role: 'CUSTOMER' } },
  { path: '/customer/search-iban', name: 'customer-search-iban', component: CustomerSearchIbanPage, meta: { requiresAuth: true, role: 'CUSTOMER' } },

  // Employee
  { path: '/employee/dashboard', name: 'employee-dashboard', component: EmployeeDashboardPage, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/employee/approvals', name: 'employee-approvals', component: EmployeeApprovalsPage, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/employee/customers', name: 'employee-customers', component: EmployeeCustomersPage, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/employee/customers/:id', name: 'employee-customer-detail', component: EmployeeCustomerDetailPage, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/employee/accounts', name: 'employee-accounts', component: EmployeeAccountsPage, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/employee/transfer', name: 'employee-transfer', component: EmployeeTransferPage, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/employee/transactions', name: 'employee-transactions', component: EmployeeAllTransactionsPage, meta: { requiresAuth: true, role: 'EMPLOYEE' } },

  // ATM
  { path: '/atm', name: 'atm-login', component: AtmLoginPage },
  { path: '/atm/menu', name: 'atm-menu', component: AtmMenuPage, meta: { requiresAtm: true } },
  { path: '/atm/deposit', name: 'atm-deposit', component: AtmDepositPage, meta: { requiresAtm: true } },
  { path: '/atm/withdraw', name: 'atm-withdraw', component: AtmWithdrawPage, meta: { requiresAtm: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // ATM session guard: ATM stores its token separately
  if (to.meta.requiresAtm && !sessionStorage.getItem('atm-token')) {
    return { name: 'atm-login' }
  }

  // Public routes
  if (!to.meta.requiresAuth) return true

  // Not logged in
  if (!authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Load user if missing
  if (!authStore.user) {
    try {
      await authStore.loadCurrentUser()
    } catch {
      authStore.logout()
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }

  const user = authStore.user

  // Customers without an active profile can only see the limited-access page.
  if (user?.role === 'CUSTOMER' && user?.status !== 'ACTIVE' && to.name !== 'pending') {
    return { name: 'pending' }
  }

  // Role guard
  if (to.meta.role && user?.role !== to.meta.role) {
    if (user?.role === 'EMPLOYEE') return { name: 'employee-dashboard' }
    if (user?.role === 'CUSTOMER') return { name: 'customer-dashboard' }
    return { name: 'login' }
  }

  return true
})

export default router
