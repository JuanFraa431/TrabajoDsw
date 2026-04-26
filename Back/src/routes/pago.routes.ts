import {
  findAll,
  findOne,
  create,
  update,
  remove,
} from '../controllers/pago.controller.js';
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

export const routerPago = Router();

routerPago.use(requireAuth);

routerPago.get('/', findAll);

routerPago.get('/:id', findOne);

routerPago.post('/', create);

routerPago.put('/:id', update);

routerPago.delete('/:id', remove);
