import React, { useEffect } from 'react';
import { Excursion } from '../../interface/excursion';
import { Ciudad } from '../../interface/ciudad';

interface Props {
  excursionEditada: Excursion | null;
  ciudades: Ciudad[];
  onChange: (excursion: Excursion) => void;
  onCancel: () => void;
  onSave: () => void;
}

const ExcursionForm: React.FC<Props> = ({ excursionEditada, ciudades, onChange, onCancel, onSave }) => {
  if (!excursionEditada) return null;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
      <label htmlFor="nombre">Nombre:</label>
      <input
        id="nombre"
        type="text"
        value={excursionEditada.nombre}
        onChange={(e) => onChange({ ...excursionEditada, nombre: e.target.value })}
      />
      <label htmlFor="descripcion">Descripción:</label>
      <input
        id="descripcion"
        type="text"
        value={excursionEditada.descripcion}
        onChange={(e) => onChange({ ...excursionEditada, descripcion: e.target.value })}
      />
      <label htmlFor="tipo">Tipo:</label>
      <input
        id="tipo"
        type="text"
        value={excursionEditada.tipo}
        onChange={(e) => onChange({ ...excursionEditada, tipo: e.target.value })}
      />
      <label htmlFor="horario">Horario:</label>
      <input
        id="horario"
        type="time"
        value={excursionEditada.horario}
        onChange={(e) => onChange({ ...excursionEditada, horario: e.target.value })}
      />
      <label htmlFor="nro_personas_max">Maximo de personas:</label>
      <input
        id="nro_personas_max"
        type="number"
        value={excursionEditada.nro_personas_max}
        onChange={(e) => onChange({ ...excursionEditada, nro_personas_max: parseInt(e.target.value, 10) })}
      />
      <label htmlFor="nombre_empresa">Nombre empresa:</label>
      <input
        id="nombre_empresa"
        type="text"
        value={excursionEditada.nombre_empresa}
        onChange={(e) => onChange({ ...excursionEditada, nombre_empresa: e.target.value })}
      />
      <label htmlFor="mail_empresa">Mail empresa:</label>
      <input
        id="mail_empresa"
        type="email"
        value={excursionEditada.mail_empresa}
        onChange={(e) => onChange({ ...excursionEditada, mail_empresa: e.target.value })}
      />
      <label htmlFor="precio">Precio:</label>
      <input
        id="precio"
        type="number"
        value={excursionEditada.precio}
        onChange={(e) => onChange({ ...excursionEditada, precio: parseInt(e.target.value, 10) })}
      />

      <label htmlFor="id_ciudad">Ciudad:</label>
      <select
        id="id_ciudad"
        value={excursionEditada.id_ciudad}
        onChange={(e) => onChange({ ...excursionEditada, id_ciudad: parseInt(e.target.value, 10) })}
      >
        <option value="">Selecciona una ciudad</option> {/* Opción vacía por defecto */}
        {ciudades.map((ciudad) => (
          <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
        ))}
      </select>
      <button type="submit">Guardar cambios</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default ExcursionForm;
