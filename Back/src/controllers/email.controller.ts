import { Request, Response } from 'express';
import { emailService } from '../services/emailService.js';

// Endpoint para verificar la configuración SMTP
async function verificarEmail(req: Request, res: Response) {
    try {
        const conexionExitosa = await emailService.verificarConexion();
        
        if (conexionExitosa) {
            res.status(200).json({ 
                message: '✅ Configuración SMTP verificada exitosamente',
                status: 'success'
            });
        } else {
            res.status(500).json({ 
                message: '❌ Error en la configuración SMTP',
                status: 'error'
            });
        }
    } catch (error: any) {
        res.status(500).json({ 
            message: '❌ Error al verificar SMTP',
            error: error.message,
            status: 'error'
        });
    }
}

// Endpoint para enviar email de prueba
async function enviarEmailPrueba(req: Request, res: Response) {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                message: 'Email es requerido',
                status: 'error'
            });
        }

        const emailEnviado = await emailService.enviarEmailPrueba(email);
        
        if (emailEnviado) {
            res.status(200).json({ 
                message: `✅ Email de prueba enviado exitosamente a ${email}`,
                status: 'success'
            });
        } else {
            res.status(500).json({ 
                message: '❌ Error al enviar email de prueba',
                status: 'error'
            });
        }
    } catch (error: any) {
        res.status(500).json({ 
            message: '❌ Error al enviar email de prueba',
            error: error.message,
            status: 'error'
        });
    }
}

export { verificarEmail, enviarEmailPrueba };
