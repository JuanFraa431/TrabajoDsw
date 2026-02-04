import {
  findAll,
  findOne,
  findByUsuario,
  create,
  update,
  remove,
  cancelar,
} from '../controllers/reservaPaquete.controller.js';
import { Router } from 'express';

export const routerReservaPaquete = Router();

routerReservaPaquete.get('/', findAll);

routerReservaPaquete.get('/usuario/:usuarioId', findByUsuario);

routerReservaPaquete.get('/:id', findOne);

routerReservaPaquete.post('/', create);

routerReservaPaquete.put('/:id', update);

routerReservaPaquete.patch('/:id/cancelar', cancelar);

routerReservaPaquete.delete('/:id', remove);
