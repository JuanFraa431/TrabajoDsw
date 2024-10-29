import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/CardDetail.css';

const CardDetailExcursion: React.FC = () => {
    const location = useLocation();
    const { id } = location.state || { id: null };
    const [excursion, setExcursion] = useState<any>(null);
    const [mostrarDescripcionCompleta, setMostrarDescripcionCompleta] = useState<boolean>(false);

    useEffect(() => {
        const fetchExcursion = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/excursion/${id}`);
                setExcursion(response.data);
            } catch (error) {
                console.error("Error fetching excursion:", error);
            }
        };

        if (id) {
            fetchExcursion();
        }
    }, [id]);

    const toggleDescripcion = () => {
        setMostrarDescripcionCompleta(!mostrarDescripcionCompleta);
    };

    const descripcionTruncada = (descripcion: string, maxLength: number) => {
        if (descripcion.length > maxLength) {
            return descripcion.substring(0, maxLength) + "...";
        }
        return descripcion;
    };

    // Función para obtener una fecha válida o una fecha inventada
    const getValidDate = (date: string | null) => {
        return date ? new Date(date).toLocaleDateString('es-ES') : "01/01/2025";
    };

    return (
        <div className="card-detail-container">
            <h2 className="title">Detalles de la Excursión</h2>
            {excursion && (
                <div className="detail-layout">
                    <div className="image-container">
                        <img src={excursion.imagen} alt={excursion.nombre} className="package-image" />
                    </div>
                    <div className="info-container">
                        <div className="details">
                            <p><strong>Detalles:</strong> {excursion.detalle}</p>
                            <p className="price"><strong>Desde:</strong> {getValidDate(excursion.fecha_ini)}</p>
                            <p className='price'><strong>Hasta:</strong> {getValidDate(excursion.fecha_fin)}</p>
                        </div>
                        <div className="price-box">
                            <p className="price-per-night">Precio por noche</p>
                            <p className="price-total">${excursion.precio}</p>
                            <button className="reserve-button">Reservar Ahora</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="description-section">
                <h3>Descripción</h3>
                <p>
                    {mostrarDescripcionCompleta
                        ? excursion?.descripcion
                        : descripcionTruncada(excursion?.descripcion || "", 100)}
                </p>
                <button onClick={toggleDescripcion} className="verMas-button">
                    {mostrarDescripcionCompleta ? "Ver menos" : "Ver más"}
                </button>
            </div>
        </div>
    );
};

export default CardDetailExcursion;
