import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cliente } from '../../interface/cliente';
import '../../styles/Cliente/DetalleCliente.css';

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

  // Validamos y formateamos la fecha de nacimiento
  const fechaNacimiento = new Date(cliente.fecha_nacimiento);
  const fechaFormateada = !isNaN(fechaNacimiento.getTime())
    ? fechaNacimiento.toISOString().split('T')[0]
    : 'Fecha inválida';

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-pic">
          <img 
            src={cliente.imagen}
            alt="Perfil" 
          />
        </div>
        <div className="profile-info">
          <h1>¡Hola, {cliente.nombre}!</h1>
          {cliente.tipo_usuario === 'admin' && (
            <button onClick={() => navigate('/vistaAdmin')} className="btn-admin">
              Administración
            </button>
          )}
        </div>
      </div>

      <div className="personal-info">
        <p><strong>Nombre:</strong> {cliente.nombre}</p>
        <p><strong>Apellido:</strong> {cliente.apellido}</p>
        <p><strong>DNI:</strong> {cliente.dni}</p>
        <p><strong>Email:</strong> {cliente.email}</p>
        <p>
          <strong>Fecha de Nacimiento:</strong> {fechaFormateada}
        </p>
        <p><strong>Username:</strong> {cliente.username}</p>
      </div>

      <div className="action-buttons">
        <button onClick={handleDarseDeBaja} className="btn danger">
          Darse De Baja
        </button>
        <button onClick={handleCerrarSesion} className="btn logout">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default DetalleCliente;