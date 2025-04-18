import { Request, Response } from 'express';
import { Ciudad } from '../models/ciudad.model.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const ciudades = await em.find(Ciudad, {});
    res.status(200).json( { message: 'Ciudades encontradas', data: ciudades } );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const ciudad = await em.findOneOrFail(Ciudad, { id });
    res.status(200).json( { message: 'Ciudad encontrada', data: ciudad } );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const ciudad = em.create(Ciudad, req.body);
    await em.flush();
    res.status(201).json( { message: 'Ciudad creada', data: ciudad } );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const ciudad = em.getReference(Ciudad, id);
    em.assign(ciudad, req.body);
    await em.flush();
    res.status(200).json( { message: 'Ciudad actualizada' } );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const ciudad = em.getReference(Ciudad, id);
    em.removeAndFlush(ciudad);
    res.status(200).json( { message: 'Ciudad eliminada' } );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, create, update, remove };