import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import userIcon from "../images/user-icon.png";
import logo from "../images/logoFinal2.png";
import { handleLinkClick } from "../services/searchService";
import { Cliente } from "../interface/cliente.js";
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Header = () => {
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCliente = localStorage.getItem('user');
        if (storedCliente) {
            setCliente(JSON.parse(storedCliente));
        }
    }, []);

    return (
        <header className="header">
            <div className="logo">
                <Link to="/"><img src={logo} alt="Logo" /></Link>
            </div>

            <nav className="nav d-none d-lg-flex justify-content-center align-items-center">
                <ul>
                    <li><Link to="/hoteles">Hoteles</Link></li>
                    <li>
                        <Link to="/paquetes" onClick={(event) => handleLinkClick(event, 'paquete/user', 'paquetes', navigate)}>Paquetes</Link>
                    </li>
                    <li>
                        <Link to="/excursiones" onClick={(event) => handleLinkClick(event, 'excursion', 'excursiones', navigate)}>Excursiones</Link>
                    </li>
                    <li><Link to="/transportes">Transportes</Link></li>
                    <li><Link to="/nosotros">Nosotros</Link></li>
                </ul>
            </nav>

            <div className="user d-none d-lg-flex align-items-center ms-3">
                <img 
                    src={cliente && cliente.imagen ? cliente.imagen : userIcon} 
                    alt="User Icon" 
                    className="user-icon-chico" 
                />
                {cliente ? (
                    <a
                        href="/detalleCliente"
                        onClick={(event) => {
                            event.preventDefault();
                            navigate('/detalleCliente', { state: { cliente } });
                        }}
                    >
                        {cliente.nombre && cliente.apellido ? (
                            `${cliente.nombre} ${cliente.apellido}`
                        ) : (
                            cliente.username
                        )}
                    </a>
                ) : (
                    <Link to="/login" className="boton-inicia_sesion">Iniciar Sesión</Link>
                )}
            </div>

            {/* <nav className="navbar navbar-expand-lg d-lg-none">
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menú</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav">
                            <li className="nav-item"><Link className="nav-link" to="/hoteles">Hoteles</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/paquetes" onClick={(event) => handleLinkClick(event, 'paquete/user', 'paquetes', navigate)}>Paquetes</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/excursiones" onClick={(event) => handleLinkClick(event, 'excursion', 'excursiones', navigate)}>Excursiones</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/transportes">Transportes</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/nosotros">Nosotros</Link></li>
                        </ul>
                        <div className="user-offcanvas mt-3">
                            <img src={cliente ? cliente.imagen : userIcon} alt="User Icon" className="user-icon" />
                            {cliente ? (
                                <a
                                    href="/detalleCliente"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        navigate('/detalleCliente', { state: { cliente } });
                                    }}
                                >
                                    {cliente.nombre} {cliente.apellido}
                                </a>
                            ) : (
                                <Link to="/login" className="boton-inicia_sesion">Iniciar Sesión</Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav> */}
        </header>
    );
};

export default Header;