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
  const navigate = useNavigate();

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

  const storedUser = localStorage.getItem("user");
  const cliente = storedUser ? (JSON.parse(storedUser) as Cliente) : null;

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
                      onClick={() => {
                        // Aquí podrías implementar la funcionalidad de cancelación
                        alert("Funcionalidad de cancelación próximamente");
                      }}
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
      <Footer />
    </div>
  );
};

export default MisReservas;
