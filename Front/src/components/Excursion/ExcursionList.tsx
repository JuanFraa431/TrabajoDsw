import React, { useState, useEffect } from 'react';
import { Excursion } from '../../interface/excursion';
import '../../styles/Card.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

interface ExcursionListProps {
  excursiones: Excursion[];
  onEdit: (excursion: Excursion) => void;
  onDelete: (excursion: Excursion) => void;
  onCreate: (excursion: Excursion) => void;
}

const ExcursionList: React.FC<ExcursionListProps> = ({ excursiones: initialExcursiones, onEdit, onDelete, onCreate }) => {
  const [excursiones, setExcursiones] = useState<Excursion[]>(initialExcursiones);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    setExcursiones(initialExcursiones);
  }, [initialExcursiones]);

  const handleEditExcursion = (excursion: Excursion) => {
    MySwal.fire({
      title: 'Editar Excursión',
      html: `
        <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" value="${excursion.nombre}" />
        <input id="swal-input-tipo" class="swal2-input" placeholder="Tipo" value="${excursion.tipo}" />
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-input-nombre') as HTMLInputElement)?.value;
        const tipo = (document.getElementById('swal-input-tipo') as HTMLInputElement)?.value;
        if (!nombre || !tipo) {
          Swal.showValidationMessage('Todos los campos son obligatorios y deben ser válidos');
          return;
        }
        return { ...excursion, nombre, tipo };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          await axios.put(`/api/excursion/${excursion.id}`, result.value);
          setExcursiones((prev) => prev.map((e) => (e.id === excursion.id ? result.value : e)));
          onEdit(result.value);
          Swal.fire('Guardado', 'La excursión fue actualizada correctamente.', 'success');
        } catch (error: any) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo actualizar la excursión', 'error');
        }
      }
    });
  };

  const handleDeleteExcursion = (excursion: Excursion) => {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar la excursión?',
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
          await axios.delete(`/api/excursion/${excursion.id}`);
          setExcursiones((prev) => prev.filter((e) => e.id !== excursion.id));
          onDelete(excursion);
          Swal.fire('Eliminado', 'La excursión fue eliminada correctamente.', 'success');
        } catch (error: any) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo eliminar la excursión', 'error');
        }
      }
    });
  };

  const handleCreateExcursion = () => {
    MySwal.fire({
      title: 'Crear Excursión',
      html: `
        <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" />
        <input id="swal-input-tipo" class="swal2-input" placeholder="Tipo" />
      `,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-input-nombre') as HTMLInputElement)?.value;
        const tipo = (document.getElementById('swal-input-tipo') as HTMLInputElement)?.value;
        if (!nombre || !tipo) {
          Swal.showValidationMessage('Todos los campos son obligatorios y deben ser válidos');
          return;
        }
        return { nombre, tipo };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const response = await axios.post('/api/excursion', result.value);
          setExcursiones((prev) => [...prev, response.data.data || response.data]);
          onCreate(response.data.data || response.data);
          Swal.fire('Creado', 'La excursión fue creada correctamente.', 'success');
        } catch (error: any) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo crear la excursión', 'error');
        }
      }
    });
  };

  return (
    <div className="card-list">
      <button className="boton-crear" onClick={handleCreateExcursion}>
        Crear Excursión
      </button>
      {excursiones.map((excursion) => (
        <div key={excursion.id} className="card">
          <div className="card-content">
            <h3>{excursion.nombre}</h3>
            <p>Tipo: {excursion.tipo}</p>
          </div>
          <div className="card-actions">
            <button onClick={() => handleEditExcursion(excursion)}>Editar</button>
            <button onClick={() => handleDeleteExcursion(excursion)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExcursionList;
