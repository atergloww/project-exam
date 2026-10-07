<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const loading = ref(false)
    const error = ref('')

    const form = ref({
      login: '',
      password: ''
    })

    const handleLogin = async () => {
        loading.value = true
        error.value = ''
    
        try {
            const response = await fetch('http://localhost:5001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: form.value.login,
                password: form.value.password
            })
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Ошибка входа')
            }
            
            if (data.token) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
            }
            
            router.push('/profile')
            
        } catch (err) {
            error.value = err.message
            console.error('Ошибка входа:', err)
        } finally {
            loading.value = false
        }
    }
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl mb-4">Вход</h1>
    
    <form @submit.prevent="handleLogin" class="max-w-sm">

        <div v-if="error" class="mt-3 text-red-600 text-sm">
            {{ error }}
        </div>

      <div class="mb-3">
        <input
          required
          type="text"
          v-model="form.login"
          placeholder="Логин"
          class="w-full border border-gray-300 p-2"
        />
      </div>
      
      <div class="mb-3">
        <input
          required
          type="password"
          v-model="form.password"
          placeholder="Пароль"
          class="w-full border border-gray-300 p-2"
        />
      </div>
      
      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-500 text-white px-4 py-2 w-full"
      >
        {{ loading ? 'Загрузка...' : 'Войти' }}
      </button>
      
      <div class="mt-3 text-sm">
        Еще не зарегистрированы? <router-link to="/register" class="text-blue-500">Регистрация</router-link>
      </div>
    </form>
  </div>
</template>



<!-- <template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Вход</h1>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            v-model="form.email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="example@mail.com"
          />
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">Пароль</label>
          <input
            type="password"
            v-model="form.password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="********"
          />
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
        >
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
        
        <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {{ error }}
        </div>
        
        <div class="mt-4 text-center text-sm text-gray-600">
          Нет аккаунта?
          <router-link to="/register" class="text-blue-500 hover:underline">
            Зарегистрироваться
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template> -->