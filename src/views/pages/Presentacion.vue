<template>
  <div class="presentacion-carrusel w-screen h-screen flex items-center justify-center bg-black">
    <div class="relative w-full h-full flex items-center justify-center">
      <button v-if="slides.length > 1" @click="prev" class="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-primary text-white rounded-full p-3 shadow hover:bg-primary/80 transition">
        <i class="pi pi-chevron-left text-3xl"></i>
      </button>
      <div class="overflow-hidden w-full h-full">
        <div class="flex transition-transform duration-700 h-full" :style="{ transform: `translateX(-${current * 100}vw)` }">
          <div v-for="(slide, idx) in slides" :key="idx" class="min-w-full flex flex-col items-end justify-end relative presentacion-slide-bg">
            <div class="w-full h-full flex items-center justify-center bg-black bg-opacity-80 rounded-t-2xl">
              <img :src="slide.image" :alt="slide.title" class="max-h-[200vh] max-w-[200vw] object-contain rounded-xl shadow-lg bg-white/10" />
            </div>
            <div class="w-full bg-black bg-opacity-70 px-8 py-6 rounded-b flex flex-col items-center max-w-2xl mx-auto mb-24 absolute left-1/2 -translate-x-1/2 bottom-0">
              <h1 class="text-3xl md:text-5xl font-bold mb-2 text-white drop-shadow text-center">{{ slide.title }}</h1>
              <p class="text-2xl md:text-4xl font-extrabold text-primary-200 mb-2">{{ formatPrecio(slide.precio) }}</p>
            </div>
          </div>
        </div>
      </div>
      <button v-if="slides.length > 1" @click="next" class="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-primary text-white rounded-full p-3 shadow hover:bg-primary/80 transition">
        <i class="pi pi-chevron-right text-3xl"></i>
      </button>
      <div v-if="slides.length > 1" class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        <button v-for="(slide, idx) in slides" :key="idx" @click="goTo(idx)" :class="['w-4 h-4 rounded-full border-2', current === idx ? 'bg-primary border-primary' : 'bg-primary/30 border-primary/30']"></button>
      </div>
    </div>
  </div>
</template>

<script setup>

import config from '@/config';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';

const slides = ref([]);
const current = ref(0);
let interval = null;
const empresa = ref(null);

function next() {
  current.value = (current.value + 1) % slides.value.length;
}
function prev() {
  current.value = (current.value - 1 + slides.value.length) % slides.value.length;
}
function goTo(idx) {
  current.value = idx;
}

function startAutoplay() {
  stopAutoplay();
  interval = setInterval(() => {
    if (slides.value.length > 1) next();
  }, 5000);
}
function stopAutoplay() {
  if (interval) clearInterval(interval);
}

function formatPrecio(valor) {
  if (typeof valor !== 'number') valor = Number(valor)
  if (isNaN(valor)) return ''
  return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

onMounted(async () => {
  try {
    const url = `${config.apiUrl}/inventarios/${config.empresa_id}/articulos?destacados=1&limit=50`;
    const { data } = await axios.get(url);
    slides.value = (data.data || data).map(a => ({
      title: a.detalle,
      precio: a.precio1 || 'Sin descripción',
      image: a.imagen && typeof a.imagen === 'object' ? Object.values(a.imagen)[0] : config.logo,
      link: `/articulo/${a.id}`
    }));
    // Consultar datos de la empresa
    const empresaUrl = `${config.apiUrl}/empresa/${config.empresa_id}`;
    const empresaResp = await axios.get(empresaUrl);
    empresa.value = empresaResp.data.data || empresaResp.data;
    console.log('Empresa cargada:', empresa.value);
    startAutoplay();
  } catch (e) {
    slides.value = [];
  }
});
onUnmounted(() => {
  stopAutoplay();
});
</script>

<style scoped>
.presentacion-carrusel {
  min-height: 100vh;
  min-width: 100vw;
}
</style>
