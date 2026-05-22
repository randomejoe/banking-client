import Badge from './Badge.vue'

export default {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['active', 'pending', 'closed', 'transfer', 'deposit', 'withdrawal', 'checking', 'savings'],
    },
  },
}

export const Active     = { args: { status: 'active' } }
export const Pending    = { args: { status: 'pending' } }
export const Closed     = { args: { status: 'closed' } }
export const Transfer   = { args: { status: 'transfer' } }
export const Deposit    = { args: { status: 'deposit' } }
export const Withdrawal = { args: { status: 'withdrawal' } }
export const Checking   = { args: { status: 'checking' } }
export const Savings    = { args: { status: 'savings' } }
