import React from 'react';
import { Paquete } from '../../interface/paquete';

interface Props {
  paqueteEditado: Paquete | null;
  onChange: (paquete: Paquete) => void;
  onCancel: () => void;
  onSave: () => void;
}

const ClienteForm: React.FC<Props> = ({ paqueteEditado, onChange, onCancel, onSave }) => {
  if (!paqueteEditado) return null;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
      <label htmlFor="nombre">Nombre:</label>
      <input
        id="nombre"
        type="text"
        value={paqueteEditado.nombre}
        onChange={(e) => onChange({ ...paqueteEditado, nombre: e.target.value })}
        required
      />
      
      <label htmlFor="descripcion">Descripcion:</label>
      <input
        id="descripcion"
        type="text"
        value={paqueteEditado.descripcion}
        onChange={(e) => onChange({ ...paqueteEditado, descripcion: e.target.value })}
        required
      />
      
      <label htmlFor="detalle">Detalle:</label>
      <input
        id="detalle"
        type="text"
        value={paqueteEditado.detalle}
        onChange={(e) => onChange({ ...paqueteEditado, detalle: e.target.value })}
        required
      />
      
      <label htmlFor="precio">Precio:</label>
      <input
        id="precio"
        type="precio"
        value={paqueteEditado.precio}
        onChange={(e) => onChange({ ...paqueteEditado, precio: parseFloat(e.target.value) })}
        required
      />
      
      <label htmlFor="fecha_ini">Fecha de Inicio:</label>
      <input
        id="fecha_ini"
        type="date"
        value={paqueteEditado.fecha_ini ? paqueteEditado.fecha_ini.split('T')[0] : ''}
        onChange={(e) => onChange({ ...paqueteEditado, fecha_ini: e.target.value })}
        required
      />

      <label htmlFor="fecha_fin">Fecha de Finalización:</label>
      <input
        id="fecha_fin"
        type="date"
        value={paqueteEditado.fecha_fin ? paqueteEditado.fecha_fin.split('T')[0] : ''}
        onChange={(e) => onChange({ ...paqueteEditado, fecha_fin: e.target.value })}
        required
      />
      
      <label htmlFor="estado">Estado:</label>
      <select
        id="estado"
        value={paqueteEditado.estado}
        onChange={(e) => onChange({ ...paqueteEditado, estado: parseInt(e.target.value) })}
        required
      >
        <option value="1">Habilitado</option>
        <option value="0">Deshabilitado</option>
      </select>
      
      <label htmlFor="imagen">Imagen:</label>
      <input
        id="imagen"
        type="text"
        value={paqueteEditado.imagen}
        onChange={(e) => onChange({ ...paqueteEditado, imagen: e.target.value })}
        required
      />

      <button type="submit">Guardar cambios</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default ClienteForm;