import Button from './Button.vue'

export default {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export const Primary = { args: { label: 'Confirm transfer', variant: 'primary', size: 'md' } }
export const Secondary = { args: { label: 'Cancel', variant: 'secondary', size: 'md' } }
export const Ghost = { args: { label: 'View details', variant: 'ghost', size: 'md' } }
export const Danger = { args: { label: 'Reject', variant: 'danger', size: 'md' } }
export const Large = { args: { label: 'Sign in', variant: 'primary', size: 'lg' } }
export const Small = { args: { label: 'Use IBAN', variant: 'secondary', size: 'sm' } }
export const Loading = { args: { label: 'Signing in…', variant: 'primary', size: 'md', loading: true } }
