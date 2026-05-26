#!/usr/bin/env bash

# ==============================================================================
# SCRIPT DE INTEGRACIÓN Y CONECTIVIDAD MANUAL - PROPTECH MVP
# ==============================================================================
# Este script demuestra la interconexión manual de contenedores dentro de la misma
# red bridge aislada, extrayendo las IPs internas para intercomunicar los servicios.
# ==============================================================================

# Colores de salida
VERDE='\033[0;32m'
INDIGO='\033[0;34m'
AMARILLO='\033[1;33m'
RESET='\033[0;0m'

echo -e "${INDIGO}================================================================${RESET}"
echo -e "${INDIGO}    INICIANDO LEVANTAMIENTO MANUAL Y DIAGNÓSTICO DE RED DOCKER   ${RESET}"
echo -e "${INDIGO}================================================================${RESET}"

# 1. Crear la red bridge personalizada
echo -e "\n${AMARILLO}[Paso 1/6] Creando red bridge personalizada 'red-proptech-manual'...${RESET}"
docker network create --driver bridge red-proptech-manual 2>/dev/null || echo "La red ya existe."

# Limpiar ejecuciones previas para evitar conflictos de nombres
echo -e "\n${AMARILLO}[Paso 2/6] Limpiando contenedores previos si existen...${RESET}"
docker stop db-postgis-manual api-backend-manual 2>/dev/null
docker rm db-postgis-manual api-backend-manual 2>/dev/null

# 2. Levantar el contenedor db-postgis
echo -e "\n${AMARILLO}[Paso 3/6] Iniciando base de datos PostGIS en la red 'red-proptech-manual'...${RESET}"
docker run -d \
  --name db-postgis-manual \
  --network red-proptech-manual \
  -e POSTGRES_DB=urbanview_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgrespassword \
  postgis/postgis:15-3.3

echo "Esperando 8 segundos a que PostGIS se inicialice completamente..."
sleep 8

# 3. Demostración de Conectividad Geoespacial: Cargar Seed Data mediante docker exec
echo -e "\n${AMARILLO}[Paso 4/6] Cargando datos semilla y extensiones (init.sql) mediante exec...${RESET}"
docker cp database/init.sql db-postgis-manual:/init.sql
docker exec -i db-postgis-manual psql -U postgres -d urbanview_db -f /init.sql

# 4. Captura e Inspección de IPs internas
echo -e "\n${AMARILLO}[Paso 5/6] EXTRACCIÓN DE IP INTERNA (docker inspect)...${RESET}"
DB_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' db-postgis-manual)
echo -e "${VERDE}✔ Contenedor db-postgis-manual detectado exitosamente.${RESET}"
echo -e "${VERDE}✔ Dirección IP Interna en la Red Bridge: ${DB_IP}${RESET}"

# 5. Compilar y levantar el Backend Spring Boot 3
echo -e "\n${AMARILLO}[Paso 6/6] Compilando e iniciando API REST (Spring Boot) con IP inyectada...${RESET}"
echo "Compilando la imagen docker del backend (Maven multi-stage, esto puede tardar un momento)..."
docker build -t urbanview-backend:1.0 ./backend

echo "Lanzando contenedor de backend inyectando la IP de PostGIS extraída..."
docker run -d \
  --name api-backend-manual \
  --network red-proptech-manual \
  -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://$DB_IP:5432/urbanview_db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgrespassword \
  urbanview-backend:1.0

echo "Esperando 12 segundos a que el microservicio Spring Boot compile y levante..."
sleep 12

echo -e "\n${VERDE}================================================================${RESET}"
echo -e "${VERDE}               INTEGRACIÓN MANUAL COMPLETADA                    ${RESET}"
echo -e "${VERDE}================================================================${RESET}"
echo -e "Para inspeccionar el tráfico y logs de Spring Boot ejecute:"
echo -e "  docker logs -f api-backend-manual"
echo -e "\nPara hacer una petición HTTP GET desde su máquina y verificar los datos:"
echo -e "  curl -s http://localhost:8080/api/plano | json_pp"
echo -e "================================================================"
