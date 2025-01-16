import React, { useEffect, useState } from 'react';
import { Estadia } from '../../interface/estadia';
import axios from 'axios';

interface Props {
  estadiaEditada: Estadia | null;
  onChange: (estadia: Estadia) => void;
  onCancel: () => void;
  onSave: () => void;
}

const EstadiaForm: React.FC<Props> = ({ estadiaEditada, onChange, onCancel, onSave }) => {
  if (!estadiaEditada) return null;

  const [hotels, setHotels] = useState<{ id: number; nombre: string }[]>([]);

      useEffect(() => {
        axios.get('/api/hotel/')
          .then(response => setHotels(response.data.data))
          .catch(error => console.error(error));
      }, []);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>

      <label htmlFor="id_hotel">Hotel:</label>
      <select
        id="id_hotel"
        value={estadiaEditada.id_hotel}
        onChange={(e) => onChange({ ...estadiaEditada, id_hotel: parseInt(e.target.value) })}
        required
      >
        <option value="">Seleccione un hotel</option>
        {hotels.map((hotel) => (
          <option key={hotel.id} value={hotel.id}>{hotel.nombre}</option>
        ))}
      </select>
      
      <label htmlFor="id_paquete">ID Paquete:</label>
      <input
        id="id_paquete"
        type="hidden"
        value={estadiaEditada.id_paquete}
        onChange={(e) => onChange({ ...estadiaEditada, id_paquete: parseInt(e.target.value) })}
        required
      />
      
      <label htmlFor="fecha_ini">Fecha de Inicio:</label>
      <input
        id="fecha_ini"
        type="date"
        value={estadiaEditada.fecha_ini ? estadiaEditada.fecha_ini.split('T')[0]: "" }
        onChange={(e) => onChange({ ...estadiaEditada, fecha_ini: e.target.value })}
        required
      />

      <label htmlFor="fecha_fin">Fecha de Finalización:</label>
      <input
        id="fecha_fin"
        type="date"
        value={estadiaEditada.fecha_fin ? estadiaEditada.fecha_fin.split('T')[0]: ""}
        onChange={(e) => onChange({ ...estadiaEditada, fecha_fin: e.target.value })}
        required
      />
      
      <label htmlFor="precio_x_dia">Precio por Día:</label>
      <input
        id="precio_x_dia"
        type="number"
        value={estadiaEditada.precio_x_dia}
        onChange={(e) => onChange({ ...estadiaEditada, precio_x_dia: parseFloat(e.target.value) || 0 })}
        required
      />

      <button type="submit">Guardar Cambios</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default EstadiaForm;
