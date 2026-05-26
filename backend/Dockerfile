# ==========================================
# ETAPA 1: COMPILACIÓN (MAVEN + JDK)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Descargar dependencias de forma eficiente para aprovechar el caché de capas de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar el código fuente y compilar el binario ejecutable (.jar) omitiendo pruebas unitarias
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==========================================
# ETAPA 2: RUNTIME LIGHTWEIGHT (JRE ALTA EFICIENCIA)
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Configurar límites de memoria saludables para entornos contenedorizados
ENV JAVA_OPTS="-XX:+UseG1GC -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Copiar el binario compilado desde la etapa previa
COPY --from=build /app/target/*.jar app.jar

# Exponer el puerto predeterminado de Spring Boot
EXPOSE 8080

# Iniciar la aplicación
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
