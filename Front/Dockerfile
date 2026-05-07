FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias primero (mejor cache de Docker)
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# El proxy de webpack apunta al servicio "backend" en Docker
ENV BACKEND_URL=http://backend:3000

EXPOSE 8080

# Webpack dev server escuchando en 0.0.0.0 para ser accesible desde fuera del contenedor
CMD ["npx", "webpack", "serve", "--mode", "development", "--host", "0.0.0.0", "--port", "8080"]
