import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cliente } from '../../interface/cliente';

const DetalleCliente: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cliente = location.state?.cliente as Cliente;

  const handleDarseDeBaja = async () => {
    const confirmacion = window.confirm('¿Está seguro que desea darse de baja?');
    if (confirmacion) {
      try {
        await axios.delete(`/api/cliente/${cliente.id}`);
        alert('Cliente eliminado con éxito.');
        navigate('/');
      } catch (error) {
        alert('Hubo un error al intentar eliminar el cliente.');
        console.error(error);
      }
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/');
  };

  return (
    <div>
      <h1>Detalle del Cliente</h1>
      <p><strong>Nombre:</strong> {cliente.nombre}</p>
      <p><strong>Apellido:</strong> {cliente.apellido}</p>
      <p><strong>DNI:</strong> {cliente.dni}</p>
      <p><strong>Email:</strong> {cliente.email}</p>
      <p><strong>Fecha de Nacimiento:</strong> {cliente.fecha_nacimiento}</p>
      <p><strong>Username:</strong> {cliente.username}</p>
      <div>
        <button onClick={handleDarseDeBaja}>
          Darse De Baja
        </button>
      </div>
      <div>
        <button onClick={handleCerrarSesion}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default DetalleCliente;
