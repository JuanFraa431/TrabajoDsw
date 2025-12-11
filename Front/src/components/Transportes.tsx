import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Transporte } from '../interface/transporte';
import { Ciudad } from '../interface/ciudad';
import { TipoTransporte } from '../interface/tipoTransporte';
import '../styles/Transportes.css';

const Transportes: React.FC = () => {
  const [transportes, setTransportes] = useState<Transporte[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [tiposTransporte, setTiposTransporte] = useState<TipoTransporte[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [tipoTransporte, setTipoTransporte] = useState<string>('');
  const [ciudadOrigen, setCiudadOrigen] = useState<string>('');
  const [ciudadDestino, setCiudadDestino] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transportesRes, ciudadesRes, tiposRes] = await Promise.all([
        axios.get('/api/transporte'),
        axios.get('/api/ciudad'),
        axios.get('/api/tipoTransporte')
      ]);
      
      setTransportes(transportesRes.data.data || []);
      setCiudades(ciudadesRes.data.data || []);
      setTiposTransporte(tiposRes.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setLoading(false);
    }
  };

  const transportesFiltrados = transportes.filter(t => {
    if (tipoTransporte && t.tipoTransporte?.id !== Number(tipoTransporte)) return false;
    if (ciudadOrigen && t.ciudadOrigen?.id !== Number(ciudadOrigen)) return false;
    if (ciudadDestino && t.ciudadDestino?.id !== Number(ciudadDestino)) return false;
    return true;
  });

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando transportes...</div>;
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Reservá tu Transporte</h1>
        <p>Encontrá los mejores vuelos y viajes en colectivo</p>
      </div>

      {/* Filtros */}
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        marginBottom: '30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Tipo</label>
          <select 
            value={tipoTransporte} 
            onChange={(e) => setTipoTransporte(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e0e0e0' }}
          >
            <option value="">Todos</option>
            {tiposTransporte.map(tipo => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Origen</label>
          <select 
            value={ciudadOrigen} 
            onChange={(e) => setCiudadOrigen(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e0e0e0' }}
          >
            <option value="">Todas</option>
            {ciudades.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Destino</label>
          <select 
            value={ciudadDestino} 
            onChange={(e) => setCiudadDestino(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e0e0e0' }}
          >
            <option value="">Todas</option>
            {ciudades.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => { setTipoTransporte(''); setCiudadOrigen(''); setCiudadDestino(''); }}
          style={{ 
            padding: '10px 20px', 
            background: '#95a5a6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer',
            alignSelf: 'end'
          }}
        >
          Limpiar
        </button>
      </div>

      {/* Resultados */}
      <h2 style={{ marginBottom: '20px' }}>
        {transportesFiltrados.length} resultado{transportesFiltrados.length !== 1 ? 's' : ''}
      </h2>

      {transportesFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#7f8c8d' }}>
          <p>No se encontraron transportes</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
          gap: '30px' 
        }}>
          {transportesFiltrados.map(t => (
            <div key={t.id} style={{ 
              background: 'white', 
              borderRadius: '16px', 
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{ 
                padding: '20px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ 
                  background: 'white', 
                  color: '#667eea', 
                  padding: '6px 16px', 
                  borderRadius: '20px',
                  fontWeight: 'bold'
                }}>
                  {t.tipoTransporte?.nombre || 'N/A'}
                </span>
                <span>{t.nombre_empresa}</span>
              </div>

              <div style={{ padding: '30px 20px', background: '#f8f9fa' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 5px 0' }}>{t.ciudadOrigen?.nombre || 'N/A'}</h3>
                    <small style={{ color: '#7f8c8d' }}>{t.ciudadOrigen?.pais}</small>
                  </div>
                  <div style={{ fontSize: '2.5em' }}>
                    {t.tipoTransporte?.nombre === 'Avión' ? '✈️' : '🚌'}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 5px 0' }}>{t.ciudadDestino?.nombre || 'N/A'}</h3>
                    <small style={{ color: '#7f8c8d' }}>{t.ciudadDestino?.pais}</small>
                  </div>
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                <p style={{ color: '#555', marginBottom: '15px' }}>{t.descripcion}</p>
                <div style={{ fontSize: '0.9em', color: '#7f8c8d' }}>
                  <div>📍 {t.nombre}</div>
                  <div>💺 {t.capacidad} asientos</div>
                </div>
              </div>

              <div style={{ 
                padding: '20px', 
                background: '#f8f9fa', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #e0e0e0'
              }}>
                <div>
                  <div style={{ fontSize: '0.85em', color: '#7f8c8d' }}>Precio</div>
                  <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#27ae60' }}>
                    ${t.precio || 0}
                  </div>
                </div>
                <button style={{ 
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  Reservar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transportes;

