import React, { useState, useEffect, useMemo } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import '../styles/FiltroVertical.css';
import { Paquete } from '../interface/paquete';

interface FiltroVerticalProps {
    paquetes: Paquete[];
    onFilterChange: (filters: any) => void;
}

const FiltroVertical: React.FC<FiltroVerticalProps> = ({ paquetes, onFilterChange }) => {
    const [selectedFilters, setSelectedFilters] = useState({
        estrellas: [] as number[],
        hoteles: [] as string[],
        ciudades: [] as string[],
    });

    // Extraer datos únicos de los paquetes
    const hotelesUnicos = useMemo(() => {
        const hoteles = new Set<string>();
        paquetes.forEach(paquete => {
            paquete.estadias?.forEach(estadia => {
                if (estadia.hotel?.nombre) {
                    hoteles.add(estadia.hotel.nombre);
                }
            });
        });
        return Array.from(hoteles).sort();
    }, [paquetes]);

    const ciudadesUnicas = useMemo(() => {
        const ciudades = new Set<string>();
        paquetes.forEach(paquete => {
            if (paquete.ciudad?.nombre) {
                ciudades.add(paquete.ciudad.nombre);
            }
        });
        return Array.from(ciudades).sort();
    }, [paquetes]);

    const estrellasUnicas = useMemo(() => {
        const estrellas = new Set<number>();
        paquetes.forEach(paquete => {
            paquete.estadias?.forEach(estadia => {
                if (estadia.hotel?.estrellas) {
                    estrellas.add(estadia.hotel.estrellas);
                }
            });
        });
        return Array.from(estrellas).sort((a, b) => b - a);
    }, [paquetes]);

    const defaultLat = -32.9468; 
    const defaultLng = -60.6393;

    const lat = paquetes.length > 0 && paquetes[0].ciudad?.latitud 
            ? paquetes[0].ciudad.latitud 
            : defaultLat;
    const lng = paquetes.length > 0 && paquetes[0].ciudad?.longitud 
            ? paquetes[0].ciudad.longitud 
            : defaultLng;

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyCHdkM9EAUAUnqvDk8FcOWBUUnBPFEisgQ',
    });

    const handleEstrellasChange = (estrellas: number) => {
        setSelectedFilters(prev => {
            const newEstrellas = prev.estrellas.includes(estrellas)
                ? prev.estrellas.filter(e => e !== estrellas)
                : [...prev.estrellas, estrellas];
            return { ...prev, estrellas: newEstrellas };
        });
    };

    const handleHotelChange = (hotel: string) => {
        setSelectedFilters(prev => {
            const newHoteles = prev.hoteles.includes(hotel)
                ? prev.hoteles.filter(h => h !== hotel)
                : [...prev.hoteles, hotel];
            return { ...prev, hoteles: newHoteles };
        });
    };

    const handleCiudadChange = (ciudad: string) => {
        setSelectedFilters(prev => {
            const newCiudades = prev.ciudades.includes(ciudad)
                ? prev.ciudades.filter(c => c !== ciudad)
                : [...prev.ciudades, ciudad];
            return { ...prev, ciudades: newCiudades };
        });
    };

    const limpiarFiltros = () => {
        setSelectedFilters({
            estrellas: [],
            hoteles: [],
            ciudades: [],
        });
    };

    useEffect(() => {
        onFilterChange(selectedFilters);
    }, [selectedFilters]);

    if (!isLoaded) return <div>Cargando mapa...</div>;    return (
        <div className="filtro-vertical">
            <div className="filtro-vertical-map-section">
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '300px', borderRadius: '12px' }}
                    center={{ lat, lng }}
                    zoom={10}
                >
                    <Marker position={{ lat, lng }} />
                </GoogleMap>
            </div>

            <div className="filtro-vertical-scroll-container">
                <div className="filtro-vertical-header">
                    <h2 className="filtro-vertical-main-title">Filtros</h2>
                    {(selectedFilters.estrellas.length > 0 || selectedFilters.hoteles.length > 0 || selectedFilters.ciudades.length > 0) && (
                        <button className="filtro-vertical-clear" onClick={limpiarFiltros}>
                            Limpiar filtros
                        </button>
                    )}
                </div>

                {/* Filtro por Ciudad */}
                {ciudadesUnicas.length > 0 && (
                    <div className="filtro-vertical-section">
                        <h3 className="filtro-vertical-title">Ciudad del Paquete</h3>
                        {ciudadesUnicas.map(ciudad => (
                            <div key={ciudad} className="filtro-vertical-item">
                                <input
                                    type="checkbox"
                                    id={`ciudad-${ciudad}`}
                                    checked={selectedFilters.ciudades.includes(ciudad)}
                                    onChange={() => handleCiudadChange(ciudad)}
                                    className="filtro-vertical-checkbox"
                                />
                                <label htmlFor={`ciudad-${ciudad}`} className="filtro-vertical-label">
                                    {ciudad}
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filtro por Estrellas del Hotel */}
                {estrellasUnicas.length > 0 && (
                    <div className="filtro-vertical-section">
                        <h3 className="filtro-vertical-title">Estrellas del Hotel</h3>
                        {estrellasUnicas.map(estrellas => (
                            <div key={estrellas} className="filtro-vertical-item">
                                <input
                                    type="checkbox"
                                    id={`estrellas-${estrellas}`}
                                    checked={selectedFilters.estrellas.includes(estrellas)}
                                    onChange={() => handleEstrellasChange(estrellas)}
                                    className="filtro-vertical-checkbox"
                                />
                                <label htmlFor={`estrellas-${estrellas}`} className="filtro-vertical-label">
                                    {'⭐'.repeat(estrellas)} ({estrellas} {estrellas === 1 ? 'Estrella' : 'Estrellas'})
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filtro por Nombre del Hotel */}
                {hotelesUnicos.length > 0 && (
                    <div className="filtro-vertical-section">
                        <h3 className="filtro-vertical-title">Hotel</h3>
                        <div className="filtro-vertical-list">
                            {hotelesUnicos.map(hotel => (
                                <div key={hotel} className="filtro-vertical-item">
                                    <input
                                        type="checkbox"
                                        id={`hotel-${hotel}`}
                                        checked={selectedFilters.hoteles.includes(hotel)}
                                        onChange={() => handleHotelChange(hotel)}
                                        className="filtro-vertical-checkbox"
                                    />
                                    <label htmlFor={`hotel-${hotel}`} className="filtro-vertical-label">
                                        {hotel}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default FiltroVertical;
