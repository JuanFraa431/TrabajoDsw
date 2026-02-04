import { Request, Response } from "express";
import { Usuario } from "../models/usuario.model.js";
import bcrypt from "bcrypt";
import { orm } from "../shared/db/orm.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(
  "1013873914332-sf1up07lqjoch6tork8cpfohi32st8pi.apps.googleusercontent.com",
);

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await em.find(Usuario, {});
    res.status(200).json({ message: "Clientes encontrados", data: usuarios });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const usuario = await em.findOneOrFail(Usuario, { id });
    res.status(200).json({ message: "Usuario encontrado", data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const { password, email, username, ...data } = req.body;
    if (data.estado !== undefined && data.estado !== 0 && data.estado !== 1) {
      return res.status(400).json({ message: "Estado de usuario inválido" });
    }

    if (!password) {
      return res.status(400).json({ message: "La contraseña es obligatoria" });
    }

    if (!email) {
      return res.status(400).json({ message: "El email es obligatorio" });
    }

    if (!username) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario es obligatorio" });
    }

    if (username.includes("@")) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario no puede contener un @" });
    }

    const existingUser = await em.findOne(Usuario, { email });
    const existingUserNick = await em.findOne(Usuario, { username });
    if (existingUser) {
      return res
        .status(401)
        .json({ message: "El email ya pertenece a un usuario" });
    }

    if (existingUserNick) {
      return res
        .status(401)
        .json({ message: "El nombre de usuario ya se encuentra en uso" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Procesar fecha de nacimiento si se proporciona
    const userData = { ...data };
    if (userData.fecha_nacimiento) {
      const fechaUTC = new Date(userData.fecha_nacimiento);
      if (Number.isNaN(fechaUTC.getTime())) {
        return res
          .status(400)
          .json({ message: "Fecha de nacimiento inválida" });
      }
      fechaUTC.setUTCHours(10, 0, 0, 0);
      userData.fecha_nacimiento = fechaUTC;
    }

    const usuario = em.create(Usuario, {
      ...userData,
      nombre: userData.nombre ?? "",
      apellido: userData.apellido ?? "",
      dni: userData.dni ?? "",
      email,
      username,
      password: hashedPassword,
    });

    await em.flush();

    res.status(201).json({ message: "Usuario creado", data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);

    const usuario = await em.findOneOrFail(Usuario, { id });
    if (
      req.body.estado !== undefined &&
      req.body.estado !== 0 &&
      req.body.estado !== 1
    ) {
      return res.status(400).json({ message: "Estado de usuario inválido" });
    }

    // Validar email único si se está actualizando
    if (req.body.email && req.body.email !== usuario.email) {
      const existingUser = await em.findOne(Usuario, { email: req.body.email });
      if (existingUser) {
        return res
          .status(401)
          .json({ message: "El email ya pertenece a otro usuario" });
      }
    }

    // Validar username único si se está actualizando
    if (req.body.username && req.body.username !== usuario.username) {
      if (req.body.username.includes("@")) {
        return res
          .status(400)
          .json({ message: "El nombre de usuario no puede contener un @" });
      }

      const existingUserNick = await em.findOne(Usuario, {
        username: req.body.username,
      });
      if (existingUserNick) {
        return res
          .status(401)
          .json({ message: "El nombre de usuario ya se encuentra en uso" });
      }
    }

    if (req.body.password) {
      const saltRounds = 10;
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    if (req.body.fecha_nacimiento) {
      console.log(req.body.fecha_nacimiento);
      const fechaUTC = new Date(req.body.fecha_nacimiento);
      if (Number.isNaN(fechaUTC.getTime())) {
        return res
          .status(400)
          .json({ message: "Fecha de nacimiento inválida" });
      }
      fechaUTC.setUTCHours(10, 0, 0, 0);
      req.body.fecha_nacimiento = fechaUTC;
      console.log(req.body.fecha_nacimiento);
    }

    em.assign(usuario, req.body);

    await em.flush();

    res.status(200).json({ message: "Usuario actualizado", data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const usuario = await em.findOne(Usuario, { id });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    usuario.estado = 0;
    await em.flush();

    res.status(200).json({ message: "Usuario deshabilitado", data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function login(req: Request, res: Response) {
  try {
    const { password, identifier } = req.body;
    let usuario;
    if (identifier.includes("@")) {
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
          "secreto_del_token",
          { expiresIn: "1h" },
        );
        res
          .status(200)
          .json({ message: "Usuario logueado", data: { usuario, token } });
      } else {
        res.status(401).json({ message: "Contraseña incorrecta" });
      }
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function googleLogin(req: Request, res: Response) {
  try {
    const { token: googleToken } = req.body;

    console.log("Received Google login request");

    if (!googleToken) {
      console.log("No Google token provided");
      return res.status(400).json({ message: "Token de Google requerido" });
    }

    console.log("Verifying Google token...");
    let payload;

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience:
          "1013873914332-sf1up07lqjoch6tork8cpfohi32st8pi.apps.googleusercontent.com",
      });
      payload = ticket.getPayload();
      console.log("Google token verified successfully");
    } catch (error) {
      console.error("Error verificando el token de Google:", error);
      return res.status(401).json({
        message: "Token de Google inválido o expirado",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    if (!payload || !payload.email) {
      console.log("Invalid payload or missing email");
      return res
        .status(401)
        .json({ message: "Token de Google inválido - falta email" });
    }

    console.log("Searching for user with email:", payload.email);
    let usuario = await em.findOne(Usuario, { email: payload.email });

    if (!usuario) {
      console.log("User not found, creating new user");
      usuario = em.create(Usuario, {
        username: payload.email.split("@")[0], // Usar parte antes del @ como username
        email: payload.email,
        password: "", // Usuario de Google no necesita contraseña
        estado: 1,
        tipo_usuario: "CLIENTE",
        imagen: payload.picture || "",
        nombre: payload.given_name || "",
        apellido: payload.family_name || "",
        dni: "",
        fecha_nacimiento: new Date(),
      });
      await em.persistAndFlush(usuario);
      console.log("New user created with ID:", usuario.id);
    } else {
      console.log("Existing user found with ID:", usuario.id);
      // Actualizar información del usuario si es necesario
      if (payload.picture && payload.picture !== usuario.imagen) {
        usuario.imagen = payload.picture;
      }
      if (payload.given_name && payload.given_name !== usuario.nombre) {
        usuario.nombre = payload.given_name;
      }
      if (payload.family_name && payload.family_name !== usuario.apellido) {
        usuario.apellido = payload.family_name;
      }
      await em.flush();
    }

    const jwtToken = jwt.sign(
      { id: usuario.id, username: usuario.username },
      process.env.JWT_SECRET || "secreto_del_token",
      { expiresIn: "1h" },
    );

    console.log("Google login successful for user:", usuario.id);
    return res.status(200).json({
      message: "Usuario logueado con Google",
      data: { usuario, token: jwtToken },
    });
  } catch (error: any) {
    console.error("Google login error:", error);
    return res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
    });
  }
}

export { findAll, findOne, create, update, remove, login, googleLogin };
