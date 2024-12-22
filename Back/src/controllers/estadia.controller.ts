import { Request, Response } from 'express';
import { Estadia } from '../models/estadia.model.js';
import { orm }  from '../shared/db/orm.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const estadias = await em.find(Estadia, {});
    res.status(200).json({ message: 'Estadias encontradas', data: estadias });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const estadia = await em.findOneOrFail(Estadia, { id });
    res.status(200).json({ message: 'Estadia encontrada', data: estadia });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const estadia = em.create(Estadia, req.body);
    await em.flush();
    res.status(201).json({ message: 'Estadia creada', data: estadia });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const estadia = em.getReference(Estadia, id);
    em.assign(estadia, req.body);
    await em.flush();
    res.status(200).json({ message: 'Estadia actualizada', data: estadia });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const estadia = em.getReference(Estadia, id);
    em.removeAndFlush(estadia);
    res.status(200).json({ message: 'Estadia eliminada' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, create, update, remove };
