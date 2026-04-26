import { findAll, findOne, create, update, remove, search, findAllUser, getExcursionesByPaquete } from "../controllers/paquete.controller.js";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

export const routerPaquete = Router();

// Rutas públicas (usuarios no logueados pueden ver paquetes)
routerPaquete.get('/search', search);
routerPaquete.get('/user', findAllUser);
routerPaquete.get('/', findAll);
routerPaquete.get('/:id', findOne);
routerPaquete.get('/:id/excursiones', getExcursionesByPaquete);

// Rutas protegidas (solo usuarios autenticados)
routerPaquete.post('/', requireAuth, create);
routerPaquete.put('/:id', requireAuth, update);
routerPaquete.delete('/:id', requireAuth, remove);
