import e, { Request, Response, NextFunction } from 'express';
import { ExcursionRepository } from '../repositories/excursion.repository.js';
import { Excursion } from '../models/excursion.model.js';

const repository = new ExcursionRepository();

async function findAll(req: Request, res: Response) {
  const excursiones = await repository.findAll();
  res.json(excursiones);
}

async function findOne(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const excursion = await repository.findOne({ id });
    if (excursion) {
      res.json(excursion);
    } else {
      res.status(404).json({ message: 'Excursion no encontrada' });
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al obtener la excursion', errorMessage });
  }
}

async function create(req: Request, res: Response) {
  try {
    const excursion = new Excursion(
      req.body.id,
      req.body.nombre,
      req.body.descripcion,
      req.body.tipo,
      req.body.horario,
      req.body.nro_personas_max,
      req.body.nombre_empresa,
      req.body.mail_empresa,
      req.body.precio,
      req.body.id_ciudad,
      req.body.imagen
    );
    const result = await repository.save(excursion);
    res.json(result);
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al crear la excursion', errorMessage });
  }
}

async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const excursion = new Excursion(
      req.body.id,
      req.body.nombre,
      req.body.descripcion,
      req.body.tipo,
      req.body.horario,
      req.body.nro_personas_max,
      req.body.nombre_empresa,
      req.body.mail_empresa,
      req.body.precio,
      req.body.id_ciudad,
      req.body.imagen
    );
    const result = await repository.update({ id }, excursion);
    res.json(result);
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al actualizar la excursion', errorMessage });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await repository.remove({ id });
    res.json({ message: 'Excursion eliminada' });
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al eliminar la excursion', errorMessage });
  }
}

async function findByType(req: Request, res: Response) {
  try {
    const { tipo } = req.params;
    const excursiones = await repository.findByType({ tipo });
    res.json(excursiones);
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al obtener las excursiones', errorMessage });
  }
}

export { findAll, findOne, create, update, remove, findByType };
