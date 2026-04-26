import { Router } from 'express';
import { findAll, findOne, create, update, remove } from '../controllers/tipoTransporte.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const routerTipoTransporte = Router();

// Rutas públicas (usuarios no logueados pueden ver tipos de transporte)
routerTipoTransporte.get('/', findAll);
routerTipoTransporte.get('/:id', findOne);

// Rutas protegidas (solo usuarios autenticados)
routerTipoTransporte.post('/', requireAuth, create);
routerTipoTransporte.put('/:id', requireAuth, update);
routerTipoTransporte.patch('/:id', requireAuth, update);
routerTipoTransporte.delete('/:id', requireAuth, remove);
