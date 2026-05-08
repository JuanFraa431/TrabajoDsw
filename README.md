# Seminario Integrador - Analista Universitario de Sistemas de Información

## Integrantes
- 51564 - Cascardo, Bruno
- 50489 - Dragotta, Tomás
- 51200 - Martinez, Jano

## Descripción
El sistema de gestión para la agencia de turismo automatiza procesos de alta, baja, modificación y consulta de destinos, excursiones y clientes. Permite la creación flexible de paquetes de viaje e integra un módulo de reservas en línea. Incluye herramientas para seguimiento de consultas y quejas, garantizando una gestión eficiente y transparente.

## Casos de Uso
- E03-R02-ART-CUU 01 - Realizar Reserva Paquete
- E03-R02-ART-CUU 02 - ABM Paquete
- E03-R02-ART-CUU 03 - ABM Cliente
- E03-R02-ART-CUU 04 - ABM Tipo de Transporte
- E03-R02-ART-CUU 05 - Cancelar reserva paquete
- E03-R02-ART-CUU 06 - ABM Hotel
- E03-R02-ART-CUU 07 - ABM Excursión
- E03-R02-ART-CUU 08 - ABM Ciudad
- E03-R02-ART-CUU 09 - Registrar comentarios
- E03-R02-ART-CUU 10 - Consultar reporte de ventas
- E03-R02-ART-CUU 11 - Reporte ciudades más elegidas
- E03-R02-ART-CUU 12 - Reporte de reservas por periodo

## Página pública

http://34.151.237.162/

## Ejecutar el proyecto localmente

### Opción 1: Con Docker (recomendado) 🐳

Solo necesitás tener [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado.

```bash
# 1. Cloná el repositorio
git clone https://github.com/JuanFraa431/TP_Seminario.git
cd TP_Seminario

# 2. Copiá el archivo de variables de entorno y completá los valores
cp .env.docker.example .env

# 3. Levantá todos los servicios (backend + frontend + base de datos)
docker compose up --build

# 4. Abrí el navegador en http://localhost:8080
```

Para detener los servicios: `Ctrl + C` o `docker compose down`

Para borrar los datos de la base de datos: `docker compose down -v`

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:3000 |
| MySQL | localhost:3307 (usuario/contraseña en `.env`) |

### Opción 2: Sin Docker

Requiere Node.js ≥18 y MySQL instalados localmente.

```bash
npm run startAll
```
