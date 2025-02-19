import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cliente } from '../../interface/cliente';
import '../../styles/Cliente/DetalleCliente.css';
import userIcon from "../../images/user-icon.png";

const DetalleCliente: React.FC = () => {;
  const navigate = useNavigate();
  const cliente = JSON.parse(localStorage.getItem('user') || '{}') as Cliente;

  const handleDarseDeBaja = async () => {
    const confirmacion = window.confirm('¿Está seguro que desea darse de baja?');
    if (confirmacion && cliente) {
      try {
        await axios.delete(`/api/cliente/${cliente.id}`);
        alert('Cliente eliminado con éxito.');
        localStorage.removeItem('user'); // Eliminar cliente de localStorage
        navigate('/'); // Redirigir al home
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

  const handleAdministrarPerfil = () => {
    navigate(`/editar-perfil`, { state: { cliente } });
  };

  if (!cliente) {
    return <div>Cargando...</div>;
  }

  const fecha = new Date(cliente.fecha_nacimiento);
  const dia = String(fecha.getUTCDate()).padStart(2, '0');
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // +1 porque los meses van de 0 a 11
  const anio = fecha.getUTCFullYear();

  const fechaFormateada = `${dia}/${mes}/${anio}`;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-pic">
          <img
            src={cliente && cliente.imagen ? cliente.imagen : userIcon}
            alt="User Icon"
            className="user-icon"
          />
        </div>
        <div className="profile-info">
          <h1>¡Hola, {cliente.nombre ? cliente.nombre : cliente.username}!</h1>
          {cliente.tipo_usuario === 'admin' && (
            <button onClick={() => navigate('/vistaAdmin')} className="btn-admin">
              Administración
            </button>
          )}
          {cliente.tipo_usuario === 'cliente' && (
            <button onClick={handleAdministrarPerfil} className="btn-admin">
              Administrar Perfil
            </button>
          )}
        </div>
      </div>

      <div className="personal-info">
        <p><strong>Nombre:</strong> {cliente.nombre}</p>
        <p><strong>Apellido:</strong> {cliente.apellido}</p>
        <p><strong>DNI:</strong> {cliente.dni}</p>
        <p><strong>Email:</strong> {cliente.email}</p>
        <p><strong>Fecha de Nacimiento:</strong> {fechaFormateada}</p>
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
