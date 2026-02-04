import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ReservasPendientes.css";

interface ReservaPendiente {
  id: number;
  fecha: string;
  paquete: {
    id: number;
    nombre: string;
  };
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
  pago: {
    id: number;
    monto: number;
    metodoDePago: string;
    estado: string;
    tipoFactura?: string;
    nombreFacturacion?: string;
    apellidoFacturacion?: string;
  };
  estado: string;
  personas: any[];
}

const ReservasPendientes: React.FC = () => {
  const [reservasPendientes, setReservasPendientes] = useState<
    ReservaPendiente[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModalRechazo, setShowModalRechazo] = useState<boolean>(false);
  const [reservaSeleccionada, setReservaSeleccionada] =
    useState<ReservaPendiente | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState<string>("");

  useEffect(() => {
    cargarReservasPendientes();
  }, []);

  const cargarReservasPendientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/reservaPaquete");
      const todasReservas = response.data.data || [];
      const pendientes = todasReservas.filter(
        (r: ReservaPendiente) => r.estado === "PENDIENTE",
      );
      setReservasPendientes(pendientes);
    } catch (error) {
      console.error("Error al cargar reservas pendientes:", error);
      setError("Error al cargar las reservas pendientes");
    } finally {
      setLoading(false);
    }
  };

  const confirmarReserva = async (reserva: ReservaPendiente) => {
    if (
      !window.confirm(
        `¿Confirmar la reserva de ${reserva.usuario.nombre} ${reserva.usuario.apellido} para el paquete "${reserva.paquete.nombre}"?`,
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Actualizar el pago a "pagado"
      await axios.put(`/api/pago/${reserva.pago.id}`, {
        estado: "APROBADO",
      });

      // Actualizar la reserva a "reservado"
      await axios.put(`/api/reservaPaquete/${reserva.id}`, {
        estado: "PAGADA",
      });

      // Obtener datos completos del paquete para el email
      const paqueteResponse = await axios.get(
        `/api/paquete/${reserva.paquete.id}`,
      );
      const paqueteCompleto = paqueteResponse.data.data;
      const estadias = paqueteCompleto?.estadias || [];
      const fechaIniEstadia = estadias.length ? estadias[0].fecha_ini : null;
      const fechaFinEstadia = estadias.length
        ? estadias[estadias.length - 1].fecha_fin
        : null;

      // Enviar email de confirmación
      try {
        await axios.post("/api/email/confirmacion-pago", {
          usuario: {
            nombre: reserva.usuario.nombre,
            apellido: reserva.usuario.apellido,
            email: reserva.usuario.email,
          },
          paquete: {
            id: paqueteCompleto.id,
            nombre: paqueteCompleto.nombre,
            descripcion: paqueteCompleto.descripcion,
            detalle: paqueteCompleto.detalle,
            fecha_ini: fechaIniEstadia,
            fecha_fin: fechaFinEstadia,
            precio: reserva.pago.monto,
            imagen: paqueteCompleto.imagen,
            estadias: paqueteCompleto.estadias,
            paqueteExcursiones: paqueteCompleto.paqueteExcursiones,
          },
          reserva: {
            id: reserva.id,
            fecha_reserva: reserva.fecha,
            cantidad_personas: (reserva.personas?.length || 0) + 1,
            precio_total: reserva.pago.monto,
            estado: "PAGADA",
          },
          acompanantes: reserva.personas,
        });
        console.log("Email de confirmación enviado exitosamente");
      } catch (emailError) {
        console.error("Error al enviar email de confirmación:", emailError);
        // No bloqueamos la operación si falla el email
      }

      // Recargar la lista
      await cargarReservasPendientes();
      alert("Reserva confirmada exitosamente");
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      setError("Error al confirmar la reserva");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalRechazo = (reserva: ReservaPendiente) => {
    setReservaSeleccionada(reserva);
    setMotivoRechazo("");
    setShowModalRechazo(true);
  };

  const cerrarModalRechazo = () => {
    setShowModalRechazo(false);
    setReservaSeleccionada(null);
    setMotivoRechazo("");
  };

  const rechazarReserva = async () => {
    if (!reservaSeleccionada || !motivoRechazo.trim()) {
      alert("Debe ingresar un motivo de rechazo");
      return;
    }

    const motivo = motivoRechazo.trim();
    const reserva = reservaSeleccionada;

    setLoading(true);
    setError(null);

    try {
      // Actualizar el pago a "rechazado"
      await axios.put(`/api/pago/${reserva.pago.id}`, {
        estado: "RECHAZADO",
      });

      // Actualizar la reserva a "cancelado"
      await axios.put(`/api/reservaPaquete/${reserva.id}`, {
        estado: "CANCELADA",
        fecha_cancelacion: new Date(),
        motivo_cancelacion: motivo,
      });

      // Obtener datos completos del paquete para el email
      const paqueteResponse = await axios.get(
        `/api/paquete/${reserva.paquete.id}`,
      );
      const paqueteCompleto = paqueteResponse.data.data;
      const estadias = paqueteCompleto?.estadias || [];
      const fechaIniEstadia = estadias.length ? estadias[0].fecha_ini : null;
      const fechaFinEstadia = estadias.length
        ? estadias[estadias.length - 1].fecha_fin
        : null;

      // Enviar email de rechazo
      try {
        await axios.post("/api/email/rechazo-reserva", {
          usuario: {
            nombre: reserva.usuario.nombre,
            apellido: reserva.usuario.apellido,
            email: reserva.usuario.email,
          },
          paquete: {
            id: paqueteCompleto.id,
            nombre: paqueteCompleto.nombre,
            descripcion: paqueteCompleto.descripcion,
            fecha_ini: fechaIniEstadia,
            fecha_fin: fechaFinEstadia,
            imagen: paqueteCompleto.imagen,
          },
          reserva: {
            id: reserva.id,
            fecha_reserva: reserva.fecha,
            estado: "CANCELADA",
          },
          motivo: motivo,
        });
        console.log("Email de rechazo enviado exitosamente");
      } catch (emailError) {
        console.error("Error al enviar email de rechazo:", emailError);
        // No bloqueamos la operación si falla el email
      }

      // Recargar la lista
      await cargarReservasPendientes();
      cerrarModalRechazo();
      alert("Reserva rechazada exitosamente");
    } catch (error) {
      console.error("Error al rechazar reserva:", error);
      setError("Error al rechazar la reserva");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(monto);
  };

  if (loading && reservasPendientes.length === 0) {
    return (
      <div className="loading-message">Cargando reservas pendientes...</div>
    );
  }

  return (
    <div className="reservas-pendientes-container">
      <div className="header-section">
        <h2>Reservas y Pagos Pendientes</h2>
        <button
          onClick={cargarReservasPendientes}
          className="btn-refresh"
          disabled={loading}
        >
          Actualizar
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {reservasPendientes.length === 0 ? (
        <div className="no-pendientes">
          <div className="icon">&#10004;</div>
          <h3>No hay reservas pendientes</h3>
          <p>Todas las reservas han sido procesadas</p>
        </div>
      ) : (
        <div className="reservas-grid">
          {reservasPendientes.map((reserva) => (
            <div key={reserva.id} className="reserva-card">
              <div className="reserva-header">
                <div className="reserva-id">Reserva #{reserva.id}</div>
                <div className="reserva-fecha">
                  {formatearFecha(reserva.fecha)}
                </div>
              </div>

              <div className="reserva-body">
                <div className="info-section">
                  <h4>Cliente</h4>
                  <p className="nombre">
                    {reserva.usuario.nombre} {reserva.usuario.apellido}
                  </p>
                  <p className="email">{reserva.usuario.email}</p>
                </div>

                <div className="info-section">
                  <h4>Paquete</h4>
                  <p className="paquete-nombre">{reserva.paquete.nombre}</p>
                  <p className="precio">
                    {formatearMoneda(reserva.pago.monto)}
                  </p>
                </div>

                <div className="info-section">
                  <h4>Pago</h4>
                  <p>
                    <strong>Método:</strong> {reserva.pago.metodoDePago}
                  </p>
                  <p>
                    <strong>Monto:</strong>{" "}
                    {formatearMoneda(reserva.pago.monto)}
                  </p>
                  {reserva.pago.tipoFactura && (
                    <p>
                      <strong>Tipo Factura:</strong> {reserva.pago.tipoFactura}
                    </p>
                  )}
                </div>

                {reserva.pago.nombreFacturacion && (
                  <div className="info-section">
                    <h4>Facturación</h4>
                    <p>
                      {reserva.pago.nombreFacturacion}{" "}
                      {reserva.pago.apellidoFacturacion}
                    </p>
                  </div>
                )}

                <div className="info-section">
                  <h4>Acompañantes</h4>
                  <p>{reserva.personas.length} personas</p>
                </div>
              </div>

              <div className="reserva-actions">
                <button
                  onClick={() => confirmarReserva(reserva)}
                  className="btn-confirmar"
                  disabled={loading}
                >
                  Confirmar
                </button>
                <button
                  onClick={() => abrirModalRechazo(reserva)}
                  className="btn-rechazar"
                  disabled={loading}
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de rechazo */}
      {showModalRechazo && reservaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModalRechazo}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rechazar Reserva</h3>
              <button className="modal-close" onClick={cerrarModalRechazo}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-confirm-text">
                ¿Está seguro que desea rechazar la reserva de{" "}
                <strong>
                  {reservaSeleccionada.usuario.nombre}{" "}
                  {reservaSeleccionada.usuario.apellido}
                </strong>{" "}
                para el paquete "
                <strong>{reservaSeleccionada.paquete.nombre}</strong>"?
              </p>
              <label htmlFor="motivo-rechazo" className="modal-label">
                Motivo del rechazo:
              </label>
              <textarea
                id="motivo-rechazo"
                className="modal-textarea"
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                placeholder="Ingrese el motivo del rechazo..."
                rows={4}
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn modal-btn-cancel"
                onClick={cerrarModalRechazo}
              >
                Cancelar
              </button>
              <button
                className="modal-btn modal-btn-confirm"
                onClick={rechazarReserva}
                disabled={!motivoRechazo.trim() || loading}
              >
                {loading ? "Procesando..." : "Confirmar Rechazo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservasPendientes;
