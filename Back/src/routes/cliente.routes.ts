import { findAll, findOne } from "../controllers/cliente.controller.js";
import { Router } from "express";

export const routerCliente = Router();

routerCliente.get('/', findAll);

routerCliente.get('/:id', findOne);