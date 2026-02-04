import { Request, Response } from 'express';
import { Cancelacion } from '../models/cancelacion.model.js';
import { orm } from '../shared/db/orm.js';
import { ReservaPaquete, ReservaEstado } from '../models/reservaPaquete.model.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
    try {
        const cancelaciones = await em.find(Cancelacion, {}, {
            populate: ['reserva', 'reserva.paquete', 'reserva.usuario']
        });
        res.status(200).json({ message: 'Cancelaciones encontradas', data: cancelaciones });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const cancelacion = await em.findOneOrFail(Cancelacion, { id }, {
            populate: ['reserva', 'reserva.paquete', 'reserva.usuario']
        });
        res.status(200).json({ message: 'Cancelación encontrada', data: cancelacion });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findByReserva(req: Request, res: Response) {
    try {
        const reservaId = Number.parseInt(req.params.reservaId);
        const cancelacion = await em.findOne(Cancelacion, { reserva: reservaId }, {
            populate: ['reserva', 'reserva.paquete', 'reserva.usuario']
        });
        if (!cancelacion) {
            return res.status(404).json({ message: 'No se encontró cancelación para esta reserva' });
        }
        res.status(200).json({ message: 'Cancelación encontrada', data: cancelacion });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function create(req: Request, res: Response) {
    try {
        const { reservaId, motivo } = req.body;

        if (!reservaId) {
            return res.status(400).json({ message: 'El id de la reserva es obligatorio' });
        }

        if (!motivo || motivo.trim() === '') {
            return res.status(400).json({ message: 'El motivo de cancelación es obligatorio' });
        }

        // Verificar que la reserva existe y está en estado "reservado"
        const reserva = await em.findOneOrFail(ReservaPaquete, { id: reservaId });

        if (reserva.estado.toLowerCase() !== 'reservado') {
            return res.status(400).json({ 
                message: 'Solo se pueden cancelar reservas con estado "reservado"',
                estadoActual: reserva.estado 
            });
        }

        // Verificar que no existe ya una cancelación para esta reserva
        const cancelacionExistente = await em.findOne(Cancelacion, { reserva: reservaId });
        if (cancelacionExistente) {
            return res.status(400).json({ message: 'Esta reserva ya ha sido cancelada' });
        }

        // Crear la cancelación
        const cancelacion = new Cancelacion();
        cancelacion.reserva = em.getReference(ReservaPaquete, reservaId);
        cancelacion.motivo = motivo.trim();
        cancelacion.fecha_cancelacion = new Date();

        // Actualizar el estado de la reserva
        reserva.estado = ReservaEstado.CANCELADA;
        reserva.fecha_cancelacion = cancelacion.fecha_cancelacion;
        reserva.motivo_cancelacion = cancelacion.motivo;

        em.persist(cancelacion);
        em.persist(reserva);
        await em.flush();

        res.status(201).json({ 
            message: 'Reserva cancelada exitosamente', 
            data: cancelacion 
        });
    } catch (error: any) {
        console.error('Error al crear la cancelación:', error);
        res.status(500).json({ message: error.message });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const cancelacion = em.getReference(Cancelacion, id);
        await em.removeAndFlush(cancelacion);
        res.status(200).json({ message: 'Cancelación eliminada' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { findAll, findOne, findByReserva, create, remove };
