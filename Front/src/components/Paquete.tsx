import React from 'react';
import { useLocation } from 'react-router-dom';
import { Paquete } from '../interface/paquete'; 
import '../styles/Card.css';

const Paquetes: React.FC = () => {
    const location = useLocation();
    const { paquetes } = location.state || { paquetes: [] };

        return (
            <div className="container">
                <div className="card-list">
                    <div>
                        <h1>Paquetes Encontrados</h1>
                        {paquetes.length > 0 ? (
                            paquetes.map((paquete: Paquete) => (
                            <div className="card" key={paquete.id}>
                                <img src="../" alt={paquete.nombre} className="card-img" />
                                <div className="card-body">
                                <h2>{paquete.nombre}</h2>
                                <p className="p-body">hola</p>
                                <div className="card-footer">
                                    <p className="p-footer">Precio por persona</p>
                                    <h4>${paquete.precio}</h4>
                                    <p>Incluye impuestos, tasas y cargos</p>
                                </div>
                                </div>
                            </div>
                            ))
                        ) : (
                            <p>No se encontraron paquetes que coincidan con la búsqueda.</p>
                        )}
                    </div>
                </div>
            </div>
            
        );
        
};

export default Paquetes;
