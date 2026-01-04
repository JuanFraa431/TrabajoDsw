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

  // Helper function to format date without timezone issues
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Add timezone offset to avoid showing previous day
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return localDate.toLocaleDateString();
  };

  const handleEditCliente = (cliente: Cliente) => {
    const fechaNacimiento = cliente.fecha_nacimiento ? new Date(cliente.fecha_nacimiento).toISOString().split('T')[0] : '';

    MySwal.fire({
      title: 'Editar Cliente',
      html: `
        <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" value="${cliente.nombre || ''}" />
        <input id="swal-input-apellido" class="swal2-input" placeholder="Apellido" value="${cliente.apellido || ''}" />
        <input id="swal-input-dni" class="swal2-input" placeholder="DNI" value="${cliente.dni || ''}" />
        <input id="swal-input-email" class="swal2-input" placeholder="Email" type="email" value="${cliente.email || ''}" />
        <input id="swal-input-fecha-nacimiento" class="swal2-input" placeholder="Fecha de Nacimiento" type="date" value="${fechaNacimiento}" />
        <input id="swal-input-username" class="swal2-input" placeholder="Nombre de Usuario" value="${cliente.username || ''}" />
        <input id="swal-input-password" class="swal2-input" placeholder="Contraseña (dejar vacío para mantener actual)" type="password" />
        <select id="swal-input-estado" class="swal2-input">
          <option value="1" ${cliente.estado === 1 ? 'selected' : ''}>Activo</option>
          <option value="0" ${cliente.estado === 0 ? 'selected' : ''}>Inactivo</option>
        </select>
        <select id="swal-input-tipo-usuario" class="swal2-input">
          <option value="cliente" ${cliente.tipo_usuario === 'cliente' ? 'selected' : ''}>Cliente</option>
          <option value="admin" ${cliente.tipo_usuario === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
        <input id="swal-input-imagen" class="swal2-input" placeholder="URL de Imagen" value="${cliente.imagen || ''}" />
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-input-nombre') as HTMLInputElement)?.value;
        const apellido = (document.getElementById('swal-input-apellido') as HTMLInputElement)?.value;
        const dni = (document.getElementById('swal-input-dni') as HTMLInputElement)?.value;
        const email = (document.getElementById('swal-input-email') as HTMLInputElement)?.value;
        const fecha_nacimiento = (document.getElementById('swal-input-fecha-nacimiento') as HTMLInputElement)?.value;
        const username = (document.getElementById('swal-input-username') as HTMLInputElement)?.value;
        const password = (document.getElementById('swal-input-password') as HTMLInputElement)?.value;
        const estado = parseInt((document.getElementById('swal-input-estado') as HTMLSelectElement)?.value);
        const tipo_usuario = (document.getElementById('swal-input-tipo-usuario') as HTMLSelectElement)?.value;
        const imagen = (document.getElementById('swal-input-imagen') as HTMLInputElement)?.value;

        if (!nombre || !apellido || !dni || !email || !username) {
          Swal.showValidationMessage('Nombre, apellido, DNI, email y nombre de usuario son obligatorios');
          return;
        }

        if (email && !/\S+@\S+\.\S+/.test(email)) {
          Swal.showValidationMessage('Por favor ingrese un email válido');
          return;
        }

        if (username && username.includes('@')) {
          Swal.showValidationMessage('El nombre de usuario no puede contener un @');
          return;
        }

        const updateData: any = {
          ...cliente,
          nombre,
          apellido,
          dni,
          email,
          fecha_nacimiento: fecha_nacimiento || null,
          username,
          estado,
          tipo_usuario,
          imagen: imagen || null
        };

        if (password && password.trim() !== '') {
          updateData.password = password;
        }

        return updateData;
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
        <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre *" />
        <input id="swal-input-apellido" class="swal2-input" placeholder="Apellido *" />
        <input id="swal-input-dni" class="swal2-input" placeholder="DNI *" />
        <input id="swal-input-email" class="swal2-input" placeholder="Email *" type="email" />
        <input id="swal-input-fecha-nacimiento" class="swal2-input" placeholder="Fecha de Nacimiento" type="date" />
        <input id="swal-input-username" class="swal2-input" placeholder="Nombre de Usuario *" />
        <input id="swal-input-password" class="swal2-input" placeholder="Contraseña *" type="password" />
        <select id="swal-input-estado" class="swal2-input">
          <option value="1" selected>Activo</option>
          <option value="0">Inactivo</option>
        </select>
        <select id="swal-input-tipo-usuario" class="swal2-input">
          <option value="cliente" selected>Cliente</option>
          <option value="admin">Admin</option>
        </select>
        <input id="swal-input-imagen" class="swal2-input" placeholder="URL de Imagen" />
      `,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-input-nombre') as HTMLInputElement)?.value;
        const apellido = (document.getElementById('swal-input-apellido') as HTMLInputElement)?.value;
        const dni = (document.getElementById('swal-input-dni') as HTMLInputElement)?.value;
        const email = (document.getElementById('swal-input-email') as HTMLInputElement)?.value;
        const fecha_nacimiento = (document.getElementById('swal-input-fecha-nacimiento') as HTMLInputElement)?.value;
        const username = (document.getElementById('swal-input-username') as HTMLInputElement)?.value;
        const password = (document.getElementById('swal-input-password') as HTMLInputElement)?.value;
        const estado = parseInt((document.getElementById('swal-input-estado') as HTMLSelectElement)?.value);
        const tipo_usuario = (document.getElementById('swal-input-tipo-usuario') as HTMLSelectElement)?.value;
        const imagen = (document.getElementById('swal-input-imagen') as HTMLInputElement)?.value;

        if (!nombre || !apellido || !dni || !email || !username || !password) {
          Swal.showValidationMessage('Nombre, apellido, DNI, email, nombre de usuario y contraseña son obligatorios');
          return;
        }

        if (email && !/\S+@\S+\.\S+/.test(email)) {
          Swal.showValidationMessage('Por favor ingrese un email válido');
          return;
        }

        if (username && username.includes('@')) {
          Swal.showValidationMessage('El nombre de usuario no puede contener un @');
          return;
        }

        return {
          nombre,
          apellido,
          dni,
          email,
          fecha_nacimiento: fecha_nacimiento || null,
          username,
          password,
          estado,
          tipo_usuario,
          imagen: imagen || null
        };
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
            <p><strong>DNI:</strong> {cliente.dni}</p>
            <p><strong>Email:</strong> {cliente.email}</p>
            <p><strong>Usuario:</strong> {cliente.username}</p>
            <p><strong>Tipo:</strong> {cliente.tipo_usuario}</p>
            {cliente.fecha_nacimiento && (
              <p><strong>Fecha Nac.:</strong> {formatDate(cliente.fecha_nacimiento)}</p>
            )}
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
