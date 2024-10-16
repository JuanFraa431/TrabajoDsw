import React from "react";
import "../styles/Header.css";
import userIcon from "../images/user-icon.png";
import logo from "../images/logoFinal2.png";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { handleLinkClick } from "../services/searchService";

const Header = () => {
    
    const location = useLocation();
    const cliente = location.state?.cliente;

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
                        <a href="#transporse">Transporte</a>
                    </li>
                    <li>
                        <a href="#nosotros">Nosotros</a>
                    </li>
                </ul>
            </nav>
            <div className="user">
                <img src={userIcon} alt="User Icon" className="user-icon" />
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
