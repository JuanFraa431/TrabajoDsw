import React from 'react';
import { Ciudad } from '../../interface/ciudad';

interface Props {
  ciudadEditada: Ciudad | null;
  onChange: (ciudad: Ciudad) => void;
  onCancel: () => void;
  onSave: () => void;
}

const CiudadForm: React.FC<Props> = ({ ciudadEditada, onChange, onCancel, onSave }) => {
  if (!ciudadEditada) return null;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
      <label htmlFor="nombre">Nombre:</label>
      <input
        id="nombre"
        type="text"
        value={ciudadEditada.nombre}
        onChange={(e) => onChange({ ...ciudadEditada, nombre: e.target.value })}
        required // Campo obligatorio
      />
      
      <label htmlFor="descripcion">Descripción:</label>
      <input
        id="descripcion"
        type="text"
        value={ciudadEditada.descripcion}
        onChange={(e) => onChange({ ...ciudadEditada, descripcion: e.target.value })}
        required // Campo obligatorio
      />
      
      <label htmlFor="pais">País:</label>
      <input
        id="pais"
        type="text"
        value={ciudadEditada.pais}
        onChange={(e) => onChange({ ...ciudadEditada, pais: e.target.value })}
        required // Campo obligatorio
      />
      
      <label htmlFor="latitud">Latitud:</label>
      <input
        id="latitud"
        type="text" // Cambiado a tipo texto
        value={ciudadEditada.latitud}
        onChange={(e) => onChange({ ...ciudadEditada, latitud: e.target.value })}
        required // Campo obligatorio
      />
      
      <label htmlFor="longitud">Longitud:</label>
      <input
        id="longitud"
        type="text" // Cambiado a tipo texto
        value={ciudadEditada.longitud}
        onChange={(e) => onChange({ ...ciudadEditada, longitud: e.target.value })}
        required // Campo obligatorio
      />

      <button type="submit">Guardar cambios</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default CiudadForm;
