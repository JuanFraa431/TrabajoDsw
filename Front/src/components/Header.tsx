import React from "react";
import { useState, useEffect } from 'react';
import "../styles/Header.css";
import userIcon from "../images/user-icon.png";
import logo from "../images/logoFinal2.png";
import { Link, useNavigate } from "react-router-dom";
import { handleLinkClick } from "../services/searchService";
import { Cliente } from "../interface/cliente.js";

const Header = () => {
    
    const [cliente, setCliente] = useState<Cliente | null>(null);

    useEffect(() => {
        const storedCliente = localStorage.getItem('user');
        if (storedCliente) {
            setCliente(JSON.parse(storedCliente));
        }
    }, []);

    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="logo">
                <Link to="/" ><img src={logo} alt="Logo"/></Link>
            </div>
            <nav className="nav">
                <ul>
                    <li>
                        <Link to="/hoteles" >Hoteles</Link>
                    </li>
                    <li>
                        <Link to="/paquetes" onClick={(event) => handleLinkClick(event, 'paquete', 'paquetes', navigate)}>Paquetes</Link>
                    </li>
                    <li>
                        <Link to="/excursiones" onClick={(event) => handleLinkClick(event, 'excursion', 'excursiones', navigate)}>Excursiones</Link>
                    </li>
                    <li>
                        <Link to="/transportes">Transportes</Link>
                    </li>
                    <li>
                        <Link to="/nosotros">Nosotros</Link>    
                    </li>
                </ul>
            </nav>
            <div className="user">
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
                    <a href="/login">Iniciar Sesión</a>
                )}
            </div>
        </header>
    );
};

export default Header;
