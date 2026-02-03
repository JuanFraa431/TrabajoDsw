import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../styles/ReservasPorPeriodo.css";

interface ReservaEstadistica {
  fecha: string;
  cantidad: number;
  ingresos: number;
  estado: string;
}

interface EstadisticasResumen {
  totalReservas: number;
  reservasReservadas: number;
  reservasCanceladas: number;
}

const ReservasPorPeriodo: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [estadoFiltro, setEstadoFiltro] = useState<string>("todos");
  const [reservas, setReservas] = useState<any[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasResumen | null>(
    null,
  );
  const [datosPorDia, setDatosPorDia] = useState<any[]>([]);
  const [datosPorEstado, setDatosPorEstado] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Establecer fechas por defecto (último mes)
  useEffect(() => {
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);

    setFechaFin(hoy.toISOString().split("T")[0]);
    setFechaInicio(haceUnMes.toISOString().split("T")[0]);
  }, []);

  // Cargar datos cuando cambian los filtros
  useEffect(() => {
    if (fechaInicio && fechaFin) {
      cargarReservas();
    }
  }, [fechaInicio, fechaFin, estadoFiltro]);

  const cargarReservas = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/reservaPaquete");
      let reservasData = response.data.data || [];

      // Filtrar por fechas
      reservasData = reservasData.filter((r: any) => {
        const fechaReserva = new Date(r.fecha);
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59, 999); // Incluir todo el día final
        return fechaReserva >= inicio && fechaReserva <= fin;
      });

      // Filtrar por estado
      if (estadoFiltro !== "todos") {
        reservasData = reservasData.filter(
          (r: any) => r.estado?.toLowerCase() === estadoFiltro.toLowerCase(),
        );
      }

      setReservas(reservasData);
      calcularEstadisticas(reservasData);
      procesarDatosPorDia(reservasData);
      procesarDatosPorEstado(reservasData);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (reservasData: any[]) => {
    const totalReservas = reservasData.length;

    const reservasReservadas = reservasData.filter(
      (r) => r.estado?.toLowerCase() === "reservado",
    ).length;
    const reservasCanceladas = reservasData.filter(
      (r) => r.estado?.toLowerCase() === "cancelado",
    ).length;

    setEstadisticas({
      totalReservas,
      reservasReservadas,
      reservasCanceladas,
    });
  };

  const procesarDatosPorDia = (reservasData: any[]) => {
    const datosPorFecha: {
      [key: string]: { cantidad: number; ingresos: number };
    } = {};

    reservasData.forEach((r) => {
      const fecha = new Date(r.fecha).toLocaleDateString("es-AR");
      if (!datosPorFecha[fecha]) {
        datosPorFecha[fecha] = { cantidad: 0, ingresos: 0 };
      }
      datosPorFecha[fecha].cantidad += 1;
      datosPorFecha[fecha].ingresos += r.pago?.monto || 0;
    });

    const datos = Object.keys(datosPorFecha)
      .sort(
        (a, b) =>
          new Date(a.split("/").reverse().join("-")).getTime() -
          new Date(b.split("/").reverse().join("-")).getTime(),
      )
      .map((fecha) => ({
        fecha,
        cantidad: datosPorFecha[fecha].cantidad,
        ingresos: datosPorFecha[fecha].ingresos,
      }));

    setDatosPorDia(datos);
  };

  const procesarDatosPorEstado = (reservasData: any[]) => {
    const estados: { [key: string]: number } = {};

    reservasData.forEach((r) => {
      const estado = r.estado || "Sin estado";
      estados[estado] = (estados[estado] || 0) + 1;
    });

    const datos = Object.keys(estados).map((estado) => ({
      name: estado,
      value: estados[estado],
    }));

    setDatosPorEstado(datos);
  };

  const establecerPeriodoRapido = (dias: number) => {
    const hoy = new Date();
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - dias);

    setFechaFin(hoy.toISOString().split("T")[0]);
    setFechaInicio(inicio.toISOString().split("T")[0]);
  };

  const getColorByEstado = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower === "reservado") return "#28a745";
    if (estadoLower === "cancelado") return "#dc3545";
    return "#6c757d"; // gris para sin estado u otros
  };

  return (
    <div className="reservas-periodo-container">
      <div className="filtros-section">
        <h3>Filtros</h3>
        <div className="filtros-grid">
          <div className="filtro-group">
            <label>Fecha Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="filtro-group">
            <label>Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
          <div className="filtro-group">
            <label>Estado</label>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="reservado">Reservado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="periodos-rapidos">
          <button onClick={() => establecerPeriodoRapido(7)}>
            Últimos 7 días
          </button>
          <button onClick={() => establecerPeriodoRapido(30)}>
            Último mes
          </button>
          <button onClick={() => establecerPeriodoRapido(90)}>
            Últimos 3 meses
          </button>
          <button onClick={() => establecerPeriodoRapido(365)}>
            Último año
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Cargando estadísticas...</div>
      ) : (
        <>
          {/* Tarjetas de resumen */}
          {estadisticas && (
            <div className="estadisticas-cards">
              <div className="stat-card total">
                <div className="stat-content">
                  <h4>Total Reservas</h4>
                  <p className="stat-value">{estadisticas.totalReservas}</p>
                </div>
              </div>
              <div className="stat-card reservadas">
                <div className="stat-content">
                  <h4>Reservadas</h4>
                  <p className="stat-value">
                    {estadisticas.reservasReservadas}
                  </p>
                </div>
              </div>
              <div className="stat-card canceladas">
                <div className="stat-content">
                  <h4>Canceladas</h4>
                  <p className="stat-value">
                    {estadisticas.reservasCanceladas}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Gráficos */}
          <div className="graficos-section">
            {/* Gráfico de línea - Reservas por día */}
            <div className="grafico-container">
              <h3>Evolución de Reservas por Día</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={datosPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cantidad"
                    stroke="#007bff"
                    name="Cantidad de Reservas"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de torta - Distribución por estado */}
            <div className="grafico-container pie-chart">
              <h3>Distribución por Estado</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={datosPorEstado}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {datosPorEstado.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getColorByEstado(entry.name)}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReservasPorPeriodo;
