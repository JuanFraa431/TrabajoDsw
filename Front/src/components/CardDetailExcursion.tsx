import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/CardDetail.css";

const CardDetailExcursion: React.FC = () => {
  const location = useLocation();
  const { id } = location.state || { id: null };
  const [excursion, setExcursion] = useState<any>(null);
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

    if (id) {
      fetchExcursion();
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
    <div className="card-detail-container">
      <h2 className="title">Detalles de la Excursión</h2>
      {excursion && (
        <div className="detail-layout">
          <div className="image-container">
            <img
              src={excursion.imagen}
              alt={excursion.nombre}
              className="package-image"
            />
          </div>
          <div className="info-container">
            <div className="details">
              <p>
                <strong>Nombre:</strong> {excursion.nombre}
              </p>
              <p>
                <strong>Detalle:</strong> {excursion.detalle}{" "}
              </p>
              <p>
                <strong>Horario de inicio:</strong>{" "}
                {formatHorario(excursion.horario)}
              </p>
            </div>
            <div className="price-box">
              <p className="price-per-night">Precio por noche</p>
              <p className="price-total">${excursion.precio}</p>
              <button className="reserve-button">Reservar Ahora</button>
            </div>
          </div>
        </div>
      )}

      <div className="description-section">
        <h3>Descripción</h3>
        <p>
          {mostrarDescripcionCompleta
            ? excursion?.descripcion
            : descripcionTruncada(excursion?.descripcion || "", 100)}
        </p>
        <button onClick={toggleDescripcion} className="verMas-button">
          {mostrarDescripcionCompleta ? "Ver menos" : "Ver más"}
        </button>
      </div>
    </div>
  );
};

export default CardDetailExcursion;
