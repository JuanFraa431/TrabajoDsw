import React from 'react';
import { Ciudad } from '../../interface/ciudad';

interface Props {
  ciudades: Ciudad[];
  onEdit: (ciudad: Ciudad) => void;
  onDelete: (ciudad: Ciudad) => void;
}

const CiudadList: React.FC<Props> = ({ ciudades, onEdit, onDelete }) => {
  return (
    <ul>
      {ciudades.map(ciudad => (
        <div className="ciudad-card" key={ciudad.id}>
          <div className="ciudad-info">
            <h3>{ciudad.nombre}</h3>
            <p><strong>Descripcion:</strong> {ciudad.descripcion}</p>
            <button className="boton-editar" onClick={() => onEdit(ciudad)}>Editar</button>
            <button className='boton-eliminar' onClick={() => onDelete(ciudad)}>Eliminar</button>
          </div>
        </div>
      ))}
    </ul>
  );
};

export default CiudadList;
