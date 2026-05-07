import { Response } from "express";

export function handleDatabaseError(error: any, res: Response, entityName: string) {
  console.error(`Error de base de datos en ${entityName}:`, error);

  // Check for foreign key constraint violation
  // ER_ROW_IS_REFERENCED_2 (1451) is the typical MySQL error for this.
  if (
    error.code === "ER_ROW_IS_REFERENCED_2" ||
    error.errno === 1451 ||
    (error.message && error.message.toLowerCase().includes("foreign key constraint")) ||
    (error.message && error.message.toLowerCase().includes("references"))
  ) {
    return res.status(409).json({
      message: `No se puede eliminar este registro de ${entityName} porque está siendo referenciado por otros datos en el sistema.`,
    });
  }

  // Generic fallback
  return res.status(500).json({
    message: error.message || "Ocurrió un error inesperado en el servidor.",
  });
}
