import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/FiltroExcursiones.css';

interface FiltroVerticalExcursionesProps {
    onFiltrar: (filtros: { tipos: string[] }) => void;
}

interface TipoExcursion {
    tipo: string;
    cantidad: number;
}

const FiltroVerticalExcursiones: React.FC<FiltroVerticalExcursionesProps> = ({ onFiltrar }) => {
    const [tiposExcursion, setTiposExcursion] = useState<TipoExcursion[]>([]); 
    const [selectedTipos, setSelectedTipos] = useState<string[]>([]); 

    useEffect(() => {
        const obtenerTiposExcursion = async () => {
            try {
                const response = await axios.get('/api/excursion/tipo');
                setTiposExcursion(response.data.data || []);
            } catch (error) {
                console.error('Error al obtener tipos de excursión:', error);
                setTiposExcursion([]);
            }
        };

        obtenerTiposExcursion();
    }, []);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;

        let updatedSelectedTipos = [...selectedTipos];

        if (checked) {
            updatedSelectedTipos.push(value);
        } else {
            updatedSelectedTipos = updatedSelectedTipos.filter(tipo => tipo !== value);
        }

        setSelectedTipos(updatedSelectedTipos);
        onFiltrar({ tipos: updatedSelectedTipos }); 
    };    return (
        <div className="filtro-excursiones-sidebar">
            <div className="filtro-excursiones-header">
                <h2 className="filtro-excursiones-title">Filtros</h2>
                <button 
                    className="filtro-excursiones-clear"
                    onClick={() => {
                        setSelectedTipos([]);
                        onFiltrar({ tipos: [] });
                    }}
                >
                    Limpiar
                </button>
            </div>
            <div className="filtro-excursiones-section">
                <h3 className="filtro-excursiones-section-title">Tipo de Excursión</h3>
                <div className="filtro-excursiones-options">
                    {tiposExcursion.map((tipoObj, index) => (
                        <label className="filtro-excursiones-option" key={index}>
                            <input
                                type="checkbox"
                                name="tipoExcursion"
                                value={tipoObj.tipo}
                                checked={selectedTipos.includes(tipoObj.tipo)}
                                onChange={handleCheckboxChange}
                                className="filtro-excursiones-checkbox"
                            />
                            <span className="filtro-excursiones-checkmark"></span>
                            <span className="filtro-excursiones-label">
                                {tipoObj.tipo}
                                <span className="filtro-excursiones-count">({tipoObj.cantidad})</span>
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FiltroVerticalExcursiones;
