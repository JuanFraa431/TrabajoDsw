import { findAll, findOne, create, update, remove, search, findAllUser, getExcursionesByPaquete } from "../controllers/paquete.controller.js";
import { Router } from "express";

export const routerPaquete = Router();

routerPaquete.get('/search', search);

routerPaquete.get('/user', findAllUser);

routerPaquete.get('/', findAll);

routerPaquete.get('/:id', findOne);

routerPaquete.post('/', create);

routerPaquete.put('/:id', update);

routerPaquete.delete('/:id', remove);

routerPaquete.get('/:id/excursiones', getExcursionesByPaquete);

