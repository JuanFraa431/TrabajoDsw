import React, { useState } from 'react';
import '../styles/prueba.css';

const HotelList = () => {
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
        <div className="container">
            <div className="filters">
                <h2>Filtros</h2>
                <div className="filter-item">
                    <label>Reserva flexible</label>
                    <input
                        type="checkbox"
                        checked={flexible}
                        onChange={handleFlexibleChange}
                    />
                </div>
                <div className="filter-item">
                    <label>Precio</label>
                    <input
                        type="range"
                        min="0"
                        max="1000000"
                        value={priceRange[1]}
                        onChange={handlePriceChange}
                    />
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

            <div className="hotels-list">
                <div className="hotel-card">
                    <img src="https://via.placeholder.com/150" alt="Whala!Urban Punta Cana" />
                    <div className="hotel-info">
                        <h3>Whala!Urban Punta Cana</h3>
                        <p>Precio por noche: $93.810</p>
                        <p>Precio total: $2.626.677</p>
                        <button>Ver Alojamiento</button>
                    </div>
                </div>

                <div className="hotel-card">
                    <img src="https://via.placeholder.com/150" alt="Majestic Mirage Punta Cana" />
                    <div className="hotel-info">
                        <h3>Majestic Mirage Punta Cana</h3>
                        <p>Precio por noche: $408.075</p>
                        <p>Precio total: $11.426.084</p>
                        <button>Ver Alojamiento</button>
                    </div>
                </div>

                <div className="hotel-card">
                    <img src="https://via.placeholder.com/150" alt="Ducassi" />
                    <div className="hotel-info">
                        <h3>Ducassi - Sol Caribe Apparthotel</h3>
                        <p>Precio por noche: $43.392</p>
                        <p>Precio total: $1.214.955</p>
                        <button>Ver Alojamiento</button>
                    </div>
                </div>
                <div className="hotel-card">
                    <img src="https://via.placeholder.com/150" alt="Ducassi" />
                    <div className="hotel-info">
                        <h3>Ducassi - Sol Caribe Apparthotel</h3>
                        <p>Precio por noche: $43.392</p>
                        <p>Precio total: $1.214.955</p>
                        <button>Ver Alojamiento</button>
                    </div>
                </div>
                <div className="hotel-card">
                    <img src="https://via.placeholder.com/150" alt="Ducassi" />
                    <div className="hotel-info">
                        <h3>Ducassi - Sol Caribe Apparthotel</h3>
                        <p>Precio por noche: $43.392</p>
                        <p>Precio total: $1.214.955</p>
                        <button>Ver Alojamiento</button>
                    </div>
                </div>
                <div className="hotel-card">
                    <img src="https://via.placeholder.com/150" alt="Ducassi" />
                    <div className="hotel-info">
                        <h3>Ducassi - Sol Caribe Apparthotel</h3>
                        <p>Precio por noche: $43.392</p>
                        <p>Precio total: $1.214.955</p>
                        <button>Ver Alojamiento</button>
                    </div>
                </div>
                <div className="hotel-card">
                    <img src="https://via.placeholder.com/150" alt="Ducassi" />
                    <div className="hotel-info">
                        <h3>Ducassi - Sol Caribe Apparthotel</h3>
                        <p>Precio por noche: $43.392</p>
                        <p>Precio total: $1.214.955</p>
                        <button>Ver Alojamiento</button>
                    </div>
                </div>
                <div className="hotel-card">
                    <img src="https://via.placeholder.com/150" alt="Ducassi" />
                    <div className="hotel-info">
                        <h3>Ducassi - Sol Caribe Apparthotel</h3>
                        <p>Precio por noche: $43.392</p>
                        <p>Precio total: $1.214.955</p>
                        <button>Ver Alojamiento</button>
                    </div>
                </div>
                <div className="hotel-card">
                    <img src="https://via.placeholder.com/150" alt="Ducassi" />
                    <div className="hotel-info">
                        <h3>Ducassi - Sol Caribe Apparthotel</h3>
                        <p>Precio por noche: $43.392</p>
                        <p>Precio total: $1.214.955</p>
                        <button>Ver Alojamiento</button>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default HotelList;