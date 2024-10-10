import React from 'react';
import { useLocation } from 'react-router-dom';
import { Paquete } from '../interface/paquete'; 

const Paquetes: React.FC = () => {
    const location = useLocation();
    const { paquetes } = location.state || { paquetes: [] };

    return (
        <div>
            <h1>Paquetes Encontrados</h1>
            {paquetes.length > 0 ? (
                <ul>
                    {paquetes.map((paquete: Paquete) => ( 
                        <li key={paquete.id}>
                            <h2>Paquete ID: {paquete.id}</h2>
                            <p>Ciudad: {paquete.nombre}</p>
                            <p>Descripción: {paquete.descripcion}</p>
                            <p>Precio: ${paquete.precio}</p>
                            <p>Fecha de Inicio: {new Date(paquete.fecha_ini).toLocaleDateString()}</p>
                            <p>Fecha de Fin: {new Date(paquete.fecha_fin).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No se encontraron paquetes que coincidan con la búsqueda.</p>
            )}
        </div>
    );
};

export default Paquetes;