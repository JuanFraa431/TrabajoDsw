import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/FiltroExcursiones.css';

interface FiltroExcursionesProps {
    onFiltrar: (filtros: { tipo: string }) => void;
}

const FiltroExcursiones: React.FC<FiltroExcursionesProps> = ({ onFiltrar }) => {
    const [tipo, setTipo] = useState('');
    const [tiposExcursion, setTiposExcursion] = useState<string[]>([]); // Estado para los tipos
    const [cargando, setCargando] = useState(true); // Estado de carga

    // Efecto para obtener los tipos de excursión
    useEffect(() => {
        const obtenerTipos = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/excursion/tipo'); // Cambia la URL según tu API
                setTiposExcursion(response.data); // Suponiendo que response.data es un array de tipos
            } catch (error) {
                console.error('Error al obtener tipos de excursión:', error);
            } finally {
                setCargando(false); // Finaliza la carga
            }
        };

        obtenerTipos();
    }, []); // Ejecutar solo al montar el componente

    const manejarFiltro = () => {
        onFiltrar({ tipo });
    };

    return (
        <div className="filtro-excursiones">
            {cargando ? ( // Mostrar un mensaje de carga mientras se obtienen los tipos
                <p>Cargando tipos de excursión...</p>
            ) : (
                <>
                    <div className="filtro-item">
                        <label htmlFor="tipo">Tipo de Excursión:</label>
                        <select
                            id="tipo"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                        >
                            <option value="">Todos</option>
                            {tiposExcursion.map((tipoExcursion, index) => (
                                <option key={index} value={tipoExcursion}>{tipoExcursion}</option>
                            ))}
                        </select>
                    </div>

                    <button className="filtro-boton" onClick={manejarFiltro}>Aplicar Filtro</button>
                </>
            )}
        </div>
    );
};

export default FiltroExcursiones;
