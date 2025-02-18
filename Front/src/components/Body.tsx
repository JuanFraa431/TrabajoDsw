import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Body.css';
import video from '../images/esteEs.mp4';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Filtro from '../components/Filtro';
import "../styles/Filtro.css";

const BuscadorPaquetes: React.FC = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [price, setPrice] = useState<number>(200000);
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
    };

    return (
        <div className="contenedor-buscador">
            <video autoPlay muted loop id="bgVideo">
                <source src={video} type="video/mp4" />
            </video>
            <h2>NUESTROS PAQUETES</h2>
            <h1>Busca tu viaje ideal</h1>
            <Filtro className="contenedor-home" />
        </div>
    );
};

export default BuscadorPaquetes;
