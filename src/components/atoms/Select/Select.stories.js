import Select from './Select.vue'

export default {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs'],
}

const accountOptions = [
  { value: 'NL91ABNA0417164300', label: 'NL91ABNA0417164300 (checking)' },
  { value: 'NL20INGB0001234567', label: 'NL20INGB0001234567 (savings)' },
]

export const Default = { args: { label: 'From account', options: accountOptions, modelValue: '', placeholder: 'Select account' } }
export const WithValue = { args: { label: 'From account', options: accountOptions, modelValue: 'NL91ABNA0417164300' } }
