// Archivo de configuración central para multiempresa
export default {

  empresa_id: import.meta.env.VITE_EMPRESA_ID, // Cambia este valor para cada negocio
  nombreNegocio: import.meta.env.VITE_NOMBRE_NEGOCIO || "Mi Negocio",
  logo: "https://res.cloudinary.com/dsen7wmue/image/upload/v1748752141/1/aaaa/228267_1748752139_aaaa.png",
  colores: {
    primario: "#1976d2",
    secundario: "#ff9800"
  },
  moneda: "USD",
  apiToken: import.meta.env.VITE_API_TOKEN,
  apiUrl: import.meta.env.VITE_API_URL,
  guardarPresupuesto: import.meta.env.VITE_GUARDAR_PRESUPUESTO || false, // true o false
  entorno: import.meta.env.VITE_MODE // 'desarrollo' o 'produccion'
}
