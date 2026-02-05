import React, { useMemo, useState } from "react";
import { ReservaPaquete } from "../../interface/reserva";
import { obtenerRangoFechasPaquete } from "../../utils/paqueteUtils";
import "../../styles/List.css";
import Swal from "sweetalert2";

interface ReservaPaqueteListProps {
  reservas: ReservaPaquete[];
  onDelete: (reserva: ReservaPaquete) => void;
}

const ReservaPaqueteList: React.FC<ReservaPaqueteListProps> = ({
  reservas,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [estadoFiltro, setEstadoFiltro] = useState<string>("TODOS");
  const [metodoPagoFiltro, setMetodoPagoFiltro] = useState<string>("TODOS");

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

  const formatAmount = (value: number) =>
    new Intl.NumberFormat("es-AR").format(value);

  const metodosPago = useMemo(() => {
    const values = reservas
      .map((r) => r.pago?.metodoDePago)
      .filter((v): v is string => Boolean(v));
    return Array.from(new Set(values));
  }, [reservas]);

  const filteredReservas = reservas.filter((reserva) => {
    const term = searchTerm.trim().toLowerCase();
    const paqueteNombre = reserva.paquete?.nombre || "";
    const usuarioNombre = reserva.usuario
      ? `${(reserva.usuario as any).nombre || ""} ${(reserva.usuario as any).apellido || ""}`.trim()
      : "";

    const matchesTerm =
      term.length === 0 ||
      paqueteNombre.toLowerCase().includes(term) ||
      usuarioNombre.toLowerCase().includes(term) ||
      ((reserva.usuario as any)?.username || "").toLowerCase().includes(term);

    const matchesEstado =
      estadoFiltro === "TODOS" || reserva.estado === estadoFiltro;

    const metodoPago = reserva.pago?.metodoDePago || "";
    const matchesMetodo =
      metodoPagoFiltro === "TODOS" || metodoPago === metodoPagoFiltro;

    return matchesTerm && matchesEstado && matchesMetodo;
  });

  const handleVerAcompanantes = (reserva: ReservaPaquete) => {
    const acompanantes = reserva.personas || [];
    if (acompanantes.length === 0) {
      Swal.fire("Sin acompañantes", "No hay acompañantes registrados.", "info");
      return;
    }

    const html = `
        <div style="max-height:60vh;overflow-y:auto;">
          ${acompanantes
            .map(
              (p) => `
            <div style="border:1px solid #ccc;border-radius:8px;padding:8px 10px;margin-bottom:8px;background:#f9f9f9;">
              <strong>${p.nombre} ${p.apellido}</strong>
              <div style="font-size:0.9em; color:#555;">DNI: ${p.dni || "N/A"}</div>
              <div style="font-size:0.9em; color:#555;">Email: ${p.email || "N/A"}</div>
            </div>
          `,
            )
            .join("")}
        </div>
      `;

    Swal.fire({
      title: "Acompañantes",
      html,
      width: 600,
    });
  };

  const handleVerPago = (reserva: ReservaPaquete) => {
    const pago = reserva.pago;
    if (!pago) {
      Swal.fire("Sin pago", "No hay datos de pago disponibles.", "info");
      return;
    }

    const html = `
        <div style="max-height:60vh;overflow-y:auto; text-align:left;">
          <div style="border:1px solid #ccc;border-radius:8px;padding:10px 12px;margin-bottom:10px;background:#f9f9f9;">
            <div><strong>ID:</strong> ${pago.id ?? "N/A"}</div>
            <div><strong>Monto:</strong> $${formatAmount(pago.monto || 0)}</div>
            <div><strong>Método:</strong> ${pago.metodoDePago || "N/A"}</div>
            <div><strong>Fecha:</strong> ${formatDate(pago.fecha)}</div>
            <div><strong>Estado:</strong> ${pago.estado || "N/A"}</div>
            <div><strong>Proveedor:</strong> ${pago.proveedor || "N/A"}</div>
            <div><strong>ID Transacción:</strong> ${pago.transaccionId || "N/A"}</div>
          </div>
          <div style="border:1px solid #ccc;border-radius:8px;padding:10px 12px;margin-bottom:10px;background:#f9f9f9;">
            <div style="font-weight:600;margin-bottom:6px;">Facturación</div>
            <div><strong>Tipo:</strong> ${pago.tipoFactura || "N/A"}</div>
            <div><strong>Nombre:</strong> ${pago.nombreFacturacion || "N/A"}</div>
            <div><strong>Apellido:</strong> ${pago.apellidoFacturacion || "N/A"}</div>
            <div><strong>DNI:</strong> ${pago.dniFacturacion || "N/A"}</div>
            <div><strong>Teléfono:</strong> ${pago.telefonoFacturacion || "N/A"}</div>
            <div><strong>Email:</strong> ${pago.emailFacturacion || "N/A"}</div>
          </div>
          <div style="border:1px solid #ccc;border-radius:8px;padding:10px 12px;background:#f9f9f9;">
            <div style="font-weight:600;margin-bottom:6px;">Tarjeta</div>
            <div><strong>Titular:</strong> ${pago.nombreTitular || "N/A"}</div>
            <div><strong>Últimos 4:</strong> ${pago.ultimos4 || "N/A"}</div>
          </div>
        </div>
      `;

    Swal.fire({
      title: "Detalle del Pago",
      html,
      width: 640,
    });
  };

  return (
    <div className="list-container">
      <h2>Lista de Reservas</h2>
      <div
        className="list-filters"
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Buscar por usuario o paquete"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: "220px",
            padding: "8px 10px",
            borderRadius: "6px",
          }}
        />
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: "6px" }}
        >
          <option value="TODOS">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="PAGADA">Pagada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
        <select
          value={metodoPagoFiltro}
          onChange={(e) => setMetodoPagoFiltro(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: "6px" }}
        >
          <option value="TODOS">Todos los métodos</option>
          {metodosPago.map((metodo) => (
            <option key={metodo} value={metodo}>
              {metodo}
            </option>
          ))}
        </select>
      </div>
      {filteredReservas.length === 0 ? (
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
              <th>Acompañantes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservas.map((reserva) => {
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
                    {reserva.usuario
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
                  <td>
                    $
                    {formatAmount(
                      (reserva.pago?.monto || 0) *
                        ((reserva.personas?.length || 0) + 1),
                    )}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>{reserva.personas?.length || 0}</span>
                      <button
                        style={{
                          backgroundColor: "#17a2b8",
                          color: "white",
                          border: "none",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleVerAcompanantes(reserva)}
                      >
                        Ver
                      </button>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        style={{
                          backgroundColor: "#6c757d",
                          color: "white",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleVerPago(reserva)}
                        title="Ver detalle del pago"
                      >
                        Ver Pago
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => onDelete(reserva)}
                        title="Eliminar reserva"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReservaPaqueteList;
