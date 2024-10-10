import {
  findAll,
  findOne,
  create,
  update,
  remove,
} from '../controllers/estadia.controller.js';
import { Router } from 'express';

export const routerEstadia = Router();

routerEstadia.get('/', findAll);

routerEstadia.get('/:id', findOne);

routerEstadia.post('/', create);

routerEstadia.put('/:id', update);

routerEstadia.delete('/:id', remove);
