import React, { useState } from 'react';
import '../styles/Excursiones.css'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { Excursion } from '../interface/excursion'; 
import FiltroVerticalExcursiones from './FiltroExcursion'; 

const Excursiones: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const { excursiones } = location.state || { excursiones: [] }; 
    const [filtros, setFiltros] = useState<{ tipos: string[] }>({ tipos: [] });

    const manejarFiltrado = ({ tipos }: { tipos: string[] }) => {
        setFiltros({ tipos });
    };

    const excursionesFiltradas = excursiones.filter((excursion: Excursion) => {
        return filtros.tipos.length === 0 || filtros.tipos.includes(excursion.tipo);
    });

    const handleViewExcursion = (id: string) => {
        navigate(`/cardDetailExcursion`, { state: { id } });
    };    return (
        <div className="excursiones-container">
            <FiltroVerticalExcursiones onFiltrar={manejarFiltrado} />
            <div className="excursiones-content">
                <div className="excursiones-header">
                    <h1 className="excursiones-title">Excursiones Disponibles</h1>
                    <p className="excursiones-subtitle">Descubre experiencias únicas en destinos increíbles</p>
                </div>
                <div className="excursiones-grid">
                    {excursionesFiltradas.length > 0 ? (
                        excursionesFiltradas.map((excursion: Excursion) => (
                            <div className="excursion-card" key={excursion.id}>
                                <div className="excursion-image-container">
                                    <img src={excursion.imagen} alt={excursion.nombre} className="excursion-image" />
                                    <div className="excursion-overlay">
                                        <span className="excursion-type">{excursion.tipo}</span>
                                    </div>
                                </div>
                                <div className="excursion-content">
                                    <h3 className="excursion-title">{excursion.nombre}</h3>
                                    <p className="excursion-description">{excursion.detalle}</p>
                                    <div className="excursion-footer">
                                        <div className="excursion-price">
                                            <span className="price-label">Desde</span>
                                            <span className="price-amount">${excursion.precio}</span>
                                            <span className="price-person">por persona</span>
                                        </div>
                                        <button 
                                            className="excursion-btn"
                                            onClick={() => handleViewExcursion(excursion.id.toString())}
                                        >
                                            Ver Detalles
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="excursiones-empty">
                            <div className="empty-icon">🔍</div>
                            <h3>No se encontraron excursiones</h3>
                            <p>Intenta ajustar los filtros para encontrar más opciones</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Excursiones;
