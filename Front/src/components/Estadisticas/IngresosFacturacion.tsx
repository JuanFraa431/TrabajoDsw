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
import "../../styles/IngresosFacturacion.css";

interface IngresosPorDia {
  fecha: string;
  ingresos: number;
  cantidad: number;
}

interface MetodoPagoData {
  metodo: string;
  monto: number;
  cantidad: number;
}

interface TipoFacturaData {
  tipo: string;
  cantidad: number;
  monto: number;
}

interface Estadisticas {
  totalIngresos: number;
  totalFacturas: number;
  montoPromedio: number;
}

const IngresosFacturacion: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [ingresosPorDia, setIngresosPorDia] = useState<IngresosPorDia[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPagoData[]>([]);
  const [tiposFactura, setTiposFactura] = useState<TipoFacturaData[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);

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

      // Filtrar solo pagos confirmados
      reservasData = reservasData.filter(
        (r: any) => r.pago?.estado === "APROBADO",
      );

      procesarIngresosPorDia(reservasData);
      procesarMetodosPago(reservasData);
      procesarTiposFactura(reservasData);
      calcularEstadisticas(reservasData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const procesarIngresosPorDia = (reservasData: any[]) => {
    const ingresosPorDiaMap: {
      [fecha: string]: { ingresos: number; cantidad: number };
    } = {};

    reservasData.forEach((reserva) => {
      const fecha = new Date(reserva.fecha).toISOString().split("T")[0];
      const monto = reserva.pago?.monto || 0;

      if (!ingresosPorDiaMap[fecha]) {
        ingresosPorDiaMap[fecha] = { ingresos: 0, cantidad: 0 };
      }
      ingresosPorDiaMap[fecha].ingresos += monto;
      ingresosPorDiaMap[fecha].cantidad += 1;
    });

    const ingresoArray = Object.entries(ingresosPorDiaMap)
      .map(([fecha, data]) => ({
        fecha,
        ingresos: data.ingresos,
        cantidad: data.cantidad,
      }))
      .sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
      );

    setIngresosPorDia(ingresoArray);
  };

  const procesarMetodosPago = (reservasData: any[]) => {
    const metodosPagoMap: {
      [metodo: string]: { monto: number; cantidad: number };
    } = {};

    reservasData.forEach((reserva) => {
      const metodo = reserva.pago?.metodoDePago || "Sin especificar";
      const monto = reserva.pago?.monto || 0;

      if (!metodosPagoMap[metodo]) {
        metodosPagoMap[metodo] = { monto: 0, cantidad: 0 };
      }
      metodosPagoMap[metodo].monto += monto;
      metodosPagoMap[metodo].cantidad += 1;
    });

    const metodosArray = Object.entries(metodosPagoMap)
      .map(([metodo, data]) => ({
        metodo,
        monto: data.monto,
        cantidad: data.cantidad,
      }))
      .sort((a, b) => b.monto - a.monto);

    setMetodosPago(metodosArray);
  };

  const procesarTiposFactura = (reservasData: any[]) => {
    const tiposFacturaMap: {
      [tipo: string]: { cantidad: number; monto: number };
    } = {};

    reservasData.forEach((reserva) => {
      const tipo = reserva.pago?.tipoFactura || "Sin especificar";
      const monto = reserva.pago?.monto || 0;

      if (!tiposFacturaMap[tipo]) {
        tiposFacturaMap[tipo] = { cantidad: 0, monto: 0 };
      }
      tiposFacturaMap[tipo].cantidad += 1;
      tiposFacturaMap[tipo].monto += monto;
    });

    const tiposArray = Object.entries(tiposFacturaMap)
      .map(([tipo, data]) => ({
        tipo,
        cantidad: data.cantidad,
        monto: data.monto,
      }))
      .sort((a, b) => b.cantidad - a.cantidad);

    setTiposFactura(tiposArray);
  };

  const calcularEstadisticas = (reservasData: any[]) => {
    const totalIngresos = reservasData.reduce(
      (sum, r) => sum + (r.pago?.monto || 0),
      0,
    );
    const totalFacturas = reservasData.length;
    const montoPromedio = totalFacturas > 0 ? totalIngresos / totalFacturas : 0;

    setEstadisticas({
      totalIngresos,
      totalFacturas,
      montoPromedio,
    });
  };

  const establecerPeriodoRapido = (dias: number) => {
    const hoy = new Date();
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - dias);

    setFechaFin(hoy.toISOString().split("T")[0]);
    setFechaInicio(inicio.toISOString().split("T")[0]);
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(monto);
  };

  const COLORS = ["#007bff", "#28a745", "#ffc107", "#dc3545", "#17a2b8"];

  return (
    <div className="ingresos-facturacion-container">
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
              <div className="stat-card ingresos-totales">
                <div className="stat-content">
                  <h4>Ingresos Totales</h4>
                  <p className="stat-value">
                    {formatearMoneda(estadisticas.totalIngresos)}
                  </p>
                </div>
              </div>
              <div className="stat-card total-facturas">
                <div className="stat-content">
                  <h4>Total Facturas</h4>
                  <p className="stat-value">{estadisticas.totalFacturas}</p>
                </div>
              </div>
              <div className="stat-card monto-promedio">
                <div className="stat-content">
                  <h4>Monto Promedio</h4>
                  <p className="stat-value">
                    {formatearMoneda(estadisticas.montoPromedio)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Gráficos */}
          <div className="graficos-section">
            {/* Gráfico de evolución de ingresos */}
            <div className="grafico-container">
              <h3>Evolución de Ingresos</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={ingresosPorDia}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="fecha"
                    tickFormatter={(fecha) =>
                      new Date(fecha).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                      })
                    }
                  />
                  <YAxis
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: any) => formatearMoneda(value)}
                    labelFormatter={(fecha) =>
                      new Date(fecha).toLocaleDateString("es-AR")
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#007bff"
                    strokeWidth={2}
                    name="Ingresos"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de métodos de pago */}
            <div className="grafico-container">
              <h3>Distribución por Método de Pago</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={metodosPago}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="monto"
                    nameKey="metodo"
                  >
                    {metodosPago.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatearMoneda(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de tipos de factura */}
          {tiposFactura.length > 0 && (
            <div className="grafico-full-width">
              <div className="grafico-container">
                <h3>Distribución por Tipo de Factura</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={tiposFactura}
                    margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis yAxisId="left" orientation="left" stroke="#007bff" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#28a745"
                      tickFormatter={(value) =>
                        `$${(value / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      formatter={(value: any, name: string | undefined) =>
                        name === "Monto Total" ? formatearMoneda(value) : value
                      }
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="cantidad"
                      fill="#007bff"
                      name="Cantidad de Facturas"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="monto"
                      fill="#28a745"
                      name="Monto Total"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IngresosFacturacion;
