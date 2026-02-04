import React, { useState, useEffect } from "react";
import "../../styles/List.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

interface TipoTransporte {
  id: number;
  nombre: string;
}

interface TipoTransporteListProps {
  tiposTransporte: TipoTransporte[];
  onEdit: (tipoTransporte: TipoTransporte) => void;
  onDelete: (tipoTransporte: TipoTransporte) => void;
}

const MySwal = withReactContent(Swal);

const TipoTransporteList: React.FC<TipoTransporteListProps> = ({
  tiposTransporte: initialTiposTransporte,
  onEdit,
  onDelete,
}) => {
  const [tiposTransporte, setTiposTransporte] = useState<TipoTransporte[]>(initialTiposTransporte);

  useEffect(() => {
    setTiposTransporte(initialTiposTransporte);
  }, [initialTiposTransporte]);

  const handleEditTipoTransporte = (tipoTransporte: TipoTransporte) => {
    MySwal.fire({
      title: "Editar Tipo de Transporte",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group full-width">
            <label>Nombre *</label>
            <input id="swal-input-nombre" type="text" value="${tipoTransporte.nombre}" placeholder="Ej: Avión" />
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

        if (!nombre) {
          Swal.showValidationMessage("El nombre es obligatorio");
          return;
        }

        return { ...tipoTransporte, nombre };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          await axios.put(`/api/tipoTransporte/${tipoTransporte.id}`, result.value);
          setTiposTransporte((prev) =>
            prev.map((t) => (t.id === tipoTransporte.id ? result.value : t))
          );
          onEdit(result.value);
          Swal.fire(
            "Guardado",
            "El tipo de transporte fue actualizado correctamente.",
            "success"
          );
        } catch (error: any) {
          console.error(
            "Error al editar tipo de transporte:",
            error.response?.data || error
          );
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo actualizar el tipo de transporte",
            "error"
          );
        }
      }
    });
  };

  const handleDeleteTipoTransporte = (tipoTransporte: TipoTransporte) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este tipo de transporte? Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/tipoTransporte/${tipoTransporte.id}`);
          setTiposTransporte((prev) => prev.filter((t) => t.id !== tipoTransporte.id));
          onDelete(tipoTransporte);
          Swal.fire(
            "Eliminado",
            "El tipo de transporte fue eliminado correctamente.",
            "success"
          );
        } catch (error: any) {
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo eliminar el tipo de transporte. Puede estar siendo usado por transportes existentes.",
            "error"
          );
        }
      }
    });
  };

  const handleCreateTipoTransporte = () => {
    MySwal.fire({
      title: "Crear Tipo de Transporte",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group full-width">
            <label>Nombre *</label>
            <input id="swal-input-nombre" type="text" placeholder="Ej: Avión, Colectivo, Tren, Barco" />
          </div>
        </div>
        <p style="margin-top: 15px; font-size: 0.9rem; color: #666;">
          * Campos obligatorios
        </p>
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

        if (!nombre) {
          Swal.showValidationMessage("El nombre es obligatorio");
          return;
        }

        return { nombre };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const response = await axios.post("/api/tipoTransporte", result.value);
          const newTipoTransporte = response.data.data || response.data;
          setTiposTransporte((prev) => [...prev, newTipoTransporte]);
          Swal.fire(
            "Creado",
            "El tipo de transporte fue creado correctamente.",
            "success"
          );
        } catch (error: any) {
          console.error(
            "Error al crear tipo de transporte:",
            error.response?.data || error
          );
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo crear el tipo de transporte",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <button className="btn-create" onClick={handleCreateTipoTransporte}>
          + Crear Tipo de Transporte
        </button>
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tiposTransporte.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                No hay tipos de transporte registrados
              </td>
            </tr>
          ) : (
            tiposTransporte.map((tipoTransporte) => (
              <tr key={tipoTransporte.id}>
                <td>{tipoTransporte.id}</td>
                <td>{tipoTransporte.nombre}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditTipoTransporte(tipoTransporte)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteTipoTransporte(tipoTransporte)}
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

export default TipoTransporteList;
