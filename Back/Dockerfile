FROM node:20-alpine

# Instalar dependencias de compilación para módulos nativos (bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar archivos de dependencias primero (mejor cache de Docker)
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
