import {
  findAll,
  findOne,
  create,
  update,
  remove,
  findByPaquete
} from '../controllers/comentario.controller.js';
import { Router } from 'express';

export const routerComentario = Router();

routerComentario.get('/paquete/:id', findByPaquete);

routerComentario.get('/', findAll);

routerComentario.get('/:id', findOne);

routerComentario.post('/', create);

routerComentario.put('/:id', update);

routerComentario.delete('/:id', remove);
