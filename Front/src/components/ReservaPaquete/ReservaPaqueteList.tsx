import React from "react";
import { ReservaPaquete } from "../../interface/reserva";
import { obtenerRangoFechasPaquete } from "../../utils/paqueteUtils";
import "../../styles/List.css";

interface ReservaPaqueteListProps {
  reservas: ReservaPaquete[];
  onDelete: (reserva: ReservaPaquete) => void;
}

const ReservaPaqueteList: React.FC<ReservaPaqueteListProps> = ({
  reservas,
  onDelete,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return Number.isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleDateString("es-AR");
  };

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado?.toUpperCase()) {
      case "PAGADA":
        return "badge-confirmada";
      case "PENDIENTE":
        return "badge-pendiente";
      case "CANCELADA":
        return "badge-cancelada";
      default:
        return "badge-default";
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado?.toUpperCase()) {
      case "PAGADA":
        return "Pagada";
      case "PENDIENTE":
        return "Pendiente";
      case "CANCELADA":
        return "Cancelada";
      default:
        return estado || "Sin estado";
    }
  };

  return (
    <div className="list-container">
      <h2>Lista de Reservas</h2>
      {reservas.length === 0 ? (
        <p className="mensaje-noEncontro">No hay reservas disponibles.</p>
      ) : (
        <table className="list-table">
          <thead>
            <tr>
              <th>Paquete</th>
              <th>Usuario</th>
              <th>Fecha Reserva</th>
              <th>Estado</th>
              <th>Método de Pago</th>
              <th>Monto</th>
              <th>Nº Personas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) =>
              (() => {
                const rango = obtenerRangoFechasPaquete(reserva.paquete);
                const fechaIni = rango?.fechaIni
                  ? rango.fechaIni.toISOString()
                  : undefined;
                const fechaFin = rango?.fechaFin
                  ? rango.fechaFin.toISOString()
                  : undefined;
                return (
                  <tr key={reserva.id}>
                    <td>
                      <div className="reserva-paquete-info">
                        <strong>{reserva.paquete?.nombre || "N/A"}</strong>
                        <small>
                          {formatDate(fechaIni)} - {formatDate(fechaFin)}
                        </small>
                      </div>
                    </td>
                    <td>
                      {reserva.personas && reserva.personas.length > 0
                        ? `${reserva.personas[0].nombre} ${reserva.personas[0].apellido}`
                        : reserva.usuario
                          ? (reserva.usuario as any).nombre ||
                            (reserva.usuario as any).username ||
                            `Usuario ID: ${(reserva.usuario as any).id}`
                          : "N/A"}
                    </td>
                    <td>{formatDate(reserva.fecha)}</td>
                    <td>
                      <span
                        className={`badge ${getEstadoBadgeClass(reserva.estado)}`}
                      >
                        {getEstadoLabel(reserva.estado)}
                      </span>
                    </td>
                    <td>{reserva.pago?.metodoDePago || "N/A"}</td>
                    <td>${reserva.pago?.monto || 0}</td>
                    <td>{(reserva.personas?.length || 0) + 1}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => onDelete(reserva)}
                        title="Eliminar reserva"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })(),
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReservaPaqueteList;
