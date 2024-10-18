import React from 'react';
import { Paquete } from '../../interface/paquete';
import '../../styles/List.css';
import '../../styles/Cliente/ClienteList.css';

interface PaqueteListProps {
  paquetes: Paquete[];
  onEdit: (paquete: Paquete) => void;
  onDelete: (paquete: Paquete) => void;
}

const PaqueteList: React.FC<PaqueteListProps> = ({ paquetes, onEdit, onDelete }) => {
  return (
    <div className="card-list">
      {paquetes.map((paquete) => (
        <div key={paquete.id} className="card">
          <div className="card-content">
            <h3>
              {paquete.nombre}
              {paquete.estado === 1 ? (
              <span className="circulo-verde"></span>
              ) : (
              <span className="circulo-rojo"></span>
              )}
            </h3>
            <p>Detalle: {paquete.detalle}</p>
          </div>
          <div className="card-actions">
            <button onClick={() => onEdit(paquete)}>Editar</button>
            <button onClick={() => onDelete(paquete)}>Eliminar</button>
            <button>Ver Estadias</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaqueteList;
