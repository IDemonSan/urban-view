# ==========================================
# ETAPA 1: COMPILACIÓN (NODE.JS)
# ==========================================
FROM node:20-alpine AS build
WORKDIR /app

# Copiar configuración de dependencias e instalarlas
COPY package.json package-lock.json* ./
RUN npm install

# Copiar el código fuente y compilar la SPA estática para producción (genera la carpeta /dist)
COPY . .
RUN npm run build

# ==========================================
# ETAPA 2: SERVIDOR ESTATICO (NGINX ALPINE)
# ==========================================
FROM nginx:1.25-alpine

# Copiar los recursos compilados estáticos del Stage 1 al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la configuración básica de Nginx para SPA (soporte HTML5 routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto estándar
EXPOSE 80

# Iniciar servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
