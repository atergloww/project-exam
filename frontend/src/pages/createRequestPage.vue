<script setup>
import { ref } from 'vue'

const emit = defineEmits(['request-added'])
const loading = ref(false)
const error = ref('')
const success = ref('')

const form = ref({
  name: '',
  date: '',
  payment: ''
})

const handleSubmit = async () => {
  if (!form.value.name || !form.value.date || !form.value.payment) {
    error.value = 'Заполните все поля'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const token = localStorage.getItem('token')
    
    const response = await fetch('http://localhost:5001/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: form.value.name,
        date: form.value.date,
        payment: form.value.payment,
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Ошибка добавления')
    }
    
    form.value.name = ''
    form.value.date = ''
    form.value.payment = ''
    success.value = ''
    
    emit('request-added', data.request)

    success.value = 'Заявка успешно создана'
    
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-[500px] border p-4 mb-4">
    <h3 class="text-lg mb-2">Добавить заявку</h3>
    
    <div class="mb-2">
      <input
        type="text"
        v-model="form.name"
        placeholder="Наименование курса"
        class="border border-gray-300 p-2 w-full"
      />
    </div>
    
    <p>Дата начала обучения</p>
    <div class="mb-2">
      <input
        type="date"
        v-model="form.date"
        class="border border-gray-300 p-2 w-full"
      />
    </div>

    <p>Способ оплаты</p>
    <select
      v-model="form.payment"
      class="mb-2 border border-gray-300 p-2 w-full"
    >
      <option value="" disabled>Выберите способ оплаты</option>
      <option value="card">По карте</option>
      <option value="sbp">По СБП</option>
    </select>
    
    <button
      type="submit"
      :disabled="loading"
      class="bg-blue-500 text-white px-4 py-2 w-full mt-4"
    >
      {{ loading ? 'Добавление...' : 'Добавить' }}
    </button>
    
    <div v-if="error" class="mt-2 text-red-600 text-sm">
      {{ error }}
    </div>

    <div v-if="success" class="mt-3 text-green-600 text-sm">
        {{ success }}
    </div>
  </form>
</template>