import React, { useState, useEffect } from 'react';
import { Hotel } from '../../interface/hotel';
import { Ciudad } from '../../interface/ciudad';
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
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);

  useEffect(() => {
    setHoteles(initialHoteles);
  }, [initialHoteles]);

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const response = await axios.get('/api/ciudad');
        setCiudades(response.data.data || response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCiudades();
  }, []);

  // Función para recargar los hoteles desde el servidor
  const reloadHoteles = async () => {
    try {
      const response = await axios.get('/api/hotel');
      setHoteles(response.data.data || response.data);
    } catch (error) {
      console.error('Error reloading hotels:', error);
    }
  };

  const handleEditHotel = (hotel: Hotel) => {
    const ciudadId = hotel.ciudad?.id || hotel.id_ciudad;
    const selectedCiudad = ciudades.find(c => c.id === ciudadId);
    const ciudadOptions = ciudades.map(ciudad =>
      `<option value="${ciudad.nombre}" data-id="${ciudad.id}">${ciudad.nombre}</option>`
    ).join('');

    MySwal.fire({
      title: 'Editar Hotel',
      html: `
        <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" value="${hotel.nombre}" />
        <textarea id="swal-input-descripcion" class="swal2-textarea" placeholder="Descripción">${hotel.descripcion}</textarea>
        <input id="swal-input-direccion" class="swal2-input" placeholder="Dirección" value="${hotel.direccion}" />
        <input id="swal-input-telefono" class="swal2-input" placeholder="Teléfono" value="${hotel.telefono}" />
        <input id="swal-input-email" class="swal2-input" type="email" placeholder="Email" value="${hotel.email}" />
        <input id="swal-input-estrellas" class="swal2-input" type="number" min="1" max="5" placeholder="Estrellas" value="${hotel.estrellas}" />
        <input id="swal-input-precio" class="swal2-input" type="number" min="0" step="0.01" placeholder="Precio por día" value="${hotel.precio_x_dia}" />
        <div style="position: relative; width: 100%;">
          <input 
            id="swal-input-ciudad-text" 
            class="swal2-input" 
            placeholder="Buscar y seleccionar ciudad..." 
            value="${selectedCiudad?.nombre || ''}" 
            autocomplete="off"
            style="width: 100%; box-sizing: border-box;"
          />
          <datalist id="ciudades-list">
            ${ciudadOptions}
          </datalist>
          <input type="hidden" id="swal-input-ciudad" value="${ciudadId || ''}" />
        </div>
        <style>
          input[list]::-webkit-calendar-picker-indicator {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>');
            background-size: 16px 16px;
            background-repeat: no-repeat;
            background-position: center;
            cursor: pointer;
          }
        </style>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        const ciudadInput = document.getElementById('swal-input-ciudad-text') as HTMLInputElement;
        const hiddenInput = document.getElementById('swal-input-ciudad') as HTMLInputElement;
        const datalist = document.getElementById('ciudades-list') as HTMLDataListElement;

        // Set up the input to use datalist
        ciudadInput.setAttribute('list', 'ciudades-list');

        ciudadInput.addEventListener('input', () => {
          const inputValue = ciudadInput.value;
          const matchedCiudad = ciudades.find(c => c.nombre.toLowerCase() === inputValue.toLowerCase());

          if (matchedCiudad) {
            hiddenInput.value = matchedCiudad.id.toString();
          } else {
            hiddenInput.value = '';
          }
        });

        ciudadInput.addEventListener('blur', () => {
          // Si el usuario sale del campo sin seleccionar una ciudad válida, buscar coincidencia parcial
          const inputValue = ciudadInput.value.toLowerCase();
          const matchedCiudad = ciudades.find(c => c.nombre.toLowerCase().includes(inputValue));

          if (matchedCiudad && inputValue) {
            ciudadInput.value = matchedCiudad.nombre;
            hiddenInput.value = matchedCiudad.id.toString();
          }
        });
      },
      preConfirm: () => {
        const nombre = (document.getElementById('swal-input-nombre') as HTMLInputElement)?.value;
        const descripcion = (document.getElementById('swal-input-descripcion') as HTMLTextAreaElement)?.value;
        const direccion = (document.getElementById('swal-input-direccion') as HTMLInputElement)?.value;
        const telefono = (document.getElementById('swal-input-telefono') as HTMLInputElement)?.value;
        const email = (document.getElementById('swal-input-email') as HTMLInputElement)?.value;
        const estrellas = parseInt((document.getElementById('swal-input-estrellas') as HTMLInputElement)?.value, 10);
        const precio_x_dia = parseFloat((document.getElementById('swal-input-precio') as HTMLInputElement)?.value);
        const id_ciudad = parseInt((document.getElementById('swal-input-ciudad') as HTMLInputElement)?.value, 10);

        // Validación mejorada
        if (!nombre?.trim()) {
          Swal.showValidationMessage('El nombre es obligatorio');
          return;
        }
        if (!descripcion?.trim()) {
          Swal.showValidationMessage('La descripción es obligatoria');
          return;
        }
        if (!direccion?.trim()) {
          Swal.showValidationMessage('La dirección es obligatoria');
          return;
        }
        if (!telefono?.trim()) {
          Swal.showValidationMessage('El teléfono es obligatorio');
          return;
        }
        if (!email?.trim()) {
          Swal.showValidationMessage('El email es obligatorio');
          return;
        }
        if (isNaN(estrellas) || estrellas < 1 || estrellas > 5) {
          Swal.showValidationMessage('Las estrellas deben ser un número entre 1 y 5');
          return;
        }
        if (isNaN(precio_x_dia) || precio_x_dia <= 0) {
          Swal.showValidationMessage('El precio por día debe ser un número mayor a 0');
          return;
        }
        if (!id_ciudad || isNaN(id_ciudad)) {
          Swal.showValidationMessage('Debe seleccionar una ciudad válida');
          return;
        }
        return { nombre, descripcion, direccion, telefono, email, estrellas, precio_x_dia, id_ciudad };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const response = await axios.put(`/api/hotel/${hotel.id}`, result.value);

          // Recargar todos los hoteles para obtener datos completos y actualizados
          await reloadHoteles();

          onEdit(response.data.data || response.data);
          Swal.fire('Guardado', 'El hotel fue actualizado correctamente.', 'success');
        } catch (error: any) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo actualizar el hotel', 'error');
        }
      }
    });
  }; const handleDeleteHotel = (hotel: Hotel) => {
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

          // Recargar todos los hoteles para mantener consistencia
          await reloadHoteles();

          onDelete(hotel);
          Swal.fire('Eliminado', 'El hotel fue eliminado correctamente.', 'success');
        } catch (error: any) {
          Swal.fire('Error', error.response?.data?.message || 'No se pudo eliminar el hotel', 'error');
        }
      }
    });
  };

  const handleCreateHotel = () => {
    const ciudadOptions = ciudades.map(ciudad =>
      `<option value="${ciudad.nombre}" data-id="${ciudad.id}">${ciudad.nombre}</option>`
    ).join('');

    MySwal.fire({
      title: 'Crear Hotel',
      html: `
        <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" />
        <textarea id="swal-input-descripcion" class="swal2-textarea" placeholder="Descripción"></textarea>
        <input id="swal-input-direccion" class="swal2-input" placeholder="Dirección" />
        <input id="swal-input-telefono" class="swal2-input" placeholder="Teléfono" />
        <input id="swal-input-email" class="swal2-input" type="email" placeholder="Email" />
        <input id="swal-input-estrellas" class="swal2-input" type="number" min="1" max="5" placeholder="Estrellas" />
        <input id="swal-input-precio" class="swal2-input" type="number" min="0" step="0.01" placeholder="Precio por día" />
        <div style="position: relative; width: 100%;">
          <input 
            id="swal-input-ciudad-text" 
            class="swal2-input" 
            placeholder="Buscar y seleccionar ciudad..." 
            autocomplete="off"
            style="width: 100%; box-sizing: border-box;"
          />
          <datalist id="ciudades-list-create">
            ${ciudadOptions}
          </datalist>
          <input type="hidden" id="swal-input-ciudad" value="" />
        </div>
        <style>
          input[list]::-webkit-calendar-picker-indicator {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>');
            background-size: 16px 16px;
            background-repeat: no-repeat;
            background-position: center;
            cursor: pointer;
          }
        </style>
      `,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        const ciudadInput = document.getElementById('swal-input-ciudad-text') as HTMLInputElement;
        const hiddenInput = document.getElementById('swal-input-ciudad') as HTMLInputElement;
        const datalist = document.getElementById('ciudades-list-create') as HTMLDataListElement;

        // Set up the input to use datalist
        ciudadInput.setAttribute('list', 'ciudades-list-create');

        ciudadInput.addEventListener('input', () => {
          const inputValue = ciudadInput.value;
          const matchedCiudad = ciudades.find(c => c.nombre.toLowerCase() === inputValue.toLowerCase());

          if (matchedCiudad) {
            hiddenInput.value = matchedCiudad.id.toString();
          } else {
            hiddenInput.value = '';
          }
        });

        ciudadInput.addEventListener('blur', () => {
          // Si el usuario sale del campo sin seleccionar una ciudad válida, buscar coincidencia parcial
          const inputValue = ciudadInput.value.toLowerCase();
          const matchedCiudad = ciudades.find(c => c.nombre.toLowerCase().includes(inputValue));

          if (matchedCiudad && inputValue) {
            ciudadInput.value = matchedCiudad.nombre;
            hiddenInput.value = matchedCiudad.id.toString();
          }
        });
      },
      preConfirm: () => {
        const nombre = (document.getElementById('swal-input-nombre') as HTMLInputElement)?.value?.trim();
        const descripcion = (document.getElementById('swal-input-descripcion') as HTMLTextAreaElement)?.value?.trim();
        const direccion = (document.getElementById('swal-input-direccion') as HTMLInputElement)?.value?.trim();
        const telefono = (document.getElementById('swal-input-telefono') as HTMLInputElement)?.value?.trim();
        const email = (document.getElementById('swal-input-email') as HTMLInputElement)?.value?.trim();
        const estrellas = parseInt((document.getElementById('swal-input-estrellas') as HTMLInputElement)?.value, 10);
        const precio_x_dia = parseFloat((document.getElementById('swal-input-precio') as HTMLInputElement)?.value);
        const id_ciudad = parseInt((document.getElementById('swal-input-ciudad') as HTMLInputElement)?.value, 10);

        // Validación mejorada para crear
        if (!nombre?.trim()) {
          Swal.showValidationMessage('El nombre es obligatorio');
          return;
        }
        if (!descripcion?.trim()) {
          Swal.showValidationMessage('La descripción es obligatoria');
          return;
        }
        if (!direccion?.trim()) {
          Swal.showValidationMessage('La dirección es obligatoria');
          return;
        }
        if (!telefono?.trim()) {
          Swal.showValidationMessage('El teléfono es obligatorio');
          return;
        }
        if (!email?.trim()) {
          Swal.showValidationMessage('El email es obligatorio');
          return;
        }
        if (isNaN(estrellas) || estrellas < 1 || estrellas > 5) {
          Swal.showValidationMessage('Las estrellas deben ser un número entre 1 y 5');
          return;
        }
        if (isNaN(precio_x_dia) || precio_x_dia <= 0) {
          Swal.showValidationMessage('El precio por día debe ser un número mayor a 0');
          return;
        }
        if (!id_ciudad || isNaN(id_ciudad)) {
          Swal.showValidationMessage('Debe seleccionar una ciudad válida');
          return;
        }
        
        return { nombre: nombre.trim(), descripcion: descripcion.trim(), direccion: direccion.trim(), telefono: telefono.trim(), email: email.trim(), estrellas, precio_x_dia, id_ciudad };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const response = await axios.post('/api/hotel', result.value);

          // Recargar todos los hoteles para obtener datos completos y actualizados
          await reloadHoteles();

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
            <p><strong>Descripción:</strong> {hotel.descripcion}</p>
            <p><strong>Dirección:</strong> {hotel.direccion}</p>
            <p><strong>Teléfono:</strong> {hotel.telefono}</p>
            <p><strong>Email:</strong> {hotel.email}</p>
            <p><strong>Estrellas:</strong> {hotel.estrellas}</p>
            <p><strong>Precio por día:</strong> ${hotel.precio_x_dia}</p>
            <p><strong>Ciudad:</strong> {hotel.ciudad?.nombre || `ID: ${hotel.id_ciudad || 'N/A'}`}</p>
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