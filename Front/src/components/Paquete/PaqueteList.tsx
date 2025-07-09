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
      <div class="form-editar-paquete">
        <div class="sweet-form-row">
          <label for="swal-input-nombre">Nombre</label>
          <input id="swal-input-nombre" placeholder="Nombre" value="${nombre}" />
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-estado">Estado</label>
          <select id="swal-input-estado">
            <option value="1" ${estado === 1 ? 'selected' : ''}>Activo</option>
            <option value="0" ${estado === 0 ? 'selected' : ''}>Inactivo</option>
          </select>
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-detalle">Detalle</label>
          <input id="swal-input-detalle" placeholder="Detalle" value="${detalle}" />
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-precio">Precio</label>
          <input id="swal-input-precio" type="number" placeholder="Precio" value="${precio}" />
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-fecha-inicio">Fecha Inicio</label>
          <input id="swal-input-fecha-inicio" type="date" value="${fecha_inicio}" />
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-fecha-fin">Fecha Fin</label>
          <input id="swal-input-fecha-fin" type="date" value="${fecha_fin}" />
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-imagen">URL de Imagen</label>
          <input id="swal-input-imagen" placeholder="URL de Imagen" value="${imagen}" />
        </div>
      </div>
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
        }, {})); 
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
    fetchHoteles(); 
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


const onEditEstadia = (estadia: Estadia, paquetePadreId?: number) => {
  const fechaInicio = new Date(estadia.fecha_ini).toISOString().split('T')[0];
  const fechaFin = new Date(estadia.fecha_fin).toISOString().split('T')[0];
  let paqueteId = estadia.id_paquete;
  if (!paqueteId) {
    const paquetePadre = paquetes.find((p) => Array.isArray(p.estadias) && p.estadias.some((e) => e.id === estadia.id));
    if (paquetePadre) {
      paqueteId = paquetePadre.id;
    } else if (paquetePadreId) {
      paqueteId = paquetePadreId;
    }
  }
  const estadiaId = estadia.id;

  MySwal.fire({
    title: 'Editar Estadía',
    html: `
      <div class="form-editar-estadia">
        <div class="sweet-form-row">
          <label for="swal-input-hotel">Hotel</label>
          <select id="swal-input-hotel">
            ${Object.values(hoteles)
              .map(
                (hotel: any) =>
                  `<option value="${hotel.id}" ${hotel.id === (typeof estadia.hotel === 'object' ? estadia.hotel?.id : estadia.hotel) ? 'selected' : ''}>${hotel.nombre}</option>`
              )
              .join('')}
          </select>
        </div>
        <div class="sweet-form-row">
          <label for="swal-input-fecha-inicio">Fecha Inicio</label>
          <input id="swal-input-fecha-inicio" type="date" value="${fechaInicio}" />
        </div>
        <div class="sweet-form-row">
          <label for="swal-input-fecha-fin">Fecha Fin</label>
          <input id="swal-input-fecha-fin" type="date" value="${fechaFin}" />
        </div>
        <div class="sweet-form-row">
          <label for="swal-input-precio">Precio por Día</label>
          <input id="swal-input-precio" type="number" step="0.01" value="${estadia.precio_x_dia}" />
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const newHotelId = parseInt((document.getElementById('swal-input-hotel') as HTMLSelectElement)?.value, 10);
      const newFechaInicio = (document.getElementById('swal-input-fecha-inicio') as HTMLInputElement)?.value;
      const newFechaFin = (document.getElementById('swal-input-fecha-fin') as HTMLInputElement)?.value;
      const newPrecio = parseFloat((document.getElementById('swal-input-precio') as HTMLInputElement)?.value);

      if (!newHotelId || !newFechaInicio || !newFechaFin || isNaN(newPrecio) || !paqueteId) {
        Swal.showValidationMessage("Todos los campos deben estar completos y válidos, incluyendo el paquete.");
        return;
      }
      if (typeof paqueteId !== 'number' || isNaN(paqueteId) || paqueteId <= 0) {
        Swal.showValidationMessage("Error interno: el paquete no está definido correctamente. Intenta desde el botón 'Ver Estadías' del paquete.");
        return;
      }
      return {
        id: estadiaId,
        id_paquete: paqueteId,
        id_hotel: newHotelId,
        fecha_ini: newFechaInicio,
        fecha_fin: newFechaFin,
        precio_x_dia: newPrecio,
      };
    },
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const estadiaActualizada = result.value;
      axios
        .put(`/api/estadia/${estadiaActualizada.id}`, estadiaActualizada)
        .then((response) => {
          let paqueteId = estadiaActualizada.id_paquete;
          fetchAndUpdatePaquete(paqueteId);
          Swal.fire('Guardado', 'La estadía fue actualizada correctamente.', 'success');
        })
        .catch((error) => {
          console.error('Error al actualizar la estadía:', error);
          Swal.fire('Error', `No se pudo actualizar la estadía: ${error.message}`, 'error');
        });
    }
  });
};



const onDeleteEstadia = (estadia: any, paquetePadreId?: number) => {
  console.log('🗑️ Eliminar estadía:', estadia);
  let paqueteId = estadia.id_paquete;
  if (!paqueteId) {
    const paquetePadre = paquetes.find((p) => Array.isArray(p.estadias) && p.estadias.some((e) => e.id === estadia.id));
    if (paquetePadre) {
      paqueteId = paquetePadre.id;
    } else if (paquetePadreId) {
      paqueteId = paquetePadreId;
    }
  }
  if (!paqueteId) {
    Swal.fire('Error', 'No se pudo determinar el paquete de la estadía. Intenta desde el botón "Ver Estadías" del paquete.', 'error');
    return;
  }
  Swal.fire({
    title: '¿Estás seguro que deseas eliminar la estadía?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`/api/estadia/${estadia.id}`)
        .then(() => {
          console.log('✅ Estadía eliminada');
          setPaquetes((prevPaquetes) =>
            prevPaquetes.map((paquete) =>
              paquete.id === paqueteId
                ? { ...paquete, estadias: Array.isArray(paquete.estadias) ? paquete.estadias.filter((e) => e.id !== estadia.id) : [] }
                : paquete
            )
          );
          Swal.fire('Eliminado', 'La estadía fue eliminada correctamente.', 'success');
        })
        .catch((error) => {
          console.error('❌ Error eliminando estadía:', error);
          Swal.fire('Error', `No se pudo eliminar la estadía: ${error.response?.data?.message || error.message}`, 'error');
        });
    }
  });
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
          fetchAndUpdatePaquete(id_paquete);
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

  const fetchAndUpdatePaquete = async (paqueteId: number) => {
    try {
      const response = await axios.get(`/api/paquete/${paqueteId}`);
      const paqueteActualizado = response.data.data || response.data;
      // Inyectar hoteles en las estadías
      if (Array.isArray(paqueteActualizado.estadias)) {
        paqueteActualizado.estadias = paqueteActualizado.estadias.map((estadia: any) =>
          estadia.id_hotel && hoteles[estadia.id_hotel]
            ? { ...estadia, hotel: hoteles[estadia.id_hotel] }
            : estadia
        );
      }
      setPaquetes((prevPaquetes) =>
        prevPaquetes.map((p) => (p.id === paqueteId ? paqueteActualizado : p))
      );
    } catch (error) {
      console.error('Error recargando el paquete:', error);
      Swal.fire('Error', 'No se pudo recargar el paquete actualizado.', 'error');
    }
  };

  const showEstadiasSwal = (paquete: Paquete) => {
    MySwal.fire({
      title: `Estadías de ${paquete.nombre}`,
      html: `
        <div style="max-height:60vh;overflow-y:auto;">
          ${(paquete.estadias ?? []).map((estadia: any) => `
            <div style="border:1px solid #ccc;border-radius:8px;padding:6px 10px;margin-bottom:8px;background:#f9f9f9;display:inline-block;min-width:220px;max-width:98%;box-sizing:border-box;">
              <p style="font-weight:bold;text-decoration:underline;margin:0 0 4px 0;">${estadia.hotel ? estadia.hotel.nombre : 'Cargando hotel...'}</p>
              <p style="margin:0 0 2px 0;">Fecha Inicio: ${new Date(estadia.fecha_ini).toLocaleDateString('es-ES')}</p>
              <p style="margin:0 0 2px 0;">Fecha Fin: ${new Date(estadia.fecha_fin).toLocaleDateString('es-ES')}</p>
              <p style="margin:0 0 6px 0;">Precio por Día: $${estadia.precio_x_dia}</p>
              <div style="display:flex;gap:8px;justify-content:center;">
                <button class="swal2-confirm swal2-styled" style="background:#3085d6;padding:2px 10px;font-size:0.95em;" onclick="window.editEstadiaSwal(${estadia.id}, ${paquete.id})">Editar</button>
                <button class="swal2-cancel swal2-styled" style="background:#d33;padding:2px 10px;font-size:0.95em;" onclick="window.deleteEstadiaSwal(${estadia.id}, ${paquete.id})">Eliminar</button>
              </div>
            </div>
          `).join('')}
          <button class="swal2-confirm swal2-styled" style="width:90%;margin-top:8px;" onclick="window.addEstadiaSwal(${paquete.id})">Agregar Estadía</button>
        </div>
      `,
      showConfirmButton: false,
      width: 600,
      didOpen: () => {
        // Exponer funciones globales para los botones
        (window as any).editEstadiaSwal = (estadiaId: number, paqueteId: number) => {
          const estadia = paquete.estadias?.find((e: any) => e.id === estadiaId);
          if (estadia) {
            Swal.close();
            setTimeout(() => onEditEstadia(estadia, paqueteId), 200);
          }
        };
        (window as any).deleteEstadiaSwal = (estadiaId: number, paqueteId: number) => {
          const estadia = paquete.estadias?.find((e: any) => e.id === estadiaId);
          if (estadia) {
            Swal.close();
            setTimeout(() => onDeleteEstadia(estadia, paqueteId), 200);
          }
        };
        (window as any).addEstadiaSwal = (paqueteId: number) => {
          Swal.close();
          setTimeout(() => handleAddEstadia(paqueteId), 200);
        };
      },
      willClose: () => {
        // Limpiar funciones globales
        delete (window as any).editEstadiaSwal;
        delete (window as any).deleteEstadiaSwal;
        delete (window as any).addEstadiaSwal;
      }
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
                <span className="circulo-roja"></span>
              )}
            </h3>
            <p>Detalle: {paquete.detalle}</p>
          </div>
          <div className="card-actions">
            <button onClick={() => handleEditPaquete(paquete, onEdit, setPaquetes)}>Editar</button>
            <button onClick={() => onDelete(paquete)}>Eliminar</button>
            <button onClick={() => showEstadiasSwal(paquete)}>
              Ver Estadías
            </button>
          </div>
          {activePaquete === paquete.id && (
            <div className="estadias-list">
              <h4>Estadías:</h4>
              <ul>
                {paquete.estadias?.map((estadia: any) => (
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
                      <button onClick={() => onEditEstadia(estadia, paquete.id)}>Editar</button>
                      <button onClick={() => onDeleteEstadia(estadia, paquete.id)}>Eliminar</button>
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
