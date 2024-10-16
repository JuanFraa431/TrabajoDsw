import React from 'react';
import '../styles/Excursiones.css';
import { useLocation } from 'react-router-dom';
import { Excursion } from '../interface/excursion'; // Importa la interfaz de excursiones

const Excursiones: React.FC = () => {
    const location = useLocation();
    const { excursiones = [] } = location.state || {};

    return (
        <div className="container2">
            <div className="hotels-list">
                {excursiones.length > 0 ? (
                    excursiones.map((excursion: Excursion) => (
                        <div className="hotel-card" key={excursion.id}>
                            <div className="hotel-info">
                                <h3>{excursion.nombre}</h3>
                                <p>Tipo: {excursion.tipo}</p>
                                <p>Descripción: {excursion.descripcion}</p>
                                <p>Horario: {excursion.horario}</p>
                                <p>Precio: ${excursion.precio}</p>
                                <p>Empresa: {excursion.nombre_empresa}</p>
                                <p>Maximo de personas: {excursion.nro_personas_max}</p>
                                <div className='prueba'>
                                    <button className="boton-ver">Ver Excursión</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='fail'>
                        <p>No se encontraron excursiones que coincidan con la búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Excursiones;
