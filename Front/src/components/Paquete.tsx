import React from 'react';
import '../styles/Paquete.css';
import { useLocation } from 'react-router-dom';
import { Paquete } from '../interface/paquete';
import Filtros from './FiltroVertical'; // Importar el componente de filtros

const Paquetes: React.FC = () => {
    const location = useLocation();
    const { paquetes } = location.state || { paquetes: [] };
    console.log(paquetes)
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
                                <p className="p-footer">Precio por persona</p>
                                <p>${paquete.precio}</p>
                                <p>{paquete.descripcion}</p>
                                <div className='prueba'>
                                    <button className="boton-ver">Ver Alojamiento</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron paquetes que coincidan con la búsqueda.</p>
                )}
            </div>
        </div>
    );
};

export default Paquetes;
