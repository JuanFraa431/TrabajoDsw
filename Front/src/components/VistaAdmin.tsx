import React, { useState, useEffect } from 'react';
import '../styles/VistaAdmin.css';
import { useNavigate } from 'react-router-dom';

import PaqueteList from './Paquete/PaqueteList';

import ClienteList from './Cliente/ClienteList';

import HotelList from './Hotel/HotelList';

import CiudadList from './Ciudad/CiudadList';


import ExcursionList from './Excursion/ExcursionList';


import { Ciudad } from '../interface/ciudad';
import { Cliente } from '../interface/cliente';
import { Hotel } from '../interface/hotel';
import { Excursion } from '../interface/excursion';
import { Paquete } from '../interface/paquete';

import { fetchEntities, updateEntity, deleteEntity, createEntity } from '../services/crudService';

import '../styles/VistaAdmin.css';

const VistaAdmin: React.FC = () => {

  const navigate = useNavigate();
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.tipo_usuario !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [excursiones, setExcursiones] = useState<Excursion[]>([]);
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [ciudadEditada, setCiudadEditada] = useState<Ciudad | null>(null);
  const [hotelEditado, setHotelEditado] = useState<Hotel | null>(null);
  const [clienteEditado, setClienteEditado] = useState<Cliente | null>(null);
  const [excursionEditada, setExcursionEditada] = useState<Excursion | null>(null);
  const [paqueteEditado, setPaqueteEditado] = useState<Paquete | null>(null);

  useEffect(() => {
    loadEntities('/api/cliente', setClientes);
    loadEntities('/api/hotel', setHoteles);
    loadEntities('/api/ciudad', setCiudades);
    loadEntities('/api/excursion', setExcursiones);
    loadEntities('/api/paquete', setPaquetes);
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
      case 'excursiones':
        return (
          <ExcursionList
            excursiones={excursiones}
            onEdit={(excursion) => setExcursionEditada(excursion)}
            onDelete={(excursion) => handleEliminar(excursion.id, '/api/excursion', 'excursión', setExcursiones)}
            onCreate={(excursion) => setExcursionEditada(excursion)}
          />
        );
      case 'paquetes':
        return (
          <PaqueteList
            paquetes={paquetes}
            onEdit={(paquete) => setPaqueteEditado(paquete)}
            onDelete={(paquete) => handleEliminar(paquete.id, '/api/paquete', 'paquete', setPaquetes)}
            onAddEstadia={(newEstadia) => {
              console.log('Agregar estadía:', newEstadia);
            }}
          />
        );
      default:
        return <div className='mensaje-noEncontro'><p>Selecciona una categoría para ver los registros.</p></div>;
    }
  };

  return (
    <div className="vista-admin">
      <h1>Vista Admin</h1>
      <div className="category-buttons">
        <button onClick={() => setSelectedCategory('clientes')}>Clientes</button>
        <button onClick={() => setSelectedCategory('hoteles')}>Hoteles</button>
        <button onClick={() => setSelectedCategory('ciudades')}>Ciudades</button>
        <button onClick={() => setSelectedCategory('excursiones')}>Excursiones</button>
        <button onClick={() => setSelectedCategory('paquetes')}>Paquetes</button>
      </div>
      <div>{errorMessage && <p className="error-message">{errorMessage}</p>}</div>
      <div>{renderList()}</div>

      {selectedCategory === 'ciudades' && (
        <button className='boton-crear' onClick={() => setCiudadEditada({ id: 0, nombre: '', descripcion: '', pais: '', latitud: '', longitud: '' })}>
          Crear Ciudad
        </button>
      )}

      {selectedCategory === 'hoteles' && (
        <button className='boton-crear' onClick={() => setHotelEditado({ id: 0, nombre: '', direccion: '', descripcion: '', telefono: '', email: '', estrellas: 0, precio_x_dia: 0, id_ciudad: 0 })}>
          Crear Hotel
        </button>
      )}

      {selectedCategory === 'clientes' && (
        <button className='boton-crear' onClick={() => setClienteEditado({ id: 0, nombre: '', apellido: '', dni: '', email: '', fecha_nacimiento: '', estado: 1, username: '', password: '', tipo_usuario: 'cliente', imagen: '' })}>
          Crear Cliente
        </button>
      )}

      {selectedCategory === 'excursiones' && (
        <button className='boton-crear' onClick={() => setExcursionEditada({ id: 0, nombre: '', descripcion: '', detalle: '', tipo: '', nro_personas_max: 0, nombre_empresa: '', mail_empresa: '', precio: 0, imagen: '' })}>
          Crear Excursión
        </button>
      )}

      {selectedCategory === 'paquetes' && (
        <button className='boton-crear' onClick={() => setPaqueteEditado({ id: 0, estado: 1, nombre: '', descripcion: '', detalle: '', precio: 0, fecha_ini: '', fecha_fin: '', imagen: '', comentarios: [], estadias: [], paqueteExcursiones: [] })}>
          Crear Paquete
        </button>
      )}
    </div>
  );
};

export default VistaAdmin;
