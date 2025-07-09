// Función utilitaria para calcular el precio total de un paquete
export const calcularPrecioTotalPaquete = (paquete: any): number => {
  let total = 0;

  // Calcular precio de estadías
  if (paquete?.estadias) {
    paquete.estadias.forEach((estadia: any) => {
      const fechaIni = new Date(estadia.fecha_ini);
      const fechaFin = new Date(estadia.fecha_fin);
      const diasEstadia = Math.ceil((fechaFin.getTime() - fechaIni.getTime()) / (1000 * 60 * 60 * 24));
      total += estadia.precio_x_dia * diasEstadia;
    });
  }

  // Calcular precio de excursiones
  if (paquete?.paqueteExcursiones) {
    paquete.paqueteExcursiones.forEach((paqueteExc: any) => {
      total += paqueteExc.precio || 0;
    });
  }

  return total;
};

// Función para truncar descripción
export const descripcionTruncada = (descripcion: string, maxLength: number): string => {
  if (descripcion.length > maxLength) {
    return descripcion.substring(0, maxLength) + "...";
  }
  return descripcion;
};

// Función para calcular los días del paquete
export const calcularDiasPaquete = (paquete: any): number => {
  if (!paquete.fecha_ini || !paquete.fecha_fin) return 0;

  const fechaIni = new Date(paquete.fecha_ini);
  const fechaFin = new Date(paquete.fecha_fin);
  const dias = Math.ceil((fechaFin.getTime() - fechaIni.getTime()) / (1000 * 60 * 60 * 24));
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
  if (dias === 0) return 'Duración no especificada';
  if (dias === 1) return '1 día';

  const noches = dias - 1;
  if (noches <= 0) return `${dias} día${dias > 1 ? 's' : ''}`;

  return `${dias} día${dias > 1 ? 's' : ''}, ${noches} noche${noches > 1 ? 's' : ''}`;
};
