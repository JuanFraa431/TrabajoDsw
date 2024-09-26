import {
  findAll,
  findOne,
  create,
  update,
  remove,
} from '../controllers/ciudad.controller.js';
import { Router } from 'express';

export const routerCiudad = Router();

routerCiudad.get('/', findAll);

routerCiudad.get('/:id', findOne);

routerCiudad.post('/', create);

routerCiudad.put('/:id', update);

routerCiudad.delete('/:id', remove);
