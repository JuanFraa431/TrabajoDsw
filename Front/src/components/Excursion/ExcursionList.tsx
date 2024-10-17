import React from 'react';
import { Excursion } from '../../interface/excursion';
import '../../styles/Card.css';

interface ExcursionListProps {
  excursiones: Excursion[];
  onEdit: (excursion: Excursion) => void;
  onDelete: (excursion: Excursion) => void;
}

const ExcursionList: React.FC<ExcursionListProps> = ({ excursiones, onEdit, onDelete }) => {
  return (
    <div className="card-list">
      {excursiones.map((excursion) => (
        <div key={excursion.id} className="card">
          <div className="card-content">
            <h3>{excursion.nombre}</h3>
            <p>Tipo: {excursion.tipo}</p>
          </div>
          <div className="card-actions">
            <button onClick={() => onEdit(excursion)}>Editar</button>
            <button onClick={() => onDelete(excursion)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExcursionList;
