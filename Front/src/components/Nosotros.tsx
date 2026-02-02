import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLinkClick } from '../services/searchService';
import '../styles/Nosotros.css';

const Nosotros: React.FC = () => {
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.fade-in-section');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="nosotros-container">
      {/* Hero Section */}
      <section className="nosotros-hero">
        <div className="hero-overlay">
          <h1 className="hero-title slide-in">Sobre Nosotros</h1>
          <p className="hero-subtitle">Tu compañero de viajes de confianza</p>
          <div className="scroll-indicator">
            <p className="scroll-text">Desliza para continuar</p>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </section>

      {/* Quienes Somos */}
      <section className="seccion-contenido fade-in-section">
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
          <div className="mvv-card fade-in-section">
            <div className="mvv-icon-wrapper">
              <svg className="mvv-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Nuestra Misión</h3>
            <p>
              Facilitar experiencias de viaje excepcionales que superen las expectativas de 
              nuestros clientes, brindando servicios de calidad con atención personalizada y 
              precios competitivos.
            </p>
          </div>

          <div className="mvv-card fade-in-section">
            <div className="mvv-icon-wrapper">
              <svg className="mvv-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Nuestra Visión</h3>
            <p>
              Ser la agencia de viajes líder en la región, reconocida por nuestra innovación, 
              calidad de servicio y compromiso con la satisfacción total de nuestros clientes.
            </p>
          </div>

          <div className="mvv-card fade-in-section">
            <div className="mvv-icon-wrapper">
              <svg className="mvv-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
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
        <h2 className="fade-in-section">¿Por Qué Elegirnos?</h2>
        <div className="beneficios-grid">
          <div className="beneficio-item fade-in-section">
            <div className="beneficio-icon-wrapper">
              <svg className="beneficio-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.27002 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4>Experiencia Comprobada</h4>
            <p>Más de 10 años conectando viajeros con sus destinos soñados</p>
          </div>

          <div className="beneficio-item fade-in-section">
            <div className="beneficio-icon-wrapper">
              <svg className="beneficio-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4>Mejores Precios</h4>
            <p>Garantizamos tarifas competitivas y ofertas exclusivas</p>
          </div>

          <div className="beneficio-item fade-in-section">
            <div className="beneficio-icon-wrapper">
              <svg className="beneficio-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4>Atención Personalizada</h4>
            <p>Asesoramiento experto adaptado a tus necesidades</p>
          </div>

          <div className="beneficio-item fade-in-section">
            <div className="beneficio-icon-wrapper">
              <svg className="beneficio-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4>Destinos Diversos</h4>
            <p>Amplia variedad de destinos nacionales e internacionales</p>
          </div>

          <div className="beneficio-item fade-in-section">
            <div className="beneficio-icon-wrapper">
              <svg className="beneficio-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4>Reservas Seguras</h4>
            <p>Sistema de reservas confiable y protección de datos</p>
          </div>

          <div className="beneficio-item fade-in-section">
            <div className="beneficio-icon-wrapper">
              <svg className="beneficio-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59524 1.99522 8.06572 2.16708 8.43369 2.48353C8.80166 2.79999 9.04201 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4>Soporte 24/7</h4>
            <p>Asistencia continua antes, durante y después de tu viaje</p>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="seccion-servicios">
        <h2 className="fade-in-section">Nuestros Servicios</h2>
        <div className="servicios-grid">
          <div className="servicio-card fade-in-section">
            <div className="servicio-icon-wrapper">
              <svg className="servicio-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Hoteles</h3>
            <p>
              Selección de los mejores alojamientos desde hoteles boutique hasta 
              resorts de lujo en los destinos más populares.
            </p>
          </div>

          <div className="servicio-card fade-in-section">
            <div className="servicio-icon-wrapper">
              <svg className="servicio-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V5C20 4.46957 19.7893 3.96086 19.4142 3.58579C19.0391 3.21071 18.5304 3 18 3H6C5.46957 3 4.96086 3.21071 4.58579 3.58579C4.21071 3.96086 4 4.46957 4 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 21H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 10H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Paquetes Turísticos</h3>
            <p>
              Paquetes completos que incluyen alojamiento, excursiones y transportes 
              para una experiencia sin preocupaciones.
            </p>
          </div>

          <div className="servicio-card fade-in-section">
            <div className="servicio-icon-wrapper">
              <svg className="servicio-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Excursiones</h3>
            <p>
              Tours guiados y actividades únicas para explorar cada destino 
              de manera auténtica y memorable.
            </p>
          </div>

          <div className="servicio-card fade-in-section">
            <div className="servicio-icon-wrapper">
              <svg className="servicio-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 3H18C18.5304 3 19.0391 3.21071 19.4142 3.58579C19.7893 3.96086 20 4.46957 20 5V21C20 21.5304 19.7893 22.0391 19.4142 22.4142C19.0391 22.7893 18.5304 23 18 23H6C5.46957 23 4.96086 22.7893 4.58579 22.4142C4.21071 22.0391 4 21.5304 4 21V5C4 4.46957 4.21071 3.96086 4.58579 3.58579C4.96086 3.21071 5.46957 3 6 3H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="8" y="1" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Transportes</h3>
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
          <div className="estadistica-item fade-in-section">
            <div className="estadistica-numero">10+</div>
            <div className="estadistica-label">Años de Experiencia</div>
          </div>

          <div className="estadistica-item fade-in-section">
            <div className="estadistica-numero">5000+</div>
            <div className="estadistica-label">Clientes Satisfechos</div>
          </div>

          <div className="estadistica-item fade-in-section">
            <div className="estadistica-numero">50+</div>
            <div className="estadistica-label">Destinos</div>
          </div>

          <div className="estadistica-item fade-in-section">
            <div className="estadistica-numero">98%</div>
            <div className="estadistica-label">Satisfacción</div>
          </div>
        </div>
      </section>

      {/* Contacto CTA */}
      <section className="seccion-cta fade-in-section">
        <h2>¿Listo para tu Próxima Aventura?</h2>
        <p>Contáctanos hoy y comienza a planificar el viaje de tus sueños</p>
        <div className="cta-buttons">
          <Link to="/paquetes" onClick={(event) => handleLinkClick(event, 'paquete/user', 'paquetes', navigate)} className="btn-primary">Ver Paquetes</Link>
        </div>
      </section>
    </div>
  );
};

export default Nosotros;
