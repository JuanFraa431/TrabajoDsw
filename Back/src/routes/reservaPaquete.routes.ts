import {
  findAll,
  findOne,
  findByUsuario,
  create,
  update,
  remove,
} from '../controllers/reservaPaquete.controller.js';
import { Router } from 'express';

export const routerReservaPaquete = Router();

routerReservaPaquete.get('/', findAll);

routerReservaPaquete.get('/usuario/:usuarioId', findByUsuario);

routerReservaPaquete.get('/:id', findOne);

routerReservaPaquete.post('/', create);

routerReservaPaquete.put('/:id', update);

routerReservaPaquete.delete('/:id', remove);
