import { Request, Response } from "express";
import { PaqueteTransporte } from "../models/paqueteTransporte.model.js";
import { Paquete } from "../models/paquete.model.js";
import { Transporte } from "../models/transporte.model.js";
import { orm } from "../shared/db/orm.js";
import { actualizarPrecioPaquete } from "../utils/paqueteUtils.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const paqueteTransportes = await em.find(
      PaqueteTransporte,
      {},
      { populate: ["transporte", "paquete"] }
    );
    res
      .status(200)
      .json({
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
      { populate: ["transporte", "paquete"] }
    );
    res
      .status(200)
      .json({
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
        populate: [
          "transporte",
          "transporte.tipoTransporte",
          "transporte.ciudadOrigen",
          "transporte.ciudadDestino",
        ],
      }
    );
    res
      .status(200)
      .json({
        message: "PaqueteTransportes del paquete encontrados",
        data: paqueteTransportes,
      });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const { id_transporte, id_paquete, ...rest } = req.body;

    const transporte = await em.getReference(Transporte, id_transporte);
    const paquete = await em.getReference(Paquete, id_paquete);

    const paqueteTransporte = em.create(PaqueteTransporte, {
      ...rest,
      transporte,
      paquete,
    });

    await em.flush();

    // Actualizar el precio del paquete automáticamente
    await actualizarPrecioPaquete(id_paquete);

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

    const { id_transporte, id_paquete, ...rest } = req.body;

    if (!id_paquete) {
      return res
        .status(400)
        .json({ message: "El ID del paquete es obligatorio." });
    }

    const updatedData: any = {
      ...rest,
      transporte: id_transporte
        ? em.getReference(Transporte, id_transporte)
        : paqueteTransporte.transporte,
      paquete: em.getReference(Paquete, id_paquete),
    };

    em.assign(paqueteTransporte, updatedData);

    await em.flush();

    // Actualizar el precio del paquete automáticamente
    await actualizarPrecioPaquete(id_paquete);

    res
      .status(200)
      .json({
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
      { populate: ["paquete"] }
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
