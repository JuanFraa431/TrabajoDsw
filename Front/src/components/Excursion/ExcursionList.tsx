import React, { useState, useEffect } from 'react';
import { Excursion } from '../../interface/excursion';
import { Ciudad } from '../../interface/ciudad';
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
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    setExcursiones(initialExcursiones);
  }, [initialExcursiones]);

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

  const handleEditExcursion = (excursion: Excursion) => {
    const ciudadId = excursion.ciudad?.id || excursion.id_ciudad;
    const selectedCiudad = ciudades.find(c => c.id === ciudadId);
    const ciudadOptions = ciudades.map(ciudad =>
      `<option value="${ciudad.nombre}" data-id="${ciudad.id}">${ciudad.nombre}</option>`
    ).join('');

    MySwal.fire({
      title: 'Editar Excursión',
      html: `
        <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" value="${excursion.nombre || ''}" />
        <textarea id="swal-input-descripcion" class="swal2-textarea" placeholder="Descripción">${excursion.descripcion || ''}</textarea>
        <textarea id="swal-input-detalle" class="swal2-textarea" placeholder="Detalle">${excursion.detalle || ''}</textarea>
        <input id="swal-input-tipo" class="swal2-input" placeholder="Tipo" value="${excursion.tipo || ''}" />
        <input id="swal-input-nro-personas" class="swal2-input" type="number" min="1" placeholder="Número máximo de personas" value="${excursion.nro_personas_max || ''}" />
        <input id="swal-input-nombre-empresa" class="swal2-input" placeholder="Nombre de la empresa" value="${excursion.nombre_empresa || ''}" />
        <input id="swal-input-mail-empresa" class="swal2-input" type="email" placeholder="Email de la empresa" value="${excursion.mail_empresa || ''}" />
        <input id="swal-input-precio" class="swal2-input" type="number" min="0" step="0.01" placeholder="Precio" value="${excursion.precio || ''}" />
        <input id="swal-input-imagen" class="swal2-input" placeholder="URL de la imagen" value="${excursion.imagen || ''}" />
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
        const detalle = (document.getElementById('swal-input-detalle') as HTMLTextAreaElement)?.value;
        const tipo = (document.getElementById('swal-input-tipo') as HTMLInputElement)?.value;
        const nro_personas_max = parseInt((document.getElementById('swal-input-nro-personas') as HTMLInputElement)?.value, 10);
        const nombre_empresa = (document.getElementById('swal-input-nombre-empresa') as HTMLInputElement)?.value;
        const mail_empresa = (document.getElementById('swal-input-mail-empresa') as HTMLInputElement)?.value;
        const precio = parseFloat((document.getElementById('swal-input-precio') as HTMLInputElement)?.value);
        const imagen = (document.getElementById('swal-input-imagen') as HTMLInputElement)?.value;
        const id_ciudad = parseInt((document.getElementById('swal-input-ciudad') as HTMLInputElement)?.value, 10);

        // Validación
        if (!nombre?.trim()) {
          Swal.showValidationMessage('El nombre es obligatorio');
          return;
        }
        if (!descripcion?.trim()) {
          Swal.showValidationMessage('La descripción es obligatoria');
          return;
        }
        if (!detalle?.trim()) {
          Swal.showValidationMessage('El detalle es obligatorio');
          return;
        }
        if (!tipo?.trim()) {
          Swal.showValidationMessage('El tipo es obligatorio');
          return;
        }
        if (isNaN(nro_personas_max) || nro_personas_max <= 0) {
          Swal.showValidationMessage('El número máximo de personas debe ser un número mayor a 0');
          return;
        }
        if (!nombre_empresa?.trim()) {
          Swal.showValidationMessage('El nombre de la empresa es obligatorio');
          return;
        }
        if (!mail_empresa?.trim()) {
          Swal.showValidationMessage('El email de la empresa es obligatorio');
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(mail_empresa)) {
          Swal.showValidationMessage('El email de la empresa debe tener un formato válido');
          return;
        }
        if (isNaN(precio) || precio <= 0) {
          Swal.showValidationMessage('El precio debe ser un número mayor a 0');
          return;
        }
        if (!imagen?.trim()) {
          Swal.showValidationMessage('La URL de la imagen es obligatoria');
          return;
        }
        if (!id_ciudad || isNaN(id_ciudad)) {
          Swal.showValidationMessage('Debe seleccionar una ciudad válida');
          return;
        }

        return {
          ...excursion,
          nombre,
          descripcion,
          detalle,
          tipo,
          nro_personas_max,
          nombre_empresa,
          mail_empresa,
          precio,
          imagen,
          id_ciudad
        };
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
    const ciudadOptions = ciudades.map(ciudad =>
      `<option value="${ciudad.nombre}" data-id="${ciudad.id}">${ciudad.nombre}</option>`
    ).join('');

    MySwal.fire({
      title: 'Crear Excursión',
      html: `
        <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" />
        <textarea id="swal-input-descripcion" class="swal2-textarea" placeholder="Descripción"></textarea>
        <textarea id="swal-input-detalle" class="swal2-textarea" placeholder="Detalle"></textarea>
        <input id="swal-input-tipo" class="swal2-input" placeholder="Tipo" />
        <input id="swal-input-nro-personas" class="swal2-input" type="number" min="1" placeholder="Número máximo de personas" />
        <input id="swal-input-nombre-empresa" class="swal2-input" placeholder="Nombre de la empresa" />
        <input id="swal-input-mail-empresa" class="swal2-input" type="email" placeholder="Email de la empresa" />
        <input id="swal-input-precio" class="swal2-input" type="number" min="0" step="0.01" placeholder="Precio" />
        <input id="swal-input-imagen" class="swal2-input" placeholder="URL de la imagen" />
        <div style="position: relative; width: 100%;">
          <input 
            id="swal-input-ciudad-text" 
            class="swal2-input" 
            placeholder="Buscar y seleccionar ciudad..." 
            autocomplete="off"
            style="width: 100%; box-sizing: border-box;"
          />
          <datalist id="ciudades-list">
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
        const detalle = (document.getElementById('swal-input-detalle') as HTMLTextAreaElement)?.value;
        const tipo = (document.getElementById('swal-input-tipo') as HTMLInputElement)?.value;
        const nro_personas_max = parseInt((document.getElementById('swal-input-nro-personas') as HTMLInputElement)?.value, 10);
        const nombre_empresa = (document.getElementById('swal-input-nombre-empresa') as HTMLInputElement)?.value;
        const mail_empresa = (document.getElementById('swal-input-mail-empresa') as HTMLInputElement)?.value;
        const precio = parseFloat((document.getElementById('swal-input-precio') as HTMLInputElement)?.value);
        const imagen = (document.getElementById('swal-input-imagen') as HTMLInputElement)?.value;
        const id_ciudad = parseInt((document.getElementById('swal-input-ciudad') as HTMLInputElement)?.value, 10);

        // Validación
        if (!nombre?.trim()) {
          Swal.showValidationMessage('El nombre es obligatorio');
          return;
        }
        if (!descripcion?.trim()) {
          Swal.showValidationMessage('La descripción es obligatoria');
          return;
        }
        if (!detalle?.trim()) {
          Swal.showValidationMessage('El detalle es obligatorio');
          return;
        }
        if (!tipo?.trim()) {
          Swal.showValidationMessage('El tipo es obligatorio');
          return;
        }
        if (isNaN(nro_personas_max) || nro_personas_max <= 0) {
          Swal.showValidationMessage('El número máximo de personas debe ser un número mayor a 0');
          return;
        }
        if (!nombre_empresa?.trim()) {
          Swal.showValidationMessage('El nombre de la empresa es obligatorio');
          return;
        }
        if (!mail_empresa?.trim()) {
          Swal.showValidationMessage('El email de la empresa es obligatorio');
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(mail_empresa)) {
          Swal.showValidationMessage('El email de la empresa debe tener un formato válido');
          return;
        }
        if (isNaN(precio) || precio <= 0) {
          Swal.showValidationMessage('El precio debe ser un número mayor a 0');
          return;
        }
        if (!imagen?.trim()) {
          Swal.showValidationMessage('La URL de la imagen es obligatoria');
          return;
        }
        if (!id_ciudad || isNaN(id_ciudad)) {
          Swal.showValidationMessage('Debe seleccionar una ciudad válida');
          return;
        }

        return {
          nombre,
          descripcion,
          detalle,
          tipo,
          nro_personas_max,
          nombre_empresa,
          mail_empresa,
          precio,
          imagen,
          id_ciudad
        };
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
      {excursiones.map((excursion) => (
        <div key={excursion.id} className="card">
          <div className="card-content">
            <h3>{excursion.nombre}</h3>
            <p>Tipo: {excursion.tipo}</p>
            <p>Precio: ${excursion.precio}</p>
            <p>Empresa: {excursion.nombre_empresa}</p>
            <p>Máx. personas: {excursion.nro_personas_max}</p>
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
