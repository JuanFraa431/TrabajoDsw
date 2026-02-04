import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import { Cliente } from "../../interface/cliente";
import { ReservaPaquete } from "../../interface/reserva";
import { obtenerRangoFechasPaquete } from "../../utils/paqueteUtils";
import "../../styles/Cliente/MisReservas.css";

const MisReservas: React.FC = () => {
  const [reservas, setReservas] = useState<ReservaPaquete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [selectedReserva, setSelectedReserva] = useState<ReservaPaquete | null>(
    null,
  );
  const [motivoCancelacion, setMotivoCancelacion] = useState<string>("");
  const [cancelando, setCancelando] = useState<boolean>(false);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const cliente = storedUser ? (JSON.parse(storedUser) as Cliente) : null;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const cliente = storedUser ? (JSON.parse(storedUser) as Cliente) : null;

    if (!cliente) {
      navigate("/login");
      return;
    }

    cargarReservas(cliente.id);
  }, []); // Solo ejecutar una vez al montar el componente
  const cargarReservas = async (clienteId: number) => {
    try {
      console.log("Cargando reservas para usuario:", clienteId);
      setLoading(true);
      setError("");

      const response = await axios.get(
        `/api/reservaPaquete/usuario/${clienteId}`,
      );
      console.log("Reservas recibidas:", response.data.data);

      setReservas(response.data.data);
    } catch (error) {
      console.error("Error al cargar las reservas:", error);
      setError("Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string | Date) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getEstadoClass = (estado: string) => {
    switch (estado.toUpperCase()) {
      case "PAGADA":
        return "estado-reservado";
      case "PENDIENTE":
        return "estado-pendiente";
      case "CANCELADA":
        return "estado-cancelado";
      case "COMPLETADA":
        return "estado-completado";
      default:
        return "estado-default";
    }
  };

  const verDetallePaquete = (paqueteId: number) => {
    navigate(`/cardDetail`, { state: { id: paqueteId } });
  };

  const abrirModalCancelacion = (reserva: ReservaPaquete) => {
    setSelectedReserva(reserva);
    setMotivoCancelacion("");
    setShowCancelModal(true);
  };

  const cerrarModalCancelacion = () => {
    setShowCancelModal(false);
    setSelectedReserva(null);
    setMotivoCancelacion("");
  };

  const confirmarCancelacion = async () => {
    if (!selectedReserva) return;

    if (!motivoCancelacion.trim()) {
      alert("Por favor, ingrese un motivo de cancelación");
      return;
    }

    try {
      setCancelando(true);
      const response = await axios.put(
        `/api/reservaPaquete/${selectedReserva.id}`,
        {
          estado: "CANCELADA",
          fecha_cancelacion: new Date(),
          motivo_cancelacion: motivoCancelacion.trim(),
        },
      );

      if (response.status === 200) {
        alert("Reserva cancelada exitosamente");
        cerrarModalCancelacion();

        if (cliente) {
          cargarReservas(cliente.id);
        }
      }
    } catch (error: any) {
      console.error("Error al cancelar la reserva:", error);
      const mensaje =
        error.response?.data?.message || "Error al cancelar la reserva";
      alert(mensaje);
    } finally {
      setCancelando(false);
    }
  };

  if (!cliente) {
    return null;
  }

  if (loading) {
    return (
      <div>
        <Header />
        <div className="mis-reservas-container">
          <div className="loading">Cargando reservas...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="mis-reservas-container">
        <div className="mis-reservas-header">
          <h1>Mis Reservas</h1>
          <button
            onClick={() => navigate("/detalleCliente")}
            className="btn-volver"
          >
            Volver al Perfil
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {reservas.length === 0 ? (
          <div className="no-reservas">
            <h2>No tienes reservas realizadas</h2>
            <p>¡Explora nuestros paquetes y realiza tu primera reserva!</p>
            <button
              onClick={() => navigate("/paquetes")}
              className="btn-explorar"
            >
              Explorar Paquetes
            </button>
          </div>
        ) : (
          <div className="reservas-grid">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="reserva-card">
                <div className="reserva-header">
                  <h3>{reserva.paquete.nombre}</h3>
                  <span className={`estado ${getEstadoClass(reserva.estado)}`}>
                    {reserva.estado.toUpperCase()}
                  </span>
                </div>

                <div className="reserva-imagen">
                  <img
                    src={reserva.paquete.imagen}
                    alt={reserva.paquete.nombre}
                    onError={(e) => {
                      e.currentTarget.src = "/images/default-package.jpg";
                    }}
                  />
                </div>

                <div className="reserva-info">
                  <div className="info-row">
                    <strong>Fecha de Reserva:</strong>
                    <span>{formatearFecha(reserva.fecha)}</span>
                  </div>

                  <div className="info-row">
                    <strong>Fecha del Viaje:</strong>
                    <span>
                      {obtenerRangoFechasPaquete(reserva.paquete)?.fechaIni &&
                      obtenerRangoFechasPaquete(reserva.paquete)?.fechaFin
                        ? `${formatearFecha(
                            obtenerRangoFechasPaquete(reserva.paquete)!
                              .fechaIni,
                          )} - ${formatearFecha(
                            obtenerRangoFechasPaquete(reserva.paquete)!
                              .fechaFin,
                          )}`
                        : "No especificadas"}
                    </span>
                  </div>

                  <div className="info-row">
                    <strong>Personas:</strong>
                    <span>{reserva.personas.length}</span>
                  </div>

                  <div className="info-row">
                    <strong>Total Pagado:</strong>
                    <span className="precio">
                      ${reserva.pago.monto.toLocaleString()}
                    </span>
                  </div>

                  {reserva.fecha_cancelacion && (
                    <div className="info-row cancelacion">
                      <strong>Fecha de Cancelación:</strong>
                      <span>{formatearFecha(reserva.fecha_cancelacion)}</span>
                    </div>
                  )}

                  {reserva.motivo_cancelacion && (
                    <div className="info-row motivo">
                      <strong>Motivo:</strong>
                      <span>{reserva.motivo_cancelacion}</span>
                    </div>
                  )}
                </div>

                <div className="reserva-acciones">
                  <button
                    onClick={() => verDetallePaquete(reserva.paquete.id)}
                    className="btn-ver-detalle"
                  >
                    Ver Paquete
                  </button>

                  {reserva.estado.toUpperCase() === "PAGADA" && (
                    <button
                      className="btn-cancelar"
                      onClick={() => abrirModalCancelacion(reserva)}
                    >
                      Cancelar Reserva
                    </button>
                  )}
                </div>

                {reserva.personas.length > 0 && (
                  <div className="personas-detalle">
                    <h4>Personas de la reserva:</h4>
                    <ul>
                      {reserva.personas.map((persona, index) => (
                        <li key={index}>
                          {persona.nombre} {persona.apellido} - DNI:{" "}
                          {persona.dni}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {showCancelModal && selectedReserva && (
        <div className="modal-overlay" onClick={cerrarModalCancelacion}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cancelar Reserva</h2>
              <button className="modal-close" onClick={cerrarModalCancelacion}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="reserva-info-modal">
                <h3>{selectedReserva.paquete.nombre}</h3>
                <p>
                  <strong>Fecha del viaje:</strong>{" "}
                  {obtenerRangoFechasPaquete(selectedReserva.paquete)?.fechaIni &&
                  obtenerRangoFechasPaquete(selectedReserva.paquete)?.fechaFin
                    ? `${formatearFecha(
                        obtenerRangoFechasPaquete(
                          selectedReserva.paquete,
                        )!.fechaIni,
                      )} - ${formatearFecha(
                        obtenerRangoFechasPaquete(
                          selectedReserva.paquete,
                        )!.fechaFin,
                      )}`
                    : "No especificadas"}
                </p>
                <p>
                  <strong>Total pagado:</strong> ${selectedReserva.pago.monto.toLocaleString()}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="motivoCancelacion">
                  Motivo de cancelación <span className="required">*</span>
                </label>
                <textarea
                  id="motivoCancelacion"
                  className="form-control"
                  rows={4}
                  placeholder="Por favor, indique el motivo de la cancelación..."
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                  maxLength={500}
                  disabled={cancelando}
                />
                <small className="char-counter">
                  {motivoCancelacion.length}/500 caracteres
                </small>
              </div>

              <div className="modal-warning">
                <p>
                  ⚠️ Esta acción no se puede deshacer. ¿Está seguro que desea
                  cancelar esta reserva?
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={cerrarModalCancelacion}
                disabled={cancelando}
              >
                Volver
              </button>
              <button
                className="btn-confirmar-cancelacion"
                onClick={confirmarCancelacion}
                disabled={cancelando || !motivoCancelacion.trim()}
              >
                {cancelando ? "Cancelando..." : "Confirmar Cancelación"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MisReservas;
