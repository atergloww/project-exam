<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  requests: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['request-deleted', 'requests-loaded'])
const loading = ref(false)
const error = ref(null)
const localRequests = ref([])
const localAllRequests = ref([])

const loadRequests = async () => {
  loading.value = true
  error.value = null
  
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      throw new Error('Не найден токен авторизации. Пожалуйста, войдите в систему.')
    }
    
    console.log('Загружаем заявки...')
    console.log('Token:', token)
    
    const response = await fetch('http://localhost:5001/api/requests', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Статус ответа:', response.status)
    console.log('Заголовки:', response.headers)
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      console.error('Ошибка ответа:', data)
      throw new Error(data.error || `Ошибка загрузки заявок: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Полученные данные:', data)

    localRequests.value = data.requests

    
    emit('requests-loaded', localRequests.value)
    
  } catch (err) {
    console.error('Ошибка в loadRequests:', err)
    error.value = err.message
    alert(err.message)
  } finally {
    loading.value = false
  }
}

const deleteRequest = async (requestId) => {
  if (!confirm('Удалить заявку?')) return
  
  loading.value = true
  
  try {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`http://localhost:5001/api/requests/${requestId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Ошибка удаления')
    }
    
    localRequests.value = localRequests.value.filter(req => req.id !== requestId)
    emit('request-deleted', requestId)
    
  } catch (err) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}

// Загружаем заявки при монтировании компонента
onMounted(() => {
  loadRequests()
})
</script>

<template>
  <div class="p-8">
    <h3 class="text-lg mb-2">Мои заявки</h3>

    <hr class="my-6" />
    
    <div v-if="loading" class="text-gray-500">
      Загрузка...
    </div>
    
    <div v-else-if="error" class="text-red-500">
      Ошибка: {{ error }}
    </div>
    
    <div v-else-if="localRequests.length === 0" class="text-gray-500">
      Нет заявок
    </div>
    
    <div v-else class="space-y-2">
      <div v-for="request in localRequests" :key="request.id" class="border p-3 flex justify-between items-center">
        <div>
          <div class="font-medium">{{ request.name || request.title || 'Без названия' }}</div>
          <div class="text-gray-600">Оплата: {{ request.payment }}</div>
          <div v-if="request.status" class="text-xs text-gray-400 mt-1">Статус: {{ request.status }}</div>

        </div>
        <button
          @click="deleteRequest(request.id)"
          class="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition"
          :disabled="loading"
        >
          Удалить
        </button>
      </div>
    </div>

    <hr class="my-6" />

    <a href="/create_requests" class="inline-block w-[150px] text-center bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">
      Создать заявку
    </a>
  </div>
</template>