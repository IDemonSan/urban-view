FROM nginx:1.25-alpine

# Eliminar configuración predeterminada
RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar configuración personalizada de balanceador y proxy inverso
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
