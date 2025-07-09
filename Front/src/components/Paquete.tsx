import React, { useEffect, useState } from 'react';
import '../styles/Paquete.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Paquete } from '../interface/paquete';
import Filtros from './FiltroVertical';
import {
    calcularPrecioTotalPaquete,
    obtenerActividadesIncluidas,
    obtenerCiudadesVisitadas,
    formatearDuracionPaquete
} from '../utils/paqueteUtils';

const Paquetes: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { paquetes } = location.state || { paquetes: [] } as { paquetes: Paquete[] };

    const [visiblePackages, setVisiblePackages] = useState<string[]>([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (paquetes.length > 0) {
                setVisiblePackages(paquetes.map((paquete: Paquete) => paquete.id.toString()));
            }
        }, 200);
        console.log('paquetes:', paquetes);
        return () => clearTimeout(timeout);
    }, [paquetes]);

    const handleViewPackage = (id: string) => {
        navigate(`/cardDetail`, { state: { id } });
    };

    

        return (
        <div className="paquetes-container">
            <Filtros />
            <div className="hotels-list">
                {paquetes.length > 0 ? (
                    paquetes.map((paquete: Paquete) => (
                        <div 
                            className={`hotel-card ${visiblePackages.includes(paquete.id.toString()) ? 'visible' : ''}`} 
                            key={paquete.id}
                        >
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
                                        className="boton-ver-paquete" 
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
                    )}
                </div>
            </div>
            {/* Mapa solo visible en tablet */}
            <div className="paquetes-mapa-tablet">
                <iframe
                    width="100%"
                    height="220"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-66.64306640625001%2C-38.505191402403554%2C-58.22753906250001%2C-33.36723746583833&amp;layer=mapnik&amp;marker=-35.97800618085566%2C-62.435302734375"
                    style={{ border: '1px solid #e2e8f0', borderRadius: '12px', marginTop: '16px' }}
                    title="Mapa Paquetes"
                ></iframe>
                <br />
                <small>
                    <a href="https://www.openstreetmap.org/?mlat=-35.978&amp;mlon=-62.435#map=7/-35.978/-62.435" target="_blank" rel="noopener noreferrer">
                        Ver el mapa más grande
                    </a>
                </small>
            </div>
        </div>
    );
};

export default Paquetes;
