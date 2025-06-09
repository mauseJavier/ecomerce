import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] // Cada item: { producto, cantidad }
  }),
  actions: {
    addToCart(producto) {
      const index = this.items.findIndex(i => i.producto.id === producto.id)
      if (index !== -1) {
        // Asegura reactividad
        this.items[index] = { ...this.items[index], cantidad: this.items[index].cantidad + 1 }
      } else {
        this.items.push({ producto, cantidad: 1 })
      }
    },
    removeFromCart(productoId) {
      this.items = this.items.filter(i => i.producto.id !== productoId)
    },
    updateQuantity(productoId, cantidad) {
      const item = this.items.find(i => i.producto.id === productoId)
      if (item) item.cantidad = cantidad
    },
    clearCart() {
      this.items = []
    }
  },
  getters: {
    total: (state) => state.items.reduce((sum, i) => sum + i.producto.precio1 * i.cantidad, 0),
    cartForApi: (state) => state.items.map(i => ({
      codigo: i.producto.codigo,
      detalle: i.producto.detalle,
      porcentaje: i.producto.porcentaje,
      precioLista: i.producto.precio1,
      descuento: 0,
      precio: i.producto.precio1,
      costo: i.producto.costo,
      iva: i.producto.iva,
      cantidad: i.cantidad,
      rubro: i.producto.rubro,
      proveedor: i.producto.proveedor,
      marca: i.producto.marca,
      controlStock: i.producto.controlStock === 'si' ? true : false
    }))
  }
})
