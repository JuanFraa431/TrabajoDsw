import {
  findAll,
  findOne,
  create,
  update,
  remove
} from '../controllers/comentario.controller.js';
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

export const routerComentario = Router();

// Rutas públicas (usuarios no logueados pueden ver comentarios)
routerComentario.get('/', findAll);
routerComentario.get('/:id', findOne);

// Rutas protegidas (solo usuarios autenticados pueden crear/editar/borrar comentarios)
routerComentario.post('/', requireAuth, create);
routerComentario.put('/:id', requireAuth, update);
routerComentario.delete('/:id', requireAuth, remove);
