import { Request, Response } from 'express';
import { Persona } from '../models/persona.model.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const personas = await em.find(Persona, {});
    res.status(200).json( { message: 'Personas encontradas', data: personas } );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const persona = await em.findOneOrFail(Persona, { id });
    res.status(200).json( { message: 'Persona encontrada', data: persona } );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const persona = em.create(Persona, req.body);
    await em.flush();
    res.status(201).json( { message: 'Persona creada', data: persona } );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const persona = em.getReference(Persona, id);
    em.assign(persona, req.body);
    await em.flush();
    res.status(200).json( { message: 'Persona actualizada' } );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const persona = em.getReference(Persona, id);
    em.removeAndFlush(persona);
    res.status(200).json( { message: 'Persona eliminada' } );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, create, update, remove };