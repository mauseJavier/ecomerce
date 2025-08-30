<script setup>
function formatPrecio(valor) {
  if (typeof valor !== 'number') valor = Number(valor)
  if (isNaN(valor)) return ''
  return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}
import config from '@/config';
import { useCartStore } from '@/store/cart';
import axios from 'axios';
import Swal from 'sweetalert2';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const cart = useCartStore();
const articulo = ref(null);
const loading = ref(true);
const error = ref('');
const labels = config.precioLabels;
const cantidad = ref(1);

onMounted(async () => {
  loading.value = true;
  error.value = '';
  try {
    const id = route.params.id;
    const url = `${config.apiUrl}/inventarios/${config.empresa_id}/articulo/${id}`;
    const response = await axios.get(url);
    articulo.value = response.data.data || response.data;
    console.log('Artículo cargado:', articulo.value);
  } catch (e) {
    error.value = 'No se pudo cargar el artículo';
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  articulo.value = null;
  error.value = '';
  loading.value = false;
});

const imagenes = computed(() => {
  if (articulo.value && articulo.value.imagen && typeof articulo.value.imagen === 'object') {
    const urls = Object.values(articulo.value.imagen);
    if (urls.length > 0) return urls;
  }
  return [config.logo];
});

const stockDisponible = computed(() => {
  if (!articulo.value || !Array.isArray(articulo.value.stocks)) return [];
  // Sumar stock por depósito, talle y color si existen
  const porDepositoTalleColor = {};
  for (const s of articulo.value.stocks) {
    // Clave única por depósito + talle + color (si existen)
    const key = [
      s.deposito_id,
      s.talle !== undefined ? s.talle : '',
      s.color !== undefined ? s.color : ''
    ].join('-');
    if (!porDepositoTalleColor[key]) {
      porDepositoTalleColor[key] = { ...s };
    } else {
      porDepositoTalleColor[key].stock += s.stock;
    }
  }
  // Solo mostrar los que tienen stock > 0
  return Object.values(porDepositoTalleColor).filter(s => s.stock > 0);
});

function agregarAlCarrito() {
  if (!articulo.value) return;
  if (cantidad.value < 1) {
    Swal.fire('Cantidad inválida', 'Debes seleccionar al menos 1 unidad.', 'warning');
    return;
  }
  const item = { ...articulo.value };
  cart.addToCart(item, cantidad.value);
  Swal.fire({
    title: 'Agregado',
    text: 'El producto fue agregado al carrito',
    icon: 'success',
    timer: 1500,
    showConfirmButton: false
  });
  cantidad.value = 1; // Resetea el input de cantidad
}

console.log('stocks', stockDisponible.value);

</script>

<template>
  <div class="py-8 px-4 bg-surface text-surface-content">
    <button @click="router.back()" class="mb-4 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full shadow hover:bg-primary/80 transition">
      <i class="pi pi-arrow-left"></i>
      Volver
    </button>
    <div v-if="loading" class="text-center py-8 text-primary">Cargando...</div>
    <div v-else-if="error" class="text-center text-error py-8 font-bold">{{ error }}</div>
    <div v-else-if="articulo" class="rounded-lg shadow-lg p-6 card bg-surface-card">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Galería de imágenes -->
        <div class="flex-1 flex flex-col gap-3 items-center">
          <img v-for="(img, idx) in imagenes" :key="idx" :src="img" :alt="articulo.detalle" class="rounded-lg w-full max-w-md shadow transition-transform hover:scale-105 border border-surface-300 bg-surface-200" />
        </div>
        <!-- Detalles del producto -->
        <div class="flex-1 flex flex-col gap-4">
          <h2 class="text-3xl font-extrabold mb-2 text-primary flex items-center gap-2">
            {{ articulo.detalle }}
            <span class="ml-2 px-2 py-1 rounded bg-primary/10 text-primary text-xs font-semibold">CODIGO: {{ articulo.codigo }}</span>
          </h2>
          <div class="mb-2 text-primary/80 whitespace-pre-line text-lg">
            <span class="font-semibold">Descripción:</span>
            <span class="ml-1">{{ articulo.comentarioTienda || 'Sin descripción' }}</span>
          </div>
          <div class="flex flex-wrap gap-2 mb-2">
            <span class="inline-flex items-center px-2 py-1 rounded bg-success/10 text-success text-xs font-semibold">
              <i class="pi pi-tag mr-1"></i> {{ articulo.rubro }}
            </span>
            <span class="inline-flex items-center px-2 py-1 rounded bg-warning/10 text-warning text-xs font-semibold">
              <i class="pi pi-truck mr-1"></i> {{ articulo.proveedor }}
            </span>
            <span class="inline-flex items-center px-2 py-1 rounded bg-accent/10 text-accent text-xs font-semibold">
              <i class="pi pi-star mr-1"></i> {{ articulo.marca }}
            </span>
          </div>

          <!-- Mostrar stock disponible por depósito, talle y color si existen -->
          <div v-if="stockDisponible.length" class="mb-2">
            <h3 class="text-base font-bold text-success mb-1 flex items-center gap-1">
              <i class="pi pi-box"></i> Stock disponible:
            </h3>
            <ul class="pl-4 text-success/80 text-sm space-y-1">
              <li v-for="s in stockDisponible" :key="s.deposito_id + '-' + (s.talle || '') + '-' + (s.color || '')">
                <span class="font-semibold">{{ s.deposito_nombre }}:</span>
                <span v-if="s.talle" class="ml-2 text-xs text-primary px-2 py-0.5 rounded">Talle: </span>{{ s.talle }}
                <span v-if="s.color" class="ml-2 text-xs text-primary px-2 py-0.5 rounded">Color: </span>{{ s.color }}
                <span class="ml-2 text-xs text-primary px-2 py-0.5 rounded"> Stock: </span><strong>{{ s.stock }}</strong>
              </li>
            </ul>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-primary">Código:</span>
              <span class="bg-surface-200 text-primary px-2 py-1 rounded text-sm font-mono">{{ articulo.codigo }}</span>
            </div>
            <div class="flex items-center gap-3 mt-2">
              <input type="number" v-model.number="cantidad" min="1" :max="stockDisponible.length ? stockDisponible[0].stock : 99" class="w-20 px-2 py-1 border border-primary/30 rounded focus:outline-none focus:ring-2 focus:ring-primary" />
              <button @click="agregarAlCarrito" class="px-4 py-2 rounded-full shadow-lg bg-primary text-white   hover:bg-success/80 hover:scale-105 transition-transform flex items-center gap-2">
                <i class="pi pi-shopping-cart"></i> Agregar al carrito
              </button>
            </div>
          </div>
          <hr class="my-4" />
          <!-- Precios destacados -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="rounded-lg shadow p-4 bg-primary/10 flex flex-col items-center">
              <span class="text-sm text-primary font-semibold">{{ labels.precio1 }}</span>
              <span class="text-2xl font-bold text-primary">{{ formatPrecio(articulo.precio1) }}</span>
            </div>
            <div class="rounded-lg shadow p-4 bg-success/10 flex flex-col items-center">
              <span class="text-sm text-success font-semibold">{{ labels.precio2 }}</span>
              <span class="text-2xl font-bold text-success">{{ formatPrecio(articulo.precio2) }}</span>
            </div>
            <div class="rounded-lg shadow p-4 bg-accent/10 flex flex-col items-center">
              <span class="text-sm text-accent font-semibold">{{ labels.precio3 }}</span>
              <span class="text-2xl font-bold text-accent">{{ formatPrecio(articulo.precio3) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Si usas DaisyUI/Tailwind, las clases ya aplican los colores dinámicos. Si tienes variables CSS personalizadas, puedes mapearlas aquí. */
</style>
