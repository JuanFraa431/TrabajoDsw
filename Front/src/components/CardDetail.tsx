import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/CardDetail.css';
import { Comentario } from '../interface/comentario';
import userIcon from "../images/user-icon.png";

const CardDetail: React.FC = () => {
    const location = useLocation();
    const clienteLogueado = localStorage.getItem('user');
    const { id } = location.state || { id: null };
    const [paquete, setPaquete] = useState<any>(null);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [nuevoComentario, setNuevoComentario] = useState<string>("");
    const [estrellas, setEstrellas] = useState<number>(0);
    const [mostrarDescripcionCompleta, setMostrarDescripcionCompleta] = useState<boolean>(false);

    useEffect(() => {
        const fetchPaquete = async () => {
            const response = await axios.get(`http://localhost:3000/api/paquete/${id}`);
            setPaquete(response.data);
        };

        const fetchComentarios = async () => {
            const response = await axios.get(`http://localhost:3000/api/comentario/paquete/${id}`);
            const comentariosConCliente = await Promise.all(response.data.map(async (comentario: Comentario) => {
                const cliente = await fetchClienteComentario(comentario.id_cliente);
                return { ...comentario, cliente };
            }));
            setComentarios(comentariosConCliente);
        };

        if (id) {
            fetchPaquete();
            fetchComentarios();
        }
    }, [id]);

    const fetchClienteComentario = async (clienteId: number) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/cliente/${clienteId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching cliente:", error);
            return null;
        }
    };

    const agregarComentario = async () => {
        if (!nuevoComentario.trim() || estrellas === 0) {
            alert('Por favor, completa el comentario y selecciona una calificación.');
            return;
        }

        try {
            const newComentario = {
                id_cliente: clienteLogueado ? JSON.parse(clienteLogueado).id : null,
                id_paquete: id,
                fecha: new Date().toISOString().split('T')[0],
                descripcion: nuevoComentario,
                estrellas
            };

            const response = await axios.post('http://localhost:3000/api/comentario', newComentario);

            const cliente = clienteLogueado ? await fetchClienteComentario(JSON.parse(clienteLogueado).id) : null;
            setComentarios([...comentarios, { ...newComentario, cliente, id: response.data.id }]);
            setNuevoComentario("");
            setEstrellas(0);
        } catch (error) {
            console.error("Error adding comentario:", error);
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
            {
                paquete && (
                    <div className="detail-layout">
                        <div className="image-container">
                            <img src={paquete.imagen} alt={paquete.nombre} className="package-image" />
                        </div>
                        <div className="info-container">
                            <div className="details">
                                <p><strong>Detalles:</strong> {paquete.detalle}</p>
                                <p className="price"><strong>Desde:</strong> {new Date(paquete.fecha_ini).toISOString().split('T')[0]}</p>
                                <p className='price'><strong>Hasta:</strong> {new Date(paquete.fecha_fin).toISOString().split('T')[0]} </p>
                            </div>
                            <div className="price-box">
                                <p className="price-per-night">Precio por noche</p>
                                <p className="price-total">${paquete.precio}</p>
                                <button className="reserve-button">Reservar Ahora</button>
                            </div>
                        </div>
                    </div>
                )
            }

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
                                    <p><strong>{comentario.cliente?.username}</strong></p>
                                </div>
                                <div className="comment-details">
                                    <p><strong>Fecha:</strong> {new Date(comentario.fecha).toISOString().split('T')[0]}</p>
                                    <p>{comentario.descripcion}</p>
                                    <p className="stars-display">{renderEstrellas(comentario.estrellas)}</p>
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
