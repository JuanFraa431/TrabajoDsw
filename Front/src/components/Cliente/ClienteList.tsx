import React, { useState, useEffect } from "react";
import { Cliente } from "../../interface/cliente";
import "../../styles/Cliente/ClienteList.css";
import "../../styles/List.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

interface ClienteListProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
}

const ClienteList: React.FC<ClienteListProps> = ({
  clientes: initialClientes,
  onEdit,
  onDelete,
}) => {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tipoFiltro, setTipoFiltro] = useState<string>("TODOS");
  const MySwal = withReactContent(Swal);

  const isOnlyLetters = (value: string) =>
    /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(value);

  const isOnlyNumbers = (value: string) => /^\d+$/.test(value);

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const isAdult = (value: string) => {
    const birthDate = new Date(value);
    if (Number.isNaN(birthDate.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }
    return age >= 18;
  };

  const isValidUsername = (value: string) => /^[A-Za-z0-9]+$/.test(value);

  const isValidPassword = (value: string) =>
    /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);

  useEffect(() => {
    setClientes(initialClientes);
  }, [initialClientes]);

  const filteredClientes = clientes.filter((cliente) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesTerm =
      term.length === 0 ||
      `${cliente.nombre || ""} ${cliente.apellido || ""}`
        .toLowerCase()
        .includes(term) ||
      (cliente.email || "").toLowerCase().includes(term) ||
      (cliente.username || "").toLowerCase().includes(term);

    const matchesTipo =
      tipoFiltro === "TODOS" || cliente.tipo_usuario === tipoFiltro;

    return matchesTerm && matchesTipo;
  });

  // Helper function to format date without timezone issues
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Add timezone offset to avoid showing previous day
    const localDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000,
    );
    return localDate.toLocaleDateString();
  };

  const handleEditUsuario = (cliente: Cliente) => {
    const fechaNacimiento = cliente.fecha_nacimiento
      ? new Date(cliente.fecha_nacimiento).toISOString().split("T")[0]
      : "";

    MySwal.fire({
      title: "Editar Usuario",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group">
            <label>Nombre</label>
            <input id="swal-input-nombre" type="text" value="${
              cliente.nombre || ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Apellido</label>
            <input id="swal-input-apellido" type="text" value="${
              cliente.apellido || ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>DNI</label>
            <input id="swal-input-dni" type="text" value="${
              cliente.dni || ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Email</label>
            <input id="swal-input-email" type="email" value="${
              cliente.email || ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Fecha de Nacimiento</label>
            <input id="swal-input-fecha-nacimiento" type="date" value="${fechaNacimiento}" />
          </div>
          <div class="swal-form-group">
            <label>Usuario</label>
            <input id="swal-input-username" type="text" value="${
              cliente.username || ""
            }" />
          </div>
          <div class="swal-form-group full-width">
            <label>Nueva Contraseña (dejar vacío para mantener)</label>
            <input id="swal-input-password" type="password" placeholder="••••••••" />
          </div>
          <div class="swal-form-group">
            <label>Estado</label>
            <select id="swal-input-estado">
              <option value="1" ${
                cliente.estado === 1 ? "selected" : ""
              }>Activo</option>
              <option value="0" ${
                cliente.estado === 0 ? "selected" : ""
              }>Inactivo</option>
            </select>
          </div>
          <div class="swal-form-group">
            <label>Tipo de Usuario</label>
            <select id="swal-input-tipo-usuario">
              <option value="CLIENTE" ${
                cliente.tipo_usuario === "CLIENTE" ? "selected" : ""
              }>Cliente</option>
              <option value="ADMIN" ${
                cliente.tipo_usuario === "ADMIN" ? "selected" : ""
              }>Admin</option>
            </select>
          </div>
          <div class="swal-form-group full-width">
            <label>URL de Imagen</label>
            <input id="swal-input-imagen" type="text" value="${
              cliente.imagen || ""
            }" placeholder="https://..." />
          </div>
        </div>
      `,
      customClass: {
        popup: "swal-wide",
      },
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#6c757d",
      preConfirm: () => {
        const nombre = (
          document.getElementById("swal-input-nombre") as HTMLInputElement
        )?.value?.trim();
        const apellido = (
          document.getElementById("swal-input-apellido") as HTMLInputElement
        )?.value?.trim();
        const dni = (
          document.getElementById("swal-input-dni") as HTMLInputElement
        )?.value?.trim();
        const email = (
          document.getElementById("swal-input-email") as HTMLInputElement
        )?.value?.trim();
        const fecha_nacimiento = (
          document.getElementById(
            "swal-input-fecha-nacimiento",
          ) as HTMLInputElement
        )?.value;
        const username = (
          document.getElementById("swal-input-username") as HTMLInputElement
        )?.value?.trim();
        const password = (
          document.getElementById("swal-input-password") as HTMLInputElement
        )?.value;
        const estado = parseInt(
          (document.getElementById("swal-input-estado") as HTMLSelectElement)
            ?.value,
        );
        const tipo_usuario = (
          document.getElementById(
            "swal-input-tipo-usuario",
          ) as HTMLSelectElement
        )?.value;
        const imagen = (
          document.getElementById("swal-input-imagen") as HTMLInputElement
        )?.value?.trim();

        if (!nombre || !apellido || !dni || !email || !username) {
          Swal.showValidationMessage(
            "Nombre, apellido, DNI, email y nombre de usuario son obligatorios",
          );
          return;
        }

        if (!isOnlyLetters(nombre)) {
          Swal.showValidationMessage("El nombre solo puede contener letras");
          return;
        }

        if (!isOnlyLetters(apellido)) {
          Swal.showValidationMessage("El apellido solo puede contener letras");
          return;
        }

        if (!isOnlyNumbers(dni)) {
          Swal.showValidationMessage("El DNI debe contener solo números");
          return;
        }

        if (!isValidEmail(email)) {
          Swal.showValidationMessage("Por favor ingrese un email válido");
          return;
        }

        if (!isValidUsername(username)) {
          Swal.showValidationMessage(
            "El nombre de usuario no puede contener espacios ni caracteres especiales",
          );
          return;
        }

        if (fecha_nacimiento && !isAdult(fecha_nacimiento)) {
          Swal.showValidationMessage(
            "La fecha de nacimiento debe corresponder a un mayor de 18 años",
          );
          return;
        }

        if (password && password.trim() !== "" && !isValidPassword(password)) {
          Swal.showValidationMessage(
            "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número",
          );
          return;
        }

        if (imagen && /\s/.test(imagen)) {
          Swal.showValidationMessage(
            "La URL de imagen no puede contener espacios",
          );
          return;
        }

        const updateData: any = {
          ...cliente,
          nombre,
          apellido,
          dni,
          email,
          fecha_nacimiento: fecha_nacimiento || null,
          username,
          estado,
          tipo_usuario,
          imagen: imagen || null,
        };

        if (password && password.trim() !== "") {
          updateData.password = password;
        }

        return updateData;
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          await axios.put(`/api/cliente/${cliente.id}`, result.value);
          setClientes((prev) =>
            prev.map((c) => (c.id === cliente.id ? result.value : c)),
          );
          onEdit(result.value);
          Swal.fire(
            "Guardado",
            "El usuario fue actualizado correctamente.",
            "success",
          );
        } catch (error: any) {
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo actualizar el usuario",
            "error",
          );
        }
      }
    });
  };

  const handleDeleteUsuario = (cliente: Cliente) => {
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar el usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/cliente/${cliente.id}`);
          setClientes((prev) => prev.filter((c) => c.id !== cliente.id));
          onDelete(cliente);
          Swal.fire(
            "Eliminado",
            "El usuario fue eliminado correctamente.",
            "success",
          );
        } catch (error: any) {
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo eliminar el usuario",
            "error",
          );
        }
      }
    });
  };

  const handleCreateUsuario = () => {
    MySwal.fire({
      title: "Crear Usuario",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group">
            <label>Nombre *</label>
            <input id="swal-input-nombre" type="text" placeholder="Juan" />
          </div>
          <div class="swal-form-group">
            <label>Apellido *</label>
            <input id="swal-input-apellido" type="text" placeholder="Pérez" />
          </div>
          <div class="swal-form-group">
            <label>DNI *</label>
            <input id="swal-input-dni" type="text" placeholder="12345678" />
          </div>
          <div class="swal-form-group">
            <label>Email *</label>
            <input id="swal-input-email" type="email" placeholder="juan@email.com" />
          </div>
          <div class="swal-form-group">
            <label>Fecha de Nacimiento</label>
            <input id="swal-input-fecha-nacimiento" type="date" />
          </div>
          <div class="swal-form-group">
            <label>Usuario *</label>
            <input id="swal-input-username" type="text" placeholder="juanperez" />
          </div>
          <div class="swal-form-group full-width">
            <label>Contraseña *</label>
            <input id="swal-input-password" type="password" placeholder="••••••••" />
          </div>
          <div class="swal-form-group">
            <label>Estado</label>
            <select id="swal-input-estado">
              <option value="1" selected>Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>
          <div class="swal-form-group">
            <label>Tipo de Usuario</label>
            <select id="swal-input-tipo-usuario">
              <option value="CLIENTE" selected>Cliente</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div class="swal-form-group full-width">
            <label>URL de Imagen</label>
            <input id="swal-input-imagen" type="text" placeholder="https://..." />
          </div>
        </div>
      `,
      customClass: {
        popup: "swal-wide",
      },
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      preConfirm: () => {
        const nombre = (
          document.getElementById("swal-input-nombre") as HTMLInputElement
        )?.value?.trim();
        const apellido = (
          document.getElementById("swal-input-apellido") as HTMLInputElement
        )?.value?.trim();
        const dni = (
          document.getElementById("swal-input-dni") as HTMLInputElement
        )?.value?.trim();
        const email = (
          document.getElementById("swal-input-email") as HTMLInputElement
        )?.value?.trim();
        const fecha_nacimiento = (
          document.getElementById(
            "swal-input-fecha-nacimiento",
          ) as HTMLInputElement
        )?.value;
        const username = (
          document.getElementById("swal-input-username") as HTMLInputElement
        )?.value?.trim();
        const password = (
          document.getElementById("swal-input-password") as HTMLInputElement
        )?.value;
        const estado = parseInt(
          (document.getElementById("swal-input-estado") as HTMLSelectElement)
            ?.value,
        );
        const tipo_usuario = (
          document.getElementById(
            "swal-input-tipo-usuario",
          ) as HTMLSelectElement
        )?.value;
        const imagen = (
          document.getElementById("swal-input-imagen") as HTMLInputElement
        )?.value?.trim();

        if (!nombre || !apellido || !dni || !email || !username || !password) {
          Swal.showValidationMessage(
            "Nombre, apellido, DNI, email, nombre de usuario y contraseña son obligatorios",
          );
          return;
        }

        if (!isOnlyLetters(nombre)) {
          Swal.showValidationMessage("El nombre solo puede contener letras");
          return;
        }

        if (!isOnlyLetters(apellido)) {
          Swal.showValidationMessage("El apellido solo puede contener letras");
          return;
        }

        if (!isOnlyNumbers(dni)) {
          Swal.showValidationMessage("El DNI debe contener solo números");
          return;
        }

        if (!isValidEmail(email)) {
          Swal.showValidationMessage("Por favor ingrese un email válido");
          return;
        }

        if (!isValidUsername(username)) {
          Swal.showValidationMessage(
            "El nombre de usuario no puede contener espacios ni caracteres especiales",
          );
          return;
        }

        if (fecha_nacimiento && !isAdult(fecha_nacimiento)) {
          Swal.showValidationMessage(
            "La fecha de nacimiento debe corresponder a un mayor de 18 años",
          );
          return;
        }

        if (!isValidPassword(password)) {
          Swal.showValidationMessage(
            "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número",
          );
          return;
        }

        if (imagen && /\s/.test(imagen)) {
          Swal.showValidationMessage(
            "La URL de imagen no puede contener espacios",
          );
          return;
        }

        return {
          nombre,
          apellido,
          dni,
          email,
          fecha_nacimiento: fecha_nacimiento || null,
          username,
          password,
          estado,
          tipo_usuario,
          imagen: imagen || null,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const response = await axios.post("/api/cliente", result.value);
          setClientes((prev) => [...prev, response.data.data || response.data]);
          Swal.fire(
            "Creado",
            "El usuario fue creado correctamente.",
            "success",
          );
        } catch (error: any) {
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo crear el usuario",
            "error",
          );
        }
      }
    });
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <button className="btn-create" onClick={handleCreateUsuario}>
          + Crear Usuario
        </button>
      </div>
      <div
        className="list-filters"
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <input
          type="text"
          placeholder="Buscar por nombre, email o usuario"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: "8px 10px", borderRadius: "6px" }}
        />
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: "6px" }}
        >
          <option value="TODOS">Todos</option>
          <option value="CLIENTE">Cliente</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Email</th>
            <th>Usuario</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredClientes.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{ textAlign: "center", padding: "20px", color: "#666" }}
              >
                No hay usuarios que coincidan con el filtro
              </td>
            </tr>
          ) : (
            filteredClientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>
                  <strong>
                    {cliente.nombre} {cliente.apellido}
                  </strong>
                </td>
                <td>{cliente.dni}</td>
                <td>{cliente.email}</td>
                <td>{cliente.username}</td>
                <td>{cliente.tipo_usuario}</td>
                <td>
                  <span
                    className={`badge ${
                      cliente.estado === 1
                        ? "badge-confirmada"
                        : "badge-cancelada"
                    }`}
                  >
                    {cliente.estado === 1 ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleEditUsuario(cliente)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUsuario(cliente)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClienteList;
