import { findAll, findOne, create, update, remove, login, googleLogin, completeGoogleRegistration, getCurrentUser } from "../controllers/usuario.controller.js";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

export const routerUsuario = Router();

routerUsuario.post('/auth/google', googleLogin);

routerUsuario.post('/auth/google/complete', completeGoogleRegistration);

routerUsuario.post('/login', login);

routerUsuario.use(requireAuth);

routerUsuario.get('/me', getCurrentUser);

routerUsuario.get('/', findAll);

routerUsuario.get('/:id', findOne);

routerUsuario.post('/', create);

routerUsuario.put('/:id', update);

routerUsuario.delete('/:id', remove);


