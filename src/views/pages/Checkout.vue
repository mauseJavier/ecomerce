<template>
  <div class="card">
    <h2 class="font-semibold text-xl mb-4">Finalizar compra</h2>
    <form @submit.prevent="enviarPedido">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block font-bold mb-1">Tipo de comprobante</label>
          <select v-model="form.tipoComprobante" class="w-full border rounded px-2 py-1">
            <option value="Presupuesto">Presupuesto</option>
            <!-- <option value="Factura">Factura</option> -->
          </select>
        </div>
        <!-- <div>
          <label class="block font-bold mb-1">Tipo de documento</label>
          <input v-model="form.tipoDocumento" class="w-full border rounded px-2 py-1" />
        </div> -->
        <div>
          <label class="block font-bold mb-1">DNI</label>
          <input v-model="form.cuit" class="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block font-bold mb-1">Nombre Completo</label>
          <input v-model="form.razonSocial" class="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block font-bold mb-1">Domicilio</label>
          <input v-model="form.domicilio" class="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block font-bold mb-1">Correo cliente</label>
          <input v-model="form.correoCliente" class="w-full border rounded px-2 py-1" />
        </div>
        <!-- <div>
          <label class="block font-bold mb-1">Tipo contribuyente</label>
          <input v-model="form.tipoContribuyente" class="w-full border rounded px-2 py-1" />
        </div> -->
        <div>
          <label class="block font-bold mb-1">Teléfono cliente</label>
          <input v-model="form.telefonoCliente" class="w-full border rounded px-2 py-1" />
        </div>
      </div>
      <div class="flex justify-between items-center mb-4">
        <span class="font-bold">Total: ${{ cart.total.toFixed(2) }}</span>
        <router-link to="/carrito" class="text-blue-500">Volver al carrito</router-link>
      </div>
      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Enviar pedido</button>
    </form>
    <div v-if="mensaje" class="mt-4 text-green-600">{{ mensaje }}</div>
    <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
  </div>
</template>

<script setup>
import config from '@/config'
import { useCartStore } from '@/store/cart'
import { ref } from 'vue'

const cart = useCartStore()
const mensaje = ref('')
const error = ref('')

const form = ref({
  tipoComprobante: 'Presupuesto',
  tipoDocumento: '',
  cuit: '',
  razonSocial: '',
  domicilio: '',
  correoCliente: '',
  tipoContribuyente: '',
  telefonoCliente: ''
})

async function enviarPedido() {
  mensaje.value = ''
  error.value = ''
  // Validar correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.correoCliente)) {
    error.value = 'Por favor, ingrese un correo electrónico válido.';
    return;
  }
  const payload = {
    tipoComprobante: form.value.tipoComprobante,
    total: cart.total,
    tipoDocumento: '99', // Enviar como string
    cuit: form.value.cuit,
    razonSocial: form.value.razonSocial,
    domicilio: form.value.domicilio,
    correoCliente: form.value.correoCliente,
    tipoContribuyente: '5', // Enviar como string
    idEmpresa: config.empresa_id,
    telefonoCliente: form.value.telefonoCliente,
    carrito: cart.cartForApi
  }
  console.log('JSON del pedido:', JSON.stringify(payload, null, 2))
  try {
    // Cambia la URL por la de tu API real de pedidos
    const response = await fetch('https://llfprueba.llservicios.ar/api/guardarPresupuesto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiToken}`
      },
      body: JSON.stringify(payload)
    })
    if (!response.ok) throw new Error('Error al enviar el pedido')
    mensaje.value = '¡Pedido enviado correctamente!'
    cart.clearCart()
  } catch (e) {
    error.value = e.message || 'Error inesperado al enviar el pedido'
  }
}
</script>
