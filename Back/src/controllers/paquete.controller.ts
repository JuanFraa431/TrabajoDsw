import { Request, Response } from 'express'
import { PaqueteRepository } from '../repositories/paquete.repository.js'
import { Paquete } from '../models/paquete.model.js'

const repository = new PaqueteRepository()

async function findAll(req: Request, res: Response) {
    const paquetes = await repository.findAll();
    res.json(paquetes);
}

async function findAllUser(req: Request, res: Response) {
    try {
        const paquetes = await repository.findAllUser();
        res.json(paquetes);
    } catch (error: any) {
        const errorMessage = error.message || 'Error desconocido';
        res.status(500).json({ message: 'Error al obtener los paquetes de usuario', errorMessage });
    }
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
    } catch (error: any) {
        const errorMessage = error.message || 'Error desconocido';
        res.status(500).json({ message: 'Error al obtener el paquete', errorMessage });
    }
}

async function create(req: Request, res: Response) {
    try {

        let fecha_ini = req.body.fecha_ini;
        if (fecha_ini) {
            fecha_ini = fecha_ini.split('T')[0];
        }

        let fecha_fin = req.body.fecha_fin;
        if (fecha_fin) {
            fecha_fin = fecha_fin.split('T')[0];
        }

        const paquete = new Paquete(
            req.body.id,
            req.body.nombre,
            req.body.estado,
            req.body.descripcion,
            req.body.detalle,
            req.body.precio,
            fecha_ini,
            fecha_fin,
            req.body.imagen
        );
        const result = await repository.save(paquete);
        res.json(result);
    } catch (error: any) {
        const errorMessage = error.message || 'Error desconocido';
        res.status(500).json({ message: 'Error al crear el paquete', errorMessage });
    }
}

async function update(req: Request, res: Response) {
    try {
        const { id } = req.params;

        let fecha_ini = req.body.fecha_ini;
        if (fecha_ini) {
            fecha_ini = fecha_ini.split('T')[0];
        }

        let fecha_fin = req.body.fecha_fin;
        if (fecha_fin) {
            fecha_fin = fecha_fin.split('T')[0];
        }

        const paquete = new Paquete(
            req.body.id,
            req.body.nombre,
            req.body.estado,
            req.body.descripcion,
            req.body.detalle,
            req.body.precio,
            fecha_ini,
            fecha_fin,
            req.body.imagen
        );
        const result = await repository.update({ id }, paquete);
        res.json(result);
    } catch (error: any) {
        const errorMessage = error.message || 'Error desconocido';
        res.status(500).json({ message: 'Error al actualizar el paquete', errorMessage });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.remove({ id });
        res.json({ message: 'Paquete eliminado' });
    } catch (error: any) {
        const errorMessage = error.message || 'Error desconocido';
        res.status(500).json({ message: 'Error al eliminar el paquete', errorMessage });
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
    } catch (error: any) {
        const errorMessage = error.message || 'Error desconocido';
        res.status(500).json({ message: 'Error al buscar paquetes', errorMessage });
    }
}

export { findAll, findOne, create, update, remove, search, findAllUser };