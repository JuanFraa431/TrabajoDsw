import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Filtro.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Filtro: React.FC<{ className?: string }> = ({ className = '' }) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const location = useLocation();
    const { paquetes = [], filters = {} } = location.state || {};

    const defaultFilters = {
        price: 5000,
        startDate: today,
        endDate: tomorrow,
        destination: ''
    };

    const [price, setPrice] = useState<number>(filters.price ?? defaultFilters.price);
    const [startDate, setStartDate] = useState<Date | null>(filters.startDate ? new Date(filters.startDate) : defaultFilters.startDate);
    const [endDate, setEndDate] = useState<Date | null>(filters.endDate ? new Date(filters.endDate) : defaultFilters.endDate);
    const [destination, setDestination] = useState<string>(filters.destination ?? defaultFilters.destination);
    const navigate = useNavigate();

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(Number(event.target.value));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formattedStartDate = startDate?.toLocaleDateString('en-CA');
        const formattedEndDate = endDate?.toLocaleDateString('en-CA');

        try {
            const response = await axios.get(`http://localhost:3000/api/paquete/search`, {
                params: {
                    ciudad: destination,
                    fechaInicio: formattedStartDate,
                    fechaFin: formattedEndDate,
                    precioMaximo: price
                }
            });

            console.log('params:' , {destination, formattedStartDate, formattedEndDate, price});
            

            navigate('/paquetes', {
                state: {
                    paquetes: response.data.data,
                    filters: {
                        destination,
                        startDate: formattedStartDate,
                        endDate: formattedEndDate,
                        price
                    }
                }
            });

        } catch (error) {
            console.error('Error al buscar paquetes:', error);
        }
    };    return (
        <div className={`filtro-contenedor ${className}`}>
            <form onSubmit={handleSubmit} className="filtro-formulario-buscador">
                <div className="filtro-search-form">
                    <div className="filtro-form-group">
                        <label htmlFor="destination">Busca tu destino:</label>
                        <div>
                            <input
                                type="text"
                                id="destination"
                                placeholder="Nombre del destino..."
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="filtro-form-group">
                        <label htmlFor="date">Selecciona las fechas:</label>
                        <div className='filtro-fechas'>
                            <DatePicker
                                selected={startDate}
                                onChange={(date: Date | null) => setStartDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Fecha de inicio"
                                className="filtro-datepicker-input filtro-datepicker-inicio"
                                minDate={today}
                                portalId="root-portal"
                            />
                            <span> - </span>
                            <DatePicker
                                selected={endDate}
                                onChange={(date: Date | null) => setEndDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Fecha de fin"
                                className="filtro-datepicker-input filtro-datepicker-fin"
                                minDate={tomorrow}
                                portalId="root-portal"
                            />
                        </div>
                    </div>
                    <div className="filtro-form-group">
                        <label htmlFor="price" className='filtro-label-range'>Precio máximo:</label>
                        <div className='filtro-range-container'>
                            <input
                                type="range"
                                id="price"
                                min="0"
                                max="10000000"
                                value={price}
                                onChange={handlePriceChange}
                            />
                            <span className="filtro-price-label">${price}</span>
                        </div>
                    </div>
                    <button type="submit" className="filtro-button-buscar">Buscar</button>
                </div>
            </form>
        </div>
    );
};

export default Filtro;
