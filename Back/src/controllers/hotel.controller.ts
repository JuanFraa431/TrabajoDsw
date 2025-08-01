import { Request, Response } from 'express';
import { Hotel } from '../models/hotel.model.js';
import { Ciudad } from '../models/ciudad.model.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const hoteles = await em.find(Hotel, {}, { populate: ['ciudad'] });
    res.status(200).json({ message: 'Hoteles encontrados', data: hoteles });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const hotel = await em.findOneOrFail(Hotel, { id }, { populate: ['ciudad'] });
    res.status(200).json({ message: 'Hotel encontrado', data: hotel });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const { id_ciudad, ...hotelData } = req.body;

    if (id_ciudad) {
      const ciudad = await em.findOne(Ciudad, { id: id_ciudad });
      if (!ciudad) {
        return res.status(400).json({ message: 'Ciudad no encontrada' });
      }
      const hotel = em.create(Hotel, { ...hotelData, ciudad });
      await em.flush();
      res.status(201).json({ message: 'Hotel creado', data: hotel });
    } else {
      return res.status(400).json({ message: 'id_ciudad es requerido' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const { id_ciudad, ...hotelData } = req.body;

    const hotel = em.getReference(Hotel, id);

    if (id_ciudad) {
      const ciudad = await em.findOne(Ciudad, { id: id_ciudad });
      if (!ciudad) {
        return res.status(400).json({ message: 'Ciudad no encontrada' });
      }
      em.assign(hotel, { ...hotelData, ciudad });
    } else {
      em.assign(hotel, hotelData);
    }

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
