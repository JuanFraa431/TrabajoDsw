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
    const [tiposExcursion, setTiposExcursion] = useState<TipoExcursion[]>([]); // Almacenar tipos de excursión con cantidad
    const [selectedTipos, setSelectedTipos] = useState<string[]>([]); // Tipos seleccionados

    useEffect(() => {
        const obtenerTiposExcursion = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/excursion/tipo');
                setTiposExcursion(response.data); // Asume que es un array con tipo y cantidad
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
            // Si se selecciona el checkbox, agregar el tipo a la lista
            updatedSelectedTipos.push(value);
        } else {
            // Si se deselecciona, removerlo
            updatedSelectedTipos = updatedSelectedTipos.filter(tipo => tipo !== value);
        }

        setSelectedTipos(updatedSelectedTipos);
        onFiltrar({ tipos: updatedSelectedTipos }); // Pasar los filtros actualizados al componente padre
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
