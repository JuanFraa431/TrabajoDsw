import React, { useState } from 'react';
import '../styles/Excursiones.css';
import { useLocation } from 'react-router-dom';
import { Excursion } from '../interface/excursion'; // Importa la interfaz de excursiones
import FiltroExcursiones from './FiltroExcursion'; // Asegúrate de que el nombre sea correcto

const Excursiones: React.FC = () => {
    const location = useLocation();
    const { excursiones = [] } = location.state || {};

    const [filtros, setFiltros] = useState({ tipo: '' }); // Solo filtrar por tipo

    const manejarFiltrado = ({ tipo }: { tipo: string }) => {
        setFiltros({ tipo });
    };

    const excursionesFiltradas = excursiones.filter((excursion: Excursion) => {
        return (
            (filtros.tipo === '' || excursion.tipo === filtros.tipo) // Filtra solo por tipo
        );
    });

    return (
        <div className="container-excursiones">
            {/* Contenedor para el filtro */}
            <div className="container-filtro">
                <FiltroExcursiones onFiltrar={manejarFiltrado} />
            </div>
            <div className="excursiones-list">
                {excursionesFiltradas.length > 0 ? ( // Muestra excursiones filtradas
                    excursionesFiltradas.map((excursion: Excursion) => (
                        <div className="excursion-card" key={excursion.id}>
                            <img src={excursion.imagen} alt={excursion.nombre} className="card-img" />
                            <div className="excursion-info">
                                <h3>{excursion.nombre}</h3>
                                <p>{excursion.descripcion}</p>
                                <div className="prueba">
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
