import React from 'react';
import '../styles/Excursiones.css';
import { useLocation } from 'react-router-dom';
import { Excursion } from '../interface/excursion'; // Importa la interfaz de excursiones

const Excursiones: React.FC = () => {
    const location = useLocation();
    const { excursiones = [] } = location.state || {};

    return (
        <div className="container-excursiones">
            <div className="excursiones-list">
                {excursiones.length > 0 ? (
                    excursiones.map((excursion: Excursion) => (
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
