import {
  findAll,
  findOne,
  create,
  update,
  remove,
} from '../controllers/persona.controller.js';
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

export const routerPersona = Router();

routerPersona.use(requireAuth);

routerPersona.get('/', findAll);

routerPersona.get('/:id', findOne);

routerPersona.post('/', create);

routerPersona.put('/:id', update);

routerPersona.delete('/:id', remove);
