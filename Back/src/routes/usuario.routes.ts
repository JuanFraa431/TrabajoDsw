import { findAll, findOne, create, update, remove, login, googleLogin } from "../controllers/usuario.controller.js";
import { Router } from "express";

export const routerUsuario = Router();

routerUsuario.post('/auth/google', googleLogin);

routerUsuario.post('/login', login);

routerUsuario.get('/', findAll);

routerUsuario.get('/:id', findOne);

routerUsuario.post('/', create);

routerUsuario.put('/:id', update);

routerUsuario.delete('/:id', remove);


