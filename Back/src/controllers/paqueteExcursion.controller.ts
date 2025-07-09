import { Request, Response } from 'express';
import { PaqueteExcursion } from '../models/paqueteExcursion.model.js';
import { orm } from '../shared/db/orm.js';
import { actualizarPrecioPaquete } from '../utils/paqueteUtils.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const paqueteExcursiones = await em.find(PaqueteExcursion, {});
    res.status(200).json({ message: 'PaqueteExcursiones encontradas', data: paqueteExcursiones });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const paqueteExcursion = await em.findOneOrFail(PaqueteExcursion, { id });
    res.status(200).json({ message: 'PaqueteExcursion encontrada', data: paqueteExcursion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const paqueteExcursion = em.create(PaqueteExcursion, req.body);
    await em.flush();

    // Actualizar el precio del paquete automáticamente
    const paqueteId = paqueteExcursion.paquete?.id;
    if (paqueteId) {
      await actualizarPrecioPaquete(paqueteId);
    }

    res.status(201).json({ message: 'PaqueteExcursion creada', data: paqueteExcursion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const paqueteExcursion = await em.findOneOrFail(PaqueteExcursion, { id }, { populate: ['paquete'] });
    em.assign(paqueteExcursion, req.body);
    await em.flush();

    // Actualizar el precio del paquete automáticamente
    const paqueteId = paqueteExcursion.paquete?.id;
    if (paqueteId) {
      await actualizarPrecioPaquete(paqueteId);
    }

    res.status(200).json({ message: 'PaqueteExcursion actualizada' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const paqueteExcursion = await em.findOneOrFail(PaqueteExcursion, { id }, { populate: ['paquete'] });
    const paqueteId = paqueteExcursion.paquete?.id;

    await em.removeAndFlush(paqueteExcursion);

    // Actualizar el precio del paquete después de eliminar la excursión
    if (paqueteId) {
      await actualizarPrecioPaquete(paqueteId);
    }

    res.status(200).json({ message: 'PaqueteExcursion eliminada' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, create, update, remove };