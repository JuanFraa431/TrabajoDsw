import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extendemos la interfaz Request de Express para que acepte la propiedad currentUser
declare global {
  namespace Express {
    interface Request {
      currentUser?: string | jwt.JwtPayload;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // 1. Obtener el token desde el header de Authorization (formato: "Bearer <token>")
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Acceso denegado. Token no provisto o formato inválido (se esperaba Bearer token).' 
    });
  }

  // Extraemos solo el token (descartamos la palabra "Bearer")
  const token = authHeader.split(' ')[1];

  try {
    // 2. Verificar el token usando la clave secreta
    // IMPORTANTE: Asegúrate de tener JWT_SECRET en tu archivo .env
    const secret = process.env.JWT_SECRET || 'tu_clave_secreta_por_defecto'; 
    
    const payload = jwt.verify(token, secret);

    // 3. Asignamos los datos decodificados del usuario a la request
    req.currentUser = payload;

    // 4. Continuamos con el siguiente middleware o el controlador de la ruta
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Acceso denegado. Token inválido o expirado.' });
  }
};
