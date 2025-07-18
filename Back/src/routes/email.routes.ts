import { Router } from 'express';
import { verificarEmail, enviarEmailPrueba } from '../controllers/email.controller.js';

export const emailRouter = Router();

emailRouter.get('/verificar', verificarEmail);

emailRouter.post('/prueba', enviarEmailPrueba);
