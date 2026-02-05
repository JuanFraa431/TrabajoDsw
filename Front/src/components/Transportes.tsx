import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Transportes.css'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { Transporte } from '../interface/transporte'; 
import FiltroVerticalTransportes from './FiltroTransporte'; 

const Transportes: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const [transportes, setTransportes] = useState<Transporte[]>(location.state?.transportes || []); 
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [filtros, setFiltros] = useState<{ 
        tipos: string[], 
        ciudadesOrigen: string[], 
        ciudadesDestino: string[] 
    }>({ 
        tipos: [], 
        ciudadesOrigen: [], 
        ciudadesDestino: [] 
    });

    useEffect(() => {
        // Solo cargar desde la API si no hay transportes en el state
        if (!location.state?.transportes || location.state.transportes.length === 0) {
            cargarTransportes();
        }
    }, []);

    const cargarTransportes = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/api/transporte');
            if (response.data && response.data.data) {
                setTransportes(response.data.data);
            }
        } catch (error: any) {
            console.error('Error al cargar transportes:', error);
            setError('Error al cargar los transportes. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const manejarFiltrado = ({ tipos, ciudadesOrigen, ciudadesDestino }: { 
        tipos: string[], 
        ciudadesOrigen: string[], 
        ciudadesDestino: string[] 
    }) => {
        setFiltros({ tipos, ciudadesOrigen, ciudadesDestino });
    };

    const transportesFiltrados = transportes.filter((transporte: Transporte) => {
        const cumpleTipo = filtros.tipos.length === 0 || 
            (transporte.tipoTransporte && filtros.tipos.includes(transporte.tipoTransporte.nombre));
        
        const cumpleOrigen = filtros.ciudadesOrigen.length === 0 || 
            (transporte.ciudadOrigen && filtros.ciudadesOrigen.includes(transporte.ciudadOrigen.nombre));
        
        const cumpleDestino = filtros.ciudadesDestino.length === 0 || 
            (transporte.ciudadDestino && filtros.ciudadesDestino.includes(transporte.ciudadDestino.nombre));
        
        return cumpleTipo && cumpleOrigen && cumpleDestino;
    });

    if (loading) {
        return (
            <div className="transportes-container">
                <div className="transportes-content">
                    <div className="transportes-loading">
                        <div className="loading-spinner"></div>
                        <p>Cargando transportes...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="transportes-container">
                <div className="transportes-content">
                    <div className="transportes-error">
                        <div className="error-icon">⚠️</div>
                        <h3>Error al cargar transportes</h3>
                        <p>{error}</p>
                        <button onClick={cargarTransportes} className="retry-btn">
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="transportes-container">
            <FiltroVerticalTransportes 
                transportes={transportes}
                onFiltrar={manejarFiltrado} 
            />
            <div className="transportes-content">
                <div className="transportes-header">
                    <h1 className="transportes-title">Transportes Disponibles</h1>
                    <p className="transportes-subtitle">
                        {transportesFiltrados.length === transportes.length 
                            ? `Encuentra el mejor transporte para tu viaje`
                            : `Mostrando ${transportesFiltrados.length} de ${transportes.length} transportes`
                        }
                    </p>
                </div>
                <div className="transportes-grid">
                    {transportesFiltrados.length > 0 ? (
                        transportesFiltrados.map((transporte: Transporte) => (
                            <div className="transporte-card" key={transporte.id}>
                                <div className="transporte-header">
                                    <div className="transporte-type-badge">
                                        <span className="transporte-icon">
                                            {transporte.tipoTransporte?.nombre === 'Avión' ? '✈️' : 
                                             transporte.tipoTransporte?.nombre === 'Colectivo' ? '🚌' :
                                             transporte.tipoTransporte?.nombre === 'Tren' ? '🚂' :
                                             transporte.tipoTransporte?.nombre === 'Barco' ? '⛴️' : '🚗'}
                                        </span>
                                        <span className="transporte-type">{transporte.tipoTransporte?.nombre || 'N/A'}</span>
                                    </div>
                                    <div className="transporte-empresa">{transporte.nombre_empresa}</div>
                                </div>

                                <div className="transporte-route">
                                    <div className="route-location">
                                        <div className="location-name">{transporte.ciudadOrigen?.nombre || 'N/A'}</div>
                                        <div className="location-country">{transporte.ciudadOrigen?.pais || ''}</div>
                                    </div>
                                    <div className="route-arrow">
                                        <div className="arrow-line"></div>
                                        <span className="arrow-icon">→</span>
                                    </div>
                                    <div className="route-location">
                                        <div className="location-name">{transporte.ciudadDestino?.nombre || 'N/A'}</div>
                                        <div className="location-country">{transporte.ciudadDestino?.pais || ''}</div>
                                    </div>
                                </div>

                                <div className="transporte-content">
                                    <div className="transporte-name">
                                        <span className="name-icon">📍</span>
                                        {transporte.nombre}
                                    </div>
                                    
                                    {transporte.descripcion && (
                                        <p className="transporte-description">{transporte.descripcion}</p>
                                    )}

                                    <div className="transporte-info">
                                        <div className="info-item">
                                            <span className="info-icon">💺</span>
                                            <span className="info-text">{transporte.capacidad} asientos</span>
                                        </div>
                                        {transporte.estado === 1 && (
                                            <div className="info-item available">
                                                <span className="info-icon">✅</span>
                                                <span className="info-text">Disponible</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="transporte-footer">
                                    <div className="transporte-price">
                                        <span className="price-label">Precio</span>
                                        <span className="price-amount">${transporte.precio || 0}</span>
                                        <span className="price-person">por persona</span>
                                    </div>
                                    <button 
                                        className="transporte-btn"
                                        onClick={() => {
                                            // Aquí puedes agregar la funcionalidad de reserva/detalle
                                            console.log('Reservar transporte:', transporte.id);
                                        }}
                                    >
                                        Reservar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="transportes-empty">
                            <div className="empty-icon">🔍</div>
                            <h3>No se encontraron transportes</h3>
                            <p>
                                {transportes.length > 0 
                                    ? 'Intenta ajustar los filtros para encontrar más opciones'
                                    : 'No hay transportes disponibles en este momento'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transportes;

