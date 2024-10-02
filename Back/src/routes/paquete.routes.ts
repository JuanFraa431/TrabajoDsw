import { findAll, findOne, create, update, remove } from "../controllers/paquete.controller.js";
import { Router } from "express";

export const routerPaquete = Router();

routerPaquete.get('/', findAll);

routerPaquete.get('/:id', findOne);

routerPaquete.post('/', create);

routerPaquete.put('/:id', update);

routerPaquete.delete('/:id', remove);