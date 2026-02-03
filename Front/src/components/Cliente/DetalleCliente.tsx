import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Cliente } from "../../interface/cliente";
import "../../styles/Cliente/DetalleCliente.css";
import userIcon from "../../images/user-icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const DetalleCliente: React.FC = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const cliente = storedUser ? (JSON.parse(storedUser) as Cliente) : null;
  const [imgUrl, setImgUrl] = useState<string>(cliente?.imagen || "");
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = "dy8lzfj2h";
  const uploadPreset = "ml_default";

  const handleDarseDeBaja = async () => {
    const confirmacion = window.confirm(
      "¿Está seguro que desea darse de baja?",
    );
    if (confirmacion && cliente) {
      try {
        await axios.delete(`/api/cliente/${cliente.id}`);
        alert("Cliente eliminado con éxito.");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
      } catch (error) {
        alert("Hubo un error al intentar eliminar el cliente.");
        console.error(error);
      }
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAdministrarPerfil = () => {
    navigate(`/editar-perfil`, { state: { cliente } });
  };

  const handleEditImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    console.log("Archivo seleccionado:", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      setUploading(true);
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
      const response = await axios.post(cloudinaryUrl, formData);
      console.log("Respuesta de Cloudinary:", response.data);
      const newImageUrl = response.data.secure_url;
      setImgUrl(newImageUrl);

      await axios.put(`/api/cliente/${cliente?.id}`, { imagen: newImageUrl });

      if (cliente) {
        const updatedCliente = { ...cliente, imagen: newImageUrl };
        localStorage.setItem("user", JSON.stringify(updatedCliente));
      }
      alert("Imagen de perfil actualizada correctamente.");
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
      alert("Error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  if (!cliente) {
    return;
  }

  const fecha = new Date(cliente.fecha_nacimiento);
  const dia = String(fecha.getUTCDate()).padStart(2, "0");
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const anio = fecha.getUTCFullYear();
  const fechaFormateada = `${dia}/${mes}/${anio}`;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-pic">
          <img src={imgUrl || userIcon} alt="User Icon" className="user-icon" />
          <div className="edit-icon" onClick={handleEditImageClick}>
            <FontAwesomeIcon icon={faPencilAlt} />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {uploading && <div className="uploading">Subiendo...</div>}
        </div>
        <div className="profile-info">
          <h1>¡Hola, {cliente.nombre ? cliente.nombre : cliente.username}!</h1>
          <div className="profile-buttons">
            {cliente.tipo_usuario === "admin" && (
              <button
                onClick={() => navigate("/vistaAdmin")}
                className="btn-admin"
              >
                Administración
              </button>
            )}
            {cliente.tipo_usuario === "cliente" && (
              <>
                <button onClick={handleAdministrarPerfil} className="btn-admin">
                  Administrar Perfil
                </button>
                <button
                  onClick={() => navigate("/mis-reservas")}
                  className="btn-reservas"
                >
                  Mis Reservas
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="personal-info">
        <p>
          <strong>Nombre:</strong> {cliente.nombre}
        </p>
        <p>
          <strong>Apellido:</strong> {cliente.apellido}
        </p>
        <p>
          <strong>DNI:</strong> {cliente.dni}
        </p>
        <p>
          <strong>Email:</strong> {cliente.email}
        </p>
        <p>
          <strong>Fecha de Nacimiento:</strong> {fechaFormateada}
        </p>
        <p>
          <strong>Username:</strong> {cliente.username}
        </p>
      </div>

      <div className="action-buttons">
        <button
          onClick={handleDarseDeBaja}
          className="detalle-cliente-btn danger"
        >
          Darse De Baja
        </button>
        <button
          onClick={handleCerrarSesion}
          className="detalle-cliente-btn logout"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default DetalleCliente;
