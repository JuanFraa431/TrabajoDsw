import { Request, Response } from 'express';
import { Usuario } from '../models/usuario.model.js';
import bcrypt from 'bcrypt';
import { orm } from '../shared/db/orm.js';
import jwt from 'jsonwebtoken';
import { log } from 'console';

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
    const { password, ...data } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'La contraseña es obligatoria' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const usuario = em.create(Usuario, {
      ...data,
      password: hashedPassword
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
    const { username, password } = req.body;
    const usuario = await em.findOneOrFail(Usuario, { username });

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

export { findAll, findOne, create, update, remove, login };
