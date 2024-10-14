import React from 'react';
import { Cliente } from '../../interface/cliente';

interface Props {
  clientes: Cliente[];
}

const ClienteList: React.FC<Props> = ({ clientes }) => {
  return (
    <ul>
      {clientes.map(cliente => (
        <li key={cliente.id}>
          <p><strong>Nombre:</strong> {cliente.nombre}</p>
          <p><strong>Apellido:</strong> {cliente.apellido}</p>
          <p><strong>DNI:</strong> {cliente.dni}</p>
          <p><strong>Email:</strong> {cliente.email}</p>
          <p><strong>Fecha de Nacimiento:</strong> {new Date(cliente.fechaNacimiento).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> {cliente.estado}</p>
        </li>
      ))}
    </ul>
  );
};

export default ClienteList;
