import { Request, Response, NextFunction } from 'express';
import { HotelRepository } from '../repositories/hotel.repository.js';
import { Hotel } from '../models/hotel.model.js';

const repository = new HotelRepository();

async function findAll(req: Request, res: Response) {
  const hoteles = await repository.findAll();
  res.json(hoteles);
}

async function findOne(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const hotel = await repository.findOne({ id });
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ message: 'Hotel no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el hotel', error });
  }
}

async function create(req: Request, res: Response) {
  try {
    const hotel = new Hotel(
      req.body.id,
      req.body.nombre,
      req.body.direccion,
      req.body.descripcion,
      req.body.telefono,
      req.body.email,
      req.body.estrellas,
      req.body.ciudad
    );
    const result = await repository.save(hotel);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el hotel', error });
  }
}

async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const hotel = new Hotel(
      req.body.id,
      req.body.nombre,
      req.body.direccion,
      req.body.descripcion,
      req.body.telefono,
      req.body.email,
      req.body.estrellas,
      req.body.ciudad
    );
    const result = await repository.update({ id }, hotel);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el hotel', error });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await repository.remove({ id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el hotel', error });
  }
}

export { findAll, findOne, create, update, remove };
