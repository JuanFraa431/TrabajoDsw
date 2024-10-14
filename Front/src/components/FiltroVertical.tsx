import React, { useState } from 'react';
import '../styles/FiltroVertical.css';
import {  useLocation } from 'react-router-dom';


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
    console.log(paquetes, "este es")

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSelectedFilters({ ...selectedFilters, [name]: checked });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedFilters({ ...selectedFilters, [name]: value });
    };

    const iframeSrc = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d26812.60881892444!2d${paquetes.longitud}!3d${paquetes.latitud}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sar!4v1728933077357!5m2!1ses-419!2sar`;

    return (
        <div className="filters">
            <div className="filter-section">
                <h3>Mapa</h3>
                <iframe src={iframeSrc} width="300" height="225" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                <h3>Filtros más usados</h3>
                <div className="filter-item">
                    <input
                        type="checkbox"
                        name="allInclusive"
                        checked={selectedFilters.allInclusive}
                        onChange={handleCheckboxChange}
                    />
                    <label>All Inclusive (16)</label>
                </div>
                <div className="filter-item">
                    <input
                        type="checkbox"
                        name="desayuno"
                        checked={selectedFilters.desayuno}
                        onChange={handleCheckboxChange}
                    />
                    <label>Desayuno (6)</label>
                </div>
                <div className="filter-item">
                    <input
                        type="checkbox"
                        name="cuatroEstrellas"
                        checked={selectedFilters.cuatroEstrellas}
                        onChange={handleCheckboxChange}
                    />
                    <label>4 Estrellas (10)</label>
                </div>
                <div className="filter-item">
                    <input
                        type="checkbox"
                        name="tresEstrellas"
                        checked={selectedFilters.tresEstrellas}
                        onChange={handleCheckboxChange}
                    />
                    <label>3 Estrellas (6)</label>
                </div>
                <div className="filter-item">
                    <input
                        type="checkbox"
                        name="hotel"
                        checked={selectedFilters.hotel}
                        onChange={handleCheckboxChange}
                    />
                    <label>Hotel (32)</label>
                </div>
            </div>

            <div className="filter-section">
                <h3>Tipo de alojamiento</h3>
                <div className="filter-item">
                    <input
                        type="radio"
                        name="tipoAlojamiento"
                        value="hotel"
                        checked={selectedFilters.tipoAlojamiento === 'hotel'}
                        onChange={handleSelectChange}
                    />
                    <label>Hotel (32)</label>
                </div>
                <div className="filter-item">
                    <input
                        type="radio"
                        name="tipoAlojamiento"
                        value="alquilerTemporario"
                        checked={selectedFilters.tipoAlojamiento === 'alquilerTemporario'}
                        onChange={handleSelectChange}
                    />
                    <label>Alquiler Temporario (24)</label>
                </div>
                <div className="filter-item">
                    <input
                        type="radio"
                        name="tipoAlojamiento"
                        value="apartHotel"
                        checked={selectedFilters.tipoAlojamiento === 'apartHotel'}
                        onChange={handleSelectChange}
                    />
                    <label>Apart Hotel (9)</label>
                </div>
                <div className="filter-item">
                    <input
                        type="radio"
                        name="tipoAlojamiento"
                        value="hostel"
                        checked={selectedFilters.tipoAlojamiento === 'hostel'}
                        onChange={handleSelectChange}
                    />
                    <label>Hostel (2)</label>
                </div>
                <div className="filter-item">
                    <input
                        type="radio"
                        name="tipoAlojamiento"
                        value="bedAndBreakfast"
                        checked={selectedFilters.tipoAlojamiento === 'bedAndBreakfast'}
                        onChange={handleSelectChange}
                    />
                    <label>Bed And Breakfast (1)</label>
                </div>
            </div>

            <div className="filter-section">
                <h3>Plan de comida</h3>
                <div className="filter-item">
                    <input
                        type="radio"
                        name="planComida"
                        value="soloHospedaje"
                        checked={selectedFilters.planComida === 'soloHospedaje'}
                        onChange={handleSelectChange}
                    />
                    <label>Solo Hospedaje (46)</label>
                </div>
                <div className="filter-item">
                    <input
                        type="radio"
                        name="planComida"
                        value="allInclusive"
                        checked={selectedFilters.planComida === 'allInclusive'}
                        onChange={handleSelectChange}
                    />
                    <label>All Inclusive (16)</label>
                </div>
                <div className="filter-item">
                    <input
                        type="radio"
                        name="planComida"
                        value="desayuno"
                        checked={selectedFilters.planComida === 'desayuno'}
                        onChange={handleSelectChange}
                    />
                    <label>Desayuno (6)</label>
                </div>
            </div>

            <div className="filter-section">
                <h3>Método de pago</h3>
                <div className="filter-item">
                    <input
                        type="radio"
                        name="metodoPago"
                        value="tarjetaCredito"
                        checked={selectedFilters.metodoPago === 'tarjetaCredito'}
                        onChange={handleSelectChange}
                    />
                    <label>Tarjeta de Crédito (58)</label>
                </div>
                <div className="filter-item">
                    <input
                        type="radio"
                        name="metodoPago"
                        value="transferenciaBancaria"
                        checked={selectedFilters.metodoPago === 'transferenciaBancaria'}
                        onChange={handleSelectChange}
                    />
                    <label>Transferencia Bancaria (10)</label>
                </div>
            </div>
        </div>
    );
};

export default FiltroVertical;


