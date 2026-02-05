import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Body.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Filtro from '../components/Filtro';
import "../styles/Filtro.css";

// Video alojado en Cloudinary para mejor rendimiento
const VIDEO_URL = 'https://res.cloudinary.com/dy8lzfj2h/video/upload/v1770263036/esteEs.61bc836c6139e36ff221_gfcnb8.mp4';

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
            const response = await axios.get(`/api/paquete/search`, {
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
    };    return (
        <div className="body-contenedor-buscador">
            <video 
                autoPlay 
                muted 
                loop 
                playsInline
                id="body-bgVideo"
                poster="https://res.cloudinary.com/dy8lzfj2h/image/upload/v1730385201/yn5rswhhqx3exh33iexv.jpg"
            >
                <source src={VIDEO_URL} type="video/mp4" />
                Tu navegador no soporta videos HTML5.
            </video>
            <h2>NUESTROS PAQUETES</h2>
            <h1>Busca tu viaje ideal</h1>
            <Filtro className="body-contenedor-home" />
        </div>
    );
};

export default BuscadorPaquetes;