import React from 'react';
import { Hotel } from '../../interface/hotel';
import '../../styles/Card.css';

interface HotelListProps {
  hoteles: Hotel[];
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotel: Hotel) => void;
}

const HotelList: React.FC<HotelListProps> = ({ hoteles, onEdit, onDelete }) => {
  return (
    <div className="card-list">
      {hoteles.map((hotel) => (
        <div key={hotel.id} className="card">
          <div className="card-content">
            <h3>{hotel.nombre}</h3>
            <p>Dirección: {hotel.direccion}</p>
            <p>Estrellas: {hotel.estrellas}</p>
            <p>Teléfono: {hotel.telefono}</p>
            <p>Email: {hotel.email}</p>
          </div>
          <div className="card-actions">
            <button onClick={() => onEdit(hotel)}>Editar</button>
            <button onClick={() => onDelete(hotel)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelList;