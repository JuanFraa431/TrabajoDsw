import { Request, Response } from "express";
import { Estadia } from "../models/estadia.model.js";
import { Hotel } from "../models/hotel.model.js";
import { orm } from "../shared/db/orm.js";
import { Paquete } from "../models/paquete.model.js";
import { actualizarPrecioPaquete } from "../utils/paqueteUtils.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const estadias = await em.find(
      Estadia,
      {},
      { populate: ["hotel", "paquete"] },
    );
    res.status(200).json({ message: "Estadias encontradas", data: estadias });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const estadia = await em.findOneOrFail(
      Estadia,
      { id },
      { populate: ["hotel", "paquete"] },
    );
    res.status(200).json({ message: "Estadia encontrada", data: estadia });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const { id_hotel, id_paquete, precio_x_dia, ...rest } = req.body;
    if (typeof rest.fecha_ini === "string") {
      rest.fecha_ini = new Date(rest.fecha_ini);
    }
    if (typeof rest.fecha_fin === "string") {
      rest.fecha_fin = new Date(rest.fecha_fin);
    }
    if (rest.fecha_ini && Number.isNaN(new Date(rest.fecha_ini).getTime())) {
      return res.status(400).json({ message: "Fecha de inicio inválida." });
    }
    if (rest.fecha_fin && Number.isNaN(new Date(rest.fecha_fin).getTime())) {
      return res.status(400).json({ message: "Fecha de fin inválida." });
    }
    if (!rest.fecha_ini || !rest.fecha_fin) {
      return res
        .status(400)
        .json({ message: "Las fechas de estadía son obligatorias." });
    }
    if (new Date(rest.fecha_fin) <= new Date(rest.fecha_ini)) {
      return res
        .status(400)
        .json({
          message: "La fecha de fin debe ser posterior a la de inicio.",
        });
    }

    const hotel = await em.getReference(Hotel, id_hotel);
    const paquete = await em.getReference(Paquete, id_paquete);

    const estadia = em.create(Estadia, {
      ...rest,
      hotel,
      paquete,
    });

    await em.flush();

    // Actualizar el precio del paquete automáticamente
    await actualizarPrecioPaquete(id_paquete);

    res.status(201).json({ message: "Estadia creada", data: estadia });
  } catch (error: any) {
    console.error("Error al crear estadía:", error);
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const estadia = await em.findOneOrFail(Estadia, { id }); // Asegurarse de cargar la entidad completa

    // Extraer solo el id del hotel y paquete para evitar duplicados
    const { id_hotel, id_paquete, precio_x_dia, ...rest } = req.body;
    if (typeof rest.fecha_ini === "string") {
      rest.fecha_ini = new Date(rest.fecha_ini);
    }
    if (typeof rest.fecha_fin === "string") {
      rest.fecha_fin = new Date(rest.fecha_fin);
    }
    if (rest.fecha_ini && Number.isNaN(new Date(rest.fecha_ini).getTime())) {
      return res.status(400).json({ message: "Fecha de inicio inválida." });
    }
    if (rest.fecha_fin && Number.isNaN(new Date(rest.fecha_fin).getTime())) {
      return res.status(400).json({ message: "Fecha de fin inválida." });
    }

    const fechaIni = rest.fecha_ini ?? estadia.fecha_ini;
    const fechaFin = rest.fecha_fin ?? estadia.fecha_fin;
    if (!fechaIni || !fechaFin) {
      return res
        .status(400)
        .json({ message: "Las fechas de estadía son obligatorias." });
    }
    if (new Date(fechaFin) <= new Date(fechaIni)) {
      return res
        .status(400)
        .json({
          message: "La fecha de fin debe ser posterior a la de inicio.",
        });
    }

    if (!id_paquete) {
      return res
        .status(400)
        .json({ message: "El ID del paquete es obligatorio." });
    }

    const updatedData: any = {
      ...rest,
      hotel: id_hotel ? em.getReference(Hotel, id_hotel) : null,
      paquete: em.getReference(Paquete, id_paquete),
    };

    em.assign(estadia, updatedData);

    await em.flush();

    // Actualizar el precio del paquete automáticamente
    await actualizarPrecioPaquete(id_paquete);

    res.status(200).json({ message: "Estadia actualizada", data: estadia });
  } catch (error: any) {
    console.error("Error al actualizar la estadía:", error);
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const estadia = await em.findOneOrFail(
      Estadia,
      { id },
      { populate: ["paquete"] },
    );
    const paqueteId = estadia.paquete.id;

    if (!paqueteId) {
      return res
        .status(400)
        .json({ message: "No se encontró el paquete asociado" });
    }

    em.removeAndFlush(estadia);

    // Actualizar el precio del paquete después de eliminar la estadía
    await actualizarPrecioPaquete(paqueteId);

    res.status(200).json({ message: "Estadia eliminada" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, create, update, remove };
