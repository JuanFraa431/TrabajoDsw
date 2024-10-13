import React, { useState, useEffect } from 'react';
import axios from 'axios';


import { Ciudad } from '../interface/ciudad';
import { Cliente } from '../interface/cliente';
import { Hotel } from '../interface/hotel';


const VistaAdmin: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    
    axios.get('/api/cliente')
      .then(response => setClientes(response.data))
      .catch(error => console.error('Error fetching clientes:', error));

    axios.get('/api/hotel')
      .then(response => setHoteles(response.data))
      .catch(error => console.error('Error fetching hoteles:', error));

    axios.get('/api/ciudad')
      .then(response => setCiudades(response.data))
      .catch(error => console.error('Error fetching ciudades:', error));

  }, []);

  const renderList = () => {
  switch (selectedCategory) {
    case 'clientes':
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
    case 'hoteles':
      return (
        <ul>
          {hoteles.map(hotel => (
            <li key={hotel.id}>
              <p><strong>Nombre:</strong> {hotel.nombre}</p>
              <p><strong>Dirección:</strong> {hotel.direccion}</p>
              <p><strong>Descripción:</strong> {hotel.descripcion}</p>
              <p><strong>Teléfono:</strong> {hotel.telefono}</p>
              <p><strong>Email:</strong> {hotel.email}</p>
              <p><strong>Estrellas:</strong> {hotel.estrellas}</p>
              <p><strong>ID Ciudad:</strong> {hotel.id_ciudad}</p>
            </li>
          ))}
        </ul>
      );
    case 'ciudades':
      return (
        <ul>
          {ciudades.map(ciudad => (
            <div className="ciudad-card" key={ciudad.id}>
              <div className="hotel-info">
                  <h3>{ciudad.nombre}</h3>
                  <p><strong>Descripcion:</strong> {ciudad.descripcion}</p>
                  <p><strong>Pais:</strong> {ciudad.pais}</p>
                  <p><strong>Latitud:</strong> {ciudad.latitud}</p>
                  <p><strong>Longitud:</strong> {ciudad.longitud}</p>
                  <button className='boton-editar'>Editar</button>
                  <button className='boton-eliminar'>Eliminar</button>
              </div>
          </div>
          ))}
        </ul>
      );
    default:
      return <p>Selecciona una categoría para ver los registros.</p>;
  }
};


  return (
    <div>
      <h1>Vista Admin</h1>
      <div>
        <button onClick={() => setSelectedCategory('clientes')}>Clientes</button>
        <button onClick={() => setSelectedCategory('hoteles')}>Hoteles</button>
        <button onClick={() => setSelectedCategory('ciudades')}>Ciudades</button>
      </div>
      <div>{renderList()}</div>
    </div>
  );
};

export default VistaAdmin;