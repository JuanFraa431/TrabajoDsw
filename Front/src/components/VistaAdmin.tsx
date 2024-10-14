import React, { useState, useEffect } from 'react';
import ClienteList from './Cliente/ClienteList';
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

  const handleCrearHotel = async () => {
    const nuevoHotel: Hotel = {
      id: 0, // Asumiendo que el ID será generado en el backend
      nombre: '',
      direccion: '',
      descripcion: '',
      telefono: '',
      email: '',
      estrellas: 0,
      id_ciudad: 0, // Esto será seleccionado por el usuario
    };

    setHotelEditado(nuevoHotel); // Establece el nuevo hotel para editar
  };

  const handleCrearCiudad = async () => {
    const nuevaCiudad: Ciudad = {
      id: 0, // Asumiendo que el ID será generado en el backend
      nombre: '',
      descripcion:'', 
      pais: '', 
      latitud:'', 
      longitud:''
      // Agrega otros atributos necesarios para Ciudad
    };

    setCiudadEditada(nuevaCiudad); // Establece la nueva ciudad para editar
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

      {/* Mostrar el botón Crear Ciudad solo si la categoría seleccionada es 'ciudades' */}
      {selectedCategory === 'ciudades' && (
        <button onClick={handleCrearCiudad}>Crear Ciudad</button>
      )}

      {/* Mostrar el botón Crear Hotel solo si la categoría seleccionada es 'hoteles' */}
      {selectedCategory === 'hoteles' && (
        <button onClick={handleCrearHotel}>Crear Hotel</button>
      )}

      <div>
        {hotelEditado && (
          <HotelForm
            hotelEditado={hotelEditado}
            ciudades={ciudades} // Pasamos las ciudades al formulario
            onChange={setHotelEditado}
            onCancel={() => setHotelEditado(null)}
            onSave={async () => {
              await createEntity('/api/hotel', hotelEditado); // Aquí utilizamos POST para crear el hotel
              await loadEntities('/api/hotel', setHoteles); // Recargar los hoteles
              setHotelEditado(null); // Limpiar la edición
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
              await createEntity('/api/ciudad', ciudadEditada); // Aquí utilizamos POST para crear la ciudad
              await loadEntities('/api/ciudad', setCiudades); // Recargar las ciudades
              setCiudadEditada(null); // Limpiar la edición
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VistaAdmin;
