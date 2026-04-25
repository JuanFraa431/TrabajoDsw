import { Request, Response } from "express";
import { wrap } from "@mikro-orm/core";
import { Paquete } from "../models/paquete.model.js";
import { orm } from "../shared/db/orm.js";
import {
  calcularPrecioPaquete,
} from "../utils/paqueteUtils.js";

const em = orm.em;

const getPreciosPorPaquete = async (ids: number[]) => {
  if (!ids.length) return new Map<number, number>();
  const placeholders = ids.map(() => "?").join(", ");
  const rows = await em
    .getConnection()
    .execute<
      { paquete_id: number; precio_total: number }[]
    >(`SELECT paquete_id, precio_total FROM vw_precio_paquete WHERE paquete_id IN (${placeholders})`, ids);
  return new Map(
    rows.map((row) => [row.paquete_id, Number(row.precio_total) || 0]),
  );
};

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
          "paqueteTransportes.tipoTransporte",
          "paqueteTransportes.ciudadOrigen",
          "paqueteTransportes.ciudadDestino",
        ],
      },
    );
    const precioMap = await getPreciosPorPaquete(
      paquetes.map((p) => p.id as number),
    );
    const paquetesConPrecio = paquetes.map((paquete) => {
      const descuentoValue =
        paquete.descuento === null || paquete.descuento === undefined
          ? null
          : Number(paquete.descuento);
      return {
        ...wrap(paquete).toObject(),
        precio: precioMap.get(paquete.id as number) ?? 0,
        descuento: descuentoValue,
      };
    });
    res
      .status(200)
      .json({ message: "Paquetes encontrados", data: paquetesConPrecio });
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
          "paqueteTransportes.tipoTransporte",
          "paqueteTransportes.ciudadOrigen",
          "paqueteTransportes.ciudadDestino",
        ] as any,
      },
    );
    const precioMap = await getPreciosPorPaquete(
      paquetes.map((p) => p.id as number),
    );
    const paquetesConPrecio = paquetes.map((paquete) => {
      const descuentoValue =
        paquete.descuento === null || paquete.descuento === undefined
          ? null
          : Number(paquete.descuento);
      return {
        ...wrap(paquete).toObject(),
        precio: precioMap.get(paquete.id as number) ?? 0,
        descuento: descuentoValue,
      };
    });
    res
      .status(200)
      .json({ message: "Paquetes encontrados", data: paquetesConPrecio });
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
          "paqueteTransportes.tipoTransporte",
          "paqueteTransportes.ciudadOrigen",
          "paqueteTransportes.ciudadDestino",
        ],
      },
    );
    const precioMap = await getPreciosPorPaquete([paquete.id as number]);
    const precio = precioMap.get(paquete.id as number) ?? 0;
    const descuentoValue =
      paquete.descuento === null || paquete.descuento === undefined
        ? null
        : Number(paquete.descuento);
    res.status(200).json({
      message: "Paquete encontrado",
      data: { ...wrap(paquete).toObject(), precio, descuento: descuentoValue },
    });
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
    if ("descuento" in req.body) {
      const descuentoRaw = req.body.descuento;
      if (
        descuentoRaw === null ||
        descuentoRaw === undefined ||
        descuentoRaw === ""
      ) {
        req.body.descuento = null;
      } else {
        const parsed = Number.parseFloat(String(descuentoRaw));
        req.body.descuento = Number.isNaN(parsed) ? null : parsed.toFixed(2);
      }
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
    const { ciudad, fechaInicio, fechaFin, precioMaximo } = req.query;
    const precioMaximoNumber = Number(precioMaximo) || 0;

    // Primero obtenemos los IDs de los paquetes que cumplen con los filtros
    const paqueteIds = await em.getConnection().execute<{ id: number }[]>(
      `
            SELECT DISTINCT p.id
            FROM 
                    paquete AS p
                INNER JOIN 
                    ciudad AS c ON p.ciudad_id = c.id
                INNER JOIN
                    estadia AS e ON p.id = e.paquete_id
                LEFT JOIN
                    vw_precio_paquete AS v ON v.paquete_id = p.id
            WHERE (c.nombre = ? OR ? = '') 
            AND e.fecha_ini >= ? 
            AND e.fecha_fin <= ? 
            AND (
              ? = 0 OR
              (
                CASE
                  WHEN p.descuento IS NOT NULL AND p.descuento > 0 AND p.descuento < 1
                    THEN COALESCE(v.precio_total, 0) * (1 - p.descuento)
                  ELSE COALESCE(v.precio_total, 0)
                END
              ) <= ?
            )
            AND p.estado = 1
        `,
      [
        ciudad,
        ciudad,
        fechaInicio,
        fechaFin,
        precioMaximoNumber,
        precioMaximoNumber,
      ],
    );

    // Luego cargamos los paquetes completos con todas las relaciones necesarias
    const ids = paqueteIds.map((p) => p.id);
    const paquetes = await em.find(
      Paquete,
      { id: { $in: ids } },
      {
        populate: [
          "ciudad",
          "estadias",
          "estadias.hotel",
          "estadias.hotel.ciudad",
          "paqueteExcursiones",
          "paqueteExcursiones.excursion",
          "paqueteExcursiones.excursion.ciudad",
          "paqueteTransportes",
          "paqueteTransportes.tipoTransporte",
          "paqueteTransportes.ciudadOrigen",
          "paqueteTransportes.ciudadDestino",
        ],
      },
    );
    const precioMap = await getPreciosPorPaquete(
      paquetes.map((p) => p.id as number),
    );
    const paquetesConPrecio = paquetes.map((paquete) => {
      const descuentoValue =
        paquete.descuento === null || paquete.descuento === undefined
          ? null
          : Number(paquete.descuento);
      return {
        ...wrap(paquete).toObject(),
        precio: precioMap.get(paquete.id as number) ?? 0,
        descuento: descuentoValue,
      };
    });

    res
      .status(200)
      .json({ message: "Paquetes encontrados", data: paquetesConPrecio });
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


export {
  findAll,
  findOne,
  create,
  update,
  remove,
  search,
  findAllUser,
  getExcursionesByPaquete
};
