import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/CardDetail.css';
import { Comentario } from '../interface/comentario';
import userIcon from "../images/user-icon.png";
import { FaTrash } from 'react-icons/fa';

const CardDetail: React.FC = () => {
    const location = useLocation();
    const clienteLogueado = localStorage.getItem('user');
    const userData = clienteLogueado ? JSON.parse(clienteLogueado) : null;
    const isAdmin = userData && userData.tipo_usuario === 'admin';
    const { id } = location.state || { id: null };
    const [paquete, setPaquete] = useState<any>(null);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [nuevoComentario, setNuevoComentario] = useState<string>("");
    const [estrellas, setEstrellas] = useState<number>(0);
    const [mostrarDescripcionCompleta, setMostrarDescripcionCompleta] = useState<boolean>(false);

    useEffect(() => {
        const fetchPaquete = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/paquete/${id}`);
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
        if(paquete) {
            setComentarios(paquete.comentarios);
        }
    }, [paquete]);

    const agregarComentario = async () => {
        if (!nuevoComentario.trim() || estrellas === 0) {
            alert('Por favor, completa el comentario y selecciona una calificación.');
            return;
        }

        try {
            const newComentario = {
                cliente: clienteLogueado ? JSON.parse(clienteLogueado).id : null,
                paquete: id,
                fecha: new Date().toISOString().split('T')[0],
                descripcion: nuevoComentario,
                estrellas
            };
            
            const response = await axios.post('http://localhost:3000/api/comentario', newComentario);
            
            const comentarioCreado: Comentario = { 
                id: response.data.id,
                cliente: userData,
                paquete: id,
                fecha: newComentario.fecha,
                descripcion: newComentario.descripcion,
                estrellas: newComentario.estrellas 
            }; 
            setComentarios(prev => [...prev, comentarioCreado]);
            setNuevoComentario("");
            setEstrellas(0);
        } catch (error) {
            console.error("Error adding comentario:", error);
        }
    };

    const handleDeleteComentario = async (comentarioId: number) => {
        const confirmacion = window.confirm("¿Estás seguro que deseas borrar este comentario?");
        if (!confirmacion) {
            return; 
        }

        try {
            await axios.delete(`http://localhost:3000/api/comentario/${comentarioId}`);
            setComentarios(prev => prev.filter(comentario => comentario.id !== comentarioId)); 
        } catch (error) {
            console.error("Error al borrar el comentario:", error);
        }
    };

    const toggleDescripcion = () => {
        setMostrarDescripcionCompleta(!mostrarDescripcionCompleta);
    };

    const descripcionTruncada = (descripcion: string, maxLength: number) => {
        if (descripcion.length > maxLength) {
            return descripcion.substring(0, maxLength) + "...";
        }
        return descripcion;
    };

    const renderEstrellas = (estrellas: number) => {
        return '★'.repeat(estrellas) + '☆'.repeat(5 - estrellas);
    };

    return (
        <div className="card-detail-container">
            <h2 className="title">Detalles del Paquete</h2>
            {paquete && (
                <div className="detail-layout">
                    <div className="image-container">
                        <img src={paquete.imagen} alt={paquete.nombre} className="package-image" />
                    </div>
                    <div className="info-container">
                        <div className="details">
                            <p><strong>Detalles:</strong> {paquete.detalle}</p>
                            <p className="price"><strong>Desde:</strong> {new Date(paquete.fecha_ini).toLocaleDateString('es-ES')}</p>
                            <p className='price'><strong>Hasta:</strong> {new Date(paquete.fecha_fin).toLocaleDateString('es-ES')} </p>
                        </div>
                        <div className="price-box">
                            <p className="price-per-night">Precio por noche</p>
                            <p className="price-total">${paquete.precio}</p>
                            <Link
                                to="/reservar"
                                state={{ paquete }}
                                className="reserve-button"
                            >
                                Reservar Ahora
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="description-section">
                <h3>Descripción</h3>
                <p>
                    {mostrarDescripcionCompleta
                        ? paquete?.descripcion
                        : descripcionTruncada(paquete?.descripcion || "", 100)}
                </p>
                <button onClick={toggleDescripcion} className="verMas-button">
                    {mostrarDescripcionCompleta ? "Ver menos" : "Ver más"}
                </button>
            </div>

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
                                        onError={(e) => { e.currentTarget.src = userIcon; }}
                                    />
                                </div>
                                <div className="comment-details">
                                    <div className='nombre-fecha-comentario'>
                                        <p className='comentario-p'><strong>{comentario.cliente?.username}</strong></p>
                                        <p className='fecha-comentario comentario-p'>{new Date(comentario.fecha).toISOString().split('T')[0]}</p>
                                    </div>
                                    <p className='comentario-p'>{comentario.descripcion}</p>
                                    <p className="stars-display comentario-p">{renderEstrellas(comentario.estrellas)}</p>

                                    {(isAdmin || (comentario.cliente?.id === userData?.id)) && userData && (
                                        <button 
                                            className="delete-button" 
                                            onClick={() => handleDeleteComentario(comentario.id)}
                                        >
                                            <FaTrash className="trash-icon"/>Borrar
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
                            <select value={estrellas} onChange={(e) => setEstrellas(Number(e.target.value))}>
                                <option value={0}>Seleccione</option>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <option key={star} value={star}>{star}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={agregarComentario} className="add-comment-button">Agregar comentario</button>
                    </div>
                ) : (
                    <p>Debes estar logueado para agregar un comentario.</p>
                )}
            </div>
        </div>
    );
};

export default CardDetail;
