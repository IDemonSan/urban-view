# Docker Cheat Sheet - PropTech MVP

Este documento reúne los comandos nativos de Docker y Docker Compose adaptados específicamente para nuestro sistema microservicios `urban-view`.

---

## 1. Redes (Networks)

### Crear red puente (bridge) personalizada
Para interconectar contenedores sin Docker Compose en el Sprint 2:
```bash
docker network create --driver bridge red-proptech-manual
```

### Listar redes de Docker
```bash
docker network ls
```

### Inspeccionar red
Ver qué contenedores están conectados y sus IPs:
```bash
docker network inspect red-proptech-manual
```

---

## 2. Base de Datos (PostgreSQL + PostGIS)

### Levantar contenedor de base de datos manualmente
```bash
docker run -d \
  --name db-postgis-manual \
  --network red-proptech-manual \
  -e POSTGRES_DB=urbanview_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgrespassword \
  -v db_data_manual:/var/lib/postgresql/data \
  postgis/postgis:15-3.3
```

### Cargar script init.sql manualmente
```bash
docker cp database/init.sql db-postgis-manual:/init.sql
docker exec -it db-postgis-manual psql -U postgres -d urbanview_db -f /init.sql
```

### Entrar a la consola de psql en el contenedor
```bash
docker exec -it db-postgis-manual psql -U postgres -d urbanview_db
```
*(Dentro de psql, escribe `\dt` para ver tablas, o `SELECT * FROM elementos_plano;`)*

---

## 3. Backend (Spring Boot 3)

### Compilar imagen de backend local
```bash
cd backend
docker build -t urbanview-backend:1.0 .
cd ..
```

### Levantar contenedor de backend manualmente
Inyectando la IP del contenedor de base de datos extraída mediante `docker inspect`:
```bash
docker run -d \
  --name api-backend-manual \
  --network red-proptech-manual \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db-postgis-manual:5432/urbanview_db \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=postgrespassword \
  urbanview-backend:1.0
```

---

## 4. Inspección y Logs

### Obtener IP interna de un contenedor (¡Clave para el Sprint 2!)
```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' db-postgis-manual
```

### Ver logs en tiempo real (Follow)
```bash
# Para el backend
docker logs -f api-backend-manual

# Para la base de datos
docker logs -f db-postgis-manual
```

### Listar contenedores activos y todos
```bash
docker ps
docker ps -a
```

### Ver consumo de recursos de los contenedores
```bash
docker stats
```

---

## 5. Docker Compose (Sprint 3 y 4)

### Levantar todo el stack en segundo plano (Detached)
```bash
docker compose up -d
```

### Detener el stack y borrar contenedores conservando volúmenes
```bash
docker compose down
```

### Destrucción absoluta (Detener y borrar volúmenes de base de datos)
```bash
docker compose down -v
```

### Ver logs agregados de todo el compose
```bash
docker compose logs -f
```

### Forzar reconstrucción de imágenes al levantar
```bash
docker compose up -d --build
```
