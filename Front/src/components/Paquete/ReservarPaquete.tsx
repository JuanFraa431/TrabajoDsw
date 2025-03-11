import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import Tarjeta from "../Tarjeta";
import "../../styles/ReservarPaquete.css";
import logo from "../../images/logoFinal2.png";

const ReservarPaquete: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const location = useLocation();
    const paquete = location.state?.paquete;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [form, setForm] = useState<{
        tipoFactura: string;
        documento: string;
        nombre: string;
        email: string;
        direccion: string;
        telefono: string;
        acompanantesData: Acompanante[];
        acompanantes: number;
        currentAcompanante: number;
    }>({
        tipoFactura: "",
        documento: user.dni || "",
        nombre: user.nombre || "",
        email: user.email || "",
        direccion: "",
        telefono: "",
        acompanantesData: [],
        acompanantes: 0,
        currentAcompanante: 0
    });

    interface Acompanante {
        nombre: string;
        email: string;
        fechaNacimiento: string;
        dni: string;
    }

    const [pagoSeleccionado, setPagoSeleccionado] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [reservaConfirmada, setReservaConfirmada] = useState(false);

    if (!paquete) {
        return <p>Error: No se encontró el paquete</p>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAcompananteChange = (index: number, field: string, value: string) => {
        const newAcompanantes = [...form.acompanantesData];
        newAcompanantes[index] = { ...newAcompanantes[index], [field]: value };
        setForm({ ...form, acompanantesData: newAcompanantes });
    };

    const handlePagoSeleccionado = (metodo: string) => {
        setPagoSeleccionado(metodo);
    };

    const nextStep = () => {
        setError(null);
        if (step === 1 && !pagoSeleccionado) {
            setError("Debes seleccionar un método de pago.");
            return;
        }
        if (step === 2 && (!form.tipoFactura || !form.documento || !form.nombre || !form.telefono)) {
            setError("Completa todos los campos de facturación.");
            return;
        }
        if (step === 3 && (!form.acompanantesData[form.currentAcompanante]?.nombre || !form.acompanantesData[form.currentAcompanante]?.email)) {
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

    const stepperVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 50 }
    };


    const oppositeStep = () => {
        setError(null);
        if (step > 1) {
            setStep((prev) => prev - 1);
        }
    }

    return (
        <div className="container">
            <div className='container-image'>
                <Link to="/">
                <img src={logo} alt="Logo" className='logo'/>
                </Link>
            </div>
            <div className="steps">
                {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className={`step ${step >= num ? "active" : ""}`}>{num}</div>
                ))}
            </div>

            {reservaConfirmada ? (
                <motion.div className="success-message" initial="hidden" animate="visible" exit="exit">
                    <h2>🎉 Reserva Confirmada 🎉</h2>
                    <p>Tu paquete ha sido reservado con éxito.</p>
                </motion.div>
            ) : (
                <motion.div
                    key={step}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={stepperVariants}
                    transition={{ duration: 0.5 }}
                >
                    {step === 1 && (
                        <div className="payment-container">
                            <h2>¿Cómo vas a pagar?</h2>
                            <div className="payment-options">
                                <button
                                    className={`payment-button ${pagoSeleccionado === "Tarjeta de debito" ? "selected" : ""}`}
                                    onClick={() => {
                                        setPagoSeleccionado("Tarjeta de debito");
                                        setStep(2);
                                    }}
                                    >
                                    Tarjeta de debito
                                </button>
                                <button
                                    className={`payment-button ${pagoSeleccionado === "Tarjeta de crédito" ? "selected" : ""}`}
                                    onClick={() => {
                                        setPagoSeleccionado("Tarjeta de crédito");
                                        setStep(2);
                                    }}
                                    >
                                    Tarjeta de crédito
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="billing">
                            <h2>Facturación</h2>
                            <label>Tipo de factura</label>
                            <select name="tipoFactura" value={form.tipoFactura} onChange={handleChange}>
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
                                <button onClick={oppositeStep}>Atras</button>
                                <button onClick={nextStep}>Continuar</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="personal-data">
                            <h3>Datos Acompañantes</h3>
                            <label>¿Cuántas personas te acompañarán?</label>
                            <input
                                type="number"
                                name="acompanantes"
                                value={form.acompanantes}
                                onChange={(e) => setForm({ ...form, acompanantes: parseInt(e.target.value) })}
                                placeholder="Número de acompañantes"
                                required
                            />
                            {form.acompanantes > 0 && (() => {
                                const itemsPerPage = 5;
                                const currentPage = Math.floor(form.currentAcompanante / itemsPerPage);
                                const totalPages = Math.ceil(form.acompanantes / itemsPerPage);
                                const startIndex = currentPage * itemsPerPage;
                                const endIndex = Math.min(startIndex + itemsPerPage, form.acompanantes);
                                return (
                                    <div className="acompanante-pagination">
                                    <button
                                        className="arrow-button"
                                        disabled={currentPage === 0}
                                        onClick={() =>
                                        setForm(prev => ({ ...prev, currentAcompanante: (currentPage - 1) * itemsPerPage }))
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
                                            className={`number ${form.currentAcompanante === index ? "active" : ""}`}
                                            onClick={() =>
                                                setForm(prev => ({ ...prev, currentAcompanante: index }))
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
                                        setForm(prev => ({ ...prev, currentAcompanante: (currentPage + 1) * itemsPerPage }))
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
                                        value={form.acompanantesData[form.currentAcompanante]?.nombre || ""}
                                        onChange={(e) => handleAcompananteChange(form.currentAcompanante, 'nombre', e.target.value)}
                                        placeholder="Nombre"
                                        required
                                    />
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name={`acompanante_email_${form.currentAcompanante}`}
                                        value={form.acompanantesData[form.currentAcompanante]?.email || ""}
                                        onChange={(e) => handleAcompananteChange(form.currentAcompanante, 'email', e.target.value)}
                                        placeholder="Email"
                                        required
                                    />
                                    <label>Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        name={`acompanante_fechaNacimiento_${form.currentAcompanante}`}
                                        value={form.acompanantesData[form.currentAcompanante]?.fechaNacimiento || ""}
                                        onChange={(e) => handleAcompananteChange(form.currentAcompanante, 'fechaNacimiento', e.target.value)}
                                        required
                                    />
                                    <label>DNI</label>
                                    <input
                                        type="text"
                                        name={`acompanante_dni_${form.currentAcompanante}`}
                                        value={form.acompanantesData[form.currentAcompanante]?.dni || ""}
                                        onChange={(e) => handleAcompananteChange(form.currentAcompanante, 'dni', e.target.value)}
                                        placeholder="DNI"
                                        required
                                    />
                                </div>
                            )}
                            {error && <p className="error-message">{error}</p>}
                            <div className="botones-reserva">
                                <button onClick={oppositeStep}>Atras</button>
                                <button onClick={nextStep}>Continuar</button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="card-details">
                            <Tarjeta/>
                            <div className="botones-reserva">
                                <button onClick={oppositeStep}>Atras</button>
                                <button onClick={nextStep}>Continuar</button>
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="summary">
                            <h3>Detalle de tu compra</h3>
                            <p><strong>{paquete.nombre}</strong></p>
                            <p>{new Date(paquete.fecha_ini).toLocaleDateString()} - {new Date(paquete.fecha_fin).toLocaleDateString()}</p>
                            <p>{paquete.duracion} días | {paquete.cantidad_personas} adultos</p>
                            <p>Ciudad: {paquete.ciudad}</p>
                            <h3>Precio desde</h3>
                            <p className="price">${paquete.precio}</p>
                            {error && <p className="error-message">{error}</p>}
                            <div className="botones-reserva">
                                <button onClick={oppositeStep}>Atras</button>
                                <button onClick={nextStep}>Continuar</button>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default ReservarPaquete;
