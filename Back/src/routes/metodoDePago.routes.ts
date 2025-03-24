import {
  findAll,
  findOne,
  create,
  update,
  remove,
} from '../controllers/metodoDePago.controller.js';
import { Router } from 'express';

export const routerMetodo = Router();

routerMetodo.get('/', findAll);

routerMetodo.get('/:id', findOne);

routerMetodo.post('/', create);

routerMetodo.put('/:id', update);

routerMetodo.delete('/:id', remove);
