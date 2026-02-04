import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../../styles/DestinosPopulares.css";

interface DestinoData {
  nombre: string;
  reservas: number;
  porcentaje: number;
}

interface PaqueteData {
  nombre: string;
  reservas: number;
  ingresos: number;
}

interface EstadisticasDestinos {
  totalCiudades: number;
  totalPaquetes: number;
  destinoMasPopular: string;
  paqueteMasVendido: string;
}

const DestinosPopulares: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [ciudadesData, setCiudadesData] = useState<DestinoData[]>([]);
  const [paquetesData, setPaquetesData] = useState<PaqueteData[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasDestinos | null>(
    null,
  );

  useEffect(() => {
    // Establecer período por defecto: últimos 30 días
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    setFechaFin(hoy.toISOString().split("T")[0]);
    setFechaInicio(hace30Dias.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      cargarDatos();
    }
  }, [fechaInicio, fechaFin]);

  const obtenerCiudadNombre = (reserva: any) => {
    const paquete = reserva?.paquete;
    const ciudadDirecta = paquete?.ciudad?.nombre || paquete?.ciudad;
    if (ciudadDirecta) return ciudadDirecta;

    const ciudadEstadia = paquete?.estadias?.[0]?.hotel?.ciudad?.nombre;
    if (ciudadEstadia) return ciudadEstadia;

    const ciudadExcursion =
      paquete?.paqueteExcursiones?.[0]?.excursion?.ciudad?.nombre;
    if (ciudadExcursion) return ciudadExcursion;

    return "Sin ciudad";
  };

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/reservaPaquete", {
        params: {
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
          estado: "PAGADA",
        },
      });
      let reservasData = response.data.data || [];

      procesarCiudades(reservasData);
      procesarPaquetes(reservasData);
      calcularEstadisticas(reservasData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const procesarCiudades = (reservasData: any[]) => {
    const ciudadesMap: { [key: string]: number } = {};

    reservasData.forEach((reserva) => {
      const ciudad = obtenerCiudadNombre(reserva);
      ciudadesMap[ciudad] = (ciudadesMap[ciudad] || 0) + 1;
    });

    const totalReservas = reservasData.length;
    const ciudadesArray = Object.entries(ciudadesMap)
      .map(([nombre, reservas]) => ({
        nombre,
        reservas,
        porcentaje: totalReservas > 0 ? (reservas / totalReservas) * 100 : 0,
      }))
      .sort((a, b) => b.reservas - a.reservas)
      .slice(0, 10); // Top 10

    setCiudadesData(ciudadesArray);
  };

  const procesarPaquetes = (reservasData: any[]) => {
    const paquetesMap: {
      [key: string]: { reservas: number; ingresos: number };
    } = {};

    reservasData.forEach((reserva) => {
      const nombrePaquete = reserva.paquete?.nombre || "Sin nombre";
      const monto = reserva.pago?.monto || 0;

      if (!paquetesMap[nombrePaquete]) {
        paquetesMap[nombrePaquete] = { reservas: 0, ingresos: 0 };
      }
      paquetesMap[nombrePaquete].reservas += 1;
      paquetesMap[nombrePaquete].ingresos += monto;
    });

    const paquetesArray = Object.entries(paquetesMap)
      .map(([nombre, data]) => ({
        nombre,
        reservas: data.reservas,
        ingresos: data.ingresos,
      }))
      .sort((a, b) => b.reservas - a.reservas)
      .slice(0, 10); // Top 10

    setPaquetesData(paquetesArray);
  };

  const calcularEstadisticas = (reservasData: any[]) => {
    const ciudadesUnicas = new Set(
      reservasData.map((r) => obtenerCiudadNombre(r)).filter(Boolean),
    );
    const paquetesUnicos = new Set(
      reservasData.map((r) => r.paquete?.nombre).filter(Boolean),
    );

    const ciudadesCount: { [key: string]: number } = {};
    const paquetesCount: { [key: string]: number } = {};

    reservasData.forEach((r) => {
      const ciudad = obtenerCiudadNombre(r);
      const paquete = r.paquete?.nombre;
      if (ciudad) ciudadesCount[ciudad] = (ciudadesCount[ciudad] || 0) + 1;
      if (paquete) paquetesCount[paquete] = (paquetesCount[paquete] || 0) + 1;
    });

    const destinoMasPopular =
      Object.entries(ciudadesCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "N/A";
    const paqueteMasVendido =
      Object.entries(paquetesCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "N/A";

    setEstadisticas({
      totalCiudades: ciudadesUnicas.size,
      totalPaquetes: paquetesUnicos.size,
      destinoMasPopular,
      paqueteMasVendido,
    });
  };

  const establecerPeriodoRapido = (dias: number) => {
    const hoy = new Date();
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - dias);

    setFechaFin(hoy.toISOString().split("T")[0]);
    setFechaInicio(inicio.toISOString().split("T")[0]);
  };

  const COLORS = ["#007bff", "#28a745", "#ffc107", "#dc3545", "#17a2b8"];

  return (
    <div className="destinos-populares-container">
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
          {/* Tarjetas de estadísticas */}
          {estadisticas && (
            <div className="estadisticas-cards">
              <div className="stat-card ciudades">
                <div className="stat-content">
                  <h4>Ciudades Activas</h4>
                  <p className="stat-value">{estadisticas.totalCiudades}</p>
                </div>
              </div>
              <div className="stat-card paquetes">
                <div className="stat-content">
                  <h4>Paquetes Activos</h4>
                  <p className="stat-value">{estadisticas.totalPaquetes}</p>
                </div>
              </div>
              <div className="stat-card destino-top">
                <div className="stat-content">
                  <h4>Destino Más Popular</h4>
                  <p className="stat-value-text">
                    {estadisticas.destinoMasPopular}
                  </p>
                </div>
              </div>
              <div className="stat-card paquete-top">
                <div className="stat-content">
                  <h4>Paquete Más Vendido</h4>
                  <p className="stat-value-text">
                    {estadisticas.paqueteMasVendido}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Gráficos */}
          <div className="graficos-section">
            {/* Gráfico de barras - Top ciudades */}
            <div className="grafico-container">
              <h3>Top 10 Destinos por Reservas</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={ciudadesData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="nombre" type="category" width={90} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="reservas"
                    fill="#007bff"
                    name="Cantidad de Reservas"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de barras - Top paquetes */}
            <div className="grafico-container">
              <h3>Top 10 Paquetes Más Vendidos</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={paquetesData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="nombre" type="category" width={90} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="reservas"
                    fill="#28a745"
                    name="Cantidad de Reservas"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de distribución */}
          {ciudadesData.length > 0 && (
            <div className="grafico-full-width">
              <div className="grafico-container">
                <h3>Distribución de Reservas por Destino</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={ciudadesData.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="reservas"
                      nameKey="nombre"
                    >
                      {ciudadesData.slice(0, 5).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DestinosPopulares;
