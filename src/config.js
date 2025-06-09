// Archivo de configuración central para multiempresa
export default {
  empresa_id: 12, // Cambia este valor para cada negocio
  nombreNegocio: "Empresa Prueba",
  logo: "/logo.svg",
  colores: {
    primario: "#1976d2",
    secundario: "#ff9800"
  },
  moneda: "USD",
  apiToken: import.meta.env.VITE_API_TOKEN
}
