import {Request, Response, NextFunction} from 'express'
import { TransporteRepository } from '../repositories/transporte.repository.js'
import { Transporte } from '../models/transporte.model.js'

const repository = new TransporteRepository()

async function findAll(req: Request, res: Response) {
    const transportes = await repository.findAll(); 
    res.json(transportes); 
}


async function findOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const transporte = await repository.findOne({ id }); 
        if (transporte) {
            res.json(transporte);
        } else {
            res.status(404).json({ message: 'Transporte no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el transporte', error });
    }
}

async function create(req: Request, res: Response) {
    try {
        const transporte = new Transporte(req.body.id,req.body.descripcion, req.body.capacidad, req.body.tipo, req.body.nombre_empresa, req.body.mail_empresa);
        const result = await repository.save(transporte);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el transporte', error });
    }
}

async function update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const transporte = new Transporte(req.body.id,req.body.descripcion, req.body.capacidad, req.body.tipo, req.body.nombre_empresa, req.body.mail_empresa);
        const result = await repository.update({ id }, transporte);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el transporte', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.remove({ id });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el transporte', error });
    }
}

export { findAll, findOne, create, update, remove };