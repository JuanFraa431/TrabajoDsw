import { Request, Response } from 'express';
import { Cliente } from '../models/cliente.model.js';
import bcrypt from 'bcrypt';
import { orm } from '../shared/db/orm.js';
import jwt from 'jsonwebtoken';

const em = orm.em;


async function findAll(req: Request, res: Response) {
    try {
        const clientes = await em.find(Cliente, {});
        res.status(200).json({ message: 'Clientes encontrados', data: clientes });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const cliente = await em.findOneOrFail(Cliente, { id });
        res.status(200).json({ message: 'Cliente encontrado', data: cliente });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function create(req: Request, res: Response) {
    res.status(500).json({ message: 'Error al crear el cliente', errorMessage: 'No se puede crear un cliente' });
}

async function update(req: Request, res: Response) {
  res.status(500).json({ message: 'Error al actualizar el cliente', errorMessage: 'No se puede actualizar un cliente' });
}



async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const cliente = em.getReference(Cliente, id);
        em.removeAndFlush(cliente);
        res.status(200).json({ message: 'Cliente eliminado' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function login(req: Request, res: Response) {
    try {
    const { username, password } = req.body;
    const cliente = await em.findOneOrFail(Cliente, { username });

    if (cliente) {
        const isMatch = await bcrypt.compare(password, cliente.password);

        if (isMatch) {
            const token = jwt.sign(
                { id: cliente.id, username: cliente.username },
                'secreto_del_token',
                { expiresIn: '1h' }
            );
            res.status(200).json({ message: 'Cliente logueado', data: { cliente, token } });
        } else {
            res.status(401).json({ message: 'Contraseña incorrecta' });
        }
    } else {
        res.status(404).json({ message: 'Cliente no encontrado' });
    }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }

}

export { findAll, findOne, create, update, remove, login };
