import e, { Request, Response, NextFunction } from 'express';
import { ClienteRepository } from '../repositories/cliente.repository.js';
import { Cliente } from '../models/cliente.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const repository = new ClienteRepository();

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
    } catch (error: any) {
        const errorMessage = error.message || 'Error desconocido';
        res
            .status(500)
            .json({ message: 'Error al obtener el cliente', errorMessage });
    }
}

async function create(req: Request, res: Response) {
    try {
        const { password, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Encripta la contraseña
        const cliente = new Cliente(
            req.body.id,
            req.body.nombre,
            req.body.apellido,
            req.body.dni,
            req.body.email,
            req.body.fecha_nacimiento,
            req.body.estado,
            req.body.username,
            hashedPassword, // Guarda la contraseña encriptada
            req.body.tipo_usuario
        );
        const result = await repository.save(cliente);
        res.json(result);
    } catch (error: any) {
        const errorMessage = error.message || 'Error desconocido';
        res
            .status(500)
            .json({ message: 'Error al crear el cliente', errorMessage });
    }
}

async function update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const cliente = new Cliente(
            req.body.id,
            req.body.nombre,
            req.body.apellido,
            req.body.dni,
            req.body.email,
            req.body.fecha_nacimiento,
            req.body.estado,
            req.body.username,
            req.body.password,
            req.body.tipo_usuario
        );
        const result = await repository.update({ id }, cliente);
        res.json(result);
    } catch (error: any) {
        const errorMessage = error.message || 'Error desconocido';
        res
            .status(500)
            .json({ message: 'Error al actualizar el cliente', errorMessage });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await repository.remove({ id });
        res.json({ message: 'Cliente eliminado' });
    } catch (error: any) {
        const errorMessage = error.message || 'Error desconocido';
        res
            .status(500)
            .json({ message: 'Error al eliminar el cliente', errorMessage });
    }
}

async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        const cliente = await repository.findByUsername(username);

        if (cliente) {
            const isMatch = await bcrypt.compare(password, cliente.password);
            if (isMatch) {
                // Crear un JWT
                const token = jwt.sign(
                    { id: cliente.id, username: cliente.username },
                    'secreto_del_token', 
                    { expiresIn: '1h' } 
                );

                res.json({ cliente, token }); 
            } else {
                res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error: any) {
        const errorMessage = error.message || 'Error desconocido';
        res
            .status(500)
            .json({ message: 'Error al obtener el cliente', errorMessage });
    }
}

export { findAll, findOne, create, update, remove, login };
