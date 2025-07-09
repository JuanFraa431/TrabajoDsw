import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import '../styles/FiltroVertical.css';

const FiltroVertical: React.FC = () => {
    const [selectedFilters, setSelectedFilters] = useState({
        allInclusive: false,
        desayuno: false,
        cuatroEstrellas: false,
        tresEstrellas: false,
        hotel: false,
        tipoAlojamiento: '',
        planComida: '',
        metodoPago: '',
    });

    const location = useLocation();
    const { paquetes } = location.state || { paquetes: [] };

    const defaultLat = -32.9468; 
    const defaultLng = -60.6393;

    const lat = Number(paquetes.length > 0 && paquetes[0].latitud && !isNaN(parseFloat(paquetes[0].latitud)) ? parseFloat(paquetes[0].latitud) : defaultLat);
    const lng = Number(paquetes.length > 0 && paquetes[0].longitud && !isNaN(parseFloat(paquetes[0].longitud)) ? parseFloat(paquetes[0].longitud) : defaultLng);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyCHdkM9EAUAUnqvDk8FcOWBUUnBPFEisgQ',
    });

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSelectedFilters({ ...selectedFilters, [name]: checked });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedFilters({ ...selectedFilters, [name]: value });
    };

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
                <div className="filtro-vertical-section">
                    <h3 className="filtro-vertical-title">Filtros más usados</h3>
                    <div className="filtro-vertical-item">
                        <input
                            type="checkbox"
                            id="allInclusive"
                            name="allInclusive"
                            checked={selectedFilters.allInclusive}
                            onChange={handleCheckboxChange}
                            className="filtro-vertical-checkbox"
                        />
                        <label htmlFor="allInclusive" className="filtro-vertical-label">
                            All Inclusive 
                            <span className="filtro-vertical-count">(16)</span>
                        </label>
                    </div>
                    <div className="filtro-vertical-item">
                        <input
                            type="checkbox"
                            id="desayuno"
                            name="desayuno"
                            checked={selectedFilters.desayuno}
                            onChange={handleCheckboxChange}
                            className="filtro-vertical-checkbox"
                        />
                        <label htmlFor="desayuno" className="filtro-vertical-label">
                            Desayuno 
                            <span className="filtro-vertical-count">(6)</span>
                        </label>
                    </div>
                    <div className="filtro-vertical-item">
                        <input
                            type="checkbox"
                            id="cuatroEstrellas"
                            name="cuatroEstrellas"
                            checked={selectedFilters.cuatroEstrellas}
                            onChange={handleCheckboxChange}
                            className="filtro-vertical-checkbox"
                        />
                        <label htmlFor="cuatroEstrellas" className="filtro-vertical-label">
                            4 Estrellas 
                            <span className="filtro-vertical-count">(10)</span>
                        </label>
                    </div>
                    <div className="filtro-vertical-item">
                        <input
                            type="checkbox"
                            id="tresEstrellas"
                            name="tresEstrellas"
                            checked={selectedFilters.tresEstrellas}
                            onChange={handleCheckboxChange}
                            className="filtro-vertical-checkbox"
                        />
                        <label htmlFor="tresEstrellas" className="filtro-vertical-label">
                            3 Estrellas 
                            <span className="filtro-vertical-count">(6)</span>
                        </label>
                    </div>
                    <div className="filtro-vertical-item">
                        <input
                            type="checkbox"
                            id="hotel"
                            name="hotel"
                            checked={selectedFilters.hotel}
                            onChange={handleCheckboxChange}
                            className="filtro-vertical-checkbox"
                        />
                        <label htmlFor="hotel" className="filtro-vertical-label">
                            Hotel 
                            <span className="filtro-vertical-count">(32)</span>
                        </label>
                    </div>
                </div>

                <div className="filtro-vertical-section">
                    <h3 className="filtro-vertical-title">Tipo de alojamiento</h3>
                    <div className="filtro-vertical-item">
                        <input
                            type="radio"
                            id="hotel-radio"
                            name="tipoAlojamiento"
                            value="hotel"
                            checked={selectedFilters.tipoAlojamiento === 'hotel'}
                            onChange={handleSelectChange}
                            className="filtro-vertical-radio"
                        />
                        <label htmlFor="hotel-radio" className="filtro-vertical-label">
                            Hotel 
                            <span className="filtro-vertical-count">(32)</span>
                        </label>
                    </div>
                    <div className="filtro-vertical-item">
                        <input
                            type="radio"
                            id="alquilerTemporario"
                            name="tipoAlojamiento"
                            value="alquilerTemporario"
                            checked={selectedFilters.tipoAlojamiento === 'alquilerTemporario'}
                            onChange={handleSelectChange}
                            className="filtro-vertical-radio"
                        />
                        <label htmlFor="alquilerTemporario" className="filtro-vertical-label">
                            Alquiler Temporario 
                            <span className="filtro-vertical-count">(24)</span>
                        </label>
                    </div>
                    <div className="filtro-vertical-item">
                        <input
                            type="radio"
                            id="apartHotel"
                            name="tipoAlojamiento"
                            value="apartHotel"
                            checked={selectedFilters.tipoAlojamiento === 'apartHotel'}
                            onChange={handleSelectChange}
                            className="filtro-vertical-radio"
                        />
                        <label htmlFor="apartHotel" className="filtro-vertical-label">
                            Apart Hotel 
                            <span className="filtro-vertical-count">(9)</span>
                        </label>
                    </div>
                    <div className="filtro-vertical-item">
                        <input
                            type="radio"
                            id="hostel"
                            name="tipoAlojamiento"
                            value="hostel"
                            checked={selectedFilters.tipoAlojamiento === 'hostel'}
                            onChange={handleSelectChange}
                            className="filtro-vertical-radio"
                        />
                        <label htmlFor="hostel" className="filtro-vertical-label">
                            Hostel 
                            <span className="filtro-vertical-count">(2)</span>
                        </label>
                    </div>
                    <div className="filtro-vertical-item">
                        <input
                            type="radio"
                            id="bedAndBreakfast"
                            name="tipoAlojamiento"
                            value="bedAndBreakfast"
                            checked={selectedFilters.tipoAlojamiento === 'bedAndBreakfast'}
                            onChange={handleSelectChange}
                            className="filtro-vertical-radio"
                        />
                        <label htmlFor="bedAndBreakfast" className="filtro-vertical-label">
                            Bed And Breakfast 
                            <span className="filtro-vertical-count">(1)</span>
                        </label>
                    </div>
                </div>

                <div className="filtro-vertical-section">
                    <h3 className="filtro-vertical-title">Plan de comida</h3>
                    <div className="filtro-vertical-item">
                        <input
                            type="radio"
                            id="soloHospedaje"
                            name="planComida"
                            value="soloHospedaje"
                            checked={selectedFilters.planComida === 'soloHospedaje'}
                            onChange={handleSelectChange}
                            className="filtro-vertical-radio"
                        />
                        <label htmlFor="soloHospedaje" className="filtro-vertical-label">
                            Solo Hospedaje 
                            <span className="filtro-vertical-count">(46)</span>
                        </label>
                    </div>
                    <div className="filtro-vertical-item">
                        <input
                            type="radio"
                            id="allInclusiveComida"
                            name="planComida"
                            value="allInclusive"
                            checked={selectedFilters.planComida === 'allInclusive'}
                            onChange={handleSelectChange}
                            className="filtro-vertical-radio"
                        />
                        <label htmlFor="allInclusiveComida" className="filtro-vertical-label">
                            All Inclusive 
                            <span className="filtro-vertical-count">(16)</span>
                        </label>
                    </div>
                    <div className="filtro-vertical-item">
                        <input
                            type="radio"
                            id="desayunoComida"
                            name="planComida"
                            value="desayuno"
                            checked={selectedFilters.planComida === 'desayuno'}
                            onChange={handleSelectChange}
                            className="filtro-vertical-radio"
                        />
                        <label htmlFor="desayunoComida" className="filtro-vertical-label">
                            Desayuno 
                            <span className="filtro-vertical-count">(6)</span>
                        </label>
                    </div>
                </div>

                <div className="filtro-vertical-section">
                    <h3 className="filtro-vertical-title">Método de pago</h3>
                    <div className="filtro-vertical-item">
                        <input
                            type="radio"
                            id="tarjetaCredito"
                            name="metodoPago"
                            value="tarjetaCredito"
                            checked={selectedFilters.metodoPago === 'tarjetaCredito'}
                            onChange={handleSelectChange}
                            className="filtro-vertical-radio"
                        />
                        <label htmlFor="tarjetaCredito" className="filtro-vertical-label">
                            Tarjeta de Crédito 
                            <span className="filtro-vertical-count">(58)</span>
                        </label>
                    </div>
                    <div className="filtro-vertical-item">
                        <input
                            type="radio"
                            id="transferenciaBancaria"
                            name="metodoPago"
                            value="transferenciaBancaria"
                            checked={selectedFilters.metodoPago === 'transferenciaBancaria'}
                            onChange={handleSelectChange}
                            className="filtro-vertical-radio"
                        />
                        <label htmlFor="transferenciaBancaria" className="filtro-vertical-label">
                            Transferencia Bancaria 
                            <span className="filtro-vertical-count">(10)</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FiltroVertical;
