import { Request, Response, NextFunction } from 'express';
import { CiudadRepository } from '../repositories/ciudad.repository.js';
import { Ciudad } from '../models/ciudad.model.js';

const repository = new CiudadRepository();

async function findAll(req: Request, res: Response) {
  const ciudades = await repository.findAll();
  res.json(ciudades);
}

async function findOne(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const ciudad = await repository.findOne({ id });
    if (ciudad) {
      res.json(ciudad);
    } else {
      res.status(404).json({ message: 'Ciudad no encontrada' });
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al obtener la ciudad', errorMessage });
  }
}

async function create(req: Request, res: Response) {
  try {
    const ciudad = new Ciudad(
      req.body.id,
      req.body.nombre,
      req.body.descripcion,
      req.body.pais,
    );
    const result = await repository.save(ciudad);
    res.json(result);
  } catch (error: any) {
  const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al crear la ciudad', errorMessage });
  }
}

async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const ciudad = new Ciudad(
      req.body.id,
      req.body.nombre,
      req.body.descripcion,
      req.body.pais,
    );
    const result = await repository.update({ id }, ciudad);
    res.json(result);
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al actualizar la ciudad', errorMessage });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await repository.remove({ id });
    res.json({ message: 'Ciudad eliminada' });
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al eliminar la ciudad', errorMessage });
  }
}

export { findAll, findOne, create, update, remove };
