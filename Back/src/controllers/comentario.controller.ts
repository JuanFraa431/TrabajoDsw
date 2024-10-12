import e, { Request, Response, NextFunction } from 'express';
import { ClienteRepository } from '../repositories/comentario.repository.js';
import { Comentario } from '../models/comentario.model.js';

const repository = new ClienteRepository();

async function findAll(req: Request, res: Response) {
  const comentarios = await repository.findAll();
  res.json(comentarios);
}

async function findOne(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const comentario = await repository.findOne({ id });
    if (comentario) {
      res.json(comentario);
    } else {
      res.status(404).json({ message: 'Comentario no encontrado' });
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al obtener el comentario', errorMessage });
  }
}

async function create(req: Request, res: Response) {
  try {
    const comentario = new Comentario(
      req.body.id,
      req.body.id_cliente,
      req.body.id_paquete,
      req.body.fecha,
      req.body.descripcion,
      req.body.estrellas
    );
    const result = await repository.save(comentario);
    res.json(result);
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al crear el comentario', errorMessage });
  }
}

async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const comentario = new Comentario(
      req.body.id,
      req.body.id_cliente,
      req.body.id_paquete,
      req.body.fecha,
      req.body.descripcion,
      req.body.estrellas
    );
    const result = await repository.update({ id }, comentario);
    res.json(result);
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al actualizar el comentario', errorMessage });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await repository.remove({ id });
    res.json({ message: 'Comentario eliminado' });
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    res.status(500).json({ message: 'Error al eliminar el comentario', errorMessage });
  }
}

export { findAll, findOne, create, update, remove };
