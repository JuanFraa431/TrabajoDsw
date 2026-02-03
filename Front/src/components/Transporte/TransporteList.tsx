import React, { useState, useEffect } from "react";
import { Transporte } from "../../interface/transporte";
import { Ciudad } from "../../interface/ciudad";
import { TipoTransporte } from "../../interface/tipoTransporte";
import "../../styles/List.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

interface TransporteListProps {
  transportes: Transporte[];
  onEdit: (transporte: Transporte) => void;
  onDelete: (transporte: Transporte) => void;
}

const MySwal = withReactContent(Swal);

const TransporteList: React.FC<TransporteListProps> = ({
  transportes: initialTransportes,
  onEdit,
  onDelete,
}) => {
  const [transportes, setTransportes] =
    useState<Transporte[]>(initialTransportes);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [tiposTransporte, setTiposTransporte] = useState<TipoTransporte[]>([]);

  useEffect(() => {
    setTransportes(initialTransportes);
  }, [initialTransportes]);

  useEffect(() => {
    // Cargar ciudades y tipos de transporte
    Promise.all([axios.get("/api/ciudad"), axios.get("/api/tipoTransporte")])
      .then(([ciudadesRes, tiposRes]) => {
        setCiudades(ciudadesRes.data.data || []);
        setTiposTransporte(tiposRes.data.data || []);
      })
      .catch((error) => console.error("Error cargando datos:", error));
  }, []);

  const handleEditTransporte = (transporte: Transporte) => {
    const tipoOptions = tiposTransporte
      .map(
        (tipo) =>
          `<option value="${tipo.id}" ${
            transporte.tipoTransporte?.id === tipo.id ? "selected" : ""
          }>${tipo.nombre}</option>`,
      )
      .join("");
    const ciudadOrigenOptions = ciudades
      .map(
        (ciudad) =>
          `<option value="${ciudad.id}" ${
            transporte.ciudadOrigen?.id === ciudad.id ? "selected" : ""
          }>${ciudad.nombre}</option>`,
      )
      .join("");
    const ciudadDestinoOptions = ciudades
      .map(
        (ciudad) =>
          `<option value="${ciudad.id}" ${
            transporte.ciudadDestino?.id === ciudad.id ? "selected" : ""
          }>${ciudad.nombre}</option>`,
      )
      .join("");

    MySwal.fire({
      title: "Editar Transporte",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group">
            <label>Nombre</label>
            <input id="swal-input-nombre" type="text" value="${
              transporte.nombre
            }" />
          </div>
          <div class="swal-form-group">
            <label>Tipo</label>
            <select id="swal-input-tipo">
              ${tipoOptions}
            </select>
          </div>
          <div class="swal-form-group full-width">
            <label>Descripción</label>
            <textarea id="swal-input-descripcion">${
              transporte.descripcion
            }</textarea>
          </div>
          <div class="swal-form-group">
            <label>Empresa</label>
            <input id="swal-input-empresa" type="text" value="${
              transporte.nombre_empresa
            }" />
          </div>
          <div class="swal-form-group">
            <label>Email Empresa</label>
            <input id="swal-input-email" type="email" value="${
              transporte.mail_empresa
            }" />
          </div>
          <div class="swal-form-group">
            <label>Ciudad Origen</label>
            <select id="swal-input-origen">
              <option value="">Seleccionar...</option>
              ${ciudadOrigenOptions}
            </select>
          </div>
          <div class="swal-form-group">
            <label>Ciudad Destino</label>
            <select id="swal-input-destino">
              <option value="">Seleccionar...</option>
              ${ciudadDestinoOptions}
            </select>
          </div>
          <div class="swal-form-group">
            <label>Fecha Salida</label>
            <input id="swal-input-fecha-salida" type="date" value="${
              transporte.fecha_salida
                ? new Date(transporte.fecha_salida).toISOString().split("T")[0]
                : ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Fecha Llegada</label>
            <input id="swal-input-fecha-llegada" type="date" value="${
              transporte.fecha_llegada
                ? new Date(transporte.fecha_llegada).toISOString().split("T")[0]
                : ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Capacidad</label>
            <input id="swal-input-capacidad" type="number" value="${
              transporte.capacidad
            }" />
          </div>
          <div class="swal-form-group">
            <label>Asientos Disp.</label>
            <input id="swal-input-asientos" type="number" value="${
              transporte.asientos_disponibles || 0
            }" />
          </div>
          <div class="swal-form-group">
            <label>Precio ($)</label>
            <input id="swal-input-precio" type="number" step="0.01" value="${
              transporte.precio || 0
            }" />
          </div>
          <div class="swal-form-group">
            <label>Estado</label>
            <select id="swal-input-activo">
              <option value="1" ${
                transporte.activo ? "selected" : ""
              }>Activo</option>
              <option value="0" ${
                !transporte.activo ? "selected" : ""
              }>Inactivo</option>
            </select>
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
          document.getElementById(
            "swal-input-descripcion",
          ) as HTMLTextAreaElement
        )?.value;
        const capacidad = parseInt(
          (document.getElementById("swal-input-capacidad") as HTMLInputElement)
            ?.value,
        );
        const tipoTransporteId = parseInt(
          (document.getElementById("swal-input-tipo") as HTMLSelectElement)
            ?.value,
        );
        const nombre_empresa = (
          document.getElementById("swal-input-empresa") as HTMLInputElement
        )?.value;
        const mail_empresa = (
          document.getElementById("swal-input-email") as HTMLInputElement
        )?.value;
        const ciudadOrigenId = (
          document.getElementById("swal-input-origen") as HTMLSelectElement
        )?.value;
        const ciudadDestinoId = (
          document.getElementById("swal-input-destino") as HTMLSelectElement
        )?.value;
        const fecha_salida = (
          document.getElementById("swal-input-fecha-salida") as HTMLInputElement
        )?.value;
        const fecha_llegada = (
          document.getElementById(
            "swal-input-fecha-llegada",
          ) as HTMLInputElement
        )?.value;
        const precio = parseFloat(
          (document.getElementById("swal-input-precio") as HTMLInputElement)
            ?.value,
        );
        const asientos_disponibles = parseInt(
          (document.getElementById("swal-input-asientos") as HTMLInputElement)
            ?.value,
        );
        const activo =
          (document.getElementById("swal-input-activo") as HTMLSelectElement)
            ?.value === "1";

        if (
          !nombre ||
          !descripcion ||
          !capacidad ||
          !tipoTransporteId ||
          !nombre_empresa ||
          !mail_empresa
        ) {
          Swal.showValidationMessage(
            "Los campos nombre, descripción, capacidad, tipo, empresa y email son obligatorios",
          );
          return;
        }

        return {
          id: transporte.id,
          nombre,
          descripcion,
          capacidad,
          tipoTransporte: tipoTransporteId,
          nombre_empresa,
          mail_empresa,
          ciudadOrigen: ciudadOrigenId ? parseInt(ciudadOrigenId) : null,
          ciudadDestino: ciudadDestinoId ? parseInt(ciudadDestinoId) : null,
          fecha_salida: fecha_salida || null,
          fecha_llegada: fecha_llegada || null,
          precio: precio || null,
          asientos_disponibles: asientos_disponibles || null,
          activo,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const response = await axios.put(
            `/api/transporte/${transporte.id}`,
            result.value,
          );
          const updatedTransporte = response.data.data || response.data;
          setTransportes((prev) =>
            prev.map((t) => (t.id === transporte.id ? updatedTransporte : t)),
          );
          onEdit(updatedTransporte);
          Swal.fire(
            "Guardado",
            "El transporte fue actualizado correctamente.",
            "success",
          );
        } catch (error: any) {
          console.error(
            "Error al editar transporte:",
            error.response?.data || error,
          );
          Swal.fire(
            "Error",
            error.response?.data?.message ||
              "No se pudo actualizar el transporte",
            "error",
          );
        }
      }
    });
  };

  const handleDeleteTransporte = (transporte: Transporte) => {
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar el transporte?",
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
          await axios.delete(`/api/transporte/${transporte.id}`);
          setTransportes((prev) => prev.filter((t) => t.id !== transporte.id));
          onDelete(transporte);
          Swal.fire(
            "Eliminado",
            "El transporte fue eliminado correctamente.",
            "success",
          );
        } catch (error: any) {
          Swal.fire(
            "Error",
            error.response?.data?.message ||
              "No se pudo eliminar el transporte",
            "error",
          );
        }
      }
    });
  };

  const handleCreateTransporte = () => {
    const tipoOptions = tiposTransporte
      .map((tipo) => `<option value="${tipo.id}">${tipo.nombre}</option>`)
      .join("");
    const ciudadOptions = ciudades
      .map((ciudad) => `<option value="${ciudad.id}">${ciudad.nombre}</option>`)
      .join("");

    MySwal.fire({
      title: "Crear Transporte",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group">
            <label>Nombre</label>
            <input id="swal-input-nombre" type="text" placeholder="Nombre del transporte" />
          </div>
          <div class="swal-form-group">
            <label>Tipo</label>
            <select id="swal-input-tipo">
              <option value="">Seleccionar...</option>
              ${tipoOptions}
            </select>
          </div>
          <div class="swal-form-group full-width">
            <label>Descripción</label>
            <textarea id="swal-input-descripcion" placeholder="Descripción del transporte"></textarea>
          </div>
          <div class="swal-form-group">
            <label>Empresa</label>
            <input id="swal-input-empresa" type="text" placeholder="Nombre de la empresa" />
          </div>
          <div class="swal-form-group">
            <label>Email Empresa</label>
            <input id="swal-input-email" type="email" placeholder="email@empresa.com" />
          </div>
          <div class="swal-form-group">
            <label>Ciudad Origen</label>
            <select id="swal-input-origen">
              <option value="">Seleccionar...</option>
              ${ciudadOptions}
            </select>
          </div>
          <div class="swal-form-group">
            <label>Ciudad Destino</label>
            <select id="swal-input-destino">
              <option value="">Seleccionar...</option>
              ${ciudadOptions}
            </select>
          </div>
          <div class="swal-form-group">
            <label>Fecha Salida</label>
            <input id="swal-input-fecha-salida" type="date" />
          </div>
          <div class="swal-form-group">
            <label>Fecha Llegada</label>
            <input id="swal-input-fecha-llegada" type="date" />
          </div>
          <div class="swal-form-group">
            <label>Capacidad</label>
            <input id="swal-input-capacidad" type="number" placeholder="Capacidad total" />
          </div>
          <div class="swal-form-group">
            <label>Asientos Disp.</label>
            <input id="swal-input-asientos" type="number" placeholder="Asientos disponibles" />
          </div>
          <div class="swal-form-group">
            <label>Precio ($)</label>
            <input id="swal-input-precio" type="number" step="0.01" placeholder="0.00" />
          </div>
          <div class="swal-form-group">
            <label>Estado</label>
            <select id="swal-input-activo">
              <option value="1" selected>Activo</option>
              <option value="0">Inactivo</option>
            </select>
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
          document.getElementById(
            "swal-input-descripcion",
          ) as HTMLTextAreaElement
        )?.value;
        const capacidad = parseInt(
          (document.getElementById("swal-input-capacidad") as HTMLInputElement)
            ?.value,
        );
        const tipoTransporteId = parseInt(
          (document.getElementById("swal-input-tipo") as HTMLSelectElement)
            ?.value,
        );
        const nombre_empresa = (
          document.getElementById("swal-input-empresa") as HTMLInputElement
        )?.value;
        const mail_empresa = (
          document.getElementById("swal-input-email") as HTMLInputElement
        )?.value;
        const ciudadOrigenId = (
          document.getElementById("swal-input-origen") as HTMLSelectElement
        )?.value;
        const ciudadDestinoId = (
          document.getElementById("swal-input-destino") as HTMLSelectElement
        )?.value;
        const fecha_salida = (
          document.getElementById("swal-input-fecha-salida") as HTMLInputElement
        )?.value;
        const fecha_llegada = (
          document.getElementById(
            "swal-input-fecha-llegada",
          ) as HTMLInputElement
        )?.value;
        const precio = parseFloat(
          (document.getElementById("swal-input-precio") as HTMLInputElement)
            ?.value,
        );
        const asientos_disponibles = parseInt(
          (document.getElementById("swal-input-asientos") as HTMLInputElement)
            ?.value,
        );
        const activo =
          (document.getElementById("swal-input-activo") as HTMLSelectElement)
            ?.value === "1";

        if (
          !nombre ||
          !descripcion ||
          !capacidad ||
          !tipoTransporteId ||
          !nombre_empresa ||
          !mail_empresa
        ) {
          Swal.showValidationMessage(
            "Los campos nombre, descripción, capacidad, tipo, empresa y email son obligatorios",
          );
          return;
        }

        return {
          nombre,
          descripcion,
          capacidad,
          tipoTransporte: tipoTransporteId,
          nombre_empresa,
          mail_empresa,
          ciudadOrigen: ciudadOrigenId ? parseInt(ciudadOrigenId) : null,
          ciudadDestino: ciudadDestinoId ? parseInt(ciudadDestinoId) : null,
          fecha_salida: fecha_salida || null,
          fecha_llegada: fecha_llegada || null,
          precio: precio || null,
          asientos_disponibles: asientos_disponibles || null,
          activo,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const response = await axios.post("/api/transporte", result.value);
          const newTransporte = response.data.data || response.data;
          setTransportes((prev) => [...prev, newTransporte]);
          Swal.fire(
            "Creado",
            "El transporte fue creado correctamente.",
            "success",
          );
        } catch (error: any) {
          console.error(
            "Error al crear transporte:",
            error.response?.data || error,
          );
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo crear el transporte",
            "error",
          );
        }
      }
    });
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <button className="btn-create" onClick={handleCreateTransporte}>
          + Crear Transporte
        </button>
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Empresa</th>
            <th>Ruta</th>
            <th>Capacidad</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transportes.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                style={{ textAlign: "center", padding: "20px", color: "#666" }}
              >
                No hay transportes registrados
              </td>
            </tr>
          ) : (
            transportes.map((transporte) => (
              <tr key={transporte.id}>
                <td>
                  <strong>{transporte.nombre}</strong>
                </td>
                <td>{transporte.tipoTransporte?.nombre || "N/A"}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <span>{transporte.nombre_empresa}</span>
                    <small style={{ color: "#666" }}>
                      {transporte.mail_empresa}
                    </small>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <span>
                      {transporte.ciudadOrigen?.nombre || "N/A"} →{" "}
                      {transporte.ciudadDestino?.nombre || "N/A"}
                    </span>
                  </div>
                </td>
                <td>{transporte.capacidad}</td>
                <td>${transporte.precio || 0}</td>
                <td>
                  <span
                    className={`badge ${
                      transporte.activo ? "badge-confirmada" : "badge-cancelada"
                    }`}
                  >
                    {transporte.activo ? "Activo" : "Inactivo"}
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
                      onClick={() => handleEditTransporte(transporte)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteTransporte(transporte)}
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

export default TransporteList;
