import React, { useState, useEffect } from 'react';
import { Cliente } from '../../interface/cliente';
import '../../styles/Cliente/ClienteList.css';
import '../../styles/List.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

interface ClienteListProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
}

const ClienteList: React.FC<ClienteListProps> = ({ clientes: initialClientes, onEdit, onDelete }) => {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    setClientes(initialClientes);
  }, [initialClientes]);

  const handleEditCliente = (cliente: Cliente) => {
    MySwal.fire({
      title: 'Editar Cliente',
      html: `
        <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" value="${cliente.nombre}" />
        <input id="swal-input-apellido" class="swal2-input" placeholder="Apellido" value="${cliente.apellido}" />
        <input id="swal-input-dni" class="swal2-input" placeholder="DNI" value="${cliente.dni}" />
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-input-nombre') as HTMLInputElement)?.value;
        const apellido = (document.getElementById('swal-input-apellido') as HTMLInputElement)?.value;
        const dni = (document.getElementById('swal-input-dni') as HTMLInputElement)?.value;
        if (!nombre || !apellido || !dni) {
          Swal.showValidationMessage('Todos los campos son obligatorios y deben ser válidos');
          return;
        }
        return { ...cliente, nombre, apellido, dni };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          await axios.put(`/api/cliente/${cliente.id}`, result.value);
          setClientes((prev) => prev.map((c) => (c.id === cliente.id ? result.value : c)));
          onEdit(result.value);
          Swal.fire('Guardado', 'El cliente fue actualizado correctamente.', 'success');
        } catch (error: any) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo actualizar el cliente', 'error');
        }
      }
    });
  };

  const handleDeleteCliente = (cliente: Cliente) => {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar el cliente?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/cliente/${cliente.id}`);
          setClientes((prev) => prev.filter((c) => c.id !== cliente.id));
          onDelete(cliente);
          Swal.fire('Eliminado', 'El cliente fue eliminado correctamente.', 'success');
        } catch (error: any) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo eliminar el cliente', 'error');
        }
      }
    });
  };

  const handleCreateCliente = () => {
    MySwal.fire({
      title: 'Crear Cliente',
      html: `
        <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" />
        <input id="swal-input-apellido" class="swal2-input" placeholder="Apellido" />
        <input id="swal-input-dni" class="swal2-input" placeholder="DNI" />
      `,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-input-nombre') as HTMLInputElement)?.value;
        const apellido = (document.getElementById('swal-input-apellido') as HTMLInputElement)?.value;
        const dni = (document.getElementById('swal-input-dni') as HTMLInputElement)?.value;
        if (!nombre || !apellido || !dni) {
          Swal.showValidationMessage('Todos los campos son obligatorios y deben ser válidos');
          return;
        }
        return { nombre, apellido, dni };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const response = await axios.post('/api/cliente', result.value);
          setClientes((prev) => [...prev, response.data.data || response.data]);
          Swal.fire('Creado', 'El cliente fue creado correctamente.', 'success');
        } catch (error: any) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo crear el cliente', 'error');
        }
      }
    });
  };

  return (
    <div className="card-list">
      <button className="boton-crear" onClick={handleCreateCliente}>
        Crear Cliente
      </button>
      {clientes.map((cliente) => (
        <div key={cliente.id} className="card">
          <div className="card-content">
            <h3>
              {cliente.nombre} {cliente.apellido}
              {cliente.estado === 1 ? (
                <span className="circulo-verde"></span>
              ) : (
                <span className="circulo-roja"></span>
              )}
            </h3>
            <p>DNI: {cliente.dni}</p>
          </div>
          <div className="card-actions">
            <button onClick={() => handleEditCliente(cliente)}>Editar</button>
            <button onClick={() => handleDeleteCliente(cliente)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClienteList;
