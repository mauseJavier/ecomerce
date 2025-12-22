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
      <table class="w-full mb-4">
        <thead>
          <tr>
            <th class="text-left">Producto</th>
            <th class="text-left">Precio</th>
            <th class="text-left">Cantidad</th>
            <th class="text-left">Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart.items" :key="item.producto.id">
            <td>{{ item.producto.detalle }}</td>
            <td>{{ formatPrecio(item.producto.precio1) }}</td>
            <td>
              <input type="number" min="1" v-model.number="item.cantidad" @change="updateQuantity(item.producto.id, item.cantidad)" class="w-16 border rounded px-2 py-1" />
            </td>
            <td>{{ formatPrecio(item.producto.precio1 * item.cantidad) }}</td>
            <td>
              <button @click="removeFromCart(item.producto.id)" class="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition" title="Eliminar producto">
                <i class="pi pi-trash text-lg"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mb-4">
        <span class="font-bold">Total: {{ formatPrecio(cart.total) }}</span>
      </div>
      <router-link to="/checkout">
        <button class="bg-blue-500 text-white px-4 py-2 rounded">Finalizar compra</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
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
function formatPrecio(valor) {
  if (typeof valor !== 'number') valor = Number(valor)
  if (isNaN(valor)) return ''
  return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}
</script>
