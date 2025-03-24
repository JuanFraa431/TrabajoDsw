import { Request, Response } from 'express';
import { ReservaPaquete } from '../models/reservaPaquete.model.js';
import { orm } from '../shared/db/orm.js';
import { Usuario } from '../models/usuario.model.js';
import { Paquete } from '../models/paquete.model.js';
import { Persona } from '../models/persona.model.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const reservasPaquete = await em.find(ReservaPaquete, {});
    res.status(200).json({ message: 'ReservasPaquete encontradas', data: reservasPaquete });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const reservaPaquete = await em.findOneOrFail(ReservaPaquete, { id });
    res.status(200).json({ message: 'ReservaPaquete encontrada', data: reservaPaquete });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const { usuarioId, paqueteId, personaId, ...data } = req.body;

    if (!usuarioId) {
      return res.status(400).json({ message: 'El id del usuario es obligatorio' });
    }

    if (!paqueteId) {
      return res.status(400).json({ message: 'El id del paquete es obligatorio' });
    }

    if (!personaId) {
      return res.status(400).json({ message: 'El id de la persona es obligatorio' });
    }

    const usuario = await em.findOneOrFail(Usuario, { id: usuarioId });
    const paquete = await em.findOneOrFail(Paquete, { id: paqueteId });
    const persona = await em.findOneOrFail(Persona, { id: personaId });

    const reservaPaquete = em.create(ReservaPaquete, { usuario, paquete, persona, ...data });
    await em.flush();
    res.status(201).json({ message: 'ReservaPaquete creada', data: reservaPaquete });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const reservaPaquete = em.getReference(ReservaPaquete, id);
    em.assign(reservaPaquete, req.body);
    await em.flush();
    res.status(200).json({ message: 'ReservaPaquete actualizada' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const reservaPaquete = em.getReference(ReservaPaquete, id);
    em.removeAndFlush(reservaPaquete);
    res.status(200).json({ message: 'ReservaPaquete eliminada' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, create, update, remove };