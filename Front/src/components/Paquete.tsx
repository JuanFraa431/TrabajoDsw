import React from 'react';
import '../styles/Paquete.css';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { Paquete } from '../interface/paquete';
import Filtros from './FiltroVertical';

const Paquetes: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const { paquetes } = location.state || { paquetes: [] };

    const handleViewPackage = (id: string) => {
        navigate(`/cardDetail`, { state: { id } });
    };

    return (
        <div className="container2">
            <Filtros />
            <div className="hotels-list">
                {paquetes.length > 0 ? (
                    paquetes.map((paquete: Paquete) => (
                        <div className="hotel-card" key={paquete.id}>
                            <img src={paquete.imagen} alt={paquete.nombre} className="card-img" />
                            <div className="hotel-info">
                                <h3>{paquete.nombre}</h3>
                                <p>{paquete.detalle}</p>
                                <div className="package-features">
                                    <p><strong>Duración:</strong> 5 días</p>
                                    <p><strong>Actividades incluidas:</strong> Tour guiado, comidas, transporte.</p>
                                </div>
                                <div className='prueba'>
                                    <button 
                                        className="boton-ver" 
                                        onClick={() => handleViewPackage(paquete.id.toString())} 
                                    >
                                        Ver Alojamiento
                                    </button>
                                </div>
                            </div>
                            <div className="price-container">
                                <p className="price-label">Precio x persona</p>
                                <p className="price-large">${paquete.precio}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='fail'>
                        <p>No se encontraron paquetes que coincidan con la búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Paquetes;