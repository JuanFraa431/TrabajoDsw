import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLinkClick } from '../services/searchService';
import '../styles/Nosotros.css';

const Nosotros: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="nosotros-container">
      {/* Hero Section */}
      <section className="nosotros-hero">
        <div className="hero-overlay">
          <h1>Sobre Nosotros</h1>
          <p className="hero-subtitle">Tu compañero de viajes de confianza</p>
        </div>
      </section>

      {/* Quienes Somos */}
      <section className="seccion-contenido">
        <div className="contenido-wrapper">
          <h2>¿Quiénes Somos?</h2>
          <p className="texto-principal">
            Somos una agencia de viajes dedicada a hacer realidad los sueños de nuestros clientes. 
            Con más de 10 años de experiencia en el sector turístico, nos especializamos en crear 
            experiencias únicas e inolvidables que conectan a las personas con los destinos más 
            fascinantes del mundo.
          </p>
          <p className="texto-secundario">
            Nuestro compromiso es ofrecer servicios de calidad, asesoramiento personalizado y 
            las mejores opciones de paquetes turísticos, hoteles, excursiones y transportes para 
            que cada viaje sea una aventura memorable.
          </p>
        </div>
      </section>

      {/* Misión, Visión, Valores */}
      <section className="seccion-mvv">
        <div className="mvv-grid">
          <div className="mvv-card">
            <div className="mvv-icon">🎯</div>
            <h3>Nuestra Misión</h3>
            <p>
              Facilitar experiencias de viaje excepcionales que superen las expectativas de 
              nuestros clientes, brindando servicios de calidad con atención personalizada y 
              precios competitivos.
            </p>
          </div>

          <div className="mvv-card">
            <div className="mvv-icon">🌟</div>
            <h3>Nuestra Visión</h3>
            <p>
              Ser la agencia de viajes líder en la región, reconocida por nuestra innovación, 
              calidad de servicio y compromiso con la satisfacción total de nuestros clientes.
            </p>
          </div>

          <div className="mvv-card">
            <div className="mvv-icon">💎</div>
            <h3>Nuestros Valores</h3>
            <ul>
              <li>Excelencia en el servicio</li>
              <li>Integridad y transparencia</li>
              <li>Pasión por los viajes</li>
              <li>Compromiso con el cliente</li>
              <li>Innovación constante</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="seccion-beneficios">
        <h2>¿Por Qué Elegirnos?</h2>
        <div className="beneficios-grid">
          <div className="beneficio-item">
            <div className="beneficio-icono">✈️</div>
            <h4>Experiencia Comprobada</h4>
            <p>Más de 10 años conectando viajeros con sus destinos soñados</p>
          </div>

          <div className="beneficio-item">
            <div className="beneficio-icono">💰</div>
            <h4>Mejores Precios</h4>
            <p>Garantizamos tarifas competitivas y ofertas exclusivas</p>
          </div>

          <div className="beneficio-item">
            <div className="beneficio-icono">🤝</div>
            <h4>Atención Personalizada</h4>
            <p>Asesoramiento experto adaptado a tus necesidades</p>
          </div>

          <div className="beneficio-item">
            <div className="beneficio-icono">🌍</div>
            <h4>Destinos Diversos</h4>
            <p>Amplia variedad de destinos nacionales e internacionales</p>
          </div>

          <div className="beneficio-item">
            <div className="beneficio-icono">🔒</div>
            <h4>Reservas Seguras</h4>
            <p>Sistema de reservas confiable y protección de datos</p>
          </div>

          <div className="beneficio-item">
            <div className="beneficio-icono">📞</div>
            <h4>Soporte 24/7</h4>
            <p>Asistencia continua antes, durante y después de tu viaje</p>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="seccion-servicios">
        <h2>Nuestros Servicios</h2>
        <div className="servicios-grid">
          <div className="servicio-card">
            <h3>🏨 Hoteles</h3>
            <p>
              Selección de los mejores alojamientos desde hoteles boutique hasta 
              resorts de lujo en los destinos más populares.
            </p>
          </div>

          <div className="servicio-card">
            <h3>📦 Paquetes Turísticos</h3>
            <p>
              Paquetes completos que incluyen alojamiento, excursiones y transportes 
              para una experiencia sin preocupaciones.
            </p>
          </div>

          <div className="servicio-card">
            <h3>🎒 Excursiones</h3>
            <p>
              Tours guiados y actividades únicas para explorar cada destino 
              de manera auténtica y memorable.
            </p>
          </div>

          <div className="servicio-card">
            <h3>🚌 Transportes</h3>
            <p>
              Servicios de transporte terrestre y aéreo para conectar tus 
              destinos de forma cómoda y segura.
            </p>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="seccion-estadisticas">
        <div className="estadisticas-grid">
          <div className="estadistica-item">
            <div className="estadistica-numero">10+</div>
            <div className="estadistica-label">Años de Experiencia</div>
          </div>

          <div className="estadistica-item">
            <div className="estadistica-numero">5000+</div>
            <div className="estadistica-label">Clientes Satisfechos</div>
          </div>

          <div className="estadistica-item">
            <div className="estadistica-numero">50+</div>
            <div className="estadistica-label">Destinos</div>
          </div>

          <div className="estadistica-item">
            <div className="estadistica-numero">98%</div>
            <div className="estadistica-label">Satisfacción</div>
          </div>
        </div>
      </section>

      {/* Contacto CTA */}
      <section className="seccion-cta">
        <h2>¿Listo para tu Próxima Aventura?</h2>
        <p>Contáctanos hoy y comienza a planificar el viaje de tus sueños</p>
        <div className="cta-buttons">
          <Link to="/paquetes" onClick={(event) => handleLinkClick(event, 'paquete/user', 'paquetes', navigate)} className="btn-primary">Ver Paquetes</Link>
          <a href="/contacto" className="btn-secondary">Contactar</a>
        </div>
      </section>
    </div>
  );
};

export default Nosotros;
