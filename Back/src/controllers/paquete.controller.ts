import { Request, Response } from "express";
import { Paquete } from "../models/paquete.model.js";
import { orm } from "../shared/db/orm.js";
import { actualizarPrecioPaquete } from "../utils/paqueteUtils.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const paquetes = await em.find(
      Paquete,
      {},
      {
        populate: [
          "ciudad",
          "estadias",
          "estadias.hotel",
          "estadias.hotel.ciudad",
          "paqueteExcursiones",
          "paqueteExcursiones.excursion",
          "paqueteTransportes",
          "paqueteTransportes.transporte",
          "paqueteTransportes.transporte.ciudadOrigen",
          "paqueteTransportes.transporte.ciudadDestino",
        ],
      },
    );
    res.status(200).json({ message: "Paquetes encontrados", data: paquetes });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findAllUser(req: Request, res: Response) {
  try {
    const paquetes = await em.find(
      Paquete,
      { estado: 1 },
      {
        populate: [
          "ciudad",
          "estadias.hotel.ciudad",
          "paqueteExcursiones.excursion",
          "paqueteTransportes.transporte",
          "paqueteTransportes.transporte.ciudadOrigen",
          "paqueteTransportes.transporte.ciudadDestino",
        ] as any,
      },
    );
    res.status(200).json({ message: "Paquetes encontrados", data: paquetes });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const paquete = await em.findOneOrFail(
      Paquete,
      { id },
      {
        populate: [
          "ciudad",
          "comentarios",
          "estadias",
          "comentarios.cliente",
          "estadias.hotel",
          "estadias.hotel.ciudad",
          "paqueteExcursiones",
          "paqueteExcursiones.excursion",
          "paqueteTransportes",
          "paqueteTransportes.transporte",
          "paqueteTransportes.transporte.ciudadOrigen",
          "paqueteTransportes.transporte.ciudadDestino",
        ],
      },
    );
    res.status(200).json({ message: "Paquete encontrado", data: paquete });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    if (typeof req.body.estado === "string") {
      req.body.estado = Number.parseInt(req.body.estado, 10);
    }
    const paquete = em.create(Paquete, req.body);
    await em.flush();
    res.status(201).json({ message: "Paquete creado", data: paquete });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const paquete = em.getReference(Paquete, id);
    if (typeof req.body.estado === "string") {
      req.body.estado = Number.parseInt(req.body.estado, 10);
    }
    em.assign(paquete, req.body);
    await em.flush();
    res.status(200).json({ message: "Paquete actualizado", data: paquete });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const paquete = em.getReference(Paquete, id);
    em.removeAndFlush(paquete);
    res.status(200).json({ message: "Paquete eliminado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function search(req: Request, res: Response) {
  try {
    const { ciudad, fechaInicio, fechaFin } = req.query;
    const paquetes = await em.getConnection().execute<Paquete[]>(
      `
            SELECT DISTINCT p.*, c.latitud, c.longitud
            FROM 
                    paquete AS p
                INNER JOIN
                    estadia AS e ON p.id = e.paquete_id
                INNER JOIN
                    hotel AS h ON e.hotel_id = h.id
                INNER JOIN 
                    ciudad AS c ON h.ciudad_id = c.id
            WHERE (c.nombre = ? OR ? = '') 
            AND e.fecha_ini >= ? 
            AND e.fecha_fin <= ? 
            AND p.estado = 1
        `,
      [ciudad, ciudad, fechaInicio, fechaFin],
    );
    res.status(200).json({ message: "Paquetes encontrados", data: paquetes });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getExcursionesByPaquete(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const paquete = await em.findOneOrFail(
      Paquete,
      { id },
      { populate: ["paqueteExcursiones", "paqueteExcursiones.excursion"] },
    );
    res.status(200).json({
      message: "Excursiones encontradas",
      data: paquete.paqueteExcursiones.getItems(),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function recalcularPrecio(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const nuevoPrecio = await actualizarPrecioPaquete(id);
    res.status(200).json({
      message: "Precio del paquete recalculado",
      data: { id, nuevoPrecio },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export {
  findAll,
  findOne,
  create,
  update,
  remove,
  search,
  findAllUser,
  getExcursionesByPaquete,
  recalcularPrecio,
};
