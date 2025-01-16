import React, { useState } from 'react';
import axios from 'axios';

const Mapa = () => {
  const [lugar, setLugar] = useState('');
  const [latitud, setLatitud] = useState(-32.8564736);
  const [longitud, setLongitud] = useState(-60.7813632);

  const buscarLugar = async () => {
    const apiKey = 'TU_CLAVE_DE_API';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(lugar)}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.data.results.length > 0) {
        const { lat, lng } = response.data.data.results[0].geometry.location;
        setLatitud(lat);
        setLongitud(lng);
      } else {
        alert('No se encontraron resultados para la búsqueda.');
      }
    } catch (error) {
      console.error('Error al buscar el lugar:', error);
      alert('Error al buscar el lugar.');
    }
  };

  return (
    <div>
      <h2>Ubicación del Mapa</h2>
      <input
        type="text"
        placeholder="Ingresa un lugar (ej: Lima, Perú)"
        value={lugar}
        onChange={(e) => setLugar(e.target.value)}
      />
      <button onClick={buscarLugar}>Buscar</button>
      
      <iframe
        id="map-iframe"
        src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d26812.60881892444!2d${longitud}!3d${latitud}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sar!4v1728931007113!5m2!1ses-419!2sar`}
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Mapa;