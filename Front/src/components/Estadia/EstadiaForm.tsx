import React, { useEffect, useState } from "react";
import { Estadia } from "../../interface/estadia";
import { Hotel } from "../../interface/hotel";
import axios from "axios";

interface Props {
  estadiaEditada: Estadia | null;
  onChange: (estadia: Estadia) => void;
  onCancel: () => void;
  onSave: () => void;
}

const EstadiaForm: React.FC<Props> = ({
  estadiaEditada,
  onChange,
  onCancel,
  onSave,
}) => {
  if (!estadiaEditada) return null;

  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    axios
      .get("/api/hotel/")
      .then((response) => setHotels(response.data.data))
      .catch((error) => console.error(error));
  }, []);

  const handleHotelChange = (hotelId: number) => {
    const selectedHotel = hotels.find((h) => h.id === hotelId);
    if (selectedHotel) {
      onChange({
        ...estadiaEditada,
        hotel: selectedHotel,
      });
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <label htmlFor="id_hotel">Hotel:</label>
      <select
        id="id_hotel"
        value={estadiaEditada.hotel?.id || ""}
        onChange={(e) => handleHotelChange(parseInt(e.target.value))}
        required
      >
        <option value="">Seleccione un hotel</option>
        {hotels.map((hotel) => (
          <option key={hotel.id} value={hotel.id}>
            {hotel.nombre}
          </option>
        ))}
      </select>

      <label htmlFor="id_paquete">ID Paquete:</label>
      <input
        id="id_paquete"
        type="hidden"
        value={estadiaEditada.id_paquete}
        onChange={(e) =>
          onChange({ ...estadiaEditada, id_paquete: parseInt(e.target.value) })
        }
        required
      />

      <label htmlFor="fecha_ini">Fecha de Inicio:</label>
      <input
        id="fecha_ini"
        type="date"
        value={
          estadiaEditada.fecha_ini ? estadiaEditada.fecha_ini.split("T")[0] : ""
        }
        onChange={(e) =>
          onChange({ ...estadiaEditada, fecha_ini: e.target.value })
        }
        required
      />

      <label htmlFor="fecha_fin">Fecha de Finalización:</label>
      <input
        id="fecha_fin"
        type="date"
        value={
          estadiaEditada.fecha_fin ? estadiaEditada.fecha_fin.split("T")[0] : ""
        }
        onChange={(e) =>
          onChange({ ...estadiaEditada, fecha_fin: e.target.value })
        }
        required
      />

      <label>Precio por Día del Hotel:</label>
      <p
        style={{
          margin: "0",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          fontWeight: "bold",
        }}
      >
        ${estadiaEditada.hotel?.precio_x_dia || 0}
      </p>

      <button type="submit">Guardar Cambios</button>
      <button type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
};

export default EstadiaForm;
