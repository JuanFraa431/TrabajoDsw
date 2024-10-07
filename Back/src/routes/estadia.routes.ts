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

routerEstadia.get('/:id_paquete/:id_hotel', findOne);

routerEstadia.post('/', create);

routerEstadia.put('/:id_paquete/:id_hotel', update);

routerEstadia.delete('/:id_paquete/:id_hotel', remove);
