<template>
<div class="relative w-[400px] h-[200px]">
    <div class="overflow-hidden w-full h-full">
      <div 
        class="flex transition-transform duration-300 h-full"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <img 
          v-for="(img, idx) in images" 
          :key="idx"
          :src="img"
          class="w-full h-full object-cover flex-shrink-0"
        />
      </div>
    </div>

    <button 
      @click="prev"
      class="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-400 text-3xl"
    >
      <
    </button>

    <button 
      @click="next"
      class="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 text-3xl"
    >
      >
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true
  }
})

const currentIndex = ref(0)
let interval = null

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prev = () => {
  currentIndex.value = currentIndex.value === 0 
    ? props.images.length - 1 
    : currentIndex.value - 1
}

onMounted(() => {
  interval = setInterval(next, 3000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>