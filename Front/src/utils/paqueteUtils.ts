// Función para truncar descripción
export const descripcionTruncada = (
  descripcion: string,
  maxLength: number,
): string => {
  if (descripcion.length > maxLength) {
    return descripcion.substring(0, maxLength) + "...";
  }
  return descripcion;
};

// Función para calcular los días del paquete
export const obtenerRangoFechasPaquete = (paquete: any) => {
  if (!paquete?.estadias || paquete.estadias.length === 0) return null;

  const fechasInicio = paquete.estadias
    .map((e: any) => new Date(e.fecha_ini))
    .filter((d: Date) => !Number.isNaN(d.getTime()));
  const fechasFin = paquete.estadias
    .map((e: any) => new Date(e.fecha_fin))
    .filter((d: Date) => !Number.isNaN(d.getTime()));

  if (fechasInicio.length === 0 || fechasFin.length === 0) return null;

  const fechaIni = new Date(
    Math.min(...fechasInicio.map((d: Date) => d.getTime())),
  );
  const fechaFin = new Date(
    Math.max(...fechasFin.map((d: Date) => d.getTime())),
  );

  return { fechaIni, fechaFin };
};

export const calcularDiasPaquete = (paquete: any): number => {
  const rango = obtenerRangoFechasPaquete(paquete);
  if (!rango) return 0;

  const dias = Math.ceil(
    (rango.fechaFin.getTime() - rango.fechaIni.getTime()) /
      (1000 * 60 * 60 * 24),
  );
  return dias;
};

// Función para obtener las actividades incluidas (nombres de excursiones)
export const obtenerActividadesIncluidas = (paquete: any): string[] => {
  if (!paquete?.paqueteExcursiones || paquete.paqueteExcursiones.length === 0) {
    return [];
  }

  return paquete.paqueteExcursiones
    .map((paqueteExc: any) => paqueteExc.excursion?.nombre)
    .filter((nombre: string) => nombre); // Filtrar nombres válidos
};

// Función para obtener las ciudades visitadas
export const obtenerCiudadesVisitadas = (paquete: any): string[] => {
  if (!paquete?.estadias || paquete.estadias.length === 0) {
    return [];
  }

  const ciudades = paquete.estadias
    .map((estadia: any) => estadia.hotel?.ciudad?.nombre)
    .filter((nombre: string) => nombre) as string[]; // Filtrar nombres válidos

  // Eliminar duplicados
  return [...new Set(ciudades)];
};

// Función para formatear la duración del paquete
export const formatearDuracionPaquete = (paquete: any): string => {
  const dias = calcularDiasPaquete(paquete);
  if (dias === 0) return "Duración no especificada";
  if (dias === 1) return "1 día";

  const noches = dias - 1;
  if (noches <= 0) return `${dias} día${dias > 1 ? "s" : ""}`;

  return `${dias} día${dias > 1 ? "s" : ""}, ${noches} noche${
    noches > 1 ? "s" : ""
  }`;
};
