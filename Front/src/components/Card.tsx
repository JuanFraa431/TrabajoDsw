import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Card.css';
import { Paquete } from '../interface/paquete';
import { useNavigate } from 'react-router-dom';
import { calcularPrecioTotalPaquete } from '../utils/paqueteUtils';

const Card: React.FC<Paquete> = ({ id, nombre, descripcion, detalle, precio, fecha_ini, fecha_fin, imagen, estadias, paqueteExcursiones }) => {
    const navigate = useNavigate();

    const handleViewPackage = () => {
        // Navega a /cardDetail pasando el id en el state
        navigate(`/cardDetail`, { state: { id } });
    };

    const paqueteData = { estadias, paqueteExcursiones };
    const precioCalculado = calcularPrecioTotalPaquete(paqueteData);

    return (
        <div className="card">
            <img src={imagen} alt={nombre} className="card-img" />
            <div className="card-body">
                <h2>{nombre}</h2>
                <p className="p-body">{detalle}</p>
                <div className="card-footer">
                    <p className="p-footer">Precio por persona</p>
                    <h4>${precioCalculado > 0 ? precioCalculado : precio}</h4>
                    <p>Incluye impuestos, tasas y cargos</p>
                </div>
                <button className="boton-ver" onClick={handleViewPackage}>
                    Ver Alojamiento
                </button>
            </div>
        </div>
    );
};

const CardList: React.FC = () => {
    const [paquetes, setPaquetes] = useState<Paquete[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaquetes = async () => {
            try {
                const response = await axios.get('/api/paquete/user');
                setPaquetes(response.data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchPaquetes();
    }, []);

    if (loading) {
        return <div>Cargando paquetes...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <div className="offer-container">
                <div className="offer-text">Descubrí nuestras ofertas en los mejores destinos.</div>
                <a href="#" className="view-more-button">VER MÁS</a>
            </div>
            <div className="card-list">
                {paquetes.map((paquete) => (
                    <Card key={paquete.id} {...paquete} />
                ))}
            </div>
        </div>
    );
};

export default CardList;
