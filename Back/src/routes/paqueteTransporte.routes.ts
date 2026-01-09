import {
  findAll,
  findOne,
  findByPaquete,
  create,
  update,
  remove,
} from "../controllers/paqueteTransporte.controller.js";
import { Router } from "express";

export const routerPaqueteTransporte = Router();

routerPaqueteTransporte.get("/", findAll);

routerPaqueteTransporte.get("/paquete/:paqueteId", findByPaquete);

routerPaqueteTransporte.get("/:id", findOne);

routerPaqueteTransporte.post("/", create);

routerPaqueteTransporte.put("/:id", update);

routerPaqueteTransporte.delete("/:id", remove);
