import { findAll, findOne, create, update, remove } from "../controllers/cliente.controller.js";
import { Router } from "express";

export const routerCliente = Router();

routerCliente.get('/', findAll);

routerCliente.get('/:id', findOne);

routerCliente.post('/', create);

routerCliente.put('/:id', update);

routerCliente.delete('/:id', remove);