import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Body.css';
import video from '../images/esteEs.mp4';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BuscadorVuelos: React.FC = () => {
    const today = new Date(); // Fecha de hoy
    const tomorrow = new Date(today); // Crear una copia de la fecha de hoy
    tomorrow.setDate(today.getDate() + 1); // Sumar 1 día para obtener el día siguiente

    const [price, setPrice] = useState<number>(5000);
    const [startDate, setStartDate] = useState<Date | null>(today); // Inicializar con la fecha actual
    const [endDate, setEndDate] = useState<Date | null>(tomorrow); // Inicializar con el día siguiente
    const [destination, setDestination] = useState<string>(''); // Para guardar el destino
    const navigate = useNavigate(); // Hook para la navegación

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(Number(event.target.value));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Formato de fechas usando toLocaleDateString() para evitar el cambio de zona horaria
        const formattedStartDate = startDate?.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD
        const formattedEndDate = endDate?.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD¿
        
        try {
            // Enviar la solicitud al backend para buscar paquetes
            const response = await axios.get(`http://localhost:3000/api/paquete/search`, {
                params: {
                    ciudad: destination, // Ciudad que busca el usuario
                    fechaInicio: formattedStartDate,
                    fechaFin: formattedEndDate,
                    precioMaximo: price // Precio máximo ingresado por el usuario
                }
            });

                navigate('/paquetes', { state: { paquetes: response.data } });
            } catch (error) {
                console.error('Error al buscar paquetes:', error);
            }
        };

    return (
        <div className="contenedor-buscador">
            <video autoPlay muted loop id="bgVideo">
                <source src={video} type="video/mp4" />
            </video>
            <h2>NUESTROS PAQUETES</h2>
            <h1>Busca tu viaje ideal</h1>
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
                                onChange={(e) => setDestination(e.target.value)} // Guardar el destino
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
                                minDate={today} // Restringir fechas anteriores a hoy
                            />
                            <span> - </span>
                            <DatePicker
                                selected={endDate}
                                onChange={(date: Date | null) => setEndDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Fecha de fin"
                                className="datepicker-input"
                                minDate={tomorrow} // Restringir el día de hoy y fechas anteriores
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

export default BuscadorVuelos;