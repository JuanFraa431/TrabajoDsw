import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Tarjeta from "../Tarjeta";
import "../../styles/ReservarPaquete.css";
import logo from "../../images/logoFinal2.png";
import { Acompanante } from "../../interface/acompanante";
import axios from "axios";
import {
  calcularPrecioTotalPaquete,
  obtenerRangoFechasPaquete,
} from "../../utils/paqueteUtils";

const STEP_LABELS = [
  "Pago",
  "Facturación",
  "Acompañantes",
  "Tarjeta",
  "Resumen",
];

const ReservarPaquete: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const location = useLocation();
  const navigate = useNavigate();
  const paquete = location.state?.paquete;
  const [ciudad, setCiudad] = useState<string>("");
  const isNavigatingRef = useRef<boolean>(false);

  useEffect(() => {
    const fetchCiudad = async () => {
      try {
        if (paquete?.estadias[0]?.hotel) {
          const hotelValue = paquete.estadias[0].hotel;
          const hotelId =
            typeof hotelValue === "object" ? hotelValue.id : hotelValue;
          if (!hotelId) return;
          const responseReserva = await axios.get(`/api/hotel/${hotelId}`);
          if (responseReserva.status === 200) {
            const hotelData = responseReserva.data.data;
            const ciudadValue = hotelData.ciudad;
            const ciudadId =
              typeof ciudadValue === "object" ? ciudadValue.id : ciudadValue;
            if (!ciudadId) return;
            const responseReserva2 = await axios.get(`/api/ciudad/${ciudadId}`);
            setCiudad(responseReserva2.data.data.nombre);
          }
        }
      } catch (error) {
        console.error("Error al buscar la ciudad del hotel:", error);
      }
    };
    if (paquete) fetchCiudad();
  }, [paquete]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = Boolean(user?.id);
  const [form, setForm] = useState<{
    tipoFactura: string;
    documento: string;
    nombre: string;
    apellido: string;
    email: string;
    direccion: string;
    telefono: string;
    acompanantesData: Acompanante[];
    acompanantes: number;
    currentAcompanante: number;
    tarjetaNombre: string;
    tarjetaUltimos4: string;
  }>({
    tipoFactura: "",
    documento: user.dni || "",
    nombre: user.nombre || "",
    apellido: user.apellido || "",
    email: user.email || "",
    direccion: "",
    telefono: "",
    acompanantesData: [],
    acompanantes: 0,
    currentAcompanante: 0,
    tarjetaNombre: "",
    tarjetaUltimos4: "",
  });

  const [pagoSeleccionado, setPagoSeleccionado] = useState<string | null>(null);
  const [numeroTarjeta, setNumeroTarjeta] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [precioBase, setPrecioBase] = useState<number>(0);

  if (!paquete) {
    return (
      <div className="reservar-container">
        <div className="reservar-header">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>
        <div className="no-package-error">
          <div className="icon">📦</div>
          <h2>No se encontró el paquete</h2>
          <p>Parece que no has seleccionado ningún paquete para reservar.</p>
          <Link to="/" className="btn btn-primary btn-home">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="reservar-container">
        <div className="reservar-header">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>
        <div className="no-package-error">
          <div className="icon">🔒</div>
          <h2>Iniciá sesión para reservar</h2>
          <p>Necesitás estar logueado para continuar con la reserva.</p>
          <Link to="/login" className="btn btn-primary btn-home">
            → Ir a login
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchPrecioBase = async () => {
      try {
        const response = await axios.put(
          `/api/paquete/${paquete.id}/recalcular-precio`,
        );
        const nuevoPrecio = response?.data?.data?.nuevoPrecio;
        if (typeof nuevoPrecio === "number") {
          setPrecioBase(nuevoPrecio);
        }
      } catch (error) {
        console.error("Error al recalcular precio del paquete:", error);
      }
    };

    if (paquete?.id) {
      fetchPrecioBase();
    }
  }, [paquete]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAcompananteChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const newAcompanantes = [...form.acompanantesData];
    newAcompanantes[index] = { ...newAcompanantes[index], [field]: value };
    setForm({ ...form, acompanantesData: newAcompanantes });
  };

  const isCompanionComplete = (index: number): boolean => {
    const companion = form.acompanantesData[index];
    return !!(
      companion?.nombre &&
      companion?.apellido &&
      companion?.email &&
      companion?.dni &&
      companion?.fechaNacimiento
    );
  };

  const validateStep = (): boolean => {
    setError(null);

    if (step === 1 && !pagoSeleccionado) {
      setError("Debes seleccionar un método de pago.");
      return false;
    }
    if (step === 2) {
      if (!form.tipoFactura) {
        setError("Selecciona el tipo de factura.");
        return false;
      }
      if (!form.nombre || !form.apellido) {
        setError("Ingresa tu nombre y apellido.");
        return false;
      }
      if (!form.documento) {
        setError("Ingresa tu documento.");
        return false;
      }
      if (!form.telefono) {
        setError("Ingresa tu teléfono.");
        return false;
      }
    }
    if (step === 3 && form.acompanantes > 0) {
      for (let i = 0; i < form.acompanantes; i++) {
        if (!isCompanionComplete(i)) {
          setError(`Completa todos los datos del acompañante ${i + 1}.`);
          return false;
        }
      }
    }
    if (step === 4) {
      if (
        !form.tarjetaNombre ||
        !numeroTarjeta ||
        numeroTarjeta.replace(/\s/g, "").length < 16
      ) {
        setError("Completa los datos de la tarjeta correctamente.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    // Prevenir múltiples clicks de forma síncrona
    if (isNavigatingRef.current || isNavigating) return;
    
    // Bloquear inmediatamente con la ref (síncrono)
    isNavigatingRef.current = true;
    setIsNavigating(true);
    
    // Validar
    if (!validateStep()) {
      // Si falla la validación, desbloquear
      isNavigatingRef.current = false;
      setIsNavigating(false);
      return;
    }
    
    // Cambiar de paso
    if (step < 5) {
      setStep((prev) => prev + 1);
      // Desbloquear después de que React complete el cambio de paso
      setTimeout(() => {
        isNavigatingRef.current = false;
        setIsNavigating(false);
      }, 300);
    } else {
      // Si ya estamos en el último paso, desbloquear inmediatamente
      isNavigatingRef.current = false;
      setIsNavigating(false);
    }
  };

  const prevStep = () => {
    // Prevenir múltiples clicks de forma síncrona
    if (isNavigatingRef.current || isNavigating) return;
    
    // Bloquear inmediatamente
    isNavigatingRef.current = true;
    setIsNavigating(true);
    
    setError(null);
    
    if (step > 1) {
      setStep((prev) => prev - 1);
      // Desbloquear después de que React complete el cambio de paso
      setTimeout(() => {
        isNavigatingRef.current = false;
        setIsNavigating(false);
      }, 300);
    } else {
      // Si ya estamos en el primer paso, desbloquear inmediatamente
      isNavigatingRef.current = false;
      setIsNavigating(false);
    }
  };

  const handleReservar = async () => {
    if (!isLoggedIn) {
      setError("Debes iniciar sesión para reservar.");
      navigate("/login");
      return;
    }
    if (isProcessing) return;
    setIsProcessing(true);
    setError(null);

    try {
      const cantidadPersonas = (form.acompanantes || 0) + 1;
      const basePrecio =
        precioBase > 0 ? precioBase : calcularPrecioTotalPaquete(paquete);
      const totalPagar = basePrecio * cantidadPersonas;
      const responsePago = await axios.post("/api/pago", {
        fecha: new Date(),
        monto: totalPagar,
        estado: "PENDIENTE",
        metodoDePago: pagoSeleccionado,
        tipoFactura: form.tipoFactura,
        nombreFacturacion: form.nombre,
        apellidoFacturacion: form.apellido,
        dniFacturacion: form.documento,
        telefonoFacturacion: form.telefono,
        emailFacturacion: form.email,
        nombreTitular: form.tarjetaNombre || "",
        ultimos4: form.tarjetaUltimos4 || "",
        proveedor: "Stripe",
      });

      const responseReserva = await axios.post("/api/reservaPaquete", {
        pagoId: responsePago.data.data.id,
        fecha: new Date(),
        paqueteId: paquete.id,
        usuarioId: user.id,
        estado: "PENDIENTE",
        personas: form.acompanantesData,
      });

      if (responseReserva.status === 201) {
        setReservaConfirmada(true);
      } else {
        setError("Hubo un problema al confirmar la reserva.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error al enviar la reserva:", error);
      setError("Hubo un problema al confirmar la reserva. Intenta nuevamente.");
      setIsProcessing(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 },
  };

  const formatDate = (date: Date) => new Date(date).toLocaleDateString("es-AR");

  const rangoFechas = obtenerRangoFechasPaquete(paquete);
  const cantidadPersonas = (form.acompanantes || 0) + 1;
  const basePrecio =
    precioBase > 0 ? precioBase : calcularPrecioTotalPaquete(paquete);
  const precioTotal = basePrecio * cantidadPersonas;

  return (
    <div className="reservar-container">
      {/* Header */}
      <div className="reservar-header">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>

      {/* Stepper */}
      <div className="stepper-container">
        <div className="stepper">
          {STEP_LABELS.map((label, index) => (
            <React.Fragment key={index}>
              <div
                className={`step-item ${step === index + 1 ? "active" : ""} ${
                  step > index + 1 ? "completed" : ""
                }`}
              >
                <div className="step-circle">
                  <span className="step-number">{index + 1}</span>
                </div>
                <span className="step-label">{label}</span>
              </div>
              {index < STEP_LABELS.length - 1 && (
                <div
                  className={`step-line ${step > index + 1 ? "completed" : ""}`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <AnimatePresence mode="wait">
        {reservaConfirmada ? (
          <motion.div
            key="success"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
            className="success-container"
          >
            <div className="success-icon">🎉</div>
            <h2 className="success-title">¡Solicitud Recibida!</h2>
            <p className="success-message-text">
              Tu solicitud de reserva ha sido recibida exitosamente.
            </p>
            <div className="pending-notice">
              <div className="notice-icon">⏳</div>
              <p>
                <strong>Pago pendiente de aprobación</strong>
                <br />
                Tu pago está siendo verificado por nuestro equipo. Recibirás un
                correo electrónico con la confirmación o rechazo de tu reserva
                en las próximas horas.
              </p>
            </div>
            <div className="success-details">
              <div className="success-detail-item">
                <span>Paquete</span>
                <strong>{paquete.nombre}</strong>
              </div>
              <div className="success-detail-item">
                <span>Fechas</span>
                <strong>
                  {rangoFechas?.fechaIni && rangoFechas?.fechaFin
                    ? `${formatDate(rangoFechas.fechaIni)} - ${formatDate(
                        rangoFechas.fechaFin,
                      )}`
                    : "No especificadas"}
                </strong>
              </div>
              <div className="success-detail-item">
                <span>Monto a pagar</span>
                <strong>${precioTotal}</strong>
              </div>
            </div>
            <Link
              to="/"
              className="reservar-btn reservar-btn-primary reservar-btn-home"
            >
              ← Volver al inicio
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
          >
            {/* Paso 1: Método de Pago */}
            {step === 1 && (
              <div className="form-container">
                <h2 className="form-title">¿Cómo vas a pagar?</h2>
                <p className="form-subtitle">
                  Selecciona tu método de pago preferido
                </p>

                <div className="payment-options">
                  <div
                    className={`payment-card ${
                      pagoSeleccionado === "Tarjeta de debito" ? "selected" : ""
                    }`}
                    onClick={() => setPagoSeleccionado("Tarjeta de debito")}
                  >
                    <span className="payment-icon">💳</span>
                    <span className="payment-card-title">
                      Tarjeta de Débito
                    </span>
                    <span className="payment-card-desc">
                      Pago directo desde tu cuenta bancaria
                    </span>
                  </div>
                  <div
                    className={`payment-card ${
                      pagoSeleccionado === "Tarjeta de crédito"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => setPagoSeleccionado("Tarjeta de crédito")}
                  >
                    <span className="payment-icon">💎</span>
                    <span className="payment-card-title">
                      Tarjeta de Crédito
                    </span>
                    <span className="payment-card-desc">
                      Paga en cuotas sin interés
                    </span>
                  </div>
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="form-actions">
                  <Link to="/" className="reservar-btn reservar-btn-secondary">
                    ← Cancelar
                  </Link>
                  <button
                    className="reservar-btn reservar-btn-primary"
                    onClick={nextStep}
                    disabled={isNavigating}
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {/* Paso 2: Facturación */}
            {step === 2 && (
              <div className="form-container">
                <h2 className="form-title">Datos de Facturación</h2>
                <p className="form-subtitle">
                  Ingresa tus datos para la factura
                </p>

                <div className="billing-section">
                  <div className="reservar-section-title">
                    <span className="icon">📄</span> Tipo de Factura
                  </div>
                  <div className="form-row single">
                    <div className="form-group">
                      <label>Selecciona el tipo de factura</label>
                      <select
                        name="tipoFactura"
                        value={form.tipoFactura}
                        onChange={handleChange}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="A">Factura A</option>
                        <option value="B">Factura B</option>
                        <option value="C">Factura C</option>
                      </select>
                    </div>
                  </div>

                  <div className="reservar-section-title">
                    <span className="icon">👤</span> Datos Personales
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellido</label>
                      <input
                        type="text"
                        name="apellido"
                        value={form.apellido}
                        onChange={handleChange}
                        placeholder="Tu apellido"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Documento (DNI/CUIT)</label>
                      <input
                        type="text"
                        name="documento"
                        value={form.documento}
                        onChange={handleChange}
                        placeholder="12345678"
                      />
                    </div>
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        placeholder="+54 9 11 1234-5678"
                      />
                    </div>
                  </div>
                  <div className="form-row single">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="form-actions">
                  <button
                    className="reservar-btn reservar-btn-secondary"
                    onClick={prevStep}
                    disabled={isNavigating}
                  >
                    ← Atrás
                  </button>
                  <button
                    className="reservar-btn reservar-btn-primary"
                    onClick={nextStep}
                    disabled={isNavigating}
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {/* Paso 3: Acompañantes */}
            {step === 3 && (
              <div className="form-container">
                <h2 className="form-title">Acompañantes</h2>
                <p className="form-subtitle">
                  ¿Viajas con más personas? Agrégalas aquí
                </p>

                <div className="companions-section">
                  <div className="companions-counter">
                    <label>¿Cuántas personas te acompañarán?</label>
                    <select
                      value={form.acompanantes}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setForm({
                          ...form,
                          acompanantes: value,
                          acompanantesData:
                            value === 0 ? [] : form.acompanantesData,
                          currentAcompanante: 0,
                        });
                      }}
                    >
                      <option value={0}>Sin acompañantes</option>
                      <option value={1}>1 acompañante</option>
                      <option value={2}>2 acompañantes</option>
                      <option value={3}>3 acompañantes</option>
                      <option value={4}>4 acompañantes</option>
                      <option value={5}>5 acompañantes</option>
                    </select>
                  </div>

                  {form.acompanantes > 0 && (
                    <>
                      <div className="companion-tabs">
                        {Array.from({ length: form.acompanantes }, (_, i) => (
                          <button
                            key={i}
                            className={`companion-tab ${
                              form.currentAcompanante === i ? "active" : ""
                            } ${isCompanionComplete(i) ? "filled" : ""}`}
                            onClick={() =>
                              setForm({ ...form, currentAcompanante: i })
                            }
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <div className="companion-form">
                        <div className="companion-form-title">
                          <span className="icon">👤</span>
                          Acompañante {form.currentAcompanante + 1}
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Nombre</label>
                            <input
                              type="text"
                              value={
                                form.acompanantesData[form.currentAcompanante]
                                  ?.nombre || ""
                              }
                              onChange={(e) =>
                                handleAcompananteChange(
                                  form.currentAcompanante,
                                  "nombre",
                                  e.target.value,
                                )
                              }
                              placeholder="Nombre"
                            />
                          </div>
                          <div className="form-group">
                            <label>Apellido</label>
                            <input
                              type="text"
                              value={
                                form.acompanantesData[form.currentAcompanante]
                                  ?.apellido || ""
                              }
                              onChange={(e) =>
                                handleAcompananteChange(
                                  form.currentAcompanante,
                                  "apellido",
                                  e.target.value,
                                )
                              }
                              placeholder="Apellido"
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>DNI</label>
                            <input
                              type="text"
                              value={
                                form.acompanantesData[form.currentAcompanante]
                                  ?.dni || ""
                              }
                              onChange={(e) =>
                                handleAcompananteChange(
                                  form.currentAcompanante,
                                  "dni",
                                  e.target.value,
                                )
                              }
                              placeholder="12345678"
                            />
                          </div>
                          <div className="form-group">
                            <label>Fecha de Nacimiento</label>
                            <input
                              type="date"
                              value={
                                form.acompanantesData[form.currentAcompanante]
                                  ?.fechaNacimiento || ""
                              }
                              onChange={(e) =>
                                handleAcompananteChange(
                                  form.currentAcompanante,
                                  "fechaNacimiento",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="form-row single">
                          <div className="form-group">
                            <label>Email</label>
                            <input
                              type="email"
                              value={
                                form.acompanantesData[form.currentAcompanante]
                                  ?.email || ""
                              }
                              onChange={(e) =>
                                handleAcompananteChange(
                                  form.currentAcompanante,
                                  "email",
                                  e.target.value,
                                )
                              }
                              placeholder="email@ejemplo.com"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {form.acompanantes === 0 && (
                    <div className="no-companions-message">
                      <div className="icon">🧳</div>
                      <p>Viajarás solo. ¡Disfruta tu aventura!</p>
                    </div>
                  )}
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="form-actions">
                  <button
                    className="reservar-btn reservar-btn-secondary"
                    onClick={prevStep}
                    disabled={isNavigating}
                  >
                    ← Atrás
                  </button>
                  <button
                    className="reservar-btn reservar-btn-primary"
                    onClick={nextStep}
                    disabled={isNavigating}
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {/* Paso 4: Tarjeta */}
            {step === 4 && (
              <div className="form-container">
                <h2 className="form-title">Datos de la Tarjeta</h2>
                <p className="form-subtitle">
                  Ingresa los datos de tu tarjeta de forma segura
                </p>

                <div className="card-section">
                  <Tarjeta
                    nombre={form.tarjetaNombre}
                    setNombre={(value: string) =>
                      setForm((prev) => ({ ...prev, tarjetaNombre: value }))
                    }
                    numeroTarjeta={numeroTarjeta}
                    setNumeroTarjeta={(value: string) => {
                      setNumeroTarjeta(value);
                      const clean = value.replace(/\D/g, "");
                      setForm((prev) => ({
                        ...prev,
                        tarjetaUltimos4: clean.slice(-4),
                      }));
                    }}
                  />
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="form-actions">
                  <button
                    className="reservar-btn reservar-btn-secondary"
                    onClick={prevStep}
                    disabled={isNavigating}
                  >
                    ← Atrás
                  </button>
                  <button
                    className="reservar-btn reservar-btn-primary"
                    onClick={nextStep}
                    disabled={isNavigating}
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {/* Paso 5: Resumen */}
            {step === 5 && (
              <div className="form-container">
                <h2 className="form-title">Resumen de tu Reserva</h2>
                <p className="form-subtitle">
                  Revisa los detalles antes de confirmar
                </p>

                <div className="summary-container">
                  <div className="summary-column">
                    <div className="summary-card">
                      <div className="summary-card-title">
                        <span className="icon">👤</span> Datos del Comprador
                      </div>
                      <div className="summary-item">
                        <span className="summary-item-label">Nombre</span>
                        <span className="summary-item-value">
                          {form.nombre} {form.apellido}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-item-label">Documento</span>
                        <span className="summary-item-value">
                          {form.documento}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-item-label">Email</span>
                        <span className="summary-item-value">{form.email}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-item-label">Teléfono</span>
                        <span className="summary-item-value">
                          {form.telefono}
                        </span>
                      </div>
                    </div>

                    {form.acompanantesData.length > 0 && (
                      <div className="summary-card">
                        <div className="summary-card-title">
                          <span className="icon">👥</span> Acompañantes (
                          {form.acompanantesData.length})
                        </div>
                        {form.acompanantesData.map((acomp, idx) => (
                          <div key={idx} className="companion-summary">
                            <div className="companion-summary-name">
                              {acomp.nombre} {acomp.apellido}
                            </div>
                            <div className="companion-summary-detail">
                              DNI: {acomp.dni}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="summary-column">
                    <div className="summary-card highlight">
                      <div className="summary-card-title">
                        <span className="icon">✈️</span> Detalles del Paquete
                      </div>
                      <div className="summary-item">
                        <span className="summary-item-label">Paquete</span>
                        <span className="summary-item-value">
                          {paquete.nombre}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-item-label">Fechas</span>
                        <span className="summary-item-value">
                          {rangoFechas?.fechaIni && rangoFechas?.fechaFin
                            ? `${formatDate(rangoFechas.fechaIni)} - ${formatDate(
                                rangoFechas.fechaFin,
                              )}`
                            : "No especificadas"}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-item-label">Destino</span>
                        <span className="summary-item-value">
                          {ciudad || "N/A"}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-item-label">
                          Método de Pago
                        </span>
                        <span className="summary-item-value">
                          {pagoSeleccionado}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-item-label">Tarjeta</span>
                        <span className="summary-item-value">
                          **** **** **** {form.tarjetaUltimos4}
                        </span>
                      </div>
                      <div className="summary-total">
                        <span className="summary-total-label">
                          Total a pagar
                        </span>
                        <span className="summary-total-value">
                          ${precioTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="form-actions">
                  <button
                    className="reservar-btn reservar-btn-secondary"
                    onClick={prevStep}
                    disabled={isProcessing || isNavigating}
                  >
                    ← Atrás
                  </button>
                  <button
                    className={`reservar-btn reservar-btn-success ${
                      isProcessing ? "processing" : ""
                    }`}
                    onClick={handleReservar}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "⏳ Procesando..." : "✓ Confirmar Reserva"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservarPaquete;
