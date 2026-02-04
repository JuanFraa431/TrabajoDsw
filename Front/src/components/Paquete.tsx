import React, { useEffect, useState } from "react";
import "../styles/Paquete.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Paquete } from "../interface/paquete";
import Filtros from "./FiltroVertical";
import {
  calcularPrecioTotalPaquete,
  obtenerActividadesIncluidas,
  obtenerCiudadesVisitadas,
  formatearDuracionPaquete,
} from "../utils/paqueteUtils";

const Paquetes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paquetes } =
    location.state || ({ paquetes: [] } as { paquetes: Paquete[] });

  const [visiblePackages, setVisiblePackages] = useState<string[]>([]);
  const [filteredPaquetes, setFilteredPaquetes] = useState<Paquete[]>(paquetes);
  const [activeFilters, setActiveFilters] = useState<any>(null);

  useEffect(() => {
    setFilteredPaquetes(paquetes);
  }, [paquetes]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (filteredPaquetes.length > 0) {
        setVisiblePackages(
          filteredPaquetes.map((paquete: Paquete) => paquete.id.toString()),
        );
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [filteredPaquetes]);

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);

    let filtered = [...paquetes];

    const estrellasSeleccionadas: number[] = [];
    if (filters?.cuatroEstrellas) estrellasSeleccionadas.push(4);
    if (filters?.tresEstrellas) estrellasSeleccionadas.push(3);

    if (estrellasSeleccionadas.length > 0) {
    filtered = filtered.filter((paquete: Paquete) =>
      paquete.estadias?.some((estadia) =>
        estrellasSeleccionadas.includes(estadia.hotel?.estrellas ?? 0),
      ),
    );
    }

    if (filters?.hotel) {
      filtered = filtered.filter(
        (paquete) => (paquete.estadias?.length || 0) > 0,
      );
    }

    setFilteredPaquetes(filtered);
  };

  const handleViewPackage = (id: string) => {
    navigate(`/cardDetail`, { state: { id } });
  };

  return (
    <div className="paquetes-container">
      <Filtros paquetes={paquetes} onFilterChange={handleFilterChange} />
      <div className="paquetes-content">
        <div className="paquetes-header">
          <h1 className="paquetes-title">Paquetes de Viaje</h1>
          <p className="paquetes-subtitle">
            {filteredPaquetes.length === paquetes.length
              ? `Descubre destinos increíbles con nuestros ${paquetes.length} paquetes todo incluido`
              : `Mostrando ${filteredPaquetes.length} de ${paquetes.length} paquetes`}
          </p>
        </div>
        <div className="paquetes-grid">
          {filteredPaquetes.length > 0 ? (
            filteredPaquetes.map((paquete: Paquete) => (
              <div
                className={`paquete-card ${visiblePackages.includes(paquete.id.toString()) ? "paquete-visible" : ""}`}
                key={paquete.id}
              >
                <div className="paquete-image-container">
                  <img
                    src={paquete.imagen}
                    alt={paquete.nombre}
                    className="paquete-image"
                  />
                  <div className="paquete-overlay">
                    <span className="paquete-badge">Todo Incluido</span>
                  </div>
                </div>
                <div className="paquete-content">
                  <h3 className="paquete-title">{paquete.nombre}</h3>
                  <p className="paquete-description">{paquete.detalle}</p>
                  <div className="paquete-features">
                    <div className="feature-item">
                      <span className="feature-icon">📅</span>
                      <span className="feature-text">
                        {formatearDuracionPaquete(paquete)}
                      </span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🏙️</span>
                      <span className="feature-text">
                        {obtenerCiudadesVisitadas(paquete).join(", ") ||
                          "Ciudades por confirmar"}
                      </span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🎯</span>
                      <span className="feature-text">
                        {obtenerActividadesIncluidas(paquete).join(", ") ||
                          "Actividades por confirmar"}
                      </span>
                    </div>
                  </div>
                  <div className="paquete-footer">
                    <div className="paquete-price">
                      <span className="price-label">Precio por persona</span>
                      <span className="price-amount">
                        {calcularPrecioTotalPaquete(paquete) > 0
                          ? `$${calcularPrecioTotalPaquete(paquete)}`
                          : "Consultar"}
                      </span>
                    </div>
                    <button
                      className="paquete-btn"
                      onClick={() => handleViewPackage(paquete.id.toString())}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="paquetes-empty">
              <div className="empty-icon">🏖️</div>
              <h3>No se encontraron paquetes</h3>
              <p>
                {paquetes.length > 0
                  ? "Intenta ajustar los filtros para encontrar más opciones"
                  : "No hay paquetes disponibles en este momento"}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Mapa solo visible en tablet */}
      <div className="paquetes-mapa-tablet">
        <iframe
          width="100%"
          height="220"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-66.64306640625001%2C-38.505191402403554%2C-58.22753906250001%2C-33.36723746583833&amp;layer=mapnik&amp;marker=-35.97800618085566%2C-62.435302734375"
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            marginTop: "16px",
          }}
          title="Mapa Paquetes"
        ></iframe>
        <br />
        <small>
          <a
            href="https://www.openstreetmap.org/?mlat=-35.978&amp;mlon=-62.435#map=7/-35.978/-62.435"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver el mapa más grande
          </a>
        </small>
      </div>
    </div>
  );
};

export default Paquetes;
