import { Request, Response } from 'express';
import { Hotel } from '../models/hotel.model.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const hoteles = await em.find(Hotel, {});
    res.status(200).json({ message: 'Hoteles encontrados', data: hoteles });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const hotel = await em.findOneOrFail(Hotel, { id });
    res.status(200).json({ message: 'Hotel encontrado', data: hotel });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const hotel = em.create(Hotel, req.body);
    await em.flush();
    res.status(201).json({ message: 'Hotel creado', data: hotel });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const hotel = em.getReference(Hotel, id);
    em.assign(hotel, req.body);
    await em.flush();
    res.status(200).json({ message: 'Hotel actualizado', data: hotel });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const hotel = em.getReference(Hotel, id);
    em.removeAndFlush(hotel);
    res.status(200).json({ message: 'Hotel eliminado' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, create, update, remove };
