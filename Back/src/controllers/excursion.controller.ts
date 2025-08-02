import { Request, Response } from 'express';
import { Excursion } from '../models/excursion.model.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const excursiones = await em.find(Excursion, {}, { populate: ['ciudad'] });
    res.status(200).json({ message: 'Excursiones encontradas', data: excursiones });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const excursion = await em.findOneOrFail(Excursion, { id }, { populate: ['ciudad'] });
    res.status(200).json({ message: 'Excursion encontrada', data: excursion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    console.log('Datos recibidos para crear excursión:', req.body);

    // Si viene id_ciudad, lo convertimos a ciudad
    if (req.body.id_ciudad) {
      req.body.ciudad = req.body.id_ciudad;
      delete req.body.id_ciudad;
    }

    const excursion = em.create(Excursion, req.body);
    await em.flush();
    console.log('Excursión creada exitosamente:', excursion);
    res.status(201).json({ message: 'Excursion creada', data: excursion });
  } catch (error: any) {
    console.error('Error al crear excursión:', error);
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    console.log('Datos recibidos para actualizar excursión:', req.body);

    // Si viene id_ciudad, lo convertimos a ciudad
    if (req.body.id_ciudad) {
      req.body.ciudad = req.body.id_ciudad;
      delete req.body.id_ciudad;
    }

    const excursion = em.getReference(Excursion, id);
    em.assign(excursion, req.body);
    await em.flush();
    console.log('Excursión actualizada exitosamente con id:', id);
    res.status(200).json({ message: 'Excursion actualizada', data: excursion });
  } catch (error: any) {
    console.error('Error al actualizar excursión:', error);
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const excursion = em.getReference(Excursion, id);
    em.removeAndFlush(excursion);
    res.status(200).json({ message: 'Excursion eliminada' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findByType(req: Request, res: Response) {
  try {
    const tipo = req.params.tipo;
    const excursiones = await em.find(Excursion, { tipo });
    res.status(200).json({ message: 'Excursiones encontradas', data: excursiones });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findTypes(req: Request, res: Response) {
  try {
    const tipos = await em
      .getConnection()
      .execute<{ tipo: string; cantidad: number }[]>(
        `SELECT tipo, COUNT(*) as cantidad FROM excursion GROUP BY tipo`
      );

    res.status(200).json({ message: 'Tipos de excursiones encontrados', data: tipos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }

}

export { findAll, findOne, create, update, remove, findByType, findTypes };
