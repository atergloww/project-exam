<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import Slider from '../components/slider.vue'

  const images = [
    'src/assets/1.jpg',
    'src/assets/2.jpg',
    'src/assets/3.jpg',
    'src/assets/4.jpg',
  ]

  const router = useRouter()
  const loadingProfile = ref(true)
  const error = ref('')
  const user = ref(null)
  const products = ref([])

  const isAuthenticated = () => {
    return !!localStorage.getItem('token')
  }

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Нет токена авторизации')
      }
      
      const response = await fetch('http://localhost:5001/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка получения профиля')
      }
      
      user.value = data.user
      
    } catch (err) {
      error.value = err.message
      if (err.message === 'Нет токена авторизации') {
        router.push('/login')
      }
    } finally {
      loadingProfile.value = false
    }
  }

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('http://localhost:5001/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        products.value = data.products
      }
      
    } catch (err) {
      console.error('Ошибка загрузки продуктов:', err)
    }
  }

  const handleProductAdded = (newProduct) => {
    products.value.unshift(newProduct)
  }

  const handleProductDeleted = (productId) => {
    products.value = products.value.filter(p => p.id !== productId)
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5001/api/logout', {
        method: 'POST'
      })
      
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
      
    } catch (err) {
      console.error('Ошибка выхода:', err)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }

  onMounted(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    
    fetchProfile()
    fetchProducts()
  })
</script>


<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl">Профиль</h1>
      <button
        @click="handleLogout"
        class="bg-red-500 text-white px-3 py-1"
      >
        Выйти
      </button>
    </div>
    
    <div v-if="loadingProfile" class="mb-6">
      <p>Загрузка профиля...</p>
    </div>
    
    <div v-else-if="error" class="mb-6 text-red-600">
      {{ error }}
    </div>
    
    <div v-else-if="user" class="mb-8">
      <div class="mb-2">
        <div class="text-gray-600 text-sm">Имя</div>
        <div class="text-lg">{{ user.name || '-' }}</div>
      </div>
      
      <div class="mb-2">
        <div class="text-gray-600 text-sm">Почта</div>
        <div class="text-lg">{{ user.email || '-' }}</div>
      </div>

      <div class="mb-2">
        <div class="text-gray-600 text-sm">Телефон</div>
        <div class="text-lg">{{ user.phone || '-' }}</div>
      </div>
    </div>
    
    <hr class="my-6" />


    <a href="/requests" class="bg-blue-500 text-white px-3 py-1">
      Мои заявки
    </a>
    <a href="/create_requests" class="bg-green-500 text-white px-3 py-1 ml-2">
      Создать заявку
    </a>
    
    <Slider class="mt-5" :images="images" />

  </div>
</template>





<!-- <script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const loading = ref(true)
    const error = ref('')
    const user = ref(null)

    // Проверка авторизации
    const isAuthenticated = () => {
        return !!localStorage.getItem('token')
    }

    // Получение профиля
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token')
            
            if (!token) {
                throw new Error('Нет токена авторизации')
            }
            
            const response = await fetch('http://localhost:5001/api/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Ошибка получения профиля')
            }
            
            user.value = data.user
            
        } catch (err) {
            error.value = err.message
            console.error('Ошибка загрузки профиля:', err)
            
            // Если ошибка авторизации, перенаправляем на вход
            if (err.message === 'Нет токена авторизации') {
            router.push('/login')
            }
        } finally {
            loading.value = false
        }
    }

    // Выход
    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5002/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
            })
            
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push('/login')
            
        } catch (err) {
            console.error('Ошибка выхода:', err)
            // Даже при ошибке очищаем localStorage
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push('/login')
        }
    }

    // Загрузка при монтировании
    onMounted(() => {
        if (!isAuthenticated()) {
            router.push('/login')
            return
        }
        
        fetchProfile()
    })
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl">Профиль</h1>
      <button
        @click="handleLogout"
        class="bg-red-500 text-white px-3 py-1"
      >
        Выйти
      </button>
    </div>
    
    <div v-if="loading">
      <p>Загрузка...</p>
    </div>
    
    <div v-else-if="error" class="text-red-600">
      {{ error }}
    </div>
    
    <div v-else-if="user">
      <div class="mb-4">
        <div class="text-gray-600 text-sm">Имя</div>
        <div class="text-lg">{{ user.name || '-' }}</div>
      </div>
      
      <div class="mb-4">
        <div class="text-gray-600 text-sm">Email</div>
        <div class="text-lg">{{ user.email || '-' }}</div>
      </div>
      
      <div class="mb-4">
        <div class="text-gray-600 text-sm">ID</div>
        <div class="text-lg">{{ user.id || '-' }}</div>
      </div>
    </div>
  </div>
</template> -->
