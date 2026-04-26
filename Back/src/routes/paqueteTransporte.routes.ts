import {
  findAll,
  findOne,
  findByPaquete,
  create,
  update,
  remove,
} from "../controllers/paqueteTransporte.controller.js";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

export const routerPaqueteTransporte = Router();

// Rutas públicas (necesarias para ver detalles de paquetes)
routerPaqueteTransporte.get("/", findAll);
routerPaqueteTransporte.get("/paquete/:paqueteId", findByPaquete);
routerPaqueteTransporte.get("/:id", findOne);

// Rutas protegidas (solo usuarios autenticados)
routerPaqueteTransporte.post("/", requireAuth, create);
routerPaqueteTransporte.put("/:id", requireAuth, update);
routerPaqueteTransporte.delete("/:id", requireAuth, remove);
