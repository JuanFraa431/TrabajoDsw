import { findAll, findOne, create, update, remove, getPaquetesByHotel } from '../controllers/hotel.controller.js';
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

export const routerHotel = Router();

// Rutas públicas (usuarios no logueados pueden ver hoteles)
routerHotel.get('/:id/paquetes', getPaquetesByHotel);
routerHotel.get('/', findAll);
routerHotel.get('/:id', findOne);

// Rutas protegidas (solo usuarios autenticados)
routerHotel.post('/', requireAuth, create);
routerHotel.put('/:id', requireAuth, update);
routerHotel.delete('/:id', requireAuth, remove);
