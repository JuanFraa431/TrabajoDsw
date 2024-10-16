import React, { useState } from 'react';
import '../styles/Excursiones.css'; // Asegúrate de tener estilos apropiados
import { useLocation } from 'react-router-dom';
import { Excursion } from '../interface/excursion'; // Importa la interfaz de excursiones
import FiltroVerticalExcursiones from './FiltroExcursion'; // Adaptar el filtro

const Excursiones: React.FC = () => {
    const location = useLocation();
    const { excursiones } = location.state || { excursiones: [] }; // Cargar excursiones desde el estado
    const [filtros, setFiltros] = useState<{ tipos: string[] }>({ tipos: [] });

    const manejarFiltrado = ({ tipos }: { tipos: string[] }) => {
        setFiltros({ tipos });
    };

    const excursionesFiltradas = excursiones.filter((excursion: Excursion) => {
        // Si no hay filtros seleccionados, mostrar todas; si hay filtros, filtrar por tipo
        return filtros.tipos.length === 0 || filtros.tipos.includes(excursion.tipo);
    });

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
                                    <button className="boton-ver">Ver Excursión</button>
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
