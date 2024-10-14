import React, { useState, useEffect } from 'react';

import ClienteList from './Cliente/ClienteList';
import ClienteForm from './Cliente/ClienteForm';

import HotelList from './Hotel/HotelList';
import HotelForm from './Hotel/HotelForm';

import CiudadList from './Ciudad/CiudadList';
import CiudadForm from './Ciudad/CiudadForm';

import { Ciudad } from '../interface/ciudad';
import { Cliente } from '../interface/cliente';
import { Hotel } from '../interface/hotel';

import { fetchEntities, updateEntity, deleteEntity, createEntity } from '../services/crudService';

import '../styles/VistaAdmin.css';

const VistaAdmin: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [ciudadEditada, setCiudadEditada] = useState<Ciudad | null>(null);
  const [hotelEditado, setHotelEditado] = useState<Hotel | null>(null);
  const [clienteEditado, setClienteEditado] = useState<Cliente | null>(null);

  useEffect(() => {
    loadEntities('/api/cliente', setClientes);
    loadEntities('/api/hotel', setHoteles);
    loadEntities('/api/ciudad', setCiudades);
  }, []);

  const loadEntities = async (endpoint: string, setState: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      const data = await fetchEntities(endpoint);
      setState(data);
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      setErrorMessage('Error al cargar los datos.');
    }
  };

  const handleCrear = async (entity: any, endpoint: string, setState: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      await createEntity(endpoint, entity);
      await loadEntities(endpoint, setState);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Error al crear la entidad.');
    }
  };

  const handleEditar = async (entity: any, endpoint: string, setState: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      await updateEntity(endpoint, entity.id, entity);
      await loadEntities(endpoint, setState);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Error al actualizar la entidad.');
    }
  };

  const handleEliminar = async (id: number, endpoint: string, entityName: string, setState: React.Dispatch<React.SetStateAction<any[]>>) => {
    const confirmacion = window.confirm(`¿Seguro que deseas eliminar el ${entityName} con id ${id}?`);

    if (!confirmacion) {
      return;
    }

    try {
      await deleteEntity(endpoint, id);
      await loadEntities(endpoint, setState);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Error al eliminar la entidad.');
    }
  };

  const renderList = () => {
    switch (selectedCategory) {
      case 'clientes':
        return (
          <ClienteList 
            clientes={clientes} 
            onEdit={(cliente) => setClienteEditado(cliente)}
            onDelete={(cliente) => handleEliminar(cliente.id, '/api/cliente', 'cliente', setClientes)}
          />
        );
        case 'hoteles':
        return (
          <HotelList 
          hoteles={hoteles} 
            onEdit={(hotel) => setHotelEditado(hotel)}
            onDelete={(hotel) => handleEliminar(hotel.id, '/api/hotel', 'hotel', setHoteles)}
          />
        );
      case 'ciudades':
        return (
          <CiudadList
            ciudades={ciudades}
            onEdit={(ciudad) => setCiudadEditada(ciudad)}
            onDelete={(ciudad) => handleEliminar(ciudad.id, '/api/ciudad', 'ciudad', setCiudades)}
          />
        );
      default:
        return <p>Selecciona una categoría para ver los registros.</p>;
    }
  };

  return (
    <div className="vista-admin">
      <h1>Vista Admin</h1>
      <div className="category-buttons">
        <button onClick={() => setSelectedCategory('clientes')}>Clientes</button>
        <button onClick={() => setSelectedCategory('hoteles')}>Hoteles</button>
        <button onClick={() => setSelectedCategory('ciudades')}>Ciudades</button>
      </div>
      <div>{errorMessage && <p className="error-message">{errorMessage}</p>}</div>
      <div>{renderList()}</div>

      {selectedCategory === 'ciudades' && (
        <button onClick={() => setCiudadEditada({ id: 0, nombre: '', descripcion: '', pais: '', latitud: '', longitud: '' })}>
          Crear Ciudad
        </button>
      )}

      {selectedCategory === 'hoteles' && (
        <button onClick={() => setHotelEditado({ id: 0, nombre: '', direccion: '', descripcion: '', telefono: '', email: '', estrellas: 0, id_ciudad: 0 })}>
          Crear Hotel
        </button>
      )}

      {selectedCategory === 'clientes' && (
      <button onClick={() => setClienteEditado({ id: 0, nombre: '', apellido: '', dni: '', email: '', fecha_nacimiento: '', estado: '' })}>
        Crear Cliente
      </button>
)}

      <div>
        {hotelEditado && (
          <HotelForm
            hotelEditado={hotelEditado}
            ciudades={ciudades}
            onChange={setHotelEditado}
            onCancel={() => setHotelEditado(null)}
            onSave={async () => {
              if (hotelEditado.id === 0) {
                await handleCrear(hotelEditado, '/api/hotel', setHoteles);
              } else {
                await handleEditar(hotelEditado, '/api/hotel', setHoteles);
              }
              setHotelEditado(null);
            }}
          />
        )}
      </div>
      
      <div>
        {ciudadEditada && (
          <CiudadForm
            ciudadEditada={ciudadEditada}
            onChange={setCiudadEditada}
            onCancel={() => setCiudadEditada(null)}
            onSave={async () => {
              if (ciudadEditada.id === 0) {
                await handleCrear(ciudadEditada, '/api/ciudad', setCiudades);
              } else {
                await handleEditar(ciudadEditada, '/api/ciudad', setCiudades);
              }
              setCiudadEditada(null);
            }}
          />
        )}
      </div>
      <div>
        {clienteEditado && (
          <ClienteForm
            clienteEditado={clienteEditado}
            onChange={setClienteEditado}
            onCancel={() => setClienteEditado(null)}
            onSave={async () => {
              if (clienteEditado.id === 0) {
                await handleCrear(clienteEditado, '/api/cliente', setClientes);
              } else {
                await handleEditar(clienteEditado, '/api/cliente', setClientes);
              }
              setClienteEditado(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VistaAdmin;
