import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../../styles/Cliente/EditarPerfil.css";

const EditarPerfil: React.FC = () => {
  const navigate = useNavigate();
  const cliente = JSON.parse(localStorage.getItem("user") || "{}");

  const formatoFecha = (fecha: string): string => {
    return fecha ? fecha.split("T")[0] : "";
  };

  const [formData, setFormData] = useState(
    cliente
      ? {
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          dni: cliente.dni,
          email: cliente.email,
          fecha_nacimiento: formatoFecha(cliente.fecha_nacimiento),
          username: cliente.username,
        }
      : {
          nombre: "",
          apellido: "",
          dni: "",
          email: "",
          fecha_nacimiento: "",
          username: "",
        },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGuardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/cliente/${cliente.id}`, formData);
      const updatedUser = { ...cliente, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      Swal.fire({
        title: "Perfil actualizado",
        text: "Tu perfil ha sido actualizado con éxito",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate(`/detalleCliente`, { state: { cliente: updatedUser } });
      }, 1250);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar tu perfil",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
      console.error(error);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleGuardarCambios} className="edit-form">
        <div className="form-row">
          <div className="form-group-perfil">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ingresa tu nombre"
            />
          </div>

          <div className="form-group-perfil">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              placeholder="Ingresa tu apellido"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group-perfil">
            <label htmlFor="dni">DNI</label>
            <input
              type="text"
              id="dni"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              required
              placeholder="Ingresa tu DNI"
            />
          </div>

          <div className="form-group-perfil">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Ingresa tu email"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group-perfil">
            <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              className="date-input-edit"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-perfil">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Ingresa tu username"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="editar-perfil-btn cancel"
            onClick={() => navigate("/detalleCliente")}
          >
            Cancelar
          </button>
          <button type="submit" className="editar-perfil-btn save">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarPerfil;
