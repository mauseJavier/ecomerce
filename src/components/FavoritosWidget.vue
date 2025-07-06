<template>
  <div v-if="favoritos.length" class="card my-8">
    <h2 class="font-bold text-2xl mb-4 flex items-center gap-2 text-primary">
      <i class="pi pi-heart text-red-500"></i> Mis Favoritos
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="item in favoritos" :key="item.id" class="rounded-lg shadow p-4 bg-surface-card flex flex-col items-center">
        <img :src="(item.imagen)" :alt="item.detalle" class="rounded w-full max-w-xs mb-2 border border-surface-200 bg-surface-100" />
        <div class="font-semibold text-lg text-center mb-1">{{ item.detalle }}</div>
        <div class="text-sm text-surface-500 mb-1">{{ item.marca }}</div>
        <div class="text-xl font-bold text-primary mb-2">${{ item.precio1 }}</div>
        <router-link :to="{ name: 'ArticuloDetalle', params: { id: item.id } }" class="bg-primary text-white px-4 py-2 rounded-full shadow hover:bg-primary/80 transition">Ver detalle</router-link>
      </div>
    </div>
  </div>
  <div v-else class="my-8 text-center text-surface-400">
    <i class="pi pi-heart text-2xl"></i>
    <div class="mt-2">No tienes productos favoritos aún.</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const FAVORITOS_KEY = 'productosFavoritos'
const favoritos = ref([])

function cargarFavoritos() {
  const saved = localStorage.getItem(FAVORITOS_KEY)
  favoritos.value = saved ? JSON.parse(saved) : []
}

// function getImage(item) {
//   if (item.imagen && typeof item.imagen === 'object') {
//     const urls = Object.values(item.imagen)
//     if (urls.length > 0) return urls[0]
//   }
//   return '/favicon.ico'
// }

onMounted(() => {
  cargarFavoritos()
})
</script>

<style scoped>
.card {
  background: var(--surface-card, #fff);
}
</style>
