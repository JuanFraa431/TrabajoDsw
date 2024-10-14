import React, { useState } from 'react';
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

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSelectedFilters({ ...selectedFilters, [name]: checked });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedFilters({ ...selectedFilters, [name]: value });
    };

    return (
        <div className="filters">
            {/* Filtros más usados */}
            <div className="filter-section">
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

            {/* Tipo de alojamiento */}
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

            {/* Plan de comida */}
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

            {/* Método de pago */}
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
