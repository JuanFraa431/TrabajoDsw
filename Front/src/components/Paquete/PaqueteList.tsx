import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { Paquete } from "../../interface/paquete";
import { Estadia } from "../../interface/estadia";
import EstadiaForm from "../Estadia/EstadiaForm";
import {
  calcularPrecioTotalPaquete,
  obtenerRangoFechasPaquete,
} from "../../utils/paqueteUtils";
import {
  setupCloudinaryUpload,
  getCloudinaryImageFieldHTMLFullWidth,
} from "../../utils/cloudinaryUtils";

import "../../styles/List.css";
import "../../styles/Cliente/ClienteList.css";

interface PaqueteListProps {
  paquetes: Paquete[];
  onEdit: (paquete: Paquete) => void;
  onDelete: (paquete: Paquete) => void;
  onAddEstadia: (estadia: Estadia) => void;
  onCreate: (paquete: Paquete) => void;
}

const MySwal = withReactContent(Swal);

const handleEditPaquete = (
  paquete: Paquete,
  onEdit: (paquete: Paquete) => void,
  setPaquetes: React.Dispatch<React.SetStateAction<Paquete[]>>,
) => {
  MySwal.fire({
    title: "Editar Paquete",
    html: `
      <div class="form-editar-paquete">
        <div class="sweet-form-row">
          <label for="swal-input-nombre">Nombre</label>
          <input id="swal-input-nombre" value="${paquete.nombre}" />
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-estado">Estado</label>
          <select id="swal-input-estado">
            <option value="1" ${paquete.estado === 1 ? "selected" : ""}>Activo</option>
            <option value="0" ${paquete.estado === 0 ? "selected" : ""}>Inactivo</option>
          </select>
        </div>

        <div class="sweet-form-row full-width">
          <label for="swal-input-descripcion">Descripción</label>
          <textarea id="swal-input-descripcion">${paquete.descripcion}</textarea>
        </div>

        <div class="sweet-form-row full-width">
          <label for="swal-input-detalle">Detalle</label>
          <textarea id="swal-input-detalle">${paquete.detalle}</textarea>
        </div>

        ${getCloudinaryImageFieldHTMLFullWidth(paquete.imagen || "", "swal")}
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
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#007bff",
    cancelButtonColor: "#6c757d",
    preConfirm: () => {
      const newNombre = (
        document.getElementById("swal-input-nombre") as HTMLInputElement
      )?.value;
      const newEstado = parseInt(
        (document.getElementById("swal-input-estado") as HTMLSelectElement)
          ?.value,
        10,
      );
      const newDescripcion = (
        document.getElementById("swal-input-descripcion") as HTMLTextAreaElement
      )?.value;
      const newDetalle = (
        document.getElementById("swal-input-detalle") as HTMLTextAreaElement
      )?.value;
      const newImagen = (
        document.getElementById("swal-input-imagen") as HTMLInputElement
      )?.value;

      if (
        !newNombre ||
        Number.isNaN(newEstado) ||
        !newDescripcion ||
        !newDetalle ||
        !newImagen
      ) {
        Swal.showValidationMessage(
          "Todos los campos son obligatorios y deben ser válidos",
        );
        return;
      }

      return {
        id: paquete.id,
        nombre: newNombre,
        estado: newEstado,
        descripcion: newDescripcion,
        detalle: newDetalle,
        imagen: newImagen,
      };
    },
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const updatedPaquete = result.value;

      axios
        .put(`/api/paquete/${updatedPaquete.id}`, updatedPaquete)
        .then(() => {
          onEdit(updatedPaquete);
          setPaquetes((prevPaquetes) =>
            prevPaquetes.map((p) =>
              p.id === updatedPaquete.id ? updatedPaquete : p,
            ),
          );
          Swal.fire(
            "Guardado",
            "El paquete fue actualizado correctamente.",
            "success",
          );
        })
        .catch((error) => {
          console.error(
            "Error al actualizar el paquete:",
            error.response?.data || error.message,
          );
          Swal.fire(
            "Error",
            `No se pudo actualizar el paquete: ${
              error.response?.data?.message || error.message
            }`,
            "error",
          );
        });
    }
  });
};

const handleCreatePaquete = (
  onCreate: (paquete: Paquete) => void,
  setPaquetes: React.Dispatch<React.SetStateAction<Paquete[]>>,
) => {
  MySwal.fire({
    title: "Crear Paquete",
    html: `
      <div class="form-editar-paquete">
        <div class="sweet-form-row">
          <label for="swal-input-nombre">Nombre</label>
          <input id="swal-input-nombre" placeholder="Nombre del paquete" />
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-estado">Estado</label>
          <select id="swal-input-estado">
            <option value="1" selected>Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </div>

        <div class="sweet-form-row full-width">
          <label for="swal-input-descripcion">Descripción</label>
          <textarea id="swal-input-descripcion" placeholder="Descripción breve"></textarea>
        </div>

        <div class="sweet-form-row full-width">
          <label for="swal-input-detalle">Detalle</label>
          <textarea id="swal-input-detalle" placeholder="Detalle completo"></textarea>
        </div>

        ${getCloudinaryImageFieldHTMLFullWidth("", "swal")}
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
      )?.value;
      const estado = parseInt(
        (document.getElementById("swal-input-estado") as HTMLSelectElement)
          ?.value,
        10,
      );
      const descripcion = (
        document.getElementById("swal-input-descripcion") as HTMLTextAreaElement
      )?.value;
      const detalle = (
        document.getElementById("swal-input-detalle") as HTMLTextAreaElement
      )?.value;
      const imagen = (
        document.getElementById("swal-input-imagen") as HTMLInputElement
      )?.value;

      if (!nombre || isNaN(estado) || !descripcion || !detalle || !imagen) {
        Swal.showValidationMessage(
          "Todos los campos son obligatorios y deben ser válidos",
        );
        return;
      }

      return {
        nombre,
        estado,
        descripcion,
        detalle,
        imagen,
      };
    },
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const newPaquete = result.value;

      axios
        .post("/api/paquete", newPaquete)
        .then((response) => {
          const createdPaquete = response.data.data;
          onCreate(createdPaquete);
          setPaquetes((prevPaquetes) => [...prevPaquetes, createdPaquete]);
          Swal.fire(
            "Creado",
            "El paquete fue creado correctamente.",
            "success",
          );
        })
        .catch((error) => {
          console.error(
            "Error al crear el paquete:",
            error.response?.data || error.message,
          );
          Swal.fire(
            "Error",
            `No se pudo crear el paquete: ${
              error.response?.data?.message || error.message
            }`,
            "error",
          );
        });
    }
  });
};

const PaqueteList: React.FC<PaqueteListProps> = ({
  paquetes: initialPaquetes,
  onEdit,
  onDelete,
  onAddEstadia,
  onCreate,
}) => {
  const [paquetes, setPaquetes] = useState<Paquete[]>(initialPaquetes);
  const [hoteles, setHoteles] = useState<{ [key: number]: any }>({});
  const [tiposTransporte, setTiposTransporte] = useState<any[]>([]);
  const [ciudades, setCiudades] = useState<any[]>([]);
  const [excursionesDisponibles, setExcursionesDisponibles] = useState<any[]>(
    [],
  );
  const [activePaquete, setActivePaquete] = useState<number | null>(null);
  const [estadiaEditada, setEstadiaEditada] = useState<Estadia | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState<string>("");
  const [fechaFinFiltro, setFechaFinFiltro] = useState<string>("");
  const [estadoFiltro, setEstadoFiltro] = useState<string>("TODOS");

  const fetchTiposTransporte = async () => {
    try {
      const response = await axios.get("/api/tipoTransporte");
      if (Array.isArray(response.data.data)) {
        setTiposTransporte(response.data.data);
      }
    } catch (error) {
      console.error("Error al obtener los tipos de transporte:", error);
    }
  };

  const fetchCiudades = async () => {
    try {
      const response = await axios.get("/api/ciudad");
      if (Array.isArray(response.data.data)) {
        setCiudades(response.data.data);
      }
    } catch (error) {
      console.error("Error al obtener las ciudades:", error);
    }
  };

  const fetchExcursiones = async () => {
    try {
      const response = await axios.get("/api/excursion");
      if (Array.isArray(response.data.data)) {
        setExcursionesDisponibles(response.data.data);
      }
    } catch (error) {
      console.error("Error al obtener las excursiones:", error);
    }
  };

  const fetchHoteles = async () => {
    try {
      const response = await axios.get("/api/hotel"); // Endpoint para obtener todos los hoteles
      console.log("Respuesta del servidor para hoteles:", response.data); // Log para depuración

      if (Array.isArray(response.data.data)) {
        setHoteles(
          response.data.data.reduce((acc: any, hotel: any) => {
            acc[hotel.id] = hotel;
            return acc;
          }, {}),
        );
      } else {
        console.error(
          "La respuesta del servidor no contiene un array válido:",
          response.data,
        );
        Swal.fire(
          "Error",
          "No se pudieron cargar los hoteles. Respuesta inválida del servidor.",
          "error",
        );
      }
    } catch (error) {
      console.error("Error al obtener los hoteles:", error);
      Swal.fire(
        "Error",
        "No se pudieron cargar los hoteles. Verifique su conexión o contacte al administrador.",
        "error",
      );
    }
  };

  useEffect(() => {
    fetchHoteles();
    fetchTiposTransporte();
    fetchCiudades();
    fetchExcursiones();
  }, []);

  useEffect(() => {
    setPaquetes(initialPaquetes);
  }, [initialPaquetes]);

  const filteredPaquetes = paquetes.filter((paquete) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesTerm =
      term.length === 0 ||
      (paquete.nombre || "").toLowerCase().includes(term) ||
      (paquete.descripcion || "").toLowerCase().includes(term);

    const matchesEstado =
      estadoFiltro === "TODOS" || paquete.estado === Number(estadoFiltro);

    if (!matchesTerm || !matchesEstado) return false;

    if (!fechaInicioFiltro && !fechaFinFiltro) return true;

    const rango = obtenerRangoFechasPaquete(paquete);
    if (!rango?.fechaIni || !rango?.fechaFin) return false;

    const paqueteInicio = new Date(rango.fechaIni);
    paqueteInicio.setHours(0, 0, 0, 0);
    const paqueteFin = new Date(rango.fechaFin);
    paqueteFin.setHours(23, 59, 59, 999);

    const filtroInicio = fechaInicioFiltro
      ? new Date(`${fechaInicioFiltro}T00:00:00`)
      : null;
    const filtroFin = fechaFinFiltro
      ? new Date(`${fechaFinFiltro}T23:59:59`)
      : null;

    const inicioOk = filtroInicio ? paqueteFin >= filtroInicio : true;
    const finOk = filtroFin ? paqueteInicio <= filtroFin : true;

    return inicioOk && finOk;
  });

  const onEditEstadia = (estadia: any, paqueteId: number) => {
    const estadiaId = estadia.id;
    const hotelId = estadia.hotel?.id ?? estadia.id_hotel;
    const fechaInicio = estadia.fecha_ini
      ? new Date(estadia.fecha_ini).toISOString().split("T")[0]
      : "";
    const fechaFin = estadia.fecha_fin
      ? new Date(estadia.fecha_fin).toISOString().split("T")[0]
      : "";

    MySwal.fire({
      title: "Editar Estadía",
      html: `
      <select id="swal-input-hotel" class="swal2-input">
        ${Object.values(hoteles)
          .map(
            (hotel: any) =>
              `<option value="${hotel.id}" data-precio="${hotel.precio_x_dia}" ${
                hotel.id === hotelId ? "selected" : ""
              }>${hotel.nombre}</option>`,
          )
          .join("")}
      </select>
      <input id="swal-input-fecha-inicio" type="date" class="swal2-input" placeholder="Fecha Inicio" value="${fechaInicio}" />
      <input id="swal-input-fecha-fin" type="date" class="swal2-input" placeholder="Fecha Fin" value="${fechaFin}" />
      <input id="swal-input-precio" type="number" class="swal2-input" placeholder="Precio por Día del Hotel" readonly style="background-color: #f0f0f0; cursor: not-allowed;" />
    `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      didOpen: () => {
        const hotelSelect = document.getElementById(
          "swal-input-hotel",
        ) as HTMLSelectElement;
        const precioInput = document.getElementById(
          "swal-input-precio",
        ) as HTMLInputElement;

        if (hotelSelect && precioInput) {
          const selectedOption = hotelSelect.options[hotelSelect.selectedIndex];
          const precio = selectedOption.getAttribute("data-precio");
          if (precio) {
            precioInput.value = precio;
          }
        }

        hotelSelect?.addEventListener("change", () => {
          const selectedOption = hotelSelect.options[hotelSelect.selectedIndex];
          const precio = selectedOption.getAttribute("data-precio");
          if (precio && precioInput) {
            precioInput.value = precio;
          }
        });
      },
      preConfirm: () => {
        const newHotelId = parseInt(
          (document.getElementById("swal-input-hotel") as HTMLSelectElement)
            ?.value,
          10,
        );
        const newFechaInicio = (
          document.getElementById("swal-input-fecha-inicio") as HTMLInputElement
        )?.value;
        const newFechaFin = (
          document.getElementById("swal-input-fecha-fin") as HTMLInputElement
        )?.value;

        if (!newHotelId || !newFechaInicio || !newFechaFin || !paqueteId) {
          Swal.showValidationMessage(
            "Todos los campos deben estar completos y válidos, incluyendo el paquete.",
          );
          return;
        }
        if (
          typeof paqueteId !== "number" ||
          isNaN(paqueteId) ||
          paqueteId <= 0
        ) {
          Swal.showValidationMessage(
            "Error interno: el paquete no está definido correctamente. Intenta desde el botón 'Ver Estadías' del paquete.",
          );
          return;
        }

        // Validación: fecha inicio debe ser menor o igual a fecha fin
        if (newFechaInicio > newFechaFin) {
          Swal.showValidationMessage(
            "La fecha de inicio no puede ser posterior a la fecha de fin.",
          );
          return;
        }

        // Obtener el paquete para validar fechas
        const paquete = paquetes.find((p) => p.id === paqueteId);
        if (!paquete) {
          Swal.showValidationMessage("No se encontró el paquete.");
          return;
        }

        // Validación: no debe superponerse con otras estadías del mismo paquete
        const otrasEstadias = (paquete.estadias || []).filter(
          (e) => e.id !== estadiaId,
        );
        for (const otraEstadia of otrasEstadias) {
          const otraFechaIni = new Date(otraEstadia.fecha_ini)
            .toISOString()
            .split("T")[0];
          const otraFechaFin = new Date(otraEstadia.fecha_fin)
            .toISOString()
            .split("T")[0];

          // Verificar superposición
          if (!(newFechaFin < otraFechaIni || newFechaInicio > otraFechaFin)) {
            Swal.showValidationMessage(
              `La estadía se superpone con otra que va del ${otraFechaIni} al ${otraFechaFin}.`,
            );
            return;
          }
        }

        return {
          id: estadiaId,
          id_paquete: paqueteId,
          id_hotel: newHotelId,
          fecha_ini: newFechaInicio,
          fecha_fin: newFechaFin,
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const estadiaActualizada = result.value;
        axios
          .put(`/api/estadia/${estadiaActualizada.id}`, estadiaActualizada)
          .then((response) => {
            let paqueteId = estadiaActualizada.id_paquete;
            fetchAndUpdatePaquete(paqueteId);
            Swal.fire(
              "Guardado",
              "La estadía fue actualizada correctamente.",
              "success",
            );
          })
          .catch((error) => {
            console.error("Error al actualizar la estadía:", error);
            Swal.fire(
              "Error",
              `No se pudo actualizar la estadía: ${error.message}`,
              "error",
            );
          });
      }
    });
  };

  const onDeleteEstadia = (estadia: any, paquetePadreId?: number) => {
    console.log("🗑️ Eliminar estadía:", estadia);
    let paqueteId = estadia.id_paquete;
    if (!paqueteId) {
      const paquetePadre = paquetes.find(
        (p) =>
          Array.isArray(p.estadias) &&
          p.estadias.some((e) => e.id === estadia.id),
      );
      if (paquetePadre) {
        paqueteId = paquetePadre.id;
      } else if (paquetePadreId) {
        paqueteId = paquetePadreId;
      }
    }
    if (!paqueteId) {
      Swal.fire(
        "Error",
        'No se pudo determinar el paquete de la estadía. Intenta desde el botón "Ver Estadías" del paquete.',
        "error",
      );
      return;
    }
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar la estadía?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/estadia/${estadia.id}`)
          .then(() => {
            console.log("✅ Estadía eliminada");
            setPaquetes((prevPaquetes) =>
              prevPaquetes.map((paquete) =>
                paquete.id === paqueteId
                  ? {
                      ...paquete,
                      estadias: Array.isArray(paquete.estadias)
                        ? paquete.estadias.filter((e) => e.id !== estadia.id)
                        : [],
                    }
                  : paquete,
              ),
            );
            Swal.fire(
              "Eliminado",
              "La estadía fue eliminada correctamente.",
              "success",
            );
          })
          .catch((error) => {
            console.error("❌ Error eliminando estadía:", error);
            Swal.fire(
              "Error",
              `No se pudo eliminar la estadía: ${
                error.response?.data?.message || error.message
              }`,
              "error",
            );
          });
      }
    });
  };

  const handleAddEstadia = (id_paquete: number) => {
    MySwal.fire({
      title: "Agregar Nueva Estadía",
      html: `
      <select id="swal-input-hotel" class="swal2-input">
        ${Object.values(hoteles)
          .map(
            (hotel: any) =>
              `<option value="${hotel.id}" data-precio="${hotel.precio_x_dia}">${hotel.nombre}</option>`,
          )
          .join("")}
      </select>
      <input id="swal-input-fecha-inicio" type="date" class="swal2-input" placeholder="Fecha Inicio" />
      <input id="swal-input-fecha-fin" type="date" class="swal2-input" placeholder="Fecha Fin" />
      <input id="swal-input-precio" type="number" class="swal2-input" placeholder="Precio por Día del Hotel" readonly style="background-color: #f0f0f0; cursor: not-allowed;" />
    `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      didOpen: () => {
        const hotelSelect = document.getElementById(
          "swal-input-hotel",
        ) as HTMLSelectElement;
        const precioInput = document.getElementById(
          "swal-input-precio",
        ) as HTMLInputElement;

        // Establecer precio inicial del primer hotel
        if (hotelSelect && precioInput) {
          const firstOption = hotelSelect.options[0];
          const precio = firstOption.getAttribute("data-precio");
          if (precio) {
            precioInput.value = precio;
          }
        }

        // Actualizar precio cuando cambie el hotel
        hotelSelect?.addEventListener("change", () => {
          const selectedOption = hotelSelect.options[hotelSelect.selectedIndex];
          const precio = selectedOption.getAttribute("data-precio");
          if (precio && precioInput) {
            precioInput.value = precio;
          }
        });
      },
      preConfirm: () => {
        const newHotelId = parseInt(
          (document.getElementById("swal-input-hotel") as HTMLSelectElement)
            ?.value,
          10,
        );
        const newFechaInicio = (
          document.getElementById("swal-input-fecha-inicio") as HTMLInputElement
        )?.value;
        const newFechaFin = (
          document.getElementById("swal-input-fecha-fin") as HTMLInputElement
        )?.value;

        if (!newHotelId || !newFechaInicio || !newFechaFin) {
          Swal.showValidationMessage(
            "Todos los campos son obligatorios y deben ser válidos",
          );
          return;
        }

        // Validación: fecha inicio debe ser menor o igual a fecha fin
        if (newFechaInicio > newFechaFin) {
          Swal.showValidationMessage(
            "La fecha de inicio no puede ser posterior a la fecha de fin.",
          );
          return;
        }

        // Obtener el paquete para validar fechas
        const paquete = paquetes.find((p) => p.id === id_paquete);
        if (!paquete) {
          Swal.showValidationMessage("No se encontró el paquete.");
          return;
        }

        // Validación: no debe superponerse con otras estadías del mismo paquete
        const otrasEstadias = paquete.estadias || [];
        for (const otraEstadia of otrasEstadias) {
          const otraFechaIni = new Date(otraEstadia.fecha_ini)
            .toISOString()
            .split("T")[0];
          const otraFechaFin = new Date(otraEstadia.fecha_fin)
            .toISOString()
            .split("T")[0];

          // Verificar superposición
          if (!(newFechaFin < otraFechaIni || newFechaInicio > otraFechaFin)) {
            Swal.showValidationMessage(
              `La estadía se superpone con otra que va del ${otraFechaIni} al ${otraFechaFin}.`,
            );
            return;
          }
        }

        return {
          id_hotel: newHotelId,
          fecha_ini: newFechaInicio,
          fecha_fin: newFechaFin,
          id_paquete: id_paquete,
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const nuevaEstadia = result.value;
        axios
          .post("/api/estadia", nuevaEstadia)
          .then((response) => {
            fetchAndUpdatePaquete(id_paquete);
            Swal.fire(
              "Guardado",
              "La estadía fue agregada correctamente.",
              "success",
            );
          })
          .catch((error) => {
            console.error(
              "Error al agregar la estadía:",
              error.response?.data || error.message,
            );
            Swal.fire(
              "Error",
              `No se pudo agregar la estadía: ${
                error.response?.data?.message || error.message
              }`,
              "error",
            );
          });
      }
    });
  };

  const handleSaveEstadia = () => {
    if (!estadiaEditada) return;

    const request =
      estadiaEditada.id === 0
        ? axios.post("/api/estadia", estadiaEditada)
        : axios.put(`/api/estadia/${estadiaEditada.id}`, estadiaEditada);

    request
      .then((response) => {
        const updatedEstadia = response.data;
        onAddEstadia(updatedEstadia);
      })
      .catch((error) => {
        console.error("Error guardando estadía:", error);
      });

    setEstadiaEditada(null);
  };

  const fetchAndUpdatePaquete = async (paqueteId: number) => {
    try {
      const response = await axios.get(`/api/paquete/${paqueteId}`);
      const paqueteActualizado = response.data.data || response.data;
      // Inyectar hoteles en las estadías
      if (Array.isArray(paqueteActualizado.estadias)) {
        paqueteActualizado.estadias = paqueteActualizado.estadias.map(
          (estadia: any) =>
            estadia.id_hotel && hoteles[estadia.id_hotel]
              ? { ...estadia, hotel: hoteles[estadia.id_hotel] }
              : estadia,
        );
      }
      setPaquetes((prevPaquetes) =>
        prevPaquetes.map((p) => (p.id === paqueteId ? paqueteActualizado : p)),
      );
    } catch (error) {
      console.error("Error recargando el paquete:", error);
      Swal.fire(
        "Error",
        "No se pudo recargar el paquete actualizado.",
        "error",
      );
    }
  };

  // ===================== EXCURSIONES =====================

  const handleAddExcursion = (id_paquete: number) => {
    const excursionOptions = excursionesDisponibles
      .map(
        (e) =>
          `<option value="${e.id}">${e.nombre} - ${
            e.ciudad?.nombre || "Sin ciudad"
          }</option>`,
      )
      .join("");

    MySwal.fire({
      title: "Agregar Excursión al Paquete",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group full-width">
            <label>Excursión</label>
            <select id="swal-input-excursion">
              <option value="">Seleccionar...</option>
              ${excursionOptions}
            </select>
          </div>
          <div class="swal-form-group">
            <label>Fecha</label>
            <input id="swal-input-fecha" type="date" />
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
        const excursionId = parseInt(
          (document.getElementById("swal-input-excursion") as HTMLSelectElement)
            ?.value,
        );
        const fecha = (
          document.getElementById("swal-input-fecha") as HTMLInputElement
        )?.value;

        if (!excursionId || !fecha) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return;
        }

        return {
          id_excursion: excursionId,
          id_paquete: id_paquete,
          fecha,
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        axios
          .post("/api/paqueteExcursion", result.value)
          .then(() => {
            fetchAndUpdatePaquete(id_paquete);
            Swal.fire(
              "Guardado",
              "La excursión fue agregada correctamente.",
              "success",
            );
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              `No se pudo agregar la excursión: ${
                error.response?.data?.message || error.message
              }`,
              "error",
            );
          });
      }
    });
  };

  const onEditExcursion = (paqueteExcursion: any, paqueteId: number) => {
    const excursionOptions = excursionesDisponibles
      .map(
        (e) =>
          `<option value="${e.id}" ${
            e.id === paqueteExcursion.excursion?.id ? "selected" : ""
          }>${e.nombre} - ${e.ciudad?.nombre || "Sin ciudad"}</option>`,
      )
      .join("");

    MySwal.fire({
      title: "Editar Excursión del Paquete",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group full-width">
            <label>Excursión</label>
            <select id="swal-input-excursion">
              ${excursionOptions}
            </select>
          </div>
          <div class="swal-form-group">
            <label>Fecha</label>
            <input id="swal-input-fecha" type="date" value="${
              paqueteExcursion.fecha
                ? new Date(paqueteExcursion.fecha).toISOString().split("T")[0]
                : ""
            }" />
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
        const excursionId = parseInt(
          (document.getElementById("swal-input-excursion") as HTMLSelectElement)
            ?.value,
        );
        const fecha = (
          document.getElementById("swal-input-fecha") as HTMLInputElement
        )?.value;

        if (!excursionId || !fecha) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return;
        }

        return {
          id_excursion: excursionId,
          id_paquete: paqueteId,
          fecha,
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        axios
          .put(`/api/paqueteExcursion/${paqueteExcursion.id}`, result.value)
          .then(() => {
            fetchAndUpdatePaquete(paqueteId);
            Swal.fire(
              "Guardado",
              "La excursión fue actualizada correctamente.",
              "success",
            );
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              `No se pudo actualizar la excursión: ${
                error.response?.data?.message || error.message
              }`,
              "error",
            );
          });
      }
    });
  };

  const onDeleteExcursion = (paqueteExcursion: any, paqueteId: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la excursión del paquete.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/paqueteExcursion/${paqueteExcursion.id}`)
          .then(() => {
            fetchAndUpdatePaquete(paqueteId);
            Swal.fire(
              "Eliminado",
              "La excursión fue eliminada correctamente.",
              "success",
            );
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              `No se pudo eliminar la excursión: ${
                error.response?.data?.message || error.message
              }`,
              "error",
            );
          });
      }
    });
  };

  const showExcursionesSwal = (paquete: Paquete) => {
    MySwal.fire({
      title: `Excursiones de ${paquete.nombre}`,
      html: `
        <div style="max-height:60vh;overflow-y:auto;">
          ${
            (paquete.paqueteExcursiones ?? []).length === 0
              ? '<p style="color:#666;text-align:center;">No hay excursiones asignadas</p>'
              : (paquete.paqueteExcursiones ?? [])
                  .map(
                    (pe: any) => `
            <div style="border:1px solid #ccc;border-radius:8px;padding:6px 10px;margin-bottom:8px;background:#f9f9f9;display:inline-block;min-width:220px;max-width:98%;box-sizing:border-box;">
              <p style="font-weight:bold;text-decoration:underline;margin:0 0 4px 0;">${
                pe.excursion ? pe.excursion.nombre : "Cargando excursión..."
              }</p>
              <p style="margin:0 0 2px 0;">Fecha: ${
                pe.fecha
                  ? new Date(pe.fecha).toLocaleDateString("es-ES")
                  : "No especificada"
              }</p>
              <p style="margin:0 0 6px 0;">Precio: ${
                pe.excursion?.precio != null
                  ? "$" + pe.excursion.precio
                  : "No especificado"
              }</p>
              <div style="display:flex;gap:8px;justify-content:center;">
                <button class="swal2-confirm swal2-styled" style="background:#3085d6;padding:2px 10px;font-size:0.95em;" onclick="window.editExcursionSwal(${pe.id}, ${paquete.id})">Editar</button>
                <button class="swal2-cancel swal2-styled" style="background:#d33;padding:2px 10px;font-size:0.95em;" onclick="window.deleteExcursionSwal(${pe.id}, ${paquete.id})">Eliminar</button>
              </div>
            </div>
          `,
                  )
                  .join("")
          }
          <button class="swal2-confirm swal2-styled" style="width:90%;margin-top:8px;" onclick="window.addExcursionSwal(${paquete.id})">Agregar Excursión</button>
        </div>
      `,
      showConfirmButton: false,
      width: 600,
      didOpen: () => {
        (window as any).editExcursionSwal = (
          peId: number,
          paqueteId: number,
        ) => {
          const pe = paquete.paqueteExcursiones?.find(
            (e: any) => e.id === peId,
          );
          if (pe) {
            Swal.close();
            setTimeout(() => onEditExcursion(pe, paqueteId), 200);
          }
        };
        (window as any).deleteExcursionSwal = (
          peId: number,
          paqueteId: number,
        ) => {
          const pe = paquete.paqueteExcursiones?.find(
            (e: any) => e.id === peId,
          );
          if (pe) {
            Swal.close();
            setTimeout(() => onDeleteExcursion(pe, paqueteId), 200);
          }
        };
        (window as any).addExcursionSwal = (paqueteId: number) => {
          Swal.close();
          setTimeout(() => handleAddExcursion(paqueteId), 200);
        };
      },
      willClose: () => {
        delete (window as any).editExcursionSwal;
        delete (window as any).deleteExcursionSwal;
        delete (window as any).addExcursionSwal;
      },
    });
  };

  // ===================== FIN EXCURSIONES =====================

  // ===================== TRANSPORTES =====================

  const handleAddTransporte = (id_paquete: number) => {
    const tipoTransporteOptions = tiposTransporte
      .map((t) => `<option value="${t.id}">${t.nombre}</option>`)
      .join("");

    const ciudadOptions = ciudades
      .map((c) => `<option value="${c.id}">${c.nombre}</option>`)
      .join("");

    MySwal.fire({
      title: "Agregar Transporte al Paquete",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group">
            <label>Tipo de transporte</label>
            <select id="swal-input-tipo-transporte">
              <option value="">Seleccionar...</option>
              ${tipoTransporteOptions}
            </select>
          </div>
          <div class="swal-form-group">
            <label>Tipo</label>
            <select id="swal-input-tipo">
              <option value="IDA">Ida</option>
              <option value="VUELTA">Vuelta</option>
            </select>
          </div>
          <div class="swal-form-group">
            <label>Ciudad Origen</label>
            <select id="swal-input-ciudad-origen">
              <option value="">Seleccionar...</option>
              ${ciudadOptions}
            </select>
          </div>
          <div class="swal-form-group">
            <label>Ciudad Destino</label>
            <select id="swal-input-ciudad-destino">
              <option value="">Seleccionar...</option>
              ${ciudadOptions}
            </select>
          </div>
          <div class="swal-form-group">
            <label>Fecha Salida</label>
            <input id="swal-input-fecha-salida" type="datetime-local" />
          </div>
          <div class="swal-form-group">
            <label>Fecha Llegada</label>
            <input id="swal-input-fecha-llegada" type="datetime-local" />
          </div>
          <div class="swal-form-group">
            <label>Nombre Empresa</label>
            <input id="swal-input-nombre-empresa" type="text" />
          </div>
          <div class="swal-form-group">
            <label>Mail Empresa</label>
            <input id="swal-input-mail-empresa" type="email" />
          </div>
          <div class="swal-form-group">
            <label>Capacidad</label>
            <input id="swal-input-capacidad" type="number" />
          </div>
          <div class="swal-form-group">
            <label>Asientos disponibles</label>
            <input id="swal-input-asientos" type="number" />
          </div>
          <div class="swal-form-group">
            <label>Precio ($)</label>
            <input id="swal-input-precio" type="number" step="0.01" />
          </div>
          <div class="swal-form-group">
            <label>Activo</label>
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
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#6c757d",
      preConfirm: () => {
        const tipoTransporteId = parseInt(
          (
            document.getElementById(
              "swal-input-tipo-transporte",
            ) as HTMLSelectElement
          )?.value,
          10,
        );
        const ciudadOrigenId = parseInt(
          (
            document.getElementById(
              "swal-input-ciudad-origen",
            ) as HTMLSelectElement
          )?.value,
          10,
        );
        const ciudadDestinoId = parseInt(
          (
            document.getElementById(
              "swal-input-ciudad-destino",
            ) as HTMLSelectElement
          )?.value,
          10,
        );
        const fechaSalida = (
          document.getElementById("swal-input-fecha-salida") as HTMLInputElement
        )?.value;
        const fechaLlegada = (
          document.getElementById(
            "swal-input-fecha-llegada",
          ) as HTMLInputElement
        )?.value;
        const nombreEmpresa = (
          document.getElementById(
            "swal-input-nombre-empresa",
          ) as HTMLInputElement
        )?.value;
        const mailEmpresa = (
          document.getElementById("swal-input-mail-empresa") as HTMLInputElement
        )?.value;
        const capacidad = parseInt(
          (document.getElementById("swal-input-capacidad") as HTMLInputElement)
            ?.value,
          10,
        );
        const asientosDisponibles = parseInt(
          (document.getElementById("swal-input-asientos") as HTMLInputElement)
            ?.value,
          10,
        );
        const precio = parseFloat(
          (document.getElementById("swal-input-precio") as HTMLInputElement)
            ?.value,
        );
        const tipo = (
          document.getElementById("swal-input-tipo") as HTMLSelectElement
        )?.value as "IDA" | "VUELTA";
        const activo =
          (document.getElementById("swal-input-activo") as HTMLSelectElement)
            ?.value === "1";

        if (
          !tipoTransporteId ||
          !ciudadOrigenId ||
          !ciudadDestinoId ||
          !fechaSalida ||
          !fechaLlegada ||
          !nombreEmpresa ||
          !mailEmpresa ||
          Number.isNaN(capacidad) ||
          Number.isNaN(asientosDisponibles) ||
          Number.isNaN(precio)
        ) {
          Swal.showValidationMessage(
            "Todos los campos son obligatorios y deben ser válidos",
          );
          return;
        }

        return {
          paquete_id: id_paquete,
          tipo_transporte_id: tipoTransporteId,
          ciudad_origen_id: ciudadOrigenId,
          ciudad_destino_id: ciudadDestinoId,
          fecha_salida: fechaSalida,
          fecha_llegada: fechaLlegada,
          nombre_empresa: nombreEmpresa,
          mail_empresa: mailEmpresa,
          capacidad,
          asientos_disponibles: asientosDisponibles,
          precio,
          tipo,
          activo,
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        axios
          .post("/api/paqueteTransporte", result.value)
          .then(() => {
            fetchAndUpdatePaquete(id_paquete);
            Swal.fire(
              "Guardado",
              "El transporte fue agregado correctamente.",
              "success",
            );
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              `No se pudo agregar el transporte: ${
                error.response?.data?.message || error.message
              }`,
              "error",
            );
          });
      }
    });
  };

  const onEditTransporte = (paqueteTransporte: any, paqueteId: number) => {
    const tipoTransporteOptions = tiposTransporte
      .map(
        (t) =>
          `<option value="${t.id}" ${
            t.id === paqueteTransporte.tipoTransporte?.id ? "selected" : ""
          }>${t.nombre}</option>`,
      )
      .join("");

    const ciudadOptions = ciudades
      .map((c) => `<option value="${c.id}">${c.nombre}</option>`)
      .join("");

    MySwal.fire({
      title: "Editar Transporte del Paquete",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group">
            <label>Tipo de transporte</label>
            <select id="swal-input-tipo-transporte">
              ${tipoTransporteOptions}
            </select>
          </div>
          <div class="swal-form-group">
            <label>Tipo</label>
            <select id="swal-input-tipo">
              <option value="IDA" ${
                paqueteTransporte.tipo === "IDA" ? "selected" : ""
              }>Ida</option>
              <option value="VUELTA" ${
                paqueteTransporte.tipo === "VUELTA" ? "selected" : ""
              }>Vuelta</option>
            </select>
          </div>
          <div class="swal-form-group">
            <label>Ciudad Origen</label>
            <select id="swal-input-ciudad-origen">
              ${ciudadOptions}
            </select>
          </div>
          <div class="swal-form-group">
            <label>Ciudad Destino</label>
            <select id="swal-input-ciudad-destino">
              ${ciudadOptions}
            </select>
          </div>
          <div class="swal-form-group">
            <label>Fecha Salida</label>
            <input id="swal-input-fecha-salida" type="datetime-local" value="${
              paqueteTransporte.fecha_salida
                ? new Date(paqueteTransporte.fecha_salida)
                    .toISOString()
                    .slice(0, 16)
                : ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Fecha Llegada</label>
            <input id="swal-input-fecha-llegada" type="datetime-local" value="${
              paqueteTransporte.fecha_llegada
                ? new Date(paqueteTransporte.fecha_llegada)
                    .toISOString()
                    .slice(0, 16)
                : ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Nombre Empresa</label>
            <input id="swal-input-nombre-empresa" type="text" value="${
              paqueteTransporte.nombre_empresa || ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Mail Empresa</label>
            <input id="swal-input-mail-empresa" type="email" value="${
              paqueteTransporte.mail_empresa || ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Capacidad</label>
            <input id="swal-input-capacidad" type="number" value="${
              paqueteTransporte.capacidad ?? ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Asientos disponibles</label>
            <input id="swal-input-asientos" type="number" value="${
              paqueteTransporte.asientos_disponibles ?? ""
            }" />
          </div>
          <div class="swal-form-group">
            <label>Precio ($)</label>
            <input id="swal-input-precio" type="number" step="0.01" value="${
              paqueteTransporte.precio ?? 0
            }" />
          </div>
          <div class="swal-form-group">
            <label>Activo</label>
            <select id="swal-input-activo">
              <option value="1" ${
                paqueteTransporte.activo ? "selected" : ""
              }>Activo</option>
              <option value="0" ${
                !paqueteTransporte.activo ? "selected" : ""
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
      didOpen: () => {
        const origenSelect = document.getElementById(
          "swal-input-ciudad-origen",
        ) as HTMLSelectElement;
        const destinoSelect = document.getElementById(
          "swal-input-ciudad-destino",
        ) as HTMLSelectElement;

        if (origenSelect && paqueteTransporte.ciudadOrigen?.id) {
          origenSelect.value = String(paqueteTransporte.ciudadOrigen.id);
        }
        if (destinoSelect && paqueteTransporte.ciudadDestino?.id) {
          destinoSelect.value = String(paqueteTransporte.ciudadDestino.id);
        }
      },
      preConfirm: () => {
        const tipoTransporteId = parseInt(
          (
            document.getElementById(
              "swal-input-tipo-transporte",
            ) as HTMLSelectElement
          )?.value,
          10,
        );
        const ciudadOrigenId = parseInt(
          (
            document.getElementById(
              "swal-input-ciudad-origen",
            ) as HTMLSelectElement
          )?.value,
          10,
        );
        const ciudadDestinoId = parseInt(
          (
            document.getElementById(
              "swal-input-ciudad-destino",
            ) as HTMLSelectElement
          )?.value,
          10,
        );
        const fechaSalida = (
          document.getElementById("swal-input-fecha-salida") as HTMLInputElement
        )?.value;
        const fechaLlegada = (
          document.getElementById(
            "swal-input-fecha-llegada",
          ) as HTMLInputElement
        )?.value;
        const nombreEmpresa = (
          document.getElementById(
            "swal-input-nombre-empresa",
          ) as HTMLInputElement
        )?.value;
        const mailEmpresa = (
          document.getElementById("swal-input-mail-empresa") as HTMLInputElement
        )?.value;
        const capacidad = parseInt(
          (document.getElementById("swal-input-capacidad") as HTMLInputElement)
            ?.value,
          10,
        );
        const asientosDisponibles = parseInt(
          (document.getElementById("swal-input-asientos") as HTMLInputElement)
            ?.value,
          10,
        );
        const precio = parseFloat(
          (document.getElementById("swal-input-precio") as HTMLInputElement)
            ?.value,
        );
        const tipo = (
          document.getElementById("swal-input-tipo") as HTMLSelectElement
        )?.value as "IDA" | "VUELTA";
        const activo =
          (document.getElementById("swal-input-activo") as HTMLSelectElement)
            ?.value === "1";

        if (
          !tipoTransporteId ||
          !ciudadOrigenId ||
          !ciudadDestinoId ||
          !fechaSalida ||
          !fechaLlegada ||
          !nombreEmpresa ||
          !mailEmpresa ||
          Number.isNaN(capacidad) ||
          Number.isNaN(asientosDisponibles) ||
          Number.isNaN(precio)
        ) {
          Swal.showValidationMessage(
            "Todos los campos son obligatorios y deben ser válidos",
          );
          return;
        }

        return {
          paquete_id: paqueteId,
          tipo_transporte_id: tipoTransporteId,
          ciudad_origen_id: ciudadOrigenId,
          ciudad_destino_id: ciudadDestinoId,
          fecha_salida: fechaSalida,
          fecha_llegada: fechaLlegada,
          nombre_empresa: nombreEmpresa,
          mail_empresa: mailEmpresa,
          capacidad,
          asientos_disponibles: asientosDisponibles,
          precio,
          tipo,
          activo,
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        axios
          .put(`/api/paqueteTransporte/${paqueteTransporte.id}`, result.value)
          .then(() => {
            fetchAndUpdatePaquete(paqueteId);
            Swal.fire(
              "Guardado",
              "El transporte fue actualizado correctamente.",
              "success",
            );
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              `No se pudo actualizar el transporte: ${
                error.response?.data?.message || error.message
              }`,
              "error",
            );
          });
      }
    });
  };

  const onDeleteTransporte = (paqueteTransporte: any, paqueteId: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el transporte del paquete.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/paqueteTransporte/${paqueteTransporte.id}`)
          .then(() => {
            fetchAndUpdatePaquete(paqueteId);
            Swal.fire(
              "Eliminado",
              "El transporte fue eliminado correctamente.",
              "success",
            );
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              `No se pudo eliminar el transporte: ${
                error.response?.data?.message || error.message
              }`,
              "error",
            );
          });
      }
    });
  };

  const showTransportesSwal = async (paquete: Paquete) => {
    try {
      const response = await axios.get(
        `/api/paqueteTransporte/paquete/${paquete.id}`,
      );
      const transportesPaquete = response.data?.data ?? [];

      MySwal.fire({
        title: `Transportes de ${paquete.nombre}`,
        html: `
        <div style="max-height:60vh;overflow-y:auto;">
          ${
            transportesPaquete.length === 0
              ? '<p style="color:#666;text-align:center;">No hay transportes asignados</p>'
              : transportesPaquete
                  .map(
                    (pt: any) => `
            <div style="border:1px solid #ccc;border-radius:8px;padding:6px 10px;margin-bottom:8px;background:#f9f9f9;display:inline-block;min-width:220px;max-width:98%;box-sizing:border-box;">
              <p style="font-weight:bold;text-decoration:underline;margin:0 0 4px 0;">${
                pt.nombre_empresa || "Transporte"
              }</p>
              <p style="margin:0 0 2px 0;"><strong>${
                pt.tipo === "IDA" ? "🚀 Ida" : "🔙 Vuelta"
              }</strong></p>
              <p style="margin:0 0 2px 0;">Tipo: ${
                pt.tipoTransporte?.nombre || "Sin tipo"
              }</p>
              <p style="margin:0 0 2px 0;">Origen: ${
                pt.ciudadOrigen?.nombre || "N/A"
              }</p>
              <p style="margin:0 0 2px 0;">Destino: ${
                pt.ciudadDestino?.nombre || "N/A"
              }</p>
              <p style="margin:0 0 2px 0;">Salida: ${
                pt.fecha_salida
                  ? new Date(pt.fecha_salida).toLocaleString("es-ES")
                  : "No especificada"
              }</p>
              <p style="margin:0 0 2px 0;">Llegada: ${
                pt.fecha_llegada
                  ? new Date(pt.fecha_llegada).toLocaleString("es-ES")
                  : "No especificada"
              }</p>
              <p style="margin:0 0 6px 0;">Precio: ${
                pt.precio != null ? "$" + pt.precio : "No especificado"
              }</p>
              <div style="display:flex;gap:8px;justify-content:center;">
                <button class="swal2-confirm swal2-styled" style="background:#3085d6;padding:2px 10px;font-size:0.95em;" onclick="window.editTransporteSwal(${pt.id}, ${paquete.id})">Editar</button>
                <button class="swal2-cancel swal2-styled" style="background:#d33;padding:2px 10px;font-size:0.95em;" onclick="window.deleteTransporteSwal(${pt.id}, ${paquete.id})">Eliminar</button>
              </div>
            </div>
          `,
                  )
                  .join("")
          }
          <button class="swal2-confirm swal2-styled" style="width:90%;margin-top:8px;" onclick="window.addTransporteSwal(${paquete.id})">Agregar Transporte</button>
        </div>
      `,
        showConfirmButton: false,
        width: 600,
        didOpen: () => {
          (window as any).editTransporteSwal = (
            ptId: number,
            paqueteId: number,
          ) => {
            const pt = transportesPaquete.find((t: any) => t.id === ptId);
            if (pt) {
              Swal.close();
              setTimeout(() => onEditTransporte(pt, paqueteId), 200);
            }
          };
          (window as any).deleteTransporteSwal = (
            ptId: number,
            paqueteId: number,
          ) => {
            const pt = transportesPaquete.find((t: any) => t.id === ptId);
            if (pt) {
              Swal.close();
              setTimeout(() => onDeleteTransporte(pt, paqueteId), 200);
            }
          };
          (window as any).addTransporteSwal = (paqueteId: number) => {
            Swal.close();
            setTimeout(() => handleAddTransporte(paqueteId), 200);
          };
        },
        willClose: () => {
          delete (window as any).editTransporteSwal;
          delete (window as any).deleteTransporteSwal;
          delete (window as any).addTransporteSwal;
        },
      });
    } catch (error: any) {
      Swal.fire(
        "Error",
        `No se pudo cargar los transportes: ${
          error.response?.data?.message || error.message
        }`,
        "error",
      );
    }
  };

  // ===================== FIN TRANSPORTES =====================

  const showEstadiasSwal = (paquete: Paquete) => {
    MySwal.fire({
      title: `Estadías de ${paquete.nombre}`,
      html: `
        <div style="max-height:60vh;overflow-y:auto;">
          ${(paquete.estadias ?? [])
            .map(
              (estadia: any) => `
            <div style="border:1px solid #ccc;border-radius:8px;padding:6px 10px;margin-bottom:8px;background:#f9f9f9;display:inline-block;min-width:220px;max-width:98%;box-sizing:border-box;">
              <p style="font-weight:bold;text-decoration:underline;margin:0 0 4px 0;">${
                estadia.hotel ? estadia.hotel.nombre : "Cargando hotel..."
              }</p>
              <p style="margin:0 0 2px 0;">Fecha Inicio: ${new Date(
                estadia.fecha_ini,
              ).toLocaleDateString("es-ES")}</p>
              <p style="margin:0 0 2px 0;">Fecha Fin: ${new Date(
                estadia.fecha_fin,
              ).toLocaleDateString("es-ES")}</p>
              <p style="margin:0 0 6px 0;">Precio por Día: ${
                estadia.hotel?.precio_x_dia != null
                  ? "$" + estadia.hotel.precio_x_dia
                  : "No especificado"
              }</p>
              <div style="display:flex;gap:8px;justify-content:center;">
                <button class="swal2-confirm swal2-styled" style="background:#3085d6;padding:2px 10px;font-size:0.95em;" onclick="window.editEstadiaSwal(${
                  estadia.id
                }, ${paquete.id})">Editar</button>
                <button class="swal2-cancel swal2-styled" style="background:#d33;padding:2px 10px;font-size:0.95em;" onclick="window.deleteEstadiaSwal(${
                  estadia.id
                }, ${paquete.id})">Eliminar</button>
              </div>
            </div>
          `,
            )
            .join("")}
          <button class="swal2-confirm swal2-styled" style="width:90%;margin-top:8px;" onclick="window.addEstadiaSwal(${
            paquete.id
          })">Agregar Estadía</button>
        </div>
      `,
      showConfirmButton: false,
      width: 600,
      didOpen: () => {
        // Exponer funciones globales para los botones
        (window as any).editEstadiaSwal = (
          estadiaId: number,
          paqueteId: number,
        ) => {
          const estadia = paquete.estadias?.find(
            (e: any) => e.id === estadiaId,
          );
          if (estadia) {
            Swal.close();
            setTimeout(() => onEditEstadia(estadia, paqueteId), 200);
          }
        };
        (window as any).deleteEstadiaSwal = (
          estadiaId: number,
          paqueteId: number,
        ) => {
          const estadia = paquete.estadias?.find(
            (e: any) => e.id === estadiaId,
          );
          if (estadia) {
            Swal.close();
            setTimeout(() => onDeleteEstadia(estadia, paqueteId), 200);
          }
        };
        (window as any).addEstadiaSwal = (paqueteId: number) => {
          Swal.close();
          setTimeout(() => handleAddEstadia(paqueteId), 200);
        };
      },
      willClose: () => {
        // Limpiar funciones globales
        delete (window as any).editEstadiaSwal;
        delete (window as any).deleteEstadiaSwal;
        delete (window as any).addEstadiaSwal;
      },
    });
  };

  return (
    <div className="list-container">
      <div className="list-header">
        {onCreate && (
          <button
            className="btn-create"
            onClick={() => handleCreatePaquete(onCreate, setPaquetes)}
          >
            + Crear Paquete
          </button>
        )}
      </div>
      <div
        className="list-filters"
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Buscar por nombre o descripción"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: "220px",
            padding: "8px 10px",
            borderRadius: "6px",
          }}
        />
        <input
          type="date"
          value={fechaInicioFiltro}
          onChange={(e) => setFechaInicioFiltro(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: "6px" }}
        />
        <input
          type="date"
          value={fechaFinFiltro}
          onChange={(e) => setFechaFinFiltro(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: "6px" }}
        />
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: "6px" }}
        >
          <option value="TODOS">Todos</option>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
        <button
          type="button"
          className="btn-delete"
          style={{ marginLeft: "auto" }}
          onClick={() => {
            setSearchTerm("");
            setFechaInicioFiltro("");
            setFechaFinFiltro("");
            setEstadoFiltro("TODOS");
          }}
        >
          Limpiar filtros
        </button>
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Fechas</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Estadías</th>
            <th>Transportes</th>
            <th>Excursiones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredPaquetes.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                style={{ textAlign: "center", padding: "20px", color: "#666" }}
              >
                No hay paquetes que coincidan con el filtro
              </td>
            </tr>
          ) : (
            filteredPaquetes.map((paquete) => (
              <tr key={paquete.id}>
                <td>
                  <strong>{paquete.nombre}</strong>
                </td>
                <td>
                  <div
                    style={{
                      maxWidth: "250px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {paquete.descripcion}
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
                    <small>
                      {obtenerRangoFechasPaquete(paquete)?.fechaIni
                        ? obtenerRangoFechasPaquete(
                            paquete,
                          )!.fechaIni.toLocaleDateString("es-ES")
                        : "N/A"}
                    </small>
                    <small>
                      {obtenerRangoFechasPaquete(paquete)?.fechaFin
                        ? obtenerRangoFechasPaquete(
                            paquete,
                          )!.fechaFin.toLocaleDateString("es-ES")
                        : "N/A"}
                    </small>
                  </div>
                </td>
                <td>${calcularPrecioTotalPaquete(paquete)}</td>
                <td>
                  <span
                    className={`badge ${
                      paquete.estado === 1
                        ? "badge-confirmada"
                        : "badge-cancelada"
                    }`}
                  >
                    {paquete.estado === 1 ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <button
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => showEstadiasSwal(paquete)}
                  >
                    Ver ({paquete.estadias?.length || 0})
                  </button>
                </td>
                <td>
                  <button
                    style={{
                      backgroundColor: "#17a2b8",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => showTransportesSwal(paquete)}
                  >
                    Ver ({paquete.paqueteTransportes?.length || 0})
                  </button>
                </td>
                <td>
                  <button
                    style={{
                      backgroundColor: "#6f42c1",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => showExcursionesSwal(paquete)}
                  >
                    Ver ({paquete.paqueteExcursiones?.length || 0})
                  </button>
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
                      onClick={() =>
                        handleEditPaquete(paquete, onEdit, setPaquetes)
                      }
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(paquete)}
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

      {estadiaEditada && (
        <EstadiaForm
          estadiaEditada={estadiaEditada}
          onChange={setEstadiaEditada}
          onCancel={() => setEstadiaEditada(null)}
          onSave={handleSaveEstadia}
        />
      )}
    </div>
  );
};

export default PaqueteList;
