import { Request, Response } from "express";
import { PaqueteExcursion } from "../models/paqueteExcursion.model.js";
import { Paquete } from "../models/paquete.model.js";
import { Excursion } from "../models/excursion.model.js";
import { orm } from "../shared/db/orm.js";
import { actualizarPrecioPaquete } from "../utils/paqueteUtils.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const paqueteExcursiones = await em.find(PaqueteExcursion, {});
    res.status(200).json({
      message: "PaqueteExcursiones encontradas",
      data: paqueteExcursiones,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const paqueteExcursion = await em.findOneOrFail(PaqueteExcursion, { id });
    res
      .status(200)
      .json({ message: "PaqueteExcursion encontrada", data: paqueteExcursion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const { dia, horario, precio, id_paquete, id_excursion, ...rest } =
      req.body;
    if (typeof rest.fecha === "string") {
      rest.fecha = new Date(rest.fecha);
    }
    if (rest.fecha && Number.isNaN(new Date(rest.fecha).getTime())) {
      return res.status(400).json({ message: "Fecha inválida." });
    }
    if (!rest.fecha) {
      return res
        .status(400)
        .json({ message: "La fecha de la excursión es obligatoria." });
    }
    if (!id_paquete || !id_excursion) {
      return res.status(400).json({
        message: "Los IDs de paquete y excursión son obligatorios.",
      });
    }
    const paqueteExcursion = em.create(PaqueteExcursion, {
      ...rest,
      paquete: em.getReference(Paquete, id_paquete),
      excursion: em.getReference(Excursion, id_excursion),
    } as any);
    await em.flush();

    // Actualizar el precio del paquete automáticamente
    const paqueteId = paqueteExcursion.paquete?.id;
    if (paqueteId) {
      await actualizarPrecioPaquete(paqueteId);
    }

    res
      .status(201)
      .json({ message: "PaqueteExcursion creada", data: paqueteExcursion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const paqueteExcursion = await em.findOneOrFail(
      PaqueteExcursion,
      { id },
      { populate: ["paquete"] },
    );
    const { dia, horario, precio, id_paquete, id_excursion, ...rest } =
      req.body;
    if (typeof rest.fecha === "string") {
      rest.fecha = new Date(rest.fecha);
    }
    if (rest.fecha && Number.isNaN(new Date(rest.fecha).getTime())) {
      return res.status(400).json({ message: "Fecha inválida." });
    }
    if (rest.fecha === undefined && !paqueteExcursion.fecha) {
      return res
        .status(400)
        .json({ message: "La fecha de la excursión es obligatoria." });
    }
    const updatedData: any = {
      ...rest,
      paquete: id_paquete
        ? em.getReference(Paquete, id_paquete)
        : paqueteExcursion.paquete,
      excursion: id_excursion
        ? em.getReference(Excursion, id_excursion)
        : paqueteExcursion.excursion,
    };
    em.assign(paqueteExcursion, updatedData);
    await em.flush();

    // Actualizar el precio del paquete automáticamente
    const paqueteId = paqueteExcursion.paquete?.id;
    if (paqueteId) {
      await actualizarPrecioPaquete(paqueteId);
    }

    res.status(200).json({ message: "PaqueteExcursion actualizada" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const paqueteExcursion = await em.findOneOrFail(
      PaqueteExcursion,
      { id },
      { populate: ["paquete"] },
    );
    const paqueteId = paqueteExcursion.paquete?.id;

    await em.removeAndFlush(paqueteExcursion);

    // Actualizar el precio del paquete después de eliminar la excursión
    if (paqueteId) {
      await actualizarPrecioPaquete(paqueteId);
    }

    res.status(200).json({ message: "PaqueteExcursion eliminada" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, create, update, remove };
