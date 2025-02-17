import { Request, Response } from 'express';
import { Comentario } from '../models/comentario.model.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const comentarios = await em.find(Comentario, {}, { populate: ['cliente'] });
    res.status(200).json({ message: 'Comentarios encontrados', data: comentarios });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
} 

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const comentario = await em.findOneOrFail(Comentario, { id }, { populate: ['cliente'] });
    res.status(200).json({ message: 'Comentario encontrado', data: comentario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const comentario = em.create(Comentario, req.body);
    await em.flush();
    res.status(201).json({ message: 'Comentario creado', data: comentario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const comentario = em.getReference(Comentario, id);
    em.assign(comentario, req.body);
    await em.flush();
    res.status(200).json({ message: 'Comentario actualizado' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const comentario = em.getReference(Comentario, id);
    em.removeAndFlush(comentario);
    res.status(200).json({ message: 'Comentario eliminado' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, create, update, remove };
