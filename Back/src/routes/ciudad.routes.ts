import {
  findAll,
  findOne,
  create,
  update,
  remove,
} from '../controllers/ciudad.controller.js';
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

export const routerCiudad = Router();

// Rutas públicas (usuarios no logueados pueden ver ciudades)
routerCiudad.get('/', findAll);
routerCiudad.get('/:id', findOne);

// Rutas protegidas (solo usuarios autenticados)
routerCiudad.post('/', requireAuth, create);
routerCiudad.put('/:id', requireAuth, update);
routerCiudad.delete('/:id', requireAuth, remove);
