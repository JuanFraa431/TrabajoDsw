import { findAll, findOne, create, update, remove } from "../controllers/transporte.controller.js";
import { Router } from "express";

export const routerTransporte = Router();

routerTransporte.get('/', findAll);

routerTransporte.get('/:id', findOne);

routerTransporte.post('/', create);

routerTransporte.put('/:id', update);

routerTransporte.delete('/:id', remove);