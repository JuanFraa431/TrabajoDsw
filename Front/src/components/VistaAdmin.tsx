import React, { useState, useEffect } from 'react';

import ClienteList from './Cliente/ClienteList';

import HotelList from './Hotel/HotelList';
import HotelForm from './Hotel/HotelForm';

import CiudadList from './Ciudad/CiudadList';
import CiudadForm from './Ciudad/CiudadForm';

import { Ciudad } from '../interface/ciudad';
import { Cliente } from '../interface/cliente';
import { Hotel } from '../interface/hotel';

import { fetchEntities, updateEntity, deleteEntity } from '../services/crudService';

import '../styles/VistaAdmin.css';

const VistaAdmin: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [ciudadEditada, setCiudadEditada] = useState<Ciudad | null>(null);
  const [hotelEditado, setHotelEditado] = useState<Hotel | null>(null);

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
    }
  };

  const handleEditar = async (entity: any, endpoint: string) => {
    try {
      await updateEntity(endpoint, entity.id, entity);
      await loadEntities(endpoint, endpoint === '/api/ciudad' ? setCiudades : endpoint === '/api/hotel' ? setHoteles : setClientes);
      setCiudadEditada(null);
      setHotelEditado(null);
      setErrorMessage(null); 
    } catch (error) {
      setErrorMessage('Error al actualizar la entidad. Inténtalo de nuevo.');
    }
  };

  const handleEliminar = async (id: number, endpoint: string, entityName: string) => {
    const confirmacion = window.confirm(`¿Seguro que deseas eliminar el ${entityName} con id ${id}?`);

    if (!confirmacion) {
      return;
    }

    try {
      await deleteEntity(endpoint, id);
      await loadEntities(endpoint, endpoint === '/api/ciudad' ? setCiudades : endpoint === '/api/hotel' ? setHoteles : setClientes);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Error al eliminar la entidad. Inténtalo de nuevo.');
    }
  };

  const renderList = () => {
    switch (selectedCategory) {
      case 'clientes':
        return <ClienteList clientes={clientes} />;
      case 'hoteles':
        return (
          <HotelList 
            hoteles={hoteles} 
            onEdit={(hotel) => setHotelEditado(hotel)}
            onDelete={(hotel) => handleEliminar(hotel.id, '/api/hotel', 'hotel')}
          />
        );
      case 'ciudades':
        return (
          <CiudadList
            ciudades={ciudades}
            onEdit={(ciudad) => setCiudadEditada(ciudad)}
            onDelete={(ciudad) => handleEliminar(ciudad.id, '/api/ciudad', 'ciudad')}
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
      <div>{hotelEditado && (
          <HotelForm
            hotelEditado={hotelEditado}
            onChange={setHotelEditado}
            onCancel={() => setHotelEditado(null)}
            onSave={() => handleEditar(hotelEditado, '/api/hotel')}
          />
        )}
      </div>
      <div>{ciudadEditada && (
          <CiudadForm
            ciudadEditada={ciudadEditada}
            onChange={setCiudadEditada}
            onCancel={() => setCiudadEditada(null)}
            onSave={() => handleEditar(ciudadEditada, '/api/ciudad')}
          />
        )}
      </div>
    </div>
  );
};

export default VistaAdmin;
