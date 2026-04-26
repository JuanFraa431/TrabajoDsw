import { findAll, findOne, create, update, remove } from '../controllers/paqueteExcursion.controller.js';
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

export const routerPaqueteExcursion = Router();

// Rutas públicas (necesarias para ver detalles de paquetes)
routerPaqueteExcursion.get('/', findAll);
routerPaqueteExcursion.get('/:id', findOne);

// Rutas protegidas (solo usuarios autenticados)
routerPaqueteExcursion.post('/', requireAuth, create);
routerPaqueteExcursion.put('/:id', requireAuth, update);
routerPaqueteExcursion.delete('/:id', requireAuth, remove);
