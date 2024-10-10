import {
  findAll,
  findOne,
  create,
  update,
  remove,
} from '../controllers/comentario.controller.js';
import { Router } from 'express';

export const routerComentario = Router();

routerComentario.get('/', findAll);

routerComentario.get('/:id', findOne);

routerComentario.post('/', create);

routerComentario.put('/:id', update);

routerComentario.delete('/:id', remove);
