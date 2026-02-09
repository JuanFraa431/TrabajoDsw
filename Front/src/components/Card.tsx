import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Card.css";
import { Paquete } from "../interface/paquete";
import { useNavigate } from "react-router-dom";

const Card: React.FC<Paquete> = ({ id, nombre, detalle, imagen, precio }) => {
  const navigate = useNavigate();

  const handleViewPackage = () => {
    navigate(`/cardDetail`, { state: { id } });
  };

  const precioCalculado = typeof precio === "number" ? precio : null;

  return (
    <div className="card">
      <img src={imagen} alt={nombre} className="card-img" />
      <div className="card-body">
        <h2>{nombre}</h2>
        <p className="p-body">{detalle}</p>
        <div className="card-footer">
          <p>Precio por persona</p>
          <h4>
            {typeof precioCalculado === "number"
              ? `$${precioCalculado.toLocaleString()}`
              : "Consultar"}
          </h4>
          <p>Incluye impuestos, tasas y cargos</p>
          <button className="boton-ver" onClick={handleViewPackage}>
            Ver Alojamiento
          </button>
        </div>
      </div>
    </div>
  );
};

const CardList: React.FC = () => {
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const response = await axios.get("/api/paquete/user");
        const data = response.data?.data;
        if (Array.isArray(data)) {
          setPaquetes(data);
        } else {
          setPaquetes([]);
        }
      } catch (err) {
        console.error("Error fetching paquetes:", err);
        setError(
          err instanceof Error ? err.message : "Error al cargar paquetes",
        );
        setPaquetes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaquetes();
  }, []);

  const handleVerMas = () => {
    if (paquetes.length > 0) {
      navigate("/paquetes", { state: { paquetes } });
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#64748b",
            fontSize: "16px",
          }}
        >
          Cargando paquetes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="offer-container">
          <div className="offer-text">
            No se pudieron cargar los paquetes. Intente más tarde.
          </div>
        </div>
      </div>
    );
  }

  if (!paquetes || paquetes.length === 0) {
    return (
      <div className="container">
        <div className="offer-container">
          <div className="offer-text">
            No hay paquetes disponibles en este momento.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="offer-container">
        <div className="offer-text">
          Descubrí nuestras ofertas en los mejores destinos.
        </div>
        <button className="view-more-button" onClick={handleVerMas}>
          VER MÁS
        </button>
      </div>
      <div className="card-list">
        {paquetes.map((paquete) => (
          <Card key={paquete.id} {...paquete} />
        ))}
      </div>
    </div>
  );
};

export default CardList;
