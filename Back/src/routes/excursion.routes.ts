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

export const routerExcursion = Router();

routerExcursion.get('/tipo', findTypes);

routerExcursion.get('/tipo/:tipo', findByType);

routerExcursion.get('/:id/paquetes', getPaquetesByExcursion);

routerExcursion.get('/', findAll);

routerExcursion.get('/:id', findOne);

routerExcursion.post('/', create);

routerExcursion.put('/:id', update);

routerExcursion.delete('/:id', remove);