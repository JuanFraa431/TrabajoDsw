import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Card.css';
import { Paquete } from '../interface/paquete';




const Card: React.FC<Paquete> = ({ id, nombre, descripcion, detalle, latitud, longitud, precio, fecha_ini, fecha_fin, imagen }) => {
    return (
        <div className="card">
            <img src={imagen} alt={nombre} className="card-img" />
            <div className="card-body">
                <h2>{nombre}</h2>
                <p className='p-body'>{detalle}</p>
                <div className="card-footer">
                    <p className='p-footer'>Precio por persona</p>
                    <h4>${precio}</h4>
                    <p>Incluye impuestos, tasas y cargos</p>
                </div>
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
                const response = await axios.get('/api/paquete');
                setPaquetes(response.data);
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
                {paquetes.map((paquete, index) => (
                    <Card key={index} {...paquete} />
                ))}
            </div>
        </div>
    );
};

export default CardList;
