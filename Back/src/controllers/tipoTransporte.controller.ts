import { Request, Response } from 'express';
import { TipoTransporte } from '../models/tipoTransporte.model.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
    try {
        const tiposTransporte = await em.find(TipoTransporte, {});
        res.status(200).json({ message: 'Tipos de transporte encontrados', data: tiposTransporte });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const tipoTransporte = await em.findOneOrFail(TipoTransporte, { id });
        res.status(200).json({ message: 'Tipo de transporte encontrado', data: tipoTransporte });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function create(req: Request, res: Response) {
    try {
        const tipoTransporte = em.create(TipoTransporte, req.body);
        await em.flush();
        res.status(201).json({ message: 'Tipo de transporte creado', data: tipoTransporte });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const tipoTransporte = em.getReference(TipoTransporte, id);
        em.assign(tipoTransporte, req.body);
        await em.flush();
        res.status(200).json({ message: 'Tipo de transporte actualizado', data: tipoTransporte });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const tipoTransporte = em.getReference(TipoTransporte, id);
        await em.removeAndFlush(tipoTransporte);
        res.status(200).json({ message: 'Tipo de transporte eliminado' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { findAll, findOne, create, update, remove };
