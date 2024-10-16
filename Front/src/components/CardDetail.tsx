import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/CardDetail.css';

const CardDetail: React.FC = () => {
    const location = useLocation();
    const { id } = location.state || { id: null };
    const [paquete, setPaquete] = useState<any>(null);
    const [comentarios, setComentarios] = useState<any[]>([]);
    const [nuevoComentario, setNuevoComentario] = useState<string>("");

    // Estado para controlar la visualización de la descripción
    const [mostrarDescripcionCompleta, setMostrarDescripcionCompleta] = useState<boolean>(false);

    useEffect(() => {
        const fetchPaquete = async () => {
            const response = await axios.get(`http://localhost:3000/api/paquete/${id}`);
            setPaquete(response.data);
        };

        if (id) {
            fetchPaquete();
            fetchComentarios();
        }
    }, [id]);

    const fetchComentarios = () => {
        setComentarios([
            { id: 1, usuario: "Juan", comentario: "Excelente paquete, me encantó." },
            { id: 2, usuario: "Ana", comentario: "El lugar es muy bonito, lo recomiendo." }
        ]);
    };

    const agregarComentario = () => {
        if (nuevoComentario.trim()) {
            const nuevo = {
                id: comentarios.length + 1,
                usuario: "Usuario anónimo",
                comentario: nuevoComentario
            };
            setComentarios([...comentarios, nuevo]);
            setNuevoComentario("");
        }
    };

    // Función para alternar entre mostrar o no la descripción completa
    const toggleDescripcion = () => {
        setMostrarDescripcionCompleta(!mostrarDescripcionCompleta);
    };

    const descripcionTruncada = (descripcion: string, maxLength: number) => {
        if (descripcion.length > maxLength) {
            return descripcion.substring(0, maxLength) + "...";
        }
        return descripcion;
    };

    return (
        <div className="card-detail-container">
            <h2 className="title">Detalles del Paquete</h2>
            <p className="package-id">ID del paquete: {id}</p>
            {
                paquete && (
                    <div className="detail-layout">
                        <div className="image-container">
                            <img src={paquete.imagen} alt={paquete.nombre} className="package-image" />
                        </div>
                        <div className="info-container">
                            <div className="details">
                                <p><strong>Detalles:</strong> {/* {paquete.descripcion} */}</p>
                                <p className="price"><strong>Precio:</strong> ${paquete.precio}</p>
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

            {/* Sección de descripción con "Ver más" */}
            <div className="description-section">
                <h3>Descripción</h3>
                <p>
                    {mostrarDescripcionCompleta
                        ? paquete?.descripcion
                        : descripcionTruncada(paquete?.descripcion || "", 100)}
                </p>
                <button onClick={toggleDescripcion} className="reserve-button">
                    {mostrarDescripcionCompleta ? "Ver menos" : "Ver más"}
                </button>
            </div>

            {/* Sección de comentarios */}
            <div className="comments-section">
                <h3>Comentarios</h3>
                <div className="comments-list">
                    {comentarios.length > 0 ? (
                        comentarios.map((comentario) => (
                            <div key={comentario.id} className="comment">
                                <p><strong>{comentario.usuario}:</strong> {comentario.comentario}</p>
                            </div>
                        ))
                    ) : (
                        <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
                    )}
                </div>
                <div className="add-comment">
                    <textarea
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value)}
                        placeholder="Escribe tu comentario aquí..."
                    />
                    <button onClick={agregarComentario} className="add-comment-button">Agregar comentario</button>
                </div>
            </div>
        </div>
    );
};

export default CardDetail;
