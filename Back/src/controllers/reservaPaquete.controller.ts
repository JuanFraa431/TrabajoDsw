import { Request, Response } from "express";
import {
  ReservaPaquete,
  ReservaEstado,
} from "../models/reservaPaquete.model.js";
import { orm } from "../shared/db/orm.js";
import { Usuario } from "../models/usuario.model.js";
import { Paquete } from "../models/paquete.model.js";
import { Persona } from "../models/persona.model.js";
import { Pago } from "../models/pago.model.js";
import { emailService } from "../services/emailService.js";
import { calcularPrecioPaquete } from "../utils/paqueteUtils.js";
import { Cancelacion } from "../models/cancelacion.model.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const { fechaInicio, fechaFin, estado } = req.query;

    let whereClause: any = {};

    // Filtrar por rango de fechas si se proporcionan
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio as string);
      inicio.setUTCHours(0, 0, 0, 0);

      const fin = new Date(fechaFin as string);
      fin.setUTCHours(23, 59, 59, 999);

      whereClause.fecha = {
        $gte: inicio,
        $lte: fin,
      };
    }

    // Filtrar por estado si se proporciona
    if (typeof estado === "string" && estado.toLowerCase() !== "todos") {
      whereClause.estado = estado.toUpperCase();
    }

    const reservasPaquete = await em.find(ReservaPaquete, whereClause, {
      populate: [
        "usuario",
        "paquete",
        "paquete.ciudad",
        "personas",
        "pago",
        "paquete.estadias",
        "paquete.estadias.hotel",
        "paquete.estadias.hotel.ciudad",
        "paquete.paqueteExcursiones",
        "paquete.paqueteExcursiones.excursion",
      ],
    });
    res
      .status(200)
      .json({ message: "ReservasPaquete encontradas", data: reservasPaquete });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findByUsuario(req: Request, res: Response) {
  try {
    const usuarioId = Number.parseInt(req.params.usuarioId);
    const reservasPaquete = await em.find(
      ReservaPaquete,
      { usuario: usuarioId },
      {
        populate: [
          "usuario",
          "paquete",
          "paquete.ciudad",
          "personas",
          "pago",
          "paquete.estadias",
          "paquete.estadias.hotel",
          "paquete.estadias.hotel.ciudad",
          "paquete.paqueteExcursiones",
          "paquete.paqueteExcursiones.excursion",
        ],
      },
    );
    res.status(200).json({
      message: "Reservas del usuario encontradas",
      data: reservasPaquete,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const reservaPaquete = await em.findOneOrFail(ReservaPaquete, { id });
    res
      .status(200)
      .json({ message: "ReservaPaquete encontrada", data: reservaPaquete });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const { usuarioId, paqueteId, personas, pagoId, ...data } = req.body;

    if (!usuarioId) {
      return res
        .status(400)
        .json({ message: "El id del usuario es obligatorio" });
    }

    if (!paqueteId) {
      return res
        .status(400)
        .json({ message: "El id del paquete es obligatorio" });
    }

    if (!pagoId) {
      return res.status(400).json({ message: "El id del pago es obligatorio" });
    }

    const usuario = await em.findOneOrFail(Usuario, { id: usuarioId });

    // Cargar el paquete con todas las relaciones necesarias para el email
    const paquete = await em.findOneOrFail(
      Paquete,
      { id: paqueteId },
      {
        populate: [
          "ciudad",
          "estadias",
          "estadias.hotel",
          "estadias.hotel.ciudad",
          "paqueteExcursiones",
          "paqueteExcursiones.excursion",
          "paqueteExcursiones.excursion.ciudad",
        ],
      },
    );

    // Cargar el pago para obtener información del monto
    const pago = await em.findOneOrFail(Pago, { id: pagoId });

    const reserva = new ReservaPaquete();
    reserva.usuario = usuario;
    reserva.paquete = paquete;
    reserva.fecha = new Date(data.fecha ?? Date.now());
    reserva.estado =
      typeof data.estado === "string" ? data.estado.toUpperCase() : "PENDIENTE";
    if (!Object.values(ReservaEstado).includes(reserva.estado)) {
      return res.status(400).json({ message: "Estado de reserva inválido" });
    }
    reserva.fecha_cancelacion = data.fecha_cancelacion ?? null;
    reserva.motivo_cancelacion = data.motivo_cancelacion ?? null;

    reserva.pago = em.getReference(Pago, pagoId);

    const cantidadPersonas = (personas?.length ?? 0) + 1;
    const precioBase = await calcularPrecioPaquete(paqueteId);
    const precioEsperado = Number(precioBase) * cantidadPersonas;
    if (Number(pago.monto) !== Number(precioEsperado)) {
      return res.status(400).json({
        message: "El monto del pago no coincide con el precio del paquete.",
      });
    }

    for (const p of personas || []) {
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

    const fechasEstadias = paquete.estadias.getItems().length
      ? {
          fecha_ini: paquete.estadias
            .getItems()
            .map((e) => e.fecha_ini)
            .sort((a, b) => a.getTime() - b.getTime())[0],
          fecha_fin: paquete.estadias
            .getItems()
            .map((e) => e.fecha_fin)
            .sort((a, b) => b.getTime() - a.getTime())[0],
        }
      : null;

    const datosReserva = {
      usuario: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
      },
      paquete: {
        id: paquete.id!,
        nombre: paquete.nombre,
        descripcion: paquete.descripcion,
        detalle: paquete.detalle,
        fecha_ini: fechasEstadias?.fecha_ini
          ? fechasEstadias.fecha_ini.toISOString()
          : null,
        fecha_fin: fechasEstadias?.fecha_fin
          ? fechasEstadias.fecha_fin.toISOString()
          : null,
        precio: pago.monto,
        imagen: paquete.imagen,
        estadias: paquete.estadias.getItems(),
        paqueteExcursiones: paquete.paqueteExcursiones.getItems(),
      },
      reserva: {
        id: reserva.id || 0,
        fecha_reserva: reserva.fecha.toISOString(),
        cantidad_personas: cantidadPersonas,
        precio_total: pago.monto,
        estado: reserva.estado,
      },
      acompanantes: personas || [],
    };

    res.status(201).json({ message: "ReservaPaquete creada", data: reserva });

    // Enviar email de confirmación sin bloquear la respuesta
    const emailTimeoutMs = 15000;
    void Promise.race([
      emailService.enviarEmailReserva(datosReserva),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email timeout")), emailTimeoutMs),
      ),
    ])
      .then(() => {
        console.log("Email de confirmación enviado exitosamente");
      })
      .catch((emailError) => {
        console.error("Error al enviar email de confirmación:", emailError);
      });
  } catch (error: any) {
    console.error("Error al crear la reserva:", error);
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const reservaPaquete = em.getReference(ReservaPaquete, id);
    const { paqueteId, usuarioId, pagoId, personas, fecha, ...rest } = req.body;
    if (typeof req.body.estado === "string") {
      req.body.estado = req.body.estado.toUpperCase();
      if (!Object.values(ReservaEstado).includes(req.body.estado)) {
        return res.status(400).json({ message: "Estado de reserva inválido" });
      }
    }
    const updatedData: any = { ...rest };
    if (typeof rest.estado === "string") {
      updatedData.estado = rest.estado.toUpperCase();
    }
    if (fecha) {
      updatedData.fecha = typeof fecha === "string" ? new Date(fecha) : fecha;
    }
    if (paqueteId) {
      updatedData.paquete = em.getReference(Paquete, paqueteId);
    }
    if (usuarioId) {
      updatedData.usuario = em.getReference(Usuario, usuarioId);
    }
    if (pagoId) {
      updatedData.pago = em.getReference(Pago, pagoId);
    }
    // Ignorar personas en update directo para evitar inconsistencias
    if (Array.isArray(personas)) {
      updatedData.personas = undefined;
    }
    em.assign(reservaPaquete, updatedData);
    await em.flush();
    res.status(200).json({ message: "ReservaPaquete actualizada" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const reservaPaquete = em.getReference(ReservaPaquete, id);
    em.removeAndFlush(reservaPaquete);
    res.status(200).json({ message: "ReservaPaquete eliminada" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function cancelar(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const { motivo } = req.body;

    if (!motivo || motivo.trim() === "") {
      return res
        .status(400)
        .json({ message: "El motivo de cancelación es obligatorio" });
    }

    // Cargar la reserva con todas sus relaciones
    const reserva = await em.findOneOrFail(
      ReservaPaquete,
      { id },
      {
        populate: ["usuario", "paquete", "personas"],
      },
    );

    // Verificar que la reserva esté en estado "reservado"
    if (reserva.estado.toLowerCase() !== "reservado") {
      return res.status(400).json({
        message: 'Solo se pueden cancelar reservas con estado "reservado"',
        estadoActual: reserva.estado,
      });
    }

    // Verificar que no exista ya una cancelación
    const cancelacionExistente = await em.findOne(Cancelacion, { reserva: id });
    if (cancelacionExistente) {
      return res
        .status(400)
        .json({ message: "Esta reserva ya ha sido cancelada" });
    }

    // Crear la cancelación
    const cancelacion = new Cancelacion();
    cancelacion.reserva = em.getReference(ReservaPaquete, id);
    cancelacion.motivo = motivo.trim();
    cancelacion.fecha_cancelacion = new Date();

    // Actualizar la reserva
    reserva.estado = ReservaEstado.CANCELADA;
    reserva.fecha_cancelacion = cancelacion.fecha_cancelacion;
    reserva.motivo_cancelacion = cancelacion.motivo;

    em.persist(cancelacion);
    em.persist(reserva);
    await em.flush();

    res.status(200).json({
      message: "Reserva cancelada exitosamente",
      data: {
        reserva: {
          id: reserva.id,
          estado: reserva.estado,
          fecha_cancelacion: reserva.fecha_cancelacion,
          motivo_cancelacion: reserva.motivo_cancelacion,
        },
        cancelacion: {
          id: cancelacion.id,
          fecha_cancelacion: cancelacion.fecha_cancelacion,
          motivo: cancelacion.motivo,
        },
      },
    });
  } catch (error: any) {
    console.error("Error al cancelar la reserva:", error);
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, findByUsuario, create, update, remove, cancelar };
