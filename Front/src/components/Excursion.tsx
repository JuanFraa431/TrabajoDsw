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
    };

    return (
        <div className="container2">
            <FiltroVerticalExcursiones onFiltrar={manejarFiltrado} />
            <div className="excursiones-list">
                {excursionesFiltradas.length > 0 ? (
                    excursionesFiltradas.map((excursion: Excursion) => (
                        <div className="excursion-card" key={excursion.id}>
                            <img src={excursion.imagen} alt={excursion.nombre} className="card-img" />
                            <div className="excursion-info">
                                <h3>{excursion.nombre}</h3>
                                <p className="p-footer">{excursion.descripcion}</p>
                                <p>Precio: ${excursion.precio}</p>
                                <div className="prueba2">
                                    <button 
                                        className="boton-ver"
                                        onClick={() => handleViewExcursion(excursion.id.toString())}
                                    >Ver Excursión</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="fail">
                        <p>No se encontraron excursiones que coincidan con la búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Excursiones;
