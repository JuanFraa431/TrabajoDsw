import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { Paquete } from "../../interface/paquete";
import { Estadia } from "../../interface/estadia";
import EstadiaForm from "../Estadia/EstadiaForm";

import "../../styles/List.css";
import "../../styles/Cliente/ClienteList.css";

interface PaqueteListProps {
  paquetes: Paquete[];
  onEdit: (paquete: Paquete) => void;
  onDelete: (paquete: Paquete) => void;
  onAddEstadia: (newEstadia: any) => void;
  onCreate?: (paquete: Paquete) => void;
}

const MySwal = withReactContent(Swal);

const handleEditPaquete = (
  paquete: Paquete,
  onEdit: (paquete: Paquete) => void,
  setPaquetes: React.Dispatch<React.SetStateAction<Paquete[]>>,
) => {
  let nombre = paquete.nombre;
  let descripcion = paquete.descripcion;
  let detalle = paquete.detalle;
  let estado = paquete.estado;
  let precio = paquete.precio;
  let fecha_inicio = new Date(paquete.fecha_ini).toISOString().split("T")[0];
  let fecha_fin = new Date(paquete.fecha_fin).toISOString().split("T")[0];
  let imagen = paquete.imagen;

  MySwal.fire({
    title: "Editar Paquete",
    html: `
      <div class="form-editar-paquete">
        <div class="sweet-form-row">
          <label for="swal-input-nombre">Nombre</label>
          <input id="swal-input-nombre" placeholder="Nombre" value="${nombre}" />
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-estado">Estado</label>
          <select id="swal-input-estado">
            <option value="1" ${estado === 1 ? "selected" : ""}>Activo</option>
            <option value="0" ${
              estado === 0 ? "selected" : ""
            }>Inactivo</option>
          </select>
        </div>

        <div class="sweet-form-row full-width">
          <label for="swal-input-descripcion">Descripción</label>
          <textarea id="swal-input-descripcion" placeholder="Descripción">${descripcion}</textarea>
        </div>

        <div class="sweet-form-row full-width">
          <label for="swal-input-detalle">Detalle</label>
          <textarea id="swal-input-detalle" placeholder="Detalle">${detalle}</textarea>
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-precio">Precio ($)</label>
          <input id="swal-input-precio" type="number" placeholder="Precio" value="${precio}" />
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-imagen">URL de Imagen</label>
          <input id="swal-input-imagen" placeholder="https://..." value="${imagen}" />
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-fecha-inicio">Fecha Inicio</label>
          <input id="swal-input-fecha-inicio" type="date" value="${fecha_inicio}" />
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-fecha-fin">Fecha Fin</label>
          <input id="swal-input-fecha-fin" type="date" value="${fecha_fin}" />
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
      const newPrecio = parseFloat(
        (document.getElementById("swal-input-precio") as HTMLInputElement)
          ?.value,
      );
      const newFechaInicio = (
        document.getElementById("swal-input-fecha-inicio") as HTMLInputElement
      )?.value;
      const newFechaFin = (
        document.getElementById("swal-input-fecha-fin") as HTMLInputElement
      )?.value;
      const newImagen = (
        document.getElementById("swal-input-imagen") as HTMLInputElement
      )?.value;

      if (
        !newNombre ||
        isNaN(newEstado) ||
        !newDescripcion ||
        !newDetalle ||
        isNaN(newPrecio) ||
        !newFechaInicio ||
        !newFechaFin ||
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
        precio: newPrecio,
        fecha_ini: newFechaInicio,
        fecha_fin: newFechaFin,
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

        <div class="sweet-form-row">
          <label for="swal-input-precio">Precio ($)</label>
          <input id="swal-input-precio" type="number" placeholder="0.00" />
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-imagen">URL de Imagen</label>
          <input id="swal-input-imagen" placeholder="https://..." />
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-fecha-inicio">Fecha Inicio</label>
          <input id="swal-input-fecha-inicio" type="date" />
        </div>

        <div class="sweet-form-row">
          <label for="swal-input-fecha-fin">Fecha Fin</label>
          <input id="swal-input-fecha-fin" type="date" />
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
      const precio = parseFloat(
        (document.getElementById("swal-input-precio") as HTMLInputElement)
          ?.value,
      );
      const fechaInicio = (
        document.getElementById("swal-input-fecha-inicio") as HTMLInputElement
      )?.value;
      const fechaFin = (
        document.getElementById("swal-input-fecha-fin") as HTMLInputElement
      )?.value;
      const imagen = (
        document.getElementById("swal-input-imagen") as HTMLInputElement
      )?.value;

      if (
        !nombre ||
        isNaN(estado) ||
        !descripcion ||
        !detalle ||
        isNaN(precio) ||
        !fechaInicio ||
        !fechaFin ||
        !imagen
      ) {
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
        precio,
        fecha_ini: fechaInicio,
        fecha_fin: fechaFin,
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
  const [transportes, setTransportes] = useState<any[]>([]);
  const [activePaquete, setActivePaquete] = useState<number | null>(null);
  const [estadiaEditada, setEstadiaEditada] = useState<Estadia | null>(null);

  const fetchTransportes = async () => {
    try {
      const response = await axios.get("/api/transporte");
      if (Array.isArray(response.data.data)) {
        setTransportes(response.data.data);
      }
    } catch (error) {
      console.error("Error al obtener los transportes:", error);
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
    fetchTransportes();
  }, []);

  useEffect(() => {
    setPaquetes(initialPaquetes);
  }, [initialPaquetes]);

  const toggleEstadias = (paqueteId: number, estadias: Estadia[]) => {
    if (activePaquete === paqueteId) {
      setActivePaquete(null);
      return;
    }

    setActivePaquete(paqueteId);
    estadias.forEach((estadia) => {});
  };

  const onEditEstadia = (estadia: Estadia, paquetePadreId?: number) => {
    const fechaInicio = new Date(estadia.fecha_ini).toISOString().split("T")[0];
    const fechaFin = new Date(estadia.fecha_fin).toISOString().split("T")[0];
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
    const estadiaId = estadia.id;

    MySwal.fire({
      title: "Editar Estadía",
      html: `
      <div class="form-editar-estadia">
        <div class="sweet-form-row">
          <label for="swal-input-hotel">Hotel</label>
          <select id="swal-input-hotel">
            ${Object.values(hoteles)
              .map(
                (hotel: any) =>
                  `<option value="${hotel.id}" data-precio="${
                    hotel.precio_x_dia
                  }" ${
                    hotel.id ===
                    (typeof estadia.hotel === "object"
                      ? estadia.hotel?.id
                      : estadia.hotel)
                      ? "selected"
                      : ""
                  }>${hotel.nombre}</option>`,
              )
              .join("")}
          </select>
        </div>
        <div class="sweet-form-row">
          <label for="swal-input-fecha-inicio">Fecha Inicio</label>
          <input id="swal-input-fecha-inicio" type="date" value="${fechaInicio}" />
        </div>
        <div class="sweet-form-row">
          <label for="swal-input-fecha-fin">Fecha Fin</label>
          <input id="swal-input-fecha-fin" type="date" value="${fechaFin}" />
        </div>
        <div class="sweet-form-row">
          <label for="swal-input-precio">Precio por Día del Hotel</label>
          <input id="swal-input-precio" type="number" step="0.01" value="${
            estadia.precio_x_dia
          }" readonly style="background-color: #f0f0f0; cursor: not-allowed;" />
        </div>
      </div>
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
        const newPrecio = parseFloat(
          (document.getElementById("swal-input-precio") as HTMLInputElement)
            ?.value,
        );

        if (
          !newHotelId ||
          !newFechaInicio ||
          !newFechaFin ||
          isNaN(newPrecio) ||
          !paqueteId
        ) {
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

        const paqueteFechaIni = new Date(paquete.fecha_ini)
          .toISOString()
          .split("T")[0];
        const paqueteFechaFin = new Date(paquete.fecha_fin)
          .toISOString()
          .split("T")[0];

        // Validación: la estadía debe estar dentro del rango del paquete
        if (newFechaInicio < paqueteFechaIni || newFechaFin > paqueteFechaFin) {
          Swal.showValidationMessage(
            `La estadía debe estar entre ${paqueteFechaIni} y ${paqueteFechaFin} (fechas del paquete).`,
          );
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
          precio_x_dia: newPrecio,
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
        const newPrecio = parseFloat(
          (document.getElementById("swal-input-precio") as HTMLInputElement)
            ?.value,
        );

        if (
          !newHotelId ||
          !newFechaInicio ||
          !newFechaFin ||
          isNaN(newPrecio)
        ) {
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

        const paqueteFechaIni = new Date(paquete.fecha_ini)
          .toISOString()
          .split("T")[0];
        const paqueteFechaFin = new Date(paquete.fecha_fin)
          .toISOString()
          .split("T")[0];

        // Validación: la estadía debe estar dentro del rango del paquete
        if (newFechaInicio < paqueteFechaIni || newFechaFin > paqueteFechaFin) {
          Swal.showValidationMessage(
            `La estadía debe estar entre ${paqueteFechaIni} y ${paqueteFechaFin} (fechas del paquete).`,
          );
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
          precio_x_dia: newPrecio,
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

  // ===================== TRANSPORTES =====================

  const handleAddTransporte = (id_paquete: number) => {
    const transporteOptions = transportes
      .map(
        (t) =>
          `<option value="${t.id}" data-precio="${t.precio || 0}">${
            t.nombre
          } - ${t.tipoTransporte?.nombre || "Sin tipo"}</option>`,
      )
      .join("");

    MySwal.fire({
      title: "Agregar Transporte al Paquete",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group full-width">
            <label>Transporte</label>
            <select id="swal-input-transporte">
              <option value="">Seleccionar...</option>
              ${transporteOptions}
            </select>
          </div>
          <div class="swal-form-group">
            <label>Día</label>
            <input id="swal-input-dia" type="text" placeholder="Ej: Día 1" />
          </div>
          <div class="swal-form-group">
            <label>Horario</label>
            <input id="swal-input-horario" type="time" />
          </div>
          <div class="swal-form-group">
            <label>Precio ($)</label>
            <input id="swal-input-precio" type="number" step="0.01" />
          </div>
          <div class="swal-form-group">
            <label>Tipo</label>
            <select id="swal-input-esida">
              <option value="true">Ida</option>
              <option value="false">Vuelta</option>
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
        const transporteSelect = document.getElementById(
          "swal-input-transporte",
        ) as HTMLSelectElement;
        const precioInput = document.getElementById(
          "swal-input-precio",
        ) as HTMLInputElement;

        transporteSelect?.addEventListener("change", () => {
          const selectedOption =
            transporteSelect.options[transporteSelect.selectedIndex];
          const precio = selectedOption.getAttribute("data-precio");
          if (precio && precioInput) {
            precioInput.value = precio;
          }
        });
      },
      preConfirm: () => {
        const transporteId = parseInt(
          (
            document.getElementById(
              "swal-input-transporte",
            ) as HTMLSelectElement
          )?.value,
        );
        const dia = (
          document.getElementById("swal-input-dia") as HTMLInputElement
        )?.value;
        const horario = (
          document.getElementById("swal-input-horario") as HTMLInputElement
        )?.value;
        const precio = parseFloat(
          (document.getElementById("swal-input-precio") as HTMLInputElement)
            ?.value,
        );
        const es_ida =
          (document.getElementById("swal-input-esida") as HTMLSelectElement)
            ?.value === "true";

        if (!transporteId || !dia || !horario || isNaN(precio)) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return;
        }

        return {
          id_transporte: transporteId,
          id_paquete: id_paquete,
          dia,
          horario,
          precio,
          es_ida,
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
    const transporteOptions = transportes
      .map(
        (t) =>
          `<option value="${t.id}" data-precio="${t.precio || 0}" ${
            t.id === paqueteTransporte.transporte?.id ? "selected" : ""
          }>${t.nombre} - ${t.tipoTransporte?.nombre || "Sin tipo"}</option>`,
      )
      .join("");

    MySwal.fire({
      title: "Editar Transporte del Paquete",
      html: `
        <div class="swal-form-grid">
          <div class="swal-form-group full-width">
            <label>Transporte</label>
            <select id="swal-input-transporte">
              ${transporteOptions}
            </select>
          </div>
          <div class="swal-form-group">
            <label>Día</label>
            <input id="swal-input-dia" type="text" value="${
              paqueteTransporte.dia
            }" />
          </div>
          <div class="swal-form-group">
            <label>Horario</label>
            <input id="swal-input-horario" type="time" value="${
              paqueteTransporte.horario
            }" />
          </div>
          <div class="swal-form-group">
            <label>Precio ($)</label>
            <input id="swal-input-precio" type="number" step="0.01" value="${
              paqueteTransporte.precio
            }" />
          </div>
          <div class="swal-form-group">
            <label>Tipo</label>
            <select id="swal-input-esida">
              <option value="true" ${
                paqueteTransporte.es_ida ? "selected" : ""
              }>Ida</option>
              <option value="false" ${
                !paqueteTransporte.es_ida ? "selected" : ""
              }>Vuelta</option>
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
        const transporteId = parseInt(
          (
            document.getElementById(
              "swal-input-transporte",
            ) as HTMLSelectElement
          )?.value,
        );
        const dia = (
          document.getElementById("swal-input-dia") as HTMLInputElement
        )?.value;
        const horario = (
          document.getElementById("swal-input-horario") as HTMLInputElement
        )?.value;
        const precio = parseFloat(
          (document.getElementById("swal-input-precio") as HTMLInputElement)
            ?.value,
        );
        const es_ida =
          (document.getElementById("swal-input-esida") as HTMLSelectElement)
            ?.value === "true";

        if (!transporteId || !dia || !horario || isNaN(precio)) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return;
        }

        return {
          id_transporte: transporteId,
          id_paquete: paqueteId,
          dia,
          horario,
          precio,
          es_ida,
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

  const showTransportesSwal = (paquete: Paquete) => {
    MySwal.fire({
      title: `Transportes de ${paquete.nombre}`,
      html: `
        <div style="max-height:60vh;overflow-y:auto;">
          ${
            (paquete.paqueteTransportes ?? []).length === 0
              ? '<p style="color:#666;text-align:center;">No hay transportes asignados</p>'
              : (paquete.paqueteTransportes ?? [])
                  .map(
                    (pt: any) => `
            <div style="border:1px solid #ccc;border-radius:8px;padding:6px 10px;margin-bottom:8px;background:#f9f9f9;display:inline-block;min-width:220px;max-width:98%;box-sizing:border-box;">
              <p style="font-weight:bold;text-decoration:underline;margin:0 0 4px 0;">${
                pt.transporte ? pt.transporte.nombre : "Cargando transporte..."
              }</p>
              <p style="margin:0 0 2px 0;"><strong>${
                pt.es_ida ? "🚀 Ida" : "🔙 Vuelta"
              }</strong></p>
              <p style="margin:0 0 2px 0;">Día: ${pt.dia}</p>
              <p style="margin:0 0 2px 0;">Horario: ${pt.horario}</p>
              <p style="margin:0 0 6px 0;">Precio: $${pt.precio}</p>
              <div style="display:flex;gap:8px;justify-content:center;">
                <button class="swal2-confirm swal2-styled" style="background:#3085d6;padding:2px 10px;font-size:0.95em;" onclick="window.editTransporteSwal(${
                  pt.id
                }, ${paquete.id})">Editar</button>
                <button class="swal2-cancel swal2-styled" style="background:#d33;padding:2px 10px;font-size:0.95em;" onclick="window.deleteTransporteSwal(${
                  pt.id
                }, ${paquete.id})">Eliminar</button>
              </div>
            </div>
          `,
                  )
                  .join("")
          }
          <button class="swal2-confirm swal2-styled" style="width:90%;margin-top:8px;" onclick="window.addTransporteSwal(${
            paquete.id
          })">Agregar Transporte</button>
        </div>
      `,
      showConfirmButton: false,
      width: 600,
      didOpen: () => {
        (window as any).editTransporteSwal = (
          ptId: number,
          paqueteId: number,
        ) => {
          const pt = paquete.paqueteTransportes?.find(
            (t: any) => t.id === ptId,
          );
          if (pt) {
            Swal.close();
            setTimeout(() => onEditTransporte(pt, paqueteId), 200);
          }
        };
        (window as any).deleteTransporteSwal = (
          ptId: number,
          paqueteId: number,
        ) => {
          const pt = paquete.paqueteTransportes?.find(
            (t: any) => t.id === ptId,
          );
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
              <p style="margin:0 0 6px 0;">Precio por Día: $${
                estadia.precio_x_dia
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paquetes.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                style={{ textAlign: "center", padding: "20px", color: "#666" }}
              >
                No hay paquetes registrados
              </td>
            </tr>
          ) : (
            paquetes.map((paquete) => (
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
                      {new Date(paquete.fecha_ini).toLocaleDateString("es-ES")}
                    </small>
                    <small>
                      {new Date(paquete.fecha_fin).toLocaleDateString("es-ES")}
                    </small>
                  </div>
                </td>
                <td>${paquete.precio}</td>
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
