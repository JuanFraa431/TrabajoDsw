import { Request, Response, NextFunction } from "express";
import { Transporte } from "../models/transporte.model.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const includeInactivos = req.query.includeInactivos === "true";
    const whereClause = includeInactivos ? {} : { activo: true };
    const transportes = await em.find(Transporte, whereClause, {
      populate: ["ciudadOrigen", "ciudadDestino", "tipoTransporte"],
    });
    res
      .status(200)
      .json({ message: "Transportes encontrados", data: transportes });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const transporte = await em.findOneOrFail(
      Transporte,
      { id },
      {
        populate: ["ciudadOrigen", "ciudadDestino", "tipoTransporte"],
      },
    );
    res
      .status(200)
      .json({ message: "Transporte encontrado", data: transporte });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    if (req.body.activo === undefined) {
      req.body.activo = true;
    }
    const transporte = em.create(Transporte, req.body);
    await em.flush();
    res.status(201).json({ message: "Transporte creado", data: transporte });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const transporte = em.getReference(Transporte, id);
    em.assign(transporte, req.body);
    await em.flush();
    res
      .status(200)
      .json({ message: "Transporte actualizado", data: transporte });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const transporte = em.getReference(Transporte, id);
    transporte.activo = false;
    await em.flush();
    res.status(200).json({ message: "Transporte desactivado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, create, update, remove };
