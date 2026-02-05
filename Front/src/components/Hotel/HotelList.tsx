import React, { useState, useEffect } from "react";
import { Hotel } from "../../interface/hotel";
import { Ciudad } from "../../interface/ciudad";
import "../../styles/List.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import {
  setupCloudinaryUpload,
  getCloudinaryImageFieldHTML,
} from "../../utils/cloudinaryUtils";

interface HotelListProps {
  hoteles: Hotel[];
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotel: Hotel) => void;
}

const MySwal = withReactContent(Swal);

const HotelList: React.FC<HotelListProps> = ({
  hoteles: initialHoteles,
  onEdit,
  onDelete,
}) => {
  const [hoteles, setHoteles] = useState<Hotel[]>(initialHoteles);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [estrellasFiltro, setEstrellasFiltro] = useState<string>("TODOS");

  useEffect(() => {
    setHoteles(initialHoteles);
  }, [initialHoteles]);

  const filteredHoteles = hoteles.filter((hotel) => {
    const term = searchTerm.trim().toLowerCase();
    const nombreCiudad = hotel.ciudad?.nombre || "";
    const matchesTerm =
      term.length === 0 ||
      (hotel.nombre || "").toLowerCase().includes(term) ||
      nombreCiudad.toLowerCase().includes(term);

    const matchesEstrellas =
      estrellasFiltro === "TODOS" ||
      hotel.estrellas === Number(estrellasFiltro);

    return matchesTerm && matchesEstrellas;
  });

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

  // Función para recargar los hoteles desde el servidor
  const reloadHoteles = async () => {
    try {
      const response = await axios.get("/api/hotel");
      setHoteles(response.data.data || response.data);
    } catch (error) {
      console.error("Error reloading hotels:", error);
    }
  };

  const handleEditHotel = (hotel: Hotel) => {
    const ciudadId = hotel.ciudad?.id || hotel.id_ciudad;
    const selectedCiudad = ciudades.find((c) => c.id === ciudadId);
    const ciudadOptions = ciudades
      .map((ciudad) => `<option value="${ciudad.id}">${ciudad.nombre}</option>`)
      .join("");

    MySwal.fire({
      title: "Editar Hotel",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group">
            <label>Nombre</label>
            <input id="swal-input-nombre" type="text" value="${hotel.nombre}" />
          </div>
          <div class="swal-form-group">
            <label>Ciudad</label>
            <select id="swal-input-ciudad">
              <option value="">Seleccionar ciudad...</option>
              ${ciudadOptions}
            </select>
          </div>
          <div class="swal-form-group full-width">
            <label>Descripción</label>
            <textarea id="swal-input-descripcion">${hotel.descripcion}</textarea>
          </div>
          <div class="swal-form-group full-width">
            <label>Dirección</label>
            <input id="swal-input-direccion" type="text" value="${hotel.direccion}" />
          </div>
          <div class="swal-form-group">
            <label>Teléfono</label>
            <input id="swal-input-telefono" type="text" value="${hotel.telefono}" />
          </div>
          <div class="swal-form-group">
            <label>Email</label>
            <input id="swal-input-email" type="email" value="${hotel.email}" />
          </div>
          <div class="swal-form-group">
            <label>Estrellas (1-5)</label>
            <input id="swal-input-estrellas" type="number" min="1" max="5" value="${hotel.estrellas}" />
          </div>
          <div class="swal-form-group">
            <label>Precio por día ($)</label>
            <input id="swal-input-precio" type="number" min="0" step="0.01" value="${hotel.precio_x_dia}" />
          </div>
          ${getCloudinaryImageFieldHTML(hotel.imagen || "", "swal")}
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
      didOpen: () => {
        const ciudadSelect = document.getElementById(
          "swal-input-ciudad",
        ) as HTMLSelectElement;
        if (ciudadSelect && ciudadId) {
          ciudadSelect.value = ciudadId.toString();
        }
        setupCloudinaryUpload(
          "swal-input-file",
          "swal-input-imagen",
          "swal-upload-status",
        );
      },
      preConfirm: () => {
        const nombre = (
          document.getElementById("swal-input-nombre") as HTMLInputElement
        )?.value;
        const descripcion = (
          document.getElementById(
            "swal-input-descripcion",
          ) as HTMLTextAreaElement
        )?.value;
        const direccion = (
          document.getElementById("swal-input-direccion") as HTMLInputElement
        )?.value;
        const telefono = (
          document.getElementById("swal-input-telefono") as HTMLInputElement
        )?.value;
        const email = (
          document.getElementById("swal-input-email") as HTMLInputElement
        )?.value;
        const estrellas = parseInt(
          (document.getElementById("swal-input-estrellas") as HTMLInputElement)
            ?.value,
          10,
        );
        const precio_x_dia = parseFloat(
          (document.getElementById("swal-input-precio") as HTMLInputElement)
            ?.value,
        );
        const id_ciudad = parseInt(
          (document.getElementById("swal-input-ciudad") as HTMLInputElement)
            ?.value,
          10,
        );
        const imagen = (
          document.getElementById("swal-input-imagen") as HTMLInputElement
        )?.value;

        // Validación mejorada
        if (!nombre?.trim()) {
          Swal.showValidationMessage("El nombre es obligatorio");
          return;
        }
        if (!descripcion?.trim()) {
          Swal.showValidationMessage("La descripción es obligatoria");
          return;
        }
        if (!direccion?.trim()) {
          Swal.showValidationMessage("La dirección es obligatoria");
          return;
        }
        if (!telefono?.trim()) {
          Swal.showValidationMessage("El teléfono es obligatorio");
          return;
        }
        if (!email?.trim()) {
          Swal.showValidationMessage("El email es obligatorio");
          return;
        }
        if (isNaN(estrellas) || estrellas < 1 || estrellas > 5) {
          Swal.showValidationMessage(
            "Las estrellas deben ser un número entre 1 y 5",
          );
          return;
        }
        if (isNaN(precio_x_dia) || precio_x_dia <= 0) {
          Swal.showValidationMessage(
            "El precio por día debe ser un número mayor a 0",
          );
          return;
        }
        if (!id_ciudad || isNaN(id_ciudad)) {
          Swal.showValidationMessage("Debe seleccionar una ciudad válida");
          return;
        }
        return {
          nombre,
          descripcion,
          direccion,
          telefono,
          email,
          estrellas,
          precio_x_dia,
          id_ciudad,
          imagen,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const response = await axios.put(
            `/api/hotel/${hotel.id}`,
            result.value,
          );

          // Recargar todos los hoteles para obtener datos completos y actualizados
          await reloadHoteles();

          onEdit(response.data.data || response.data);
          Swal.fire(
            "Guardado",
            "El hotel fue actualizado correctamente.",
            "success",
          );
        } catch (error: any) {
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo actualizar el hotel",
            "error",
          );
        }
      }
    });
  };
  const handleDeleteHotel = (hotel: Hotel) => {
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar el hotel?",
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
          await axios.delete(`/api/hotel/${hotel.id}`);

          // Recargar todos los hoteles para mantener consistencia
          await reloadHoteles();

          onDelete(hotel);
          Swal.fire(
            "Eliminado",
            "El hotel fue eliminado correctamente.",
            "success",
          );
        } catch (error: any) {
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo eliminar el hotel",
            "error",
          );
        }
      }
    });
  };

  const handleCreateHotel = () => {
    const ciudadOptions = ciudades
      .map((ciudad) => `<option value="${ciudad.id}">${ciudad.nombre}</option>`)
      .join("");

    MySwal.fire({
      title: "Crear Hotel",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group">
            <label>Nombre</label>
            <input id="swal-input-nombre" type="text" placeholder="Ej: Hotel Plaza" />
          </div>
          <div class="swal-form-group">
            <label>Ciudad</label>
            <select id="swal-input-ciudad">
              <option value="">Seleccionar ciudad...</option>
              ${ciudadOptions}
            </select>
          </div>
          <div class="swal-form-group full-width">
            <label>Descripción</label>
            <textarea id="swal-input-descripcion" placeholder="Describe el hotel..."></textarea>
          </div>
          <div class="swal-form-group full-width">
            <label>Dirección</label>
            <input id="swal-input-direccion" type="text" placeholder="Ej: Av. Principal 123" />
          </div>
          <div class="swal-form-group">
            <label>Teléfono</label>
            <input id="swal-input-telefono" type="text" placeholder="Ej: +54 11 1234-5678" />
          </div>
          <div class="swal-form-group">
            <label>Email</label>
            <input id="swal-input-email" type="email" placeholder="hotel@ejemplo.com" />
          </div>
          <div class="swal-form-group">
            <label>Estrellas (1-5)</label>
            <input id="swal-input-estrellas" type="number" min="1" max="5" placeholder="5" />
          </div>
          <div class="swal-form-group">
            <label>Precio por día ($)</label>
            <input id="swal-input-precio" type="number" min="0" step="0.01" placeholder="150.00" />
          </div>
          ${getCloudinaryImageFieldHTML("", "swal")}
        </div>
      `,
      customClass: {
        popup: "swal-wide",
      },
      didOpen: () => {
        setupCloudinaryUpload(
          "swal-input-file",
          "swal-input-imagen",
          "swal-upload-status",
        );
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
        const descripcion = (
          document.getElementById(
            "swal-input-descripcion",
          ) as HTMLTextAreaElement
        )?.value?.trim();
        const direccion = (
          document.getElementById("swal-input-direccion") as HTMLInputElement
        )?.value?.trim();
        const telefono = (
          document.getElementById("swal-input-telefono") as HTMLInputElement
        )?.value?.trim();
        const email = (
          document.getElementById("swal-input-email") as HTMLInputElement
        )?.value?.trim();
        const estrellas = parseInt(
          (document.getElementById("swal-input-estrellas") as HTMLInputElement)
            ?.value,
          10,
        );
        const precio_x_dia = parseFloat(
          (document.getElementById("swal-input-precio") as HTMLInputElement)
            ?.value,
        );
        const id_ciudad = parseInt(
          (document.getElementById("swal-input-ciudad") as HTMLInputElement)
            ?.value,
          10,
        );
        const imagen = (
          document.getElementById("swal-input-imagen") as HTMLInputElement
        )?.value?.trim();

        // Validación mejorada para crear
        if (!nombre?.trim()) {
          Swal.showValidationMessage("El nombre es obligatorio");
          return;
        }
        if (!descripcion?.trim()) {
          Swal.showValidationMessage("La descripción es obligatoria");
          return;
        }
        if (!direccion?.trim()) {
          Swal.showValidationMessage("La dirección es obligatoria");
          return;
        }
        if (!telefono?.trim()) {
          Swal.showValidationMessage("El teléfono es obligatorio");
          return;
        }
        if (!email?.trim()) {
          Swal.showValidationMessage("El email es obligatorio");
          return;
        }
        if (isNaN(estrellas) || estrellas < 1 || estrellas > 5) {
          Swal.showValidationMessage(
            "Las estrellas deben ser un número entre 1 y 5",
          );
          return;
        }
        if (isNaN(precio_x_dia) || precio_x_dia <= 0) {
          Swal.showValidationMessage(
            "El precio por día debe ser un número mayor a 0",
          );
          return;
        }
        if (!id_ciudad || isNaN(id_ciudad)) {
          Swal.showValidationMessage("Debe seleccionar una ciudad válida");
          return;
        }

        return {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          direccion: direccion.trim(),
          telefono: telefono.trim(),
          email: email.trim(),
          estrellas,
          precio_x_dia,
          id_ciudad,
          imagen,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const response = await axios.post("/api/hotel", result.value);

          // Recargar todos los hoteles para obtener datos completos y actualizados
          await reloadHoteles();

          Swal.fire("Creado", "El hotel fue creado correctamente.", "success");
        } catch (error: any) {
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo crear el hotel",
            "error",
          );
        }
      }
    });
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <button className="btn-create" onClick={handleCreateHotel}>
          + Crear Hotel
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
          placeholder="Buscar por nombre o ciudad"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: "8px 10px", borderRadius: "6px" }}
        />
        <select
          value={estrellasFiltro}
          onChange={(e) => setEstrellasFiltro(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: "6px" }}
        >
          <option value="TODOS">Todas</option>
          <option value="1">1 estrella</option>
          <option value="2">2 estrellas</option>
          <option value="3">3 estrellas</option>
          <option value="4">4 estrellas</option>
          <option value="5">5 estrellas</option>
        </select>
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ciudad</th>
            <th>Dirección</th>
            <th>Contacto</th>
            <th>Estrellas</th>
            <th>Precio/día</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredHoteles.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{ textAlign: "center", padding: "20px", color: "#666" }}
              >
                No hay hoteles que coincidan con el filtro
              </td>
            </tr>
          ) : (
            filteredHoteles.map((hotel) => (
              <tr key={hotel.id}>
                <td>
                  <strong>{hotel.nombre}</strong>
                </td>
                <td>
                  {hotel.ciudad?.nombre || `ID: ${hotel.id_ciudad || "N/A"}`}
                </td>
                <td>{hotel.direccion}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <span>{hotel.telefono}</span>
                    <small style={{ color: "#666" }}>{hotel.email}</small>
                  </div>
                </td>
                <td>{"⭐".repeat(hotel.estrellas)}</td>
                <td>${hotel.precio_x_dia}</td>
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
                      onClick={() => handleEditHotel(hotel)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteHotel(hotel)}
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

export default HotelList;
