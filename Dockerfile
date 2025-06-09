# ---- Stage 1: Build ----
# Usamos una imagen de Node para construir el proyecto
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json (o yarn.lock)
COPY package*.json ./

# Instalamos las dependencias y pinia
# Si usas yarn: RUN yarn install --frozen-lockfile
RUN npm install && npm install axios pinia

# Copiamos el resto del código fuente de la aplicación
COPY . .

# Construimos la aplicación para producción
# Si usas yarn: RUN yarn build
RUN npm run build

# ---- Stage 2: Production ----
# Usamos una imagen ligera de Nginx para servir los archivos estáticos
FROM nginx:1.25-alpine

# Copiamos los archivos construidos desde el stage 'builder' al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# (Opcional pero recomendado) Copiamos una configuración personalizada de Nginx
# Esto es importante para que las rutas de tu SPA (Single Page Application) funcionen correctamente.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80 (el puerto por defecto de Nginx)
EXPOSE 80

# Comando para iniciar Nginx cuando el contenedor arranque
CMD ["nginx", "-g", "daemon off;"]