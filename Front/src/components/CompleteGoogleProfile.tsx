import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../images/logoFinal2.png";
import "../styles/CompleteGoogleProfile.css";

interface LocationState {
  googleData: {
    email: string;
    googleId: string;
    imagen: string;
    nombre: string;
    apellido: string;
    token: string;
  };
}

const CompleteGoogleProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const googleData = (location.state as LocationState)?.googleData;

  const [formData, setFormData] = useState({
    username: "",
    nombre: googleData?.nombre || "",
    apellido: googleData?.apellido || "",
    dni: "",
    fecha_nacimiento: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si no hay datos de Google, redirigir al login
    if (!googleData) {
      navigate("/login");
    }
  }, [googleData, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validaciones
    if (!formData.username.trim()) {
      setError("El nombre de usuario es requerido");
      setLoading(false);
      return;
    }

    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      setLoading(false);
      return;
    }

    if (!formData.apellido.trim()) {
      setError("El apellido es requerido");
      setLoading(false);
      return;
    }

    if (!formData.dni.trim()) {
      setError("El DNI es requerido");
      setLoading(false);
      return;
    }

    if (!/^\d{7,8}$/.test(formData.dni)) {
      setError("El DNI debe tener 7 u 8 dígitos");
      setLoading(false);
      return;
    }

    if (!formData.fecha_nacimiento) {
      setError("La fecha de nacimiento es requerida");
      setLoading(false);
      return;
    }

    // Validar edad mínima (ejemplo: 18 años)
    const birthDate = new Date(formData.fecha_nacimiento);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      age < 18 ||
      (age === 18 && monthDiff < 0) ||
      (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      setError("Debes ser mayor de 18 años");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/cliente/auth/google/complete", {
        token: googleData.token,
        username: formData.username,
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni: formData.dni,
        fecha_nacimiento: formData.fecha_nacimiento,
      });

      if (response.status === 201) {
        const { usuario, token } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(usuario));
        navigate("/");
      }
    } catch (error: any) {
      console.error("Complete registration failed:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Error al completar el registro. Intenta nuevamente.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!googleData) {
    return null;
  }

  return (
    <div className="complete-google-profile-container">
      <div className="container-image">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>

      <div className="complete-profile-card">
        <div className="profile-header">
          {googleData.imagen && (
            <img
              src={googleData.imagen}
              alt="Perfil"
              className="profile-image"
            />
          )}
          <h2>Completa tu Perfil</h2>
          <p className="subtitle">
            Bienvenido! Para continuar, por favor completa tu información.
          </p>
          <p className="email-info">
            <strong>Email:</strong> {googleData.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="complete-profile-form">
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="nombre">
                Nombre <span className="required">*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Juan"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="apellido">
                Apellido <span className="required">*</span>
              </label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                value={formData.apellido}
                onChange={handleInputChange}
                placeholder="Ej: Pérez"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="username">
                Nombre de Usuario <span className="required">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Ej: juanperez"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="dni">
                DNI <span className="required">*</span>
              </label>
              <input
                id="dni"
                name="dni"
                type="text"
                value={formData.dni}
                onChange={handleInputChange}
                placeholder="Ej: 12345678"
                maxLength={8}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="fecha_nacimiento">
              Fecha de Nacimiento <span className="required">*</span>
            </label>
            <input
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              type="date"
              value={formData.fecha_nacimiento}
              onChange={handleInputChange}
              required
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="button-group">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? "Completando registro..." : "Completar Registro"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteGoogleProfile;
