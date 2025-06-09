# Sakai E-commerce Multiempresa

Este proyecto es una plantilla de e-commerce reutilizable basada en Vue.js y Vite, lista para ser utilizada por múltiples negocios mediante configuración. Incluye integración con API para productos y pedidos, carrito de compras con Pinia, autenticación por token y despliegue con Docker.

## Requisitos
- Node.js >= 16
- Docker y Docker Compose

## Configuración
1. Clona el repositorio:
   ```bash
   git clone https://github.com/mauseJavier/ecomerce.git
   cd sakai-vue
   ```
2. Edita el archivo `src/config.js` para personalizar los datos de tu empresa (nombre, empresa_id, apiToken, etc).

## Uso en Desarrollo (Docker Compose)

Para levantar el entorno de desarrollo con hot reload:

```bash
docker-compose up --build
```

Esto levantará el frontend en modo desarrollo en `http://localhost:5173` (puerto configurable en `docker-compose.yml`).

## Uso en Producción (Dockerfile)

Para construir y correr la imagen optimizada para producción:

1. Construye la imagen:
   ```bash
   docker build -t sakai-ecommerce .
   ```
2. Corre el contenedor:
   ```bash
   docker run -d -p 80:80 sakai-ecommerce
   ```

Esto servirá la aplicación en el puerto 80 usando Nginx.

## Características principales
- Multiempresa: configurable desde `src/config.js`.
- Consumo de productos y envío de pedidos vía API.
- Carrito global con Pinia.
- Checkout con autenticación Bearer token.
- Persistencia de modo oscuro y carrito (opcional).
- Listo para desarrollo y producción con Docker.

## Personalización
- Cambia el logo y nombre de empresa en `src/config.js` y en los assets de `public/` si lo deseas.
- Agrega más validaciones o personaliza el flujo de compra según tus necesidades.

## Documentación
Consulta la [documentación original de Sakai](https://sakai.primevue.org/documentation) para detalles sobre la plantilla base.

---

¿Dudas o sugerencias? Abre un issue o contacta al autor.
