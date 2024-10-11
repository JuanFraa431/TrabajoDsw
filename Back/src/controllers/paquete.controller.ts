import {Request, Response, NextFunction} from 'express'
import { PaqueteRepository } from '../repositories/paquete.repository.js'
import { Paquete } from '../models/paquete.model.js'

const repository = new PaqueteRepository()

async function findAll(req: Request, res: Response) {
    const paquetes = await repository.findAll(); 
    res.json(paquetes); 
}


async function findOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const paquete = await repository.findOne({ id }); 
        if (paquete) {
            res.json(paquete);
        } else {
            res.status(404).json({ message: 'Paquete no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el paquete', error });
    }
}

async function create(req: Request, res: Response) {
    try {
        const paquete = new Paquete(req.body.id,req.body.estado, req.body.descripcion, req.body.precio, req.body.fecha_ini, req.body.fecha_fin);
        const result = await repository.save(paquete);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el paquete', error });
    }
}

async function update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const paquete = new Paquete(req.body.id,req.body.estado, req.body.descripcion, req.body.precio, req.body.fecha_ini, req.body.fecha_fin);
        const result = await repository.update({ id }, paquete);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el paquete', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.remove({ id });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el paquete', error });
    }
}

async function search(req: Request, res: Response) {
    const { ciudad, fechaInicio, fechaFin, precioMaximo } = req.query;

    try {
        const paquetes = await repository.search({
            ciudad: ciudad as string,
            fechaInicio: fechaInicio as string,
            fechaFin: fechaFin as string,
            precioMaximo: Number(precioMaximo)
        });

        res.json(paquetes);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar paquetes', error });
    }
}


export { findAll, findOne, create, update, remove, search };