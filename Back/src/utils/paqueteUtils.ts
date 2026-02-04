import { orm } from "../shared/db/orm.js";

const em = orm.em;

/**
 * Calcula el precio total de un paquete basado en sus estadías, excursiones y transportes
 */
export async function calcularPrecioPaquete(
  paqueteId: number,
): Promise<number> {
  const result = await em
    .getConnection()
    .execute(
      "SELECT precio_total FROM vw_precio_paquete WHERE paquete_id = ?",
      [paqueteId],
    );

  const precio = result?.[0]?.precio_total ?? 0;
  return Number(precio) || 0;
}

/**
 * Actualiza el precio de un paquete basado en sus estadías, excursiones y transportes
 */
export async function actualizarPrecioPaquete(
  paqueteId: number,
): Promise<number> {
  const nuevoPrecio = await calcularPrecioPaquete(paqueteId);
  return nuevoPrecio;
}
