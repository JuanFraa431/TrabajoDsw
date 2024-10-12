import React, { useState } from 'react';
import '../styles/Paquete.css';
import { useLocation } from 'react-router-dom';
import { Paquete } from '../interface/paquete';

const Paquetes: React.FC = () => {
    const location = useLocation();
    const { paquetes, searchParams } = location.state || { paquetes: [], searchParams: {} };

    const [flexible, setFlexible] = useState(false);
    const [priceRange, setPriceRange] = useState([0, searchParams?.price || 1000000]);

    const handleFlexibleChange = () => {
        setFlexible(!flexible);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setPriceRange([priceRange[0], value]);
    };

    return (
        <div className="container2">
            <div className="filters">
                <h2>Filtros</h2>
                <div className="filter-item">
                    <input
                        type="checkbox"
                        checked={flexible}
                        onChange={handleFlexibleChange}
                    />
                    <label>Reserva flexible</label>
                </div>
                <div className="filter-item">
                    <input
                        type="range"
                        min="0"
                        max="1000000"
                        value={priceRange[1]}
                        onChange={handlePriceChange}
                    />
                    <label>Precio</label>
                    <div className="price-range">
                        <span>${priceRange[0].toLocaleString()}</span> -{' '}
                        <span>${priceRange[1].toLocaleString()}</span>
                    </div>
                </div>
                {/* Agrega los filtros que desees */}
            </div>

            <div className="hotels-list">
                {paquetes.length > 0 ? (
                    paquetes.map((paquete: Paquete) => (
                        <div className="hotel-card" key={paquete.id}>
                            <img src={paquete.imagen} alt={paquete.nombre} className="card-img" />
                            <div className="hotel-info">
                                <h3>{paquete.nombre}</h3>
                                <p className="p-footer">Precio por persona</p>
                                <p>${paquete.precio}</p>
                                <button className="boton-ver">Ver Alojamiento</button>
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
