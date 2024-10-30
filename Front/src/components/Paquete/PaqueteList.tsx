import React, { useState } from 'react';
import axios from 'axios';
import { Paquete } from '../../interface/paquete';
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

      // Fetch hotel data for each estadia
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
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaqueteList;
