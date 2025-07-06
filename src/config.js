// Archivo de configuración central para multiempresa
export default {
  empresa_id: import.meta.env.VITE_EMPRESA_ID, // Cambia este valor para cada negocio
  nombreNegocio: import.meta.env.VITE_NOMBRE_NEGOCIO || "Mi Negocio",
  logo: import.meta.env.VITE_LOGO_URL,
  colores: {
    primario: "#1976d2",
    secundario: "#ff9800"
  },
  moneda: "USD",
  apiToken: import.meta.env.VITE_API_TOKEN,
  apiUrl: import.meta.env.VITE_API_URL,
  guardarPresupuesto: import.meta.env.VITE_GUARDAR_PRESUPUESTO || false, // true o false
  entorno: import.meta.env.VITE_MODE, // 'desarrollo' o 'produccion'
  rubrosUrl: import.meta.env.VITE_API_RUBROS_URL,
  precioLabels: {
    precio1: import.meta.env.VITE_PRECIO1_LABEL || 'Precio de lista',
    precio2: import.meta.env.VITE_PRECIO2_LABEL || 'Promoción',
    precio3: import.meta.env.VITE_PRECIO3_LABEL || 'Pago tarjeta',
  }
}
