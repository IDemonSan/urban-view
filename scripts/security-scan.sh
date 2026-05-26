#!/usr/bin/env bash

# ==============================================================================
# SCRIPT DE ESCANEO DE SEGURIDAD CON TRIVY - PROPTECH MVP
# ==============================================================================
# Escanea localmente la imagen Docker del backend para identificar CVEs
# y vulnerabilidades de seguridad antes del push al registro.
# ==============================================================================

# Colores de salida
VERDE='\033[0;32m'
AMARILLO='\033[1;33m'
ROJO='\033[0;31m'
RESET='\033[0;0m'

# Parámetros y directorios
IMAGE_NAME=${1:-"urbanview-backend:1.0"}
OUTPUT_DIR="reports/security"
OUTPUT_FILE="${OUTPUT_DIR}/trivy-scan.json"

echo -e "${AMARILLO}[TRIVY] Iniciando escaneo de seguridad para la imagen: ${IMAGE_NAME}...${RESET}"

# Crear directorio de salida si no existe
mkdir -p "${OUTPUT_DIR}"

# Ejecutar Trivy localmente usando Docker
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/${OUTPUT_DIR}:/reports" \
  aquasec/trivy:latest image \
  --format json \
  --output "/reports/trivy-scan.json" \
  "${IMAGE_NAME}"

# Verificar si se completó exitosamente
if [ $? -eq 0 ]; then
  echo -e "${VERDE}✔ Escaneo de seguridad Trivy completado de forma exitosa.${RESET}"
  echo -e "${VERDE}✔ Reporte JSON guardado en: ${OUTPUT_FILE}${RESET}"
  
  # Generar reporte corto en Markdown
  echo -e "\n${AMARILLO}[TRIVY] Resumen de vulnerabilidades críticas y altas:${RESET}"
  docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    aquasec/trivy:latest image \
    --severity HIGH,CRITICAL \
    --light \
    "${IMAGE_NAME}"
else
  echo -e "${ROJO}✖ Error al ejecutar el escaneo de seguridad Trivy.${RESET}"
  exit 1
fi
