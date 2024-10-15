import React from 'react';
import { Ciudad } from '../../interface/ciudad';
import '../../styles/Card.css';

interface CiudadListProps {
  ciudades: Ciudad[];
  onEdit: (ciudad: Ciudad) => void;
  onDelete: (ciudad: Ciudad) => void;
}

const CiudadList: React.FC<CiudadListProps> = ({ ciudades, onEdit, onDelete }) => {
  return (
    <div className="card-list">
      {ciudades.map((ciudad) => (
        <div key={ciudad.id} className="card">
          <div className="card-content">
            <h3>{ciudad.nombre}</h3>
            <p>País: {ciudad.pais}</p>
            <p>Descripción: {ciudad.descripcion}</p>
            <p>Coordenadas: {ciudad.latitud}, {ciudad.longitud}</p>
          </div>
          <div className="card-actions">
            <button onClick={() => onEdit(ciudad)}>Editar</button>
            <button onClick={() => onDelete(ciudad)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CiudadList;