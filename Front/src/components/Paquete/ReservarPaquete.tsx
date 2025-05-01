import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import Tarjeta from "../Tarjeta";
import "../../styles/ReservarPaquete.css";
import logo from "../../images/logoFinal2.png";
import { Acompanante } from "../../interface/acompanante";
import axios from "axios";
import { useEffect } from "react";

const ReservarPaquete: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const location = useLocation();
    const paquete = location.state?.paquete;
    const [ciudad, setCiudad] = useState<string>("");

    useEffect(() => {
        console.log("Paquete recibido:", paquete); // Debugging paquete
        const fetchCiudad = async () => {
            try {
                if (paquete?.estadias[0]?.hotel) {
                    const responseReserva = await axios.get(`/api/hotel/${paquete.estadias[0].hotel}`);
                    if (responseReserva.status === 200) {
                        const hotelData = responseReserva.data.data;
                        const Idciudad = hotelData.ciudad;
                        const responseReserva2 = await axios.get(`/api/ciudad/${Idciudad}`);
                        console.log("Ciudad del hotel:", responseReserva2.data.data.nombre);
                        setCiudad(responseReserva2.data.data.nombre);
                    } else {
                        console.error("Error al obtener la ciudad del hotel:", responseReserva.data);
                    }
                } else {
                    console.warn("El paquete o el ID del hotel no está definido.");
                }
            } catch (error) {
                console.error("Error al buscar la ciudad del hotel:", error);
            }
        };

        fetchCiudad();
    }, [paquete]);

    console.log(paquete.estadias[0].hotel)

    const user = JSON.parse(localStorage.getItem("user") || "{}");
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

    if (!paquete) {
        return <p>Error: No se encontró el paquete</p>;
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAcompananteChange = (
        index: number,
        field: string,
        value: string
    ) => {
        const newAcompanantes = [...form.acompanantesData];
        newAcompanantes[index] = { ...newAcompanantes[index], [field]: value };
        setForm({ ...form, acompanantesData: newAcompanantes });
    };

    const nextStep = () => {
        setError(null);

        if (step === 1 && !pagoSeleccionado) {
            setError("Debes seleccionar un método de pago.");
            return;
        }
        if (
            step === 2 &&
            (!form.tipoFactura || !form.documento || !form.nombre || !form.apellido || !form.telefono)
        ) {
            setError("Completa todos los campos de facturación.");
            return;
        }
        if (
            step === 3 &&
            form.acompanantes > 0 &&
            (!form.acompanantesData[form.currentAcompanante]?.nombre ||
                !form.acompanantesData[form.currentAcompanante]?.email ||
                !form.acompanantesData[form.currentAcompanante]?.apellido ||
                !form.acompanantesData[form.currentAcompanante]?.fechaNacimiento ||
                !form.acompanantesData[form.currentAcompanante]?.dni)
        ) {
            setError("Completa todos los campos de datos personales del acompañante.");
            return;
        }

        if (step === 5) {
            setTimeout(() => {
                setReservaConfirmada(true);
            }, 1000);
            return;
        }
        setStep((prev) => prev + 1);
    };

    const oppositeStep = () => {
        setError(null);
        if (step > 1) {
            setStep((prev) => prev - 1);
        }
    };

    const stepperVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 50 },
    };

    const handleReservar = async () => {
        try {

            const responsePago = await axios.post("/api/pago", {
                fecha: new Date(),
                monto: paquete.precio,
                estado: "pagado",
                metodoDePago: pagoSeleccionado,
                tipoFactura: form.tipoFactura,
                nombreFacturacion: form.nombre,
                apellidoFacturacion: form.apellido,
                dniFacturacion: form.documento,
                telefonoFacturacion: form.telefono,
                emailFacturacion: form.email,
                nombreTitular: form.tarjetaNombre || "",
                ultimos4: form.tarjetaUltimos4 || "",
                proveedor: "Stripe" // Cambiar esto por el proveedor real
            });

            const responseReserva = await axios.post("/api/reservaPaquete", {
                pagoId: responsePago.data.data.id,
                fecha: new Date(),
                paqueteId: paquete.id,
                usuarioId: user.id,
                estado: "reservado",
                personas: form.acompanantesData,
            });


            if (responseReserva.status === 201) {
                console.log("Reserva creada con éxito:", responseReserva.data);
                setReservaConfirmada(true);
            } else {
                console.error("Error al crear la reserva:", responseReserva.data);
                setError("Hubo un problema al confirmar la reserva.");
            }
        } catch (error) {
            console.error("Error al enviar la reserva:", error);
            setError("Hubo un problema al confirmar la reserva.");
        }
    };

    return (
        <div className="container">
            <div className="container-image">
                <Link to="/">
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
            </div>

            <div className="steps">
                {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className={`step ${step >= num ? "active" : ""}`}>
                        {num}
                    </div>
                ))}
            </div>

            {reservaConfirmada ? (
                <motion.div
                    className="success-message"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={stepperVariants}
                >
                    <h2>🎉 Reserva Confirmada 🎉</h2>
                    <p>Tu paquete ha sido reservado con éxito.</p>
                </motion.div>
            ) : (
                // Contenido por pasos
                <motion.div
                    key={step}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={stepperVariants}
                    transition={{ duration: 0.5 }}
                >
                    {step === 1 && (
                        <div className="payment-container form-container active">
                            <h2>¿Cómo vas a pagar?</h2>
                            <div className="payment-options">
                                <button
                                    className={`payment-button ${pagoSeleccionado === "Tarjeta de debito" ? "selected" : ""
                                        }`}
                                    onClick={() => {
                                        setPagoSeleccionado("Tarjeta de debito");
                                        setStep(2);
                                    }}
                                >
                                    Tarjeta de debito
                                </button>
                                <button
                                    className={`payment-button ${pagoSeleccionado === "Tarjeta de crédito" ? "selected" : ""
                                        }`}
                                    onClick={() => {
                                        setPagoSeleccionado("Tarjeta de crédito");
                                        setStep(2);
                                    }}
                                >
                                    Tarjeta de crédito
                                </button>
                            </div>
                            {error && <p className="error-message">{error}</p>}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="billing form-container active">
                            <h2>Facturación</h2>
                            <label>Tipo de factura</label>
                            <select
                                name="tipoFactura"
                                value={form.tipoFactura}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar</option>
                                <option value="A">Factura A</option>
                                <option value="B">Factura B</option>
                                <option value="C">Factura C</option>
                            </select>
                            <h3 style={{ marginTop: "10px" }}>Ingresa tus datos</h3>
                            <div className="container-inputs-reserva">
                                <input
                                    type="text"
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    placeholder="Nombre"
                                    className="input-reserva"
                                    required
                                />
                                <input
                                    type="text"
                                    name="apellido"
                                    value={form.apellido}
                                    onChange={handleChange}
                                    placeholder="Apellido"
                                    className="input-reserva"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="input-reserva"
                                    required
                                />
                                <input
                                    type="text"
                                    name="documento"
                                    value={form.documento}
                                    onChange={handleChange}
                                    placeholder="Documento"
                                    className="input-reserva"
                                    required
                                />
                                <input
                                    type="text"
                                    name="telefono"
                                    value={form.telefono}
                                    onChange={handleChange}
                                    placeholder="Teléfono"
                                    className="input-reserva"
                                    required
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <div className="botones-reserva">
                                <button onClick={oppositeStep}>Atrás</button>
                                <button onClick={nextStep}>Continuar</button>
                            </div>
                        </div>
                    )}

                    {/* Paso 3: Datos de acompañantes */}
                    {step === 3 && (
                        <div className="personal-data form-container active">
                            <h3>Datos Acompañantes</h3>
                            <label >¿Cuántas personas te acompañarán?</label>
                            <select
                                name="acompanantes"
                                className="title_acompañantes"
                                value={form.acompanantes}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    setForm({
                                        ...form,
                                        acompanantes: value,
                                        acompanantesData: value === 0 ? [] : form.acompanantesData,
                                    });
                                }}
                                required
                            >
                                <option value={0}>Sin acompañantes</option>
                                <option value={1}>1 acompañante</option>
                                <option value={2}>2 acompañantes</option>
                                <option value={3}>3 acompañantes</option>
                                <option value={4}>4 acompañantes</option>
                                <option value={5}>5 acompañantes</option>
                            </select>

                            {form.acompanantes > 0 && (() => {
                                const itemsPerPage = 5;
                                const currentPage = Math.floor(
                                    form.currentAcompanante / itemsPerPage
                                );
                                const totalPages = Math.ceil(
                                    form.acompanantes / itemsPerPage
                                );
                                const startIndex = currentPage * itemsPerPage;
                                const endIndex = Math.min(
                                    startIndex + itemsPerPage,
                                    form.acompanantes
                                );

                                return (
                                    <div className="acompanante-pagination">
                                        <button
                                            className="arrow-button"
                                            disabled={currentPage === 0}
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    currentAcompanante:
                                                        (currentPage - 1) * itemsPerPage,
                                                }))
                                            }
                                        >
                                            &#8592;
                                        </button>
                                        <div className="pagination-numbers">
                                            {Array.from({ length: endIndex - startIndex }, (_, i) => {
                                                const index = startIndex + i;
                                                return (
                                                    <button
                                                        key={index}
                                                        className={`number ${form.currentAcompanante === index
                                                            ? "active"
                                                            : ""
                                                            }`}
                                                        onClick={() =>
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                currentAcompanante: index,
                                                            }))
                                                        }
                                                    >
                                                        {index + 1}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            className="arrow-button"
                                            disabled={currentPage >= totalPages - 1}
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    currentAcompanante:
                                                        (currentPage + 1) * itemsPerPage,
                                                }))
                                            }
                                        >
                                            &#8594;
                                        </button>
                                    </div>
                                );
                            })()}

                            {form.acompanantes > 0 && (
                                <div className="container-inputs-acompañantes">
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        name={`acompanante_nombre_${form.currentAcompanante}`}
                                        value={
                                            form.acompanantesData[form.currentAcompanante]
                                                ?.nombre || ""
                                        }
                                        onChange={(e) =>
                                            handleAcompananteChange(
                                                form.currentAcompanante,
                                                "nombre",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Nombre"
                                        required
                                    />
                                    <label>Apellido</label>
                                    <input
                                        type="text"
                                        name={`acompanante_apellido_${form.currentAcompanante}`}
                                        value={
                                            form.acompanantesData[form.currentAcompanante]
                                                ?.apellido || ""
                                        }
                                        onChange={(e) =>
                                            handleAcompananteChange(
                                                form.currentAcompanante,
                                                "apellido",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Apellido"
                                        required
                                    />
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name={`acompanante_email_${form.currentAcompanante}`}
                                        value={
                                            form.acompanantesData[form.currentAcompanante]
                                                ?.email || ""
                                        }
                                        onChange={(e) =>
                                            handleAcompananteChange(
                                                form.currentAcompanante,
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Email"
                                        required
                                    />
                                    <label>Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        name={`acompanante_fechaNacimiento_${form.currentAcompanante}`}
                                        value={
                                            form.acompanantesData[form.currentAcompanante]
                                                ?.fechaNacimiento || ""
                                        }
                                        onChange={(e) =>
                                            handleAcompananteChange(
                                                form.currentAcompanante,
                                                "fechaNacimiento",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <label>DNI</label>
                                    <input
                                        type="text"
                                        name={`acompanante_dni_${form.currentAcompanante}`}
                                        value={
                                            form.acompanantesData[form.currentAcompanante]?.dni || ""
                                        }
                                        onChange={(e) =>
                                            handleAcompananteChange(
                                                form.currentAcompanante,
                                                "dni",
                                                e.target.value
                                            )
                                        }
                                        placeholder="DNI"
                                        required
                                    />
                                </div>
                            )}
                            {error && <p className="error-message">{error}</p>}
                            <div className="botones-reserva">
                                <button onClick={oppositeStep}>Atrás</button>
                                <button onClick={nextStep}>Continuar</button>
                            </div>
                        </div>
                    )}

                    {/* Paso 4: Detalles de tarjeta */}
                    {step === 4 && (
                        <div className="card-details form-container active">
                                <Tarjeta
                                    nombre={form.tarjetaNombre}
                                    setNombre={(value: string) => setForm((prev) => ({ ...prev, tarjetaNombre: value }))}
                                    numeroTarjeta={numeroTarjeta}
                                    setNumeroTarjeta={(value: string) => {
                                        setNumeroTarjeta(value); // si lo manejás también localmente
                                        const clean = value.replace(/\D/g, "");
                                        setForm((prev) => ({ ...prev, tarjetaUltimos4: clean.slice(-4) }));
                                    }}
                                />
                            <div className="botones-reserva">
                                <button onClick={oppositeStep}>Atrás</button>
                                <button onClick={nextStep}>Continuar</button>
                            </div>
                        </div>
                    )}

                    {/* Paso 5: Resumen con diseño mejorado */}
                    {step === 5 && (
                        <div className="summary form-container active">
                            <div className="resumen-contenedor">
                                {/* Columna Izquierda */}
                                <div className="resumen-izquierda">
                                    <div className="gracias-compra">
                                        <h3>¡Gracias por tu compra!</h3>
                                    </div>

                                    <div className="datos-comprador">
                                        <h4>Datos del Comprador</h4>
                                        <p>
                                            <strong>Nombre:</strong> {form.nombre}
                                        </p>
                                        <p>
                                            <strong>Apellido:</strong> {form.apellido}
                                        </p>
                                        <p>
                                            <strong>Documento:</strong> {form.documento}
                                        </p>
                                        <p>
                                            <strong>Email:</strong> {form.email}
                                        </p>
                                        <p>
                                            <strong>Teléfono:</strong> {form.telefono}
                                        </p>
                                    </div>

                                    <div className="datos-acompanantes">
                                        <h4>Datos de Acompañantes</h4>
                                        {form.acompanantesData.length > 0 ? (
                                            form.acompanantesData.map((acomp, idx) => (
                                                <div key={idx} className="acompanante-item">
                                                    <p>
                                                        <strong>Nombre:</strong> {acomp.nombre}
                                                    </p>
                                                    <p>
                                                        <strong>Apellido:</strong> {acomp.apellido}
                                                    </p>
                                                    <p>
                                                        <strong>Email:</strong> {acomp.email}
                                                    </p>
                                                    <p>
                                                        <strong>DNI:</strong> {acomp.dni}
                                                    </p>
                                                    <p>
                                                        <strong>Fecha de Nac.:</strong>{" "}
                                                        {acomp.fechaNacimiento}
                                                    </p>
                                                    <hr />
                                                </div>
                                            ))
                                        ) : (
                                            <p>No hay acompañantes</p>
                                        )}
                                    </div>
                                </div>

                                {/* Columna Derecha */}
                                <div className="resumen-derecha">
                                    <div className="datos-paquete">
                                        <h4>Datos del Paquete</h4>
                                        <p>
                                            <strong>Nombre:</strong> {paquete.nombre}
                                        </p>
                                        <p>
                                            <strong>Fechas:</strong>{" "}
                                            {new Date(paquete.fecha_ini).toLocaleDateString()} -{" "}
                                            {new Date(paquete.fecha_fin).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <strong>Duración:</strong> {paquete.duracion} días
                                        </p>
                                        <p>
                                            <strong>Personas:</strong>{" "}
                                            {paquete.cantidad_personas} adultos
                                        </p>
                                        <p>
                                            <strong>Ciudad:</strong> {ciudad}
                                        </p>
                                        <p>
                                            <strong>Precio:</strong> ${paquete.precio}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {error && <p className="error-message">{error}</p>}
                            <div className="botones-reserva">
                                <button onClick={oppositeStep}>Atrás</button>
                                <button onClick={handleReservar}>Confirmar Reserva</button>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default ReservarPaquete;
