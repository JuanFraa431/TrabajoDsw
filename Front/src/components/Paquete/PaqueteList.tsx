import React, { useState } from 'react';
import axios from 'axios';

import { Paquete } from '../../interface/paquete';
import { Estadia } from '../../interface/estadia';

import EstadiaForm from '../Estadia/EstadiaForm';

import '../../styles/List.css';
import '../../styles/Cliente/ClienteList.css';

interface PaqueteListProps {
  paquetes: Paquete[];
  onEdit: (paquete: Paquete) => void;
  onDelete: (paquete: Paquete) => void;
}

const PaqueteList: React.FC<PaqueteListProps> = ({ paquetes, onEdit, onDelete }) => {
  const [estadias, setEstadias] = useState<{ [key: number]: any[] }>({});
  const [hoteles, setHoteles] = useState<{ [key: number]: any }>({});
  const [activePaquete, setActivePaquete] = useState<number | null>(null);
  const [estadiaEditada, setEstadiaEditada] = useState<Estadia | null>(null);

  const fetchEstadias = async (paqueteId: number) => {
    if (activePaquete === paqueteId) {
      setActivePaquete(null);
      return;
    }

    try {
      const response = await axios.get(`/api/estadia/paquete/${paqueteId}`);
      const estadiasData = response.data;

      setEstadias((prevEstadias) => ({ ...prevEstadias, [paqueteId]: estadiasData }));
      setActivePaquete(paqueteId);

      estadiasData.forEach((estadia: any) => {
        if (!hoteles[estadia.id_hotel]) {
          fetchHotel(estadia.id_hotel);
        }
      });
    } catch (error) {
      console.error('Error fetching estadias:', error);
    }
  };

  const fetchHotel = async (hotelId: number) => {
    try {
      const response = await axios.get(`/api/hotel/${hotelId}`);
      setHoteles((prevHoteles) => ({ ...prevHoteles, [hotelId]: response.data }));
    } catch (error) {
      console.error('Error fetching hotel:', error);
    }
  };

  const onEditEstadia = (estadia: any) => {
    setEstadiaEditada({
      id: estadia.id,
      id_hotel: estadia.id_hotel,
      id_paquete: estadia.id_paquete,
      fecha_ini: estadia.fecha_ini.split('T')[0],
      fecha_fin: estadia.fecha_fin.split('T')[0],
      precio_x_dia: estadia.precio_x_dia,
    });
  };

  const onDeleteEstadia = (estadia: any) => {
    if (window.confirm('Estas seguro que deseas eliminar la estadia?')) {
      axios.delete(`/api/estadia/${estadia.id}`)
        .catch((error) => console.error('Error en la solicitud DELETE:', error));
    }
  };

  const onAddEstadia = (id_paquete: number) => {
    setEstadiaEditada({
      id: 0,
      id_hotel: 0,
      id_paquete,
      fecha_ini: '',
      fecha_fin: '',
      precio_x_dia: 0,
    });
  };

  return (
    <div className="card-list">
      {paquetes.map((paquete) => (
        <div key={paquete.id} className="card">
          <div className="card-content">
            <h3>
              {paquete.nombre}
              {paquete.estado === 1 ? (
                <span className="circulo-verde"></span>
              ) : (
                <span className="circulo-rojo"></span>
              )}
            </h3>
            <p>Detalle: {paquete.detalle}</p>
          </div>
          <div className="card-actions">
            <button onClick={() => onEdit(paquete)}>Editar</button>
            <button onClick={() => onDelete(paquete)}>Eliminar</button>
            <button onClick={() => fetchEstadias(paquete.id)}>
              {activePaquete === paquete.id ? 'Ocultar Estadias' : 'Ver Estadias'}
            </button>
          </div>
          {activePaquete === paquete.id && estadias[paquete.id] && (
            <div className="estadias-list">
              <h4>Estadias:</h4>
              <ul>
                {estadias[paquete.id].map((estadia: any) => (
                  <li key={estadia.id}>
                    {hoteles[estadia.id_hotel] ? (
                      <>
                        <p style={{ textDecoration: 'underline' }}>{hoteles[estadia.id_hotel].nombre}</p>
                      </>
                    ) : (
                      <p>Cargando datos del hotel...</p>
                    )}
                    <p>Fecha Inicio: {new Date(estadia.fecha_ini).toLocaleDateString('es-ES')}</p>
                    <p>Fecha Fin: {new Date(estadia.fecha_fin).toLocaleDateString('es-ES')}</p>
                    <p>Precio por Día: ${estadia.precio_x_dia}</p>
                    <div className='card-actions'>
                      <button onClick={() => onEditEstadia(estadia)}>Editar</button>
                      <button onClick={() => onDeleteEstadia(estadia)}>Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
              <button className='boton-crear' onClick={() => onAddEstadia(paquete.id)}>Agregar Estadia</button>
            </div>
          )}
        </div>
      ))}
      <div>
        {estadiaEditada && (
          <EstadiaForm
            estadiaEditada={estadiaEditada}
            onChange={setEstadiaEditada}
            onCancel={() => setEstadiaEditada(null)}
            onSave={() => {
              if (estadiaEditada.id === 0) {
                console.log('Estadia nueva:', estadiaEditada);
                axios.post('/api/estadia', estadiaEditada)
                  .catch((error) => console.error('Error en la solicitud POST:', error));
              } else {
                axios.put(`/api/estadia/${estadiaEditada.id}`, estadiaEditada)
                  .catch((error) => console.error('Error en la solicitud PUT:', error));
              }
              setEstadiaEditada(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PaqueteList;