import {Request, Response, NextFunction} from 'express'
import { ClienteRepository } from '../repositories/cliente.repository.js'
import { Cliente } from '../models/cliente.model.js'

const repository = new ClienteRepository()

async function findAll(req: Request, res: Response) {
    const clientes = await repository.findAll(); 
    res.json(clientes); 
}


async function findOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const cliente = await repository.findOne({ id }); 
        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cliente', error });
    }
}

async function create(req: Request, res: Response) {
    try {
        const cliente = new Cliente(req.body.id,req.body.nombre, req.body.apellido, req.body.dni, req.body.email, req.body.fecha_nacimiento, req.body.estado);
        const result = await repository.save(cliente);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el cliente', error });
    }
}

async function update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const cliente = new Cliente(req.body.id,req.body.nombre, req.body.apellido, req.body.dni, req.body.email, req.body.fecha_nacimiento, req.body.estado);
        const result = await repository.update({ id }, cliente);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el cliente', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.remove({ id });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el cliente', error });
    }
}

export { findAll, findOne, create, update, remove };