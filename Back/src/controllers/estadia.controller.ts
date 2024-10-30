import e, { Request, Response, NextFunction } from 'express';
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
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al obtener el estadia', errorMessage });
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
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al crear la estadia', errorMessage });
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
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al actualizar la estadia', errorMessage });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await repository.remove({ id });
    res.json({ message: 'Estadia eliminada' });
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al eliminar la estadia', errorMessage });
  }
}

async function findByPaquete(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const estadias = await repository.findByPaquete({ id });
    res.json(estadias);
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al obtener las estadias', errorMessage });
  }
}

export { findAll, findOne, create, update, remove, findByPaquete };
