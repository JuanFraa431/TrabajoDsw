import React, { useState, useEffect, useMemo } from 'react';
import '../styles/FiltroTransportes.css';
import { Transporte } from '../interface/transporte';

interface FiltroVerticalTransportesProps {
    transportes: Transporte[];
    onFiltrar: (filtros: { tipos: string[], ciudadesOrigen: string[], ciudadesDestino: string[] }) => void;
}

const FiltroVerticalTransportes: React.FC<FiltroVerticalTransportesProps> = ({ transportes, onFiltrar }) => {
    const [selectedTipos, setSelectedTipos] = useState<string[]>([]); 
    const [selectedCiudadesOrigen, setSelectedCiudadesOrigen] = useState<string[]>([]); 
    const [selectedCiudadesDestino, setSelectedCiudadesDestino] = useState<string[]>([]); 

    // Extraer tipos únicos de transporte con cantidad
    const tiposTransporte = useMemo(() => {
        const tipos = new Map<string, number>();
        transportes.forEach(transporte => {
            if (transporte.tipoTransporte?.nombre) {
                const nombre = transporte.tipoTransporte.nombre;
                tipos.set(nombre, (tipos.get(nombre) || 0) + 1);
            }
        });
        return Array.from(tipos.entries()).map(([tipo, cantidad]) => ({ tipo, cantidad }));
    }, [transportes]);

    // Extraer ciudades de origen únicas con cantidad
    const ciudadesOrigen = useMemo(() => {
        const ciudades = new Map<string, number>();
        transportes.forEach(transporte => {
            if (transporte.ciudadOrigen?.nombre) {
                const nombre = transporte.ciudadOrigen.nombre;
                ciudades.set(nombre, (ciudades.get(nombre) || 0) + 1);
            }
        });
        return Array.from(ciudades.entries()).map(([ciudad, cantidad]) => ({ ciudad, cantidad }));
    }, [transportes]);

    // Extraer ciudades de destino únicas con cantidad
    const ciudadesDestino = useMemo(() => {
        const ciudades = new Map<string, number>();
        transportes.forEach(transporte => {
            if (transporte.ciudadDestino?.nombre) {
                const nombre = transporte.ciudadDestino.nombre;
                ciudades.set(nombre, (ciudades.get(nombre) || 0) + 1);
            }
        });
        return Array.from(ciudades.entries()).map(([ciudad, cantidad]) => ({ ciudad, cantidad }));
    }, [transportes]);

    const handleTipoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        let updatedTipos = [...selectedTipos];

        if (checked) {
            updatedTipos.push(value);
        } else {
            updatedTipos = updatedTipos.filter(tipo => tipo !== value);
        }

        setSelectedTipos(updatedTipos);
        onFiltrar({ 
            tipos: updatedTipos, 
            ciudadesOrigen: selectedCiudadesOrigen, 
            ciudadesDestino: selectedCiudadesDestino 
        });
    };

    const handleOrigenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        let updatedOrigen = [...selectedCiudadesOrigen];

        if (checked) {
            updatedOrigen.push(value);
        } else {
            updatedOrigen = updatedOrigen.filter(ciudad => ciudad !== value);
        }

        setSelectedCiudadesOrigen(updatedOrigen);
        onFiltrar({ 
            tipos: selectedTipos, 
            ciudadesOrigen: updatedOrigen, 
            ciudadesDestino: selectedCiudadesDestino 
        });
    };

    const handleDestinoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        let updatedDestino = [...selectedCiudadesDestino];

        if (checked) {
            updatedDestino.push(value);
        } else {
            updatedDestino = updatedDestino.filter(ciudad => ciudad !== value);
        }

        setSelectedCiudadesDestino(updatedDestino);
        onFiltrar({ 
            tipos: selectedTipos, 
            ciudadesOrigen: selectedCiudadesOrigen, 
            ciudadesDestino: updatedDestino 
        });
    };

    const limpiarFiltros = () => {
        setSelectedTipos([]);
        setSelectedCiudadesOrigen([]);
        setSelectedCiudadesDestino([]);
        onFiltrar({ tipos: [], ciudadesOrigen: [], ciudadesDestino: [] });
    };

    return (
        <div className="filtro-transportes-sidebar">
            <div className="filtro-transportes-header">
                <h2 className="filtro-transportes-title">Filtros</h2>
                {(selectedTipos.length > 0 || selectedCiudadesOrigen.length > 0 || selectedCiudadesDestino.length > 0) && (
                    <button 
                        className="filtro-transportes-clear"
                        onClick={limpiarFiltros}
                    >
                        Limpiar
                    </button>
                )}
            </div>

            {tiposTransporte.length > 0 && (
                <div className="filtro-transportes-section">
                    <h3 className="filtro-transportes-section-title">Tipo de Transporte</h3>
                    <div className="filtro-transportes-options">
                        {tiposTransporte.map((tipoObj, index) => (
                            <label className="filtro-transportes-option" key={index}>
                                <input
                                    type="checkbox"
                                    name="tipoTransporte"
                                    value={tipoObj.tipo}
                                    checked={selectedTipos.includes(tipoObj.tipo)}
                                    onChange={handleTipoChange}
                                    className="filtro-transportes-checkbox"
                                />
                                <span className="filtro-transportes-checkmark"></span>
                                <span className="filtro-transportes-label">
                                    {tipoObj.tipo}
                                    <span className="filtro-transportes-count">({tipoObj.cantidad})</span>
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {ciudadesOrigen.length > 0 && (
                <div className="filtro-transportes-section">
                    <h3 className="filtro-transportes-section-title">Ciudad de Origen</h3>
                    <div className="filtro-transportes-options">
                        {ciudadesOrigen.map((ciudadObj, index) => (
                            <label className="filtro-transportes-option" key={index}>
                                <input
                                    type="checkbox"
                                    name="ciudadOrigen"
                                    value={ciudadObj.ciudad}
                                    checked={selectedCiudadesOrigen.includes(ciudadObj.ciudad)}
                                    onChange={handleOrigenChange}
                                    className="filtro-transportes-checkbox"
                                />
                                <span className="filtro-transportes-checkmark"></span>
                                <span className="filtro-transportes-label">
                                    {ciudadObj.ciudad}
                                    <span className="filtro-transportes-count">({ciudadObj.cantidad})</span>
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {ciudadesDestino.length > 0 && (
                <div className="filtro-transportes-section">
                    <h3 className="filtro-transportes-section-title">Ciudad de Destino</h3>
                    <div className="filtro-transportes-options">
                        {ciudadesDestino.map((ciudadObj, index) => (
                            <label className="filtro-transportes-option" key={index}>
                                <input
                                    type="checkbox"
                                    name="ciudadDestino"
                                    value={ciudadObj.ciudad}
                                    checked={selectedCiudadesDestino.includes(ciudadObj.ciudad)}
                                    onChange={handleDestinoChange}
                                    className="filtro-transportes-checkbox"
                                />
                                <span className="filtro-transportes-checkmark"></span>
                                <span className="filtro-transportes-label">
                                    {ciudadObj.ciudad}
                                    <span className="filtro-transportes-count">({ciudadObj.cantidad})</span>
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FiltroVerticalTransportes;
