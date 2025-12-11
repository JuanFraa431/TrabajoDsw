import { Router } from 'express';
import { findAll, findOne, create, update, remove } from '../controllers/tipoTransporte.controller.js';

export const routerTipoTransporte = Router();

routerTipoTransporte.get('/', findAll);
routerTipoTransporte.get('/:id', findOne);
routerTipoTransporte.post('/', create);
routerTipoTransporte.put('/:id', update);
routerTipoTransporte.patch('/:id', update);
routerTipoTransporte.delete('/:id', remove);
