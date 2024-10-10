import { Request, Response, NextFunction } from 'express';
import { EstadiaRepository } from '../repositories/estadia.repository.js';
import { Estadia } from '../models/estadia.model.js';

const repository = new EstadiaRepository();

async function findAll(req: Request, res: Response) {
  const estadias = await repository.findAll();
  res.json(estadias);
}

async function findOne(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const estadia = await repository.findOne({ id });
    if (estadia) {
      res.json(estadia);
    } else {
      res.status(404).json({ message: 'Estadia no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el estadia', error });
  }
}

async function create(req: Request, res: Response) {
  try {
    const estadia = new Estadia(
      req.body.id_paquete,
      req.body.id_hotel,
      req.body.fecha_ini,
      req.body.fecha_fin,
      req.body.precio_x_dia
    );
    const result = await repository.save(estadia);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la estadia', error });
  }
}

async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const estadia = new Estadia(
      req.body.id_paquete,
      req.body.id_hotel,
      req.body.fecha_ini,
      req.body.fecha_fin,
      req.body.precio_x_dia
    );
    const result = await repository.update({ id }, estadia);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la estadia', error });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await repository.remove({ id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la estadia', error });
  }
}

export { findAll, findOne, create, update, remove };
