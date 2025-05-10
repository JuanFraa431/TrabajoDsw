import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


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

const MySwal = withReactContent(Swal);

const handleEditPaquete = (
  paquete: Paquete,
  onEdit: (paquete: Paquete) => void,
  setPaquetes: React.Dispatch<React.SetStateAction<Paquete[]>>
) => {
  let nombre = paquete.nombre;
  let detalle = paquete.detalle;
  let estado = paquete.estado;
  let precio = paquete.precio; // Define precio from paquete
  let fecha_inicio = paquete.fecha_ini; // Extract fecha_ini from paquete
  let fecha_fin = paquete.fecha_fin; // Extract fecha_fin from paquete
  let imagen = paquete.imagen; // Extract imagen from paquete

 MySwal.fire({
  title: 'Editar Paquete',
  html: `
    <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" value="${nombre}" />
    <select id="swal-input-estado" class="swal2-input">
      <option value="activo" ${estado.toString() === 'activo' ? 'selected' : ''}>Activo</option>
      <option value="inactivo" ${estado.toString() === 'inactivo' ? 'selected' : ''}>Inactivo</option>
    </select>
    <input id="swal-input-detalle" class="swal2-input" placeholder="Detalle" value="${detalle}" />
    <input id="swal-input-precio" type="number" class="swal2-input" placeholder="Precio" value="${precio}" />
    <input id="swal-input-fecha-inicio" type="date" class="swal2-input" placeholder="Fecha Inicio" value="${fecha_inicio}" />
    <input id="swal-input-fecha-fin" type="date" class="swal2-input" placeholder="Fecha Fin" value="${fecha_fin}" />
    <input id="swal-input-imagen" class="swal2-input" placeholder="URL de Imagen" value="${imagen}" />
  `,
  showCancelButton: true,
  confirmButtonText: 'Guardar',
  cancelButtonText: 'Cancelar',
  preConfirm: () => {
    const newNombre = (document.getElementById('swal-input-nombre') as HTMLInputElement)?.value;
    const newEstado = (document.getElementById('swal-input-estado') as HTMLSelectElement)?.value;
    const newDetalle = (document.getElementById('swal-input-detalle') as HTMLInputElement)?.value;
    const newPrecio = parseFloat((document.getElementById('swal-input-precio') as HTMLInputElement)?.value);
    const newFechaInicio = (document.getElementById('swal-input-fecha-inicio') as HTMLInputElement)?.value;
    const newFechaFin = (document.getElementById('swal-input-fecha-fin') as HTMLInputElement)?.value;
    const newImagen = (document.getElementById('swal-input-imagen') as HTMLInputElement)?.value;

    if (!newNombre || !newEstado || !newDetalle || isNaN(newPrecio) || !newFechaInicio || !newFechaFin || !newImagen) {
      Swal.showValidationMessage('Todos los campos son obligatorios');
      return;
    }

    return {
      ...paquete,
      nombre: newNombre,
      estado: newEstado,
      detalle: newDetalle,
      precio: newPrecio,
      fecha_inicio: newFechaInicio,
      fecha_fin: newFechaFin,
      imagen: newImagen,
    };
  }
}).then((result) => {
  if (result.isConfirmed && result.value) {
    const updatedPaquete = result.value;
    onEdit(updatedPaquete);
    setPaquetes((prevPaquetes) =>
      prevPaquetes.map((p) => (p.id === updatedPaquete.id ? updatedPaquete : p))
    );
  }
});
};

const PaqueteList: React.FC<PaqueteListProps> = ({ paquetes: initialPaquetes, onEdit, onDelete, onAddEstadia }) => {
  const [paquetes, setPaquetes] = useState<Paquete[]>(initialPaquetes);
  const [hoteles, setHoteles] = useState<{ [key: number]: any }>({});
  const [activePaquete, setActivePaquete] = useState<number | null>(null);
  const [estadiaEditada, setEstadiaEditada] = useState<Estadia | null>(null);

  useEffect(() => {
    setPaquetes(initialPaquetes);
  }, [initialPaquetes]);

  const toggleEstadias = (paqueteId: number, estadias: Estadia[]) => {
    if (activePaquete === paqueteId) {
      setActivePaquete(null);
      return;
    }

    setActivePaquete(paqueteId);
    estadias.forEach((estadia) => {
      if (!hoteles[estadia.id_hotel]) {
        fetchHotel(estadia.id_hotel);
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

    const request = estadiaEditada.id === 0
      ? axios.post('/api/estadia', estadiaEditada)
      : axios.put(`/api/estadia/${estadiaEditada.id}`, estadiaEditada);

    request
      .then((response) => {
        const updatedEstadia = response.data;
        onAddEstadia(updatedEstadia);
      })
      .catch((error) => {
        console.error('Error guardando estadía:', error);
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
            <button onClick={() => handleEditPaquete(paquete, onEdit, setPaquetes)}>Editar</button>
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
                    {hoteles[estadia.id_hotel] ? (
                      <p style={{ textDecoration: 'underline' }}>{hoteles[estadia.id_hotel].nombre}</p>
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
          onCancel={() => setEstadiaEditada(null)}
          onSave={handleSaveEstadia}
        />
      )}
    </div>
  );
};

export default PaqueteList;
