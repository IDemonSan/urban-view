#!/usr/bin/env bash

# ==============================================================================
# PIPELINE LOCAL DE REGISTRO EN LA NUBE & PRUEBAS DE DESTRUCCIÓN - PROPTECH MVP
# ==============================================================================
# Este script documenta y automatiza la subida de imágenes a registros públicos
# y privados en la nube (Docker Hub, AWS ECR y Google Artifact Registry) así como
# el protocolo de validación de persistencia y destrucción del MVP.
# ==============================================================================

# Colores de consola
VERDE='\033[0;32m'
INDIGO='\033[0;34m'
AMARILLO='\033[1;33m'
RESET='\033[0;0m'

# Configuración de Variables del Registro (Modificar según credenciales reales)
DOCKER_HUB_USER="mi-usuario-dockerhub"
AWS_ACCOUNT_ID="123456789012"
AWS_REGION="us-east-1"
GOOGLE_PROJECT_ID="proptech-mvp-3029"
GAR_REGION="us-central1"

echo -e "${INDIGO}================================================================${RESET}"
echo -e "${INDIGO}     PIPELINE DE REGISTRO MULTI-NUBE Y PRUEBA DE DESTRUCCIÓN     ${RESET}"
echo -e "${INDIGO}================================================================${RESET}"

echo -e "\n${AMARILLO}[FASE 1/3] LOGIN SEGURO EN PROVEEDORES CLOUD (DOCKER HUB & AWS/GCP)${RESET}"

# 1. Autenticación en Docker Hub (Seguro usando stdin)
echo -e "\n${AMARILLO}1. Autenticación en Docker Hub:${RESET}"
echo "Ejecute el siguiente comando para iniciar sesión de forma segura:"
echo "  echo \"\$DOCKER_HUB_PASSWORD\" | docker login -u \"$DOCKER_HUB_USER\" --password-stdin"

# 2. Autenticación en AWS ECR (Amazon Elastic Container Registry)
echo -e "\n${AMARILLO}2. Autenticación en AWS ECR:${RESET}"
echo "  aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# 3. Autenticación en Google Artifact Registry (GAR)
echo -e "\n${AMARILLO}3. Autenticación en Google Artifact Registry:${RESET}"
echo "  gcloud auth configure-docker $GAR_REGION-docker.pkg.dev"

echo -e "\n${INDIGO}================================================================${RESET}"
echo -e "${AMARILLO}[FASE 2/3] ETIQUETADO (DOCKER TAG) Y SUBIDA (DOCKER PUSH) DE IMÁGENES${RESET}"

# Backend
echo -e "\n${VERDE}• Procesando Imagen del Backend (Spring Boot 3):${RESET}"
echo "  docker tag urbanview-backend:1.0 $DOCKER_HUB_USER/urbanview-backend:1.0"
echo "  docker push $DOCKER_HUB_USER/urbanview-backend:1.0"
echo "  docker tag urbanview-backend:1.0 $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/urbanview-backend:1.0"
echo "  docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/urbanview-backend:1.0"

# Frontend
echo -e "\n${VERDE}• Procesando Imagen del Frontend (React + Nginx):${RESET}"
echo "  docker tag urbanview-frontend:1.0 $DOCKER_HUB_USER/urbanview-frontend:1.0"
echo "  docker push $DOCKER_HUB_USER/urbanview-frontend:1.0"
echo "  docker tag urbanview-frontend:1.0 $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/urbanview-frontend:1.0"
echo "  docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/urbanview-frontend:1.0"

echo -e "\n${INDIGO}================================================================${RESET}"
echo -e "${AMARILLO}[FASE 3/3] PROTOCOLO DE CAJA NEGRA: DESTRUCCIÓN Y PERSISTENCIA (TAREA 4.3)${RESET}"
echo -e "${VERDE}Este protocolo demuestra la retención de datos geoespaciales en PostGIS bajo una destrucción total.${RESET}"

echo -e "\n${VERDE}Paso 1: Inicialización del Entorno${RESET}"
echo "  Levante el MVP de orquestación definitiva con docker-compose:"
echo "    docker compose up -d"

echo -e "\n${VERDE}Paso 2: Simulación de Ventas Inmobiliarias (Escritura de Estado)${RESET}"
echo "  1. Acceda al portal web en http://localhost"
echo "  2. Seleccione 3 lotes disponibles en el plano (ej. Mz A Lote 1, Mz A Lote 3, Mz B Lote 1)"
echo "  3. Haga clic en 'Marcar como VENDIDO' en el panel para actualizar los estados a VENDIDO."

echo -e "\n${VERDE}Paso 3: Destrucción Controlada de Contenedores${RESET}"
echo "  Ejecute la destrucción del stack de contenedores (¡Sin eliminar el volumen nombrado de datos!):"
echo "    docker compose down"
echo "  Confirmar que todos los contenedores han sido eliminados por completo con:"
echo "    docker ps -a"

echo -e "\n${VERDE}Paso 4: Levantamiento y Sincronización PostGIS${RESET}"
echo "  Levante de nuevo el entorno para recrear los contenedores vinculándolos al mismo volumen:"
echo "    docker compose up -d"

echo -e "\n${VERDE}Paso 5: Validación Técnica Excepcional de Persistencia${RESET}"
echo "  Acceda nuevamente al portal web http://localhost y verifique que los 3 lotes marcados sigan pintados en rojo (VENDIDO) y el porcentaje de ventas mantenga el progreso."
echo "  O realice una consulta directa a la base de datos para certificar la consistencia espacial en PostGIS:"
echo "    docker exec -it db-postgis psql -U postgres -d urbanview_db -c \"SELECT codigo, estado, ST_AsText(geom) FROM elementos_plano WHERE estado='VENDIDO';\""
echo -e "================================================================"
