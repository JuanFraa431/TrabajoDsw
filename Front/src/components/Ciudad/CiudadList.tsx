import React, { useState, useEffect } from 'react';
import { Ciudad } from '../../interface/ciudad';
import '../../styles/Card.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

interface CiudadListProps {
  ciudades: Ciudad[];
  onEdit: (ciudad: Ciudad) => void;
  onDelete: (ciudad: Ciudad) => void;
}

const MySwal = withReactContent(Swal);

const CiudadList: React.FC<CiudadListProps> = ({ ciudades: initialCiudades, onEdit, onDelete }) => {
  const [ciudades, setCiudades] = useState<Ciudad[]>(initialCiudades);

  useEffect(() => {
    setCiudades(initialCiudades);
  }, [initialCiudades]);

  const handleEditCiudad = (ciudad: Ciudad) => {
    MySwal.fire({
      title: 'Editar Ciudad',
      html: `
        <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" value="${ciudad.nombre}" />
        <input id="swal-input-descripcion" class="swal2-input" placeholder="Descripción" value="${ciudad.descripcion}" />
        <input id="swal-input-pais" class="swal2-input" placeholder="País" value="${ciudad.pais}" />
        <input id="swal-input-latitud" class="swal2-input" placeholder="Latitud" value="${ciudad.latitud}" />
        <input id="swal-input-longitud" class="swal2-input" placeholder="Longitud" value="${ciudad.longitud}" />
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-input-nombre') as HTMLInputElement)?.value;
        const descripcion = (document.getElementById('swal-input-descripcion') as HTMLInputElement)?.value;
        const pais = (document.getElementById('swal-input-pais') as HTMLInputElement)?.value;
        const latitud = (document.getElementById('swal-input-latitud') as HTMLInputElement)?.value;
        const longitud = (document.getElementById('swal-input-longitud') as HTMLInputElement)?.value;
        if (!nombre || !descripcion || !pais || !latitud || !longitud) {
          Swal.showValidationMessage('Todos los campos son obligatorios y deben ser válidos');
          return;
        }
        return { ...ciudad, nombre, descripcion, pais, latitud, longitud };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        console.log('Datos que se van a enviar al editar ciudad:', result.value);
        try {
          await axios.put(`/api/ciudad/${ciudad.id}`, result.value);
          setCiudades((prev) => prev.map((c) => (c.id === ciudad.id ? result.value : c)));
          onEdit(result.value);
          Swal.fire('Guardado', 'La ciudad fue actualizada correctamente.', 'success');
        } catch (error: any) {
          console.error('Error al editar ciudad:', error.response?.data || error);
          Swal.fire('Error', error.response?.data?.message || 'No se pudo actualizar la ciudad', 'error');
        }
      }
    });
  };

  const handleDeleteCiudad = (ciudad: Ciudad) => {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar la ciudad?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/ciudad/${ciudad.id}`);
          setCiudades((prev) => prev.filter((c) => c.id !== ciudad.id));
          onDelete(ciudad);
          Swal.fire('Eliminado', 'La ciudad fue eliminada correctamente.', 'success');
        } catch (error: any) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo eliminar la ciudad', 'error');
        }
      }
    });
  };

  const handleCreateCiudad = () => {
    MySwal.fire({
      title: 'Crear Ciudad',
      html: `
        <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" />
        <input id="swal-input-descripcion" class="swal2-input" placeholder="Descripción" />
        <input id="swal-input-pais" class="swal2-input" placeholder="País" />
        <input id="swal-input-latitud" class="swal2-input" placeholder="Latitud" />
        <input id="swal-input-longitud" class="swal2-input" placeholder="Longitud" />
      `,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-input-nombre') as HTMLInputElement)?.value;
        const descripcion = (document.getElementById('swal-input-descripcion') as HTMLInputElement)?.value;
        const pais = (document.getElementById('swal-input-pais') as HTMLInputElement)?.value;
        const latitud = (document.getElementById('swal-input-latitud') as HTMLInputElement)?.value;
        const longitud = (document.getElementById('swal-input-longitud') as HTMLInputElement)?.value;
        if (!nombre || !descripcion || !pais || !latitud || !longitud) {
          Swal.showValidationMessage('Todos los campos son obligatorios y deben ser válidos');
          return;
        }
        return { nombre, descripcion, pais, latitud, longitud };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        console.log('Datos que se van a enviar al crear ciudad:', result.value);
        try {
          const response = await axios.post('/api/ciudad', result.value);
          setCiudades((prev) => [...prev, response.data.data || response.data]);
          Swal.fire('Creado', 'La ciudad fue creada correctamente.', 'success');
        } catch (error: any) {
          console.error('Error al crear ciudad:', error.response?.data || error);
          Swal.fire('Error', error.response?.data?.message || 'No se pudo crear la ciudad', 'error');
        }
      }
    });
  };

  return (
    <div className="card-list">
      <button className="boton-crear" onClick={handleCreateCiudad}>
        Crear Ciudad
      </button>
      {ciudades.map((ciudad) => (
        <div key={ciudad.id} className="card">
          <div className="card-content">
            <h3>{ciudad.nombre}</h3>
            <p><strong>Descripción:</strong> {ciudad.descripcion}</p>
            <p><strong>País:</strong> {ciudad.pais}</p>
            <p><strong>Coordenadas:</strong> {ciudad.latitud}, {ciudad.longitud}</p>
          </div>
          <div className="card-actions">
            <button onClick={() => handleEditCiudad(ciudad)}>Editar</button>
            <button onClick={() => handleDeleteCiudad(ciudad)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CiudadList;