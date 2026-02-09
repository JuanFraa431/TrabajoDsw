import { Request, Response } from "express";
import { Hotel } from "../models/hotel.model.js";
import { Ciudad } from "../models/ciudad.model.js";
import { Paquete } from "../models/paquete.model.js";
import { orm } from "../shared/db/orm.js";
import { calcularPrecioPaquete } from "../utils/paqueteUtils.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const hoteles = await em.find(Hotel, {}, { populate: ["ciudad"] });
    res.status(200).json({ message: "Hoteles encontrados", data: hoteles });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const hotel = await em.findOneOrFail(
      Hotel,
      { id },
      { populate: ["ciudad"] },
    );
    res.status(200).json({ message: "Hotel encontrado", data: hotel });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    const { id_ciudad, ...hotelData } = req.body;

    if (id_ciudad) {
      const ciudad = await em.findOne(Ciudad, { id: id_ciudad });
      if (!ciudad) {
        return res.status(400).json({ message: "Ciudad no encontrada" });
      }
      const hotel = em.create(Hotel, { ...hotelData, ciudad });
      await em.flush();
      res.status(201).json({ message: "Hotel creado", data: hotel });
    } else {
      return res.status(400).json({ message: "id_ciudad es requerido" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const { id_ciudad, ...hotelData } = req.body;

    const hotel = em.getReference(Hotel, id);

    if (id_ciudad) {
      const ciudad = await em.findOne(Ciudad, { id: id_ciudad });
      if (!ciudad) {
        return res.status(400).json({ message: "Ciudad no encontrada" });
      }
      em.assign(hotel, { ...hotelData, ciudad });
    } else {
      em.assign(hotel, hotelData);
    }

    await em.flush();
    res.status(200).json({ message: "Hotel actualizado", data: hotel });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const hotel = em.getReference(Hotel, id);
    em.removeAndFlush(hotel);
    res.status(200).json({ message: "Hotel eliminado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getPaquetesByHotel(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);

    // Obtener IDs de paquetes que incluyen este hotel
    const paqueteIds = await em
      .getConnection()
      .execute<{ paquete_id: number }[]>(
        `SELECT DISTINCT e.paquete_id 
       FROM estadia e 
       WHERE e.hotel_id = ?`,
        [id],
      );

    const ids = paqueteIds.map((p) => p.paquete_id);

    // Si no hay paquetes, devolver array vacío
    if (ids.length === 0) {
      return res
        .status(200)
        .json({ message: "No se encontraron paquetes", data: [] });
    }

    // Cargar los paquetes completos con todas las relaciones necesarias
    const paquetes = await em.find(
      Paquete,
      { id: { $in: ids }, estado: 1 },
      {
        populate: [
          "ciudad",
          "estadias",
          "estadias.hotel",
          "paqueteExcursiones",
          "paqueteExcursiones.excursion",
          "paqueteTransportes",
          "paqueteTransportes.tipoTransporte",
          "paqueteTransportes.ciudadOrigen",
          "paqueteTransportes.ciudadDestino",
        ],
      },
    );

    const paquetesConPrecio = await Promise.all(
      paquetes.map(async (paquete) => ({
        ...(paquete as any),
        precio: await calcularPrecioPaquete(paquete.id as number),
      })),
    );

    res
      .status(200)
      .json({ message: "Paquetes encontrados", data: paquetesConPrecio });
  } catch (error: any) {
    console.error("Error en getPaquetesByHotel:", error);
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, create, update, remove, getPaquetesByHotel };
