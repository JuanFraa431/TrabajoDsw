import { Request, Response } from 'express';
import { MetodoDePago } from '../models/metodoDePago.model.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const metodosDePago = await em.find(MetodoDePago, {});
    res.status(200).json({ message: 'Metodos de pago encontrados', data: metodosDePago });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const metodoDePago = await em.findOneOrFail(MetodoDePago, { id });
    res.status(200).json({ message: 'Metodo de pago encontrado', data: metodoDePago });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const metodoDePago = em.create(MetodoDePago, req.body);
    await em.flush();
    res.status(201).json({ message: 'Metodo de pago creado', data: metodoDePago });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const metodoDePago = em.getReference(MetodoDePago, id);
    em.assign(metodoDePago, req.body);
    await em.flush();
    res.status(200).json({ message: 'Metodo de pago actualizado' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const metodoDePago = em.getReference(MetodoDePago, id);
    em.removeAndFlush(metodoDePago);
    res.status(200).json({ message: 'Metodo de pago eliminado' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, create, update, remove };