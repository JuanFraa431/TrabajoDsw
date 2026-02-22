import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/CardDetailHotel.css";
import { formatearDuracionPaquete } from "../utils/paqueteUtils";

const CardDetailHotel: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || { id: null };
  const [hotel, setHotel] = useState<any>(null);
  const [paquetes, setPaquetes] = useState<any[]>([]);
  const [mostrarDescripcionCompleta, setMostrarDescripcionCompleta] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`/api/hotel/${id}`);
        setHotel(response.data.data);
      } catch (error) {
        console.error("Error fetching hotel:", error);
      }
    };

    const fetchPaquetes = async () => {
      try {
        const response = await axios.get(`/api/hotel/${id}/paquetes`);
        setPaquetes(response.data.data);
      } catch (error) {
        console.error("Error fetching paquetes:", error);
      }
    };

    if (id) {
      fetchHotel();
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

  const renderEstrellas = (estrellas: number) => {
    return "★".repeat(estrellas) + "☆".repeat(5 - estrellas);
  };

  return (
    <div className="hotel-detail-container">
      <h2 className="hotel-detail-title">Detalles del Hotel</h2>

      {hotel && (
        <div className="hotel-hero">
          <div className="hotel-image-wrapper">
            <img
              src={
                hotel.imagen || "https://via.placeholder.com/600x400?text=Hotel"
              }
              alt={hotel.nombre}
              className="hotel-hero-image"
            />
            <div className="hotel-badge">Hotel</div>
          </div>

          <div className="hotel-info-panel">
            <div className="hotel-header">
              <h3 className="hotel-name">{hotel.nombre}</h3>
              <p className="hotel-subtitle">
                {hotel.ciudad?.nombre || "Ciudad no especificada"}
              </p>
              <p className="hotel-detail-text">{hotel.direccion}</p>
            </div>

            <div className="hotel-details-grid">
              <div className="hotel-detail-item">
                <div className="hotel-detail-icon">CIU</div>
                <div className="hotel-detail-content">
                  <div className="hotel-detail-label">Ciudad</div>
                  <div className="hotel-detail-value">
                    {hotel.ciudad?.nombre || "No especificada"}
                  </div>
                </div>
              </div>
              <div className="hotel-detail-item">
                <div className="hotel-detail-icon">DIR</div>
                <div className="hotel-detail-content">
                  <div className="hotel-detail-label">Dirección</div>
                  <div className="hotel-detail-value">{hotel.direccion}</div>
                </div>
              </div>
              <div className="hotel-detail-item">
                <div className="hotel-detail-icon">EST</div>
                <div className="hotel-detail-content">
                  <div className="hotel-detail-label">Estrellas</div>
                  <div className="hotel-detail-value">
                    <span className="hotel-stars">
                      {renderEstrellas(hotel.estrellas)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="hotel-detail-item">
                <div className="hotel-detail-icon">TEL</div>
                <div className="hotel-detail-content">
                  <div className="hotel-detail-label">Teléfono</div>
                  <div className="hotel-detail-value">{hotel.telefono}</div>
                </div>
              </div>
              <div className="hotel-detail-item">
                <div className="hotel-detail-icon">MAIL</div>
                <div className="hotel-detail-content">
                  <div className="hotel-detail-label">Email</div>
                  <div className="hotel-detail-value">{hotel.email}</div>
                </div>
              </div>
            </div>

            <div className="hotel-price-box">
              <div className="hotel-price-label">Precio por noche</div>
              <div className="hotel-price-amount">
                {typeof hotel.precio_x_dia === "number"
                  ? `$${hotel.precio_x_dia.toLocaleString()}`
                  : "Consultar"}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="hotel-description-section">
        <h3 className="hotel-description-title">Descripción</h3>
        <p className="hotel-description-text">
          {mostrarDescripcionCompleta
            ? hotel?.descripcion
            : descripcionTruncada(hotel?.descripcion || "", 200)}
        </p>
        {hotel?.descripcion?.length > 200 && (
          <button
            onClick={toggleDescripcion}
            className="hotel-description-toggle"
          >
            {mostrarDescripcionCompleta ? "Ver menos" : "Ver más"}
          </button>
        )}
      </div>

      <div className="hotel-packages-section">
        <h3 className="hotel-packages-title">
          Paquetes que incluyen este hotel
        </h3>

        {paquetes.length > 0 ? (
          <div className="hotel-packages-grid">
            {paquetes.map((paquete: any) => (
              <div
                key={paquete.id}
                className="hotel-package-card"
                onClick={() =>
                  navigate("/cardDetail", { state: { id: paquete.id } })
                }
              >
                <div className="hotel-package-image-wrapper">
                  <img
                    src={paquete.imagen}
                    alt={paquete.nombre}
                    className="hotel-package-image"
                  />
                  <span className="hotel-package-duration-badge">
                    {formatearDuracionPaquete(paquete)}
                  </span>
                </div>

                <div className="hotel-package-content">
                  <h4 className="hotel-package-name">{paquete.nombre}</h4>
                  <p className="hotel-package-detail">{paquete.detalle}</p>

                  <div className="hotel-package-footer">
                    <div className="hotel-package-price-section">
                      <p className="hotel-package-price-label">Precio total</p>
                      <p className="hotel-package-price">
                        {typeof paquete?.precio === "number"
                          ? `$${paquete.precio.toLocaleString()}`
                          : "Consultar"}
                      </p>
                    </div>
                    <button className="hotel-package-button">
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="hotel-packages-empty">
            <div className="hotel-packages-empty-icon">SIN</div>
            <p className="hotel-packages-empty-text">
              No hay paquetes disponibles que incluyan este hotel
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetailHotel;
