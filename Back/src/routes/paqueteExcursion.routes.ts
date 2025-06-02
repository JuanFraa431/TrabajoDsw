import { findAll, findOne, create, update, remove } from '../controllers/paqueteExcursion.controller.js';
import { Router } from 'express';

export const routerPaqueteExcursion = Router();

routerPaqueteExcursion.get('/', findAll);

routerPaqueteExcursion.get('/:id', findOne);

routerPaqueteExcursion.post('/', create);

routerPaqueteExcursion.put('/:id', update);

routerPaqueteExcursion.delete('/:id', remove);
