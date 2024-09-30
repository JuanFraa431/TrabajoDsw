import { Request, Response, NextFunction } from 'express';
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
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la excursion', error });
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
      req.body.id_ciudad
    );
    const result = await repository.save(excursion);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la excursion', error });
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
      req.body.id_ciudad
    );
    const result = await repository.update({ id }, excursion);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la excursion', error });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await repository.remove({ id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la excursion', error });
  }
}

export { findAll, findOne, create, update, remove };
