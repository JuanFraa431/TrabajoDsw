import React from 'react';
import { Cliente } from '../../interface/cliente';
import '../../styles/Cliente/ClienteList.css';
import '../../styles/List.css';

interface ClienteListProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
}

const ClienteList: React.FC<ClienteListProps> = ({ clientes, onEdit, onDelete }) => {
  return (
    <div className="card-list">
      {clientes.map((cliente) => (
        <div key={cliente.id} className="card">
          <div className="card-content">
            <h3>
              {cliente.nombre} {cliente.apellido}
                {cliente.estado === 1 ? (
                <span className="circulo-verde"></span>
                ) : (
                <span className="circulo-rojo"></span>
                )}
            </h3>
            <p>DNI: {cliente.dni}</p>
          </div>
          <div className="card-actions">
            <button onClick={() => onEdit(cliente)}>Editar</button>
            <button onClick={() => onDelete(cliente)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClienteList;
