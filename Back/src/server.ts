import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {routerCliente} from './routes/cliente.routes.js';
import {routerCiudad} from './routes/ciudad.routes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:8080'
}));

app.use(express.json());

app.use('/api/cliente', routerCliente);
app.use('/api/ciudad', routerCiudad);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;

console.log(`Iniciando el servidor en el puerto ${PORT}`); // Añadir un log
app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Puedes abrir el servidor en: ${url}`);
});