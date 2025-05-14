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
  let precio = paquete.precio;
  let fecha_inicio = new Date(paquete.fecha_ini).toISOString().split('T')[0];
  let fecha_fin = new Date(paquete.fecha_fin).toISOString().split('T')[0];
  let imagen = paquete.imagen;

  MySwal.fire({
    title: 'Editar Paquete',
    html: `
      <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" value="${nombre}" />
      <select id="swal-input-estado" class="swal2-input">
        <option value="1" ${estado === 1 ? 'selected' : ''}>Activo</option>
        <option value="0" ${estado === 0 ? 'selected' : ''}>Inactivo</option>
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
      const newEstado = parseInt((document.getElementById('swal-input-estado') as HTMLSelectElement)?.value, 10);
      const newDetalle = (document.getElementById('swal-input-detalle') as HTMLInputElement)?.value;
      const newPrecio = parseFloat((document.getElementById('swal-input-precio') as HTMLInputElement)?.value);
      const newFechaInicio = (document.getElementById('swal-input-fecha-inicio') as HTMLInputElement)?.value;
      const newFechaFin = (document.getElementById('swal-input-fecha-fin') as HTMLInputElement)?.value;
      const newImagen = (document.getElementById('swal-input-imagen') as HTMLInputElement)?.value;

      if (!newNombre || isNaN(newEstado) || !newDetalle || isNaN(newPrecio) || !newFechaInicio || !newFechaFin || !newImagen) {
        Swal.showValidationMessage('Todos los campos son obligatorios y deben ser válidos');
        return;
      }

      return {
        id: paquete.id,
        nombre: newNombre,
        estado: newEstado,
        detalle: newDetalle,
        precio: newPrecio,
        fecha_ini: newFechaInicio,
        fecha_fin: newFechaFin,
        imagen: newImagen,
      };
    },
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const updatedPaquete = result.value;

      axios
        .put(`/api/paquete/${updatedPaquete.id}`, updatedPaquete)
        .then(() => {
          onEdit(updatedPaquete);
          setPaquetes((prevPaquetes) =>
            prevPaquetes.map((p) => (p.id === updatedPaquete.id ? updatedPaquete : p))
          );
          Swal.fire('Guardado', 'El paquete fue actualizado correctamente.', 'success');
        })
        .catch((error) => {
          console.error('Error al actualizar el paquete:', error.response?.data || error.message);
          Swal.fire('Error', `No se pudo actualizar el paquete: ${error.response?.data?.message || error.message}`, 'error');
        });
    }
  });
};

const PaqueteList: React.FC<PaqueteListProps> = ({ paquetes: initialPaquetes, onEdit, onDelete, onAddEstadia }) => {
  const [paquetes, setPaquetes] = useState<Paquete[]>(initialPaquetes);
  const [hoteles, setHoteles] = useState<{ [key: number]: any }>({});
  const [activePaquete, setActivePaquete] = useState<number | null>(null);
  const [estadiaEditada, setEstadiaEditada] = useState<Estadia | null>(null);

  const fetchHoteles = async () => {
    try {
      const response = await axios.get('/api/hotel'); // Endpoint para obtener todos los hoteles
      console.log('Respuesta del servidor para hoteles:', response.data); // Log para depuración

      if (Array.isArray(response.data.data)) {
        setHoteles(response.data.data.reduce((acc: any, hotel: any) => {
          acc[hotel.id] = hotel;
          return acc;
        }, {})); // Almacenar hoteles en un objeto con sus IDs como claves
      } else {
        console.error('La respuesta del servidor no contiene un array válido:', response.data);
        Swal.fire('Error', 'No se pudieron cargar los hoteles. Respuesta inválida del servidor.', 'error');
      }
    } catch (error) {
      console.error('Error al obtener los hoteles:', error);
      Swal.fire('Error', 'No se pudieron cargar los hoteles. Verifique su conexión o contacte al administrador.', 'error');
    }
  };

  useEffect(() => {
    fetchHoteles(); // Obtener la lista de hoteles al cargar el componente
  }, []);

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
    });
  };


const onEditEstadia = (estadia: any) => {
  console.log('✏️ Editar estadía:', estadia);
  const fechaInicio = new Date(estadia.fecha_ini).toISOString().split('T')[0];
  const fechaFin = new Date(estadia.fecha_fin).toISOString().split('T')[0];

  MySwal.fire({
    title: 'Editar Estadía',
    html: `
      <select id="swal-input-hotel" class="swal2-input">
        ${Object.values(hoteles).map(
          (hotel: any) => `<option value="${hotel.id}" ${hotel.id === estadia.id_hotel ? 'selected' : ''}>${hotel.nombre}</option>`
        ).join('')}
      </select>
      <input id="swal-input-fecha-inicio" type="date" class="swal2-input" placeholder="Fecha Inicio" value="${fechaInicio}" />
      <input id="swal-input-fecha-fin" type="date" class="swal2-input" placeholder="Fecha Fin" value="${fechaFin}" />
      <input id="swal-input-precio" type="number" class="swal2-input" placeholder="Precio por Día" value="${estadia.precio_x_dia}" />
    `,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const newHotelId = parseInt((document.getElementById('swal-input-hotel') as HTMLSelectElement)?.value, 10);
      const newFechaInicio = (document.getElementById('swal-input-fecha-inicio') as HTMLInputElement)?.value;
      const newFechaFin = (document.getElementById('swal-input-fecha-fin') as HTMLInputElement)?.value;
      const newPrecio = parseFloat((document.getElementById('swal-input-precio') as HTMLInputElement)?.value);

      const paqueteId = estadia.paquete || estadia.paquete?.id;

      if (!newHotelId || !newFechaInicio || !newFechaFin || isNaN(newPrecio) || !paqueteId) {
        Swal.showValidationMessage('Todos los campos son obligatorios y deben ser válidos, incluyendo el ID del paquete');
        return;
      }

      return {
        id_hotel: newHotelId,
        id_paquete: paqueteId,
        fecha_ini: newFechaInicio,
        fecha_fin: newFechaFin,
        precio_x_dia: newPrecio,
      };
    },
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const updatedEstadia = { ...estadia, ...result.value };

      axios
        .put(`/api/estadia/${updatedEstadia.id}`, updatedEstadia)
        .then((response) => {
          const estadiaActualizada = response.data.data;


          setPaquetes((prevPaquetes) =>
            prevPaquetes.map((paquete) =>
              paquete.id === estadiaActualizada.id_paquete
                ? {
                    ...paquete,
                    estadias: paquete.estadias.map((e) =>
                      e.id === estadiaActualizada.id ? estadiaActualizada : e
                    ),
                  }
                : paquete
            )
          );

          Swal.fire('Guardado', 'La estadía fue actualizada correctamente.', 'success');
        })
        .catch((error) => {
          console.error('Error al actualizar la estadía:', error.response?.data || error.message);
          Swal.fire('Error', `No se pudo actualizar la estadía: ${error.response?.data?.message || error.message}`, 'error');
        });
    }
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
  MySwal.fire({
    title: 'Agregar Nueva Estadía',
    html: `
      <select id="swal-input-hotel" class="swal2-input">
        ${Object.values(hoteles).map(
          (hotel: any) => `<option value="${hotel.id}">${hotel.nombre}</option>`
        ).join('')}
      </select>
      <input id="swal-input-fecha-inicio" type="date" class="swal2-input" placeholder="Fecha Inicio" />
      <input id="swal-input-fecha-fin" type="date" class="swal2-input" placeholder="Fecha Fin" />
      <input id="swal-input-precio" type="number" class="swal2-input" placeholder="Precio por Día" />
    `,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const newHotelId = parseInt((document.getElementById('swal-input-hotel') as HTMLSelectElement)?.value, 10);
      const newFechaInicio = (document.getElementById('swal-input-fecha-inicio') as HTMLInputElement)?.value;
      const newFechaFin = (document.getElementById('swal-input-fecha-fin') as HTMLInputElement)?.value;
      const newPrecio = parseFloat((document.getElementById('swal-input-precio') as HTMLInputElement)?.value);

      if (!newHotelId || !newFechaInicio || !newFechaFin || isNaN(newPrecio)) {
        Swal.showValidationMessage('Todos los campos son obligatorios y deben ser válidos');
        return;
      }

      return {
        id_hotel: newHotelId,
        fecha_ini: newFechaInicio,
        fecha_fin: newFechaFin,
        precio_x_dia: newPrecio,
        id_paquete: id_paquete,
      };
    },
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const nuevaEstadia = result.value;

      axios
        .post('/api/estadia', nuevaEstadia)
        .then((response) => {
          const estadiaAgregada = response.data;

          setPaquetes((prevPaquetes) =>
            prevPaquetes.map((paquete) =>
              paquete.id === id_paquete
                ? {
                    ...paquete,
                    estadias: [...(paquete.estadias || []), estadiaAgregada],
                  }
                : paquete
            )
          );

          Swal.fire('Guardado', 'La estadía fue agregada correctamente.', 'success');
        })
        .catch((error) => {
          console.error('Error al agregar la estadía:', error.response?.data || error.message);
          Swal.fire('Error', `No se pudo agregar la estadía: ${error.response?.data?.message || error.message}`, 'error');
        });
    }
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
                    {estadia.hotel ? (
                      <p style={{ textDecoration: 'underline' }}>{estadia.hotel.nombre}</p>
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
