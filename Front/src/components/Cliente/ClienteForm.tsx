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
        value={clienteEditado.fecha_nacimiento ? clienteEditado.fecha_nacimiento.split('T')[0] : ''}
        onChange={(e) => onChange({ ...clienteEditado, fecha_nacimiento: e.target.value })}
        required
      />
      
      <label htmlFor="estado">Estado:</label>
      <select
        id="estado"
        value={clienteEditado.estado}
        onChange={(e) => onChange({ ...clienteEditado, estado: parseInt(e.target.value) })}
        required
      >
        <option value="1">Habilitado</option>
        <option value="0">Deshabilitado</option>
      </select>
      <label htmlFor="username">Username:</label>
      <input
        id="username"
        type="text"
        value={clienteEditado.username}
        onChange={(e) => onChange({ ...clienteEditado, username: e.target.value })}
        required
      />
      
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"
        onChange={(e) => onChange({ ...clienteEditado, password: e.target.value })}
        required
      />

      <label htmlFor="tipo_usuario">Tipo de Usuario:</label>
      <select
        id="tipo_usuario"
        value={clienteEditado.tipo_usuario}
        onChange={(e) => onChange({ ...clienteEditado, tipo_usuario: e.target.value })}
        required
      >
        <option value="admin">Admin</option>
        <option value="cliente">Cliente</option>
      </select>

      <button type="submit">Guardar cambios</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default ClienteForm;
