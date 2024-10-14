import React from 'react';
import { Hotel } from '../../interface/hotel';

interface Props {
  hotelEditado: Hotel | null;
  onChange: (hotel: Hotel) => void;
  onCancel: () => void;
  onSave: () => void;
}

const HotelForm: React.FC<Props> = ({ hotelEditado, onChange, onCancel, onSave }) => {
  if (!hotelEditado) return null;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
      <label htmlFor="nombre">Nombre:</label>
      <input
        id="nombre"
        type="text"
        value={hotelEditado.nombre}
        onChange={(e) => onChange({ ...hotelEditado, nombre: e.target.value })}
      />
      <label htmlFor="direccion">Dirección:</label>
      <input
        id="direccion"
        type="text"
        value={hotelEditado.direccion}
        onChange={(e) => onChange({ ...hotelEditado, direccion: e.target.value })}
      />
      <label htmlFor="descripcion">Descripción:</label>
      <input
        id="descripcion"
        type="text"
        value={hotelEditado.descripcion}
        onChange={(e) => onChange({ ...hotelEditado, descripcion: e.target.value })}
      />
      <label htmlFor="telefono">Teléfono:</label>
      <input
        id="telefono"
        type="text"
        value={hotelEditado.telefono}
        onChange={(e) => onChange({ ...hotelEditado, telefono: e.target.value })}
      />
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        type="email"
        value={hotelEditado.email}
        onChange={(e) => onChange({ ...hotelEditado, email: e.target.value })}
      />
      <label htmlFor="estrellas">Estrellas:</label>
      <input
        id="estrellas"
        type="number"
        value={hotelEditado.estrellas}
        onChange={(e) => onChange({ ...hotelEditado, estrellas: parseInt(e.target.value, 10) })}
      />
      <label htmlFor="id_ciudad">ID Ciudad:</label>
      <input
        id="id_ciudad"
        type="number"
        value={hotelEditado.id_ciudad}
        onChange={(e) => onChange({ ...hotelEditado, id_ciudad: parseInt(e.target.value, 10) })}
      />
      <button type="submit">Guardar cambios</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default HotelForm;
