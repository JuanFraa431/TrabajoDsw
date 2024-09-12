import {Request, Response, NextFunction} from 'express'
import { ClienteRepository } from '../repositories/cliente.respository.js'
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

export { findAll, findOne };