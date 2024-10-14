import React from 'react';
import { Cliente } from '../../interface/cliente';

interface Props {
  clienteEditado: Cliente | null;
  onChange: (cliente: Cliente) => void;
  onCancel: () => void;
  onSave: () => void;
}

const ClienteForm: React.FC<Props> = ({ clienteEditado, onChange, onCancel, onSave }) => {
  if (!clienteEditado) return null;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
      <label htmlFor="nombre">Nombre:</label>
      <input
        id="nombre"
        type="text"
        value={clienteEditado.nombre}
        onChange={(e) => onChange({ ...clienteEditado, nombre: e.target.value })}
        required
      />
      
      <label htmlFor="apellido">Apellido:</label>
      <input
        id="apellido"
        type="text"
        value={clienteEditado.apellido}
        onChange={(e) => onChange({ ...clienteEditado, apellido: e.target.value })}
        required
      />
      
      <label htmlFor="dni">DNI:</label>
      <input
        id="dni"
        type="text"
        value={clienteEditado.dni}
        onChange={(e) => onChange({ ...clienteEditado, dni: e.target.value })}
        required
      />
      
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        type="email"
        value={clienteEditado.email}
        onChange={(e) => onChange({ ...clienteEditado, email: e.target.value })}
        required
      />
      
      <label htmlFor="fecha_nacimiento">Fecha de Nacimiento:</label>
      <input
        id="fecha_nacimiento"
        type="date"
        value={clienteEditado.fecha_nacimiento}
        onChange={(e) => onChange({ ...clienteEditado, fecha_nacimiento: e.target.value })}
        required
      />
      
      <label htmlFor="estado">Estado:</label>
      <input
        id="estado"
        type="text"
        value={clienteEditado.estado}
        onChange={(e) => onChange({ ...clienteEditado, estado: e.target.value })}
        required
      />

      <button type="submit">Guardar cambios</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default ClienteForm;
