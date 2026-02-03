import React, { useEffect, useMemo, useState } from 'react';
import '../styles/FiltroHoteles.css';
import { Hotel } from '../interface/hotel';

export type HotelesFiltros = {
  search: string;
  ciudades: number[];
  estrellas: number[];
  precioMax: number | null;
};

type Props = {
  hoteles: Hotel[];
  onFiltrar: (filtros: HotelesFiltros) => void;
};

type OpcionConCantidad<T> = {
  value: T;
  label: string;
  count: number;
};

const FiltroHoteles: React.FC<Props> = ({ hoteles, onFiltrar }) => {
  const ciudadOptions = useMemo((): OpcionConCantidad<number>[] => {
    const map = new Map<number, { label: string; count: number }>();
    for (const hotel of hoteles) {
      const id = hotel.ciudad?.id ?? hotel.id_ciudad;
      const label = hotel.ciudad?.nombre ?? 'Sin ciudad';
      if (!id) continue;
      map.set(id, { label, count: (map.get(id)?.count ?? 0) + 1 });
    }
    return Array.from(map.entries())
      .map(([value, { label, count }]) => ({ value, label, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [hoteles]);

  const estrellasOptions = useMemo((): OpcionConCantidad<number>[] => {
    const map = new Map<number, number>();
    for (const hotel of hoteles) {
      const estrellas = Number(hotel.estrellas);
      if (!Number.isFinite(estrellas)) continue;
      map.set(estrellas, (map.get(estrellas) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([value, count]) => ({ value, label: `${value}★`, count }))
      .sort((a, b) => b.value - a.value);
  }, [hoteles]);

  const maxPrecio = useMemo(() => {
    if (hoteles.length === 0) return 0;
    return Math.max(...hoteles.map((h) => Number(h.precio_x_dia) || 0), 0);
  }, [hoteles]);

  const [search, setSearch] = useState('');
  const [selectedCiudades, setSelectedCiudades] = useState<number[]>([]);
  const [selectedEstrellas, setSelectedEstrellas] = useState<number[]>([]);
  const [precioMax, setPrecioMax] = useState<number>(maxPrecio);

  useEffect(() => {
    setPrecioMax(maxPrecio);
  }, [maxPrecio]);

  useEffect(() => {
    onFiltrar({
      search,
      ciudades: selectedCiudades,
      estrellas: selectedEstrellas,
      precioMax: maxPrecio > 0 ? precioMax : null,
    });
  }, [search, selectedCiudades, selectedEstrellas, precioMax, maxPrecio, onFiltrar]);

  const toggleNumber = (arr: number[], value: number, checked: boolean) => {
    if (checked) return Array.from(new Set([...arr, value]));
    return arr.filter((v) => v !== value);
  };

  const limpiar = () => {
    setSearch('');
    setSelectedCiudades([]);
    setSelectedEstrellas([]);
    setPrecioMax(maxPrecio);
  };

  return (
    <aside className="filtro-hoteles-sidebar">
      <div className="filtro-hoteles-header">
        <h2 className="filtro-hoteles-title">Filtros</h2>
        <button className="filtro-hoteles-clear" onClick={limpiar}>
          Limpiar
        </button>
      </div>

      <div className="filtro-hoteles-section">
        <h3 className="filtro-hoteles-section-title">Buscar</h3>
        <div className="filtro-hoteles-search">
          <input
            type="text"
            value={search}
            placeholder="Nombre, ciudad o dirección..."
            onChange={(e) => setSearch(e.target.value)}
            className="filtro-hoteles-input"
          />
        </div>
      </div>

      <div className="filtro-hoteles-section">
        <h3 className="filtro-hoteles-section-title">Precio máximo por noche</h3>
        <div className="filtro-hoteles-range">
          <input
            type="range"
            min={0}
            max={Math.max(0, Math.ceil(maxPrecio))}
            value={precioMax}
            onChange={(e) => setPrecioMax(Number(e.target.value))}
            disabled={maxPrecio <= 0}
          />
          <div className="filtro-hoteles-range-label">${maxPrecio > 0 ? precioMax : 0}</div>
        </div>
      </div>

      <div className="filtro-hoteles-section">
        <h3 className="filtro-hoteles-section-title">Estrellas</h3>
        <div className="filtro-hoteles-options">
          {estrellasOptions.length > 0 ? (
            estrellasOptions.map((opt) => (
              <label className="filtro-hoteles-option" key={opt.value}>
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={selectedEstrellas.includes(opt.value)}
                  onChange={(e) =>
                    setSelectedEstrellas(
                      toggleNumber(selectedEstrellas, opt.value, e.target.checked)
                    )
                  }
                  className="filtro-hoteles-checkbox"
                />
                <span className="filtro-hoteles-checkmark"></span>
                <span className="filtro-hoteles-label">
                  {opt.label}
                  <span className="filtro-hoteles-count">({opt.count})</span>
                </span>
              </label>
            ))
          ) : (
            <div className="filtro-hoteles-empty">Sin datos</div>
          )}
        </div>
      </div>

      <div className="filtro-hoteles-section">
        <h3 className="filtro-hoteles-section-title">Ciudad</h3>
        <div className="filtro-hoteles-options">
          {ciudadOptions.length > 0 ? (
            ciudadOptions.map((opt) => (
              <label className="filtro-hoteles-option" key={opt.value}>
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={selectedCiudades.includes(opt.value)}
                  onChange={(e) =>
                    setSelectedCiudades(
                      toggleNumber(selectedCiudades, opt.value, e.target.checked)
                    )
                  }
                  className="filtro-hoteles-checkbox"
                />
                <span className="filtro-hoteles-checkmark"></span>
                <span className="filtro-hoteles-label">
                  {opt.label}
                  <span className="filtro-hoteles-count">({opt.count})</span>
                </span>
              </label>
            ))
          ) : (
            <div className="filtro-hoteles-empty">Sin datos</div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default FiltroHoteles;
