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

## Despliegue en Producción con Dockerfile

1. Construye la imagen Docker:
   ```bash
   docker build -t tiendaimpotecno .
   ```

2. Crea un archivo `.env` en la raíz del proyecto (puedes copiar el ejemplo):
   ```bash
   cp .env.example .env
   # Edita .env y coloca tus valores reales
   ```

3. Ejecuta el contenedor:
   ```bash
   
docker run -d  --name tiendaimpotecno  --restart unless-stopped  --network redPrincipal  -p 127.0.0.1:8001:80  tiendaimpotecno:latest   

```

Esto levantará la app en el puerto 80 usando Nginx y las variables de entorno de tu archivo `.env`.

## Despliegue con Docker Compose personalizado

Para levantar la app en un contenedor usando el archivo `dockerComposeSuperKioscoFVT.yml`:

1. Copia y edita el archivo `.env.example` como `.env` si necesitas personalizar variables:
   ```bash
   cp .env.example .env
   # Edita .env con tus valores reales
   ```

2. Levanta el contenedor:
   ```bash
   docker compose -f dockerComposeSuperKioscoFVT.yml up --build -d
   ```

Esto expondrá la app en `http://localhost:8080` (puedes cambiar el puerto en el archivo YAML).

- Las variables de entorno se leen desde `.env.example` (o `.env` si lo cambias en el YAML).
- El contenedor se reiniciará automáticamente si se detiene.

Para detener y eliminar el contenedor:
```bash
docker compose -f dockerComposeSuperKioscoFVT.yml down
```

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

Actualizar VPS ---------------------------------------------

Cuando tenés un proyecto clonado que usa Docker y querés **actualizar la imagen y el contenedor** después de hacer un `git pull` con nuevos cambios del repositorio, el proceso general es el siguiente:

---

### ✅ **Pasos para actualizar la imagen y el contenedor**

1. ### 🔄 Hacer `git pull` para traer los cambios

   ```bash
   git pull origin main  
   
   # o la rama correspondiente
   ```

2. ### 🛠️ Reconstruir la imagen de Docker

   Si usás un `Dockerfile`:

   ```bash
   docker build -t nombre-de-tu-imagen .
   ```

   Si usás `docker-compose`:

   ```bash
   docker-compose build
   ```

   > Si querés forzar la reconstrucción sin usar caché:

   ```bash
   docker-compose build --no-cache
   ```

3. ### 🔁 Detener y eliminar el contenedor anterior

   Si no usás `docker-compose`:

   ```bash
   docker stop nombre-del-contenedor
   docker rm nombre-del-contenedor
   ```

   Si usás `docker-compose`:

   ```bash
   docker-compose down
   ```

4. ### 🚀 Volver a levantar el contenedor con la imagen nueva

   Con `docker run`:

   ```bash
   docker run -d --name nombre-del-contenedor -p 8000:80 nombre-de-tu-imagen
   ```

   Con `docker-compose`:

   ```bash
   docker-compose up -d
   ```

---

### 📝 Recomendaciones

* Usá `docker-compose` siempre que puedas, ya que simplifica mucho el manejo de servicios y contenedores.
* Asegurate de que los volúmenes no estén sobrescribiendo los archivos que cambiaste en el repositorio (por ejemplo, si estás montando código con `volumes`, el contenido del host puede sobreescribir el de la imagen nueva).
* Si usás archivos `.env`, asegurate de que estén actualizados si se agregaron nuevas variables en el `pull`.

---

¿Querés que revise tus archivos (`Dockerfile`, `docker-compose.yml`, etc.) para darte los comandos exactos que deberías usar en tu caso? Podes pegar el contenido o subir los archivos.

