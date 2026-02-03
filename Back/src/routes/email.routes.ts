import { Router } from "express";
import {
  verificarEmail,
  enviarEmailPrueba,
  enviarConfirmacionPago,
  enviarRechazoReserva,
} from "../controllers/email.controller.js";

export const emailRouter = Router();

emailRouter.get("/verificar", verificarEmail);

emailRouter.post("/prueba", enviarEmailPrueba);

emailRouter.post("/confirmacion-pago", enviarConfirmacionPago);

emailRouter.post("/rechazo-reserva", enviarRechazoReserva);
