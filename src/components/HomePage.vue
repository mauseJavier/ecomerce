<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 bg-surface text-surface-content">
    <div class="max-w-3xl w-full text-center mb-10">
      <img :src="config.logo" alt="Logo" class="mx-auto mb-6 w-32 h-32 object-contain rounded-full shadow-lg border-4 border-primary/20 bg-surface-100" />
      <h1 class="text-4xl md:text-5xl font-extrabold text-primary mb-4 drop-shadow">Bienvenido a {{ config.nombreNegocio }}</h1>
      <p class="text-lg md:text-xl text-primary/80 mb-6">¡Descubre los mejores productos, ofertas y promociones exclusivas para vos!</p>
    </div>
    <!-- Carrusel de artículos destacados -->
    <div class="w-full max-w-5xl mx-auto mb-12">
      <div class="relative">
        <button v-if="destacados.length > 1" @click="prev" class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary text-white rounded-full p-2 shadow hover:bg-primary/80 transition">
          <i class="pi pi-chevron-left text-2xl"></i>
        </button>
        <div class="overflow-hidden">
          <div class="flex transition-transform duration-500" :style="{ transform: `translateX(-${current * 100}%)` }">
            <div v-for="(art, idx) in destacados" :key="art.id" class="min-w-full flex flex-col items-center justify-center px-4">
              <div class="rounded-2xl shadow-2xl bg-surface-card p-8 flex flex-col items-center border border-primary/10 w-full max-w-2xl mx-auto">
                <img :src="art.imagenUrl || config.logo" :alt="art.detalle" class="w-64 h-64 object-contain rounded-xl mb-6 bg-surface-200 border border-surface-300" />
                <h2 class="text-2xl md:text-3xl font-bold text-primary mb-2">{{ art.detalle }}</h2>
                <p class="text-base md:text-lg text-surface-content/70 mb-3 line-clamp-3 text-center">{{ art.comentarioTienda || 'Sin descripción' }}</p>
                <span class="inline-block bg-primary/10 text-primary px-3 py-1 rounded text-base font-semibold mb-3">{{ art.rubro }}</span>
                <span class="text-2xl font-extrabold text-primary mb-2">${{ art.precio1 }}</span>
                <router-link :to="`/articulo/${art.id}`" class="mt-2 px-6 py-3 bg-primary text-white rounded-full shadow hover:bg-primary/80 transition text-base">Ver detalle</router-link>
              </div>
            </div>
          </div>
        </div>
        <button v-if="destacados.length > 1" @click="next" class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-primary text-white rounded-full p-2 shadow hover:bg-primary/80 transition">
          <i class="pi pi-chevron-right text-2xl"></i>
        </button>
      </div>
      <div v-if="destacados.length > 1" class="flex justify-center mt-4 gap-2">
        <button v-for="(art, idx) in destacados" :key="idx" @click="goTo(idx)" :class="['w-3 h-3 rounded-full', current === idx ? 'bg-primary' : 'bg-primary/30']"></button>
      </div>
    </div>
    <div class="w-full max-w-5xl mx-auto mb-8">
      <div class="rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-8 flex flex-col md:flex-row items-center justify-between shadow-lg border border-primary/10">
        <div class="flex-1 text-center md:text-left mb-4 md:mb-0">
          <h3 class="text-2xl font-bold text-secondary mb-2">¡Promoción especial!</h3>
          <p class="text-lg text-surface-content/80">Aprovechá nuestras ofertas por tiempo limitado y llevate lo mejor al mejor precio.</p>
        </div>
        <img src="https://cdn-icons-png.flaticon.com/512/1170/1170576.png" alt="Promo" class="w-28 h-28 object-contain" />
      </div>
    </div>
    <div class="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="rounded-xl bg-surface-card shadow-lg p-6 flex flex-col items-center border border-primary/10">
        <h4 class="text-xl font-bold text-primary mb-2">¿Por qué elegirnos?</h4>
        <ul class="text-primary/80 text-base space-y-1 list-disc list-inside">
          <li>Atención personalizada y rápida</li>
          <li>Productos de calidad y garantía</li>
          <li>Ofertas y promociones exclusivas</li>
        </ul>
      </div>
      <div class="rounded-xl bg-gradient-to-br from-primary/10 to-surface-card shadow-lg p-6 flex flex-col items-center border border-primary/10">
        <h4 class="text-xl font-bold text-primary mb-2">Contacto</h4>
        <img :src="config.logo" alt="Logo empresa" class="rounded-lg w-32 h-32 object-contain mb-2 bg-white border border-primary/20" />
        <div v-if="empresa" class="text-primary/80 text-base text-center">
          <div class="font-bold text-primary text-lg mb-1">{{ empresa.razonSocial }}</div>
          <div v-if="empresa.telefono">Tel: <span class="font-semibold">{{ empresa.telefono }}</span></div>
          <div v-if="empresa.correo">Email: <span class="font-semibold">{{ empresa.correo }}</span></div>
          <div v-if="empresa.domicilio">Dirección: <span class="font-semibold">{{ empresa.domicilio }}</span></div>
        </div>
        <div v-else class="text-primary/60 text-base">Cargando datos de contacto...</div>
      </div>
    </div>
    <FavoritosWidget />
  </div>
</template>

<script setup>
import FavoritosWidget from '@/components/FavoritosWidget.vue';
import config from '@/config';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';

const destacados = ref([]);
const current = ref(0);
let interval = null;

const empresa = ref(null);

function next() {
  current.value = (current.value + 1) % destacados.value.length;
}
function prev() {
  current.value = (current.value - 1 + destacados.value.length) % destacados.value.length;
}
function goTo(idx) {
  current.value = idx;
}

function startAutoplay() {
  stopAutoplay();
  interval = setInterval(() => {
    if (destacados.value.length > 1) next();
  }, 4000);
}
function stopAutoplay() {
  if (interval) clearInterval(interval);
}

onMounted(async () => {
  try {
    const url = `${config.apiUrl}/inventarios/${config.empresa_id}/articulos?destacados=1&limit=6`;
    const { data } = await axios.get(url);
    destacados.value = (data.data || data).map(a => ({
      ...a,
      imagenUrl: a.imagen && typeof a.imagen === 'object' ? Object.values(a.imagen)[0] : config.logo
    }));
    // Consultar datos de la empresa
    const empresaUrl = `${config.apiUrl}/empresa/${config.empresa_id}`;
    const empresaResp = await axios.get(empresaUrl);
    empresa.value = empresaResp.data.data || empresaResp.data;
    console.log('Empresa cargada:', empresa.value);
    startAutoplay();
  } catch (e) {
    destacados.value = [];
  }
});

onUnmounted(() => {
  stopAutoplay();
});
</script>
