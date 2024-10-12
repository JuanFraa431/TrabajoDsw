import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Filtro.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Filtro: React.FC = () => {
    const today = new Date(); 
    const tomorrow = new Date(today); 
    tomorrow.setDate(today.getDate() + 1); 

    const [price, setPrice] = useState<number>(5000);
    const [startDate, setStartDate] = useState<Date | null>(today); 
    const [endDate, setEndDate] = useState<Date | null>(tomorrow);
    const [destination, setDestination] = useState<string>(''); 
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

            navigate('/paquetes', { state: { paquetes: response.data } });
        } catch (error) {
            console.error('Error al buscar paquetes:', error);
        }
    };

    return (
        <div className="contenedor-filtro">
            <form onSubmit={handleSubmit} className="formulario-buscador">
                <div className="search-form">
                    <div className="form-group">
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
                    <div className="form-group">
                        <label htmlFor="date">Selecciona las fechas:</label>
                        <div className='fechas'>
                            <DatePicker
                                selected={startDate}
                                onChange={(date: Date | null) => setStartDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Fecha de inicio"
                                className="datepicker-input"
                                minDate={today} 
                                portalId="root-portal" /* Asegura que el calendario esté en un contenedor específico */
                            />
                            <span> - </span>
                            <DatePicker
                                selected={endDate}
                                onChange={(date: Date | null) => setEndDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Fecha de fin"
                                className="datepicker-input"
                                minDate={tomorrow}
                                portalId="root-portal"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price" className='label-range'>Precio máximo:</label>
                        <div className='range-container'>
                            <input
                                type="range"
                                id="price"
                                min="0"
                                max="10000000"
                                value={price}
                                onChange={handlePriceChange}
                            />
                            <span className="price-label">${price}</span>
                        </div>
                    </div>
                    <button type="submit" className="button-buscar">Buscar</button>
                </div>
            </form>
        </div>
    );
};

export default Filtro;