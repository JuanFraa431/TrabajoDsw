import {
  findAll,
  findOne,
  create,
  update,
  remove,
} from '../controllers/estadia.controller.js';
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

export const routerEstadia = Router();

// Rutas públicas (necesarias para ver detalles de paquetes)
routerEstadia.get('/', findAll);
routerEstadia.get('/:id', findOne);

// Rutas protegidas (solo usuarios autenticados)
routerEstadia.post('/', requireAuth, create);
routerEstadia.put('/:id', requireAuth, update);
routerEstadia.delete('/:id', requireAuth, remove);
