import { Request, Response } from 'express';
import { ReservaPaquete } from '../models/reservaPaquete.model.js';
import { orm } from '../shared/db/orm.js';
import { Usuario } from '../models/usuario.model.js';
import { Paquete } from '../models/paquete.model.js';
import { Persona } from '../models/persona.model.js';
import { Pago } from '../models/pago.model.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const reservasPaquete = await em.find(ReservaPaquete, {});
    res.status(200).json({ message: 'ReservasPaquete encontradas', data: reservasPaquete });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const reservaPaquete = await em.findOneOrFail(ReservaPaquete, { id });
    res.status(200).json({ message: 'ReservaPaquete encontrada', data: reservaPaquete });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const { usuarioId, paqueteId, personas, pagoId, ...data } = req.body;

    if (!usuarioId) {
      return res.status(400).json({ message: 'El id del usuario es obligatorio' });
    }

    if (!paqueteId) {
      return res.status(400).json({ message: 'El id del paquete es obligatorio' });
    }

    if (!pagoId) {
      return res.status(400).json({ message: 'El id del pago es obligatorio' });
    }

    const usuario = await em.findOneOrFail(Usuario, { id: usuarioId });
    const paquete = await em.findOneOrFail(Paquete, { id: paqueteId });

    const reserva = new ReservaPaquete();
    reserva.usuario = usuario;
    reserva.paquete = paquete;
    reserva.fecha = new Date(data.fecha ?? Date.now());
    reserva.estado = data.estado ?? 'reservado';
    reserva.fecha_cancelacion = data.fecha_cancelacion ?? null;
    reserva.motivo_cancelacion = data.motivo_cancelacion ?? null;

    reserva.pago = em.getReference(Pago, pagoId);

    for (const p of personas) {
      const persona = new Persona();
      persona.nombre = p.nombre;
      persona.apellido = p.apellido;
      persona.email = p.email;
      persona.fecha_nacimiento = new Date(p.fechaNacimiento);
      persona.dni = p.dni;

      persona.reservas.add(reserva);
      reserva.personas.add(persona);

      em.persist(persona);
    }

    em.persist(reserva);
    await em.flush();

    res.status(201).json({ message: 'ReservaPaquete creada', data: reserva });
  } catch (error: any) {
    console.error("Error al crear la reserva:", error);
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const reservaPaquete = em.getReference(ReservaPaquete, id);
    em.assign(reservaPaquete, req.body);
    await em.flush();
    res.status(200).json({ message: 'ReservaPaquete actualizada' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const reservaPaquete = em.getReference(ReservaPaquete, id);
    em.removeAndFlush(reservaPaquete);
    res.status(200).json({ message: 'ReservaPaquete eliminada' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, create, update, remove };