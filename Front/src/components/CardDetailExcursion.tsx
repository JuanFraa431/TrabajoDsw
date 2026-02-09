import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/CardDetailExcursion.css";
import { formatearDuracionPaquete } from "../utils/paqueteUtils";

const CardDetailExcursion: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || { id: null };
  const [excursion, setExcursion] = useState<any>(null);
  const [paquetes, setPaquetes] = useState<any[]>([]);
  const [mostrarDescripcionCompleta, setMostrarDescripcionCompleta] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchExcursion = async () => {
      try {
        const response = await axios.get(`/api/excursion/${id}`);
        setExcursion(response.data.data);
      } catch (error) {
        console.error("Error fetching excursion:", error);
      }
    };

    const fetchPaquetes = async () => {
      try {
        const response = await axios.get(`/api/excursion/${id}/paquetes`);
        setPaquetes(response.data.data);
      } catch (error) {
        console.error("Error fetching paquetes:", error);
      }
    };

    if (id) {
      fetchExcursion();
      fetchPaquetes();
    }
  }, [id]);

  const toggleDescripcion = () => {
    setMostrarDescripcionCompleta(!mostrarDescripcionCompleta);
  };

  const descripcionTruncada = (descripcion: string, maxLength: number) => {
    if (descripcion.length > maxLength) {
      return descripcion.substring(0, maxLength) + "...";
    }
    return descripcion;
  };

  const formatHorario = (horario: string) => {
    if (!horario) return "No especificado";
    const [hours, minutes] = horario.split(":");
    return `${hours}:${minutes} hs`;
  };

  return (
    <div className="excursion-detail-container">
      <h2 className="excursion-detail-title">Detalles de la Excursión</h2>

      {excursion && (
        <div className="excursion-hero">
          <div className="excursion-image-wrapper">
            <img
              src={excursion.imagen}
              alt={excursion.nombre}
              className="excursion-hero-image"
            />
            <div className="excursion-badge">🎯 Excursión</div>
          </div>

          <div className="excursion-info-panel">
            <div className="excursion-header">
              <h3 className="excursion-name">{excursion.nombre}</h3>
              <p className="excursion-detail-text">{excursion.detalle}</p>
            </div>

            <div className="excursion-details-grid">
              <div className="excursion-detail-item">
                <div className="excursion-detail-icon">🕐</div>
                <div className="excursion-detail-content">
                  <div className="excursion-detail-label">
                    Horario de inicio
                  </div>
                  <div className="excursion-detail-value">
                    {formatHorario(excursion.horario)}
                  </div>
                </div>
              </div>
            </div>

            <div className="excursion-price-box">
              <div className="excursion-price-label">Precio por persona</div>
              <div className="excursion-price-amount">
                ${excursion.precio?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESCRIPCIÓN */}
      <div className="excursion-description-section">
        <h3 className="excursion-description-title">
          <span className="excursion-description-title-icon">📋</span>
          Descripción
        </h3>
        <p className="excursion-description-text">
          {mostrarDescripcionCompleta
            ? excursion?.descripcion
            : descripcionTruncada(excursion?.descripcion || "", 200)}
        </p>
        <button
          onClick={toggleDescripcion}
          className="excursion-description-toggle"
        >
          {mostrarDescripcionCompleta ? "Ver menos ▲" : "Ver más ▼"}
        </button>
      </div>

      {/* PAQUETES QUE INCLUYEN ESTA EXCURSIÓN */}
      <div className="excursion-packages-section">
        <h3 className="excursion-packages-title">
          <span className="excursion-packages-title-icon">📦</span>
          Paquetes que incluyen esta excursión
        </h3>

        {paquetes.length > 0 ? (
          <div className="excursion-packages-grid">
            {paquetes.map((paquete: any) => (
              <div
                key={paquete.id}
                className="excursion-package-card"
                onClick={() =>
                  navigate("/cardDetail", { state: { id: paquete.id } })
                }
              >
                <div className="excursion-package-image-wrapper">
                  <img
                    src={paquete.imagen}
                    alt={paquete.nombre}
                    className="excursion-package-image"
                  />
                  <span className="excursion-package-duration-badge">
                    {formatearDuracionPaquete(paquete)}
                  </span>
                </div>

                <div className="excursion-package-content">
                  <h4 className="excursion-package-name">{paquete.nombre}</h4>
                  <p className="excursion-package-detail">{paquete.detalle}</p>

                  <div className="excursion-package-footer">
                    <div className="excursion-package-price-section">
                      <p className="excursion-package-price-label">
                        Precio total
                      </p>
                      <p className="excursion-package-price">
                        {typeof paquete?.precio === "number"
                          ? `$${paquete.precio.toLocaleString()}`
                          : "Consultar"}
                      </p>
                    </div>
                    <button className="excursion-package-button">
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="excursion-packages-empty">
            <div className="excursion-packages-empty-icon">📭</div>
            <p className="excursion-packages-empty-text">
              No hay paquetes disponibles que incluyan esta excursión
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetailExcursion;
