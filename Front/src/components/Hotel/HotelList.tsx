import React from 'react';
import { Hotel } from '../../interface/hotel';

interface HotelListProps {
  hoteles: Hotel[];
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotel: Hotel) => void;
}

const HotelList: React.FC<HotelListProps> = ({ hoteles, onEdit, onDelete }) => {
  return (
    <ul>
      {hoteles.map((hotel) => (
        <li key={hotel.id}>
          <h3>{hotel.nombre}</h3>
          <p><strong>Descripción:</strong> {hotel.descripcion}</p>
          <button className="boton-editar" onClick={() => onEdit(hotel)}>Editar</button>
          <button className="boton-eliminar" onClick={() => onDelete(hotel)}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
};

export default HotelList;
