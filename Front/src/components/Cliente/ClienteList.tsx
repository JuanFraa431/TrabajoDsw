import React from 'react';
import { Cliente } from '../../interface/cliente';

interface Props {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
}

const ClienteList: React.FC<Props> = ({ clientes, onEdit, onDelete }) => {
  return (
    <ul>
      {clientes.map(cliente => (
        <li key={cliente.id}>
          <h3>{cliente.nombre} {cliente.apellido}</h3>
          <p><strong>DNI:</strong> {cliente.dni}</p>
          <button className="boton-editar" onClick={() => onEdit(cliente)}>Editar</button>
          <button className='boton-eliminar' onClick={() => onDelete(cliente)}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
};

export default ClienteList;
