import { Request, Response } from 'express';
import { Usuario } from '../models/usuario.model.js';
import bcrypt from 'bcrypt';
import { orm } from '../shared/db/orm.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client("1013873914332-sf1up07lqjoch6tork8cpfohi32st8pi.apps.googleusercontent.com");

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await em.find(Usuario, {});
    res.status(200).json({ message: 'Clientes encontrados', data: usuarios });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
  
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const usuario = await em.findOneOrFail(Usuario, { id });
    res.status(200).json({ message: 'Usuario encontrado', data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const { password, email, username, ...data } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'La contraseña es obligatoria' });
    }

    if (!email) {
      return res.status(400).json({ message: 'El email es obligatorio' });
    }

    if (username.includes('@')) {
      return res.status(400).json({ message: 'El nombre de usuario no puede contener un @' });
    }

    const existingUser = await em.findOne(Usuario, { email });
    const existingUserNick = await em.findOne(Usuario, { username });
    if (existingUser) {
      return res.status(401).json({ message: 'El email ya pertenece a un usuario' });
    }

    if (existingUserNick) {
      return res.status(401).json({ message: 'El nombre de usuario ya se encuentra en uso' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const usuario = em.create(Usuario, {
      ...data,
      email,
      username,
      password: hashedPassword,
    });

    await em.flush();

    res.status(201).json({ message: 'Usuario creado', data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);

    const usuario = em.getReference(Usuario, id);

    if (req.body.password) {
      const saltRounds = 10;
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    if (req.body.fecha_nacimiento) {
      console.log(req.body.fecha_nacimiento);
      const fechaUTC = new Date(req.body.fecha_nacimiento);
      fechaUTC.setUTCHours(10, 0, 0, 0);
      req.body.fecha_nacimiento = fechaUTC;
      console.log(req.body.fecha_nacimiento);
    }

    
    em.assign(usuario, req.body);

    await em.flush();

    res.status(200).json({ message: 'Usuario actualizado', data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const usuario = await em.findOne(Usuario, { id });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuario.estado = 0;
    await em.flush();

    res.status(200).json({ message: 'Usuario deshabilitado', data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function login(req: Request, res: Response) {
  try {
    const { password, identifier } = req.body;
    let usuario;
    if (identifier.includes('@')) {
      usuario = await em.findOneOrFail(Usuario, { email: identifier });
    }

    if (!usuario) {
      usuario = await em.findOneOrFail(Usuario, { username: identifier });
    }

    if (usuario) {
      const isMatch = await bcrypt.compare(password, usuario.password);

      if (isMatch) {
        const token = jwt.sign(
          { id: usuario.id, username: usuario.username },
          'secreto_del_token',
          { expiresIn: '1h' }
        );
        res
          .status(200)
          .json({ message: 'Usuario logueado', data: { usuario, token } });
      } else {
        res.status(401).json({ message: 'Contraseña incorrecta' });
      }
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function googleLogin(req: Request, res: Response) {
  try {
    const { token: googleToken } = req.body;
    if (!googleToken) {
      return res.status(400).json({ message: "Token de Google requerido" });
    }

    console.log("Google token:", googleToken);
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience: "1013873914332-sf1up07lqjoch6tork8cpfohi32st8pi.apps.googleusercontent.com",
      });
      payload = ticket.getPayload();

      console.log("Google payload:", payload);
    } catch (error) {
      console.error("Error verificando el token de Google:", error);
      return res.status(401).json({ message: "Token de Google inválido o expirado" });
    }

    if (!payload || !payload.email) {
      return res.status(401).json({ message: "Token de Google inválido" });
    }

    let usuario = await em.findOne(Usuario, { email: payload.email });

    if (!usuario) {
      usuario = em.create(Usuario, {
        username: payload.email,
        email: payload.email,
        password: "",
        estado: 1,
        tipo_usuario: "cliente",
        imagen: payload.picture || "",
        nombre: payload.given_name || "",
        apellido: payload.family_name || "",
        dni: "",
        fecha_nacimiento: new Date(),
      });
      await em.persistAndFlush(usuario);
    }

    const jwtToken = jwt.sign(
      { id: usuario.id, username: usuario.username },
      process.env.JWT_SECRET || "secreto_del_token",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Usuario logueado con Google",
      data: { usuario, token: jwtToken },
    });
  } catch (error: any) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

export { findAll, findOne, create, update, remove, login, googleLogin };
