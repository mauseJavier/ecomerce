<template>
  <div class="card">
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-semibold text-xl">Carrito de compras</h2>
      <button v-if="cart.items.length > 0" @click="cart.clearCart()" class="flex items-center space-x-2 text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition" title="Vaciar carrito">
        <i class="pi pi-trash text-lg"></i>
        <span class="font-medium">CANCELAR COMPRA</span>
      </button>
    </div>
    <div v-if="cart.items.length === 0">El carrito está vacío.</div>
    <div v-else>
      <!-- Lista de productos en el carrito -->
      <div class="space-y-4 mb-6">
        <div v-for="item in cart.items" :key="item.producto.id" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          <!-- Imagen y detalles del producto -->
          <div class="flex items-center space-x-4">
            <img 
              :src="getProductImage(item.producto)" 
              :alt="item.producto.detalle" 
              class="w-16 h-16 object-cover rounded-lg border border-gray-300"
            />
            <div>
              <h3 class="font-semibold text-gray-900">{{ item.producto.detalle }}</h3>
              <p class="text-green-600 font-bold">{{ formatPrecio(item.producto.precio || item.producto.precio1) }}</p>
            </div>
          </div>
          
          <!-- Controles de cantidad y eliminar -->
          <div class="flex items-center space-x-4">
            <!-- Control de cantidad con botones -->
            <div class="flex items-center border border-primary/30 rounded-lg overflow-hidden bg-white">
              <button 
                @click="decrementarCantidad(item)" 
                :disabled="item.cantidad <= 1"
                class="px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <i class="pi pi-minus text-sm"></i>
              </button>
              <span class="w-12 px-3 py-2 text-center text-black bg-primary/10 font-semibold">{{ item.cantidad }}</span>
              <button 
                @click="incrementarCantidad(item)" 
                class="px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center"
              >
                <i class="pi pi-plus text-sm"></i>
              </button>
            </div>
            
            <!-- Botón eliminar -->
            <button 
              @click="removeFromCart(item.producto.id)" 
              class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
              title="Eliminar producto"
            >
              <i class="pi pi-trash text-lg"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Total y botón finalizar -->
      <div class="border-t pt-4">
        <div class="flex justify-between items-center mb-4">
          <span class="text-xl font-bold">Total: {{ formatPrecio(cart.total) }}</span>
        </div>
        <router-link to="/checkout">
          <button class="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition">Finalizar compra</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import config from '@/config'
import { useCartStore } from '@/store/cart'
import { storeToRefs } from 'pinia'

const cart = useCartStore()
const { items } = storeToRefs(cart)

function updateQuantity(id, cantidad) {
  cart.updateQuantity(id, cantidad)
}
function removeFromCart(id) {
  cart.removeFromCart(id)
}
function decrementarCantidad(item) {
  if (item.cantidad > 1) {
    const nuevaCantidad = item.cantidad - 1
    updateQuantity(item.producto.id, nuevaCantidad)
  }
}
function incrementarCantidad(item) {
  const nuevaCantidad = item.cantidad + 1
  updateQuantity(item.producto.id, nuevaCantidad)
}
function getProductImage(producto) {
  if (producto.imagen && typeof producto.imagen === 'object') {
    const urls = Object.values(producto.imagen)
    if (urls.length > 0) return urls[0]
  }
  return config.logo
}
function formatPrecio(valor) {
  if (typeof valor !== 'number') valor = Number(valor)
  if (isNaN(valor)) return ''
  return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}
</script>
