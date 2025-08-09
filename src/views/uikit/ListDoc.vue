<script setup>
function formatPrecio(valor) {
  if (typeof valor !== 'number') valor = Number(valor)
  if (isNaN(valor)) return ''
  return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}
import config from '@/config';
import { ProductService } from '@/service/ProductService';
import { useCartStore } from '@/store/cart';
import Swal from 'sweetalert2';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const products = ref([]);
const options = ref(['list', 'grid']);
const layout = ref('list');
const cart = useCartStore()
const searchTerm = ref('');
const loading = ref(false);

// Paginación
const currentPage = ref(1);
const lastPage = ref(1);

async function cargarProductos(page = 1) {
    loading.value = true;
    try {
        // Llamada a la API con paginación
        const response = await ProductService.getProducts(page);
        // Si la API retorna { data, current_page, last_page }
        products.value = response.data || response;
        currentPage.value = response.current_page || page;
        lastPage.value = response.pagination.last_page || 1;
    } catch (e) {
        products.value = [];
        currentPage.value = 1;
        lastPage.value = 1;
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    cargarProductos();
});

async function buscarProductos() {
  loading.value = true;
  try {
    // Usar el valor de la categoría activa si existe
    const categoria = categoriaActiva.value;
    console.log('Buscando productos con término:', searchTerm.value, 'y categoría:', categoria);
    
    products.value = await ProductService.searchProducts(searchTerm.value, categoria);
    // Cuando se busca, ocultar paginación
    currentPage.value = 1;
    lastPage.value = 1;
  } catch (e) {
    products.value = [];
  } finally {
    loading.value = false;
  }
}

function getSeverity(product) {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';
        case 'LOWSTOCK':
            return 'warning';
        case 'OUTOFSTOCK':
            return 'danger';
        default:
            return null;
    }
}

function handleAddToCart(producto) {
  cart.addToCart(producto)
  // Mostrar el JSON del carrito actual en consola
  console.log('Carrito para API:', JSON.stringify(cart.cartForApi, null, 2))
  Swal.fire({
    icon: 'success',
    title: '¡Producto agregado!',
    text: 'El producto fue añadido al carrito.',
    timer: 1200,
    showConfirmButton: false
  })
}

function paginaAnterior() {
  if (currentPage.value > 1) {
    cargarProductos(currentPage.value - 1);
  }
}

function paginaSiguiente() {
  if (currentPage.value < lastPage.value) {
    cargarProductos(currentPage.value + 1);
  }
}

// Estado reactivo para el índice de imagen de cada producto
const imageIndexes = reactive({});

function getProductImages(item) {
    if (item.imagen && typeof item.imagen === 'object') {
        const urls = Object.values(item.imagen);
        if (urls.length > 0) return urls;
    }
    return [config.logo];
}

function getCurrentImage(item) {
    const images = getProductImages(item);
    if (!imageIndexes[item.id]) imageIndexes[item.id] = 0;
    return images[imageIndexes[item.id]] || images[0];
}

function prevImage(item) {
    const images = getProductImages(item);
    if (!imageIndexes[item.id]) imageIndexes[item.id] = 0;
    imageIndexes[item.id] = (imageIndexes[item.id] - 1 + images.length) % images.length;
}

function nextImage(item) {
    const images = getProductImages(item);
    if (!imageIndexes[item.id]) imageIndexes[item.id] = 0;
    imageIndexes[item.id] = (imageIndexes[item.id] + 1) % images.length;
}

const route = useRoute();
const router = useRouter();

const categoriaActiva = ref(null);
const articuloSeleccionado = ref(null);
const detalleVisible = ref(false);

onMounted(() => {
    if (route.query.cat) {
        filtrarPorCategoria(route.query.cat);
    } else {
        cargarProductos();
    }
});

watch(
  () => route.query.cat,
  (nuevoCat) => {
    if (nuevoCat) {
      filtrarPorCategoria(nuevoCat);
    } else {
      cargarProductos();
      categoriaActiva.value = null;
    }
  }
);

async function filtrarPorCategoria(cat) {
    loading.value = true;
    categoriaActiva.value = cat;
    try {
        products.value = await ProductService.searchProducts('', cat);
        currentPage.value = 1;
        lastPage.value = 1;
    } catch (e) {
        products.value = [];
    } finally {
        loading.value = false;
    }
}

const limpiarCategoria = () => {
  router.replace({
    path: '/productos',
    query: {}
  });
  categoriaActiva.value = null;
};

function mostrarDetalle(item) {
  router.push({ name: 'ArticuloDetalle', params: { id: item.id } });
}

// --- FAVORITOS ---
const FAVORITOS_KEY = 'productosFavoritos'
const favoritos = ref([])

function cargarFavoritos() {
  const saved = localStorage.getItem(FAVORITOS_KEY)
  favoritos.value = saved ? JSON.parse(saved) : []
}

function guardarFavoritos() {
  localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos.value))
}

function toggleFavorito(producto) {
  let imagen = producto.imagen
  if (!imagen || (typeof imagen === 'object' && Object.keys(imagen).length === 0)) {
    imagen = config.logo
  }
  const idx = favoritos.value.findIndex(f => f.id === producto.id)
  if (idx !== -1) {
    favoritos.value.splice(idx, 1)
  } else {
    favoritos.value.push({ id: producto.id, detalle: producto.detalle, marca: producto.marca, precio1: producto.precio1, imagen })
  }
  guardarFavoritos()
}

function esFavorito(producto) {
  return favoritos.value.some(f => f.id === producto.id)
}

onMounted(() => {
  cargarFavoritos()
});
</script>

<template>
    <div class="flex flex-col">
        <div class="card" id="productos-list-header">
            <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-2 md:gap-0">
                <form @submit.prevent="buscarProductos" class="flex gap-2 items-center w-full md:w-auto">
                    <input v-model="searchTerm" type="text" placeholder="Buscar producto..." class="border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition rounded-full px-4 py-2 shadow-sm outline-none text-gray-700 placeholder-gray-400 bg-white" />
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold shadow transition disabled:opacity-50" :disabled="loading">
                        <span v-if="loading">Buscando...</span>
                        <span v-else>Buscar</span>
                    </button>
                </form>
                <div class="font-semibold text-xl flex items-center gap-2 w-full md:w-auto justify-end md:justify-start mt-2 md:mt-0">
                  <span v-if="categoriaActiva" class="ml-2 text-blue-600 flex items-center gap-2">
                    / {{ categoriaActiva }}
                    <button @click="limpiarCategoria" class="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-600 hover:bg-red-200 text-xs">x</button>
                  </span>
                </div>
            </div>
            <DataView :value="products" :layout="layout">
                <template #header>
                    <div class="flex justify-end">
                        <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                            <template #option="{ option }">
                                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                            </template>
                        </SelectButton>
                    </div>
                </template>


                <template #list="slotProps">
                    <div class="flex flex-col">
                        <div v-for="(item, index) in slotProps.items" :key="index">
                            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface': index !== 0 }">
                                <div class="md:w-40 relative flex flex-col items-center gap-2 cursor-pointer" @click="mostrarDetalle(item)">
                                    <div class="relative w-full flex items-center justify-center">
                                        <button v-if="getProductImages(item).length > 1" @click.stop="prevImage(item)" class="absolute left-0 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow"><i class="pi pi-chevron-left"></i></button>
                                        <img
                                            class="block mx-auto rounded w-full"
                                            :src="getCurrentImage(item)"
                                            :alt="item.detalle"
                                        />
                                        <button v-if="getProductImages(item).length > 1" @click.stop="nextImage(item)" class="absolute right-0 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow"><i class="pi pi-chevron-right"></i></button>
                                    </div>
                                    <div v-if="getProductImages(item).length > 1" class="flex justify-center gap-1 mt-1">
                                        <span v-for="(img, idx) in getProductImages(item)" :key="idx" class="w-2 h-2 rounded-full" :class="imageIndexes[item.id] === idx ? 'bg-blue-600' : 'bg-gray-300'"></span>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6 cursor-pointer" @click="mostrarDetalle(item)">
                                    <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                        <div>
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.rubro }}</span>
                                            <div class="text-lg font-medium mt-2">{{ item.detalle }}</div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col md:items-end gap-8">
                                        <span class="text-xl font-semibold">{{ formatPrecio(item.precio1) }}</span>
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            <Button icon="pi pi-heart" outlined :class="esFavorito(item) ? 'text-red-500 border-red-400' : ''" @click.stop="toggleFavorito(item)" :label="esFavorito(item) ? 'Quitar favorito' : 'Favorito'" />
                                            <Button icon="pi pi-shopping-cart" label="Comprar" :disabled="false" class="flex-auto md:flex-initial whitespace-nowrap" @click.stop="handleAddToCart(item)" ></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>


                <template #grid="slotProps">
                    <div class="grid grid-cols-12 gap-4">
                        <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                            <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col cursor-pointer" @click="mostrarDetalle(item)">
                                <div class="bg-surface-50 flex justify-center rounded p-4">
                                    <div class="relative mx-auto flex flex-col items-center gap-2">
                                        <div class="relative w-full flex items-center justify-center">
                                            <button v-if="getProductImages(item).length > 1" @click.stop="prevImage(item)" class="absolute left-0 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow"><i class="pi pi-chevron-left"></i></button>
                                            <img
                                                class="rounded w-full"
                                                :src="getCurrentImage(item)"
                                                :alt="item.detalle"
                                                style="max-width: 300px"
                                            />
                                            <button v-if="getProductImages(item).length > 1" @click.stop="nextImage(item)" class="absolute right-0 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow"><i class="pi pi-chevron-right"></i></button>
                                        </div>
                                        <div v-if="getProductImages(item).length > 1" class="flex justify-center gap-1 mt-1">
                                            <span v-for="(img, idx) in getProductImages(item)" :key="idx" class="w-2 h-2 rounded-full" :class="imageIndexes[item.id] === idx ? 'bg-blue-600' : 'bg-gray-300'" />
                                        </div>
                                    </div>
                                </div>
                                <div class="pt-6">
                                    <div class="flex flex-row justify-between items-start gap-2">
                                        <div>
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.marca }}</span>
                                            <div class="text-lg font-medium mt-1">{{ item.detalle }}</div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-6 mt-6">
                                        <span class="text-2xl font-semibold">{{ formatPrecio(item.precio1) }}</span>
                                        <div class="flex gap-2">
                                            <Button icon="pi pi-shopping-cart" label="Comprar" :disabled="false" class="flex-auto whitespace-nowrap" @click.stop="handleAddToCart(item)" ></Button>
                                            <Button icon="pi pi-heart" outlined></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
            <!-- Controles de paginación -->
            <div v-if="lastPage > 1" class="flex justify-center items-center gap-4 mt-6">
                <Button @click="paginaAnterior" :disabled="currentPage === 1" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Anterior</Button>
                <span>Página {{ currentPage }} de {{ lastPage }}</span>
                <Button @click="paginaSiguiente" :disabled="currentPage === lastPage" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Siguiente</Button>
            </div>
        </div>
    </div>
</template>
