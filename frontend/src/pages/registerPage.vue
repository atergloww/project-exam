<script setup>
    import { ref, reactive } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const loading = ref(false)
    const error = ref('')
    const success = ref('')

    const form = ref({
        name: '',
        email: '',
        login: '',
        password: '',
        phone: '',
    })

    const validationErrors = reactive({
        name: '',
        password: '',
        email: '',
        login: '',
        phone: ''
    })

    const validateName = () => {
        const cyrillicPattern = /^[А-Яа-яЁё\s]+$/
        
        if (!cyrillicPattern.test(form.value.name)) {
            validationErrors.name = 'Имя должно содержать только буквы кириллицы и пробелы'
            return false
        } else {
            validationErrors.name = ''
            return true
        }
    }

    const validatePassword = () => {
        if (form.value.password.length < 8) {
            validationErrors.password = 'Пароль должен содержать минимум 8 символов'
            return false
        } else {
            validationErrors.password = ''
            return true
        }
    }

    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
        if (!emailPattern.test(form.value.email)) {
            validationErrors.email = 'Введите корректный email адрес'
            return false
        } else {
            validationErrors.email = ''
            return true
        }
    }

    const validateLogin = () => {
        if (form.value.login.length < 3) {
            validationErrors.login = 'Логин должен содержать минимум 3 символа'
            return false
        } else {
            validationErrors.login = ''
            return true
        }
    }

    const validatePhone = () => {
        if (form.value.phone && form.value.phone.length > 0) {
            const phonePattern = /^[\d\s\-+()]+$/
            if (!phonePattern.test(form.value.phone)) {
                validationErrors.phone = 'Введите корректный номер телефона'
                return false
            }
        }
        validationErrors.phone = ''
        return true
    }


    const handleRegister = async () => {
        const validateAll = () => {
          const isNameValid = validateName()
          const isPasswordValid = validatePassword()
          const isEmailValid = validateEmail()
          const isLoginValid = validateLogin()
          const isPhoneValid = validatePhone()
          
          return isNameValid && isPasswordValid && isEmailValid && isLoginValid && isPhoneValid
        }

        if (!validateAll()) {
            error.value = 'Пожалуйста, исправьте ошибки в форме'
            return
        }
        
        loading.value = true
        error.value = ''
        success.value = ''
    
        try {
            const response = await fetch('http://localhost:5001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: form.value.name,
                    email: form.value.email,
                    login: form.value.login,
                    phone: form.value.phone,
                    password: form.value.password
                })
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Ошибка регистрации')
            }
            
            success.value = 'Регистрация успешна! Перенаправляем на вход...'
            
            setTimeout(() => {
                router.push('/login')
            }, 2000)
            
        } catch (err) {
            error.value = err.message
            console.error('Ошибка регистрации:', err)
        } finally {
            loading.value = false
        }
    }
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl mb-4">Регистрация</h1>
    
    <form @submit.prevent="handleRegister" class="max-w-sm">

      <div v-if="error" class="mb-3 text-red-600 text-sm">
        {{ error }}
      </div>

      <div class="mb-3">
        <input
          required
          type="text"
          v-model="form.name"
          placeholder="Имя"
          @blur="validateName"
          :class="{ 'border-red-500': validationErrors.name, 'border-gray-300': !validationErrors.name }"
          class="w-full border p-2"
        />
        <div v-if="validationErrors.name" class="text-red-500 text-xs mt-1">
          {{ validationErrors.name }}
        </div>
      </div>
      
      <div class="mb-3">
        <input
          required
          type="text"
          v-model="form.login"
          placeholder="Логин"
          @blur="validateLogin"
          :class="{ 'border-red-500': validationErrors.login, 'border-gray-300': !validationErrors.login }"
          class="w-full border p-2"
        />
        <div v-if="validationErrors.login" class="text-red-500 text-xs mt-1">
          {{ validationErrors.login }}
        </div>
      </div>
      
      <div class="mb-3">
        <input
          required
          type="password"
          v-model="form.password"
          placeholder="Пароль (минимум 8 символов)"
          @blur="validatePassword"
          :class="{ 'border-red-500': validationErrors.password, 'border-gray-300': !validationErrors.password }"
          class="w-full border p-2"
        />
        <div v-if="validationErrors.password" class="text-red-500 text-xs mt-1">
          {{ validationErrors.password }}
        </div>
      </div>

      <div class="mb-3">
        <input
          required
          type="email"
          v-model="form.email"
          placeholder="Почта"
          @blur="validateEmail"
          :class="{ 'border-red-500': validationErrors.email, 'border-gray-300': !validationErrors.email }"
          class="w-full border p-2"
        />
        <div v-if="validationErrors.email" class="text-red-500 text-xs mt-1">
          {{ validationErrors.email }}
        </div>
      </div>
      
      <div class="mb-3">
        <input
          required
          type="text"
          v-model="form.phone"
          placeholder="Номер телефона"
          @blur="validatePhone"
          :class="{ 'border-red-500': validationErrors.phone, 'border-gray-300': !validationErrors.phone }"
          class="w-full border p-2"
        />
        <div v-if="validationErrors.phone" class="text-red-500 text-xs mt-1">
          {{ validationErrors.phone }}
        </div>
      </div>
      
      <button
        type="submit"
        :disabled="loading"
        class="bg-green-500 text-white px-4 py-2 w-full disabled:bg-green-300"
      >
        {{ loading ? 'Загрузка...' : 'Зарегистрироваться' }}
      </button>
      
      <div v-if="success" class="mt-3 text-green-600 text-sm">
        {{ success }}
      </div>
      
      <div class="mt-3 text-sm">
        Уже есть аккаунт? <router-link to="/login" class="text-blue-500">Войти</router-link>
      </div>
    </form>
  </div>
</template>


<!-- <template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Регистрация</h1>
      
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Имя</label>
          <input
            type="text"
            v-model="form.name"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Иван Иванов"
          />
        </div>
        
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
            minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="********"
          />
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition disabled:opacity-50"
        >
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
        
        <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {{ error }}
        </div>
        
        <div v-if="success" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
          {{ success }}
        </div>
        
        <div class="mt-4 text-center text-sm text-gray-600">
          Уже есть аккаунт?
          <router-link to="/login" class="text-blue-500 hover:underline">
            Войти
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template> -->