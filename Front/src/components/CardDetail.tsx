import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../styles/CardDetail.css";
import { Comentario } from "../interface/comentario";
import userIcon from "../images/user-icon.png";
import {
  FaTrash,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaHotel,
  FaRoute,
  FaBus,
} from "react-icons/fa";
import { MdOutlineDescription, MdTour } from "react-icons/md";
import {
  calcularPrecioTotalPaquete,
  calcularDiasPaquete,
  descripcionTruncada,
  obtenerRangoFechasPaquete,
} from "../utils/paqueteUtils";

const CardDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const clienteLogueado = localStorage.getItem("user");
  const userData = clienteLogueado ? JSON.parse(clienteLogueado) : null;
  const isLoggedIn = Boolean(userData?.id);
  const isAdmin = userData && userData.tipo_usuario === "ADMIN";
  const { id } = location.state || { id: null };
  const [paquete, setPaquete] = useState<any>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState<string>("");
  const [estrellas, setEstrellas] = useState<number>(0);
  const [mostrarDescripcionCompleta, setMostrarDescripcionCompleta] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchPaquete = async () => {
      try {
        const response = await axios.get(`/api/paquete/${id}`);
        setPaquete(response.data.data);
      } catch (error) {
        console.error("Error fetching paquete:", error);
      }
    };

    if (id) {
      fetchPaquete();
    }
  }, [id]);

  useEffect(() => {
    if (paquete) {
      setComentarios(paquete.comentarios);
      // Scroll al principio después de que todo el contenido haya cargado
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
      }, 0);
    }
  }, [paquete]);

  const agregarComentario = async () => {
    if (!nuevoComentario.trim() || estrellas === 0) {
      alert("Por favor, completa el comentario y selecciona una calificación.");
      return;
    }

    try {
      const newComentario = {
        cliente: clienteLogueado ? JSON.parse(clienteLogueado).id : null,
        paquete: id,
        fecha: new Date().toISOString().split("T")[0],
        descripcion: nuevoComentario,
        estrellas,
      };

      const response = await axios.post(`/api/comentario`, newComentario);

      const comentarioCreado: Comentario = {
        id: response.data.id,
        cliente: userData,
        paquete: id,
        fecha: newComentario.fecha,
        descripcion: newComentario.descripcion,
        estrellas: newComentario.estrellas,
      };
      setComentarios((prev) => [...prev, comentarioCreado]);
      setNuevoComentario("");
      setEstrellas(0);
    } catch (error) {
      console.error("Error adding comentario:", error);
    }
  };

  const handleReservarClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isLoggedIn) {
      event.preventDefault();
      navigate("/login");
    }
  };

  const handleDeleteComentario = async (comentarioId: number) => {
    const confirmacion = window.confirm(
      "¿Estás seguro que deseas borrar este comentario?",
    );
    if (!confirmacion) {
      return;
    }

    try {
      await axios.delete(`/api/comentario/${comentarioId}`);
      setComentarios((prev) =>
        prev.filter((comentario) => comentario.id !== comentarioId),
      );
    } catch (error) {
      console.error("Error al borrar el comentario:", error);
    }
  };

  const toggleDescripcion = () => {
    setMostrarDescripcionCompleta(!mostrarDescripcionCompleta);
  };

  const renderEstrellas = (estrellas: number) => {
    return "★".repeat(estrellas) + "☆".repeat(5 - estrellas);
  };

  const rangoFechas = paquete ? obtenerRangoFechasPaquete(paquete) : null;

  return (
    <div className="card-detail-container">
      {paquete && (
        <>
          {/* HERO SECTION */}
          <div className="detail-hero">
            <div className="hero-image-container">
              <img
                src={paquete.imagen}
                alt={paquete.nombre}
                className="hero-image"
              />
              <span className="hero-badge">
                {calcularDiasPaquete(paquete)} días
              </span>
            </div>

            <div className="hero-info">
              <div>
                <h1 className="package-title">{paquete.nombre}</h1>
                <p className="package-subtitle">{paquete.detalle}</p>

                <div className="date-range">
                  <div className="date-item">
                    <div className="date-icon">
                      <FaCalendarAlt />
                    </div>
                    <div className="date-content">
                      <span className="date-label">Fecha de inicio</span>
                      <span className="date-value">
                        {rangoFechas?.fechaIni
                          ? rangoFechas.fechaIni.toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "No especificada"}
                      </span>
                    </div>
                  </div>

                  <div className="date-item">
                    <div className="date-icon">
                      <FaCalendarAlt />
                    </div>
                    <div className="date-content">
                      <span className="date-label">Fecha de fin</span>
                      <span className="date-value">
                        {rangoFechas?.fechaFin
                          ? rangoFechas.fechaFin.toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "No especificada"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="price-section">
                  <p className="price-label">Precio total del paquete</p>
                  <p className="price-amount">
                    ${calcularPrecioTotalPaquete(paquete)}
                  </p>
                  <Link
                    to="/reservar"
                    state={{
                      paquete: {
                        ...paquete,
                        precio: calcularPrecioTotalPaquete(paquete),
                      },
                    }}
                    className="reserve-button"
                    onClick={handleReservarClick}
                  >
                    Reservar Ahora
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENEDOR DE SECCIONES */}
          <div className="sections-wrapper">
            {/* DESCRIPCIÓN */}
            <div className="description-section">
              <h2 className="section-title">
                <span className="section-icon">
                  <MdOutlineDescription />
                </span>
                Descripción
              </h2>
              <p className="description-text">
                {mostrarDescripcionCompleta
                  ? paquete?.descripcion
                  : descripcionTruncada(paquete?.descripcion || "", 200)}
              </p>
              {paquete?.descripcion?.length > 200 && (
                <button
                  onClick={toggleDescripcion}
                  className="toggle-description-btn"
                >
                  {mostrarDescripcionCompleta ? "Ver menos" : "Ver más"}
                </button>
              )}
            </div>

            {/* EXCURSIONES */}
            <div className="content-section">
              <h2 className="section-title">
                <span className="section-icon">
                  <MdTour />
                </span>
                Excursiones incluidas
              </h2>
              {paquete?.paqueteExcursiones?.length > 0 ? (
                <div className="content-grid">
                  {paquete.paqueteExcursiones.map((paqueteExc: any) => (
                    <div key={paqueteExc.id} className="item-card">
                      {paqueteExc.excursion?.imagen && (
                        <img
                          src={paqueteExc.excursion.imagen}
                          alt={paqueteExc.excursion.nombre}
                          className="item-card-image"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <div className="item-card-content">
                        <h3 className="item-card-title">
                          {paqueteExc.excursion?.nombre}
                        </h3>
                        <p className="item-card-description">
                          {paqueteExc.excursion?.descripcion}
                        </p>
                        <div className="item-card-meta">
                          <span className="meta-tag">
                            <FaCalendarAlt className="meta-tag-icon" />
                            {paqueteExc.fecha
                              ? new Date(paqueteExc.fecha).toLocaleString(
                                  "es-ES",
                                )
                              : "Fecha no especificada"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p className="empty-state-text">
                    No hay excursiones incluidas en este paquete
                  </p>
                </div>
              )}
            </div>

            {/* ESTADÍAS */}
            <div className="content-section">
              <h2 className="section-title">
                <span className="section-icon">
                  <FaHotel />
                </span>
                Estadías incluidas
              </h2>
              {paquete?.estadias?.length > 0 ? (
                <div className="content-grid">
                  {paquete.estadias.map((estadia: any) => (
                    <div key={estadia.id} className="item-card">
                      {estadia.hotel?.imagen && (
                        <img
                          src={estadia.hotel.imagen}
                          alt={estadia.hotel.nombre}
                          className="item-card-image"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <div className="item-card-content">
                        <h3 className="item-card-title">
                          {estadia.hotel?.nombre}
                        </h3>
                        <p className="item-card-description">
                          {estadia.hotel?.direccion}
                        </p>
                        <div className="item-card-meta">
                          <span className="meta-tag">
                            <FaCalendarAlt className="meta-tag-icon" />
                            {new Date(estadia.fecha_ini).toLocaleDateString(
                              "es-ES",
                            )}
                          </span>
                          <span className="meta-tag">
                            <FaArrowRight className="meta-tag-icon" />
                            {new Date(estadia.fecha_fin).toLocaleDateString(
                              "es-ES",
                            )}
                          </span>
                          {estadia.hotel?.ciudad?.nombre && (
                            <span className="meta-tag">
                              <FaMapMarkerAlt className="meta-tag-icon" />
                              {estadia.hotel.ciudad.nombre}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p className="empty-state-text">
                    No hay estadías incluidas en este paquete
                  </p>
                </div>
              )}
            </div>

            {/* TRANSPORTES */}
            <div className="content-section">
              <h2 className="section-title">
                <span className="section-icon">
                  <FaBus />
                </span>
                Transportes incluidos
              </h2>
              {paquete?.paqueteTransportes?.length > 0 ? (
                <div className="content-grid">
                  {paquete.paqueteTransportes.map((paqueteTrans: any) => (
                    <div key={paqueteTrans.id} className="item-card">
                      <div className="item-card-content">
                        <span
                          className={`transport-type-badge ${
                            paqueteTrans.tipo === "IDA" ? "ida" : "vuelta"
                          }`}
                        >
                          {paqueteTrans.tipo === "IDA" ? "Ida" : "Vuelta"}
                        </span>
                        <h3 className="item-card-title">
                          {paqueteTrans.nombre_empresa || "Transporte"}
                        </h3>
                        <p className="item-card-description">
                          {paqueteTrans.tipoTransporte?.nombre ||
                            "Tipo no especificado"}
                        </p>
                        <div className="item-card-meta">
                          <span className="meta-tag">
                            <FaCalendarAlt className="meta-tag-icon" />
                            {paqueteTrans.fecha_salida
                              ? new Date(
                                  paqueteTrans.fecha_salida,
                                ).toLocaleString("es-ES")
                              : "Salida no especificada"}
                          </span>
                          <span className="meta-tag">
                            <FaArrowRight className="meta-tag-icon" />
                            {paqueteTrans.fecha_llegada
                              ? new Date(
                                  paqueteTrans.fecha_llegada,
                                ).toLocaleString("es-ES")
                              : "Llegada no especificada"}
                          </span>
                        </div>
                        {paqueteTrans.ciudadOrigen &&
                          paqueteTrans.ciudadDestino && (
                            <div className="route-display">
                              <span className="route-city">
                                {paqueteTrans.ciudadOrigen.nombre}
                              </span>
                              <FaArrowRight className="route-arrow" />
                              <span className="route-city">
                                {paqueteTrans.ciudadDestino.nombre}
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p className="empty-state-text">
                    No hay transportes incluidos en este paquete
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* COMENTARIOS - SIN CAMBIOS */}
      <div className="comments-section">
        <h3>Comentarios</h3>
        <div className="comments-list">
          {comentarios.length > 0 ? (
            comentarios.map((comentario) => (
              <div key={comentario.id} className="comment">
                <div className="client-info">
                  <img
                    src={comentario.cliente?.imagen || userIcon}
                    className="client-image"
                    alt={comentario.cliente?.username}
                    onError={(e) => {
                      e.currentTarget.src = userIcon;
                    }}
                  />
                </div>
                <div className="comment-details">
                  <div className="nombre-fecha-comentario">
                    <p className="comentario-p">
                      <strong>{comentario.cliente?.username}</strong>
                    </p>
                    <p className="fecha-comentario comentario-p">
                      {new Date(comentario.fecha).toISOString().split("T")[0]}
                    </p>
                  </div>
                  <p className="comentario-p">{comentario.descripcion}</p>
                  <p className="stars-display comentario-p">
                    {renderEstrellas(comentario.estrellas)}
                  </p>

                  {(isAdmin || comentario.cliente?.id === userData?.id) &&
                    userData && (
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteComentario(comentario.id)}
                      >
                        <FaTrash className="trash-icon" />
                        Borrar
                      </button>
                    )}
                </div>
              </div>
            ))
          ) : (
            <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          )}
        </div>
        {clienteLogueado ? (
          <div className="add-comment">
            <textarea
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              placeholder="Escribe tu comentario aquí..."
            />
            <div className="rating-section">
              <label>Estrellas: </label>
              <select
                value={estrellas}
                onChange={(e) => setEstrellas(Number(e.target.value))}
              >
                <option value={0}>Seleccione</option>
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={agregarComentario} className="add-comment-button">
              Agregar comentario
            </button>
          </div>
        ) : (
          <p>Debes estar logueado para agregar un comentario.</p>
        )}
      </div>
    </div>
  );
};

export default CardDetail;
