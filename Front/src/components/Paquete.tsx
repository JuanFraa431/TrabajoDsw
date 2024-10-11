import React, { useState } from 'react';
import '../styles/Paquete.css';
import { useLocation } from 'react-router-dom';
import { Paquete } from '../interface/paquete';
import Filtro from './Filtro';

const  Paquetes: React.FC = () => { {
    const location = useLocation();
    const { paquetes } = location.state || { paquetes: [] };

    const [flexible, setFlexible] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 1000000]);

    const handleFlexibleChange = () => {
        setFlexible(!flexible);
    };

    interface PriceRangeChangeEvent extends React.ChangeEvent<HTMLInputElement> {
        target: HTMLInputElement & EventTarget;
    }

    const handlePriceChange = (e: PriceRangeChangeEvent) => {
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
                <div className="filter-item">
                    <label>Filtros más usados</label>
                    <div>
                        <input type="checkbox" id="all-inclusive" />
                        <label htmlFor="all-inclusive">All Inclusive</label>
                    </div>
                    <div>
                        <input type="checkbox" id="breakfast" />
                        <label htmlFor="breakfast">Desayuno</label>
                    </div>
                    <div>
                        <input type="checkbox" id="four-stars" />
                        <label htmlFor="four-stars">4 Estrellas</label>
                    </div>
                </div>
            </div>

            <div className="hotels-list" >
                {paquetes.length > 0 ? (
                    paquetes.map((paquete: Paquete) => (
                            <div className="hotel-card " key={paquete.id}>
                                <img src={paquete.imagen} alt={paquete.nombre} className="card-img" />
                                <div className="hotel-info">
                                    <h3>{paquete.nombre}</h3>
                                    <p className="p-footer">Precio por persona</p>
                                    <p>${paquete.precio}</p>
                                    <button className='boton-ver'>Ver Alojamiento</button>
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
};


export default Paquetes;     

