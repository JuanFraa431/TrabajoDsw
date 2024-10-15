import React from 'react';
import { Excursion } from '../../interface/excursion';

interface ExcursionListProps {
  excursiones: Excursion[];
  onEdit: (excursion: Excursion) => void;
  onDelete: (excursion: Excursion) => void;
}

const ExcursionList: React.FC<ExcursionListProps> = ({ excursiones, onEdit, onDelete }) => {
  return (
    <ul>
      {excursiones.map((excursion) => (
        <li key={excursion.id}>
          <h3>{excursion.nombre}</h3>
          <p><strong>Descripción:</strong> {excursion.descripcion}</p>
          <button className="boton-editar" onClick={() => onEdit(excursion)}>Editar</button>
          <button className="boton-eliminar" onClick={() => onDelete(excursion)}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
};

export default ExcursionList;
