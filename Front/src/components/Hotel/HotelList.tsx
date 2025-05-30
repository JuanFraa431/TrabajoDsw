import React, { useState, useEffect } from 'react';
import { Hotel } from '../../interface/hotel';
import '../../styles/Card.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

interface HotelListProps {
  hoteles: Hotel[];
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotel: Hotel) => void;
}

const MySwal = withReactContent(Swal);

const HotelList: React.FC<HotelListProps> = ({ hoteles: initialHoteles, onEdit, onDelete }) => {
  const [hoteles, setHoteles] = useState<Hotel[]>(initialHoteles);

  useEffect(() => {
    setHoteles(initialHoteles);
  }, [initialHoteles]);

  const handleEditHotel = (hotel: Hotel) => {
    MySwal.fire({
      title: 'Editar Hotel',
      html: `
        <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" value="${hotel.nombre}" />
        <input id="swal-input-direccion" class="swal2-input" placeholder="Dirección" value="${hotel.direccion}" />
        <input id="swal-input-estrellas" class="swal2-input" type="number" min="1" max="5" placeholder="Estrellas" value="${hotel.estrellas}" />
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-input-nombre') as HTMLInputElement)?.value;
        const direccion = (document.getElementById('swal-input-direccion') as HTMLInputElement)?.value;
        const estrellas = parseInt((document.getElementById('swal-input-estrellas') as HTMLInputElement)?.value, 10);
        if (!nombre || !direccion || isNaN(estrellas)) {
          Swal.showValidationMessage('Todos los campos son obligatorios y deben ser válidos');
          return;
        }
        return { ...hotel, nombre, direccion, estrellas };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          await axios.put(`/api/hotel/${hotel.id}`, result.value);
          setHoteles((prev) => prev.map((h) => (h.id === hotel.id ? result.value : h)));
          onEdit(result.value);
          Swal.fire('Guardado', 'El hotel fue actualizado correctamente.', 'success');
        } catch (error: any) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo actualizar el hotel', 'error');
        }
      }
    });
  };

  const handleDeleteHotel = (hotel: Hotel) => {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar el hotel?',
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
          await axios.delete(`/api/hotel/${hotel.id}`);
          setHoteles((prev) => prev.filter((h) => h.id !== hotel.id));
          onDelete(hotel);
          Swal.fire('Eliminado', 'El hotel fue eliminado correctamente.', 'success');
        } catch (error: any) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo eliminar el hotel', 'error');
        }
      }
    });
  };

  const handleCreateHotel = () => {
    MySwal.fire({
      title: 'Crear Hotel',
      html: `
        <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" />
        <input id="swal-input-direccion" class="swal2-input" placeholder="Dirección" />
        <input id="swal-input-estrellas" class="swal2-input" type="number" min="1" max="5" placeholder="Estrellas" />
      `,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-input-nombre') as HTMLInputElement)?.value;
        const direccion = (document.getElementById('swal-input-direccion') as HTMLInputElement)?.value;
        const estrellas = parseInt((document.getElementById('swal-input-estrellas') as HTMLInputElement)?.value, 10);
        if (!nombre || !direccion || isNaN(estrellas)) {
          Swal.showValidationMessage('Todos los campos son obligatorios y deben ser válidos');
          return;
        }
        return { nombre, direccion, estrellas };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const response = await axios.post('/api/hotel', result.value);
          setHoteles((prev) => [...prev, response.data.data || response.data]);
          Swal.fire('Creado', 'El hotel fue creado correctamente.', 'success');
        } catch (error: any) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo crear el hotel', 'error');
        }
      }
    });
  };

  return (
    <div className="card-list">
      <button className="boton-crear" onClick={handleCreateHotel}>
        Crear Hotel
      </button>
      {hoteles.map((hotel) => (
        <div key={hotel.id} className="card">
          <div className="card-content">
            <h3>{hotel.nombre}</h3>
            <p>Dirección: {hotel.direccion}</p>
            <p>Estrellas: {hotel.estrellas}</p>
          </div>
          <div className="card-actions">
            <button onClick={() => handleEditHotel(hotel)}>Editar</button>
            <button onClick={() => handleDeleteHotel(hotel)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelList;