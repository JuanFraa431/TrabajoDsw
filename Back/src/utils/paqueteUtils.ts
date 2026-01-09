import { Paquete } from "../models/paquete.model.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em;

/**
 * Calcula el precio total de un paquete basado en sus estadías, excursiones y transportes
 */
export async function calcularPrecioPaquete(
  paqueteId: number
): Promise<number> {
  const paquete = await em.findOne(
    Paquete,
    { id: paqueteId },
    {
      populate: ["estadias", "paqueteExcursiones", "paqueteTransportes"],
    }
  );

  if (!paquete) {
    throw new Error("Paquete no encontrado");
  }

  let total = 0;

  // Calcular precio de estadías
  if (paquete.estadias && paquete.estadias.length > 0) {
    await paquete.estadias.loadItems();
    for (const estadia of paquete.estadias) {
      const fechaIni = new Date(estadia.fecha_ini);
      const fechaFin = new Date(estadia.fecha_fin);
      const diasEstadia = Math.ceil(
        (fechaFin.getTime() - fechaIni.getTime()) / (1000 * 60 * 60 * 24)
      );
      total += estadia.precio_x_dia * diasEstadia;
    }
  }

  // Calcular precio de excursiones
  if (paquete.paqueteExcursiones && paquete.paqueteExcursiones.length > 0) {
    await paquete.paqueteExcursiones.loadItems();
    for (const paqueteExc of paquete.paqueteExcursiones) {
      total += paqueteExc.precio || 0;
    }
  }

  // Calcular precio de transportes
  if (paquete.paqueteTransportes && paquete.paqueteTransportes.length > 0) {
    await paquete.paqueteTransportes.loadItems();
    for (const paqueteTrans of paquete.paqueteTransportes) {
      total += paqueteTrans.precio || 0;
    }
  }

  return total;
}

/**
 * Actualiza el precio de un paquete basado en sus estadías, excursiones y transportes
 */
export async function actualizarPrecioPaquete(
  paqueteId: number
): Promise<void> {
  const paquete = await em.findOne(Paquete, { id: paqueteId });

  if (!paquete) {
    throw new Error("Paquete no encontrado");
  }

  const nuevoPrecio = await calcularPrecioPaquete(paqueteId);
  paquete.precio = nuevoPrecio;

  await em.persistAndFlush(paquete);
}
