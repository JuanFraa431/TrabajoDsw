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
      }
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
          "estadias.hotel.ciudad",
          "paqueteExcursiones.excursion",
          "paqueteTransportes.transporte",
          "paqueteTransportes.transporte.ciudadOrigen",
          "paqueteTransportes.transporte.ciudadDestino",
        ] as any,
      }
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
      }
    );
    res.status(200).json({ message: "Paquete encontrado", data: paquete });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
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
            AND p.fecha_ini >= ? 
            AND p.fecha_fin <= ? 
            AND p.precio <= ?
            AND p.estado = '1'
        `,
      [ciudad, ciudad, fechaInicio, fechaFin, precioMaximo]
    );
    res.status(200).json({ message: "Paquetes encontrados", data: paquetes });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getExcursionesByPaquete(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    // Suponiendo que la relación es paquete.excursiones
    // Asegúrate de que 'excursiones' es una relación válida en el modelo Paquete.
    // Si la relación se llama diferente, reemplaza 'excursiones' por el nombre correcto.
    const paquete = await em.findOneOrFail(
      Paquete,
      { id },
      { populate: ["comentarios", "estadias"] }
    ); // Ajusta aquí si tienes la relación correcta
    res.status(200).json({
      message: "Excursiones encontradas",
      data: (paquete as any).excursiones,
    }); // Ajusta aquí si el nombre es diferente
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function recalcularPrecio(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    await actualizarPrecioPaquete(id);
    const paquete = await em.findOneOrFail(Paquete, { id });
    res.status(200).json({
      message: "Precio del paquete recalculado",
      data: { id: paquete.id, nuevoPrecio: paquete.precio },
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
