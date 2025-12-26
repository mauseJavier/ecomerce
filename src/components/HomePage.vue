<template>

  <div class=" flex flex-col items-center justify-center py-12 px-4 bg-surface text-surface-content">
    <div class=" w-full text-center mb-10">
      <img :src="config.logo" alt="Logo" class="mx-auto mb-6 object-contain shadow-lg logo-principal" style="width: 200px; height: 200px;" />
      <h1 class="text-4xl md:text-5xl font-extrabold text-primary mb-4 drop-shadow">Bienvenido a {{ config.nombreNegocio }}</h1>
      <p class="text-lg md:text-xl text-primary/80 mb-6">¡Descubre los mejores productos, ofertas y promociones exclusivas para vos!</p>
    </div>
    
    <!-- Botón flotante de WhatsApp -->
    <a 
      :href="whatsappUrl" 
      target="_blank" 
      rel="noopener noreferrer"
      class="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
      title="Contactar por WhatsApp"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.905 3.512z"/>
      </svg>
    </a>
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
                <span class="text-2xl font-extrabold text-primary mb-2">{{ formatPrecio(art.precio1) }}</span>
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
      
      <!-- Cupón de descuento -->
      <div class="w-full max-w-3xl mx-auto mt-6">
        <div class="bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-lg shadow-xl p-8 text-center relative overflow-hidden">
          <!-- Efectos de fondo -->
          <div class="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-orange-400/20"></div>
          
          <!-- Contenido -->
          <div class="relative z-10">
            <h3 class="text-3xl font-bold text-white mb-2">¡OFERTA ESPECIAL!</h3>
            <div class="bg-yellow-400 text-red-900 rounded-lg p-4 mb-4 border-2 border-dashed border-yellow-500">
              <div class="text-6xl font-extrabold text-red-700 mb-2 drop-shadow-lg">-20%</div>
              <div class="text-lg font-bold text-red-800">¡APROVECHÁ AHORA!</div>
            </div>
            <div class="flex justify-center space-x-4 text-white">
              <div class="flex items-center">
                <span class="text-2xl mr-2">🛒</span>
                <span class="text-sm">Carrito de compras</span>
              </div>
              <div class="flex items-center">
                <span class="text-2xl mr-2">🏷️</span>
                <span class="text-sm">20% OFF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Banner de métodos de pago y entrega -->
    <div class="w-full max-w-5xl mx-auto mb-8">
      <div class="rounded-xl bg-surface-card shadow-lg p-6 border border-primary/10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <!-- VISA - 6 cuotas sin interés -->
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span class="text-white font-bold text-sm">VISA</span>
              </div>
            </div>
            <div>
              <p class="text-primary font-medium text-sm">6 cuotas sin interés</p>
        
            </div>
          </div>

          <!-- Retiro en tienda -->
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
            <div>
              <p class="text-primary font-medium text-sm">Pedí y retirá mañana</p>
              <p class="text-primary/60 text-xs">en todas las sucursales</p>
            </div>
          </div>

          <!-- Entrega 24hs -->
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 5H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h1.17c.41 1.17 1.52 2 2.83 2s2.42-.83 2.83-2h4.34c.41 1.17 1.52 2 2.83 2s2.42-.83 2.83-2H21c1.1 0 2-.9 2-2v-3l-3-4zM7 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm10 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM17 12V7H3v5h14zm2-2l1.5 2H19V10h.5z"/>
                </svg>
              </div>
            </div>
            <div>
              <p class="text-primary font-medium text-sm">Recibí tu pedido</p>
              <p class="text-primary/60 text-xs">en 24 hs*</p>
            </div>
          </div>

        </div>
      </div>
    </div>
    
    <!-- Tarjeta de contacto con redes sociales -->
    <div class="w-full max-w-5xl mx-auto mb-8">
      <div class="rounded-xl bg-surface-card shadow-lg p-6 border border-primary/10">
        <h4 class="text-xl font-bold text-primary mb-4 text-center">Contacto</h4>
        
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <!-- Logo de la empresa -->
          <div class="flex flex-col items-center">
            <img :src="config.logo" alt="Logo empresa" class="logo-principal w-24 h-24 object-contain mb-2 border border-primary/20" />
            <div v-if="empresa" class="text-primary/80 text-sm text-center">
              <div class="font-bold text-primary text-base mb-1">{{ empresa.razonSocial }}</div>
              <div v-if="empresa.telefono">Tel: <span class="font-semibold">{{ empresa.telefono }}</span></div>
              <div v-if="empresa.correo">Email: <span class="font-semibold">{{ empresa.correo }}</span></div>
              <div v-if="empresa.domicilio">Dirección: <span class="font-semibold">{{ empresa.domicilio }}</span></div>
            </div>
            <div v-else class="text-primary/60 text-sm">Cargando datos de contacto...</div>
          </div>

          <!-- Redes sociales -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            
            <!-- WhatsApp -->
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
              </div>
              <div>
                <p class="text-primary font-medium text-sm">WhatsApp</p>
                <p class="text-primary/60 text-xs">.....</p>
              </div>
            </div>

            <!-- Instagram -->
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </div>
              <div>
                <p class="text-primary font-medium text-sm">Instagram</p>
                <p class="text-primary/60 text-xs">....</p>
              </div>
            </div>

            <!-- Facebook -->
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
              </div>
              <div>
                <p class="text-primary font-medium text-sm">Facebook</p>
                <p class="text-primary/60 text-xs">....</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <FavoritosWidget />
    
    <!-- Sección de Ubicación GPS -->
    <div class="w-full max-w-5xl mx-auto mb-8">
      <div class="rounded-xl bg-surface-card shadow-lg p-6 border border-primary/10">
        <h4 class="text-xl font-bold text-primary mb-4 text-center flex items-center justify-center gap-2">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Nuestra Ubicación
        </h4>
        
        <div v-if="empresa?.domicilio" class="flex flex-col lg:flex-row gap-6">
          <!-- Información de dirección -->
          <div class="lg:w-1/3 flex flex-col justify-center">
            <div class="bg-primary/5 p-4 rounded-lg">
              <h5 class="font-semibold text-primary mb-2">¡Visitanos!</h5>
              <p class="text-primary/80 mb-3">{{ empresa.domicilio }}</p>
              <div v-if="empresa.telefono" class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span class="text-primary/70 text-sm">{{ empresa.telefono }}</span>
              </div>
              <button 
                @click="abrirEnMaps"
                class="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Ver en Maps
              </button>
            </div>
          </div>
          
          <!-- Mapa embebido -->
          <div class="lg:w-2/3">
            <iframe
              :src="mapsUrl"
              class="w-full h-64 lg:h-80 rounded-lg border border-primary/20"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
        
        <!-- Fallback si no hay dirección -->
        <div v-else class="text-center text-primary/60 py-8">
          <svg class="w-12 h-12 mx-auto mb-3 text-primary/40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <p>Cargando información de ubicación...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FavoritosWidget from '@/components/FavoritosWidget.vue';
import config from '@/config';
import axios from 'axios';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const destacados = ref([]);
const current = ref(0);
let interval = null;

const empresa = ref(null);

// URL de WhatsApp computed
const whatsappUrl = computed(() => {
  // Usar el teléfono de la empresa del endpoint, con fallback al config
  const telefono = empresa.value?.telefono || config.whatsapp.telefono;
  const mensaje = encodeURIComponent(config.whatsapp.mensaje);
  return `https://wa.me/${telefono}?text=${mensaje}`;
});

// URL del mapa embebido
const mapsUrl = computed(() => {
  if (!empresa.value?.domicilio) return '';
  const direccion = encodeURIComponent(empresa.value.domicilio);
  return `https://maps.google.com/maps?q=${direccion}&output=embed`;
});

// Función para abrir en Google Maps
function abrirEnMaps() {
  if (!empresa.value?.domicilio) return;
  const direccion = encodeURIComponent(empresa.value.domicilio);
  const url = `https://www.google.com/maps/search/?api=1&query=${direccion}`;
  window.open(url, '_blank');
}

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

function formatPrecio(valor) {
  if (typeof valor !== 'number') valor = Number(valor)
  if (isNaN(valor)) return ''
  return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
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

<style scoped>
.logo-principal {
  border-radius: 0 !important;
  border: none !important;
  clip-path: none !important;
}
</style>
