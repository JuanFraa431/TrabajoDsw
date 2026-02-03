import React, { useEffect, useMemo, useState } from 'react';
import '../styles/Hoteles.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { Hotel } from '../interface/hotel';
import FiltroHoteles, { HotelesFiltros } from './FiltroHotel';

const MySwal = withReactContent(Swal);

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

const Hoteles: React.FC = () => {
  const location = useLocation();

  const [hoteles, setHoteles] = useState<Hotel[]>(
    (location.state as any)?.hoteles ?? []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<HotelesFiltros>({
    search: '',
    ciudades: [],
    estrellas: [],
    precioMax: null,
  });

  useEffect(() => {
    const stateHoteles = (location.state as any)?.hoteles as Hotel[] | undefined;
    if (Array.isArray(stateHoteles)) {
      setHoteles(stateHoteles);
    }
  }, [location.state]);

  useEffect(() => {
    const stateHoteles = (location.state as any)?.hoteles as Hotel[] | undefined;
    if (Array.isArray(stateHoteles) && stateHoteles.length > 0) return;

    const fetchHoteles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/hotel');
        setHoteles(response.data.data || response.data);
      } catch (e: any) {
        setError(e?.message ?? 'No se pudieron cargar los hoteles');
      } finally {
        setLoading(false);
      }
    };

    fetchHoteles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hotelesFiltrados = useMemo(() => {
    const search = normalize(filtros.search.trim());
    const hasSearch = search.length > 0;

    return hoteles.filter((h) => {
      const ciudadId = h.ciudad?.id ?? h.id_ciudad;
      const ciudadNombre = h.ciudad?.nombre ?? '';

      if (filtros.ciudades.length > 0 && ciudadId) {
        if (!filtros.ciudades.includes(ciudadId)) return false;
      } else if (filtros.ciudades.length > 0 && !ciudadId) {
        return false;
      }

      if (filtros.estrellas.length > 0) {
        if (!filtros.estrellas.includes(Number(h.estrellas))) return false;
      }

      if (typeof filtros.precioMax === 'number' && filtros.precioMax > 0) {
        if ((Number(h.precio_x_dia) || 0) > filtros.precioMax) return false;
      }

      if (hasSearch) {
        const haystack = normalize(
          `${h.nombre ?? ''} ${h.descripcion ?? ''} ${h.direccion ?? ''} ${ciudadNombre}`
        );
        if (!haystack.includes(search)) return false;
      }

      return true;
    });
  }, [hoteles, filtros]);

  const openDetalle = (hotel: Hotel) => {
    const ciudad = hotel.ciudad?.nombre ?? '—';

    MySwal.fire({
      title: hotel.nombre,
      html: `
        <div style="text-align:left; display:flex; flex-direction:column; gap:10px;">
          <div><b>Ciudad:</b> ${ciudad}</div>
          <div><b>Dirección:</b> ${hotel.direccion}</div>
          <div><b>Estrellas:</b> ${hotel.estrellas}★</div>
          <div><b>Precio por noche:</b> $${hotel.precio_x_dia}</div>
          <div><b>Teléfono:</b> ${hotel.telefono}</div>
          <div><b>Email:</b> ${hotel.email}</div>
          <div><b>Descripción:</b><br/>${hotel.descripcion}</div>
        </div>
      `,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#0ea5e9',
    });
  };

  return (
    <div className="hoteles-container">
      <FiltroHoteles hoteles={hoteles} onFiltrar={setFiltros} />

      <div className="hoteles-content">
        <div className="hoteles-header">
          <h1 className="hoteles-title">Hoteles Disponibles</h1>
          <p className="hoteles-subtitle">
            Encuentra el alojamiento ideal filtrando por ciudad, estrellas y precio
          </p>
        </div>

        {loading ? (
          <div className="hoteles-empty">
            <div className="empty-icon">⏳</div>
            <h3>Cargando hoteles...</h3>
            <p>Un momento por favor</p>
          </div>
        ) : error ? (
          <div className="hoteles-empty">
            <div className="empty-icon">⚠️</div>
            <h3>No se pudieron cargar hoteles</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div className="hoteles-grid">
            {hotelesFiltrados.length > 0 ? (
              hotelesFiltrados.map((hotel) => (
                <div className="hotel-card" key={hotel.id}>
                  <div className="hotel-image-container">
                    <div className="hotel-image-placeholder">
                      <div className="hotel-badges">
                        <span className="hotel-badge">{hotel.estrellas}★</span>
                        <span className="hotel-badge secondary">
                          {hotel.ciudad?.nombre ?? 'Ciudad'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="hotel-content">
                    <h3 className="hotel-title">{hotel.nombre}</h3>
                    <p className="hotel-description">{hotel.descripcion}</p>

                    <div className="hotel-footer">
                      <div className="hotel-price">
                        <span className="price-label">Desde</span>
                        <span className="price-amount">${hotel.precio_x_dia}</span>
                        <span className="price-person">por noche</span>
                      </div>
                      <button className="hotel-btn" onClick={() => openDetalle(hotel)}>
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="hoteles-empty">
                <div className="empty-icon">🔍</div>
                <h3>No se encontraron hoteles</h3>
                <p>Intenta ajustar los filtros para encontrar más opciones</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hoteles;
