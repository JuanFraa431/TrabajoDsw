import { Request, Response } from 'express';
import { Pago } from '../models/pago.model.js';
import { orm } from '../shared/db/orm.js';
import { ReservaPaquete } from '../models/reservaPaquete.model.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const pagos = await em.find(Pago, {});
    res.status(200).json( { message: 'Pagos encontrados', data: pagos } );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pago = await em.findOneOrFail(Pago, { id });
    res.status(200).json( { message: 'Pago encontrado', data: pago } );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    console.log('Datos recibidos para crear pago:', req.body);
    const pago = em.create(Pago, req.body);
    await em.persistAndFlush(pago);
    console.log('Pago creado:', pago);
    res.status(201).json( { message: 'Pago creado', data: pago } );
  } catch (error: any) {
    console.error('Error al crear pago:', error);
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pago = em.getReference(Pago, id);
    em.assign(pago, req.body);
    await em.flush();
    res.status(200).json( { message: 'Pago actualizado' } );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pago = em.getReference(Pago, id);
    em.removeAndFlush(pago);
    res.status(200).json( { message: 'Pago eliminado' } );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, create, update, remove };