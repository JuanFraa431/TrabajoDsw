import {
  findAll,
  findOne,
  create,
  update,
  remove,
} from '../controllers/excursion.controller.js';
import { Router } from 'express';

export const routerExcursion = Router();

routerExcursion.get('/', findAll);

routerExcursion.get('/:id', findOne);

routerExcursion.post('/', create);

routerExcursion.put('/:id', update);

routerExcursion.delete('/:id', remove);
