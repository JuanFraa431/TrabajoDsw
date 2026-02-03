import {
  findAll,
  findOne,
  findByReserva,
  create,
  remove,
} from '../controllers/cancelacion.controller.js';
import { Router } from 'express';

export const routerCancelacion = Router();

routerCancelacion.get('/', findAll);

routerCancelacion.get('/reserva/:reservaId', findByReserva);

routerCancelacion.get('/:id', findOne);

routerCancelacion.post('/', create);

routerCancelacion.delete('/:id', remove);
