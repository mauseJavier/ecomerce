<template>
  <div class="card">
    <h2 class="font-semibold text-xl mb-4">Carrito de compras</h2>
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
            <td>${{ item.producto.precio1 }}</td>
            <td>
              <input type="number" min="1" v-model.number="item.cantidad" @change="updateQuantity(item.producto.id, item.cantidad)" class="w-16 border rounded px-2 py-1" />
            </td>
            <td>${{ (item.producto.precio1 * item.cantidad).toFixed(2) }}</td>
            <td>
              <button @click="removeFromCart(item.producto.id)" class="text-red-500">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-between items-center mb-4">
        <span class="font-bold">Total: ${{ cart.total.toFixed(2) }}</span>
        <button @click="cart.clearCart()" class="text-red-500">Vaciar carrito</button>
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
</script>
