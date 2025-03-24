import {
  findAll,
  findOne,
  create,
  update,
  remove,
} from '../controllers/pago.controller.js';
import { Router } from 'express';

export const routerPago = Router();

routerPago.get('/', findAll);

routerPago.get('/:id', findOne);

routerPago.post('/', create);

routerPago.put('/:id', update);

routerPago.delete('/:id', remove);
