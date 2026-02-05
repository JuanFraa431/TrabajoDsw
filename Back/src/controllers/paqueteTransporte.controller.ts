import { Request, Response } from "express";
import { PaqueteTransporte } from "../models/paqueteTransporte.model.js";
import { Paquete } from "../models/paquete.model.js";
import { TipoTransporte } from "../models/tipoTransporte.model.js";
import { Ciudad } from "../models/ciudad.model.js";
import { orm } from "../shared/db/orm.js";
import { actualizarPrecioPaquete } from "../utils/paqueteUtils.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const paqueteTransportes = await em.find(
      PaqueteTransporte,
      {},
      {
        populate: [
          "paquete",
          "tipoTransporte",
          "ciudadOrigen",
          "ciudadDestino",
        ],
      },
    );
    res.status(200).json({
      message: "PaqueteTransportes encontrados",
      data: paqueteTransportes,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const paqueteTransporte = await em.findOneOrFail(
      PaqueteTransporte,
      { id },
      {
        populate: [
          "paquete",
          "tipoTransporte",
          "ciudadOrigen",
          "ciudadDestino",
        ],
      },
    );
    res.status(200).json({
      message: "PaqueteTransporte encontrado",
      data: paqueteTransporte,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findByPaquete(req: Request, res: Response) {
  try {
    const paqueteId = Number.parseInt(req.params.paqueteId);
    const paqueteTransportes = await em.find(
      PaqueteTransporte,
      { paquete: paqueteId },
      {
        populate: ["tipoTransporte", "ciudadOrigen", "ciudadDestino"],
      },
    );
    res.status(200).json({
      message: "PaqueteTransportes del paquete encontrados",
      data: paqueteTransportes,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const {
      paquete_id,
      tipo_transporte_id,
      ciudad_origen_id,
      ciudad_destino_id,
      fecha_salida,
      fecha_llegada,
      nombre_empresa,
      mail_empresa,
      capacidad,
      asientos_disponibles,
      precio,
      tipo,
      activo,
    } = req.body;

    if (!paquete_id) {
      return res
        .status(400)
        .json({ message: "El ID del paquete es obligatorio." });
    }
    if (!tipo_transporte_id || !ciudad_origen_id || !ciudad_destino_id) {
      return res.status(400).json({
        message:
          "Los IDs de tipo de transporte y ciudades de origen/destino son obligatorios.",
      });
    }
    if (!fecha_salida || !fecha_llegada) {
      return res
        .status(400)
        .json({ message: "Las fechas de salida y llegada son obligatorias." });
    }
    if (tipo !== "IDA" && tipo !== "VUELTA") {
      return res.status(400).json({
        message: "El tipo de transporte debe ser IDA o VUELTA.",
      });
    }

    const fechaSalidaDate = new Date(fecha_salida);
    const fechaLlegadaDate = new Date(fecha_llegada);
    if (Number.isNaN(fechaSalidaDate.getTime())) {
      return res.status(400).json({ message: "Fecha de salida inválida." });
    }
    if (Number.isNaN(fechaLlegadaDate.getTime())) {
      return res.status(400).json({ message: "Fecha de llegada inválida." });
    }

    const paquete = em.getReference(Paquete, paquete_id);
    const tipoTransporte = em.getReference(TipoTransporte, tipo_transporte_id);
    const ciudadOrigen = em.getReference(Ciudad, ciudad_origen_id);
    const ciudadDestino = em.getReference(Ciudad, ciudad_destino_id);

    const paqueteTransporte = em.create(PaqueteTransporte, {
      paquete,
      tipoTransporte,
      ciudadOrigen,
      ciudadDestino,
      fecha_salida: fechaSalidaDate,
      fecha_llegada: fechaLlegadaDate,
      nombre_empresa,
      mail_empresa,
      capacidad,
      asientos_disponibles,
      precio,
      tipo,
      activo: activo ?? true,
    });

    await em.flush();

    // Actualizar el precio del paquete automáticamente
    await actualizarPrecioPaquete(paquete_id);

    res
      .status(201)
      .json({ message: "PaqueteTransporte creado", data: paqueteTransporte });
  } catch (error: any) {
    console.error("Error al crear PaqueteTransporte:", error);
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const paqueteTransporte = await em.findOneOrFail(PaqueteTransporte, { id });
    const {
      paquete_id,
      tipo_transporte_id,
      ciudad_origen_id,
      ciudad_destino_id,
      fecha_salida,
      fecha_llegada,
      nombre_empresa,
      mail_empresa,
      capacidad,
      asientos_disponibles,
      precio,
      tipo,
      activo,
    } = req.body;

    const tipoFinal = tipo ?? paqueteTransporte.tipo;
    if (tipoFinal !== "IDA" && tipoFinal !== "VUELTA") {
      return res.status(400).json({
        message: "El tipo de transporte debe ser IDA o VUELTA.",
      });
    }

    let fechaSalidaFinal = paqueteTransporte.fecha_salida;
    let fechaLlegadaFinal = paqueteTransporte.fecha_llegada;
    if (fecha_salida) {
      const parsed = new Date(fecha_salida);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({ message: "Fecha de salida inválida." });
      }
      fechaSalidaFinal = parsed;
    }
    if (fecha_llegada) {
      const parsed = new Date(fecha_llegada);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({ message: "Fecha de llegada inválida." });
      }
      fechaLlegadaFinal = parsed;
    }

    const updatedData: any = {
      tipo: tipoFinal,
      fecha_salida: fechaSalidaFinal,
      fecha_llegada: fechaLlegadaFinal,
    };

    if (paquete_id) {
      updatedData.paquete = em.getReference(Paquete, paquete_id);
    }
    if (tipo_transporte_id) {
      updatedData.tipoTransporte = em.getReference(
        TipoTransporte,
        tipo_transporte_id,
      );
    }
    if (ciudad_origen_id) {
      updatedData.ciudadOrigen = em.getReference(Ciudad, ciudad_origen_id);
    }
    if (ciudad_destino_id) {
      updatedData.ciudadDestino = em.getReference(Ciudad, ciudad_destino_id);
    }
    if (nombre_empresa !== undefined)
      updatedData.nombre_empresa = nombre_empresa;
    if (mail_empresa !== undefined) updatedData.mail_empresa = mail_empresa;
    if (capacidad !== undefined) updatedData.capacidad = capacidad;
    if (asientos_disponibles !== undefined)
      updatedData.asientos_disponibles = asientos_disponibles;
    if (precio !== undefined) updatedData.precio = precio;
    if (activo !== undefined) updatedData.activo = activo;

    em.assign(paqueteTransporte, updatedData);

    await em.flush();

    // Actualizar el precio del paquete automáticamente
    if (paquete_id) {
      await actualizarPrecioPaquete(paquete_id);
    }

    res.status(200).json({
      message: "PaqueteTransporte actualizado",
      data: paqueteTransporte,
    });
  } catch (error: any) {
    console.error("Error al actualizar PaqueteTransporte:", error);
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const paqueteTransporte = await em.findOneOrFail(
      PaqueteTransporte,
      { id },
      { populate: ["paquete"] },
    );
    const paqueteId = paqueteTransporte.paquete.id;

    if (!paqueteId) {
      return res
        .status(400)
        .json({ message: "No se encontró el paquete asociado" });
    }

    await em.removeAndFlush(paqueteTransporte);

    // Actualizar el precio del paquete después de eliminar el transporte
    await actualizarPrecioPaquete(paqueteId);

    res.status(200).json({ message: "PaqueteTransporte eliminado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, findByPaquete, create, update, remove };
