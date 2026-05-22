import Input from './Input.vue'

export default {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
}

export const Default = { args: { label: 'Email', placeholder: 'you@example.com', modelValue: '' } }
export const WithError = { args: { label: 'IBAN', placeholder: 'NL00BANK0000000000', modelValue: '', error: 'Invalid IBAN format' } }
export const Required = { args: { label: 'BSN', placeholder: '123456789', modelValue: '', required: true } }
export const Password = { args: { label: 'Password', type: 'password', placeholder: '••••••••', modelValue: '' } }
