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
                const response = await axios.get('http://localhost:8080/api/excursion/tipo');
                setTiposExcursion(response.data.data);
            } catch (error) {
                console.error('Error al obtener tipos de excursión:', error);
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
    };

    return (
        <div className="container-filters">
            <div className="filter-section">
                <h3>Tipo de Excursión</h3>
                {tiposExcursion.map((tipoObj, index) => (
                    <div className="filter-item" key={index}>
                        <input
                            type="checkbox"
                            name="tipoExcursion"
                            value={tipoObj.tipo}
                            checked={selectedTipos.includes(tipoObj.tipo)}
                            onChange={handleCheckboxChange}
                            id={`tipoExcursion-${index}`}
                        />
                        <label htmlFor={`tipoExcursion-${index}`}>{tipoObj.tipo} ({tipoObj.cantidad})</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FiltroVerticalExcursiones;
