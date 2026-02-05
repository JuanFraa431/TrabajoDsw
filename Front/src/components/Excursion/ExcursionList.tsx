import React, { useState, useEffect } from "react";
import { Excursion } from "../../interface/excursion";
import { Ciudad } from "../../interface/ciudad";
import "../../styles/List.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import {
  setupCloudinaryUpload,
  getCloudinaryImageFieldHTML,
} from "../../utils/cloudinaryUtils";

interface ExcursionListProps {
  excursiones: Excursion[];
  onEdit: (excursion: Excursion) => void;
  onDelete: (excursion: Excursion) => void;
  onCreate: (excursion: Excursion) => void;
}

const ExcursionList: React.FC<ExcursionListProps> = ({
  excursiones: initialExcursiones,
  onEdit,
  onDelete,
  onCreate,
}) => {
  const [excursiones, setExcursiones] =
    useState<Excursion[]>(initialExcursiones);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    setExcursiones(initialExcursiones);
  }, [initialExcursiones]);

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const response = await axios.get("/api/ciudad");
        setCiudades(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCiudades();
  }, []);

  const handleEditExcursion = (excursion: Excursion) => {
    const ciudadId = excursion.ciudad?.id || excursion.id_ciudad;
    const selectedCiudad = ciudades.find((c) => c.id === ciudadId);
    const ciudadOptions = ciudades
      .map(
        (ciudad) =>
          `<option value="${ciudad.id}" ${
            ciudad.id === ciudadId ? "selected" : ""
          }>${ciudad.nombre}</option>`,
      )
      .join("");

    MySwal.fire({
      title: "Editar Excursión",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group">
            <label>Nombre</label>
            <input id="swal-input-nombre" type="text" value="${
              excursion.nombre || ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Tipo</label>
            <input id="swal-input-tipo" type="text" value="${
              excursion.tipo || ""
            }" />
          </div>
          <div class="swal-form-group full-width">
            <label>Descripción</label>
            <textarea id="swal-input-descripcion">${
              excursion.descripcion || ""
            }</textarea>
          </div>
          <div class="swal-form-group full-width">
            <label>Detalle</label>
            <textarea id="swal-input-detalle">${
              excursion.detalle || ""
            }</textarea>
          </div>
          <div class="swal-form-group">
            <label>Máx. Personas</label>
            <input id="swal-input-nro-personas" type="number" min="1" value="${
              excursion.nro_personas_max || ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Precio ($)</label>
            <input id="swal-input-precio" type="number" min="0" step="0.01" value="${
              excursion.precio || ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Empresa</label>
            <input id="swal-input-nombre-empresa" type="text" value="${
              excursion.nombre_empresa || ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Email Empresa</label>
            <input id="swal-input-mail-empresa" type="email" value="${
              excursion.mail_empresa || ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Ciudad</label>
            <select id="swal-input-ciudad">
              <option value="">Seleccionar...</option>
              ${ciudadOptions}
            </select>
          </div>
          ${getCloudinaryImageFieldHTML(excursion.imagen || "", "swal")}
        </div>
      `,
      customClass: {
        popup: "swal-wide",
      },
      didOpen: () => {
        setupCloudinaryUpload("swal-input-file", "swal-input-imagen", "swal-upload-status");
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
          document.getElementById(
            "swal-input-descripcion",
          ) as HTMLTextAreaElement
        )?.value;
        const detalle = (
          document.getElementById("swal-input-detalle") as HTMLTextAreaElement
        )?.value;
        const tipo = (
          document.getElementById("swal-input-tipo") as HTMLInputElement
        )?.value;
        const nro_personas_max = parseInt(
          (
            document.getElementById(
              "swal-input-nro-personas",
            ) as HTMLInputElement
          )?.value,
          10,
        );
        const nombre_empresa = (
          document.getElementById(
            "swal-input-nombre-empresa",
          ) as HTMLInputElement
        )?.value;
        const mail_empresa = (
          document.getElementById("swal-input-mail-empresa") as HTMLInputElement
        )?.value;
        const precio = parseFloat(
          (document.getElementById("swal-input-precio") as HTMLInputElement)
            ?.value,
        );
        const imagen = (
          document.getElementById("swal-input-imagen") as HTMLInputElement
        )?.value;
        const id_ciudad = parseInt(
          (document.getElementById("swal-input-ciudad") as HTMLSelectElement)
            ?.value,
          10,
        );

        // Validación
        if (!nombre?.trim()) {
          Swal.showValidationMessage("El nombre es obligatorio");
          return;
        }
        if (!descripcion?.trim()) {
          Swal.showValidationMessage("La descripción es obligatoria");
          return;
        }
        if (!detalle?.trim()) {
          Swal.showValidationMessage("El detalle es obligatorio");
          return;
        }
        if (!tipo?.trim()) {
          Swal.showValidationMessage("El tipo es obligatorio");
          return;
        }
        if (isNaN(nro_personas_max) || nro_personas_max <= 0) {
          Swal.showValidationMessage(
            "El número máximo de personas debe ser un número mayor a 0",
          );
          return;
        }
        if (!nombre_empresa?.trim()) {
          Swal.showValidationMessage("El nombre de la empresa es obligatorio");
          return;
        }
        if (!mail_empresa?.trim()) {
          Swal.showValidationMessage("El email de la empresa es obligatorio");
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(mail_empresa)) {
          Swal.showValidationMessage(
            "El email de la empresa debe tener un formato válido",
          );
          return;
        }
        if (isNaN(precio) || precio <= 0) {
          Swal.showValidationMessage("El precio debe ser un número mayor a 0");
          return;
        }
        if (!imagen?.trim()) {
          Swal.showValidationMessage("La URL de la imagen es obligatoria");
          return;
        }
        if (!id_ciudad || isNaN(id_ciudad)) {
          Swal.showValidationMessage("Debe seleccionar una ciudad válida");
          return;
        }

        return {
          ...excursion,
          nombre,
          descripcion,
          detalle,
          tipo,
          nro_personas_max,
          nombre_empresa,
          mail_empresa,
          precio,
          imagen,
          id_ciudad,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          await axios.put(`/api/excursion/${excursion.id}`, result.value);
          setExcursiones((prev) =>
            prev.map((e) => (e.id === excursion.id ? result.value : e)),
          );
          onEdit(result.value);
          Swal.fire(
            "Guardado",
            "La excursión fue actualizada correctamente.",
            "success",
          );
        } catch (error: any) {
          Swal.fire(
            "Error",
            error.response?.data?.message ||
              "No se pudo actualizar la excursión",
            "error",
          );
        }
      }
    });
  };

  const handleDeleteExcursion = (excursion: Excursion) => {
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar la excursión?",
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
          await axios.delete(`/api/excursion/${excursion.id}`);
          setExcursiones((prev) => prev.filter((e) => e.id !== excursion.id));
          onDelete(excursion);
          Swal.fire(
            "Eliminado",
            "La excursión fue eliminada correctamente.",
            "success",
          );
        } catch (error: any) {
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo eliminar la excursión",
            "error",
          );
        }
      }
    });
  };

  const handleCreateExcursion = () => {
    const ciudadOptions = ciudades
      .map((ciudad) => `<option value="${ciudad.id}">${ciudad.nombre}</option>`)
      .join("");

    MySwal.fire({
      title: "Crear Excursión",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group">
            <label>Nombre</label>
            <input id="swal-input-nombre" type="text" placeholder="Nombre de la excursión" />
          </div>
          <div class="swal-form-group">
            <label>Tipo</label>
            <input id="swal-input-tipo" type="text" placeholder="Tipo de excursión" />
          </div>
          <div class="swal-form-group full-width">
            <label>Descripción</label>
            <textarea id="swal-input-descripcion" placeholder="Descripción breve"></textarea>
          </div>
          <div class="swal-form-group full-width">
            <label>Detalle</label>
            <textarea id="swal-input-detalle" placeholder="Detalle completo"></textarea>
          </div>
          <div class="swal-form-group">
            <label>Máx. Personas</label>
            <input id="swal-input-nro-personas" type="number" min="1" placeholder="10" />
          </div>
          <div class="swal-form-group">
            <label>Precio ($)</label>
            <input id="swal-input-precio" type="number" min="0" step="0.01" placeholder="0.00" />
          </div>
          <div class="swal-form-group">
            <label>Empresa</label>
            <input id="swal-input-nombre-empresa" type="text" placeholder="Nombre de la empresa" />
          </div>
          <div class="swal-form-group">
            <label>Email Empresa</label>
            <input id="swal-input-mail-empresa" type="email" placeholder="email@empresa.com" />
          </div>
          <div class="swal-form-group">
            <label>Ciudad</label>
            <select id="swal-input-ciudad">
              <option value="">Seleccionar...</option>
              ${ciudadOptions}
            </select>
          </div>
          ${getCloudinaryImageFieldHTML("", "swal")}
        </div>
      `,
      customClass: {
        popup: "swal-wide",
      },
      didOpen: () => {
        setupCloudinaryUpload("swal-input-file", "swal-input-imagen", "swal-upload-status");
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
          document.getElementById(
            "swal-input-descripcion",
          ) as HTMLTextAreaElement
        )?.value;
        const detalle = (
          document.getElementById("swal-input-detalle") as HTMLTextAreaElement
        )?.value;
        const tipo = (
          document.getElementById("swal-input-tipo") as HTMLInputElement
        )?.value;
        const nro_personas_max = parseInt(
          (
            document.getElementById(
              "swal-input-nro-personas",
            ) as HTMLInputElement
          )?.value,
          10,
        );
        const nombre_empresa = (
          document.getElementById(
            "swal-input-nombre-empresa",
          ) as HTMLInputElement
        )?.value;
        const mail_empresa = (
          document.getElementById("swal-input-mail-empresa") as HTMLInputElement
        )?.value;
        const precio = parseFloat(
          (document.getElementById("swal-input-precio") as HTMLInputElement)
            ?.value,
        );
        const imagen = (
          document.getElementById("swal-input-imagen") as HTMLInputElement
        )?.value;
        const id_ciudad = parseInt(
          (document.getElementById("swal-input-ciudad") as HTMLSelectElement)
            ?.value,
          10,
        );

        // Validación
        if (!nombre?.trim()) {
          Swal.showValidationMessage("El nombre es obligatorio");
          return;
        }
        if (!descripcion?.trim()) {
          Swal.showValidationMessage("La descripción es obligatoria");
          return;
        }
        if (!detalle?.trim()) {
          Swal.showValidationMessage("El detalle es obligatorio");
          return;
        }
        if (!tipo?.trim()) {
          Swal.showValidationMessage("El tipo es obligatorio");
          return;
        }
        if (isNaN(nro_personas_max) || nro_personas_max <= 0) {
          Swal.showValidationMessage(
            "El número máximo de personas debe ser un número mayor a 0",
          );
          return;
        }
        if (!nombre_empresa?.trim()) {
          Swal.showValidationMessage("El nombre de la empresa es obligatorio");
          return;
        }
        if (!mail_empresa?.trim()) {
          Swal.showValidationMessage("El email de la empresa es obligatorio");
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(mail_empresa)) {
          Swal.showValidationMessage(
            "El email de la empresa debe tener un formato válido",
          );
          return;
        }
        if (isNaN(precio) || precio <= 0) {
          Swal.showValidationMessage("El precio debe ser un número mayor a 0");
          return;
        }
        if (!imagen?.trim()) {
          Swal.showValidationMessage("La URL de la imagen es obligatoria");
          return;
        }
        if (!id_ciudad || isNaN(id_ciudad)) {
          Swal.showValidationMessage("Debe seleccionar una ciudad válida");
          return;
        }

        return {
          nombre,
          descripcion,
          detalle,
          tipo,
          nro_personas_max,
          nombre_empresa,
          mail_empresa,
          precio,
          imagen,
          id_ciudad,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const response = await axios.post("/api/excursion", result.value);
          setExcursiones((prev) => [
            ...prev,
            response.data.data || response.data,
          ]);
          onCreate(response.data.data || response.data);
          Swal.fire(
            "Creado",
            "La excursión fue creada correctamente.",
            "success",
          );
        } catch (error: any) {
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo crear la excursión",
            "error",
          );
        }
      }
    });
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <button className="btn-create" onClick={handleCreateExcursion}>
          + Crear Excursión
        </button>
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Ciudad</th>
            <th>Empresa</th>
            <th>Máx. Personas</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {excursiones.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{ textAlign: "center", padding: "20px", color: "#666" }}
              >
                No hay excursiones registradas
              </td>
            </tr>
          ) : (
            excursiones.map((excursion) => (
              <tr key={excursion.id}>
                <td>
                  <strong>{excursion.nombre}</strong>
                </td>
                <td>{excursion.tipo}</td>
                <td>{excursion.ciudad?.nombre || "N/A"}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <span>{excursion.nombre_empresa}</span>
                    <small style={{ color: "#666" }}>
                      {excursion.mail_empresa}
                    </small>
                  </div>
                </td>
                <td>{excursion.nro_personas_max}</td>
                <td>${excursion.precio}</td>
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
                      onClick={() => handleEditExcursion(excursion)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteExcursion(excursion)}
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

export default ExcursionList;
