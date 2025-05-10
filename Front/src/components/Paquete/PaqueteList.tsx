import React, { useState, useEffect } from 'react';
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
  onAddEstadia: (newEstadia: any) => void;
}

const PaqueteList: React.FC<PaqueteListProps> = ({
  paquetes: initialPaquetes,
  onEdit,
  onDelete,
  onAddEstadia,
}) => {
  const [paquetes, setPaquetes] = useState<Paquete[]>(initialPaquetes);
  const [hoteles, setHoteles] = useState<{ [key: number]: any }>({});
  const [activePaquete, setActivePaquete] = useState<number | null>(null);
  const [estadiaEditada, setEstadiaEditada] = useState<Estadia | null>(null);

  useEffect(() => {
    setPaquetes(initialPaquetes);
  }, [initialPaquetes]);

  const toggleEstadias = (paqueteId: number, estadias: any[]) => {
    if (activePaquete === paqueteId) {
      setActivePaquete(null);
      return;
    }

    setActivePaquete(paqueteId);
    estadias.forEach((estadia) => {
      if (!hoteles[estadia.hotel]) {
        fetchHotel(estadia.hotel);
      }
    });
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
    console.log('✏️ Editar estadía:', estadia);
    setEstadiaEditada({
      id: estadia.id,
      id_hotel: estadia.hotel,
      id_paquete: estadia.paquete,
      fecha_ini: estadia.fecha_ini.split('T')[0],
      fecha_fin: estadia.fecha_fin.split('T')[0],
      precio_x_dia: estadia.precio_x_dia,
    });
  };

  const onDeleteEstadia = (estadia: any) => {
    console.log('🗑️ Eliminar estadía:', estadia);
    if (window.confirm('¿Estás seguro que deseas eliminar la estadía?')) {
      axios.delete(`/api/estadia/${estadia.id}`)
        .then(() => {
          console.log('✅ Estadía eliminada');
          setPaquetes((prevPaquetes) =>
            prevPaquetes.map((paquete) =>
              paquete.id === estadia.paquete
                ? { ...paquete, estadias: paquete.estadias.filter((e) => e.id !== estadia.id) }
                : paquete
            )
          );
        })
        .catch((error) => console.error('❌ Error eliminando estadía:', error));
    }
  };

  const handleAddEstadia = (id_paquete: number) => {
    console.log('➕ Agregar nueva estadía para paquete:', id_paquete);
    setEstadiaEditada({
      id: 0,
      id_hotel: 0,
      id_paquete,
      fecha_ini: '',
      fecha_fin: '',
      precio_x_dia: 0,
    });
  };

  const handleSaveEstadia = () => {
    if (!estadiaEditada) return;
    console.log('💾 Guardando estadía:', JSON.stringify(estadiaEditada, null, 2));

    const request = estadiaEditada.id === 0
      ? axios.post('/api/estadia', estadiaEditada)
      : axios.put(`/api/estadia/${estadiaEditada.id}`, estadiaEditada);

    request
      .then((response) => {
        const updatedEstadia = response.data;
        console.log('✅ Estadía guardada:', updatedEstadia);

        // Llamar a la función onAddEstadia para actualizar el estado en el componente padre
        onAddEstadia(updatedEstadia);
      })
      .catch((error) => {
        console.error('❌ Error guardando estadía:', error);
      });

    setEstadiaEditada(null);
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
            <button onClick={() => toggleEstadias(paquete.id, paquete.estadias)}>
              {activePaquete === paquete.id ? 'Ocultar Estadías' : 'Ver Estadías'}
            </button>
          </div>
          {activePaquete === paquete.id && (
            <div className="estadias-list">
              <h4>Estadías:</h4>
              <ul>
                {paquete.estadias.map((estadia: any) => (
                  <li key={estadia.id}>
                    {hoteles[estadia.hotel] ? (
                      <p style={{ textDecoration: 'underline' }}>{hoteles[estadia.hotel].nombre}</p>
                    ) : (
                      <p>Cargando datos del hotel...</p>
                    )}
                    <p>Fecha Inicio: {new Date(estadia.fecha_ini).toLocaleDateString('es-ES')}</p>
                    <p>Fecha Fin: {new Date(estadia.fecha_fin).toLocaleDateString('es-ES')}</p>
                    <p>Precio por Día: ${estadia.precio_x_dia}</p>
                    <div className="card-actions">
                      <button onClick={() => onEditEstadia(estadia)}>Editar</button>
                      <button onClick={() => onDeleteEstadia(estadia)}>Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="boton-crear" onClick={() => handleAddEstadia(paquete.id)}>Agregar Estadia</button>
            </div>
          )}
        </div>
      ))}
      {estadiaEditada && (
        <EstadiaForm
          estadiaEditada={estadiaEditada}
          onChange={setEstadiaEditada}
          onCancel={() => {
            console.log('❌ Cancelar edición de estadía');
            setEstadiaEditada(null);
          }}
          onSave={handleSaveEstadia}
        />
      )}
    </div>
  );
};

export default PaqueteList;
