import {
  findAll,
  findOne,
  create,
  update,
  remove,
  findByType,
  findTypes,
  getPaquetesByExcursion,
} from '../controllers/excursion.controller.js';
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

export const routerExcursion = Router();

// Rutas públicas (usuarios no logueados pueden ver excursiones)
routerExcursion.get('/tipo', findTypes);
routerExcursion.get('/tipo/:tipo', findByType);
routerExcursion.get('/:id/paquetes', getPaquetesByExcursion);
routerExcursion.get('/', findAll);
routerExcursion.get('/:id', findOne);

// Rutas protegidas (solo usuarios autenticados)
routerExcursion.post('/', requireAuth, create);
routerExcursion.put('/:id', requireAuth, update);
routerExcursion.delete('/:id', requireAuth, remove);