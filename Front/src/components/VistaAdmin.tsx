import React, { useState, useEffect } from "react";
import "../styles/VistaAdmin.css";
import { useNavigate } from "react-router-dom";

import PaqueteList from "./Paquete/PaqueteList";

import ClienteList from "./Cliente/ClienteList";

import HotelList from "./Hotel/HotelList";

import CiudadList from "./Ciudad/CiudadList";

import ReservaPaqueteList from "./ReservaPaquete/ReservaPaqueteList";

import ReservasPendientes from "./ReservaPaquete/ReservasPendientes";

import ExcursionList from "./Excursion/ExcursionList";

import TransporteList from "./Transporte/TransporteList";

import TipoTransporteList from "./TipoTransporte/TipoTransporteList";

import ReservasPorPeriodo from "./Estadisticas/ReservasPorPeriodo";

import DestinosPopulares from "./Estadisticas/DestinosPopulares";

import IngresosFacturacion from "./Estadisticas/IngresosFacturacion";

import { Ciudad } from "../interface/ciudad";
import { Cliente } from "../interface/cliente";
import { Hotel } from "../interface/hotel";
import { Excursion } from "../interface/excursion";
import { Paquete } from "../interface/paquete";
import { ReservaPaquete } from "../interface/reserva";
import { Transporte } from "../interface/transporte";
import { TipoTransporte } from "../interface/tipoTransporte";

import {
  fetchEntities,
  updateEntity,
  deleteEntity,
  createEntity,
} from "../services/crudService";

import "../styles/VistaAdmin.css";

const VistaAdmin: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(userStr);
    const roleValue =
      user?.tipo_usuario ?? user?.tipoUsuario ?? user?.rol ?? user?.role;
    const normalizedRole =
      typeof roleValue === "string" ? roleValue.toUpperCase() : "";
    if (normalizedRole !== "ADMIN") {
      navigate("/");
    }
  }, [navigate]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [excursiones, setExcursiones] = useState<Excursion[]>([]);
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [reservas, setReservas] = useState<ReservaPaquete[]>([]);
  const [transportes, setTransportes] = useState<Transporte[]>([]);
  const [tiposTransporte, setTiposTransporte] = useState<TipoTransporte[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDatosOpen, setIsDatosOpen] = useState<boolean>(false);
  const [isEstadisticasOpen, setIsEstadisticasOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [loadedCategories, setLoadedCategories] = useState<Set<string>>(
    new Set(),
  );

  // Cargar datos solo cuando se selecciona una categoría
  useEffect(() => {
    if (selectedCategory && !loadedCategories.has(selectedCategory)) {
      loadCategoryData(selectedCategory);
    }
  }, [selectedCategory]);

  const loadCategoryData = async (category: string) => {
    const categoryMap: {
      [key: string]: {
        endpoint: string;
        setState: React.Dispatch<React.SetStateAction<any[]>>;
      };
    } = {
      clientes: { endpoint: "/api/cliente", setState: setClientes },
      hoteles: { endpoint: "/api/hotel", setState: setHoteles },
      ciudades: { endpoint: "/api/ciudad", setState: setCiudades },
      excursiones: { endpoint: "/api/excursion", setState: setExcursiones },
      paquetes: { endpoint: "/api/paquete", setState: setPaquetes },
      reservas: { endpoint: "/api/reservaPaquete", setState: setReservas },
      transportes: { endpoint: "/api/transporte", setState: setTransportes },
      tiposTransporte: { endpoint: "/api/tipoTransporte", setState: setTiposTransporte },
    };

    const categoryData = categoryMap[category];
    if (categoryData) {
      await loadEntities(categoryData.endpoint, categoryData.setState);
      setLoadedCategories((prev) => new Set(prev).add(category));
    }
  };

  const loadEntities = async (
    endpoint: string,
    setState: React.Dispatch<React.SetStateAction<any[]>>,
  ) => {
    try {
      const data = await fetchEntities(endpoint);
      setState(data);
      setErrorMessage(null); // Clear error message on successful load
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      setErrorMessage("Error al cargar los datos.");
    }
  };

  const handleCrear = async (
    entity: any,
    endpoint: string,
    setState: React.Dispatch<React.SetStateAction<any[]>>,
  ) => {
    try {
      await createEntity(endpoint, entity);
      await loadEntities(endpoint, setState);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Error al crear la entidad.");
    }
  };

  const handleEliminar = async (
    id: number,
    endpoint: string,
    entityName: string,
    setState: React.Dispatch<React.SetStateAction<any[]>>,
  ) => {
    const confirmacion = window.confirm(
      `¿Seguro que deseas eliminar el ${entityName} con id ${id}?`,
    );
    if (!confirmacion) {
      return;
    }

    try {
      await deleteEntity(endpoint, id);
      await loadEntities(endpoint, setState);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Error al eliminar la entidad.");
    }
  };

  const renderList = () => {
    switch (selectedCategory) {
      case "clientes":
        return (
          <ClienteList
            clientes={clientes}
            onEdit={() => loadEntities("/api/cliente", setClientes)}
            onDelete={(cliente) =>
              handleEliminar(cliente.id, "/api/cliente", "cliente", setClientes)
            }
          />
        );
      case "hoteles":
        return (
          <HotelList
            hoteles={hoteles}
            onEdit={() => loadEntities("/api/hotel", setHoteles)}
            onDelete={(hotel) =>
              handleEliminar(hotel.id, "/api/hotel", "hotel", setHoteles)
            }
          />
        );
      case "ciudades":
        return (
          <CiudadList
            ciudades={ciudades}
            onEdit={() => loadEntities("/api/ciudad", setCiudades)}
            onDelete={(ciudad) =>
              handleEliminar(ciudad.id, "/api/ciudad", "ciudad", setCiudades)
            }
          />
        );
      case "excursiones":
        return (
          <ExcursionList
            excursiones={excursiones}
            onEdit={() => loadEntities("/api/excursion", setExcursiones)}
            onDelete={(excursion: Excursion) =>
              handleEliminar(
                excursion.id,
                "/api/excursion",
                "excursión",
                setExcursiones,
              )
            }
            onCreate={() => loadEntities("/api/excursion", setExcursiones)}
          />
        );
      case "paquetes":
        return (
          <PaqueteList
            paquetes={paquetes}
            onEdit={() => loadEntities("/api/paquete", setPaquetes)}
            onDelete={(paquete) =>
              handleEliminar(paquete.id, "/api/paquete", "paquete", setPaquetes)
            }
            onAddEstadia={(newEstadia) => {
              console.log("Agregar estadía:", newEstadia);
            }}
            onCreate={async () => {
              await loadEntities("/api/paquete", setPaquetes);
            }}
          />
        );
      case "reservas":
        return (
          <ReservaPaqueteList
            reservas={reservas}
            onDelete={(reserva) =>
              handleEliminar(
                reserva.id,
                "/api/reservaPaquete",
                "reserva",
                setReservas,
              )
            }
          />
        );
      case "transportes":
        return (
          <TransporteList
            transportes={transportes}
            onEdit={(transporte) =>
              console.log("Transporte editado:", transporte)
            }
            onDelete={(transporte) =>
              handleEliminar(
                transporte.id,
                "/api/transporte",
                "transporte",
                setTransportes,
              )
            }
          />
        );
      case "tiposTransporte":
        return (
          <TipoTransporteList
            tiposTransporte={tiposTransporte}
            onEdit={() => loadEntities("/api/tipoTransporte", setTiposTransporte)}
            onDelete={(tipoTransporte) =>
              handleEliminar(
                tipoTransporte.id,
                "/api/tipoTransporte",
                "tipo de transporte",
                setTiposTransporte,
              )
            }
          />
        );
      case "reservasPorPeriodo":
        return <ReservasPorPeriodo />;
      case "destinosPopulares":
        return <DestinosPopulares />;
      case "ingresosFacturacion":
        return <IngresosFacturacion />;
      case "reservasPendientes":
        return <ReservasPendientes />;
      case "ingresos":
        return (
          <div className="mensaje-noEncontro">
            <p>🚧 En construcción 🚧</p>
          </div>
        );
      default:
        return (
          <div className="mensaje-noEncontro">
            <p>Selecciona una categoría para ver los registros.</p>
          </div>
        );
    }
  };

  const getCategoryTitle = () => {
    const titles: { [key: string]: string } = {
      clientes: "Clientes",
      hoteles: "Hoteles",
      ciudades: "Ciudades",
      excursiones: "Excursiones",
      paquetes: "Paquetes",
      reservas: "Reservas",
      transportes: "Transportes",
      tiposTransporte: "Tipos de Transporte",
      reservasPendientes: "Reservas y Pagos Pendientes",
      reservasPorPeriodo: "Reservas por Período",
      destinosPopulares: "Destinos Más Populares",
      ingresosFacturacion: "Ingresos y Facturación",
    };
    return selectedCategory ? titles[selectedCategory] : "Vista Admin";
  };

  return (
    <div
      className={`vista-admin ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button
            className="sidebar-collapse-button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={
              isSidebarCollapsed
                ? "Expandir barra lateral"
                : "Minimizar barra lateral"
            }
          >
            {isSidebarCollapsed ? "▶" : "◀"}
          </button>
        </div>

        <div className="sidebar-section">
          <div className="main-buttons-group">
            <button
              className={
                selectedCategory === "reservasPendientes"
                  ? "sidebar-toggle-button active"
                  : "sidebar-toggle-button"
              }
              onClick={() => setSelectedCategory("reservasPendientes")}
            >
              Reservas Pendientes
            </button>

            <button
              className="sidebar-toggle-button"
              onClick={() => setIsDatosOpen(!isDatosOpen)}
            >
              <span className="toggle-icon">{isDatosOpen ? "▼" : "▶"}</span>
              Datos
            </button>
            {isDatosOpen && (
              <div className="sidebar-items">
                <button
                  className={
                    selectedCategory === "clientes"
                      ? "sidebar-item active"
                      : "sidebar-item"
                  }
                  onClick={() => setSelectedCategory("clientes")}
                >
                  Clientes
                </button>
                <button
                  className={
                    selectedCategory === "hoteles"
                      ? "sidebar-item active"
                      : "sidebar-item"
                  }
                  onClick={() => setSelectedCategory("hoteles")}
                >
                  Hoteles
                </button>
                <button
                  className={
                    selectedCategory === "ciudades"
                      ? "sidebar-item active"
                      : "sidebar-item"
                  }
                  onClick={() => setSelectedCategory("ciudades")}
                >
                  Ciudades
                </button>
                <button
                  className={
                    selectedCategory === "excursiones"
                      ? "sidebar-item active"
                      : "sidebar-item"
                  }
                  onClick={() => setSelectedCategory("excursiones")}
                >
                  Excursiones
                </button>
                <button
                  className={
                    selectedCategory === "paquetes"
                      ? "sidebar-item active"
                      : "sidebar-item"
                  }
                  onClick={() => setSelectedCategory("paquetes")}
                >
                  Paquetes
                </button>
                <button
                  className={
                    selectedCategory === "reservas"
                      ? "sidebar-item active"
                      : "sidebar-item"
                  }
                  onClick={() => setSelectedCategory("reservas")}
                >
                  Reservas
                </button>
                <button
                  className={
                    selectedCategory === "transportes"
                      ? "sidebar-item active"
                      : "sidebar-item"
                  }
                  onClick={() => setSelectedCategory("transportes")}
                >
                  Transportes
                </button>
                <button
                  className={
                    selectedCategory === "tiposTransporte"
                      ? "sidebar-item active"
                      : "sidebar-item"
                  }
                  onClick={() => setSelectedCategory("tiposTransporte")}
                >
                  Tipos de Transporte
                </button>
              </div>
            )}

            <button
              className="sidebar-toggle-button"
              onClick={() => setIsEstadisticasOpen(!isEstadisticasOpen)}
            >
              <span className="toggle-icon">
                {isEstadisticasOpen ? "▼" : "▶"}
              </span>
              Estadísticas
            </button>
            {isEstadisticasOpen && (
              <div className="sidebar-items">
                <button
                  className={
                    selectedCategory === "reservasPorPeriodo"
                      ? "sidebar-item active"
                      : "sidebar-item"
                  }
                  onClick={() => setSelectedCategory("reservasPorPeriodo")}
                >
                  Reservas por Período
                </button>
                <button
                  className={
                    selectedCategory === "destinosPopulares"
                      ? "sidebar-item active"
                      : "sidebar-item"
                  }
                  onClick={() => setSelectedCategory("destinosPopulares")}
                >
                  Destinos Más Populares
                </button>
                <button
                  className={
                    selectedCategory === "ingresos"
                      ? "sidebar-item active"
                      : "sidebar-item"
                  }
                  onClick={() => setSelectedCategory("ingresosFacturacion")}
                >
                  Ingresos y Facturación
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="admin-main-content">
        <h1>{getCategoryTitle()}</h1>

        {errorMessage && (
          <div className="error-message-container">
            <p className="error-message">{errorMessage}</p>
          </div>
        )}

        <div className="content-container">{renderList()}</div>
      </div>
    </div>
  );
};

export default VistaAdmin;
