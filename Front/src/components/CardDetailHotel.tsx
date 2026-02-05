import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/CardDetail.css';
import { calcularPrecioTotalPaquete, formatearDuracionPaquete } from '../utils/paqueteUtils';

const CardDetailHotel: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = location.state || { id: null };
    const [hotel, setHotel] = useState<any>(null);
    const [paquetes, setPaquetes] = useState<any[]>([]);
    const [mostrarDescripcionCompleta, setMostrarDescripcionCompleta] = useState<boolean>(false);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await axios.get(`/api/hotel/${id}`);
                setHotel(response.data.data);
            } catch (error) {
                console.error("Error fetching hotel:", error);
            }
        };

        const fetchPaquetes = async () => {
            try {
                const response = await axios.get(`/api/hotel/${id}/paquetes`);
                setPaquetes(response.data.data);
            } catch (error) {
                console.error("Error fetching paquetes:", error);
            }
        };

        if (id) {
            fetchHotel();
            fetchPaquetes();
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

    const renderEstrellas = (estrellas: number) => {
        return "★".repeat(estrellas) + "☆".repeat(5 - estrellas);
    };

    return (
        <div className="card-detail-container">
            <h2 className="title">Detalles del Hotel</h2>
            {hotel && (
                <div className="detail-layout">
                    <div className="image-container">
                        <img src={hotel.imagen || 'https://via.placeholder.com/600x400?text=Hotel'} alt={hotel.nombre} className="package-image" />
                    </div>
                    <div className="info-container">
                        <div className="details">
                            <p><strong>Nombre:</strong> {hotel.nombre}</p>
                            <p><strong>Ciudad:</strong> {hotel.ciudad?.nombre || 'No especificada'}</p>
                            <p><strong>Dirección:</strong> {hotel.direccion}</p>
                            <p><strong>Estrellas:</strong> <span style={{ color: '#fbbf24' }}>{renderEstrellas(hotel.estrellas)}</span></p>
                            <p><strong>Teléfono:</strong> {hotel.telefono}</p>
                            <p><strong>Email:</strong> {hotel.email}</p>
                        </div>
                        <div className="price-box">
                            <p className="price-per-night">Precio por noche</p>
                            <p className="price-total">${hotel.precio_x_dia}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="description-section">
                <h3>Descripción</h3>
                <p>
                    {mostrarDescripcionCompleta
                        ? hotel?.descripcion
                        : descripcionTruncada(hotel?.descripcion || "", 200)}
                </p>
                {hotel?.descripcion?.length > 200 && (
                    <button onClick={toggleDescripcion} className="verMas-button">
                        {mostrarDescripcionCompleta ? "Ver menos" : "Ver más"}
                    </button>
                )}
            </div>

            {/* PAQUETES QUE INCLUYEN ESTE HOTEL */}
            <div className="content-section" style={{ marginTop: '20px' }}>
                <h3 className="section-title">Paquetes que incluyen este hotel</h3>
                {paquetes.length > 0 ? (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '20px', 
                        marginTop: '20px' 
                    }}>
                        {paquetes.map((paquete: any) => (
                            <div 
                                key={paquete.id}
                                style={{ 
                                    border: '1px solid #e0e0e0', 
                                    borderRadius: '10px', 
                                    overflow: 'hidden',
                                    backgroundColor: '#fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                                onClick={() => navigate('/cardDetail', { state: { id: paquete.id } })}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                                    <img 
                                        src={paquete.imagen} 
                                        alt={paquete.nombre} 
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover',
                                            display: 'block'
                                        }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        backgroundColor: 'rgba(0, 123, 255, 0.9)',
                                        color: 'white',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        zIndex: 2
                                    }}>
                                        {formatearDuracionPaquete(paquete)}
                                    </span>
                                </div>
                                <div style={{ padding: '16px', backgroundColor: '#fff' }}>
                                    <h4 style={{ 
                                        margin: '0 0 8px 0', 
                                        fontSize: '1.1rem', 
                                        color: '#1e293b',
                                        fontWeight: '600'
                                    }}>
                                        {paquete.nombre}
                                    </h4>
                                    <p style={{ 
                                        margin: '0 0 12px 0', 
                                        color: '#64748b', 
                                        fontSize: '0.9rem', 
                                        lineHeight: '1.4',
                                        minHeight: '40px'
                                    }}>
                                        {paquete.detalle}
                                    </p>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        paddingTop: '12px',
                                        borderTop: '1px solid #f1f5f9'
                                    }}>
                                        <div>
                                            <p style={{ 
                                                margin: '0', 
                                                fontSize: '0.75rem', 
                                                color: '#64748b' 
                                            }}>Precio total</p>
                                            <p style={{ 
                                                margin: '4px 0 0 0', 
                                                fontSize: '1.25rem', 
                                                fontWeight: 'bold', 
                                                color: '#007bff' 
                                            }}>
                                                ${calcularPrecioTotalPaquete(paquete).toLocaleString()}
                                            </p>
                                        </div>
                                        <button 
                                            style={{
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                padding: '10px 20px',
                                                borderRadius: '6px',
                                                fontSize: '0.9rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Ver detalles
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '40px', 
                        color: '#64748b',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        marginTop: '20px'
                    }}>
                        <p style={{ margin: 0 }}>No hay paquetes disponibles que incluyan este hotel</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardDetailHotel;
