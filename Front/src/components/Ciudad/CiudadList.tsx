import React, { useState, useEffect } from "react";
import { Ciudad } from "../../interface/ciudad";
import "../../styles/List.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

interface CiudadListProps {
  ciudades: Ciudad[];
  onEdit: (ciudad: Ciudad) => void;
  onDelete: (ciudad: Ciudad) => void;
}

const MySwal = withReactContent(Swal);

const CiudadList: React.FC<CiudadListProps> = ({
  ciudades: initialCiudades,
  onEdit,
  onDelete,
}) => {
  const [ciudades, setCiudades] = useState<Ciudad[]>(initialCiudades);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setCiudades(initialCiudades);
  }, [initialCiudades]);

  const filteredCiudades = ciudades.filter((ciudad) => {
    const term = searchTerm.trim().toLowerCase();
    if (term.length === 0) return true;
    return (
      (ciudad.nombre || "").toLowerCase().includes(term) ||
      (ciudad.pais || "").toLowerCase().includes(term)
    );
  });

  const handleEditCiudad = (ciudad: Ciudad) => {
    MySwal.fire({
      title: "Editar Ciudad",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group">
            <label>Nombre</label>
            <input id="swal-input-nombre" type="text" value="${ciudad.nombre}" />
          </div>
          <div class="swal-form-group">
            <label>País</label>
            <input id="swal-input-pais" type="text" value="${ciudad.pais}" />
          </div>
          <div class="swal-form-group full-width">
            <label>Descripción</label>
            <textarea id="swal-input-descripcion">${ciudad.descripcion}</textarea>
          </div>
          <div class="swal-form-group">
            <label>Latitud</label>
            <input id="swal-input-latitud" type="number" step="0.000001" min="-90" max="90" value="${ciudad.latitud}" />
          </div>
          <div class="swal-form-group">
            <label>Longitud</label>
            <input id="swal-input-longitud" type="number" step="0.000001" min="-180" max="180" value="${ciudad.longitud}" />
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
        )?.value;
        const descripcion = (
          document.getElementById("swal-input-descripcion") as HTMLInputElement
        )?.value;
        const pais = (
          document.getElementById("swal-input-pais") as HTMLInputElement
        )?.value;
        const latitudRaw = (
          document.getElementById("swal-input-latitud") as HTMLInputElement
        )?.value;
        const longitudRaw = (
          document.getElementById("swal-input-longitud") as HTMLInputElement
        )?.value;
        const latitud = Number.parseFloat(latitudRaw);
        const longitud = Number.parseFloat(longitudRaw);
        if (!nombre || !descripcion || !pais) {
          Swal.showValidationMessage(
            "Todos los campos son obligatorios y deben ser válidos",
          );
          return;
        }
        if (Number.isNaN(latitud) || Number.isNaN(longitud)) {
          Swal.showValidationMessage(
            "Todos los campos son obligatorios y deben ser válidos",
          );
          return;
        }
        if (
          latitud < -90 ||
          latitud > 90 ||
          longitud < -180 ||
          longitud > 180
        ) {
          Swal.showValidationMessage(
            "Latitud debe estar entre -90 y 90, y longitud entre -180 y 180",
          );
          return;
        }
        return { ...ciudad, nombre, descripcion, pais, latitud, longitud };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        console.log(
          "Datos que se van a enviar al editar ciudad:",
          result.value,
        );
        try {
          await axios.put(`/api/ciudad/${ciudad.id}`, result.value);
          setCiudades((prev) =>
            prev.map((c) => (c.id === ciudad.id ? result.value : c)),
          );
          onEdit(result.value);
          Swal.fire(
            "Guardado",
            "La ciudad fue actualizada correctamente.",
            "success",
          );
        } catch (error: any) {
          console.error(
            "Error al editar ciudad:",
            error.response?.data || error,
          );
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo actualizar la ciudad",
            "error",
          );
        }
      }
    });
  };

  const handleDeleteCiudad = (ciudad: Ciudad) => {
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar la ciudad?",
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
          await axios.delete(`/api/ciudad/${ciudad.id}`);
          setCiudades((prev) => prev.filter((c) => c.id !== ciudad.id));
          onDelete(ciudad);
          Swal.fire(
            "Eliminado",
            "La ciudad fue eliminada correctamente.",
            "success",
          );
        } catch (error: any) {
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo eliminar la ciudad",
            "error",
          );
        }
      }
    });
  };

  const handleCreateCiudad = () => {
    MySwal.fire({
      title: "Crear Ciudad",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group">
            <label>Nombre</label>
            <input id="swal-input-nombre" type="text" placeholder="Ej: Buenos Aires" />
          </div>
          <div class="swal-form-group">
            <label>País</label>
            <input id="swal-input-pais" type="text" placeholder="Ej: Argentina" />
          </div>
          <div class="swal-form-group full-width">
            <label>Descripción</label>
            <textarea id="swal-input-descripcion" placeholder="Describe la ciudad..."></textarea>
          </div>
          <div class="swal-form-group">
            <label>Latitud</label>
            <input id="swal-input-latitud" type="number" step="0.000001" min="-90" max="90" placeholder="Ej: -34.6037" />
          </div>
          <div class="swal-form-group">
            <label>Longitud</label>
            <input id="swal-input-longitud" type="number" step="0.000001" min="-180" max="180" placeholder="Ej: -58.3816" />
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
        )?.value;
        const descripcion = (
          document.getElementById("swal-input-descripcion") as HTMLInputElement
        )?.value;
        const pais = (
          document.getElementById("swal-input-pais") as HTMLInputElement
        )?.value;
        const latitudRaw = (
          document.getElementById("swal-input-latitud") as HTMLInputElement
        )?.value;
        const longitudRaw = (
          document.getElementById("swal-input-longitud") as HTMLInputElement
        )?.value;
        const latitud = Number.parseFloat(latitudRaw);
        const longitud = Number.parseFloat(longitudRaw);
        if (!nombre || !descripcion || !pais) {
          Swal.showValidationMessage(
            "Todos los campos son obligatorios y deben ser válidos",
          );
          return;
        }
        if (Number.isNaN(latitud) || Number.isNaN(longitud)) {
          Swal.showValidationMessage(
            "Todos los campos son obligatorios y deben ser válidos",
          );
          return;
        }
        if (
          latitud < -90 ||
          latitud > 90 ||
          longitud < -180 ||
          longitud > 180
        ) {
          Swal.showValidationMessage(
            "Latitud debe estar entre -90 y 90, y longitud entre -180 y 180",
          );
          return;
        }
        return { nombre, descripcion, pais, latitud, longitud };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        console.log("Datos que se van a enviar al crear ciudad:", result.value);
        try {
          const response = await axios.post("/api/ciudad", result.value);
          setCiudades((prev) => [...prev, response.data.data || response.data]);
          Swal.fire("Creado", "La ciudad fue creada correctamente.", "success");
        } catch (error: any) {
          console.error(
            "Error al crear ciudad:",
            error.response?.data || error,
          );
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo crear la ciudad",
            "error",
          );
        }
      }
    });
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <button className="btn-create" onClick={handleCreateCiudad}>
          + Crear Ciudad
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
          placeholder="Buscar por nombre o país"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: "8px 10px", borderRadius: "6px" }}
        />
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>País</th>
            <th>Coordenadas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredCiudades.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                style={{ textAlign: "center", padding: "20px", color: "#666" }}
              >
                No hay ciudades que coincidan con el filtro
              </td>
            </tr>
          ) : (
            filteredCiudades.map((ciudad) => (
              <tr key={ciudad.id}>
                <td>
                  <strong>{ciudad.nombre}</strong>
                </td>
                <td>{ciudad.descripcion}</td>
                <td>{ciudad.pais}</td>
                <td>
                  <small style={{ color: "#666" }}>
                    {ciudad.latitud}, {ciudad.longitud}
                  </small>
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
                      onClick={() => handleEditCiudad(ciudad)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteCiudad(ciudad)}
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

export default CiudadList;
