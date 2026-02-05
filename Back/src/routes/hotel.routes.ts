import { findAll, findOne, create, update, remove, getPaquetesByHotel } from '../controllers/hotel.controller.js';
import { Router } from 'express';

export const routerHotel = Router();

routerHotel.get('/:id/paquetes', getPaquetesByHotel);

routerHotel.get('/', findAll);

routerHotel.get('/:id', findOne);

routerHotel.post('/', create);

routerHotel.put('/:id', update);

routerHotel.delete('/:id', remove);
